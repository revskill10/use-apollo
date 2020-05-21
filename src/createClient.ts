// tslint:disable:react-hooks-nesting
import { ApolloClient } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { CachePersistor } from "apollo-cache-persist";

const wsLink = (wsUrl: UrlConfig, headers: any) => {
  return new WebSocketLink({
    uri: wsUrl.secure ? `wss://${wsUrl.uri}` : `ws://${wsUrl.uri}`,
    options: {
      reconnect: true,
      timeout: 30000,
      lazy: true,
      connectionParams: {
        headers
      }
    }
  });
};

const createClient = (
  url: UrlConfig,
  defaults = {},
  links: any[] = [],
  isServer = true,
  caches: any,
  headers: any = {},
  cacheKey: string
): ApolloClient<{}> => {
  let cache = null;
  if (!isServer) {
    if (!caches[cacheKey]) {
      const apolloState = (window as any).__APOLLO_STATE__[cacheKey];
      caches[cacheKey] = new InMemoryCache().restore(apolloState);
    }
  } else {
    if (!caches[cacheKey]) {
      caches[cacheKey] = new InMemoryCache();
    }
  }

  cache = caches[cacheKey];

  if (!isServer) {
    const persistor = new CachePersistor({
      cache,
      storage: window.localStorage as any,
      maxSize: 1048576,
    });
    persistor.purge(); 
  }

  const stateLink = withClientState({
    cache,
    resolvers: {},
    defaults
  });

  const httpLink = createHttpLink({
    uri: url.secure ? `https://${url.uri}` : `http://${url.uri}`,
    headers
  });

  const finalLink = isServer ? httpLink : wsLink(url, headers);
  /*
  split(
    // split based on operation type
    ({ query }: any) => {
      const { kind, operation }: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink(uri, headers),
    httpLink,
  );
  */

  return new ApolloClient({
    connectToDevTools: false,
    ssrMode: true,
    link: (ApolloLink.from([stateLink, ...links, finalLink]) as any),
    cache
  });
};

export default createClient


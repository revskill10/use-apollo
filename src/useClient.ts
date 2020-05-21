import { useContext } from 'react';
import createClient from './createClient';
import ClientsContext from './ClientsContext';
const useClient = ({ url, headers, isServer = false }: UseClientProps) => {
  const clients: any = useContext(ClientsContext);
  const uri = url.uri;
  if (clients[uri]) {
    return clients[uri];
  } else {
    const defaultState = {};
    clients[uri] = createClient(
      url,
      defaultState,
      [],
      isServer,
      caches,
      headers,
      uri
    );
    return clients[uri];
  }
};

export default useClient;

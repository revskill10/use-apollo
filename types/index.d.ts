declare var __DEV__: boolean;
interface UrlConfig {
  uri: string;
  secure: boolean;
}
interface UseClientProps {
  url: UrlConfig;
  headers: any;
  isServer?: boolean;
}
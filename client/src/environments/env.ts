const ENV = import.meta.env;

export const appConfig = {
  BASE_URL: ENV.VITE_BASE_URL,
  SOCKET_URL: ENV.VITE_SOCKET_URL,
  PEER_HOST: ENV.VITE_PEER_HOST,
  PEER_PORT: ENV.VITE_PEER_PORT,
};

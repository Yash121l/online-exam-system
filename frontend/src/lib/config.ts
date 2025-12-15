export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001/proctoring'
};

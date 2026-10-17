// Default environment — used as-is by `ng serve` (development config) and swapped out by
// fileReplacements for other build/serve configurations (see angular.json).
// Root-relative so routed pages (e.g. /project/:id) resolve correctly, not just the app root.
// proxy.conf.json forwards these to the local backend (npm start in nest-api).
export const environment = {
  apiUrl: '/api',
  wsUrl: '/ws',
};

// Used to serve the frontend locally against the deployed backend (no dev proxy involved —
// these are absolute URLs hit directly), and also as the production build's environment via
// the "production" fileReplacement in angular.json, since the real deployed static site needs
// this exact same backend.
// TODO: replace with the actual Render service URL once confirmed.
export const environment = {
  apiUrl: 'https://dashboard-editor-api.onrender.com/api',
  wsUrl: 'wss://dashboard-editor-api.onrender.com/ws',
};

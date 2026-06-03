// clientAuth.js — Client portal token utilities

export function generateClientToken() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Build the shareable client portal URL.
 * Format: /c/{clientId}/{clientToken}
 */
export function buildClientUrl(clientId, clientToken) {
  const base = window.location.origin;
  return `${base}/c/${clientId}/${clientToken}`;
}

/**
 * Parse client portal params from current URL.
 * Returns { isClientMode, clientId, token } or { isClientMode: false }.
 */
export function parseClientRoute() {
  const match = window.location.pathname.match(/^\/c\/([^/?]+)\/([^/?]+)/);
  if (!match) return { isClientMode: false, clientId: null, token: null };
  return { isClientMode: true, clientId: match[1], token: match[2] };
}

/**
 * Validate URL token against client's stored clientToken.
 */
export function validateClientToken(client, urlToken) {
  if (!client || !urlToken) return false;
  return client.clientToken === urlToken;
}

/**
 * Ensure a client/project has a clientToken; generates one if missing.
 */
export function ensureClientToken(obj) {
  if (obj.clientToken) return obj;
  return { ...obj, clientToken: generateClientToken() };
}

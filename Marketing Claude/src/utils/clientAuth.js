// clientAuth.js — Client portal token utilities

/**
 * Generate a random client access token (UUID v4-style).
 * Stored per-project in project.clientToken.
 */
export function generateClientToken() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Build the shareable client portal URL for a project.
 * Format: /c/{projectId}/{clientToken}
 */
export function buildClientUrl(projectId, clientToken) {
  const base = window.location.origin;
  return `${base}/c/${projectId}/${clientToken}`;
}

/**
 * Parse client portal params from current URL.
 * Returns { isClientMode, projectId, token } or { isClientMode: false }.
 */
export function parseClientRoute() {
  const match = window.location.pathname.match(/^\/c\/([^/]+)\/([^/]+)/);
  if (!match) return { isClientMode: false, projectId: null, token: null };
  return { isClientMode: true, projectId: match[1], token: match[2] };
}

/**
 * Validate that the URL token matches the project's stored clientToken.
 * Returns true if valid.
 */
export function validateClientToken(project, urlToken) {
  if (!project || !urlToken) return false;
  return project.clientToken === urlToken;
}

/**
 * Ensure a project has a clientToken; generates one if missing.
 * Returns the (possibly updated) project object.
 */
export function ensureClientToken(project) {
  if (project.clientToken) return project;
  return { ...project, clientToken: generateClientToken() };
}

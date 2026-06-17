/**
 * storageService.js — NMS Storage with Dropbox Cloud Sync
 *
 * Storage priority:
 *   LOAD:  Dropbox (cloud, any device) → localStorage (cache/offline)
 *   SAVE:  localStorage (immediate, no delay) + Dropbox (debounced 2s)
 *
 * This means all admin changes sync across every device in real time.
 */

import { migrateWorkspaceData } from "../modules/editorial/editorialModel.js";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const WORKSPACE_STORAGE_KEY   = "nms-v1";
export const WORKSPACE_BACKUP_KEY    = "nms-v1-backup";
export const META_STORAGE_KEY        = "nms_meta";
export const CURRENT_SCHEMA_VERSION  = 2;
export const MAX_VERSIONS_PER_SECTION = 5;

const WARN_SIZE_BYTES = 3.5 * 1024 * 1024;
const MAX_SIZE_BYTES  = 4.8 * 1024 * 1024;

// Dropbox
const DROPBOX_FILE_PATH   = "/nassa-marketing-workspace.json";
const DROPBOX_UPLOAD_URL  = "https://content.dropboxapi.com/2/files/upload";
const DROPBOX_DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const TOKEN_API           = "/api/dropbox-token";

// ─── DROPBOX CONFIG & TOKEN MANAGEMENT ────────────────────────────────────────

export function getDropboxSyncConfig() {
  try {
    const v = localStorage.getItem("nms-dropbox-sync-config");
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

export function saveDropboxSyncConfig(config) {
  try {
    if (config) {
      localStorage.setItem("nms-dropbox-sync-config", JSON.stringify(config));
    } else {
      localStorage.removeItem("nms-dropbox-sync-config");
    }
  } catch {}
}

async function refreshUserDropboxToken(refreshToken) {
  try {
    const r = await fetch("/api/dropbox-refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d; // { access_token, expires_in }
  } catch { return null; }
}

let _dbxToken    = null;
let _dbxTokenExp = 0;

async function getDropboxToken() {
  // 1. Prioritize user-authorized Dropbox sync if active
  const config = getDropboxSyncConfig();
  if (config && config.active && config.refreshToken) {
    if (!config.accessToken || Date.now() > (config.expiresAt || 0) - 120_000) {
      console.log("[storageService] User Dropbox token expired/expiring, refreshing...");
      const refreshed = await refreshUserDropboxToken(config.refreshToken);
      if (refreshed && refreshed.access_token) {
        config.accessToken = refreshed.access_token;
        config.expiresAt = Date.now() + (refreshed.expires_in || 14400) * 1000;
        saveDropboxSyncConfig(config);
        console.log("[storageService] User Dropbox token refreshed successfully");
      } else {
        console.warn("[storageService] User Dropbox token refresh failed");
      }
    }
    return config.accessToken || null;
  }

  // 2. Fallback to global admin/agency token (if configured)
  if (_dbxToken && Date.now() < _dbxTokenExp) return _dbxToken;
  try {
    const r = await fetch(TOKEN_API);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.token) return null;
    _dbxToken    = d.token;
    _dbxTokenExp = Date.now() + 55 * 60 * 1000; // 55 min
    return _dbxToken;
  } catch { return null; }
}

// ─── DROPBOX I/O ──────────────────────────────────────────────────────────────

async function dropboxLoad() {
  const token = await getDropboxToken();
  if (!token) return null;
  try {
    const r = await fetch(DROPBOX_DOWNLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({ path: DROPBOX_FILE_PATH }),
      },
    });
    if (r.status === 409) return null; // file not found yet — first run
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function dropboxSave(data) {
  const token = await getDropboxToken();
  if (!token) return false;
  try {
    const r = await fetch(DROPBOX_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": JSON.stringify({
          path: DROPBOX_FILE_PATH,
          mode: "overwrite",
          autorename: false,
          mute: true,
        }),
      },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch { return false; }
}

// ─── DEBOUNCED & MANUAL DROPBOX SYNC ──────────────────────────────────────────

let _dbxTimer = null;
let _dbxListener = null;

export function registerDropboxSyncListener(fn) {
  _dbxListener = fn;
}

function updateSyncStatus(status, error = null) {
  if (_dbxListener) _dbxListener(status, error);
}

function scheduledDropboxSave(data) {
  const config = getDropboxSyncConfig();
  if (!config || !config.active) return; // Only run if user sync is active

  updateSyncStatus("syncing");
  if (_dbxTimer) clearTimeout(_dbxTimer);
  _dbxTimer = setTimeout(async () => {
    try {
      const ok = await dropboxSave(data);
      if (!ok) {
        console.warn("[storageService] Dropbox sync failed — data is safe in localStorage");
        updateSyncStatus("error", "Salvataggio automatico su Dropbox fallito.");
      } else {
        console.log("[storageService] Dropbox sync OK");
        updateSyncStatus("synced");
      }
    } catch (e) {
      updateSyncStatus("error", e.message || "Errore di sincronizzazione Dropbox.");
    } finally {
      _dbxTimer = null;
    }
  }, 2000);
}

export async function forceDropboxSave(data) {
  updateSyncStatus("syncing");
  try {
    const ok = await dropboxSave(data);
    if (ok) {
      updateSyncStatus("synced");
      return { ok: true };
    } else {
      updateSyncStatus("error", "Invio database fallito.");
      return { ok: false, error: "Dropbox ha rifiutato il caricamento." };
    }
  } catch (e) {
    updateSyncStatus("error", e.message);
    return { ok: false, error: e.message };
  }
}

export async function forceDropboxLoad() {
  updateSyncStatus("syncing");
  try {
    const cloudData = await dropboxLoad();
    if (cloudData) {
      updateSyncStatus("synced");
      return { ok: true, data: cloudData };
    } else {
      updateSyncStatus("error", "Download database fallito.");
      return { ok: false, error: "Impossibile scaricare il file. Verifica che esista." };
    }
  } catch (e) {
    updateSyncStatus("error", e.message);
    return { ok: false, error: e.message };
  }
}

// ─── LOCAL STORAGE BACKEND ───────────────────────────────────────────────────

export function getStorageBackend() {
  if (typeof window === "undefined") {
    return { available: false, reason: "SSR — window non disponibile" };
  }
  if (window.storage?.get && window.storage?.set) {
    return {
      available: true, type: "window.storage",
      async get(k)    { return window.storage.get(k); },
      async set(k, v) { return window.storage.set(k, v); },
      async del(k)    { return window.storage.delete(k); },
    };
  }
  if (window.localStorage) {
    return {
      available: true, type: "localStorage",
      async get(k)    { const v = localStorage.getItem(k); return v !== null ? { value: v } : null; },
      async set(k, v) { localStorage.setItem(k, v); return { key: k, value: v }; },
      async del(k)    { localStorage.removeItem(k); return { key: k, deleted: true }; },
    };
  }
  return { available: false, reason: "Nessun backend storage accessibile" };
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

export function serializeStorageError(error) {
  if (!error) return "Errore storage sconosciuto";
  if (typeof error === "string") return error;
  const msg = error.message || String(error);
  if (error.name === "QuotaExceededError" || msg.toLowerCase().includes("quota") || error.code === 22)
    return "Spazio storage esaurito. Elimina alcuni progetti non più necessari o esporta i dati.";
  return msg;
}

export function checkPayloadSize(serialized) {
  const bytes = new Blob([serialized]).size;
  if (bytes > MAX_SIZE_BYTES) return { ok: false, warning: false, bytes, error: `Workspace troppo grande (${(bytes/1024/1024).toFixed(1)} MB). Elimina versioni precedenti.` };
  if (bytes > WARN_SIZE_BYTES) return { ok: true, warning: true, bytes, error: null, warningMsg: `Workspace grande (${(bytes/1024/1024).toFixed(1)} MB su 4.8 MB max).` };
  return { ok: true, warning: false, bytes, error: null };
}

function safeJsonParse(str, ctx = "") {
  try { return JSON.parse(str); }
  catch (e) { console.error(`[storageService] JSON corrotto${ctx ? " in " + ctx : ""}:`, e.message); return null; }
}

async function withRetry(fn, attempts = 2, delayMs = 200) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (e) { last = e; if (i < attempts - 1) await new Promise(r => setTimeout(r, delayMs * (i + 1))); }
  }
  throw last;
}

async function writeBackup(storage, raw) {
  try { await storage.set(WORKSPACE_BACKUP_KEY, JSON.stringify({ ts: Date.now(), raw })); } catch (_) {}
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Load workspace.
 * Tries Dropbox first (cloud, any device). Falls back to localStorage.
 * Caches Dropbox result to localStorage so next load is instant.
 */
export async function safeLoadWorkspace(key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();

  // 1. Try Dropbox (primary — cross-device)
  const cloudData = await dropboxLoad();
  if (cloudData) {
    const migrated = migrateWorkspaceData(cloudData);
    // Cache to localStorage for offline/fast access
    try {
      if (storage.available) await storage.set(key, JSON.stringify(migrated));
    } catch (_) {}
    return { ok: true, data: migrated, error: null, sizeWarning: null, source: "dropbox" };
  }

  // 2. Fall back to localStorage (offline or first run)
  if (!storage.available) return { ok: false, data: null, error: storage.reason, sizeWarning: null };

  try {
    const r = await withRetry(() => storage.get(key));
    if (!r?.value) return { ok: true, data: null, error: null, sizeWarning: null, source: "empty" };

    const raw = safeJsonParse(r.value, key);
    if (raw === null) {
      await writeBackup(storage, r.value);
      return { ok: false, data: null, error: "Dati workspace corrotti. Backup salvato.", sizeWarning: null };
    }

    const fileVersion = Number(raw.schemaVersion || 1);
    if (fileVersion > CURRENT_SCHEMA_VERSION)
      console.warn(`[storageService] Schema v${fileVersion} > app v${CURRENT_SCHEMA_VERSION}.`);

    const migrated = migrateWorkspaceData(raw);
    return { ok: true, data: migrated, error: null, sizeWarning: null, source: "localStorage" };
  } catch (error) {
    return { ok: false, data: null, error: serializeStorageError(error), sizeWarning: null };
  }
}

/**
 * Save workspace.
 * Writes to localStorage immediately (no delay for UX).
 * Debounces Dropbox upload 2s after last write (syncs to cloud).
 */
export async function safeSaveWorkspace(data, key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();

  try {
    const migrated   = migrateWorkspaceData(data);
    const serialized = JSON.stringify(migrated);
    const sizeCheck  = checkPayloadSize(serialized);

    if (!sizeCheck.ok) return { ok: false, data: migrated, error: sizeCheck.error, savedAt: null, sizeWarning: null };

    // Save to localStorage immediately
    if (storage.available) await withRetry(() => storage.set(key, serialized));

    // Schedule Dropbox sync (debounced 2s)
    scheduledDropboxSave(migrated);

    return {
      ok: true, data: migrated, error: null,
      savedAt: Date.now(),
      sizeWarning: sizeCheck.warning ? sizeCheck.warningMsg : null,
    };
  } catch (error) {
    return { ok: false, data, error: serializeStorageError(error), savedAt: null, sizeWarning: null };
  }
}

export async function loadWorkspaceData(key = WORKSPACE_STORAGE_KEY) {
  return (await safeLoadWorkspace(key)).data;
}

export async function saveWorkspaceData(data, key = WORKSPACE_STORAGE_KEY) {
  return safeSaveWorkspace(data, key);
}

export async function clearWorkspace(key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();
  if (!storage.available) return { ok: false };
  try { await storage.del(key); return { ok: true }; }
  catch (e) { return { ok: false, error: serializeStorageError(e) }; }
}

export async function syncDropboxOnConnect(currentLocalData) {
  const token = await getDropboxToken();
  if (!token) return { status: "error", error: "Token non valido o non disponibile." };

  try {
    const r = await fetch(DROPBOX_DOWNLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({ path: DROPBOX_FILE_PATH }),
      },
    });

    if (r.status === 409) {
      // File not found yet - first run. Initialize Dropbox with local data.
      const ok = await dropboxSave(currentLocalData);
      if (ok) return { status: "initialized" };
      return { status: "error", error: "Impossibile creare il file del database su Dropbox." };
    }

    if (!r.ok) {
      return { status: "error", error: `Errore durante il recupero da Dropbox: ${r.statusText}` };
    }

    const cloudData = await r.json();
    return { status: "loaded", data: cloudData };
  } catch (e) {
    return { status: "error", error: e.message || "Errore di connessione a Dropbox." };
  }
}

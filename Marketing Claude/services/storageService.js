import { migrateWorkspaceData } from "../modules/editorial/editorialModel";

export const WORKSPACE_STORAGE_KEY = "nms-v1";

export function serializeStorageError(error) {
  if (!error) return "Errore storage sconosciuto";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

export function getStorageBackend() {
  if (typeof window !== "undefined" && window.storage?.get && window.storage?.set) {
    return window.storage;
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return {
      async get(key) {
        const value = window.localStorage.getItem(key);
        return value ? { value } : null;
      },
      async set(key, value) {
        window.localStorage.setItem(key, value);
      },
    };
  }

  throw new Error("Storage non disponibile in questo ambiente");
}

export async function safeLoadWorkspace(key = WORKSPACE_STORAGE_KEY) {
  try {
    const storage = getStorageBackend();
    const r = await storage.get(key);
    if (!r?.value) return { ok: true, data: null, error: null };
    return { ok: true, data: migrateWorkspaceData(JSON.parse(r.value)), error: null };
  } catch (error) {
    console.error("Workspace load error", error);
    return { ok: false, data: null, error: serializeStorageError(error) };
  }
}

export async function safeSaveWorkspace(data, key = WORKSPACE_STORAGE_KEY) {
  try {
    const storage = getStorageBackend();
    const migrated = migrateWorkspaceData(data);
    await storage.set(key, JSON.stringify(migrated));
    return { ok: true, data: migrated, error: null, savedAt: Date.now() };
  } catch (error) {
    console.error("Workspace save error", error);
    return { ok: false, data, error: serializeStorageError(error), savedAt: null };
  }
}

export async function loadWorkspaceData(key = WORKSPACE_STORAGE_KEY) {
  return (await safeLoadWorkspace(key)).data;
}

export async function saveWorkspaceData(data, key = WORKSPACE_STORAGE_KEY) {
  return safeSaveWorkspace(data, key);
}

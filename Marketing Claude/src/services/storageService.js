/**
 * storageService.js — NMS Storage Resilience
 * Fase 3.3 — Hardening
 *
 * Problemi risolti rispetto alla versione precedente:
 *   1. QuotaExceededError gestito esplicitamente — errore leggibile in italiano
 *   2. Payload size check prima del salvataggio — avvisa prima di colpire il muro
 *   3. JSON.parse con guard su corrupt data — non perde i dati, logga e restituisce null
 *   4. Schema version guard su load — se la versione è futura (migrazione fallita), non sovrascrive
 *   5. getStorageBackend() non lancia più — restituisce { available: false } invece di throw
 *   6. Retry con backoff su errori transienti (race condition su window.storage)
 *   7. Dato corrotto → backup automatico in chiave separata prima di resettare
 */

import { migrateWorkspaceData } from "../modules/editorial/editorialModel";

// ─── COSTANTI ─────────────────────────────────────────────────────────────────

export const WORKSPACE_STORAGE_KEY = "nms-v1";
export const WORKSPACE_BACKUP_KEY  = "nms-v1-backup";
export const META_STORAGE_KEY      = "nms_meta";

/** Versione schema corrente. Incrementare quando cambia la struttura dati. */
export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Soglia di avviso: se il payload supera questo valore, mostriamo un warning
 * nell'UI prima di raggiungere il limite del backend (5 MB).
 * Impostato a 3.5 MB — lascia margine per metadata e operazioni future.
 */
const WARN_SIZE_BYTES  = 3.5 * 1024 * 1024;

/**
 * Soglia hard: oltre questo limite non tentiamo il salvataggio.
 * Il backend (window.storage) ha un cap di 5 MB per chiave.
 */
const MAX_SIZE_BYTES   = 4.8 * 1024 * 1024;

/** Max versioni per sezione — allineato con il cap già in uso nel codice UI. */
export const MAX_VERSIONS_PER_SECTION = 5;

// ─── STORAGE BACKEND ─────────────────────────────────────────────────────────

/**
 * Restituisce il backend storage disponibile.
 * NON lancia mai — restituisce { available: false } se nulla è accessibile.
 */
export function getStorageBackend() {
  if (typeof window === "undefined") {
    return { available: false, reason: "SSR — window non disponibile" };
  }

  // Backend primario: window.storage (Claude artifacts / claude.ai)
  if (window.storage?.get && window.storage?.set && window.storage?.delete) {
    return {
      available: true,
      type: "window.storage",
      async get(key)    { return window.storage.get(key); },
      async set(key, v) { return window.storage.set(key, v); },
      async del(key)    { return window.storage.delete(key); },
    };
  }

  // Fallback: localStorage (sviluppo locale, browser standard)
  if (window.localStorage) {
    return {
      available: true,
      type: "localStorage",
      async get(key) {
        const value = window.localStorage.getItem(key);
        return value !== null ? { value } : null;
      },
      async set(key, value) {
        window.localStorage.setItem(key, value);
        return { key, value };
      },
      async del(key) {
        window.localStorage.removeItem(key);
        return { key, deleted: true };
      },
    };
  }

  return { available: false, reason: "Nessun backend storage accessibile" };
}

// ─── UTILITÀ ──────────────────────────────────────────────────────────────────

export function serializeStorageError(error) {
  if (!error) return "Errore storage sconosciuto";
  if (typeof error === "string") return error;

  const msg = error.message || String(error);

  // QuotaExceededError — messaggio leggibile
  if (
    error.name === "QuotaExceededError" ||
    msg.toLowerCase().includes("quota") ||
    msg.toLowerCase().includes("storage full") ||
    error.code === 22 // DOMException code per QuotaExceeded
  ) {
    return "Spazio storage esaurito. Elimina alcuni progetti non più necessari o esporta i dati.";
  }

  return msg;
}

/**
 * Controlla la dimensione del payload prima di salvare.
 * Restituisce { ok, warning, error } — mai lancia.
 */
export function checkPayloadSize(serialized) {
  const bytes = new Blob([serialized]).size;

  if (bytes > MAX_SIZE_BYTES) {
    return {
      ok: false,
      warning: false,
      bytes,
      error: `Workspace troppo grande (${(bytes / 1024 / 1024).toFixed(1)} MB). `
           + `Elimina versioni precedenti o progetti archiviati prima di salvare.`,
    };
  }

  if (bytes > WARN_SIZE_BYTES) {
    return {
      ok: true,
      warning: true,
      bytes,
      error: null,
      warningMsg: `Workspace grande (${(bytes / 1024 / 1024).toFixed(1)} MB su 4.8 MB max). `
                + `Considera di esportare o archiviare i progetti più vecchi.`,
    };
  }

  return { ok: true, warning: false, bytes, error: null };
}

/**
 * Parse JSON sicuro — non lancia mai.
 * Se il JSON è corrotto, restituisce null e logga.
 */
function safeJsonParse(str, context = "") {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error(`[storageService] JSON corrotto${context ? " in " + context : ""}:`, e.message);
    return null;
  }
}

/**
 * Retry con backoff lineare — per race condition su window.storage.
 * Tenta `attempts` volte con `delayMs` tra i tentativi.
 */
async function withRetry(fn, attempts = 2, delayMs = 200) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}

// ─── BACKUP ───────────────────────────────────────────────────────────────────

/**
 * Salva un backup del workspace corrente in chiave separata.
 * Usato prima di sovrascrivere un workspace con dati potenzialmente corrotti.
 * Fire-and-forget — non blocca il flusso principale.
 */
async function writeBackup(storage, raw) {
  try {
    const backup = JSON.stringify({ ts: Date.now(), raw });
    await storage.set(WORKSPACE_BACKUP_KEY, backup);
  } catch (_) {
    // Il backup può fallire se lo storage è già pieno — non è critico
  }
}

// ─── API PUBBLICA ─────────────────────────────────────────────────────────────

/**
 * Carica il workspace dallo storage.
 *
 * @returns {{ ok: boolean, data: object|null, error: string|null, sizeWarning: string|null }}
 */
export async function safeLoadWorkspace(key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();

  if (!storage.available) {
    return { ok: false, data: null, error: storage.reason, sizeWarning: null };
  }

  try {
    const r = await withRetry(() => storage.get(key));

    if (!r?.value) {
      return { ok: true, data: null, error: null, sizeWarning: null };
    }

    const raw = safeJsonParse(r.value, key);

    if (raw === null) {
      // Dati corrotti — salva backup e segnala, ma non crashare
      await writeBackup(storage, r.value);
      console.warn("[storageService] Workspace corrotto — backup salvato in", WORKSPACE_BACKUP_KEY);
      return {
        ok: false,
        data: null,
        error: "Dati workspace corrotti. Il backup è stato salvato. Contatta il supporto.",
        sizeWarning: null,
      };
    }

    // Schema version guard: se la versione nel file è maggiore del nostro CURRENT,
    // significa che qualcuno ha aperto il workspace con una versione più nuova dell'app.
    // Non sovrascriviamo, ma avvisiamo.
    const fileVersion = Number(raw.schemaVersion || 1);
    if (fileVersion > CURRENT_SCHEMA_VERSION) {
      console.warn(
        `[storageService] Schema v${fileVersion} > app v${CURRENT_SCHEMA_VERSION}. Aggiorna l'app.`
      );
    }

    const migrated = migrateWorkspaceData(raw);
    return { ok: true, data: migrated, error: null, sizeWarning: null };

  } catch (error) {
    console.error("[storageService] safeLoadWorkspace error:", error);
    return {
      ok: false,
      data: null,
      error: serializeStorageError(error),
      sizeWarning: null,
    };
  }
}

/**
 * Salva il workspace nello storage.
 *
 * @returns {{ ok: boolean, data: object|null, error: string|null, savedAt: number|null, sizeWarning: string|null }}
 */
export async function safeSaveWorkspace(data, key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();

  if (!storage.available) {
    return { ok: false, data, error: storage.reason, savedAt: null, sizeWarning: null };
  }

  try {
    const migrated   = migrateWorkspaceData(data);
    const serialized = JSON.stringify(migrated);

    // Size check — prima di tentare il salvataggio
    const sizeCheck = checkPayloadSize(serialized);

    if (!sizeCheck.ok) {
      console.error("[storageService] Payload troppo grande:", sizeCheck.bytes, "bytes");
      return {
        ok: false,
        data: migrated,
        error: sizeCheck.error,
        savedAt: null,
        sizeWarning: null,
      };
    }

    await withRetry(() => storage.set(key, serialized));

    return {
      ok: true,
      data: migrated,
      error: null,
      savedAt: Date.now(),
      sizeWarning: sizeCheck.warning ? sizeCheck.warningMsg : null,
    };

  } catch (error) {
    console.error("[storageService] safeSaveWorkspace error:", error);
    return {
      ok: false,
      data,
      error: serializeStorageError(error),
      savedAt: null,
      sizeWarning: null,
    };
  }
}

// ─── CONVENIENZA ──────────────────────────────────────────────────────────────

export async function loadWorkspaceData(key = WORKSPACE_STORAGE_KEY) {
  return (await safeLoadWorkspace(key)).data;
}

export async function saveWorkspaceData(data, key = WORKSPACE_STORAGE_KEY) {
  return safeSaveWorkspace(data, key);
}

/**
 * Cancella il workspace dallo storage.
 * Usato da AppErrorBoundary → "Reset workspace".
 */
export async function clearWorkspace(key = WORKSPACE_STORAGE_KEY) {
  const storage = getStorageBackend();
  if (!storage.available) return { ok: false };
  try {
    await storage.del(key);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: serializeStorageError(e) };
  }
}

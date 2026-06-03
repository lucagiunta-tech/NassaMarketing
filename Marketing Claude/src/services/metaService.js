/**
 * metaService.js — NMS Meta OAuth & Publishing
 * Fase 3.5 — Hardening
 *
 * Fix rispetto alla versione precedente:
 *   1. Classificazione errori Meta per codice (190=token scaduto, 200=permessi, 4=rate limit)
 *   2. isTokenExpiredError() esportata — usata da PublishModal per mostrare "Riconnetti"
 *   3. Token expiresAt salvato al momento del connect — warning se < 7 giorni
 *   4. checkTokenHealth() — verifica token prima della pubblicazione
 *   5. openMetaOAuth() non usa più alert() — restituisce errore strutturato via callback
 *   6. Timeout su tutte le fetch() — evita hanging indefinito
 *   7. Regola #8 garantita: ZERO chiamate a domini non-Meta
 */

export const META_APP_ID  = "1543498264065807";
export const META_API     = "https://graph.facebook.com/v19.0";
export const META_SCOPES  = [
  "pages_show_list",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
  "pages_read_engagement",
  "pages_manage_posts",
  "public_profile",
  "business_management",
].join(",");

// ─── COSTANTI ─────────────────────────────────────────────────────────────────

/** Timeout standard per le chiamate Graph API (ms) */
const FETCH_TIMEOUT_MS = 30_000;

/** Polling Reel: max 24 tentativi × 4s = ~96s */
const REEL_POLL_ATTEMPTS = 24;
const REEL_POLL_INTERVAL = 4_000;

/** Avviso se il token scade entro N giorni */
const TOKEN_WARN_DAYS = 7;

/** Meta Graph API error codes */
export const META_ERROR_CODES = Object.freeze({
  TOKEN_EXPIRED:    190,   // OAuthException — token scaduto o revocato
  PERMISSION:       200,   // Permesso mancante
  RATE_LIMIT:       4,     // Too many calls
  RATE_LIMIT_APP:   17,    // User request limit reached
  FEED_LIMIT:       341,   // Feed action limit reached
  MEDIA_NOT_READY:  9007,  // Media container non ancora pronto
});

// ─── ERROR HELPERS ────────────────────────────────────────────────────────────

/**
 * Classe di errore strutturata per Meta API.
 * Porta con sé il codice numerico originale per classificazione.
 */
export class MetaApiError extends Error {
  constructor(message, code, type) {
    super(message);
    this.name   = "MetaApiError";
    this.code   = code   || 0;
    this.fbType = type   || "";
  }
}

/** Restituisce true se l'errore indica token scaduto/revocato (code 190). */
export function isTokenExpiredError(error) {
  if (error instanceof MetaApiError) return error.code === META_ERROR_CODES.TOKEN_EXPIRED;
  const msg = String(error?.message || "").toLowerCase();
  return (
    error?.code === 190 ||
    msg.includes("oauth") ||
    msg.includes("token") && msg.includes("expir") ||
    msg.includes("session has been invalidated")
  );
}

/** Restituisce true se è un rate limit (codes 4, 17, 341). */
export function isRateLimitError(error) {
  if (!(error instanceof MetaApiError)) return false;
  return [
    META_ERROR_CODES.RATE_LIMIT,
    META_ERROR_CODES.RATE_LIMIT_APP,
    META_ERROR_CODES.FEED_LIMIT,
  ].includes(error.code);
}

export function serializeMetaError(error) {
  if (!error)                          return "Errore Meta sconosciuto";
  if (typeof error === "string")       return error;
  if (isTokenExpiredError(error))
    return "Sessione Meta scaduta — riconnetti l'account dalla sidebar.";
  if (isRateLimitError(error))
    return "Troppe richieste a Meta — aspetta qualche minuto e riprova.";
  if (error.code === META_ERROR_CODES.PERMISSION)
    return "Permesso mancante — riconnetti Meta e verifica i permessi richiesti.";
  return error.message || String(error);
}

// ─── FETCH CON TIMEOUT ────────────────────────────────────────────────────────

/**
 * fetch() con AbortController timeout.
 * Garantisce che nessuna chiamata rimanga appesa indefinitamente.
 *
 * REGOLA #8: tutti gli endpoint devono puntare esclusivamente a graph.facebook.com.
 * Questa funzione NON accetta URL arbitrari — vengono costruiti internamente.
 */
async function metaFetch(url, options = {}) {
  // Guardia regola #8: blocca URL non-Meta a runtime
  if (!url.startsWith(META_API)) {
    throw new MetaApiError(
      `[NMS] URL non autorizzato: ${url}. Pubblicazione SEMPRE nativa su Meta. Regola #8.`,
      0, "NMSSecurityError"
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    if (error.name === "AbortError") {
      throw new MetaApiError(
        "Timeout — Meta non ha risposto in 30 secondi. Riprova.",
        0, "Timeout"
      );
    }
    throw error;
  }
}

/**
 * Legge e valida la risposta JSON dalla Graph API.
 * Lancia MetaApiError con il codice originale.
 */
async function parseMetaJson(response, context) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new MetaApiError(`${context}: risposta non JSON (HTTP ${response.status})`, 0);
  }

  if (data?.error) {
    throw new MetaApiError(
      `${context}: ${data.error.message}`,
      data.error.code,
      data.error.type
    );
  }

  return data;
}

// ─── OAUTH ────────────────────────────────────────────────────────────────────

export function buildMetaOAuthUrl({
  appId       = META_APP_ID,
  redirectUri = "https://nassa-gestione.vercel.app/api/meta-oauth",
  scopes      = META_SCOPES,
} = {}) {
  return (
    `https://www.facebook.com/dialog/oauth` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes}` +
    `&response_type=code`
  );
}

/**
 * Apre il popup OAuth Meta.
 * Callbacks: onPages(pages) | onError(message) — NO alert().
 *
 * @param {(pages: object[]) => void} onPages
 * @param {(message: string) => void} onError
 * @param {object} options
 */
export function openMetaOAuth(onPages, onError, options = {}) {
  const popup = window.open(
    buildMetaOAuthUrl(options),
    "MetaLogin",
    "width=620,height=720,left=200,top=80"
  );

  if (!popup || popup.closed) {
    onError?.("Popup bloccato — abilita i popup nelle impostazioni del browser.");
    return;
  }

  let poll;

  function cleanup() {
    window.removeEventListener("message", handleMsg);
    if (poll) clearInterval(poll);
  }

  function handleMsg(e) {
    if (e.data?.type === "META_OAUTH_PAGES") {
      cleanup();
      const pages = Array.isArray(e.data.pages) ? e.data.pages : [];
      onPages(pages);
    }
    if (e.data?.type === "META_OAUTH_ERROR") {
      cleanup();
      onError?.(String(e.data.error || "Errore OAuth sconosciuto"));
    }
  }

  window.addEventListener("message", handleMsg);
  poll = setInterval(() => {
    try {
      if (popup.closed) {
        cleanup();
        // Popup chiuso senza completare — non è un errore critico
      }
    } catch {
      cleanup();
    }
  }, 800);
}

// ─── TOKEN HEALTH ─────────────────────────────────────────────────────────────

/**
 * Verifica che il token sia ancora valido chiamando /me con esso.
 *
 * @returns {{ ok: boolean, expired: boolean, error: string|null }}
 */
export async function checkTokenHealth(token) {
  if (!token) {
    return { ok: false, expired: true, error: "Nessun token Meta salvato." };
  }

  try {
    const response = await metaFetch(
      `${META_API}/me?fields=id,name&access_token=${encodeURIComponent(token)}`
    );
    await parseMetaJson(response, "Token health");
    return { ok: true, expired: false, error: null };
  } catch (error) {
    const expired = isTokenExpiredError(error);
    return {
      ok: false,
      expired,
      error: serializeMetaError(error),
    };
  }
}

/**
 * Controlla se il token salvato in globalMeta è vicino alla scadenza.
 * Meta page tokens non hanno scadenza formale ma possono essere revocati.
 * Usiamo expiresAt salvato al momento del connect (60 giorni da allora).
 *
 * @param {object} globalMeta
 * @returns {{ warn: boolean, daysLeft: number|null, message: string|null }}
 */
export function checkTokenExpiry(globalMeta) {
  if (!globalMeta?.expiresAt) {
    return { warn: false, daysLeft: null, message: null };
  }

  const daysLeft = Math.ceil((globalMeta.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return {
      warn: true,
      daysLeft: 0,
      message: "Token Meta scaduto — riconnetti l'account dalla sidebar.",
    };
  }

  if (daysLeft <= TOKEN_WARN_DAYS) {
    return {
      warn: true,
      daysLeft,
      message: `Token Meta scade tra ${daysLeft} giorni — riconnetti presto.`,
    };
  }

  return { warn: false, daysLeft, message: null };
}

// ─── INSTAGRAM PUBLISH ────────────────────────────────────────────────────────

export async function pollIgMedia(mediaId, token, maxAttempts = REEL_POLL_ATTEMPTS) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, REEL_POLL_INTERVAL));
    const response = await metaFetch(
      `${META_API}/${mediaId}?fields=status_code&access_token=${encodeURIComponent(token)}`
    );
    const data = await parseMetaJson(response, "Instagram reel status");
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR")
      throw new MetaApiError("Instagram: errore elaborazione video — riprova.", META_ERROR_CODES.MEDIA_NOT_READY);
  }
  throw new MetaApiError(
    "Instagram: timeout elaborazione video — riprova tra qualche minuto.",
    0, "Timeout"
  );
}

export async function igPublish(igUserId, token, post, scheduleUnix) {
  const tipo = String(post.tipo || post.format || "post").toLowerCase();
  let creationId;

  if (tipo === "reel") {
    const response = await metaFetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "REELS",
        video_url:  post.videoUrl || "",
        caption:    post.caption  || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const data = await parseMetaJson(response, "IG reel create");
    creationId = data.id;
    await pollIgMedia(creationId, token);
  } else {
    const response = await metaFetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url:    post.immagineUrl || "",
        caption:      post.caption     || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const data = await parseMetaJson(response, "IG post create");
    creationId = data.id;
  }

  const publishResponse = await metaFetch(`${META_API}/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: creationId, access_token: token }),
  });
  return parseMetaJson(publishResponse, "IG publish");
}

// ─── FACEBOOK PUBLISH ─────────────────────────────────────────────────────────

export async function fbPublish(pageId, token, post, scheduleUnix) {
  const tipo    = String(post.tipo || post.format || "post").toLowerCase();
  const isVideo = tipo === "reel";
  const endpoint = isVideo
    ? `${META_API}/${pageId}/videos`
    : `${META_API}/${pageId}/photos`;

  const body = isVideo
    ? {
        file_url:     post.videoUrl || "",
        description:  post.caption  || "",
        access_token: token,
        ...(scheduleUnix
          ? { published: false, scheduled_publish_time: scheduleUnix }
          : { published: true }),
      }
    : {
        url:          post.immagineUrl || "",
        caption:      post.caption     || "",
        access_token: token,
        ...(scheduleUnix
          ? { published: false, scheduled_publish_time: scheduleUnix }
          : { published: true }),
      };

  const response = await metaFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseMetaJson(response, "Facebook publish");
}

// ─── SAFE WRAPPERS ────────────────────────────────────────────────────────────

export async function safeIgPublish(...args) {
  try {
    return { ok: true, data: await igPublish(...args), error: null, tokenExpired: false };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: serializeMetaError(error),
      tokenExpired: isTokenExpiredError(error),
    };
  }
}

export async function safeFbPublish(...args) {
  try {
    return { ok: true, data: await fbPublish(...args), error: null, tokenExpired: false };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: serializeMetaError(error),
      tokenExpired: isTokenExpiredError(error),
    };
  }
}

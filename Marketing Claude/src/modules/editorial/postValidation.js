// modules/editorial/postValidation.js
// Service boundary extracted from MarketingStudio.jsx in Refactor Step 9.
// Pure validation helpers: no React, no DOM, no app state side effects.

export const POST_VALIDATION_DEFAULTS = Object.freeze({
  validTypes: ["post", "carousel", "reel", "storia"],
  validStatuses: ["bozza", "revisione", "approvato", "schedulato", "pubblicato", "non-approvato"],
  scheduledStatuses: ["schedulato", "pubblicato"],
  defaultCaptionLimit: 2200,
  linkedinCaptionLimit: 3000,
});

export function normalizeChannel(channel) {
  return String(channel || "").trim().toLowerCase();
}

export function normalizePostType(type) {
  const key = String(type || "post").trim().toLowerCase();
  if (key === "carosello") return "carousel";
  if (key === "story") return "storia";
  return key || "post";
}

export function normalizeFeedStatus(status) {
  const aliases = {
    idea: "bozza",
    draft: "bozza",
    produzione: "bozza",
    todo: "bozza",
    in_progress: "revisione",
    semaforo: "revisione",
    ready: "approvato",
    live: "pubblicato",
    published: "pubblicato",
    "non approvato": "non-approvato",
    non_approvato: "non-approvato",
  };
  const key = String(status || "bozza").trim().toLowerCase();
  return aliases[key] || key || "bozza";
}

export function normalizePostPlatforms(post = {}) {
  if (Array.isArray(post.piattaforme) && post.piattaforme.length) {
    return post.piattaforme.map(normalizeChannel).filter(Boolean);
  }
  if (post.canale) return [normalizeChannel(post.canale)].filter(Boolean);
  return [];
}

export function isValidOptionalUrl(value) {
  const v = String(value || "").trim();
  if (!v) return true;
  if (v.startsWith("blob:")) return true;
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

export function isValidISODate(value) {
  const v = String(value || "").trim();
  if (!v) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

export function isValidTime(value) {
  const v = String(value || "").trim();
  if (!v) return true;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export function getCaptionLimitForPlatforms(platforms = [], options = {}) {
  const normalized = platforms.map(normalizeChannel);
  const defaultLimit = options.defaultCaptionLimit || POST_VALIDATION_DEFAULTS.defaultCaptionLimit;
  const linkedinLimit = options.linkedinCaptionLimit || POST_VALIDATION_DEFAULTS.linkedinCaptionLimit;
  if (normalized.includes("instagram") || normalized.includes("facebook") || normalized.includes("tiktok")) return defaultLimit;
  if (normalized.includes("linkedin")) return linkedinLimit;
  return defaultLimit;
}

export function validatePostFormItem(post = {}, options = {}) {
  const cfg = { ...POST_VALIDATION_DEFAULTS, ...options };
  const errors = [];
  const warnings = [];

  const titolo = String(post.titolo || "").trim();
  const captionA = String(post.caption || "").trim();
  const captionB = String(post.captionB || "").trim();
  const piattaforme = normalizePostPlatforms(post);
  const tipo = normalizePostType(post.tipo || "post");
  const stato = normalizeFeedStatus(post.stato || "bozza");
  const captionLimit = getCaptionLimitForPlatforms(piattaforme, cfg);
  const longestCaptionLength = Math.max(captionA.length, captionB.length);

  if (!titolo && !captionA && !captionB) errors.push("Inserisci almeno un titolo o una caption.");
  if (!cfg.validTypes.includes(tipo)) errors.push("Formato post non valido.");
  if (!piattaforme.length) errors.push("Seleziona almeno una piattaforma.");
  if (!cfg.validStatuses.includes(stato)) errors.push("Stato editoriale non valido.");
  if (!isValidISODate(post.data)) errors.push("La data deve essere valida nel formato YYYY-MM-DD.");
  if (!isValidTime(post.time)) errors.push("L'orario deve essere valido nel formato HH:MM.");
  if (cfg.scheduledStatuses.includes(stato) && !post.data) errors.push("Per i post schedulati o pubblicati serve una data.");

  [["Link CTA", post.ctaLink], ["Link asset", post.linkAsset], ["URL immagine", post.immagineUrl], ["URL video", post.videoUrl]].forEach(([label, value]) => {
    if (!isValidOptionalUrl(value)) errors.push(`${label} non valido: usa un URL http/https.`);
  });

  if (longestCaptionLength > captionLimit) warnings.push(`Caption oltre il limite consigliato (${longestCaptionLength}/${captionLimit} caratteri).`);
  if ((tipo === "reel" || tipo === "storia") && !post.videoUrl) warnings.push("Per Reel/Storie è consigliato aggiungere un URL video pubblico.");
  if (post.cta && post.cta !== "Nessuna" && !post.ctaLink) warnings.push("Hai selezionato una CTA: valuta di aggiungere anche un link.");
  if (!post.pilastro && !post.isTrend) warnings.push("Nessun pilastro assegnato: ok per bozze, ma utile prima della revisione.");

  return { isValid: errors.length === 0, errors, warnings };
}

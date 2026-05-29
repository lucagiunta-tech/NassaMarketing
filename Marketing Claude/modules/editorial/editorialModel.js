export const CANALE_COLOR = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  tiktok: "#111111",
  youtube: "#FF0000",
  email: "#10B981",
  blog: "#F59E0B",
  altro: "#64748B",
  // Compatibilita con vecchi contenuti che salvavano il nome canale capitalizzato
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  LinkedIn: "#0A66C2",
  TikTok: "#111111",
  YouTube: "#FF0000",
  Email: "#10B981",
  Blog: "#F59E0B",
  Altro: "#64748B",
};

export const FEED_TIPI = ["post", "carousel", "reel", "storia"];
export const FEED_TIPI_ICON = { post: "📄", carousel: "🖼️", reel: "🎬", storia: "⬜" };
export const FEED_TIPI_LABEL = { post: "Post", carousel: "Carousel", reel: "Reel", storia: "Storia" };
export const FEED_PIATTAFORME = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "tiktok", label: "TikTok", color: "#111111" },
];

export const POST_STATUS = Object.freeze({
  bozza: "bozza",
  revisione: "revisione",
  approvato: "approvato",
  schedulato: "schedulato",
  pubblicato: "pubblicato",
  nonApprovato: "non-approvato",
});

export const POST_STATUS_ORDER = Object.freeze([
  POST_STATUS.bozza,
  POST_STATUS.revisione,
  POST_STATUS.approvato,
  POST_STATUS.schedulato,
  POST_STATUS.pubblicato,
  POST_STATUS.nonApprovato,
]);

// Legacy alias: keeps existing views working while centralizing status logic.
export const FEED_STATI = [...POST_STATUS_ORDER];

export const FEED_STATI_STYLE = {
  [POST_STATUS.bozza]:        { label: "Bozza",         bg: "#F6F6F4",              tx: "#6B7280",  icon: "✏️" },
  [POST_STATUS.revisione]:    { label: "In revisione",  bg: "rgba(0,180,216,.10)",  tx: "#007A99",  icon: "👁️" },
  [POST_STATUS.approvato]:    { label: "Approvato",     bg: "rgba(0,200,83,.10)",   tx: "#007A3D",  icon: "✅" },
  [POST_STATUS.schedulato]:   { label: "Schedulato",    bg: "rgba(255,107,0,.10)",  tx: "#A84400",  icon: "🕐" },
  [POST_STATUS.pubblicato]:   { label: "Pubblicato",    bg: "rgba(0,200,83,.10)",   tx: "#007A3D",  icon: "🚀" },
  [POST_STATUS.nonApprovato]: { label: "Non approvato", bg: "rgba(255,23,68,.09)",  tx: "#CC0033",  icon: "❌" },
};

export const POST_STATUS_ALIASES = Object.freeze({
  idea: POST_STATUS.bozza,
  draft: POST_STATUS.bozza,
  produzione: POST_STATUS.bozza,
  todo: POST_STATUS.bozza,
  in_progress: POST_STATUS.revisione,
  semaforo: POST_STATUS.revisione,
  ready: POST_STATUS.approvato,
  live: POST_STATUS.pubblicato,
  published: POST_STATUS.pubblicato,
  "non approvato": POST_STATUS.nonApprovato,
  non_approvato: POST_STATUS.nonApprovato,
});

export function normalizeChannel(channel) {
  return String(channel || "").trim().toLowerCase();
}

export function getChannelColor(channel) {
  return CANALE_COLOR[normalizeChannel(channel)] || CANALE_COLOR[channel] || CANALE_COLOR.altro;
}

export function normalizeFeedStatus(status) {
  const raw = String(status || POST_STATUS.bozza).trim();
  const key = raw.toLowerCase();
  return POST_STATUS_ALIASES[key] || (FEED_STATI_STYLE[key] ? key : POST_STATUS.bozza);
}

export function getFeedStatusStyle(status) {
  return FEED_STATI_STYLE[normalizeFeedStatus(status)] || FEED_STATI_STYLE[POST_STATUS.bozza];
}

export function isPostStatus(post, status) {
  return normalizeFeedStatus(post?.stato) === normalizeFeedStatus(status);
}

export function isPostPublished(post) {
  return isPostStatus(post, POST_STATUS.pubblicato);
}

export const STATI_PIPELINE = [
  POST_STATUS.bozza,
  POST_STATUS.revisione,
  POST_STATUS.approvato,
  POST_STATUS.schedulato,
  POST_STATUS.pubblicato,
];

export const STATI_NEXT = {
  [POST_STATUS.bozza]: POST_STATUS.revisione,
  [POST_STATUS.revisione]: POST_STATUS.approvato,
  [POST_STATUS.approvato]: POST_STATUS.schedulato,
  [POST_STATUS.schedulato]: POST_STATUS.pubblicato,
};

export const STATI_NEXT_LABEL = {
  [POST_STATUS.bozza]: "Manda in revisione",
  [POST_STATUS.revisione]: "Segna approvato",
  [POST_STATUS.approvato]: "Schedula",
  [POST_STATUS.schedulato]: "Segna pubblicato",
};

export function getNextFeedStatus(status) {
  return STATI_NEXT[normalizeFeedStatus(status)] || null;
}

export const EMPTY_EDITORIAL_STATE = Object.freeze({
  sections: {},
  contentItems: [],
  campagne: [],
  calendarEvents: [],
  perfLogs: [],
  feedItems: [],
  ideas: [],
  collaboratori: [],
  captionTemplates: [],
});

export function createEmptyEditorialState(overrides = {}) {
  return {
    sections: { ...(overrides.sections || {}) },
    contentItems: Array.isArray(overrides.contentItems) ? overrides.contentItems : [],
    campagne: Array.isArray(overrides.campagne) ? overrides.campagne : [],
    calendarEvents: Array.isArray(overrides.calendarEvents) ? overrides.calendarEvents : [],
    perfLogs: Array.isArray(overrides.perfLogs) ? overrides.perfLogs : [],
    feedItems: Array.isArray(overrides.feedItems) ? overrides.feedItems : [],
    ideas: Array.isArray(overrides.ideas) ? overrides.ideas : [],
    collaboratori: Array.isArray(overrides.collaboratori) ? overrides.collaboratori : [],
    captionTemplates: Array.isArray(overrides.captionTemplates) ? overrides.captionTemplates : [],
    ...overrides,
  };
}

export function normalizeEditorialState(ed) {
  return createEmptyEditorialState(ed || {});
}

export function getProjectEd(project) {
  return normalizeEditorialState(project?.ed);
}

export function applyEdUpdate(project, updater) {
  const baseEd = getProjectEd(project);
  const patch = typeof updater === "function" ? updater(baseEd) : (updater || {});
  return {
    ...project,
    ed: normalizeEditorialState({ ...baseEd, ...patch }),
  };
}

export function normalizePostType(type) {
  const key = String(type || "post").trim().toLowerCase();
  if (key === "carosello") return "carousel";
  if (key === "story") return "storia";
  return key || "post";
}

export function normalizePostPlatforms(item) {
  if (Array.isArray(item?.piattaforme) && item.piattaforme.length) {
    return item.piattaforme.map(normalizeChannel).filter(Boolean);
  }
  if (item?.canale) return [normalizeChannel(item.canale)].filter(Boolean);
  return ["instagram"];
}

export function normalizeFeedItem(item = {}) {
  return {
    ...item,
    titolo: item.titolo || item.title || "Contenuto senza titolo",
    tipo: normalizePostType(item.tipo || item.format),
    piattaforme: normalizePostPlatforms(item),
    stato: normalizeFeedStatus(item.stato || item.status),
    data: item.data || item.dateISO || item.dueDate || "",
  };
}

export function normalizeLegacyContentItem(item = {}, index = 0) {
  return {
    ...normalizeFeedItem(item),
    id: item.id || `legacy-content-${index}`,
    caption: item.caption || "",
    _legacySource: "contentItems",
  };
}

export function getEditorialPosts(project) {
  const ed = getProjectEd(project);
  const feedItems = ed.feedItems.map(normalizeFeedItem);
  const feedIds = new Set(feedItems.map(item => item.id).filter(Boolean));
  const legacyItems = ed.contentItems
    .filter(item => !feedIds.has(item.id))
    .map(normalizeLegacyContentItem);
  return [...feedItems, ...legacyItems];
}

export function migrateEditorialContentItemsToFeedItems(project) {
  if (!project) return project;
  const ed = getProjectEd(project);
  const feedItems = ed.feedItems.map(normalizeFeedItem);
  const feedIds = new Set(feedItems.map(item => item.id).filter(Boolean));
  const legacyItems = ed.contentItems
    .filter(item => !feedIds.has(item.id))
    .map((item, index) => ({
      ...normalizeLegacyContentItem(item, index),
      migratedFrom: "contentItems",
    }));

  if (legacyItems.length === 0) {
    return { ...project, ed: normalizeEditorialState({ ...ed, feedItems }) };
  }

  return {
    ...project,
    ed: normalizeEditorialState({
      ...ed,
      feedItems: [...feedItems, ...legacyItems],
      contentItems: ed.contentItems,
      legacyContentItemsMigrated: true,
    }),
  };
}

export function migrateProjectData(project) {
  if (!project) return project;
  return migrateEditorialContentItemsToFeedItems(project);
}

export function migrateWorkspaceData(data) {
  if (!data || typeof data !== "object") return data;
  return {
    ...data,
    schemaVersion: Math.max(Number(data.schemaVersion || 1), 2),
    projects: Array.isArray(data.projects) ? data.projects.map(migrateProjectData) : [],
    clients: Array.isArray(data.clients) ? data.clients : [],
  };
}

export const PILASTRO_COLORS = Object.freeze({
  "CoopPromo": "#EF4444",
  "Coop Promo": "#EF4444",
  "FiorFiore": "#F59E0B",
  "Fior Fiore": "#F59E0B",
  "TerraTavola": "#8B5CF6",
  "Terra/Tavola": "#8B5CF6",
  "Istituzionale": "#F97316",
  "CoopSocial": "#10B981",
  "Coop Social": "#10B981",
  "Educational": "#0EA5E9",
  "Authority": "#6366F1",
  "Commerciale": "#10B981",
  "Community": "#EC4899",
});

export const IDEA_COLS = Object.freeze([
  { id: "draft", label: "Bozza", color: "#64748B", bg: "#F8FAFC", cnt_bg: "#E2E8F0" },
  { id: "todo", label: "Da fare", color: "#F59E0B", bg: "#FFFBEB", cnt_bg: "#FDE68A" },
  { id: "in_progress", label: "In lavorazione", color: "#3B82F6", bg: "#EFF6FF", cnt_bg: "#BFDBFE" },
  { id: "ready", label: "Pronto", color: "#10B981", bg: "#F0FDF4", cnt_bg: "#A7F3D0" },
]);

export function getPillarColor(pillar, project = null, fallback = "#94A3B8") {
  if (!pillar) return fallback;
  const projectColor = project?.pilastri?.find?.(p => p.nome === pillar)?.colore;
  return projectColor || PILASTRO_COLORS[pillar] || fallback;
}

export function getIdeaStatusStyle(status, fallbackIndex = 0) {
  return IDEA_COLS.find(col => col.id === status) || IDEA_COLS[fallbackIndex] || IDEA_COLS[0];
}

export const getIdeaStatus = getIdeaStatusStyle;

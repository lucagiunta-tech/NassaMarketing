export function clampNumber(value, min = 0, max = 100) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function toISODate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatShortDate(value, locale = "it-IT") {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
}

export function parseMetric(value) {
  if (value === undefined || value === null) return null;
  const n = parseFloat(String(value).replace("%", "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function getDelta(current, previous) {
  const c = parseMetric(current);
  const p = parseMetric(previous);
  if (c === null || p === null) return null;
  return c - p;
}

export function formatDelta(delta, suffix = "") {
  if (delta === null || delta === undefined) return "—";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(Math.abs(delta) >= 10 ? 0 : 1)}${suffix}`;
}

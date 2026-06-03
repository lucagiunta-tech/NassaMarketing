/**
 * MetaInsightsPanel.jsx
 * Reads Facebook Page Insights via Graph API and renders metric cards + sparklines.
 * Props: client (full client object with client.meta.fbPageId / fbToken)
 *        compact (bool) — smaller layout for sidebar contexts
 */
import { useState, useEffect, useCallback } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const METRICS_API = [
  "page_impressions",
  "page_views_total",
  "page_post_engagements",
  "page_fan_adds_unique",
  "page_fan_removes_unique",
  "page_video_views_3s",
  "page_new_conversations",
];

const CARDS = [
  { key: "page_impressions",       label: "Visualizzazioni",  icon: "👁",  color: "#1877F2" },
  { key: "followers_net",          label: "Follower netti",   icon: "👥",  color: "#10B981", derived: true },
  { key: "page_views_total",       label: "Visite pagina",    icon: "🔗",  color: "#6366F1" },
  { key: "page_post_engagements",  label: "Interazioni",      icon: "❤️",  color: "#EC4899" },
  { key: "page_video_views_3s",    label: "Video & Reel",     icon: "🎬",  color: "#F59E0B" },
  { key: "page_new_conversations", label: "Conversazioni",    icon: "💬",  color: "#14B8A6" },
];

function fmtNum(n) {
  if (n == null) return "—";
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtPct(curr, prev) {
  if (prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev) * 100).toFixed(1);
}

function dateStr(d) { return d.toISOString().slice(0, 10); }

function subDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() - n);
  return r;
}

// ── Sparkline (pure SVG, no library) ─────────────────────────────────────────
function Sparkline({ values = [], color = "#1877F2" }) {
  if (!values || values.length < 2) return <div style={{ width: 80, height: 32 }} />;
  const W = 80, H = 28;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - (Math.max(v, 0) / max) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePts = pts.join(" ");
  const fillPts = `0,${H} ${linePts} ${W},${H}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <polyline points={fillPts} fill={color} fillOpacity="0.12" stroke="none" />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── API fetch ─────────────────────────────────────────────────────────────────
async function fetchPeriod(pageId, token, since, until) {
  const params = new URLSearchParams({
    metric: METRICS_API.join(","),
    since:  dateStr(since),
    until:  dateStr(until),
    period: "day",
    access_token: token,
  });
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/insights?${params}`
  );
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "Graph API error");
  return json.data || [];
}

function processData(apiArr) {
  const out = {};
  for (const m of apiArr) {
    const vals = (m.values || []).map(v => Number(v.value) || 0);
    out[m.name] = { total: vals.reduce((s, v) => s + v, 0), values: vals };
  }
  // Derived: net followers
  const adds = out.page_fan_adds_unique;
  const rems = out.page_fan_removes_unique;
  if (adds && rems) {
    out.followers_net = {
      total:  adds.total - rems.total,
      values: adds.values.map((v, i) => v - (rems.values[i] || 0)),
    };
  }
  return out;
}

// ── Main component ────────────────────────────────────────────────────────────
export function MetaInsightsPanel({ client, compact = false }) {
  const pageId   = client?.meta?.fbPageId;
  const token    = client?.meta?.fbToken;
  const pageName = client?.meta?.nomePagina || client?.nome || "—";

  const [days,    setDays]    = useState(28);
  const [curr,    setCurr]    = useState(null);
  const [prev,    setPrev]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    if (!pageId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const until     = new Date();
      const since     = subDays(until, days);
      const prevUntil = new Date(since);
      const prevSince = subDays(prevUntil, days);

      const [currData, prevData] = await Promise.all([
        fetchPeriod(pageId, token, since, until),
        fetchPeriod(pageId, token, prevSince, prevUntil),
      ]);
      setCurr(processData(currData));
      setPrev(processData(prevData));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [pageId, token, days]);

  useEffect(() => { load(); }, [load]);

  // ── Not connected state ───────────────────────────────────────────────────
  if (!pageId || !token) {
    return (
      <div className="mi-empty">
        <div style={{ fontSize: 24, marginBottom: 8 }}>📡</div>
        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink2)" }}>Meta non connessa</div>
        <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 4 }}>
          Vai su Impostazioni cliente → Social & Meta → Connetti account
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mi-empty" style={{ borderColor: "#FEE2E2", background: "#FFF5F5" }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>⚠️</div>
        <div style={{ fontWeight: 600, fontSize: 12, color: "#DC2626" }}>Errore API Meta</div>
        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4, maxWidth: 320, textAlign: "center" }}>{error}</div>
        <button className="btn-ghost sm" style={{ marginTop: 10 }} onClick={load}>Riprova</button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="mi-wrap">
      {/* Header */}
      <div className="mi-header">
        <div className="mi-title">
          <span style={{ color: "#1877F2", marginRight: 6 }}>📘</span>
          <span>Facebook Insights</span>
          <span className="mi-page-badge">{pageName}</span>
        </div>
        <div className="mi-controls">
          {[7, 28, 90].map(d => (
            <button
              key={d}
              className={`mi-range-btn${days === d ? " active" : ""}`}
              onClick={() => setDays(d)}
            >
              {d}g
            </button>
          ))}
          <button className="mi-refresh" onClick={load} title="Aggiorna">
            {loading ? <span className="spin" style={{ width: 12, height: 12, borderWidth: 2 }} /> : "↻"}
          </button>
        </div>
      </div>

      {/* Cards grid */}
      {loading && !curr ? (
        <div className="mi-loading">
          <div className="spin" />
          <span>Caricamento insights…</span>
        </div>
      ) : (
        <div className={`mi-grid${compact ? " mi-grid-compact" : ""}`}>
          {CARDS.map(card => {
            const c = curr?.[card.key];
            const p = prev?.[card.key];
            const total    = c?.total ?? null;
            const prevTot  = p?.total ?? null;
            const delta    = total != null && prevTot != null ? fmtPct(total, prevTot) : null;
            const positive = delta != null ? Number(delta) >= 0 : null;

            return (
              <div key={card.key} className="mi-card" style={{ "--card-color": card.color }}>
                <div className="mi-card-top">
                  <span className="mi-card-label">{card.label}</span>
                  {delta != null && (
                    <span className={`mi-delta ${positive ? "up" : "down"}`}>
                      {positive ? "↑" : "↓"} {Math.abs(Number(delta))}%
                    </span>
                  )}
                </div>
                <div className="mi-card-value">
                  <span className="mi-value-num">{fmtNum(total)}</span>
                  <Sparkline values={c?.values || []} color={card.color} />
                </div>
                {prevTot != null && (
                  <div className="mi-card-prev">vs {fmtNum(prevTot)} periodo prec.</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mi-footer">
        Dati via Meta Graph API · ultimi {days} giorni ·{" "}
        <a
          href={`https://business.facebook.com/latest/insights/overview/?asset_id=${pageId}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#1877F2" }}
        >
          Apri in Business Manager ↗
        </a>
      </div>
    </div>
  );
}

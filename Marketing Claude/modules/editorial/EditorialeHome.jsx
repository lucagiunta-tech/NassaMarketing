import { useState } from "react";
import {
  FEED_TIPI_ICON,
  FEED_PIATTAFORME,
  POST_STATUS,
  getFeedStatusStyle,
  getEditorialPosts,
  isPostPublished,
  isPostStatus,
} from "./editorialModel";

function fmtISO(d){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

// ── Post Overview Widget ─────────────────────────────────────────────────────
export const POST_OVERVIEW_ROWS = [
  { stato:"bozza",          dot:"#94A3B8", bg:"#F8FAFC" },
  { stato:"revisione",      dot:"#F59E0B", bg:"#FFFBEB" },
  { stato:"non-approvato",  dot:"#EF4444", bg:"#FFF5F5" },
  { stato:"approvato",      dot:"#3B82F6", bg:"#EFF6FF" },
  { stato:"schedulato",     dot:"#10B981", bg:"#F0FDF4" },
  { stato:"pubblicato",     dot:"#6B7280", bg:"#F9FAFB" },
];

export function PostOverviewWidget({ feedItems, onFilter }) {
  const total = feedItems.length;
  return (
    <div className="lo-card">
      <div className="lo-card-hdr">
        <div className="lo-card-title">🚩 Post Overview</div>
        <button className="lo-filter-btn" title="Vai ai contenuti" onClick={() => onFilter("tutti")}>⊞</button>
      </div>
      <div className="lo-pipeline">
        {POST_OVERVIEW_ROWS.map(row => {
          const st = getFeedStatusStyle(row.stato);
          const n  = feedItems.filter(f => isPostStatus(f, row.stato)).length;
          return (
            <button key={row.stato} className="lo-pipe-row" style={{ background: row.bg }}
              onClick={() => onFilter(row.stato)}>
              <span className="lo-pipe-dot" style={{ background: row.dot }} />
              <span className="lo-pipe-label">{st.label.replace(/[✅🚀🕐👁️✏️❌]/g,"").trim()}</span>
              <span className="lo-pipe-cnt" style={{ color: n > 0 ? row.dot : "#CBD5E1" }}>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="lo-pipe-total">
        <span>{total} post totali</span>
        <button className="btn-ghost sm" style={{ fontSize: 10 }} onClick={() => onFilter("tutti")}>Vedi tutti →</button>
      </div>
    </div>
  );
}

// ── On the Radar Widget ──────────────────────────────────────────────────────
export function OnTheRadarWidget({ feedItems, onAddPost }) {
  const [offset, setOffset] = useState(0); // days from today
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offset);
  const isoDate = fmtISO(targetDate);
  const isToday = offset === 0;
  const dateLabel = isToday
    ? "Oggi"
    : offset === 1 ? "Domani"
    : offset === -1 ? "Ieri"
    : targetDate.toLocaleDateString("it-IT", { weekday: "long", day: "2-digit", month: "short" });

  const postsForDay = feedItems.filter(f => f.data === isoDate);

  return (
    <div className="lo-card">
      <div className="lo-card-hdr">
        <div className="lo-card-title">📡 On the Radar</div>
      </div>
      <div className="lo-radar-nav">
        <button className="lo-nav-btn" onClick={() => setOffset(o => o - 1)}>‹ Prec</button>
        <div className="lo-radar-date">
          <div className={`lo-radar-label ${isToday ? "lo-today" : ""}`}>{dateLabel}</div>
          <div className="lo-radar-iso">{targetDate.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}</div>
        </div>
        <button className="lo-nav-btn" onClick={() => setOffset(o => o + 1)}>Succ ›</button>
      </div>
      <div className="lo-radar-body">
        {postsForDay.length === 0 ? (
          <div className="lo-radar-empty">
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 12, color: "var(--ink4)", marginBottom: 14 }}>Nessun post per questa data.</div>
            <button className="lo-create-btn" onClick={onAddPost}>+ Crea post</button>
          </div>
        ) : (
          postsForDay.map(post => {
            const st  = getFeedStatusStyle(post.stato);
            const src = post.immagineBase64 || post.immagineUrl || "";
            const piats = (post.piattaforme || []).map(id => FEED_PIATTAFORME.find(p => p.id === id)).filter(Boolean);
            return (
              <div key={post.id} className="lo-radar-post">
                <div className="lo-radar-thumb">
                  {src
                    ? <img src={src} alt="" onError={e => e.target.style.display = "none"} />
                    : <span style={{ fontSize: 18 }}>{FEED_TIPI_ICON[post.tipo] || "📄"}</span>}
                </div>
                <div className="lo-radar-info">
                  <div className="lo-radar-title">{post.titolo}</div>
                  <div className="lo-radar-meta">
                    {piats.map(p => <span key={p.id} style={{ color: p.color, fontSize: 10, fontWeight: 700, marginRight: 4 }}>{p.label}</span>)}
                    <span className="pgc-stato" style={{ background: st.bg, color: st.tx }}>{st.icon} {st.label.replace(/[✅🚀🕐👁️✏️❌]/g, "").trim()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Upcoming Posts Widget ────────────────────────────────────────────────────
export function UpcomingWidget({ feedItems, onEdit }) {
  const today = fmtISO(new Date());
  const upcoming = feedItems
    .filter(f => f.data >= today && !isPostPublished(f))
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 6);
  const needsAction = feedItems.filter(f => isPostStatus(f, POST_STATUS.revisione));

  return (
    <div className="lo-card">
      <div className="lo-card-hdr">
        <div className="lo-card-title">⚡ Prossime scadenze</div>
      </div>
      {needsAction.length > 0 && (
        <div className="lo-action-alert">
          <span className="lo-alert-dot" style={{ background: "#F59E0B" }} />
          <span><strong>{needsAction.length}</strong> post in attesa di approvazione</span>
        </div>
      )}
      {upcoming.length === 0
        ? <div style={{ fontSize: 11, color: "var(--ink5)", padding: "12px 0", fontStyle: "italic" }}>Nessun post pianificato nei prossimi giorni.</div>
        : upcoming.map(post => {
            const st = getFeedStatusStyle(post.stato);
            const daysLeft = Math.ceil((new Date(post.data) - new Date()) / 86400000);
            return (
              <div key={post.id} className="lo-upcoming-row" onClick={() => onEdit(post)}>
                <div className="lo-upcoming-left">
                  <span className="lo-upcoming-dot" style={{ background: st.dot || "#CBD5E1" }} />
                  <div>
                    <div className="lo-upcoming-title">{post.titolo}</div>
                    <div className="lo-upcoming-sub">{post.data} · {(post.piattaforme || []).join(", ")}</div>
                  </div>
                </div>
                <span className="lo-upcoming-days" style={{ color: daysLeft <= 2 ? "#EF4444" : daysLeft <= 5 ? "#F59E0B" : "var(--ink4)" }}>
                  {daysLeft === 0 ? "oggi" : daysLeft === 1 ? "domani" : `${daysLeft}g`}
                </span>
              </div>
            );
          })
      }
    </div>
  );
}

// ── Editoriale Home ──────────────────────────────────────────────────────────
export function EditorialeHome({ project, onNavigate, onAddPost, onEditPost }) {
  const feedItems = getEditorialPosts(project);
  const published = feedItems.filter(f => isPostPublished(f)).length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthPub = feedItems.filter(f => isPostPublished(f) && f.data?.startsWith(thisMonth)).length;

  return (
    <div className="lo-home">
      {/* Quick stats strip */}
      <div className="lo-stats-strip">
        {[
          { label: "Post totali",    value: feedItems.length,   icon: "📋" },
          { label: "Pubblicati",     value: published,           icon: "🚀" },
          { label: "Questo mese",    value: thisMonthPub,        icon: "📅" },
          { label: "In revisione",   value: feedItems.filter(f => isPostStatus(f, POST_STATUS.revisione)).length, icon: "👁️" },
          { label: "Da pianificare", value: feedItems.filter(f => !f.data && !isPostPublished(f)).length, icon: "⚠️" },
        ].map((s, i) => (
          <div key={i} className="lo-stat-card">
            <div className="lo-stat-icon">{s.icon}</div>
            <div className="lo-stat-val">{s.value}</div>
            <div className="lo-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="lo-home-grid">
        <PostOverviewWidget feedItems={feedItems} onFilter={stato => { onNavigate("grid", stato); }} />
        <OnTheRadarWidget   feedItems={feedItems} onAddPost={onAddPost} />
        <UpcomingWidget     feedItems={feedItems} onEdit={onEditPost} />
      </div>
    </div>
  );
}


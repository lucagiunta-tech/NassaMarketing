/**
 * GlobalApprovalsView.jsx
 * Dashboard approvazioni globale — tutti i contenuti pending da tutti i clienti.
 * Ispirato a CoSchedule Agency Calendar "Approvals Dashboard".
 *
 * Features:
 *  - Lista aggregata di tutti i post in stato "revisione" / "semaforo" / "non-approvato"
 *  - Grouped per cliente con contatori
 *  - One-click Approva / Non approvare / Richiedi modifiche con campo note
 *  - Filtro per cliente e per stato
 *  - Stats header: tot. pending, approvati oggi, in attesa cliente
 *  - Click su post → naviga al progetto
 *  - Feedback note inline per ogni post
 *
 * Props:
 *  projects      — array tutti i progetti
 *  clients       — array tutti i clienti
 *  onUpdateProject — (updatedProject) => void
 *  onGoToProject   — (projId) => void
 */

import { useState, useMemo, useCallback } from "react";
import {
  getEditorialPosts,
  getFeedStatusStyle,
  applyEdUpdate,
  POST_STATUS,
} from "./editorialModel";
import { getPillarColor } from "./editorialTheme";

// Stati che richiedono azione
const PENDING_STATI  = [POST_STATUS.revisione, "semaforo"];
const FEEDBACK_STATI = [POST_STATUS.nonApprovato];

const PLAT_ICON = {
  instagram:"📸", facebook:"📘", tiktok:"🎵",
  linkedin:"💼", youtube:"▶️", email:"📧", blog:"📝", altro:"🔗",
};

const CLIENT_PALETTE = [
  "#006EFF","#7C3AED","#00C853","#FF6B00","#C800FF",
  "#0284C7","#D97706","#059669","#E4405F","#F97316",
];

function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}

// ─── POST ROW ─────────────────────────────────────────────────────────────────
function PostRow({ post, projName, clientColor, onApprove, onReject, onRequestChanges, onGoToProject }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(null);

  const st       = getFeedStatusStyle(post.stato) || {};
  const plats    = (post.piattaforme || []).slice(0, 3);
  const daysLeft = post.data
    ? Math.ceil((new Date(post.data + "T12:00:00") - new Date()) / 86400000)
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent  = daysLeft !== null && daysLeft >= 0 && daysLeft <= 2;

  async function handleAction(action) {
    setLoading(action);
    await new Promise(r => setTimeout(r, 200)); // micro-delay for UX
    if (action === "approve")        onApprove(post.id);
    if (action === "reject")         onReject(post.id);
    if (action === "feedback") {
      if (!feedbackText.trim()) return setLoading(null);
      onRequestChanges(post.id, feedbackText.trim());
      setShowFeedback(false);
      setFeedbackText("");
    }
    setLoading(null);
  }

  return (
    <div className={`apr-row ${isOverdue ? "apr-row-overdue" : ""}`}>
      <div className="apr-row-main">
        {/* Color bar cliente */}
        <div className="apr-client-bar" style={{ background: clientColor }} />

        {/* Info post */}
        <div className="apr-info" onClick={() => onGoToProject?.(post._projId)} style={{ cursor:"pointer" }}>
          <div className="apr-title">{post.titolo || post.title || "Post senza titolo"}</div>
          <div className="apr-meta">
            <span className="apr-proj">{projName}</span>
            {post.pilastro && (
              <span className="apr-pillar" style={{ color: getPillarColor(post.pilastro) }}>
                {post.pilastro}
              </span>
            )}
            {plats.map(p => (
              <span key={p} className="apr-plat">{PLAT_ICON[p] || p}</span>
            ))}
            {post.tipo && <span className="apr-tipo">{post.tipo}</span>}
          </div>
        </div>

        {/* Data */}
        <div className={`apr-date ${isOverdue ? "apr-date-over" : isUrgent ? "apr-date-urgent" : ""}`}>
          {post.data ? (
            <>
              <div>{post.data.slice(5).replace("-", "/")}</div>
              <div className="apr-date-sub">
                {isOverdue ? `${Math.abs(daysLeft)}g fa` : daysLeft === 0 ? "oggi" : daysLeft === 1 ? "domani" : `tra ${daysLeft}g`}
              </div>
            </>
          ) : <span>—</span>}
        </div>

        {/* Stato */}
        <div className="apr-stato-wrap">
          <span className="apr-stato-pill" style={{ background: st.bg, color: st.tx }}>
            {st.icon} {st.label}
          </span>
        </div>

        {/* Actions */}
        <div className="apr-actions">
          {post.stato !== POST_STATUS.approvato && (
            <button
              className="apr-btn apr-btn-ok"
              onClick={() => handleAction("approve")}
              disabled={!!loading}
              title="Approva">
              {loading === "approve" ? "…" : "✅ Approva"}
            </button>
          )}
          <button
            className="apr-btn apr-btn-fb"
            onClick={() => setShowFeedback(v => !v)}
            disabled={!!loading}
            title="Richiedi modifiche">
            ✏️ Note
          </button>
          <button
            className="apr-btn apr-btn-no"
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            title="Non approvato">
            {loading === "reject" ? "…" : "✗"}
          </button>
          <button className="apr-btn apr-btn-go" onClick={() => onGoToProject?.(post._projId)} title="Vai al progetto">
            →
          </button>
        </div>
      </div>

      {/* Feedback inline */}
      {showFeedback && (
        <div className="apr-feedback-wrap">
          <div className="apr-feedback-label">Nota per il team:</div>
          <textarea
            className="apr-feedback-ta"
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            placeholder="Descrivi le modifiche richieste…"
            rows={2}
            autoFocus
          />
          <div className="apr-feedback-actions">
            <button className="apr-btn apr-btn-fb" onClick={() => { setShowFeedback(false); setFeedbackText(""); }}>
              Annulla
            </button>
            <button className="apr-btn apr-btn-ok" onClick={() => handleAction("feedback")} disabled={!feedbackText.trim()}>
              {loading === "feedback" ? "…" : "Invia nota"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLIENT GROUP ─────────────────────────────────────────────────────────────
function ClientGroup({ client, clientColor, posts, projMap, onApprove, onReject, onRequestChanges, onGoToProject }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="apr-group">
      <div className="apr-group-hd" onClick={() => setCollapsed(v => !v)}>
        <span className="apr-group-dot" style={{ background: clientColor }} />
        <span className="apr-group-name">{client.name}</span>
        <span className="apr-group-cnt">{posts.length} in attesa</span>
        <span className="apr-group-chev">{collapsed ? "▶" : "▼"}</span>
      </div>
      {!collapsed && posts.map(post => (
        <PostRow
          key={post.id}
          post={post}
          projName={projMap[post._projId] || "—"}
          clientColor={clientColor}
          onApprove={onApprove}
          onReject={onReject}
          onRequestChanges={onRequestChanges}
          onGoToProject={onGoToProject}
        />
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function GlobalApprovalsView({ projects = [], clients = [], onUpdateProject, onGoToProject }) {
  const [filterClient, setFilterClient] = useState("tutti");
  const [filterStato,  setFilterStato]  = useState("pending"); // "pending" | "tutti" | "non-approvato"
  const [justApproved, setJustApproved] = useState(new Set());

  // Build lookup maps
  const clientColorMap = useMemo(() => {
    const m = {};
    clients.forEach((c, i) => { m[c.id] = CLIENT_PALETTE[i % CLIENT_PALETTE.length]; });
    return m;
  }, [clients]);

  const projMap = useMemo(() => {
    const m = {};
    projects.forEach(p => { m[p.id] = p.name; });
    return m;
  }, [projects]);

  // Collect all posts needing action, enriched with project/client info
  const allPending = useMemo(() => {
    const posts = [];
    projects.forEach(proj => {
      const client = clients.find(c => c.id === proj.clientId);
      getEditorialPosts(proj).forEach(post => {
        const isRevisione    = post.stato === POST_STATUS.revisione || post.stato === "semaforo";
        const isNonApprovato = post.stato === POST_STATUS.nonApprovato;
        if (!isRevisione && !isNonApprovato) return;
        posts.push({
          ...post,
          _projId:     proj.id,
          _clientId:   proj.clientId,
          _clientName: client?.name || "—",
          _isRevisione:    isRevisione,
          _isNonApprovato: isNonApprovato,
        });
      });
    });
    // Sort: overdue first, then by date
    return posts.sort((a, b) => {
      const da = a.data || "9999";
      const db = b.data || "9999";
      return da.localeCompare(db);
    });
  }, [projects, clients]);

  // Filtered view
  const filtered = useMemo(() => allPending.filter(p => {
    if (filterClient !== "tutti" && p._clientId !== filterClient) return false;
    if (filterStato === "pending"       && !p._isRevisione) return false;
    if (filterStato === "non-approvato" && !p._isNonApprovato) return false;
    return true;
  }), [allPending, filterClient, filterStato]);

  // Grouped by client
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(p => {
      if (!map[p._clientId]) map[p._clientId] = [];
      map[p._clientId].push(p);
    });
    return map;
  }, [filtered]);

  // Stats
  const today    = todayISO();
  const pendingN = allPending.filter(p => p._isRevisione).length;
  const rejectedN = allPending.filter(p => p._isNonApprovato).length;
  const urgentN  = allPending.filter(p => p._isRevisione && p.data && Math.ceil((new Date(p.data + "T12:00:00") - new Date()) / 86400000) <= 2).length;

  // Update helper — applies stato change to the correct project
  const updatePostStato = useCallback((postId, newStato, extra = {}) => {
    const post = allPending.find(p => p.id === postId);
    if (!post) return;
    const proj = projects.find(p => p.id === post._projId);
    if (!proj) return;

    const updatedProj = {
      ...proj,
      ed: {
        ...proj.ed,
        feedItems: (proj.ed?.feedItems || []).map(f =>
          f.id === postId ? { ...f, stato: newStato, ...extra } : f
        ),
        contentItems: (proj.ed?.contentItems || []).map(f =>
          f.id === postId ? { ...f, stato: newStato, status: newStato, ...extra } : f
        ),
      },
    };
    onUpdateProject?.(updatedProj);
  }, [allPending, projects, onUpdateProject]);

  const handleApprove = useCallback((id) => {
    updatePostStato(id, POST_STATUS.approvato, { approvedAt: Date.now() });
    setJustApproved(s => new Set([...s, id]));
  }, [updatePostStato]);

  const handleReject = useCallback((id) => {
    updatePostStato(id, POST_STATUS.nonApprovato);
  }, [updatePostStato]);

  const handleRequestChanges = useCallback((id, note) => {
    updatePostStato(id, POST_STATUS.bozza, { feedbackNote: note, feedbackAt: Date.now() });
  }, [updatePostStato]);

  const clientsWithPending = clients.filter(c => grouped[c.id]?.length > 0);

  return (
    <div className="apr-shell">
      {/* ── TOPBAR ── */}
      <div className="apr-topbar">
        <div className="apr-topbar-left">
          <div className="apr-topbar-title">Approvazioni</div>
          <div className="apr-topbar-sub">Dashboard globale · tutti i clienti</div>
        </div>
        <div className="apr-stats-row">
          <div className="apr-stat apr-stat-warn">
            <div className="apr-stat-val">{pendingN}</div>
            <div className="apr-stat-lbl">In attesa</div>
          </div>
          <div className="apr-stat apr-stat-danger">
            <div className="apr-stat-val">{urgentN}</div>
            <div className="apr-stat-lbl">Urgenti ≤2g</div>
          </div>
          <div className="apr-stat apr-stat-neutral">
            <div className="apr-stat-val">{rejectedN}</div>
            <div className="apr-stat-lbl">Non approvati</div>
          </div>
          <div className="apr-stat apr-stat-ok">
            <div className="apr-stat-val">{justApproved.size}</div>
            <div className="apr-stat-lbl">Approvati ora</div>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="apr-filters">
        <div className="apr-filter-tabs">
          {[["pending","⏳ In attesa"],["non-approvato","❌ Non approvati"],["tutti","Tutti"]].map(([v,l]) => (
            <button key={v} className={`apr-filter-tab ${filterStato===v?"active":""}`} onClick={() => setFilterStato(v)}>
              {l}
              {v==="pending" && pendingN>0 && <span className="apr-filter-badge">{pendingN}</span>}
              {v==="non-approvato" && rejectedN>0 && <span className="apr-filter-badge apr-filter-badge-red">{rejectedN}</span>}
            </button>
          ))}
        </div>
        <select className="apr-select" value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="tutti">Tutti i clienti</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* ── CONTENT ── */}
      <div className="apr-body">
        {filtered.length === 0 ? (
          <div className="apr-empty">
            <div className="apr-empty-icon">
              {filterStato === "pending" ? "🎉" : "📭"}
            </div>
            <div className="apr-empty-title">
              {filterStato === "pending" ? "Nessun contenuto in attesa di approvazione" : "Nessun elemento"}
            </div>
            <div className="apr-empty-sub">
              {filterStato === "pending"
                ? "Il team ha completato tutte le revisioni. I contenuti sono pronti per la pubblicazione."
                : "Nessun contenuto corrisponde ai filtri selezionati."}
            </div>
          </div>
        ) : (
          clientsWithPending.map(client => (
            grouped[client.id]?.length > 0 && (
              <ClientGroup
                key={client.id}
                client={client}
                clientColor={clientColorMap[client.id] || "#9CA3AF"}
                posts={grouped[client.id]}
                projMap={projMap}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestChanges={handleRequestChanges}
                onGoToProject={onGoToProject}
              />
            )
          ))
        )}
      </div>
    </div>
  );
}

export default GlobalApprovalsView;

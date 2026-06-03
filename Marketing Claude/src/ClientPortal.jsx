// ClientPortal.jsx — Read-only client-facing view.
// Access: /c/{projectId}/{token}
// Shows: pending approvals, funnel view, meta insights.
// No admin features, no cross-project access.

import { useState, useEffect, useMemo } from "react";
import { loadWorkspace, saveWorkspace } from "./services/storageService.js";
import { validateClientToken } from "./utils/clientAuth.js";
import MetaInsightsPanel from "./modules/editorial/MetaInsightsPanel.jsx";
import FunnelViewED from "./modules/editorial/FunnelViewED.jsx";
import { getFeedItems } from "./modules/editorial/editorialModel.js";

const TABS = [
  { id: "approvals", label: "📋 Approvazioni" },
  { id: "funnel",    label: "🎯 Funnel" },
  { id: "insights",  label: "📊 Meta Insights" },
];

const STATUS_COLORS = {
  revisione:     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  semaforo:      { bg: "#fefce8", text: "#a16207", border: "#fde047" },
  "non-approvato": { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
};

const PLATFORM_ICONS = {
  instagram: "📸", facebook: "📘", tiktok: "🎵",
  linkedin: "💼", youtube: "▶️", email: "📧", blog: "📝",
};

export default function ClientPortal({ projectId, token }) {
  const [project, setProject]   = useState(null);
  const [authErr, setAuthErr]   = useState(null);
  const [activeTab, setActiveTab] = useState("approvals");
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  // Load and validate
  useEffect(() => {
    const ws = loadWorkspace();
    if (!ws.ok) { setAuthErr("Impossibile caricare i dati."); return; }

    const proj = (ws.projects || []).find((p) => p.id === projectId);
    if (!proj) { setAuthErr("Progetto non trovato."); return; }
    if (!validateClientToken(proj, token)) {
      setAuthErr("Link non valido o scaduto. Richiedi un nuovo link all'agenzia.");
      return;
    }
    setProject(proj);
  }, [projectId, token]);

  const pendingPosts = useMemo(() => {
    if (!project) return [];
    const feed = getFeedItems(project);
    return feed.filter((p) =>
      ["revisione", "semaforo", "non-approvato"].includes(p.stato)
    ).sort((a, b) => (a.dataPubblicazione || "").localeCompare(b.dataPubblicazione || ""));
  }, [project]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function updatePostStatus(postId, newStato, note = "") {
    setSaving(true);
    const ws = loadWorkspace();
    if (!ws.ok) { setSaving(false); showToast("Errore salvataggio", "error"); return; }

    const projIdx = (ws.projects || []).findIndex((p) => p.id === projectId);
    if (projIdx === -1) { setSaving(false); return; }

    const proj = ws.projects[projIdx];
    const feed = getFeedItems(proj).map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        stato: newStato,
        clientNote: note || p.clientNote,
        clientReviewedAt: new Date().toISOString(),
      };
    });

    ws.projects[projIdx] = {
      ...proj,
      ed: { ...(proj.ed || {}), feedItems: feed },
    };

    const saved = saveWorkspace(ws);
    setSaving(false);
    if (!saved.ok) { showToast("Errore durante il salvataggio", "error"); return; }

    setProject(ws.projects[projIdx]);
    showToast(
      newStato === "approvato" ? "✅ Post approvato!" : "🔄 Richiesta modifiche inviata"
    );
  }

  // ── Auth error ──────────────────────────────────────────────────────────
  if (authErr) {
    return (
      <div style={styles.authErrPage}>
        <div style={styles.authErrCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ margin: "0 0 8px", color: "#111" }}>Accesso non consentito</h2>
          <p style={{ color: "#666", margin: 0 }}>{authErr}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.authErrPage}>
        <div style={styles.spinner} />
      </div>
    );
  }

  const clientName = project.cliente || project.nome || "Cliente";

  // ── Main portal ─────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.agencyBadge}>Nassa Studio</div>
            <h1 style={styles.headerTitle}>{clientName}</h1>
          </div>
          <div style={styles.headerMeta}>
            Portale Cliente
          </div>
        </div>
        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                ...styles.tab,
                ...(activeTab === t.id ? styles.tabActive : {}),
              }}
            >
              {t.label}
              {t.id === "approvals" && pendingPosts.length > 0 && (
                <span style={styles.badge}>{pendingPosts.length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          borderColor: toast.type === "error" ? "#fca5a5" : "#86efac",
          color: toast.type === "error" ? "#b91c1c" : "#166534" }}>
          {toast.msg}
        </div>
      )}

      <main style={styles.main}>
        {/* ── APPROVALS ───────────────────────────────────────────── */}
        {activeTab === "approvals" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Contenuti in attesa di approvazione</h2>
              <p style={styles.sectionSub}>
                Rivedi i post proposti dall'agenzia e approva o richiedi modifiche.
              </p>
            </div>

            {pendingPosts.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <p>Nessun contenuto in attesa. Tutto approvato!</p>
              </div>
            ) : (
              <div style={styles.postGrid}>
                {pendingPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onApprove={() => updatePostStatus(post.id, "approvato")}
                    onReject={(note) => updatePostStatus(post.id, "non-approvato", note)}
                    saving={saving}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FUNNEL ──────────────────────────────────────────────── */}
        {activeTab === "funnel" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Strategia Funnel</h2>
              <p style={styles.sectionSub}>
                Distribuzione dei contenuti per fase del funnel di marketing.
              </p>
            </div>
            <FunnelViewED project={project} onUpdate={() => {}} readOnly />
          </div>
        )}

        {/* ── META INSIGHTS ───────────────────────────────────────── */}
        {activeTab === "insights" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Meta Insights</h2>
              <p style={styles.sectionSub}>
                Performance organica delle pagine collegate.
              </p>
            </div>
            <MetaInsightsPanel project={project} onUpdate={() => {}} readOnly />
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <span>Powered by <strong>Nassa Studio</strong></span>
      </footer>
    </div>
  );
}

// ── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post, onApprove, onReject, saving }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [note, setNote]             = useState("");

  const platform = (post.canale || post.channel || "").toLowerCase();
  const icon     = PLATFORM_ICONS[platform] || "📄";
  const dateStr  = post.dataPubblicazione
    ? new Date(post.dataPubblicazione).toLocaleDateString("it-IT", { day: "numeric", month: "long" })
    : "Data non fissata";

  const stato    = post.stato || "revisione";
  const colors   = STATUS_COLORS[stato] || STATUS_COLORS.revisione;

  const daysLeft = post.dataPubblicazione
    ? Math.ceil((new Date(post.dataPubblicazione) - Date.now()) / 86400000)
    : null;

  return (
    <div style={{ ...styles.card, borderColor: colors.border }}>
      {/* Status badge + urgency */}
      <div style={styles.cardTop}>
        <span style={{ ...styles.statusBadge, background: colors.bg, color: colors.text, borderColor: colors.border }}>
          {stato === "revisione" ? "In revisione" : stato === "semaforo" ? "Semaforo" : "Modifiche richieste"}
        </span>
        {daysLeft !== null && (
          <span style={{ fontSize: 12, color: daysLeft <= 2 ? "#dc2626" : daysLeft <= 5 ? "#d97706" : "#6b7280" }}>
            {daysLeft <= 0 ? "⚠️ Scaduto" : `📅 tra ${daysLeft} giorn${daysLeft === 1 ? "o" : "i"}`}
          </span>
        )}
      </div>

      {/* Media thumbnail */}
      {post.mediaUrl && (
        <div style={styles.thumb}>
          <img
            src={post.mediaUrl}
            alt=""
            style={styles.thumbImg}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      )}

      {/* Content */}
      <div style={styles.cardBody}>
        <div style={styles.cardMeta}>
          <span>{icon} {platform || "Social"}</span>
          <span>📅 {dateStr}</span>
        </div>
        <h3 style={styles.cardTitle}>{post.titolo || post.title || "Post senza titolo"}</h3>
        {post.caption && (
          <p style={styles.cardCaption}>
            {post.caption.length > 200 ? post.caption.slice(0, 200) + "…" : post.caption}
          </p>
        )}
        {post.clientNote && (
          <div style={styles.prevNote}>
            <strong>Nota precedente:</strong> {post.clientNote}
          </div>
        )}
      </div>

      {/* Actions */}
      {!rejectMode ? (
        <div style={styles.cardActions}>
          <button
            style={{ ...styles.btn, ...styles.btnApprove }}
            onClick={onApprove}
            disabled={saving || stato === "approvato"}
          >
            ✅ Approva
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnReject }}
            onClick={() => setRejectMode(true)}
            disabled={saving}
          >
            ✏️ Richiedi modifiche
          </button>
        </div>
      ) : (
        <div style={styles.rejectBox}>
          <textarea
            placeholder="Descrivi le modifiche richieste..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.rejectTextarea}
            rows={3}
          />
          <div style={styles.cardActions}>
            <button
              style={{ ...styles.btn, ...styles.btnReject }}
              onClick={() => { onReject(note); setRejectMode(false); setNote(""); }}
              disabled={saving || !note.trim()}
            >
              Invia richiesta
            </button>
            <button
              style={{ ...styles.btn, background: "#f3f4f6", color: "#374151" }}
              onClick={() => { setRejectMode(false); setNote(""); }}
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" },

  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 },
  headerInner: { maxWidth: 900, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  agencyBadge: { fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#111" },
  headerMeta: { fontSize: 13, color: "#9ca3af", fontStyle: "italic" },

  tabs: { maxWidth: 900, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, borderTop: "1px solid #f1f5f9" },
  tab: { padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "#6b7280", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
  tabActive: { color: "#006EFF", borderBottomColor: "#006EFF", fontWeight: 600 },
  badge: { background: "#dc2626", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 11, fontWeight: 700 },

  toast: { position: "fixed", top: 16, right: 16, zIndex: 100, padding: "12px 20px", borderRadius: 8, border: "1px solid", fontSize: 14, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,.1)" },

  main: { maxWidth: 900, margin: "0 auto", padding: "32px 20px" },

  sectionHeader: { marginBottom: 24 },
  sectionTitle: { margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#111" },
  sectionSub: { margin: 0, color: "#6b7280", fontSize: 14 },

  emptyState: { textAlign: "center", padding: "64px 20px", color: "#6b7280" },

  postGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },

  card: { background: "#fff", borderRadius: 12, border: "1px solid", overflow: "hidden", display: "flex", flexDirection: "column" },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 0" },
  statusBadge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid" },
  thumb: { width: "100%", aspectRatio: "1", overflow: "hidden", background: "#f3f4f6" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: "12px 16px", flex: 1 },
  cardMeta: { display: "flex", gap: 12, fontSize: 12, color: "#6b7280", marginBottom: 6 },
  cardTitle: { margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "#111" },
  cardCaption: { margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 },
  prevNote: { marginTop: 8, fontSize: 12, color: "#92400e", background: "#fffbeb", borderRadius: 6, padding: "6px 10px" },

  cardActions: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #f3f4f6" },
  btn: { flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
  btnApprove: { background: "#f0fdf4", color: "#166534" },
  btnReject: { background: "#fef2f2", color: "#b91c1c" },

  rejectBox: { borderTop: "1px solid #f3f4f6", padding: "12px 16px" },
  rejectTextarea: { width: "100%", boxSizing: "border-box", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 8 },

  authErrPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" },
  authErrCard: { background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: 360 },
  spinner: { width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#006EFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  footer: { textAlign: "center", padding: "24px", color: "#9ca3af", fontSize: 13, borderTop: "1px solid #f1f5f9" },
};

// ClientPortal.jsx — Token-gated client-facing portal.
// Route: /c/{clientId}/{token}
// Shows: pending approvals, funnel view, meta insights.
// No admin access.

import { useState, useEffect, useMemo } from "react";
import { safeLoadWorkspace, safeSaveWorkspace } from "./services/storageService.js";
import { validateClientToken } from "./utils/clientAuth.js";
import { MetaInsightsPanel } from "./modules/editorial/MetaInsightsPanel.jsx";
import { FunnelViewED } from "./modules/editorial/FunnelViewED.jsx";
import { getEditorialPosts } from "./modules/editorial/editorialModel.js";
import PlatformPreview from "./modules/editorial/PlatformPreview.jsx";

const TABS = [
  { id: "approvals", label: "📋 Approvazioni" },
  { id: "funnel",    label: "🎯 Funnel" },
  { id: "insights",  label: "📊 Meta Insights" },
];

const STATUS_COLORS = {
  revisione:        { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  semaforo:         { bg: "#fefce8", text: "#a16207", border: "#fde047" },
  "non-approvato":  { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
};

const PLATFORM_ICONS = {
  instagram: "📸", facebook: "📘", tiktok: "🎵",
  linkedin: "💼", youtube: "▶️", email: "📧", blog: "📝",
};

export default function ClientPortal({ clientId, token }) {
  const [client,    setClient]    = useState(null);
  const [projects,  setProjects]  = useState([]);
  const [authErr,   setAuthErr]   = useState(null);
  const [activeTab, setActiveTab] = useState("approvals");
  const [toast,     setToast]     = useState(null);

  useEffect(() => {
    (async () => {
    const ws = await safeLoadWorkspace();
    if (!ws.ok || !ws.data) { setAuthErr("Impossibile caricare i dati."); return; }

    const cl = (ws.data.clients || []).find((c) => c.id === clientId);
    if (!cl) { setAuthErr("Cliente non trovato."); return; }
    if (!validateClientToken(cl, token)) {
      setAuthErr("Link non valido o scaduto. Richiedi un nuovo link all'agenzia.");
      return;
    }
    const clientProjects = (ws.data.projects || []).filter((p) => p.clientId === clientId);
    setClient(cl);
    setProjects(clientProjects);
    })();
  }, [clientId, token]);

  const pendingPosts = useMemo(() => {
    return projects.flatMap((proj) =>
      getEditorialPosts(proj)
        .filter((p) => ["revisione", "semaforo", "non-approvato"].includes(p.stato))
        .map((p) => ({ ...p, _projId: proj.id, _projName: proj.name }))
    ).sort((a, b) => (a.data || "").localeCompare(b.data || ""));
  }, [projects]);

  const primaryProject = projects[0] || null;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function updatePostStatus(postId, projId, newStato, note = "") {
    const ws = await safeLoadWorkspace();
    if (!ws.ok || !ws.data) { showToast("Errore salvataggio", "error"); return; }

    const allProjects = ws.data.projects || [];
    const projIdx = allProjects.findIndex((p) => p.id === projId);
    if (projIdx === -1) return;

    const proj = allProjects[projIdx];
    const feed = (proj.ed?.feedItems || []).map((p) => {
      if (p.id !== postId) return p;
      return { ...p, stato: newStato, clientNote: note || p.clientNote, clientReviewedAt: new Date().toISOString() };
    });

    allProjects[projIdx] = { ...proj, ed: { ...(proj.ed || {}), feedItems: feed } };

    const saved = await safeSaveWorkspace({ ...ws.data, projects: allProjects });
    if (!saved.ok) { showToast("Errore durante il salvataggio", "error"); return; }

    setProjects(allProjects.filter((p) => p.clientId === clientId));
    showToast(newStato === "approvato" ? "✅ Post approvato!" : "🔄 Richiesta modifiche inviata");
  }

  if (authErr) {
    return (
      <div style={s.centerPage}>
        <div style={s.authCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ margin: "0 0 8px", color: "#111" }}>Accesso non consentito</h2>
          <p style={{ color: "#666", margin: 0 }}>{authErr}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return <div style={s.centerPage}><div style={s.spinner} /></div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.agencyBadge}>Nassa Studio</div>
            <h1 style={s.headerTitle}>{client.nome}</h1>
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>Portale Cliente</div>
        </div>
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : {}) }}>
              {t.label}
              {t.id === "approvals" && pendingPosts.length > 0 && (
                <span style={s.badge}>{pendingPosts.length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div style={{ ...s.toast,
          background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          borderColor: toast.type === "error" ? "#fca5a5" : "#86efac",
          color: toast.type === "error" ? "#b91c1c" : "#166534" }}>
          {toast.msg}
        </div>
      )}

      <main style={s.main}>
        {activeTab === "approvals" && (
          <div>
            <div style={s.sectionHdr}>
              <h2 style={s.sectionTitle}>Contenuti in attesa di approvazione</h2>
              <p style={s.sectionSub}>Approva o richiedi modifiche ai post proposti dall'agenzia.</p>
            </div>
            {pendingPosts.length === 0
              ? <div style={s.empty}><div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div><p>Tutto approvato!</p></div>
              : <div style={s.grid}>{pendingPosts.map((post) => (
                  <PostCard key={post.id} post={post}
                    onApprove={() => updatePostStatus(post.id, post._projId, "approvato")}
                    onReject={(note) => updatePostStatus(post.id, post._projId, "non-approvato", note)} />
                ))}</div>
            }
          </div>
        )}

        {activeTab === "funnel" && primaryProject && (
          <div>
            <div style={s.sectionHdr}>
              <h2 style={s.sectionTitle}>Strategia Funnel</h2>
              <p style={s.sectionSub}>Distribuzione contenuti per fase del funnel.</p>
            </div>
            <FunnelViewED project={primaryProject} onUpdate={() => {}} readOnly />
          </div>
        )}

        {activeTab === "insights" && (
          <div>
            <div style={s.sectionHdr}>
              <h2 style={s.sectionTitle}>Meta Insights</h2>
              <p style={s.sectionSub}>Performance organica delle pagine collegate.</p>
            </div>
            <MetaInsightsPanel client={client} readOnly />
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: 24, color: "#9ca3af", fontSize: 13 }}>
        Powered by <strong>Nassa Studio</strong>
      </footer>
    </div>
  );
}

function PostCard({ post, onApprove, onReject }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [note, setNote]             = useState("");
  const platform = (post.canale || (post.piattaforme || [])[0] || "").toLowerCase();
  const stato    = post.stato || "revisione";
  const colors   = STATUS_COLORS[stato] || STATUS_COLORS.revisione;
  const daysLeft = post.data
    ? Math.ceil((new Date(post.data) - Date.now()) / 86400000)
    : null;

  return (
    <div style={{ ...s.card, borderColor: colors.border }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 0" }}>
        <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid",
          background: colors.bg, color: colors.text, borderColor: colors.border }}>
          {stato === "revisione" ? "In revisione" : stato === "semaforo" ? "Semaforo" : "Modifiche richieste"}
        </span>
        {daysLeft !== null && (
          <span style={{ fontSize: 12, color: daysLeft <= 2 ? "#dc2626" : daysLeft <= 5 ? "#d97706" : "#6b7280" }}>
            {daysLeft <= 0 ? "⚠️ Scaduto" : `📅 tra ${daysLeft}gg`}
          </span>
        )}
      </div>

      {/* Platform-specific preview */}
      <div style={{ padding: "8px 12px" }}>
        <PlatformPreview post={post} projectName={post._projName || "Brand"} />
      </div>

      <div style={{ padding: "12px 16px", flex: 1 }}>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
          <span>{PLATFORM_ICONS[platform] || "📄"} {platform || "Social"}</span>
          {post.data && <span>📅 {new Date(post.data).toLocaleDateString("it-IT", { day: "numeric", month: "long" })}</span>}
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "#111" }}>
          {post.titolo || post.title || "Post senza titolo"}
        </h3>
        {post.caption && (
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
            {post.caption.length > 200 ? post.caption.slice(0, 200) + "…" : post.caption}
          </p>
        )}
        {post.clientNote && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#92400e", background: "#fffbeb", borderRadius: 6, padding: "6px 10px" }}>
            <strong>Nota:</strong> {post.clientNote}
          </div>
        )}
        {post._projName && (
          <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>Progetto: {post._projName}</div>
        )}
      </div>

      {!rejectMode ? (
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
          <button style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, background: "#f0fdf4", color: "#166534", fontFamily: "inherit" }}
            onClick={onApprove}>✅ Approva</button>
          <button style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, background: "#fef2f2", color: "#b91c1c", fontFamily: "inherit" }}
            onClick={() => setRejectMode(true)}>✏️ Modifiche</button>
        </div>
      ) : (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "12px 16px" }}>
          <textarea placeholder="Descrivi le modifiche richieste…" value={note}
            onChange={(e) => setNote(e.target.value)} rows={3}
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "8px 12px", fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, background: "#fef2f2", color: "#b91c1c", fontFamily: "inherit" }}
              onClick={() => { onReject(note); setRejectMode(false); setNote(""); }}
              disabled={!note.trim()}>Invia richiesta</button>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, background: "#f3f4f6", color: "#374151", fontFamily: "inherit" }}
              onClick={() => { setRejectMode(false); setNote(""); }}>Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:        { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" },
  centerPage:  { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" },
  authCard:    { background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: 360 },
  spinner:     { width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#006EFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header:      { background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 },
  headerInner: { maxWidth: 900, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  agencyBadge: { fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#111" },
  tabs:        { maxWidth: 900, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4 },
  tab:         { padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "#6b7280", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
  tabActive:   { color: "#006EFF", borderBottomColor: "#006EFF", fontWeight: 600 },
  badge:       { background: "#dc2626", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 11, fontWeight: 700 },
  toast:       { position: "fixed", top: 16, right: 16, zIndex: 100, padding: "12px 20px", borderRadius: 8, border: "1px solid", fontSize: 14, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,.1)" },
  main:        { maxWidth: 900, margin: "0 auto", padding: "32px 20px" },
  sectionHdr:  { marginBottom: 24 },
  sectionTitle:{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#111" },
  sectionSub:  { margin: 0, color: "#6b7280", fontSize: 14 },
  empty:       { textAlign: "center", padding: "64px 20px", color: "#6b7280" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
  card:        { background: "#fff", borderRadius: 12, border: "1px solid", overflow: "hidden", display: "flex", flexDirection: "column" },
};

// ClientMetaConnect.jsx — Per-project Meta OAuth connection.
// Use this inside a project settings panel instead of (or alongside) GlobalMetaConnect.
// Stores tokens in project.meta rather than global workspace meta.

import { useState } from "react";
import { openMetaOAuth, checkTokenExpiry, serializeMetaError } from "../../services/metaService.js";

export default function ClientMetaConnect({ project, onUpdate }) {
  const meta      = project?.meta || {};
  const pages     = meta.pages || [];
  const connected = pages.length > 0 && meta.longToken;

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [pageModal, setPageModal] = useState(false);
  const [availPages, setAvailPages] = useState([]);

  const expiry = connected ? checkTokenExpiry(meta) : null;

  async function connect() {
    setLoading(true);
    setError(null);
    try {
      const result = await openMetaOAuth();
      if (!result?.pages?.length) throw new Error("Nessuna pagina trovata. Verifica i permessi dell'app Meta.");
      setAvailPages(result.pages);
      setPageModal(true);
    } catch (err) {
      setError(serializeMetaError(err));
    } finally {
      setLoading(false);
    }
  }

  function selectPage(page) {
    onUpdate({
      ...project,
      meta: {
        ...(project.meta || {}),
        longToken:  availPages._longToken || meta.longToken,
        expiresAt:  availPages._expiresAt || meta.expiresAt,
        pages:      availPages,
        primaryPage: page,
        connectedAt: new Date().toISOString(),
      },
    });
    setPageModal(false);
  }

  function disconnect() {
    onUpdate({ ...project, meta: {} });
  }

  // Helper passed from openMetaOAuth — stash tokens on availPages array
  async function handleOAuth() {
    setLoading(true);
    setError(null);
    try {
      const result = await new Promise((resolve, reject) => {
        openMetaOAuth(resolve, reject);
      });
      const pages = result.pages || [];
      pages._longToken = result.longToken;
      pages._expiresAt = result.expiresAt;
      setAvailPages(pages);
      setPageModal(true);
    } catch (err) {
      setError(serializeMetaError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.icon}>📘</div>
        <div>
          <div style={s.title}>Meta — {project.cliente || project.nome}</div>
          <div style={s.sub}>Collega Facebook & Instagram di questo cliente</div>
        </div>
      </div>

      {error && (
        <div style={s.errBanner}>
          {error}
          <button style={s.errClose} onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {!connected ? (
        <button style={s.connectBtn} onClick={handleOAuth} disabled={loading}>
          {loading ? "Connessione…" : "🔗 Connetti account Meta"}
        </button>
      ) : (
        <div style={s.connectedBox}>
          <div style={s.connRow}>
            <span style={s.connDot(expiry)} />
            <span style={s.connName}>{meta.primaryPage?.name || "Pagina connessa"}</span>
            {expiry?.warning && (
              <span style={s.expWarning}>⚠️ Scade tra {expiry.daysLeft}gg</span>
            )}
          </div>

          <div style={s.pageList}>
            {pages.map((p) => (
              <div key={p.id} style={s.pageItem}>
                <span>{p.name}</span>
                {p.instagram && <span style={s.igBadge}>📸 Instagram</span>}
              </div>
            ))}
          </div>

          <div style={s.actions}>
            <button style={s.reConnBtn} onClick={handleOAuth} disabled={loading}>
              🔄 Riconnetti
            </button>
            <button style={s.discBtn} onClick={disconnect}>
              Disconnetti
            </button>
          </div>
        </div>
      )}

      {/* Page selection modal */}
      {pageModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ margin: "0 0 4px" }}>Seleziona la pagina principale</h3>
            <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: 14 }}>
              Scegli la pagina Facebook da usare come principale per questo cliente.
            </p>
            {availPages.map((p) => (
              <button key={p.id} style={s.pageBtn} onClick={() => selectPage(p)}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                {p.instagram && <span style={s.igBadge}>📸 IG Business</span>}
              </button>
            ))}
            <button style={s.cancelBtn} onClick={() => setPageModal(false)}>Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap:        { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 },
  header:      { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 },
  icon:        { fontSize: 28 },
  title:       { fontWeight: 700, fontSize: 15, color: "#111" },
  sub:         { fontSize: 13, color: "#6b7280" },
  errBanner:   { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" },
  errClose:    { background: "none", border: "none", cursor: "pointer", color: "#b91c1c", fontSize: 16 },
  connectBtn:  { width: "100%", padding: "10px 16px", background: "#1877f2", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  connectedBox:{ background: "#f8fafc", borderRadius: 8, padding: 14 },
  connRow:     { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  connDot:     (exp) => ({ width: 8, height: 8, borderRadius: "50%", background: exp?.expired ? "#dc2626" : exp?.warning ? "#f59e0b" : "#22c55e", flexShrink: 0 }),
  connName:    { fontWeight: 600, fontSize: 14, color: "#111" },
  expWarning:  { fontSize: 12, color: "#d97706", marginLeft: "auto" },
  pageList:    { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  pageItem:    { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" },
  igBadge:     { fontSize: 11, background: "#fdf2f8", color: "#9333ea", borderRadius: 6, padding: "2px 6px", fontWeight: 600 },
  actions:     { display: "flex", gap: 8 },
  reConnBtn:   { flex: 1, padding: "7px 12px", background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  discBtn:     { padding: "7px 12px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modal:       { background: "#fff", borderRadius: 16, padding: 28, maxWidth: 400, width: "90%", maxHeight: "80vh", overflowY: "auto" },
  pageBtn:     { width: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 8, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontFamily: "inherit" },
  cancelBtn:   { width: "100%", padding: "10px", background: "#f3f4f6", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginTop: 4 },
};

// GlobalMetaConnect.jsx
// Global Business Manager token entry — no OAuth popup.
// Paste long-lived BM token → fetches all pages + IG accounts → stored in globalMeta.
// Shows page-to-client assignments for visibility.

import { useState } from "react";
import { fetchPagesFromToken, checkTokenExpiry } from "../../services/metaService";

export function GlobalMetaConnect({ globalMeta, onMetaChange, clients = [] }) {
  const [inputToken, setInputToken] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showInput,  setShowInput]  = useState(false);
  const [showPages,  setShowPages]  = useState(false);

  async function connect() {
    const t = inputToken.trim();
    if (!t) { setError("Incolla il token BM prima di continuare."); return; }
    setLoading(true);
    setError("");
    const result = await fetchPagesFromToken(t);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    if (!result.pages.length) { setError("Nessuna pagina trovata. Verifica i permessi del token."); return; }

    const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;
    onMetaChange?.({
      bmToken:     t,
      allPages:    result.pages,
      nome:        result.pages[0]?.nome || "Business Manager",
      connectedAt: Date.now(),
      expiresAt:   Date.now() + SIXTY_DAYS,
    });
    setInputToken("");
    setShowInput(false);
  }

  function disconnect() {
    if (window.confirm("Disconnettere Meta? Le connessioni dei clienti rimarranno salvate.")) {
      onMetaChange?.(null);
      setShowInput(false);
      setError("");
    }
  }

  // Build page → client mapping
  function getPageClientMap() {
    const map = {};
    for (const client of clients) {
      const pageId = client?.meta?.fbPageId;
      if (pageId) {
        map[pageId] = client.nome || client.name || "—";
      }
    }
    return map;
  }

  // ── Connected state ──────────────────────────────────────────────────────
  if (globalMeta?.allPages?.length) {
    const expiry = checkTokenExpiry(globalMeta);
    const pageClientMap = getPageClientMap();
    const assignedCount = Object.keys(pageClientMap).length;

    return (
      <div>
        {expiry.warn && (
          <div style={s.warnBanner}>
            ⚠ {expiry.message}
          </div>
        )}
        <div className="gm-status">
          <span className={expiry.warn ? "meta-dot-warn" : "meta-dot-ok"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.connName}>{globalMeta.nome || "Business Manager"}</div>
            <div style={s.connSub}>
              {globalMeta.allPages.length} pagine · {assignedCount} assegnate
              {expiry.daysLeft != null ? ` · ${expiry.daysLeft}gg` : ""}
            </div>
          </div>
          <button style={s.iconBtn} title="Mostra pagine" onClick={() => setShowPages(v => !v)}>📋</button>
          <button style={s.iconBtn} title="Aggiorna token" onClick={() => setShowInput(v => !v)}>✏️</button>
          <button style={s.iconBtn} title="Disconnetti" onClick={disconnect}>×</button>
        </div>

        {/* Page-to-client mapping */}
        {showPages && (
          <div style={s.pageList}>
            {globalMeta.allPages.map(page => {
              const assignedTo = pageClientMap[page.id];
              return (
                <div key={page.id} style={s.pageRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.pageName}>{page.nome}</div>
                    <div style={s.pagePlatforms}>
                      <span style={s.fbTag}>FB</span>
                      {page.igId ? <span style={s.igTag}>IG</span> : <span style={s.noIgTag}>No IG</span>}
                    </div>
                  </div>
                  {assignedTo
                    ? <span style={s.assignedBadge}>✓ {assignedTo}</span>
                    : <span style={s.unassignedBadge}>Non assegnata</span>
                  }
                </div>
              );
            })}
          </div>
        )}

        {showInput && (
          <div style={s.inputBox}>
            <input
              style={s.tokenInput}
              type="password"
              placeholder="Nuovo token BM…"
              value={inputToken}
              onChange={e => setInputToken(e.target.value)}
              onKeyDown={e => e.key === "Enter" && connect()}
            />
            <button style={s.connectBtn} onClick={connect} disabled={loading}>
              {loading ? "…" : "Aggiorna"}
            </button>
            {error && <div style={s.errorTxt}>{error}</div>}
          </div>
        )}
      </div>
    );
  }

  // ── Disconnected state ───────────────────────────────────────────────────
  return (
    <div>
      {!showInput ? (
        <button className="sb-meta-btn" onClick={() => setShowInput(true)}>
          🔗 Connetti Meta
        </button>
      ) : (
        <div style={s.inputBox}>
          <div style={s.inputLabel}>Token Business Manager</div>
          <input
            style={s.tokenInput}
            type="password"
            placeholder="Incolla token long-lived…"
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && connect()}
            autoFocus
          />
          <div style={s.hint}>
            Meta Business Suite → Impostazioni → Account di sistema → Token
          </div>
          {error && <div style={s.errorTxt}>{error}</div>}
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button style={s.connectBtn} onClick={connect} disabled={loading}>
              {loading ? "Connessione…" : "Connetti"}
            </button>
            <button style={s.cancelBtn} onClick={() => { setShowInput(false); setError(""); setInputToken(""); }}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  warnBanner:    { fontSize: 9, color: "#C2185B", background: "rgba(194,24,91,.08)", borderRadius: 4, padding: "4px 8px", marginBottom: 4, fontWeight: 600 },
  connName:      { fontSize: 10, fontWeight: 700, color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  connSub:       { fontSize: 9, color: "#64748B" },
  iconBtn:       { background: "none", border: "none", color: "#475569", fontSize: 10, cursor: "pointer", flexShrink: 0, padding: "0 2px" },
  inputBox:      { marginTop: 6, display: "flex", flexDirection: "column", gap: 4 },
  inputLabel:    { fontSize: 10, fontWeight: 600, color: "#64748B" },
  tokenInput:    { width: "100%", padding: "6px 8px", fontSize: 11, border: "1px solid #CBD5E1", borderRadius: 6, background: "#F8FAFC", fontFamily: "monospace", boxSizing: "border-box" },
  hint:          { fontSize: 9, color: "#94A3B8", lineHeight: 1.3 },
  errorTxt:      { fontSize: 10, color: "#C2185B", fontWeight: 600 },
  connectBtn:    { flex: 1, padding: "5px 10px", background: "#1877F2", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  cancelBtn:     { padding: "5px 10px", background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
  // Page list styles
  pageList:      { marginTop: 6, display: "flex", flexDirection: "column", gap: 3 },
  pageRow:       { display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", background: "#F8FAFC", borderRadius: 4, fontSize: 10 },
  pageName:      { fontSize: 10, fontWeight: 600, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  pagePlatforms: { display: "flex", gap: 3, marginTop: 1 },
  fbTag:         { fontSize: 8, fontWeight: 700, color: "#1877F2", background: "rgba(24,119,242,.08)", padding: "1px 4px", borderRadius: 3 },
  igTag:         { fontSize: 8, fontWeight: 700, color: "#E1306C", background: "rgba(225,48,108,.08)", padding: "1px 4px", borderRadius: 3 },
  noIgTag:       { fontSize: 8, color: "#94A3B8", padding: "1px 4px" },
  assignedBadge: { fontSize: 9, fontWeight: 600, color: "#16A34A", background: "rgba(22,163,74,.08)", padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0 },
  unassignedBadge: { fontSize: 9, color: "#94A3B8", fontStyle: "italic", whiteSpace: "nowrap", flexShrink: 0 },
};

export default GlobalMetaConnect;

// GlobalMetaConnect.jsx
// Global Business Manager token entry — no OAuth popup.
// Paste long-lived BM token → fetches all pages + IG accounts → stored in globalMeta.

import { useState } from "react";
import { fetchPagesFromToken, checkTokenExpiry } from "../../services/metaService";

export function GlobalMetaConnect({ globalMeta, onMetaChange }) {
  const [inputToken, setInputToken] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showInput,  setShowInput]  = useState(false);

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

  // ── Connected state ──────────────────────────────────────────────────────
  if (globalMeta?.allPages?.length) {
    const expiry = checkTokenExpiry(globalMeta);
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
              {globalMeta.allPages.length} pagine caricate
              {expiry.daysLeft != null ? ` · ${expiry.daysLeft}gg` : ""}
            </div>
          </div>
          <button style={s.iconBtn} title="Aggiorna token" onClick={() => setShowInput(v => !v)}>✏️</button>
          <button style={s.iconBtn} title="Disconnetti" onClick={disconnect}>×</button>
        </div>

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
  warnBanner:  { fontSize: 9, color: "#C2185B", background: "rgba(194,24,91,.08)", borderRadius: 4, padding: "4px 8px", marginBottom: 4, fontWeight: 600 },
  connName:    { fontSize: 10, fontWeight: 700, color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  connSub:     { fontSize: 9, color: "#64748B" },
  iconBtn:     { background: "none", border: "none", color: "#475569", fontSize: 10, cursor: "pointer", flexShrink: 0, padding: "0 2px" },
  inputBox:    { marginTop: 6, display: "flex", flexDirection: "column", gap: 4 },
  inputLabel:  { fontSize: 10, fontWeight: 600, color: "#64748B" },
  tokenInput:  { width: "100%", padding: "6px 8px", fontSize: 11, border: "1px solid #CBD5E1", borderRadius: 6, background: "#F8FAFC", fontFamily: "monospace", boxSizing: "border-box" },
  hint:        { fontSize: 9, color: "#94A3B8", lineHeight: 1.3 },
  errorTxt:    { fontSize: 10, color: "#C2185B", fontWeight: 600 },
  connectBtn:  { flex: 1, padding: "5px 10px", background: "#1877F2", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  cancelBtn:   { padding: "5px 10px", background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
};

export default GlobalMetaConnect;

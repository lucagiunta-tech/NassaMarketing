// ClientPortalLink.jsx — Admin widget to generate & copy the client portal URL.
// Drop this inside project settings or the project header.
// Props: project, onUpdate (saves updated project with clientToken)

import { useState } from "react";
import { ensureClientToken, buildClientUrl } from "../../utils/clientAuth.js";

export default function ClientPortalLink({ project, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  function getOrCreateToken() {
    const updated = ensureClientToken(project);
    if (!project.clientToken) onUpdate(updated);
    return updated;
  }

  function copyLink() {
    const proj = getOrCreateToken();
    const url  = buildClientUrl(proj.id, proj.clientToken);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
    setVisible(true);
  }

  function regenerateToken() {
    if (!window.confirm("Rigenerare il link? Il vecchio link smetterà di funzionare.")) return;
    const updated = { ...project, clientToken: null };
    const fresh   = ensureClientToken(updated);
    onUpdate(fresh);
    setVisible(true);
  }

  const proj = project.clientToken ? project : null;
  const url  = proj ? buildClientUrl(proj.id, proj.clientToken) : null;

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <div>
          <div style={s.label}>🔗 Link Portale Cliente</div>
          <div style={s.sub}>Condividi per far approvare i contenuti al cliente</div>
        </div>
        <button style={s.copyBtn} onClick={copyLink}>
          {copied ? "✅ Copiato!" : "📋 Copia link"}
        </button>
      </div>

      {(visible || url) && (
        <div style={s.urlBox}>
          <code style={s.urlText}>
            {url || buildClientUrl(project.id, "(genera link)")}
          </code>
          {url && (
            <button style={s.regenBtn} onClick={regenerateToken} title="Rigenera token">
              🔄
            </button>
          )}
        </div>
      )}

      <div style={s.note}>
        Il cliente vedrà: post in revisione, funnel strategico, Meta Insights.
        Nessun accesso al pannello admin.
      </div>
    </div>
  );
}

const s = {
  wrap:    { background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "14px 16px" },
  row:     { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 },
  label:   { fontWeight: 600, fontSize: 14, color: "#0369a1" },
  sub:     { fontSize: 12, color: "#0284c7", marginTop: 2 },
  copyBtn: { padding: "7px 14px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" },
  urlBox:  { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #bae6fd", borderRadius: 7, padding: "8px 12px", marginBottom: 8 },
  urlText: { flex: 1, fontSize: 12, color: "#374151", wordBreak: "break-all", fontFamily: "monospace" },
  regenBtn:{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 },
  note:    { fontSize: 12, color: "#0369a1" },
};

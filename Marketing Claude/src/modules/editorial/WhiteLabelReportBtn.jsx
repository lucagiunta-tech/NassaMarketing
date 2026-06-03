/**
 * WhiteLabelReportBtn.jsx
 * Bottone "📊 Report Cliente" con modal di anteprima e download.
 * Si posiziona nel project topbar o nella sezione Monthly Review.
 *
 * Props:
 *  project — progetto corrente
 *  client  — { name, color } opzionale
 */
import { useState, useCallback } from "react";
import { callClaude } from "../../services/aiService";
import { buildWhiteLabelReportHTML, downloadBlob } from "../../services/exportService";
import { getEditorialPosts, isPostPublished } from "./editorialModel";
import { buildCtx } from "../../templates/templateUtils";

const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

function currentMonth() {
  const n = new Date();
  return `${MONTHS_IT[n.getMonth()]} ${n.getFullYear()}`;
}

function buildInsightPrompt(project, month) {
  const posts    = getEditorialPosts(project);
  const pubPosts = posts.filter(isPostPublished);
  const ed       = project.ed || {};
  const latestLog = (ed.perfLogs || []).slice(-1)[0] || {};
  const kpiSnap  = Object.entries(latestLog).filter(([k,v]) => k !== "id" && v).map(([k,v]) => `${k}: ${v}`).join(" · ");
  const pillarMap = {};
  posts.forEach(p => { const pl = p.pilastro||"N/A"; pillarMap[pl]=(pillarMap[pl]||0)+1; });
  const pillarSnap = Object.entries(pillarMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}(${v})`).join(", ");

  return `Sei un consulente marketing di Nassa Studio. Scrivi un'analisi mensile concisa e professionale per il cliente.

CLIENTE: ${project.interview?.nome || project.name}
MESE: ${month}
POST TOTALI: ${posts.length} | PUBBLICATI: ${pubPosts.length}
PILASTRI: ${pillarSnap}
KPI PRINCIPALI: ${kpiSnap || "Non disponibili"}
CONTESTO BRAND: ${buildCtx(project.interview||{}).slice(0,400)}

Scrivi 3-4 paragrafi:
1. Sintesi delle performance del mese (cosa ha funzionato)
2. Un'area di miglioramento concreta (con dato se disponibile)
3. Una raccomandazione specifica per il mese prossimo
4. Prossimo passo operativo prioritario

Tono: professionale, diretto, orientato ai risultati. Zero aziendalese. Max 250 parole.`;
}

export function WhiteLabelReportBtn({ project, client }) {
  const [open,       setOpen]       = useState(false);
  const [month,      setMonth]      = useState(currentMonth());
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiInsight,  setAiInsight]  = useState("");
  const [generating, setGenerating] = useState(false);

  const generateInsight = useCallback(async () => {
    setAiLoading(true);
    try {
      const text = await callClaude(buildInsightPrompt(project, month), 600);
      setAiInsight(text);
    } catch {
      setAiInsight("Insight AI non disponibile. Aggiungi il tuo commento manualmente.");
    }
    setAiLoading(false);
  }, [project, month]);

  const downloadReport = useCallback(() => {
    setGenerating(true);
    const html = buildWhiteLabelReportHTML({ project, client, month, aiInsight });
    downloadBlob(`Report_${(client?.name || project.name).replace(/\s+/g,"_")}_${month.replace(/\s+/g,"_")}.html`, html, "text/html;charset=utf-8");
    setTimeout(() => setGenerating(false), 800);
  }, [project, client, month, aiInsight]);

  const posts     = getEditorialPosts(project);
  const published = posts.filter(isPostPublished).length;
  const ed        = project.ed || {};
  const allPosts  = [...(ed.feedItems||[]), ...(ed.contentItems||[])];

  return (
    <>
      {/* TRIGGER */}
      <button className="wlr-trigger-btn" onClick={() => setOpen(true)} title="Genera report mensile white-label per il cliente">
        📊 Report Cliente
      </button>

      {/* MODAL */}
      {open && (
        <div className="wlr-overlay" onClick={() => setOpen(false)}>
          <div className="wlr-modal" onClick={e => e.stopPropagation()}>

            {/* HEADER */}
            <div className="wlr-hd">
              <div>
                <div className="wlr-title">📊 Report Mensile Cliente</div>
                <div className="wlr-sub">White-label · brandizzato per {client?.name || project.name}</div>
              </div>
              <button className="wlr-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="wlr-body">
              {/* PREVIEW HEADER */}
              <div className="wlr-preview-hd" style={{ borderColor: client?.color || "#006EFF" }}>
                <div className="wlr-preview-eyebrow" style={{ color: client?.color || "#006EFF" }}>
                  Report Mensile
                </div>
                <div className="wlr-preview-client">{client?.name || project.name}</div>
                <div className="wlr-preview-month">{month}</div>
              </div>

              {/* MONTH SELECTOR */}
              <div className="wlr-field">
                <label className="wlr-label">Mese di riferimento</label>
                <input
                  className="wlr-input"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  placeholder="es. Giugno 2026"
                />
              </div>

              {/* QUICK STATS */}
              <div className="wlr-stats">
                {[
                  [allPosts.length, "Post totali"],
                  [published, "Pubblicati"],
                  [Object.keys([...allPosts].reduce((m,p)=>{ (p.piattaforme||[]).forEach(pl=>{m[pl]=1}); return m; },{})).length, "Canali attivi"],
                  [(project.ed?.perfLogs||[]).length, "Log performance"],
                ].map(([v, l]) => (
                  <div key={l} className="wlr-stat">
                    <div className="wlr-stat-val">{v}</div>
                    <div className="wlr-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>

              {/* AI INSIGHT */}
              <div className="wlr-field">
                <div className="wlr-label-row">
                  <label className="wlr-label">Analisi AI (opzionale)</label>
                  <button
                    className="wlr-ai-btn"
                    onClick={generateInsight}
                    disabled={aiLoading}>
                    {aiLoading ? "⏳ Generando…" : "✦ Genera con AI"}
                  </button>
                </div>
                <textarea
                  className="wlr-textarea"
                  value={aiInsight}
                  onChange={e => setAiInsight(e.target.value)}
                  placeholder="Scrivi manualmente o usa AI per generare un'analisi del mese…"
                  rows={4}
                />
              </div>

              {/* INFO */}
              <div className="wlr-info">
                ℹ️ Il report verrà scaricato come file HTML apribile nel browser. Per ottenere un PDF: apri il file → Stampa → Salva come PDF.
              </div>
            </div>

            {/* FOOTER */}
            <div className="wlr-foot">
              <button className="wlr-cancel-btn" onClick={() => setOpen(false)}>Annulla</button>
              <button className="wlr-download-btn" onClick={downloadReport} disabled={generating}
                style={{ background: client?.color || "#006EFF" }}>
                {generating ? "⏳ Generando…" : "⬇ Scarica Report HTML"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WhiteLabelReportBtn;

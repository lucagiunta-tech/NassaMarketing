import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { buildCtx } from "../../templates/templateUtils";
import { applyEdUpdate, getProjectEd, getEditorialPosts, isPostPublished, getFeedStatusStyle } from "./editorialModel";
import { renderMarkdown as defaultRenderMd } from "../../utils/markdown";

const MONTHLY_REVIEW_SEC_ID = "monthly_review";

function currentMonthLabel() {
  return new Date().toLocaleString("it-IT", { month: "long", year: "numeric" });
}

function formatLog(log) {
  if (!log) return "Nessun performance log disponibile.";
  const pairs = Object.entries(log)
    .filter(([key, value]) => !["id"].includes(key) && value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
  return pairs || "Performance log presente ma senza metriche valorizzate.";
}

function buildMonthlyReviewContext(project) {
  const ed = getProjectEd(project);
  const posts = getEditorialPosts(project);
  const published = posts.filter(isPostPublished);
  const byStatus = posts.reduce((acc, post) => {
    const status = post.stato || "bozza";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const byFunnel = posts.reduce((acc, post) => {
    const stage = post.funnel || "Non assegnato";
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  const byPillar = posts.reduce((acc, post) => {
    const pillar = post.pilastro || "Non assegnato";
    acc[pillar] = (acc[pillar] || 0) + 1;
    return acc;
  }, {});
  const latestLog = (ed.perfLogs || []).slice(-1)[0];
  const previousLog = (ed.perfLogs || []).slice(-2)[0];

  return [
    "## CONTESTO CLIENTE",
    buildCtx(project.interview || {}),
    project.context ? `\n## CONTESTO PROGETTO\n${project.context}` : "",
    "\n## STATO EDITORIALE",
    `- Contenuti totali: ${posts.length}`,
    `- Contenuti pubblicati/live: ${published.length}`,
    `- Distribuzione per stato: ${JSON.stringify(byStatus)}`,
    `- Distribuzione per funnel: ${JSON.stringify(byFunnel)}`,
    `- Distribuzione per pilastro: ${JSON.stringify(byPillar)}`,
    "\n## ULTIMO PERFORMANCE LOG",
    formatLog(latestLog),
    "\n## PERFORMANCE LOG PRECEDENTE",
    formatLog(previousLog),
    "\n## OBIETTIVI SMART PDM",
    project.pdm?.sections?.obiettivi_smart?.content || "⚠️ Da rilevare",
    "\n## FUNNEL STRATEGY PDM",
    project.pdm?.sections?.funnel_strategy?.content || "⚠️ Da rilevare",
    "\n## FUNNEL COMUNICATIVO PDC",
    project.pdc?.sections?.funnel_comunicativo?.content || "⚠️ Da rilevare",
    "\n## NOTE REVIEW PRECEDENTI",
    project.ed?.sections?.monthly_review?.content?.slice(0, 1200) || "Nessuna review precedente.",
  ].filter(Boolean).join("\n");
}

function buildMonthlyReviewPrompt(project) {
  return `Produci un REPORT DI REVISIONE MENSILE strategico in italiano con markdown.

Usa SOLO i dati disponibili nel contesto. Se un dato manca, scrivi ⚠️ DA RILEVARE. Non inventare performance, numeri o benchmark.

## Monthly Review — ${currentMonthLabel()}

### Executive Snapshot
[3-5 righe: cosa è successo questo mese e cosa significa strategicamente]

### Performance vs Obiettivi
| KPI | Target mensile | Consuntivo | Delta | Trend | Lettura strategica |
|---|---|---|---|---|---|
[usa KPI reali se disponibili; altrimenti ⚠️ DA RILEVARE]

### Distribuzione Editoriale
| Dimensione | Dato | Lettura |
|---|---|---|
| Stati contenuti | [dato] | [cosa implica] |
| Funnel TOFU/MOFU/BOFU | [dato] | [cosa implica] |
| Pilastri | [dato] | [cosa implica] |

### Top 3 Contenuti del Mese
[Se i dati performance per contenuto non sono disponibili, seleziona i contenuti più strategici e segnala che la performance è da rilevare]

### Bottom 3 — Cosa Non Ha Funzionato
[Con ipotesi di causa. Distingui fatto vs ipotesi.]

### L'Insight del Mese
[La cosa più importante imparata, quella che cambia il mese successivo]

### Aggiustamenti Operativi
1. [azione concreta]
2. [azione concreta]
3. [azione concreta]

### Il Sanity Check
*I contenuti pubblicati questo mese avrebbero convinto il buyer primario a fare il passo successivo?*
[Sì/No/Non valutabile con motivazione]

### Next Month Focus
[3 priorità operative per il prossimo mese]

---
CONTESTO:
${buildMonthlyReviewContext(project)}`;
}

function ReviewKpiStrip({ project }) {
  const ed = getProjectEd(project);
  const posts = getEditorialPosts(project);
  const published = posts.filter(isPostPublished).length;
  const reviewCount = posts.filter(post => ["revisione", "approvato", "schedulato"].includes(post.stato)).length;
  const latestLog = (ed.perfLogs || []).slice(-1)[0];
  const cards = [
    { label: "Post totali", value: posts.length },
    { label: "Pubblicati", value: published },
    { label: "In pipeline", value: reviewCount },
    { label: "Ultimo log", value: latestLog?.mese || "—" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
      {cards.map(card => (
        <div key={card.label} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, background: "var(--white)" }}>
          <div style={{ fontSize: 11, color: "var(--ink4)", fontWeight: 700, textTransform: "uppercase" }}>{card.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}

function LatestLogs({ project }) {
  const logs = (getProjectEd(project).perfLogs || []).slice(-3).reverse();
  if (!logs.length) {
    return <div className="ct-empty" style={{ marginBottom: 14 }}>Nessun performance log disponibile: la review userà solo dati editoriali e strategici.</div>;
  }
  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
      {logs.map(log => (
        <div key={log.id || log.mese} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, background: "var(--bg)" }}>
          <div style={{ fontSize: 12, fontWeight: 800 }}>{log.mese || "Mese non indicato"}</div>
          <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(log).filter(([k,v]) => !["id","mese","note"].includes(k) && v).slice(0,6).map(([k,v]) => <span key={k}>{k}: <strong>{String(v)}</strong></span>)}
          </div>
          {log.note && <div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 5 }}>{log.note}</div>}
        </div>
      ))}
    </div>
  );
}

function LocalToast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

export function MonthlyReviewED({
  project,
  onUpdate,
  sectionMeta,
  accentColor = "#C800FF",
  ExportPanelComponent = null,
  renderMarkdown = defaultRenderMd,
}) {
  const secId = MONTHLY_REVIEW_SEC_ID;
  const ed = getProjectEd(project);
  const secData = ed.sections?.[secId] || {};
  const content = secData.content || "";
  const versions = secData.versions || [];

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [showVer, setShowVer] = useState(false);
  const [toast, setToast] = useState("");
  const [showExport, setShowExport] = useState(false);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function upEdSection(text) {
    const existing = secData || {};
    const newVersions = text && existing.content
      ? [...(existing.versions || []), { text: existing.content, ts: Date.now() }].slice(-5)
      : (existing.versions || []);
    onUpdate(applyEdUpdate(project, currentEd => ({
      ...currentEd,
      sections: {
        ...(currentEd.sections || {}),
        [secId]: { content: text, versions: newVersions }
      }
    })));
  }

  async function generate() {
    setGenerating(true);
    try {
      const text = await callClaude(buildMonthlyReviewPrompt(project), 2200);
      upEdSection(text);
      showToast("Monthly Review generata ✓");
    } catch (error) {
      console.error("Monthly review generation error", error);
      showToast("Errore generazione — riprova");
    }
    setGenerating(false);
  }

  const title = sectionMeta?.label || "Monthly Review";

  return (
    <div className="sec-body">
      <LocalToast msg={toast} />
      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 12 }}>{title}</div>
        <div className="sec-acts">
          {content && !editing && <button className="btn-outline sm" onClick={() => { setEditText(content); setEditing(true); }}>Modifica</button>}
          {content && versions.length > 0 && <button className="btn-ghost sm" onClick={() => setShowVer(v => !v)}>{showVer ? "Chiudi" : "Versioni"}</button>}
          {editing && (
            <>
              <button className="btn-primary sm" onClick={() => { upEdSection(editText); setEditing(false); showToast("Salvato ✓"); }}>Salva</button>
              <button className="btn-ghost sm" onClick={() => setEditing(false)}>Annulla</button>
            </>
          )}
          <button className="btn-primary sm" onClick={generate} disabled={generating}>{generating ? "..." : content ? "Rigenera" : "Genera"}</button>
          {content && ExportPanelComponent && (
            <div className="exp-wrap">
              <button className="btn-ghost sm" onClick={() => setShowExport(e => !e)}>↓ Esporta</button>
              {showExport && <ExportPanelComponent label={title} content={content} projectName={project.name || "Progetto"} secId={secId} onClose={() => setShowExport(false)} />}
            </div>
          )}
        </div>
      </div>
      <div className="sec-content">
        <ReviewKpiStrip project={project} />
        <LatestLogs project={project} />
        {showVer && versions.map((v, i) => (
          <div key={i} className="vitem" style={{ marginBottom: 8 }}>
            <div className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</div>
            <div className="vpreview">{v.text.slice(0, 100)}…</div>
            <button className="btn-ghost sm" onClick={() => { upEdSection(v.text); setShowVer(false); showToast("Ripristinato ✓"); }}>Ripristina</button>
          </div>
        ))}
        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e => setEditText(e.target.value)} />
          : content
            ? <div className="md-out" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
            : !generating && (
              <div className="sec-empty">
                <div className="se-glyph" style={{ color: accentColor }}>👁️</div>
                <div className="se-msg">Monthly Review non ancora generata</div>
                <button className="btn-primary" onClick={generate}>Genera Monthly Review →</button>
              </div>
            )
        }
        {generating && <div className="gen-row"><div className="spin" />Generazione Monthly Review…</div>}
      </div>
    </div>
  );
}

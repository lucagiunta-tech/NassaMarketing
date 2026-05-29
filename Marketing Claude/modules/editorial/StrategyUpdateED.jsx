import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { buildCtx } from "../../templates/templateUtils";
import { applyEdUpdate, getProjectEd, getEditorialPosts, isPostPublished, normalizeFeedStatus } from "./editorialModel";
import { renderMarkdown as defaultRenderMd } from "../../utils/markdown";

const SUPPORTED_SECTIONS = new Set(["strategy_update", "cicli"]);

function monthLabel() {
  return new Date().toLocaleString("it-IT", { month: "long", year: "numeric" });
}

function quarterLabel(offset = 0) {
  const now = new Date();
  const current = Math.ceil((now.getMonth() + 1) / 3);
  const shifted = current + offset;
  const normalized = ((shifted - 1) % 4) + 1;
  const year = now.getFullYear() + Math.floor((shifted - 1) / 4);
  return `Q${normalized} ${year}`;
}

function summarizeSections(sections = {}, limit = 900) {
  return Object.entries(sections)
    .filter(([, value]) => value?.content)
    .map(([key, value]) => `## ${key}\n${String(value.content).slice(0, limit)}`)
    .join("\n\n") || "Nessuna sezione compilata.";
}

function formatLog(log) {
  if (!log) return "Nessun performance log disponibile.";
  const pairs = Object.entries(log)
    .filter(([key, value]) => key !== "id" && value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
  return pairs || "Performance log presente ma senza metriche valorizzate.";
}

function countBy(posts, key, fallback = "Non assegnato") {
  return posts.reduce((acc, post) => {
    const value = post?.[key] || fallback;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function buildStrategyContext(project, secId) {
  const ed = getProjectEd(project);
  const posts = getEditorialPosts(project);
  const published = posts.filter(isPostPublished);
  const pipeline = posts.filter(post => !isPostPublished(post));
  const recentPosts = posts
    .slice()
    .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")))
    .slice(0, 12)
    .map(post => `- ${post.data || "Senza data"} | ${post.titolo || post.title || "Senza titolo"} | stato ${normalizeFeedStatus(post.stato)} | funnel ${post.funnel || "n/a"} | pilastro ${post.pilastro || "n/a"}`)
    .join("\n") || "Nessun contenuto editoriale disponibile.";
  const perfLogs = (ed.perfLogs || []).slice(-4);
  const latestLog = perfLogs.at(-1);
  const previousLog = perfLogs.at(-2);

  return [
    "# Contesto cliente",
    buildCtx(project.interview || {}),
    project.context ? `\n# Contesto progetto\n${project.context}` : "",
    "\n# Piano di Marketing compilato",
    summarizeSections(project.pdm?.sections || {}, 700),
    "\n# Piano di Comunicazione compilato",
    summarizeSections(project.pdc?.sections || {}, 700),
    "\n# Stato editoriale",
    `- Sezione richiesta: ${secId}`,
    `- Contenuti totali: ${posts.length}`,
    `- Contenuti pubblicati/live: ${published.length}`,
    `- Contenuti in pipeline: ${pipeline.length}`,
    `- Distribuzione per stato: ${JSON.stringify(countBy(posts, "stato", "bozza"))}`,
    `- Distribuzione per funnel: ${JSON.stringify(countBy(posts, "funnel"))}`,
    `- Distribuzione per pilastro: ${JSON.stringify(countBy(posts, "pilastro"))}`,
    "\n# Ultimi contenuti",
    recentPosts,
    "\n# Ultimo performance log",
    formatLog(latestLog),
    "\n# Performance log precedente",
    formatLog(previousLog),
    "\n# Monthly review corrente",
    ed.sections?.monthly_review?.content?.slice(0, 1500) || "Nessuna Monthly Review disponibile.",
    "\n# Strategy update precedente",
    ed.sections?.strategy_update?.content?.slice(0, 1200) || "Nessun aggiornamento strategia precedente.",
    "\n# Ciclo precedente",
    ed.sections?.cicli?.content?.slice(0, 1200) || "Nessun ciclo precedente.",
  ].filter(Boolean).join("\n");
}

function buildStrategyUpdatePrompt(project) {
  return `Sei un consulente senior di marketing e comunicazione. Produci un AGGIORNAMENTO STRATEGIA in italiano con markdown.

Usa SOLO i dati disponibili nel contesto. Se un dato manca scrivi DA RILEVARE. Distingui sempre tra fatti osservati e ipotesi strategiche.

## Aggiornamento Strategia — ${monthLabel()}

### Executive Diagnosis
[3-5 righe: cosa sta succedendo e quale decisione strategica suggerisce]

### Cosa i dati stanno dicendo
| Evidenza | Lettura strategica | Azione consigliata |
|---|---|---|
[usa performance log, distribuzione editoriale, funnel e review]

### Cosa aggiornare nel Piano di Marketing
| Sezione | Aggiornamento | Priorita | Perche ora |
|---|---|---|---|
[elenca solo le sezioni che richiedono un update reale]

### Cosa aggiornare nel Piano di Comunicazione
| Sezione | Aggiornamento | Priorita | Impatto operativo |
|---|---|---|---|
[message house, ToV, campaign moments, funnel, canali]

### Cosa aggiornare nell'Editoriale
- **Pilastri**: [ribilanciamento, se necessario]
- **Funnel**: [TOFU/MOFU/BOFU: cosa manca]
- **Formati**: [quali formati spingere o ridurre]
- **Canali**: [dove concentrare energia]
- **Produzione**: [colli di bottiglia e quick win]

### Decisioni da prendere prima del prossimo ciclo
1. [decisione concreta]
2. [decisione concreta]
3. [decisione concreta]

### Non cambiare
[Cosa sta funzionando e non va toccato]

### Azioni entro 7 giorni
| Azione | Owner suggerito | Output | Deadline |
|---|---|---|---|
[azioni operative immediate]

---
CONTESTO:
${buildStrategyContext(project, "strategy_update")}`;
}

function buildCyclePrompt(project) {
  return `Sei un consulente senior che chiude un ciclo di marketing trimestrale. Produci una CHIUSURA DI CICLO + BRIEF PROSSIMO CICLO in italiano con markdown.

Usa SOLO i dati disponibili nel contesto. Se un dato manca scrivi DA RILEVARE. Distingui fatti, ipotesi e decisioni.

## Ciclo & Pivot — ${quarterLabel(0)}

### Il ciclo che chiudiamo
**Durata**: [data inizio -> data fine]
**Obiettivo dichiarato**: [da PDM/PDC o DA RILEVARE]
**Risultato raggiunto**: [con dati disponibili]
**Verdetto**: Ciclo completato / Ciclo parziale / Pivot necessario

### Scorecard del ciclo
| Area | Evidenza | Valutazione | Nota |
|---|---|---|---|
| Lead / conversione | [dato] | [verde/giallo/rosso] | [lettura] |
| Brand authority | [dato] | [verde/giallo/rosso] | [lettura] |
| Produzione contenuti | [dato] | [verde/giallo/rosso] | [lettura] |
| Funnel | [dato] | [verde/giallo/rosso] | [lettura] |

### I 3 risultati piu importanti
1. [risultato concreto]
2. [risultato concreto]
3. [risultato concreto]

### I 3 blocchi da risolvere
1. [blocco concreto]
2. [blocco concreto]
3. [blocco concreto]

### La lezione del ciclo
> [Una frase sola: cosa abbiamo imparato che cambia il prossimo ciclo]

### Pivot o continuita?
**Continuita**: [cosa mantenere]
**Pivot parziale**: [cosa cambiare]
**Esperimento**: [cosa testare per validare il pivot]

### Brief Prossimo Ciclo — ${quarterLabel(1)}
- **Focus prioritario**: [una cosa sola]
- **KPI primario da battere**: [numero o DA RILEVARE]
- **Esperimento da fare**: [una cosa nuova]
- **Cosa smettere di fare**: [una cosa che disperde energia]
- **Prima azione entro 7 giorni**: [concreta]

### Roadmap 30 giorni
| Settimana | Azione | Output | Owner suggerito |
|---|---|---|---|
[4 righe operative]

---
CONTESTO:
${buildStrategyContext(project, "cicli")}`;
}

function getPromptForSection(secId, project) {
  return secId === "cicli" ? buildCyclePrompt(project) : buildStrategyUpdatePrompt(project);
}

function ContextStrip({ project }) {
  const ed = getProjectEd(project);
  const posts = getEditorialPosts(project);
  const published = posts.filter(isPostPublished);
  const perfLogs = ed.perfLogs || [];
  const funnel = countBy(posts, "funnel");
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
      <div className="ov-card-mini"><div className="ov-k">Post totali</div><div className="ov-v">{posts.length}</div></div>
      <div className="ov-card-mini"><div className="ov-k">Pubblicati</div><div className="ov-v">{published.length}</div></div>
      <div className="ov-card-mini"><div className="ov-k">Perf log</div><div className="ov-v">{perfLogs.length}</div></div>
      <div className="ov-card-mini"><div className="ov-k">Funnel</div><div className="ov-v" style={{fontSize:15}}>{Object.keys(funnel).length || 0}</div></div>
    </div>
  );
}

export function StrategyUpdateED({ project, onUpdate, secId, sectionMeta, accentColor = "#10B981", ExportPanelComponent = null, renderMarkdown = null }) {
  const safeSecId = SUPPORTED_SECTIONS.has(secId) ? secId : "strategy_update";
  const renderer = renderMarkdown || defaultRenderMd;
  const ed = getProjectEd(project);
  const secData = ed.sections?.[safeSecId] || {};
  const content = secData.content || "";
  const versions = secData.versions || [];

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [showVer, setShowVer] = useState(false);
  const [toast, setToast] = useState("");
  const [showExport, setShowExport] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function upEdSection(text) {
    const baseEd = getProjectEd(project);
    const existing = baseEd.sections?.[safeSecId] || {};
    const newVersions = text && existing.content
      ? [...(existing.versions || []), { text: existing.content, ts: Date.now() }].slice(-5)
      : (existing.versions || []);
    onUpdate(applyEdUpdate(project, {
      sections: {
        ...baseEd.sections,
        [safeSecId]: { content: text, versions: newVersions }
      }
    }));
  }

  async function generate() {
    setGenerating(true);
    try {
      const text = await callClaude(getPromptForSection(safeSecId, project), 2600);
      upEdSection(text);
      showToast("Generato");
    } catch (error) {
      console.error("Strategy update generation error", error);
      showToast("Errore generazione");
    }
    setGenerating(false);
  }

  const title = sectionMeta?.label || (safeSecId === "cicli" ? "Ciclo & Pivot" : "Aggiornamento Strategia");
  const emptyMessage = safeSecId === "cicli"
    ? "Chiudi il ciclo corrente e prepara il brief del prossimo ciclo."
    : "Genera un aggiornamento strategico a partire da performance, funnel e review.";

  return (
    <div className="sec-body">
      {toast && <div className="toast">{toast}</div>}
      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{borderLeft:`3px solid ${accentColor}`,paddingLeft:12}}>{title}</div>
        <div className="sec-acts">
          {content && !editing && <button className="btn-outline sm" onClick={() => { setEditText(content); setEditing(true); }}>Modifica</button>}
          {content && versions.length > 0 && <button className="btn-ghost sm" onClick={() => setShowVer(v => !v)}>{showVer ? "Chiudi" : "Versioni"}</button>}
          {editing && <>
            <button className="btn-primary sm" onClick={() => { upEdSection(editText); setEditing(false); showToast("Salvato"); }}>Salva</button>
            <button className="btn-ghost sm" onClick={() => setEditing(false)}>Annulla</button>
          </>}
          <button className="btn-primary sm" onClick={generate} disabled={generating}>{generating ? "..." : "Genera"}</button>
          {content && ExportPanelComponent && (
            <div className="exp-wrap">
              <button className="btn-ghost sm" onClick={() => setShowExport(e => !e)}>Esporta</button>
              {showExport && <ExportPanelComponent label={title} content={content} projectName={project.name || "Progetto"} secId={safeSecId} onClose={() => setShowExport(false)}/>} 
            </div>
          )}
        </div>
      </div>
      <div className="sec-content">
        <ContextStrip project={project}/>
        {showVer && versions.map((v, i) => (
          <div key={i} className="vitem" style={{marginBottom:8}}>
            <div className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</div>
            <div className="vpreview">{String(v.text || "").slice(0, 100)}...</div>
            <button className="btn-ghost sm" onClick={() => { upEdSection(v.text); setShowVer(false); showToast("Ripristinato"); }}>Ripristina</button>
          </div>
        ))}
        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e => setEditText(e.target.value)}/>
          : content
            ? <div className="md-out" dangerouslySetInnerHTML={{__html:renderer(content)}}/>
            : !generating && (
                <div className="sec-empty">
                  <div className="se-glyph" style={{color:accentColor}}>{sectionMeta?.icon || "refresh"}</div>
                  <div className="se-msg">{emptyMessage}</div>
                  <button className="btn-primary" onClick={generate}>Genera</button>
                </div>
              )
        }
        {generating && <div className="gen-row"><div className="spin"/>Generazione...</div>}
      </div>
    </div>
  );
}

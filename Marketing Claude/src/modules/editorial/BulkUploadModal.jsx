/**
 * BulkUploadModal.jsx
 * Importa N post dal CSV nel Piano Editoriale — ispirato a CoSchedule Bulk Social Upload.
 *
 * Colonne CSV supportate (case-insensitive, ordine libero):
 *  titolo / title         — nome del post (obbligatorio)
 *  data / date            — YYYY-MM-DD o DD/MM/YYYY
 *  piattaforme / canali   — instagram,facebook,linkedin (virgole)
 *  tipo / format          — post | reel | carousel | story
 *  stato / status         — bozza | revisione | approvato
 *  pilastro / pillar      — nome del pilastro
 *  caption                — testo del post
 *  hashtag / hashtags     — #tag #tag
 *  cta                    — testo CTA
 *
 * Props:
 *  project  — progetto corrente
 *  onImport — (newFeedItems[]) => void
 *  onClose  — () => void
 */

import { useState, useRef, useCallback } from "react";
import { uid } from "../../templates/templateUtils";

// ─── CSV TEMPLATE ─────────────────────────────────────────────────────────────
const CSV_HEADERS = ["titolo","data","piattaforme","tipo","stato","pilastro","caption","hashtag","cta"];
const CSV_TEMPLATE = CSV_HEADERS.join(",") + "\n" +
  "Carousel: 5 ingredienti siciliani,2026-06-10,\"instagram,facebook\",carousel,bozza,Prodotto,Caption del post...,#KosmetikalSrl #CleanBeauty,Scopri nel link in bio\n" +
  "Reel: dietro le quinte produzione,2026-06-14,instagram,reel,bozza,Raw & Real,Video della produzione...,#RawAndReal,\n" +
  "Post LinkedIn: case study,2026-06-18,linkedin,post,bozza,Educazione,Contenuto LinkedIn...,#CaseStudy,Commenta la tua opinione";

// ─── PARSE HELPERS ────────────────────────────────────────────────────────────
function parseCSVRow(row) {
  // Handles quoted fields with commas
  const result = [];
  let cur = "", inQ = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { result.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  result.push(cur.trim());
  return result;
}

function normalizeDate(raw) {
  if (!raw) return "";
  const s = raw.trim();
  // YYYY-MM-DD already correct
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // DD/MM/YYYY or DD-MM-YYYY
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  return "";
}

function normalizePlatforms(raw) {
  if (!raw) return ["instagram"];
  return raw.split(/[,;|]/).map(p => p.trim().toLowerCase()).filter(Boolean);
}

function normalizeTipo(raw) {
  if (!raw) return "post";
  const t = raw.trim().toLowerCase();
  if (["reel","carousel","story","video","post","carosello"].includes(t)) return t === "carosello" ? "carousel" : t;
  return "post";
}

function normalizeStato(raw) {
  if (!raw) return "bozza";
  const s = raw.trim().toLowerCase();
  const map = { bozza:"bozza", draft:"bozza", revisione:"revisione", review:"revisione",
    approvato:"approvato", approved:"approvato", pubblicato:"pubblicato" };
  return map[s] || "bozza";
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { rows: [], errors: ["File troppo corto — almeno intestazione + 1 riga."] };

  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g,"_"));
  const get = (row, ...keys) => {
    for (const k of keys) {
      const idx = headers.findIndex(h => h === k || h.startsWith(k.slice(0,5)));
      if (idx >= 0 && row[idx]) return row[idx];
    }
    return "";
  };

  const rows = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = parseCSVRow(lines[i]);
    const titolo = get(row, "titolo", "title", "nome");
    if (!titolo) { errors.push(`Riga ${i+1}: titolo mancante — saltata.`); continue; }

    rows.push({
      id:           uid(),
      titolo:       titolo,
      data:         normalizeDate(get(row, "data", "date")),
      piattaforme:  normalizePlatforms(get(row, "piattaforme", "canali", "platform", "channel")),
      tipo:         normalizeTipo(get(row, "tipo", "type", "format")),
      stato:        normalizeStato(get(row, "stato", "status")),
      pilastro:     get(row, "pilastro", "pillar"),
      caption:      get(row, "caption"),
      hashtags:     get(row, "hashtag", "hashtags"),
      cta:          get(row, "cta"),
      membersAssigned: [],
      comments: [],
      createdAt: Date.now(),
      immagineUrl:"", immagineBase64:"", videoUrl:"",
      captionB:"", abActive:false,
      noteGrafico:"", noteVideo:"", linkAsset:"",
      contentFramework:"", targetPersona:"", isTrend:false, trendAnchor:"",
    });
  }

  return { rows, errors };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function BulkUploadModal({ project, onImport, onClose }) {
  const [step, setStep]         = useState("upload"); // upload | preview | done
  const [parsed, setParsed]     = useState(null);
  const [errors, setErrors]     = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const { rows, errors: errs } = parseCSV(e.target.result);
      setParsed(rows);
      setErrors(errs);
      setStep("preview");
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.name?.endsWith(".csv") || file?.type === "text/csv") processFile(file);
  }, [processFile]);

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "nms_bulk_template.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function confirmImport() {
    if (!parsed?.length) return;
    onImport(parsed);
    setStep("done");
  }

  const PLAT_ICON = { instagram:"📸", facebook:"📘", linkedin:"💼", tiktok:"🎵", youtube:"▶️", blog:"📝" };
  const STATO_COLOR = { bozza:"var(--color-text-tertiary)", revisione:"var(--color-text-warning)", approvato:"var(--color-text-success)" };

  return (
    <div className="bum-overlay" onClick={onClose}>
      <div className="bum-modal" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="bum-hd">
          <div>
            <div className="bum-title">📥 Importa da CSV</div>
            <div className="bum-sub">
              {step === "upload"  && "Carica un file CSV con i post da importare nel piano editoriale"}
              {step === "preview" && `${parsed?.length || 0} post pronti · ${errors.length} errori`}
              {step === "done"    && "Importazione completata"}
            </div>
          </div>
          <button className="bum-close" onClick={onClose}>✕</button>
        </div>

        {/* STEP: UPLOAD */}
        {step === "upload" && (
          <div className="bum-body">
            {/* Drop zone */}
            <div
              className={`bum-dropzone ${dragOver ? "bum-dropzone-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display:"none" }}
                onChange={e => processFile(e.target.files?.[0])} />
              <div className="bum-dz-icon">📄</div>
              <div className="bum-dz-title">Trascina un file CSV qui</div>
              <div className="bum-dz-sub">oppure clicca per scegliere</div>
              <button className="bum-btn-outline" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                Scegli file CSV
              </button>
            </div>

            {/* Template download */}
            <div className="bum-template-row">
              <div className="bum-template-info">
                <div className="bum-template-title">Non hai un CSV?</div>
                <div className="bum-template-sub">Scarica il template con tutte le colonne e compilalo in Excel o Google Sheets.</div>
              </div>
              <button className="bum-btn-outline" onClick={downloadTemplate}>⬇ Scarica template</button>
            </div>

            {/* Colonne supportate */}
            <div className="bum-cols">
              <div className="bum-cols-title">Colonne supportate:</div>
              <div className="bum-cols-list">
                {[["titolo *","Obbligatorio"], ["data","YYYY-MM-DD"],
                  ["piattaforme","instagram,facebook"], ["tipo","post|reel|carousel"],
                  ["stato","bozza|revisione"], ["pilastro","nome pilastro"],
                  ["caption","testo del post"], ["hashtag","#tag #tag"], ["cta","testo CTA"]
                ].map(([col, hint]) => (
                  <div key={col} className="bum-col-row">
                    <code className="bum-col-name">{col}</code>
                    <span className="bum-col-hint">{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: PREVIEW */}
        {step === "preview" && (
          <div className="bum-body bum-body-preview">
            {errors.length > 0 && (
              <div className="bum-errors">
                {errors.map((e, i) => <div key={i} className="bum-error-row">⚠️ {e}</div>)}
              </div>
            )}

            <div className="bum-preview-wrap">
              <table className="bum-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Titolo</th>
                    <th>Data</th>
                    <th>Piattaforme</th>
                    <th>Tipo</th>
                    <th>Stato</th>
                    <th>Pilastro</th>
                  </tr>
                </thead>
                <tbody>
                  {(parsed || []).map((row, i) => (
                    <tr key={row.id}>
                      <td className="bum-td-num">{i + 1}</td>
                      <td className="bum-td-title">{row.titolo}</td>
                      <td className="bum-td-date">{row.data || "—"}</td>
                      <td className="bum-td-plat">
                        {row.piattaforme.slice(0, 3).map(p => (
                          <span key={p} title={p}>{PLAT_ICON[p] || p}</span>
                        ))}
                      </td>
                      <td className="bum-td-tipo">{row.tipo}</td>
                      <td className="bum-td-stato" style={{ color: STATO_COLOR[row.stato] || "var(--color-text-tertiary)" }}>
                        {row.stato}
                      </td>
                      <td className="bum-td-pillar">{row.pilastro || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bum-preview-footer">
              <button className="bum-btn-ghost" onClick={() => { setStep("upload"); setParsed(null); setErrors([]); }}>
                ← Ricarica file
              </button>
              <div className="bum-preview-summary">
                {parsed?.length || 0} post da importare
                {errors.length > 0 && ` · ${errors.length} righe saltate`}
              </div>
            </div>
          </div>
        )}

        {/* STEP: DONE */}
        {step === "done" && (
          <div className="bum-body bum-body-done">
            <div className="bum-done-icon">✅</div>
            <div className="bum-done-title">{parsed?.length} post importati</div>
            <div className="bum-done-sub">
              Trovi i post nel Piano Editoriale in stato "bozza". Aprili per completare caption e media.
            </div>
            <button className="bum-btn-primary" onClick={onClose}>Chiudi</button>
          </div>
        )}

        {/* FOOTER */}
        {(step === "upload" || step === "preview") && (
          <div className="bum-foot">
            <button className="bum-btn-ghost" onClick={onClose}>Annulla</button>
            {step === "preview" && (
              <button className="bum-btn-primary" onClick={confirmImport} disabled={!parsed?.length}>
                📥 Importa {parsed?.length || 0} post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkUploadModal;

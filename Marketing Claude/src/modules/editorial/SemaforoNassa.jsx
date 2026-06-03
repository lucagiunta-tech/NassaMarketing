/**
 * SemaforoNassa.jsx
 * Fase 3.4 — Hardening: Semaforo Nassa gate
 *
 * Implementa i 5 check operativi pre-pubblicazione (lato interno Nassa).
 * L'approvazione del CLIENTE avviene nel ClientPortalPreview (check 06).
 * Il check 07 (archivio Streamtime/Dropbox) e 08 (doppia firma Soci)
 * sono processi fuori dal software — segnalati come reminder, non bloccanti.
 *
 * REGOLE CODICE NASSA — non negoziabili:
 *  - Regola 6: MAI copia-incolla AI senza revisione umana
 *  - Regola 8: Pubblicazione SEMPRE nativa (MAI tramite Metricool)
 *
 * Flusso:
 *   ContentTrackerED (Kanban) → SemaforoModal → stato = "revisione" (pronto per cliente)
 *   ClientPortalPreview → Approva → stato = "approvato"
 *   PublishingHubED → Pubblica → stato = "pubblicato"
 */

import { useState } from "react";

// ─── CHECKLIST 8 CHECK SEMAFORO ──────────────────────────────────────────────

const CHECKS = [
  {
    id: "strategico",
    num: "01",
    label: "Strategico",
    resp: "Luca",
    color: "#006EFF",
    question: "Rispetta il brief e il PED del mese?",
    detail: "La CTA è coerente con l'obiettivo. Il contenuto serve davvero.",
    required: true,
  },
  {
    id: "estetico",
    num: "02",
    label: "Estetico",
    resp: "Alberto",
    color: "#7C3AED",
    question: "È Raw & Real? Coerente con Brand Book e Moodboard?",
    detail: "Composizione, palette, tipografia OK. Nessun asset stock non approvato.",
    required: true,
  },
  {
    id: "copy",
    num: "03",
    label: "Copy",
    resp: "Luca + Alberto",
    color: "#0F9B58",
    question: "Zero refusi. Hook in prima riga. Body conciso. CTA chiara. ToV rispettato?",
    detail: "Regola Codice #6: il testo AI è stato riletto e corretto da un umano.",
    required: true,
    nassa_rule: "Regola #6 — MAI copia-incolla AI senza revisione umana",
  },
  {
    id: "tecnico",
    num: "04",
    label: "Tecnico",
    resp: "Akash",
    color: "#D97706",
    question: "Risoluzione, audio, formato, peso file OK?",
    detail: "Sottotitoli se serve. Mobile-first. Nessun file sul Desktop.",
    required: true,
    nassa_rule: "Regola #5 — MAI salvare sul Desktop",
  },
  {
    id: "platform",
    num: "05",
    label: "Platform",
    resp: "Alberto (SMM)",
    color: "#0284C7",
    question: "Caption ottimizzata per piattaforma. Hashtag corretti. Orario coerente?",
    detail: "Regola Codice #8: pubblicazione sempre nativa. MAI tramite Metricool.",
    required: true,
    nassa_rule: "Regola #8 — Pubblicazione SEMPRE nativa. MAI Metricool.",
  },
];

// Check 06-08: non bloccanti (fuori software), ma mostrati come reminder
const REMINDERS = [
  {
    id: "cliente",
    num: "06",
    label: "Cliente",
    text: "Approvazione cliente → portale clienti o email scritta ricevuta.",
  },
  {
    id: "archivio",
    num: "07",
    label: "Archivio",
    text: "File finale in Dropbox (naming convention). Task su Streamtime aggiornato.",
  },
  {
    id: "firma",
    num: "08",
    label: "Firma",
    text: "Doppia firma Soci (Luca + Alberto) prima della pubblicazione.",
    strong: true,
  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const SEM_CSS = `
.sem-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.sem-modal {
  background: #fff; border-radius: 12px; width: 100%; max-width: 520px;
  max-height: 90vh; display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
  font-family: 'Inter', system-ui, sans-serif;
}
.sem-head {
  padding: 16px 20px 12px; border-bottom: 1px solid #E0E0DC;
  display: flex; align-items: flex-start; gap: 12px;
}
.sem-glyph { font-size: 22px; flex-shrink: 0; }
.sem-head-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 2px; }
.sem-head-sub { font-size: 10px; color: #6B7280; line-height: 1.4; }
.sem-close {
  margin-left: auto; background: none; border: none; cursor: pointer;
  font-size: 16px; color: #9CA3AF; padding: 2px; border-radius: 4px;
}
.sem-close:hover { color: #111; background: #F3F4F6; }
.sem-body { flex: 1; overflow-y: auto; padding: 16px 20px; }
.sem-post-preview {
  background: #F9F9F7; border: 1px solid #E0E0DC; border-radius: 8px;
  padding: 10px 12px; margin-bottom: 14px; font-size: 11px;
}
.sem-post-title { font-weight: 700; color: #1F2937; margin-bottom: 3px; }
.sem-post-meta { color: #6B7280; display: flex; gap: 8px; flex-wrap: wrap; }
.sem-checks-title {
  font-size: 9px; font-weight: 700; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: .8px; margin-bottom: 10px;
}
.sem-check {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 12px; border-radius: 8px; margin-bottom: 6px;
  border: 1.5px solid #E0E0DC; cursor: pointer; transition: .12s;
  background: #fff;
}
.sem-check:hover { border-color: #C8C8C4; background: #FAFAF8; }
.sem-check.checked { border-color: var(--check-color); background: color-mix(in srgb, var(--check-color) 6%, #fff); }
.sem-check-box {
  width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid #C8C8C4;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 11px; transition: .12s; margin-top: 1px;
}
.sem-check.checked .sem-check-box {
  background: var(--check-color); border-color: var(--check-color); color: #fff;
}
.sem-check-num {
  font-size: 9px; font-weight: 800; color: #9CA3AF; min-width: 20px; margin-top: 2px;
}
.sem-check.checked .sem-check-num { color: var(--check-color); }
.sem-check-body { flex: 1; }
.sem-check-label { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 2px; }
.sem-check.checked .sem-check-label { color: var(--check-color); }
.sem-check-q { font-size: 11px; color: #374151; margin-bottom: 2px; }
.sem-check-detail { font-size: 10px; color: #6B7280; line-height: 1.4; }
.sem-check-rule {
  font-size: 9px; font-weight: 700; color: #C2185B;
  background: rgba(194,24,91,.07); border: 1px solid rgba(194,24,91,.15);
  border-radius: 4px; padding: 3px 7px; margin-top: 5px; display: inline-block;
}
.sem-check-resp { font-size: 9px; color: #9CA3AF; margin-top: 3px; }
.sem-reminders { margin-top: 14px; }
.sem-reminder {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 12px; border-radius: 8px; background: #F9F9F7;
  border: 1px solid #E0E0DC; margin-bottom: 5px; font-size: 10px; color: #6B7280;
}
.sem-reminder-num {
  font-size: 9px; font-weight: 800; color: #9CA3AF; min-width: 20px;
}
.sem-reminder.strong { background: #FFF5F7; border-color: rgba(194,24,91,.2); }
.sem-reminder.strong .sem-reminder-num { color: #C2185B; }
.sem-reminder.strong .sem-reminder-text { color: #C2185B; font-weight: 600; }
.sem-foot {
  padding: 12px 20px; border-top: 1px solid #E0E0DC;
  display: flex; align-items: center; gap: 8px;
}
.sem-progress {
  flex: 1; font-size: 10px; font-weight: 600;
}
.sem-progress-ok { color: #0F9B58; }
.sem-progress-partial { color: #D97706; }
.sem-btn-cancel {
  padding: 7px 14px; background: none; border: 1px solid #E0E0DC;
  border-radius: 6px; cursor: pointer; font-size: 11px; color: #6B7280;
  font-family: inherit;
}
.sem-btn-cancel:hover { background: #F3F4F6; }
.sem-btn-confirm {
  padding: 7px 16px; background: #006EFF; border: none;
  border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;
  color: #fff; font-family: inherit; transition: .12s;
}
.sem-btn-confirm:hover:not(:disabled) { opacity: .88; }
.sem-btn-confirm:disabled { background: #C8C8C4; cursor: not-allowed; }
`;

// ─── MODAL ────────────────────────────────────────────────────────────────────

export function SemaforoModal({ post, onConfirm, onCancel }) {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const requiredIds   = CHECKS.filter((c) => c.required).map((c) => c.id);
  const doneCount     = requiredIds.filter((id) => checked[id]).length;
  const allDone       = doneCount === requiredIds.length;

  const postTitle = post?.title || post?.titolo || "Contenuto";
  const postCh    = post?.canale || post?.piattaforme?.[0] || "";
  const postFmt   = post?.tipo   || post?.format || "";
  const postDate  = post?.data   || post?.dueDate || "";

  return (
    <>
      <style>{SEM_CSS}</style>
      <div className="sem-overlay" onClick={onCancel}>
        <div className="sem-modal" onClick={(e) => e.stopPropagation()}>

          <div className="sem-head">
            <div className="sem-glyph">🚦</div>
            <div>
              <div className="sem-head-title">Semaforo Nassa — 8 Check</div>
              <div className="sem-head-sub">
                Completa i 5 check operativi (01–05) per avanzare in revisione.<br/>
                I check 06–08 sono processi off-software — confermali separatamente.
              </div>
            </div>
            <button className="sem-close" onClick={onCancel}>✕</button>
          </div>

          <div className="sem-body">
            {/* Post preview */}
            <div className="sem-post-preview">
              <div className="sem-post-title">{postTitle}</div>
              <div className="sem-post-meta">
                {postCh  && <span>{postCh}</span>}
                {postFmt && <span>{postFmt}</span>}
                {postDate && <span>📅 {postDate}</span>}
              </div>
            </div>

            <div className="sem-checks-title">Check 01–05 — Interni Nassa (obbligatori)</div>

            {CHECKS.map((c) => {
              const isChecked = !!checked[c.id];
              return (
                <div
                  key={c.id}
                  className={`sem-check ${isChecked ? "checked" : ""}`}
                  style={{ "--check-color": c.color }}
                  onClick={() => toggle(c.id)}
                >
                  <div className="sem-check-box">{isChecked && "✓"}</div>
                  <div className="sem-check-num">{c.num}</div>
                  <div className="sem-check-body">
                    <div className="sem-check-label">{c.label}</div>
                    <div className="sem-check-q">{c.question}</div>
                    <div className="sem-check-detail">{c.detail}</div>
                    {c.nassa_rule && (
                      <div className="sem-check-rule">⚠ {c.nassa_rule}</div>
                    )}
                    <div className="sem-check-resp">Resp.: {c.resp}</div>
                  </div>
                </div>
              );
            })}

            {/* Reminder 06-08 */}
            <div className="sem-reminders">
              <div className="sem-checks-title" style={{ marginTop: 14 }}>Check 06–08 — Reminder off-software</div>
              {REMINDERS.map((r) => (
                <div key={r.id} className={`sem-reminder ${r.strong ? "strong" : ""}`}>
                  <div className="sem-reminder-num">{r.num}</div>
                  <div className="sem-reminder-text">{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sem-foot">
            <div className={`sem-progress ${allDone ? "sem-progress-ok" : "sem-progress-partial"}`}>
              {allDone
                ? `✓ Tutti i check completati (${doneCount}/${requiredIds.length})`
                : `${doneCount} / ${requiredIds.length} check completati`}
            </div>
            <button className="sem-btn-cancel" onClick={onCancel}>Annulla</button>
            <button
              className="sem-btn-confirm"
              disabled={!allDone}
              onClick={() => allDone && onConfirm()}
            >
              🚦 Invia in revisione
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SemaforoModal;

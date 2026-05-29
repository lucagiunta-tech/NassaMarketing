import { useState } from "react";
import { applyEdUpdate, getProjectEd } from "./editorialModel";

const uid = () => Math.random().toString(36).slice(2, 9);

const EMPTY_CAMPAIGN_FORM = {
  nome: "",
  bigIdea: "",
  periodo: "",
  stato: "planning",
  kpiRealizzati: "",
  note: "",
};

const CAMPAIGN_STATUS = {
  planning: { label: "In pianificazione", c: "#94A3B8" },
  live: { label: "Live", c: "#10B981" },
  concluded: { label: "Conclusa", c: "#6366F1" },
  archived: { label: "Archiviata", c: "#CBD5E1" },
};

export function CampagneExecED({ project, onUpdate }) {
  const ed = getProjectEd(project);
  const campagne = ed.campagne || [];
  const pdcCM = project?.pdc?.sections?.campaign_moments?.content || "";
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_CAMPAIGN_FORM);

  function upEd(fn) {
    onUpdate(applyEdUpdate(project, fn));
  }

  function resetForm() {
    setForm(EMPTY_CAMPAIGN_FORM);
  }

  function addCamp() {
    if (!form.nome?.trim()) return;
    upEd(currentEd => ({
      ...currentEd,
      campagne: [
        ...(currentEd.campagne || []),
        { ...form, nome: form.nome.trim(), id: uid() },
      ],
    }));
    setAdding(false);
    resetForm();
  }

  function upStato(id, stato) {
    upEd(currentEd => ({
      ...currentEd,
      campagne: (currentEd.campagne || []).map(c => (c.id === id ? { ...c, stato } : c)),
    }));
  }

  function del(id) {
    upEd(currentEd => ({
      ...currentEd,
      campagne: (currentEd.campagne || []).filter(c => c.id !== id),
    }));
  }

  function cancelAdd() {
    setAdding(false);
    resetForm();
  }

  return (
    <div className="camp-exec-wrap">
      {pdcCM && (
        <div className="camp-ref-box">
          <div className="camp-ref-label">📣 Campaign Moments da Piano Comunicazione</div>
          <div className="camp-ref-preview">{pdcCM.slice(0, 280)}…</div>
        </div>
      )}

      <div className="camp-exec-hdr">
        <div className="camp-exec-title">Esecuzione Campagne</div>
        <button className="btn-outline sm" onClick={() => setAdding(true)}>+ Campagna</button>
      </div>

      {adding && (
        <div className="ct-form">
          <div className="fg-row">
            <div className="fg">
              <label className="lbl">Nome campagna *</label>
              <input
                className="inp"
                placeholder="es. CM1 — Library Advanced"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="fg">
              <label className="lbl">Periodo</label>
              <input
                className="inp"
                placeholder="es. Set → Ott 2025"
                value={form.periodo}
                onChange={e => setForm({ ...form, periodo: e.target.value })}
              />
            </div>
          </div>

          <div className="fg">
            <label className="lbl">Big Idea</label>
            <input
              className="inp"
              placeholder='"La libreria è pubblica. Adesso puoi verificarla."'
              value={form.bigIdea}
              onChange={e => setForm({ ...form, bigIdea: e.target.value })}
            />
          </div>

          <div className="fg">
            <label className="lbl">KPI realizzati</label>
            <textarea
              className="txta"
              rows={2}
              placeholder="Download: 42/50 · Lead qualificati: 8/10 · Menzioni PR: 1/2"
              value={form.kpiRealizzati}
              onChange={e => setForm({ ...form, kpiRealizzati: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button className="btn-ghost sm" onClick={cancelAdd}>Annulla</button>
            <button className="btn-primary sm" onClick={addCamp} disabled={!form.nome?.trim()}>Aggiungi</button>
          </div>
        </div>
      )}

      {campagne.length === 0 && !adding && (
        <div className="ct-empty">Nessuna campagna tracciata. Aggiungi le campagne dal Piano di Comunicazione.</div>
      )}

      <div className="ct-list">
        {campagne.map(c => {
          const status = CAMPAIGN_STATUS[c.stato] || CAMPAIGN_STATUS.planning;
          return (
            <div key={c.id} className="ct-row">
              <div className="ct-row-main">
                <span className="ct-status-badge" style={{ background: `${status.c}22`, color: status.c }}>
                  {status.label}
                </span>
                <div className="ct-info">
                  <div className="ct-title">{c.nome}</div>
                  {c.bigIdea && <div className="ct-meta">"{c.bigIdea}" · {c.periodo}</div>}
                  {c.kpiRealizzati && <div className="ct-kpi-row">{c.kpiRealizzati}</div>}
                </div>
                <div className="ct-actions">
                  <select
                    className="inp"
                    style={{ width: 140, fontSize: 11 }}
                    value={c.stato || "planning"}
                    onChange={e => upStato(c.id, e.target.value)}
                  >
                    {Object.entries(CAMPAIGN_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <button className="ct-del" onClick={() => del(c.id)}>×</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { CAMPAIGN_STATUS };

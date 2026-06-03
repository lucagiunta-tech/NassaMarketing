import { useState } from "react";
import { applyEdUpdate, getProjectEd } from "./editorialModel";

const uid = () => Math.random().toString(36).slice(2, 9);

const EMPTY_CAMPAIGN_FORM = {
  nome: "",
  bigIdea: "",
  periodo: "",
  dataInizio: "",
  dataFine: "",
  colore: "#006EFF",
  budgetADV: "",
  stato: "planning",
  kpiRealizzati: "",
  note: "",
};

const CAMPAIGN_PALETTE = [
  "#006EFF","#7C3AED","#00C853","#FF6B00","#C800FF",
  "#0284C7","#D97706","#059669","#E4405F","#F97316",
];

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
              <label className="lbl">Periodo (testo)</label>
              <input
                className="inp"
                placeholder="es. Giu → Lug 2026"
                value={form.periodo}
                onChange={e => setForm({ ...form, periodo: e.target.value })}
              />
            </div>
          </div>

          {/* Date esatte + colore + budget */}
          <div className="fg-row3">
            <div className="fg">
              <label className="lbl">Data inizio</label>
              <input className="inp" type="date" value={form.dataInizio}
                onChange={e => setForm({ ...form, dataInizio: e.target.value })}/>
            </div>
            <div className="fg">
              <label className="lbl">Data fine</label>
              <input className="inp" type="date" value={form.dataFine}
                onChange={e => setForm({ ...form, dataFine: e.target.value })}/>
            </div>
            <div className="fg">
              <label className="lbl">Budget ADV (€)</label>
              <input className="inp" type="number" placeholder="0" value={form.budgetADV}
                onChange={e => setForm({ ...form, budgetADV: e.target.value })}/>
            </div>
          </div>

          {/* Colore campagna */}
          <div className="fg">
            <label className="lbl">Colore campagna</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {CAMPAIGN_PALETTE.map(col => (
                <button key={col} onClick={()=>setForm({...form,colore:col})}
                  style={{width:22,height:22,borderRadius:"50%",background:col,border:form.colore===col?"3px solid var(--ink)":"2px solid transparent",cursor:"pointer",flexShrink:0}}
                  title={col}/>
              ))}
              <input type="color" value={form.colore} onChange={e=>setForm({...form,colore:e.target.value})}
                style={{width:22,height:22,border:"1px solid var(--border2)",borderRadius:"50%",cursor:"pointer",padding:0}}/>
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
                  {(c.dataInizio||c.dataFine) && (
                    <div className="ct-meta" style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:c.colore||"var(--gold)",flexShrink:0}}/>
                      {c.dataInizio&&c.dataFine?`${c.dataInizio.slice(5)} → ${c.dataFine.slice(5)}`:(c.dataInizio||c.dataFine)}
                      {c.budgetADV&&<span style={{marginLeft:4}}>· ADV: €{c.budgetADV}</span>}
                    </div>
                  )}
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

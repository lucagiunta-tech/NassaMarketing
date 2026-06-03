import { useState } from "react";
import { applyEdUpdate, getProjectEd } from "./editorialModel";

const uid = () => Math.random().toString(36).slice(2,9);

const PERF_FIELDS = [
  { k: "follower_li", label: "Follower LinkedIn" },
  { k: "er_li",       label: "ER% LinkedIn" },
  { k: "download",    label: "Download Library" },
  { k: "lead",        label: "Lead qualificati" },
  { k: "follower_ig", label: "Follower Instagram" },
  { k: "er_ig",       label: "ER% Instagram" },
  { k: "cplq",        label: "CPLQ Ads (€)" },
];

const EMPTY_PERF_FORM = Object.freeze({
  mese: "",
  follower_li: "",
  er_li: "",
  download: "",
  lead: "",
  follower_ig: "",
  er_ig: "",
  cplq: "",
  note: "",
});

function parseMetric(value) {
  const normalized = String(value ?? "").replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

function formatDelta(delta) {
  if (delta === null) return null;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`;
}

export function PerformanceLogED({ project, onUpdate }) {
  const ed = getProjectEd(project);
  const logs = ed.perfLogs || [];
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PERF_FORM });

  function upEd(fn) {
    onUpdate(applyEdUpdate(project, fn));
  }

  function resetForm() {
    setForm({ ...EMPTY_PERF_FORM });
  }

  function addLog() {
    if (!form.mese) return;
    upEd(currentEd => ({
      ...currentEd,
      perfLogs: [...(currentEd.perfLogs || []), { ...form, id: uid() }]
    }));
    setAdding(false);
    resetForm();
  }

  function del(id) {
    upEd(currentEd => ({
      ...currentEd,
      perfLogs: (currentEd.perfLogs || []).filter(log => log.id !== id)
    }));
  }

  const orderedLogs = logs.slice().reverse();

  return (
    <div className="ct-wrap">
      <div className="ct-hdr">
        <div className="ct-title-sm">Storico performance mensile</div>
        <button className="btn-primary sm" onClick={() => setAdding(true)}>+ Mese</button>
      </div>

      {adding && (
        <div className="ct-form">
          <div className="fg">
            <label className="lbl">Mese *</label>
            <input
              className="inp"
              type="month"
              value={form.mese}
              onChange={e => setForm({ ...form, mese: e.target.value })}
            />
          </div>

          <div className="fg-row3">
            {PERF_FIELDS.map(field => (
              <div key={field.k} className="fg">
                <label className="lbl">{field.label}</label>
                <input
                  className="inp"
                  placeholder="—"
                  value={form[field.k]}
                  onChange={e => setForm({ ...form, [field.k]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="fg">
            <label className="lbl">Note</label>
            <textarea
              className="txta"
              rows={2}
              placeholder="Insight del mese, anomalie, contesto"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button className="btn-ghost sm" onClick={() => { setAdding(false); resetForm(); }}>Annulla</button>
            <button className="btn-primary sm" onClick={addLog} disabled={!form.mese}>Salva</button>
          </div>
        </div>
      )}

      {logs.length === 0 && !adding && (
        <div className="ct-empty">Nessun dato inserito. Aggiungi il primo mese di performance.</div>
      )}

      <div className="perf-table-wrap">
        {logs.length > 0 && (
          <table className="perf-table">
            <thead>
              <tr>
                <th>Mese</th>
                {PERF_FIELDS.map(field => <th key={field.k}>{field.label}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderedLogs.map((log, index) => {
                const prev = orderedLogs[index + 1];
                return (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600 }}>{log.mese}</td>
                    {PERF_FIELDS.map(field => {
                      const curr = parseMetric(log[field.k]);
                      const prv = parseMetric(prev?.[field.k]);
                      const delta = curr !== null && prv !== null ? curr - prv : null;
                      const deltaLabel = formatDelta(delta);
                      return (
                        <td key={field.k}>
                          {log[field.k] || "—"}
                          {deltaLabel && (
                            <span style={{ fontSize: 10, marginLeft: 4, color: delta >= 0 ? "#10B981" : "#EF4444" }}>
                              {deltaLabel}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td><button className="ct-del" onClick={() => del(log.id)}>×</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { applyEdUpdate } from "../editorial/editorialModel";
import { TASK_COLORS, TP_SK_MEMBERS, tpGet } from "./teamModel";

const COLLAB_ROLES = ["Owner","Direzione Creativa","Strategia","Art Director","SMM","Grafico Senior","AI & Google","Video Maker","Fotografo","Marketing Operativo","Grafico Junior","Copywriter","Ospite"];

function uid(){ return Math.random().toString(36).slice(2,9); }

export function CollaboratoriModal({ project, onUpdate, members, onMembersChange, onClose }) {
  const [invEmail,  setInvEmail]  = useState("");
  const [invNome,   setInvNome]   = useState("");
  const [invRuolo,  setInvRuolo]  = useState("SMM");
  const [invColore, setInvColore] = useState(TASK_COLORS[4]);
  const [tab,       setTab]       = useState("collaboratori");
  const [toast,     setToast]     = useState("");

  const collabs = project.ed?.collaboratori || [];

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2500); }

  function upCollabs(fn){
    onUpdate(applyEdUpdate(project, fn));
  }

  function invite(){
    if(!invNome.trim()) return;
    const m = { id:uid(), nome:invNome.trim(), email:invEmail.trim(), ruolo:invRuolo, colore:invColore, tariffa:0, ore:40 };
    const updated = [...collabs, m];
    upCollabs(ed=>({...ed, collaboratori:updated}));
    onMembersChange?.(updated);
    setInvNome(""); setInvEmail(""); setInvRuolo("SMM");
    showToast("Collaboratore aggiunto ✓");
  }

  function remove(id){
    const updated = collabs.filter(c=>c.id!==id);
    upCollabs(ed=>({...ed, collaboratori:updated}));
    onMembersChange?.(updated);
  }

  function syncFromGlobal(){
    tpGet(TP_SK_MEMBERS).then(m=>{
      if(!m||m.length===0) return;
      upCollabs(ed=>({...ed, collaboratori:m}));
      onMembersChange?.(m);
      showToast(`${m.length} membri importati dal Team Planner ✓`);
    });
  }

  function notifyAll(){
    showToast("Notifica inviata ai collaboratori ✓ (simulazione)");
  }

  const TABS = [
    {id:"collaboratori", label:"Collaboratori"},
    {id:"ruoli",         label:"Ruoli"},
  ];

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="collab-modal" onClick={e=>e.stopPropagation()}>
        <div className="collab-modal-hdr">
          <div>
            <div className="modal-title">👥 Team del progetto</div>
            <div style={{fontSize:11,color:"var(--ink4)",marginTop:2}}>I collaboratori qui sono disponibili nell'assegnazione dei post.</div>
          </div>
          <button className="btn-ghost sm" onClick={onClose}>✕</button>
        </div>

        <div className="cs-tabs" style={{padding:"0 24px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
          {TABS.map(t=><button key={t.id} className={`cs-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>

        {toast&&<div className="ideas-toast">{toast}</div>}

        {tab==="collaboratori"&&(
          <div className="collab-body">
            <div className="collab-invite-box">
              <div className="collab-invite-title">Invita collaboratore</div>
              <div className="fg-row3" style={{marginTop:10}}>
                <div className="fg"><label className="lbl">Nome *</label><input className="inp" placeholder="es. Paolone" value={invNome} onChange={e=>setInvNome(e.target.value)}/></div>
                <div className="fg"><label className="lbl">Email</label><input className="inp" placeholder="es. paolone@nassastudio.it" value={invEmail} onChange={e=>setInvEmail(e.target.value)}/></div>
                <div className="fg"><label className="lbl">Ruolo</label>
                  <select className="inp" value={invRuolo} onChange={e=>setInvRuolo(e.target.value)}>
                    {COLLAB_ROLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="lbl">Colore</label>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                    {TASK_COLORS.slice(0,8).map(c=><div key={c} onClick={()=>setInvColore(c)} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:invColore===c?"2px solid var(--ink)":"2px solid transparent"}}/>)}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:12,alignItems:"center"}}>
                <button className="btn-primary sm" onClick={invite} disabled={!invNome.trim()}>Aggiungi</button>
                <button className="btn-ghost sm" onClick={syncFromGlobal}>↩ Importa dal Team Planner</button>
                <button className="ideas-get-btn" style={{marginLeft:"auto",padding:"7px 14px"}} onClick={notifyAll}>Notifica collaboratori</button>
              </div>
            </div>

            <div style={{overflowX:"auto"}}>
              <table className="collab-table">
                <thead>
                  <tr><th>Nome</th><th>Email</th><th>Ruolo</th><th style={{width:32}}></th></tr>
                </thead>
                <tbody>
                  {collabs.length===0&&(
                    <tr><td colSpan={4} style={{textAlign:"center",padding:"24px",color:"var(--ink5)",fontStyle:"italic",fontSize:12}}>
                      Nessun collaboratore aggiunto. Aggiungi manualmente o importa dal Team Planner.
                    </td></tr>
                  )}
                  {collabs.map((m,i)=>(
                    <tr key={m.id} className="collab-row">
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="tp-avatar" style={{background:m.colore,width:28,height:28,fontSize:11}}>{m.nome?.[0]||"?"}</div>
                          <div style={{fontWeight:600,fontSize:12}}>{m.nome}</div>
                          {i===0&&<span style={{fontSize:9,background:"#DCFCE7",color:"#16A34A",padding:"1px 7px",borderRadius:99,fontWeight:700}}>Owner</span>}
                        </div>
                      </td>
                      <td style={{fontSize:12,color:"var(--ink4)"}}>{m.email||"—"}</td>
                      <td><span style={{fontSize:11,color:"var(--ink3)"}}>{m.ruolo||"—"}</span></td>
                      <td><button className="ct-del" onClick={()=>remove(m.id)}>×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="ruoli"&&(
          <div className="collab-body">
            <div className="collab-invite-title" style={{marginBottom:12}}>Ruoli disponibili nel progetto</div>
            <table className="collab-table">
              <thead><tr><th>Ruolo</th><th>Tariffa Member</th><th>Permessi</th></tr></thead>
              <tbody>
                {[
                  {ruolo:"Owner",          tariffa:"—",        perm:"Accesso completo"},
                  {ruolo:"Direzione Creativa",tariffa:"80€/h", perm:"Modifica + Approva + Pubblica"},
                  {ruolo:"Art Director",   tariffa:"60€/h",    perm:"Modifica + Approva"},
                  {ruolo:"SMM",            tariffa:"50€/h",    perm:"Crea + Modifica"},
                  {ruolo:"Grafico Junior", tariffa:"30€/h",    perm:"Crea"},
                  {ruolo:"Ospite",         tariffa:"—",        perm:"Solo visualizzazione"},
                ].map(r=>(
                  <tr key={r.ruolo} className="collab-row">
                    <td style={{fontWeight:600,fontSize:12}}>{r.ruolo}</td>
                    <td style={{fontSize:11,color:"var(--gold)"}}>{r.tariffa}</td>
                    <td style={{fontSize:11,color:"var(--ink4)"}}>{r.perm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

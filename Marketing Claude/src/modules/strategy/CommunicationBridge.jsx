import { useState } from "react";

export const COMM_BRIDGE_TYPES = [
  { id:"educare",    label:"📚 Educare",          color:"#006EFF", desc:"Aumenta consapevolezza e competenza del pubblico" },
  { id:"fiducia",    label:"🤝 Generare Fiducia",  color:"#00C853", desc:"Costruisce credibilità e autorità del brand" },
  { id:"obiezioni",  label:"⚔️ Distruggere Obiezioni", color:"#FF6B00", desc:"Smonta le resistenze all'acquisto" },
  { id:"scarsita",   label:"⏰ Creare Scarsità",   color:"#C800FF", desc:"Urgenza e disponibilità limitata" },
  { id:"aspirazione",label:"✨ Ispirare",          color:"#00B4D8", desc:"Crea identificazione con uno stile di vita" },
  { id:"community",  label:"🔥 Attivare Community",color:"#FF1744", desc:"Stimola partecipazione e UGC" },
];

const uid = () => Math.random().toString(36).slice(2,9);

function BridgeIcon({ SvgIconComponent, size=14 }) {
  return SvgIconComponent
    ? <SvgIconComponent name="zap" size={size} color="var(--neon-magenta)" />
    : <span aria-hidden="true" style={{color:"var(--neon-magenta)",fontWeight:800}}>⚡</span>;
}

export function CommunicationBridgePanel({ project, onUpdate, SvgIconComponent }){
  const bridges = project.pdm?.communicationBridges || [];
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ obiettivo:"", bridge:"educare", note:"" });

  function upBridges(fn){
    onUpdate({...project, pdm:{...(project.pdm||{}), communicationBridges: fn(project.pdm?.communicationBridges||[])}});
  }
  function save(){
    if(!form.obiettivo.trim()) return;
    upBridges(bs=>[...bs,{id:uid(),...form,createdAt:Date.now()}]);
    setAdding(false); setForm({obiettivo:"",bridge:"educare",note:""});
  }
  function del(id){ upBridges(bs=>bs.filter(b=>b.id!==id)); }

  return(
    <div className="cb-panel">
      <div className="cb-panel-hdr">
        <div className="cb-panel-title"><BridgeIcon SvgIconComponent={SvgIconComponent} size={14}/> Cascata Strategica — Communication Bridge</div>
        <div className="cb-panel-sub">Ogni obiettivo marketing genera una leva psicologica per la comunicazione. Questi prompt guidano l'Editoriale.</div>
      </div>
      {bridges.length>0&&(
        <div className="cb-list">
          {bridges.map(b=>{
            const bt=COMM_BRIDGE_TYPES.find(x=>x.id===b.bridge)||COMM_BRIDGE_TYPES[0];
            return(
              <div key={b.id} className="cb-row" style={{borderLeft:"3px solid "+bt.color}}>
                <div style={{flex:1}}>
                  <div className="cb-row-obj">🎯 {b.obiettivo}</div>
                  <div className="cb-row-bridge" style={{color:bt.color}}>{bt.label}</div>
                  <div className="cb-row-desc">{bt.desc}</div>
                  {b.note&&<div className="cb-row-note">📝 {b.note}</div>}
                </div>
                <button className="btn-ghost sm" style={{fontSize:12,padding:"3px 7px"}} onClick={()=>del(b.id)}>x</button>
              </div>
            );
          })}
        </div>
      )}
      {adding?(
        <div className="cb-form">
          <div className="fg" style={{marginBottom:10}}>
            <label className="lbl">Obiettivo marketing</label>
            <input className="inp" placeholder="es. +30% lead qualificati entro Q3" value={form.obiettivo} onChange={e=>setForm(f=>({...f,obiettivo:e.target.value}))}/>
          </div>
          <div className="fg" style={{marginBottom:10}}>
            <label className="lbl">Leva comunicativa</label>
            <div className="cb-bridge-grid">
              {COMM_BRIDGE_TYPES.map(bt=>(
                <button key={bt.id} className={"cb-bridge-opt "+(form.bridge===bt.id?"active":"")}
                  style={form.bridge===bt.id?{borderColor:bt.color,background:bt.color+"15",color:bt.color}:{}}
                  onClick={()=>setForm(f=>({...f,bridge:bt.id}))}>
                  {bt.label}
                </button>
              ))}
            </div>
            <div className="cb-bridge-hint">{COMM_BRIDGE_TYPES.find(x=>x.id===form.bridge)?.desc}</div>
          </div>
          <div className="fg" style={{marginBottom:12}}>
            <label className="lbl">Note per il team</label>
            <input className="inp" placeholder="es. focus sulla prova sociale, usare dati reali" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-primary sm" onClick={save} disabled={!form.obiettivo.trim()}>Aggiungi bridge</button>
            <button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button>
          </div>
        </div>
      ):(
        <button className="btn-outline sm" style={{marginTop:10}} onClick={()=>setAdding(true)}>+ Aggiungi Communication Bridge</button>
      )}
    </div>
  );
}

export function StrategicCascadeBanner({ project, SvgIconComponent }){
  const bridges = project?.pdm?.communicationBridges||[];
  const [open, setOpen] = useState(false);
  if(bridges.length===0) return null;
  const preview = bridges.slice(0,2);
  return(
    <div className="scb-wrap">
      <div className="scb-header" onClick={()=>setOpen(v=>!v)}>
        <BridgeIcon SvgIconComponent={SvgIconComponent} size={13}/>
        <span className="scb-label">Cascata Strategica attiva</span>
        <div className="scb-pills">
          {preview.map(b=>{
            const bt=COMM_BRIDGE_TYPES.find(x=>x.id===b.bridge)||COMM_BRIDGE_TYPES[0];
            return(<span key={b.id} className="scb-pill" style={{background:bt.color+"18",color:bt.color,border:"1px solid "+bt.color+"40"}}>{bt.label}</span>);
          })}
          {bridges.length>2&&<span className="scb-pill" style={{background:"var(--bg2)",color:"var(--ink4)"}}>+{bridges.length-2}</span>}
        </div>
        <span className="scb-chevron">{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div className="scb-body">
          {bridges.map(b=>{
            const bt=COMM_BRIDGE_TYPES.find(x=>x.id===b.bridge)||COMM_BRIDGE_TYPES[0];
            return(
              <div key={b.id} className="scb-row" style={{borderLeft:"3px solid "+bt.color}}>
                <span className="scb-row-obj">🎯 {b.obiettivo}</span>
                <span className="scb-row-arrow">→</span>
                <span className="scb-row-bridge" style={{color:bt.color}}>{bt.label}</span>
                {b.note&&<span className="scb-row-note">· {b.note}</span>}
              </div>
            );
          })}
          <div style={{fontSize:10,color:"var(--ink4)",marginTop:6,fontStyle:"italic"}}>Queste leve guidano copy, formati e CTA di ogni post pianificato.</div>
        </div>
      )}
    </div>
  );
}

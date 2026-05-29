import { useState } from "react";
import { FEED_PIATTAFORME } from "../editorial/editorialModel";

const CREATOR_CATEGORIE = ["Micro (1K-10K)","Mid (10K-100K)","Macro (100K-1M)","Mega (1M+)","UGC Creator","Giornalista/Media"];
const CREATOR_STATUS = [
  {id:"prospect",   label:"Prospect",    color:"#006EFF"},
  {id:"contattato", label:"Contattato",  color:"#FF6B00"},
  {id:"attivo",     label:"Attivo",      color:"#00C853"},
  {id:"completato", label:"Completato",  color:"#9CA3AF"},
  {id:"no",         label:"Non adatto",  color:"#FF1744"},
];

function uid(){ return Math.random().toString(36).slice(2,9); }
function emptyCreator(){
  return { id:uid(), nome:"", handle:"", piattaforma:"instagram", categoria:"Micro (1K-10K)",
    follower:0, er:0, settore:"", stato:"prospect", fee:0, note:"", campagne:[], createdAt:Date.now() };
}

export function CreatorDatabase({ project, onUpdate }){
  const creators = project.creators || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [filterStato, setFilterStato] = useState("tutti");
  const [search, setSearch] = useState("");

  function up(fn){ onUpdate({...project,...fn(project)}); }
  function save(){
    if(!form?.nome?.trim()) return;
    up(p=>({creators:(p.creators||[]).some(c=>c.id===form.id)
      ?(p.creators||[]).map(c=>c.id===form.id?form:c)
      :[...(p.creators||[]),form]}));
    setEditing(null); setForm(null);
  }
  function del(id){ up(p=>({creators:(p.creators||[]).filter(c=>c.id!==id)})); }
  function openNew(){ const f=emptyCreator(); setForm(f); setEditing("new"); }
  function openEdit(c){ setForm({...c}); setEditing(c.id); }

  let visible = creators;
  if(filterStato!=="tutti") visible=visible.filter(c=>c.stato===filterStato);
  if(search.trim()) visible=visible.filter(c=>(c.nome+c.handle+c.settore).toLowerCase().includes(search.toLowerCase()));

  return(
    <div className="ov-card">
      <div className="ov-card-hdr">
        <div className="ov-card-title"><span style={{color:"var(--neon-magenta)",fontWeight:900}}>👥</span> Creator & Influencer Database</div>
        {!editing&&<button className="btn-outline sm" onClick={openNew}>+ Aggiungi</button>}
      </div>

      {editing&&form&&(
        <div className="creator-editor">
          <div className="fg-row" style={{marginBottom:10}}>
            <div className="fg"><label className="lbl">Nome *</label><input className="inp" autoFocus value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} placeholder="Nome e Cognome"/></div>
            <div className="fg"><label className="lbl">Handle</label><input className="inp" value={form.handle||""} onChange={e=>setForm(f=>({...f,handle:e.target.value}))} placeholder="@nomeutente"/></div>
          </div>
          <div className="fg-row" style={{marginBottom:10}}>
            <div className="fg"><label className="lbl">Piattaforma</label>
              <select className="inp" value={form.piattaforma} onChange={e=>setForm(f=>({...f,piattaforma:e.target.value}))}>
                {FEED_PIATTAFORME.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="fg"><label className="lbl">Categoria</label>
              <select className="inp" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}>
                {CREATOR_CATEGORIE.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg"><label className="lbl">Stato</label>
              <select className="inp" value={form.stato} onChange={e=>setForm(f=>({...f,stato:e.target.value}))}>
                {CREATOR_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="fg-row" style={{marginBottom:10}}>
            <div className="fg"><label className="lbl">Follower</label><input className="inp" type="number" value={form.follower||0} onChange={e=>setForm(f=>({...f,follower:+e.target.value}))}/></div>
            <div className="fg"><label className="lbl">ER %</label><input className="inp" type="number" step="0.1" value={form.er||0} onChange={e=>setForm(f=>({...f,er:+e.target.value}))}/></div>
            <div className="fg"><label className="lbl">Fee €</label><input className="inp" type="number" value={form.fee||0} onChange={e=>setForm(f=>({...f,fee:+e.target.value}))}/></div>
          </div>
          <div className="fg-row" style={{marginBottom:10}}>
            <div className="fg"><label className="lbl">Settore / Nicchia</label><input className="inp" value={form.settore||""} onChange={e=>setForm(f=>({...f,settore:e.target.value}))} placeholder="es. Food siciliano, moda sostenibile"/></div>
          </div>
          <div className="fg" style={{marginBottom:12}}><label className="lbl">Note</label>
            <textarea className="txta" rows={2} value={form.note||""} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Brief collaborazione, link contratto, feedback…"/>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-ghost sm" onClick={()=>{setEditing(null);setForm(null);}}>Annulla</button>
            <button className="btn-primary sm" onClick={save} disabled={!form.nome?.trim()}>Salva</button>
          </div>
        </div>
      )}

      {!editing&&(
        <>
          {creators.length>0&&(
            <div className="creator-filter-bar">
              <input className="inp" style={{flex:1,fontSize:11}} placeholder="🔍 Cerca creator…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="inp" style={{width:130,fontSize:11}} value={filterStato} onChange={e=>setFilterStato(e.target.value)}>
                <option value="tutti">Tutti gli stati</option>
                {CREATOR_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          )}
          {creators.length===0&&<div style={{fontSize:12,color:"var(--ink5)",fontStyle:"italic",padding:"8px 0"}}>Nessun creator ancora. Aggiungi influencer e UGC creator per le campagne di questo brand.</div>}
          <div className="creator-list">
            {visible.map(c=>{
              const cs=CREATOR_STATUS.find(s=>s.id===c.stato)||CREATOR_STATUS[0];
              const piat=FEED_PIATTAFORME.find(p=>p.id===c.piattaforma);
              return(
                <div key={c.id} className="creator-row">
                  <div className="creator-avatar" style={{background:cs.color+"20",border:"1.5px solid "+cs.color+"50"}}>
                    <span style={{fontSize:16}}>{piat?.icon||"👤"}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                      <span style={{fontWeight:700,fontSize:13,color:"var(--ink)"}}>{c.nome}</span>
                      {c.handle&&<span style={{fontSize:11,color:"var(--ink4)"}}>{c.handle}</span>}
                      <span className="creator-stato-badge" style={{background:cs.color+"18",color:cs.color}}>{cs.label}</span>
                    </div>
                    <div style={{fontSize:10,color:"var(--ink4)",display:"flex",gap:10,flexWrap:"wrap"}}>
                      <span>{c.categoria}</span>
                      {c.follower>0&&<span>👥 {c.follower>=1000?Math.round(c.follower/1000)+"K":c.follower}</span>}
                      {c.er>0&&<span>📊 ER {c.er}%</span>}
                      {c.fee>0&&<span>💶 {c.fee}€</span>}
                      {c.settore&&<span>🏷 {c.settore}</span>}
                    </div>
                    {c.note&&<div style={{fontSize:10,color:"var(--ink5)",marginTop:2,fontStyle:"italic"}}>{c.note.slice(0,60)}{c.note.length>60?"…":""}</div>}
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button className="btn-ghost sm" onClick={()=>openEdit(c)}>✎</button>
                    <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>del(c.id)}>×</button>
                  </div>
                </div>
              );
            })}
            {visible.length===0&&creators.length>0&&<div className="ct-empty" style={{padding:"12px 0"}}>Nessun creator corrisponde ai filtri.</div>}
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { FEED_PIATTAFORME, getEditorialPosts, getFeedStatusStyle } from "../editorial/editorialModel";
import {
  TASK_COLORS,
  RUOLI_NMS,
  DEFAULT_MEMBERS_NMS,
  TP_SK_MEMBERS,
  tpGet,
  tpSet,
  getWeekKey,
  getMondayOfWeek,
  addDays,
  fmtISO,
  fmtShort,
} from "./teamModel";

export function TeamPlannerNMS({projects}){
  const [weekKey,setWeekKey]=useState(getWeekKey(new Date()));
  const [members,setMembers]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(null);
  const [editTask,setEditTask]=useState(null);
  const [showAddMem,setShowAddMem]=useState(false);
  const [viewMode,setViewMode]=useState("week");
  const [fTitolo,setFTitolo]=useState(""); const [fCliente,setFCliente]=useState(""); const [fOre,setFOre]=useState(2); const [fColore,setFColore]=useState(TASK_COLORS[0]); const [fNote,setFNote]=useState("");
  const [mNome,setMNome]=useState(""); const [mRuolo,setMRuolo]=useState(RUOLI_NMS[0]); const [mColore,setMColore]=useState(TASK_COLORS[4]); const [mTariffa,setMTariffa]=useState(40);

  const monday=getMondayOfWeek(weekKey);
  const DAYS=Array.from({length:7},(_,i)=>{ const d=addDays(monday,i); return {iso:fmtISO(d),short:fmtShort(d),label:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"][i]}; });
  const todayISO=fmtISO(new Date());
  const weekISOs=new Set(DAYS.map(d=>d.iso));

  useEffect(()=>{ (async()=>{
    setLoading(true);
    const [m,t]=await Promise.all([tpGet(TP_SK_MEMBERS),tpGet("nms-tp:tasks:"+weekKey)]);
    setMembers(m||DEFAULT_MEMBERS_NMS); setTasks(t||[]);
    setLoading(false);
  })(); },[weekKey]);

  async function saveTasks(next){ setTasks(next); await tpSet("nms-tp:tasks:"+weekKey,next); }
  async function saveMembers(next){ setMembers(next); await tpSet(TP_SK_MEMBERS,next); }

  function prevWeek(){ const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()-7); setWeekKey(getWeekKey(d)); }
  function nextWeek(){ const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()+7); setWeekKey(getWeekKey(d)); }
  function openAdd(memberId,dateISO){ setFTitolo(""); setFCliente(""); setFOre(2); setFColore(TASK_COLORS[0]); setFNote(""); setEditTask(null); setShowAdd({memberId,dateISO}); }
  function openEdit(tk){ setFTitolo(tk.titolo||""); setFCliente(tk.cliente||""); setFOre(tk.ore||2); setFColore(tk.colore||TASK_COLORS[0]); setFNote(tk.note||""); setEditTask(tk); setShowAdd({memberId:tk.memberId,dateISO:tk.dateISO}); }
  async function saveTask(){ if(!fTitolo) return; if(editTask){ await saveTasks(tasks.map(t=>t.id===editTask.id?{...t,titolo:fTitolo,cliente:fCliente,ore:fOre,colore:fColore,note:fNote}:t)); } else { await saveTasks([...tasks,{id:"tk"+Date.now(),memberId:showAdd.memberId,dateISO:showAdd.dateISO,titolo:fTitolo,cliente:fCliente,ore:fOre,colore:fColore,note:fNote}]); } setShowAdd(null); setEditTask(null); }
  async function delTask(id){ await saveTasks(tasks.filter(t=>t.id!==id)); setShowAdd(null); }
  async function addMember(){ if(!mNome) return; await saveMembers([...members,{id:"m"+Date.now(),nome:mNome,ruolo:mRuolo,colore:mColore,tariffa:mTariffa,ore:40}]); setShowAddMem(false); setMNome(""); }
  async function removeMember(id){ if(!confirm("Rimuovere?")) return; await saveMembers(members.filter(m=>m.id!==id)); }

  const editorialItems = projects.flatMap(proj=>
    getEditorialPosts(proj)
      .filter(f=>f.data && weekISOs.has(f.data) && (f.membersAssigned||[]).length>0)
      .map(f=>({
        _isEditorial:true,
        id:f.id,
        titolo:f.titolo||"Post senza titolo",
        dateISO:f.data,
        membersAssigned:f.membersAssigned||[],
        stato:f.stato,
        tipo:f.tipo,
        pilastro:f.pilastro,
        piattaforme:f.piattaforme||[],
        projectName:proj.name,
        clientId:proj.clientId,
        color:getFeedStatusStyle(f.stato)?.tx||"#006EFF",
      }))
  );

  const oreWeek=mId=>{
    const manual=tasks.filter(t=>t.memberId===mId).reduce((s,t)=>s+(t.ore||0),0);
    const editorial=editorialItems.filter(ei=>ei.membersAssigned.includes(mId)).length;
    return manual+editorial;
  };
  const oreDay=dIso=>tasks.filter(t=>t.dateISO===dIso).reduce((s,t)=>s+(t.ore||0),0);
  const tasksFor=(mId,dIso)=>tasks.filter(t=>t.memberId===mId&&t.dateISO===dIso);
  const editorialFor=(mId,dIso)=>editorialItems.filter(ei=>ei.membersAssigned.includes(mId)&&ei.dateISO===dIso);
  const clientList=[...new Set(projects.map(p=>p.name).filter(Boolean))];
  const allEditorialThisWeek = editorialItems.sort((a,b)=>a.dateISO.localeCompare(b.dateISO));

  if(loading) return <div className="gen-row"><div className="spin"/>Caricamento…</div>;

  return(
    <div className="tp-wrap">
      <div className="tp-header">
        <div className="tp-nav">
          <button className="btn-ghost sm" onClick={prevWeek}>←</button>
          <div className="tp-week-label">Settimana {weekKey} &nbsp;·&nbsp; {fmtShort(monday)} — {fmtShort(addDays(monday,6))}</div>
          <button className="btn-ghost sm" onClick={nextWeek}>→</button>
          <button className="btn-ghost sm" onClick={()=>setWeekKey(getWeekKey(new Date()))}>Oggi</button>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div className="loom-view-toggle">
            <button className={`loom-toggle-btn ${viewMode==="week"?"active":""}`} onClick={()=>setViewMode("week")} title="Griglia settimanale">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
            </button>
            <button className={`loom-toggle-btn ${viewMode==="posts"?"active":""}`} onClick={()=>setViewMode("posts")} title="Vista post editoriali">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h8"/></svg>
              {editorialItems.length>0&&<span style={{position:"absolute",top:-4,right:-4,background:"var(--neon-magenta)",color:"#fff",fontSize:8,fontWeight:800,padding:"0 3px",borderRadius:99,minWidth:13,textAlign:"center"}}>{editorialItems.length}</span>}
            </button>
          </div>
          <button className="btn-outline sm" onClick={()=>setShowAddMem(true)}>+ Membro</button>
        </div>
      </div>

      {viewMode==="week"&&editorialItems.length>0&&(
        <div className="tp-editorial-legend"><span style={{color:"var(--gold)"}}>📅</span><span>Post editoriali assegnati questa settimana ({editorialItems.length}) — visualizzati come card colorate nella griglia</span></div>
      )}

      {showAddMem&&(
        <div className="ct-form" style={{margin:"0 0 14px"}}>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Nome *</label><input className="inp" value={mNome} onChange={e=>setMNome(e.target.value)} placeholder="es. Luca Giunta"/></div>
            <div className="fg"><label className="lbl">Ruolo</label><select className="inp" value={mRuolo} onChange={e=>setMRuolo(e.target.value)}>{RUOLI_NMS.map(r=><option key={r}>{r}</option>)}</select></div>
            <div className="fg"><label className="lbl">€/h</label><input className="inp" type="number" value={mTariffa} onChange={e=>setMTariffa(+e.target.value)}/></div>
            <div className="fg"><label className="lbl">Colore</label><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{TASK_COLORS.map(c=><div key={c} onClick={()=>setMColore(c)} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:mColore===c?"2px solid var(--ink)":"2px solid transparent"}}/>)}</div></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setShowAddMem(false)}>Annulla</button><button className="btn-primary sm" onClick={addMember} disabled={!mNome}>Aggiungi</button></div>
        </div>
      )}

      {viewMode==="week"&&(
        <div className="tp-grid-wrap">
          <table className="tp-table">
            <thead><tr><th className="tp-th-member">Membro</th>{DAYS.map(d=><th key={d.iso} className={`tp-th-day ${d.iso===todayISO?"tp-today-col":""}`}><div>{d.label}</div><div className="tp-day-date">{d.short}</div>{oreDay(d.iso)>0&&<div className="tp-day-ore">{oreDay(d.iso)}h</div>}</th>)}<th className="tp-th-tot">Sett.</th></tr></thead>
            <tbody>
              {members.map(m=>{
                const tot=oreWeek(m.id),pct=Math.min(100,Math.round((tot/(m.ore||40))*100));
                return(<tr key={m.id}>
                  <td className="tp-td-member"><div style={{display:"flex",alignItems:"center",gap:8}}><div className="tp-avatar" style={{background:m.colore}}>{m.nome?.[0]||"?"}</div><div><div className="tp-member-name">{m.nome}</div><div className="tp-member-role">{m.ruolo}</div></div><button className="ct-del" onClick={()=>removeMember(m.id)}>×</button></div></td>
                  {DAYS.map(d=>{
                    const dTasks=tasksFor(m.id,d.iso); const dEditorial=editorialFor(m.id,d.iso);
                    return(<td key={d.iso} className={`tp-td ${d.iso===todayISO?"tp-today-col":""}`} onClick={()=>openAdd(m.id,d.iso)}>
                      {dTasks.map(tk=><div key={tk.id} className="tp-task" style={{background:tk.colore+"18",borderLeft:`3px solid ${tk.colore}`}} onClick={e=>{e.stopPropagation();openEdit(tk);}}><div className="tp-task-title">{tk.titolo}</div>{tk.cliente&&<div className="tp-task-client">{tk.cliente}</div>}<div className="tp-task-ore">{tk.ore}h</div></div>)}
                      {dEditorial.map(ei=>{ const st=getFeedStatusStyle(ei.stato); const piatIcon={"instagram":"📸","facebook":"📘","tiktok":"🎵","linkedin":"💼"}[ei.piattaforme[0]]||"📱"; return(
                        <div key={ei.id} className="tp-editorial-task" style={{background:st.tx+"12",borderLeft:`3px solid ${st.tx}`}} onClick={e=>e.stopPropagation()} title={`${ei.projectName} · ${ei.pilastro||""} · ${st.label}`}>
                          <div className="tp-editorial-icon">{piatIcon}</div><div style={{flex:1,minWidth:0}}><div className="tp-task-title">{ei.titolo}</div><div className="tp-editorial-meta"><span style={{color:st.tx,fontWeight:700}}>{st.label}</span>{ei.pilastro&&<span>· {ei.pilastro}</span>}</div><div className="tp-editorial-project">{ei.projectName}</div></div>
                        </div>);})}
                      <div className="tp-add-hint">+</div>
                    </td>);
                  })}
                  <td className="tp-td-tot"><div className="tp-ore-tot" style={{color:pct>100?"var(--err)":pct>80?"var(--warn)":"var(--ok)"}}>{tot}h</div><div className="tp-ore-cap">/ {m.ore||40}h</div><div className="tp-ore-bar"><div style={{width:pct+"%",background:pct>100?"var(--err)":pct>80?"var(--warn)":"var(--ok)"}}/></div></td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode==="posts"&&(
        <div style={{padding:"16px 20px",overflowY:"auto",flex:1}}>
          {allEditorialThisWeek.length===0?(
            <div className="ct-empty" style={{padding:"48px 0"}}>Nessun post con membri assegnati per questa settimana.<br/><span style={{fontSize:11,marginTop:8,display:"block"}}>Assegna un membro dal PostFormModal (campo Assegna team) per vederlo qui.</span></div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {allEditorialThisWeek.map(ei=>{ const st=getFeedStatusStyle(ei.stato); const assignedMembers=ei.membersAssigned.map(id=>members.find(m=>m.id===id)).filter(Boolean); return(
                <div key={ei.id} className="tp-editorial-row">
                  <div className="tp-editorial-row-date">{DAYS.find(d=>d.iso===ei.dateISO)?.label||""}<br/><span style={{fontSize:9}}>{ei.dateISO}</span></div>
                  <div className="tp-editorial-row-body"><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span className="llist-stato" style={{background:st.bg,color:st.tx,fontSize:10,padding:"2px 8px"}}>{st.icon} {st.label}</span><span style={{fontSize:11,fontWeight:700,color:"var(--ink)"}}>{ei.titolo}</span></div><div style={{fontSize:10,color:"var(--ink4)",display:"flex",gap:10}}><span>📁 {ei.projectName}</span>{ei.pilastro&&<span>🏷 {ei.pilastro}</span>}{ei.piattaforme.length>0&&<span>📡 {ei.piattaforme.join(", ")}</span>}</div></div>
                  <div className="tp-editorial-row-team">{assignedMembers.length>0 ? assignedMembers.map(m=><div key={m.id} className="tp-editorial-avatar" style={{background:m.colore}} title={m.nome}>{m.nome?.[0]||"?"}</div>) : <span style={{fontSize:10,color:"var(--ink5)"}}>—</span>}</div>
                </div>
              );})}
            </div>
          )}
        </div>
      )}

      {showAdd&&(
        <div className="modal-overlay" onClick={()=>setShowAdd(null)}>
          <div className="modal sm" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><div className="modal-title">{editTask?"Modifica task":"+ Task"}</div><button className="btn-ghost sm" onClick={()=>setShowAdd(null)}>✕</button></div>
            <div className="modal-body">
              <div className="fg" style={{marginBottom:10}}><label className="lbl">Titolo *</label><input className="inp" value={fTitolo} onChange={e=>setFTitolo(e.target.value)} placeholder="es. Copy post LinkedIn" autoFocus/></div>
              <div className="fg-row" style={{marginBottom:10}}><div className="fg"><label className="lbl">Progetto</label><select className="inp" value={fCliente} onChange={e=>setFCliente(e.target.value)}><option value="">— Nessuno —</option>{clientList.map(c=><option key={c}>{c}</option>)}</select></div><div className="fg"><label className="lbl">Ore</label><input className="inp" type="number" min={0.5} step={0.5} value={fOre} onChange={e=>setFOre(+e.target.value)}/></div></div>
              <div className="fg" style={{marginBottom:10}}><label className="lbl">Note</label><input className="inp" value={fNote} onChange={e=>setFNote(e.target.value)} placeholder="Dettagli, link, riferimenti"/></div>
              <div className="fg"><label className="lbl">Colore</label><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>{TASK_COLORS.map(c=><div key={c} onClick={()=>setFColore(c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:fColore===c?"2px solid var(--ink)":"2px solid transparent"}}/>)}</div></div>
            </div>
            <div className="modal-foot">{editTask&&<button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>delTask(editTask.id)}>Elimina</button>}<div style={{flex:1}}/><button className="btn-ghost sm" onClick={()=>setShowAdd(null)}>Annulla</button><button className="btn-primary sm" onClick={saveTask} disabled={!fTitolo}>Salva</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

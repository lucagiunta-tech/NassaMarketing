import { useEffect, useState } from "react";
import {
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  FEED_PIATTAFORME,
  getFeedStatusStyle,
  getEditorialPosts,
  applyEdUpdate,
} from "./editorialModel";
import { getPillarColor, getIdeaStatusStyle } from "./editorialTheme";

const TP_SK_MEMBERS = "nms-tp:members";
const DEFAULT_MEMBERS_NMS = [
  { id:"luca",     nome:"Luca Giunta",       ruolo:"Direzione Creativa",  colore:"#16A34A", tariffa:80, ore:40 },
  { id:"alberto",  nome:"Alberto Arcidiac.", ruolo:"Direzione Creativa",  colore:"#1565C0", tariffa:80, ore:40 },
  { id:"giacomo",  nome:"Giacomo",           ruolo:"Art Director",        colore:"#8E44AD", tariffa:60, ore:32 },
  { id:"paolone",  nome:"Paolone",           ruolo:"Marketing Operativo", colore:"#E65100", tariffa:40, ore:32 },
  { id:"akash",    nome:"Akash",             ruolo:"AI & Google",         colore:"#0A66C2", tariffa:50, ore:24 },
  { id:"paoletto", nome:"Paoletto",          ruolo:"Video Maker",         colore:"#C2185B", tariffa:40, ore:24 },
  { id:"hermes",   nome:"Hermes",            ruolo:"Grafico Junior",      colore:"#F57F17", tariffa:30, ore:32 },
  { id:"matteo",   nome:"Matteo",            ruolo:"Grafico Junior",      colore:"#795548", tariffa:30, ore:24 },
];


function fmtISO(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

async function loadTeamMembers(){
  try {
    if (typeof window !== "undefined" && window.storage?.get) {
      const r = await window.storage.get(TP_SK_MEMBERS);
      return r?.value ? JSON.parse(r.value) : null;
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const value = window.localStorage.getItem(TP_SK_MEMBERS);
      return value ? JSON.parse(value) : null;
    }
  } catch (error) {
    // Storage key not found (expected on first load) — use default members
  }
  return null;
}

function defaultEmptyFeedItem(){
  return {
    id: Math.random().toString(36).slice(2,9),
    titolo: "",
    tipo: "post",
    piattaforme: ["instagram"],
    stato: "bozza",
    data: "",
    time: "",
    caption: "",
    createdAt: Date.now(),
  };
}

function defaultExtractPilastri(project){
  return project?.pilastri || [];
}

export function CalendarSimpleED({ project, onUpdate, onEditPost, PostFormModalComponent=null, createEmptyPost=defaultEmptyFeedItem, getPilastri=defaultExtractPilastri }){
  return (
    <CalendarViewED
      project={project}
      onUpdate={onUpdate}
      onEditPost={onEditPost}
      PostFormModalComponent={PostFormModalComponent}
      createEmptyPost={createEmptyPost}
      getPilastri={getPilastri}
    />
  );
}

// ─── CALENDAR VIEW ED (Loomly-style) ─────────────────────────────────────────
const CAL_DAYS_IT = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const CAL_MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

function CalendarViewED({ project, onUpdate, onEditPost, PostFormModalComponent, createEmptyPost, getPilastri }) {
  const today = new Date();
  const todayISO = fmtISO(today);
  const [month,  setMonth]  = useState(today.getMonth());
  const [year,   setYear]   = useState(today.getFullYear());
  const [filter, setFilter] = useState("current"); // current | next | next2 | all
  const [editingPost, setEditingPost] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [hover,  setHover]  = useState(null);
  const [calMembers, setCalMembers] = useState([]);

  useEffect(()=>{
    const projCollab = project.ed?.collaboratori||[];
    if(projCollab.length>0) setCalMembers(projCollab);
    else loadTeamMembers().then(m=>setCalMembers(m||DEFAULT_MEMBERS_NMS));
  },[project.id]);

  const feedItems = getEditorialPosts(project);
  const ideeItems = (project.ed?.ideas || []).filter(i=>i.data);

  function upFeed(fn){ if(onUpdate) onUpdate(applyEdUpdate(project, fn)); }
  function updatePostDate(id,newDate){ upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).map(f=>f.id===id?{...f,data:newDate}:f)})); }
  function addPostOnDate(date){ const item=createEmptyPost(); item.data=date; upFeed(ed=>({...ed,feedItems:[...(ed.feedItems||[]),item]})); }

  // Filter periods
  function monthOffset(n){ const d=new Date(today.getFullYear(),today.getMonth()+n,1); return {m:d.getMonth(),y:d.getFullYear()}; }
  const periods = [
    {id:"current", label:"Questo mese", ...monthOffset(0)},
    {id:"next",    label:"Prossimo",    ...monthOffset(1)},
    {id:"next2",   label:"+2 mesi",     ...monthOffset(2)},
    {id:"all",     label:"Tutti",       m:-1, y:-1},
  ];

  // Sync calendar month to filter selection
  function selectFilter(pid){
    setFilter(pid);
    const p=periods.find(x=>x.id===pid);
    if(p&&p.m!==-1){ setMonth(p.m); setYear(p.y); }
  }

  // Calendar grid helpers
  const firstDay = new Date(year,month,1).getDay();
  const offset   = (firstDay+6)%7;
  const daysInMonth = new Date(year,month+1,0).getDate();
  const prevMonthDays = new Date(year,month,0).getDate();

  function isoForDay(d){ return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function postsForDay(d){ const iso=isoForDay(d); return feedItems.filter(f=>f.data===iso); }
  function ideeForDay(d){ const iso=isoForDay(d); return ideeItems.filter(i=>i.data===iso); }

  // Drag & drop
  function onDragStart(e,id){ e.dataTransfer.setData("text/plain",id); setDragId(id); }
  function onDragOver(e,d){ e.preventDefault(); setHover(d); }
  function onDrop(e,d){ e.preventDefault(); const id=e.dataTransfer.getData("text/plain")||dragId; if(id) updatePostDate(id,isoForDay(d)); setDragId(null); setHover(null); }
  function onDragEnd(){ setDragId(null); setHover(null); }

  function prevMonth(){ if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setFilter(""); }
  function nextMonth(){ if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setFilter(""); }

  // All-items list (when filter=all)
  const allItems = [...feedItems.map(p=>({...p,_type:"post"})), ...ideeItems.map(i=>({...i,_type:"idea"}))]
    .sort((a,b)=>(a.data||"").localeCompare(b.data||""));

  return(
    <div className="loom-cal-outer">
      {/* TOP BAR */}
      <div className="loom-cal-topbar">
        {/* Period filter */}
        <div className="cal-period-strip">
          {periods.map(p=>(
            <button key={p.id} className={`cal-period-btn ${filter===p.id?"active":""}`}
              onClick={()=>selectFilter(p.id)}>
              {p.label}
              {p.m!==-1&&<span className="cal-period-month">
                {CAL_MONTHS_IT[p.m]?.slice(0,3)} {p.y}
              </span>}
            </button>
          ))}
        </div>
        {/* Month nav (hidden in "all" mode) */}
        {filter!=="all"&&(
          <div className="loom-cal-nav" style={{marginLeft:12}}>
            <button className="loom-nav-arrow" onClick={prevMonth}>‹</button>
            <div className="loom-cal-month">{CAL_MONTHS_IT[month]} {year}</div>
            <button className="loom-nav-arrow" onClick={nextMonth}>›</button>
          </div>
        )}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button className="btn-ghost sm" onClick={()=>{setMonth(today.getMonth());setYear(today.getFullYear());setFilter("current");}}>Oggi</button>
          <button className="btn-primary sm" onClick={()=>addPostOnDate(todayISO)}>+ Post</button>
        </div>
      </div>

      {/* ALL LIST VIEW */}
      {filter==="all"&&(
        <div className="llist-wrap">
          {allItems.length===0
            ?<div className="ct-empty" style={{padding:"60px 0"}}>Nessun contenuto pianificato.</div>
            :<table className="llist-table">
              <thead><tr>
                <th className="llist-th-subject">Soggetto</th>
                <th className="llist-th-date" style={{color:"var(--ok)"}}>Data</th>
                <th>Formato</th><th>Canali</th><th>Caption</th><th>Media</th><th>Stato</th>
              </tr></thead>
              <tbody>
              {allItems.map(item=>{
                if(item._type==="idea"){
                  const col=getIdeaStatusStyle(item.stato);
                  const dateObj=item.data?new Date(item.data+"T12:00:00"):null;
                  return(<tr key={item.id} className="llist-row" style={{background:"#F0FDF4"}}>
                    <td><div style={{display:"flex",alignItems:"center",gap:6}}>💡<span className="llist-title" style={{color:"#16A34A"}}>{item.titolo}</span></div></td>
                    <td><div style={{fontSize:12,fontWeight:600}}>{dateObj?.toLocaleDateString("it-IT",{day:"2-digit",month:"short",weekday:"short"})||"—"}</div></td>
                    <td>{FEED_TIPI_ICON[item.tipo]} {item.tipo}</td>
                    <td>—</td><td><span className="llist-copy-preview">{item.descrizione||""}</span></td><td>—</td>
                    <td><div className="llist-stato" style={{background:col.bg,color:col.color}}>{col.label}</div></td>
                  </tr>);
                }
                const post=item;
                const st=getFeedStatusStyle(post.stato);
                const piats=(post.piattaforme||[]).map(id=>FEED_PIATTAFORME.find(p=>p.id===id)).filter(Boolean);
                const src=post.immagineBase64||post.immagineUrl||"";
                const dateObj=post.data?new Date(post.data+"T12:00:00"):null;
                return(<tr key={post.id} className="llist-row">
                  <td className="llist-td-subject">
                    <div className="llist-title" onClick={()=>setEditingPost(post)}>{post.titolo||"Post senza titolo"}</div>
                    {post.pilastro&&<span style={{fontSize:9,color:getPillarColor(post.pilastro),fontWeight:700}}>{post.pilastro}</span>}
                  </td>
                  <td className="llist-td-date">
                    <div style={{fontWeight:600,fontSize:12}}>{dateObj?.toLocaleDateString("it-IT",{weekday:"short",day:"2-digit",month:"short"})||"—"}</div>
                    {post.time&&<div style={{fontSize:10,color:"var(--ink4)"}}>{post.time}</div>}
                  </td>
                  <td><span style={{fontSize:11}}>{FEED_TIPI_ICON[post.tipo]} {FEED_TIPI_LABEL[post.tipo]||"Post"}</span></td>
                  <td><div style={{display:"flex",gap:3}}>{piats.map(p=><span key={p.id} className="pgc-piat-dot" style={{background:p.color,width:10,height:10}} title={p.label}/>)}</div></td>
                  <td className="llist-td-copy"><span className="llist-copy-preview">{post.caption||<span style={{color:"var(--ink5)",fontStyle:"italic"}}>—</span>}</span></td>
                  <td>{src?<img src={src} className="llist-thumb" alt="" onError={e=>e.target.style.display="none"}/>:<span style={{fontSize:10,color:"var(--ink5)"}}>—</span>}</td>
                  <td>
                    <div className="llist-stato" style={{background:st.bg,color:st.tx}}>{st.icon} {st.label.replace(/[✅🚀🕐👁️✏️❌]/g,"").trim()}</div>
                    <button className="llist-action-btn" onClick={()=>setEditingPost(post)}>Modifica →</button>
                  </td>
                </tr>);
              })}
              </tbody>
            </table>
          }
        </div>
      )}

      {/* CALENDAR GRID VIEW */}
      {filter!=="all"&&(
        <div className="lcal-wrap">
          <div className="lcal-grid-hdr">{CAL_DAYS_IT.map(d=><div key={d} className="lcal-day-hdr">{d}</div>)}</div>
          <div className="lcal-grid">
            {Array(offset).fill(null).map((_,i)=>(
              <div key={"p"+i} className="lcal-cell lcal-cell-other"><div className="lcal-num">{prevMonthDays-offset+1+i}</div></div>
            ))}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const d=i+1;
              const iso=isoForDay(d);
              const isToday=iso===todayISO;
              const isPast=iso<todayISO;
              const dayPosts=postsForDay(d);
              const dayIdee=ideeForDay(d);
              const isHover=hover===d;
              return(
                <div key={d} className={`lcal-cell ${isPast?"lcal-cell-past":""} ${isHover?"lcal-cell-hover":""}`}
                  onDragOver={e=>onDragOver(e,d)} onDrop={e=>onDrop(e,d)} onDragLeave={()=>setHover(null)}>
                  <div className="lcal-cell-top">
                    <div className={`lcal-num ${isToday?"lcal-num-today":""}`}>{d}</div>
                    <button className="lcal-add-btn" onClick={e=>{e.stopPropagation();addPostOnDate(iso);}}>⊕ Add Post</button>
                  </div>
                  <div className="lcal-posts">
                    {dayPosts.map(post=>{
                      const st=getFeedStatusStyle(post.stato);
                      const piats=(post.piattaforme||[]).map(id=>FEED_PIATTAFORME.find(p=>p.id===id)).filter(Boolean);
                      return(
                        <div key={post.id} className={`lcal-post-chip ${dragId===post.id?"lcal-dragging":""}`}
                          draggable onDragStart={e=>onDragStart(e,post.id)} onDragEnd={onDragEnd}
                          onClick={e=>{e.stopPropagation();setEditingPost(post);}}>
                          <div className="lcal-chip-inner">
                            <span className="lcal-chip-dot" style={{background:st.tx}}/>
                            <span className="lcal-chip-title">{post.titolo||"Post"}</span>
                            {post.time&&<span className="lcal-chip-time">{post.time}</span>}
                            <span className="lcal-chip-menu">✎</span>
                          </div>
                          {piats.length>0&&<div className="lcal-chip-piats">{piats.map(p=><span key={p.id} style={{color:p.color,fontSize:8,fontWeight:700,marginRight:2}}>{p.label}</span>)}</div>}
                          <div className="lcal-chip-stato" style={{color:st.tx}}>{st.label.replace(/[✅🚀🕐👁️✏️❌]/g,"").trim()}</div>
                        </div>
                      );
                    })}
                    {dayIdee.map(idea=>{
                      const col=getIdeaStatusStyle(idea.stato);
                      return(
                        <div key={idea.id} className="lcal-idea-chip">
                          <span className="lcal-chip-dot" style={{background:col.color}}/>
                          <span className="lcal-chip-title">💡 {idea.titolo||"Idea"}</span>
                          <span className="lcal-idea-col" style={{color:col.color}}>{col.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {Array(Math.ceil((offset+daysInMonth)/7)*7-(offset+daysInMonth)).fill(null).map((_,i)=>(
              <div key={"n"+i} className="lcal-cell lcal-cell-other"><div className="lcal-num">{i+1}</div></div>
            ))}
          </div>
        </div>
      )}

      {editingPost&&PostFormModalComponent&&(
        <PostFormModalComponent item={editingPost} members={calMembers} project={project} pilastri={getPilastri(project)}
          onSave={item=>{upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).map(f=>f.id===item.id?item:f)}));setEditingPost(null);}}
          onDelete={id=>{upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).filter(f=>f.id!==id)}));setEditingPost(null);}}
          onClose={()=>setEditingPost(null)}/>
      )}
    </div>
  );
}

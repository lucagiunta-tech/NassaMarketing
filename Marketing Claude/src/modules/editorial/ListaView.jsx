import { useState } from "react";
import {
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  FEED_PIATTAFORME,
  getFeedStatusStyle,
} from "./editorialModel";
import { getPillarColor, getIdeaStatusStyle } from "./editorialTheme";

export function ListaView({ feedItems, ideeItems, onEdit }){
  const today=new Date();
  function monthISO(n){ const d=new Date(today.getFullYear(),today.getMonth()+n,1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; }
  const [listFilter,setListFilter]=useState("current");
  const periods=[
    {id:"current",label:"Questo mese", iso:monthISO(0)},
    {id:"next",   label:"Prossimo",    iso:monthISO(1)},
    {id:"next2",  label:"+2 mesi",     iso:monthISO(2)},
    {id:"all",    label:"Tutti",        iso:null},
  ];
  const activePeriod=periods.find(p=>p.id===listFilter);
  const allItems=[
    ...feedItems.map(p=>({...p,_type:"post"})),
    ...ideeItems.map(i=>({...i,_type:"idea"}))
  ].filter(item=>!activePeriod?.iso||item.data?.startsWith(activePeriod.iso))
   .sort((a,b)=>(a.data||"").localeCompare(b.data||""));

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div className="contenuti-list-toolbar">
        <div className="cal-period-strip">
          {periods.map(p=>(
            <button key={p.id} className={`cal-period-btn ${listFilter===p.id?"active":""}`} onClick={()=>setListFilter(p.id)}>
              {p.label}
              {p.iso&&<span className="cal-period-month">{p.iso}</span>}
            </button>
          ))}
        </div>
        <span style={{fontSize:11,color:"var(--ink4)",marginLeft:"auto"}}>{allItems.length} contenuti</span>
      </div>
      <div className="llist-wrap">
        {allItems.length===0
          ?<div className="ct-empty" style={{padding:"40px 0"}}>Nessun contenuto per il periodo selezionato.</div>
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
                return(<tr key={item.id} className="llist-row" style={{background:"#F0FDF4"}}>
                  <td><div style={{display:"flex",alignItems:"center",gap:6}}>💡<span className="llist-title" style={{color:"#16A34A"}}>{item.titolo}</span></div></td>
                  <td><div style={{fontSize:12,fontWeight:600}}>{item.data||"—"}</div></td>
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
                  <div className="llist-title" onClick={()=>onEdit(post)}>{post.titolo||"Post senza titolo"}</div>
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
                  <button className="llist-action-btn" onClick={()=>onEdit(post)}>Modifica →</button>
                </td>
              </tr>);
            })}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}


export default ListaView;

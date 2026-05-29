import { useState } from "react";
import { openMetaOAuth } from "../../services/metaService";

export function GlobalMetaConnect({ globalMeta, onMetaChange }) {
  const [pages, setPages] = useState([]);
  const [conn,  setConn]  = useState(false);
  function connect(){
    setConn(true);
    openMetaOAuth(pgs=>{ setPages(Array.isArray(pgs)?pgs:[]); setConn(false); });
  }
  function confirmPage(pg){
    const m={
      ig:{userId:pg.instagram_business_account?.id||"",token:pg.access_token},
      fb:{pageId:pg.id,token:pg.access_token},
      nome:pg.name,
      allPages:pages.map(p=>({id:p.id,nome:p.name,igId:p.instagram_business_account?.id||"",token:p.access_token}))
    };
    onMetaChange?.(m);
    setPages([]);
  }
  if(pages.length>0) return(
    <div className="gm-modal-overlay" onClick={()=>setPages([])}>
      <div className="gm-modal" onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:700,marginBottom:12,fontSize:13}}>Seleziona pagina principale</div>
        {pages.map(pg=><div key={pg.id} className="meta-page-row" onClick={()=>confirmPage(pg)}><div style={{fontWeight:600}}>{pg.name}</div><div style={{fontSize:10,color:"var(--ink4)"}}>{pg.instagram_business_account?"✅ IG connesso":""}</div></div>)}
        <button className="btn-ghost sm" style={{marginTop:8}} onClick={()=>setPages([])}>Annulla</button>
      </div>
    </div>
  );
  if(globalMeta) return(
    <div className="gm-status">
      <span className="meta-dot-ok"/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:10,fontWeight:700,color:"#94A3B8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{globalMeta.nome||"Meta connesso"}</div>
        <div style={{fontSize:9,color:"#64748B"}}>{(globalMeta.allPages||[]).length||1} pagine</div>
      </div>
      <button style={{background:"none",border:"none",color:"#475569",fontSize:10,cursor:"pointer",flexShrink:0}} onClick={()=>onMetaChange?.(null)}>×</button>
    </div>
  );
  return <button className={`sb-meta-btn ${conn?"loading":""}`} onClick={connect}>{conn?"Connessione…":"🔗 Connetti Meta"}</button>;
}

export default GlobalMetaConnect;

import { useState } from "react";
import { igPublish, fbPublish } from "../../services/metaService";

export function PublishModal({post,meta,onClose,onPublished}){
  const igOk=meta?.ig?.userId&&meta?.ig?.token;
  const fbOk=meta?.fb?.pageId&&meta?.fb?.token;
  const [mode,setMode]=useState("ora");
  const postTitle = post.title || post.titolo || "Contenuto";
  const initialDate = post.dueDate || post.data || post.dateISO || new Date().toISOString().slice(0,10);
  const [schedDate,setSchedDate]=useState(initialDate);
  const [schedTime,setSchedTime]=useState("09:00");
  const [status,setStatus]=useState("idle");
  const [results,setResults]=useState([]);
  const [videoWait,setVideoWait]=useState(false);
  const [selIG,setSelIG]=useState(!!igOk);
  const [selFB,setSelFB]=useState(!!fbOk);
  const schedUnix=mode==="pianifica"&&schedDate?Math.floor(new Date(schedDate+"T"+schedTime+":00").getTime()/1000):null;
  const isReel=(post.tipo||post.format||"").toLowerCase()==="reel";
  async function publish(){
    if(!igOk&&!fbOk) return; setStatus("publishing"); const out=[];
    if(igOk&&selIG){ try{ if(isReel)setVideoWait(true); await igPublish(meta.ig.userId,meta.ig.token,post,schedUnix); setVideoWait(false); out.push({platform:"Instagram",ok:true}); }catch(e){ setVideoWait(false); out.push({platform:"Instagram",ok:false,msg:e.message}); } }
    if(fbOk&&selFB){ try{ await fbPublish(meta.fb.pageId,meta.fb.token,post,schedUnix); out.push({platform:"Facebook",ok:true}); }catch(e){ out.push({platform:"Facebook",ok:false,msg:e.message}); } }
    setResults(out); const anyOk=out.some(r=>r.ok); setStatus(anyOk?"success":"error");
    if(anyOk) onPublished?.(mode==="pianifica"?"pianificato":"pubblicato");
  }
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal sm" onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div><div className="modal-title">📢 Pubblica</div><div style={{fontSize:11,color:"var(--ink4)",marginTop:2}}>{postTitle}</div></div><button className="btn-ghost sm" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          {status==="idle"&&(<>
            {!igOk&&!fbOk&&<div className="pub-warn">Nessun account Meta connesso. Connetti nella sezione Publishing Hub.</div>}
            {(igOk||fbOk)&&(<>
              <div className="pub-platforms">
                {igOk&&<label className="pub-plat-check"><input type="checkbox" checked={selIG} onChange={e=>setSelIG(e.target.checked)}/> Instagram</label>}
                {fbOk&&<label className="pub-plat-check"><input type="checkbox" checked={selFB} onChange={e=>setSelFB(e.target.checked)}/> Facebook</label>}
              </div>
              <div className="pub-mode">
                <button className={`pub-mode-btn ${mode==="ora"?"active":""}`} onClick={()=>setMode("ora")}>Ora</button>
                <button className={`pub-mode-btn ${mode==="pianifica"?"active":""}`} onClick={()=>setMode("pianifica")}>Pianifica</button>
              </div>
              {mode==="pianifica"&&<div className="fg-row" style={{marginTop:12}}><div className="fg"><label className="lbl">Data</label><input className="inp" type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)}/></div><div className="fg"><label className="lbl">Ora</label><input className="inp" type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)}/></div></div>}
              {post.caption&&<div className="pub-caption-preview">{post.caption.slice(0,200)}{post.caption.length>200?"…":""}</div>}
            </>)}
          </>)}
          {status==="publishing"&&<div style={{textAlign:"center",padding:"28px 0"}}><div className="spin" style={{margin:"0 auto 14px",width:32,height:32,borderWidth:3}}/><div style={{fontWeight:700}}>{videoWait?"Elaborazione video (1-2 min)…":"Pubblicazione…"}</div></div>}
          {status==="success"&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40,marginBottom:12}}>🎉</div><div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{mode==="pianifica"?"Pianificato!":"Pubblicato!"}</div>{results.map(r=><div key={r.platform} style={{fontSize:12,color:r.ok?"var(--ok)":"var(--err)",marginBottom:4}}>{r.ok?"✅":"❌"} {r.platform}{r.msg?" — "+r.msg:""}</div>)}<button className="btn-primary" style={{marginTop:16}} onClick={onClose}>Chiudi</button></div>}
          {status==="error"&&<div>{results.map(r=><div key={r.platform} style={{fontSize:12,color:"var(--err)",background:"#FFF0F3",borderRadius:6,padding:"8px 12px",marginBottom:6}}>❌ <strong>{r.platform}</strong>: {r.msg}</div>)}<button className="btn-ghost sm" onClick={()=>setStatus("idle")}>Riprova</button></div>}
        </div>
        {status==="idle"&&(igOk||fbOk)&&<div className="modal-foot"><button className="btn-ghost sm" onClick={onClose}>Annulla</button><button className="btn-primary sm" onClick={publish} disabled={!selIG&&!selFB}>{mode==="pianifica"?"Pianifica":"Pubblica ora"}</button></div>}
      </div>
    </div>
  );
}



export default PublishModal;

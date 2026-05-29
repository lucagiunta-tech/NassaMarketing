import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { buildCtx, uid } from "../../templates/templateUtils";
import { applyEdUpdate, getChannelColor } from "./editorialModel";

const KAN_COLS = {
  idea:       { emoji:"💡", label:"Idea",        bg:"#FFF8E1", tx:"#92400E" },
  produzione: { emoji:"✏️",  label:"Produzione",  bg:"#FEF3C7", tx:"#D97706" },
  semaforo:   { emoji:"🚦", label:"Semaforo",    bg:"#EDE9FE", tx:"#7C3AED" },
  approvato:  { emoji:"✅", label:"Approvato",   bg:"#ECFDF5", tx:"#059669" },
  live:       { emoji:"🚀", label:"Live",         bg:"#F0FDF4", tx:"#16A34A" },
};

const KAN_NEXT = { idea:"produzione", produzione:"semaforo", semaforo:"approvato", approvato:"live" };
const KAN_NEXT_LABEL = { idea:"→ Produzione", produzione:"→ Semaforo", semaforo:"→ Approvato", approvato:"📤 Approva" };
const CONTENT_TRACKER_CHANNELS = ["LinkedIn", "Instagram", "Facebook", "TikTok", "YouTube", "Email", "Blog", "Altro"];

export function ContentTrackerED({ project, onUpdate }) {
  const items = project?.ed?.contentItems || [];
  const [adding, setAdding] = useState(false);
  const [aiItem, setAiItem] = useState(null);
  const [form, setForm] = useState({title:"",format:"Post",pilastro:"",canale:"LinkedIn",funnel:"TOFU",dueDate:"",immagineUrl:"",videoUrl:""});
  function upEd(fn){ onUpdate?.(applyEdUpdate(project, fn)); }
  function addItem(){ if(!form.title) return; upEd(ed=>({...ed,contentItems:[...(ed.contentItems||[]),{...form,id:uid(),tipo:form.format.toLowerCase(),status:"idea",caption:"",createdAt:Date.now()}]})); setAdding(false); setForm({title:"",format:"Post",pilastro:"",canale:"LinkedIn",funnel:"TOFU",dueDate:"",immagineUrl:"",videoUrl:""}); }
  function move(id,status){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,status}:i)})); }
  function del(id){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).filter(i=>i.id!==id)})); }
  function upCaption(id,caption){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,caption}:i)})); }
  async function genCaption(item){
    setAiItem(item.id);
    const bv=project.pdc?.sections?.tone_of_voice?.content?.slice(0,400)||"";
    const mh=project.pdc?.sections?.message_house?.content?.slice(0,300)||"";
    const ctx=buildCtx(project.interview||{});
    try { const t=await callClaude(`Copywriter B2B. Caption per ${item.canale}. SOLO la caption.\nCONTENUTO: ${item.title} | FORMATO: ${item.format} | FUNNEL: ${item.funnel}\nBRAND VOICE: ${bv}\nMESSAGE HOUSE: ${mh}\nBRAND: ${ctx.slice(0,300)}\nRegole: frasi corte · no emoji · CTA tecnica · tono B2B.`); upCaption(item.id,t); } catch(error){ console.error("Content tracker caption error", error); }
    finally { setAiItem(null); }
  }
  return(
    <div className="kan-wrap">
      <div className="kan-toolbar">
        <div className="kan-counts">{Object.keys(KAN_COLS).map(k=>{ const n=items.filter(i=>i.status===k).length; return n>0?<span key={k} style={{color:KAN_COLS[k].tx,background:KAN_COLS[k].bg,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700}}>{KAN_COLS[k].emoji} {n}</span>:null; })}</div>
        <button className="btn-primary sm" onClick={()=>setAdding(true)}>+ Contenuto</button>
      </div>
      {adding&&(
        <div className="ct-form">
          <div className="fg"><label className="lbl">Titolo / Idea *</label><input className="inp" placeholder="es. Esosomi: come li formuliamo in 3 veicoli" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Formato</label><input className="inp" placeholder="Post / Reel / Carousel" value={form.format} onChange={e=>setForm({...form,format:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Pilastro</label><input className="inp" placeholder="es. Library Advanced" value={form.pilastro} onChange={e=>setForm({...form,pilastro:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Canale</label><select className="inp" value={form.canale} onChange={e=>setForm({...form,canale:e.target.value})}>{CONTENT_TRACKER_CHANNELS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fg"><label className="lbl">Funnel</label><select className="inp" value={form.funnel} onChange={e=>setForm({...form,funnel:e.target.value})}>{["TOFU","MOFU","BOFU"].map(f=><option key={f}>{f}</option>)}</select></div>
            <div className="fg"><label className="lbl">Data pubbl.</label><input className="inp" type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
          </div>
          <div className="fg-row">
            <div className="fg"><label className="lbl">URL immagine</label><input className="inp" placeholder="https://…" value={form.immagineUrl} onChange={e=>setForm({...form,immagineUrl:e.target.value})}/></div>
            <div className="fg"><label className="lbl">URL video (Reel)</label><input className="inp" placeholder="https://…" value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})}/></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addItem} disabled={!form.title}>Aggiungi</button></div>
        </div>
      )}
      <div className="kan-board">
        {Object.entries(KAN_COLS).map(([colKey,col])=>{
          const cards=items.filter(i=>i.status===colKey);
          const nextKey=KAN_NEXT[colKey];
          return(
            <div key={colKey} className="kan-col">
              <div className="kan-col-hdr" style={{background:col.bg,color:col.tx}}><span>{col.emoji} {col.label}</span><span className="kan-col-cnt">{cards.length}</span></div>
              <div className="kan-col-body">
                {cards.map(item=>(
                  <div key={item.id} className="kan-card" style={{borderLeft:`3px solid ${getChannelColor(item.canale)}`}}>
                    <div className="kan-card-title">{item.title}</div>
                    <div className="kan-card-meta">
                      <span className="kan-badge" style={{background:(getChannelColor(item.canale))+"18",color:getChannelColor(item.canale)}}>{item.canale}</span>
                      <span className="kan-badge" style={{background:"#F1F5F9",color:"#64748B"}}>{item.format}</span>
                      {item.dueDate&&<span className="kan-date">{item.dueDate}</span>}
                    </div>
                    {item.caption&&<div className="kan-caption">"{item.caption.slice(0,70)}{item.caption.length>70?"…":""}"</div>}
                    <div className="kan-card-actions">
                      <button className="kan-act-btn" onClick={()=>genCaption(item)} disabled={aiItem===item.id}>{aiItem===item.id?"...":"✦ Caption"}</button>
                      <button className="kan-act-btn" onClick={()=>del(item.id)} style={{color:"var(--err)"}}>×</button>
                    </div>
                    {nextKey&&<button className="kan-advance" style={{background:col.tx+"12",color:col.tx,borderColor:col.tx+"30"}} onClick={()=>move(item.id,nextKey)}>{KAN_NEXT_LABEL[colKey]}</button>}
                  </div>
                ))}
                {cards.length===0&&<div className="kan-empty">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContentTrackerED;

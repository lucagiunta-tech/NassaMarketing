import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { validatePostFormItem } from "./postValidation";
import {
  FEED_TIPI,
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  FEED_PIATTAFORME,
  POST_STATUS,
  normalizePostType,
  normalizeFeedStatus,
  normalizePostPlatforms,
} from "./editorialModel";
import { getPillarColor } from "./editorialTheme";

const uid = () => Math.random().toString(36).slice(2,9);

const FEED_CTA_OPTIONS = ["— Nessuna CTA —","Scopri di più","Contattaci","Scarica","Prenota","Iscriviti","Acquista","Compila il form"];


// ── Comment thread ──────────────────────────────────────────────────────────
export function CommentThread({ post, members, onSave }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState(members[0]?.nome?.split(" ")[0] || "Team");
  const comments = post.comments || [];

  function addComment() {
    if (!text.trim()) return;
    const c = { id: uid(), text: text.trim(), author, ts: Date.now() };
    onSave({ ...post, comments: [...comments, c] });
    setText("");
  }
  function delComment(id) { onSave({ ...post, comments: comments.filter(c => c.id !== id) }); }

  return (
    <div className="ct-thread">
      <div className="ct-thread-title">💬 Commenti ({comments.length})</div>
      {comments.map(c => (
        <div key={c.id} className="ct-comment">
          <div className="ct-comment-hdr">
            <span className="ct-comment-author">{c.author}</span>
            <span className="ct-comment-ts">{new Date(c.ts).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            <button className="ct-del" onClick={() => delComment(c.id)}>×</button>
          </div>
          <div className="ct-comment-text">{c.text}</div>
        </div>
      ))}
      <div className="ct-comment-form">
        {members.length > 0 && (
          <select className="inp" style={{ width: 110, flexShrink: 0, fontSize: 11 }} value={author} onChange={e => setAuthor(e.target.value)}>
            {members.map(m => <option key={m.id} value={m.nome.split(" ")[0]}>{m.nome.split(" ")[0]}</option>)}
          </select>
        )}
        <input className="inp" style={{ flex: 1 }} placeholder="Aggiungi commento…" value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addComment()} />
        <button className="btn-primary sm" onClick={addComment} disabled={!text.trim()}>Invia</button>
      </div>
    </div>
  );
}


// ── Image upload helper ──────────────────────────────────────────────────────
async function fileToBase64(file, maxW=720, maxH=720) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let {width:w, height:h} = img;
      const ratio = Math.min(maxW/w, maxH/h, 1);
      w = Math.round(w*ratio); h = Math.round(h*ratio);
      const canvas = document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      canvas.getContext("2d").drawImage(img,0,0,w,h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = objUrl;
  });
}


// ── Brand Voice helpers ──────────────────────────────────────────────────────
function extractBrandVoice(project){
  if(!project) return null;
  const lineaNarr = project.pdc?.sections?.linea_narrativa?.content || "";
  const copyStrat = project.pdm?.sections?.copy_strategy?.content   || "";
  if(!lineaNarr && !copyStrat) return null;

  // Extract Tono di voce description (first meaningful paragraph after ## ToV or ## Tono)
  const tovMatch = lineaNarr.match(/(?:tono|tone|voice)[^\n]*\n+([^\n#]{30,})/i);
  const tov = tovMatch ? tovMatch[1].trim().slice(0,200) : "";

  // Extract claim/payoff
  const claimMatch = lineaNarr.match(/(?:claim|payoff|motto)[^\n]*\n+[*_"«]*([^*_"«\n]{10,80})[*_"«]*/i);
  const claim = claimMatch ? claimMatch[1].trim() : "";

  // Extract parole SI
  const siMatch = copyStrat.match(/(?:parole\s*sì|parole\s*si|usare|✅)[^\n]*\n((?:[^\n]+\n){1,8})/i);
  const parole_si = siMatch
    ? siMatch[1].split('\n').map(l=>l.replace(/^[-*·•✅\s]+/,'').trim()).filter(l=>l.length>1&&l.length<60).slice(0,6)
    : [];

  // Extract parole NO
  const noMatch = copyStrat.match(/(?:parole\s*no|vietate|evitare|❌|non usare)[^\n]*\n((?:[^\n]+\n){1,8})/i);
  const parole_no = noMatch
    ? noMatch[1].split('\n').map(l=>l.replace(/^[-*·•❌\s]+/,'').trim()).filter(l=>l.length>1&&l.length<60).slice(0,6)
    : [];

  // ToV keywords (first few bold words in linea narrativa)
  const kwMatches = lineaNarr.match(/\*\*([^*]{3,30})\*\*/g)||[];
  const keywords = kwMatches.map(m=>m.replace(/\*\*/g,"").trim()).filter(k=>k.length>2&&k.length<30).slice(0,5);

  return { tov, claim, parole_si, parole_no, keywords, hasSections: !!(lineaNarr||copyStrat) };
}

function BrandVoicePanel({ project, caption, onUpdateCaption }){
  const [open, setOpen] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const bv = extractBrandVoice(project);

  if(!bv) return null;

  async function adaptCaption(){
    if(!caption?.trim()) return;
    setAdapting(true);
    try {
      const lineaNarr = project?.pdc?.sections?.linea_narrativa?.content?.slice(0,800)||"";
      const copyStrat = project?.pdm?.sections?.copy_strategy?.content?.slice(0,400)||"";
      const prompt = `Sei un copywriter B2B. Riscrivi questa caption rispettando ESATTAMENTE il tono di voce del brand descritto sotto. Rispondi SOLO con la nuova caption — nessun commento, nessuna intro.

CAPTION ORIGINALE:
${caption}

TONO DI VOCE:
${lineaNarr}

REGOLE COPY:
${copyStrat}`;
      const result = await callClaude(prompt, 500);
      onUpdateCaption(result.trim());
    } catch{}
    setAdapting(false);
  }

  return(
    <div className="bv-panel">
      <button className="bv-toggle" onClick={()=>setOpen(v=>!v)}>
        <span>🎯 Brand Voice</span>
        {bv.claim&&<span className="bv-claim">"{bv.claim.slice(0,40)}{bv.claim.length>40?"…":""}"</span>}
        <span className="bv-chevron">{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div className="bv-body">
          {bv.tov&&(
            <div className="bv-section">
              <div className="bv-label">Tono di voce</div>
              <div className="bv-text">{bv.tov}</div>
            </div>
          )}
          {bv.keywords.length>0&&(
            <div className="bv-section">
              <div className="bv-label">Caratteristiche chiave</div>
              <div className="bv-chips">{bv.keywords.map((k,i)=><span key={i} className="bv-chip bv-chip-kw">{k}</span>)}</div>
            </div>
          )}
          <div className="bv-row2">
            {bv.parole_si.length>0&&(
              <div className="bv-section">
                <div className="bv-label" style={{color:"var(--ok)"}}>✅ Parole SÌ</div>
                <div className="bv-chips">{bv.parole_si.map((w,i)=><span key={i} className="bv-chip bv-chip-si">{w}</span>)}</div>
              </div>
            )}
            {bv.parole_no.length>0&&(
              <div className="bv-section">
                <div className="bv-label" style={{color:"var(--err)"}}>❌ Parole NO</div>
                <div className="bv-chips">{bv.parole_no.map((w,i)=><span key={i} className="bv-chip bv-chip-no">{w}</span>)}</div>
              </div>
            )}
          </div>
          <button className="bv-adapt-btn" onClick={adaptCaption} disabled={adapting||!caption?.trim()}>
            {adapting?"Adattamento in corso…":"✦ Adatta al Brand Voice"}
          </button>
        </div>
      )}
    </div>
  );
}



// ─── POST FORM VALIDATION HELPERS ───────────────────────────────────────────
// =============================================================================
// SERVICE BOUNDARY: EDITORIAL VALIDATION
// Extracted in Step 9: modules/editorial/postValidation.js
// =============================================================================
export function PostValidationSummary({ validation }) {
  if (!validation || (!validation.errors?.length && !validation.warnings?.length)) return null;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3,maxWidth:520,fontSize:10,lineHeight:1.35}}>
      {(validation.errors||[]).slice(0,3).map((msg,idx)=>(
        <div key={`err-${idx}`} style={{color:"var(--err)",fontWeight:700}}>⚠️ {msg}</div>
      ))}
      {(validation.warnings||[]).slice(0,2).map((msg,idx)=>(
        <div key={`warn-${idx}`} style={{color:"var(--warn)",fontWeight:600}}>ⓘ {msg}</div>
      ))}
    </div>
  );
}

// ─── POST FORM MODAL ─────────────────────────────────────────────────────────
export function PostFormModal({ item, members, onSave, onDelete, onClose, pilastri=[], project=null }) {
  const [f, setF] = useState({ piattaforme:["instagram"], membersAssigned:[], comments:[], ...item });
  const [imgLoading, setImgLoading] = useState(false);
  const [vidObjUrl,  setVidObjUrl]  = useState(item.videoUrl||"");
  const [aiCaption,  setAiCaption]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);

  function set(k,v){ setF(p=>({...p,[k]:v})); }
  function togglePiat(id){ const c=f.piattaforme||[]; set("piattaforme",c.includes(id)?c.filter(p=>p!==id):[...c,id]); }
  function toggleMember(id){ const c=f.membersAssigned||[]; set("membersAssigned",c.includes(id)?c.filter(m=>m!==id):[...c,id]); }

  async function handleImageFile(file){
    if(!file||!file.type.startsWith("image/")) return;
    setImgLoading(true);
    try { const b64=await fileToBase64(file); set("immagineBase64",b64); set("immagineUrl",""); } catch{}
    setImgLoading(false);
  }
  function handleVideoFile(file){
    if(!file||!file.type.startsWith("video/")) return;
    if(vidObjUrl.startsWith("blob:")) URL.revokeObjectURL(vidObjUrl);
    const url=URL.createObjectURL(file);
    setVidObjUrl(url); set("videoUrl",url);
  }
  function onInputChange(e,type){
    const file=e.target.files?.[0]; if(!file) return;
    type==="image"?handleImageFile(file):handleVideoFile(file);
    e.target.value="";
  }
  function onDrop(e){
    e.preventDefault(); setDragOver(false);
    const file=e.dataTransfer.files?.[0]; if(!file) return;
    file.type.startsWith("image/")?handleImageFile(file):handleVideoFile(file);
  }

  async function generateCaption(){
    setAiCaption(true);
    try {
      const piatNames=(f.piattaforme||[]).map(id=>FEED_PIATTAFORME.find(p=>p.id===id)?.label||id).join(", ");
      const tovHint=project?.pdc?.sections?.tone_of_voice?.content?.slice(0,200)||"";
      const variantHint=f.abActive&&(f.caption||"").trim()
        ? `\n\nEsiste già una VARIANTE A: "${f.caption.slice(0,150)}". Scrivi una versione diversa per la variante B.`
        : "";
      const t=await callClaude(`Sei un copywriter B2B. Scrivi una caption per ${piatNames}. SOLO la caption, nessun commento.
CONTENUTO: ${f.titolo||"post"} | FORMATO: ${f.tipo||"post"} | FUNNEL: ${f.funnel||"TOFU"}
${tovHint?"ToV: "+tovHint:""}${variantHint}
Regole: frasi corte · CTA tecnica · tono professionale B2B.`);
      set(f.abActive?"captionB":"caption",t);
    } catch{}
    setAiCaption(false);
  }

  const previewSrc=f.immagineBase64||f.immagineUrl||"";
  const isVideo=f.tipo==="reel"||f.tipo==="storia";
  const activeCaption=f.abActive?(f.captionB||""):(f.caption||"");
  const captionLen=activeCaption.length;
  const validation=validatePostFormItem(f);

  function handleSaveDraft(){
    const draft={...f,stato:POST_STATUS.bozza};
    const draftValidation=validatePostFormItem(draft);
    if(!draftValidation.isValid) return;
    set("stato",POST_STATUS.bozza);
    onSave(draft);
  }

  function handleSavePost(){
    if(!validation.isValid) return;
    onSave({...f,tipo:normalizePostType(f.tipo),stato:normalizeFeedStatus(f.stato),piattaforme:normalizePostPlatforms(f)});
  }

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="pfm-wrap" onClick={e=>e.stopPropagation()}>

        {/* HEADER */}
        <div className="pfm-header">
          <div className="pfm-header-left">
            <div className="pfm-thumb">
              {previewSrc?<img src={previewSrc} alt="" onError={e=>e.target.style.display="none"}/>
                :<div className="pf-thumb-empty">{FEED_TIPI_ICON[f.tipo]}</div>}
            </div>
            <div>
              <input className="pfm-title-inp" value={f.titolo||""} onChange={e=>set("titolo",e.target.value)} placeholder="Titolo del post (opzionale)"/>
              <div style={{fontSize:10,color:"var(--ink5)",marginTop:2}}>Identificativo interno — non viene pubblicato</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {onDelete&&<button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>{onDelete(f.id);onClose();}}>🗑 Elimina</button>}
            <button className="btn-ghost sm" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="pfm-body">

          {/* TIPO + PIATTAFORME */}
          <div className="pfm-row-2">
            <div>
              <div className="pfm-label">Formato</div>
              <div className="pf-tabs">
                {FEED_TIPI.map(t=><button key={t} className={`pf-tab ${f.tipo===t?"active":""}`} onClick={()=>set("tipo",t)}>{FEED_TIPI_ICON[t]} {FEED_TIPI_LABEL[t]}</button>)}
              </div>
            </div>
            <div>
              <div className="pfm-label">Piattaforme</div>
              <div className="pf-chips">
                {FEED_PIATTAFORME.map(p=>{
                  const on=(f.piattaforme||[]).includes(p.id);
                  return <button key={p.id} className={`pf-chip ${on?"active":""}`}
                    style={on?{background:p.color,borderColor:p.color,color:"#fff"}:{borderColor:p.color+"40",color:p.color}}
                    onClick={()=>togglePiat(p.id)}>{p.label}</button>;
                })}
              </div>
            </div>
          </div>

          {/* BRAND VOICE PANEL */}
          {project&&<BrandVoicePanel project={project} caption={f.caption} onUpdateCaption={v=>set("caption",v)}/>}

          {/* CAPTION — focus area */}
          <div className="pfm-caption-section">
            {/* A/B Caption tab bar */}
            <div className="pfm-caption-toolbar">
              <div style={{display:"flex",gap:0}}>
                <button className={`ab-tab ${!f.abActive?"ab-active":""}`} onClick={()=>set("abActive",false)}>
                  <span className="ab-tab-label">A</span>
                  {!f.abActive&&<span className="ab-tab-hint">attiva</span>}
                </button>
                <button className={`ab-tab ${f.abActive?"ab-active":""}`} onClick={()=>set("abActive",true)}>
                  <span className="ab-tab-label">B</span>
                  {f.abActive&&<span className="ab-tab-hint">attiva</span>}
                  {!(f.captionB||"").trim()&&<span className="ab-tab-empty">vuota</span>}
                </button>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                {project&&<CaptionTemplateSelector project={project} onUpdate={()=>{}} pilastro={f.pilastro||""}
                  onApply={v=>set(f.abActive?"captionB":"caption",v)}/>}
                <span style={{fontSize:10,color:captionLen>2200?"var(--err)":captionLen>1800?"var(--warn)":"var(--ink5)"}}>
                  {captionLen} caratteri
                </span>
                <button className="pfm-ai-caption-btn" onClick={generateCaption} disabled={aiCaption}>
                  {aiCaption?"Generazione…":"✦ AI Caption"}
                </button>
              </div>
            </div>

            {/* Active caption textarea */}
            {!f.abActive?(
              <textarea className="pfm-caption-area" rows={6}
                placeholder="Caption A — versione principale"
                value={f.caption||""} onChange={e=>set("caption",e.target.value)}/>
            ):(
              <textarea className="pfm-caption-area" rows={6}
                placeholder="Caption B — variante da testare contro A"
                value={f.captionB||""} onChange={e=>set("captionB",e.target.value)}/>
            )}

            {/* A/B quick copy */}
            {(f.caption||"").trim()&&(f.captionB||"").trim()&&(
              <div className="ab-compare-row">
                <SvgIcon name="activity" size={11} color="var(--gold)"/>
                <span>Entrambe le varianti compilate</span>
                <button className="ab-copy-btn" onClick={()=>set("captionB",f.caption)}>Copia A→B</button>
                <button className="ab-copy-btn" onClick={()=>set("caption",f.captionB)}>Copia B→A</button>
              </div>
            )}
          </div>

          {/* MEDIA UPLOAD */}
          <div className="pfm-label" style={{marginBottom:6}}>Media</div>
          <div className={`pfm-media-zone ${dragOver?"pfm-media-dragover":""} ${previewSrc?"pfm-media-has":""}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}>
            {previewSrc?(
              <div className="pfm-media-preview">
                <img src={previewSrc} alt="" onError={e=>e.target.style.display="none"}/>
                <div className="pfm-media-overlay">
                  <label className="pfm-media-change">📤 Cambia<input type="file" accept="image/*,video/*" style={{display:"none"}} onChange={e=>onInputChange(e,e.target.files?.[0]?.type?.startsWith("image/")?"image":"video")}/></label>
                  <button className="pfm-media-remove" onClick={()=>{set("immagineBase64","");set("immagineUrl","");}}>✕</button>
                </div>
              </div>
            ):(
              <div className="pfm-media-empty">
                <div style={{fontSize:32,marginBottom:8}}>🖼️</div>
                <div style={{fontSize:12,color:"var(--ink3)",fontWeight:600,marginBottom:4}}>Aggiungi immagini, video o PDF</div>
                <div style={{fontSize:11,color:"var(--ink5)",marginBottom:14}}>Trascina qui il file oppure</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <label className="btn-outline sm" style={{cursor:"pointer"}}>
                    📤 Carica media
                    <input type="file" accept="image/*,video/*" style={{display:"none"}} onChange={e=>onInputChange(e,e.target.files?.[0]?.type?.startsWith("image/")?"image":"video")} disabled={imgLoading}/>
                  </label>
                  <span style={{fontSize:11,color:"var(--ink5)",alignSelf:"center"}}>o incolla URL</span>
                </div>
                <input className="inp" style={{marginTop:10,maxWidth:380,textAlign:"center"}}
                  placeholder="https://www.dropbox.com/... o URL pubblico" value={f.immagineUrl||""}
                  onChange={e=>{set("immagineUrl",e.target.value);set("immagineBase64","");}}/>
                {isVideo&&<input className="inp" style={{marginTop:8,maxWidth:380,textAlign:"center"}}
                  placeholder="URL video / Reel (Dropbox, Drive…)" value={f.videoUrl&&!f.videoUrl.startsWith("blob:")?f.videoUrl:""}
                  onChange={e=>{set("videoUrl",e.target.value);setVidObjUrl(e.target.value);}}/>}
              </div>
            )}
          </div>
          {imgLoading&&<div className="gen-row" style={{justifyContent:"center",padding:"8px 0"}}><div className="spin"/>Caricamento immagine…</div>}
          {vidObjUrl&&vidObjUrl.startsWith("blob:")&&(
            <div className="pfm-media-hint">⚠️ Video locale (solo anteprima). Inserisci URL Dropbox pubblico per pubblicare su Meta.</div>
          )}

          {/* DATA + ORARIO + STATO */}
          <div className="pfm-row-3">
            <div className="fg"><label className="lbl">Stato</label>
              <select className="inp" value={f.stato||"bozza"} onChange={e=>set("stato",e.target.value)}
                style={{color:getFeedStatusStyle(f.stato)?.tx||"#64748B",fontWeight:600}}>
                {FEED_STATI.map(s=><option key={s} value={s}>{FEED_STATI_STYLE[s]?.label||s}</option>)}
              </select>
            </div>
            <div className="fg"><label className="lbl">Data pubblicazione</label><input className="inp" type="date" value={f.data||""} onChange={e=>set("data",e.target.value)}/></div>
            <div className="fg" style={{maxWidth:110}}><label className="lbl">Orario</label><input className="inp" type="time" value={f.time||""} onChange={e=>set("time",e.target.value)}/></div>
          </div>

          {/* FUNNEL + PILASTRO */}
          <div className="pfm-row-2">
            <div className="fg"><label className="lbl">Funnel</label>
              <select className="inp" value={f.funnel||""} onChange={e=>set("funnel",e.target.value)}>
                <option value="">— Non assegnato —</option>
                {["TOFU","MOFU","BOFU"].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            {/* ⚡ TREND RADAR FLAG */}
            <div className={"trend-radar-wrap "+(f.isTrend?"trend-active":"")}>
              <div className="trend-radar-hdr">
                <label className="trend-radar-label">
                  <input type="checkbox" checked={!!f.isTrend} onChange={e=>set("isTrend",e.target.checked)} style={{accentColor:"var(--neon-magenta)"}}/>
                  <span>⚡ Trend / Instant Marketing</span>
                  {f.isTrend&&<span className="trend-badge">Pilastro libero</span>}
                </label>
                <div className="trend-radar-sub">{f.isTrend?"Pilastro non obbligatorio — ToV sempre vincolante.":"Aggancia il post a un trend o notizia del momento."}</div>
              </div>
              {f.isTrend&&(
                <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                  <div>
                    <label className="lbl">🔗 Trend Anchor</label>
                    <input className="inp" placeholder="es. Audio virale TikTok · Notizia Ferragosto · Meme 'brain rot'" value={f.trendAnchor||""} onChange={e=>set("trendAnchor",e.target.value)}/>
                    <div style={{fontSize:9,color:"var(--ink5)",marginTop:3}}>Bypassa i Content Pillars ma rispetta il Brand Voice.</div>
                  </div>
                  {project&&(()=>{
                    const tov=project.pdc?.sections?.tone_of_voice?.content?.slice(0,130)||"";
                    return tov?<div className="trend-tov-reminder"><SvgIcon name="mic" size={11}/> ToV reminder: {tov}…</div>:null;
                  })()}
                </div>
              )}
            </div>
            <div className="fg"><label className="lbl">Pilastro</label>
              {pilastri.length>0
                ? <select className="inp" value={f.pilastro||""} onChange={e=>set("pilastro",e.target.value)}>
                    <option value="">— Seleziona pilastro —</option>
                    {(project?.pilastri?.length>0 ? project.pilastri : pilastri.map(n=>({nome:n,colore:"#94A3B8",funnel:""}))).map(p=>(
                      <option key={p.nome||p} value={p.nome||p}>{p.nome||p}{p.funnel?` (${p.funnel})`:""}</option>
                    ))}
                  </select>
                : <input className="inp" placeholder="es. Library Advanced" value={f.pilastro||""} onChange={e=>set("pilastro",e.target.value)}/>
              }
              {/* Color dot preview */}
              {f.pilastro&&(()=>{ const col=getPillarColor(f.pilastro, project?.pilastri); return col?<div style={{display:"flex",alignItems:"center",gap:5,marginTop:4}}><div style={{width:10,height:10,borderRadius:"50%",background:col}}/><span style={{fontSize:10,color:"var(--ink4)"}}>{f.pilastro}</span></div>:null; })()}
            </div>

            {/* CONTENT FRAMEWORK + TARGET PERSONA */}
            <div className="fg"><label className="lbl">Content Framework</label>
              <select className="inp" value={f.contentFramework||""} onChange={e=>set("contentFramework",e.target.value)}>
                {CONTENT_FRAMEWORK.map(opt=><option key={opt.id} value={opt.id}>{opt.label}</option>)}
              </select>
            </div>

            {/* TARGET PERSONA — dynamic from PdM */}
            <div className="fg"><label className="lbl">Target Persona</label>
              {(()=>{
                const personas = project ? extractPersonas(project) : [];
                return personas.length>0
                  ? <select className="inp" value={f.targetPersona||""} onChange={e=>set("targetPersona",e.target.value)}>
                      <option value="">— Seleziona persona —</option>
                      {personas.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  : <input className="inp" placeholder="es. Maria, 35 anni, responsabile acquisti" value={f.targetPersona||""} onChange={e=>set("targetPersona",e.target.value)}/>;
              })()}
              {!project?.pdm?.sections?.personas?.content&&<div style={{fontSize:9,color:"var(--ink5)",marginTop:3}}>Compila le Buyer Personas nel Piano di Marketing per avere un dropdown dinamico.</div>}
            </div>
          </div>

          {/* TEAM */}
          {members.length>0&&(
            <div>
              <div className="pfm-label">👥 Team assegnato</div>
              <div className="pf-members">
                {members.map(m=>{
                  const on=(f.membersAssigned||[]).includes(m.id);
                  return <button key={m.id} className={`pf-member-chip ${on?"active":""}`}
                    style={on?{background:m.colore,borderColor:m.colore,color:"#fff"}:{borderColor:m.colore+"40"}}
                    onClick={()=>toggleMember(m.id)}>
                    <span className="pf-mem-avatar" style={{background:on?"rgba(255,255,255,.3)":m.colore}}>{m.nome[0]}</span>
                    {m.nome.split(" ")[0]}{on&&" ×"}
                  </button>;
                })}
              </div>
            </div>
          )}

          {/* CTA + LINK */}
          <div className="pfm-row-2">
            <div className="fg"><label className="lbl">🚀 CTA</label>
              <select className="inp" value={f.cta||""} onChange={e=>set("cta",e.target.value)}>
                {FEED_CTA_OPTIONS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="fg"><label className="lbl">🔗 Link</label>
              <input className="inp" placeholder="https://..." value={f.ctaLink||""} onChange={e=>set("ctaLink",e.target.value)}/>
            </div>
          </div>

          {/* HASHTAG */}
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <label className="lbl" style={{margin:0}}># Hashtag</label>
              {(()=>{
                const projPil=(project?.pilastri||[]).find(p=>p.nome===f.pilastro);
                return projPil?.hashtags
                  ? <button className="tpl-use-btn" style={{fontSize:10,padding:"2px 8px"}}
                      onClick={()=>set("hashtags",(f.hashtags?f.hashtags+" ":"")+projPil.hashtags)}>
                      📎 Usa hashtag {projPil.nome}
                    </button>
                  : null;
              })()}
            </div>
            <input className="inp" placeholder="#hashtag1 #hashtag2 #hashtag3 — separati da spazio" value={f.hashtags||""} onChange={e=>set("hashtags",e.target.value)}/>
            <div style={{fontSize:9,color:"var(--ink5)",marginTop:3}}>Tienili separati dalla caption per gestirli nei tool nativi delle piattaforme.</div>
          </div>

          {/* LINK ASSET */}
          <div>
            <label className="lbl">📎 Link asset grafici</label>
            <input className="inp" placeholder="URL Dropbox / Figma / Drive al file di progetto…" value={f.linkAsset||""} onChange={e=>set("linkAsset",e.target.value)}/>
          </div>

          {/* NOTE PRODUZIONE */}
          <div className="pfm-row-2">
            <div className="fg">
              <label className="lbl">🎨 Note per il Grafico</label>
              <textarea className="txta" rows={2} placeholder="Brief visivo per Hermes/Matteo: stile, colori da usare, elementi richiesti…" value={f.noteGrafico||""} onChange={e=>set("noteGrafico",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="lbl">🎬 Note per il Video Maker</label>
              <textarea className="txta" rows={2} placeholder="Brief tecnico per Paoletto: durata, musica, scene richieste, formato finale…" value={f.noteVideo||""} onChange={e=>set("noteVideo",e.target.value)}/>
            </div>
          </div>

          {/* COLLABORAZIONI + TAG */}
          <div className="pfm-row-2">
            <div className="fg"><label className="lbl">🤝 Collaborazioni</label>
              <input className="inp" placeholder="@account1, @account2" value={f.collaborazioni||""} onChange={e=>set("collaborazioni",e.target.value)}/>
            </div>
            <div className="fg"><label className="lbl">👆 Tag (menzioni)</label>
              <input className="inp" placeholder="@persona1, @brand2 — separati da virgola" value={f.tagMenzioni||""} onChange={e=>set("tagMenzioni",e.target.value)}/>
            </div>
          </div>

          {/* COMMENTI */}
          <div style={{borderTop:"1px solid var(--border)",paddingTop:14,marginTop:6}}>
            <CommentThread post={f} members={members} onSave={updated=>setF({...f,comments:updated.comments})}/>
          </div>

        </div>

        {/* STICKY FOOTER */}
        <div className="pfm-footer">
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <div style={{fontSize:11,color:"var(--ink5)"}}>
              {f.data&&f.time?`📅 ${f.data} · ${f.time}`:f.data?`📅 ${f.data}`:"Nessuna data impostata"}
            </div>
            <PostValidationSummary validation={validation}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-ghost" onClick={handleSaveDraft} disabled={!validation.isValid}>Salva bozza</button>
            <button className="btn-primary" onClick={handleSavePost} disabled={!validation.isValid}>Salva →</button>
          </div>
        </div>

      </div>
    </div>
  );
}


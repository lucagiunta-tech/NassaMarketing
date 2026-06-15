import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { CaptionScorer } from "./CaptionScorer";
import { validatePostFormItem } from "./postValidation";
import {
  FEED_TIPI,
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  FEED_PIATTAFORME,
  FEED_STATI,
  FEED_STATI_STYLE,
  POST_STATUS,
  getFeedStatusStyle,
  normalizePostType,
  normalizeFeedStatus,
  normalizePostPlatforms,
} from "./editorialModel";
import { getPillarColor } from "./editorialTheme";


// ── Inlined from MarketingStudio.jsx ─────────────────────────────────────────

const ICON = {
  // Analytics & Data
  chart:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  trending:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  pie:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  target:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  // People & User
  user:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  // Strategy & Business
  compass:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  map:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  layers:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  grid:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  zap:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  flag:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  // Content & Copy
  edit:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  type:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  mic:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  // Operations
  calendar:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  megaphone: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
  mail:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  link:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  // Monitoring
  activity:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  eye:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  refresh:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  dollar:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  // Layout
  columns:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
  inbox:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  triangle:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
  shield:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  box:       `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
};

function SvgIcon({ name, size=15, color="currentColor", style={} }){
  const svg = ICON[name];
  if(!svg) return null;
  const html = svg.replace(/width="15"/g,`width="${size}"`).replace(/height="15"/g,`height="${size}"`).replace(/stroke="currentColor"/g,`stroke="${color}"`);
  return <span style={{display:"inline-flex",alignItems:"center",flexShrink:0,...style}} dangerouslySetInnerHTML={{__html:html}}/>;
}

const CONTENT_FRAMEWORK = [
  {id:"",        label:"— Nessuno —"},
  {id:"hero",    label:"🦸 Hero — Grande impatto, ampia reach"},
  {id:"hub",     label:"🔄 Hub — Contenuto seriale e ricorrente"},
  {id:"help",    label:"🤝 Help — Risponde a domande specifiche"},
  {id:"edu",     label:"📚 Educational — Educa e informa"},
  {id:"ent",     label:"🎭 Entertainment — Intrattiene e coinvolge"},
  {id:"promo",   label:"🎯 Promotional — Conversione diretta"},
];


function extractPersonas(project){
  const content = project?.pdm?.sections?.personas?.content || "";
  if(!content) return [];
  // Extract persona names: lines starting with ## or bold **Name** or numbered
  const lines = content.split("\n");
  const names = [];
  lines.forEach(l=>{
    const m = l.match(/^#{2,3}\s+(.{3,40})|^\*\*([^*]{3,40})\*\*|^\d+\.\s+(.{3,40})/);
    if(m){
      const name=(m[1]||m[2]||m[3]).trim().replace(/[:#*]/g,"").trim();
      if(name.length>2&&name.length<50) names.push(name);
    }
  });
  return [...new Set(names)].slice(0,8);
}


const DEFAULT_TEMPLATE_VARS = ["[PRODOTTO]","[DATA]","[TERRITORIO]","[CTA]","[PREZZO]","[RICETTA]","[HASHTAG]"];
function emptyTemplate(pilastro=""){ return {id:uid(),pilastro,nome:"",template:"",note:"",createdAt:Date.now()}; }

function CaptionTemplateManager({ project, onUpdate, onClose }){
  const templates = project.ed?.captionTemplates||[];
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(null);

  function upTemplates(fn){ onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }
  function save(){
    if(!f?.template?.trim()||!f?.nome?.trim()) return;
    upTemplates(ed=>({...ed,captionTemplates:(ed.captionTemplates||[]).some(t=>t.id===f.id)
      ?(ed.captionTemplates||[]).map(t=>t.id===f.id?f:t)
      :[...(ed.captionTemplates||[]),f]}));
    setEditing(null); setF(null);
  }
  function del(id){ upTemplates(ed=>({...ed,captionTemplates:(ed.captionTemplates||[]).filter(t=>t.id!==id)})); }
  function openNew(p=""){ const t=emptyTemplate(p); setF(t); setEditing("new"); }
  function openEdit(t){ setF({...t}); setEditing(t.id); }

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div className="modal-title">📋 Template Caption</div><button className="btn-ghost sm" onClick={onClose}>x</button></div>
        <div className="modal-body" style={{maxHeight:"70vh",overflowY:"auto"}}>
          {editing&&f?(
            <div className="tpl-editor">
              <div className="tpl-editor-title">{editing==="new"?"Nuovo template":"Modifica template"}</div>
              <div className="fg-row" style={{marginBottom:10}}>
                <div className="fg"><label className="lbl">Nome *</label><input className="inp" placeholder="es. Urgenza Ciclo" value={f.nome} onChange={e=>setF(p=>({...p,nome:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Pilastro</label><input className="inp" placeholder="es. Coop Promo" value={f.pilastro} onChange={e=>setF(p=>({...p,pilastro:e.target.value}))}/></div>
              </div>
              <div style={{marginBottom:10}}>
                <label className="lbl">Template *</label>
                <textarea className="txta" rows={5} value={f.template} onChange={e=>setF(p=>({...p,template:e.target.value}))} placeholder="Scrivi la struttura della caption con variabili come [PRODOTTO]..."/>
                <div className="tpl-vars">
                  <span style={{fontSize:10,color:"var(--ink4)"}}>Inserisci variabile:</span>
                  {DEFAULT_TEMPLATE_VARS.map(v=>(
                    <button key={v} className="tpl-var-chip" onClick={()=>setF(p=>({...p,template:p.template+v}))}>{v}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}><label className="lbl">Note per l'SMM</label>
                <input className="inp" placeholder="es. Solo per urgenze fine ciclo" value={f.note||""} onChange={e=>setF(p=>({...p,note:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn-ghost sm" onClick={()=>{setEditing(null);setF(null);}}>Annulla</button>
                <button className="btn-primary sm" onClick={save} disabled={!f.nome?.trim()||!f.template?.trim()}>Salva</button>
              </div>
            </div>
          ):(
            <>
              <button className="btn-outline sm" style={{width:"100%",marginBottom:14}} onClick={()=>openNew()}>+ Nuovo template</button>
              {templates.length===0&&<div className="ct-empty" style={{padding:"20px 0"}}>Nessun template salvato.</div>}
              {[...new Set(templates.map(t=>t.pilastro||"Senza pilastro"))].map(pil=>(
                <div key={pil} style={{marginBottom:16}}>
                  <div className="tpl-group-label" style={{color:getPillarColor(pil, null, "var(--ink4)")}}>{pil}</div>
                  {templates.filter(t=>(t.pilastro||"Senza pilastro")===pil).map(t=>(
                    <div key={t.id} className="tpl-row">
                      <div style={{flex:1,minWidth:0}}>
                        <div className="tpl-row-name">{t.nome}</div>
                        <div className="tpl-row-preview">{t.template.slice(0,80)}{t.template.length>80?"...":""}</div>
                        {t.note&&<div className="tpl-row-note">💡 {t.note}</div>}
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button className="btn-ghost sm" onClick={()=>openEdit(t)}>Edit</button>
                        <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>del(t.id)}>x</button>
                      </div>
                    </div>
                  ))}
                  <button className="tpl-add-row" onClick={()=>openNew(pil)}>+ template per {pil}</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function CaptionTemplateSelector({ project, onUpdate, pilastro, onApply }){
  const templates=(project.ed?.captionTemplates||[]).filter(t=>!pilastro||!t.pilastro||t.pilastro===pilastro);
  const [open, setOpen] = useState(false);
  const [showManager, setShowManager] = useState(false);

  return(
    <>
      <div className="tpl-selector-wrap">
        {templates.length>0&&(
          <div style={{position:"relative"}}>
            <button className="tpl-use-btn" onClick={()=>setOpen(v=>!v)}>📋 Usa template {open?"▲":"▼"}</button>
            {open&&(
              <div className="tpl-dropdown">
                {templates.map(t=>(
                  <button key={t.id} className="tpl-dropdown-item" onClick={()=>{onApply(t.template);setOpen(false);}}>
                    <div className="tpl-di-name">{t.nome}</div>
                    <div className="tpl-di-preview">{t.template.slice(0,60)}{t.template.length>60?"...":""}</div>
                    {t.note&&<div className="tpl-di-note">💡 {t.note}</div>}
                  </button>
                ))}
                <button className="tpl-di-manage" onClick={()=>{setOpen(false);setShowManager(true);}}>⚙ Gestisci template →</button>
              </div>
            )}
          </div>
        )}
        <button className="tpl-manage-link" onClick={()=>setShowManager(true)}>{templates.length===0?"+ Crea template":"⚙ Gestisci"}</button>
      </div>
      {showManager&&<CaptionTemplateManager project={project} onUpdate={onUpdate} onClose={()=>setShowManager(false)}/>}
    </>
  );
}


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
  const [f, setF] = useState({ piattaforme:["instagram"], membersAssigned:[], comments:[], mediaUrls:[], ...item });
  const [imgLoading, setImgLoading] = useState(false);
  const [vidObjUrl,  setVidObjUrl]  = useState(item.videoUrl||"");
  const [aiCaption,  setAiCaption]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState("");

  function set(k,v){ setF(p=>({...p,[k]:v})); }
  function togglePiat(id){ const c=f.piattaforme||[]; set("piattaforme",c.includes(id)?c.filter(p=>p!==id):[...c,id]); }
  function toggleMember(id){ const c=f.membersAssigned||[]; set("membersAssigned",c.includes(id)?c.filter(m=>m!==id):[...c,id]); }

  async function handleImageFile(file){
    if(!file||!file.type.startsWith("image/")) return;
    setImgLoading(true);
    try {
      const b64=await fileToBase64(file);
      if(f.tipo==="carousel"){
        // For carousel: add to mediaUrls array
        setF(p=>({...p, mediaUrls:[...(p.mediaUrls||[]),b64], immagineBase64:b64}));
      } else {
        set("immagineBase64",b64); set("immagineUrl","");
      }
    } catch{}
    setImgLoading(false);
  }
  async function handleMultipleFiles(files){
    setImgLoading(true);
    for(const file of files){
      if(file.type.startsWith("image/")){
        try { const b64=await fileToBase64(file); setF(p=>({...p, mediaUrls:[...(p.mediaUrls||[]),b64], immagineBase64:b64})); } catch{}
      } else if(file.type.startsWith("video/")){
        handleVideoFile(file);
      }
    }
    setImgLoading(false);
  }
  function handleVideoFile(file){
    if(!file||!file.type.startsWith("video/")) return;
    if(vidObjUrl.startsWith("blob:")) URL.revokeObjectURL(vidObjUrl);
    const url=URL.createObjectURL(file);
    setVidObjUrl(url); set("videoUrl",url);
  }
  function onInputChange(e,type){
    const files=e.target.files; if(!files?.length) return;
    if(f.tipo==="carousel" && files.length>1){ handleMultipleFiles(Array.from(files)); }
    else { const file=files[0]; type==="image"?handleImageFile(file):handleVideoFile(file); }
    e.target.value="";
  }
  function onDrop(e){
    e.preventDefault(); setDragOver(false);
    const files=e.dataTransfer.files;
    if(f.tipo==="carousel" && files.length>1){ handleMultipleFiles(Array.from(files)); return; }
    const file=files?.[0]; if(!file) return;
    file.type.startsWith("image/")?handleImageFile(file):handleVideoFile(file);
  }
  function addMediaUrl(){
    const url=mediaUrlInput.trim();
    if(!url) return;
    setF(p=>({...p, mediaUrls:[...(p.mediaUrls||[]),url], immagineUrl:url}));
    setMediaUrlInput("");
  }
  function removeMedia(idx){
    setF(p=>{
      const urls=[...(p.mediaUrls||[])];
      urls.splice(idx,1);
      return {...p, mediaUrls:urls, immagineBase64:urls[0]||"", immagineUrl:""};
    });
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

  const previewSrc=f.immagineBase64||f.immagineUrl||((f.mediaUrls||[])[0])||"";
  const isCarousel=f.tipo==="carousel";
  const carouselMedia=f.mediaUrls||[];
  const isVideo=f.tipo==="reel"||f.tipo==="storia";
  const activeCaption=f.abActive?(f.captionB||""):(f.caption||"");
  const captionLen=activeCaption.length;
  const validation=validatePostFormItem(f);

  function handleSaveDraft(){
    const draft={...f,stato:POST_STATUS.bozza};
    // Drafts only need minimal content — title or caption
    const hasContent = (draft.titolo||"").trim() || (draft.caption||"").trim() || (draft.captionB||"").trim();
    if(!hasContent) return;
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

          {/* CAPTION SCORER */}
          {activeCaption.trim() && (
            <div style={{marginBottom:12}}>
              <div className="pfm-label" style={{marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                ✦ Caption Score
                <span style={{fontSize:9,color:"var(--ink5)",fontWeight:400}}>Analisi real-time · {(f.piattaforme||["instagram"])[0]}</span>
              </div>
              <CaptionScorer
                caption={activeCaption}
                platforms={f.piattaforme||["instagram"]}
                project={project}
                compact={false}
              />
            </div>
          )}

          {/* MEDIA UPLOAD */}
          <div className="pfm-label" style={{marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Media {isCarousel&&carouselMedia.length>0&&`(${carouselMedia.length} elementi)`}</span>
            <label className="btn-primary sm" style={{cursor:"pointer",fontSize:10,padding:"4px 10px"}}>
              📤 {isCarousel?"Aggiungi file":"Carica file"}
              <input type="file" accept="image/*,video/*" multiple={isCarousel} style={{display:"none"}} onChange={e=>onInputChange(e,e.target.files?.[0]?.type?.startsWith("image/")?"image":"video")} disabled={imgLoading}/>
            </label>
          </div>

          {/* CAROUSEL GALLERY */}
          {isCarousel&&carouselMedia.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:6,marginBottom:10}}>
              {carouselMedia.map((url,i)=>(
                <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",background:"var(--bg)"}}>
                  <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                  <button onClick={()=>removeMedia(i)} style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  <div style={{position:"absolute",bottom:2,left:2,fontSize:9,fontWeight:700,background:"rgba(0,0,0,.5)",color:"#fff",padding:"1px 5px",borderRadius:3}}>{i+1}</div>
                </div>
              ))}
            </div>
          )}

          {/* DROP ZONE */}
          <div className={`pfm-media-zone ${dragOver?"pfm-media-dragover":""} ${previewSrc&&!isCarousel?"pfm-media-has":""}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}>
            {previewSrc&&!isCarousel?(
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
                <div style={{fontSize:12,color:"var(--ink3)",fontWeight:600,marginBottom:4}}>
                  {isCarousel?"Trascina file per il carousel":"Aggiungi immagini, video o PDF"}
                </div>
                <div style={{fontSize:11,color:"var(--ink5)",marginBottom:14}}>Trascina qui il file oppure</div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <label className="btn-outline sm" style={{cursor:"pointer"}}>
                    📤 Carica {isCarousel?"immagini":"media"}
                    <input type="file" accept="image/*,video/*" multiple={isCarousel} style={{display:"none"}} onChange={e=>onInputChange(e,e.target.files?.[0]?.type?.startsWith("image/")?"image":"video")} disabled={imgLoading}/>
                  </label>
                  <span style={{fontSize:11,color:"var(--ink5)",alignSelf:"center"}}>o incolla URL</span>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,maxWidth:400,width:"100%"}}>
                  <input className="inp" style={{flex:1,textAlign:"center"}}
                    placeholder={isCarousel?"URL Dropbox immagine (aggiungi una alla volta)":"https://www.dropbox.com/... o URL pubblico"}
                    value={isCarousel?mediaUrlInput:(f.immagineUrl||"")}
                    onChange={isCarousel?e=>setMediaUrlInput(e.target.value):e=>{set("immagineUrl",e.target.value);set("immagineBase64","");}}
                    onKeyDown={isCarousel?e=>{if(e.key==="Enter"){e.preventDefault();addMediaUrl();}}:undefined}/>
                  {isCarousel&&<button className="btn-primary sm" onClick={addMediaUrl} disabled={!mediaUrlInput.trim()}>+</button>}
                </div>
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
                {FEED_STATI.map(s => {
                  // approvato e pubblicato: sola lettura nel form interno.
                  // approvato → solo il cliente via portale.
                  // pubblicato → solo dopo PublishModal.
                  const locked = s === "approvato" || s === "pubblicato";
                  return (
                    <option key={s} value={s} disabled={locked && f.stato !== s}>
                      {FEED_STATI_STYLE[s]?.label||s}{locked && f.stato !== s ? " (🔒 portale/publish)" : ""}
                    </option>
                  );
                })}
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
            <button className="btn-ghost" onClick={handleSaveDraft}>Salva bozza</button>
            <button className="btn-primary" onClick={handleSavePost} disabled={!validation.isValid}>Salva →</button>
          </div>
        </div>

      </div>
    </div>
  );
}


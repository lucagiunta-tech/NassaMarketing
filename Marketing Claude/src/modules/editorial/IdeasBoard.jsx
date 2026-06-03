import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { buildCtx, uid } from "../../templates/templateUtils";
import {
  FEED_TIPI,
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  applyEdUpdate,
} from "./editorialModel";
import { IDEA_COLS, getIdeaStatusStyle } from "./editorialTheme";

// ─── IDEAS BOARD ──────────────────────────────────────────────────────────────

function emptyIdea(){ return {id:uid(),titolo:"",descrizione:"",tags:[],stato:"draft",tipo:"post",pilastro:"",funnel:"TOFU",data:"",suggested:false,createdAt:Date.now()}; }

const buildIdeasPrompt = (ctx,existing) => `Sei un content strategist B2B. Genera 6 idee di contenuto CONCRETE e SPECIFICHE per questo brand.
Rispondi SOLO con un array JSON valido, nessun testo prima o dopo.
Ogni idea deve avere titoli reali e specifici — NON placeholder generici.

[
  {"titolo":"titolo specifico e usabile","descrizione":"2-3 frasi sul contenuto concreto","tipo":"post|reel|carousel|storia","pilastro":"nome pilastro","funnel":"TOFU|MOFU|BOFU","tags":["tag1","tag2"]}
]

Titoli di esempio (da adattare al brand): "Come formuliamo 8.000 prodotti in 3 formati diversi", "Il laboratorio che non accetta scorciatoie: la nostra policy qualità"

CONTESTO BRAND:
${ctx.slice(0,2500)}

Idee già presenti (non duplicare):
${(existing||[]).map(i=>i.titolo).slice(0,10).join('\n')||'nessuna'}`;

function IdeaCard({ idea, onMove, onEdit, onDelete, onConvert, onDragStart, onDragEnd, isDragging }){
  const [expanded, setExpanded] = useState(false);
  return(
    <div className={`idea-card ${idea.suggested?"idea-suggested":""} ${isDragging?"idea-dragging":""}`}
      draggable
      onDragStart={e=>{ e.dataTransfer.setData("text/plain",idea.id); e.dataTransfer.effectAllowed="move"; onDragStart&&onDragStart(idea.id); }}
      onDragEnd={()=>onDragEnd&&onDragEnd()}>
      {idea.suggested&&<div className="idea-suggested-badge">✦ Suggerito dall'AI</div>}
      <div className="idea-card-hdr">
        <div className="idea-drag-handle" title="Trascina">⠿</div>
        <div className="idea-title" onClick={()=>setExpanded(v=>!v)}>{idea.titolo||"Nuova idea"}</div>
        <div className="idea-menu-wrap">
          <button className="idea-menu-btn" onClick={()=>onEdit(idea)}>⋯</button>
        </div>
      </div>
      {(expanded||!idea.titolo)&&idea.descrizione&&(
        <div className="idea-desc">{idea.descrizione}</div>
      )}
      <div className="idea-footer">
        <div className="idea-tags">
          {idea.funnel&&<span className="idea-tag idea-tag-funnel">{idea.funnel}</span>}
          {idea.pilastro&&<span className="idea-tag">{idea.pilastro.slice(0,14)}</span>}
          {idea.tipo&&idea.tipo!=="post"&&<span className="idea-tag">{FEED_TIPI_ICON[idea.tipo]} {idea.tipo}</span>}
          {idea.data&&<span className="idea-tag" style={{background:"#EFF6FF",color:"#3B82F6"}}>📅 {idea.data}</span>}
        </div>
        {idea.stato==="ready"
          ?<button className="idea-convert-btn" onClick={()=>onConvert(idea)}>→ Post</button>
          :<button className="idea-advance-btn" onClick={()=>{ const next={draft:"todo",todo:"in_progress",in_progress:"ready"}; if(next[idea.stato]) onMove(idea.id,next[idea.stato]); }}>→</button>
        }
      </div>
    </div>
  );
}

function IdeaFormModal({ idea, onSave, onDelete, onClose, defaultStato }){
  const [f,setF]=useState({
    titolo:"", descrizione:"", tipo:"post", pilastro:"",
    funnel:"TOFU", data:"",
    suggested:false, tags:[],
    ...idea, // idea overrides defaults — preserves id, titolo, etc.
    stato: idea?.stato || defaultStato || "draft",
  });
  const [aiGen,setAiGen]=useState(false);

  function set(k,v){setF(p=>({...p,[k]:v}));}
  const isNew = !onDelete;

  async function generateDesc(){
    if(!f.titolo) return;
    setAiGen(true);
    try {
      const t=await callClaude(`Sei un content strategist B2B. Scrivi una descrizione breve (2-3 frasi) per questa idea di contenuto. SOLO la descrizione, nessuna intro.
TITOLO: ${f.titolo}
TIPO: ${f.tipo} | FUNNEL: ${f.funnel} | PILASTRO: ${f.pilastro||"—"}
Deve spiegare: di cosa parla, per chi è, quale messaggio veicola.`);
      set("descrizione",t);
    } catch{}
    setAiGen(false);
  }

  return(
    <div className="modal-overlay" onClick={onClose} style={{alignItems:"center"}}>
      <div className="idea-modal" onClick={e=>e.stopPropagation()}>

        {/* HEADER */}
        <div className="idea-modal-hdr">
          <div>
            <div className="idea-modal-title">{isNew?"💡 Nuova idea":"✎ Modifica idea"}</div>
            <div className="idea-modal-sub">
              {getIdeaStatusStyle(f.stato)?.label||"Bozza"}
            </div>
          </div>
          <button className="btn-ghost sm" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="idea-modal-body">

          {/* Titolo */}
          <div className="idea-modal-field-main">
            <label className="idea-modal-label">Titolo *</label>
            <input className="idea-modal-inp-main" autoFocus
              placeholder="es. 7 attivi biotech che usiamo davvero: scarica le schede tecniche"
              value={f.titolo} onChange={e=>set("titolo",e.target.value)}/>
          </div>

          {/* Tipo + Funnel */}
          <div className="idea-modal-row2">
            <div>
              <label className="idea-modal-label">Tipo contenuto</label>
              <div className="pf-tabs" style={{gap:5}}>
                {FEED_TIPI.map(t=>(
                  <button key={t} className={`pf-tab ${f.tipo===t?"active":""}`} style={{padding:"6px 10px",fontSize:10}} onClick={()=>set("tipo",t)}>
                    {FEED_TIPI_ICON[t]} {FEED_TIPI_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="idea-modal-label">Stage Funnel</label>
              <div style={{display:"flex",gap:6}}>
                {["TOFU","MOFU","BOFU"].map(v=>(
                  <button key={v} className={`idea-funnel-btn ${f.funnel===v?"active":""}`}
                    style={f.funnel===v?{background:{TOFU:"#0EA5E9",MOFU:"#8B5CF6",BOFU:"#10B981"}[v],color:"#fff",borderColor:"transparent"}:{}}
                    onClick={()=>set("funnel",v)}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Pilastro + Data */}
          <div className="idea-modal-row2">
            <div>
              <label className="idea-modal-label">Pilastro</label>
              <input className="inp" placeholder="es. Library Advanced, Coop Promo…" value={f.pilastro} onChange={e=>set("pilastro",e.target.value)}/>
            </div>
            <div>
              <label className="idea-modal-label">Data prevista</label>
              <input className="inp" type="date" value={f.data||""} onChange={e=>set("data",e.target.value)}/>
            </div>
          </div>

          {/* Stato */}
          <div>
            <label className="idea-modal-label">Colonna</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {IDEA_COLS.map(col=>(
                <button key={col.id}
                  className={`idea-stato-btn ${f.stato===col.id?"active":""}`}
                  style={f.stato===col.id?{background:col.color,color:"#fff",borderColor:col.color}:{color:col.color,borderColor:col.color+"60"}}
                  onClick={()=>set("stato",col.id)}>{col.label}</button>
              ))}
            </div>
          </div>

          {/* Descrizione */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <label className="idea-modal-label" style={{margin:0}}>Descrizione</label>
              <button className="pfm-ai-caption-btn" style={{padding:"4px 10px",fontSize:10}}
                onClick={generateDesc} disabled={aiGen||!f.titolo}>
                {aiGen?"…":"✦ Genera"}
              </button>
            </div>
            <textarea className="txta" rows={3}
              placeholder="Di cosa parla, per chi è, quale messaggio veicola…"
              value={f.descrizione} onChange={e=>set("descrizione",e.target.value)}/>
          </div>

        </div>

        {/* FOOTER */}
        <div className="idea-modal-footer">
          <div>
            {onDelete&&<button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>{onDelete(f.id);onClose();}}>Elimina</button>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-ghost sm" onClick={onClose}>Annulla</button>
            <button className="btn-primary" onClick={()=>onSave(f)} disabled={!f.titolo?.trim()}>
              {isNew?"Aggiungi idea":"Salva modifiche"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


function emptyFeedItem() {
  return { id:uid(), titolo:"Nuovo post", tipo:"post",
    piattaforme:["instagram"], stato:"bozza", data:"",
    immagineUrl:"", immagineBase64:"", videoUrl:"",
    membersAssigned:[], caption:"", time:"", hashtags:"", cta:"", ctaLink:"",
    contentFramework:"", targetPersona:"", isTrend:false, trendAnchor:"",
    captionB:"", abActive:false,
    noteGrafico:"", noteVideo:"", linkAsset:"",
    collaborazioni:"", tagMenzioni:"", comments:[], createdAt:Date.now() };
}

function extractPilastri(project){
  if(project?.pilastri?.length>0) return project.pilastri.map(p=>p.nome);
  const pilContent=project?.pdc?.sections?.pilastri?.content||project?.pdm?.sections?.pilastri?.content||"";
  if(pilContent){
    const lines=pilContent.split("\n");
    const names=lines.filter(l=>l.trim().startsWith("#")||/^\s*0?[1-9]/.test(l))
      .map(l=>l.replace(/[#*\d.—\-]/g,"").trim()).filter(n=>n.length>3&&n.length<60);
    if(names.length>0) return [...new Set(names)];
  }
  return [...new Set((project?.ed?.feedItems||[]).map(f=>f.pilastro).filter(Boolean))];
}

export function IdeasBoard({ project, onUpdate, PostFormModalComponent }){
  const ideas = project.ed?.ideas || [];
  const [editIdea,      setEditIdea]      = useState(null);
  const [convertingIdea,setConvertingIdea]= useState(null);
  const [genLoading,    setGenLoading]    = useState(false);
  const [genToast,      setGenToast]      = useState("");
  const [search,        setSearch]        = useState("");
  const [dragId,        setDragId]        = useState(null);
  const [dragOver,      setDragOver]      = useState(null);
  const ConvertPostModal = PostFormModalComponent;

  function upIdeas(fn){ onUpdate(applyEdUpdate(project, fn)); }
  function saveIdea(idea){
    upIdeas(ed=>({...ed,ideas:(ed.ideas||[]).some(i=>i.id===idea.id)?(ed.ideas||[]).map(i=>i.id===idea.id?idea:i):[...(ed.ideas||[]),idea]}));
    setEditIdea(null);
  }
  function delIdea(id){ upIdeas(ed=>({...ed,ideas:(ed.ideas||[]).filter(i=>i.id!==id)})); }
  function moveIdea(id,stato){ upIdeas(ed=>({...ed,ideas:(ed.ideas||[]).map(i=>i.id===id?{...i,stato}:i)})); }

  // Drag & drop handlers
  function onColDragOver(e, colId){ e.preventDefault(); e.dataTransfer.dropEffect="move"; setDragOver(colId); }
  function onColDrop(e, colId){
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if(id) moveIdea(id, colId);
    setDragId(null); setDragOver(null);
  }
  function onColDragLeave(e){ if(!e.currentTarget.contains(e.relatedTarget)) setDragOver(null); }

  function openConvertModal(idea){
    // Pre-fill a feedItem with the idea's data, open PostFormModal for confirmation
    const post = emptyFeedItem();
    post.titolo    = idea.titolo;
    post.caption   = idea.descrizione || "";
    post.tipo      = idea.tipo || "post";
    post.funnel    = idea.funnel || "";
    post.pilastro  = idea.pilastro || "";
    post.data      = idea.data || "";
    post.stato     = "bozza";
    post._fromIdeaId = idea.id; // track origin idea to remove it on save
    setConvertingIdea(post);
  }

  function confirmConvert(post){
    // Save the post, remove the source idea
    const ideaId = post._fromIdeaId;
    const { _fromIdeaId, ...cleanPost } = post;
    upIdeas(ed=>({
      ...ed,
      ideas: (ed.ideas||[]).filter(i=>i.id!==ideaId),
      feedItems: [...(ed.feedItems||[]), cleanPost],
    }));
    setConvertingIdea(null);
    setGenToast("Idea convertita in post ✓ — visibile in Pubblica e Calendario");
    setTimeout(()=>setGenToast(""),3000);
  }

  async function generateIdeas(){
    setGenLoading(true);
    try {
      const ctx = buildCtx(project.interview||{});
      const pdmCtx = Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const pdcCtx = Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const fullCtx = ctx + "\n\n## Marketing:\n" + pdmCtx + "\n\n## Comunicazione:\n" + pdcCtx;
      const raw = await callClaude(buildIdeasPrompt(fullCtx, ideas), 2000);
      const clean = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
      const match = clean.match(/\[[\s\S]*\]/);
      if(!match) throw new Error("JSON non trovato");
      const newIdeas = JSON.parse(match[0]);
      const toAdd = newIdeas.map(i=>({...emptyIdea(),...i,suggested:true}));
      upIdeas(ed=>({...ed,ideas:[...(ed.ideas||[]),...toAdd]}));
      setGenToast(`${toAdd.length} idee generate ✓`);
      setTimeout(()=>setGenToast(""),3000);
    } catch(e){ setGenToast("Errore: "+e.message); setTimeout(()=>setGenToast(""),4000); }
    setGenLoading(false);
  }

  const searched = search.trim()
    ? ideas.filter(i=>(i.titolo||"").toLowerCase().includes(search.toLowerCase())||(i.descrizione||"").toLowerCase().includes(search.toLowerCase()))
    : ideas;

  return(
    <div className="ideas-wrap">
      {/* TOP BAR */}
      <div className="ideas-topbar">
        <div style={{fontWeight:800,fontSize:18,color:"var(--ink)"}}>Ideas Board</div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginLeft:"auto"}}>
          <input className="inp" style={{width:200}} placeholder="🔍 Cerca idee…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <button className="btn-outline sm" onClick={()=>{ const i=emptyIdea(); i.stato="draft"; setEditIdea(i); }}>+ Nuova idea</button>
          <button className="ideas-get-btn" onClick={generateIdeas} disabled={genLoading}>
            {genLoading?"Generazione…":"✦ Genera idee"}
          </button>
        </div>
      </div>
      {genToast&&<div className="ideas-toast">{genToast}</div>}

      {/* BOARD */}
      <div className="ideas-board">
        {IDEA_COLS.map(col=>{
          const colIdeas=searched.filter(i=>i.stato===col.id);
          return(
            <div key={col.id} className={`ideas-col ${dragOver===col.id?"ideas-col-drop":""}`}
              onDragOver={e=>onColDragOver(e,col.id)}
              onDrop={e=>onColDrop(e,col.id)}
              onDragLeave={onColDragLeave}>
              <div className="ideas-col-hdr">
                <span className="ideas-col-title">{col.label}</span>
                <span className="ideas-col-cnt" style={{background:col.cnt_bg,color:col.color}}>{colIdeas.length}</span>
                <button className="ideas-add-btn" onClick={e=>{ e.stopPropagation(); const i=emptyIdea(); i.stato=col.id; setEditIdea(i); }}>+</button>
              </div>
              <div className="ideas-col-body">
                {colIdeas.map(idea=>(
                  <IdeaCard key={idea.id} idea={idea}
                    onMove={moveIdea} onEdit={setEditIdea} onDelete={delIdea} onConvert={openConvertModal}
                    onDragStart={setDragId} onDragEnd={()=>setDragId(null)} isDragging={dragId===idea.id}/>
                ))}
                <button className="ideas-newcard-btn"
                  onClick={e=>{ e.stopPropagation(); e.preventDefault(); const i=emptyIdea(); i.stato=col.id; setEditIdea(i); }}>
                  + Nuova idea
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editIdea&&(
        <IdeaFormModal
          idea={editIdea}
          defaultStato={editIdea.stato||"draft"}
          onSave={saveIdea}
          onDelete={ideas.some(i=>i.id===editIdea.id)?delIdea:null}
          onClose={()=>setEditIdea(null)}/>
      )}

      {/* CONVERTI IDEA IN POST — PostFormModal pre-compilata */}
      {convertingIdea&&ConvertPostModal&&(
        <ConvertPostModal
          item={convertingIdea}
          members={[]}
          project={project}
          pilastri={extractPilastri(project)}
          onSave={confirmConvert}
          onDelete={null}
          onClose={()=>setConvertingIdea(null)}/>
      )}
    </div>
  );
}

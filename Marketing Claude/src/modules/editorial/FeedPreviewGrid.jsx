import { useState } from "react";
import {
  FEED_TIPI_ICON,
  FEED_STATI,
  FEED_STATI_STYLE,
  applyEdUpdate,
  getFeedStatusStyle,
} from "./editorialModel";
import { PILASTRO_COLORS, getPillarColor } from "./editorialTheme";
import PlatformPreview from "./PlatformPreview";

export function FeedPreviewGrid({ project, feedItems, onUpdate, onEdit }) {
  const savedOrder = project.ed?.feedOrder || [];
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [feedTab, setFeedTab] = useState("grid"); // grid | reels | stories
  const [filterStato,    setFilterStato]    = useState("tutti");
  const [filterPilastro, setFilterPilastro] = useState("tutti");
  const [selectedPost, setSelectedPost] = useState(null); // for platform preview

  // Apply filters before ordering
  const pilastri = [...new Set(feedItems.map(f=>f.pilastro).filter(Boolean))];
  let visibleItems = feedItems;
  if(filterStato!=="tutti")    visibleItems=visibleItems.filter(f=>f.stato===filterStato);
  if(filterPilastro!=="tutti") visibleItems=visibleItems.filter(f=>f.pilastro===filterPilastro);

  const ordered = (() => {
    const byId = Object.fromEntries(visibleItems.map(f=>[f.id,f]));
    const orderedIds = [...savedOrder.filter(id=>byId[id])];
    const remaining = visibleItems.filter(f=>!orderedIds.includes(f.id))
      .sort((a,b)=>(a.data||"").localeCompare(b.data||""));
    return [...orderedIds.map(id=>byId[id]), ...remaining];
  })();

  const reels   = ordered.filter(f=>f.tipo==="reel");
  const stories = ordered.filter(f=>f.tipo==="storia");
  const activeItems = feedTab==="reels" ? reels : feedTab==="stories" ? stories : ordered;

  function saveOrder(newOrder) {
    onUpdate(applyEdUpdate(project, { feedOrder: newOrder.map(f=>f.id) }));
  }
  function onDragStart(e,idx){ e.dataTransfer.effectAllowed="move"; setDragIdx(idx); }
  function onDragOver(e,idx) { e.preventDefault(); setOverIdx(idx); }
  function onDrop(e,idx){
    e.preventDefault();
    if(dragIdx===null||dragIdx===idx){ setDragIdx(null); setOverIdx(null); return; }
    const arr=[...ordered];
    const [moved]=arr.splice(dragIdx,1);
    arr.splice(idx,0,moved);
    saveOrder(arr);
    setDragIdx(null); setOverIdx(null);
  }
  function onDragEnd(){ setDragIdx(null); setOverIdx(null); }

  function getPlaceholderColor(post){
    return getPillarColor(post.pilastro, project?.pilastri);
  }

  function handleListClick(post) {
    setSelectedPost(prev => prev?.id === post.id ? null : post);
  }

  const FeedCell = ({post, idx, aspect="1/1"}) => {
    const src=post.immagineBase64||post.immagineUrl||"";
    const color=getPlaceholderColor(post);
    const st=getFeedStatusStyle(post.stato);
    const isDragging=dragIdx===idx;
    const isOver=overIdx===idx&&overIdx!==dragIdx;
    return(
      <div className={`fpg-cell ${isDragging?"fpg-dragging":""} ${isOver?"fpg-over":""}`}
        style={{aspectRatio:aspect}} draggable
        onDragStart={e=>onDragStart(e,idx)} onDragOver={e=>onDragOver(e,idx)}
        onDrop={e=>onDrop(e,idx)} onDragEnd={onDragEnd}
        onClick={()=>onEdit(post)}>
        {src
          ? <img src={src} alt="" className="fpg-img" onError={e=>e.target.style.display="none"}/>
          : <div className="fpg-placeholder" style={{background:color+"22",borderLeft:`3px solid ${color}`}}>
              <div className="fpg-ph-label" style={{color}}>{post.titolo||post.pilastro||"Post"}</div>
            </div>}
        <div className="fpg-drag-handle">⊕</div>
        <div className="fpg-status-dot" style={{background:st.tx}} title={st.label}/>
        {post.tipo&&post.tipo!=="post"&&<div className="fpg-type-badge">{FEED_TIPI_ICON[post.tipo]}</div>}
      </div>
    );
  };

  const projectName = project.interview?.nome || project.name || "Brand";

  return(
    <div className="fpg-outer">
      {/* LEFT — chronological list with quick filters */}
      <div className="fpg-list-panel">
        <div className="fpg-list-hdr">
          Lista contenuti <span style={{color:"var(--ink4)",fontWeight:400}}>({ordered.length}{ordered.length!==feedItems.length?` / ${feedItems.length}`:""})</span>
        </div>
        {/* Quick filter bar */}
        <div className="fpg-filter-bar">
          <select className="fpg-filter-sel" value={filterStato} onChange={e=>setFilterStato(e.target.value)}>
            <option value="tutti">Tutti gli stati</option>
            {FEED_STATI.map(s=><option key={s} value={s}>{FEED_STATI_STYLE[s]?.label||s}</option>)}
          </select>
          {pilastri.length>0&&(
            <select className="fpg-filter-sel" value={filterPilastro} onChange={e=>setFilterPilastro(e.target.value)}>
              <option value="tutti">Tutti i pilastri</option>
              {pilastri.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          )}
          {(filterStato!=="tutti"||filterPilastro!=="tutti")&&(
            <button className="fpg-filter-reset" onClick={()=>{setFilterStato("tutti");setFilterPilastro("tutti");}}>✕</button>
          )}
        </div>
        {ordered.length===0&&(
          <div style={{padding:"16px 12px",fontSize:11,color:"var(--ink5)",textAlign:"center",fontStyle:"italic"}}>
            Nessun post per i filtri selezionati.
          </div>
        )}
        {ordered.map(post=>{
          const src=post.immagineBase64||post.immagineUrl||"";
          const st=getFeedStatusStyle(post.stato);
          const col=getPillarColor(post.pilastro, project?.pilastri);
          const isSelected = selectedPost?.id === post.id;
          return(
            <div key={post.id}
              className={`fpg-list-row ${isSelected ? "fpg-list-row-selected" : ""}`}
              onClick={()=>handleListClick(post)}
              onDoubleClick={()=>onEdit(post)}>
              <div className="fpg-list-thumb" style={{background:col+"22",borderLeft:`3px solid ${col}`}}>
                {src&&<img src={src} alt="" onError={e=>e.target.style.display="none"}/>}
                {!src&&<span style={{fontSize:14}}>{FEED_TIPI_ICON[post.tipo]||"📄"}</span>}
              </div>
              <div className="fpg-list-info">
                <div className="fpg-list-title">{post.titolo||"Post senza titolo"}</div>
                <div className="fpg-list-meta">
                  {post.pilastro&&<span style={{color:col,fontSize:9,fontWeight:700}}>{post.pilastro}</span>}
                  {post.data&&<span style={{fontSize:9,color:"var(--ink5)"}}>{post.data}</span>}
                </div>
              </div>
              <div className="fpg-list-stato" style={{background:st.bg,color:st.tx}}>{st.icon}</div>
            </div>
          );
        })}
      </div>

      {/* RIGHT — platform preview OR grid */}
      <div className="fpg-right">
        {selectedPost ? (
          /* PLATFORM PREVIEW — when a post is selected */
          <div style={{width:"100%",maxWidth:480}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>
                Anteprima: {selectedPost.titolo || "Post"}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-outline sm" onClick={()=>onEdit(selectedPost)}>✏️ Modifica</button>
                <button className="btn-ghost sm" onClick={()=>setSelectedPost(null)}>✕ Chiudi</button>
              </div>
            </div>
            <PlatformPreview
              post={selectedPost}
              projectName={projectName}
              project={project}
            />
          </div>
        ) : (
          /* GRID VIEW — IG-style grid when no post selected */
          <>
            <div className="fpg-phone">
              <div className="fpg-ig-hdr">
                <div className="fpg-ig-avatar">{projectName[0].toUpperCase()}</div>
                <div className="fpg-ig-meta">
                  <div className="fpg-ig-name">{projectName}</div>
                  <div className="fpg-ig-counts">
                    <span><b>{feedItems.filter(f=>f.stato==="pubblicato").length}</b><br/>post</span>
                    <span><b>—</b><br/>follower</span>
                    <span><b>—</b><br/>seguiti</span>
                  </div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="fpg-subtabs">
                {[{id:"grid",icon:"⊞",label:"Grid"},{id:"reels",icon:"🎬",label:"Reels"},{id:"stories",icon:"⬜",label:"Storie"}].map(t=>(
                  <button key={t.id} className={`fpg-subtab ${feedTab===t.id?"active":""}`}
                    onClick={()=>setFeedTab(t.id)}>
                    {t.icon} {t.label}
                    {t.id==="reels"&&reels.length>0&&<span className="fpg-subtab-cnt">{reels.length}</span>}
                    {t.id==="stories"&&stories.length>0&&<span className="fpg-subtab-cnt">{stories.length}</span>}
                  </button>
                ))}
              </div>

              {/* Grid tab */}
              {feedTab==="grid"&&(
                <div className="fpg-grid">
                  {activeItems.map((post,idx)=><FeedCell key={post.id} post={post} idx={idx}/>)}
                  {activeItems.length===0&&<div style={{gridColumn:"1/-1",padding:"24px",textAlign:"center",fontSize:11,color:"var(--ink5)"}}>Nessun post da mostrare.</div>}
                  {Array(Math.max(0,(3-activeItems.length%3)%3)).fill(null).map((_,i)=>(
                    <div key={"e"+i} className="fpg-cell fpg-empty-cell"><div style={{fontSize:16,color:"var(--border2)"}}>+</div></div>
                  ))}
                </div>
              )}

              {/* Reels tab — 2 col, 9:16 */}
              {feedTab==="reels"&&(
                <div className="fpg-grid fpg-grid-reels">
                  {reels.length===0
                    ?<div style={{gridColumn:"1/-1",padding:"24px",textAlign:"center",fontSize:11,color:"var(--ink5)"}}>Nessun Reel pianificato.</div>
                    :reels.map((post,idx)=><FeedCell key={post.id} post={post} idx={idx} aspect="9/16"/>)}
                </div>
              )}

              {/* Stories tab — single col, 9:16 */}
              {feedTab==="stories"&&(
                <div className="fpg-grid fpg-grid-stories">
                  {stories.length===0
                    ?<div style={{padding:"24px",textAlign:"center",fontSize:11,color:"var(--ink5)"}}>Nessuna Storia pianificata.</div>
                    :stories.map((post,idx)=><FeedCell key={post.id} post={post} idx={idx} aspect="9/16"/>)}
                </div>
              )}
            </div>

            {/* Reset + legend compact */}
            <div className="fpg-reset-row">
              <button className="btn-ghost sm" onClick={()=>onUpdate(applyEdUpdate(project, { feedOrder: [] }))}>↺ Ordine per data</button>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(PILASTRO_COLORS).slice(0,5).map(([p,c])=>(
                  <div key={p} className="fpg-leg-row" style={{gap:5}}>
                    <div className="fpg-leg-dot" style={{background:c}}/>
                    <span style={{fontSize:9,color:"var(--ink4)"}}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default FeedPreviewGrid;

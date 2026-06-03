import React from "react";
import { FEED_TIPI_ICON, getEditorialPosts } from "./editorialModel";
import { renderMarkdown as defaultRenderMarkdown } from "../../utils/markdown";


export const FUNNEL_STAGES = [
  { id:"TOFU", label:"Top of Funnel", sub:"Awareness — attira nuovi contatti", color:"#0EA5E9", bg:"#EFF8FF", icon:"▲" },
  { id:"MOFU", label:"Middle of Funnel", sub:"Consideration — educa e qualifica", color:"#8B5CF6", bg:"#F5F3FF", icon:"◆" },
  { id:"BOFU", label:"Bottom of Funnel", sub:"Conversion — porta alla decisione", color:"#10B981", bg:"#ECFDF5", icon:"▼" },
];

export function FunnelViewED({ project, onUpdate, renderMarkdown = defaultRenderMarkdown }) {
  const feedItems    = getEditorialPosts(project);
  const kanbanItems  = project.ed?.contentItems || [];
  const allItems     = [...feedItems, ...kanbanItems.filter(k=>!feedItems.some(f=>f.id===k.id))];
  const tot = allItems.length;

  // Funnel target percentages (editable, stored in project.ed.funnelTargets)
  const funnelTargets = project.ed?.funnelTargets || { TOFU:40, MOFU:40, BOFU:20 };
  function setTarget(stage,v){
    const n=Math.max(0,Math.min(100,parseInt(v)||0));
    if(onUpdate) onUpdate({...project,ed:{...(project.ed||{}),funnelTargets:{...funnelTargets,[stage]:n}}});
  }

  const byStage = { TOFU:[], MOFU:[], BOFU:[], "":[] };
  allItems.forEach(item=>{
    const f=(item.funnel||"").toUpperCase();
    if(byStage[f]) byStage[f].push(item);
    else byStage[""].push(item);
  });

  const untagged = byStage[""].length;

  // Reference content from PdM and PdC
  const funnelStrategyContent = project.pdm?.sections?.funnel_strategy?.content||"";
  const funnelComContent      = project.pdc?.sections?.funnel_comunicativo?.content||"";

  // Gap analysis
  const gaps=[];
  if(tot===0){ gaps.push({level:"warn",msg:"Nessun contenuto ancora inserito nel Feed o nel Kanban Board."}); }
  else {
    const tofu=byStage.TOFU.length,mofu=byStage.MOFU.length,bofu=byStage.BOFU.length;
    if(tofu===0)   gaps.push({level:"err",msg:"Nessun contenuto TOFU. Non stai attirando nuovi contatti."});
    if(mofu===0)   gaps.push({level:"err",msg:"Nessun contenuto MOFU. Manca la fase di educazione/qualifica."});
    if(bofu===0)   gaps.push({level:"warn",msg:"Nessun contenuto BOFU. Chi è già convinto non ha CTA chiare."});
    if(untagged>0) gaps.push({level:"info",msg:`${untagged} contenut${untagged===1?"o":"i"} senza tag funnel — assegna TOFU/MOFU/BOFU.`});
    if(gaps.length===0) gaps.push({level:"ok",msg:"Distribuzione funnel senza gap critici ✓"});
  }
  const GAP_STYLE={err:{bg:"#FFF0F3",tx:"#E11D48",icon:"❌"},warn:{bg:"#FFFBEB",tx:"#D97706",icon:"⚠️"},info:{bg:"#EFF8FF",tx:"#0284C7",icon:"ℹ️"},ok:{bg:"#ECFDF5",tx:"#059669",icon:"✅"}};

  // Delta helper
  function delta(stage){
    const real=tot?Math.round(byStage[stage].length/tot*100):0;
    const tgt=funnelTargets[stage]||0;
    const d=real-tgt;
    return {real,tgt,d};
  }
  function statusIcon(d){ return Math.abs(d)<=5?"✅ In target":d>0?"⚠️ Sopra target":"⚠️ Sotto target"; }
  function statusColor(d){ return Math.abs(d)<=5?"var(--ok)":d>0?"var(--warn)":"var(--err)"; }

  const totalPct=Object.values(funnelTargets).reduce((s,v)=>s+v,0);

  return(
    <div className="funnel-wrap">

      {/* CONFRONTO TARGET VS REALE */}
      <div className="funnel-compare-section">
        <div className="funnel-compare-hdr">
          <div style={{fontWeight:700,fontSize:13,color:"var(--ink)"}}>Confronto Strategia vs Distribuzione Reale</div>
          <div style={{fontSize:10,color:"var(--ink4)"}}>{tot} contenuti totali (Feed + Kanban){totalPct!==100?` · ⚠️ Totale target: ${totalPct}% (deve fare 100%)`:""}</div>
        </div>
        <table className="funnel-cmp-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Target %<br/><span style={{fontWeight:400,fontSize:9,color:"var(--ink4)"}}>da Funnel Strategy PdM</span></th>
              <th>Reale %<br/><span style={{fontWeight:400,fontSize:9,color:"var(--ink4)"}}>contenuti attuali</span></th>
              <th>Delta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {FUNNEL_STAGES.map(stage=>{
              const {real,tgt,d}=delta(stage.id);
              return(
                <tr key={stage.id}>
                  <td style={{fontWeight:700,color:stage.color}}>
                    <span style={{marginRight:6}}>{stage.icon}</span>{stage.id}
                    <div style={{fontSize:9,color:"var(--ink4)",fontWeight:400}}>{stage.label}</div>
                  </td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="number" min={0} max={100} value={funnelTargets[stage.id]||0}
                        onChange={e=>setTarget(stage.id,e.target.value)}
                        className="funnel-target-inp"/>
                      <span style={{fontSize:11,color:"var(--ink4)"}}>%</span>
                    </div>
                    {!funnelStrategyContent&&<div style={{fontSize:9,color:"var(--ink5)"}}>Genera Funnel Strategy in PdM</div>}
                  </td>
                  <td style={{fontWeight:700,fontSize:14,color:stage.color}}>
                    {real}%
                    <div style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>{byStage[stage.id].length} post</div>
                  </td>
                  <td style={{fontWeight:700,color:statusColor(d)}}>
                    {d>0?"+":""}{d}pp
                  </td>
                  <td style={{fontSize:11,color:statusColor(d)}}>{tot>0?statusIcon(d):"—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!funnelStrategyContent&&!funnelComContent&&(
          <div style={{fontSize:11,color:"var(--ink4)",fontStyle:"italic",marginTop:8,padding:"8px 12px",background:"var(--bg)",borderRadius:6}}>
            💡 I target % sono modificabili manualmente. Genera <strong>Funnel Strategy</strong> (PdM → Strategia) e <strong>Funnel Comunicativo</strong> (PdC → Operativo) per avere il riferimento strategico completo.
          </div>
        )}
      </div>

      {/* REFERENCE CARDS — PdM + PdC */}
      {(funnelStrategyContent||funnelComContent)&&(
        <div className="funnel-refs">
          {funnelStrategyContent&&(
            <div className="funnel-ref-card">
              <div className="funnel-ref-label">📊 Funnel Strategy — da Piano di Marketing</div>
              <div className="funnel-ref-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(funnelStrategyContent.slice(0,600)+(funnelStrategyContent.length>600?"…":""))}}/>
            </div>
          )}
          {funnelComContent&&(
            <div className="funnel-ref-card">
              <div className="funnel-ref-label">📣 Funnel Comunicativo — da Piano di Comunicazione</div>
              <div className="funnel-ref-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(funnelComContent.slice(0,600)+(funnelComContent.length>600?"…":""))}}/>
            </div>
          )}
        </div>
      )}

      {/* DISTRIBUZIONE VISIVA */}
      <div className="funnel-cols">
        {FUNNEL_STAGES.map(stage=>{
          const items=byStage[stage.id]||[];
          const pct=tot?Math.round(items.length/tot*100):0;
          return(
            <div key={stage.id} className="funnel-col" style={{borderTop:`3px solid ${stage.color}`}}>
              <div className="funnel-col-hdr" style={{background:stage.bg}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{stage.icon}</span>
                  <div><div style={{fontSize:12,fontWeight:800,color:stage.color}}>{stage.id}</div><div style={{fontSize:10,color:"var(--ink4)"}}>{stage.sub}</div></div>
                </div>
                <div className="funnel-col-cnt" style={{color:stage.color,background:"#fff"}}>{items.length}</div>
              </div>
              <div className="funnel-col-body">
                {items.length===0&&<div className="funnel-empty">Nessun contenuto</div>}
                {items.slice(0,5).map(item=>(
                  <div key={item.id} className="funnel-item-row">
                    <span style={{fontSize:11}}>{FEED_TIPI_ICON[item.tipo||item.format?.toLowerCase()]||"📄"}</span>
                    <span className="funnel-item-title">{item.titolo||item.title||"—"}</span>
                    <span style={{fontSize:9,color:"var(--ink5)",flexShrink:0}}>{item.canale||(Array.isArray(item.piattaforme)?item.piattaforme[0]:"")||""}</span>
                  </div>
                ))}
                {items.length>5&&<div style={{fontSize:10,color:"var(--ink4)",padding:"4px 0"}}>+{items.length-5} altri</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* GAP ANALYSIS */}
      <div style={{marginTop:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--ink)",marginBottom:8}}>Analisi gap</div>
        {gaps.map((g,i)=>{ const st=GAP_STYLE[g.level]; return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 12px",background:st.bg,borderRadius:6,marginBottom:6,fontSize:11,color:st.tx}}><span style={{flexShrink:0}}>{st.icon}</span><span>{g.msg}</span></div>); })}
      </div>

      {untagged>0&&<div style={{marginTop:12}}><div style={{fontSize:11,color:"var(--ink4)",marginBottom:6}}>Contenuti senza tag funnel ({untagged})</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{byStage[""].map(item=><span key={item.id} style={{fontSize:10,padding:"2px 8px",background:"var(--bg2)",borderRadius:99,color:"var(--ink3)"}}>{item.titolo||item.title||item.id}</span>)}</div></div>}
    </div>
  );
}

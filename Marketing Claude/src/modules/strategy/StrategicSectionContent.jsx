import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { P_PDM } from "../../prompts/pdmPrompts";
import { P_PDC } from "../../prompts/pdcPrompts";
import { buildCtx } from "../../templates/templateUtils";
import { CommunicationBridgePanel } from "./CommunicationBridge";

export function SectionContent({
  project,
  module,
  secId,
  onUpdate,
  sections,
  colors,
  ExportPanelComponent,
  ToastComponent,
  renderMarkdown,
  SvgIconComponent,
}){
  const P = module==="pdm" ? P_PDM : P_PDC;
  const curSec = sections.find(s=>s.id===secId);
  const secData = (module==="pdm"?project.pdm:project.pdc)?.sections?.[secId];
  const content = secData?.content||"";
  const versions = secData?.versions||[];

  const [generating,setGenerating]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editText,setEditText]=useState("");
  const [showVer,setShowVer]=useState(false);
  const [toast,setToast]=useState("");
  const [showExport,setShowExport]=useState(false);

  const gc = colors[curSec?.group]||"#0EA5E9";

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function updateSec(text){
    const prev = (module==="pdm"?project.pdm:project.pdc)||{sections:{}};
    const existing = prev.sections?.[secId]||{};
    const newVersions = text && existing.content ? [...(existing.versions||[]),{text:existing.content,ts:Date.now()}].slice(-5) : (existing.versions||[]);
    const newSecs = {...prev.sections, [secId]:{content:text, versions:newVersions}};
    const updated = module==="pdm"
      ? {...project, pdm:{...prev, sections:newSecs}}
      : {...project, pdc:{...prev, sections:newSecs}};
    onUpdate(updated);
  }

  async function generate(){
    if(!P[secId]) return;
    setGenerating(true);
    try {
      const ctx = buildCtx(project.interview||{})+(project.context||"");
      const pdmCtx=Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,150)||""}`).join("\n");
      const pdcCtx=Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,150)||""}`).join("\n");
      const richCtx=ctx+(pdmCtx?"\n\n## Marketing estratto:\n"+pdmCtx:"")+(pdcCtx?"\n\n## Comunicazione estratta:\n"+pdcCtx:"");
      const text = await callClaude(P[secId](richCtx));
      updateSec(text);
      showToast("Generato ✓");
    } catch(e){ showToast("Errore — riprova"); }
    setGenerating(false);
  }

  function startEdit(){ setEditText(content); setEditing(true); setShowVer(false); }
  function saveEdit(){ updateSec(editText); setEditing(false); showToast("Salvato ✓"); }
  function cancelEdit(){ setEditing(false); }

  function restoreVersion(v){
    updateSec(v.text);
    setShowVer(false);
    showToast("Versione ripristinata ✓");
  }

  const hasContent = !!content;
  const Toast = ToastComponent || (()=>null);
  const ExportPanel = ExportPanelComponent;
  const renderMd = renderMarkdown || (text => String(text||""));

  return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}

      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>
          {curSec?.label}
        </div>
        <div className="sec-acts">
          {hasContent&&!editing&&(
            <>
              <button className="btn-outline sm" onClick={startEdit}>Modifica</button>
              {versions.length>0&&(
                <button className="btn-ghost sm" onClick={()=>setShowVer(v=>!v)}>
                  {showVer?"Chiudi":"Versioni ("+versions.length+")"}
                </button>
              )}
            </>
          )}
          {editing&&(
            <>
              <button className="btn-primary sm" onClick={saveEdit}>Salva</button>
              <button className="btn-ghost sm" onClick={cancelEdit}>Annulla</button>
            </>
          )}
          {P[secId]&&<button className="btn-primary sm" onClick={generate} disabled={generating}>{generating?"...":"Genera"}</button>}
          {hasContent&&ExportPanel&&<div className="exp-wrap"><button className="btn-ghost sm" onClick={()=>setShowExport(e=>!e)}>↓ Esporta</button>{showExport&&<ExportPanel label={curSec?.label||secId} content={content} projectName={project.name||"Progetto"} secId={secId} onClose={()=>setShowExport(false)}/>}</div>}
        </div>
      </div>

      <div className="sec-content">
        {secId==="obiettivi_smart"&&<CommunicationBridgePanel project={project} onUpdate={onUpdate} SvgIconComponent={SvgIconComponent}/>} 

        {showVer&&versions.length>0&&(
          <div className="vpanel">
            <div className="vpanel-head"><span className="vpanel-title">Versioni precedenti</span></div>
            {versions.map((v,i)=>(
              <div key={i} className="vitem">
                <div className="vitem-meta"><span className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</span></div>
                <div className="vpreview">{v.text.slice(0,120)}…</div>
                <button className="btn-ghost sm" onClick={()=>restoreVersion(v)}>Ripristina</button>
              </div>
            ))}
          </div>
        )}

        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e=>setEditText(e.target.value)}/>
          : hasContent
            ? <div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/>
            : !generating&&(
                <div className="sec-empty">
                  <div className="se-glyph" style={{color:gc}}>{curSec?.icon}</div>
                  <div className="se-msg">Sezione non ancora generata</div>
                  {P[secId]&&<button className="btn-primary" onClick={generate}>Genera →</button>}
                </div>
              )
        }
        {generating&&<div className="gen-row"><div className="spin"/>Generazione in corso…</div>}
      </div>
    </div>
  );
}

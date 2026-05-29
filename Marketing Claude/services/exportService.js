import { callClaude } from "./aiService";

// Export helpers: pure builders + browser download utility
export function downloadBlob(filename, content, type="text/plain;charset=utf-8"){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function mdToHtml(md){
  return md
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/^---+$/gm,"<hr>")
    .replace(/^\| (.+) \|$/gm, row=>"<tr>"+row.slice(2,-2).split(" | ").map(c=>"<td>"+c+"</td>").join("")+"</tr>")
    .replace(/(<tr>.+<\/tr>)/gs, t=>"<table>"+t+"</table>")
    .replace(/^- (.+)$/gm,"<li>$1</li>")
    .replace(/(<li>.+<\/li>\n?)+/gs, l=>"<ul>"+l+"</ul>")
    .replace(/\n\n/g,"</p><p>")
    .replace(/^(?!<[hultHULT])/gm,"<p>")
    .replace(/(?<![>])\n/g,"<br>");
}

export function buildDocHTML(label, content, projectName){
  const date=new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"});
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${label} — ${projectName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;max-width:860px;margin:0 auto;padding:48px 40px;color:#1A1A2E;background:#fff;line-height:1.7;}
.doc-header{border-bottom:3px solid #0EA5E9;padding-bottom:24px;margin-bottom:40px;}
.doc-brand{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:8px;}
.doc-title{font-size:28px;font-weight:800;color:#0F172A;margin-bottom:6px;}
.doc-meta{font-size:12px;color:#94A3B8;}
h1{font-size:22px;color:#0F172A;margin:28px 0 12px;border-bottom:1px solid #E2E8F0;padding-bottom:6px;}
h2{font-size:18px;color:#0F172A;margin:22px 0 10px;}
h3{font-size:15px;color:#334155;margin:18px 0 8px;}
p{margin-bottom:12px;font-size:14px;}
ul{margin:8px 0 14px 20px;}li{margin-bottom:4px;font-size:14px;}
table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13px;}
th,td{border:1px solid #E2E8F0;padding:8px 12px;text-align:left;}
th{background:#F1F5F9;font-weight:700;color:#334155;}
tr:nth-child(even) td{background:#F8FAFC;}
strong{font-weight:700;color:#0F172A;}
hr{border:none;border-top:1px solid #E2E8F0;margin:24px 0;}
.doc-footer{margin-top:48px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between;}
@media print{body{padding:20px;}@page{margin:2cm;}}
</style></head><body>
<div class="doc-header">
  <div class="doc-brand">Nassa Marketing Studio</div>
  <div class="doc-title">${label}</div>
  <div class="doc-meta">${projectName} · ${date}</div>
</div>
<div class="doc-body">${mdToHtml(content)}</div>
<div class="doc-footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it</span>
  <span>${date}</span>
</div>
</body></html>`;
}

export const buildSlidePrompt=(label,content)=>`Trasforma questo contenuto strategico in una presentazione di 8-10 slide per Nassa Studio.
Rispondi SOLO con un array JSON valido, nessun testo prima o dopo:
[{"titolo":"titolo slide","punti":["punto chiave 1","punto chiave 2","punto chiave 3"],"tipo":"cover|content|data|quote","nota":"speaker note breve"}]

Tipi: "cover" per prima slide con headline, "content" per slide standard, "data" per slide con numeri/KPI, "quote" per citazioni/principi chiave.
Punti: max 4 per slide, max 60 caratteri ciascuno. Titoli: max 50 caratteri.

SEZIONE: ${label}
CONTENUTO:
${content.slice(0,3000)}`;

export function buildSlideshowHTML(slidesJson, label, projectName){
  let slides;
  try { slides=JSON.parse(slidesJson.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim().match(/\[[\s\S]*\]/)?.[0]||"[]"); }
  catch { slides=[{titolo:label,punti:["Contenuto non strutturato"],tipo:"cover"}]; }
  if (!Array.isArray(slides) || slides.length === 0) {
    slides = [{ titolo: label, punti: ["Contenuto non strutturato"], tipo: "cover" }];
  }

  const slideHTML=slides.map((s,i)=>`
  <div class="slide ${s.tipo||'content'}" data-index="${i}">
    <div class="slide-num">${i+1}/${slides.length}</div>
    <div class="slide-inner">
      <div class="slide-brand">NASSA STUDIO · ${projectName}</div>
      <h2 class="slide-title">${s.titolo||""}</h2>
      <ul class="slide-points">${(s.punti||[]).map(p=>`<li>${p}</li>`).join("")}</ul>
      ${s.nota?`<div class="slide-note">💡 ${s.nota}</div>`:""}
    </div>
  </div>`).join("");

  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${label} — Presentazione</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;font-family:'Segoe UI',Arial,sans-serif;}
.slides-wrap{width:100%;height:100%;position:relative;background:#0F172A;}
.slide{position:absolute;inset:0;display:none;flex-direction:column;justify-content:center;padding:48px 80px;background:#0F172A;color:#F1F5F9;}
.slide.active{display:flex;}
.slide.cover{background:linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%);text-align:center;align-items:center;}
.slide.data{background:linear-gradient(135deg,#0F172A 0%,#164E63 100%);}
.slide.quote{background:#1E293B;border-left:6px solid #0EA5E9;}
.slide-brand{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:24px;font-weight:700;}
.slide-title{font-size:36px;font-weight:800;color:#F1F5F9;margin-bottom:28px;line-height:1.2;}
.slide.cover .slide-title{font-size:48px;color:#fff;}
.slide-points{list-style:none;display:flex;flex-direction:column;gap:14px;}
.slide-points li{font-size:18px;color:#CBD5E1;display:flex;align-items:flex-start;gap:12px;}
.slide-points li::before{content:"→";color:#0EA5E9;font-weight:700;flex-shrink:0;margin-top:1px;}
.slide.cover .slide-points li{justify-content:center;font-size:20px;color:#94A3B8;}
.slide.cover .slide-points li::before{display:none;}
.slide-note{margin-top:28px;font-size:13px;color:#475569;background:#1E293B;padding:10px 16px;border-radius:6px;border-left:3px solid #334155;}
.slide-num{position:absolute;bottom:24px;right:32px;font-size:12px;color:#334155;font-weight:600;}
.controls{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:12px;z-index:100;}
.ctrl-btn{background:#1E293B;border:1px solid #334155;color:#94A3B8;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;transition:all .15s;}
.ctrl-btn:hover{background:#0EA5E9;color:#fff;border-color:#0EA5E9;}
.progress{position:fixed;top:0;left:0;height:3px;background:#0EA5E9;transition:width .3s;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.slide.active{animation:fadeIn .25s ease;}
@media print{.controls,.slide-num{display:none;}.slide{position:relative;display:flex!important;page-break-after:always;height:100vh;}}
</style></head><body>
<div class="slides-wrap">${slideHTML}</div>
<div class="progress" id="prog"></div>
<div class="controls">
  <button class="ctrl-btn" onclick="prev()">← Prec</button>
  <button class="ctrl-btn" onclick="toggleFull()">⛶ Full</button>
  <button class="ctrl-btn" onclick="next()">Succ →</button>
</div>
<script>
var cur=0,tot=${slides.length};
function show(n){
  document.querySelectorAll('.slide').forEach((s,i)=>s.classList.toggle('active',i===n));
  document.getElementById('prog').style.width=((n+1)/tot*100)+'%';
  cur=n;
}
function next(){if(cur<tot-1)show(cur+1);}
function prev(){if(cur>0)show(cur-1);}
function toggleFull(){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='Space')next();if(e.key==='ArrowLeft')prev();if(e.key==='f')toggleFull();});
show(0);
</script></body></html>`;
}


export function buildModuleDocHTML(moduleMeta, module, project){
  const meta=moduleMeta[module]; if(!meta) return "";
  const data=meta.getter(project);
  const date=new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"});
  const filled=meta.sections.filter(s=>data[s.id]?.content);

  const toc=meta.sections.map(s=>{
    const has=!!data[s.id]?.content;
    return `<li class="${has?"toc-done":"toc-pending"}">${has?"✓":"○"} ${s.label}</li>`;
  }).join("");

  const body=meta.sections.map(s=>{
    const content=data[s.id]?.content;
    if(!content) return `<div class="sec-placeholder"><h2>${s.label}</h2><p class="placeholder-note">Sezione non ancora generata.</p></div>`;
    return `<div class="doc-section"><h2>${s.label}</h2><div class="sec-content">${mdToHtml(content)}</div></div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${meta.label} — ${project.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;max-width:900px;margin:0 auto;padding:48px 40px;color:#1A1A2E;background:#fff;line-height:1.7;}
.cover{min-height:280px;display:flex;flex-direction:column;justify-content:center;border-bottom:4px solid #0EA5E9;padding-bottom:40px;margin-bottom:48px;}
.brand{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:16px;}
.module-title{font-size:38px;font-weight:800;color:#0F172A;margin-bottom:10px;letter-spacing:-.5px;}
.project-name{font-size:16px;color:#64748B;margin-bottom:4px;}
.doc-date{font-size:13px;color:#94A3B8;}
.stats-row{display:flex;gap:32px;margin-top:28px;}
.stat{text-align:center;}.stat-n{font-size:24px;font-weight:800;color:#0F172A;}.stat-l{font-size:10px;color:#94A3B8;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.toc-wrap{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:24px 28px;margin-bottom:48px;}
.toc-title{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748B;margin-bottom:14px;}
.toc-wrap ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.toc-wrap li{font-size:13px;color:#475569;padding:3px 0;}
.toc-done{color:#10B981!important;font-weight:500;}
.toc-pending{color:#CBD5E1!important;}
.doc-section{margin-bottom:56px;padding-bottom:40px;border-bottom:1px solid #E2E8F0;}
.doc-section:last-child{border-bottom:none;}
h2{font-size:22px;color:#0F172A;margin:0 0 20px;padding:12px 0 12px 16px;border-left:4px solid #0EA5E9;background:#F0F9FF;border-radius:0 6px 6px 0;}
h3{font-size:16px;color:#334155;margin:20px 0 10px;}
p{margin-bottom:12px;font-size:14px;color:#374151;}
ul{margin:8px 0 16px 20px;}li{margin-bottom:5px;font-size:14px;color:#374151;}
table{border-collapse:collapse;width:100%;margin:16px 0;font-size:13px;}
th,td{border:1px solid #E2E8F0;padding:9px 13px;text-align:left;}
th{background:#F1F5F9;font-weight:700;color:#334155;}
tr:nth-child(even) td{background:#F8FAFC;}
strong{font-weight:700;color:#0F172A;}
hr{border:none;border-top:1px solid #E2E8F0;margin:24px 0;}
.placeholder-note{color:#CBD5E1;font-style:italic;font-size:13px;}
.sec-placeholder h2{background:#F1F5F9;border-color:#CBD5E1;color:#94A3B8;}
.footer{margin-top:60px;padding-top:20px;border-top:2px solid #E2E8F0;display:flex;justify-content:space-between;font-size:11px;color:#94A3B8;}
@media print{
  body{padding:0;max-width:100%;}
  h2{break-before:auto;}
  .doc-section{break-inside:avoid;}
  @page{margin:2cm;size:A4;}
}
</style></head><body>
<div class="cover">
  <div class="brand">Nassa Marketing Studio</div>
  <div class="module-title">${meta.icon} ${meta.label}</div>
  <div class="project-name">${project.name}</div>
  <div class="doc-date">${date}</div>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${filled.length}</div><div class="stat-l">Sezioni completate</div></div>
    <div class="stat"><div class="stat-n">${meta.sections.length}</div><div class="stat-l">Sezioni totali</div></div>
    <div class="stat"><div class="stat-n">${Math.round(filled.length/meta.sections.length*100)}%</div><div class="stat-l">Avanzamento</div></div>
  </div>
</div>
<div class="toc-wrap">
  <div class="toc-title">Indice sezioni</div>
  <ul>${toc}</ul>
</div>
${body}
<div class="footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it — Modica (RG)</span>
  <span>${date}</span>
</div>
</body></html>`;
}

export function buildModuleMarkdown(moduleMeta, module, project){
  const meta=moduleMeta[module]; if(!meta) return "";
  const data=meta.getter(project);
  const date=new Date().toLocaleDateString("it-IT");
  const header=`# ${meta.icon} ${meta.label}\n**${project.name}** · ${date}\n\n---\n\n`;
  const toc=meta.sections.map((s,i)=>`${i+1}. ${s.label}${data[s.id]?.content?" ✓":""}`).join("\n");
  const body=meta.sections.map(s=>{
    const content=data[s.id]?.content;
    return `## ${s.label}\n\n${content||"_Sezione non ancora generata._"}\n\n---\n`;
  }).join("\n");
  return header+"## Indice\n\n"+toc+"\n\n---\n\n"+body;
}

export async function buildModulePresentationSlides(moduleMeta, module, project){
  const meta=moduleMeta[module]; if(!meta) return "[]";
  const data=meta.getter(project);
  const summary=meta.sections.filter(s=>data[s.id]?.content).map(s=>`### ${s.label}\n${data[s.id].content.slice(0,400)}`).join("\n\n");
  if(!summary.trim()) return `[{"titolo":"${meta.label}","punti":["Nessuna sezione generata"],"tipo":"cover"}]`;
  const prompt=`Crea una presentazione executive di 10-14 slide in italiano per "${meta.label}" di ${project.name}.
Includi: slide di cover con headline, slide per ogni macro-tema chiave, slide con key takeaway.
Rispondi SOLO con array JSON (nessun testo):
[{"titolo":"...","punti":["...","..."],"tipo":"cover|content|data|quote","nota":"..."}]
Punti: max 4 per slide, max 65 caratteri ciascuno.

CONTENUTO ESTRATTO:
${summary.slice(0,4000)}`;
  return await callClaude(prompt, 3000);
}


export async function buildSectionPresentationHTML(label, content, projectName){
  const slidesJson = await callClaude(buildSlidePrompt(label, content), 2000);
  return buildSlideshowHTML(slidesJson, label, projectName);
}

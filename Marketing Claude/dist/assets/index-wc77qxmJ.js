import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{A as t,B as n,C as r,D as i,E as a,F as o,H as s,I as c,L as l,M as u,N as d,O as f,P as p,R as m,S as h,T as g,V as _,_ as v,a as y,b,c as x,d as S,f as C,g as w,h as T,i as E,j as D,k as O,l as k,m as A,n as j,o as ee,p as M,r as N,s as P,t as F,u as I,v as L,w as R,x as z,y as B,z as V}from"./module-editorial-Czj8NH2G.js";import{t as te}from"./vendor-react-wxMQ-bgb.js";import{a as ne,i as re,n as H,r as ie,t as ae}from"./module-team-B_SQGD6H.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var U=e(s(),1),oe=te(),se=`nms-v1`,W=`nms-v1-backup`,ce=`nms_meta`,le=3.5*1024*1024,ue=4.8*1024*1024,de=`/nassa-marketing-workspace.json`,fe=`https://content.dropboxapi.com/2/files/upload`,pe=`https://content.dropboxapi.com/2/files/download`,me=`/api/dropbox-token`,he=null,ge=0;async function _e(){if(he&&Date.now()<ge)return he;try{let e=await fetch(me);if(!e.ok)return null;let t=await e.json();return t.token?(he=t.token,ge=Date.now()+3300*1e3,he):null}catch{return null}}async function ve(){let e=await _e();if(!e)return null;try{let t=await fetch(pe,{method:`POST`,headers:{Authorization:`Bearer ${e}`,"Dropbox-API-Arg":JSON.stringify({path:de})}});return t.status===409||!t.ok?null:await t.json()}catch{return null}}async function ye(e){let t=await _e();if(!t)return!1;try{return(await fetch(fe,{method:`POST`,headers:{Authorization:`Bearer ${t}`,"Content-Type":`application/octet-stream`,"Dropbox-API-Arg":JSON.stringify({path:de,mode:`overwrite`,autorename:!1,mute:!0})},body:JSON.stringify(e)})).ok}catch{return!1}}var be=null;function xe(e){be&&clearTimeout(be),be=setTimeout(async()=>{await ye(e)?console.log(`[storageService] Dropbox sync OK`):console.warn(`[storageService] Dropbox sync failed — data is safe in localStorage`),be=null},2e3)}function Se(){return typeof window>`u`?{available:!1,reason:`SSR — window non disponibile`}:window.storage?.get&&window.storage?.set?{available:!0,type:`window.storage`,async get(e){return window.storage.get(e)},async set(e,t){return window.storage.set(e,t)},async del(e){return window.storage.delete(e)}}:window.localStorage?{available:!0,type:`localStorage`,async get(e){let t=localStorage.getItem(e);return t===null?null:{value:t}},async set(e,t){return localStorage.setItem(e,t),{key:e,value:t}},async del(e){return localStorage.removeItem(e),{key:e,deleted:!0}}}:{available:!1,reason:`Nessun backend storage accessibile`}}function Ce(e){if(!e)return`Errore storage sconosciuto`;if(typeof e==`string`)return e;let t=e.message||String(e);return e.name===`QuotaExceededError`||t.toLowerCase().includes(`quota`)||e.code===22?`Spazio storage esaurito. Elimina alcuni progetti non più necessari o esporta i dati.`:t}function we(e){let t=new Blob([e]).size;return t>ue?{ok:!1,warning:!1,bytes:t,error:`Workspace troppo grande (${(t/1024/1024).toFixed(1)} MB). Elimina versioni precedenti.`}:t>le?{ok:!0,warning:!0,bytes:t,error:null,warningMsg:`Workspace grande (${(t/1024/1024).toFixed(1)} MB su 4.8 MB max).`}:{ok:!0,warning:!1,bytes:t,error:null}}function Te(e,t=``){try{return JSON.parse(e)}catch(e){return console.error(`[storageService] JSON corrotto${t?` in `+t:``}:`,e.message),null}}async function Ee(e,t=2,n=200){let r;for(let i=0;i<t;i++)try{return await e()}catch(e){r=e,i<t-1&&await new Promise(e=>setTimeout(e,n*(i+1)))}throw r}async function De(e,t){try{await e.set(W,JSON.stringify({ts:Date.now(),raw:t}))}catch{}}async function Oe(e=se){let t=Se(),r=await ve();if(r){let i=n(r);try{t.available&&await t.set(e,JSON.stringify(i))}catch{}return{ok:!0,data:i,error:null,sizeWarning:null,source:`dropbox`}}if(!t.available)return{ok:!1,data:null,error:t.reason,sizeWarning:null};try{let r=await Ee(()=>t.get(e));if(!r?.value)return{ok:!0,data:null,error:null,sizeWarning:null,source:`empty`};let i=Te(r.value,e);if(i===null)return await De(t,r.value),{ok:!1,data:null,error:`Dati workspace corrotti. Backup salvato.`,sizeWarning:null};let a=Number(i.schemaVersion||1);return a>2&&console.warn(`[storageService] Schema v${a} > app v2.`),{ok:!0,data:n(i),error:null,sizeWarning:null,source:`localStorage`}}catch(e){return{ok:!1,data:null,error:Ce(e),sizeWarning:null}}}async function ke(e,t=se){let r=Se();try{let i=n(e),a=JSON.stringify(i),o=we(a);return o.ok?(r.available&&await Ee(()=>r.set(t,a)),xe(i),{ok:!0,data:i,error:null,savedAt:Date.now(),sizeWarning:o.warning?o.warningMsg:null}):{ok:!1,data:i,error:o.error,savedAt:null,sizeWarning:null}}catch(t){return{ok:!1,data:e,error:Ce(t),savedAt:null,sizeWarning:null}}}async function Ae(e=se){let t=Se();if(!t.available)return{ok:!1};try{return await t.del(e),{ok:!0}}catch(e){return{ok:!1,error:Ce(e)}}}var G=R(),je=`
.eb-app-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9F9F7;
  font-family: 'Inter', system-ui, sans-serif;
  padding: 24px;
}
.eb-app-card {
  background: #fff;
  border: 1px solid #E0E0DC;
  border-radius: 12px;
  padding: 32px 36px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
}
.eb-app-glyph {
  font-size: 32px;
  margin-bottom: 12px;
}
.eb-app-title {
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 6px;
}
.eb-app-sub {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 20px;
}
.eb-app-rule {
  font-size: 10px;
  font-weight: 700;
  color: #C2185B;
  background: rgba(194,24,91,.07);
  border: 1px solid rgba(194,24,91,.18);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 20px;
  letter-spacing: .3px;
}
.eb-app-detail {
  font-size: 10px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #9CA3AF;
  background: #F3F4F6;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 20px;
  overflow: auto;
  max-height: 100px;
  white-space: pre-wrap;
  word-break: break-all;
}
.eb-app-actions {
  display: flex;
  gap: 8px;
}
.eb-btn-primary {
  flex: 1;
  padding: 9px 16px;
  background: #1F2937;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.eb-btn-primary:hover { background: #111827; }
.eb-btn-ghost {
  padding: 9px 16px;
  background: none;
  color: #6B7280;
  border: 1px solid #E0E0DC;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}
.eb-btn-ghost:hover { background: #F9F9F7; color: #1F2937; }

/* Module-level fallback — inline, doesn't kill the whole app */
.eb-mod-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  text-align: center;
  flex: 1;
  background: #F9F9F7;
  border-top: 1px solid #E0E0DC;
}
.eb-mod-glyph {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: .6;
}
.eb-mod-title {
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}
.eb-mod-sub {
  font-size: 11px;
  color: #6B7280;
  margin-bottom: 14px;
  line-height: 1.5;
}
.eb-mod-retry {
  padding: 6px 14px;
  background: none;
  border: 1px solid #C8C8C4;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
}
.eb-mod-retry:hover { background: #F3F4F6; }
.eb-mod-detail {
  margin-top: 10px;
  font-size: 9px;
  font-family: monospace;
  color: #9CA3AF;
  max-width: 320px;
  word-break: break-all;
}
`,Me=class extends U.Component{constructor(e){super(e),this.state={hasError:!1,error:null,errorInfo:null},this._handleReset=this._handleReset.bind(this),this._handleClearStorage=this._handleClearStorage.bind(this)}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){this.setState({errorInfo:t}),console.error(`[NMS AppErrorBoundary]`,{message:e?.message,stack:e?.stack?.slice(0,500),componentStack:t?.componentStack?.slice(0,500),timestamp:new Date().toISOString()})}_handleReset(){this.setState({hasError:!1,error:null,errorInfo:null})}_handleClearStorage(){Promise.all([Ae(),Ae(ce)]).finally(()=>{window.location.reload()})}render(){return this.state.hasError?(this.state.error?.message,(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`style`,{children:je}),(0,G.jsx)(`div`,{className:`eb-app-wrap`,children:(0,G.jsxs)(`div`,{className:`eb-app-card`,children:[(0,G.jsx)(`div`,{className:`eb-app-glyph`,children:`⚠️`}),(0,G.jsx)(`div`,{className:`eb-app-title`,children:`Qualcosa è andato storto`}),(0,G.jsx)(`div`,{className:`eb-app-sub`,children:`Nassa Marketing Studio ha incontrato un errore inatteso. Prova a ricaricare — i dati sono salvati automaticamente.`}),(0,G.jsxs)(`div`,{className:`eb-app-rule`,children:[`Regola #6 — L'output AI passa sempre da revisione umana.`,(0,G.jsx)(`br`,{}),`Se l'errore si ripete dopo una generazione AI, pulisci la sezione e riprova.`]}),!1,(0,G.jsxs)(`div`,{className:`eb-app-actions`,children:[(0,G.jsx)(`button`,{className:`eb-btn-primary`,onClick:this._handleReset,children:`↩ Riprova`}),(0,G.jsx)(`button`,{className:`eb-btn-ghost`,onClick:this._handleClearStorage,children:`🗑 Reset workspace`})]})]})})]})):this.props.children}},K=class extends U.Component{constructor(e){super(e),this.state={hasError:!1,error:null},this._handleRetry=this._handleRetry.bind(this)}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){let n=this.props.name||`unknown`;console.error(`[NMS ModuleErrorBoundary: ${n}]`,{message:e?.message,componentStack:t?.componentStack?.slice(0,300),timestamp:new Date().toISOString()})}componentDidUpdate(e){this.state.hasError&&e.resetKey!==this.props.resetKey&&this.setState({hasError:!1,error:null})}_handleRetry(){this.setState({hasError:!1,error:null})}render(){if(!this.state.hasError)return this.props.children;let e=this.props.name||`Modulo`;return this.state.error?.message,(0,G.jsxs)(`div`,{className:`eb-mod-wrap`,children:[(0,G.jsx)(`div`,{className:`eb-mod-glyph`,children:`🔧`}),(0,G.jsxs)(`div`,{className:`eb-mod-title`,children:[e,` non disponibile`]}),(0,G.jsxs)(`div`,{className:`eb-mod-sub`,children:[`Questo modulo ha incontrato un errore.`,(0,G.jsx)(`br`,{}),`Gli altri moduli e i dati non sono stati toccati.`]}),(0,G.jsx)(`button`,{className:`eb-mod-retry`,onClick:this._handleRetry,children:`↩ Riprova`}),!1]})}};function Ne(e,t,n=`text/plain;charset=utf-8`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Pe(e){return e.replace(/^### (.+)$/gm,`<h3>$1</h3>`).replace(/^## (.+)$/gm,`<h2>$1</h2>`).replace(/^# (.+)$/gm,`<h1>$1</h1>`).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(/\*(.+?)\*/g,`<em>$1</em>`).replace(/^---+$/gm,`<hr>`).replace(/^\| (.+) \|$/gm,e=>`<tr>`+e.slice(2,-2).split(` | `).map(e=>`<td>`+e+`</td>`).join(``)+`</tr>`).replace(/(<tr>.+<\/tr>)/gs,e=>`<table>`+e+`</table>`).replace(/^- (.+)$/gm,`<li>$1</li>`).replace(/(<li>.+<\/li>\n?)+/gs,e=>`<ul>`+e+`</ul>`).replace(/\n\n/g,`</p><p>`).replace(/^(?!<[hultHULT])/gm,`<p>`).replace(/(?<![>])\n/g,`<br>`)}function Fe(e,t,n){let r=new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`long`,year:`numeric`});return`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${e} — ${n}</title>
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
  <div class="doc-title">${e}</div>
  <div class="doc-meta">${n} · ${r}</div>
</div>
<div class="doc-body">${Pe(t)}</div>
<div class="doc-footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it</span>
  <span>${r}</span>
</div>
</body></html>`}var Ie=(e,t)=>`Trasforma questo contenuto strategico in una presentazione di 8-10 slide per Nassa Studio.
Rispondi SOLO con un array JSON valido, nessun testo prima o dopo:
[{"titolo":"titolo slide","punti":["punto chiave 1","punto chiave 2","punto chiave 3"],"tipo":"cover|content|data|quote","nota":"speaker note breve"}]

Tipi: "cover" per prima slide con headline, "content" per slide standard, "data" per slide con numeri/KPI, "quote" per citazioni/principi chiave.
Punti: max 4 per slide, max 60 caratteri ciascuno. Titoli: max 50 caratteri.

SEZIONE: ${e}
CONTENUTO:
${t.slice(0,3e3)}`;function Le(e,t,n){let r;try{r=JSON.parse(e.replace(/```json\s*/gi,``).replace(/```\s*/g,``).trim().match(/\[[\s\S]*\]/)?.[0]||`[]`)}catch{r=[{titolo:t,punti:[`Contenuto non strutturato`],tipo:`cover`}]}return(!Array.isArray(r)||r.length===0)&&(r=[{titolo:t,punti:[`Contenuto non strutturato`],tipo:`cover`}]),`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${t} — Presentazione</title>
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
<div class="slides-wrap">${r.map((e,t)=>`
  <div class="slide ${e.tipo||`content`}" data-index="${t}">
    <div class="slide-num">${t+1}/${r.length}</div>
    <div class="slide-inner">
      <div class="slide-brand">NASSA STUDIO · ${n}</div>
      <h2 class="slide-title">${e.titolo||``}</h2>
      <ul class="slide-points">${(e.punti||[]).map(e=>`<li>${e}</li>`).join(``)}</ul>
      ${e.nota?`<div class="slide-note">💡 ${e.nota}</div>`:``}
    </div>
  </div>`).join(``)}</div>
<div class="progress" id="prog"></div>
<div class="controls">
  <button class="ctrl-btn" onclick="prev()">← Prec</button>
  <button class="ctrl-btn" onclick="toggleFull()">⛶ Full</button>
  <button class="ctrl-btn" onclick="next()">Succ →</button>
</div>
<script>
var cur=0,tot=${r.length};
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
<\/script></body></html>`}function Re(e,t,n){let r=e[t];if(!r)return``;let i=r.getter(n),a=new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`long`,year:`numeric`}),o=r.sections.filter(e=>i[e.id]?.content),s=r.sections.map(e=>{let t=!!i[e.id]?.content;return`<li class="${t?`toc-done`:`toc-pending`}">${t?`✓`:`○`} ${e.label}</li>`}).join(``),c=r.sections.map(e=>{let t=i[e.id]?.content;return t?`<div class="doc-section"><h2>${e.label}</h2><div class="sec-content">${Pe(t)}</div></div>`:`<div class="sec-placeholder"><h2>${e.label}</h2><p class="placeholder-note">Sezione non ancora generata.</p></div>`}).join(``);return`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${r.label} — ${n.name}</title>
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
  <div class="module-title">${r.icon} ${r.label}</div>
  <div class="project-name">${n.name}</div>
  <div class="doc-date">${a}</div>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${o.length}</div><div class="stat-l">Sezioni completate</div></div>
    <div class="stat"><div class="stat-n">${r.sections.length}</div><div class="stat-l">Sezioni totali</div></div>
    <div class="stat"><div class="stat-n">${Math.round(o.length/r.sections.length*100)}%</div><div class="stat-l">Avanzamento</div></div>
  </div>
</div>
<div class="toc-wrap">
  <div class="toc-title">Indice sezioni</div>
  <ul>${s}</ul>
</div>
${c}
<div class="footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it — Modica (RG)</span>
  <span>${a}</span>
</div>
</body></html>`}function ze(e,t,n){let r=e[t];if(!r)return``;let i=r.getter(n),a=new Date().toLocaleDateString(`it-IT`),o=`# ${r.icon} ${r.label}\n**${n.name}** · ${a}\n\n---\n\n`,s=r.sections.map((e,t)=>`${t+1}. ${e.label}${i[e.id]?.content?` ✓`:``}`).join(`
`),c=r.sections.map(e=>{let t=i[e.id]?.content;return`## ${e.label}\n\n${t||`_Sezione non ancora generata._`}\n\n---\n`}).join(`
`);return o+`## Indice

`+s+`

---

`+c}async function Be(e,t,n){let i=e[t];if(!i)return`[]`;let a=i.getter(n),o=i.sections.filter(e=>a[e.id]?.content).map(e=>`### ${e.label}\n${a[e.id].content.slice(0,400)}`).join(`

`);return o.trim()?await r(`Crea una presentazione executive di 10-14 slide in italiano per "${i.label}" di ${n.name}.
Includi: slide di cover con headline, slide per ogni macro-tema chiave, slide con key takeaway.
Rispondi SOLO con array JSON (nessun testo):
[{"titolo":"...","punti":["...","..."],"tipo":"cover|content|data|quote","nota":"..."}]
Punti: max 4 per slide, max 65 caratteri ciascuno.

CONTENUTO ESTRATTO:
${o.slice(0,4e3)}`,3e3):`[{"titolo":"${i.label}","punti":["Nessuna sezione generata"],"tipo":"cover"}]`}async function Ve(e,t,n){return Le(await r(Ie(e,t),2e3),e,n)}function He({project:e,client:t,month:n,aiInsight:r}){let i=t?.name||e.interview?.nome||e.name||`Cliente`,a=t?.color||`#006EFF`,o=new Date().toLocaleDateString(`it-IT`,{day:`2-digit`,month:`long`,year:`numeric`}),s=n||new Date().toLocaleString(`it-IT`,{month:`long`,year:`numeric`});e.interview;let c=e.ed||{},l=c.perfLogs||[],u=l.slice(-1)[0]||{},d=l.slice(-2)[0]||{},f=[...c.feedItems||[],...c.contentItems||[]],p=new Date().toISOString().slice(0,7),m=f.filter(e=>(e.data||e.dueDate||e.dateISO||``).startsWith(p)),h=f.filter(e=>e.stato===`pubblicato`||e.stato===`live`||e.status===`live`),g={};f.forEach(e=>{let t=e.pilastro||`Non assegnato`;g[t]=(g[t]||0)+1});let _=Object.values(g).reduce((e,t)=>e+t,0)||1,v={};f.forEach(e=>{(e.piattaforme||e.canali||[e.canale]).filter(Boolean).forEach(e=>{v[e]=(v[e]||0)+1})});let y=Object.keys(u).filter(e=>e!==`id`&&e!==`mese`&&u[e]).slice(0,8).map(e=>{let t=Number(u[e])||u[e],n=Number(d?.[e])||d?.[e],r=``;if(typeof t==`number`&&typeof n==`number`&&n!==0){let e=Math.round((t-n)/n*100);r=e>0?`<span style="color:#10B981">▲ ${e}%</span>`:e<0?`<span style="color:#EF4444">▼ ${Math.abs(e)}%</span>`:`=`}return`<tr><td>${e}</td><td><strong>${t}</strong></td><td>${n||`—`}</td><td>${r||`—`}</td></tr>`}).join(``),b=Object.entries(g).sort((e,t)=>t[1]-e[1]).slice(0,6).map(([e,t])=>{let n=Math.round(t/_*100);return`<div class="bar-row">
      <div class="bar-label">${e}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${n}%;background:${a}"></div></div>
      <div class="bar-pct">${n}%</div>
    </div>`}).join(``),x=Object.entries(v).sort((e,t)=>t[1]-e[1]).slice(0,5).map(([e,t])=>`<div class="plat-row"><span>${{instagram:`📸`,facebook:`📘`,tiktok:`🎵`,linkedin:`💼`,youtube:`▶️`,email:`📧`,blog:`📝`}[e.toLowerCase()]||`🔗`} ${e}</span><strong>${t}</strong></div>`).join(``),S=h.slice(-5).reverse().map((e,t)=>`
    <div class="top-post">
      <div class="top-post-num">${t+1}</div>
      <div class="top-post-info">
        <div class="top-post-title">${e.titolo||e.title||`—`}</div>
        <div class="top-post-meta">${(e.piattaforme||[e.canale]).filter(Boolean).join(` · `)} · ${e.data||e.dueDate||``}</div>
      </div>
    </div>`).join(``)||`<p style='color:#9CA3AF;font-style:italic'>Nessun post pubblicato registrato.</p>`;return`<!DOCTYPE html>
<html lang="it"><head>
<meta charset="UTF-8">
<title>Report Mensile — ${i}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: #fff; color: #1F2937; line-height: 1.6; }
.page { max-width: 820px; margin: 0 auto; padding: 48px 40px; }

/* COVER */
.cover { min-height: 200px; border-bottom: 4px solid ${a}; padding-bottom: 36px; margin-bottom: 48px; }
.cover-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${a}; margin-bottom: 14px; }
.cover-client { font-size: 36px; font-weight: 800; color: #0F172A; margin-bottom: 6px; letter-spacing: -.5px; }
.cover-title { font-size: 18px; font-weight: 500; color: #64748B; margin-bottom: 4px; }
.cover-date { font-size: 13px; color: #94A3B8; }

/* KPI SUMMARY */
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 40px; }
.kpi-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; text-align: center; }
.kpi-card-val { font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
.kpi-card-lbl { font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #94A3B8; }

/* SECTION */
.section { margin-bottom: 48px; }
.section-title { font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: ${a}; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid ${a}22; }

/* KPI TABLE */
table { border-collapse: collapse; width: 100%; font-size: 13px; border-radius: 8px; overflow: hidden; }
th { background: #F1F5F9; font-weight: 700; color: #334155; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
td { border-top: 1px solid #F1F5F9; padding: 10px 14px; }
tr:hover td { background: #FAFAFA; }

/* PILLAR BARS */
.bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.bar-label { font-size: 12px; color: #374151; min-width: 140px; }
.bar-track { flex: 1; height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 8px; border-radius: 4px; transition: width .3s; }
.bar-pct { font-size: 11px; font-weight: 700; color: #6B7280; min-width: 36px; text-align: right; }

/* PLATFORM */
.plat-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #F8FAFC; border-radius: 6px; margin-bottom: 6px; font-size: 13px; }
.plat-row strong { color: ${a}; font-weight: 700; }

/* TOP POSTS */
.top-post { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
.top-post:last-child { border-bottom: none; }
.top-post-num { width: 28px; height: 28px; border-radius: 50%; background: ${a}15; color: ${a}; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.top-post-title { font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 3px; }
.top-post-meta { font-size: 11px; color: #9CA3AF; }

/* AI INSIGHT */
.insight-box { background: linear-gradient(135deg, ${a}08 0%, ${a}04 100%); border: 1.5px solid ${a}30; border-radius: 12px; padding: 24px; }
.insight-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${a}; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.insight-text { font-size: 14px; color: #374151; line-height: 1.8; white-space: pre-wrap; }

/* TWO COL */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }

/* FOOTER */
.footer { margin-top: 56px; padding-top: 20px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 11px; color: #9CA3AF; }

@media print {
  body { padding: 0; }
  .page { max-width: 100%; padding: 20px; }
  @page { margin: 1.5cm; size: A4; }
}
</style>
</head>
<body>
<div class="page">

  <!-- COVER -->
  <div class="cover">
    <div class="cover-eyebrow">Report Mensile</div>
    <div class="cover-client">${i}</div>
    <div class="cover-title">${s}</div>
    <div class="cover-date">Generato il ${o}</div>
  </div>

  <!-- KPI SUMMARY -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-card-val">${f.length}</div>
      <div class="kpi-card-lbl">Post totali</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card-val">${h.length}</div>
      <div class="kpi-card-lbl">Pubblicati</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card-val">${m.length}</div>
      <div class="kpi-card-lbl">Questo mese</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card-val">${Object.keys(v).length}</div>
      <div class="kpi-card-lbl">Canali attivi</div>
    </div>
  </div>

  <!-- KPI TABLE -->
  ${y?`<div class="section">
    <div class="section-title">📊 Performance KPI</div>
    <table>
      <thead><tr><th>Metrica</th><th>Questo mese</th><th>Mese prec.</th><th>Variazione</th></tr></thead>
      <tbody>${y}</tbody>
    </table>
  </div>`:``}

  <!-- TWO COL: pillar + platform -->
  <div class="two-col">
    <div class="section">
      <div class="section-title">🎯 Distribuzione pilastri</div>
      ${b||`<p style='color:#9CA3AF;font-style:italic'>Nessun dato pilastri.</p>`}
    </div>
    <div class="section">
      <div class="section-title">📡 Canali</div>
      ${x||`<p style='color:#9CA3AF;font-style:italic'>Nessun dato canali.</p>`}
    </div>
  </div>

  <!-- TOP POSTS -->
  <div class="section">
    <div class="section-title">🏆 Contenuti pubblicati</div>
    ${S}
  </div>

  <!-- AI INSIGHT -->
  ${r?`<div class="section">
    <div class="section-title">✦ Analisi & Raccomandazione AI</div>
    <div class="insight-box">
      <div class="insight-label">✦ Generato da AI · Nassa Studio</div>
      <div class="insight-text">${r}</div>
    </div>
  </div>`:``}

  <!-- FOOTER -->
  <div class="footer">
    <span>Realizzato da Nassa Studio S.r.l.s. — nassastudio.it</span>
    <span>${o}</span>
  </div>

</div>
</body></html>`}function Ue({feedItems:e,ideeItems:t,onEdit:n}){let r=new Date;function i(e){let t=new Date(r.getFullYear(),r.getMonth()+e,1);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}`}let[a,s]=(0,U.useState)(`current`),c=[{id:`current`,label:`Questo mese`,iso:i(0)},{id:`next`,label:`Prossimo`,iso:i(1)},{id:`next2`,label:`+2 mesi`,iso:i(2)},{id:`all`,label:`Tutti`,iso:null}],l=c.find(e=>e.id===a),u=[...e.map(e=>({...e,_type:`post`})),...t.map(e=>({...e,_type:`idea`}))].filter(e=>!l?.iso||e.data?.startsWith(l.iso)).sort((e,t)=>(e.data||``).localeCompare(t.data||``));return(0,G.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,flex:1,overflow:`hidden`},children:[(0,G.jsxs)(`div`,{className:`contenuti-list-toolbar`,children:[(0,G.jsx)(`div`,{className:`cal-period-strip`,children:c.map(e=>(0,G.jsxs)(`button`,{className:`cal-period-btn ${a===e.id?`active`:``}`,onClick:()=>s(e.id),children:[e.label,e.iso&&(0,G.jsx)(`span`,{className:`cal-period-month`,children:e.iso})]},e.id))}),(0,G.jsxs)(`span`,{style:{fontSize:11,color:`var(--ink4)`,marginLeft:`auto`},children:[u.length,` contenuti`]})]}),(0,G.jsx)(`div`,{className:`llist-wrap`,children:u.length===0?(0,G.jsx)(`div`,{className:`ct-empty`,style:{padding:`40px 0`},children:`Nessun contenuto per il periodo selezionato.`}):(0,G.jsxs)(`table`,{className:`llist-table`,children:[(0,G.jsx)(`thead`,{children:(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`th`,{className:`llist-th-subject`,children:`Soggetto`}),(0,G.jsx)(`th`,{className:`llist-th-date`,style:{color:`var(--ok)`},children:`Data`}),(0,G.jsx)(`th`,{children:`Formato`}),(0,G.jsx)(`th`,{children:`Canali`}),(0,G.jsx)(`th`,{children:`Caption`}),(0,G.jsx)(`th`,{children:`Media`}),(0,G.jsx)(`th`,{children:`Stato`})]})}),(0,G.jsx)(`tbody`,{children:u.map(e=>{if(e._type===`idea`){let t=L(e.stato);return(0,G.jsxs)(`tr`,{className:`llist-row`,style:{background:`#F0FDF4`},children:[(0,G.jsx)(`td`,{children:(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6},children:[`💡`,(0,G.jsx)(`span`,{className:`llist-title`,style:{color:`#16A34A`},children:e.titolo})]})}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`div`,{style:{fontSize:12,fontWeight:600},children:e.data||`—`})}),(0,G.jsxs)(`td`,{children:[f[e.tipo],` `,e.tipo]}),(0,G.jsx)(`td`,{children:`—`}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`span`,{className:`llist-copy-preview`,children:e.descrizione||``})}),(0,G.jsx)(`td`,{children:`—`}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`div`,{className:`llist-stato`,style:{background:t.bg,color:t.color},children:t.label})})]},e.id)}let t=e,r=o(t.stato),i=(t.piattaforme||[]).map(e=>g.find(t=>t.id===e)).filter(Boolean),a=t.immagineBase64||t.immagineUrl||``,s=t.data?new Date(t.data+`T12:00:00`):null;return(0,G.jsxs)(`tr`,{className:`llist-row`,children:[(0,G.jsxs)(`td`,{className:`llist-td-subject`,children:[(0,G.jsx)(`div`,{className:`llist-title`,onClick:()=>n(t),children:t.titolo||`Post senza titolo`}),t.pilastro&&(0,G.jsx)(`span`,{style:{fontSize:9,color:B(t.pilastro),fontWeight:700},children:t.pilastro})]}),(0,G.jsxs)(`td`,{className:`llist-td-date`,children:[(0,G.jsx)(`div`,{style:{fontWeight:600,fontSize:12},children:s?.toLocaleDateString(`it-IT`,{weekday:`short`,day:`2-digit`,month:`short`})||`—`}),t.time&&(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink4)`},children:t.time})]}),(0,G.jsx)(`td`,{children:(0,G.jsxs)(`span`,{style:{fontSize:11},children:[f[t.tipo],` `,O[t.tipo]||`Post`]})}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`div`,{style:{display:`flex`,gap:3},children:i.map(e=>(0,G.jsx)(`span`,{className:`pgc-piat-dot`,style:{background:e.color,width:10,height:10},title:e.label},e.id))})}),(0,G.jsx)(`td`,{className:`llist-td-copy`,children:(0,G.jsx)(`span`,{className:`llist-copy-preview`,children:t.caption||(0,G.jsx)(`span`,{style:{color:`var(--ink5)`,fontStyle:`italic`},children:`—`})})}),(0,G.jsx)(`td`,{children:a?(0,G.jsx)(`img`,{src:a,className:`llist-thumb`,alt:``,onError:e=>e.target.style.display=`none`}):(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ink5)`},children:`—`})}),(0,G.jsxs)(`td`,{children:[(0,G.jsxs)(`div`,{className:`llist-stato`,style:{background:r.bg,color:r.tx},children:[r.icon,` `,r.label.replace(/[✅🚀🕐👁️✏️❌]/g,``).trim()]}),(0,G.jsx)(`button`,{className:`llist-action-btn`,onClick:()=>n(t),children:`Modifica →`})]})]},t.id)})})]})})]})}function We(e){return e.getFullYear()+`-`+String(e.getMonth()+1).padStart(2,`0`)+`-`+String(e.getDate()).padStart(2,`0`)}var Ge=[{stato:`bozza`,dot:`#94A3B8`,bg:`#F8FAFC`},{stato:`revisione`,dot:`#F59E0B`,bg:`#FFFBEB`},{stato:`non-approvato`,dot:`#EF4444`,bg:`#FFF5F5`},{stato:`approvato`,dot:`#3B82F6`,bg:`#EFF6FF`},{stato:`schedulato`,dot:`#10B981`,bg:`#F0FDF4`},{stato:`pubblicato`,dot:`#6B7280`,bg:`#F9FAFB`}];function Ke({feedItems:e,onFilter:t}){let n=e.length;return(0,G.jsxs)(`div`,{className:`lo-card`,children:[(0,G.jsxs)(`div`,{className:`lo-card-hdr`,children:[(0,G.jsx)(`div`,{className:`lo-card-title`,children:`🚩 Post Overview`}),(0,G.jsx)(`button`,{className:`lo-filter-btn`,title:`Vai ai contenuti`,onClick:()=>t(`tutti`),children:`⊞`})]}),(0,G.jsx)(`div`,{className:`lo-pipeline`,children:Ge.map(n=>{let r=o(n.stato),i=e.filter(e=>m(e,n.stato)).length;return(0,G.jsxs)(`button`,{className:`lo-pipe-row`,style:{background:n.bg},onClick:()=>t(n.stato),children:[(0,G.jsx)(`span`,{className:`lo-pipe-dot`,style:{background:n.dot}}),(0,G.jsx)(`span`,{className:`lo-pipe-label`,children:r.label.replace(/[✅🚀🕐👁️✏️❌]/g,``).trim()}),(0,G.jsx)(`span`,{className:`lo-pipe-cnt`,style:{color:i>0?n.dot:`#CBD5E1`},children:i})]},n.stato)})}),(0,G.jsxs)(`div`,{className:`lo-pipe-total`,children:[(0,G.jsxs)(`span`,{children:[n,` post totali`]}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{fontSize:10},onClick:()=>t(`tutti`),children:`Vedi tutti →`})]})]})}function qe({feedItems:e,onAddPost:t}){let[n,r]=(0,U.useState)(0),i=new Date,a=new Date(i);a.setDate(i.getDate()+n);let s=We(a),c=n===0,l=c?`Oggi`:n===1?`Domani`:n===-1?`Ieri`:a.toLocaleDateString(`it-IT`,{weekday:`long`,day:`2-digit`,month:`short`}),u=e.filter(e=>e.data===s);return(0,G.jsxs)(`div`,{className:`lo-card`,children:[(0,G.jsx)(`div`,{className:`lo-card-hdr`,children:(0,G.jsx)(`div`,{className:`lo-card-title`,children:`📡 On the Radar`})}),(0,G.jsxs)(`div`,{className:`lo-radar-nav`,children:[(0,G.jsx)(`button`,{className:`lo-nav-btn`,onClick:()=>r(e=>e-1),children:`‹ Prec`}),(0,G.jsxs)(`div`,{className:`lo-radar-date`,children:[(0,G.jsx)(`div`,{className:`lo-radar-label ${c?`lo-today`:``}`,children:l}),(0,G.jsx)(`div`,{className:`lo-radar-iso`,children:a.toLocaleDateString(`it-IT`,{day:`2-digit`,month:`long`,year:`numeric`})})]}),(0,G.jsx)(`button`,{className:`lo-nav-btn`,onClick:()=>r(e=>e+1),children:`Succ ›`})]}),(0,G.jsx)(`div`,{className:`lo-radar-body`,children:u.length===0?(0,G.jsxs)(`div`,{className:`lo-radar-empty`,children:[(0,G.jsx)(`div`,{style:{fontSize:32,marginBottom:8},children:`📭`}),(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink4)`,marginBottom:14},children:`Nessun post per questa data.`}),(0,G.jsx)(`button`,{className:`lo-create-btn`,onClick:t,children:`+ Crea post`})]}):u.map(e=>{let t=o(e.stato),n=e.immagineBase64||e.immagineUrl||``,r=(e.piattaforme||[]).map(e=>g.find(t=>t.id===e)).filter(Boolean);return(0,G.jsxs)(`div`,{className:`lo-radar-post`,children:[(0,G.jsx)(`div`,{className:`lo-radar-thumb`,children:n?(0,G.jsx)(`img`,{src:n,alt:``,onError:e=>e.target.style.display=`none`}):(0,G.jsx)(`span`,{style:{fontSize:18},children:f[e.tipo]||`📄`})}),(0,G.jsxs)(`div`,{className:`lo-radar-info`,children:[(0,G.jsx)(`div`,{className:`lo-radar-title`,children:e.titolo}),(0,G.jsxs)(`div`,{className:`lo-radar-meta`,children:[r.map(e=>(0,G.jsx)(`span`,{style:{color:e.color,fontSize:10,fontWeight:700,marginRight:4},children:e.label},e.id)),(0,G.jsxs)(`span`,{className:`pgc-stato`,style:{background:t.bg,color:t.tx},children:[t.icon,` `,t.label.replace(/[✅🚀🕐👁️✏️❌]/g,``).trim()]})]})]})]},e.id)})})]})}function Je({feedItems:e,onEdit:n}){let r=We(new Date),i=e.filter(e=>e.data>=r&&!l(e)).sort((e,t)=>e.data.localeCompare(t.data)).slice(0,6),a=e.filter(e=>m(e,t.revisione));return(0,G.jsxs)(`div`,{className:`lo-card`,children:[(0,G.jsx)(`div`,{className:`lo-card-hdr`,children:(0,G.jsx)(`div`,{className:`lo-card-title`,children:`⚡ Prossime scadenze`})}),a.length>0&&(0,G.jsxs)(`div`,{className:`lo-action-alert`,children:[(0,G.jsx)(`span`,{className:`lo-alert-dot`,style:{background:`#F59E0B`}}),(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`strong`,{children:a.length}),` post in attesa di approvazione`]})]}),i.length===0?(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink5)`,padding:`12px 0`,fontStyle:`italic`},children:`Nessun post pianificato nei prossimi giorni.`}):i.map(e=>{let t=o(e.stato),r=Math.ceil((new Date(e.data)-new Date)/864e5);return(0,G.jsxs)(`div`,{className:`lo-upcoming-row`,onClick:()=>n(e),children:[(0,G.jsxs)(`div`,{className:`lo-upcoming-left`,children:[(0,G.jsx)(`span`,{className:`lo-upcoming-dot`,style:{background:t.dot||`#CBD5E1`}}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`lo-upcoming-title`,children:e.titolo}),(0,G.jsxs)(`div`,{className:`lo-upcoming-sub`,children:[e.data,` · `,(e.piattaforme||[]).join(`, `)]})]})]}),(0,G.jsx)(`span`,{className:`lo-upcoming-days`,style:{color:r<=2?`#EF4444`:r<=5?`#F59E0B`:`var(--ink4)`},children:r===0?`oggi`:r===1?`domani`:`${r}g`})]},e.id)})]})}function Ye({project:e,onNavigate:n,onAddPost:r,onEditPost:i}){let a=p(e),o=a.filter(e=>l(e)).length,s=new Date().toISOString().slice(0,7),c=a.filter(e=>l(e)&&e.data?.startsWith(s)).length;return(0,G.jsxs)(`div`,{className:`lo-home`,children:[(0,G.jsx)(`div`,{className:`lo-stats-strip`,children:[{label:`Post totali`,value:a.length,icon:`📋`},{label:`Pubblicati`,value:o,icon:`🚀`},{label:`Questo mese`,value:c,icon:`📅`},{label:`In revisione`,value:a.filter(e=>m(e,t.revisione)).length,icon:`👁️`},{label:`Da pianificare`,value:a.filter(e=>!e.data&&!l(e)).length,icon:`⚠️`}].map((e,t)=>(0,G.jsxs)(`div`,{className:`lo-stat-card`,children:[(0,G.jsx)(`div`,{className:`lo-stat-icon`,children:e.icon}),(0,G.jsx)(`div`,{className:`lo-stat-val`,children:e.value}),(0,G.jsx)(`div`,{className:`lo-stat-label`,children:e.label})]},t))}),(0,G.jsx)(`div`,{style:{display:`flex`,gap:8,margin:`10px 0`,flexWrap:`wrap`},children:[{icon:`📋`,label:`Kanban Board`,sub:`Pipeline contenuti`,view:`kanban`,color:`#7C3AED`},{icon:`📤`,label:`Publishing Hub`,sub:`Caption AI + pubblica`,view:`publishing`,color:`#006EFF`},{icon:`📅`,label:`Calendario`,sub:`Vista mensile`,view:`contenuti`,color:`#00C853`},{icon:`💡`,label:`Idee Board`,sub:`Brainstorming`,view:`idee`,color:`#FF6B00`}].map(e=>(0,G.jsxs)(`button`,{onClick:()=>n(e.view),style:{flex:1,minWidth:130,display:`flex`,alignItems:`center`,gap:9,padding:`9px 12px`,background:`var(--w)`,border:`1px solid var(--border)`,borderRadius:8,cursor:`pointer`,textAlign:`left`,transition:`.12s`},onMouseEnter:t=>{t.currentTarget.style.borderColor=e.color,t.currentTarget.style.background=e.color+`0D`},onMouseLeave:e=>{e.currentTarget.style.borderColor=`var(--border)`,e.currentTarget.style.background=`var(--w)`},children:[(0,G.jsx)(`span`,{style:{fontSize:18,flexShrink:0},children:e.icon}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontSize:11,fontWeight:700,color:`var(--ink)`},children:e.label}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink3)`},children:e.sub})]})]},e.view))}),(0,G.jsxs)(`div`,{className:`lo-home-grid`,children:[(0,G.jsx)(Ke,{feedItems:a,onFilter:e=>{n(`grid`,e)}}),(0,G.jsx)(qe,{feedItems:a,onAddPost:r}),(0,G.jsx)(Je,{feedItems:a,onEdit:i})]})]})}var Xe=[`#006EFF`,`#7C3AED`,`#00C853`,`#FF6B00`,`#C800FF`,`#0284C7`,`#D97706`,`#059669`,`#E4405F`,`#F97316`],Ze={instagram:`📸`,facebook:`📘`,tiktok:`🎵`,linkedin:`💼`,youtube:`▶️`,google:`🔍`,email:`📧`,blog:`📝`,altro:`🔗`},Qe={bozza:`Bozza`,revisione:`In revisione`,approvato:`Approvato`,schedulato:`Schedulato`,pubblicato:`Pubblicato`,"non-approvato":`Non approvato`},$e={bozza:`#9CA3AF`,revisione:`#F59E0B`,approvato:`#3B82F6`,schedulato:`#8B5CF6`,pubblicato:`#10B981`,"non-approvato":`#EF4444`};function et(e,t){return new Date(e,t+1,0).getDate()}function tt(e,t){return(new Date(e,t,1).getDay()+6)%7}function nt(e){return String(e).padStart(2,`0`)}function rt(e,t,n){return`${e}-${nt(t+1)}-${nt(n)}`}function it(){let e=new Date;return rt(e.getFullYear(),e.getMonth(),e.getDate())}var at=[`Lun`,`Mar`,`Mer`,`Gio`,`Ven`,`Sab`,`Dom`],ot=[`Gennaio`,`Febbraio`,`Marzo`,`Aprile`,`Maggio`,`Giugno`,`Luglio`,`Agosto`,`Settembre`,`Ottobre`,`Novembre`,`Dicembre`],st=`nms-gcal:saved-views`;async function ct(){try{let e=await window.storage?.get(st);if(e?.value)return JSON.parse(e.value)}catch{}try{let e=window.localStorage?.getItem(st);return e?JSON.parse(e):[]}catch{}return[]}async function lt(e){let t=JSON.stringify(e);try{await window.storage?.set(st,t)}catch{}try{window.localStorage?.setItem(st,t)}catch{}}function ut({projects:e=[],clients:t=[],onGoToProject:n,onUpdateProject:r}){let i=new Date,[a,s]=(0,U.useState)(i.getFullYear()),[c,l]=(0,U.useState)(i.getMonth()),[u,d]=(0,U.useState)(`month`),[f,m]=(0,U.useState)(`tutti`),[h,g]=(0,U.useState)(`tutti`),[_,v]=(0,U.useState)(`tutti`),[y,b]=(0,U.useState)(`tutti`),[x,S]=(0,U.useState)(null),[C,w]=(0,U.useState)({x:0,y:0}),[T,E]=(0,U.useState)([]),[D,O]=(0,U.useState)(!1),[k,A]=(0,U.useState)(``),[j,ee]=(0,U.useState)(`data`),[M,N]=(0,U.useState)(!0),[P,F]=(0,U.useState)(null),[I,L]=(0,U.useState)(null);(0,U.useEffect)(()=>{ct().then(e=>E(e||[]))},[]);let R=(0,U.useMemo)(()=>{let e={};return t.forEach((t,n)=>{e[t.id]=Xe[n%Xe.length]}),e},[t]),z=(0,U.useMemo)(()=>{let n=[];return e.forEach(e=>{let r=t.find(t=>t.id===e.clientId),i=R[e.clientId]||`#9CA3AF`;(e.ed?.campagne||[]).forEach(t=>{!t.dataInizio&&!t.dataFine||n.push({...t,_projId:e.id,_projName:e.name,_clientName:r?.name||`—`,_color:t.colore||i})})}),n},[e,t,R]),V=(0,U.useMemo)(()=>{let n=[];return e.forEach(e=>{let r=t.find(t=>t.id===e.clientId),i=R[e.clientId]||`#9CA3AF`;p(e).forEach(t=>{n.push({...t,_projId:e.id,_projName:e.name,_clientId:e.clientId,_clientName:r?.name||`—`,_color:i})})}),n},[e,t,R]),te=(0,U.useMemo)(()=>[...new Set(V.map(e=>e._clientId))],[V]),ne=(0,U.useMemo)(()=>[...new Set(V.flatMap(e=>e.piattaforme||[]))],[V]),re=(0,U.useMemo)(()=>[...new Set(V.map(e=>e.pilastro).filter(Boolean))],[V]),H=(0,U.useMemo)(()=>V.filter(e=>!(f!==`tutti`&&e._clientId!==f||h!==`tutti`&&!(e.piattaforme||[]).includes(h)||_!==`tutti`&&e.pilastro!==_||y!==`tutti`&&e.stato!==y)),[V,f,h,_,y]),ie=(0,U.useMemo)(()=>{let e={},t=`${a}-${nt(c+1)}-`;return H.forEach(n=>{let r=n.data||n.dueDate||n.dateISO||``;r.startsWith(t)&&(e[r]||(e[r]=[]),e[r].push(n))}),e},[H,a,c]),ae=(0,U.useMemo)(()=>{let e=`${a}-${nt(c+1)}-`;return H.filter(t=>(t.data||t.dueDate||t.dateISO||``).startsWith(e)).sort((e,t)=>{let n=e.data||e.dueDate||e.dateISO||``,r=t.data||t.dueDate||t.dateISO||``;return n.localeCompare(r)})},[H,a,c]),oe=(0,U.useCallback)(()=>{c===0?(l(11),s(e=>e-1)):l(e=>e-1)},[c]),se=(0,U.useCallback)(()=>{c===11?(l(0),s(e=>e+1)):l(e=>e+1)},[c]),W=(0,U.useCallback)(()=>{let e=new Date;s(e.getFullYear()),l(e.getMonth())},[]),ce=et(a,c),le=tt(a,c),ue=it(),de=H.filter(e=>(e.data||e.dueDate||e.dateISO||``).startsWith(`${a}-${nt(c+1)}-`)).length,fe=V.length,pe=H.length;function me(t,n){if(!(!t||!n||!r))for(let i of e){let e=(i.ed?.feedItems||[]).find(e=>e.id===t),a=(i.ed?.contentItems||[]).find(e=>e.id===t);if(e||a){r({...i,ed:{...i.ed,feedItems:(i.ed?.feedItems||[]).map(e=>e.id===t?{...e,data:n}:e),contentItems:(i.ed?.contentItems||[]).map(e=>e.id===t?{...e,data:n,dueDate:n}:e)}});break}}}let he={filterClient:f,filterChannel:h,filterPillar:_,filterStatus:y,view:u},ge=(0,U.useCallback)(async e=>{if(!e.trim())return;let t={id:Math.random().toString(36).slice(2),name:e.trim(),...he,createdAt:Date.now()},n=[...T.filter(t=>t.name!==e.trim()),t];E(n),await lt(n),O(!1),A(``)},[he,T]),_e=(0,U.useCallback)(e=>{m(e.filterClient||`tutti`),g(e.filterChannel||`tutti`),v(e.filterPillar||`tutti`),b(e.filterStatus||`tutti`),e.view&&d(e.view)},[]),ve=(0,U.useCallback)(async e=>{let t=T.filter(t=>t.id!==e);E(t),await lt(t)},[T]),ye=(0,U.useMemo)(()=>[...H].sort((e,t)=>{let n,r;j===`data`?(n=e.data||e.dueDate||e.dateISO||``,r=t.data||t.dueDate||t.dateISO||``):j===`cliente`?(n=e._clientName||``,r=t._clientName||``):j===`stato`?(n=e.stato||``,r=t.stato||``):j===`pilastro`?(n=e.pilastro||``,r=t.pilastro||``):j===`progetto`?(n=e._projName||``,r=t._projName||``):(n=e.titolo||e.title||``,r=t.titolo||t.title||``);let i=n.localeCompare(r,`it`);return M?i:-i}),[H,j,M]);function be(e){j===e?N(e=>!e):(ee(e),N(!0))}function xe({col:e,label:t}){let n=j===e;return(0,G.jsxs)(`th`,{className:`gcal-th ${n?`gcal-th-act`:``}`,onClick:()=>be(e),children:[t,` `,n?M?`↑`:`↓`:``]})}return(0,G.jsxs)(`div`,{className:`gcal-shell`,children:[(0,G.jsxs)(`div`,{className:`gcal-topbar`,children:[(0,G.jsxs)(`div`,{className:`gcal-topbar-left`,children:[(0,G.jsxs)(`div`,{className:`gcal-month-nav`,children:[(0,G.jsx)(`button`,{className:`gcal-nav-btn`,onClick:oe,"aria-label":`Mese precedente`,children:`‹`}),(0,G.jsxs)(`div`,{className:`gcal-month-label`,children:[ot[c],` `,a]}),(0,G.jsx)(`button`,{className:`gcal-nav-btn`,onClick:se,"aria-label":`Mese successivo`,children:`›`})]}),(0,G.jsx)(`button`,{className:`gcal-today-btn`,onClick:W,children:`Oggi`})]}),(0,G.jsxs)(`div`,{className:`gcal-stats`,children:[(0,G.jsxs)(`span`,{className:`gcal-stat-pill`,children:[de,` post questo mese`]}),fe!==pe&&(0,G.jsxs)(`span`,{className:`gcal-stat-pill gcal-stat-filtered`,children:[pe,` visibili (filtro attivo)`]})]}),(0,G.jsxs)(`div`,{className:`gcal-topbar-right`,children:[(0,G.jsx)(`button`,{className:`gcal-view-btn ${u===`month`?`active`:``}`,onClick:()=>d(`month`),children:`☰ Mese`}),(0,G.jsx)(`button`,{className:`gcal-view-btn ${u===`list`?`active`:``}`,onClick:()=>d(`list`),children:`≡ Lista`}),(0,G.jsx)(`button`,{className:`gcal-view-btn ${u===`table`?`active`:``}`,onClick:()=>d(`table`),children:`⊞ Tabella`})]})]}),(0,G.jsxs)(`div`,{className:`gcal-filters`,children:[(0,G.jsxs)(`select`,{className:`gcal-select`,value:f,onChange:e=>m(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti i clienti`}),te.map(e=>(0,G.jsx)(`option`,{value:e,children:t.find(t=>t.id===e)?.name||e},e))]}),(0,G.jsxs)(`select`,{className:`gcal-select`,value:h,onChange:e=>g(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti i canali`}),ne.map(e=>(0,G.jsx)(`option`,{value:e,children:(Ze[e]||``)+` `+e},e))]}),(0,G.jsxs)(`select`,{className:`gcal-select`,value:_,onChange:e=>v(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti i pilastri`}),re.map(e=>(0,G.jsx)(`option`,{value:e,children:e},e))]}),(0,G.jsxs)(`select`,{className:`gcal-select`,value:y,onChange:e=>b(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti gli stati`}),Object.entries(Qe).map(([e,t])=>(0,G.jsx)(`option`,{value:e,children:t},e))]}),(f!==`tutti`||h!==`tutti`||_!==`tutti`||y!==`tutti`)&&(0,G.jsx)(`button`,{className:`gcal-clear-btn`,onClick:()=>{m(`tutti`),g(`tutti`),v(`tutti`),b(`tutti`)},children:`✕ Reset filtri`})]}),(0,G.jsxs)(`div`,{className:`gcal-saved-bar`,children:[(0,G.jsx)(`span`,{className:`gcal-saved-lbl`,children:`Viste:`}),T.map(e=>(0,G.jsxs)(`div`,{className:`gcal-saved-pill`,children:[(0,G.jsx)(`button`,{className:`gcal-saved-apply`,onClick:()=>_e(e),title:`Applica: ${e.name}`,children:e.name}),(0,G.jsx)(`button`,{className:`gcal-saved-del`,onClick:()=>ve(e.id),title:`Elimina vista`,children:`×`})]},e.id)),(0,G.jsx)(`button`,{className:`gcal-save-btn`,onClick:()=>O(!0),title:`Salva filtri correnti come vista`,children:`+ Salva vista`})]}),D&&(0,G.jsx)(`div`,{className:`gcal-save-modal-wrap`,onClick:()=>O(!1),children:(0,G.jsxs)(`div`,{className:`gcal-save-modal`,onClick:e=>e.stopPropagation(),children:[(0,G.jsx)(`div`,{className:`gcal-save-modal-title`,children:`Salva vista corrente`}),(0,G.jsxs)(`div`,{className:`gcal-save-modal-sub`,children:[`Filtri: `,[f!==`tutti`&&f,h!==`tutti`&&h,_!==`tutti`&&_,y!==`tutti`&&y].filter(Boolean).join(` · `)||`Nessun filtro attivo`]}),(0,G.jsx)(`input`,{className:`gcal-save-input`,value:k,onChange:e=>A(e.target.value),placeholder:`Nome vista… es. Kosmetikal Instagram`,autoFocus:!0,onKeyDown:e=>{e.key===`Enter`&&ge(k),e.key===`Escape`&&O(!1)}}),(0,G.jsxs)(`div`,{className:`gcal-save-modal-actions`,children:[(0,G.jsx)(`button`,{className:`gcal-save-cancel`,onClick:()=>O(!1),children:`Annulla`}),(0,G.jsx)(`button`,{className:`gcal-save-confirm`,onClick:()=>ge(k),disabled:!k.trim(),children:`💾 Salva`})]})]})}),t.length>0&&(0,G.jsx)(`div`,{className:`gcal-legend`,children:t.map(e=>(0,G.jsxs)(`button`,{className:`gcal-legend-pill ${f===e.id?`gcal-legend-active`:``}`,style:{"--leg-color":R[e.id]},onClick:()=>m(f===e.id?`tutti`:e.id),children:[(0,G.jsx)(`span`,{className:`gcal-legend-dot`}),e.name]},e.id))}),u===`month`&&(0,G.jsxs)(`div`,{className:`gcal-body`,children:[z.filter(e=>{`${a}${nt(c+1)}`;let t=!e.dataInizio||e.dataInizio<=`${a}-${nt(c+1)}-31`,n=!e.dataFine||e.dataFine>=`${a}-${nt(c+1)}-01`;return t&&n}).map(e=>(0,G.jsxs)(`div`,{className:`gcal-camp-band`,style:{borderColor:e._color,background:e._color+`0E`},children:[(0,G.jsx)(`span`,{className:`gcal-camp-dot`,style:{background:e._color}}),(0,G.jsx)(`span`,{className:`gcal-camp-name`,children:e.nome}),e.dataInizio&&e.dataFine&&(0,G.jsxs)(`span`,{className:`gcal-camp-dates`,children:[e.dataInizio.slice(5),` → `,e.dataFine.slice(5)]}),e.budgetADV&&(0,G.jsxs)(`span`,{className:`gcal-camp-budget`,children:[`ADV €`,e.budgetADV]}),(0,G.jsx)(`span`,{className:`gcal-camp-proj`,children:e._clientName})]},e.id)),(0,G.jsx)(`div`,{className:`gcal-grid gcal-grid-hdr`,children:at.map(e=>(0,G.jsx)(`div`,{className:`gcal-cell-hdr`,children:e},e))}),(0,G.jsxs)(`div`,{className:`gcal-grid gcal-grid-days`,children:[Array.from({length:le}).map((e,t)=>(0,G.jsx)(`div`,{className:`gcal-cell gcal-cell-empty`},`empty-${t}`)),Array.from({length:ce}).map((e,t)=>{let i=t+1,s=rt(a,c,i),l=ie[s]||[],u=s===ue,d=l.slice(0,3),f=l.length-3;return(0,G.jsxs)(`div`,{className:`gcal-cell ${u?`gcal-cell-today`:``} ${I===s&&P?`gcal-cell-dragover`:``}`,onDragOver:e=>{e.preventDefault(),L(s)},onDragLeave:()=>L(null),onDrop:e=>{e.preventDefault(),P&&s!==(V.find(e=>e.id===P)?.data||``)&&me(P,s),F(null),L(null)},children:[(0,G.jsx)(`div`,{className:`gcal-day-num`,children:i}),d.map(e=>{let t=(e.piattaforme||[]).slice(0,2);return o(e.stato),(0,G.jsxs)(`div`,{className:`gcal-post-chip ${P===e.id?`gcal-chip-dragging`:``}`,draggable:!!r,style:{borderLeft:`3px solid ${e._color}`,background:e._color+`14`,cursor:r?`grab`:`pointer`,opacity:P===e.id?.45:1},onDragStart:t=>{F(e.id),S(null),t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,e.id)},onDragEnd:()=>{F(null),L(null)},onMouseEnter:t=>{if(P)return;S(e);let n=t.currentTarget.getBoundingClientRect(),r=t.currentTarget.closest(`.gcal-shell`).getBoundingClientRect();w({x:n.left-r.left,y:n.bottom-r.top+4})},onMouseLeave:()=>S(null),onClick:()=>!P&&n?.(e._projId),children:[(0,G.jsx)(`span`,{className:`gcal-chip-dot`,style:{background:$e[e.stato]||`#9CA3AF`}}),(0,G.jsx)(`span`,{className:`gcal-chip-plat`,children:t.map(e=>Ze[e]||``).join(``)}),(0,G.jsx)(`span`,{className:`gcal-chip-title`,children:e.titolo||e.title||`—`})]},e.id)}),f>0&&(0,G.jsxs)(`div`,{className:`gcal-overflow-badge`,children:[`+`,f,` altri`]})]},s)})]})]}),u===`table`&&(0,G.jsxs)(`div`,{className:`gcal-list-wrap`,children:[(0,G.jsxs)(`div`,{className:`gcal-table-toolbar`,children:[(0,G.jsxs)(`span`,{className:`gcal-table-count`,children:[ye.length,` post · tutti i mesi`]}),(0,G.jsx)(`span`,{className:`gcal-table-hint`,children:`Clic sull'intestazione per ordinare`})]}),ye.length===0?(0,G.jsxs)(`div`,{className:`gcal-empty`,children:[(0,G.jsx)(`div`,{className:`gcal-empty-icon`,children:`📭`}),(0,G.jsx)(`div`,{children:`Nessun post con i filtri selezionati.`})]}):(0,G.jsxs)(`table`,{className:`gcal-table`,children:[(0,G.jsx)(`thead`,{children:(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(xe,{col:`data`,label:`Data`}),(0,G.jsx)(xe,{col:`titolo`,label:`Titolo`}),(0,G.jsx)(xe,{col:`cliente`,label:`Cliente`}),(0,G.jsx)(xe,{col:`progetto`,label:`Progetto`}),(0,G.jsx)(`th`,{children:`Canali`}),(0,G.jsx)(xe,{col:`pilastro`,label:`Pilastro`}),(0,G.jsx)(xe,{col:`stato`,label:`Stato`}),(0,G.jsx)(`th`,{})]})}),(0,G.jsx)(`tbody`,{children:ye.map(e=>{let t=e.data||e.dueDate||e.dateISO||`—`,r=o(e.stato)||{},i=(e.piattaforme||[]).slice(0,3);return(0,G.jsxs)(`tr`,{className:`gcal-table-row`,onClick:()=>n?.(e._projId),children:[(0,G.jsx)(`td`,{className:`gcal-td-date`,children:t.length>=7?t.slice(5):t}),(0,G.jsx)(`td`,{className:`gcal-td-title`,children:(0,G.jsxs)(`div`,{className:`gcal-title-wrap`,children:[(0,G.jsx)(`span`,{className:`gcal-client-bar`,style:{background:e._color}}),(0,G.jsx)(`span`,{children:e.titolo||e.title||`—`})]})}),(0,G.jsx)(`td`,{className:`gcal-td-client`,children:e._clientName}),(0,G.jsx)(`td`,{className:`gcal-td-proj`,children:e._projName}),(0,G.jsx)(`td`,{className:`gcal-td-plat`,children:i.map(e=>(0,G.jsx)(`span`,{className:`gcal-plat-badge`,children:Ze[e]||e},e))}),(0,G.jsx)(`td`,{className:`gcal-td-pillar`,children:e.pilastro&&(0,G.jsx)(`span`,{style:{fontSize:10,fontWeight:600,color:B(e.pilastro)},children:e.pilastro})}),(0,G.jsx)(`td`,{className:`gcal-td-stato`,children:(0,G.jsx)(`span`,{className:`gcal-stato-pill`,style:{background:r.bg||`#F3F4F6`,color:r.tx||`#6B7280`},children:Qe[e.stato]||e.stato||`—`})}),(0,G.jsx)(`td`,{className:`gcal-td-action`,children:(0,G.jsx)(`button`,{className:`gcal-goto-btn`,onClick:t=>{t.stopPropagation(),n?.(e._projId)},children:`→ Progetto`})})]},e.id)})})]})]}),u===`list`&&(0,G.jsx)(`div`,{className:`gcal-list-wrap`,children:ae.length===0?(0,G.jsxs)(`div`,{className:`gcal-empty`,children:[(0,G.jsx)(`div`,{className:`gcal-empty-icon`,children:`📭`}),(0,G.jsx)(`div`,{children:`Nessun post per questo mese con i filtri selezionati.`})]}):(0,G.jsxs)(`table`,{className:`gcal-table`,children:[(0,G.jsx)(`thead`,{children:(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`th`,{children:`Data`}),(0,G.jsx)(`th`,{children:`Titolo`}),(0,G.jsx)(`th`,{children:`Cliente`}),(0,G.jsx)(`th`,{children:`Progetto`}),(0,G.jsx)(`th`,{children:`Canali`}),(0,G.jsx)(`th`,{children:`Pilastro`}),(0,G.jsx)(`th`,{children:`Stato`}),(0,G.jsx)(`th`,{})]})}),(0,G.jsx)(`tbody`,{children:ae.map(e=>{let t=e.data||e.dueDate||e.dateISO||`—`,r=o(e.stato)||{},i=(e.piattaforme||[]).slice(0,3);return(0,G.jsxs)(`tr`,{className:`gcal-table-row`,onClick:()=>n?.(e._projId),children:[(0,G.jsx)(`td`,{className:`gcal-td-date`,children:t.slice(5)}),(0,G.jsx)(`td`,{className:`gcal-td-title`,children:(0,G.jsxs)(`div`,{className:`gcal-title-wrap`,children:[(0,G.jsx)(`span`,{className:`gcal-client-bar`,style:{background:e._color}}),(0,G.jsx)(`span`,{children:e.titolo||e.title||`—`})]})}),(0,G.jsx)(`td`,{className:`gcal-td-client`,children:e._clientName}),(0,G.jsx)(`td`,{className:`gcal-td-proj`,children:e._projName}),(0,G.jsx)(`td`,{className:`gcal-td-plat`,children:i.map(e=>(0,G.jsx)(`span`,{className:`gcal-plat-badge`,children:Ze[e]||e},e))}),(0,G.jsx)(`td`,{className:`gcal-td-pillar`,children:e.pilastro&&(0,G.jsx)(`span`,{style:{fontSize:10,fontWeight:600,color:B(e.pilastro)},children:e.pilastro})}),(0,G.jsx)(`td`,{className:`gcal-td-stato`,children:(0,G.jsx)(`span`,{className:`gcal-stato-pill`,style:{background:r.bg||`#F3F4F6`,color:r.tx||`#6B7280`},children:Qe[e.stato]||e.stato||`—`})}),(0,G.jsx)(`td`,{className:`gcal-td-action`,children:(0,G.jsx)(`button`,{className:`gcal-goto-btn`,onClick:t=>{t.stopPropagation(),n?.(e._projId)},children:`→ Progetto`})})]},e.id)})})]})}),x&&(0,G.jsxs)(`div`,{className:`gcal-tooltip`,style:{left:C.x,top:C.y},children:[(0,G.jsxs)(`div`,{className:`gcal-tt-header`,style:{borderLeft:`3px solid ${x._color}`},children:[(0,G.jsx)(`div`,{className:`gcal-tt-title`,children:x.titolo||x.title}),(0,G.jsxs)(`div`,{className:`gcal-tt-client`,children:[x._clientName,` · `,x._projName]})]}),(0,G.jsxs)(`div`,{className:`gcal-tt-row`,children:[(0,G.jsx)(`span`,{className:`gcal-tt-lbl`,children:`Data`}),(0,G.jsx)(`span`,{children:x.data||x.dueDate||`—`})]}),(0,G.jsxs)(`div`,{className:`gcal-tt-row`,children:[(0,G.jsx)(`span`,{className:`gcal-tt-lbl`,children:`Canali`}),(0,G.jsx)(`span`,{children:(x.piattaforme||[]).map(e=>Ze[e]||e).join(` `)||`—`})]}),(0,G.jsxs)(`div`,{className:`gcal-tt-row`,children:[(0,G.jsx)(`span`,{className:`gcal-tt-lbl`,children:`Tipo`}),(0,G.jsx)(`span`,{children:x.tipo||x.format||`—`})]}),(0,G.jsxs)(`div`,{className:`gcal-tt-row`,children:[(0,G.jsx)(`span`,{className:`gcal-tt-lbl`,children:`Stato`}),(0,G.jsx)(`span`,{style:{color:$e[x.stato]},children:Qe[x.stato]||x.stato})]}),x.pilastro&&(0,G.jsxs)(`div`,{className:`gcal-tt-row`,children:[(0,G.jsx)(`span`,{className:`gcal-tt-lbl`,children:`Pilastro`}),(0,G.jsx)(`span`,{style:{color:B(x.pilastro),fontWeight:600},children:x.pilastro})]}),(0,G.jsx)(`div`,{className:`gcal-tt-footer`,children:`Clicca per aprire il progetto`})]})]})}t.revisione,t.nonApprovato;var dt={instagram:`📸`,facebook:`📘`,tiktok:`🎵`,linkedin:`💼`,youtube:`▶️`,email:`📧`,blog:`📝`,altro:`🔗`},ft=[`#006EFF`,`#7C3AED`,`#00C853`,`#FF6B00`,`#C800FF`,`#0284C7`,`#D97706`,`#059669`,`#E4405F`,`#F97316`];function pt(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function mt({post:e,projName:n,clientColor:r,onApprove:i,onReject:a,onRequestChanges:s,onGoToProject:c}){let[l,u]=(0,U.useState)(!1),[d,f]=(0,U.useState)(``),[p,m]=(0,U.useState)(null),h=o(e.stato)||{},g=(e.piattaforme||[]).slice(0,3),_=e.data?Math.ceil((new Date(e.data+`T12:00:00`)-new Date)/864e5):null,v=_!==null&&_<0,y=_!==null&&_>=0&&_<=2;async function b(t){if(m(t),await new Promise(e=>setTimeout(e,200)),t===`approve`&&i(e.id),t===`reject`&&a(e.id),t===`feedback`){if(!d.trim())return m(null);s(e.id,d.trim()),u(!1),f(``)}m(null)}return(0,G.jsxs)(`div`,{className:`apr-row ${v?`apr-row-overdue`:``}`,children:[(0,G.jsxs)(`div`,{className:`apr-row-main`,children:[(0,G.jsx)(`div`,{className:`apr-client-bar`,style:{background:r}}),(0,G.jsxs)(`div`,{className:`apr-info`,onClick:()=>c?.(e._projId),style:{cursor:`pointer`},children:[(0,G.jsx)(`div`,{className:`apr-title`,children:e.titolo||e.title||`Post senza titolo`}),(0,G.jsxs)(`div`,{className:`apr-meta`,children:[(0,G.jsx)(`span`,{className:`apr-proj`,children:n}),e.pilastro&&(0,G.jsx)(`span`,{className:`apr-pillar`,style:{color:B(e.pilastro)},children:e.pilastro}),g.map(e=>(0,G.jsx)(`span`,{className:`apr-plat`,children:dt[e]||e},e)),e.tipo&&(0,G.jsx)(`span`,{className:`apr-tipo`,children:e.tipo})]})]}),(0,G.jsx)(`div`,{className:`apr-date ${v?`apr-date-over`:y?`apr-date-urgent`:``}`,children:e.data?(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`div`,{children:e.data.slice(5).replace(`-`,`/`)}),(0,G.jsx)(`div`,{className:`apr-date-sub`,children:v?`${Math.abs(_)}g fa`:_===0?`oggi`:_===1?`domani`:`tra ${_}g`})]}):(0,G.jsx)(`span`,{children:`—`})}),(0,G.jsx)(`div`,{className:`apr-stato-wrap`,children:(0,G.jsxs)(`span`,{className:`apr-stato-pill`,style:{background:h.bg,color:h.tx},children:[h.icon,` `,h.label]})}),(0,G.jsxs)(`div`,{className:`apr-actions`,children:[e.stato!==t.approvato&&(0,G.jsx)(`button`,{className:`apr-btn apr-btn-ok`,onClick:()=>b(`approve`),disabled:!!p,title:`Approva`,children:p===`approve`?`…`:`✅ Approva`}),(0,G.jsx)(`button`,{className:`apr-btn apr-btn-fb`,onClick:()=>u(e=>!e),disabled:!!p,title:`Richiedi modifiche`,children:`✏️ Note`}),(0,G.jsx)(`button`,{className:`apr-btn apr-btn-no`,onClick:()=>b(`reject`),disabled:!!p,title:`Non approvato`,children:p===`reject`?`…`:`✗`}),(0,G.jsx)(`button`,{className:`apr-btn apr-btn-go`,onClick:()=>c?.(e._projId),title:`Vai al progetto`,children:`→`})]})]}),l&&(0,G.jsxs)(`div`,{className:`apr-feedback-wrap`,children:[(0,G.jsx)(`div`,{className:`apr-feedback-label`,children:`Nota per il team:`}),(0,G.jsx)(`textarea`,{className:`apr-feedback-ta`,value:d,onChange:e=>f(e.target.value),placeholder:`Descrivi le modifiche richieste…`,rows:2,autoFocus:!0}),(0,G.jsxs)(`div`,{className:`apr-feedback-actions`,children:[(0,G.jsx)(`button`,{className:`apr-btn apr-btn-fb`,onClick:()=>{u(!1),f(``)},children:`Annulla`}),(0,G.jsx)(`button`,{className:`apr-btn apr-btn-ok`,onClick:()=>b(`feedback`),disabled:!d.trim(),children:p===`feedback`?`…`:`Invia nota`})]})]})]})}function ht({client:e,clientColor:t,posts:n,projMap:r,onApprove:i,onReject:a,onRequestChanges:o,onGoToProject:s}){let[c,l]=(0,U.useState)(!1);return(0,G.jsxs)(`div`,{className:`apr-group`,children:[(0,G.jsxs)(`div`,{className:`apr-group-hd`,onClick:()=>l(e=>!e),children:[(0,G.jsx)(`span`,{className:`apr-group-dot`,style:{background:t}}),(0,G.jsx)(`span`,{className:`apr-group-name`,children:e.name}),(0,G.jsxs)(`span`,{className:`apr-group-cnt`,children:[n.length,` in attesa`]}),(0,G.jsx)(`span`,{className:`apr-group-chev`,children:c?`▶`:`▼`})]}),!c&&n.map(e=>(0,G.jsx)(mt,{post:e,projName:r[e._projId]||`—`,clientColor:t,onApprove:i,onReject:a,onRequestChanges:o,onGoToProject:s},e.id))]})}function gt({projects:e=[],clients:n=[],onUpdateProject:r,onGoToProject:i}){let[a,o]=(0,U.useState)(`tutti`),[s,c]=(0,U.useState)(`pending`),[l,u]=(0,U.useState)(new Set),d=(0,U.useMemo)(()=>{let e={};return n.forEach((t,n)=>{e[t.id]=ft[n%ft.length]}),e},[n]),f=(0,U.useMemo)(()=>{let t={};return e.forEach(e=>{t[e.id]=e.name}),t},[e]),m=(0,U.useMemo)(()=>{let r=[];return e.forEach(e=>{let i=n.find(t=>t.id===e.clientId);p(e).forEach(n=>{let a=n.stato===t.revisione||n.stato===`semaforo`,o=n.stato===t.nonApprovato;!a&&!o||r.push({...n,_projId:e.id,_clientId:e.clientId,_clientName:i?.name||`—`,_isRevisione:a,_isNonApprovato:o})})}),r.sort((e,t)=>{let n=e.data||`9999`,r=t.data||`9999`;return n.localeCompare(r)})},[e,n]),h=(0,U.useMemo)(()=>m.filter(e=>!(a!==`tutti`&&e._clientId!==a||s===`pending`&&!e._isRevisione||s===`non-approvato`&&!e._isNonApprovato)),[m,a,s]),g=(0,U.useMemo)(()=>{let e={};return h.forEach(t=>{e[t._clientId]||(e[t._clientId]=[]),e[t._clientId].push(t)}),e},[h]);pt();let _=m.filter(e=>e._isRevisione).length,v=m.filter(e=>e._isNonApprovato).length,y=m.filter(e=>e._isRevisione&&e.data&&Math.ceil((new Date(e.data+`T12:00:00`)-new Date)/864e5)<=2).length,b=(0,U.useCallback)((t,n,i={})=>{let a=m.find(e=>e.id===t);if(!a)return;let o=e.find(e=>e.id===a._projId);if(!o)return;let s={...o,ed:{...o.ed,feedItems:(o.ed?.feedItems||[]).map(e=>e.id===t?{...e,stato:n,...i}:e),contentItems:(o.ed?.contentItems||[]).map(e=>e.id===t?{...e,stato:n,status:n,...i}:e)}};r?.(s)},[m,e,r]),x=(0,U.useCallback)(e=>{b(e,t.approvato,{approvedAt:Date.now()}),u(t=>new Set([...t,e]))},[b]),S=(0,U.useCallback)(e=>{b(e,t.nonApprovato)},[b]),C=(0,U.useCallback)((e,n)=>{b(e,t.bozza,{feedbackNote:n,feedbackAt:Date.now()})},[b]),w=n.filter(e=>g[e.id]?.length>0);return(0,G.jsxs)(`div`,{className:`apr-shell`,children:[(0,G.jsxs)(`div`,{className:`apr-topbar`,children:[(0,G.jsxs)(`div`,{className:`apr-topbar-left`,children:[(0,G.jsx)(`div`,{className:`apr-topbar-title`,children:`Approvazioni`}),(0,G.jsx)(`div`,{className:`apr-topbar-sub`,children:`Dashboard globale · tutti i clienti`})]}),(0,G.jsxs)(`div`,{className:`apr-stats-row`,children:[(0,G.jsxs)(`div`,{className:`apr-stat apr-stat-warn`,children:[(0,G.jsx)(`div`,{className:`apr-stat-val`,children:_}),(0,G.jsx)(`div`,{className:`apr-stat-lbl`,children:`In attesa`})]}),(0,G.jsxs)(`div`,{className:`apr-stat apr-stat-danger`,children:[(0,G.jsx)(`div`,{className:`apr-stat-val`,children:y}),(0,G.jsx)(`div`,{className:`apr-stat-lbl`,children:`Urgenti ≤2g`})]}),(0,G.jsxs)(`div`,{className:`apr-stat apr-stat-neutral`,children:[(0,G.jsx)(`div`,{className:`apr-stat-val`,children:v}),(0,G.jsx)(`div`,{className:`apr-stat-lbl`,children:`Non approvati`})]}),(0,G.jsxs)(`div`,{className:`apr-stat apr-stat-ok`,children:[(0,G.jsx)(`div`,{className:`apr-stat-val`,children:l.size}),(0,G.jsx)(`div`,{className:`apr-stat-lbl`,children:`Approvati ora`})]})]})]}),(0,G.jsxs)(`div`,{className:`apr-filters`,children:[(0,G.jsx)(`div`,{className:`apr-filter-tabs`,children:[[`pending`,`⏳ In attesa`],[`non-approvato`,`❌ Non approvati`],[`tutti`,`Tutti`]].map(([e,t])=>(0,G.jsxs)(`button`,{className:`apr-filter-tab ${s===e?`active`:``}`,onClick:()=>c(e),children:[t,e===`pending`&&_>0&&(0,G.jsx)(`span`,{className:`apr-filter-badge`,children:_}),e===`non-approvato`&&v>0&&(0,G.jsx)(`span`,{className:`apr-filter-badge apr-filter-badge-red`,children:v})]},e))}),(0,G.jsxs)(`select`,{className:`apr-select`,value:a,onChange:e=>o(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti i clienti`}),n.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,G.jsx)(`div`,{className:`apr-body`,children:h.length===0?(0,G.jsxs)(`div`,{className:`apr-empty`,children:[(0,G.jsx)(`div`,{className:`apr-empty-icon`,children:s===`pending`?`🎉`:`📭`}),(0,G.jsx)(`div`,{className:`apr-empty-title`,children:s===`pending`?`Nessun contenuto in attesa di approvazione`:`Nessun elemento`}),(0,G.jsx)(`div`,{className:`apr-empty-sub`,children:s===`pending`?`Il team ha completato tutte le revisioni. I contenuti sono pronti per la pubblicazione.`:`Nessun contenuto corrisponde ai filtri selezionati.`})]}):w.map(e=>g[e.id]?.length>0&&(0,G.jsx)(ht,{client:e,clientColor:d[e.id]||`#9CA3AF`,posts:g[e.id],projMap:f,onApprove:x,onReject:S,onRequestChanges:C,onGoToProject:i},e.id))})]})}var _t=[`Gennaio`,`Febbraio`,`Marzo`,`Aprile`,`Maggio`,`Giugno`,`Luglio`,`Agosto`,`Settembre`,`Ottobre`,`Novembre`,`Dicembre`];function vt(){let e=new Date;return`${_t[e.getMonth()]} ${e.getFullYear()}`}function yt(e,t){let n=p(e),r=n.filter(l),i=((e.ed||{}).perfLogs||[]).slice(-1)[0]||{},a=Object.entries(i).filter(([e,t])=>e!==`id`&&t).map(([e,t])=>`${e}: ${t}`).join(` · `),o={};n.forEach(e=>{let t=e.pilastro||`N/A`;o[t]=(o[t]||0)+1});let s=Object.entries(o).sort((e,t)=>t[1]-e[1]).map(([e,t])=>`${e}(${t})`).join(`, `);return`Sei un consulente marketing di Nassa Studio. Scrivi un'analisi mensile concisa e professionale per il cliente.

CLIENTE: ${e.interview?.nome||e.name}
MESE: ${t}
POST TOTALI: ${n.length} | PUBBLICATI: ${r.length}
PILASTRI: ${s}
KPI PRINCIPALI: ${a||`Non disponibili`}
CONTESTO BRAND: ${C(e.interview||{}).slice(0,400)}

Scrivi 3-4 paragrafi:
1. Sintesi delle performance del mese (cosa ha funzionato)
2. Un'area di miglioramento concreta (con dato se disponibile)
3. Una raccomandazione specifica per il mese prossimo
4. Prossimo passo operativo prioritario

Tono: professionale, diretto, orientato ai risultati. Zero aziendalese. Max 250 parole.`}function bt({project:e,client:t}){let[n,i]=(0,U.useState)(!1),[a,o]=(0,U.useState)(vt()),[s,c]=(0,U.useState)(!1),[u,d]=(0,U.useState)(``),[f,m]=(0,U.useState)(!1),h=(0,U.useCallback)(async()=>{c(!0);try{d(await r(yt(e,a),600))}catch{d(`Insight AI non disponibile. Aggiungi il tuo commento manualmente.`)}c(!1)},[e,a]),g=(0,U.useCallback)(()=>{m(!0);let n=He({project:e,client:t,month:a,aiInsight:u});Ne(`Report_${(t?.name||e.name).replace(/\s+/g,`_`)}_${a.replace(/\s+/g,`_`)}.html`,n,`text/html;charset=utf-8`),setTimeout(()=>m(!1),800)},[e,t,a,u]),_=p(e).filter(l).length,v=e.ed||{},y=[...v.feedItems||[],...v.contentItems||[]];return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`button`,{className:`wlr-trigger-btn`,onClick:()=>i(!0),title:`Genera report mensile white-label per il cliente`,children:`📊 Report Cliente`}),n&&(0,G.jsx)(`div`,{className:`wlr-overlay`,onClick:()=>i(!1),children:(0,G.jsxs)(`div`,{className:`wlr-modal`,onClick:e=>e.stopPropagation(),children:[(0,G.jsxs)(`div`,{className:`wlr-hd`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`wlr-title`,children:`📊 Report Mensile Cliente`}),(0,G.jsxs)(`div`,{className:`wlr-sub`,children:[`White-label · brandizzato per `,t?.name||e.name]})]}),(0,G.jsx)(`button`,{className:`wlr-close`,onClick:()=>i(!1),children:`✕`})]}),(0,G.jsxs)(`div`,{className:`wlr-body`,children:[(0,G.jsxs)(`div`,{className:`wlr-preview-hd`,style:{borderColor:t?.color||`#006EFF`},children:[(0,G.jsx)(`div`,{className:`wlr-preview-eyebrow`,style:{color:t?.color||`#006EFF`},children:`Report Mensile`}),(0,G.jsx)(`div`,{className:`wlr-preview-client`,children:t?.name||e.name}),(0,G.jsx)(`div`,{className:`wlr-preview-month`,children:a})]}),(0,G.jsxs)(`div`,{className:`wlr-field`,children:[(0,G.jsx)(`label`,{className:`wlr-label`,children:`Mese di riferimento`}),(0,G.jsx)(`input`,{className:`wlr-input`,value:a,onChange:e=>o(e.target.value),placeholder:`es. Giugno 2026`})]}),(0,G.jsx)(`div`,{className:`wlr-stats`,children:[[y.length,`Post totali`],[_,`Pubblicati`],[Object.keys([...y].reduce((e,t)=>((t.piattaforme||[]).forEach(t=>{e[t]=1}),e),{})).length,`Canali attivi`],[(e.ed?.perfLogs||[]).length,`Log performance`]].map(([e,t])=>(0,G.jsxs)(`div`,{className:`wlr-stat`,children:[(0,G.jsx)(`div`,{className:`wlr-stat-val`,children:e}),(0,G.jsx)(`div`,{className:`wlr-stat-lbl`,children:t})]},t))}),(0,G.jsxs)(`div`,{className:`wlr-field`,children:[(0,G.jsxs)(`div`,{className:`wlr-label-row`,children:[(0,G.jsx)(`label`,{className:`wlr-label`,children:`Analisi AI (opzionale)`}),(0,G.jsx)(`button`,{className:`wlr-ai-btn`,onClick:h,disabled:s,children:s?`⏳ Generando…`:`✦ Genera con AI`})]}),(0,G.jsx)(`textarea`,{className:`wlr-textarea`,value:u,onChange:e=>d(e.target.value),placeholder:`Scrivi manualmente o usa AI per generare un'analisi del mese…`,rows:4})]}),(0,G.jsx)(`div`,{className:`wlr-info`,children:`ℹ️ Il report verrà scaricato come file HTML apribile nel browser. Per ottenere un PDF: apri il file → Stampa → Salva come PDF.`})]}),(0,G.jsxs)(`div`,{className:`wlr-foot`,children:[(0,G.jsx)(`button`,{className:`wlr-cancel-btn`,onClick:()=>i(!1),children:`Annulla`}),(0,G.jsx)(`button`,{className:`wlr-download-btn`,onClick:g,disabled:f,style:{background:t?.color||`#006EFF`},children:f?`⏳ Generando…`:`⬇ Scarica Report HTML`})]})]})})]})}var xt=[`titolo`,`data`,`piattaforme`,`tipo`,`stato`,`pilastro`,`caption`,`hashtag`,`cta`].join(`,`)+`
Carousel: 5 ingredienti siciliani,2026-06-10,"instagram,facebook",carousel,bozza,Prodotto,Caption del post...,#KosmetikalSrl #CleanBeauty,Scopri nel link in bio
Reel: dietro le quinte produzione,2026-06-14,instagram,reel,bozza,Raw & Real,Video della produzione...,#RawAndReal,
Post LinkedIn: case study,2026-06-18,linkedin,post,bozza,Educazione,Contenuto LinkedIn...,#CaseStudy,Commenta la tua opinione`;function St(e){let t=[],n=``,r=!1;for(let i=0;i<e.length;i++){let a=e[i];if(a===`"`){r=!r;continue}if(a===`,`&&!r){t.push(n.trim()),n=``;continue}n+=a}return t.push(n.trim()),t}function Ct(e){if(!e)return``;let t=e.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;let n=t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);return n?`${n[3]}-${n[2].padStart(2,`0`)}-${n[1].padStart(2,`0`)}`:``}function wt(e){return e?e.split(/[,;|]/).map(e=>e.trim().toLowerCase()).filter(Boolean):[`instagram`]}function Tt(e){if(!e)return`post`;let t=e.trim().toLowerCase();return[`reel`,`carousel`,`story`,`video`,`post`,`carosello`].includes(t)?t===`carosello`?`carousel`:t:`post`}function Et(e){return e&&{bozza:`bozza`,draft:`bozza`,revisione:`revisione`,review:`revisione`,approvato:`approvato`,approved:`approvato`,pubblicato:`pubblicato`}[e.trim().toLowerCase()]||`bozza`}function Dt(e){let t=e.split(/\r?\n/).filter(e=>e.trim());if(t.length<2)return{rows:[],errors:[`File troppo corto — almeno intestazione + 1 riga.`]};let n=St(t[0]).map(e=>e.toLowerCase().replace(/\s+/g,`_`)),r=(e,...t)=>{for(let r of t){let t=n.findIndex(e=>e===r||e.startsWith(r.slice(0,5)));if(t>=0&&e[t])return e[t]}return``},i=[],a=[];for(let e=1;e<t.length;e++){if(!t[e].trim())continue;let n=St(t[e]),o=r(n,`titolo`,`title`,`nome`);if(!o){a.push(`Riga ${e+1}: titolo mancante — saltata.`);continue}i.push({id:M(),titolo:o,data:Ct(r(n,`data`,`date`)),piattaforme:wt(r(n,`piattaforme`,`canali`,`platform`,`channel`)),tipo:Tt(r(n,`tipo`,`type`,`format`)),stato:Et(r(n,`stato`,`status`)),pilastro:r(n,`pilastro`,`pillar`),caption:r(n,`caption`),hashtags:r(n,`hashtag`,`hashtags`),cta:r(n,`cta`),membersAssigned:[],comments:[],createdAt:Date.now(),immagineUrl:``,immagineBase64:``,videoUrl:``,captionB:``,abActive:!1,noteGrafico:``,noteVideo:``,linkAsset:``,contentFramework:``,targetPersona:``,isTrend:!1,trendAnchor:``})}return{rows:i,errors:a}}function Ot({project:e,onImport:t,onClose:n}){let[r,i]=(0,U.useState)(`upload`),[a,o]=(0,U.useState)(null),[s,c]=(0,U.useState)([]),[l,u]=(0,U.useState)(!1),[d,f]=(0,U.useState)(``),p=(0,U.useRef)(),m=(0,U.useCallback)(e=>{if(!e)return;f(e.name);let t=new FileReader;t.onload=e=>{let{rows:t,errors:n}=Dt(e.target.result);o(t),c(n),i(`preview`)},t.readAsText(e,`UTF-8`)},[]),h=(0,U.useCallback)(e=>{e.preventDefault(),u(!1);let t=e.dataTransfer.files?.[0];(t?.name?.endsWith(`.csv`)||t?.type===`text/csv`)&&m(t)},[m]);function g(){let e=new Blob([xt],{type:`text/csv;charset=utf-8`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`nms_bulk_template.csv`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}function _(){a?.length&&(t(a),i(`done`))}let v={instagram:`📸`,facebook:`📘`,linkedin:`💼`,tiktok:`🎵`,youtube:`▶️`,blog:`📝`},y={bozza:`var(--color-text-tertiary)`,revisione:`var(--color-text-warning)`,approvato:`var(--color-text-success)`};return(0,G.jsx)(`div`,{className:`bum-overlay`,onClick:n,children:(0,G.jsxs)(`div`,{className:`bum-modal`,onClick:e=>e.stopPropagation(),children:[(0,G.jsxs)(`div`,{className:`bum-hd`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`bum-title`,children:`📥 Importa da CSV`}),(0,G.jsxs)(`div`,{className:`bum-sub`,children:[r===`upload`&&`Carica un file CSV con i post da importare nel piano editoriale`,r===`preview`&&`${a?.length||0} post pronti · ${s.length} errori`,r===`done`&&`Importazione completata`]})]}),(0,G.jsx)(`button`,{className:`bum-close`,onClick:n,children:`✕`})]}),r===`upload`&&(0,G.jsxs)(`div`,{className:`bum-body`,children:[(0,G.jsxs)(`div`,{className:`bum-dropzone ${l?`bum-dropzone-over`:``}`,onDragOver:e=>{e.preventDefault(),u(!0)},onDragLeave:()=>u(!1),onDrop:h,onClick:()=>p.current?.click(),children:[(0,G.jsx)(`input`,{ref:p,type:`file`,accept:`.csv,text/csv`,style:{display:`none`},onChange:e=>m(e.target.files?.[0])}),(0,G.jsx)(`div`,{className:`bum-dz-icon`,children:`📄`}),(0,G.jsx)(`div`,{className:`bum-dz-title`,children:`Trascina un file CSV qui`}),(0,G.jsx)(`div`,{className:`bum-dz-sub`,children:`oppure clicca per scegliere`}),(0,G.jsx)(`button`,{className:`bum-btn-outline`,onClick:e=>{e.stopPropagation(),p.current?.click()},children:`Scegli file CSV`})]}),(0,G.jsxs)(`div`,{className:`bum-template-row`,children:[(0,G.jsxs)(`div`,{className:`bum-template-info`,children:[(0,G.jsx)(`div`,{className:`bum-template-title`,children:`Non hai un CSV?`}),(0,G.jsx)(`div`,{className:`bum-template-sub`,children:`Scarica il template con tutte le colonne e compilalo in Excel o Google Sheets.`})]}),(0,G.jsx)(`button`,{className:`bum-btn-outline`,onClick:g,children:`⬇ Scarica template`})]}),(0,G.jsxs)(`div`,{className:`bum-cols`,children:[(0,G.jsx)(`div`,{className:`bum-cols-title`,children:`Colonne supportate:`}),(0,G.jsx)(`div`,{className:`bum-cols-list`,children:[[`titolo *`,`Obbligatorio`],[`data`,`YYYY-MM-DD`],[`piattaforme`,`instagram,facebook`],[`tipo`,`post|reel|carousel`],[`stato`,`bozza|revisione`],[`pilastro`,`nome pilastro`],[`caption`,`testo del post`],[`hashtag`,`#tag #tag`],[`cta`,`testo CTA`]].map(([e,t])=>(0,G.jsxs)(`div`,{className:`bum-col-row`,children:[(0,G.jsx)(`code`,{className:`bum-col-name`,children:e}),(0,G.jsx)(`span`,{className:`bum-col-hint`,children:t})]},e))})]})]}),r===`preview`&&(0,G.jsxs)(`div`,{className:`bum-body bum-body-preview`,children:[s.length>0&&(0,G.jsx)(`div`,{className:`bum-errors`,children:s.map((e,t)=>(0,G.jsxs)(`div`,{className:`bum-error-row`,children:[`⚠️ `,e]},t))}),(0,G.jsx)(`div`,{className:`bum-preview-wrap`,children:(0,G.jsxs)(`table`,{className:`bum-table`,children:[(0,G.jsx)(`thead`,{children:(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`th`,{children:`#`}),(0,G.jsx)(`th`,{children:`Titolo`}),(0,G.jsx)(`th`,{children:`Data`}),(0,G.jsx)(`th`,{children:`Piattaforme`}),(0,G.jsx)(`th`,{children:`Tipo`}),(0,G.jsx)(`th`,{children:`Stato`}),(0,G.jsx)(`th`,{children:`Pilastro`})]})}),(0,G.jsx)(`tbody`,{children:(a||[]).map((e,t)=>(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`td`,{className:`bum-td-num`,children:t+1}),(0,G.jsx)(`td`,{className:`bum-td-title`,children:e.titolo}),(0,G.jsx)(`td`,{className:`bum-td-date`,children:e.data||`—`}),(0,G.jsx)(`td`,{className:`bum-td-plat`,children:e.piattaforme.slice(0,3).map(e=>(0,G.jsx)(`span`,{title:e,children:v[e]||e},e))}),(0,G.jsx)(`td`,{className:`bum-td-tipo`,children:e.tipo}),(0,G.jsx)(`td`,{className:`bum-td-stato`,style:{color:y[e.stato]||`var(--color-text-tertiary)`},children:e.stato}),(0,G.jsx)(`td`,{className:`bum-td-pillar`,children:e.pilastro||`—`})]},e.id))})]})}),(0,G.jsxs)(`div`,{className:`bum-preview-footer`,children:[(0,G.jsx)(`button`,{className:`bum-btn-ghost`,onClick:()=>{i(`upload`),o(null),c([])},children:`← Ricarica file`}),(0,G.jsxs)(`div`,{className:`bum-preview-summary`,children:[a?.length||0,` post da importare`,s.length>0&&` · ${s.length} righe saltate`]})]})]}),r===`done`&&(0,G.jsxs)(`div`,{className:`bum-body bum-body-done`,children:[(0,G.jsx)(`div`,{className:`bum-done-icon`,children:`✅`}),(0,G.jsxs)(`div`,{className:`bum-done-title`,children:[a?.length,` post importati`]}),(0,G.jsx)(`div`,{className:`bum-done-sub`,children:`Trovi i post nel Piano Editoriale in stato "bozza". Aprili per completare caption e media.`}),(0,G.jsx)(`button`,{className:`bum-btn-primary`,onClick:n,children:`Chiudi`})]}),(r===`upload`||r===`preview`)&&(0,G.jsxs)(`div`,{className:`bum-foot`,children:[(0,G.jsx)(`button`,{className:`bum-btn-ghost`,onClick:n,children:`Annulla`}),r===`preview`&&(0,G.jsxs)(`button`,{className:`bum-btn-primary`,onClick:_,disabled:!a?.length,children:[`📥 Importa `,a?.length||0,` post`]})]})]})})}var kt=[`Micro (1K-10K)`,`Mid (10K-100K)`,`Macro (100K-1M)`,`Mega (1M+)`,`UGC Creator`,`Giornalista/Media`],At=[{id:`prospect`,label:`Prospect`,color:`#006EFF`},{id:`contattato`,label:`Contattato`,color:`#FF6B00`},{id:`attivo`,label:`Attivo`,color:`#00C853`},{id:`completato`,label:`Completato`,color:`#9CA3AF`},{id:`no`,label:`Non adatto`,color:`#FF1744`}];function jt(){return Math.random().toString(36).slice(2,9)}function Mt(){return{id:jt(),nome:``,handle:``,piattaforma:`instagram`,categoria:`Micro (1K-10K)`,follower:0,er:0,settore:``,stato:`prospect`,fee:0,note:``,campagne:[],createdAt:Date.now()}}function Nt({project:e,onUpdate:t}){let n=e.creators||[],[r,i]=(0,U.useState)(null),[a,o]=(0,U.useState)(null),[s,c]=(0,U.useState)(`tutti`),[l,u]=(0,U.useState)(``);function d(n){t({...e,...n(e)})}function f(){a?.nome?.trim()&&(d(e=>({creators:(e.creators||[]).some(e=>e.id===a.id)?(e.creators||[]).map(e=>e.id===a.id?a:e):[...e.creators||[],a]})),i(null),o(null))}function p(e){d(t=>({creators:(t.creators||[]).filter(t=>t.id!==e)}))}function m(){o(Mt()),i(`new`)}function h(e){o({...e}),i(e.id)}let _=n;return s!==`tutti`&&(_=_.filter(e=>e.stato===s)),l.trim()&&(_=_.filter(e=>(e.nome+e.handle+e.settore).toLowerCase().includes(l.toLowerCase()))),(0,G.jsxs)(`div`,{className:`ov-card`,children:[(0,G.jsxs)(`div`,{className:`ov-card-hdr`,children:[(0,G.jsxs)(`div`,{className:`ov-card-title`,children:[(0,G.jsx)(`span`,{style:{color:`var(--neon-magenta)`,fontWeight:900},children:`👥`}),` Creator & Influencer Database`]}),!r&&(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:m,children:`+ Aggiungi`})]}),r&&a&&(0,G.jsxs)(`div`,{className:`creator-editor`,children:[(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginBottom:10},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Nome *`}),(0,G.jsx)(`input`,{className:`inp`,autoFocus:!0,value:a.nome,onChange:e=>o(t=>({...t,nome:e.target.value})),placeholder:`Nome e Cognome`})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Handle`}),(0,G.jsx)(`input`,{className:`inp`,value:a.handle||``,onChange:e=>o(t=>({...t,handle:e.target.value})),placeholder:`@nomeutente`})]})]}),(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginBottom:10},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Piattaforma`}),(0,G.jsx)(`select`,{className:`inp`,value:a.piattaforma,onChange:e=>o(t=>({...t,piattaforma:e.target.value})),children:g.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.label},e.id))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Categoria`}),(0,G.jsx)(`select`,{className:`inp`,value:a.categoria,onChange:e=>o(t=>({...t,categoria:e.target.value})),children:kt.map(e=>(0,G.jsx)(`option`,{children:e},e))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Stato`}),(0,G.jsx)(`select`,{className:`inp`,value:a.stato,onChange:e=>o(t=>({...t,stato:e.target.value})),children:At.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.label},e.id))})]})]}),(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginBottom:10},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Follower`}),(0,G.jsx)(`input`,{className:`inp`,type:`number`,value:a.follower||0,onChange:e=>o(t=>({...t,follower:+e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`ER %`}),(0,G.jsx)(`input`,{className:`inp`,type:`number`,step:`0.1`,value:a.er||0,onChange:e=>o(t=>({...t,er:+e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Fee €`}),(0,G.jsx)(`input`,{className:`inp`,type:`number`,value:a.fee||0,onChange:e=>o(t=>({...t,fee:+e.target.value}))})]})]}),(0,G.jsx)(`div`,{className:`fg-row`,style:{marginBottom:10},children:(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Settore / Nicchia`}),(0,G.jsx)(`input`,{className:`inp`,value:a.settore||``,onChange:e=>o(t=>({...t,settore:e.target.value})),placeholder:`es. Food siciliano, moda sostenibile`})]})}),(0,G.jsxs)(`div`,{className:`fg`,style:{marginBottom:12},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Note`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:2,value:a.note||``,onChange:e=>o(t=>({...t,note:e.target.value})),placeholder:`Brief collaborazione, link contratto, feedback…`})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{i(null),o(null)},children:`Annulla`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:f,disabled:!a.nome?.trim(),children:`Salva`})]})]}),!r&&(0,G.jsxs)(G.Fragment,{children:[n.length>0&&(0,G.jsxs)(`div`,{className:`creator-filter-bar`,children:[(0,G.jsx)(`input`,{className:`inp`,style:{flex:1,fontSize:11},placeholder:`🔍 Cerca creator…`,value:l,onChange:e=>u(e.target.value)}),(0,G.jsxs)(`select`,{className:`inp`,style:{width:130,fontSize:11},value:s,onChange:e=>c(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti gli stati`}),At.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.label},e.id))]})]}),n.length===0&&(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink5)`,fontStyle:`italic`,padding:`8px 0`},children:`Nessun creator ancora. Aggiungi influencer e UGC creator per le campagne di questo brand.`}),(0,G.jsxs)(`div`,{className:`creator-list`,children:[_.map(e=>{let t=At.find(t=>t.id===e.stato)||At[0],n=g.find(t=>t.id===e.piattaforma);return(0,G.jsxs)(`div`,{className:`creator-row`,children:[(0,G.jsx)(`div`,{className:`creator-avatar`,style:{background:t.color+`20`,border:`1.5px solid `+t.color+`50`},children:(0,G.jsx)(`span`,{style:{fontSize:16},children:n?.icon||`👤`})}),(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:7,marginBottom:2},children:[(0,G.jsx)(`span`,{style:{fontWeight:700,fontSize:13,color:`var(--ink)`},children:e.nome}),e.handle&&(0,G.jsx)(`span`,{style:{fontSize:11,color:`var(--ink4)`},children:e.handle}),(0,G.jsx)(`span`,{className:`creator-stato-badge`,style:{background:t.color+`18`,color:t.color},children:t.label})]}),(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink4)`,display:`flex`,gap:10,flexWrap:`wrap`},children:[(0,G.jsx)(`span`,{children:e.categoria}),e.follower>0&&(0,G.jsxs)(`span`,{children:[`👥 `,e.follower>=1e3?Math.round(e.follower/1e3)+`K`:e.follower]}),e.er>0&&(0,G.jsxs)(`span`,{children:[`📊 ER `,e.er,`%`]}),e.fee>0&&(0,G.jsxs)(`span`,{children:[`💶 `,e.fee,`€`]}),e.settore&&(0,G.jsxs)(`span`,{children:[`🏷 `,e.settore]})]}),e.note&&(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink5)`,marginTop:2,fontStyle:`italic`},children:[e.note.slice(0,60),e.note.length>60?`…`:``]})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:5,flexShrink:0},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>h(e),children:`✎`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{color:`var(--err)`},onClick:()=>p(e.id),children:`×`})]})]},e.id)}),_.length===0&&n.length>0&&(0,G.jsx)(`div`,{className:`ct-empty`,style:{padding:`12px 0`},children:`Nessun creator corrisponde ai filtri.`})]})]})]})}function Pt({globalMeta:e,onMetaChange:t,clients:n=[]}){let[r,i]=(0,U.useState)(``),[a,o]=(0,U.useState)(!1),[s,c]=(0,U.useState)(``),[l,u]=(0,U.useState)(!1),[d,f]=(0,U.useState)(!1);async function p(){let e=r.trim();if(!e){c(`Incolla il token BM prima di continuare.`);return}o(!0),c(``);let n=await z(e);if(o(!1),!n.ok){c(n.error);return}if(!n.pages.length){c(`Nessuna pagina trovata. Verifica i permessi del token.`);return}t?.({bmToken:e,allPages:n.pages,nome:n.pages[0]?.nome||`Business Manager`,connectedAt:Date.now(),expiresAt:Date.now()+1440*60*60*1e3}),i(``),u(!1)}function m(){window.confirm(`Disconnettere Meta? Le connessioni dei clienti rimarranno salvate.`)&&(t?.(null),u(!1),c(``))}function h(){let e={};for(let t of n){let n=t?.meta?.fbPageId;n&&(e[n]=t.nome||t.name||`—`)}return e}if(e?.allPages?.length){let t=b(e),n=h(),o=Object.keys(n).length;return(0,G.jsxs)(`div`,{children:[t.warn&&(0,G.jsxs)(`div`,{style:q.warnBanner,children:[`⚠ `,t.message]}),(0,G.jsxs)(`div`,{className:`gm-status`,children:[(0,G.jsx)(`span`,{className:t.warn?`meta-dot-warn`:`meta-dot-ok`}),(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsx)(`div`,{style:q.connName,children:e.nome||`Business Manager`}),(0,G.jsxs)(`div`,{style:q.connSub,children:[e.allPages.length,` pagine · `,o,` assegnate`,t.daysLeft==null?``:` · ${t.daysLeft}gg`]})]}),(0,G.jsx)(`button`,{style:q.iconBtn,title:`Mostra pagine`,onClick:()=>f(e=>!e),children:`📋`}),(0,G.jsx)(`button`,{style:q.iconBtn,title:`Aggiorna token`,onClick:()=>u(e=>!e),children:`✏️`}),(0,G.jsx)(`button`,{style:q.iconBtn,title:`Disconnetti`,onClick:m,children:`×`})]}),d&&(0,G.jsx)(`div`,{style:q.pageList,children:e.allPages.map(e=>{let t=n[e.id];return(0,G.jsxs)(`div`,{style:q.pageRow,children:[(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsx)(`div`,{style:q.pageName,children:e.nome}),(0,G.jsxs)(`div`,{style:q.pagePlatforms,children:[(0,G.jsx)(`span`,{style:q.fbTag,children:`FB`}),e.igId?(0,G.jsx)(`span`,{style:q.igTag,children:`IG`}):(0,G.jsx)(`span`,{style:q.noIgTag,children:`No IG`})]})]}),t?(0,G.jsxs)(`span`,{style:q.assignedBadge,children:[`✓ `,t]}):(0,G.jsx)(`span`,{style:q.unassignedBadge,children:`Non assegnata`})]},e.id)})}),l&&(0,G.jsxs)(`div`,{style:q.inputBox,children:[(0,G.jsx)(`input`,{style:q.tokenInput,type:`password`,placeholder:`Nuovo token BM…`,value:r,onChange:e=>i(e.target.value),onKeyDown:e=>e.key===`Enter`&&p()}),(0,G.jsx)(`button`,{style:q.connectBtn,onClick:p,disabled:a,children:a?`…`:`Aggiorna`}),s&&(0,G.jsx)(`div`,{style:q.errorTxt,children:s})]})]})}return(0,G.jsx)(`div`,{children:l?(0,G.jsxs)(`div`,{style:q.inputBox,children:[(0,G.jsx)(`div`,{style:q.inputLabel,children:`Token Business Manager`}),(0,G.jsx)(`input`,{style:q.tokenInput,type:`password`,placeholder:`Incolla token long-lived…`,value:r,onChange:e=>i(e.target.value),onKeyDown:e=>e.key===`Enter`&&p(),autoFocus:!0}),(0,G.jsx)(`div`,{style:q.hint,children:`Meta Business Suite → Impostazioni → Account di sistema → Token`}),s&&(0,G.jsx)(`div`,{style:q.errorTxt,children:s}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,marginTop:6},children:[(0,G.jsx)(`button`,{style:q.connectBtn,onClick:p,disabled:a,children:a?`Connessione…`:`Connetti`}),(0,G.jsx)(`button`,{style:q.cancelBtn,onClick:()=>{u(!1),c(``),i(``)},children:`Annulla`})]})]}):(0,G.jsx)(`button`,{className:`sb-meta-btn`,onClick:()=>u(!0),children:`🔗 Connetti Meta`})})}var q={warnBanner:{fontSize:9,color:`#C2185B`,background:`rgba(194,24,91,.08)`,borderRadius:4,padding:`4px 8px`,marginBottom:4,fontWeight:600},connName:{fontSize:10,fontWeight:700,color:`#94A3B8`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},connSub:{fontSize:9,color:`#64748B`},iconBtn:{background:`none`,border:`none`,color:`#475569`,fontSize:10,cursor:`pointer`,flexShrink:0,padding:`0 2px`},inputBox:{marginTop:6,display:`flex`,flexDirection:`column`,gap:4},inputLabel:{fontSize:10,fontWeight:600,color:`#64748B`},tokenInput:{width:`100%`,padding:`6px 8px`,fontSize:11,border:`1px solid #CBD5E1`,borderRadius:6,background:`#F8FAFC`,fontFamily:`monospace`,boxSizing:`border-box`},hint:{fontSize:9,color:`#94A3B8`,lineHeight:1.3},errorTxt:{fontSize:10,color:`#C2185B`,fontWeight:600},connectBtn:{flex:1,padding:`5px 10px`,background:`#1877F2`,color:`#fff`,border:`none`,borderRadius:6,fontSize:11,fontWeight:700,cursor:`pointer`,fontFamily:`inherit`},cancelBtn:{padding:`5px 10px`,background:`#F1F5F9`,color:`#475569`,border:`none`,borderRadius:6,fontSize:11,cursor:`pointer`,fontFamily:`inherit`},pageList:{marginTop:6,display:`flex`,flexDirection:`column`,gap:3},pageRow:{display:`flex`,alignItems:`center`,gap:6,padding:`4px 6px`,background:`#F8FAFC`,borderRadius:4,fontSize:10},pageName:{fontSize:10,fontWeight:600,color:`#334155`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},pagePlatforms:{display:`flex`,gap:3,marginTop:1},fbTag:{fontSize:8,fontWeight:700,color:`#1877F2`,background:`rgba(24,119,242,.08)`,padding:`1px 4px`,borderRadius:3},igTag:{fontSize:8,fontWeight:700,color:`#E1306C`,background:`rgba(225,48,108,.08)`,padding:`1px 4px`,borderRadius:3},noIgTag:{fontSize:8,color:`#94A3B8`,padding:`1px 4px`},assignedBadge:{fontSize:9,fontWeight:600,color:`#16A34A`,background:`rgba(22,163,74,.08)`,padding:`2px 6px`,borderRadius:4,whiteSpace:`nowrap`,flexShrink:0},unassignedBadge:{fontSize:9,color:`#94A3B8`,fontStyle:`italic`,whiteSpace:`nowrap`,flexShrink:0}},Ft={nome:`Kosmetikal`,settore:`Contract manufacturing cosmetico`,anno:`2003`,sede:`Pesaro, Marche`,sito:`kosmetikal.it`,descrizione:`Kosmetikal è un laboratorio cosmetico italiano specializzato in contract manufacturing B2B. Produce formule cosmetiche su specifica per brand terzi tramite due percorsi: Full Service (sviluppo formula + produzione + packaging + certificazioni PIF/CPNP) e White Label (400+ formule pronte, lotti da 10 kg). Gestisce l'intero ciclo internamente senza subappaltatori.`,differenziale:`Library Advanced: 7 attivi biotech (esosomi, PDRN, peptidi, Spicule, biofermentati, Active Water, cellule staminali vegetali) con schede tecniche e dati di stabilità scaricabili PRIMA del contratto. Certificazione COSMOS Organic d'azienda — non solo di prodotto. Focalizzazione dichiarata: nessun integratore, nessun medical device, nessun brand cosmetico proprio che compete con i clienti.`,valori:`Advanced before natural · Documenta, non dichiara · Focalizzazione come garanzia strutturale`,target:`B2B esclusivo. 5 personas: P1 Brand Builder Avanzato (brand mid-size che vogliono attivi biotech verificabili), P2 Startup Visionaria (primo lancio, rischio zero), P3 Buyer Corporate Internazionale (conformità normativa come standard), P4 Buyer Bio Consapevole (COSMOS Organic d'azienda non di prodotto), P5 Cacciatore di Frontiera — target primario (R&D director che sa distinguere chi bluffa).`,b2x:`B2B — contract manufacturing per brand cosmetici italiani e internazionali`,mercati:`Italia (primario) · UK · Germania · Francia · Benelux (espansione piano 2026)`,prodotti:`Full Service: dal brief al prodotto finito, un solo interlocutore, PIF+CPNP inclusi. White Label: 400+ formule pronte, lotti da 10 kg. Library Advanced: risorsa scaricabile — 7 schede tecniche attivi biotech con meccanismo d'azione, veicoli testati, dati di stabilità. Struttura: 1.600 mq, 30 collaboratori, 300.000 kg/anno, 8.000+ formulazioni testate dal 2003.`,pricing:`Contract manufacturing a commessa. Lotti White Label da 10 kg (accessibile a startup). Budget marketing cliente per brand strutturati: produzione €3.723/mese + Ads €3.000/mese (scenario medio).`,competitor:`Cosmoderma · Delta BKB · Reynaldi`,diff_competitor:`Nessun competitor italiano mid-size pubblica schede tecniche verificabili degli attivi prima del contratto. La finestra competitiva è aperta: 12-18 mesi prima che altri la occupino. Kosmetikal ha la Library Advanced come asset esclusivo. COSMOS Organic d'azienda vs solo di prodotto (Reynaldi). Ciclo in-house vs subappaltatori non dichiarati (P3 pain point).`,canali_attuali:`LinkedIn pagina aziendale (discontinua) · LinkedIn Silvye Malfarà CEO (non attivo) · Instagram (registro non allineato) · Facebook (solo derivato) · Sito web (da allineare al posizionamento Advanced)`,advertising:`Nessuno attivo. Da attivare: LinkedIn Ads (CPLQ target <60€ — P5 e P3) + Meta Ads Instagram (CPLQ target <35€ — P2). Condizione: prima il piano organico in regime di crociera.`,obiettivo1:`50 download/mese Library Advanced entro ottobre 2025. 10 lead qualificati/mese da organico LinkedIn entro dicembre 2025. 8 lead/mese entro dicembre 2026. 40% lead con documento tecnico pre-contatto entro dicembre 2026.`,obiettivo2:`30% lead da mercati esteri entro dicembre 2026. Top 3 keyword 'laboratorio cosmetico esosomi'. 6 menzioni media di settore/anno. Engagement rate LinkedIn 5% entro dicembre 2026.`,budget:`Scenario medio raccomandato: €3.000/mese Ads (35% LinkedIn + 30% Google + 20% Meta + 15% produzione esterna). Produzione contenuti: €3.723/mese. Totale annuale: ~€83.000.`,problema:`Comunicazione precedente ancorata al biologico come identità primaria — non comunica il posizionamento Advanced Natural Cosmetic Lab. Nessun piano editoriale sistematico. Nessuna voce pubblica di Silvye Malfarà. La Library Advanced — il differenziale principale — non era mai stata comunicata pubblicamente. Il buyer qualificato non trovava prove materiali del payoff Advanced.`,cosa_non_funziona:`Presenza social discontinua. Registro non allineato al posizionamento Industrial Biotech. Nessun contenuto tecnico sugli attivi biotech. Assenza totale di strategia di content marketing B2B sistematica.`,team:`Silvye Malfarà (CEO — approvazione finale, 3-4h/sett) · Responsabile Marketing esterno (15-20h/sett) · Copywriter esterno (6-8h/sett) · Designer esterno (3-4h/sett) · Team R&S per validazione tecnica contenuti (2-3h/sett)`,risorse:`Google Analytics 4 · Meta Business Suite · Metricool (analytics, non scheduling) · Canva Pro · LinkedIn Campaign Manager · Google Ads`,note:`Payoff ufficiale: 'Advanced. Then natural.' Creative Territory: 'Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi.' Target primario comunicazione: P5 Cacciatore di Frontiera. Se la comunicazione convince P5, convince automaticamente anche P1, P3 e P2 — è la barra più alta. Cosmetica Biodiversa (marchio registrato) rinviata al piano comunicativo 2027.`},It={sections:{executive_summary:{versions:[],content:`## Executive Summary

### Il Contesto
Il contract manufacturing cosmetico italiano ha un problema strutturale: molti laboratori producono bene, ma nessuno rende verificabile la propria competenza prima della firma del contratto. Il buyer B2B seleziona il partner sulla base di presentazioni commerciali e impressioni — non di prove materiali. Il risultato: un mercato dove la fiducia è scarsa e il rischio di scelta sbagliata è alto.

### L'Azienda
Kosmetikal è un laboratorio cosmetico italiano fondato nel 2003 a Pesaro. Produce formule cosmetiche su specifica per brand terzi (Full Service e White Label). 1.600 mq di stabilimento, 30 collaboratori, 300.000 kg/anno, 8.000+ formulazioni testate. L'intero ciclo — formulazione, produzione, packaging, certificazioni normative (PIF, CPNP) — è gestito internamente senza subappaltatori.

### La Sfida Strategica
Kosmetikal ha una sostanza tecnica verificabile. Non ha ancora la forma comunicativa che la rende riconoscibile. La comunicazione precedente era ancorata al biologico come identità primaria — generica, priva di prove materiali del termine Advanced. Il buyer qualificato non trovava Kosmetikal quando cercava un partner per formulazioni con esosomi.

### L'Approccio
1. **Library Advanced come prova prima della fiducia** — 7 schede tecniche scaricabili prima del contratto
2. **Registro Industrial Biotech** — dati prima degli aggettivi, su tutti i canali
3. **LinkedIn sistematico** — piano editoriale tecnico che nessun competitor italiano mid-size ha ancora
4. **Voce pubblica di Silvye Malfarà** — la conduzione familiare visibile come garanzia relazionale

### I KPI Chiave
| Obiettivo | Metrica | Target | Orizzonte |
|-----------|---------|--------|-----------|
| Lead generation qualificata | Lead qualificati/mese con doc. tecnico pre-contatto | 8/mese con 40% doc. pre-contatto | Dic. 2026 |
| Brand authority biotech | Download Library Advanced/mese | 50 (ott. 2025) → 150 (dic. 2026) | 18 mesi |
| Internazionalizzazione | % lead da mercati esteri | 30% del totale | Dic. 2026 |
| Riconoscibilità tecnica | Posizione keyword 'laboratorio cosmetico esosomi' | Top 3 Google IT | Dic. 2026 |

### Le 3 Priorità Immediate
1. **Entro 30 giugno 2025** — LinkedIn Silvye attivo con primo post. Dichiarazione focalizzazione live sul sito. Baseline KPI rilevata.
2. **Entro 15 settembre 2025** — Library Advanced pubblica dietro form. Piano editoriale LinkedIn in regime di crociera. Comunicato PR a 6 media target.
3. **Entro 31 dicembre 2025** — 5 landing page verticali live. Blog tecnico con 3 articoli. Almeno 2 menzioni media di settore confermate.`},posizionamento_usp:{versions:[],content:`## Posizionamento + USP

### Insight Dominante
Nel contract manufacturing cosmetico, il buyer non cerca il laboratorio più innovativo. Cerca il laboratorio di cui può fidarsi senza doverlo credere sulla parola — perché ha già pagato il prezzo di una scelta sbagliata.

### Formula USP
**"Per brand cosmetici che vogliono attivi biotech verificabili nel loro prodotto, Kosmetikal è l'unico contract manufacturer italiano che trasforma la competenza formulativa in documenti scaricabili prima del contratto — perché la Library Advanced con 7 schede tecniche esiste ed è pubblica."**

### Brand Promise
**"Dimostra. Poi convince."**
Perché funziona: non promette qualità — la promettono tutti. Promette una cosa specifica e verificabile: la documentazione come standard, non come conseguenza del contratto.

### Territorio di Posizionamento
- **Cosa siamo:** Il laboratorio cosmetico italiano che dà le prove tecniche prima della firma
- **Cosa NON siamo:** Un terzista generico · un laboratorio "biologico" · un fornitore flessibile di tutto per tutti
- **Con chi non competeremo:** Brand consumer (no brand propri) · medical device · integratori alimentari

### Matrice di Posizionamento
- Asse X: Profondità tecnica documentata (bassa → alta)
- Asse Y: Accessibilità della prova pre-contratto (nessuna → totale)

| Competitor | Profondità tecnica | Prova pre-contratto | Note |
|---|---|---|---|
| **Kosmetikal** | Alta | Totale | Library Advanced pubblica |
| Cosmoderma | Media | Nessuna | Presenza LinkedIn bassa |
| Delta BKB | Media | Parziale | Registro narrativo-artigianale |
| Reynaldi | Media | Nessuna | Registro valoriale-ESG |`},obiettivi_smart:{versions:[],content:`## Obiettivi SMART

### Obiettivi di Marketing (OM)
| Cod. | Obiettivo | Metrica | Baseline | Target | Scadenza | Priorità |
|------|-----------|---------|----------|--------|----------|----------|
| OM1 | Lead generation qualificata | Lead qualificati/mese con budget+timeline definiti | ⚠️ Da rilevare | 8/mese | Dic. 2026 | Alta |
| OM2 | Brand authority biotech | Download Library Advanced + menzioni PR | 0 | 150 download/mese + 6 menzioni/anno | Dic. 2026 | Alta |
| OM3 | Internazionalizzazione | % lead da mercati esteri | ⚠️ Da rilevare | 30% del totale | Dic. 2026 | Media |

### Obiettivi di Comunicazione (OC)
| Cod. | Tipo | Deriva da | Obiettivo | Metrica | Orizzonte |
|------|------|-----------|-----------|---------|-----------|
| OC1 | Cognitivo | OM2 | Rendere verificabile il posizionamento Advanced | % buyer con documento tecnico pre-contatto | 6-9 mesi |
| OC2 | Cognitivo | OM2 | Costruire riconoscibilità nel cluster biotech | Menzioni PR + posizione keyword | 12-18 mesi |
| OC3 | Comportamentale | OM1 | Qualificare il lead prima del contatto | % lead con budget+timeline al primo contatto | 3-6 mesi |
| OC4 | Affettivo | OM1 | Costruire fiducia prima della conversazione | Engagement LinkedIn + apertura newsletter | 6-12 mesi |
| OC5 | Comportamentale | OM3 | Internazionalizzare senza diluire il registro | % lead esteri + traffico sito EN | 9-12 mesi |

### Logica della Traduzione OM → OC
OC1 apre la porta (il buyer scopre le prove) → OC4 costruisce la relazione (il buyer inizia a fidarsi) → OC2 genera riconoscibilità spontanea → OC3 converte (il buyer compila il form) → OC5 scala internazionalmente. Investire solo su OC3 e OC5 senza costruire OC1 e OC4 produce lead in volume ma non in qualità.`},budget_media:{versions:[],content:`## Budget & Media Plan

### Scenari di Investimento
| Voce | Scenario Conservativo | Scenario Medio | Scenario Ottimale |
|------|---|---|---|
| Produzione contenuti/mese | €2.626 | €3.723 | €4.818 |
| Budget Ads/mese | €1.500 | €3.000 | €5.000 |
| Tool e software/mese | €34 | €45 | €55 |
| **TOTALE/MESE** | **≈ €4.300** | **≈ €6.900** | **≈ €10.000** |
| **TOTALE/ANNO** | **≈ €52.000** | **≈ €83.000** | **≈ €122.000** |

*Raccomandazione: partire con lo Scenario Medio e scalare in base ai risultati Q4 2025.*

### Allocazione Budget Ads (Scenario Medio — €3.000/mese)
| Canale | % | Budget/mese | CPLQ target | Condizione attivazione |
|--------|---|-------------|-------------|----------------------|
| LinkedIn Ads | 35% | €1.050 | < 60€ | Library Advanced live + 30 post pubblicati |
| Google Ads Search | 30% | €900 | < 35€ | Sito EN operativo + keyword strategy definita |
| Meta Ads (Instagram) | 20% | €600 | < 35€ | LP Full Service + LP White Label live + Pixel |
| Produzione esterna | 15% | €450 | — | Da subito |

### Costi una Tantum (setup — stima)
| Voce | Costo stimato | Priorità |
|------|---|---|
| Shooting fotografico sessione 1 (40+ scatti) | €800-1.200 | Alta — entro ago. 2025 |
| Sviluppo landing page verticali (5 LP) | €2.000-4.000 | Alta — entro set. 2025 |
| Setup analytics completo (GA4 + Pixel + Tag) | €300-500 | Alta — entro lug. 2025 |
| Ottimizzazione profili LinkedIn (pagina + Silvye) | €200-400 | Alta — entro giu. 2025 |

### Le 3 Decisioni da Prendere Subito
1. **Scenario di investimento Ads**: Conservativo (€1.500) · Medio (€3.000) · Aggressivo (€5.000) — raccomandazione: Medio
2. **Responsabile Marketing**: part-time esterno (€1.200-2.000/mese) vs full-time interno (€1.800-2.800 netto) — per Fase 1: esterno
3. **Copywriter e designer**: due profili singoli (più economico, più coordinamento) vs micro-agenzia B2B social (unico punto di contatto)`}}},Lt={sections:{creative_territory:{versions:[],content:`## Creative Territory

### La Tensione di Mercato
Il mercato cosmetico è pieno di laboratori che dichiarano l'innovazione. Quelli che la dimostrano con documenti verificabili prima del contratto si contano sulle dita di una mano.

### La Promessa
Kosmetikal è il laboratorio biotech italiano che dimostra, non dichiara.

### Le Prove Materiali

**Prova 1 — La libreria esiste ed è scaricabile**
"Non diciamo di avere gli esosomi. Mostriamo come li formuliamo — meccanismo d'azione, veicoli testati, dati di stabilità. Sette schede. Prima del contratto."

**Prova 2 — Il sistema è tracciabile**
"Ogni lotto produce un campione di riferimento conservato 3 anni con codifica univoca. Non su richiesta — come standard."

**Prova 3 — La scelta è dichiarata**
"Non facciamo integratori. Non facciamo medical device. Non abbiamo brand cosmetici propri. Lo scriviamo sul sito. La focalizzazione non è un limite — è una garanzia strutturale contro i conflitti di interesse."

**Prova 4 — La guida è visibile**
"Silvye Malfarà. CEO e Innovation Strategy. Profilo LinkedIn attivo. Voce editoriale riconoscibile. Chi compra da Kosmetikal sa con chi parla."

### Il Territorio in una Frase
**"Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi."**

### Coordinate Visive Essenziali
| Elemento | Standard | ✅ Sì | ❌ No |
|----------|---------|-------|-------|
| Palette | Charcoal #1C1C1A · Beige #F5F0EB · Oro #8B6F47 | Nero industriale + bianco caldo + bronzo | Colori saturi, pastello beauty, gradients |
| Tipografia | Georgia (titoli) · Arial (corpo) · Courier New (dati) | Gerarchia: dato numerico > aggettivo | Font arrotondati (Nunito, Poppins) |
| Fotografia | Luce naturale dura, soggetti tecnici, zero filtri | Close-up strumentazione, mani al lavoro | Stock photo, render 3D, luce pubblicitaria |
| Infografiche | Max 3 colori, dati prominenti, fonte sempre citata | Dato grande + testo descrittivo piccolo | Icone decorative, molecole 3D |`},tone_of_voice:{versions:[],content:`## Tone of Voice — Regole Operative

### Posizionamento — Scala Nielsen
| Dimensione | Polo A | 1 | 2 | 3 | 4 | 5 | Polo B |
|---|---|---|---|---|---|---|---|
| Registro | Informale | | | ✦ | | | Formale |
| Tono | Divertente | | | | ✦ | | Serio |
| Rispetto | Irriverente | | | | ✦ | | Rispettoso |
| Energia | Entusiasta | | | ✦ | | | Distaccato |

**Posizione:** Registro-3 / Tono-4 / Rispetto-4 / Energia-3
**Identità sonora:** Preciso · Verificabile · Dichiarativo · Industriale · Affidabile

---

**Regola 1 — I numeri vengono prima degli aggettivi**
- ❌ "Kosmetikal vanta una lunga esperienza nella formulazione cosmetica avanzata."
- ✅ "Dal 2003. 8.000+ formulazioni testate. 7 attivi biotech integrati."

**Regola 2 — Frasi corte. Soggetto → verbo → oggetto**
- ❌ "Essendo un laboratorio specializzato nelle biotecnologie, siamo in grado di offrire un servizio completo."
- ✅ "Kosmetikal gestisce l'intero ciclo internamente. Dal brief al prodotto finito. Un solo interlocutore."

**Regola 3 — Dichiarativo, non interrogativo**
- ❌ "Vuoi sapere come possiamo aiutarti a sviluppare la tua linea cosmetica?"
- ✅ "Il percorso Full Service gestisce ogni fase internamente. PIF e CPNP inclusi."

**Regola 4 — Mai aggettivi senza prova**
- ❌ "Il nostro innovativo laboratorio R&S sviluppa formulazioni all'avanguardia."
- ✅ "65 mq di R&S dedicati. 8.000+ formulazioni testate. Sette attivi biotech con protocolli validati."

**Regola 5 — La naturalità non si celebra — si qualifica**
- ❌ "Utilizziamo ingredienti naturali selezionati con cura."
- ✅ "Ingredienti di origine naturale. Certificazione COSMOS Organic d'azienda. Fornitori AIAB tracciabili."

**Regola 6 — Il registro non cambia con il canale — il formato sì**
- ❌ (Instagram) "✨ La natura ci ispira ogni giorno! 🌿 Scopri la nostra filosofia green!"
- ✅ (Instagram) "Turboemulsore. 1.300 kg per ciclo. Temperatura controllata. Questo è il momento in cui la formula diventa prodotto."

**Regola 7 — La voce di Silvye è personale ma non informale**
- ❌ "Siamo lieti di annunciare il lancio della nostra Library Advanced, uno strumento innovativo che..."
- ✅ "Ho impiegato tre anni a capire perché i nostri clienti faticavano a scegliere. La risposta era semplice: non avevano le prove."

**Regola 8 — Le emoji non appartengono al territorio**
- ❌ "🌿 Sostenibilità · 🔬 Scienza · ✨ Qualità"
- ✅ Testo. Dati. Punto. Mai emoji — su nessun canale.

### Parametri Grammaticali
- Pronome: Lei (formale B2B) nelle comunicazioni commerciali · tu (LinkedIn) per contenuti editoriali
- Emoji: Mai — nessun canale, nessun formato
- Aperture: Sempre dichiarative — mai domande retoriche
- Parole vietate: innovativo · avanzato · all'avanguardia · eccellente · leader · premium (senza prova)`},message_house:{versions:[],content:`## Message House

### TETTO — Brand Promise
**"Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi."**

---

### Pilastro 1: La libreria esiste
**Messaggio:** "7 attivi biotech formulati e testati. Schede tecniche scaricabili prima del contratto."
**Prova materiale:** Library Advanced — 7 schede con meccanismo d'azione, veicoli testati, dati di stabilità
**Si manifesta in:** LinkedIn Pilastro A · Homepage sito (hero) · Cosmoprof (materiale stampato)

### Pilastro 2: Il sistema è tracciabile
**Messaggio:** "Ciclo produttivo interamente in-house. Un solo interlocutore. PIF e CPNP inclusi come standard."
**Prova materiale:** ISO 9001 · ISO 22716/GMP · CPNP su ogni formula come default
**Si manifesta in:** Dossier RFQ · Landing page Full Service · LinkedIn Pilastro B

### Pilastro 3: La guida è visibile
**Messaggio:** "Silvye Malfarà. CEO e Innovation Strategy. Voce pubblica su LinkedIn."
**Prova materiale:** Profilo LinkedIn Silvye attivo · Post personali firmati · Company profile v5.2
**Si manifesta in:** LinkedIn profilo Silvye · Cosmoprof · Email nurturing

### Pilastro 4: La scelta è dichiarata
**Messaggio:** "No integratori. No medical device. No brand cosmetici propri. La focalizzazione è una garanzia."
**Prova materiale:** Dichiarazione esplicita sul sito · Company profile · Presentazioni commerciali
**Si manifesta in:** LinkedIn Pilastro C · Risposta commerciale FAQ · Sito sezione Chi siamo

---

### Reason Why — Sistema di Prove
| Livello | Reason Why | Prova materiale | Buyer primario | Fase funnel |
|---------|---|---|---|---|
| Primaria | Library Advanced pubblica e verificabile | 7 schede tecniche scaricabili | P5, P1 | Considerazione |
| Strutturale | Ciclo produttivo interamente in-house | PIF+CPNP interni · grafica interna | P3, P1 | Valutazione |
| Sistemica | Certificazioni come sistema aziendale (non di prodotto) | ISO 9001 · COSMOS Organic d'azienda | P3, P4 | Valutazione |
| Distintiva | Focalizzazione dichiarata senza conflitti | Dichiarazione esplicita sul sito | P1, P3 | Awareness |
| Relazionale | Conduzione familiare visibile e responsabile | Silvye Malfarà — nome, volto, LinkedIn | P2, P5 | Fiducia |

---

### Declinazione per Buyer
| Buyer | Pilastro primario | Pilastro secondario | Prova da esibire subito |
|-------|---|---|---|
| P5 Cacciatore Frontiera | P1 — La libreria esiste | P2 — Sistema tracciabile | Library Advanced + call R&S pre-brief |
| P1 Brand Builder | P1 — La libreria esiste | P4 — Scelta dichiarata | Library Advanced — schede stabilità |
| P2 Startup Visionaria | P3 — Guida visibile | P2 — Sistema tracciabile | Silvye come volto + percorso chiaro |
| P3 Buyer Corporate | P4 — Scelta dichiarata | P2 — Sistema tracciabile | ISO + PIF/CPNP + dossier RFQ |
| P4 Buyer Bio | P2 — Sistema tracciabile | P1 — Libreria esiste | Manifesto COSMOS Organic d'azienda |`},copy_strategy:{versions:[],content:`## Master Copy Strategy

### 1. Il Contesto Competitivo
Il contract manufacturing cosmetico italiano ha un problema strutturale. Non è la qualità — molti laboratori producono bene. È la verificabilità. Il mercato è pieno di laboratori che dichiarano l'innovazione con aggettivi senza che il buyer possa verificare nulla prima di firmare un contratto.

### 2. L'Insight Dominante
Da tutte e cinque le personas emerge un denominatore comune — non la stessa tensione, ma tutte convergono verso lo stesso punto:

**"Nel contract manufacturing cosmetico, il buyer non cerca il laboratorio più innovativo. Cerca il laboratorio di cui può fidarsi senza doverlo credere sulla parola."**

| Persona | Tensione | Denominatore |
|---------|---|---|
| P5 Cacciatore Frontiera | "Sa riconoscere chi bluffa sugli attivi biotech" | Ha già vissuto la delusione del laboratorio che dichiarava senza dimostrare |
| P1 Brand Builder | "Il laboratorio precedente non sapeva lavorare con attivi biotech avanzati" | Ha già pagato il prezzo della scelta sbagliata |
| P2 Startup Visionaria | "Non può permettersi un errore sul fornitore nel primo anno" | Teme di vivere la delusione — non l'ha ancora vissuta |
| P3 Buyer Corporate | "Ogni gap normativo è un ritardo al lancio" | Ha già subito le conseguenze di un partner che non documentava |
| P4 Buyer Bio | "Ha già pagato il prezzo del greenwashing" | Ha già vissuto la delusione del laboratorio che dichiarava senza certificazione |

### 3. L'Obiettivo di Comunicazione
*Cosa deve pensare il target dopo ogni contatto con la comunicazione di Kosmetikal:*
**"Questo laboratorio non mi sta chiedendo di fidarmi. Mi sta dando le prove per verificare."**

### 4. La Promessa Principale
**Versione lunga (interna):** "Kosmetikal è il primo laboratorio cosmetico italiano che trasforma la competenza biotech in documenti verificabili — prima ancora che tu decida di lavorare con noi."
**Versione breve (claim):** "Dimostra. Poi convince."
**Payoff pubblico:** "Advanced. Then natural."

### 5. Mandatories

**MUST HAVE**
- M1: Un dato numerico verificabile in ogni pezzo di comunicazione
- M2: Il payoff "Advanced. Then natural." in ogni documento ufficiale (homepage, company profile, Library Advanced, firma email, stand Cosmoprof) — sempre in inglese
- M3: La gerarchia Advanced → Natural rispettata: mai aprire con "Siamo un laboratorio biologico"
- M4: Una prova materiale per ogni affermazione tecnica
- M5: Validazione R&S di ogni contenuto che tocca la chimica

**MUST NOT**
- MN1: Aggettivi senza prova: innovativo · avanzato · all'avanguardia · leader · eccellente · premium
- MN2: Il biologico come identità primaria
- MN3: Emoji in qualsiasi formato — mai, su nessun canale
- MN4: Domande retoriche come apertura — sempre dichiarative
- MN5: Greenwashing implicito: sostenibile · eco · green senza certificazione specifica
- MN6: Cosmetica Biodiversa come storia emotiva (piano 2027)
- MN7: Linguaggio consumer: "la tua pelle ci ringrazia" · "scopri il segreto"
- MN8: Competitor nominati nella comunicazione pubblica`},campaign_moments:{versions:[],content:`## Campaign Moments

### CM1 — Lancio Library Advanced
**Periodo:** Settembre 2025 · 3 settimane attive + 4 settimane coda
**Big Idea:** *"La libreria è pubblica. Adesso puoi verificarla."*
**Trigger:** Lancio dello strumento più potente del posizionamento Advanced — la prova materiale che nessun competitor ha
**Obiettivo:** 50 download/mese entro ottobre 2025 · 10 lead qualificati entro 30 giorni dal lancio

| Canale | Sett. 1 (pre) | Sett. 2 (lancio) | Sett. 3 (profondità) | Coda |
|---|---|---|---|---|
| LinkedIn pagina | Teaser: il problema | Post lancio | Serie un attivo/sett. | Always on |
| LinkedIn Silvye | Teaser personale | Post lancio personale | Commento tecnico | 1/mese su Library |
| Instagram | Teaser visivo | Carosello 7 schede | Reel formulazione | 1 post/2 settimane |
| Email | — | Email lancio | Sequenza nurturing | Newsletter mensile |
| PR | — | Comunicato stampa | Follow-up media | — |

**KPI specifici:** Download Library: 50 (30gg) → 150 (90gg) · Lead qualificati: 10 (30gg) → 30 (90gg) · Menzioni PR: 2 (30gg) → 4 (90gg)

---

### CM2 — Cosmoprof 2026
**Periodo:** Marzo-Giugno 2026 · 6 settimane pre-fiera + evento + 2 settimane post
**Big Idea:** *"Incontra il laboratorio. Non lo stand."*
**Obiettivo:** 40 contatti qualificati · 20 appuntamenti pre-fissati · 15 brief aperti entro 30 giorni

| Fase | Periodo | Azioni chiave |
|---|---|---|
| Pre-fiera | 6 settimane prima | Annuncio presenza · LP "Prenota incontro con Silvye" · Email outreach · LinkedIn Ads target partecipanti |
| In fiera | Durante evento | 1-2 post LinkedIn/giorno · Instagram Stories dietro le quinte · Documentazione conversazioni in CRM |
| Post-fiera | 2 settimane dopo | Follow-up individuale entro 48h · Pipeline aggiornato con ogni contatto |

---

### CM3 — Posizionamento Internazionale
**Periodo:** Ottobre-Dicembre 2026 · 8 settimane attive
**Big Idea:** *"Made in Italy Biotech. Per il tuo mercato."*
**Obiettivo:** 30% lead da mercati esteri (UK, Germania, Francia, Benelux)

| Settimane | Focus | Messaggio chiave EN |
|---|---|---|
| 1-2 | Il problema | "Most Italian cosmetic labs don't manage PIF and CPNP internally." |
| 3-4 | La soluzione | "PIF. CPNP. CE 1223/2009. Managed internally. Included." |
| 5-6 | La prova | "ISO 9001. ISO 22716/GMP. COSMOS Organic company-level." |
| 7-8 | L'invito | "If you're looking for an Italian biotech lab — let's talk. A technical conversation." |`}}};function Rt(){let e=`demo-client-kosmetikal`,t={id:`demo-kosmetikal`,clientId:e,name:`Piano Marketing 2025-2026`,createdAt:Date.now(),interview:Ft,context:C(Ft),pdm:It,pdc:Lt,pilastri:[],ed:d(),tasks:[{id:M(),text:`Sessione input con Silvye — 7 domande Appendice A`,priority:`high`,tag:`Strategia`,assignee:`S + A`,done:!1,createdAt:Date.now()},{id:M(),text:`Confermare lista 7 attivi biotech Library Advanced`,priority:`high`,tag:`Strategia`,assignee:`S`,done:!1,createdAt:Date.now()},{id:M(),text:`Briefing copywriter voce Winniefred`,priority:`high`,tag:`Contenuti`,assignee:`A + T`,done:!1,createdAt:Date.now()},{id:M(),text:`Ottimizzazione profilo LinkedIn pagina Kosmetikal`,priority:`med`,tag:`Social`,assignee:`T`,done:!1,createdAt:Date.now()},{id:M(),text:`Setup Meta Business Manager + Pixel Instagram`,priority:`med`,tag:`Tecnico`,assignee:`T`,done:!1,createdAt:Date.now()},{id:M(),text:`Copy Strategy v1.1 — sezione prezzo completata`,priority:`high`,tag:`Strategia`,assignee:`A`,done:!0,createdAt:Date.now()-864e5}],milestones:[],budget:{produzione:[{id:M(),label:`Copywriter esterno`,valore:1060},{id:M(),label:`Designer esterno`,valore:525},{id:M(),label:`Fotografo (equiv. mensile)`,valore:100}],ads:{linkedin:1050,google:900,meta:600,altri:450},note:``}};return{client:{id:e,nome:`Kosmetikal`,referente:`Silvye Malfarà`,email:`silvye@kosmetikal.it`,settore:`Contract manufacturing cosmetico`,pacchetto:`professional`,dataInizio:`2025-06-01`,social:{ig:`@kosmetikal`,fb:``,linkedin:`linkedin.com/company/kosmetikal`,tiktok:``,sito:`kosmetikal.it`},meta:null,portal:{pin:``,mostraFeed:!0,mostraPipeline:!1},projectIds:[t.id],createdAt:Date.now()},project:t}}function zt(){let e=`demo-client-radenza`;function t(e,t,n,r,i,a,o){let s=[`instagram`,`facebook`],c={CoopPromo:`BOFU`,FiorFiore:`MOFU`,TerraTavola:`MOFU`,Istituzionale:`TOFU`,CoopSocial:`TOFU`}[r.replace(/\s/g,``)]||`MOFU`;return{id:M(),titolo:`${t}. ${n}`,tipo:{carosello:`carousel`,reel:`reel`,post:`post`,story:`storia`}[i]||`post`,pilastro:r,piattaforme:s,stato:`bozza`,data:e,time:``,funnel:c,immagineUrl:``,immagineBase64:``,videoUrl:``,membersAssigned:[`paolone`],caption:``,cta:``,ctaLink:``,collaborazioni:``,tagMenzioni:``,comments:[],createdAt:Date.now(),_adv:a||!1,_urgente:o||!1}}let n=[t(`2026-05-16`,`01`,`⏰ Urgenza Ciclo 2 — Carosello + Stories + Reel`,`CoopPromo`,`carosello`,!1,!0),t(`2026-05-19`,`02`,`Lancio Volantino Ciclo 3 (19→30 mag) + slide Fior Fiore`,`CoopPromo`,`carosello`,!1,!1),t(`2026-05-21`,`03`,`Mandorle di Avola IGP — Pesto alla siciliana`,`TerraTavola`,`carosello`,!1,!1),t(`2026-05-23`,`04`,`Pomodoro Pachino IGP — Caponata estiva`,`FiorFiore`,`carosello`,!1,!1),t(`2026-05-27`,`05`,`Reminder mid-promo Ciclo 3 — prodotti hero`,`CoopPromo`,`post`,!1,!1),t(`2026-05-28`,`06`,`Pecorino Siciliano DOP — Pasta alla Norma`,`TerraTavola`,`carosello`,!1,!1),t(`2026-05-30`,`07`,`⏰ Urgenza Ciclo 3 — Carosello + Stories + Reel`,`CoopPromo`,`carosello`,!1,!0),t(`2026-06-01`,`08`,`Pistacchio di Bronte DOP — Pesto di pistacchio`,`FiorFiore`,`carosello`,!1,!1),t(`2026-06-02`,`09`,`Festa della Repubblica 🇮🇹 — Carosello prodotti Fior Fiore`,`Istituzionale`,`carosello`,!1,!1),t(`2026-06-03`,`10`,`Lancio Volantino Ciclo 4 (1→10 giu) + slide Fior Fiore`,`CoopPromo`,`carosello`,!1,!1),t(`2026-06-05`,`11`,`Giornata Mondiale dell'Ambiente 🌍 — filiera corta siciliana`,`Istituzionale`,`post`,!1,!1),t(`2026-06-06`,`12`,`Pistacchio di Bronte DOP — storia del produttore`,`TerraTavola`,`carosello`,!1,!1),t(`2026-06-09`,`13`,`⏰ Urgenza Ciclo 4 — Carosello + Stories + Reel`,`CoopPromo`,`carosello`,!1,!0),t(`2026-06-11`,`14`,`Lancio Volantino Ciclo 5 (11→20 giu) + slide Fior Fiore`,`CoopPromo`,`carosello`,!1,!1),t(`2026-06-13`,`15`,`Festival Artisti di Strada — Niscemi 🎭 La Sicilia che si alza`,`Istituzionale`,`post`,!1,!1),t(`2026-06-14`,`16`,`Olio EVO Nocellara del Belìce DOP — Bruschetta siciliana`,`FiorFiore`,`carosello`,!1,!1),t(`2026-06-16`,`17`,`Capperi di Pantelleria IGP — Spaghetti alla pantesca`,`TerraTavola`,`carosello`,!1,!1),t(`2026-06-18`,`18`,`Lo Spesotto — obiettivo Reaction & Interazioni`,`CoopSocial`,`post`,!1,!1),t(`2026-06-20`,`19`,`⏰ Urgenza Ciclo 5 — Carosello + Stories + Reel`,`CoopPromo`,`carosello`,!0,!0),t(`2026-06-21`,`20`,`Solstizio d'estate ☀️ — prodotti freschi di stagione`,`Istituzionale`,`post`,!1,!1),t(`2026-06-22`,`21`,`Buono Se — obiettivo Reaction & Interazioni`,`CoopSocial`,`post`,!1,!1),t(`2026-06-23`,`22`,`Verde Speranza — Reaction & Interazioni (iniziativa solidale)`,`CoopSocial`,`post`,!1,!1),t(`2026-06-24`,`23`,`Miele delle Madonie — Dolci siciliani al miele`,`TerraTavola`,`carosello`,!1,!1),t(`2026-06-25`,`24`,`Fragole di Sicilia — Semifreddo estivo siciliano`,`FiorFiore`,`carosello`,!1,!1),t(`2026-06-26`,`25`,`Lancio Volantino Ciclo 6 (21→30 giu) + slide Fior Fiore`,`CoopPromo`,`carosello`,!0,!1)],r={nome:`Coop Gruppo Radenza`,settore:`Grande Distribuzione Organizzata — Supermercati Coop Sicilia`,anno:`1990`,sede:`Sicilia`,sito:`coopgrupporadenza.it`,descrizione:`Gruppo di supermercati Coop radicati in Sicilia. Presidio territoriale con forte attenzione ai prodotti locali DOP/IGP e alla linea premium Fior Fiore. Comunicazione su IG+FB con mix promo commerciale e contenuti identitari territoriali.`,differenziale:`Prodotti siciliani DOP/IGP autentici (Mandorle Avola, Pecorino Siciliano, Pistacchio Bronte, Capperi Pantelleria) + Linea Fior Fiore premium + valori cooperativi Coop`,target:`Famiglie siciliane 30-55 anni, clienti fedeli del punto vendita, appassionati di cucina e prodotti locali siciliani`,b2x:`B2C — Retail GDO`,canali_attuali:`Instagram, Facebook`,advertising:`Meta Ads attivo dal Ciclo 6 (18 giugno 2026) — precedentemente solo organico`,obiettivo1:`Bilanciare la comunicazione promo (Coop Promo) con contenuti identitari territoriali (Terra/Tavola, Fior Fiore) per costruire brand equity locale`,obiettivo2:`Generare engagement emotivo con i contenuti Coop Social (Lo Spesotto, Buono Se, Verde Speranza)`,budget:`ADV Meta da €1.200/mese dal Ciclo 6`},i={id:`demo-radenza-cal`,clientId:e,name:`Piano Editoriale Mag/Giu 2026`,pilastri:[{id:M(),nome:`Coop Promo`,colore:`#E3001B`,funnel:`BOFU`,kpi:`Click · CTR ADV · Reach`,cadenza:`Lancio per ciclo · mai 2 consecutivi`},{id:M(),nome:`Fior Fiore`,colore:`#D4A017`,funnel:`MOFU`,kpi:`Salvataggi · Views Reel · Commenti`,cadenza:`1/sett. · mai adiacente a urgenza`},{id:M(),nome:`Terra/Tavola`,colore:`#1B5E20`,funnel:`MOFU`,kpi:`Salvataggi · Condivisioni · Commenti`,cadenza:`1/sett. · alternato con Fior Fiore`},{id:M(),nome:`Istituzionale`,colore:`#0D4A78`,funnel:`TOFU`,kpi:`Reach · Condivisioni · Reazioni`,cadenza:`1-2/mese · rompe la griglia rossa`},{id:M(),nome:`Coop Social`,colore:`#145932`,funnel:`TOFU`,kpi:`Reaction · Interazioni · Condivisioni`,cadenza:`2-3/mese · mai 2 consecutivi`}],createdAt:Date.now(),interview:r,context:C(r),pdm:{sections:{}},pdc:{sections:{}},ed:{sections:{ped:{content:`## Piano Editoriale — Maggio/Giugno 2026

**25 uscite totali · 5 pilastri editoriali · 6 cicli promozionali**
Instagram · Facebook · ADV Meta (attivo dal Ciclo 6 — 18 giugno)

---

### Strategia editoriale

Il piano è strutturato su 5 pilastri complementari. La promozione commerciale (Coop Promo) è bilanciata da contenuti identitari — Fior Fiore, Produttori Locali, Coop Social — che costruiscono l'immagine di Coop Radenza come brand radicato nel territorio siciliano. I banner ADV sono attivi dal 18 giugno (Ciclo 6). Fino al Ciclo 5 tutta la comunicazione è organica.

---

### 01 — COOP PROMO 🔴
Il pilastro commerciale. Ogni ciclo promozionale (~10 giorni) viene comunicato con un carosello volantino e Stories di supporto. Per le scadenze (urgenza) la struttura è: Carosello + Stories + Reel.
**Cadenza:** 3 cicli/mese · Urgenza: Carosello + Stories + Reel · **ADV dal 18 giu**
**KPI:** Reach · Click · CTR ADV

### 02 — FIOR FIORE 🟡
La linea premium Coop declinata sulla stagionalità siciliana. Ogni settimana un prodotto fresco di stagione con ricetta tradizionale. Integrati anche nelle uscite volantino con slide dedicata.
**Cadenza:** 1 contenuto/settimana · alternato con Terra/Tavola
**KPI:** Salvataggi · Visualizzazioni Reel · Commenti

### 03 — DALLA TERRA ALLA TAVOLA 🗺️
I produttori locali siciliani DOP/IGP. Ogni contenuto racconta prodotto + storia di territorio + ricetta. Differenziale competitivo non replicabile dai competitor nazionali.
**Cadenza:** 1 contenuto/settimana · alternato con Fior Fiore
**KPI:** Salvataggi · Condivisioni · Commenti

### 04 — ISTITUZIONALE 🟠
Ricorrenze, giornate mondiali ed eventi territoriali (Fest. Repubblica 2/6, Ambiente 5/6, Festival Niscemi 13/6, Solstizio 21/6).
**Cadenza:** 1–2 contenuti/mese
**KPI:** Reach · Condivisioni · Reazioni

### 05 — COOP SOCIAL 🟢
Contenuti di brand per Reaction & Interazioni. Tono leggero, ironico, partecipativo. Include Lo Spesotto, Buono Se, Verde Speranza.
**Cadenza:** 2–3 contenuti nel periodo
**KPI:** Reaction · Interazioni · Condivisioni

---

### Distribuzione
| Pilastro | Uscite | % |
|---|---|---|
| Coop Promo | 9 | 36% |
| Fior Fiore | 4 | 16% |
| Terra/Tavola | 5 | 20% |
| Istituzionale | 4 | 16% |
| Coop Social | 3 | 12% |`,versions:[]}},contentItems:[],campagne:[],calendarEvents:[],perfLogs:[],feedItems:n,ideas:[],collaboratori:[]},tasks:[{id:M(),text:`Preparare grafiche Urgenza Ciclo 4 (9 giu)`,priority:`high`,tag:`Contenuti`,assignee:`Hermes`,done:!1,createdAt:Date.now()},{id:M(),text:`Testi carosello Pistacchio Bronte — storia produttore (6 giu)`,priority:`high`,tag:`Contenuti`,assignee:`Luca`,done:!1,createdAt:Date.now()},{id:M(),text:`Setup campagna ADV Meta per Ciclo 6 (dal 18 giu)`,priority:`med`,tag:`Tecnico`,assignee:`Paolone`,done:!1,createdAt:Date.now()},{id:M(),text:`Confermare con cliente materiali Festival Artisti Niscemi (13 giu)`,priority:`med`,tag:`Strategia`,assignee:`Alberto`,done:!1,createdAt:Date.now()},{id:M(),text:`Raccogliere dati Coop Verde Speranza per post 23 giu`,priority:`low`,tag:`Contenuti`,assignee:`Luca`,done:!1,createdAt:Date.now()}],milestones:[{id:M(),name:`Calendario Maggio approvato`,status:`done`,date:`2026-05-16`},{id:M(),name:`Ciclo 3 completato`,status:`done`,date:`2026-05-30`},{id:M(),name:`Ciclo 4 — lancio volantino`,status:`active`,date:`2026-06-03`},{id:M(),name:`ADV Meta attivo (Ciclo 6)`,status:`pending`,date:`2026-06-18`},{id:M(),name:`Piano Giugno completato`,status:`pending`,date:`2026-06-26`}],budget:{produzione:[{id:M(),label:`Grafica social mensile (Hermes)`,valore:800},{id:M(),label:`Copywriting e caption (Luca)`,valore:400},{id:M(),label:`Art direction mensile (Alberto)`,valore:300}],ads:{linkedin:0,google:0,meta:1200,altri:0},note:`ADV Meta attiva dal Ciclo 6 (18 giu). Fino al Ciclo 5 comunicazione 100% organica.`}};return{client:{id:e,nome:`Coop Gruppo Radenza`,referente:``,email:``,settore:`GDO — Supermercati Coop Sicilia`,pacchetto:`professional`,dataInizio:`2026-05-16`,social:{ig:`@coopgrupporadenza`,fb:`Coop Gruppo Radenza`,linkedin:``,tiktok:``,sito:`coopgrupporadenza.it`},meta:null,portal:{pin:``,mostraFeed:!0,mostraPipeline:!0},projectIds:[i.id],createdAt:Date.now()},project:i}}var Bt=[{id:`educare`,label:`📚 Educare`,color:`#006EFF`,desc:`Aumenta consapevolezza e competenza del pubblico`},{id:`fiducia`,label:`🤝 Generare Fiducia`,color:`#00C853`,desc:`Costruisce credibilità e autorità del brand`},{id:`obiezioni`,label:`⚔️ Distruggere Obiezioni`,color:`#FF6B00`,desc:`Smonta le resistenze all'acquisto`},{id:`scarsita`,label:`⏰ Creare Scarsità`,color:`#C800FF`,desc:`Urgenza e disponibilità limitata`},{id:`aspirazione`,label:`✨ Ispirare`,color:`#00B4D8`,desc:`Crea identificazione con uno stile di vita`},{id:`community`,label:`🔥 Attivare Community`,color:`#FF1744`,desc:`Stimola partecipazione e UGC`}],Vt=()=>Math.random().toString(36).slice(2,9);function Ht({SvgIconComponent:e,size:t=14}){return e?(0,G.jsx)(e,{name:`zap`,size:t,color:`var(--neon-magenta)`}):(0,G.jsx)(`span`,{"aria-hidden":`true`,style:{color:`var(--neon-magenta)`,fontWeight:800},children:`⚡`})}function Ut({project:e,onUpdate:t,SvgIconComponent:n}){let r=e.pdm?.communicationBridges||[],[i,a]=(0,U.useState)(!1),[o,s]=(0,U.useState)({obiettivo:``,bridge:`educare`,note:``});function c(n){t({...e,pdm:{...e.pdm||{},communicationBridges:n(e.pdm?.communicationBridges||[])}})}function l(){o.obiettivo.trim()&&(c(e=>[...e,{id:Vt(),...o,createdAt:Date.now()}]),a(!1),s({obiettivo:``,bridge:`educare`,note:``}))}function u(e){c(t=>t.filter(t=>t.id!==e))}return(0,G.jsxs)(`div`,{className:`cb-panel`,children:[(0,G.jsxs)(`div`,{className:`cb-panel-hdr`,children:[(0,G.jsxs)(`div`,{className:`cb-panel-title`,children:[(0,G.jsx)(Ht,{SvgIconComponent:n,size:14}),` Cascata Strategica — Communication Bridge`]}),(0,G.jsx)(`div`,{className:`cb-panel-sub`,children:`Ogni obiettivo marketing genera una leva psicologica per la comunicazione. Questi prompt guidano l'Editoriale.`})]}),r.length>0&&(0,G.jsx)(`div`,{className:`cb-list`,children:r.map(e=>{let t=Bt.find(t=>t.id===e.bridge)||Bt[0];return(0,G.jsxs)(`div`,{className:`cb-row`,style:{borderLeft:`3px solid `+t.color},children:[(0,G.jsxs)(`div`,{style:{flex:1},children:[(0,G.jsxs)(`div`,{className:`cb-row-obj`,children:[`🎯 `,e.obiettivo]}),(0,G.jsx)(`div`,{className:`cb-row-bridge`,style:{color:t.color},children:t.label}),(0,G.jsx)(`div`,{className:`cb-row-desc`,children:t.desc}),e.note&&(0,G.jsxs)(`div`,{className:`cb-row-note`,children:[`📝 `,e.note]})]}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{fontSize:12,padding:`3px 7px`},onClick:()=>u(e.id),children:`x`})]},e.id)})}),i?(0,G.jsxs)(`div`,{className:`cb-form`,children:[(0,G.jsxs)(`div`,{className:`fg`,style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Obiettivo marketing`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. +30% lead qualificati entro Q3`,value:o.obiettivo,onChange:e=>s(t=>({...t,obiettivo:e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Leva comunicativa`}),(0,G.jsx)(`div`,{className:`cb-bridge-grid`,children:Bt.map(e=>(0,G.jsx)(`button`,{className:`cb-bridge-opt `+(o.bridge===e.id?`active`:``),style:o.bridge===e.id?{borderColor:e.color,background:e.color+`15`,color:e.color}:{},onClick:()=>s(t=>({...t,bridge:e.id})),children:e.label},e.id))}),(0,G.jsx)(`div`,{className:`cb-bridge-hint`,children:Bt.find(e=>e.id===o.bridge)?.desc})]}),(0,G.jsxs)(`div`,{className:`fg`,style:{marginBottom:12},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Note per il team`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. focus sulla prova sociale, usare dati reali`,value:o.note,onChange:e=>s(t=>({...t,note:e.target.value}))})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:l,disabled:!o.obiettivo.trim(),children:`Aggiungi bridge`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>a(!1),children:`Annulla`})]})]}):(0,G.jsx)(`button`,{className:`btn-outline sm`,style:{marginTop:10},onClick:()=>a(!0),children:`+ Aggiungi Communication Bridge`})]})}function Wt({project:e,SvgIconComponent:t}){let n=e?.pdm?.communicationBridges||[],[r,i]=(0,U.useState)(!1);if(n.length===0)return null;let a=n.slice(0,2);return(0,G.jsxs)(`div`,{className:`scb-wrap`,children:[(0,G.jsxs)(`div`,{className:`scb-header`,onClick:()=>i(e=>!e),children:[(0,G.jsx)(Ht,{SvgIconComponent:t,size:13}),(0,G.jsx)(`span`,{className:`scb-label`,children:`Cascata Strategica attiva`}),(0,G.jsxs)(`div`,{className:`scb-pills`,children:[a.map(e=>{let t=Bt.find(t=>t.id===e.bridge)||Bt[0];return(0,G.jsx)(`span`,{className:`scb-pill`,style:{background:t.color+`18`,color:t.color,border:`1px solid `+t.color+`40`},children:t.label},e.id)}),n.length>2&&(0,G.jsxs)(`span`,{className:`scb-pill`,style:{background:`var(--bg2)`,color:`var(--ink4)`},children:[`+`,n.length-2]})]}),(0,G.jsx)(`span`,{className:`scb-chevron`,children:r?`▲`:`▼`})]}),r&&(0,G.jsxs)(`div`,{className:`scb-body`,children:[n.map(e=>{let t=Bt.find(t=>t.id===e.bridge)||Bt[0];return(0,G.jsxs)(`div`,{className:`scb-row`,style:{borderLeft:`3px solid `+t.color},children:[(0,G.jsxs)(`span`,{className:`scb-row-obj`,children:[`🎯 `,e.obiettivo]}),(0,G.jsx)(`span`,{className:`scb-row-arrow`,children:`→`}),(0,G.jsx)(`span`,{className:`scb-row-bridge`,style:{color:t.color},children:t.label}),e.note&&(0,G.jsxs)(`span`,{className:`scb-row-note`,children:[`· `,e.note]})]},e.id)}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:6,fontStyle:`italic`},children:`Queste leve guidano copy, formati e CTA di ogni post pianificato.`})]})]})}var J=`REGOLA DATI: Usa SOLO le informazioni presenti nell'input. Per ogni dato non fornito scrivi ⚠️ DA RILEVARE. Non inventare numeri, nomi, competitor o quote. Segnala chiaramente quando un'affermazione è un'ipotesi strategica vs un fatto verificato.`,Gt={executive_summary:e=>`${J}
Produci la sezione EXECUTIVE SUMMARY del Piano di Marketing in italiano con markdown.

## Executive Summary

### Il Contesto
[1-2 frasi sul mercato e sul problema che l'azienda risolve — dall'input]

### L'Azienda
[Chi è, cosa fa, da dove viene — basato sull'input]

### La Sfida Strategica
[Il problema centrale che questo piano risolve — dall'input]

### L'Approccio
[La logica strategica in 3-4 punti — dall'input]

### I KPI Chiave
| Obiettivo | Metrica | Target | Orizzonte |
|-----------|---------|--------|-----------|
[solo obiettivi esplicitati nell'input]

### Le 3 Priorità Immediate
1. [azione — con timeframe]
2. [azione — con timeframe]
3. [azione — con timeframe]

---
INPUT: ${e}`,analisi_interna:e=>`${J}
Produci la sezione ANALISI INTERNA in italiano con markdown.

## Analisi Interna

### Profilo Aziendale
| Campo | Dato |
|-------|------|
| Settore | [dall'input] |
| Anno fondazione | [dall'input o ⚠️ DA RILEVARE] |
| Dimensione | [dall'input o ⚠️ DA RILEVARE] |
| Sede | [dall'input] |
| Modello di business | [dall'input] |

### Portfolio Prodotti / Servizi
[Per ogni prodotto/servizio menzionato nell'input: nome, descrizione breve, target, pricing se disponibile]

### Punti di Forza (interni, verificabili)
[Solo quelli menzionati nell'input o chiaramente deducibili dal profilo aziendale]

### Punti di Debolezza (interni, verificabili)
[Solo quelli menzionati nell'input — mai inventare problemi non dichiarati]

### Asset Strategici
[Brevetti, certificazioni, tecnologie, relazioni, dati — dall'input o ⚠️ DA RILEVARE]

### Capacità Produttiva / Operativa
[Dall'input o ⚠️ DA RILEVARE — non inventare capacità]

---
INPUT: ${e}`,analisi_esterna:e=>`${J}
Produci la sezione ANALISI ESTERNA + PEST in italiano con markdown.

## Analisi Esterna + PEST

### Il Mercato
- **Dimensione TAM:** [dall'input o ⚠️ DA STIMARE con fonte]
- **Segmento SAM:** [dall'input o ⚠️ DA STIMARE]
- **Target realistico SOM:** [dall'input o ⚠️ DA STIMARE]
- **Trend primario:** [dal settore descritto nell'input]

### Analisi PEST

#### Politico-Legale
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore descritto — segnala se dedotti]

#### Economico
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

#### Socio-Culturale
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

#### Tecnologico
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

### Analisi Competitor
*Solo competitor menzionati nell'input — per gli altri ⚠️ DA RILEVARE*

| Competitor | Posizionamento | Punti di forza | Debolezze | Gap che occupiamo |
|------------|---------------|----------------|-----------|-------------------|
[compila solo con dati forniti nell'input]

### Opportunità di Mercato
[Derivate dall'analisi PEST e dai gap competitivi — segnala se ipotesi]

### Minacce di Mercato
[Derivate dall'analisi PEST e dal profilo competitivo]

---
INPUT: ${e}`,swot:e=>`${J}
Produci la sezione SWOT + MATRICE STRATEGICA in italiano con markdown.

## SWOT & Matrice Strategica

### SWOT
| | Positivo | Negativo |
|-|----------|----------|
| **Interno** | **Strengths** [punti di forza dall'input] | **Weaknesses** [debolezze dall'input] |
| **Esterno** | **Opportunities** [opportunità dall'input] | **Threats** [minacce dall'input] |

### Dettaglio

**Strengths (forze interne)**
[Elenco con breve motivazione — solo dall'input]

**Weaknesses (debolezze interne)**
[Elenco — solo dall'input, mai inventare]

**Opportunities (opportunità esterne)**
[Elenco derivato dal contesto di mercato]

**Threats (minacce esterne)**
[Elenco derivato dal contesto di mercato]

### Matrice Strategica
| | Opportunità | Minacce |
|-|-------------|---------|
| **Forze** | **SO — Sfrutta forze per cogliere opportunità** [2-3 azioni strategiche] | **ST — Usa forze per difendersi dalle minacce** [2-3 azioni] |
| **Debolezze** | **WO — Supera debolezze per cogliere opportunità** [2-3 azioni] | **WT — Minimizza debolezze ed evita minacce** [2-3 azioni] |

### Priorità Strategiche Emergenti
[Le 3 priorità più urgenti derivate dalla matrice — con motivazione]

---
INPUT: ${e}`,segmentazione:e=>`${J}
Produci la sezione SEGMENTAZIONE MERCATO in italiano con markdown.

## Segmentazione Mercato

### Variabili di Segmentazione
[Geografica / Demografica / Psicografica / Comportamentale — rilevanti per il settore descritto]

### Segmenti Identificati
*Solo segmenti supportati dai dati dell'input — non inventare*

#### Segmento 1: [nome derivato dall'input]
- **Dimensione stimata:** [dall'input o ⚠️ DA STIMARE con fonte]
- **Caratteristiche:** [dall'input]
- **Bisogno primario:** [dall'input]
- **Potenziale:** [Alto/Medio/Basso — motivato]
- **Attuale penetrazione:** [dall'input o ⚠️ DA RILEVARE]

[Ripeti per ogni segmento identificato dall'input]

### Matrice Priorità Segmenti
| Segmento | Dimensione | Accessibilità | Redditività | Priorità |
|----------|-----------|---------------|-------------|----------|
[solo segmenti dall'input]

### Segmento Primario — Focus Strategico
[Il segmento su cui concentrare le risorse — con motivazione basata sull'input]

---
INPUT: ${e}`,personas:e=>`${J}
Produci la sezione BUYER PERSONAS in italiano con markdown. Max 3 personas giustificate dall'input.

## Buyer Personas

---

### Persona 1: [Nome archetipico — dal target descritto nell'input]
*Archetipo basato sull'input — non una persona reale*

**Profilo**
- Età/ruolo: [dall'input o range plausibile per il settore]
- Contesto: [dall'input]

**Obiettivo primario:** [dall'input]
**Pain point principale:** [dall'input]
**Canali preferiti:** [dall'input o ⚠️ DA RILEVARE]

**⚡ Insight — La tensione irrisolta**
*Non il pain point — la cosa che lo blocca psicologicamente prima di decidere*
[frase che cattura la tensione specifica — basata sull'input]

**Messaggio leva:** "[frase che tocca esattamente quella tensione]"

**Cosa NON dire mai a questa persona**
[1-2 approcci che lo attivano negativamente]

**Sequenza funnel**
| Fase | Messaggio | CTA |
|------|-----------|-----|
| Awareness | [capisce il problema, non promuove] | — |
| Considerazione | [prova materiale del differenziale] | [CTA tecnica] |
| Conversione | [rimuove l'ultima barriera] | [CTA diretta] |

[Ripeti per Persona 2, Persona 3 — solo se giustificate dall'input]

---
INPUT: ${e}`,posizionamento_usp:e=>`${J}
Produci la sezione POSIZIONAMENTO + USP in italiano con markdown.

## Posizionamento + USP

### Insight Dominante
*Il denominatore comune tra tutte le personas — la tensione di mercato che il brand risolve*
[Una frase. Derivata dall'input. Non generica.]

### Formula USP
**"Per [target dall'input] che [problema dall'input], [brand] è l'unico [categoria] che [beneficio dall'input] perché [reason to believe dall'input o ⚠️ DA DEFINIRE]."**

### Brand Promise (Payoff operativo)
**"[frase breve e verificabile — non un aggettivo, una promessa]"**
Perché funziona: [spiegazione basata sull'input]

### Territorio di Posizionamento
- **Cosa siamo:** [dall'input]
- **Cosa NON siamo:** [dall'input o derivato dal posizionamento]
- **Con chi NON competeremo:** [scelte di focalizzazione]

### Matrice di Posizionamento
- Asse X: [variabile rilevante per il settore]
- Asse Y: [variabile rilevante per il settore]

| Competitor | Pos. X | Pos. Y | Note |
|------------|--------|--------|------|
| **[Brand]** | | | Il nostro spazio |
[solo competitor dall'input]

---
INPUT: ${e}`,obiettivi_smart:e=>`${J}
Produci la sezione OBIETTIVI SMART in italiano con markdown.

## Obiettivi SMART

*Ogni obiettivo: Specifico, Misurabile, Attuabile, Rilevante, Temporalizzato.*

### Obiettivi di Marketing (OM)

| Cod. | Obiettivo | Metrica | Baseline | Target | Scadenza | Priorità |
|------|-----------|---------|----------|--------|----------|----------|
| OM1 | [dall'input] | [KPI] | [⚠️ Da rilevare o dall'input] | [target] | [scadenza] | Alta |
[solo obiettivi esplicitati nell'input — mai inventare target]

### Obiettivi di Comunicazione (OC)
*Traduzione degli OM in obiettivi comunicativi: Cognitivo / Affettivo / Comportamentale*

| Cod. | Tipo | OC derivato da | Obiettivo | Metrica | Orizzonte |
|------|------|----------------|-----------|---------|-----------|
| OC1 | Cognitivo | OM? | [far sapere — rendere verificabile il posizionamento] | [metrica] | [orizzonte] |
| OC2 | Affettivo | OM? | [far sentire — costruire fiducia prima della conversazione] | [metrica] | [orizzonte] |
| OC3 | Comportamentale | OM? | [far fare — qualificare il lead prima del contatto] | [metrica] | [orizzonte] |

### Logica della Traduzione OM → OC
[Spiega perché ogni OC serve a raggiungere l'OM corrispondente]

---
INPUT: ${e}`,marketing_mix_7p:e=>`${J}
Produci la sezione MARKETING MIX 7P in italiano con markdown.

## Marketing Mix 7P

### Product (Prodotto)
- **Core product:** [dall'input]
- **Differenziali:** [dall'input]
- **Proof points:** [dall'input o ⚠️ DA RACCOGLIERE]

### Price (Prezzo)
- **Strategia di pricing:** [dall'input — premium/penetrazione/valore]
- **Range:** [dall'input o ⚠️ DA DEFINIRE]
- **Confronto con competitor:** [dall'input o ⚠️ DA RILEVARE]

### Place (Distribuzione)
- **Canali:** [dall'input]
- **Copertura:** [dall'input]
- **Intermediari:** [dall'input o ⚠️ DA DEFINIRE]

### Promotion (Comunicazione)
- **Mix comunicativo:** [dall'input]
- **Canali prioritari:** [dall'input]
- **Messaggio chiave:** [dalla Brand Promise]

### People (Persone)
- **Team front-line:** [dall'input]
- **Standard di servizio:** [dall'input o ⚠️ DA DEFINIRE]

### Process (Processo)
- **Customer journey:** [dall'input]
- **Pain points del processo:** [dall'input o ⚠️ DA MAPPARE]

### Physical Evidence (Evidenza fisica)
- **Touchpoint fisici/digitali:** [dall'input]
- **Standard visivi:** [dall'input o ⚠️ DA DEFINIRE]

---
INPUT: ${e}`,canali_media_mix:e=>`${J}
Produci la sezione CANALI & MEDIA MIX in italiano con markdown.

## Canali & Media Mix

### Architettura OEPS
| Tipo | Canale | Obiettivo | Budget % | Controllo | Priorità |
|------|--------|-----------|----------|-----------|----------|
| Owned | [sito, blog, email] | [dall'input] | Solo produzione | Totale | |
| Earned | [PR, referral, menzioni] | [dall'input] | Solo tempo | Zero | |
| Paid | [Ads] | [dall'input] | [dall'input o ⚠️] | Parziale | |
| Shared | [eventi, partner] | [dall'input] | [dall'input o ⚠️] | Condiviso | |

### Priorità Canali per Fase Funnel
| Canale | Fonte | TOFU | MOFU | BOFU | Buyer primario |
|--------|-------|------|------|------|----------------|
[solo canali menzionati nell'input]

### Scheda per Canale Prioritario

#### [Canale 1 — identificato dall'input]
- **Ruolo:** [awareness/lead gen/conversione/retention]
- **Buyer target:** [dalla segmentazione]
- **Frequenza:** [standard di settore]
- **KPI:** [metriche chiave]
- **Budget stimato:** [dall'input o ⚠️ DA DEFINIRE]
- **Condizione di attivazione:** [cosa deve essere pronto prima di attivare]

[Ripeti per canali rilevanti]

### Piano ADV — Targeting per Campagna
*Solo se ADV menzionato nell'input*

| Campagna | Buyer | Piattaforma | Targeting | CPLQ target | Condizione attivazione |
|----------|-------|-------------|-----------|-------------|----------------------|
[dall'input o ⚠️ DA DEFINIRE con il cliente]

---
INPUT: ${e}`,value_proposition:e=>`${J}
Produci la sezione VALUE PROPOSITION CANVAS in italiano con markdown.

## Value Proposition Canvas

### Profilo Cliente (per il buyer primario)

**Jobs to be done** *(cosa sta cercando di fare — funzionale, sociale, emotivo)*
[dall'input]

**Pains** *(frustrazioni, rischi, ostacoli)*
[dall'input]

**Gains** *(benefici desiderati, aspettative, sorprese positive)*
[dall'input]

### Mappa del Valore

**Pain relievers** *(come il prodotto allevia i pain)*
[dall'input — con corrispondenza esplicita ai pain identificati]

**Gain creators** *(come crea i gain desiderati)*
[dall'input — con corrispondenza ai gain identificati]

**Products & Services** *(le offerte concrete che generano valore)*
[dall'input]

### Fit Strategico
*Dove c'è il fit più forte — e dove mancano ancora prove materiali*

| Pain/Gain | Coperto da | Prova materiale | Stato |
|-----------|-----------|-----------------|-------|
[dall'input — segnala ⚠️ dove mancano prove]

---
INPUT: ${e}`,funnel_strategy:e=>`${J}
Produci la sezione FUNNEL STRATEGY completa in italiano con markdown. Ogni stage deve avere obiettivi SMART, non generici.

## Funnel Strategy — TOFU / MOFU / BOFU

### Distribuzione target contenuti
| Stage | % target mensile | Obiettivo primario | KPI di riferimento |
|---|---|---|---|
| **TOFU** (Awareness) | [%] | [obiettivo SMART — es. +500 impression/sett su LI] | [KPI — es. Reach, Impression, Follower growth] |
| **MOFU** (Consideration) | [%] | [obiettivo SMART — es. 50 download Library/mese] | [KPI — es. CTR, Download, Email open rate] |
| **BOFU** (Conversion) | [%] | [obiettivo SMART — es. 10 richieste preventivo/mese] | [KPI — es. Lead qualificati, CPL, Conversion rate] |

*Nota: le % devono sommare 100%. Base di partenza: TOFU 40% · MOFU 40% · BOFU 20% — adatta al settore e stadio del brand.*

### Target audience per stage

**TOFU — Chi stiamo attirando**
- Profilo: [ruolo, settore, dimensione azienda]
- Consapevolezza del problema: [nulla / generica / presente]
- Trigger di ingresso nel funnel: [evento o momento che li porta a cercare]

**MOFU — Chi stiamo qualificando**
- Profilo: [differenza rispetto al TOFU — già sa del problema]
- Obiezioni principali: [perché non ha ancora scelto noi]
- Contenuti che li convertono da TOFU a MOFU: [tipo di contenuto]

**BOFU — Chi stiamo convertendo**
- Profilo: [già conosce la soluzione, valuta i fornitori]
- Decisore vs influencer: [chi firma l'acquisto vs chi raccomanda]
- Barriera finale all'acquisto: [paura del rischio, prezzo, timing, procurement]

### KPI per stage con target numerico
| Stage | KPI | Target mensile | Frequenza misurazione |
|---|---|---|---|
| TOFU | [es. Reach LinkedIn] | [numero] | [settimanale/mensile] |
| MOFU | [es. CTR su contenuti educativi] | [%] | [settimanale] |
| BOFU | [es. Lead qualificati] | [numero] | [settimanale] |

### Durata media per stage
- Da TOFU a MOFU: [stima in giorni/settimane — basata sul ciclo di vendita]
- Da MOFU a BOFU: [stima]
- Da BOFU a cliente: [stima]

### Canali per stage
| Stage | Canale primario | Canale secondario | Formato preferito |
|---|---|---|---|
| TOFU | [es. LinkedIn organico] | [es. SEO / Google] | [es. Post educativi, Reel] |
| MOFU | [es. Email / Newsletter] | [es. LinkedIn Ads retargeting] | [es. Carousel, Webinar, Case study] |
| BOFU | [es. Sales enablement] | [es. Google Search intent] | [es. Testimonial, Demo, Offerta] |

---
INPUT: ${e}`,pricing_strategy:e=>`${J}
Produci la sezione PRICING STRATEGY in italiano con markdown.

## Pricing Strategy

### Posizionamento di Prezzo
[Dall'input: premium / valore / penetrazione / skimming — con motivazione]

### Struttura di Pricing
| Prodotto/Servizio | Prezzo | Logica | Confronto competitor |
|-------------------|--------|--------|---------------------|
[dall'input — per prezzi non noti: ⚠️ DA DEFINIRE]

### Modello di Revenue
[Dall'input: transazionale / abbonamento / retainer / progetto / freemium]

### Elasticità al Prezzo
[Basata sul profilo del buyer primario e sul settore — segnala se ipotesi]

### Politica Sconti e Condizioni
[Dall'input o ⚠️ DA DEFINIRE]

### Pricing vs Competitor
[Solo se competitor e prezzi sono nell'input — altrimenti ⚠️ DA RILEVARE]

---
INPUT: ${e}`,piano_operativo:e=>`${J}
Produci la sezione PIANO OPERATIVO in italiano con markdown.

## Piano Operativo

### Fase 1 — Setup (Mese 1-2)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
|--------|-------------|-------------|----------|-----------|
[azioni di setup necessarie basate sull'input]

### Fase 2 — Lancio (Mese 2-4)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
[azioni di lancio basate sull'input]

### Fase 3 — Crescita (Mese 4-12)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
[azioni di crescita basate sull'input]

### Team e Risorse Necessarie
| Ruolo | Interno/Esterno | Ore/mese stimate | Costo mensile |
|-------|----------------|-----------------|---------------|
[dall'input o stime standard per il tipo di business]

### Dipendenze Critiche
[Cosa deve essere fatto prima che altre azioni possano partire]

### Rischi e Contingenze
| Rischio | Prob. | Impatto | Piano B |
|---------|-------|---------|---------|
[3-5 rischi realistici per il tipo di business descritto]

---
INPUT: ${e}`,lead_nurturing:e=>`${J}
Produci la sezione LEAD NURTURING FLOWS in italiano con markdown.

## Lead Nurturing Flows

### Logica del Nurturing
[Dall'input: come si qualifica un lead, quanto dura il ciclo di vendita, chi decide]

### Flow 1 — [Nome flusso — derivato dal buyer primario dell'input]

**Trigger:** [cosa attiva il flow — es. download risorsa, form contatto]
**Buyer:** [persona di riferimento]
**Durata:** [giorni/settimane]

| Step | Canale | Messaggio | CTA | Timing |
|------|--------|-----------|-----|--------|
| 1 | [email/LinkedIn/etc] | [messaggio non commerciale — porta valore] | [CTA tecnica] | Giorno 0 |
| 2 | | | | Giorno 3 |
| 3 | | | | Giorno 7 |
| 4 | | | [CTA commerciale] | Giorno 14 |

**Condizione di uscita dal flow:** [qualificato / non qualificato / silenzio]

[Aggiungi Flow 2 per buyer secondario se giustificato dall'input]

### Criteri di Qualificazione Lead
| Criterio | Segnale | Strumento |
|----------|---------|-----------|
[dall'input o standard per il settore]

### DM Template — Risposta al Lead Qualificato
[Template concreto per il primo contatto con lead qualificato — calibrato sul buyer primario dell'input]

---
INPUT: ${e}`,roadmap:e=>`${J}
Produci la sezione ROADMAP MILESTONES in italiano con markdown.

## Roadmap Milestones

### Timeline Visiva

**Q1 (Mesi 1-3)**
- [ ] [Milestone 1 — deliverable concreto]
- [ ] [Milestone 2]
- [ ] [Milestone 3]

**Q2 (Mesi 4-6)**
- [ ] [Milestone 1]
- [ ] [Milestone 2]

**Q3 (Mesi 7-9)**
- [ ] [Milestone 1]
- [ ] [Milestone 2]

**Q4 (Mesi 10-12)**
- [ ] [Milestone 1]
- [ ] Review annuale e piano anno successivo

### Milestone Critiche — Gate Go/No-Go
| Milestone | Criteri di successo | Data | Decisione se KO |
|-----------|---------------------|------|-----------------|
[le 3-4 milestone che bloccano le fasi successive]

### Quick Wins (prime 30 giorni)
[3-5 azioni ad alto impatto e bassa complessità eseguibili subito]

---
INPUT: ${e}`,tech_stack:e=>`${J}
Produci la sezione TECH STACK MARKETING in italiano con markdown.

## Tech Stack Marketing

*Una funzione = uno strumento. Niente tool ridondanti.*

| Funzione | Tool raccomandato | Alternativa | Costo/mese | Priorità |
|----------|------------------|-------------|------------|----------|
| CRM / Pipeline | [dall'input o raccomandazione per il settore] | | | Alta |
| Email marketing | | | | Alta |
| Analytics | Google Analytics 4 | | Gratuito | Alta |
| Social scheduling | [dall'input o raccomandazione] | | | Media |
| ADV tracking | Meta Pixel + GA4 | | Gratuito | Alta |
| Project management | [dall'input o raccomandazione] | | | Media |
| Design contenuti | | | | Media |
[integra con tool menzionati nell'input]

### Integrazioni Critiche
[Come i tool comunicano tra loro — pipeline dati]

### Stack Minimale (budget limitato)
[Configurazione con 3-4 tool essenziali per iniziare senza sprechi]

### Setup e Tempi di Configurazione
| Tool | Tempo setup | Chi lo configura | Priorità |
|------|-------------|-----------------|----------|
[stime realistiche]

---
INPUT: ${e}`,kpi_dashboard:e=>`${J}
Produci la sezione KPI DASHBOARD in italiano con markdown.

## KPI Dashboard

### Livello 1 — Business KPI (mensili — per il CEO)
| KPI | Come si misura | Baseline | Target Q4 | Tool |
|-----|---------------|----------|-----------|------|
| Fatturato da canali digitali | | ⚠️ Da rilevare | | CRM |
| Numero lead qualificati/mese | | ⚠️ Da rilevare | | CRM |
| Costo per Lead Qualificato (CPLQ) | | ⚠️ Da rilevare | | Ads Manager |
| Tasso di conversione lead→cliente | | ⚠️ Da rilevare | | CRM |
[adatta ai KPI esplicitati nell'input]

### Livello 2 — Marketing KPI (settimanali — per il team)
| KPI | Canale | Come si misura | Target | Frequenza |
|-----|--------|---------------|--------|-----------|
[KPI operativi per i canali identificati nell'input]

### Livello 3 — Content KPI (per contenuto)
| KPI | Cosa misura | Benchmark | Target |
|-----|-------------|-----------|--------|
| Save rate | Contenuti salvati / reach | [settore] | |
| Click rate | Click / reach | [settore] | |
[adatta al tipo di contenuto e canali]

### Sanity Check Mensile
*La domanda unica che vale più di tutti i report:*
"[una domanda specifica che verifica se la comunicazione sta raggiungendo il buyer giusto — dall'input]"

### Soglie di Allerta — Kill Switch
| Metrica | Soglia critica | Durata | Azione |
|---------|---------------|--------|--------|
| CPLQ | > 2x target | 7 giorni | Pausa campagna + revisione |
[3-5 soglie operative]

---
INPUT: ${e}`,budget_media:e=>`${J}
Produci la sezione BUDGET & MEDIA PLAN in italiano con markdown.

## Budget & Media Plan

### Scenari di Investimento

| Voce | Scenario Conservativo | Scenario Medio | Scenario Ottimale |
|------|-----------------------|----------------|-------------------|
| Produzione contenuti/mese | [stima] | [stima] | [stima] |
| Budget Ads/mese | [dall'input o stima] | | |
| Tool e software/mese | [stima] | | |
| Personale/consulenze/mese | [dall'input o ⚠️ DA DEFINIRE] | | |
| **TOTALE/MESE** | | | |
| **TOTALE/ANNO** | | | |

*⚠️ Budget dall'input: [cifra se fornita — altrimenti indicare range tipico per il settore]*

### Allocazione Budget Ads per Canale
| Canale | % budget Ads | CPLQ target | Condizione attivazione |
|--------|-------------|-------------|----------------------|
[solo canali Ads identificati nell'input]

### Costi una Tantum (setup)
| Voce | Costo stimato | Priorità |
|------|--------------|----------|
| Setup analytics + pixel | [stima] | Alta |
| Shooting fotografico/video | [dall'input o ⚠️] | |
[integra con quanto emerge dall'input]

### ROI Atteso
| Scenario | Investimento annuale | Lead attesi | Clienti attesi | ROAS stimato |
|----------|---------------------|-------------|----------------|-------------|
[solo se ci sono abbastanza dati nell'input — altrimenti ⚠️ DA CALCOLARE con dati reali]

### 3 Decisioni da Prendere Subito
1. [decisione su budget/scenario da scegliere]
2. [decisione su interno vs esterno]
3. [decisione su tool/configurazione]

---
INPUT: ${e}`,cac_ltv:e=>`${J}
Produci la sezione CAC & LTV / UNIT ECONOMICS in italiano con markdown.

## CAC & LTV — Unit Economics del Business

### Definizioni Operative
| Metrica | Formula | Valore Attuale/Stimato | Fonte |
|---------|---------|----------------------|-------|
| **CAC** (Costo Acquisizione Cliente) | Tot.Spesa Marketing+Sales / Nuovi Clienti | [dall'input o ⚠️ DA MISURARE] | |
| **LTV** (Lifetime Value) | Scontrino medio × Frequenza × Durata relazione | [dall'input o ⚠️ DA CALCOLARE] | |
| **LTV/CAC Ratio** | LTV ÷ CAC | [Target: ≥3x] | |
| **Payback Period** | CAC ÷ Margine mensile per cliente | [Target: <12 mesi] | |
| **Churn Rate** | % clienti persi/mese | [dall'input o benchmark settore] | |

### Benchmark di Settore
[inserisci i benchmark tipici per il settore specifico del cliente]

### Scenari di Ottimizzazione
| Leva | Azione | Impatto su LTV/CAC | Priorità |
|------|--------|-------------------|----------|
| Aumentare LTV | [es. upsell, abbonamento, fidelity] | +X% | |
| Ridurre CAC | [es. referral, SEO, community] | -X% | |
| Ridurre Churn | [es. onboarding migliorato, customer success] | +X% LTV | |

### 3 Decisioni Strategiche
1. [soglia CAC sostenibile per canale]
2. [mix acquisition vs retention]
3. [investimento in LTV extension]

---
INPUT: ${e}`},Kt={obiettivi_comunicativi:e=>`${J}
Produci la sezione OBIETTIVI COMUNICATIVI in italiano con markdown.

## Obiettivi Comunicativi

### La Logica della Traduzione
*Gli obiettivi di marketing dicono cosa ottenere. Gli obiettivi di comunicazione dicono cosa deve fare la comunicazione per ottenerlo. Non sono la stessa cosa.*

### Dalla Matrice OM → OC
| OC | Tipo | Deriva da | Obiettivo | Metrica primaria | Orizzonte |
|----|------|-----------|-----------|-----------------|-----------|
| OC1 | Cognitivo | [OM?] | [rendere verificabile il posizionamento] | [metrica] | [6-9 mesi] |
| OC2 | Cognitivo | [OM?] | [costruire riconoscibilità nel cluster] | [metrica] | [12-18 mesi] |
| OC3 | Comportamentale | [OM?] | [qualificare il lead prima del contatto] | [metrica] | [3-6 mesi] |
| OC4 | Affettivo | [OM?] | [costruire fiducia prima della conversazione] | [metrica] | [6-12 mesi] |
| OC5 | Comportamentale | [OM?] | [internazionalizzare / espandere] | [metrica] | [9-12 mesi] |

*Adatta il numero e il tipo di OC agli obiettivi reali dell'input*

### La Sequenza Logica
[Spiega la logica causale: quale OC deve essere raggiunto prima degli altri e perché]

### Cosa la Comunicazione NON deve fare
[Basato sull'input: 3-4 cose da evitare esplicitamente]

---
INPUT: ${e}`,contesto_comunicativo:e=>`${J}
Produci la sezione ANALISI CONTESTO COMUNICATIVO in italiano con markdown.

## Contesto Comunicativo

### Situazione di Partenza
[Dal brief: gap tra identità reale e percezione esterna, punti critici della comunicazione attuale]

### Come Comunicano i Competitor
*Solo competitor menzionati nell'input — per gli altri ⚠️ DA RILEVARE*

| Competitor | Canale primario | Registro | Frequenza | Gap che occupiamo |
|------------|----------------|---------|-----------|-------------------|
[dall'input]

**La finestra competitiva:**
[Lo spazio libero identificato dall'analisi — segnala se ipotesi]

### Mappatura Stakeholder
| Stakeholder | Tipo | Priorità | Bisogno informativo | Canale preferito |
|-------------|------|---------|---------------------|-----------------|
| [Clienti primari] | Cliente | Alta | | |
| [Media di settore] | Media | Alta | | |
| [Partner] | Partner | Media | | |
| [Team interno] | Interno | Media | Brand ambassador del posizionamento |  |
[adatta agli stakeholder rilevanti per il business descritto]

### Baseline Comunicativa da Rilevare
*Prima di attivare qualsiasi campagna*
[Lista di dati da misurare: follower, ER, traffico, posizione keyword — adattata ai canali dell'input]

---
INPUT: ${e}`,creative_territory:e=>`${J}
Produci la sezione CREATIVE TERRITORY in italiano con markdown.

## Creative Territory

*Lo spazio mentale in cui il brand deve vivere nella testa del buyer. Viene prima del tono di voce. Orienta ogni scelta comunicativa.*

### La Tensione di Mercato
*Il problema strutturale del mercato che il brand risolve — non con aggettivi, con un dato o un'osservazione verificabile*
[Una frase. Non generica. Derivata dall'input.]

### La Promessa
*Cosa fa il brand di diverso da tutti gli altri — verificabile, non solo dichiarato*
[Una frase. Con un verbo di azione. Non "siamo" — "facciamo" / "dimostriamo" / "documentiamo"]

### Le Prove Materiali
*Le cose concrete che rendono la promessa credibile — non aggettivi, asset verificabili*

**Prova 1 — [nome]**
"[come si dimostra — dall'input]"

**Prova 2 — [nome]**
"[come si dimostra]"

**Prova 3 — [nome]**
"[come si dimostra]"

[Aggiungi Prova 4 solo se giustificata dall'input]

### Il Territorio in una Frase
*La guida rapida per chiunque produca comunicazione*
**"[Frase operativa — corta, verificabile, non un aggettivo]"**

### Coordinate Visive Essenziali
| Elemento | Standard | Cosa sì | Cosa no |
|----------|---------|---------|---------|
| Palette | [dall'input o ⚠️ DA DEFINIRE] | | |
| Tipografia | | | |
| Fotografia | | | |
| Tono visivo | | | |

---
INPUT: ${e}`,tone_of_voice:e=>`${J}
Produci la sezione TONE OF VOICE — REGOLE OPERATIVE in italiano con markdown.

## Tone of Voice — Regole Operative

*Non è una descrizione del tono — sono istruzioni per chi produce contenuti. Ogni regola ha un esempio concreto.*

### Posizionamento — Scala Nielsen
| Dimensione | Polo A | 1 | 2 | 3 | 4 | 5 | Polo B |
|---|---|---|---|---|---|---|---|
| Registro | Informale | | | | | | Formale |
| Tono | Divertente | | | | | | Serio |
| Rispetto | Irriverente | | | | | | Rispettoso |
| Energia | Entusiasta | | | | | | Distaccato |
**Posizione:** [motivata dall'input] · **Identità sonora:** [5 aggettivi]

---

**Regola 1 — [titolo derivato dall'input]**
- ❌ "[esempio sbagliato — concreto per il settore]"
- ✅ "[esempio corretto — concreto per il settore]"

**Regola 2 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 3 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 4 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 5 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

[Aggiungi Regola 6-8 solo se giustificate dall'input]

### Parametri Grammaticali
- Pronome: [dall'input] · Emoji: [sì/no — con criterio] · Lunghezza caption: [per canale]
- Parole vietate: [dall'input + evidenti per il settore]
- Aperture: [sempre dichiarative / mai retoriche?]

### Il Brand è / Non è
| È | Non è |
|---|-------|
[almeno 5 righe — dall'input]

---
INPUT: ${e}`,message_house:e=>`${J}
Produci la sezione MESSAGE HOUSE in italiano con markdown.

## Message House

### TETTO — Brand Promise
*La frase che unifica tutta la comunicazione. Corta. Verificabile. Non un aggettivo.*
**"[brand promise — dall'input]"**

---

### Pilastro 1: [nome — dall'input]
**Messaggio:** [frase concreta]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

### Pilastro 2: [nome]
**Messaggio:** [frase]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

### Pilastro 3: [nome]
**Messaggio:** [frase]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

[Aggiungi Pilastro 4 solo se giustificato dall'input]

---

### Reason Why — Sistema di Prove
| Livello | Reason Why | Prova materiale | Buyer primario | Fase funnel |
|---------|-----------|-----------------|----------------|-------------|
| Primaria | [la prova più forte e immediata — dall'input] | | | Considerazione |
| Strutturale | [garanzia di processo — dall'input] | | | Valutazione |
| Distintiva | [focalizzazione dichiarata — dall'input] | | | Awareness |

---

### Declinazione per Buyer
| Buyer | Pilastro primario | Pilastro secondario | Prova da esibire subito |
|-------|-------------------|---------------------|------------------------|
[solo per le personas identificate nell'input]

### Cosa Dire vs Cosa NON Dire
| ✅ Dire | ❌ Non dire mai |
|--------|----------------|
[almeno 5 righe — dall'input]

---
INPUT: ${e}`,copy_strategy:e=>`${J}
Produci la sezione MASTER COPY STRATEGY in italiano con markdown.

## Master Copy Strategy
*La bussola per ogni pezzo di comunicazione. Risponde a: perché un buyer dovrebbe scegliere noi invece di qualsiasi altro?*

### 1. Il Contesto Competitivo
[Il problema strutturale del mercato — dall'input]

### 2. L'Insight Dominante
*Il denominatore comune tra tutte le personas. Non è ovvio — è il punto di leva che il mercato ignora.*
**"[frase che cattura la tensione profonda di mercato]"**

| Persona | Tensione | Denominatore |
|---------|----------|--------------|
[dall'input]

### 3. L'Obiettivo di Comunicazione
*Cosa deve pensare il target dopo ogni contatto con la comunicazione:*
**"[frase in prima persona del buyer]"**

| Livello | Obiettivo | Come si misura |
|---------|-----------|----------------|
| Cognitivo | [far sapere] | [metrica] |
| Affettivo | [far sentire] | [metrica] |
| Comportamentale | [far fare] | [metrica] |

### 4. La Promessa Principale
**Versione lunga:** "[promessa completa — interna, per il copywriter]"
**Versione breve:** "[claim operativo — per headline]"
**Payoff pubblico:** "[payoff ufficiale]"

### 5. Mandatories

**MUST HAVE — sempre presenti**
- M1: [un dato verificabile in ogni pezzo di comunicazione]
- M2: [il payoff ufficiale in ogni documento pubblico]
- M3: [gerarchia dei valori rispettata]
- M4: [prova materiale per ogni affermazione tecnica]
- M5: [validazione di chi ha competenza per ogni claim tecnico]

**MUST NOT — mai**
- MN1: Aggettivi senza prova: [lista]
- MN2: [cosa non comunicare mai come identità primaria]
- MN3: [formato/stile incompatibile con il posizionamento]
- MN4: Aperture retoriche — sempre dichiarative
- MN5: [linguaggio che segnalizza il profilo sbagliato]

---
INPUT: ${e}`,buyer_insights:e=>`${J}
Produci la sezione BUYER INSIGHTS in italiano con markdown. Per ogni persona: insight specifico, tensione, messaggio leva, cosa non dire, sequenza funnel.

## Buyer Insights

*L'insight non è la descrizione del buyer — è la tensione irrisolta nella sua testa. È il punto di leva del messaggio.*

---

### [Persona 1 — dal target dell'input]

**Insight:** *"[la tensione in prima persona — cosa pensa quando valuta un fornitore]"*

**Promessa declinata per questa persona:**
*"[come si traduce la brand promise per questa persona specifica]"*

**Reason Why specifica:** [la prova materiale che questa persona cerca — dall'input]

**Messaggio chiave operativo:** *"[frase usabile direttamente in comunicazione]"*

**Cosa NON dire mai a questa persona**
- ❌ "[frase che lo attiva negativamente — con motivazione]"
- ❌ "[altra frase da evitare]"

**Sequenza messaggi**
| Fase | Messaggio | CTA |
|------|-----------|-----|
| Awareness | [capisce il problema] | — |
| Considerazione | [prova materiale] | [CTA tecnica] |
| Conversione | [rimuove barriera specifica] | [CTA diretta] |

[Ripeti per ogni persona identificata nell'input]

---
INPUT: ${e}`,architettura_canali:e=>`${J}
Produci la sezione ARCHITETTURA CANALI (OEPS) in italiano con markdown.

## Architettura Canali — OEPS

### La Regola del Mix
*Prima si costruisce l'Owned. Poi si investe nel Paid per accelerare. Gli Earned arrivano come conseguenza della qualità dell'Owned. Gli Shared si presidiano con continuità.*

### OWNED — Costruzione e Presidio
| Asset | Obiettivo | Frequenza | Responsabile |
|-------|-----------|-----------|-------------|
[dall'input — per ogni asset owned identificato]

### EARNED — Guadagnato con Qualità
| Canale Earned | Obiettivo | Output atteso | Chi lo genera |
|---------------|-----------|---------------|--------------|
[dall'input — PR, referral, menzioni spontanee]

### PAID — Acquistato per Amplificare
| Campagna | Buyer | Piattaforma | % Budget Ads | CPLQ target |
|----------|-------|-------------|-------------|-------------|
[dall'input — solo canali Ads identificati]

### SHARED — Condiviso con Partner
| Partner/Canale | Tipo | Opportunità | Output |
|----------------|------|-------------|--------|
[dall'input — eventi, associazioni, partnership]

### Piano ADV Dettagliato
*Targeting per campagna prioritaria*

**Campagna [nome — dalla buyer primaria]**
| Parametro | Valore |
|-----------|--------|
| Job title / Interesse | [dall'input] |
| Settore | [dall'input] |
| Paesi | [dall'input] |
| Formato | [dall'input] |
| CPLQ target | [dall'input o ⚠️ DA DEFINIRE] |
| Condizione attivazione | [cosa deve essere pronto prima di attivare] |

### Soglie di Intervento — Kill Switch
| Livello | Condizione | Azione | Tempistica |
|---------|-----------|--------|-----------|
| 🔴 | CPLQ > 2x target per 7 giorni | Pausa + revisione | Entro 7gg |
| 🔴 | CTR < soglia per 14 giorni | A/B test | Entro 14gg |
| 🟡 | Lead < 50% target per 30gg | Revisione audience | Entro 1 mese |

---
INPUT: ${e}`,piano_editoriale_canale:e=>`${J}
Produci la sezione PIANO EDITORIALE PER CANALE in italiano con markdown.

## Piano Editoriale per Canale

*Per ogni canale attivo: pilastri editoriali, frequenza, struttura dei contenuti, KPI.*

---

### [Canale 1 — identificato dall'input, es. LinkedIn Pagina]
**Ruolo:** [brand authority / lead gen / awareness — dall'input]
**Buyer target:** [dalla segmentazione]
**Frequenza:** [post/settimana — standard per il canale e le risorse disponibili]

| Pilastro | % contenuti | Frequenza | Esempio di contenuto |
|----------|------------|-----------|---------------------|
| [Pilastro A] | [%] | [1/sett] | [esempio concreto — coerente col settore] |
| [Pilastro B] | [%] | [1/sett] | [esempio] |
| [Pilastro C] | [%] | [1/1,5 sett] | [esempio] |

**Struttura del post [canale]:**
[Regole operative specifiche per questo canale — riga 1, spazio bianco, sviluppo, chiusura]

**KPI specifici:**
| KPI | Baseline | Target 6m | Target 12m |
|-----|----------|-----------|-----------|
[metriche chiave per il canale]

---

### [Canale 2 — se identificato nell'input]
[Struttura analoga]

---

### Hashtag Strategy
| Hashtag | Canale | Pilastro | Competizione | Quando |
|---------|--------|---------|--------------|--------|
[dall'input o adattato al settore]

**Hashtag proprietario da costruire:** [suggerisce un hashtag di brand]

### Community Management
| Tipo interazione | Chi gestisce | Tempistica | Escalation |
|-----------------|-------------|-----------|-----------|
[dall'input o standard per il settore]

---
INPUT: ${e}`,campaign_moments:e=>`${J}
Produci la sezione CAMPAIGN MOMENTS in italiano con markdown.

## Campaign Moments

*I Campaign Moments non sono campagne pubblicitarie — sono momenti comunicativi concentrati con big idea unificante, arco narrativo, durata definita e KPI propri. Distinti dall'always-on.*

---

### CM1 — [Nome — derivato da un momento strategico dell'input]
**Periodo:** [mesi/stagione — dall'input]
**Big Idea:** *"[la frase unificante — coerente con il brand promise]"*
**Trigger:** [perché proprio questo momento — lancio, evento, stagionalità, traguardo]
**Obiettivo:** [specifico e misurabile]

| Canale | Fase pre | Fase lancio | Fase profondità | Coda |
|--------|---------|------------|-----------------|------|
[canali attivi per questa campagna]

**KPI specifici:**
| KPI | Target 30gg | Target 90gg |
|-----|------------|------------|
[KPI propri di questa campagna]

---

### CM2 — [Nome]
**Periodo:** [periodo] · **Big Idea:** *"[frase]"*
[struttura analoga]

---

### CM3 — [Nome] *(solo se giustificato dall'input)*
[struttura analoga]

---

### Regole Operative
1. Always-on non si sospende durante una campagna — si amplifica
2. Ogni campagna ha un brief creativo prodotto 4 settimane prima del lancio
3. Il brief include: big idea, canali attivati, formati, copy guidelines, KPI
4. [regola specifica derivata dall'input]

---
INPUT: ${e}`,funnel_comunicativo:e=>`${J}
Produci la sezione FUNNEL COMUNICATIVO in italiano con markdown. Per ogni stage definisci messaggi, formati e CTA in modo specifico per questo brand.

## Funnel Comunicativo — Esecuzione per Stage

### TOFU — Attira (Awareness)
**Messaggio chiave:** *"[headline del messaggio — problema/desiderio senza proporre ancora la soluzione]"*
**Tono:** [come deve sentirsi chi legge questo contenuto]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Post educativo] | [es. LinkedIn] | [es. 3x/sett] | [titolo reale basato sull'input] |
| [Reel / Video short] | [Instagram] | [1-2x/sett] | [titolo reale] |

**CTA TOFU:** [azione senza frizione — es. Scopri di più, Leggi l'articolo, Seguici]
**Cosa NON fare:** [es. non proporre ancora la demo, non citare il prezzo]

---

### MOFU — Educa e Qualifica (Consideration)
**Messaggio chiave:** *"[headline che introduce la soluzione — differenziale vs alternative]"*
**Tono:** [esperto che spiega, non che vende]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Carousel approfondimento] | [LinkedIn] | [1x/sett] | [titolo reale] |
| [es. Lead magnet / Download] | [Email + LI] | [1x/2sett] | [titolo reale] |

**CTA MOFU:** [azione con valore — es. Scarica la guida, Iscriviti al webinar, Leggi il case study]
**Trigger di qualifica:** [segnale che indica che il lead è pronto per BOFU — es. 3+ contenuti consumati, download effettuato]

---

### BOFU — Converti (Decision)
**Messaggio chiave:** *"[headline che rimuove l'ultima obiezione e spinge all'azione]"*
**Tono:** [diretto, fiducioso, orientato al risultato]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Testimonial / Case study] | [LI + Email] | [1x/2sett] | [titolo reale] |
| [es. Offerta / Trial / Demo] | [Ads retargeting] | [ongoing] | [titolo reale] |

**CTA BOFU:** [azione ad alta intenzione — es. Richiedi una demo, Contattaci, Scarica il preventivo]
**Sequenza di nurturing BOFU:** [quante email, con quale cadenza, quale contenuto per email]

---

### Matrice Funnel Completa
| Stage | % contenuti | Messaggio | Formato primario | CTA | KPI |
|-------|------------|-----------|-----------------|-----|-----|
| TOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |
| MOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |
| BOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |

### Contenuto di transizione (da uno stage all'altro)
- **TOFU → MOFU:** [il contenuto/momento che qualifica — es. download, webinar, 3+ like]
- **MOFU → BOFU:** [il contenuto/momento che converte — es. richiesta info, trial, preventivo]

---
INPUT: ${e}`,adv_social:e=>`${J}
Produci la sezione PIANO ADV SOCIAL in italiano con markdown.

## Piano ADV Social

### Logica — Amplificatore, non Motore
*Le campagne a pagamento amplificano quello che il piano organico ha già costruito. Non sostituiscono la presenza organica.*

### Condizioni di Attivazione
| Campagna | Condizione | Data prevista | Budget % |
|----------|-----------|--------------|----------|
[dall'input — cosa deve essere pronto prima di attivare ogni campagna]

### Targeting per Campagna Prioritaria

**Campagna: [nome — buyer primario]**
| Parametro | Targeting |
|-----------|-----------|
| Job title / Interessi | [dall'input] |
| Età / Settore | [dall'input] |
| Paesi | [dall'input] |
| Dimensione azienda | [B2B: dall'input] |
| Formato | [video/carosello/lead gen — motivato] |
| CPLQ target | [dall'input o stima settore] |

**Campagna: [nome — buyer secondario]**
[struttura analoga]

### Stack di Tracking — Configurazione Obbligatoria
| Tool | Funzione | Da configurare entro | Costo |
|------|---------|---------------------|-------|
| Google Analytics 4 | Traffico + conversioni + source | [subito] | Gratuito |
| Meta Pixel + CAPI | Tracciamento Meta Ads + retargeting | [prima lancio] | Gratuito |
| LinkedIn Insight Tag | Tracciamento LinkedIn Ads + demografica | [prima lancio] | Gratuito |
| UTM parameters | Tag tutti i link social | Da subito | Gratuito |

### Budget ADV — Tre Scenari
| Scenario | Budget/mese | LinkedIn | Google | Meta | Note |
|----------|------------|---------|--------|------|------|
| Conservativo | [stima] | [%] | [%] | [%] | Minimo per dati significativi |
| Medio (raccomandato) | [stima] | | | | |
| Aggressivo | [stima] | | | | Post Q4 se risultati |

---
INPUT: ${e}`,partnership_editoriali:e=>`${J}
Produci la sezione PARTNERSHIP EDITORIALI in italiano con markdown.

## Partnership Editoriali

*Nel B2B non esistono influencer nel senso consumer. Esistono opinion leader tecnici, giornalisti specializzati e associazioni di categoria. La logica non è il pagamento per una menzione — è la costruzione di relazioni professionali che generano valore per entrambe le parti.*

### I Tre Tipi di Partnership

| Tipo | Descrizione | Output | Frequenza |
|------|-------------|--------|-----------|
| Co-authorship tecnica | [nome di settore/esperto] co-firma un contenuto. Distribuito da entrambi i profili. | Articolo/post con doppia firma + reach verso audience esterna | [dall'input o 2-3/anno] |
| Guest contribution | Scambio di contenuti con partner complementari senza costi media | 1 contributo ogni 3 mesi | [dall'input] |
| Citazioni strategiche | Post che cita un opinion leader di settore con tag giustificato | Visibilità qualificata verso il pubblico del taggato | 1-2/settimana |

### Target Partner Prioritari
| Partner | Tipo | Opportunità | Output atteso |
|---------|------|-------------|--------------|
[dall'input — media, associazioni, esperti di settore identificati]

### Piano PR — Media Relations
| Angolo editoriale | Media target | Timing | Hook principale |
|-------------------|-------------|--------|----------------|
[dall'input — angoli costruiti per il giornalista, non comunicati generici]

### Cosa NON è Partnership Editoriale
[Basato sul settore e posizionamento dell'input — es. pagare per citazioni, influencer consumer, campagne hashtag collettivi incompatibili col registro]

---
INPUT: ${e}`,brand_taboos:e=>`${J}
Produci la sezione BRAND TABOOS & PAROLE VIETATE in italiano con markdown.

## Brand Taboos & Parole Vietate

### Perché Esiste Questa Sezione
*Ogni brand ha confini invisibili che, se violati, rompono il contratto psicologico con il pubblico. Questa sezione li rende espliciti e non delegabili.*

### 🚫 Parole e Frasi VIETATE
| Termine/Frase | Perché è vietato | Alternativa corretta |
|---------------|-----------------|---------------------|
| [es. "qualità"] | Buzzword vuota, non verificabile | [es. "fatto a mano in 48h"] |
| [es. "leader di settore"] | Autoproclamazione non credibile | [dato oggettivo + fonte] |
| [es. "a 360°"] | Genericità assoluta | [specificare esattamente cosa] |
| [dall'input: termini incoerenti col ToV o col posizionamento] | | |

### 🚫 Temi e Argomenti TABOO
| Tema | Motivazione | Come gestirlo se inevitabile |
|------|-------------|------------------------------|
| [es. competitor diretti nominati] | Rischio Streisand effect | [deflect con focus su valore proprio] |
| [dall'input: temi politici, religiosi, sociali incompatibili] | | |

### 🚫 Format e Stili VIETATI
| Format | Perché non si usa | Eccezioni |
|--------|------------------|-----------|
| [es. stock photo generiche] | Contraddice Raw & Real | [solo se non disponibile altro] |
| [dall'input: stili visivi o di copy incoerenti col brand] | | |

### ✅ La Regola del Dubbio
*Prima di pubblicare qualcosa di controverso: chiedi "Questo crea distanza o vicinanza con il nostro pubblico?"*
*Se la risposta non è immediata — non si pubblica.*

---
INPUT: ${e}`,content_repurposing:e=>`${J}
Produci la sezione CONTENT REPURPOSING MATRIX in italiano con markdown.

## Content Repurposing Matrix — Matrice di Riciclo dei Formati

### La Logica del Repurposing
*Ogni contenuto ha più vite. Produrre da zero è costoso. Adattare è efficiente. Questa matrice definisce le regole di trasformazione per ogni tipo di contenuto.*

### Matrice di Trasformazione
| Formato Sorgente (Pillar) | → Instagram Reel | → Carosello | → LinkedIn Post | → Newsletter | → Stories | → TikTok |
|--------------------------|-----------------|-------------|-----------------|-------------|-----------|----------|
| **Video lungo (>3min)** | Clip 15-30s del momento chiave | 5 slide con le citazioni | Trascrizione editata | Riassunto + link | 3-5 clip sequenziali | Hook + CTA |
| **Blog post / Long-form** | "La cosa più importante che ho imparato" | Point by point | Executive summary | Invio diretto | Quote cards | Hook + thread |
| **Shooting foto** | Slideshow + musica | Prima/Dopo o storytelling | 1 foto + analisi | Header + contesto | Singole foto + testo | Timelapse o BTS |
| **QBR / Report dati** | Stat più sorprendente | Infografica | Insight professionale | Deep dive | Numero + contesto | "Nessuno te lo dice ma…" |
[adatta alle Business Unit e ai canali attivi del cliente]

### Regole di Adattamento per Canale
| Canale | Adattamento chiave | Cosa NON trasferire |
|--------|-------------------|---------------------|
| Instagram → LinkedIn | Tono più professionale, rimuovi emoji eccessive | Humor leggero, riferimenti pop |
| Video → Testo | Aggiungere struttura e headings | Il ritmo del parlato |
| Long-form → Short | Scegli UN solo concetto, non sintetizzare tutto | Le sfumature secondarie |
[dall'input: canali attivi e relative specificità]

### Piano di Riciclo Mensile
*Per ogni contenuto Pillar prodotto, identificare almeno 3 derivazioni.*
| Contenuto Sorgente | Derivazione 1 | Derivazione 2 | Derivazione 3 | Timeline |
|-------------------|--------------|--------------|--------------|---------|
[compilare con contenuti reali del piano editoriale]

---
INPUT: ${e}`};function qt({project:e,module:t,secId:n,onUpdate:i,sections:a,colors:o,ExportPanelComponent:s,ToastComponent:c,renderMarkdown:l,SvgIconComponent:u}){let d=t===`pdm`?Gt:Kt,f=a.find(e=>e.id===n),p=(t===`pdm`?e.pdm:e.pdc)?.sections?.[n],m=p?.content||``,h=p?.versions||[],[g,_]=(0,U.useState)(!1),[v,y]=(0,U.useState)(!1),[b,x]=(0,U.useState)(``),[S,w]=(0,U.useState)(!1),[T,E]=(0,U.useState)(``),[D,O]=(0,U.useState)(!1),k=o[f?.group]||`#0EA5E9`;function A(e){E(e),setTimeout(()=>E(``),2200)}function j(r){let a=(t===`pdm`?e.pdm:e.pdc)||{sections:{}},o=a.sections?.[n]||{},s=r&&o.content?[...o.versions||[],{text:o.content,ts:Date.now()}].slice(-5):o.versions||[],c={...a.sections,[n]:{content:r,versions:s}};i(t===`pdm`?{...e,pdm:{...a,sections:c}}:{...e,pdc:{...a,sections:c}})}async function ee(){if(d[n]){_(!0);try{let t=C(e.interview||{})+(e.context||``),i=Object.entries(e.pdm?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,150)||``}`).join(`
`),a=Object.entries(e.pdc?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,150)||``}`).join(`
`),o=t+(i?`

## Marketing estratto:
`+i:``)+(a?`

## Comunicazione estratta:
`+a:``);j(await r(d[n](o))),A(`Generato ✓`)}catch{A(`Errore — riprova`)}_(!1)}}function M(){x(m),y(!0),w(!1)}function N(){j(b),y(!1),A(`Salvato ✓`)}function P(){y(!1)}function F(e){j(e.text),w(!1),A(`Versione ripristinata ✓`)}let I=!!m,L=c||(()=>null),R=s,z=l||(e=>String(e||``));return(0,G.jsxs)(`div`,{className:`sec-body`,children:[T&&(0,G.jsx)(L,{msg:T}),(0,G.jsxs)(`div`,{className:`sec-body-hdr`,children:[(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${k}`,paddingLeft:12},children:f?.label}),(0,G.jsxs)(`div`,{className:`sec-acts`,children:[I&&!v&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:M,children:`Modifica`}),h.length>0&&(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>w(e=>!e),children:S?`Chiudi`:`Versioni (`+h.length+`)`})]}),v&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:N,children:`Salva`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:P,children:`Annulla`})]}),d[n]&&(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:ee,disabled:g,children:g?`...`:`Genera`}),I&&R&&(0,G.jsxs)(`div`,{className:`exp-wrap`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>O(e=>!e),children:`↓ Esporta`}),D&&(0,G.jsx)(R,{label:f?.label||n,content:m,projectName:e.name||`Progetto`,secId:n,onClose:()=>O(!1)})]})]})]}),(0,G.jsxs)(`div`,{className:`sec-content`,children:[n===`obiettivi_smart`&&(0,G.jsx)(Ut,{project:e,onUpdate:i,SvgIconComponent:u}),S&&h.length>0&&(0,G.jsxs)(`div`,{className:`vpanel`,children:[(0,G.jsx)(`div`,{className:`vpanel-head`,children:(0,G.jsx)(`span`,{className:`vpanel-title`,children:`Versioni precedenti`})}),h.map((e,t)=>(0,G.jsxs)(`div`,{className:`vitem`,children:[(0,G.jsx)(`div`,{className:`vitem-meta`,children:(0,G.jsx)(`span`,{className:`vdate`,children:new Date(e.ts).toLocaleDateString(`it-IT`)})}),(0,G.jsxs)(`div`,{className:`vpreview`,children:[e.text.slice(0,120),`…`]}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>F(e),children:`Ripristina`})]},t))]}),v?(0,G.jsx)(`textarea`,{className:`edit-txta`,value:b,onChange:e=>x(e.target.value)}):I?(0,G.jsx)(`div`,{className:`md-out`,dangerouslySetInnerHTML:{__html:z(m)}}):!g&&(0,G.jsxs)(`div`,{className:`sec-empty`,children:[(0,G.jsx)(`div`,{className:`se-glyph`,style:{color:k},children:f?.icon}),(0,G.jsx)(`div`,{className:`se-msg`,children:`Sezione non ancora generata`}),d[n]&&(0,G.jsx)(`button`,{className:`btn-primary`,onClick:ee,children:`Genera →`})]}),g&&(0,G.jsxs)(`div`,{className:`gen-row`,children:[(0,G.jsx)(`div`,{className:`spin`}),`Generazione in corso…`]})]})]})}function Jt(){return`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g,e=>{let t=Math.random()*16|0;return(e===`x`?t:t&3|8).toString(16)})}function Yt(e,t){return`${window.location.origin}/c/${e}/${t}`}function Xt(){let e=window.location.pathname.match(/^\/c\/([^/?]+)\/([^/?]+)/);return e?{isClientMode:!0,clientId:e[1],token:e[2]}:{isClientMode:!1,clientId:null,token:null}}function Zt(e,t){return!e||!t?!1:e.clientToken===t}function Qt(e){return e.clientToken?e:{...e,clientToken:Jt()}}var $t=`modulepreload`,en=function(e){return`/`+e},tn={},nn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=en(t,n),t in tn)return;tn[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:$t,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},rn={chart:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,trending:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,pie:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,target:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,user:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,users:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,compass:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,map:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,layers:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,grid:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,zap:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,flag:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,edit:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,type:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,mic:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,calendar:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,megaphone:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,mail:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,link:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,activity:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,eye:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,refresh:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,dollar:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,columns:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,inbox:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,triangle:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,shield:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,box:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`};function an({name:e,size:t=15,color:n=`currentColor`,style:r={}}){let i=rn[e];if(!i)return null;let a=i.replace(/width="15"/g,`width="${t}"`).replace(/height="15"/g,`height="${t}"`).replace(/stroke="currentColor"/g,`stroke="${n}"`);return(0,G.jsx)(`span`,{style:{display:`inline-flex`,alignItems:`center`,flexShrink:0,...r},dangerouslySetInnerHTML:{__html:a}})}var Y=[{id:`executive_summary`,label:`Executive Summary`,icon:`chart`,group:`Fondamenta`},{id:`analisi_interna`,label:`Analisi Interna`,icon:`layers`,group:`Fondamenta`},{id:`analisi_esterna`,label:`Analisi Esterna + PEST`,icon:`compass`,group:`Fondamenta`},{id:`swot`,label:`SWOT & Matrice`,icon:`grid`,group:`Fondamenta`},{id:`segmentazione`,label:`Segmentazione`,icon:`pie`,group:`Target`},{id:`personas`,label:`Buyer Personas`,icon:`users`,group:`Target`},{id:`posizionamento_usp`,label:`Posizionamento + USP`,icon:`target`,group:`Target`},{id:`obiettivi_smart`,label:`Obiettivi SMART`,icon:`flag`,group:`Strategia`,hasBridge:!0},{id:`marketing_mix_7p`,label:`Marketing Mix 7P`,icon:`box`,group:`Strategia`},{id:`canali_media_mix`,label:`Canali & Media Mix`,icon:`map`,group:`Strategia`},{id:`value_proposition`,label:`Value Proposition`,icon:`zap`,group:`Strategia`},{id:`funnel_strategy`,label:`Funnel Strategy`,icon:`triangle`,group:`Strategia`},{id:`pricing_strategy`,label:`Pricing Strategy`,icon:`dollar`,group:`Strategia`},{id:`cac_ltv`,label:`CAC & LTV / Unit Economics`,icon:`trending`,group:`Strategia`},{id:`piano_operativo`,label:`Piano Operativo`,icon:`columns`,group:`Esecuzione`},{id:`lead_nurturing`,label:`Lead Nurturing`,icon:`mail`,group:`Esecuzione`},{id:`roadmap`,label:`Roadmap Milestones`,icon:`map`,group:`Esecuzione`},{id:`tech_stack`,label:`Tech Stack`,icon:`box`,group:`Esecuzione`},{id:`kpi_dashboard`,label:`KPI Dashboard`,icon:`activity`,group:`Monitoraggio`},{id:`budget_media`,label:`Budget & Media Plan`,icon:`dollar`,group:`Monitoraggio`}],X=[{id:`obiettivi_comunicativi`,label:`Obiettivi Comunicativi`,icon:`flag`,group:`Fondamenta`},{id:`contesto_comunicativo`,label:`Contesto Comunicativo`,icon:`compass`,group:`Fondamenta`},{id:`creative_territory`,label:`Creative Territory`,icon:`layers`,group:`Fondamenta`},{id:`tone_of_voice`,label:`Tone of Voice`,icon:`mic`,group:`Identità`},{id:`message_house`,label:`Message House`,icon:`inbox`,group:`Identità`},{id:`copy_strategy`,label:`Copy Strategy`,icon:`edit`,group:`Identità`},{id:`buyer_insights`,label:`Buyer Insights`,icon:`eye`,group:`Identità`},{id:`brand_taboos`,label:`Brand Taboos & Parole Vietate`,icon:`shield`,group:`Identità`},{id:`architettura_canali`,label:`Architettura Canali`,icon:`map`,group:`Operativo`},{id:`piano_editoriale_canale`,label:`Piano Editoriale Canale`,icon:`calendar`,group:`Operativo`},{id:`campaign_moments`,label:`Campaign Moments`,icon:`megaphone`,group:`Operativo`},{id:`funnel_comunicativo`,label:`Funnel Comunicativo`,icon:`triangle`,group:`Operativo`},{id:`adv_social`,label:`Piano ADV Social`,icon:`zap`,group:`Operativo`},{id:`partnership_editoriali`,label:`Partnership Editoriali`,icon:`link`,group:`Operativo`},{id:`content_repurposing`,label:`Content Repurposing Matrix`,icon:`refresh`,group:`Operativo`}],on=[`Fondamenta`,`Target`,`Strategia`,`Esecuzione`,`Monitoraggio`],sn=[`Fondamenta`,`Identità`,`Operativo`],cn={Fondamenta:`#006EFF`,Target:`#C800FF`,Strategia:`#00C853`,Esecuzione:`#FF6B00`,Monitoraggio:`#00B4D8`},ln={Fondamenta:`#6366F1`,Identità:`#C800FF`,Operativo:`#00B4D8`},Z=[{id:`ped`,label:`Piano Editoriale`,icon:`calendar`,group:`Pianificazione`},{id:`calendario`,label:`Calendario`,icon:`columns`,group:`Pianificazione`},{id:`campagne_exec`,label:`Campagne`,icon:`megaphone`,group:`Pianificazione`},{id:`feed`,label:`Feed`,icon:`grid`,group:`Esecuzione`},{id:`content_tracker`,label:`Kanban Board`,icon:`inbox`,group:`Esecuzione`},{id:`publishing`,label:`Publishing Hub`,icon:`zap`,group:`Esecuzione`},{id:`funnel`,label:`Funnel TOFU/MOFU/BOFU`,icon:`triangle`,group:`Monitoraggio`},{id:`perf_log`,label:`Performance Log`,icon:`activity`,group:`Monitoraggio`},{id:`monthly_review`,label:`Monthly Review`,icon:`eye`,group:`Monitoraggio`},{id:`strategy_update`,label:`Aggiornamento Strategia`,icon:`refresh`,group:`Monitoraggio`},{id:`cicli`,label:`Ciclo & Pivot`,icon:`trending`,group:`Monitoraggio`}],un=[`Pianificazione`,`Esecuzione`,`Monitoraggio`],dn={Pianificazione:`#00C853`,Esecuzione:`#FF6B00`,Monitoraggio:`#C800FF`},fn=`nms-global-meta`,pn=async()=>{try{let e=await window.storage?.get(fn);if(e?.value)return JSON.parse(e.value)}catch{}try{let e=localStorage.getItem(fn);return e?JSON.parse(e):null}catch{return null}},mn=async e=>{try{await window.storage?.set(fn,JSON.stringify(e))}catch{}try{e?localStorage.setItem(fn,JSON.stringify(e)):localStorage.removeItem(fn)}catch{}},hn=()=>Math.random().toString(36).slice(2,9);function gn(e){return[`AZIENDA: ${e.nome||`N/A`}`,e.settore&&`SETTORE: ${e.settore}`,e.anno&&`FONDAZIONE: ${e.anno}`,e.sede&&`SEDE: ${e.sede}`,e.sito&&`SITO: ${e.sito}`,e.descrizione&&`COSA FA: ${e.descrizione}`,e.differenziale&&`DIFFERENZIALE: ${e.differenziale}`,e.valori&&`VALORI: ${e.valori}`,e.target&&`TARGET: ${e.target}`,e.b2x&&`MODELLO: ${e.b2x}`,e.mercati&&`MERCATI: ${e.mercati}`,e.prodotti&&`PRODOTTI/SERVIZI: ${e.prodotti}`,e.pricing&&`PRICING: ${e.pricing}`,e.competitor&&`COMPETITOR: ${e.competitor}`,e.diff_competitor&&`DIFFERENZIALE VS COMPETITOR: ${e.diff_competitor}`,e.canali_attuali&&`CANALI ATTUALI: ${e.canali_attuali}`,e.advertising&&`ADVERTISING: ${e.advertising}`,e.obiettivo1&&`OBIETTIVO PRIMARIO: ${e.obiettivo1}`,e.obiettivo2&&`OBIETTIVO SECONDARIO: ${e.obiettivo2}`,e.budget&&`BUDGET MARKETING: ${e.budget}`,e.problema&&`PROBLEMA PRINCIPALE: ${e.problema}`,e.cosa_non_funziona&&`COSA NON FUNZIONA: ${e.cosa_non_funziona}`,e.team&&`TEAM MARKETING: ${e.team}`,e.risorse&&`RISORSE DISPONIBILI: ${e.risorse}`,e.origini&&`ORIGINI: ${e.origini}`,e.svolte&&`SVOLTE CHIAVE: ${e.svolte}`,e.valori_maturati&&`VALORI MATURATI: ${e.valori_maturati}`,e.note&&`NOTE AGGIUNTIVE: ${e.note}`].filter(Boolean).join(`
`)}var _n={ped:(e,t)=>`Sei un esperto di content marketing B2B. Genera un PIANO EDITORIALE MENSILE completo in italiano con markdown.
I titoli dei contenuti devono essere CONCRETI e usabili direttamente — non placeholder. Basa tutto sul contesto del progetto.

## Piano Editoriale — ${new Date().toLocaleString(`it-IT`,{month:`long`,year:`numeric`})}

### Obiettivo del Mese
[Focus prioritario derivato dalla strategia — cosa si vuole ottenere questo mese]

### Distribuzione per Pilastro
| Pilastro | % | N. contenuti | Canale primario |
|---|---|---|---|
[dai pilastri definiti nella strategia del progetto]

### Calendario Contenuti
| # | Settimana | Formato | Pilastro | Titolo / Idea contenuto | Canale | Funnel |
|---|---|---|---|---|---|---|
| 1 | Sett. 1 | Post | [pilastro] | [titolo concreto — non placeholder] | LinkedIn | TOFU |
[genera 16-20 contenuti concreti distribuiti su 4 settimane — titoli specifici e usabili]

### Content Mix del Mese
- Post LinkedIn pagina: [n] · Post profilo CEO: [n] · Post Instagram: [n] · Reel: [n]

### Top 3 Contenuti Prioritari — Copy Guida
*Per questi 3 il copywriter parte da qui:*

**1. [Titolo]**
- Apertura (max 10 parole): [prima riga — dichiarativa, con dato]
- Sviluppo: [direzione del contenuto]
- CTA: [call to action tecnica]

**2. [Titolo]**
[struttura analoga]

**3. [Titolo]**
[struttura analoga]

${t?`### Note dal Mese Precedente\n${t.slice(0,300)}`:``}
---
CONTESTO PROGETTO:
${e}`,monthly_review:e=>`Produci un REPORT DI REVISIONE MENSILE strategico in italiano con markdown.

## Monthly Review

### Performance vs Obiettivi
| KPI | Target mensile | Consuntivo | Delta | Trend |
|---|---|---|---|---|
[dai KPI definiti nel piano — per valori non inseriti usa ⚠️ Da rilevare]

### Top 3 Contenuti del Mese
[I contenuti che hanno performato meglio — con motivazione strategica, non solo il numero]

### Bottom 3 — Cosa Non Ha Funzionato
[Con ipotesi di causa — non generica]

### L'Insight del Mese
[La cosa più importante imparata — quella che cambia qualcosa nel piano del mese prossimo]

### Aggiustamenti Operativi
1. [aggiustamento concreto con effetto atteso]
2. [aggiustamento]
3. [aggiustamento]

### Il Sanity Check
*I contenuti pubblicati questo mese avrebbero convinto il buyer primario a fare il passo successivo?*
[Sì/No con motivazione — senza pietà]

---
CONTESTO: ${e}`,strategy_update:e=>`Sei un consulente di marketing strategico. Analizza le performance e produci un piano di AGGIORNAMENTO STRATEGIA in italiano con markdown.

## Aggiornamento Strategia — ${new Date().toLocaleString(`it-IT`,{month:`long`,year:`numeric`})}

### Diagnosi: Cosa i dati ci stanno dicendo
[3-4 insight strategici derivati dalle performance — non vanity metrics, ma implicazioni di business]

### Cosa aggiornare nel Piano di Marketing
| Sezione | Azione | Priorità |
|---|---|---|
| [es. Obiettivi SMART] | [aggiornamento specifico con nuovo dato] | 🔴/🟡/🟢 |
[elenca solo le sezioni che richiedono aggiornamento reale, non tutto]

### Cosa aggiornare nel Piano di Comunicazione
| Sezione | Azione | Priorità |
|---|---|---|
| [es. Campaign Moments] | [aggiornamento specifico] | 🔴/🟡/🟢 |

### Cosa aggiornare nell'Editoriale
- **Pilastri**: [se la distribuzione % va ribilanciata, perché]
- **Formati**: [se un formato performa meglio, vai verso quello]
- **Canali**: [se un canale sovra/sotto performa, cosa fare]
- **ToV**: [se il tono non sta funzionando con il target, aggiusta]

### Decisioni da prendere prima del prossimo ciclo
1. [decisione concreta — non generica]
2. [decisione concreta]
3. [decisione concreta]

### Non cambiare
[Cosa sta funzionando e NON va toccato — importante quanto quello da cambiare]

---
CONTESTO PROGETTO: ${e}`,cicli:e=>`Sei un consulente di marketing che chiude il ciclo trimestrale. Produci la CHIUSURA DI CICLO e il brief per il prossimo ciclo in italiano con markdown.

## Ciclo & Pivot — Q${Math.ceil((new Date().getMonth()+1)/3)} ${new Date().getFullYear()}

### Il Ciclo che chiudiamo
**Durata**: [data inizio → data fine]
**Obiettivo dichiarato**: [cosa volevamo ottenere]
**Obiettivo raggiunto**: [percentuale e valutazione onesta]
**Verdetto**: ✅ Ciclo completato / ⚠️ Ciclo parziale / 🔄 Pivot necessario

### I 3 Risultati più importanti
1. [risultato concreto con numero]
2. [risultato concreto]
3. [risultato concreto]

### La Lezione del Ciclo
> [Una frase sola. La cosa più importante imparata. Quella che cambia come lavoriamo.]

### Pivot o Continuità?
**Scenario A — Continuità** (se il ciclo ha funzionato):
[Cosa manteniamo identico, cosa amplifichiamo]

**Scenario B — Pivot parziale** (se qualcosa non ha funzionato):
[Cosa cambiamo, perché, cosa testiamo nel prossimo ciclo]

**Scenario C — Pivot strategico** (se i dati dicono altro):
[Riorientamento del focus, nuova ipotesi da testare]

### Brief Prossimo Ciclo — Q${Math.ceil((new Date().getMonth()+1)/3)%4+1}
- **Focus prioritario**: [una cosa sola — massimo focus]
- **KPI primario da battere**: [numero specifico]
- **Esperimento da fare**: [una cosa nuova da testare]
- **Cosa smettere di fare**: [una cosa sola che spreca risorse]
- **Prima azione entro 7 giorni**: [concreta, assegnata a qualcuno]

---
CONTESTO PROGETTO: ${e}`};function vn({project:e,onUpdate:t,members:n,onEdit:r,onAddNew:i,globalMeta:s}){let[c,l]=(0,U.useState)((()=>{let e=window.location.pathname.split(`/`).filter(Boolean);return e[0]===`project`&&e[2]===`ed`&&e[3]===`contenuti`&&e[4]?e[4]:`calendario`})()||`calendario`),[u,d]=(0,U.useState)(`tutti`),[f,m]=(0,U.useState)(`tutti`),[h,_]=(0,U.useState)(`tutti`),[y,b]=(0,U.useState)(`tutti`),[S,C]=(0,U.useState)(``),[T,E]=(0,U.useState)(null),[O,k]=(0,U.useState)(null),A=(0,U.useMemo)(()=>p(e),[e]),j=(0,U.useMemo)(()=>[...new Set(A.map(e=>e.pilastro).filter(Boolean))],[A]),ee=(0,U.useMemo)(()=>a.reduce((e,t)=>(e[t]=A.filter(e=>e.stato===t).length,e),{}),[A]),M=(0,U.useMemo)(()=>{let e=A;return u!==`tutti`&&(e=e.filter(e=>(e.piattaforme||[]).includes(u))),f!==`tutti`&&(e=e.filter(e=>e.stato===f)),h!==`tutti`&&(e=e.filter(e=>(e.funnel||``).toUpperCase()===h)),y!==`tutti`&&(e=e.filter(e=>e.pilastro===y)),S.trim()&&(e=e.filter(e=>(e.titolo||``).toLowerCase().includes(S.toLowerCase()))),e},[A,u,f,h,y,S]),N=(0,U.useCallback)(n=>{t({...e,ed:{...e.ed||{},...n(e.ed||{})}})},[e,t]),P=(0,U.useCallback)(e=>{N(t=>({...t,feedItems:(t.feedItems||[]).some(t=>t.id===e.id)?(t.feedItems||[]).map(t=>t.id===e.id?e:t):[...t.feedItems||[],e]}))},[N]),F=(0,U.useCallback)(e=>{N(t=>({...t,feedItems:(t.feedItems||[]).filter(t=>t.id!==e)})),E(null)},[N]);return(0,G.jsxs)(`div`,{className:`contenuti-wrap`,children:[(0,G.jsxs)(`div`,{className:`contenuti-subnav`,children:[xn.map(t=>(0,G.jsxs)(`button`,{className:`contenuti-subtab ${c===t.id?`active`:``}`,onClick:()=>{l(t.id);let n=`/project/`+e.id+`/ed/contenuti/`+t.id;window.history.pushState({},``,n)},children:[t.icon,` `,t.label]},t.id)),(0,G.jsx)(`button`,{className:`btn-primary sm`,style:{marginLeft:`auto`},onClick:i,children:`+ Nuovo post`})]}),c===`calendario`&&(0,G.jsx)(w,{project:e,onUpdate:t,onEditPost:r,PostFormModalComponent:I,createEmptyPost:er,getPilastri:nr}),c===`lista`&&(0,G.jsx)(Ue,{feedItems:A,ideeItems:(e.ed?.ideas||[]).filter(e=>e.data),onEdit:r}),c===`feed`&&(0,G.jsx)(v,{project:e,feedItems:A,onUpdate:t,onEdit:r}),c===`gestisci`&&(0,G.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,flex:1,overflow:`hidden`},children:[(0,G.jsxs)(`div`,{className:`ed-pipeline`,children:[D.map(e=>{let t=o(e),n=ee[e]||0,r=f===e;return(0,G.jsxs)(`button`,{className:`ed-pipe-stage ${r?`active`:``}`,style:r?{background:t.bg,borderColor:t.tx+`60`,color:t.tx}:{},onClick:()=>m(r?`tutti`:e),children:[(0,G.jsx)(`span`,{children:t.icon}),(0,G.jsx)(`span`,{children:t.label}),(0,G.jsx)(`span`,{className:`ed-pipe-cnt`,style:r?{background:t.tx,color:`#fff`}:{},children:n})]},e)}),(0,G.jsxs)(`button`,{className:`ed-pipe-stage ${f===`tutti`?`active`:``}`,style:f===`tutti`?{background:`var(--ink)`,color:`#fff`}:{},onClick:()=>m(`tutti`),children:[`Tutti `,(0,G.jsx)(`span`,{className:`ed-pipe-cnt`,style:f===`tutti`?{background:`rgba(255,255,255,.25)`,color:`#fff`}:{},children:A.length})]})]}),(0,G.jsxs)(`div`,{className:`ed-filter-bar`,children:[(0,G.jsx)(`input`,{className:`inp ed-search`,placeholder:`🔍 Cerca post…`,value:S,onChange:e=>C(e.target.value)}),(0,G.jsxs)(`select`,{className:`inp ed-filter-sel`,value:u,onChange:e=>d(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutte le piattaforme`}),g.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.label},e.id))]}),(0,G.jsxs)(`select`,{className:`inp ed-filter-sel`,value:h,onChange:e=>_(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutto il funnel`}),[`TOFU`,`MOFU`,`BOFU`].map(e=>(0,G.jsx)(`option`,{value:e,children:e},e))]}),j.length>0&&(0,G.jsxs)(`select`,{className:`inp ed-filter-sel`,value:y,onChange:e=>b(e.target.value),children:[(0,G.jsx)(`option`,{value:`tutti`,children:`Tutti i pilastri`}),j.map(e=>(0,G.jsx)(`option`,{value:e,children:e},e))]}),(u!==`tutti`||f!==`tutti`||h!==`tutti`||y!==`tutti`||S)&&(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{d(`tutti`),m(`tutti`),_(`tutti`),b(`tutti`),C(``)},children:`✕ Reset`}),(0,G.jsxs)(`span`,{style:{fontSize:11,color:`var(--ink4)`,marginLeft:`auto`},children:[M.length,` post`,M.length===A.length?``:` di ${A.length}`]})]}),(0,G.jsxs)(`div`,{className:`ed-grid-area`,children:[M.length===0&&(0,G.jsx)(`div`,{className:`ct-empty`,style:{padding:`60px 0`},children:A.length===0?`Nessun post ancora. Clicca "+ Nuovo post" per iniziare.`:`Nessun post corrisponde ai filtri.`}),(0,G.jsxs)(`div`,{className:`ed-post-grid`,children:[M.map(e=>(0,G.jsx)(yn,{item:e,members:n,isSelected:T===e.id,onClick:()=>E(t=>t===e.id?null:e.id),onEdit:r,onSave:P,onDelete:F},e.id)),(0,G.jsxs)(`div`,{className:`pgc-add`,onClick:i,children:[(0,G.jsx)(`div`,{className:`pgc-add-icon`,children:`+`}),(0,G.jsx)(`div`,{className:`pgc-add-label`,children:`Nuovo post`})]})]})]})]}),O&&(0,G.jsx)(x,{post:{...O},meta:Kn(client,s),onClose:()=>k(null),onPublished:()=>{P({...O,stato:`pubblicato`}),k(null)}})]})}var yn=(0,U.memo)(function({item:e,members:t,isSelected:n,onClick:r,onEdit:s,onSave:l,onDelete:u}){let[d,p]=(0,U.useState)(!1),m=e.immagineBase64||e.immagineUrl||``,h=o(e.stato),v=(e.piattaforme||[]).map(e=>g.find(t=>t.id===e)).filter(Boolean),y=(e.membersAssigned||[]).map(e=>t.find(t=>t.id===e)).filter(Boolean),b=(e.comments||[]).length;return _(e.stato),c(e.stato),(0,G.jsxs)(`div`,{className:`pgc-wrap ${n?`pgc-sel`:``}`,onClick:r,children:[(0,G.jsxs)(`div`,{className:`pgc-thumb`,children:[m?(0,G.jsx)(`img`,{src:m,alt:``,onError:e=>e.target.style.display=`none`}):(0,G.jsxs)(`div`,{className:`pgc-thumb-empty`,children:[(0,G.jsx)(`span`,{style:{fontSize:28},children:f[e.tipo]||`📄`}),(0,G.jsx)(`span`,{style:{fontSize:9,color:`var(--ink5)`,marginTop:4},children:`Nessuna immagine`})]}),e.tipo===`reel`&&(0,G.jsx)(`div`,{className:`pgc-media-badge`,children:`▶ Reel`}),e.tipo===`carousel`&&(0,G.jsx)(`div`,{className:`pgc-media-badge`,children:`⊞ Carousel`}),e.tipo===`storia`&&(0,G.jsx)(`div`,{className:`pgc-media-badge`,children:`⬜ Storia`}),(0,G.jsxs)(`div`,{className:`pgc-overlay`,children:[(0,G.jsx)(`button`,{className:`pgc-ov-btn`,onClick:t=>{t.stopPropagation(),s(e)},children:`✎ Modifica`}),(0,G.jsx)(`select`,{className:`pgc-ov-stato-sel`,value:e.stato||`bozza`,onClick:e=>e.stopPropagation(),onChange:t=>{t.stopPropagation(),l({...e,stato:t.target.value})},children:a.map(e=>(0,G.jsxs)(`option`,{value:e,children:[i[e]?.icon,` `,i[e]?.label||e]},e))}),(0,G.jsx)(`button`,{className:`pgc-ov-btn pgc-del-btn`,onClick:t=>{t.stopPropagation(),u(e.id)},children:`🗑`})]})]}),(0,G.jsxs)(`div`,{className:`pgc-info`,children:[(0,G.jsx)(`div`,{className:`pgc-title`,children:e.titolo||`Senza titolo`}),(0,G.jsxs)(`div`,{className:`pgc-meta`,children:[(0,G.jsxs)(`span`,{className:`pgc-stato`,style:{background:h.bg,color:h.tx},children:[h.icon,` `,h.label]}),e.data&&(0,G.jsx)(`span`,{className:`pgc-date`,children:e.data})]}),(0,G.jsxs)(`div`,{className:`pgc-bottom`,children:[(0,G.jsx)(`div`,{className:`pgc-piats`,children:v.map(e=>(0,G.jsx)(`span`,{className:`pgc-piat-dot`,style:{background:e.color},title:e.label},e.id))}),(0,G.jsx)(`div`,{className:`pgc-avatars`,children:y.slice(0,3).map(e=>(0,G.jsx)(`div`,{className:`pgc-avatar`,style:{background:e.colore},title:e.nome,children:e.nome[0]},e.id))}),(0,G.jsxs)(`button`,{className:`pgc-comment-btn`,onClick:e=>{e.stopPropagation(),p(e=>!e)},children:[`💬 `,b>0?b:``]})]})]}),d&&(0,G.jsx)(`div`,{onClick:e=>e.stopPropagation(),children:(0,G.jsx)(k,{post:e,members:t,onSave:l})})]})}),bn=[{id:`home`,label:`Home`,icon:`🏠`},{id:`contenuti`,label:`Contenuti`,icon:`📅`},{id:`kanban`,label:`Kanban`,icon:`📋`},{id:`publishing`,label:`Publishing`,icon:`📤`},{id:`idee`,label:`Idee`,icon:`💡`},{id:`strategia`,label:`Strategia`,icon:`◈`},{id:`analisi`,label:`Analisi`,icon:`▤`}],xn=[{id:`calendario`,label:`Calendario`,icon:`📅`},{id:`lista`,label:`Lista`,icon:`☰`},{id:`feed`,label:`Feed`,icon:`📱`},{id:`gestisci`,label:`Gestisci`,icon:`📣`}],Sn=[`ped`,`campagne_exec`],Cn=[`funnel`,`perf_log`,`monthly_review`,`strategy_update`,`cicli`];function wn({project:e,onUpdate:t,globalMeta:n,client:r=null,pushUrl:i}){let[a,o]=(0,U.useState)((()=>{let e=window.location.pathname.split(`/`).filter(Boolean);return e[0]===`project`&&e[2]===`ed`&&e[3]?e[3]:`home`})()||`home`),[s,c]=(0,U.useState)(null),[l,d]=(0,U.useState)(null),[f,m]=(0,U.useState)(null),[h,g]=(0,U.useState)([]),[_,v]=(0,U.useState)(`ped`),[y,b]=(0,U.useState)(!1),[C,w]=(0,U.useState)(!1);(0,U.useEffect)(()=>{let t=e.ed?.collaboratori||[];t.length>0?g(t):ne(re).then(e=>g(e||ie))},[e.id]);let T=p(e);function E(n){t(u(e,n))}function D(e){E(t=>({...t,feedItems:(t.feedItems||[]).some(t=>t.id===e.id)?(t.feedItems||[]).map(t=>t.id===e.id?e:t):[...t.feedItems||[],e]})),c(null)}function O(e){E(t=>({...t,feedItems:(t.feedItems||[]).filter(t=>t.id!==e)})),d(null)}function k(){c(er())}function A(e,t){if(e===`kanban`||e===`publishing`){o(e);return}o(e===`grid`||e===`calendario`||e===`feed`||e===`gestisci`?`contenuti`:e)}return dn[Z.find(e=>e.id===_)?.group],(0,G.jsxs)(`div`,{className:`ed-main`,children:[(0,G.jsxs)(`div`,{className:`ed-main-nav`,children:[(0,G.jsx)(`div`,{className:`ed-inner-tabs`,children:bn.map(t=>(0,G.jsxs)(`button`,{className:`ed-inner-tab ${a===t.id?`active`:``}`,onClick:()=>{o(t.id),i&&i(`project`,e.id,{module:`ed`,tab:t.id})},children:[t.icon,` `,t.label]},t.id))}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,marginLeft:`auto`,alignItems:`center`},children:[(a===`pubblica`||a===`home`)&&(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:k,children:`+ Nuovo post`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,title:`Importa post da CSV`,onClick:()=>w(!0),style:{fontSize:10,padding:`4px 8px`},children:`📥 CSV`}),(0,G.jsx)(`button`,{className:`ed-collab-btn`,title:`Collaboratori`,onClick:()=>b(!0),children:`👥 Team`})]})]}),(0,G.jsx)(Wt,{project:e,SvgIconComponent:an}),(0,G.jsxs)(`div`,{className:`ed-main-body`,children:[a===`home`&&(0,G.jsx)(Ye,{project:e,onNavigate:A,onAddPost:k,onEditPost:c}),a===`contenuti`&&(0,G.jsx)(vn,{project:e,onUpdate:t,members:h,onEdit:c,onAddNew:k,globalMeta:n}),a===`idee`&&(0,G.jsx)(S,{project:e,onUpdate:t,PostFormModalComponent:I}),a===`kanban`&&(0,G.jsx)(`div`,{className:`sec-content`,style:{flex:1,overflow:`auto`},children:(0,G.jsx)(ee,{project:e,onUpdate:t})}),a===`publishing`&&(0,G.jsx)(`div`,{className:`sec-content`,style:{flex:1,overflow:`auto`},children:(0,G.jsx)(P,{project:e,onUpdate:t,globalMeta:n})}),a===`strategia`&&(0,G.jsxs)(`div`,{className:`ed-inner-plan`,children:[(0,G.jsx)(`div`,{className:`ed-inner-sec-tabs`,children:Sn.map(t=>{let n=Z.find(e=>e.id===t),r=e.ed?.sections?.[t]?.content;return(0,G.jsxs)(`button`,{className:`sec-tab ${_===t?`active`:``} ${r?`has`:``}`,style:_===t?{color:`#10B981`,borderBottomColor:`#10B981`}:{},onClick:()=>v(t),children:[r&&(0,G.jsx)(`span`,{className:`tab-dot`,style:{background:`#10B981`}}),n?.icon,` `,n?.label]},t)})}),(0,G.jsx)(Tn,{project:e,secId:_,onUpdate:t,globalMeta:n,client:r},`strat-`+_)]}),a===`analisi`&&(0,G.jsxs)(`div`,{className:`ed-inner-plan`,children:[(0,G.jsx)(`div`,{className:`ed-inner-sec-tabs`,children:Cn.map(t=>{let n=Z.find(e=>e.id===t),r=Q.includes(t)?!0:e.ed?.sections?.[t]?.content;return(0,G.jsxs)(`button`,{className:`sec-tab ${_===t?`active`:``} ${r?`has`:``}`,style:_===t?{color:`#8B5CF6`,borderBottomColor:`#8B5CF6`}:{},onClick:()=>v(t),children:[r&&(0,G.jsx)(`span`,{className:`tab-dot`,style:{background:`#8B5CF6`}}),n?.icon,` `,n?.label]},t)})}),(0,G.jsx)(Tn,{project:e,secId:_,onUpdate:t,globalMeta:n,client:r},`anal-`+_)]})]}),C&&(0,G.jsx)(Ot,{project:e,onImport:e=>{E(t=>({...t,feedItems:[...t.feedItems||[],...e]})),w(!1)},onClose:()=>w(!1)}),y&&(0,G.jsx)(H,{project:e,onUpdate:t,members:h,onMembersChange:g,onClose:()=>b(!1)}),s&&(0,G.jsx)(I,{item:s,members:h,project:e,pilastri:nr(e),onSave:D,onDelete:T.some(e=>e.id===s.id)?O:null,onClose:()=>c(null)}),f&&(0,G.jsx)(x,{post:{...f},meta:Kn(r,n),onClose:()=>m(null),onPublished:()=>{D({...f,stato:`pubblicato`}),m(null)}})]})}var Q=[`calendario`,`content_tracker`,`publishing`,`perf_log`,`monthly_review`,`campagne_exec`,`funnel`];function Tn({project:e,secId:t,onUpdate:n,globalMeta:i,client:a=null}){let o=Z.find(e=>e.id===t),s=e.ed?.sections?.[t],c=s?.content||``,l=s?.versions||[],u=dn[o?.group]||`#10B981`,[d,f]=(0,U.useState)(!1),[p,m]=(0,U.useState)(!1),[h,g]=(0,U.useState)(``),[_,v]=(0,U.useState)(!1),[b,x]=(0,U.useState)(``),[S,C]=(0,U.useState)(!1);function E(e){x(e),setTimeout(()=>x(``),2200)}function D(r){let i=e.ed||{sections:{}},a=i.sections?.[t]||{},o=r&&a.content?[...a.versions||[],{text:a.content,ts:Date.now()}].slice(-5):a.versions||[];n({...e,ed:{...i,sections:{...i.sections,[t]:{content:r,versions:o}}}})}async function O(){if(_n[t]){f(!0);try{let n=gn(e.interview||{}),i=Object.entries(e.pdm?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`),a=Object.entries(e.pdc?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`),o=n+`

## Strategia Marketing:
`+i+`

## Comunicazione:
`+a,s=(e.ed?.perfLogs||[]).slice(-1)[0];D(await r(_n[t](o,s?.note))),E(`Generato ✓`)}catch{E(`Errore — riprova`)}f(!1)}}return t===`funnel`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:`Funnel TOFU / MOFU / BOFU`})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(A,{project:e,onUpdate:n})})]}):t===`feed`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:`Feed`})}),(0,G.jsx)(`div`,{className:`sec-content`,style:{padding:0,overflow:`hidden`,display:`flex`,flexDirection:`column`},children:(0,G.jsx)(rr,{project:e,onUpdate:n,globalMeta:i,client:a})})]}):t===`content_tracker`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[b&&(0,G.jsx)(sr,{msg:b}),(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(ee,{project:e,onUpdate:n})})]}):t===`publishing`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(P,{project:e,onUpdate:n,globalMeta:i,client:a})})]}):t===`perf_log`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(y,{project:e,onUpdate:n})})]}):t===`monthly_review`?(0,G.jsx)(N,{project:e,onUpdate:n,sectionMeta:o,accentColor:u,ExportPanelComponent:or,renderMarkdown:T,client:a}):t===`strategy_update`||t===`cicli`?(0,G.jsx)(j,{project:e,onUpdate:n,secId:t,sectionMeta:o,accentColor:u,ExportPanelComponent:or,renderMarkdown:T}):t===`calendario`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(w,{project:e,onUpdate:n,onEditPost:setEditItem,PostFormModalComponent:I,createEmptyPost:er,getPilastri:nr})})]}):t===`campagne_exec`?(0,G.jsxs)(`div`,{className:`sec-body`,children:[(0,G.jsx)(`div`,{className:`sec-body-hdr`,children:(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label})}),(0,G.jsx)(`div`,{className:`sec-content`,children:(0,G.jsx)(F,{project:e,onUpdate:n})})]}):(0,G.jsxs)(`div`,{className:`sec-body`,children:[b&&(0,G.jsx)(sr,{msg:b}),(0,G.jsxs)(`div`,{className:`sec-body-hdr`,children:[(0,G.jsx)(`div`,{className:`sec-body-title`,style:{borderLeft:`3px solid ${u}`,paddingLeft:12},children:o?.label}),(0,G.jsxs)(`div`,{className:`sec-acts`,children:[c&&!p&&(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:()=>{g(c),m(!0)},children:`Modifica`}),c&&l.length>0&&(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>v(e=>!e),children:_?`Chiudi`:`Versioni`}),p&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:()=>{D(h),m(!1),E(`Salvato ✓`)},children:`Salva`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>m(!1),children:`Annulla`})]}),_n[t]&&(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:O,disabled:d,children:d?`...`:`Genera`}),c&&(0,G.jsxs)(`div`,{className:`exp-wrap`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>C(e=>!e),children:`↓ Esporta`}),S&&(0,G.jsx)(or,{label:o?.label||t,content:c,projectName:e.name||`Progetto`,secId:t,onClose:()=>C(!1)})]})]})]}),(0,G.jsxs)(`div`,{className:`sec-content`,children:[_&&l.map((e,t)=>(0,G.jsxs)(`div`,{className:`vitem`,style:{marginBottom:8},children:[(0,G.jsx)(`div`,{className:`vdate`,children:new Date(e.ts).toLocaleDateString(`it-IT`)}),(0,G.jsxs)(`div`,{className:`vpreview`,children:[e.text.slice(0,100),`…`]}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{D(e.text),v(!1),E(`Ripristinato ✓`)},children:`Ripristina`})]},t)),p?(0,G.jsx)(`textarea`,{className:`edit-txta`,value:h,onChange:e=>g(e.target.value)}):c?(0,G.jsx)(`div`,{className:`md-out`,dangerouslySetInnerHTML:{__html:T(c)}}):!d&&(0,G.jsxs)(`div`,{className:`sec-empty`,children:[(0,G.jsx)(`div`,{className:`se-glyph`,style:{color:u},children:o?.icon}),(0,G.jsx)(`div`,{className:`se-msg`,children:`Sezione non ancora generata`}),_n[t]&&(0,G.jsx)(`button`,{className:`btn-primary`,onClick:O,children:`Genera →`})]}),d&&(0,G.jsxs)(`div`,{className:`gen-row`,children:[(0,G.jsx)(`div`,{className:`spin`}),`Generazione…`]})]})]})}var En={done:{dot:`#10B981`,bg:`#ECFDF5`,tx:`#059669`,label:`✓ Fatto`},active:{dot:`#0EA5E9`,bg:`#EFF8FF`,tx:`#0284C7`,label:`In corso`},pending:{dot:`#CBD5E1`,bg:`#F1F5F9`,tx:`#64748B`,label:`Pending`}},Dn=[`Strategia`,`Social`,`Contenuti`,`Tecnico`,`Altro`],On={high:{label:`Alta`,color:`#EF4444`},med:{label:`Media`,color:`#F59E0B`},low:{label:`Bassa`,color:`#94A3B8`}};function kn(e){let t=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,n=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,r=Z.filter(t=>!Q.includes(t.id)&&e.ed?.sections?.[t.id]?.content).length,i=Y.length+X.length+Z.filter(e=>!Q.includes(e.id)).length,a=Math.round((t+n+r)/i*100),o=e.tasks||[];return{pct:a,pdmF:t,pdcF:n,edF:r,totAI:i,open:o.filter(e=>!e.done).length,urgent:o.filter(e=>!e.done&&e.priority===`high`).length,nextPost:p(e).filter(e=>e.data&&!l(e)).sort((e,t)=>e.data.localeCompare(t.data))[0]}}function An(e){let t=e.interview||{},n=Object.values(t).some(e=>e?.trim?.().length>2),r=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,i=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,a=r/Y.length,o=i/X.length,s=!!e.ed?.sections?.ped?.content,c=p(e).length;return[{id:`a-brief`,name:`Brief e analisi`,status:n?`done`:`pending`,auto:!0},{id:`a-pdm`,name:`Piano di Marketing`,status:a>.5?`done`:a>0?`active`:`pending`,auto:!0},{id:`a-pdc`,name:`Piano di Comunicazione`,status:o>.5?`done`:o>0?`active`:`pending`,auto:!0},{id:`a-ped`,name:`Piano Editoriale attivo`,status:s?`done`:`pending`,auto:!0},{id:`a-feed`,name:`Feed operativo (+3 post)`,status:c>=3?`done`:c>0?`active`:`pending`,auto:!0}]}function jn({title:e,content:t,onClose:n}){return(0,G.jsx)(`div`,{className:`modal-overlay`,onClick:n,children:(0,G.jsxs)(`div`,{className:`modal`,style:{maxWidth:700},onClick:e=>e.stopPropagation(),children:[(0,G.jsxs)(`div`,{className:`modal-head`,children:[(0,G.jsx)(`div`,{className:`modal-title`,children:e}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:n,children:`✕`})]}),(0,G.jsx)(`div`,{className:`modal-body`,style:{maxHeight:`60vh`,overflowY:`auto`},children:(0,G.jsx)(`div`,{className:`md-out`,dangerouslySetInnerHTML:{__html:T(t)}})}),(0,G.jsxs)(`div`,{className:`modal-foot`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>navigator.clipboard?.writeText(t),children:`📋 Copia`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:n,children:`Chiudi`})]})]})})}function Mn({project:e,onUpdate:t}){let n=An(e),r=e.milestones||[],[i,a]=(0,U.useState)(!1),[o,s]=(0,U.useState)({name:``,date:``,status:`pending`});function c(){o.name&&(t({...e,milestones:[...r,{...o,id:hn()}]}),a(!1),s({name:``,date:``,status:`pending`}))}function l(n){t({...e,milestones:r.filter(e=>e.id!==n)})}function u(n){let i={done:`active`,active:`pending`,pending:`done`};t({...e,milestones:r.map(e=>e.id===n?{...e,status:i[e.status]}:e)})}let d=[...n,...r];return(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{className:`ov-sec-hdr`,children:[(0,G.jsx)(`div`,{className:`ov-sec-title`,children:`Milestone di progetto`}),(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:()=>a(!0),children:`+ Aggiungi`})]}),i&&(0,G.jsxs)(`div`,{className:`ct-form`,style:{marginBottom:10},children:[(0,G.jsxs)(`div`,{className:`fg-row3`,children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Milestone *`}),(0,G.jsx)(`input`,{className:`inp`,value:o.name,onChange:e=>s({...o,name:e.target.value}),placeholder:`es. Brand Book v1.0`,autoFocus:!0})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Data target`}),(0,G.jsx)(`input`,{className:`inp`,type:`date`,value:o.date,onChange:e=>s({...o,date:e.target.value})})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Stato`}),(0,G.jsxs)(`select`,{className:`inp`,value:o.status,onChange:e=>s({...o,status:e.target.value}),children:[(0,G.jsx)(`option`,{value:`pending`,children:`Pending`}),(0,G.jsx)(`option`,{value:`active`,children:`In corso`}),(0,G.jsx)(`option`,{value:`done`,children:`Fatto`})]})]})]}),(0,G.jsxs)(`div`,{className:`form-actions`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>a(!1),children:`Annulla`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:c,disabled:!o.name,children:`Aggiungi`})]})]}),(0,G.jsx)(`div`,{className:`ms-list`,children:d.map(e=>{let t=En[e.status]||En.pending,n=!e.id?.startsWith(`a-`);return(0,G.jsxs)(`div`,{className:`ms-row`,children:[(0,G.jsx)(`div`,{className:`ms-dot-el ${n?`ms-dot-click`:``}`,style:{background:t.dot},onClick:n?()=>u(e.id):void 0}),(0,G.jsxs)(`div`,{className:`ms-info-el`,children:[(0,G.jsx)(`div`,{className:`ms-name`,children:e.name}),e.date&&(0,G.jsx)(`div`,{className:`ms-date`,children:e.date})]}),(0,G.jsx)(`span`,{className:`ms-badge`,style:{background:t.bg,color:t.tx},children:t.label}),n&&(0,G.jsx)(`button`,{className:`ct-del`,onClick:()=>l(e.id),children:`×`})]},e.id)})})]})}function Nn({project:e,onUpdate:t}){let n=e.tasks||[],[r,i]=(0,U.useState)(!1),[a,o]=(0,U.useState)(`tutti`),[s,c]=(0,U.useState)({text:``,priority:`med`,tag:`Strategia`,assignee:``});function l(){s.text&&(t({...e,tasks:[{...s,id:hn(),done:!1,createdAt:Date.now()},...n]}),i(!1),c({text:``,priority:`med`,tag:`Strategia`,assignee:``}))}function u(r){t({...e,tasks:n.map(e=>e.id===r?{...e,done:!e.done}:e)})}function d(r){t({...e,tasks:n.filter(e=>e.id!==r)})}let f=a===`tutti`?n:n.filter(e=>e.tag===a),p=n.filter(e=>!e.done&&e.priority===`high`);return(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{className:`ov-sec-hdr`,children:[(0,G.jsxs)(`div`,{className:`ov-sec-title`,children:[`Task `,(0,G.jsxs)(`span`,{style:{fontSize:10,color:`var(--ink4)`,fontWeight:400},children:[`(`,n.filter(e=>!e.done).length,` aperti`,p.length>0?` · ${p.length} urgenti`:``,`)`]})]}),(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:()=>i(!0),children:`+ Task`})]}),r&&(0,G.jsxs)(`div`,{className:`ct-form`,style:{marginBottom:10},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Descrizione *`}),(0,G.jsx)(`input`,{className:`inp`,value:s.text,onChange:e=>c({...s,text:e.target.value}),placeholder:`es. Sessione input con cliente — Appendice A`,autoFocus:!0})]}),(0,G.jsxs)(`div`,{className:`fg-row3`,style:{marginTop:8},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Priorità`}),(0,G.jsxs)(`select`,{className:`inp`,value:s.priority,onChange:e=>c({...s,priority:e.target.value}),children:[(0,G.jsx)(`option`,{value:`high`,children:`🔴 Alta`}),(0,G.jsx)(`option`,{value:`med`,children:`🟡 Media`}),(0,G.jsx)(`option`,{value:`low`,children:`⚪ Bassa`})]})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Categoria`}),(0,G.jsx)(`select`,{className:`inp`,value:s.tag,onChange:e=>c({...s,tag:e.target.value}),children:Dn.map(e=>(0,G.jsx)(`option`,{children:e},e))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Assegnatario`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. A · S · T · Luca`,value:s.assignee,onChange:e=>c({...s,assignee:e.target.value})})]})]}),(0,G.jsxs)(`div`,{className:`form-actions`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>i(!1),children:`Annulla`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:l,disabled:!s.text,children:`Aggiungi`})]})]}),(0,G.jsx)(`div`,{className:`task-filter-bar`,children:[`tutti`,...Dn].map(e=>(0,G.jsx)(`button`,{className:`task-filter-btn ${a===e?`active`:``}`,onClick:()=>o(e),children:e===`tutti`?`Tutti`:e},e))}),f.length===0&&(0,G.jsxs)(`div`,{className:`ct-empty`,children:[`Nessun task`,a===`tutti`?``:` in questa categoria`,`.`]}),(0,G.jsx)(`div`,{className:`ov-task-list`,children:f.map(e=>(0,G.jsxs)(`div`,{className:`ov-task-row ${e.done?`ov-task-done`:``}`,children:[(0,G.jsx)(`div`,{className:`ov-task-check`,onClick:()=>u(e.id),children:e.done?`✓`:``}),(0,G.jsx)(`div`,{className:`ov-task-prio`,style:{background:On[e.priority]?.color||`#94A3B8`}}),(0,G.jsx)(`div`,{className:`ov-task-text`,children:e.text}),(0,G.jsx)(`span`,{className:`ov-task-tag`,children:e.tag}),e.assignee&&(0,G.jsx)(`div`,{className:`ov-task-who`,children:e.assignee}),(0,G.jsx)(`button`,{className:`ct-del`,onClick:()=>d(e.id),children:`×`})]},e.id))})]})}function Pn({project:e,onGoToModule:t}){let[n,i]=(0,U.useState)(null),[a,o]=(0,U.useState)(null),s=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,c=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,l=!!e.pdc?.sections?.copy_strategy?.content,u=!!e.pdc?.sections?.tone_of_voice?.content,d=!!e.ed?.sections?.ped?.content,f=[{id:`pdm`,key:`pdm`,label:`Piano di Marketing`,meta:`Strategia · Target · 7P · Budget · Roadmap`,ver:`v1`,filled:s/Y.length,mod:`pdm`},{id:`pdc`,key:`pdc`,label:`Piano di Comunicazione`,meta:`ToV · Message House · Campaign Moments`,ver:`v1`,filled:c/X.length,mod:`pdc`},{id:`cs`,key:`copy_strategy`,label:`Copy Strategy`,meta:`Promessa · Reason Why · Per Persona · Prezzo`,ver:`v1`,filled:+!!l,mod:`pdc`},{id:`bv`,key:`tone_of_voice`,label:`Brand Voice`,meta:`ToV · Parole guida · Regole operative`,ver:`v1`,filled:+!!u,mod:`pdc`},{id:`ped`,key:`ped`,label:`Piano Editoriale`,meta:`Pilastri · Calendario mensile · Copy guida`,ver:`v1`,filled:+!!d,mod:`ed`}];async function p(t){let n=t.mod===`pdm`?Object.entries(e.pdm?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,300)||``}`).join(`
`):t.mod===`pdc`?Object.entries(e.pdc?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,300)||``}`).join(`
`):e.ed?.sections?.[t.key]?.content||``;if(n?.trim()){o(t.id);try{let e=await r(`Riassumi in italiano in modo strutturato i punti chiave di questo documento. Usa bullet points. Sii diretto e sintetico.\n\nDOCUMENTO: ${t.label}\n\n${n.slice(0,3e3)}`);i({title:t.label,content:e})}catch{}o(null)}}return(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`ov-sec-hdr`,children:(0,G.jsx)(`div`,{className:`ov-sec-title`,children:`Sistema documentale`})}),(0,G.jsx)(`div`,{className:`doc-grid-ov`,children:f.map(e=>{let n=e.filled>=.5,r=e.filled>0&&e.filled<.5;return(0,G.jsxs)(`div`,{className:`doc-card-ov ${!n&&!r?`doc-pending`:``}`,onClick:n||r?()=>p(e):()=>t(e.mod),children:[(0,G.jsxs)(`div`,{className:`doc-card-ov-hdr`,children:[(0,G.jsx)(`div`,{className:`doc-card-ov-title`,children:e.label}),(n||r)&&(0,G.jsx)(`span`,{className:`doc-ver-badge`,children:e.ver})]}),(0,G.jsx)(`div`,{className:`doc-card-ov-meta`,children:e.meta}),n&&(0,G.jsx)(`div`,{className:`doc-card-ov-action`,children:a===e.id?`...`:`✦ Riassumi →`}),!n&&!r&&(0,G.jsx)(`div`,{className:`doc-card-ov-action`,style:{color:`var(--ink5)`},children:`→ Genera`}),r&&(0,G.jsx)(`div`,{className:`doc-card-ov-action`,style:{color:`var(--warn)`},children:`In lavorazione`})]},e.id)})}),n&&(0,G.jsx)(jn,{title:n.title,content:n.content,onClose:()=>i(null)})]})}function Fn({project:e,onUpdate:t}){let n=e.budget||{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:``};function r(r){t({...e,budget:{...n,...r(n)}})}function i(){r(e=>({...e,produzione:[...e.produzione,{id:hn(),label:``,valore:0}]}))}function a(e,t,n){r(r=>({...r,produzione:r.produzione.map(r=>r.id===e?{...r,[t]:n}:r)}))}function o(e){r(t=>({...t,produzione:t.produzione.filter(t=>t.id!==e)}))}function s(e,t){r(n=>({...n,ads:{...n.ads||{},[e]:parseFloat(t)||0}}))}let c=(n.produzione||[]).reduce((e,t)=>e+(parseFloat(t.valore)||0),0),l=n.ads||{},u=(parseFloat(l.linkedin)||0)+(parseFloat(l.google)||0)+(parseFloat(l.meta)||0)+(parseFloat(l.altri)||0),d=c+u;return(0,G.jsxs)(`div`,{className:`budget-wrap`,children:[(0,G.jsx)(`div`,{className:`ov-sec-hdr`,children:(0,G.jsx)(`div`,{className:`ov-sec-title`,children:`Retainer & Budget mensile`})}),(0,G.jsxs)(`div`,{className:`budget-grid`,children:[(0,G.jsxs)(`div`,{className:`budget-col`,children:[(0,G.jsx)(`div`,{className:`budget-col-title`,children:`Budget produzione`}),(n.produzione||[]).map(e=>(0,G.jsxs)(`div`,{className:`budget-row`,children:[(0,G.jsx)(`input`,{className:`inp budget-inp-label`,placeholder:`es. Copywriter esterno`,value:e.label,onChange:t=>a(e.id,`label`,t.target.value)}),(0,G.jsx)(`input`,{className:`inp budget-inp-val`,type:`number`,placeholder:`0`,value:e.valore||``,onChange:t=>a(e.id,`valore`,t.target.value)}),(0,G.jsx)(`span`,{className:`budget-eur`,children:`€`}),(0,G.jsx)(`button`,{className:`ct-del`,onClick:()=>o(e.id),children:`×`})]},e.id)),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:i,style:{marginTop:6},children:`+ Voce`}),(0,G.jsxs)(`div`,{className:`budget-total`,children:[`Totale produzione: `,(0,G.jsxs)(`strong`,{children:[`€ `,c.toLocaleString(`it-IT`)]})]})]}),(0,G.jsxs)(`div`,{className:`budget-col`,children:[(0,G.jsx)(`div`,{className:`budget-col-title`,children:`Budget Ads mensile`}),[{k:`linkedin`,label:`LinkedIn Ads`},{k:`google`,label:`Google Ads`},{k:`meta`,label:`Meta Ads`},{k:`altri`,label:`Altri / Contingency`}].map(e=>(0,G.jsxs)(`div`,{className:`budget-row`,children:[(0,G.jsx)(`span`,{className:`budget-label`,children:e.label}),(0,G.jsx)(`input`,{className:`inp budget-inp-val`,type:`number`,placeholder:`0`,value:l[e.k]||``,onChange:t=>s(e.k,t.target.value)}),(0,G.jsx)(`span`,{className:`budget-eur`,children:`€`})]},e.k)),(0,G.jsxs)(`div`,{className:`budget-total`,children:[`Totale Ads: `,(0,G.jsxs)(`strong`,{children:[`€ `,u.toLocaleString(`it-IT`)]})]})]})]}),(0,G.jsxs)(`div`,{className:`budget-totale`,children:[(0,G.jsx)(`span`,{children:`Totale mensile (scenario medio)`}),(0,G.jsxs)(`span`,{className:`budget-totale-val`,children:[`€ `,d.toLocaleString(`it-IT`)]}),(0,G.jsxs)(`span`,{style:{fontSize:11,color:`var(--ink4)`},children:[`≈ € `,(d*12).toLocaleString(`it-IT`),` / anno`]})]})]})}function In({project:e}){let[t,n]=(0,U.useState)(null),[i,a]=(0,U.useState)(null),o=`${gn(e.interview||{})}\n\n## Piano Marketing:\n${Object.entries(e.pdm?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`)}\n\n## Comunicazione:\n${Object.entries(e.pdc?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`)}`,s=(e.tasks||[]).filter(e=>!e.done).slice(0,8).map(e=>`- [${e.priority}] ${e.text}`).join(`
`),c=An(e).map(e=>`- ${e.name}: ${e.status}`).join(`
`);async function l(e,t){a(e);try{let i=await r(t);n({title:u.find(t=>t.id===e)?.label,content:i})}catch{n({title:`Errore`,content:`Errore di generazione. Riprova.`})}a(null)}let u=[{id:`report`,label:`Report mensile`,icon:`📊`,prompt:`Genera un report mensile di stato del progetto in italiano con markdown.\n\n## Report Mensile — ${new Date().toLocaleString(`it-IT`,{month:`long`,year:`numeric`})}\n\n### Stato Avanzamento\n[usa le milestone qui sotto]\n${c}\n\n### Task aperti prioritari\n${s}\n\n### Next steps (prossime 2 settimane)\n[3-5 azioni concrete]\n\nCONTESTO: ${o.slice(0,2e3)}`},{id:`tasks`,label:`Task prossimo sprint`,icon:`📋`,prompt:`Suggerisci una lista di task prioritari per il prossimo sprint (2 settimane) di questo progetto in italiano. Formato: ogni task con [PRIORITÀ] tag categoria — assegnatario.\n\nMilestone:\n${c}\n\nTask aperti attuali:\n${s}\n\nCONTESTO: ${o.slice(0,2e3)}`},{id:`retainer`,label:`Proposta retainer`,icon:`💰`,prompt:`Crea una proposta di retainer mensile professionale in italiano per presentarla al cliente. Includi: scenario conservativo, medio, aggressivo con ROI atteso per ciascuno.\n\nCONTESTO: ${o.slice(0,2e3)}`},{id:`ped`,label:`PED mese prossimo`,icon:`📅`,prompt:`Genera un piano editoriale mensile completo per il mese prossimo in italiano con markdown. Includi: distribuzione pilastri, calendario contenuti (16-20 pezzi), copy guida per i top 3 contenuti.\n\nCONTESTO STRATEGICO: ${o.slice(0,3e3)}`}];return(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`ov-sec-hdr`,children:(0,G.jsx)(`div`,{className:`ov-sec-title`,children:`✦ AI Shortcuts`})}),(0,G.jsx)(`div`,{className:`ai-shortcuts-grid`,children:u.map(e=>(0,G.jsxs)(`button`,{className:`ai-shortcut-btn`,onClick:()=>l(e.id,e.prompt),disabled:i===e.id,children:[(0,G.jsx)(`span`,{className:`ai-sc-icon`,children:e.icon}),(0,G.jsx)(`span`,{children:i===e.id?`Generazione…`:e.label+` →`})]},e.id))}),t&&(0,G.jsx)(jn,{title:t.title,content:t.content,onClose:()=>n(null)})]})}var Ln=[`TOFU`,`MOFU`,`BOFU`],Rn=[`#E3001B`,`#D4A017`,`#1B5E20`,`#0D4A78`,`#145932`,`#8B5CF6`,`#F97316`,`#0EA5E9`,`#EC4899`,`#64748B`];function zn({project:e,onUpdate:t}){let n=e.pilastri||[],[r,i]=(0,U.useState)(null),[a,o]=(0,U.useState)(null);function s(n){t({...e,...n(e)})}function c(){a?.nome?.trim()&&(s(e=>({pilastri:(e.pilastri||[]).some(e=>e.id===a.id)?(e.pilastri||[]).map(e=>e.id===a.id?a:e):[...e.pilastri||[],a]})),i(null),o(null))}function l(e){s(t=>({pilastri:(t.pilastri||[]).filter(t=>t.id!==e)}))}function u(){o({id:hn(),nome:``,colore:Rn[n.length%Rn.length],funnel:`MOFU`,kpi:``}),i(`new`)}function d(e){o({...e}),i(e.id)}return(0,G.jsxs)(`div`,{className:`ov-card`,children:[(0,G.jsxs)(`div`,{className:`ov-card-hdr`,children:[(0,G.jsx)(`div`,{className:`ov-card-title`,children:`🏷 Pilastri di comunicazione`}),!r&&(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:u,children:`+ Aggiungi`})]}),r&&a&&(0,G.jsxs)(`div`,{className:`pil-editor`,children:[(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginBottom:10,alignItems:`flex-end`},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Nome pilastro *`}),(0,G.jsx)(`input`,{className:`inp`,autoFocus:!0,placeholder:`es. Coop Promo`,value:a.nome,onChange:e=>o(t=>({...t,nome:e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,style:{maxWidth:110},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Funnel`}),(0,G.jsx)(`select`,{className:`inp`,value:a.funnel||`MOFU`,onChange:e=>o(t=>({...t,funnel:e.target.value})),children:Ln.map(e=>(0,G.jsx)(`option`,{children:e},e))})]}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Colore`}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:5,flexWrap:`wrap`,marginTop:4},children:[Rn.map(e=>(0,G.jsx)(`div`,{onClick:()=>o(t=>({...t,colore:e})),style:{width:22,height:22,borderRadius:`50%`,background:e,cursor:`pointer`,border:a.colore===e?`3px solid var(--ink)`:`2px solid transparent`,flexShrink:0}},e)),(0,G.jsx)(`input`,{type:`color`,value:a.colore||`#64748B`,onChange:e=>o(t=>({...t,colore:e.target.value})),style:{width:22,height:22,border:`none`,borderRadius:`50%`,cursor:`pointer`,padding:0}})]})]})]}),(0,G.jsxs)(`div`,{style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Cadenza`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. 1/sett. · mai adiacente a urgenza`,value:a.cadenza||``,onChange:e=>o(t=>({...t,cadenza:e.target.value}))})]}),(0,G.jsxs)(`div`,{style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`KPI principali`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. Reach · CTR ADV · Click volantino`,value:a.kpi||``,onChange:e=>o(t=>({...t,kpi:e.target.value}))})]}),(0,G.jsxs)(`div`,{style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`# Hashtag set`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:2,placeholder:`#hashtag1 #hashtag2 #hashtag3 — separati da spazio`,value:a.hashtags||``,onChange:e=>o(t=>({...t,hashtags:e.target.value}))}),(0,G.jsx)(`div`,{style:{fontSize:9,color:`var(--ink5)`,marginTop:2},children:`Verranno proposti nel PostFormModal quando selezioni questo pilastro.`})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{i(null),o(null)},children:`Annulla`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:c,disabled:!a.nome?.trim(),children:`Salva pilastro`})]})]}),!r&&(n.length===0?(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink5)`,fontStyle:`italic`,padding:`8px 0`},children:`Nessun pilastro definito. Aggiungine uno per usarlo nel dropdown dei post.`}):(0,G.jsx)(`div`,{className:`pil-list`,children:n.map(e=>(0,G.jsxs)(`div`,{className:`pil-row`,children:[(0,G.jsx)(`div`,{className:`pil-dot`,style:{background:e.colore||`#94A3B8`}}),(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsx)(`div`,{style:{fontWeight:600,fontSize:13,color:`var(--ink)`},children:e.nome}),(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:2,display:`flex`,gap:8,flexWrap:`wrap`},children:[e.funnel&&(0,G.jsx)(`span`,{style:{color:{TOFU:`#0EA5E9`,MOFU:`#F59E0B`,BOFU:`#10B981`}[e.funnel]||`var(--ink4)`,fontWeight:700},children:e.funnel}),e.kpi&&(0,G.jsx)(`span`,{children:e.kpi}),e.cadenza&&(0,G.jsxs)(`span`,{style:{color:`var(--ink5)`},children:[`· `,e.cadenza]})]}),e.hashtags&&(0,G.jsxs)(`div`,{style:{fontSize:9,color:`var(--ink5)`,marginTop:3,fontFamily:`monospace`},children:[e.hashtags.slice(0,60),e.hashtags.length>60?`…`:``]})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,flexShrink:0},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>d(e),children:`✎`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{color:`var(--err)`},onClick:()=>l(e.id),children:`×`})]})]},e.id))}))]})}var Bn=[{id:`pianificato`,label:`Pianificato`,color:`#006EFF`},{id:`in_corso`,label:`In corso`,color:`#FF6B00`},{id:`completato`,label:`Completato`,color:`#00C853`}],Vn=[`Crescita follower`,`Engagement rate`,`Reach mensile`,`Lead generati`,`ROAS campagne`,`CTR medio`,`Conversioni`,`Fatturato attribuibile`];function Hn(e){return{id:hn(),quarter:e,anno:new Date().getFullYear(),stato:`pianificato`,dataQBR:``,kpiTargets:[],note:``,piano:``,approvato:!1,createdAt:Date.now()}}function Un({project:e,onUpdate:t}){let n=e.qbrs||[],[r,i]=(0,U.useState)(null),[a,o]=(0,U.useState)(null),[s,c]=(0,U.useState)({nome:``,target:``,reale:``});function l(n){t({...e,...n(e)})}function u(){a&&(l(e=>({qbrs:(e.qbrs||[]).some(e=>e.id===a.id)?(e.qbrs||[]).map(e=>e.id===a.id?a:e):[...e.qbrs||[],a]})),i(null),o(null))}function d(e){l(t=>({qbrs:(t.qbrs||[]).filter(t=>t.id!==e)}))}function f(){let t=new Set((e.qbrs||[]).map(e=>e.quarter));o(Hn(`Q`+([1,2,3,4].find(e=>!t.has(e))||1))),i(`new`)}function p(e){o({...e}),i(e.id)}function m(){s.nome.trim()&&(o(e=>({...e,kpiTargets:[...e.kpiTargets||[],{id:hn(),...s}]})),c({nome:``,target:``,reale:``}))}function h(e){o(t=>({...t,kpiTargets:(t.kpiTargets||[]).filter(t=>t.id!==e)}))}let g=`Q`+Math.ceil((new Date().getMonth()+1)/3);return(0,G.jsxs)(`div`,{className:`ov-card`,children:[(0,G.jsxs)(`div`,{className:`ov-card-hdr`,children:[(0,G.jsxs)(`div`,{className:`ov-card-title`,children:[(0,G.jsx)(an,{name:`trending`,size:14,color:`var(--gold)`}),` QBR — Quarterly Business Review`]}),!r&&(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:f,children:`+ Nuovo QBR`})]}),r&&a&&(0,G.jsxs)(`div`,{className:`qbr-editor`,children:[(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginBottom:12},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Trimestre`}),(0,G.jsx)(`select`,{className:`inp`,value:a.quarter,onChange:e=>o(t=>({...t,quarter:e.target.value})),children:[`Q1`,`Q2`,`Q3`,`Q4`].map(e=>(0,G.jsx)(`option`,{children:e},e))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Anno`}),(0,G.jsx)(`input`,{className:`inp`,type:`number`,value:a.anno,onChange:e=>o(t=>({...t,anno:+e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Data QBR`}),(0,G.jsx)(`input`,{className:`inp`,type:`date`,value:a.dataQBR||``,onChange:e=>o(t=>({...t,dataQBR:e.target.value}))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Stato`}),(0,G.jsx)(`select`,{className:`inp`,value:a.stato,onChange:e=>o(t=>({...t,stato:e.target.value})),children:Bn.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.label},e.id))})]})]}),(0,G.jsxs)(`div`,{style:{marginBottom:12},children:[(0,G.jsx)(`label`,{className:`lbl`,style:{marginBottom:8,display:`block`},children:`KPI Target vs Reale`}),(a.kpiTargets||[]).map(e=>(0,G.jsxs)(`div`,{className:`qbr-kpi-row`,children:[(0,G.jsx)(`span`,{className:`qbr-kpi-nome`,children:e.nome}),(0,G.jsxs)(`span`,{className:`qbr-kpi-val`,style:{color:`var(--gold)`},children:[`Target: `,e.target||`—`]}),(0,G.jsxs)(`span`,{className:`qbr-kpi-val`,style:{color:e.reale?`var(--ok)`:`var(--ink5)`},children:[`Reale: `,e.reale||`—`]}),e.reale&&e.target&&(0,G.jsx)(`span`,{className:`qbr-kpi-delta`,style:{color:e.reale>=e.target?`var(--ok)`:`var(--err)`},children:e.reale>=e.target?`✓`:`↓`}),(0,G.jsx)(`button`,{className:`ct-del`,onClick:()=>h(e.id),children:`×`})]},e.id)),(0,G.jsxs)(`div`,{className:`qbr-kpi-add-row`,children:[(0,G.jsxs)(`select`,{className:`inp`,style:{flex:2},value:s.nome,onChange:e=>c(t=>({...t,nome:e.target.value})),children:[(0,G.jsx)(`option`,{value:``,children:`+ KPI…`}),Vn.map(e=>(0,G.jsx)(`option`,{value:e,children:e},e))]}),(0,G.jsx)(`input`,{className:`inp`,style:{flex:1},placeholder:`Target`,value:s.target,onChange:e=>c(t=>({...t,target:e.target.value}))}),(0,G.jsx)(`input`,{className:`inp`,style:{flex:1},placeholder:`Reale`,value:s.reale,onChange:e=>c(t=>({...t,reale:e.target.value}))}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:m,disabled:!s.nome,children:`+`})]})]}),(0,G.jsxs)(`div`,{style:{marginBottom:10},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Piano Q+1 (firmato dal cliente)`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:3,placeholder:`Obiettivi e azioni del trimestre successivo…`,value:a.piano||``,onChange:e=>o(t=>({...t,piano:e.target.value}))})]}),(0,G.jsxs)(`div`,{style:{marginBottom:12},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Note interne`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:2,value:a.note||``,onChange:e=>o(t=>({...t,note:e.target.value}))})]}),(0,G.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,marginBottom:12},children:(0,G.jsxs)(`label`,{style:{display:`flex`,gap:6,alignItems:`center`,fontSize:12,fontWeight:600,cursor:`pointer`},children:[(0,G.jsx)(`input`,{type:`checkbox`,checked:!!a.approvato,onChange:e=>o(t=>({...t,approvato:e.target.checked})),style:{accentColor:`var(--ok)`}}),`Piano Q+1 firmato dal cliente`]})}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{i(null),o(null)},children:`Annulla`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:u,children:`Salva QBR`})]})]}),!r&&(n.length===0?(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink5)`,fontStyle:`italic`,padding:`8px 0`},children:`Nessun QBR ancora. Il primo è consigliato dopo 90 giorni di attività.`}):(0,G.jsx)(`div`,{className:`qbr-list`,children:n.sort((e,t)=>t.anno-e.anno||t.quarter.localeCompare(e.quarter)).map(e=>{let t=Bn.find(t=>t.id===e.stato)||Bn[0],n=e.quarter===g&&e.anno===new Date().getFullYear(),r=(e.kpiTargets||[]).filter(e=>e.reale&&e.target&&e.reale>=e.target).length,i=(e.kpiTargets||[]).length;return(0,G.jsxs)(`div`,{className:`qbr-row`,style:n?{borderColor:`var(--gold)`,background:`var(--gold-bg)`}:{},children:[(0,G.jsxs)(`div`,{className:`qbr-row-quarter`,children:[(0,G.jsx)(`div`,{style:{fontWeight:800,fontSize:16,color:n?`var(--gold)`:`var(--ink)`},children:e.quarter}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink4)`},children:e.anno}),n&&(0,G.jsx)(`div`,{style:{fontSize:9,color:`var(--gold)`,fontWeight:700},children:`NOW`})]}),(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,marginBottom:4},children:[(0,G.jsx)(`span`,{className:`qbr-stato-badge`,style:{background:t.color+`18`,color:t.color,border:`1px solid `+t.color+`30`},children:t.label}),e.dataQBR&&(0,G.jsxs)(`span`,{style:{fontSize:10,color:`var(--ink4)`},children:[`📅 `,e.dataQBR]}),e.approvato&&(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ok)`,fontWeight:700},children:`✓ Piano firmato`})]}),i>0&&(0,G.jsxs)(`div`,{style:{fontSize:11,color:`var(--ink3)`},children:[`KPI: `,(0,G.jsxs)(`b`,{style:{color:r===i?`var(--ok)`:`var(--warn)`},children:[r,`/`,i]}),` obiettivi raggiunti`,(0,G.jsx)(`div`,{className:`qbr-kpi-bar`,children:(0,G.jsx)(`div`,{style:{width:(i?r/i*100:0)+`%`,background:`var(--ok)`}})})]}),e.piano&&(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:4,fontStyle:`italic`},children:[e.piano.slice(0,80),e.piano.length>80?`…`:``]})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,flexShrink:0},children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>p(e),children:`✎`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{color:`var(--err)`},onClick:()=>d(e.id),children:`×`})]})]},e.id)})}))]})}function Wn({project:e,onUpdate:t,onGoToModule:n}){let r=kn(e);return(0,G.jsxs)(`div`,{className:`ov-wrap`,children:[(0,G.jsx)(`div`,{className:`ov-metrics`,children:[{label:`Completamento`,value:r.pct+`%`,sub:`${r.pdmF+r.pdcF+r.edF}/${r.totAI} sezioni`},{label:`Task aperti`,value:r.open,sub:r.urgent>0?`${r.urgent} urgenti questa settimana`:`Nessun urgente`},{label:`Sezioni generate`,value:r.pdmF+r.pdcF+r.edF,sub:`PdM ${r.pdmF} · PdC ${r.pdcF} · Ed ${r.edF}`},{label:`Prossima pubbl.`,value:r.nextPost?.data||`—`,sub:r.nextPost?.titolo?.slice(0,24)||`Nessun post pianificato`}].map((e,t)=>(0,G.jsxs)(`div`,{className:`ov-metric-card`,children:[(0,G.jsx)(`div`,{className:`ov-metric-label`,children:e.label}),(0,G.jsx)(`div`,{className:`ov-metric-value`,children:e.value}),(0,G.jsx)(`div`,{className:`ov-metric-sub`,children:e.sub})]},t))}),(0,G.jsxs)(`div`,{className:`ov-two-col`,children:[(0,G.jsxs)(`div`,{className:`ov-left`,children:[(0,G.jsx)(`div`,{className:`ov-card`,children:(0,G.jsx)(Mn,{project:e,onUpdate:t})}),(0,G.jsx)(`div`,{className:`ov-card`,children:(0,G.jsx)(Nn,{project:e,onUpdate:t})})]}),(0,G.jsxs)(`div`,{className:`ov-right`,children:[(0,G.jsx)(`div`,{className:`ov-card`,children:(0,G.jsx)(Pn,{project:e,onGoToModule:n})}),(0,G.jsx)(`div`,{className:`ov-card`,children:(0,G.jsx)(In,{project:e})})]})]}),(0,G.jsx)(zn,{project:e,onUpdate:t}),(0,G.jsx)(Un,{project:e,onUpdate:t}),(0,G.jsx)(Nt,{project:e,onUpdate:t}),(0,G.jsx)(`div`,{className:`ov-card ov-card-full`,children:(0,G.jsx)(Fn,{project:e,onUpdate:t})})]})}function Gn({checked:e,onChange:t}){return(0,G.jsx)(`div`,{className:`toggle ${e?`on`:``}`,onClick:()=>t(!e),children:(0,G.jsx)(`div`,{className:`toggle-knob`})})}function Kn(e,t){let n=e?.meta;return!n?.fbPageId&&!n?.igUserId?null:h(n,t)}var qn=[{id:`starter`,emoji:`🌱`,label:`Starter`,price:490,desc:`15h/mese · social base`},{id:`essential`,emoji:`🥈`,label:`Essential`,price:790,desc:`28h/mese · piano editoriale`},{id:`professional`,emoji:`🚀`,label:`Professional`,price:1200,desc:`45h/mese · strategia + editoriale`},{id:`premium`,emoji:`💎`,label:`Premium`,price:1800,desc:`70h/mese · premium + ADV`},{id:`full-service`,emoji:`🏆`,label:`Full Service`,price:2800,desc:`120h/mese · full service`}];function Jn(e){return(e||``).toLowerCase().normalize(`NFD`).replace(/[̀-ͯ]/g,``).replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function Yn(){return{id:Math.random().toString(36).slice(2,9),nome:`Nuovo Cliente`,settore:``,sito:``,referente:``,email:``,telefono:``,note:``,pacchetto:`professional`,dataInizio:``,social:{ig:``,fb:``,linkedin:``,tiktok:``,sito:``},meta:{fbPageId:``,igUserId:``,pageName:``},portal:{pin:``,mostraFeed:!0,mostraPipeline:!0,mostraInsights:!0},projectIds:[],createdAt:Date.now()}}function Xn({client:e,globalMeta:t,projects:n,onUpdate:r,onAddProject:i,onSelectProject:a,onClose:o}){let[s,c]=(0,U.useState)(`anagrafica`),[l,u]=(0,U.useState)({...e}),[d,f]=(0,U.useState)(!1);function p(e,t){u(n=>({...n,[e]:t}))}function m(e,t){u(n=>({...n,social:{...n.social,[e]:t}}))}function h(e,t){u(n=>({...n,portal:{...n.portal,[e]:t}}))}function g(e){u(t=>({...t,meta:e}))}function _(){r(Qt({...l}))}let v=n.filter(t=>t.clientId===e.id);Jn(e.nome);let y=l.clientToken?Yt(l.id,l.clientToken):null,b=qn.find(e=>e.id===l.pacchetto)||qn[2],x=t?.allPages||[],S=l.meta?.allPages?.length?l.meta.allPages:x;return(0,G.jsxs)(`div`,{className:`cs-wrap`,children:[(0,G.jsxs)(`div`,{className:`cs-header`,children:[(0,G.jsxs)(`div`,{className:`cs-title`,children:[(0,G.jsx)(`div`,{className:`cs-avatar`,children:l.nome[0]||`?`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`cs-nome`,children:l.nome}),(0,G.jsxs)(`div`,{className:`cs-sub`,children:[b.emoji,` `,b.label,` · `,v.length,` progett`,v.length===1?`o`:`i`]})]})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:_,children:`Salva`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:o,children:`✕`})]})]}),(0,G.jsx)(`div`,{className:`cs-tabs`,children:[{id:`anagrafica`,label:`📋 Anagrafica`},{id:`social`,label:`📱 Social & Meta`},{id:`portale`,label:`🔗 Portale`},{id:`progetti`,label:`📂 Progetti`}].map(e=>(0,G.jsx)(`button`,{className:`cs-tab ${s===e.id?`active`:``}`,onClick:()=>c(e.id),children:e.label},e.id))}),(0,G.jsxs)(`div`,{className:`cs-body`,children:[s===`anagrafica`&&(0,G.jsxs)(`div`,{className:`cs-card`,children:[(0,G.jsx)(`div`,{className:`cs-card-title`,children:`📋 Informazioni cliente`}),(0,G.jsxs)(`div`,{className:`fg-row`,children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Nome *`}),(0,G.jsx)(`input`,{className:`inp`,value:l.nome,onChange:e=>p(`nome`,e.target.value)})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Referente`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`Nome cognome`,value:l.referente,onChange:e=>p(`referente`,e.target.value)})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Email`}),(0,G.jsx)(`input`,{className:`inp`,type:`email`,placeholder:`email@cliente.it`,value:l.email,onChange:e=>p(`email`,e.target.value)})]})]}),(0,G.jsxs)(`div`,{className:`fg-row`,style:{marginTop:10},children:[(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Settore`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`es. Food & Beverage`,value:l.settore,onChange:e=>p(`settore`,e.target.value)})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Pacchetto`}),(0,G.jsx)(`select`,{className:`inp`,value:l.pacchetto,onChange:e=>p(`pacchetto`,e.target.value),children:qn.map(e=>(0,G.jsxs)(`option`,{value:e.id,children:[e.emoji,` `,e.label,` — €`,e.price,`/mese · `,e.desc]},e.id))})]}),(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:`Data inizio`}),(0,G.jsx)(`input`,{className:`inp`,type:`date`,value:l.dataInizio,onChange:e=>p(`dataInizio`,e.target.value)})]})]})]}),s===`social`&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`div`,{className:`cs-card`,children:[(0,G.jsxs)(`div`,{className:`cs-card-title`,children:[`📱 Account social del cliente `,(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ink4)`,fontWeight:400},children:`— usati per le pubblicazioni`})]}),[{k:`ig`,label:`Instagram`,color:`#E1306C`,icon:`IG`,ph:`@username o URL profilo`},{k:`fb`,label:`Facebook`,color:`#1877F2`,icon:`FB`,ph:`URL pagina o @username`},{k:`linkedin`,label:`LinkedIn`,color:`#0A66C2`,icon:`LI`,ph:`URL profilo o pagina`}].map(e=>(0,G.jsxs)(`div`,{className:`social-row`,children:[(0,G.jsx)(`span`,{className:`social-badge`,style:{background:e.color},children:e.icon}),(0,G.jsx)(`span`,{className:`social-label`,children:e.label}),(0,G.jsx)(`input`,{className:`inp`,placeholder:e.ph,value:l.social[e.k]||``,onChange:t=>m(e.k,t.target.value)})]},e.k)),[{k:`tiktok`,label:`TikTok`,color:`#111`,icon:`TK`,ph:`@username o URL`},{k:`sito`,label:`Sito web`,color:`#64748B`,icon:`🌐`,ph:`es. nassastudio.it`}].map(e=>(0,G.jsxs)(`div`,{className:`social-row`,children:[(0,G.jsx)(`span`,{className:`social-badge`,style:{background:e.color,fontSize:e.k===`sito`?12:9},children:e.icon}),(0,G.jsx)(`span`,{className:`social-label`,children:e.label}),(0,G.jsx)(`input`,{className:`inp`,placeholder:e.ph,value:l.social[e.k]||``,onChange:t=>m(e.k,t.target.value)}),e.k===`sito`&&l.social.sito&&(0,G.jsx)(`a`,{href:`https://`+l.social.sito.replace(/^https?:\/\//,``),target:`_blank`,rel:`noreferrer`,className:`btn-ghost sm`,style:{flexShrink:0},children:`Apri ↗`})]},e.k))]}),(0,G.jsxs)(`div`,{className:`cs-card`,children:[(0,G.jsxs)(`div`,{className:`cs-card-title`,children:[`🔗 Connetti Meta — `,l.nome||`questo cliente`]}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`,marginBottom:12},children:`Ogni cliente usa la propria pagina. Connetti il tuo account Nassa per vedere le pagine disponibili, poi seleziona quella di questo cliente.`}),S.length>0?(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,marginBottom:14,background:`#F0FDF4`,border:`1px solid #BBF7D0`,borderRadius:8,padding:`8px 12px`},children:[(0,G.jsx)(`span`,{style:{fontSize:16},children:`✅`}),(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{style:{fontSize:12,fontWeight:700,color:`#166534`},children:[S.length,` pagine disponibili`]}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`#16A34A`},children:`Caricate dal token Business Manager della sidebar. Seleziona la pagina di questo cliente qui sotto.`})]})]}):(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,marginBottom:14,background:`#FFF7ED`,border:`1px solid #FED7AA`,borderRadius:8,padding:`8px 12px`},children:[(0,G.jsx)(`span`,{style:{fontSize:16},children:`⚠️`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontSize:12,fontWeight:700,color:`#92400E`},children:`Nessuna pagina caricata`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`#B45309`},children:`Collega prima il token Business Manager dalla sidebar (in basso a sinistra).`})]})]}),S.length>0&&!l.meta?.fbPageId&&(0,G.jsxs)(`div`,{className:`meta-page-picker`,children:[(0,G.jsxs)(`div`,{className:`meta-page-picker-hdr`,children:[(0,G.jsxs)(`span`,{style:{fontWeight:700,color:`#fff`},children:[`Scegli la pagina per `,(0,G.jsx)(`em`,{children:l.nome||`questo cliente`})]}),(0,G.jsx)(`span`,{style:{fontSize:11,color:`rgba(255,255,255,.75)`},children:`Seleziona pagina Facebook + account Instagram`})]}),(0,G.jsx)(`div`,{className:`meta-page-picker-list`,children:S.map(e=>(e.igId&&(e.igId,e.nome),(0,G.jsxs)(`button`,{className:`meta-page-row`,onClick:()=>{let t={...l.meta||{},fbPageId:e.id,igUserId:e.igId||``,pageName:e.nome};g(t),setTimeout(()=>r({...l,meta:t}),50)},children:[(0,G.jsx)(`div`,{className:`meta-page-avatar`,children:(e.nome||`P`)[0]}),(0,G.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:13,marginBottom:3},children:e.nome}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`},children:[(0,G.jsx)(`span`,{className:`meta-tag-fb`,children:`📘 Facebook`}),e.igId?(0,G.jsx)(`span`,{className:`meta-tag-ig`,children:`📸 Instagram`}):(0,G.jsx)(`span`,{className:`meta-tag-none`,children:`Nessun IG collegato`})]})]}),(0,G.jsx)(`span`,{className:`meta-page-sel-btn`,children:`Seleziona →`})]},e.id)))})]}),l.meta?.fbPageId&&(0,G.jsxs)(`div`,{className:`meta-platforms-grid`,children:[(0,G.jsxs)(`div`,{className:`meta-plat-card`,style:{borderColor:l.meta?.igUserId?`#10B981`:`#E2E8F0`},children:[(0,G.jsxs)(`div`,{className:`meta-plat-hdr`,style:{color:`#E1306C`},children:[(0,G.jsx)(`span`,{className:`social-badge`,style:{background:`#E1306C`},children:`IG`}),`Instagram `,l.meta?.igUserId&&(0,G.jsx)(`span`,{className:`meta-conn-badge`,children:`✓ Connesso`})]}),l.meta?.igUserId?(0,G.jsx)(G.Fragment,{children:(0,G.jsxs)(`div`,{className:`meta-plat-val`,children:[`@`,l.meta.pageName||l.meta.nomePagina]})}):(0,G.jsx)(`div`,{style:{fontSize:11,color:`#F59E0B`},children:`⚠️ Nessun account IG Business collegato a questa pagina`})]}),(0,G.jsxs)(`div`,{className:`meta-plat-card`,style:{borderColor:`#10B981`},children:[(0,G.jsxs)(`div`,{className:`meta-plat-hdr`,style:{color:`#1877F2`},children:[(0,G.jsx)(`span`,{className:`social-badge`,style:{background:`#1877F2`},children:`FB`}),`Facebook `,(0,G.jsx)(`span`,{className:`meta-conn-badge`,children:`✓ Connesso`})]}),(0,G.jsx)(`div`,{className:`meta-plat-val`,children:l.meta.pageName||l.meta.nomePagina}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{marginTop:6},onClick:()=>{let e={...l.meta||{},fbPageId:``,igUserId:``,pageName:``};g(e),setTimeout(()=>r({...l,meta:e}),50)},children:`🔄 Cambia pagina`})]})]}),!S.length&&(0,G.jsxs)(`div`,{style:{fontSize:11,color:`var(--ink4)`,padding:`8px 0`},children:[`ℹ️ Dopo aver connesso l'account, seleziona la pagina specifica per `,l.nome||`questo cliente`,`.`]}),(0,G.jsx)(`div`,{className:`meta-warn-box`,style:{marginTop:10},children:`🔒 I token salvati sono personali e non vengono mai condivisi tra clienti diversi. Il token scade dopo 60 giorni — riconnetti periodicamente.`})]})]}),s===`portale`&&(0,G.jsxs)(`div`,{className:`cs-card`,children:[(0,G.jsx)(`div`,{className:`cs-card-title`,children:`🔗 Portale cliente`}),y?(0,G.jsxs)(`div`,{className:`portal-url-row`,children:[(0,G.jsx)(`div`,{className:`portal-url`,style:{fontSize:11,wordBreak:`break-all`},children:y}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>{navigator.clipboard?.writeText(y),f(!0),setTimeout(()=>f(!1),2e3)},children:d?`✓ Copiato`:`🔗 Copia link`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{color:`var(--err)`},onClick:()=>{if(!window.confirm(`Rigenerare il link? Il vecchio link smetterà di funzionare.`))return;let e=Qt({...l,clientToken:null});u(e),r(e)},title:`Rigenera token`,children:`🔄`})]}):(0,G.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1px solid #e5e7eb`,borderRadius:8,padding:`12px 16px`,marginBottom:12},children:[(0,G.jsx)(`div`,{style:{fontSize:13,color:`#374151`,marginBottom:8},children:`🔒 Link sicuro non ancora generato per questo cliente.`}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:()=>{let e=Qt({...l});u(e),r(e)},children:`🔗 Genera link sicuro`})]}),(0,G.jsxs)(`div`,{className:`portal-toggles`,children:[(0,G.jsxs)(`div`,{className:`portal-toggle-row`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:13},children:`Mostra Feed`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`},children:`Il cliente può vedere e approvare i post del feed`})]}),(0,G.jsx)(Gn,{checked:l.portal.mostraFeed,onChange:e=>h(`mostraFeed`,e)})]}),(0,G.jsxs)(`div`,{className:`portal-toggle-row`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:13},children:`Mostra Pipeline (Kanban)`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`},children:`Il cliente può vedere lo stato dei contenuti in produzione`})]}),(0,G.jsx)(Gn,{checked:l.portal.mostraPipeline,onChange:e=>h(`mostraPipeline`,e)})]}),(0,G.jsxs)(`div`,{className:`portal-toggle-row`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:13},children:`Mostra Meta Insights`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`},children:`Il cliente vede le statistiche Facebook della sua pagina`})]}),(0,G.jsx)(Gn,{checked:l.portal?.mostraInsights??!0,onChange:e=>h(`mostraInsights`,e)})]})]}),(0,G.jsxs)(`div`,{style:{marginTop:16},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`PIN cliente (opzionale)`}),(0,G.jsx)(`input`,{className:`inp`,type:`password`,placeholder:`••••••••`,style:{maxWidth:200},value:l.portal.pin,onChange:e=>h(`pin`,e.target.value)}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:4},children:`Protegge il link cliente`})]})]}),s===`progetti`&&(0,G.jsxs)(`div`,{className:`cs-card`,children:[(0,G.jsxs)(`div`,{className:`cs-card-title`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,G.jsxs)(`span`,{children:[`📂 Progetti (`,v.length,`)`]}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:()=>i(e.id),children:`+ Nuovo progetto`})]}),v.length===0&&(0,G.jsx)(`div`,{className:`ct-empty`,children:`Nessun progetto. Crea il primo progetto per questo cliente.`}),v.map(e=>{let t=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,n=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,r=Y.length+X.length,i=Math.round((t+n)/r*100);return(0,G.jsxs)(`div`,{className:`cs-proj-row`,onClick:()=>a(e.id),children:[(0,G.jsxs)(`div`,{style:{flex:1},children:[(0,G.jsx)(`div`,{style:{fontWeight:600,fontSize:13},children:e.name}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:2},children:new Date(e.createdAt).toLocaleDateString(`it-IT`)}),(0,G.jsx)(`div`,{className:`dc-bar`,style:{marginTop:6,width:180},children:(0,G.jsx)(`div`,{className:`dc-fill`,style:{width:i+`%`}})})]}),(0,G.jsxs)(`div`,{style:{textAlign:`right`},children:[(0,G.jsxs)(`div`,{style:{fontSize:11,fontWeight:700,color:`var(--gold)`},children:[i,`%`]}),(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink4)`},children:[t+n,`/`,r,` sez.`]})]}),(0,G.jsx)(`div`,{style:{color:`var(--gold)`,fontSize:16},children:`→`})]},e.id)})]})]})]})}function Zn({item:e,clientProjects:t,onUpdateProject:n}){let[r,i]=(0,U.useState)(!1),[a,o]=(0,U.useState)(``),[s,c]=(0,U.useState)(!1),l=e.clientComment;function u(){a.trim()&&(t.forEach(t=>{t.ed?.feedItems?.find(t=>t.id===e.id)&&n({...t,ed:{...t.ed,feedItems:t.ed.feedItems.map(t=>t.id===e.id?{...t,clientComment:a.trim(),clientCommentAt:new Date().toISOString()}:t)}})}),c(!0),i(!1),setTimeout(()=>c(!1),3e3))}return(0,G.jsxs)(`div`,{style:{marginTop:8},children:[l&&!r&&(0,G.jsxs)(`div`,{className:`portal-comment-existing`,children:[(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ink4)`,fontWeight:700},children:`💬 Tuo commento:`}),(0,G.jsx)(`span`,{style:{fontSize:11,color:`var(--ink3)`,marginLeft:6},children:l}),(0,G.jsx)(`button`,{className:`portal-comment-edit`,onClick:()=>{o(l),i(!0)},children:`modifica`})]}),s&&(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ok)`,marginTop:4},children:`✓ Commento salvato`}),!r&&(0,G.jsx)(`button`,{className:`portal-comment-btn`,onClick:()=>{o(l||``),i(!0)},children:l?`✎ Modifica commento`:`💬 Aggiungi commento`}),r&&(0,G.jsxs)(`div`,{className:`portal-comment-form`,children:[(0,G.jsx)(`textarea`,{className:`portal-comment-textarea`,rows:2,autoFocus:!0,placeholder:`Es: Ok ma cambia la CTA con 'Scopri in negozio' — rimuovi il prezzo dalla caption…`,value:a,onChange:e=>o(e.target.value)}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:6,marginTop:6},children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:u,disabled:!a.trim(),children:`Salva commento`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:()=>i(!1),children:`Annulla`})]})]})]})}function Qn({project:e}){let t=p(e),n=t.length,r={TOFU:0,MOFU:0,BOFU:0};t.forEach(e=>{let t=(e.funnel||``).toUpperCase();r[t]!==void 0&&r[t]++});let i=e=>n>0?Math.round(r[e]/n*100):0,a=e.ed?.funnelTargets||{TOFU:32,MOFU:36,BOFU:32},o={};t.forEach(e=>{e.pilastro&&(o[e.pilastro]||(o[e.pilastro]={n:0,funnel:e.funnel||`TOFU`}),o[e.pilastro].n++)});let s=Object.entries(o).sort((e,t)=>t[1].n-e[1].n),c=e.pdm?.sections?.funnel_strategy?.content||``,l=e.pdc?.sections?.funnel_comunicativo?.content||``,u={TOFU:{bg:`#E6F1FB`,border:`#B5D4F4`,tx:`#042C53`,icon:`▲`,bar:`#185FA5`},MOFU:{bg:`#FAEEDA`,border:`#FAC775`,tx:`#412402`,icon:`◆`,bar:`#854F0B`},BOFU:{bg:`#FCEBEB`,border:`#F7C1C1`,tx:`#501313`,icon:`▼`,bar:`#A32D2D`}};function d(e){return(t.find(t=>t.pilastro===e)?.funnel||`TOFU`).toUpperCase()}return(0,G.jsxs)(`div`,{className:`cfv-wrap`,children:[(0,G.jsxs)(`div`,{className:`cfv-header`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{className:`cfv-title`,children:[`Strategia Funnel — `,e.interview?.nome||e.name]}),(0,G.jsx)(`div`,{className:`cfv-sub`,children:`Distribuzione contenuti per livello funnel e pilastro editoriale`})]}),(0,G.jsx)(`div`,{style:{display:`flex`,gap:6},children:[`TOFU`,`MOFU`,`BOFU`].map(e=>(0,G.jsxs)(`div`,{className:`cfv-mix-pill`,style:{background:u[e].bg,color:u[e].tx},children:[e,` `,i(e),`%`]},e))})]}),(0,G.jsx)(`div`,{className:`cfv-stages`,children:[`TOFU`,`MOFU`,`BOFU`].map(e=>{let c=u[e],l=r[e],f=i(e),p=a[e]||0,m=f-p,h=s.filter(([,e])=>d(Object.keys(o).find(t=>o[t]===e)||``)===`stage`||!0).filter(([n])=>(t.find(e=>e.pilastro===n)?.funnel||``).toUpperCase()===e);return(0,G.jsxs)(`div`,{className:`cfv-stage`,style:{background:c.bg,border:`1px solid ${c.border}`,color:c.tx},children:[(0,G.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`},children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:{fontSize:22},children:c.icon}),(0,G.jsx)(`div`,{style:{fontSize:14,fontWeight:600,marginTop:4},children:e}),(0,G.jsx)(`div`,{style:{fontSize:11,opacity:.8,lineHeight:1.4,marginTop:2},children:{TOFU:`Awareness — raggiungo nuove persone, costruisco identità brand`,MOFU:`Consideration — costruisco fiducia, educo sul prodotto`,BOFU:`Conversion — porto alla decisione d'acquisto`}[e]})]}),(0,G.jsxs)(`div`,{style:{textAlign:`right`,flexShrink:0},children:[(0,G.jsxs)(`div`,{style:{fontSize:28,fontWeight:500,lineHeight:1},children:[f,`%`]}),(0,G.jsxs)(`div`,{style:{fontSize:11,opacity:.7,marginTop:2},children:[l,` post su `,n]}),n>0&&(0,G.jsxs)(`div`,{style:{fontSize:10,marginTop:4,opacity:.7},children:[`target `,p,`% `,m>0?`(+${m}pp)`:`(${m}pp)`]})]})]}),(0,G.jsx)(`div`,{className:`cfv-bar-bg`,children:(0,G.jsx)(`div`,{className:`cfv-bar-fill`,style:{width:f+`%`,background:c.bar}})}),h.length>0&&(0,G.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:4,marginTop:8},children:h.map(([e])=>(0,G.jsx)(`span`,{className:`cfv-pill`,children:e},e))})]},e)})}),s.length>0&&(0,G.jsx)(`div`,{className:`cfv-table-wrap`,children:(0,G.jsxs)(`table`,{className:`cfv-table`,children:[(0,G.jsx)(`thead`,{children:(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`th`,{children:`Pilastro`}),(0,G.jsx)(`th`,{children:`Funnel`}),(0,G.jsx)(`th`,{children:`Post`}),(0,G.jsx)(`th`,{children:`% sul piano`}),(0,G.jsx)(`th`,{children:`Cadenza`}),(0,G.jsx)(`th`,{children:`KPI principale`})]})}),(0,G.jsx)(`tbody`,{children:s.map(([r,{n:i}])=>{let a=(t.find(e=>e.pilastro===r)?.funnel||`TOFU`).toUpperCase(),o=(e.pilastri||[]).find(e=>e.nome===r),s=B(r,e),c=o?.cadenza||`—`,l=o?.kpi||{CoopPromo:`Click · CTR ADV`,FiorFiore:`Salvataggi · Views`,TerraTavola:`Salvataggi · Condivisioni`,Istituzionale:`Reach · Condivisioni`,CoopSocial:`Reaction · Interazioni`,"Coop Promo":`Click · CTR ADV`,"Fior Fiore":`Salvataggi · Views`,"Terra/Tavola":`Salvataggi · Condivisioni`,"Coop Social":`Reaction · Interazioni`}[r]||`Reach · Engagement`,u=n?Math.round(i/n*100):0;return(0,G.jsxs)(`tr`,{children:[(0,G.jsx)(`td`,{children:(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,G.jsx)(`span`,{className:`cfv-dot`,style:{background:s}}),(0,G.jsx)(`span`,{style:{fontWeight:600,fontSize:13},children:r})]})}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`span`,{className:`cfv-tag`,style:{...(()=>{let[e,t]={TOFU:[`#E6F1FB`,`#042C53`],MOFU:[`#FAEEDA`,`#412402`],BOFU:[`#FCEBEB`,`#501313`]}[a]||[`#F1F5F9`,`#64748B`];return{background:e,color:t}})()},children:a})}),(0,G.jsx)(`td`,{style:{fontSize:13,fontWeight:600},children:i}),(0,G.jsxs)(`td`,{children:[(0,G.jsx)(`div`,{className:`cfv-mini-bar`,children:(0,G.jsx)(`div`,{style:{width:u+`%`,height:`100%`,background:s,borderRadius:3}})}),(0,G.jsxs)(`div`,{style:{fontSize:10,color:`#64748B`},children:[u,`%`]})]}),(0,G.jsx)(`td`,{style:{fontSize:11,color:`var(--ink4)`},children:c}),(0,G.jsx)(`td`,{children:(0,G.jsx)(`span`,{className:`cfv-kpi`,children:l})})]},r)})})]})}),(c||l)&&(0,G.jsxs)(`div`,{className:`cfv-notes`,children:[c&&(0,G.jsxs)(`div`,{className:`cfv-note-card`,children:[(0,G.jsx)(`div`,{className:`cfv-note-title`,children:`📊 Note strategiche — Funnel Strategy`}),(0,G.jsx)(`div`,{className:`cfv-note-body`,dangerouslySetInnerHTML:{__html:T(c.slice(0,800)+(c.length>800?`…`:``))}})]}),l&&(0,G.jsxs)(`div`,{className:`cfv-note-card`,children:[(0,G.jsx)(`div`,{className:`cfv-note-title`,children:`📣 Note comunicative — Funnel Comunicativo`}),(0,G.jsx)(`div`,{className:`cfv-note-body`,dangerouslySetInnerHTML:{__html:T(l.slice(0,800)+(l.length>800?`…`:``))}})]})]}),(0,G.jsxs)(`div`,{className:`cfv-mix-bar-wrap`,children:[(0,G.jsx)(`span`,{style:{fontSize:11,fontWeight:600,color:`#64748B`,whiteSpace:`nowrap`},children:`Mix funnel`}),(0,G.jsx)(`div`,{className:`cfv-mix-bar`,children:[`TOFU`,`MOFU`,`BOFU`].map(e=>(0,G.jsx)(`div`,{className:`cfv-mix-seg`,style:{width:i(e)+`%`,background:u[e].bar},children:i(e)>8?i(e)+`%`:``},e))}),(0,G.jsx)(`div`,{style:{display:`flex`,gap:12},children:[`TOFU`,`MOFU`,`BOFU`].map(e=>(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:5,fontSize:11},children:[(0,G.jsx)(`div`,{style:{width:8,height:8,borderRadius:`50%`,background:u[e].bar}}),(0,G.jsx)(`span`,{children:e})]},e))})]})]})}function $n({client:e,projects:n,onBack:r,onUpdateProject:i}){let[a,o]=(0,U.useState)(`approva`),s=n.filter(t=>t.clientId===e.id),c=s.flatMap(e=>p(e).filter(e=>m(e,t.revisione)||m(e,t.approvato))),l=s[0];function u(e){i&&s.forEach(t=>{t.ed?.feedItems?.find(t=>t.id===e)&&i({...t,ed:{...t.ed,feedItems:t.ed.feedItems.map(t=>t.id===e?{...t,stato:`approvato`}:t)}})})}function d(e){i&&s.forEach(t=>{t.ed?.feedItems?.find(t=>t.id===e)&&i({...t,ed:{...t.ed,feedItems:t.ed.feedItems.map(t=>t.id===e?{...t,stato:`non-approvato`}:t)}})})}let f=c.filter(e=>e.stato===`revisione`||e.stato===`semaforo`),h=c.filter(e=>e.stato===`approvato`);return(0,G.jsxs)(`div`,{className:`portal-wrap`,children:[(0,G.jsxs)(`div`,{className:`portal-header`,children:[(0,G.jsx)(`div`,{className:`portal-agency`,children:`NASSA STUDIO`}),(0,G.jsx)(`div`,{className:`portal-client`,children:e.nome}),r&&(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:r,children:`← Torna al pannello`})]}),(0,G.jsxs)(`div`,{className:`portal-tabs`,children:[(0,G.jsxs)(`button`,{className:`portal-tab ${a===`approva`?`active`:``}`,onClick:()=>o(`approva`),children:[`✅ Approvazioni`,f.length>0&&(0,G.jsx)(`span`,{className:`portal-badge`,children:f.length})]}),(0,G.jsx)(`button`,{className:`portal-tab ${a===`funnel`?`active`:``}`,onClick:()=>o(`funnel`),children:`📊 Strategia Funnel`}),(0,G.jsxs)(`button`,{className:`portal-tab ${a===`insights`?`active`:``}`,onClick:()=>o(`insights`),children:[`📈 Meta Insights`,e?.meta?.fbPageId&&(0,G.jsx)(`span`,{style:{marginLeft:4,fontSize:9,color:`#10B981`},children:`●`})]})]}),a===`approva`&&(0,G.jsxs)(`div`,{className:`portal-body`,children:[(0,G.jsx)(`div`,{className:`portal-section-title`,children:`Post da approvare`}),f.length===0&&(0,G.jsx)(`div`,{className:`ct-empty`,children:`Nessun post in attesa di approvazione.`}),f.map(e=>(0,G.jsxs)(`div`,{className:`portal-post-row`,children:[(e.immagineBase64||e.immagineUrl)&&(0,G.jsx)(`img`,{src:e.immagineBase64||e.immagineUrl,className:`portal-post-thumb`,alt:``,onError:e=>e.target.style.display=`none`}),(0,G.jsxs)(`div`,{style:{flex:1},children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:14},children:e.titolo}),e.caption&&(0,G.jsxs)(`div`,{className:`portal-post-caption`,children:[e.caption.slice(0,120),e.caption.length>120?`…`:``]}),(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink4)`,marginTop:4},children:[(e.piattaforme||[]).join(` · `),e.data?` · ${e.data}`:``]}),e.pilastro&&(0,G.jsx)(`span`,{style:{fontSize:10,color:B(e.pilastro),fontWeight:700,marginTop:3,display:`inline-block`},children:e.pilastro}),(0,G.jsx)(Zn,{item:e,clientProjects:s,onUpdateProject:i})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,flexShrink:0},children:[(0,G.jsx)(`button`,{className:`btn-primary sm`,style:{background:`var(--ok)`},onClick:()=>u(e.id),children:`✓ Approva`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{color:`var(--err)`},onClick:()=>d(e.id),children:`✗ Rifiuta`})]})]},e.id)),h.length>0&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`div`,{className:`portal-section-title`,style:{marginTop:24},children:`Post approvati`}),h.map(e=>(0,G.jsxs)(`div`,{className:`portal-post-row`,children:[(e.immagineBase64||e.immagineUrl)&&(0,G.jsx)(`img`,{src:e.immagineBase64||e.immagineUrl,className:`portal-post-thumb`,alt:``,onError:e=>e.target.style.display=`none`}),(0,G.jsxs)(`div`,{style:{flex:1},children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:14},children:e.titolo}),(0,G.jsx)(`div`,{style:{fontSize:10,color:`var(--ok)`,marginTop:2},children:`✅ Approvato`})]})]},e.id))]})]}),a===`funnel`&&l&&(0,G.jsx)(`div`,{className:`portal-body`,children:(0,G.jsx)(Qn,{project:l})}),a===`insights`&&(0,G.jsxs)(`div`,{className:`portal-body`,children:[e?.portal?.mostraInsights===!1?(0,G.jsxs)(`div`,{className:`mi-empty`,children:[(0,G.jsx)(`div`,{style:{fontSize:24},children:`🔒`}),(0,G.jsx)(`div`,{children:`Statistiche non disponibili per questo portale.`})]}):(0,G.jsx)(E,{client:e}),!e?.meta?.fbPageId&&(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink4)`,marginTop:-8,textAlign:`center`,paddingBottom:16},children:`Chiedi alla tua agenzia di collegare l'account Meta per visualizzare le statistiche della tua pagina Facebook.`})]}),a===`funnel`&&!l&&(0,G.jsx)(`div`,{className:`portal-body`,children:(0,G.jsx)(`div`,{className:`ct-empty`,children:`Nessun progetto trovato per questo cliente.`})})]})}function er(){return{id:hn(),titolo:`Nuovo post`,tipo:`post`,piattaforme:[`instagram`],stato:`bozza`,data:``,immagineUrl:``,immagineBase64:``,videoUrl:``,membersAssigned:[],caption:``,time:``,hashtags:``,cta:``,ctaLink:``,contentFramework:``,targetPersona:``,isTrend:!1,trendAnchor:``,captionB:``,abActive:!1,noteGrafico:``,noteVideo:``,linkAsset:``,collaborazioni:``,tagMenzioni:``,comments:[],createdAt:Date.now()}}function tr({feedItems:e,selectedId:t}){return(0,G.jsx)(`div`,{className:`phone-wrap`,children:(0,G.jsxs)(`div`,{className:`phone-frame`,children:[(0,G.jsx)(`div`,{className:`phone-notch`}),(0,G.jsxs)(`div`,{className:`phone-screen`,children:[(0,G.jsxs)(`div`,{className:`ig-header`,children:[(0,G.jsx)(`div`,{className:`ig-avatar`,children:e[0]?`F`:`N`}),(0,G.jsx)(`div`,{className:`ig-name`,children:`Feed`}),(0,G.jsx)(`div`,{className:`ig-header-icons`,children:`⊕ ☰`})]}),(0,G.jsxs)(`div`,{className:`ig-stats`,children:[(0,G.jsxs)(`div`,{className:`ig-stat`,children:[(0,G.jsx)(`div`,{className:`ig-stat-n`,children:e.length}),(0,G.jsx)(`div`,{className:`ig-stat-l`,children:`Post`})]}),(0,G.jsxs)(`div`,{className:`ig-stat`,children:[(0,G.jsx)(`div`,{className:`ig-stat-n`,children:`—`}),(0,G.jsx)(`div`,{className:`ig-stat-l`,children:`Follower`})]}),(0,G.jsxs)(`div`,{className:`ig-stat`,children:[(0,G.jsx)(`div`,{className:`ig-stat-n`,children:`—`}),(0,G.jsx)(`div`,{className:`ig-stat-l`,children:`Seguiti`})]})]}),(0,G.jsxs)(`div`,{className:`ig-grid`,children:[e.map(e=>{let n=e.immagineBase64||e.immagineUrl||``;return(0,G.jsxs)(`div`,{className:`ig-cell ${e.id===t?`ig-cell-sel`:``}`,children:[n?(0,G.jsx)(`img`,{src:n,alt:``,className:`ig-cell-img`,onError:e=>e.target.style.display=`none`}):(0,G.jsx)(`div`,{className:`ig-cell-empty`,children:(0,G.jsx)(`span`,{style:{fontSize:18},children:f[e.tipo]||`📄`})}),e.tipo===`reel`&&(0,G.jsx)(`div`,{className:`ig-reel-badge`,children:`▶`}),e.tipo===`carousel`&&(0,G.jsx)(`div`,{className:`ig-reel-badge`,children:`⊞`}),e.stato!==`bozza`&&(0,G.jsx)(`div`,{className:`ig-cell-badge`,children:i[e.stato]?.label?.split(` `)[0]})]},e.id)}),Array(Math.max(0,6-e.length)).fill(null).map((e,t)=>(0,G.jsx)(`div`,{className:`ig-cell ig-cell-empty-gray`},`e`+t))]}),t&&(()=>{let n=e.find(e=>e.id===t);return n?(0,G.jsxs)(`div`,{className:`ig-post-preview`,children:[(0,G.jsxs)(`div`,{className:`ig-post-hdr`,children:[(0,G.jsx)(`div`,{className:`ig-avatar`,style:{width:22,height:22,fontSize:9},children:`N`}),(0,G.jsx)(`div`,{style:{fontSize:11,fontWeight:700},children:`Feed`})]}),(n.immagineBase64||n.immagineUrl)&&(0,G.jsx)(`img`,{src:n.immagineBase64||n.immagineUrl,alt:``,style:{width:`100%`,display:`block`},onError:e=>e.target.style.display=`none`}),n.caption&&(0,G.jsxs)(`div`,{className:`ig-post-caption`,children:[n.caption.slice(0,120),n.caption.length>120?`…`:``]})]}):null})(),!t&&(0,G.jsx)(`div`,{className:`ig-bottom-hint`,children:`Clicca un post per vederlo`})]})]})})}function nr(e){if(e?.pilastri?.length>0)return e.pilastri.map(e=>e.nome);let t=e?.pdc?.sections?.pilastri?.content||e?.pdm?.sections?.pilastri?.content||``;if(t){let e=t.split(`
`).filter(e=>e.trim().startsWith(`#`)||/^\s*0?[1-9]/.test(e)).map(e=>e.replace(/[#*\d.—\-]/g,``).trim()).filter(e=>e.length>3&&e.length<60);if(e.length>0)return[...new Set(e)]}return[...new Set((e?.ed?.feedItems||[]).map(e=>e.pilastro).filter(Boolean))]}function rr({project:e,onUpdate:t,globalMeta:n,client:r=null}){let i=p(e),[a,s]=(0,U.useState)(null),[c,l]=(0,U.useState)(null),[u,d]=(0,U.useState)([]),[m,h]=(0,U.useState)(null);(0,U.useEffect)(()=>{ne(re).then(e=>d(e||ie))},[]);function _(n){t({...e,ed:{...e.ed||{},...n(e.ed||{})}})}function v(e){_(t=>{let n=(t.feedItems||[]).some(t=>t.id===e.id);return{...t,feedItems:n?(t.feedItems||[]).map(t=>t.id===e.id?e:t):[...t.feedItems||[],e]}}),l(null)}function y(e){_(t=>({...t,feedItems:(t.feedItems||[]).filter(t=>t.id!==e)})),l(null),s(null)}function b(){l(er())}function S(e){s(t=>t===e.id?null:e.id)}return(0,G.jsxs)(`div`,{className:`feed-wrap`,children:[(0,G.jsxs)(`div`,{className:`feed-list`,children:[(0,G.jsxs)(`div`,{className:`feed-list-hdr`,children:[(0,G.jsxs)(`div`,{className:`feed-list-count`,children:[`Post nel feed (`,i.length,`)`]}),(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:b,children:`+ Aggiungi`})]}),i.length===0&&(0,G.jsx)(`div`,{className:`ct-empty`,style:{paddingTop:40},children:`Nessun post. Clicca "+ Aggiungi" per creare il primo contenuto.`}),i.map(e=>{let t=(e.piattaforme||[]).map(e=>g.find(t=>t.id===e)).filter(Boolean),r=o(e.stato),i=(e.membersAssigned||[]).map(e=>u.find(t=>t.id===e)).filter(Boolean),s=e.immagineBase64||e.immagineUrl||``;return(0,G.jsxs)(`div`,{className:`feed-row ${a===e.id?`feed-row-sel`:``}`,onClick:()=>S(e),children:[(0,G.jsx)(`div`,{className:`feed-thumb`,onClick:t=>{t.stopPropagation(),l(e)},children:s?(0,G.jsx)(`img`,{src:s,alt:``,onError:e=>e.target.style.display=`none`}):(0,G.jsxs)(`div`,{className:`feed-thumb-placeholder`,children:[(0,G.jsx)(`span`,{style:{fontSize:20},children:f[e.tipo]||`📄`}),(0,G.jsx)(`span`,{style:{fontSize:9,color:`var(--ink4)`},children:`Carica`})]})}),(0,G.jsxs)(`div`,{className:`feed-row-body`,children:[(0,G.jsx)(`div`,{className:`feed-row-title`,onClick:t=>{t.stopPropagation(),l(e)},children:e.titolo}),(0,G.jsxs)(`div`,{className:`feed-row-meta`,children:[t.map(e=>(0,G.jsx)(`span`,{style:{color:e.color,fontWeight:700,fontSize:10,marginRight:4},children:e.label},e.id)),(0,G.jsx)(`span`,{className:`feed-stato-badge`,style:{background:r.bg,color:r.tx},children:r.label}),e.data&&(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ink4)`},children:e.data})]}),i.length>0&&(0,G.jsxs)(`div`,{className:`feed-row-team`,children:[i.map(e=>(0,G.jsx)(`div`,{className:`feed-mem-dot`,style:{background:e.colore},title:e.nome,children:e.nome[0]},e.id)),(0,G.jsx)(`span`,{style:{fontSize:10,color:`var(--ink4)`},children:i.map(e=>e.nome.split(` `)[0]).join(`, `)})]})]}),(0,G.jsxs)(`div`,{className:`feed-row-acts`,onClick:e=>e.stopPropagation(),children:[e.stato===`approvato`&&n&&(0,G.jsx)(`button`,{className:`btn-primary sm`,onClick:()=>h(e),children:`📤`}),(0,G.jsx)(`button`,{className:`btn-ghost sm`,onClick:t=>{t.stopPropagation(),l(e)},children:`✎`})]})]},e.id)})]}),(0,G.jsx)(tr,{feedItems:i,selectedId:a}),c&&(0,G.jsx)(I,{item:c,members:u,onSave:v,onDelete:i.some(e=>e.id===c.id)?y:null,onClose:()=>l(null)}),m&&(0,G.jsx)(x,{post:{...m},meta:Kn(r,n),onClose:()=>h(null),onPublished:()=>{_(e=>({...e,feedItems:(e.feedItems||[]).map(e=>e.id===m.id?{...e,stato:`pubblicato`}:e)})),h(null)}})]})}var ir={pdm:{label:`Piano di Marketing`,icon:`📊`,sections:Y,getter:e=>e.pdm?.sections||{}},pdc:{label:`Piano di Comunicazione`,icon:`📣`,sections:X,getter:e=>e.pdc?.sections||{}},ed:{label:`Editoriale`,icon:`✏️`,sections:Z.filter(e=>!Q.includes(e.id)),getter:e=>e.ed?.sections||{}}};function ar({project:e,module:t}){let[n,r]=(0,U.useState)(!1),[i,a]=(0,U.useState)(`idle`);if(!ir[t])return null;let o=ir[t],s=o.getter(e),c=o.sections.filter(e=>s[e.id]?.content).length;async function l(){a(`generating`),Ne(`${t}_documento.html`,Re(ir,t,e),`text/html;charset=utf-8`),a(`idle`),r(!1)}async function u(){a(`generating`),Ne(`${t}.md`,ze(ir,t,e)),a(`idle`),r(!1)}async function d(){a(`generating`);try{let n=await Be(ir,t,e);Ne(`${t}_presentazione.html`,buildSlideshowHTML(n,o.label,e.name),`text/html;charset=utf-8`)}catch{}a(`idle`),r(!1)}return(0,G.jsxs)(`div`,{className:`exp-wrap`,children:[(0,G.jsxs)(`button`,{className:`btn-outline sm`,onClick:()=>r(e=>!e),children:[o.icon,` Esporta modulo `,c>0?`(${c}/${o.sections.length})`:``]}),n&&(0,G.jsxs)(`div`,{className:`exp-panel`,style:{right:0,width:320},children:[(0,G.jsx)(`div`,{className:`exp-title`,children:o.label}),c===0&&(0,G.jsx)(`div`,{className:`exp-hint`,style:{marginBottom:10},children:`⚠️ Nessuna sezione generata. Esporta il documento per vedere lo stato dell'avanzamento.`}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:l,disabled:i!==`idle`,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`📄`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:`Documento completo HTML`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`Tutte le sezioni · cover page · indice · stampa come PDF o apri in Word`})]})]}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:u,disabled:i!==`idle`,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`📝`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:`Markdown completo`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`Tutte le sezioni in formato .md · Notion · Obsidian`})]})]}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:d,disabled:i!==`idle`||c===0,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`🎯`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:i===`generating`?`Generazione slide…`:`Presentazione executive`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`AI struttura 10-14 slide dal modulo completo · slideshow HTML navigabile`})]})]}),(0,G.jsx)(`div`,{className:`exp-divider`}),(0,G.jsx)(`div`,{className:`exp-hint`,children:`Per DOCX e PPTX ufficiali con template Nassa → chiedi a Claude di generarli`})]})]})}function or({label:e,content:t,projectName:n,secId:r,onClose:i}){let[a,o]=(0,U.useState)(!1),[s,c]=(0,U.useState)(``);function l(e){c(e),setTimeout(()=>c(``),2200)}function u(){let i=`# ${e}\n\n_${new Date().toLocaleDateString(`it-IT`)} — ${n}_\n\n---\n\n`;Ne(`${r}.md`,i+t),l(`Markdown scaricato ✓`)}function d(){Ne(`${r}.html`,Fe(e,t,n),`text/html;charset=utf-8`),l(`Documento HTML scaricato ✓ — aprilo in Chrome o Word`)}async function f(){o(!0);try{let i=await Ve(e,t,n);Ne(`${r}_presentazione.html`,i,`text/html;charset=utf-8`),l(`Presentazione scaricata ✓ — aprila nel browser`)}catch{l(`Errore generazione — riprova`)}o(!1)}return(0,G.jsxs)(`div`,{className:`exp-panel`,onClick:e=>e.stopPropagation(),children:[s&&(0,G.jsx)(`div`,{className:`exp-toast`,children:s}),(0,G.jsxs)(`div`,{className:`exp-title`,children:[`Esporta: `,e]}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:u,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`📝`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:`Scarica Markdown`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`.md · compatibile con Notion, Obsidian`})]})]}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:d,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`📄`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:`Documento HTML`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`Apribile in Word · stampa come PDF`})]})]}),(0,G.jsxs)(`button`,{className:`exp-btn`,onClick:f,disabled:a,children:[(0,G.jsx)(`span`,{className:`exp-icon`,children:`🎯`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`exp-btn-label`,children:a?`Generazione in corso…`:`Presentazione interattiva`}),(0,G.jsx)(`div`,{className:`exp-btn-sub`,children:`AI genera slide · slideshow navigabile nel browser`})]})]}),(0,G.jsx)(`div`,{className:`exp-divider`}),(0,G.jsx)(`div`,{className:`exp-hint`,children:`Per DOCX e PPTX ufficiali → chiedi a Claude di generarli con i template Nassa`})]})}function sr({msg:e}){return(0,G.jsx)(`div`,{className:`toast`,children:e})}var cr=[{title:`Anagrafica`,fields:[{k:`nome`,label:`Nome azienda *`,ph:`es. Kosmetikal Srl`},{k:`settore`,label:`Settore / categoria *`,ph:`es. Contract manufacturing cosmetico`},{k:`anno`,label:`Anno fondazione`,ph:`es. 2003`},{k:`sede`,label:`Sede`,ph:`es. Pesaro, Marche`},{k:`sito`,label:`Sito web`,ph:`es. kosmetikal.it`}]},{title:`Identità`,fields:[{k:`descrizione`,label:`In 2-3 frasi: cosa fa questa azienda? *`,ph:`Cosa produce, per chi, come lo fa`,multi:!0},{k:`differenziale`,label:`Cosa la rende unica rispetto ai competitor? *`,ph:`Il differenziale principale — non un aggettivo, un fatto`,multi:!0},{k:`valori`,label:`Valori guida (3-5 parole o frasi)`,ph:`es. Verità prima della bellezza · Dati prima delle opinioni`}]},{title:`Target`,fields:[{k:`target`,label:`Chi è il cliente ideale? *`,ph:`Ruolo, settore, dimensione azienda, bisogno specifico`,multi:!0},{k:`b2x`,label:`Modello commerciale`,ph:`B2B / B2C / Entrambi — specificare`},{k:`mercati`,label:`Mercati geografici`,ph:`es. Italia · UK · Germania · Francia`}]},{title:`Prodotti & Servizi`,fields:[{k:`prodotti`,label:`Principali prodotti o servizi *`,ph:`Elenca con una riga di descrizione per ciascuno`,multi:!0},{k:`pricing`,label:`Range di prezzo o modello pricing`,ph:`es. Retainer 1.200-2.800€/mese · One-shot da 3.000€`}]},{title:`Competitor`,fields:[{k:`competitor`,label:`2-3 competitor principali`,ph:`es. Cosmoderma · Delta BKB · Reynaldi`},{k:`diff_competitor`,label:`Come vi differenziate da loro?`,ph:`Cosa fate voi che loro non fanno (o non comunicano)`,multi:!0}]},{title:`Canali Attuali`,fields:[{k:`canali_attuali`,label:`Canali digitali attivi`,ph:`es. LinkedIn pagina · Instagram · Email newsletter · Blog`},{k:`advertising`,label:`Advertising attuale`,ph:`es. Meta Ads (budget €/mese) · Google Search · nessuno`}]},{title:`Obiettivi (12 mesi)`,fields:[{k:`obiettivo1`,label:`Obiettivo primario *`,ph:`es. 50 lead qualificati/mese entro dicembre 2026`,multi:!0},{k:`obiettivo2`,label:`Obiettivo secondario`,ph:`es. 30% lead da mercati esteri`},{k:`budget`,label:`Budget marketing mensile stimato`,ph:`es. €3.000/mese (produzione + Ads)`}]},{title:`Sfide`,fields:[{k:`problema`,label:`Problema principale nella comunicazione attuale *`,ph:`Cosa non funziona, cosa manca, cosa frustra`,multi:!0},{k:`cosa_non_funziona`,label:`Cosa avete già provato senza risultati?`,ph:`Campagne, contenuti, strategie che non hanno funzionato`}]},{title:`Team & Risorse`,fields:[{k:`team`,label:`Chi gestisce il marketing oggi?`,ph:`es. Founder + freelance SMM · agenzia esterna · team interno`},{k:`risorse`,label:`Strumenti già in uso`,ph:`es. Canva · Metricool · HubSpot · nessuno`},{k:`note`,label:`Note aggiuntive`,ph:`Qualsiasi cosa non sia stata coperta sopra`,multi:!0}]}],lr=[{title:`Origini`,fields:[{k:`origini`,label:`Chi ha fondato l'azienda e perché?`,ph:`Il contesto, la motivazione, il momento storico`,multi:!0}]},{title:`Svolte chiave`,fields:[{k:`svolte`,label:`I 2-3 momenti che hanno cambiato l'azienda`,ph:`Crisi, pivot, acquisizioni, prodotti che hanno svoltato`,multi:!0}]},{title:`Valori maturati`,fields:[{k:`valori_maturati`,label:`Cosa ha imparato l'azienda in questi anni?`,ph:`Valori che vengono dall'esperienza, non dalla brochure`,multi:!0}]}],ur=[{k:`nome`,label:`Nome azienda *`,ph:`es. Kosmetikal Srl`},{k:`settore`,label:`Settore *`,ph:`es. Contract manufacturing cosmetico`},{k:`anno`,label:`Anno fondazione`,ph:`es. 2003`},{k:`sede`,label:`Sede`,ph:`es. Pesaro, Marche`},{k:`sito`,label:`Sito web`,ph:`es. kosmetikal.it`},{k:`descrizione`,label:`Cosa fa l'azienda`,ph:``,multi:!0},{k:`differenziale`,label:`Differenziale principale`,ph:``,multi:!0},{k:`valori`,label:`Valori guida`,ph:``},{k:`target`,label:`Target primario`,ph:``,multi:!0},{k:`b2x`,label:`Modello (B2B/B2C)`,ph:``},{k:`mercati`,label:`Mercati geografici`,ph:``},{k:`prodotti`,label:`Prodotti / Servizi`,ph:``,multi:!0},{k:`pricing`,label:`Pricing`,ph:``},{k:`competitor`,label:`Competitor`,ph:``},{k:`diff_competitor`,label:`Differenziale vs competitor`,ph:``,multi:!0},{k:`canali_attuali`,label:`Canali digitali attuali`,ph:``},{k:`advertising`,label:`Advertising attuale`,ph:``},{k:`obiettivo1`,label:`Obiettivo primario`,ph:``,multi:!0},{k:`obiettivo2`,label:`Obiettivo secondario`,ph:``},{k:`budget`,label:`Budget marketing`,ph:``},{k:`problema`,label:`Problema principale`,ph:``,multi:!0},{k:`cosa_non_funziona`,label:`Cosa non ha funzionato`,ph:``},{k:`team`,label:`Team marketing`,ph:``},{k:`risorse`,label:`Strumenti in uso`,ph:``},{k:`note`,label:`Note aggiuntive`,ph:``,multi:!0}],dr=e=>`Sei un assistente di marketing. Analizza il testo e compila SOLO un oggetto JSON — nessun testo prima o dopo, nessun markdown.
Usa valori BREVI (max 80 caratteri per campo). Stringa vuota "" per i campi non trovati.

Struttura JSON richiesta:
{"nome":"","settore":"","anno":"","sede":"","sito":"","descrizione":"","differenziale":"","valori":"","target":"","b2x":"","mercati":"","prodotti":"","pricing":"","competitor":"","diff_competitor":"","canali_attuali":"","advertising":"","obiettivo1":"","obiettivo2":"","budget":"","problema":"","cosa_non_funziona":"","team":"","risorse":"","note":""}

TESTO DA ANALIZZARE:
${e.slice(0,5e3)}`;function fr({data:e,onComplete:t,onBack:n}){let[r,i]=(0,U.useState)({...e});function a(e,t){i(n=>({...n,[e]:t}))}return(0,G.jsx)(`div`,{className:`wiz-wrap`,children:(0,G.jsxs)(`div`,{className:`wiz-inner wiz-wide`,children:[(0,G.jsx)(`div`,{className:`wiz-brand`,children:`NASSA MARKETING STUDIO`}),(0,G.jsx)(`div`,{className:`wiz-title`,children:`✅ Verifica le informazioni estratte`}),(0,G.jsx)(`div`,{className:`review-notice`,children:`L'AI ha estratto i dati dal documento. Controlla ogni campo e correggi prima di creare il progetto.`}),(0,G.jsx)(`div`,{className:`review-grid`,children:ur.map(e=>(0,G.jsxs)(`div`,{className:`fg${e.multi?` review-full`:``}`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:e.label}),e.multi?(0,G.jsx)(`textarea`,{className:`txta`,rows:2,placeholder:e.ph,value:r[e.k]||``,onChange:t=>a(e.k,t.target.value)}):(0,G.jsx)(`input`,{className:`inp`,placeholder:e.ph,value:r[e.k]||``,onChange:t=>a(e.k,t.target.value)})]},e.k))}),(0,G.jsxs)(`div`,{className:`wiz-actions`,style:{marginTop:20},children:[(0,G.jsx)(`button`,{className:`btn-ghost`,onClick:n,children:`← Torna all'estrazione`}),(0,G.jsx)(`button`,{className:`btn-primary`,onClick:()=>t(r),disabled:!r.nome?.trim(),children:`Crea Progetto →`})]})]})})}function pr({onComplete:e,onBack:t,initialText:n}){let[i,a]=(0,U.useState)(n||``),[o,s]=(0,U.useState)(!1),[c,l]=(0,U.useState)(``),[u,d]=(0,U.useState)(null);async function f(){if(i.trim()){s(!0),l(``);try{let e=(await r(dr(i),2500)).replace(/```json\s*/gi,``).replace(/```\s*/g,``).trim().match(/\{[\s\S]*\}/);if(!e)throw Error(`L'AI non ha restituito JSON. Riprova — a volte serve un testo più strutturato.`);let t;try{t=JSON.parse(e[0])}catch{try{t=JSON.parse(e[0]+`}`)}catch{throw Error(`Risposta troncata — riprova. Se il problema persiste, accorcia il testo incollato.`)}}d(t)}catch(e){l(`Errore: `+e.message)}s(!1)}}return u?(0,G.jsx)(fr,{data:u,onComplete:e,onBack:()=>d(null)}):(0,G.jsx)(`div`,{className:`wiz-wrap`,children:(0,G.jsxs)(`div`,{className:`wiz-inner wiz-wide`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{marginBottom:12},onClick:t,children:`← Scegli metodo`}),(0,G.jsx)(`div`,{className:`wiz-brand`,children:`NASSA MARKETING STUDIO`}),(0,G.jsx)(`div`,{className:`wiz-title`,children:`✦ Incolla il brief`}),(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink4)`,marginBottom:12,lineHeight:1.6},children:`Incolla qualsiasi documento: brief cliente, appunti dell'intervista, email, note, documento Word... L'AI estrae automaticamente tutte le informazioni del progetto.`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:16,placeholder:`Incolla qui il brief, le note, il documento del cliente...

Esempio:
Nome: Kosmetikal Srl
Settore: contract manufacturing cosmetico
Obiettivo: aumentare i lead qualificati da 3 a 10/mese entro dic 2026
Competitor: Cosmoderma, Delta BKB
Budget: €3.000/mese
...`,value:i,onChange:e=>a(e.target.value)}),i.trim()&&(0,G.jsxs)(`div`,{style:{fontSize:10,color:`var(--ink5)`,marginTop:4},children:[i.length,` caratteri`]}),c&&(0,G.jsx)(`div`,{className:`extract-error`,children:c}),(0,G.jsx)(`div`,{className:`wiz-actions`,children:o?(0,G.jsxs)(`div`,{className:`gen-row`,children:[(0,G.jsx)(`div`,{className:`spin`}),`Elaborazione AI in corso…`]}):(0,G.jsx)(`button`,{className:`btn-primary`,onClick:f,disabled:!i.trim(),children:`✦ Elabora con AI →`})})]})})}function mr({onComplete:e,onBack:t}){let[n,r]=(0,U.useState)(``),[i,a]=(0,U.useState)(!1),[o,s]=(0,U.useState)(``),[c,l]=(0,U.useState)(``),[u,d]=(0,U.useState)(!1),[f,p]=(0,U.useState)(null);async function m(){if(!n.trim())return;a(!0),s(``),d(!1);let e=n.trim();if(e.includes(`dropbox.com`)&&(e=e.replace(`www.dropbox.com`,`dl.dropboxusercontent.com`).replace(/[?&]dl=0/,``),e+=(e.includes(`?`)?`&`:`?`)+`raw=1`),e.includes(`docs.google.com/document`)){let t=e.match(/\/d\/([a-zA-Z0-9_-]+)/);t&&(e=`https://docs.google.com/document/d/${t[1]}/export?format=txt`)}if(e.includes(`drive.google.com/file`)){let t=e.match(/\/d\/([a-zA-Z0-9_-]+)/);t&&(e=`https://drive.google.com/uc?export=download&id=${t[1]}`)}try{let t=await fetch(e);if(!t.ok)throw Error(`HTTP `+t.status);let n=await t.text();if(n.length<30)throw Error(`Documento vuoto`);p(n)}catch{s(`Impossibile leggere il file direttamente (CORS o file non pubblico). Apri il documento, copia il contenuto e incollalo nel campo qui sotto.`),d(!0)}a(!1)}return f?(0,G.jsx)(pr,{onComplete:e,onBack:()=>p(null),initialText:f}):(0,G.jsx)(`div`,{className:`wiz-wrap`,children:(0,G.jsxs)(`div`,{className:`wiz-inner wiz-wide`,children:[(0,G.jsx)(`button`,{className:`btn-ghost sm`,style:{marginBottom:12},onClick:t,children:`← Scegli metodo`}),(0,G.jsx)(`div`,{className:`wiz-brand`,children:`NASSA MARKETING STUDIO`}),(0,G.jsx)(`div`,{className:`wiz-title`,children:`🔗 Da Dropbox o Google Drive`}),(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink4)`,marginBottom:16,lineHeight:1.6},children:`Incolla il link a un documento condiviso. L'AI lo legge ed estrae il contesto del progetto.`}),(0,G.jsxs)(`div`,{className:`fg`,style:{marginBottom:12},children:[(0,G.jsx)(`label`,{className:`lbl`,children:`URL documento`}),(0,G.jsx)(`input`,{className:`inp`,placeholder:`https://www.dropbox.com/s/... oppure https://docs.google.com/document/d/...`,value:n,onChange:e=>r(e.target.value)})]}),(0,G.jsxs)(`div`,{className:`extract-hints`,children:[(0,G.jsxs)(`div`,{children:[`📦 `,(0,G.jsx)(`strong`,{children:`Dropbox:`}),` File → Condividi → Copia link (accesso "Chiunque con il link")`]}),(0,G.jsxs)(`div`,{children:[`📄 `,(0,G.jsx)(`strong`,{children:`Google Doc:`}),` File → Condividi → "Chiunque con il link può visualizzare"`]}),(0,G.jsxs)(`div`,{children:[`📋 `,(0,G.jsx)(`strong`,{children:`Dropbox Paper / Notion:`}),` esporta in .docx o copia il testo e usa "Incolla brief"`]})]}),o&&(0,G.jsxs)(`div`,{className:`extract-error`,style:{marginTop:12},children:[(0,G.jsx)(`div`,{children:o}),u&&(0,G.jsxs)(`div`,{style:{marginTop:12},children:[(0,G.jsx)(`label`,{className:`lbl`,style:{marginBottom:6,display:`block`},children:`Incolla qui il contenuto del documento:`}),(0,G.jsx)(`textarea`,{className:`txta`,rows:10,placeholder:`Copia e incolla il testo del documento...`,value:c,onChange:e=>l(e.target.value)})]})]}),(0,G.jsx)(`div`,{className:`wiz-actions`,children:i?(0,G.jsxs)(`div`,{className:`gen-row`,children:[(0,G.jsx)(`div`,{className:`spin`}),`Lettura documento…`]}):u?(0,G.jsx)(`button`,{className:`btn-primary`,onClick:()=>p(c),disabled:!c.trim(),children:`✦ Elabora testo incollato →`}):(0,G.jsx)(`button`,{className:`btn-primary`,onClick:m,disabled:!n.trim(),children:`🔗 Carica ed Elabora →`})})]})})}function hr({onComplete:e}){let[t,n]=(0,U.useState)(null);return t===`brief`?(0,G.jsx)(pr,{onComplete:e,onBack:()=>n(null)}):t===`drive`?(0,G.jsx)(mr,{onComplete:e,onBack:()=>n(null)}):t===`manuale`?(0,G.jsx)(gr,{onComplete:e,onBack:()=>n(null)}):(0,G.jsx)(`div`,{className:`wiz-wrap`,children:(0,G.jsxs)(`div`,{className:`wiz-inner`,children:[(0,G.jsx)(`div`,{className:`wiz-brand`,children:`NASSA MARKETING STUDIO`}),(0,G.jsx)(`div`,{className:`wiz-title`,children:`Nuovo progetto`}),(0,G.jsx)(`div`,{style:{fontSize:12,color:`var(--ink4)`,marginBottom:28,textAlign:`center`},children:`Come vuoi inserire le informazioni del progetto?`}),(0,G.jsxs)(`div`,{className:`wiz-modes`,children:[(0,G.jsxs)(`div`,{className:`wiz-mode-card`,onClick:()=>n(`manuale`),children:[(0,G.jsx)(`div`,{className:`wiz-mode-icon`,children:`📝`}),(0,G.jsx)(`div`,{className:`wiz-mode-title`,children:`Compila manualmente`}),(0,G.jsx)(`div`,{className:`wiz-mode-desc`,children:`9 step guidati, campo per campo. Il modo più preciso per strutturare le informazioni fin dall'inizio.`})]}),(0,G.jsxs)(`div`,{className:`wiz-mode-card`,onClick:()=>n(`brief`),children:[(0,G.jsx)(`div`,{className:`wiz-mode-icon`,children:`✦`}),(0,G.jsx)(`div`,{className:`wiz-mode-title`,children:`Incolla un brief`}),(0,G.jsx)(`div`,{className:`wiz-mode-desc`,children:`Incolla testo libero — email, appunti, documento, trascrizione intervista. L'AI estrae tutte le informazioni.`})]}),(0,G.jsxs)(`div`,{className:`wiz-mode-card`,onClick:()=>n(`drive`),children:[(0,G.jsx)(`div`,{className:`wiz-mode-icon`,children:`🔗`}),(0,G.jsx)(`div`,{className:`wiz-mode-title`,children:`Dropbox o Google Drive`}),(0,G.jsx)(`div`,{className:`wiz-mode-desc`,children:`Incolla il link a un documento condiviso su Dropbox o Google Drive. L'AI lo legge e crea il progetto.`})]})]})]})})}function gr({onComplete:e,onBack:t}){let[n,r]=(0,U.useState)(0),[i,a]=(0,U.useState)(!1),[o,s]=(0,U.useState)({}),c=[...cr,...i?lr:[]],l=c[n],u=n===c.length-1,d=Math.round((n+1)/c.length*100);function f(e,t){s(n=>({...n,[e]:t}))}function p(){u?e(o):r(e=>e+1)}function m(){return l.fields.filter(e=>e.label.includes(`*`)).every(e=>o[e.k]?.trim())}return(0,G.jsx)(`div`,{className:`wiz-wrap`,children:(0,G.jsxs)(`div`,{className:`wiz-inner`,children:[(0,G.jsx)(`div`,{className:`wiz-brand`,children:`NASSA MARKETING STUDIO`}),(0,G.jsx)(`div`,{className:`wiz-title`,children:`Nuovo progetto`}),(0,G.jsxs)(`div`,{className:`wiz-progress-wrap`,children:[(0,G.jsx)(`div`,{className:`wiz-progress-bar`,children:(0,G.jsx)(`div`,{className:`wiz-progress-fill`,style:{width:d+`%`}})}),(0,G.jsxs)(`div`,{className:`wiz-progress-txt`,children:[n+1,` / `,c.length]})]}),(0,G.jsxs)(`div`,{className:`wiz-step`,children:[(0,G.jsxs)(`div`,{className:`wiz-step-num`,children:[`Step `,n+1]}),(0,G.jsx)(`div`,{className:`wiz-step-title`,children:l.title}),n===0&&(0,G.jsx)(`div`,{className:`wiz-storica-toggle`,children:(0,G.jsxs)(`label`,{className:`wiz-check-label`,children:[(0,G.jsx)(`input`,{type:`checkbox`,checked:i,onChange:e=>a(e.target.checked)}),(0,G.jsx)(`span`,{children:`Azienda con più di 15 anni di storia — aggiungi sezione storica (Origini, Svolte, Valori)`})]})}),(0,G.jsx)(`div`,{className:`wiz-fields`,children:l.fields.map(e=>(0,G.jsxs)(`div`,{className:`fg`,children:[(0,G.jsx)(`label`,{className:`lbl`,children:e.label}),e.multi?(0,G.jsx)(`textarea`,{className:`txta`,rows:3,placeholder:e.ph,value:o[e.k]||``,onChange:t=>f(e.k,t.target.value)}):(0,G.jsx)(`input`,{className:`inp`,placeholder:e.ph,value:o[e.k]||``,onChange:t=>f(e.k,t.target.value)})]},e.k))}),(0,G.jsxs)(`div`,{className:`wiz-actions`,children:[(0,G.jsxs)(`button`,{className:`btn-ghost`,onClick:n===0?t:()=>r(e=>e-1),children:[`← `,n===0?`Scegli metodo`:`Indietro`]}),(0,G.jsx)(`button`,{className:`btn-primary`,onClick:p,disabled:!m(),children:u?`Crea Progetto →`:`Avanti →`})]})]})]})})}function _r({project:e,onUpdate:t,onBack:n,globalMeta:i,onPortal:a,client:o,pushUrl:s}){let c=(()=>{let e=window.location.pathname.split(`/`).filter(Boolean);return e[0]===`project`&&e[2]?e[2]:`overview`})(),[l,u]=(0,U.useState)(c===`pdm`||c===`pdc`||c===`ed`?c:`overview`),d=l===`pdm`?Y:l===`pdc`?X:Z,f=l===`pdm`?on:l===`pdc`?sn:un,p=l===`pdm`?cn:l===`pdc`?ln:dn,[m,h]=(0,U.useState)(f[0]),[g,_]=(0,U.useState)(d[0].id),[v,y]=(0,U.useState)(!1),[b,x]=(0,U.useState)(``);function S(e){x(e),setTimeout(()=>x(``),2200)}(0,U.useEffect)(()=>{let e=d.find(e=>e.group===m);e&&_(e.id)},[l,m]),(0,U.useEffect)(()=>{f.includes(m)||h(f[0])},[l]);let C=d.filter(e=>e.group===m);async function w(e){if(e===`ed`)return _n;let{P_PDM:t,P_PDC:n}=await nn(async()=>{let{P_PDM:e,P_PDC:t}=await import(`./prompts-CuSkknWk.js`);return{P_PDM:e,P_PDC:t}},[]);return e===`pdm`?t:n}async function E(){y(!0);let n=gn(e.interview||{}),i=Object.entries(e.pdm?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`),a=Object.entries(e.pdc?.sections||{}).map(([e,t])=>`[${e}]\n${t.content?.slice(0,200)||``}`).join(`
`),o=l===`ed`?n+`

## Marketing:
`+i+`

## Comunicazione:
`+a:n,s=await w(l),c=d.map(e=>e.id).filter(e=>!!s[e]);for(let n of c)if(!(l===`pdm`?e.pdm?.sections?.[n]?.content:l===`pdc`?e.pdc?.sections?.[n]?.content:e.ed?.sections?.[n]?.content))try{let i=(e.ed?.perfLogs||[]).slice(-1)[0],a=await r(s[n](o,i?.note));if(l===`pdm`){let t=e.pdm||{sections:{}};e={...e,pdm:{...t,sections:{...t.sections,[n]:{content:a,versions:[]}}}}}else if(l===`pdc`){let t=e.pdc||{sections:{}};e={...e,pdc:{...t,sections:{...t.sections,[n]:{content:a,versions:[]}}}}}else{let t=e.ed||{sections:{}};e={...e,ed:{...t,sections:{...t.sections,[n]:{content:a,versions:[]}}}}}t(e)}catch{}y(!1),S(`Generazione completa ✓`)}let D=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,O=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,k=Z.filter(t=>!Q.includes(t.id)&&e.ed?.sections?.[t.id]?.content).length;return(0,G.jsxs)(`div`,{className:`proj-view`,children:[b&&(0,G.jsx)(sr,{msg:b}),(0,G.jsxs)(`div`,{className:`pv-topbar`,children:[(0,G.jsx)(`button`,{className:`pv-back`,onClick:n,children:`← Progetti`}),(0,G.jsx)(`div`,{className:`pv-name`,children:e.name}),(0,G.jsxs)(`div`,{className:`pv-actions`,children:[a&&e.clientId&&(0,G.jsx)(`button`,{className:`pv-portal-btn`,onClick:a,title:`Apri portale cliente`,children:`👁 Portale cliente`}),(0,G.jsx)(bt,{project:e,client:o}),l!==`overview`&&(0,G.jsx)(ar,{project:e,module:l}),l!==`overview`&&(v?(0,G.jsxs)(`div`,{className:`gen-row`,children:[(0,G.jsx)(`div`,{className:`spin`}),`Generazione in corso…`]}):l===`ed`?(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:E,title:`Genera tutte le sezioni Editoriale (Strategia + Analisi)`,children:`⚡ Genera Editoriale`}):(0,G.jsx)(`button`,{className:`btn-outline sm`,onClick:E,children:`Genera tutto`}))]})]}),(0,G.jsxs)(`div`,{className:`module-sw`,children:[(0,G.jsxs)(`button`,{className:`module-btn ${l===`overview`?`active`:``}`,onClick:()=>{u(`overview`),s(`project`,e.id,{module:`overview`})},children:[(0,G.jsx)(`span`,{className:`mb-icon`,children:`🏠`}),`Overview`]}),(0,G.jsxs)(`button`,{className:`module-btn ${l===`pdm`?`active`:``}`,onClick:()=>{u(`pdm`),s(`project`,e.id,{module:`pdm`})},children:[(0,G.jsx)(`span`,{className:`mb-icon`,children:`📊`}),`Piano di Marketing`,(0,G.jsxs)(`span`,{className:`mb-badge`,style:l===`pdm`?{background:`#EFF8FF`,color:`#0EA5E9`}:{},children:[D,`/`,Y.length]})]}),(0,G.jsxs)(`button`,{className:`module-btn ${l===`pdc`?`active`:``}`,onClick:()=>{u(`pdc`),s(`project`,e.id,{module:`pdc`})},children:[(0,G.jsx)(`span`,{className:`mb-icon`,children:`📣`}),`Piano di Comunicazione`,(0,G.jsxs)(`span`,{className:`mb-badge`,style:l===`pdc`?{background:`#F5F3FF`,color:`#8B5CF6`}:{},children:[O,`/`,X.length]})]}),(0,G.jsxs)(`button`,{className:`module-btn ${l===`ed`?`active`:``}`,onClick:()=>{u(`ed`),s(`project`,e.id,{module:`ed`})},children:[(0,G.jsx)(`span`,{className:`mb-icon`,children:`✏️`}),`Editoriale`,(0,G.jsxs)(`span`,{className:`mb-badge`,style:l===`ed`?{background:`#ECFDF5`,color:`#10B981`}:{},children:[k,`/`,Z.filter(e=>!Q.includes(e.id)).length]})]})]}),l===`overview`&&(0,G.jsx)(`div`,{style:{flex:1,overflow:`auto`},children:(0,G.jsx)(Wn,{project:e,onUpdate:t,onGoToModule:u})}),l===`ed`&&(0,G.jsx)(K,{name:`Editoriale`,resetKey:e.id+`-ed`,children:(0,G.jsx)(wn,{project:e,onUpdate:t,globalMeta:i,client:o,pushUrl:s})}),l!==`overview`&&l!==`ed`&&(0,G.jsx)(`div`,{className:`group-tabs`,children:f.map(t=>{let n=l===`ed`?d.filter(n=>n.group===t&&!Q.includes(n.id)&&e.ed?.sections?.[n.id]?.content).length:d.filter(n=>n.group===t&&(l===`pdm`?e.pdm:e.pdc)?.sections?.[n.id]?.content).length,r=l===`ed`?d.filter(e=>e.group===t&&!Q.includes(e.id)).length:d.filter(e=>e.group===t).length,i=m===t,a=p[t]||`#0EA5E9`;return(0,G.jsxs)(`div`,{className:`gtab ${i?`active`:``}`,style:i?{color:a,borderBottomColor:a}:{},onClick:()=>h(t),children:[t,(0,G.jsxs)(`span`,{className:`gtab-cnt`,style:i?{background:a+`18`,color:a}:{},children:[n,`/`,r]})]},t)})}),l!==`overview`&&l!==`ed`&&(0,G.jsx)(`div`,{className:`sec-tabs`,children:C.map(t=>{let n=l===`ed`?!!(Q.includes(t.id)||e.ed?.sections?.[t.id]?.content):!!(l===`pdm`?e.pdm:e.pdc)?.sections?.[t.id]?.content,r=g===t.id,i=p[t.group]||`#0EA5E9`;return(0,G.jsxs)(`button`,{className:`sec-tab ${r?`active`:``} ${n?`has`:``}`,style:r?{color:i,borderBottomColor:i}:{},onClick:()=>_(t.id),children:[n&&(0,G.jsx)(`span`,{className:`tab-dot`,style:{background:i}}),(0,G.jsx)(an,{name:t.icon,size:13,color:r?i:`currentColor`}),` `,t.label]},t.id)})}),l!==`overview`&&l!==`ed`&&(l===`ed`?(0,G.jsx)(Tn,{project:e,secId:g,onUpdate:t,globalMeta:i,client:o},`ed-`+g):(0,G.jsx)(qt,{project:e,module:l,secId:g,onUpdate:t,sections:d,colors:p,ExportPanelComponent:or,ToastComponent:sr,renderMarkdown:T,SvgIconComponent:an},l+`-`+g))]})}function vr({projects:e,onSelect:t,onNew:n}){return(0,G.jsxs)(`div`,{className:`dashboard`,children:[(0,G.jsxs)(`div`,{className:`dash-hero`,children:[(0,G.jsx)(`div`,{className:`dash-label`,children:`Nassa Marketing Studio`}),(0,G.jsx)(`div`,{className:`dash-h1`,children:`Piano Marketing & Comunicazione`}),(0,G.jsx)(`div`,{className:`dash-p`,children:`Strategia annuale in due moduli: Piano di Marketing + Piano di Comunicazione.`})]}),e.length===0?(0,G.jsxs)(`div`,{className:`dash-empty`,children:[(0,G.jsx)(`div`,{className:`dash-glyph`,children:`◈`}),(0,G.jsx)(`div`,{className:`dash-msg`,children:`Nessun progetto. Crea il primo progetto con l'intervista guidata.`}),(0,G.jsx)(`button`,{className:`btn-primary`,onClick:n,children:`+ Nuovo Progetto`})]}):(0,G.jsx)(G.Fragment,{children:(0,G.jsx)(`div`,{className:`dash-grid`,children:e.map(e=>{let n=Y.filter(t=>e.pdm?.sections?.[t.id]?.content).length,r=X.filter(t=>e.pdc?.sections?.[t.id]?.content).length,i=Y.length+X.length,a=n+r,o=Math.round(a/i*100);return(0,G.jsxs)(`div`,{className:`dash-card`,onClick:()=>t(e.id),children:[(0,G.jsxs)(`div`,{className:`dc-top`,children:[(0,G.jsx)(`div`,{className:`dc-glyph`,children:`◈`}),(0,G.jsxs)(`div`,{className:`dc-pct`,children:[o,`%`]})]}),(0,G.jsx)(`div`,{className:`dc-name`,children:e.name}),(0,G.jsxs)(`div`,{className:`dc-date`,children:[e.interview?.settore||`—`,` · `,new Date(e.createdAt).toLocaleDateString(`it-IT`)]}),(0,G.jsx)(`div`,{className:`dc-bar`,children:(0,G.jsx)(`div`,{className:`dc-fill`,style:{width:o+`%`}})}),(0,G.jsxs)(`div`,{className:`dc-modules`,children:[(0,G.jsxs)(`span`,{className:`dc-mod pdm`,children:[n,`/`,Y.length,` PdM`]}),(0,G.jsxs)(`span`,{className:`dc-mod pdc`,children:[r,`/`,X.length,` PdC`]})]})]},e.id)})})})]})}function yr({projects:e,clients:t,onNavigate:n,onClose:r}){let[i,a]=(0,U.useState)(``),[s,c]=(0,U.useState)(0),l=(0,U.useRef)(null);(0,U.useEffect)(()=>{l.current?.focus()},[]);let u=i.trim().toLowerCase(),d=[{id:`a-new-client`,type:`action`,icon:`users`,label:`Nuovo cliente`,hint:`Crea`,action:()=>{r(),n(`newClient`)}},{id:`a-dashboard`,type:`action`,icon:`grid`,label:`Dashboard`,hint:`Vai`,action:()=>{r(),n(`dashboard`)}},{id:`a-team`,type:`action`,icon:`calendar`,label:`Team Planner`,hint:`Vai`,action:()=>{r(),n(`teamplanner`)}}],f=t.filter(e=>!u||e.nome?.toLowerCase().includes(u)).slice(0,4).map(t=>({id:`c-`+t.id,type:`client`,icon:`user`,label:t.nome,hint:`Apri cliente`,sub:e.filter(e=>e.clientId===t.id).length+` progetti`,action:()=>{r(),n(`client`,t.id)}})),p=e.filter(e=>!u||e.name?.toLowerCase().includes(u)||(e.interview?.nome||``).toLowerCase().includes(u)).slice(0,5).map(e=>{let i=t.find(t=>t.id===e.clientId);return{id:`p-`+e.id,type:`project`,icon:`layers`,label:e.name,hint:`Apri progetto`,sub:i?.nome||``,action:()=>{r(),n(`project`,e.id)}}}),m=u.length<2?[]:e.flatMap(e=>(e.ed?.feedItems||[]).filter(e=>(e.titolo||``).toLowerCase().includes(u)||(e.caption||``).toLowerCase().includes(u)||(e.pilastro||``).toLowerCase().includes(u)).slice(0,3).map(i=>{let a=t.find(t=>t.id===e.clientId),s=o(i.stato);return{id:`f-`+i.id,type:`post`,icon:`edit`,label:i.titolo||`Post senza titolo`,hint:`Apri post`,sub:`${a?.nome||e.name} · ${i.data||`—`} · ${s.label}`,statusColor:s.tx,action:()=>{r(),n(`post`,e.id,i.id)}}})).slice(0,6),h=u.length<2?[]:[...Y.map(e=>({...e,module:`pdm`})),...X.map(e=>({...e,module:`pdc`}))].filter(e=>e.label.toLowerCase().includes(u)||e.group.toLowerCase().includes(u)).slice(0,4).map(e=>({id:`s-`+e.module+`-`+e.id,type:`section`,icon:e.icon,label:e.label,hint:e.module===`pdm`?`Piano di Marketing`:`Piano di Comunicazione`,sub:e.group,action:()=>{r(),n(`section`,e.module,e.id)}})),g=u?[...f,...p,...m,...h,...d.filter(e=>e.label.toLowerCase().includes(u))]:[...d,...f.slice(0,3),...p.slice(0,3)];(0,U.useEffect)(()=>{c(0)},[i]);function _(e){e.key===`ArrowDown`?(e.preventDefault(),c(e=>Math.min(e+1,g.length-1))):e.key===`ArrowUp`?(e.preventDefault(),c(e=>Math.max(e-1,0))):e.key===`Enter`?(e.preventDefault(),g[s]?.action?.()):e.key===`Escape`&&r()}let v={action:`⚡ Azioni rapide`,client:`👥 Clienti`,project:`📁 Progetti`,post:`📝 Post`,section:`📚 Sezioni`},y=[],b=null;return g.forEach((e,t)=>{e.type!==b&&(y.push({_header:!0,label:v[e.type]||e.type}),b=e.type),y.push({...e,_idx:t})}),(0,G.jsx)(`div`,{className:`cmdb-overlay`,onClick:r,children:(0,G.jsxs)(`div`,{className:`cmdb-modal`,onClick:e=>e.stopPropagation(),children:[(0,G.jsxs)(`div`,{className:`cmdb-search-row`,children:[(0,G.jsx)(an,{name:`compass`,size:16,color:`var(--ink4)`}),(0,G.jsx)(`input`,{ref:l,className:`cmdb-input`,placeholder:`Cerca clienti, progetti, post, sezioni… o digita un'azione`,value:i,onChange:e=>a(e.target.value),onKeyDown:_}),i&&(0,G.jsx)(`button`,{className:`cmdb-clear`,onClick:()=>a(``),children:`✕`}),(0,G.jsx)(`kbd`,{className:`cmdb-esc`,children:`Esc`})]}),(0,G.jsxs)(`div`,{className:`cmdb-results`,children:[g.length===0&&i&&(0,G.jsxs)(`div`,{className:`cmdb-empty`,children:[`Nessun risultato per "`,(0,G.jsx)(`strong`,{children:i}),`"`]}),y.map((e,t)=>{if(e._header)return(0,G.jsx)(`div`,{className:`cmdb-group-label`,children:e.label},`h`+t);let n=e._idx===s;return(0,G.jsxs)(`div`,{className:`cmdb-item ${n?`cmdb-active`:``}`,onClick:e.action,onMouseEnter:()=>c(e._idx),children:[(0,G.jsx)(`div`,{className:`cmdb-item-icon`,children:(0,G.jsx)(an,{name:e.icon,size:14,color:n?`var(--gold)`:`var(--ink4)`})}),(0,G.jsxs)(`div`,{className:`cmdb-item-body`,children:[(0,G.jsx)(`div`,{className:`cmdb-item-label`,children:e.label}),e.sub&&(0,G.jsxs)(`div`,{className:`cmdb-item-sub`,children:[e.statusColor&&(0,G.jsx)(`span`,{style:{width:6,height:6,borderRadius:`50%`,background:e.statusColor,display:`inline-block`,marginRight:4}}),e.sub]})]}),(0,G.jsx)(`div`,{className:`cmdb-item-hint`,children:e.hint})]},e.id)})]}),(0,G.jsxs)(`div`,{className:`cmdb-footer`,children:[(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`kbd`,{children:`↑`}),(0,G.jsx)(`kbd`,{children:`↓`}),` naviga`]}),(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`kbd`,{children:`↵`}),` apri`]}),(0,G.jsxs)(`span`,{children:[(0,G.jsx)(`kbd`,{children:`Esc`}),` chiudi`]}),(0,G.jsxs)(`span`,{style:{marginLeft:`auto`,color:`var(--ink5)`},children:[g.length,` risultati`,u?` per "${u}"`:``]})]})]})})}function br({status:e,error:t,lastSavedAt:n}){let r=e===`error`,i=e===`saving`,a=e===`loading`,o=r?`Errore salvataggio`:i?`Salvataggio…`:a?`Caricamento…`:n?`Salvato ${new Date(n).toLocaleTimeString(`it-IT`,{hour:`2-digit`,minute:`2-digit`})}`:`Pronto`;return(0,G.jsxs)(`div`,{className:`storage-pill ${r?`storage-error`:i||a?`storage-pending`:`storage-ok`}`,title:r?t:o,children:[(0,G.jsx)(`span`,{className:`storage-dot`}),(0,G.jsx)(`span`,{className:`storage-label`,children:o}),r&&t&&(0,G.jsx)(`span`,{className:`storage-detail`,children:t})]})}Object.freeze({storage:`safeLoadWorkspace, safeSaveWorkspace, migrateWorkspaceData`,editorialNormalization:`normalizeFeedItem, normalizePostPlatforms, getEditorialPosts`,editorialValidation:`validatePostFormItem, isValidOptionalUrl, isValidISODate, isValidTime`,ai:`callClaude and prompt maps`,meta:`openMetaOAuth, igPublish, fbPublish`});function xr(){let[e,r]=(0,U.useState)([]),[a,o]=(0,U.useState)([]),[s,c]=(0,U.useState)(null),[l,u]=(0,U.useState)(null),[f,m]=(0,U.useState)([]),[h,g]=(0,U.useState)(`dashboard`),[v,y]=(0,U.useState)(!1),[b,x]=(0,U.useState)(null),[S,C]=(0,U.useState)(null),[w,T]=(0,U.useState)(!1),[E,D]=(0,U.useState)(`idle`),[O,k]=(0,U.useState)(``),[A,j]=(0,U.useState)(null);(0,U.useEffect)(()=>{function e(e){(e.metaKey||e.ctrlKey)&&e.key===`k`&&(e.preventDefault(),T(e=>!e))}return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[]);function ee(t,n,r){t===`dashboard`?g(`dashboard`):t===`newClient`?oe():t===`teamplanner`?g(`teamplanner`):t===`client`?ne(n):t===`project`?z(n):t===`post`?(z(n),sessionStorage.setItem(`nms-open-post`,r||``)):t===`section`&&(s?(g(`project`),sessionStorage.setItem(`nms-open-section`,JSON.stringify({module:n,sec:r}))):e.length>0&&(z(e[0].id),sessionStorage.setItem(`nms-open-section`,JSON.stringify({module:n,sec:r}))))}(0,U.useEffect)(()=>{(async()=>{D(`loading`);let i=await Oe();i.ok||(D(`error`),k(i.error));let a=n(i.data);if(x(await pn()),i.ok&&D(`idle`),a&&(a.projects?.length>0||a.clients?.length>0)){let e=a.projects||[],t=a.clients||[];if(!t.find(e=>e.id===`demo-client-radenza`)){let{client:n,project:r}=zt();t=[...t,n],e=[...e,r],M({projects:e,clients:t,activeId:a.activeId})}r(e),o(t),c(a.activeId||null);let n=new URLSearchParams(window.location.search).get(`portal`),i=typeof window<`u`&&window.location.pathname.startsWith(`/c`);if(n&&i){let e=t.find(e=>Jn(e.nome)===n||e.id===n);e&&(u(e.id),g(`portal`))}}else{let{client:e,project:t}=Rt(),{client:n,project:i}=zt(),a=[t,i],s=[e,n];r(a),o(s),c(t.id),u(e.id),m([e.id,n.id]),M({projects:a,clients:s,activeId:t.id}),g(`project`)}y(!0);let s=P();if(s.view===`approvals`||s.view===`globalcal`||s.view===`planner`)g(s.view);else if(s.view===`client`&&s.id&&cs.find(e=>e.id===s.id))u(s.id),g(`client`);else if(s.view===`project`&&s.id&&ps.find(e=>e.id===s.id)){c(s.id),g(`project`);let e=ps.find(e=>e.id===s.id);e?.clientId&&u(e.clientId)}let l=new Date,d=new Date(l.getTime()+48*36e5),f=(a?.projects||e||[]).map(V).flatMap(e=>p(e).filter(e=>{if(!e.data||![t.bozza,t.revisione].includes(_(e.stato)))return!1;let n=new Date(e.data+`T23:59:59`);return n<=d&&n>=l}).map(t=>({...t,_projName:e.name,_clientId:e.clientId})));f.length>0&&C(f)})()},[]);async function M(e){D(`saving`);let t=await ke(e);return t.ok?(D(`saved`),j(t.savedAt),t.sizeWarning?k(t.sizeWarning):k(``)):(D(`error`),k(t.error||`Errore salvataggio — riprova`)),t}function N(e,t,n={}){let r=`/`;e===`approvals`?r=`/approvals`:e===`globalcal`?r=`/calendar`:e===`planner`?r=`/planner`:e===`client`?r=`/client/`+(t||``):e===`portal`?r=`/portal/`+(t||``):e===`project`&&(r=`/project/`+(t||``),n.module&&n.module!==`overview`&&(r+=`/`+n.module),n.tab&&(r+=`/`+n.tab),n.subTab&&(r+=`/`+n.subTab)),window.history.pushState({view:e,id:t,...n},``,r)}function P(){let e=window.location.pathname.split(`/`).filter(Boolean),t={view:`dashboard`,id:null,module:null,tab:null,subTab:null};return e.length?e[0]===`approvals`?{...t,view:`approvals`}:e[0]===`calendar`?{...t,view:`globalcal`}:e[0]===`planner`?{...t,view:`planner`}:e[0]===`client`&&e[1]?{...t,view:`client`,id:e[1]}:e[0]===`portal`&&e[1]?{...t,view:`portal`,id:e[1]}:e[0]===`project`&&e[1]?(t.view=`project`,t.id=e[1],e[2]&&(t.module=e[2]),e[3]&&(t.tab=e[3]),e[4]&&(t.subTab=e[4]),t):t:t}(0,U.useEffect)(()=>{function t(){let t=P();if(g(t.view),t.id){if(t.view===`project`){c(t.id);let n=e.find(e=>e.id===t.id);n?.clientId&&u(n.clientId)}t.view===`client`&&u(t.id)}}return window.addEventListener(`popstate`,t),()=>window.removeEventListener(`popstate`,t)},[e]);async function F(e,t,n){r(e),o(t),n!==void 0&&c(n),await M({projects:e,clients:t,activeId:n??s})}async function I(e){x(e),await mn(e)}async function L(t){await F(e.map(e=>e.id===t.id?t:e),a,s)}async function R(t){let n=a.map(e=>e.id===t.id?t:e);o(n),await M({projects:e,clients:n,activeId:s})}function z(t){c(t),g(`project`),N(`project`,t,{module:`overview`});let n=e.find(e=>e.id===t);n?.clientId&&u(n.clientId),F(e,a,t)}function B(){g(`dashboard`),N(`dashboard`),F(e,a,null);let t=new URL(window.location.href);t.searchParams.delete(`portal`),window.history.pushState({},``,t.toString())}function te(e){m(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])}function ne(e){u(e),g(`client`),N(`client`,e)}function re(e){u(e),g(`portal`);let t=a.find(t=>t.id===e),n=t?Jn(t.nome):e;new URL(window.location.href);let r=`${window.location.origin}/c/?portal=${n}`;window.history.pushState({portal:e},``,r)}function H(t){let n=t.nome||(t.settore?`Piano ${t.settore}`:`Progetto `+new Date().toLocaleDateString(`it-IT`)),r={id:hn(),clientId:l||null,name:n,createdAt:Date.now(),interview:t,context:gn(t),pdm:{sections:{}},pdc:{sections:{}},pilastri:[],ed:d(),tasks:[],milestones:[],budget:{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:``},qbrs:[],creators:[]};F([...e,r],a.map(e=>e.id===l?{...e,projectIds:[...e.projectIds||[],r.id]}:e),r.id),c(r.id),g(`project`),N(`project`,r.id,{module:`overview`})}function ie(e){u(e),g(`wizard`),N(`client`,e)}function oe(){let t=Yn(),n=[...a,t];o(n),M({projects:e,clients:n,activeId:s}),u(t.id),m(e=>[...e,t.id]),g(`client`),N(`client`,t.id)}let se=e.find(e=>e.id===s),W=a.find(e=>e.id===l),ce=typeof window<`u`?new URLSearchParams(window.location.search).get(`portal`):null,le=typeof window<`u`&&window.location.pathname.startsWith(`/c`);return ce&&h===`portal`&&W&&le?(0,G.jsxs)(`div`,{className:`portal-standalone`,children:[(0,G.jsxs)(`div`,{className:`portal-standalone-hdr`,children:[(0,G.jsxs)(`div`,{className:`portal-standalone-brand`,children:[(0,G.jsx)(`div`,{style:{width:32,height:32,borderRadius:8,background:`#1B4DFF`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff`,fontWeight:800,fontSize:14},children:`N`}),(0,G.jsx)(`span`,{style:{fontWeight:700,fontSize:13,color:`var(--ink2)`},children:`NASSA STUDIO`})]}),(0,G.jsxs)(`div`,{style:{flex:1},children:[(0,G.jsx)(`div`,{style:{fontWeight:700,fontSize:16,color:`var(--ink1)`},children:W.nome}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`},children:`Area riservata cliente`})]})]}),(0,G.jsx)($n,{client:W,projects:e.filter(e=>e.clientId===W.id),onBack:null,onUpdateProject:L,standaloneMode:!0})]}):v?(0,G.jsxs)(`div`,{className:`app`,children:[w&&(0,G.jsx)(yr,{projects:e,clients:a,onNavigate:ee,onClose:()=>T(!1)}),S&&S.length>0&&(0,G.jsxs)(`div`,{className:`urgency-toast`,children:[(0,G.jsx)(`div`,{className:`urgency-toast-icon`,children:`⚠️`}),(0,G.jsxs)(`div`,{className:`urgency-toast-body`,children:[(0,G.jsxs)(`div`,{className:`urgency-toast-title`,children:[S.length,` post urgent`,S.length===1?`e`:`i`,` nelle prossime 48h`]}),(0,G.jsxs)(`div`,{className:`urgency-toast-list`,children:[S.slice(0,3).map(e=>(0,G.jsxs)(`div`,{className:`urgency-toast-item`,children:[(0,G.jsx)(`span`,{className:`urgency-dot`,style:{background:i[e.stato]?.tx||`#94A3B8`}}),e.titolo||`Post senza titolo`,` · `,e.data]},e.id)),S.length>3&&(0,G.jsxs)(`div`,{style:{fontSize:10,color:`rgba(255,255,255,.7)`},children:[`+`,S.length-3,` altri`]})]})]}),(0,G.jsx)(`button`,{className:`urgency-toast-close`,onClick:()=>C(null),children:`✕`})]}),(0,G.jsxs)(`div`,{className:`sidebar`,children:[(0,G.jsxs)(`div`,{className:`sidebar-top`,children:[(0,G.jsxs)(`div`,{className:`logo`,children:[(0,G.jsx)(`div`,{className:`logo-glyph`,children:`◈`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{className:`logo-name`,children:`NASSA`}),(0,G.jsx)(`div`,{className:`logo-sub`,children:`Marketing Studio`})]})]}),a.length>0&&(0,G.jsxs)(`div`,{className:`global-brand-sel`,children:[(0,G.jsxs)(`select`,{className:`gbs-select`,value:l||``,onChange:t=>{let n=t.target.value;if(!n)return;u(n),m(e=>e.includes(n)?e:[...e,n]);let r=e.find(e=>e.clientId===n);r?(c(r.id),g(`project`),N(`project`,r.id,{module:`overview`})):g(`client`)},children:[(0,G.jsx)(`option`,{value:``,children:`— Brand attivo —`}),a.map(e=>(0,G.jsx)(`option`,{value:e.id,children:e.nome},e.id))]}),(0,G.jsx)(an,{name:`users`,size:11,color:`var(--ink4)`,style:{position:`absolute`,right:8,top:`50%`,transform:`translateY(-50%)`,pointerEvents:`none`}})]}),(0,G.jsx)(`button`,{className:`new-btn`,onClick:oe,children:`+ Nuovo Cliente`}),(0,G.jsxs)(`button`,{className:`cmdb-trigger-btn`,onClick:()=>T(!0),title:`Cerca (Cmd+K)`,children:[(0,G.jsx)(an,{name:`compass`,size:13,color:`var(--ink4)`}),(0,G.jsx)(`span`,{children:`Cerca…`}),(0,G.jsx)(`kbd`,{className:`cmdb-trigger-kbd`,children:`⌘K`})]}),(0,G.jsx)(br,{status:E,error:O,lastSavedAt:A})]}),(0,G.jsx)(`div`,{className:`sb-label`,children:`Clienti`}),(0,G.jsxs)(`div`,{className:`proj-list`,children:[a.length===0&&(0,G.jsx)(`div`,{className:`sb-empty`,children:`Nessun cliente. Aggiungine uno.`}),a.map(t=>{let n=e.filter(e=>e.clientId===t.id),r=f.includes(t.id),i=l===t.id&&(h===`client`||h===`portal`),a=new Date,o=new Date(a.getTime()+48*36e5),c=n.flatMap(e=>e.ed?.feedItems||[]).filter(e=>{if(!e.data||![`bozza`,`revisione`].includes(e.stato))return!1;let t=new Date(e.data+`T23:59:59`);return t<=o&&t>=a}).length;return(0,G.jsxs)(`div`,{className:`sb-client-group`,children:[(0,G.jsxs)(`div`,{className:`sb-client-row ${i?`sb-client-active`:``}`,children:[(0,G.jsx)(`button`,{className:`sb-chevron-btn`,onClick:()=>te(t.id),children:r?`▼`:`▶`}),(0,G.jsx)(`div`,{className:`sb-client-name`,onClick:()=>ne(t.id),children:t.nome}),c>0&&(0,G.jsx)(`span`,{className:`sb-urgency-badge`,title:`${c} post urgenti`,children:c}),(0,G.jsx)(`button`,{className:`sb-icon-btn`,title:`Impostazioni cliente`,onClick:()=>ne(t.id),children:`⚙`}),(0,G.jsx)(`button`,{className:`sb-icon-btn`,title:`Nuovo progetto`,onClick:()=>ie(t.id),children:`+`})]}),r&&n.map(e=>(0,G.jsxs)(`div`,{className:`sb-proj-row ${s===e.id&&h===`project`?`active`:``}`,onClick:()=>z(e.id),children:[(0,G.jsx)(`span`,{className:`sb-proj-dot`}),(0,G.jsx)(`span`,{className:`sb-proj-name`,children:e.name})]},e.id)),r&&n.length===0&&(0,G.jsx)(`div`,{className:`sb-proj-empty`,onClick:()=>ie(t.id),children:`+ Aggiungi progetto`})]},t.id)}),e.filter(e=>!e.clientId).map(e=>(0,G.jsxs)(`div`,{className:`proj-row ${s===e.id&&h===`project`?`active`:``}`,onClick:()=>z(e.id),children:[(0,G.jsx)(`div`,{className:`pr-name`,children:e.name}),(0,G.jsx)(`div`,{className:`pr-date`,children:`Nessun cliente`})]},e.id))]}),(0,G.jsxs)(`div`,{className:`sb-bottom`,children:[(0,G.jsx)(Pt,{globalMeta:b,onMetaChange:I,clients:a}),(0,G.jsxs)(`button`,{className:`sb-planner-btn ${h===`approvals`?`active`:``}`,onClick:()=>{g(`approvals`),N(`approvals`)},style:{position:`relative`},children:[`✅ Approvazioni`,(()=>{let t=e.reduce((e,t)=>{let n=t.ed||{};return e+[...n.feedItems||[],...n.contentItems||[]].filter(e=>e.stato===`revisione`||e.stato===`semaforo`).length},0);return t>0?(0,G.jsx)(`span`,{style:{position:`absolute`,top:4,right:8,background:`var(--err)`,color:`#fff`,fontSize:9,fontWeight:800,padding:`1px 5px`,borderRadius:99,minWidth:16,textAlign:`center`},children:t}):null})()]}),(0,G.jsx)(`button`,{className:`sb-planner-btn ${h===`globalcal`?`active`:``}`,onClick:()=>{g(`globalcal`),N(`globalcal`)},children:`📅 Calendario Globale`}),(0,G.jsx)(`button`,{className:`sb-planner-btn ${h===`planner`?`active`:``}`,onClick:()=>{g(`planner`),N(`planner`)},children:`🗓️ Team Planner`})]})]}),(0,G.jsxs)(`div`,{className:`main`,children:[h===`wizard`&&(0,G.jsx)(K,{name:`Nuovo Progetto`,resetKey:h,children:(0,G.jsx)(hr,{onComplete:H})}),h===`dashboard`&&(0,G.jsx)(K,{name:`Dashboard`,resetKey:h,children:(0,G.jsx)(vr,{projects:e,onSelect:z,onNew:oe})}),h===`client`&&W&&(0,G.jsx)(K,{name:`Impostazioni Cliente`,resetKey:W.id,children:(0,G.jsx)(Xn,{client:W,globalMeta:b,projects:e,onUpdate:R,onAddProject:ie,onSelectProject:z,onClose:B},W.id)}),h===`portal`&&W&&(0,G.jsx)(K,{name:`Portale Cliente`,resetKey:W.id,children:(0,G.jsx)($n,{client:W,projects:e,onBack:()=>g(`client`),onUpdateProject:L})}),h===`approvals`&&(0,G.jsx)(K,{name:`Approvazioni`,resetKey:h,children:(0,G.jsxs)(`div`,{className:`planner-view`,children:[(0,G.jsxs)(`div`,{className:`pv-topbar`,children:[(0,G.jsx)(`button`,{className:`pv-back`,onClick:()=>g(`dashboard`),children:`← Clienti`}),(0,G.jsx)(`div`,{className:`pv-name`,children:`✅ Approvazioni`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`,marginLeft:8},children:`Dashboard globale · tutti i clienti`})]}),(0,G.jsx)(`div`,{style:{flex:1,overflow:`auto`},children:(0,G.jsx)(gt,{projects:e,clients:a,onUpdateProject:L,onGoToProject:e=>{z(e)}})})]})}),h===`globalcal`&&(0,G.jsx)(K,{name:`Calendario Globale`,resetKey:h,children:(0,G.jsxs)(`div`,{className:`planner-view`,children:[(0,G.jsxs)(`div`,{className:`pv-topbar`,children:[(0,G.jsx)(`button`,{className:`pv-back`,onClick:()=>g(`dashboard`),children:`← Clienti`}),(0,G.jsx)(`div`,{className:`pv-name`,children:`📅 Calendario Globale`}),(0,G.jsx)(`div`,{style:{fontSize:11,color:`var(--ink4)`,marginLeft:8},children:`Tutti i post · tutti i clienti`})]}),(0,G.jsx)(`div`,{style:{flex:1,overflow:`auto`},children:(0,G.jsx)(ut,{projects:e,clients:a,onGoToProject:e=>{z(e),g(`project`)},onUpdateProject:L})})]})}),h===`planner`&&(0,G.jsx)(K,{name:`Team Planner`,resetKey:h,children:(0,G.jsxs)(`div`,{className:`planner-view`,children:[(0,G.jsxs)(`div`,{className:`pv-topbar`,children:[(0,G.jsx)(`button`,{className:`pv-back`,onClick:()=>g(`dashboard`),children:`← Clienti`}),(0,G.jsx)(`div`,{className:`pv-name`,children:`Team Planner`})]}),(0,G.jsx)(`div`,{style:{flex:1,overflow:`auto`,padding:`20px 32px`},children:(0,G.jsx)(ae,{projects:e})})]})}),h===`project`&&se&&(0,G.jsx)(K,{name:`Progetto`,resetKey:se.id,children:(0,G.jsx)(_r,{project:se,onUpdate:L,onBack:B,globalMeta:b,onPortal:()=>re(se.clientId),client:a.find(e=>e.id===se.clientId),pushUrl:N})})]})]}):(0,G.jsx)(`div`,{className:`app`,children:(0,G.jsx)(`div`,{className:`loading`,children:`Caricamento…`})})}var Sr=xr,Cr=[{id:`approvals`,label:`📋 Approvazioni`},{id:`funnel`,label:`🎯 Funnel`},{id:`insights`,label:`📊 Meta Insights`}],wr={revisione:{bg:`#fff7ed`,text:`#c2410c`,border:`#fed7aa`},semaforo:{bg:`#fefce8`,text:`#a16207`,border:`#fde047`},"non-approvato":{bg:`#fef2f2`,text:`#b91c1c`,border:`#fca5a5`}},Tr={instagram:`📸`,facebook:`📘`,tiktok:`🎵`,linkedin:`💼`,youtube:`▶️`,email:`📧`,blog:`📝`};function Er({clientId:e,token:t}){let[n,r]=(0,U.useState)(null),[i,a]=(0,U.useState)([]),[o,s]=(0,U.useState)(null),[c,l]=(0,U.useState)(`approvals`),[u,d]=(0,U.useState)(null);(0,U.useEffect)(()=>{(async()=>{let n=await Oe();if(!n.ok){s(`Impossibile caricare i dati.`);return}let i=(n.clients||[]).find(t=>t.id===e);if(!i){s(`Cliente non trovato.`);return}if(!Zt(i,t)){s(`Link non valido o scaduto. Richiedi un nuovo link all'agenzia.`);return}let o=(n.projects||[]).filter(t=>t.clientId===e);r(i),a(o)})()},[e,t]);let f=(0,U.useMemo)(()=>i.flatMap(e=>p(e).filter(e=>[`revisione`,`semaforo`,`non-approvato`].includes(e.stato)).map(t=>({...t,_projId:e.id,_projName:e.name}))).sort((e,t)=>(e.data||``).localeCompare(t.data||``)),[i]),m=i[0]||null;function h(e,t=`success`){d({msg:e,type:t}),setTimeout(()=>d(null),3e3)}async function g(t,n,r,i=``){let o=await Oe();if(!o.ok){h(`Errore salvataggio`,`error`);return}let s=(o.projects||[]).findIndex(e=>e.id===n);if(s===-1)return;let c=o.projects[s],l=(c.ed?.feedItems||[]).map(e=>e.id===t?{...e,stato:r,clientNote:i||e.clientNote,clientReviewedAt:new Date().toISOString()}:e);if(o.projects[s]={...c,ed:{...c.ed||{},feedItems:l}},!(await ke(o)).ok){h(`Errore durante il salvataggio`,`error`);return}a(o.projects.filter(t=>t.clientId===e)),h(r===`approvato`?`✅ Post approvato!`:`🔄 Richiesta modifiche inviata`)}return o?(0,G.jsx)(`div`,{style:$.centerPage,children:(0,G.jsxs)(`div`,{style:$.authCard,children:[(0,G.jsx)(`div`,{style:{fontSize:48,marginBottom:16},children:`🔒`}),(0,G.jsx)(`h2`,{style:{margin:`0 0 8px`,color:`#111`},children:`Accesso non consentito`}),(0,G.jsx)(`p`,{style:{color:`#666`,margin:0},children:o})]})}):n?(0,G.jsxs)(`div`,{style:$.page,children:[(0,G.jsxs)(`header`,{style:$.header,children:[(0,G.jsxs)(`div`,{style:$.headerInner,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`div`,{style:$.agencyBadge,children:`Nassa Studio`}),(0,G.jsx)(`h1`,{style:$.headerTitle,children:n.nome})]}),(0,G.jsx)(`div`,{style:{fontSize:13,color:`#9ca3af`,fontStyle:`italic`},children:`Portale Cliente`})]}),(0,G.jsx)(`div`,{style:$.tabs,children:Cr.map(e=>(0,G.jsxs)(`button`,{onClick:()=>l(e.id),style:{...$.tab,...c===e.id?$.tabActive:{}},children:[e.label,e.id===`approvals`&&f.length>0&&(0,G.jsx)(`span`,{style:$.badge,children:f.length})]},e.id))})]}),u&&(0,G.jsx)(`div`,{style:{...$.toast,background:u.type===`error`?`#fef2f2`:`#f0fdf4`,borderColor:u.type===`error`?`#fca5a5`:`#86efac`,color:u.type===`error`?`#b91c1c`:`#166534`},children:u.msg}),(0,G.jsxs)(`main`,{style:$.main,children:[c===`approvals`&&(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{style:$.sectionHdr,children:[(0,G.jsx)(`h2`,{style:$.sectionTitle,children:`Contenuti in attesa di approvazione`}),(0,G.jsx)(`p`,{style:$.sectionSub,children:`Approva o richiedi modifiche ai post proposti dall'agenzia.`})]}),f.length===0?(0,G.jsxs)(`div`,{style:$.empty,children:[(0,G.jsx)(`div`,{style:{fontSize:48,marginBottom:12},children:`🎉`}),(0,G.jsx)(`p`,{children:`Tutto approvato!`})]}):(0,G.jsx)(`div`,{style:$.grid,children:f.map(e=>(0,G.jsx)(Dr,{post:e,onApprove:()=>g(e.id,e._projId,`approvato`),onReject:t=>g(e.id,e._projId,`non-approvato`,t)},e.id))})]}),c===`funnel`&&m&&(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{style:$.sectionHdr,children:[(0,G.jsx)(`h2`,{style:$.sectionTitle,children:`Strategia Funnel`}),(0,G.jsx)(`p`,{style:$.sectionSub,children:`Distribuzione contenuti per fase del funnel.`})]}),(0,G.jsx)(A,{project:m,onUpdate:()=>{},readOnly:!0})]}),c===`insights`&&(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(`div`,{style:$.sectionHdr,children:[(0,G.jsx)(`h2`,{style:$.sectionTitle,children:`Meta Insights`}),(0,G.jsx)(`p`,{style:$.sectionSub,children:`Performance organica delle pagine collegate.`})]}),(0,G.jsx)(E,{client:n,readOnly:!0})]})]}),(0,G.jsxs)(`footer`,{style:{textAlign:`center`,padding:24,color:`#9ca3af`,fontSize:13},children:[`Powered by `,(0,G.jsx)(`strong`,{children:`Nassa Studio`})]})]}):(0,G.jsx)(`div`,{style:$.centerPage,children:(0,G.jsx)(`div`,{style:$.spinner})})}function Dr({post:e,onApprove:t,onReject:n}){let[r,i]=(0,U.useState)(!1),[a,o]=(0,U.useState)(``),s=(e.canale||(e.piattaforme||[])[0]||``).toLowerCase(),c=e.stato||`revisione`,l=wr[c]||wr.revisione,u=e.data?Math.ceil((new Date(e.data)-Date.now())/864e5):null;return(0,G.jsxs)(`div`,{style:{...$.card,borderColor:l.border},children:[(0,G.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`12px 16px 0`},children:[(0,G.jsx)(`span`,{style:{fontSize:12,fontWeight:600,padding:`3px 10px`,borderRadius:20,border:`1px solid`,background:l.bg,color:l.text,borderColor:l.border},children:c===`revisione`?`In revisione`:c===`semaforo`?`Semaforo`:`Modifiche richieste`}),u!==null&&(0,G.jsx)(`span`,{style:{fontSize:12,color:u<=2?`#dc2626`:u<=5?`#d97706`:`#6b7280`},children:u<=0?`⚠️ Scaduto`:`📅 tra ${u}gg`})]}),(e.immagineBase64||e.immagineUrl)&&(0,G.jsx)(`div`,{style:{aspectRatio:`1`,overflow:`hidden`,background:`#f3f4f6`},children:(0,G.jsx)(`img`,{src:e.immagineBase64||e.immagineUrl,alt:``,style:{width:`100%`,height:`100%`,objectFit:`cover`},onError:e=>{e.target.style.display=`none`}})}),(0,G.jsxs)(`div`,{style:{padding:`12px 16px`,flex:1},children:[(0,G.jsxs)(`div`,{style:{display:`flex`,gap:12,fontSize:12,color:`#6b7280`,marginBottom:6},children:[(0,G.jsxs)(`span`,{children:[Tr[s]||`📄`,` `,s||`Social`]}),e.data&&(0,G.jsxs)(`span`,{children:[`📅 `,new Date(e.data).toLocaleDateString(`it-IT`,{day:`numeric`,month:`long`})]})]}),(0,G.jsx)(`h3`,{style:{margin:`0 0 8px`,fontSize:15,fontWeight:600,color:`#111`},children:e.titolo||e.title||`Post senza titolo`}),e.caption&&(0,G.jsx)(`p`,{style:{margin:0,fontSize:13,color:`#374151`,lineHeight:1.5},children:e.caption.length>200?e.caption.slice(0,200)+`…`:e.caption}),e.clientNote&&(0,G.jsxs)(`div`,{style:{marginTop:8,fontSize:12,color:`#92400e`,background:`#fffbeb`,borderRadius:6,padding:`6px 10px`},children:[(0,G.jsx)(`strong`,{children:`Nota:`}),` `,e.clientNote]}),e._projName&&(0,G.jsxs)(`div`,{style:{marginTop:6,fontSize:11,color:`#9ca3af`},children:[`Progetto: `,e._projName]})]}),r?(0,G.jsxs)(`div`,{style:{borderTop:`1px solid #f3f4f6`,padding:`12px 16px`},children:[(0,G.jsx)(`textarea`,{placeholder:`Descrivi le modifiche richieste…`,value:a,onChange:e=>o(e.target.value),rows:3,style:{width:`100%`,boxSizing:`border-box`,border:`1px solid #e5e7eb`,borderRadius:8,padding:`8px 12px`,fontSize:13,fontFamily:`inherit`,resize:`vertical`,marginBottom:8}}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,G.jsx)(`button`,{style:{flex:1,padding:`8px`,borderRadius:8,border:`none`,cursor:`pointer`,fontSize:13,fontWeight:600,background:`#fef2f2`,color:`#b91c1c`,fontFamily:`inherit`},onClick:()=>{n(a),i(!1),o(``)},disabled:!a.trim(),children:`Invia richiesta`}),(0,G.jsx)(`button`,{style:{padding:`8px 16px`,borderRadius:8,border:`none`,cursor:`pointer`,fontSize:13,background:`#f3f4f6`,color:`#374151`,fontFamily:`inherit`},onClick:()=>{i(!1),o(``)},children:`Annulla`})]})]}):(0,G.jsxs)(`div`,{style:{display:`flex`,gap:8,padding:`12px 16px`,borderTop:`1px solid #f3f4f6`},children:[(0,G.jsx)(`button`,{style:{flex:1,padding:`8px 12px`,borderRadius:8,border:`none`,cursor:`pointer`,fontSize:13,fontWeight:600,background:`#f0fdf4`,color:`#166534`,fontFamily:`inherit`},onClick:t,children:`✅ Approva`}),(0,G.jsx)(`button`,{style:{flex:1,padding:`8px 12px`,borderRadius:8,border:`none`,cursor:`pointer`,fontSize:13,fontWeight:600,background:`#fef2f2`,color:`#b91c1c`,fontFamily:`inherit`},onClick:()=>i(!0),children:`✏️ Modifiche`})]})]})}var $={page:{minHeight:`100vh`,background:`#f8fafc`,fontFamily:`'Inter', system-ui, sans-serif`},centerPage:{minHeight:`100vh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#f8fafc`},authCard:{background:`#fff`,borderRadius:16,padding:`48px 40px`,textAlign:`center`,boxShadow:`0 4px 24px rgba(0,0,0,.08)`,maxWidth:360},spinner:{width:40,height:40,border:`3px solid #e5e7eb`,borderTopColor:`#006EFF`,borderRadius:`50%`,animation:`spin 0.8s linear infinite`},header:{background:`#fff`,borderBottom:`1px solid #e5e7eb`,position:`sticky`,top:0,zIndex:50},headerInner:{maxWidth:900,margin:`0 auto`,padding:`16px 20px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},agencyBadge:{fontSize:11,fontWeight:600,color:`#6b7280`,textTransform:`uppercase`,letterSpacing:`0.08em`,marginBottom:2},headerTitle:{margin:0,fontSize:20,fontWeight:700,color:`#111`},tabs:{maxWidth:900,margin:`0 auto`,padding:`0 20px`,display:`flex`,gap:4},tab:{padding:`12px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,color:`#6b7280`,borderBottom:`2px solid transparent`,display:`flex`,alignItems:`center`,gap:6,fontFamily:`inherit`},tabActive:{color:`#006EFF`,borderBottomColor:`#006EFF`,fontWeight:600},badge:{background:`#dc2626`,color:`#fff`,borderRadius:10,padding:`1px 6px`,fontSize:11,fontWeight:700},toast:{position:`fixed`,top:16,right:16,zIndex:100,padding:`12px 20px`,borderRadius:8,border:`1px solid`,fontSize:14,fontWeight:500,boxShadow:`0 4px 12px rgba(0,0,0,.1)`},main:{maxWidth:900,margin:`0 auto`,padding:`32px 20px`},sectionHdr:{marginBottom:24},sectionTitle:{margin:`0 0 4px`,fontSize:22,fontWeight:700,color:`#111`},sectionSub:{margin:0,color:`#6b7280`,fontSize:14},empty:{textAlign:`center`,padding:`64px 20px`,color:`#6b7280`},grid:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(300px, 1fr))`,gap:20},card:{background:`#fff`,borderRadius:12,border:`1px solid`,overflow:`hidden`,display:`flex`,flexDirection:`column`}},{isClientMode:Or,clientId:kr,token:Ar}=Xt();(0,oe.createRoot)(document.getElementById(`root`)).render((0,G.jsx)(U.StrictMode,{children:(0,G.jsx)(Me,{children:Or?(0,G.jsx)(Er,{clientId:kr,token:Ar}):(0,G.jsx)(Sr,{})})}));export{Gt as n,J as r,Kt as t};
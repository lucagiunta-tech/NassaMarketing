import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { AppErrorBoundary, ModuleErrorBoundary } from "./ErrorBoundary";
import {
  safeLoadWorkspace,
  safeSaveWorkspace,
  callClaude,
  openMetaOAuth,
  downloadBlob,
  buildDocHTML,
  buildModuleDocHTML,
  buildModuleMarkdown,
  buildModulePresentationSlides,
  buildSectionPresentationHTML,
} from "./services";

import {
  FeedPreviewGrid,
  ListaView,
  CalendarSimpleED,
  FunnelViewED,
  IdeasBoard,
  EditorialeHome,
  PostFormModal,
  CommentThread,
  PublishModal,
  PublishingHubED,
  ContentTrackerED,
  GlobalCalendarView,
  GlobalApprovalsView,
  WhiteLabelReportBtn,
  BulkUploadModal,
  PerformanceLogED,
  MonthlyReviewED,
  MetaInsightsPanel,
  StrategyUpdateED,
  CampagneExecED,
  CANALE_COLOR,
  FEED_TIPI,
  FEED_TIPI_ICON,
  FEED_TIPI_LABEL,
  FEED_PIATTAFORME,
  POST_STATUS,
  FEED_STATI,
  FEED_STATI_STYLE,
  STATI_PIPELINE,
  STATI_NEXT,
  STATI_NEXT_LABEL,
  normalizeChannel,
  getChannelColor,
  normalizeFeedStatus,
  getFeedStatusStyle,
  isPostStatus,
  isPostPublished,
  getNextFeedStatus,
  getProjectEd,
  applyEdUpdate,
  createEmptyEditorialState,
  normalizePostType,
  normalizePostPlatforms,
  normalizeFeedItem,
  getEditorialPosts,
  migrateProjectData,
  migrateWorkspaceData,
  getPillarColor,
} from "./modules/editorial";
import {
  CollaboratoriModal,
  TeamPlannerNMS,
  DEFAULT_MEMBERS_NMS,
  TP_SK_MEMBERS,
  tpGet,
} from "./modules/team";
import { CreatorDatabase } from "./modules/overview";
import { GlobalMetaConnect } from "./modules/meta";
import { createKosmetikal, createCoopRadenza } from "./templates";
import { StrategicCascadeBanner, SectionContent } from "./modules/strategy";

import { renderMd } from "./utils";
import { ensureClientToken, buildClientUrl } from "./utils/clientAuth.js";

// ─── SVG OUTLINE ICON SYSTEM ──────────────────────────────────────────────────
// Monochromatic, 1.5px stroke, no fill — Lucide/Feather style
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

// Utility: render SVG icon inline
function SvgIcon({ name, size=15, color="currentColor", style={} }){
  const svg = ICON[name];
  if(!svg) return null;
  const html = svg.replace(/width="15"/g,`width="${size}"`).replace(/height="15"/g,`height="${size}"`).replace(/stroke="currentColor"/g,`stroke="${color}"`);
  return <span style={{display:"inline-flex",alignItems:"center",flexShrink:0,...style}} dangerouslySetInnerHTML={{__html:html}}/>;
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────
const SECTIONS_PDM = [
  { id:"executive_summary",  label:"Executive Summary",      icon:"chart",    group:"Fondamenta" },
  { id:"analisi_interna",    label:"Analisi Interna",        icon:"layers",   group:"Fondamenta" },
  { id:"analisi_esterna",    label:"Analisi Esterna + PEST", icon:"compass",  group:"Fondamenta" },
  { id:"swot",               label:"SWOT & Matrice",         icon:"grid",     group:"Fondamenta" },
  { id:"segmentazione",      label:"Segmentazione",          icon:"pie",      group:"Target" },
  { id:"personas",           label:"Buyer Personas",         icon:"users",    group:"Target" },
  { id:"posizionamento_usp", label:"Posizionamento + USP",   icon:"target",   group:"Target" },
  { id:"obiettivi_smart",    label:"Obiettivi SMART",        icon:"flag",     group:"Strategia",
    hasBridge: true }, // ← Communication Bridge anchor
  { id:"marketing_mix_7p",   label:"Marketing Mix 7P",       icon:"box",      group:"Strategia" },
  { id:"canali_media_mix",   label:"Canali & Media Mix",     icon:"map",      group:"Strategia" },
  { id:"value_proposition",  label:"Value Proposition",      icon:"zap",      group:"Strategia" },
  { id:"funnel_strategy",    label:"Funnel Strategy",        icon:"triangle", group:"Strategia" },
  { id:"pricing_strategy",   label:"Pricing Strategy",       icon:"dollar",   group:"Strategia" },
  { id:"cac_ltv",            label:"CAC & LTV / Unit Economics", icon:"trending", group:"Strategia" }, // ← NUOVO
  { id:"piano_operativo",    label:"Piano Operativo",        icon:"columns",  group:"Esecuzione" },
  { id:"lead_nurturing",     label:"Lead Nurturing",         icon:"mail",     group:"Esecuzione" },
  { id:"roadmap",            label:"Roadmap Milestones",     icon:"map",      group:"Esecuzione" },
  { id:"tech_stack",         label:"Tech Stack",             icon:"box",      group:"Esecuzione" },
  { id:"kpi_dashboard",      label:"KPI Dashboard",          icon:"activity", group:"Monitoraggio" },
  { id:"budget_media",       label:"Budget & Media Plan",    icon:"dollar",   group:"Monitoraggio" },
];

const SECTIONS_PDC = [
  { id:"obiettivi_comunicativi", label:"Obiettivi Comunicativi",  icon:"flag",      group:"Fondamenta" },
  { id:"contesto_comunicativo",  label:"Contesto Comunicativo",   icon:"compass",   group:"Fondamenta" },
  { id:"creative_territory",     label:"Creative Territory",      icon:"layers",    group:"Fondamenta" },
  { id:"tone_of_voice",          label:"Tone of Voice",           icon:"mic",       group:"Identità" },
  { id:"message_house",          label:"Message House",           icon:"inbox",     group:"Identità" },
  { id:"copy_strategy",          label:"Copy Strategy",           icon:"edit",      group:"Identità" },
  { id:"buyer_insights",         label:"Buyer Insights",          icon:"eye",       group:"Identità" },
  { id:"brand_taboos",           label:"Brand Taboos & Parole Vietate", icon:"shield", group:"Identità" }, // ← NUOVO
  { id:"architettura_canali",    label:"Architettura Canali",     icon:"map",       group:"Operativo" },
  { id:"piano_editoriale_canale",label:"Piano Editoriale Canale", icon:"calendar",  group:"Operativo" },
  { id:"campaign_moments",       label:"Campaign Moments",        icon:"megaphone", group:"Operativo" },
  { id:"funnel_comunicativo",    label:"Funnel Comunicativo",     icon:"triangle",  group:"Operativo" },
  { id:"adv_social",             label:"Piano ADV Social",        icon:"zap",       group:"Operativo" },
  { id:"partnership_editoriali", label:"Partnership Editoriali",  icon:"link",      group:"Operativo" },
  { id:"content_repurposing",    label:"Content Repurposing Matrix", icon:"refresh", group:"Operativo" }, // ← NUOVO
];

const GROUPS_PDM = ["Fondamenta","Target","Strategia","Esecuzione","Monitoraggio"];
const GROUPS_PDC = ["Fondamenta","Identità","Operativo"];

const COLORS_PDM = { Fondamenta:"#006EFF", Target:"#C800FF", Strategia:"#00C853", Esecuzione:"#FF6B00", Monitoraggio:"#00B4D8" };
const COLORS_PDC = { Fondamenta:"#6366F1", Identità:"#C800FF", Operativo:"#00B4D8" };

// ─── EDITORIALE SECTIONS ──────────────────────────────────────────────────────
const SECTIONS_ED = [
  { id:"ped",             label:"Piano Editoriale",        icon:"calendar",  group:"Pianificazione" },
  { id:"calendario",      label:"Calendario",              icon:"columns",   group:"Pianificazione" },
  { id:"campagne_exec",   label:"Campagne",                icon:"megaphone", group:"Pianificazione" },
  { id:"feed",            label:"Feed",                    icon:"grid",      group:"Esecuzione" },
  { id:"content_tracker", label:"Kanban Board",            icon:"inbox",     group:"Esecuzione" },
  { id:"publishing",      label:"Publishing Hub",          icon:"zap",       group:"Esecuzione" },
  { id:"funnel",          label:"Funnel TOFU/MOFU/BOFU",   icon:"triangle",  group:"Monitoraggio" },
  { id:"perf_log",        label:"Performance Log",         icon:"activity",  group:"Monitoraggio" },
  { id:"monthly_review",  label:"Monthly Review",          icon:"eye",       group:"Monitoraggio" },
  { id:"strategy_update", label:"Aggiornamento Strategia", icon:"refresh",   group:"Monitoraggio" },
  { id:"cicli",           label:"Ciclo & Pivot",           icon:"trending",  group:"Monitoraggio" },
];
const GROUPS_ED   = ["Pianificazione","Esecuzione","Monitoraggio"];
const COLORS_ED   = { Pianificazione:"#00C853", Esecuzione:"#FF6B00", Monitoraggio:"#C800FF" };
// Global Meta (una connessione Nassa per tutto l'agency) 
const NMS_META_KEY = "nms-global-meta";
const loadGlobalMeta  = async () => { try { const r=await window.storage?.get(NMS_META_KEY); if(r?.value) return JSON.parse(r.value); } catch {} try { const v=localStorage.getItem(NMS_META_KEY); return v?JSON.parse(v):null; } catch { return null; } };
const saveGlobalMeta  = async m  => { try { await window.storage?.set(NMS_META_KEY,JSON.stringify(m)); } catch {} try { if(m) localStorage.setItem(NMS_META_KEY,JSON.stringify(m)); else localStorage.removeItem(NMS_META_KEY); } catch {} };

// ─── META & KANBAN CONSTANTS ─────────────────────────────────────────────────
// ─── DEMO / TEMPLATE DATA ───────────────────────────────────────────────────
// Extracted to ./templates/kosmetikalTemplate.js and ./templates/coopRadenzaTemplate.js

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);

// =============================================================================
// SERVICE BOUNDARY: AI GENERATION
// =============================================================================
// Extracted to ./services/aiService.js

// =============================================================================
// SERVICE BOUNDARY: STORAGE + WORKSPACE MIGRATION
// =============================================================================
// Extracted to ./services/storageService.js

function buildCtx(iv) {
  const lines = [
    `AZIENDA: ${iv.nome||"N/A"}`,
    iv.settore && `SETTORE: ${iv.settore}`,
    iv.anno && `FONDAZIONE: ${iv.anno}`,
    iv.sede && `SEDE: ${iv.sede}`,
    iv.sito && `SITO: ${iv.sito}`,
    iv.descrizione && `COSA FA: ${iv.descrizione}`,
    iv.differenziale && `DIFFERENZIALE: ${iv.differenziale}`,
    iv.valori && `VALORI: ${iv.valori}`,
    iv.target && `TARGET: ${iv.target}`,
    iv.b2x && `MODELLO: ${iv.b2x}`,
    iv.mercati && `MERCATI: ${iv.mercati}`,
    iv.prodotti && `PRODOTTI/SERVIZI: ${iv.prodotti}`,
    iv.pricing && `PRICING: ${iv.pricing}`,
    iv.competitor && `COMPETITOR: ${iv.competitor}`,
    iv.diff_competitor && `DIFFERENZIALE VS COMPETITOR: ${iv.diff_competitor}`,
    iv.canali_attuali && `CANALI ATTUALI: ${iv.canali_attuali}`,
    iv.advertising && `ADVERTISING: ${iv.advertising}`,
    iv.obiettivo1 && `OBIETTIVO PRIMARIO: ${iv.obiettivo1}`,
    iv.obiettivo2 && `OBIETTIVO SECONDARIO: ${iv.obiettivo2}`,
    iv.budget && `BUDGET MARKETING: ${iv.budget}`,
    iv.problema && `PROBLEMA PRINCIPALE: ${iv.problema}`,
    iv.cosa_non_funziona && `COSA NON FUNZIONA: ${iv.cosa_non_funziona}`,
    iv.team && `TEAM MARKETING: ${iv.team}`,
    iv.risorse && `RISORSE DISPONIBILI: ${iv.risorse}`,
    iv.origini && `ORIGINI: ${iv.origini}`,
    iv.svolte && `SVOLTE CHIAVE: ${iv.svolte}`,
    iv.valori_maturati && `VALORI MATURATI: ${iv.valori_maturati}`,
    iv.note && `NOTE AGGIUNTIVE: ${iv.note}`,
  ].filter(Boolean).join("\n");
  return lines;
}

// ─── PROMPTS ED ───────────────────────────────────────────────────────────────
const P_ED = {

ped: (c,prev) => `Sei un esperto di content marketing B2B. Genera un PIANO EDITORIALE MENSILE completo in italiano con markdown.
I titoli dei contenuti devono essere CONCRETI e usabili direttamente — non placeholder. Basa tutto sul contesto del progetto.

## Piano Editoriale — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}

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

${prev?`### Note dal Mese Precedente\n${prev.slice(0,300)}`:""}
---
CONTESTO PROGETTO:
${c}`,

monthly_review: c => `Produci un REPORT DI REVISIONE MENSILE strategico in italiano con markdown.

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
CONTESTO: ${c}`,

strategy_update: c => `Sei un consulente di marketing strategico. Analizza le performance e produci un piano di AGGIORNAMENTO STRATEGIA in italiano con markdown.

## Aggiornamento Strategia — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}

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
CONTESTO PROGETTO: ${c}`,

cicli: c => `Sei un consulente di marketing che chiude il ciclo trimestrale. Produci la CHIUSURA DI CICLO e il brief per il prossimo ciclo in italiano con markdown.

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
CONTESTO PROGETTO: ${c}`,
};

// ─── ED COMPONENTS ────────────────────────────────────────────────────────────
// CampagneExecED estratto in modules/editorial/CampaignExecED.jsx

// PerfLogED estratto in modules/editorial/PerformanceLogED.jsx

// ─── CALENDAR VIEW ED ───────────────────────────────────────────────────────
// CalendarSimpleED estratto in modules/editorial/CalendarSimpleED.jsx

// FunnelViewED estratto in modules/editorial/FunnelViewED.jsx


// IdeasBoard estratto in modules/editorial/IdeasBoard.jsx

// EditorialeHome e widget overview estratti in modules/editorial/EditorialeHome.jsx

// ─── COLLABORATORI MODAL estratto in modules/team/CollaboratoriModal.jsx ─

// FeedPreviewGrid estratto in modules/editorial/FeedPreviewGrid.jsx


// ─── LISTA VIEW ───────────────────────────────────────────────────────────────
// ListaView estratto in modules/editorial/ListaView.jsx


// ─── CONTENUTI VIEW ───────────────────────────────────────────────────────────
function ContenutiView({ project, onUpdate, members, onEdit, onAddNew, globalMeta }) {
  const [subView, setSubView] = useState("calendario");

  // Gestisci sub-view state (ex-Pubblica)
  const [filterPiat,     setFilterPiat]     = useState("tutti");
  const [filterStato,    setFilterStato]    = useState("tutti");
  const [filterFunnel,   setFilterFunnel]   = useState("tutti");
  const [filterPilastro, setFilterPilastro] = useState("tutti");
  const [search,         setSearch]         = useState("");
  const [selectedId,     setSelectedId]     = useState(null);
  const [pubPost,        setPubPost]        = useState(null);

  const feedItems = useMemo(() => getEditorialPosts(project), [project]);
  const pilastri  = useMemo(() => [...new Set(feedItems.map(f=>f.pilastro).filter(Boolean))], [feedItems]);
  const statsCounts = useMemo(() => FEED_STATI.reduce((acc,s)=>{ acc[s]=feedItems.filter(f=>f.stato===s).length; return acc; },{}), [feedItems]);

  const filtered = useMemo(() => {
    let result = feedItems;
    if(filterPiat!=="tutti")     result=result.filter(f=>(f.piattaforme||[]).includes(filterPiat));
    if(filterStato!=="tutti")    result=result.filter(f=>f.stato===filterStato);
    if(filterFunnel!=="tutti")   result=result.filter(f=>(f.funnel||"").toUpperCase()===filterFunnel);
    if(filterPilastro!=="tutti") result=result.filter(f=>f.pilastro===filterPilastro);
    if(search.trim())            result=result.filter(f=>(f.titolo||"").toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [feedItems, filterPiat, filterStato, filterFunnel, filterPilastro, search]);

  const upFeed = useCallback((fn) => { onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }, [project, onUpdate]);
  const saveItem = useCallback((item) => { upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).some(f=>f.id===item.id)?(ed.feedItems||[]).map(f=>f.id===item.id?item:f):[...(ed.feedItems||[]),item]})); }, [upFeed]);
  const delItem = useCallback((id) => { upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).filter(f=>f.id!==id)})); setSelectedId(null); }, [upFeed]);

  function goToGestisci(stato){
    setSubView("gestisci");
    if(stato) setFilterStato(stato);
  }

  return(
    <div className="contenuti-wrap">
      {/* SUB-TAB NAV */}
      <div className="contenuti-subnav">
        {CONTENUTI_SUBVIEWS.map(v=>(
          <button key={v.id} className={`contenuti-subtab ${subView===v.id?"active":""}`}
            onClick={()=>setSubView(v.id)}>
            {v.icon} {v.label}
          </button>
        ))}
        <button className="btn-primary sm" style={{marginLeft:"auto"}} onClick={onAddNew}>+ Nuovo post</button>
      </div>

      {/* ── CALENDARIO ── */}
      {subView==="calendario"&&(
        <CalendarSimpleED project={project} onUpdate={onUpdate} onEditPost={onEdit} PostFormModalComponent={PostFormModal} createEmptyPost={emptyFeedItem} getPilastri={extractPilastri}/>
      )}

      {/* ── LISTA ── */}
      {subView==="lista"&&<ListaView feedItems={feedItems} ideeItems={(project.ed?.ideas||[]).filter(i=>i.data)} onEdit={onEdit}/>}

      {/* ── FEED PREVIEW ── */}
      {subView==="feed"&&(
        <FeedPreviewGrid project={project} feedItems={feedItems} onUpdate={onUpdate} onEdit={onEdit}/>
      )}

      {/* ── GESTISCI (ex-Pubblica) ── */}
      {subView==="gestisci"&&(
        <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
          {/* Pipeline strip */}
          <div className="ed-pipeline">
            {STATI_PIPELINE.map(s=>{
              const st=getFeedStatusStyle(s); const n=statsCounts[s]||0; const isActive=filterStato===s;
              return(
                <button key={s} className={`ed-pipe-stage ${isActive?"active":""}`}
                  style={isActive?{background:st.bg,borderColor:st.tx+"60",color:st.tx}:{}}
                  onClick={()=>setFilterStato(isActive?"tutti":s)}>
                  <span>{st.icon}</span><span>{st.label}</span>
                  <span className="ed-pipe-cnt" style={isActive?{background:st.tx,color:"#fff"}:{}}>{n}</span>
                </button>
              );
            })}
            <button className={`ed-pipe-stage ${filterStato==="tutti"?"active":""}`}
              style={filterStato==="tutti"?{background:"var(--ink)",color:"#fff"}:{}}
              onClick={()=>setFilterStato("tutti")}>
              Tutti <span className="ed-pipe-cnt" style={filterStato==="tutti"?{background:"rgba(255,255,255,.25)",color:"#fff"}:{}}>{feedItems.length}</span>
            </button>
          </div>
          {/* Filter bar */}
          <div className="ed-filter-bar">
            <input className="inp ed-search" placeholder="🔍 Cerca post…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <select className="inp ed-filter-sel" value={filterPiat} onChange={e=>setFilterPiat(e.target.value)}>
              <option value="tutti">Tutte le piattaforme</option>
              {FEED_PIATTAFORME.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select className="inp ed-filter-sel" value={filterFunnel} onChange={e=>setFilterFunnel(e.target.value)}>
              <option value="tutti">Tutto il funnel</option>
              {["TOFU","MOFU","BOFU"].map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            {pilastri.length>0&&(
              <select className="inp ed-filter-sel" value={filterPilastro} onChange={e=>setFilterPilastro(e.target.value)}>
                <option value="tutti">Tutti i pilastri</option>
                {pilastri.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            )}
            {(filterPiat!=="tutti"||filterStato!=="tutti"||filterFunnel!=="tutti"||filterPilastro!=="tutti"||search)&&(
              <button className="btn-ghost sm" onClick={()=>{setFilterPiat("tutti");setFilterStato("tutti");setFilterFunnel("tutti");setFilterPilastro("tutti");setSearch("");}}>✕ Reset</button>
            )}
            <span style={{fontSize:11,color:"var(--ink4)",marginLeft:"auto"}}>{filtered.length} post{filtered.length!==feedItems.length?` di ${feedItems.length}`:""}</span>
          </div>
          {/* Grid */}
          <div className="ed-grid-area">
            {filtered.length===0&&(
              <div className="ct-empty" style={{padding:"60px 0"}}>
                {feedItems.length===0?"Nessun post ancora. Clicca \"+ Nuovo post\" per iniziare.":"Nessun post corrisponde ai filtri."}
              </div>
            )}
            <div className="ed-post-grid">
              {filtered.map(item=>(
                <PostGridCard key={item.id} item={item} members={members}
                  isSelected={selectedId===item.id}
                  onClick={()=>setSelectedId(p=>p===item.id?null:item.id)}
                  onEdit={onEdit} onSave={saveItem} onDelete={delItem}/>
              ))}
              <div className="pgc-add" onClick={onAddNew}><div className="pgc-add-icon">+</div><div className="pgc-add-label">Nuovo post</div></div>
            </div>
          </div>
        </div>
      )}

      {pubPost&&(
        <PublishModal post={{...pubPost}} meta={clientMetaForPublish(client, globalMeta)}
          onClose={()=>setPubPost(null)}
          onPublished={()=>{saveItem({...pubPost,stato:"pubblicato"});setPubPost(null);}}/>
      )}
    </div>
  );
}

// ─── EDITORIALE MAIN (Loomly-style) ─────────────────────────────────────────

// CommentThread estratto in modules/editorial/PostFormModal.jsx

// ── Post Grid Card ───────────────────────────────────────────────────────────
const PostGridCard = memo(function PostGridCard({ item, members, isSelected, onClick, onEdit, onSave, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const src = item.immagineBase64 || item.immagineUrl || "";
  const stati = getFeedStatusStyle(item.stato);
  const piats = (item.piattaforme || []).map(id => FEED_PIATTAFORME.find(p => p.id === id)).filter(Boolean);
  const assignedMems = (item.membersAssigned || []).map(id => members.find(m => m.id === id)).filter(Boolean);
  const commentCount = (item.comments || []).length;
  const normalizedStato = normalizeFeedStatus(item.stato);
  const nextStato = getNextFeedStatus(item.stato);

  function advance(e) {
    e.stopPropagation();
    if (nextStato) onSave({ ...item, stato: nextStato });
  }

  return (
    <div className={`pgc-wrap ${isSelected ? "pgc-sel" : ""}`} onClick={onClick}>
      {/* Thumbnail */}
      <div className="pgc-thumb">
        {src
          ? <img src={src} alt="" onError={e => e.target.style.display = "none"} />
          : <div className="pgc-thumb-empty">
              <span style={{ fontSize: 28 }}>{FEED_TIPI_ICON[item.tipo] || "📄"}</span>
              <span style={{ fontSize: 9, color: "var(--ink5)", marginTop: 4 }}>Nessuna immagine</span>
            </div>
        }
        {item.tipo === "reel" && <div className="pgc-media-badge">▶ Reel</div>}
        {item.tipo === "carousel" && <div className="pgc-media-badge">⊞ Carousel</div>}
        {item.tipo === "storia" && <div className="pgc-media-badge">⬜ Storia</div>}
        {/* Hover overlay */}
        <div className="pgc-overlay">
          <button className="pgc-ov-btn" onClick={e => { e.stopPropagation(); onEdit(item); }}>✎ Modifica</button>
          {/* Full status selector — all statuses, not just next */}
          <select
            className="pgc-ov-stato-sel"
            value={item.stato||"bozza"}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); onSave({...item, stato: e.target.value}); }}>
            {FEED_STATI.map(s=>(
              <option key={s} value={s}>{FEED_STATI_STYLE[s]?.icon} {FEED_STATI_STYLE[s]?.label||s}</option>
            ))}
          </select>
          <button className="pgc-ov-btn pgc-del-btn" onClick={e => { e.stopPropagation(); onDelete(item.id); }}>🗑</button>
        </div>
      </div>

      {/* Info */}
      <div className="pgc-info">
        <div className="pgc-title">{item.titolo || "Senza titolo"}</div>
        <div className="pgc-meta">
          <span className="pgc-stato" style={{ background: stati.bg, color: stati.tx }}>
            {stati.icon} {stati.label}
          </span>
          {item.data && <span className="pgc-date">{item.data}</span>}
        </div>
        <div className="pgc-bottom">
          <div className="pgc-piats">
            {piats.map(p => (
              <span key={p.id} className="pgc-piat-dot" style={{ background: p.color }} title={p.label} />
            ))}
          </div>
          <div className="pgc-avatars">
            {assignedMems.slice(0, 3).map(m => (
              <div key={m.id} className="pgc-avatar" style={{ background: m.colore }} title={m.nome}>{m.nome[0]}</div>
            ))}
          </div>
          <button className="pgc-comment-btn" onClick={e => { e.stopPropagation(); setShowComments(v => !v); }}>
            💬 {commentCount > 0 ? commentCount : ""}
          </button>
        </div>
      </div>

      {/* Inline comments */}
      {showComments && (
        <div onClick={e => e.stopPropagation()}>
          <CommentThread post={item} members={members} onSave={onSave} />
        </div>
      )}
    </div>
  );
});

// ── Editoriale Main ──────────────────────────────────────────────────────────
const ED_INNER_VIEWS = [
  { id: "home",       label: "Home",       icon: "🏠" },
  { id: "contenuti",  label: "Contenuti",  icon: "📅" },
  { id: "kanban",     label: "Kanban",     icon: "📋" },
  { id: "publishing", label: "Publishing", icon: "📤" },
  { id: "idee",       label: "Idee",       icon: "💡" },
  { id: "strategia",  label: "Strategia",  icon: "◈" },
  { id: "analisi",    label: "Analisi",    icon: "▤" },
];
const CONTENUTI_SUBVIEWS = [
  { id: "calendario", label: "Calendario", icon: "📅" },
  { id: "lista",      label: "Lista",      icon: "☰"  },
  { id: "feed",       label: "Feed",       icon: "📱" },
  { id: "gestisci",   label: "Gestisci",   icon: "📣" },
];
const ED_PLAN_SECS    = ["ped","campagne_exec"];
const ED_MONITOR_SECS = ["funnel","perf_log","monthly_review","strategy_update","cicli"];

function EditorialeMain({ project, onUpdate, globalMeta, client=null }) {
  const [innerView,  setInnerView]  = useState("home");
  const [editItem,   setEditItem]   = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [pubPost,    setPubPost]    = useState(null);
  const [members,    setMembers]    = useState([]);
  const [activeSec,  setActiveSec]  = useState("ped");
  const [showCollab,     setShowCollab]     = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Load team from project.ed.collaboratori (project-level) or fallback to global
  useEffect(() => {
    const projCollab = project.ed?.collaboratori || [];
    if (projCollab.length > 0) { setMembers(projCollab); }
    else { tpGet(TP_SK_MEMBERS).then(m => setMembers(m || DEFAULT_MEMBERS_NMS)); }
  }, [project.id]);

  const feedItems = getEditorialPosts(project);

  function upFeed(fn) { onUpdate(applyEdUpdate(project, fn)); }
  function saveItem(item) {
    upFeed(ed => ({
      ...ed,
      feedItems: (ed.feedItems || []).some(f => f.id === item.id)
        ? (ed.feedItems || []).map(f => f.id === item.id ? item : f)
        : [...(ed.feedItems || []), item]
    }));
    setEditItem(null);
  }
  function delItem(id) { upFeed(ed => ({ ...ed, feedItems: (ed.feedItems || []).filter(f => f.id !== id) })); setSelectedId(null); }
  function addNew() { setEditItem(emptyFeedItem()); }

  function handleNavigate(view, filterStato) {
    // "kanban" e "publishing" sono tab diretti — non mappare a "contenuti"
    if (view === "kanban" || view === "publishing") { setInnerView(view); return; }
    setInnerView(view==="grid"||view==="calendario"||view==="feed"||view==="gestisci" ? "contenuti" : view);
  }


  const activeSection = SECTIONS_ED.find(s => s.id === activeSec);
  const gc = COLORS_ED[activeSection?.group] || "#10B981";

  return (
    <div className="ed-main">
      {/* TOP NAV */}
      <div className="ed-main-nav">
        <div className="ed-inner-tabs">
          {ED_INNER_VIEWS.map(v => (
            <button key={v.id} className={`ed-inner-tab ${innerView === v.id ? "active" : ""}`}
              onClick={() => setInnerView(v.id)}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
          {(innerView === "pubblica" || innerView === "home") && (
            <button className="btn-primary sm" onClick={addNew}>+ Nuovo post</button>
          )}
          <button className="btn-ghost sm" title="Importa post da CSV" onClick={() => setShowBulkUpload(true)}
            style={{fontSize:10,padding:"4px 8px"}}>
            📥 CSV
          </button>
          <button className="ed-collab-btn" title="Collaboratori" onClick={() => setShowCollab(true)}>
            👥 Team
          </button>
        </div>
      </div>



      {/* FILTER BAR — solo in Pubblica / grid */}


      {/* STRATEGIC CASCADE BANNER */}
      <StrategicCascadeBanner project={project} SvgIconComponent={SvgIcon}/>

      {/* CONTENT AREA */}
      <div className="ed-main-body">

        {/* HOME */}
        {innerView === "home" && (
          <EditorialeHome project={project} onNavigate={handleNavigate} onAddPost={addNew} onEditPost={setEditItem} />
        )}

        {/* CONTENUTI — unifica calendario, lista, feed, gestisci */}
        {innerView === "contenuti" && (
          <ContenutiView project={project} onUpdate={onUpdate} members={members} onEdit={setEditItem} onAddNew={addNew} globalMeta={globalMeta}/>
        )}

        



        {/* IDEE */}
        {innerView === "idee" && <IdeasBoard project={project} onUpdate={onUpdate} PostFormModalComponent={PostFormModal} />}

        {/* KANBAN — pipeline contenuti Idea→Produzione→Semaforo→Approvato→Live */}
        {innerView === "kanban" && (
          <div className="sec-content" style={{flex:1,overflow:"auto"}}>
            <ContentTrackerED project={project} onUpdate={onUpdate} />
          </div>
        )}

        {/* PUBLISHING HUB — caption AI + pubblicazione nativa Meta */}
        {innerView === "publishing" && (
          <div className="sec-content" style={{flex:1,overflow:"auto"}}>
            <PublishingHubED project={project} onUpdate={onUpdate} globalMeta={globalMeta} />
          </div>
        )}

        {/* STRATEGIA */}
        {innerView === "strategia" && (
          <div className="ed-inner-plan">
            <div className="ed-inner-sec-tabs">
              {ED_PLAN_SECS.map(id => {
                const sec = SECTIONS_ED.find(s => s.id === id);
                const filled = project.ed?.sections?.[id]?.content;
                return (
                  <button key={id} className={`sec-tab ${activeSec === id ? "active" : ""} ${filled ? "has" : ""}`}
                    style={activeSec === id ? { color: "#10B981", borderBottomColor: "#10B981" } : {}}
                    onClick={() => setActiveSec(id)}>
                    {filled && <span className="tab-dot" style={{ background: "#10B981" }} />}
                    {sec?.icon} {sec?.label}
                  </button>
                );
              })}
            </div>
            <EdSectionContent key={"strat-" + activeSec} project={project} secId={activeSec} onUpdate={onUpdate} globalMeta={globalMeta} 
          client={client}
        />
          </div>
        )}

        {/* ANALISI */}
        {innerView === "analisi" && (
          <div className="ed-inner-plan">
            <div className="ed-inner-sec-tabs">
              {ED_MONITOR_SECS.map(id => {
                const sec = SECTIONS_ED.find(s => s.id === id);
                const filled = ED_SPECIAL.includes(id) ? true : project.ed?.sections?.[id]?.content;
                return (
                  <button key={id} className={`sec-tab ${activeSec === id ? "active" : ""} ${filled ? "has" : ""}`}
                    style={activeSec === id ? { color: "#8B5CF6", borderBottomColor: "#8B5CF6" } : {}}
                    onClick={() => setActiveSec(id)}>
                    {filled && <span className="tab-dot" style={{ background: "#8B5CF6" }} />}
                    {sec?.icon} {sec?.label}
                  </button>
                );
              })}
            </div>
            <EdSectionContent key={"anal-" + activeSec} project={project} secId={activeSec} onUpdate={onUpdate} globalMeta={globalMeta} 
          client={client}
        />
          </div>
        )}

      </div>

      {/* BULK UPLOAD MODAL */}
      {showBulkUpload && (
        <BulkUploadModal
          project={project}
          onImport={(newItems) => {
            upFeed(ed => ({ ...ed, feedItems: [...(ed.feedItems || []), ...newItems] }));
            setShowBulkUpload(false);
          }}
          onClose={() => setShowBulkUpload(false)}
        />
      )}

      {/* COLLABORATORI MODAL */}
      {showCollab && (
        <CollaboratoriModal
          project={project}
          onUpdate={onUpdate}
          members={members}
          onMembersChange={setMembers}
          onClose={() => setShowCollab(false)} />
      )}

      {/* POST FORM MODAL */}
      {editItem && (
        <PostFormModal item={editItem} members={members} project={project} pilastri={extractPilastri(project)} onSave={saveItem}
          onDelete={feedItems.some(f => f.id === editItem.id) ? delItem : null}
          onClose={() => setEditItem(null)} />
      )}

      {/* PUBLISH MODAL */}
      {pubPost && (
        <PublishModal post={{ ...pubPost }} meta={clientMetaForPublish(client, globalMeta)}
          onClose={() => setPubPost(null)}
          onPublished={() => { saveItem({ ...pubPost, stato: "pubblicato" }); setPubPost(null); }} />
      )}
    </div>
  );

  return (
    <div className="ed-main">
      {/* TOP NAV */}
      <div className="ed-main-nav">
        <div className="ed-inner-tabs">
          {ED_INNER_VIEWS.map(v => (
            <button key={v.id} className={`ed-inner-tab ${innerView === v.id ? "active" : ""}`}
              onClick={() => setInnerView(v.id)}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
        {(innerView === "grid" || innerView === "home") && (
          <button className="btn-primary sm" onClick={addNew}>+ Nuovo post</button>
        )}
      </div>


      {/* FILTER BAR */}

      {/* CONTENT AREA */}
      <div className="ed-main-body">
        {/* HOME VIEW */}
        {innerView === "home" && (
          <EditorialeHome
            project={project}
            onNavigate={handleNavigate}
            onAddPost={addNew}
            onEditPost={setEditItem}
          />
        )}

        {/* IDEE BOARD */}
        {innerView === "idee" && (
          <IdeasBoard project={project} onUpdate={onUpdate} PostFormModalComponent={PostFormModal}/>
        )}




      </div>

      {/* POST FORM MODAL */}
      {editItem && (
        <PostFormModal item={editItem} members={members} project={project} pilastri={extractPilastri(project)} onSave={saveItem}
          onDelete={feedItems.some(f => f.id === editItem.id) ? delItem : null}
          onClose={() => setEditItem(null)} />
      )}

      {/* PUBLISH MODAL */}
      {pubPost && (
        <PublishModal post={{ ...pubPost }} meta={clientMetaForPublish(client, globalMeta)}
          onClose={() => setPubPost(null)}
          onPublished={() => { saveItem({ ...pubPost, stato: "pubblicato" }); setPubPost(null); }} />
      )}
    </div>
  );
}

// ─── EDITORIALE SECTION CONTENT ───────────────────────────────────────────────
const ED_SPECIAL = ["calendario","content_tracker","publishing","perf_log","monthly_review","campagne_exec","funnel"];

function EdSectionContent({project, secId, onUpdate, globalMeta, client=null}){
  const curSec   = SECTIONS_ED.find(s=>s.id===secId);
  const secData  = project.ed?.sections?.[secId];
  const content  = secData?.content||"";
  const versions = secData?.versions||[];
  const gc       = COLORS_ED[curSec?.group]||"#10B981";

  const [generating,setGenerating]=useState(false);
  const [editing,   setEditing]   =useState(false);
  const [editText,  setEditText]  =useState("");
  const [showVer,   setShowVer]   =useState(false);
  const [toast,     setToast]     =useState("");
  const [showExport,setShowExport]=useState(false);

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function upEdSection(text){
    const prev = project.ed||{sections:{}};
    const existing = prev.sections?.[secId]||{};
    const newVersions = text&&existing.content ? [...(existing.versions||[]),{text:existing.content,ts:Date.now()}].slice(-5) : (existing.versions||[]);
    onUpdate({...project, ed:{...prev, sections:{...prev.sections,[secId]:{content:text,versions:newVersions}}}});
  }

  async function generate(){
    if(!P_ED[secId]) return;
    setGenerating(true);
    try {
      const ctx  = buildCtx(project.interview||{});
      const pdmCtx = Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const pdcCtx = Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const fullCtx = ctx + "\n\n## Strategia Marketing:\n" + pdmCtx + "\n\n## Comunicazione:\n" + pdcCtx;
      const prevLog = (project.ed?.perfLogs||[]).slice(-1)[0];
      const text = await callClaude(P_ED[secId](fullCtx, prevLog?.note));
      upEdSection(text);
      showToast("Generato ✓");
    } catch { showToast("Errore — riprova"); }
    setGenerating(false);
  }

  // Special components
  if(secId==="funnel") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>Funnel TOFU / MOFU / BOFU</div></div>
      <div className="sec-content"><FunnelViewED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="feed") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>Feed</div></div>
      <div className="sec-content" style={{padding:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <FeedED project={project} onUpdate={onUpdate} globalMeta={globalMeta} client={client}/>
      </div>
    </div>
  );
  if(secId==="content_tracker") return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><ContentTrackerED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="publishing") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><PublishingHubED project={project} onUpdate={onUpdate} globalMeta={globalMeta} client={client}/></div>
    </div>
  );
  if(secId==="perf_log") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><PerformanceLogED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="monthly_review") return(
    <MonthlyReviewED
      project={project}
      onUpdate={onUpdate}
      sectionMeta={curSec}
      accentColor={gc}
      ExportPanelComponent={ExportPanel}
      renderMarkdown={renderMd}
      client={client}
    />
  );
  if(secId==="strategy_update" || secId==="cicli") return(
    <StrategyUpdateED
      project={project}
      onUpdate={onUpdate}
      secId={secId}
      sectionMeta={curSec}
      accentColor={gc}
      ExportPanelComponent={ExportPanel}
      renderMarkdown={renderMd}
    />
  );
  if(secId==="calendario") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><CalendarSimpleED project={project} onUpdate={onUpdate} onEditPost={setEditItem} PostFormModalComponent={PostFormModal} createEmptyPost={emptyFeedItem} getPilastri={extractPilastri}/></div>
    </div>
  );
  if(secId==="campagne_exec") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><CampagneExecED project={project} onUpdate={onUpdate}/></div>
    </div>
  );

  // AI section: ped (strategy_update and cicli extracted in StrategyUpdateED)
  return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}
      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div>
        <div className="sec-acts">
          {content&&!editing&&<button className="btn-outline sm" onClick={()=>{setEditText(content);setEditing(true);}}>Modifica</button>}
          {content&&versions.length>0&&<button className="btn-ghost sm" onClick={()=>setShowVer(v=>!v)}>{showVer?"Chiudi":"Versioni"}</button>}
          {editing&&<><button className="btn-primary sm" onClick={()=>{upEdSection(editText);setEditing(false);showToast("Salvato ✓");}}>Salva</button><button className="btn-ghost sm" onClick={()=>setEditing(false)}>Annulla</button></>}
          {P_ED[secId]&&<button className="btn-primary sm" onClick={generate} disabled={generating}>{generating?"...":"Genera"}</button>}
          {content&&<div className="exp-wrap"><button className="btn-ghost sm" onClick={()=>setShowExport(e=>!e)}>↓ Esporta</button>{showExport&&<ExportPanel label={curSec?.label||secId} content={content} projectName={project.name||"Progetto"} secId={secId} onClose={()=>setShowExport(false)}/>}</div>}
        </div>
      </div>
      <div className="sec-content">
        {showVer&&versions.map((v,i)=>(
          <div key={i} className="vitem" style={{marginBottom:8}}>
            <div className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</div>
            <div className="vpreview">{v.text.slice(0,100)}…</div>
            <button className="btn-ghost sm" onClick={()=>{upEdSection(v.text);setShowVer(false);showToast("Ripristinato ✓");}}>Ripristina</button>
          </div>
        ))}
        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e=>setEditText(e.target.value)}/>
          : content
            ? <div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/>
            : !generating&&(
                <div className="sec-empty">
                  <div className="se-glyph" style={{color:gc}}>{curSec?.icon}</div>
                  <div className="se-msg">Sezione non ancora generata</div>
                  {P_ED[secId]&&<button className="btn-primary" onClick={generate}>Genera →</button>}
                </div>
              )
        }
        {generating&&<div className="gen-row"><div className="spin"/>Generazione…</div>}
      </div>
    </div>
  );
}
// ─── PROJECT OVERVIEW ─────────────────────────────────────────────────────────
const MS_ST = {
  done:    { dot:"#10B981", bg:"#ECFDF5", tx:"#059669", label:"✓ Fatto" },
  active:  { dot:"#0EA5E9", bg:"#EFF8FF", tx:"#0284C7", label:"In corso" },
  pending: { dot:"#CBD5E1", bg:"#F1F5F9", tx:"#64748B", label:"Pending" },
};
const TASK_TAGS     = ["Strategia","Social","Contenuti","Tecnico","Altro"];
const TASK_PRIORS   = { high:{label:"Alta",color:"#EF4444"}, med:{label:"Media",color:"#F59E0B"}, low:{label:"Bassa",color:"#94A3B8"} };

function computeProjectMeta(project){
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const edF =SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length;
  const totAI=SECTIONS_PDM.length+SECTIONS_PDC.length+SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)).length;
  const pct=Math.round(((pdmF+pdcF+edF)/totAI)*100);
  const tasks=project.tasks||[];
  const open=tasks.filter(t=>!t.done).length;
  const urgent=tasks.filter(t=>!t.done&&t.priority==="high").length;
  const feeds=getEditorialPosts(project).filter(f=>f.data&&!isPostPublished(f)).sort((a,b)=>a.data.localeCompare(b.data));
  const nextPost=feeds[0];
  return {pct,pdmF,pdcF,edF,totAI,open,urgent,nextPost};
}

function getAutoMilestones(project){
  const iv=project.interview||{};
  const hasIV=Object.values(iv).some(v=>v?.trim?.().length>2);
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const pdmPct=pdmF/SECTIONS_PDM.length; const pdcPct=pdcF/SECTIONS_PDC.length;
  const hasPED=!!project.ed?.sections?.ped?.content;
  const feedN=getEditorialPosts(project).length;
  return [
    {id:"a-brief", name:"Brief e analisi",          status:hasIV?"done":"pending",                    auto:true},
    {id:"a-pdm",   name:"Piano di Marketing",        status:pdmPct>0.5?"done":pdmPct>0?"active":"pending", auto:true},
    {id:"a-pdc",   name:"Piano di Comunicazione",    status:pdcPct>0.5?"done":pdcPct>0?"active":"pending", auto:true},
    {id:"a-ped",   name:"Piano Editoriale attivo",   status:hasPED?"done":"pending",                   auto:true},
    {id:"a-feed",  name:"Feed operativo (+3 post)",  status:feedN>=3?"done":feedN>0?"active":"pending", auto:true},
  ];
}

function AIShortcutModal({title,content,onClose}){
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:700}} onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div className="modal-title">{title}</div><button className="btn-ghost sm" onClick={onClose}>✕</button></div>
        <div className="modal-body" style={{maxHeight:"60vh",overflowY:"auto"}}><div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/></div>
        <div className="modal-foot"><button className="btn-ghost sm" onClick={()=>navigator.clipboard?.writeText(content)}>📋 Copia</button><button className="btn-primary sm" onClick={onClose}>Chiudi</button></div>
      </div>
    </div>
  );
}

function MilestoneSection({project,onUpdate}){
  const auto=getAutoMilestones(project);
  const custom=project.milestones||[];
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",date:"",status:"pending"});
  function add(){ if(!form.name) return; onUpdate({...project,milestones:[...custom,{...form,id:uid()}]}); setAdding(false); setForm({name:"",date:"",status:"pending"}); }
  function del(id){ onUpdate({...project,milestones:custom.filter(m=>m.id!==id)}); }
  function cycleStatus(id){ const c={done:"active",active:"pending",pending:"done"}; onUpdate({...project,milestones:custom.map(m=>m.id===id?{...m,status:c[m.status]}:m)}); }
  const all=[...auto,...custom];
  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Milestone di progetto</div><button className="btn-outline sm" onClick={()=>setAdding(true)}>+ Aggiungi</button></div>
      {adding&&(
        <div className="ct-form" style={{marginBottom:10}}>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Milestone *</label><input className="inp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="es. Brand Book v1.0" autoFocus/></div>
            <div className="fg"><label className="lbl">Data target</label><input className="inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Stato</label><select className="inp" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="pending">Pending</option><option value="active">In corso</option><option value="done">Fatto</option></select></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={add} disabled={!form.name}>Aggiungi</button></div>
        </div>
      )}
      <div className="ms-list">
        {all.map(ms=>{
          const st=MS_ST[ms.status]||MS_ST.pending;
          const isCustom=!ms.id?.startsWith("a-");
          return(
            <div key={ms.id} className="ms-row">
              <div className={`ms-dot-el ${isCustom?"ms-dot-click":""}`} style={{background:st.dot}} onClick={isCustom?()=>cycleStatus(ms.id):undefined}/>
              <div className="ms-info-el"><div className="ms-name">{ms.name}</div>{ms.date&&<div className="ms-date">{ms.date}</div>}</div>
              <span className="ms-badge" style={{background:st.bg,color:st.tx}}>{st.label}</span>
              {isCustom&&<button className="ct-del" onClick={()=>del(ms.id)}>×</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectTaskSection({project,onUpdate}){
  const tasks=project.tasks||[];
  const [adding,setAdding]=useState(false);
  const [filter,setFilter]=useState("tutti");
  const [form,setForm]=useState({text:"",priority:"med",tag:"Strategia",assignee:""});
  function addTask(){ if(!form.text) return; onUpdate({...project,tasks:[{...form,id:uid(),done:false,createdAt:Date.now()},...tasks]}); setAdding(false); setForm({text:"",priority:"med",tag:"Strategia",assignee:""}); }
  function toggle(id){ onUpdate({...project,tasks:tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}); }
  function del(id){ onUpdate({...project,tasks:tasks.filter(t=>t.id!==id)}); }
  const shown=filter==="tutti"?tasks:tasks.filter(t=>t.tag===filter);
  const urgent=tasks.filter(t=>!t.done&&t.priority==="high");
  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Task <span style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>({tasks.filter(t=>!t.done).length} aperti{urgent.length>0?` · ${urgent.length} urgenti`:""})</span></div><button className="btn-outline sm" onClick={()=>setAdding(true)}>+ Task</button></div>
      {adding&&(
        <div className="ct-form" style={{marginBottom:10}}>
          <div className="fg"><label className="lbl">Descrizione *</label><input className="inp" value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="es. Sessione input con cliente — Appendice A" autoFocus/></div>
          <div className="fg-row3" style={{marginTop:8}}>
            <div className="fg"><label className="lbl">Priorità</label><select className="inp" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="high">🔴 Alta</option><option value="med">🟡 Media</option><option value="low">⚪ Bassa</option></select></div>
            <div className="fg"><label className="lbl">Categoria</label><select className="inp" value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})}>{TASK_TAGS.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="fg"><label className="lbl">Assegnatario</label><input className="inp" placeholder="es. A · S · T · Luca" value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})}/></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addTask} disabled={!form.text}>Aggiungi</button></div>
        </div>
      )}
      <div className="task-filter-bar">
        {["tutti",...TASK_TAGS].map(f=><button key={f} className={`task-filter-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f==="tutti"?"Tutti":f}</button>)}
      </div>
      {shown.length===0&&<div className="ct-empty">Nessun task{filter!=="tutti"?" in questa categoria":""}.</div>}
      <div className="ov-task-list">
        {shown.map(task=>(
          <div key={task.id} className={`ov-task-row ${task.done?"ov-task-done":""}`}>
            <div className="ov-task-check" onClick={()=>toggle(task.id)}>{task.done?"✓":""}</div>
            <div className="ov-task-prio" style={{background:TASK_PRIORS[task.priority]?.color||"#94A3B8"}}/>
            <div className="ov-task-text">{task.text}</div>
            <span className="ov-task-tag">{task.tag}</span>
            {task.assignee&&<div className="ov-task-who">{task.assignee}</div>}
            <button className="ct-del" onClick={()=>del(task.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentLibrarySection({project,onGoToModule}){
  const [aiModal,setAiModal]=useState(null);
  const [loading,setLoading]=useState(null);
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const hasCS=!!project.pdc?.sections?.copy_strategy?.content;
  const hasBV=!!project.pdc?.sections?.tone_of_voice?.content;
  const hasPED=!!project.ed?.sections?.ped?.content;
  const docs=[
    {id:"pdm",key:"pdm",label:"Piano di Marketing",meta:"Strategia · Target · 7P · Budget · Roadmap",ver:"v1",filled:pdmF/SECTIONS_PDM.length,mod:"pdm"},
    {id:"pdc",key:"pdc",label:"Piano di Comunicazione",meta:"ToV · Message House · Campaign Moments",ver:"v1",filled:pdcF/SECTIONS_PDC.length,mod:"pdc"},
    {id:"cs",key:"copy_strategy",label:"Copy Strategy",meta:"Promessa · Reason Why · Per Persona · Prezzo",ver:"v1",filled:hasCS?1:0,mod:"pdc"},
    {id:"bv",key:"tone_of_voice",label:"Brand Voice",meta:"ToV · Parole guida · Regole operative",ver:"v1",filled:hasBV?1:0,mod:"pdc"},
    {id:"ped",key:"ped",label:"Piano Editoriale",meta:"Pilastri · Calendario mensile · Copy guida",ver:"v1",filled:hasPED?1:0,mod:"ed"},
  ];

  async function summarize(doc){
    const content=doc.mod==="pdm"
      ?Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,300)||""}`).join("\n")
      :doc.mod==="pdc"
      ?Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,300)||""}`).join("\n")
      :project.ed?.sections?.[doc.key]?.content||"";
    if(!content?.trim()) return;
    setLoading(doc.id);
    try {
      const txt=await callClaude(`Riassumi in italiano in modo strutturato i punti chiave di questo documento. Usa bullet points. Sii diretto e sintetico.\n\nDOCUMENTO: ${doc.label}\n\n${content.slice(0,3000)}`);
      setAiModal({title:doc.label,content:txt});
    } catch{}
    setLoading(null);
  }

  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Sistema documentale</div></div>
      <div className="doc-grid-ov">
        {docs.map(doc=>{
          const done=doc.filled>=0.5;
          const partial=doc.filled>0&&doc.filled<0.5;
          return(
            <div key={doc.id} className={`doc-card-ov ${!done&&!partial?"doc-pending":""}`}
              onClick={done||partial?()=>summarize(doc):()=>onGoToModule(doc.mod)}>
              <div className="doc-card-ov-hdr">
                <div className="doc-card-ov-title">{doc.label}</div>
                {(done||partial)&&<span className="doc-ver-badge">{doc.ver}</span>}
              </div>
              <div className="doc-card-ov-meta">{doc.meta}</div>
              {done&&<div className="doc-card-ov-action">{loading===doc.id?"...":"✦ Riassumi →"}</div>}
              {!done&&!partial&&<div className="doc-card-ov-action" style={{color:"var(--ink5)"}}>→ Genera</div>}
              {partial&&<div className="doc-card-ov-action" style={{color:"var(--warn)"}}>In lavorazione</div>}
            </div>
          );
        })}
      </div>
      {aiModal&&<AIShortcutModal title={aiModal.title} content={aiModal.content} onClose={()=>setAiModal(null)}/>}
    </div>
  );
}

function BudgetSection({project,onUpdate}){
  const budget=project.budget||{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:""};
  function upBudget(fn){ onUpdate({...project,budget:{...budget,...fn(budget)}}); }
  function addProdRow(){ upBudget(b=>({...b,produzione:[...b.produzione,{id:uid(),label:"",valore:0}]})); }
  function updateProd(id,k,v){ upBudget(b=>({...b,produzione:b.produzione.map(r=>r.id===id?{...r,[k]:v}:r)})); }
  function delProd(id){ upBudget(b=>({...b,produzione:b.produzione.filter(r=>r.id!==id)})); }
  function setAds(k,v){ upBudget(b=>({...b,ads:{...(b.ads||{}), [k]:parseFloat(v)||0}})); }
  const totProd=(budget.produzione||[]).reduce((s,r)=>s+(parseFloat(r.valore)||0),0);
  const ads=budget.ads||{};
  const totAds=(parseFloat(ads.linkedin)||0)+(parseFloat(ads.google)||0)+(parseFloat(ads.meta)||0)+(parseFloat(ads.altri)||0);
  const totale=totProd+totAds;
  return(
    <div className="budget-wrap">
      <div className="ov-sec-hdr"><div className="ov-sec-title">Retainer & Budget mensile</div></div>
      <div className="budget-grid">
        <div className="budget-col">
          <div className="budget-col-title">Budget produzione</div>
          {(budget.produzione||[]).map(row=>(
            <div key={row.id} className="budget-row">
              <input className="inp budget-inp-label" placeholder="es. Copywriter esterno" value={row.label} onChange={e=>updateProd(row.id,"label",e.target.value)}/>
              <input className="inp budget-inp-val" type="number" placeholder="0" value={row.valore||""} onChange={e=>updateProd(row.id,"valore",e.target.value)}/>
              <span className="budget-eur">€</span>
              <button className="ct-del" onClick={()=>delProd(row.id)}>×</button>
            </div>
          ))}
          <button className="btn-ghost sm" onClick={addProdRow} style={{marginTop:6}}>+ Voce</button>
          <div className="budget-total">Totale produzione: <strong>€ {totProd.toLocaleString("it-IT")}</strong></div>
        </div>
        <div className="budget-col">
          <div className="budget-col-title">Budget Ads mensile</div>
          {[{k:"linkedin",label:"LinkedIn Ads"},{k:"google",label:"Google Ads"},{k:"meta",label:"Meta Ads"},{k:"altri",label:"Altri / Contingency"}].map(a=>(
            <div key={a.k} className="budget-row">
              <span className="budget-label">{a.label}</span>
              <input className="inp budget-inp-val" type="number" placeholder="0" value={ads[a.k]||""} onChange={e=>setAds(a.k,e.target.value)}/>
              <span className="budget-eur">€</span>
            </div>
          ))}
          <div className="budget-total">Totale Ads: <strong>€ {totAds.toLocaleString("it-IT")}</strong></div>
        </div>
      </div>
      <div className="budget-totale">
        <span>Totale mensile (scenario medio)</span>
        <span className="budget-totale-val">€ {totale.toLocaleString("it-IT")}</span>
        <span style={{fontSize:11,color:"var(--ink4)"}}>≈ € {(totale*12).toLocaleString("it-IT")} / anno</span>
      </div>
    </div>
  );
}

function AIShortcutsSection({project}){
  const [modal,setModal]=useState(null);
  const [loading,setLoading]=useState(null);
  const ctx=buildCtx(project.interview||{});
  const pdmCtx=Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
  const pdcCtx=Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
  const fullCtx=`${ctx}\n\n## Piano Marketing:\n${pdmCtx}\n\n## Comunicazione:\n${pdcCtx}`;
  const tasks=(project.tasks||[]).filter(t=>!t.done).slice(0,8).map(t=>`- [${t.priority}] ${t.text}`).join("\n");
  const mts=getAutoMilestones(project).map(m=>`- ${m.name}: ${m.status}`).join("\n");

  async function run(id,prompt){
    setLoading(id);
    try { const t=await callClaude(prompt); setModal({title:SHORTCUTS.find(s=>s.id===id)?.label,content:t}); }
    catch{ setModal({title:"Errore",content:"Errore di generazione. Riprova."}); }
    setLoading(null);
  }

  const SHORTCUTS=[
    {id:"report",   label:"Report mensile",       icon:"📊", prompt:`Genera un report mensile di stato del progetto in italiano con markdown.\n\n## Report Mensile — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}\n\n### Stato Avanzamento\n[usa le milestone qui sotto]\n${mts}\n\n### Task aperti prioritari\n${tasks}\n\n### Next steps (prossime 2 settimane)\n[3-5 azioni concrete]\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"tasks",    label:"Task prossimo sprint",  icon:"📋", prompt:`Suggerisci una lista di task prioritari per il prossimo sprint (2 settimane) di questo progetto in italiano. Formato: ogni task con [PRIORITÀ] tag categoria — assegnatario.\n\nMilestone:\n${mts}\n\nTask aperti attuali:\n${tasks}\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"retainer", label:"Proposta retainer",     icon:"💰", prompt:`Crea una proposta di retainer mensile professionale in italiano per presentarla al cliente. Includi: scenario conservativo, medio, aggressivo con ROI atteso per ciascuno.\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"ped",      label:"PED mese prossimo",     icon:"📅", prompt:`Genera un piano editoriale mensile completo per il mese prossimo in italiano con markdown. Includi: distribuzione pilastri, calendario contenuti (16-20 pezzi), copy guida per i top 3 contenuti.\n\nCONTESTO STRATEGICO: ${fullCtx.slice(0,3000)}`},
  ];

  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">✦ AI Shortcuts</div></div>
      <div className="ai-shortcuts-grid">
        {SHORTCUTS.map(s=>(
          <button key={s.id} className="ai-shortcut-btn" onClick={()=>run(s.id,s.prompt)} disabled={loading===s.id}>
            <span className="ai-sc-icon">{s.icon}</span>
            <span>{loading===s.id?"Generazione…":s.label+" →"}</span>
          </button>
        ))}
      </div>
      {modal&&<AIShortcutModal title={modal.title} content={modal.content} onClose={()=>setModal(null)}/>}
    </div>
  );
}

// ─── PILASTRI SECTION ─────────────────────────────────────────────────────────
const FUNNEL_OPTIONS = ["TOFU","MOFU","BOFU"];
const PILASTRO_PRESET_COLORS = ["#E3001B","#D4A017","#1B5E20","#0D4A78","#145932","#8B5CF6","#F97316","#0EA5E9","#EC4899","#64748B"];

function PilastriSection({ project, onUpdate }){
  const pilastri = project.pilastri || [];
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(null);

  function up(fn){ onUpdate({...project,...fn(project)}); }
  function save(){
    if(!f?.nome?.trim()) return;
    up(p=>({pilastri:(p.pilastri||[]).some(x=>x.id===f.id)
      ?(p.pilastri||[]).map(x=>x.id===f.id?f:x)
      :[...(p.pilastri||[]),f]}));
    setEditing(null); setF(null);
  }
  function del(id){ up(p=>({pilastri:(p.pilastri||[]).filter(x=>x.id!==id)})); }
  function openNew(){ const x={id:uid(),nome:"",colore:PILASTRO_PRESET_COLORS[pilastri.length%PILASTRO_PRESET_COLORS.length],funnel:"MOFU",kpi:""}; setF(x); setEditing("new"); }
  function openEdit(x){ setF({...x}); setEditing(x.id); }

  return(
    <div className="ov-card">
      <div className="ov-card-hdr">
        <div className="ov-card-title">🏷 Pilastri di comunicazione</div>
        {!editing&&<button className="btn-outline sm" onClick={openNew}>+ Aggiungi</button>}
      </div>

      {/* Editor */}
      {editing&&f&&(
        <div className="pil-editor">
          <div className="fg-row" style={{marginBottom:10,alignItems:"flex-end"}}>
            <div className="fg">
              <label className="lbl">Nome pilastro *</label>
              <input className="inp" autoFocus placeholder="es. Coop Promo" value={f.nome} onChange={e=>setF(p=>({...p,nome:e.target.value}))}/>
            </div>
            <div className="fg" style={{maxWidth:110}}>
              <label className="lbl">Funnel</label>
              <select className="inp" value={f.funnel||"MOFU"} onChange={e=>setF(p=>({...p,funnel:e.target.value}))}>
                {FUNNEL_OPTIONS.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Colore</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>
                {PILASTRO_PRESET_COLORS.map(c=>(
                  <div key={c} onClick={()=>setF(p=>({...p,colore:c}))}
                    style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",
                      border:f.colore===c?"3px solid var(--ink)":"2px solid transparent",flexShrink:0}}/>
                ))}
                <input type="color" value={f.colore||"#64748B"} onChange={e=>setF(p=>({...p,colore:e.target.value}))}
                  style={{width:22,height:22,border:"none",borderRadius:"50%",cursor:"pointer",padding:0}}/>
              </div>
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <label className="lbl">Cadenza</label>
            <input className="inp" placeholder="es. 1/sett. · mai adiacente a urgenza" value={f.cadenza||""} onChange={e=>setF(p=>({...p,cadenza:e.target.value}))}/>
          </div>
          <div style={{marginBottom:10}}>
            <label className="lbl">KPI principali</label>
            <input className="inp" placeholder="es. Reach · CTR ADV · Click volantino" value={f.kpi||""} onChange={e=>setF(p=>({...p,kpi:e.target.value}))}/>
          </div>
          <div style={{marginBottom:10}}>
            <label className="lbl"># Hashtag set</label>
            <textarea className="txta" rows={2}
              placeholder="#hashtag1 #hashtag2 #hashtag3 — separati da spazio"
              value={f.hashtags||""} onChange={e=>setF(p=>({...p,hashtags:e.target.value}))}/>
            <div style={{fontSize:9,color:"var(--ink5)",marginTop:2}}>Verranno proposti nel PostFormModal quando selezioni questo pilastro.</div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-ghost sm" onClick={()=>{setEditing(null);setF(null);}}>Annulla</button>
            <button className="btn-primary sm" onClick={save} disabled={!f.nome?.trim()}>Salva pilastro</button>
          </div>
        </div>
      )}

      {/* List */}
      {!editing&&(
        pilastri.length===0
          ?<div style={{fontSize:12,color:"var(--ink5)",fontStyle:"italic",padding:"8px 0"}}>Nessun pilastro definito. Aggiungine uno per usarlo nel dropdown dei post.</div>
          :<div className="pil-list">
            {pilastri.map(x=>(
              <div key={x.id} className="pil-row">
                <div className="pil-dot" style={{background:x.colore||"#94A3B8"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,color:"var(--ink)"}}>{x.nome}</div>
                  <div style={{fontSize:10,color:"var(--ink4)",marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}>
                    {x.funnel&&<span style={{color:{TOFU:"#0EA5E9",MOFU:"#F59E0B",BOFU:"#10B981"}[x.funnel]||"var(--ink4)",fontWeight:700}}>{x.funnel}</span>}
                    {x.kpi&&<span>{x.kpi}</span>}
                    {x.cadenza&&<span style={{color:"var(--ink5)"}}>· {x.cadenza}</span>}
                  </div>
                  {x.hashtags&&<div style={{fontSize:9,color:"var(--ink5)",marginTop:3,fontFamily:"monospace"}}>{x.hashtags.slice(0,60)}{x.hashtags.length>60?"…":""}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button className="btn-ghost sm" onClick={()=>openEdit(x)}>✎</button>
                  <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>del(x.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

// ─── QBR TRACKER ──────────────────────────────────────────────────────────────
const QBR_STATUS = [
  {id:"pianificato",  label:"Pianificato",  color:"#006EFF"},
  {id:"in_corso",     label:"In corso",     color:"#FF6B00"},
  {id:"completato",   label:"Completato",   color:"#00C853"},
];
const KPI_TEMPLATES = [
  "Crescita follower","Engagement rate","Reach mensile","Lead generati",
  "ROAS campagne","CTR medio","Conversioni","Fatturato attribuibile",
];

function emptyQBR(quarter){
  return { id:uid(), quarter, anno:new Date().getFullYear(), stato:"pianificato",
    dataQBR:"", kpiTargets:[], note:"", piano:"", approvato:false, createdAt:Date.now() };
}

function QBRSection({ project, onUpdate }){
  const qbrs = project.qbrs || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [kpiRow, setKpiRow] = useState({nome:"",target:"",reale:""});

  function up(fn){ onUpdate({...project,...fn(project)}); }
  function save(){
    if(!form) return;
    up(p=>({qbrs:(p.qbrs||[]).some(q=>q.id===form.id)
      ?(p.qbrs||[]).map(q=>q.id===form.id?form:q)
      :[...(p.qbrs||[]),form]}));
    setEditing(null); setForm(null);
  }
  function del(id){ up(p=>({qbrs:(p.qbrs||[]).filter(q=>q.id!==id)})); }
  function openNew(){
    const used=new Set((project.qbrs||[]).map(q=>q.quarter));
    const next=[1,2,3,4].find(q=>!used.has(q))||1;
    const f=emptyQBR("Q"+next); setForm(f); setEditing("new");
  }
  function openEdit(q){ setForm({...q}); setEditing(q.id); }
  function addKpi(){
    if(!kpiRow.nome.trim()) return;
    setForm(f=>({...f,kpiTargets:[...(f.kpiTargets||[]),{id:uid(),...kpiRow}]}));
    setKpiRow({nome:"",target:"",reale:""});
  }
  function delKpi(kid){ setForm(f=>({...f,kpiTargets:(f.kpiTargets||[]).filter(k=>k.id!==kid)})); }

  const currentQ = "Q"+Math.ceil((new Date().getMonth()+1)/3);

  return(
    <div className="ov-card">
      <div className="ov-card-hdr">
        <div className="ov-card-title"><SvgIcon name="trending" size={14} color="var(--gold)"/> QBR — Quarterly Business Review</div>
        {!editing&&<button className="btn-outline sm" onClick={openNew}>+ Nuovo QBR</button>}
      </div>

      {editing&&form&&(
        <div className="qbr-editor">
          <div className="fg-row" style={{marginBottom:12}}>
            <div className="fg">
              <label className="lbl">Trimestre</label>
              <select className="inp" value={form.quarter} onChange={e=>setForm(f=>({...f,quarter:e.target.value}))}>
                {["Q1","Q2","Q3","Q4"].map(q=><option key={q}>{q}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="lbl">Anno</label>
              <input className="inp" type="number" value={form.anno} onChange={e=>setForm(f=>({...f,anno:+e.target.value}))}/>
            </div>
            <div className="fg">
              <label className="lbl">Data QBR</label>
              <input className="inp" type="date" value={form.dataQBR||""} onChange={e=>setForm(f=>({...f,dataQBR:e.target.value}))}/>
            </div>
            <div className="fg">
              <label className="lbl">Stato</label>
              <select className="inp" value={form.stato} onChange={e=>setForm(f=>({...f,stato:e.target.value}))}>
                {QBR_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* KPI Targets */}
          <div style={{marginBottom:12}}>
            <label className="lbl" style={{marginBottom:8,display:"block"}}>KPI Target vs Reale</label>
            {(form.kpiTargets||[]).map(k=>(
              <div key={k.id} className="qbr-kpi-row">
                <span className="qbr-kpi-nome">{k.nome}</span>
                <span className="qbr-kpi-val" style={{color:"var(--gold)"}}>Target: {k.target||"—"}</span>
                <span className="qbr-kpi-val" style={{color:k.reale?"var(--ok)":"var(--ink5)"}}>Reale: {k.reale||"—"}</span>
                {k.reale&&k.target&&(
                  <span className="qbr-kpi-delta" style={{color:k.reale>=k.target?"var(--ok)":"var(--err)"}}>
                    {k.reale>=k.target?"✓":"↓"}
                  </span>
                )}
                <button className="ct-del" onClick={()=>delKpi(k.id)}>×</button>
              </div>
            ))}
            <div className="qbr-kpi-add-row">
              <select className="inp" style={{flex:2}} value={kpiRow.nome} onChange={e=>setKpiRow(r=>({...r,nome:e.target.value}))}>
                <option value="">+ KPI…</option>
                {KPI_TEMPLATES.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
              <input className="inp" style={{flex:1}} placeholder="Target" value={kpiRow.target} onChange={e=>setKpiRow(r=>({...r,target:e.target.value}))}/>
              <input className="inp" style={{flex:1}} placeholder="Reale" value={kpiRow.reale} onChange={e=>setKpiRow(r=>({...r,reale:e.target.value}))}/>
              <button className="btn-ghost sm" onClick={addKpi} disabled={!kpiRow.nome}>+</button>
            </div>
          </div>

          <div style={{marginBottom:10}}>
            <label className="lbl">Piano Q+1 (firmato dal cliente)</label>
            <textarea className="txta" rows={3} placeholder="Obiettivi e azioni del trimestre successivo…" value={form.piano||""} onChange={e=>setForm(f=>({...f,piano:e.target.value}))}/>
          </div>
          <div style={{marginBottom:12}}>
            <label className="lbl">Note interne</label>
            <textarea className="txta" rows={2} value={form.note||""} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <label style={{display:"flex",gap:6,alignItems:"center",fontSize:12,fontWeight:600,cursor:"pointer"}}>
              <input type="checkbox" checked={!!form.approvato} onChange={e=>setForm(f=>({...f,approvato:e.target.checked}))} style={{accentColor:"var(--ok)"}}/>
              Piano Q+1 firmato dal cliente
            </label>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn-ghost sm" onClick={()=>{setEditing(null);setForm(null);}}>Annulla</button>
            <button className="btn-primary sm" onClick={save}>Salva QBR</button>
          </div>
        </div>
      )}

      {!editing&&(
        qbrs.length===0
          ?<div style={{fontSize:12,color:"var(--ink5)",fontStyle:"italic",padding:"8px 0"}}>Nessun QBR ancora. Il primo è consigliato dopo 90 giorni di attività.</div>
          :<div className="qbr-list">
            {qbrs.sort((a,b)=>(b.anno-a.anno)||b.quarter.localeCompare(a.quarter)).map(q=>{
              const qs=QBR_STATUS.find(s=>s.id===q.stato)||QBR_STATUS[0];
              const isCurrentQ=q.quarter===currentQ&&q.anno===new Date().getFullYear();
              const kpiMet=(q.kpiTargets||[]).filter(k=>k.reale&&k.target&&k.reale>=k.target).length;
              const kpiTot=(q.kpiTargets||[]).length;
              return(
                <div key={q.id} className="qbr-row" style={isCurrentQ?{borderColor:"var(--gold)",background:"var(--gold-bg)"}:{}}>
                  <div className="qbr-row-quarter">
                    <div style={{fontWeight:800,fontSize:16,color:isCurrentQ?"var(--gold)":"var(--ink)"}}>{q.quarter}</div>
                    <div style={{fontSize:10,color:"var(--ink4)"}}>{q.anno}</div>
                    {isCurrentQ&&<div style={{fontSize:9,color:"var(--gold)",fontWeight:700}}>NOW</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span className="qbr-stato-badge" style={{background:qs.color+"18",color:qs.color,border:"1px solid "+qs.color+"30"}}>{qs.label}</span>
                      {q.dataQBR&&<span style={{fontSize:10,color:"var(--ink4)"}}>📅 {q.dataQBR}</span>}
                      {q.approvato&&<span style={{fontSize:10,color:"var(--ok)",fontWeight:700}}>✓ Piano firmato</span>}
                    </div>
                    {kpiTot>0&&(
                      <div style={{fontSize:11,color:"var(--ink3)"}}>
                        KPI: <b style={{color:kpiMet===kpiTot?"var(--ok)":"var(--warn)"}}>{kpiMet}/{kpiTot}</b> obiettivi raggiunti
                        <div className="qbr-kpi-bar"><div style={{width:(kpiTot?kpiMet/kpiTot*100:0)+"%",background:"var(--ok)"}}/></div>
                      </div>
                    )}
                    {q.piano&&<div style={{fontSize:10,color:"var(--ink4)",marginTop:4,fontStyle:"italic"}}>{q.piano.slice(0,80)}{q.piano.length>80?"…":""}</div>}
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button className="btn-ghost sm" onClick={()=>openEdit(q)}>✎</button>
                    <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>del(q.id)}>×</button>
                  </div>
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
}

// ─── CREATOR / INFLUENCER DATABASE estratto in modules/overview/CreatorDatabase.jsx ─

function ProjectOverview({project,onUpdate,onGoToModule}){
  const m=computeProjectMeta(project);
  const METRICS=[
    {label:"Completamento",value:m.pct+"%",sub:`${m.pdmF+m.pdcF+m.edF}/${m.totAI} sezioni`},
    {label:"Task aperti",   value:m.open,  sub:m.urgent>0?`${m.urgent} urgenti questa settimana`:"Nessun urgente"},
    {label:"Sezioni generate",value:m.pdmF+m.pdcF+m.edF,sub:`PdM ${m.pdmF} · PdC ${m.pdcF} · Ed ${m.edF}`},
    {label:"Prossima pubbl.",value:m.nextPost?.data||"—",sub:m.nextPost?.titolo?.slice(0,24)||"Nessun post pianificato"},
  ];
  return(
    <div className="ov-wrap">
      {/* METRICS */}
      <div className="ov-metrics">
        {METRICS.map((c,i)=>(
          <div key={i} className="ov-metric-card">
            <div className="ov-metric-label">{c.label}</div>
            <div className="ov-metric-value">{c.value}</div>
            <div className="ov-metric-sub">{c.sub}</div>
          </div>
        ))}
      </div>
      {/* TWO COL */}
      <div className="ov-two-col">
        <div className="ov-left">
          <div className="ov-card"><MilestoneSection project={project} onUpdate={onUpdate}/></div>
          <div className="ov-card"><ProjectTaskSection project={project} onUpdate={onUpdate}/></div>
        </div>
        <div className="ov-right">
          <div className="ov-card"><DocumentLibrarySection project={project} onGoToModule={onGoToModule}/></div>
          <div className="ov-card"><AIShortcutsSection project={project}/></div>
        </div>
      </div>
      {/* PILASTRI */}
      <PilastriSection project={project} onUpdate={onUpdate}/>
      {/* QBR TRACKER */}
      <QBRSection project={project} onUpdate={onUpdate}/>
      {/* CREATOR DATABASE */}
      <CreatorDatabase project={project} onUpdate={onUpdate}/>
      {/* BUDGET */}
      <div className="ov-card ov-card-full"><BudgetSection project={project} onUpdate={onUpdate}/></div>
    </div>
  );
}

// ─── CLIENT SETTINGS VIEW ─────────────────────────────────────────────────────
function Toggle({checked, onChange}){
  return <div className={`toggle ${checked?"on":""}`} onClick={()=>onChange(!checked)}><div className="toggle-knob"/></div>;
}


// ── Per-client Meta token adapter ─────────────────────────────────────────────
// Converts client.meta (our storage format) → meta prop expected by PublishModal
// client.meta: { igUserId, igToken, fbPageId, fbToken, nomePagina, allPages }
// PublishModal: { ig:{userId,token}, fb:{pageId,token}, allPages, nome }
function clientMetaForPublish(client, globalMeta) {
  const cm = client?.meta;
  if (cm?.fbPageId || cm?.igUserId) {
    return {
      ig:       { userId: cm.igUserId || "", token: cm.igToken || "" },
      fb:       { pageId: cm.fbPageId || "", token: cm.fbToken || "" },
      allPages: cm.allPages || [],
      nome:     cm.nomePagina || client?.nome || "",
    };
  }
  return globalMeta || null; // fallback to global if client not connected
}


// ─── CLIENT HELPERS (used by ClientSettingsView) ─────────────────────────────
const PACCHETTI = [
  {id:"starter",      emoji:"🌱", label:"Starter",      price:490,   desc:"15h/mese · social base"},
  {id:"essential",    emoji:"🥈", label:"Essential",    price:790,   desc:"28h/mese · piano editoriale"},
  {id:"professional", emoji:"🚀", label:"Professional", price:1200,  desc:"45h/mese · strategia + editoriale"},
  {id:"premium",      emoji:"💎", label:"Premium",      price:1800,  desc:"70h/mese · premium + ADV"},
  {id:"full-service", emoji:"🏆", label:"Full Service", price:2800,  desc:"120h/mese · full service"},
];

function clientSlug(nome){
  return (nome||"").toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g,"")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

function emptyClient(){
  return {
    id: Math.random().toString(36).slice(2,9),
    nome: "Nuovo Cliente", settore: "", sito: "", referente: "", email: "", telefono: "",
    note: "", pacchetto: "professional", dataInizio: "",
    social: {ig:"",fb:"",linkedin:"",tiktok:"",sito:""},
    meta: {igUserId:"",igToken:"",fbPageId:"",fbToken:"",nomePagina:"",allPages:[]},
    portal: {pin:"",mostraFeed:true,mostraPipeline:true,mostraInsights:true},
    projectIds: [],
    createdAt: Date.now(),
  };
}

function ClientSettingsView({ client, globalMeta, projects, onUpdate, onAddProject, onSelectProject, onClose }){
  const [tab,   setTab]   = useState("anagrafica");
  const [f,     setF]     = useState({...client});
  const [copied,setCopied]= useState(false);

  function set(k,v){ setF(p=>({...p,[k]:v})); }
  function setSocial(k,v){ setF(p=>({...p,social:{...p.social,[k]:v}})); }
  function setPortal(k,v){ setF(p=>({...p,portal:{...p.portal,[k]:v}})); }
  function setMeta(m){ setF(p=>({...p,meta:m})); }
  function save(){ onUpdate(ensureClientToken({...f})); }

  const clientProjects = projects.filter(p=>p.clientId===client.id);
  const slug = clientSlug(client.nome);
  const portalUrl = f.clientToken ? buildClientUrl(f.id, f.clientToken) : null;
  const pacchettoObj = PACCHETTI.find(p=>p.id===f.pacchetto)||PACCHETTI[2];

  // Meta page selection from global BM
  const allPages = globalMeta?.allPages||[];
  const clientPages = f.meta?.allPages?.length ? f.meta.allPages : allPages; // per-client first

  function selectMetaPage(pageId, tipo){
    const pg = clientPages.find(p=>p.id===pageId) || allPages.find(p=>p.id===pageId);
    if(!pg) return;
    if(tipo==="ig"){
      setMeta({...(f.meta||{}), igUserId:pg.igId||"", igToken:pg.token, nomePagina:pg.nome});
    } else {
      setMeta({...(f.meta||{}), fbPageId:pg.id, fbToken:pg.token, nomePagina:pg.nome});
    }
    // Auto-save so changes persist immediately
    setTimeout(()=>{ onUpdate({...f, meta:{...f.meta}}); }, 100);
  }

  const TABS = [{id:"anagrafica",label:"📋 Anagrafica"},{id:"social",label:"📱 Social & Meta"},{id:"portale",label:"🔗 Portale"},{id:"progetti",label:"📂 Progetti"}];

  return(
    <div className="cs-wrap">
      <div className="cs-header">
        <div className="cs-title">
          <div className="cs-avatar">{f.nome[0]||"?"}</div>
          <div>
            <div className="cs-nome">{f.nome}</div>
            <div className="cs-sub">{pacchettoObj.emoji} {pacchettoObj.label} · {clientProjects.length} progett{clientProjects.length!==1?"i":"o"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-primary sm" onClick={save}>Salva</button>
          <button className="btn-ghost sm" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="cs-tabs">
        {TABS.map(t=><button key={t.id} className={`cs-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      <div className="cs-body">

        {/* ── ANAGRAFICA ── */}
        {tab==="anagrafica"&&(
          <div className="cs-card">
            <div className="cs-card-title">📋 Informazioni cliente</div>
            <div className="fg-row">
              <div className="fg"><label className="lbl">Nome *</label>
<input className="inp" value={f.nome} onChange={e=>set("nome",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Referente</label><input className="inp" placeholder="Nome cognome" value={f.referente} onChange={e=>set("referente",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="email@cliente.it" value={f.email} onChange={e=>set("email",e.target.value)}/></div>
            </div>
            <div className="fg-row" style={{marginTop:10}}>
              <div className="fg"><label className="lbl">Settore</label><input className="inp" placeholder="es. Food & Beverage" value={f.settore} onChange={e=>set("settore",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Pacchetto</label>
                <select className="inp" value={f.pacchetto} onChange={e=>set("pacchetto",e.target.value)}>
                  {PACCHETTI.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.label} — €{p.price}/mese · {p.desc}</option>)}
                </select>
              </div>
              <div className="fg"><label className="lbl">Data inizio</label><input className="inp" type="date" value={f.dataInizio} onChange={e=>set("dataInizio",e.target.value)}/></div>
            </div>
          </div>
        )}

        {/* ── SOCIAL & META ── */}
        {tab==="social"&&(<>
          <div className="cs-card">
            <div className="cs-card-title">📱 Account social del cliente <span style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>— usati per le pubblicazioni</span></div>
            {[
              {k:"ig",   label:"Instagram", color:"#E1306C", icon:"IG", ph:"@username o URL profilo"},
              {k:"fb",   label:"Facebook",  color:"#1877F2", icon:"FB", ph:"URL pagina o @username"},
              {k:"linkedin",label:"LinkedIn",color:"#0A66C2",icon:"LI", ph:"URL profilo o pagina"},
            ].map(s=>(
              <div key={s.k} className="social-row">
                <span className="social-badge" style={{background:s.color}}>{s.icon}</span>
                <span className="social-label">{s.label}</span>
                <input className="inp" placeholder={s.ph} value={f.social[s.k]||""} onChange={e=>setSocial(s.k,e.target.value)}/>
              </div>
            ))}
            {[
              {k:"tiktok",label:"TikTok",color:"#111",icon:"TK",ph:"@username o URL"},
              {k:"sito",  label:"Sito web",color:"#64748B",icon:"🌐",ph:"es. nassastudio.it"},
            ].map(s=>(
              <div key={s.k} className="social-row">
                <span className="social-badge" style={{background:s.color,fontSize:s.k==="sito"?12:9}}>{s.icon}</span>
                <span className="social-label">{s.label}</span>
                <input className="inp" placeholder={s.ph} value={f.social[s.k]||""} onChange={e=>setSocial(s.k,e.target.value)}/>
                {s.k==="sito"&&f.social.sito&&<a href={"https://"+f.social.sito.replace(/^https?:\/\//,"")} target="_blank" rel="noreferrer" className="btn-ghost sm" style={{flexShrink:0}}>Apri ↗</a>}
              </div>
            ))}
          </div>

          <div className="cs-card">
            <div className="cs-card-title">🔗 Connetti Meta — {f.nome||"questo cliente"}</div>
            <div style={{fontSize:11,color:"var(--ink4)",marginBottom:12}}>
              Ogni cliente usa la propria pagina. Connetti il tuo account Nassa per vedere le pagine disponibili, poi seleziona quella di questo cliente.
            </div>

            {/* Pages loaded from global BM token — no per-client OAuth needed */}
            {clientPages.length > 0 ? (
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:"8px 12px"}}>
                <span style={{fontSize:16}}>✅</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#166534"}}>{clientPages.length} pagine disponibili</div>
                  <div style={{fontSize:11,color:"#16A34A"}}>Caricate dal token Business Manager della sidebar. Seleziona la pagina di questo cliente qui sotto.</div>
                </div>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:8,padding:"8px 12px"}}>
                <span style={{fontSize:16}}>⚠️</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#92400E"}}>Nessuna pagina caricata</div>
                  <div style={{fontSize:11,color:"#B45309"}}>Collega prima il token Business Manager dalla sidebar (in basso a sinistra).</div>
                </div>
              </div>
            )}

            {/* Step 2 — Card picker (nassa-gestione style) */}
            {clientPages.length>0&&!f.meta?.fbPageId&&(
              <div className="meta-page-picker">
                <div className="meta-page-picker-hdr">
                  <span style={{fontWeight:700,color:"#fff"}}>Scegli la pagina per <em>{f.nome||"questo cliente"}</em></span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Seleziona pagina Facebook + account Instagram</span>
                </div>
                <div className="meta-page-picker-list">
                  {clientPages.map(page=>{
                    const igAcc = page.igId ? {id:page.igId, name:page.nome} : null;
                    return(
                      <button key={page.id} className="meta-page-row"
                        onClick={()=>{
                          const u={...(f.meta||{}),
                            fbPageId:page.id, fbToken:page.token, nomePagina:page.nome,
                            igUserId:page.igId||"", igToken:page.igId?page.token:"",
                          };
                          setMeta(u);
                          setTimeout(()=>onUpdate({...f,meta:u}),50);
                        }}>
                        <div className="meta-page-avatar">{(page.nome||"P")[0]}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{page.nome}</div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            <span className="meta-tag-fb">📘 Facebook</span>
                            {page.igId
                              ?<span className="meta-tag-ig">📸 Instagram</span>
                              :<span className="meta-tag-none">Nessun IG collegato</span>
                            }
                          </div>
                        </div>
                        <span className="meta-page-sel-btn">Seleziona →</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Connected status */}
            {f.meta?.fbPageId&&(
              <div className="meta-platforms-grid">
                <div className="meta-plat-card" style={{borderColor:f.meta?.igUserId?"#10B981":"#E2E8F0"}}>
                  <div className="meta-plat-hdr" style={{color:"#E1306C"}}>
                    <span className="social-badge" style={{background:"#E1306C"}}>IG</span>
                    Instagram {f.meta?.igUserId&&<span className="meta-conn-badge">✓ Connesso</span>}
                  </div>
                  {f.meta?.igUserId
                    ?<><div className="meta-plat-val">@{f.meta.nomePagina}</div></>
                    :<div style={{fontSize:11,color:"#F59E0B"}}>⚠️ Nessun account IG Business collegato a questa pagina</div>
                  }
                </div>
                <div className="meta-plat-card" style={{borderColor:"#10B981"}}>
                  <div className="meta-plat-hdr" style={{color:"#1877F2"}}>
                    <span className="social-badge" style={{background:"#1877F2"}}>FB</span>
                    Facebook <span className="meta-conn-badge">✓ Connesso</span>
                  </div>
                  <div className="meta-plat-val">{f.meta.nomePagina}</div>
                  <button className="btn-ghost sm" style={{marginTop:6}} onClick={()=>{
                    const u={...(f.meta||{}),fbPageId:"",fbToken:"",igUserId:"",igToken:"",nomePagina:""};
                    setMeta(u);
                    setTimeout(()=>onUpdate({...f,meta:u}),50);
                  }}>🔄 Cambia pagina</button>
                </div>
              </div>
            )}

            {!clientPages.length&&(
              <div style={{fontSize:11,color:"var(--ink4)",padding:"8px 0"}}>
                ℹ️ Dopo aver connesso l'account, seleziona la pagina specifica per {f.nome||"questo cliente"}.
              </div>
            )}
            <div className="meta-warn-box" style={{marginTop:10}}>
              🔒 I token salvati sono personali e non vengono mai condivisi tra clienti diversi.
              Il token scade dopo 60 giorni — riconnetti periodicamente.
            </div>
          </div>
        </>)}

        {/* ── PORTALE ── */}
        {tab==="portale"&&(
          <div className="cs-card">
            <div className="cs-card-title">🔗 Portale cliente</div>
            {!portalUrl ? (
              <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 16px",marginBottom:12}}>
                <div style={{fontSize:13,color:"#374151",marginBottom:8}}>🔒 Link sicuro non ancora generato per questo cliente.</div>
                <button className="btn-primary sm" onClick={()=>{ const updated=ensureClientToken({...f}); setF(updated); onUpdate(updated); }}>
                  🔗 Genera link sicuro
                </button>
              </div>
            ) : (
              <div className="portal-url-row">
                <div className="portal-url" style={{fontSize:11,wordBreak:"break-all"}}>{portalUrl}</div>
                <button className="btn-ghost sm" onClick={()=>{navigator.clipboard?.writeText(portalUrl);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
                  {copied?"✓ Copiato":"🔗 Copia link"}
                </button>
                <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>{
                  if(!window.confirm("Rigenerare il link? Il vecchio link smetterà di funzionare.")) return;
                  const updated={...f,clientToken:null};
                  const fresh=ensureClientToken(updated);
                  setF(fresh); onUpdate(fresh);
                }} title="Rigenera token">🔄</button>
              </div>
            )}
            <div className="portal-toggles">
              <div className="portal-toggle-row">
                <div><div style={{fontWeight:700,fontSize:13}}>Mostra Feed</div><div style={{fontSize:11,color:"var(--ink4)"}}>Il cliente può vedere e approvare i post del feed</div></div>
                <Toggle checked={f.portal.mostraFeed} onChange={v=>setPortal("mostraFeed",v)}/>
              </div>
              <div className="portal-toggle-row">
                <div><div style={{fontWeight:700,fontSize:13}}>Mostra Pipeline (Kanban)</div><div style={{fontSize:11,color:"var(--ink4)"}}>Il cliente può vedere lo stato dei contenuti in produzione</div></div>
                <Toggle checked={f.portal.mostraPipeline} onChange={v=>setPortal("mostraPipeline",v)}/>
              </div>
              <div className="portal-toggle-row">
                <div><div style={{fontWeight:700,fontSize:13}}>Mostra Meta Insights</div><div style={{fontSize:11,color:"var(--ink4)"}}>Il cliente vede le statistiche Facebook della sua pagina</div></div>
                <Toggle checked={f.portal?.mostraInsights??true} onChange={v=>setPortal("mostraInsights",v)}/>
              </div>
            </div>
            <div style={{marginTop:16}}>
              <label className="lbl">PIN cliente (opzionale)</label>
              <input className="inp" type="password" placeholder="••••••••" style={{maxWidth:200}} value={f.portal.pin} onChange={e=>setPortal("pin",e.target.value)}/>
              <div style={{fontSize:10,color:"var(--ink4)",marginTop:4}}>Protegge il link cliente</div>
            </div>
          </div>
        )}

        {/* ── PROGETTI ── */}
        {tab==="progetti"&&(
          <div className="cs-card">
            <div className="cs-card-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>📂 Progetti ({clientProjects.length})</span>
              <button className="btn-primary sm" onClick={()=>onAddProject(client.id)}>+ Nuovo progetto</button>
            </div>
            {clientProjects.length===0&&<div className="ct-empty">Nessun progetto. Crea il primo progetto per questo cliente.</div>}
            {clientProjects.map(proj=>{
              const pdmF=SECTIONS_PDM.filter(s=>proj.pdm?.sections?.[s.id]?.content).length;
              const pdcF=SECTIONS_PDC.filter(s=>proj.pdc?.sections?.[s.id]?.content).length;
              const tot=SECTIONS_PDM.length+SECTIONS_PDC.length;
              const pct=Math.round(((pdmF+pdcF)/tot)*100);
              return(
                <div key={proj.id} className="cs-proj-row" onClick={()=>onSelectProject(proj.id)}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{proj.name}</div>
                    <div style={{fontSize:10,color:"var(--ink4)",marginTop:2}}>{new Date(proj.createdAt).toLocaleDateString("it-IT")}</div>
                    <div className="dc-bar" style={{marginTop:6,width:180}}><div className="dc-fill" style={{width:pct+"%"}}/></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--gold)"}}>{pct}%</div>
                    <div style={{fontSize:10,color:"var(--ink4)"}}>{pdmF+pdcF}/{tot} sez.</div>
                  </div>
                  <div style={{color:"var(--gold)",fontSize:16}}>→</div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── CLIENT PORTAL PREVIEW ────────────────────────────────────────────────────
// ─── PORTAL COMMENT BOX ───────────────────────────────────────────────────────
function PortalCommentBox({ item, clientProjects, onUpdateProject }){
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const existing = item.clientComment;

  function saveComment(){
    if(!text.trim()) return;
    clientProjects.forEach(proj=>{
      const fi=proj.ed?.feedItems?.find(f=>f.id===item.id);
      if(fi) onUpdateProject({...proj,ed:{...proj.ed,
        feedItems:proj.ed.feedItems.map(f=>f.id===item.id?{...f,clientComment:text.trim(),clientCommentAt:new Date().toISOString()}:f)
      }});
    });
    setSaved(true); setOpen(false);
    setTimeout(()=>setSaved(false),3000);
  }

  return(
    <div style={{marginTop:8}}>
      {existing&&!open&&(
        <div className="portal-comment-existing">
          <span style={{fontSize:10,color:"var(--ink4)",fontWeight:700}}>💬 Tuo commento:</span>
          <span style={{fontSize:11,color:"var(--ink3)",marginLeft:6}}>{existing}</span>
          <button className="portal-comment-edit" onClick={()=>{setText(existing);setOpen(true);}}>modifica</button>
        </div>
      )}
      {saved&&<div style={{fontSize:10,color:"var(--ok)",marginTop:4}}>✓ Commento salvato</div>}
      {!open&&(
        <button className="portal-comment-btn" onClick={()=>{setText(existing||"");setOpen(true);}}>
          {existing?"✎ Modifica commento":"💬 Aggiungi commento"}
        </button>
      )}
      {open&&(
        <div className="portal-comment-form">
          <textarea className="portal-comment-textarea" rows={2} autoFocus
            placeholder="Es: Ok ma cambia la CTA con 'Scopri in negozio' — rimuovi il prezzo dalla caption…"
            value={text} onChange={e=>setText(e.target.value)}/>
          <div style={{display:"flex",gap:6,marginTop:6}}>
            <button className="btn-primary sm" onClick={saveComment} disabled={!text.trim()}>Salva commento</button>
            <button className="btn-ghost sm" onClick={()=>setOpen(false)}>Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLIENT FUNNEL VIEW ───────────────────────────────────────────────────────
function ClientFunnelView({ project }){
  const feedItems = getEditorialPosts(project);
  const tot = feedItems.length;

  // Real distribution from feedItems
  const byStage = { TOFU:0, MOFU:0, BOFU:0 };
  feedItems.forEach(f=>{ const s=(f.funnel||"").toUpperCase(); if(byStage[s]!==undefined) byStage[s]++; });
  const pct = stage => tot>0?Math.round(byStage[stage]/tot*100):0;

  // Targets from project (editable) or defaults
  const targets = project.ed?.funnelTargets || {TOFU:32,MOFU:36,BOFU:32};

  // Pillar breakdown
  const pilastri = {};
  feedItems.forEach(f=>{
    if(!f.pilastro) return;
    if(!pilastri[f.pilastro]) pilastri[f.pilastro]={ n:0, funnel:f.funnel||"TOFU" };
    pilastri[f.pilastro].n++;
  });
  const pilastroList = Object.entries(pilastri).sort((a,b)=>b[1].n-a[1].n);

  // Rules from AI sections (if available)
  const funnelStrategy  = project.pdm?.sections?.funnel_strategy?.content  || "";
  const funnelComm      = project.pdc?.sections?.funnel_comunicativo?.content || "";

  const STAGE_STYLE = {
    TOFU:{ bg:"#E6F1FB", border:"#B5D4F4", tx:"#042C53", icon:"▲", bar:"#185FA5" },
    MOFU:{ bg:"#FAEEDA", border:"#FAC775", tx:"#412402", icon:"◆", bar:"#854F0B" },
    BOFU:{ bg:"#FCEBEB", border:"#F7C1C1", tx:"#501313", icon:"▼", bar:"#A32D2D" },
  };
  const FUNNEL_TAG_STYLE = {
    TOFU:"background:#E6F1FB;color:#042C53",
    MOFU:"background:#FAEEDA;color:#412402",
    BOFU:"background:#FCEBEB;color:#501313",
  };

  function funnelOfPilastro(name){
    const f=feedItems.find(i=>i.pilastro===name)?.funnel||"TOFU";
    return f.toUpperCase();
  }

  return(
    <div className="cfv-wrap">

      {/* HEADER */}
      <div className="cfv-header">
        <div>
          <div className="cfv-title">Strategia Funnel — {project.interview?.nome||project.name}</div>
          <div className="cfv-sub">Distribuzione contenuti per livello funnel e pilastro editoriale</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["TOFU","MOFU","BOFU"].map(s=>(
            <div key={s} className="cfv-mix-pill" style={{background:STAGE_STYLE[s].bg,color:STAGE_STYLE[s].tx}}>
              {s} {pct(s)}%
            </div>
          ))}
        </div>
      </div>

      {/* FUNNEL STAGES */}
      <div className="cfv-stages">
        {["TOFU","MOFU","BOFU"].map(stage=>{
          const st=STAGE_STYLE[stage];
          const n=byStage[stage];
          const p=pct(stage);
          const tgt=targets[stage]||0;
          const delta=p-tgt;
          const stagePilastri=pilastroList.filter(([,v])=>funnelOfPilastro(Object.keys(pilastri).find(k=>pilastri[k]===v)||"")==="stage"||true)
            .filter(([name])=>(feedItems.find(i=>i.pilastro===name)?.funnel||"").toUpperCase()===stage);
          return(
            <div key={stage} className="cfv-stage" style={{background:st.bg,border:`1px solid ${st.border}`,color:st.tx}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:22}}>{st.icon}</div>
                  <div style={{fontSize:14,fontWeight:600,marginTop:4}}>{stage}</div>
                  <div style={{fontSize:11,opacity:.8,lineHeight:1.4,marginTop:2}}>
                    {{TOFU:"Awareness — raggiungo nuove persone, costruisco identità brand",
                      MOFU:"Consideration — costruisco fiducia, educo sul prodotto",
                      BOFU:"Conversion — porto alla decisione d'acquisto"}[stage]}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:28,fontWeight:500,lineHeight:1}}>{p}%</div>
                  <div style={{fontSize:11,opacity:.7,marginTop:2}}>{n} post su {tot}</div>
                  {tot>0&&<div style={{fontSize:10,marginTop:4,opacity:.7}}>target {tgt}% {delta>0?`(+${delta}pp)`:`(${delta}pp)`}</div>}
                </div>
              </div>
              <div className="cfv-bar-bg"><div className="cfv-bar-fill" style={{width:p+"%",background:st.bar}}/></div>
              {stagePilastri.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
                  {stagePilastri.map(([name])=><span key={name} className="cfv-pill">{name}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PILLAR TABLE */}
      {pilastroList.length>0&&(
        <div className="cfv-table-wrap">
          <table className="cfv-table">
            <thead>
              <tr>
                <th>Pilastro</th><th>Funnel</th><th>Post</th>
                <th>% sul piano</th><th>Cadenza</th><th>KPI principale</th>
              </tr>
            </thead>
            <tbody>
              {pilastroList.map(([name,{n}])=>{
                const funnel=(feedItems.find(i=>i.pilastro===name)?.funnel||"TOFU").toUpperCase();
                const projPilastro=(project.pilastri||[]).find(p=>p.nome===name);
                const color=getPillarColor(name, project);
                const cadenza=projPilastro?.cadenza||"—";
                const kpi=projPilastro?.kpi||{"CoopPromo":"Click · CTR ADV","FiorFiore":"Salvataggi · Views","TerraTavola":"Salvataggi · Condivisioni","Istituzionale":"Reach · Condivisioni","CoopSocial":"Reaction · Interazioni","Coop Promo":"Click · CTR ADV","Fior Fiore":"Salvataggi · Views","Terra/Tavola":"Salvataggi · Condivisioni","Coop Social":"Reaction · Interazioni"}[name]||"Reach · Engagement";
                const p=tot?Math.round(n/tot*100):0;
                return(
                  <tr key={name}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span className="cfv-dot" style={{background:color}}/>
                        <span style={{fontWeight:600,fontSize:13}}>{name}</span>
                      </div>
                    </td>
                    <td><span className="cfv-tag" style={{...(()=>{const[bg,tx]={"TOFU":["#E6F1FB","#042C53"],"MOFU":["#FAEEDA","#412402"],"BOFU":["#FCEBEB","#501313"]}[funnel]||["#F1F5F9","#64748B"];return{background:bg,color:tx};})()}}>{funnel}</span></td>
                    <td style={{fontSize:13,fontWeight:600}}>{n}</td>
                    <td>
                      <div className="cfv-mini-bar"><div style={{width:p+"%",height:"100%",background:color,borderRadius:3}}/></div>
                      <div style={{fontSize:10,color:"#64748B"}}>{p}%</div>
                    </td>
                    <td style={{fontSize:11,color:"var(--ink4)"}}>{cadenza}</td>
                    <td><span className="cfv-kpi">{kpi}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* STRATEGY NOTES from AI sections */}
      {(funnelStrategy||funnelComm)&&(
        <div className="cfv-notes">
          {funnelStrategy&&(
            <div className="cfv-note-card">
              <div className="cfv-note-title">📊 Note strategiche — Funnel Strategy</div>
              <div className="cfv-note-body" dangerouslySetInnerHTML={{__html:renderMd(funnelStrategy.slice(0,800)+(funnelStrategy.length>800?"…":""))}}/>
            </div>
          )}
          {funnelComm&&(
            <div className="cfv-note-card">
              <div className="cfv-note-title">📣 Note comunicative — Funnel Comunicativo</div>
              <div className="cfv-note-body" dangerouslySetInnerHTML={{__html:renderMd(funnelComm.slice(0,800)+(funnelComm.length>800?"…":""))}}/>
            </div>
          )}
        </div>
      )}

      {/* MIX BAR */}
      <div className="cfv-mix-bar-wrap">
        <span style={{fontSize:11,fontWeight:600,color:"#64748B",whiteSpace:"nowrap"}}>Mix funnel</span>
        <div className="cfv-mix-bar">
          {["TOFU","MOFU","BOFU"].map(s=>(
            <div key={s} className="cfv-mix-seg" style={{width:pct(s)+"%",background:STAGE_STYLE[s].bar}}>
              {pct(s)>8?pct(s)+"%":""}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:12}}>
          {["TOFU","MOFU","BOFU"].map(s=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_STYLE[s].bar}}/>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function ClientPortalPreview({ client, projects, onBack, onUpdateProject }){
  const [portalTab, setPortalTab] = useState("approva"); // approva | funnel
  const clientProjects = projects.filter(p=>p.clientId===client.id);
  const allFeed = clientProjects.flatMap(p=>getEditorialPosts(p).filter(f=>isPostStatus(f, POST_STATUS.revisione)||isPostStatus(f, POST_STATUS.approvato)));
  const activeProject = clientProjects[0]; // primary project for funnel

  function approveItem(id){
    if(!onUpdateProject) return;
    clientProjects.forEach(proj=>{
      const item=proj.ed?.feedItems?.find(f=>f.id===id);
      if(item) onUpdateProject({...proj,ed:{...proj.ed,feedItems:proj.ed.feedItems.map(f=>f.id===id?{...f,stato:"approvato"}:f)}});
    });
  }
  function rejectItem(id){
    if(!onUpdateProject) return;
    clientProjects.forEach(proj=>{
      const item=proj.ed?.feedItems?.find(f=>f.id===id);
      if(item) onUpdateProject({...proj,ed:{...proj.ed,feedItems:proj.ed.feedItems.map(f=>f.id===id?{...f,stato:"non-approvato"}:f)}});
    });
  }

  const inRevisione = allFeed.filter(f=>f.stato==="revisione"||f.stato==="semaforo");
  const approvati   = allFeed.filter(f=>f.stato==="approvato");

  return(
    <div className="portal-wrap">
      <div className="portal-header">
        <div className="portal-agency">NASSA STUDIO</div>
        <div className="portal-client">{client.nome}</div>
        {onBack && <button className="btn-ghost sm" onClick={onBack}>← Torna al pannello</button>}
      </div>

      {/* PORTAL TABS */}
      <div className="portal-tabs">
        <button className={`portal-tab ${portalTab==="approva"?"active":""}`} onClick={()=>setPortalTab("approva")}>
          ✅ Approvazioni
          {inRevisione.length>0&&<span className="portal-badge">{inRevisione.length}</span>}
        </button>
        <button className={`portal-tab ${portalTab==="funnel"?"active":""}`} onClick={()=>setPortalTab("funnel")}>
          📊 Strategia Funnel
        </button>
        <button className={`portal-tab ${portalTab==="insights"?"active":""}`} onClick={()=>setPortalTab("insights")}>
          📈 Meta Insights
          {client?.meta?.fbPageId&&<span style={{marginLeft:4,fontSize:9,color:"#10B981"}}>●</span>}
        </button>
      </div>

      {/* APPROVA TAB */}
      {portalTab==="approva"&&(
        <div className="portal-body">
          <div className="portal-section-title">Post da approvare</div>
          {inRevisione.length===0&&<div className="ct-empty">Nessun post in attesa di approvazione.</div>}
          {inRevisione.map(item=>(
            <div key={item.id} className="portal-post-row">
              {(item.immagineBase64||item.immagineUrl)&&<img src={item.immagineBase64||item.immagineUrl} className="portal-post-thumb" alt="" onError={e=>e.target.style.display="none"}/>}
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{item.titolo}</div>
                {item.caption&&<div className="portal-post-caption">{item.caption.slice(0,120)}{item.caption.length>120?"…":""}</div>}
                <div style={{fontSize:10,color:"var(--ink4)",marginTop:4}}>{(item.piattaforme||[]).join(" · ")}{item.data?` · ${item.data}`:""}</div>
                {item.pilastro&&<span style={{fontSize:10,color:getPillarColor(item.pilastro),fontWeight:700,marginTop:3,display:"inline-block"}}>{item.pilastro}</span>}
                {/* Commento cliente */}
                <PortalCommentBox item={item} clientProjects={clientProjects} onUpdateProject={onUpdateProject}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                <button className="btn-primary sm" style={{background:"var(--ok)"}} onClick={()=>approveItem(item.id)}>✓ Approva</button>
                <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>rejectItem(item.id)}>✗ Rifiuta</button>
              </div>
            </div>
          ))}
          {approvati.length>0&&(
            <>
              <div className="portal-section-title" style={{marginTop:24}}>Post approvati</div>
              {approvati.map(item=>(
                <div key={item.id} className="portal-post-row">
                  {(item.immagineBase64||item.immagineUrl)&&<img src={item.immagineBase64||item.immagineUrl} className="portal-post-thumb" alt="" onError={e=>e.target.style.display="none"}/>}
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{item.titolo}</div><div style={{fontSize:10,color:"var(--ok)",marginTop:2}}>✅ Approvato</div></div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* FUNNEL TAB */}
      {portalTab==="funnel"&&activeProject&&(
        <div className="portal-body">
          <ClientFunnelView project={activeProject}/>
        </div>
      )}
      {portalTab==="insights"&&(
        <div className="portal-body">
          {client?.portal?.mostraInsights===false
            ? <div className="mi-empty"><div style={{fontSize:24}}>🔒</div><div>Statistiche non disponibili per questo portale.</div></div>
            : <MetaInsightsPanel client={client} />}
          {!client?.meta?.fbPageId&&(
            <div style={{fontSize:12,color:"var(--ink4)",marginTop:-8,textAlign:"center",paddingBottom:16}}>
              Chiedi alla tua agenzia di collegare l&#39;account Meta per visualizzare le statistiche della tua pagina Facebook.
            </div>
          )}
        </div>
      )}
      {portalTab==="funnel"&&!activeProject&&(
        <div className="portal-body"><div className="ct-empty">Nessun progetto trovato per questo cliente.</div></div>
      )}
    </div>
  );
}

// Feed constants, status helpers, editorial normalization and workspace migration moved to modules/editorial/editorialModel.js

// FEED_CTA_OPTIONS spostato in modules/editorial/PostFormModal.jsx

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

// Image upload helper estratto in modules/editorial/PostFormModal.jsx

// ─── PHONE PREVIEW ────────────────────────────────────────────────────────────
function PhonePreview({ feedItems, selectedId }) {
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-notch"/>
        <div className="phone-screen">
          <div className="ig-header">
            <div className="ig-avatar">{feedItems[0]?"F":"N"}</div>
            <div className="ig-name">Feed</div>
            <div className="ig-header-icons">⊕ ☰</div>
          </div>
          <div className="ig-stats">
            <div className="ig-stat"><div className="ig-stat-n">{feedItems.length}</div><div className="ig-stat-l">Post</div></div>
            <div className="ig-stat"><div className="ig-stat-n">—</div><div className="ig-stat-l">Follower</div></div>
            <div className="ig-stat"><div className="ig-stat-n">—</div><div className="ig-stat-l">Seguiti</div></div>
          </div>
          <div className="ig-grid">
            {feedItems.map(item => {
              const src = item.immagineBase64||item.immagineUrl||"";
              const isSel = item.id===selectedId;
              return (
                <div key={item.id} className={`ig-cell ${isSel?"ig-cell-sel":""}`}>
                  {src ? <img src={src} alt="" className="ig-cell-img" onError={e=>e.target.style.display="none"}/>
                       : <div className="ig-cell-empty"><span style={{fontSize:18}}>{FEED_TIPI_ICON[item.tipo]||"📄"}</span></div>}
                  {item.tipo==="reel"&&<div className="ig-reel-badge">▶</div>}
                  {item.tipo==="carousel"&&<div className="ig-reel-badge">⊞</div>}
                  {item.stato!=="bozza"&&<div className="ig-cell-badge">{FEED_STATI_STYLE[item.stato]?.label?.split(" ")[0]}</div>}
                </div>
              );
            })}
            {Array(Math.max(0,6-feedItems.length)).fill(null).map((_,i)=><div key={"e"+i} className="ig-cell ig-cell-empty-gray"/>)}
          </div>
          {selectedId&&(()=>{
            const it=feedItems.find(f=>f.id===selectedId);
            if(!it) return null;
            return(
              <div className="ig-post-preview">
                <div className="ig-post-hdr">
                  <div className="ig-avatar" style={{width:22,height:22,fontSize:9}}>N</div>
                  <div style={{fontSize:11,fontWeight:700}}>Feed</div>
                </div>
                {(it.immagineBase64||it.immagineUrl)&&<img src={it.immagineBase64||it.immagineUrl} alt="" style={{width:"100%",display:"block"}} onError={e=>e.target.style.display="none"}/>}
                {it.caption&&<div className="ig-post-caption">{it.caption.slice(0,120)}{it.caption.length>120?"…":""}</div>}
              </div>
            );
          })()}
          {!selectedId&&<div className="ig-bottom-hint">Clicca un post per vederlo</div>}
        </div>
      </div>
    </div>
  );
}

// ── Extract pilastri from project ────────────────────────────────────────────
function extractPilastri(project){
  // Primary: use project.pilastri array (managed in project settings)
  if(project?.pilastri?.length>0) return project.pilastri.map(p=>p.nome);
  // Fallback: parse from PdC sections
  const pilContent=project?.pdc?.sections?.pilastri?.content||project?.pdm?.sections?.pilastri?.content||"";
  if(pilContent){
    const lines=pilContent.split("\n");
    const names=lines.filter(l=>l.trim().startsWith("#")||/^\s*0?[1-9]/.test(l))
      .map(l=>l.replace(/[#*\d.—\-]/g,"").trim()).filter(n=>n.length>3&&n.length<60);
    if(names.length>0) return [...new Set(names)];
  }
  // Last fallback: from existing feedItems
  return [...new Set((project?.ed?.feedItems||[]).map(f=>f.pilastro).filter(Boolean))];
}

// ── Extract Buyer Personas from PdM ─────────────────────────────────────────
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

// ── Content Framework options ────────────────────────────────────────────────
const CONTENT_FRAMEWORK = [
  {id:"",        label:"— Nessuno —"},
  {id:"hero",    label:"🦸 Hero — Grande impatto, ampia reach"},
  {id:"hub",     label:"🔄 Hub — Contenuto seriale e ricorrente"},
  {id:"help",    label:"🤝 Help — Risponde a domande specifiche"},
  {id:"edu",     label:"📚 Educational — Educa e informa"},
  {id:"ent",     label:"🎭 Entertainment — Intrattiene e coinvolge"},
  {id:"promo",   label:"🎯 Promotional — Conversione diretta"},
];

// ── Caption Template System ───────────────────────────────────────────────────
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

// CommunicationBridgePanel e StrategicCascadeBanner estratti in modules/strategy/CommunicationBridge.jsx

// BrandVoicePanel estratto in modules/editorial/PostFormModal.jsx

// PostFormModal estratto in modules/editorial/PostFormModal.jsx

// ─── FEED SECTION ─────────────────────────────────────────────────────────────
function FeedED({ project, onUpdate, globalMeta, client=null }) {
  const feedItems = getEditorialPosts(project);
  const [selectedId, setSelectedId] = useState(null);
  const [editItem,   setEditItem]   = useState(null);
  const [members,    setMembers]    = useState([]);
  const [pubPost,    setPubPost]    = useState(null);

  useEffect(()=>{ tpGet(TP_SK_MEMBERS).then(m=>setMembers(m||DEFAULT_MEMBERS_NMS)); },[]);

  function upFeed(fn){ onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }

  function save(item){
    upFeed(ed=>{
      const exists = (ed.feedItems||[]).some(f=>f.id===item.id);
      return { ...ed, feedItems: exists
        ? (ed.feedItems||[]).map(f=>f.id===item.id?item:f)
        : [...(ed.feedItems||[]), item]
      };
    });
    setEditItem(null);
  }

  function del(id){
    upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).filter(f=>f.id!==id)}));
    setEditItem(null); setSelectedId(null);
  }

  function addNew(){ setEditItem(emptyFeedItem()); }

  function handleRowClick(item){
    setSelectedId(prev => prev===item.id ? null : item.id);
  }

  return(
    <div className="feed-wrap">
      {/* LEFT — Feed list */}
      <div className="feed-list">
        <div className="feed-list-hdr">
          <div className="feed-list-count">Post nel feed ({feedItems.length})</div>
          <button className="btn-primary sm" onClick={addNew}>+ Aggiungi</button>
        </div>
        {feedItems.length===0&&(
          <div className="ct-empty" style={{paddingTop:40}}>
            Nessun post. Clicca "+ Aggiungi" per creare il primo contenuto.
          </div>
        )}
        {feedItems.map(item=>{
          const piats = (item.piattaforme||[]).map(id=>FEED_PIATTAFORME.find(p=>p.id===id)).filter(Boolean);
          const stati = getFeedStatusStyle(item.stato);
          const assignedMems = (item.membersAssigned||[]).map(id=>members.find(m=>m.id===id)).filter(Boolean);
          const src = item.immagineBase64||item.immagineUrl||"";
          const isSel = selectedId===item.id;
          return(
            <div key={item.id} className={`feed-row ${isSel?"feed-row-sel":""}`} onClick={()=>handleRowClick(item)}>
              <div className="feed-thumb" onClick={e=>{e.stopPropagation();setEditItem(item);}}>
                {src
                  ?<img src={src} alt="" onError={e=>e.target.style.display="none"}/>
                  :<div className="feed-thumb-placeholder">
                    <span style={{fontSize:20}}>{FEED_TIPI_ICON[item.tipo]||"📄"}</span>
                    <span style={{fontSize:9,color:"var(--ink4)"}}>Carica</span>
                  </div>
                }
              </div>
              <div className="feed-row-body">
                <div className="feed-row-title" onClick={e=>{e.stopPropagation();setEditItem(item);}}>{item.titolo}</div>
                <div className="feed-row-meta">
                  {piats.map(p=><span key={p.id} style={{color:p.color,fontWeight:700,fontSize:10,marginRight:4}}>{p.label}</span>)}
                  <span className="feed-stato-badge" style={{background:stati.bg,color:stati.tx}}>{stati.label}</span>
                  {item.data&&<span style={{fontSize:10,color:"var(--ink4)"}}>{item.data}</span>}
                </div>
                {assignedMems.length>0&&(
                  <div className="feed-row-team">
                    {assignedMems.map(m=><div key={m.id} className="feed-mem-dot" style={{background:m.colore}} title={m.nome}>{m.nome[0]}</div>)}
                    <span style={{fontSize:10,color:"var(--ink4)"}}>{assignedMems.map(m=>m.nome.split(" ")[0]).join(", ")}</span>
                  </div>
                )}
              </div>
              <div className="feed-row-acts" onClick={e=>e.stopPropagation()}>
                {item.stato==="approvato"&&globalMeta&&(
                  <button className="btn-primary sm" onClick={()=>setPubPost(item)}>📤</button>
                )}
                <button className="btn-ghost sm" onClick={e=>{e.stopPropagation();setEditItem(item);}}>✎</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT — Phone preview */}
      <PhonePreview feedItems={feedItems} selectedId={selectedId}/>

      {/* POST FORM MODAL */}
      {editItem&&(
        <PostFormModal
          item={editItem}
          members={members}
          onSave={save}
          onDelete={feedItems.some(f=>f.id===editItem.id)?del:null}
          onClose={()=>setEditItem(null)}
        />
      )}

      {/* PUBLISH MODAL */}
      {pubPost&&(
        <PublishModal
          post={{...pubPost}}
          meta={clientMetaForPublish(client, globalMeta)}
          onClose={()=>setPubPost(null)}
          onPublished={()=>{
            upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).map(f=>f.id===pubPost.id?{...f,stato:"pubblicato"}:f)}));
            setPubPost(null);
          }}
        />
      )}
    </div>
  );
}


// ─── GLOBAL META CONNECT estratto in modules/meta/GlobalMetaConnect.jsx ──────

// ─── CONTENT TRACKER / KANBAN estratto in modules/editorial/ContentTrackerED.jsx ─

// ─── PUBLISH MODAL estratto in modules/editorial/MetaPublishModal.jsx ─────────
// ─── META CONNECT ─────────────────────────────────────────────────────────────
// ─── PUBLISHING HUB ───────────────────────────────────────────────────────────
// ─── PUBLISHING HUB estratto in modules/editorial/PublishingHubED.jsx ───────

// ─── TEAM PLANNER NMS estratto in modules/team/TeamPlannerNMS.jsx ─

// ─── EXPORT SERVICE UI BINDINGS ──────────────────────────────────────────────
// ─── EXPORT MODULE ────────────────────────────────────────────────────────────
const MODULE_META = {
  pdm: { label:"Piano di Marketing", icon:"📊", sections:SECTIONS_PDM, getter: p=>p.pdm?.sections||{} },
  pdc: { label:"Piano di Comunicazione", icon:"📣", sections:SECTIONS_PDC, getter: p=>p.pdc?.sections||{} },
  ed:  { label:"Editoriale", icon:"✏️", sections:SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)), getter: p=>p.ed?.sections||{} },
};

function ExportModuleBtn({ project, module }){
  const [open,  setOpen]  = useState(false);
  const [state, setState] = useState("idle"); // idle|generating

  if(!MODULE_META[module]) return null;
  const meta=MODULE_META[module];
  const data=meta.getter(project);
  const filled=meta.sections.filter(s=>data[s.id]?.content).length;

  async function dlDoc(){
    setState("generating");
    downloadBlob(`${module}_documento.html`, buildModuleDocHTML(MODULE_META,module,project), "text/html;charset=utf-8");
    setState("idle"); setOpen(false);
  }
  async function dlMd(){
    setState("generating");
    downloadBlob(`${module}.md`, buildModuleMarkdown(MODULE_META,module,project));
    setState("idle"); setOpen(false);
  }
  async function dlPres(){
    setState("generating");
    try {
      const slidesJson=await buildModulePresentationSlides(MODULE_META,module,project);
      downloadBlob(`${module}_presentazione.html`, buildSlideshowHTML(slidesJson,meta.label,project.name), "text/html;charset=utf-8");
    } catch{}
    setState("idle"); setOpen(false);
  }

  return(
    <div className="exp-wrap">
      <button className="btn-outline sm" onClick={()=>setOpen(o=>!o)}>
        {meta.icon} Esporta modulo {filled>0?`(${filled}/${meta.sections.length})`:""}
      </button>
      {open&&(
        <div className="exp-panel" style={{right:0,width:320}}>
          <div className="exp-title">{meta.label}</div>
          {filled===0&&<div className="exp-hint" style={{marginBottom:10}}>⚠️ Nessuna sezione generata. Esporta il documento per vedere lo stato dell'avanzamento.</div>}
          <button className="exp-btn" onClick={dlDoc} disabled={state!=="idle"}>
            <span className="exp-icon">📄</span>
            <div><div className="exp-btn-label">Documento completo HTML</div><div className="exp-btn-sub">Tutte le sezioni · cover page · indice · stampa come PDF o apri in Word</div></div>
          </button>
          <button className="exp-btn" onClick={dlMd} disabled={state!=="idle"}>
            <span className="exp-icon">📝</span>
            <div><div className="exp-btn-label">Markdown completo</div><div className="exp-btn-sub">Tutte le sezioni in formato .md · Notion · Obsidian</div></div>
          </button>
          <button className="exp-btn" onClick={dlPres} disabled={state!=="idle"||filled===0}>
            <span className="exp-icon">🎯</span>
            <div><div className="exp-btn-label">{state==="generating"?"Generazione slide…":"Presentazione executive"}</div><div className="exp-btn-sub">AI struttura 10-14 slide dal modulo completo · slideshow HTML navigabile</div></div>
          </button>
          <div className="exp-divider"/>
          <div className="exp-hint">Per DOCX e PPTX ufficiali con template Nassa → chiedi a Claude di generarli</div>
        </div>
      )}
    </div>
  );
}

// ─── EXPORT PANEL ─────────────────────────────────────────────────────────────
function ExportPanel({ label, content, projectName, secId, onClose }){
  const [genPres,setGenPres]=useState(false);
  const [toast,setToast]=useState("");
  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function dlMarkdown(){
    const header=`# ${label}\n\n_${new Date().toLocaleDateString("it-IT")} — ${projectName}_\n\n---\n\n`;
    downloadBlob(`${secId}.md`, header+content);
    showToast("Markdown scaricato ✓");
  }

  function dlHTML(){
    downloadBlob(`${secId}.html`, buildDocHTML(label,content,projectName),"text/html;charset=utf-8");
    showToast("Documento HTML scaricato ✓ — aprilo in Chrome o Word");
  }

  async function dlPresentation(){
    setGenPres(true);
    try {
      const html=await buildSectionPresentationHTML(label,content,projectName);
      downloadBlob(`${secId}_presentazione.html`,html,"text/html;charset=utf-8");
      showToast("Presentazione scaricata ✓ — aprila nel browser");
    } catch { showToast("Errore generazione — riprova"); }
    setGenPres(false);
  }

  return(
    <div className="exp-panel" onClick={e=>e.stopPropagation()}>
      {toast&&<div className="exp-toast">{toast}</div>}
      <div className="exp-title">Esporta: {label}</div>
      <button className="exp-btn" onClick={dlMarkdown}>
        <span className="exp-icon">📝</span>
        <div><div className="exp-btn-label">Scarica Markdown</div><div className="exp-btn-sub">.md · compatibile con Notion, Obsidian</div></div>
      </button>
      <button className="exp-btn" onClick={dlHTML}>
        <span className="exp-icon">📄</span>
        <div><div className="exp-btn-label">Documento HTML</div><div className="exp-btn-sub">Apribile in Word · stampa come PDF</div></div>
      </button>
      <button className="exp-btn" onClick={dlPresentation} disabled={genPres}>
        <span className="exp-icon">🎯</span>
        <div>
          <div className="exp-btn-label">{genPres?"Generazione in corso…":"Presentazione interattiva"}</div>
          <div className="exp-btn-sub">AI genera slide · slideshow navigabile nel browser</div>
        </div>
      </button>
      <div className="exp-divider"/>
      <div className="exp-hint">Per DOCX e PPTX ufficiali → chiedi a Claude di generarli con i template Nassa</div>
    </div>
  );
}

function Toast({msg}){ return <div className="toast">{msg}</div>; }

// ─── WIZARD ───────────────────────────────────────────────────────────────────
const STEPS = [
  { title:"Anagrafica", fields:[
    {k:"nome",label:"Nome azienda *",ph:"es. Kosmetikal Srl"},
    {k:"settore",label:"Settore / categoria *",ph:"es. Contract manufacturing cosmetico"},
    {k:"anno",label:"Anno fondazione",ph:"es. 2003"},
    {k:"sede",label:"Sede",ph:"es. Pesaro, Marche"},
    {k:"sito",label:"Sito web",ph:"es. kosmetikal.it"},
  ]},
  { title:"Identità", fields:[
    {k:"descrizione",label:"In 2-3 frasi: cosa fa questa azienda? *",ph:"Cosa produce, per chi, come lo fa",multi:true},
    {k:"differenziale",label:"Cosa la rende unica rispetto ai competitor? *",ph:"Il differenziale principale — non un aggettivo, un fatto",multi:true},
    {k:"valori",label:"Valori guida (3-5 parole o frasi)",ph:"es. Verità prima della bellezza · Dati prima delle opinioni"},
  ]},
  { title:"Target", fields:[
    {k:"target",label:"Chi è il cliente ideale? *",ph:"Ruolo, settore, dimensione azienda, bisogno specifico",multi:true},
    {k:"b2x",label:"Modello commerciale",ph:"B2B / B2C / Entrambi — specificare"},
    {k:"mercati",label:"Mercati geografici",ph:"es. Italia · UK · Germania · Francia"},
  ]},
  { title:"Prodotti & Servizi", fields:[
    {k:"prodotti",label:"Principali prodotti o servizi *",ph:"Elenca con una riga di descrizione per ciascuno",multi:true},
    {k:"pricing",label:"Range di prezzo o modello pricing",ph:"es. Retainer 1.200-2.800€/mese · One-shot da 3.000€"},
  ]},
  { title:"Competitor", fields:[
    {k:"competitor",label:"2-3 competitor principali",ph:"es. Cosmoderma · Delta BKB · Reynaldi"},
    {k:"diff_competitor",label:"Come vi differenziate da loro?",ph:"Cosa fate voi che loro non fanno (o non comunicano)",multi:true},
  ]},
  { title:"Canali Attuali", fields:[
    {k:"canali_attuali",label:"Canali digitali attivi",ph:"es. LinkedIn pagina · Instagram · Email newsletter · Blog"},
    {k:"advertising",label:"Advertising attuale",ph:"es. Meta Ads (budget €/mese) · Google Search · nessuno"},
  ]},
  { title:"Obiettivi (12 mesi)", fields:[
    {k:"obiettivo1",label:"Obiettivo primario *",ph:"es. 50 lead qualificati/mese entro dicembre 2026",multi:true},
    {k:"obiettivo2",label:"Obiettivo secondario",ph:"es. 30% lead da mercati esteri"},
    {k:"budget",label:"Budget marketing mensile stimato",ph:"es. €3.000/mese (produzione + Ads)"},
  ]},
  { title:"Sfide", fields:[
    {k:"problema",label:"Problema principale nella comunicazione attuale *",ph:"Cosa non funziona, cosa manca, cosa frustra",multi:true},
    {k:"cosa_non_funziona",label:"Cosa avete già provato senza risultati?",ph:"Campagne, contenuti, strategie che non hanno funzionato"},
  ]},
  { title:"Team & Risorse", fields:[
    {k:"team",label:"Chi gestisce il marketing oggi?",ph:"es. Founder + freelance SMM · agenzia esterna · team interno"},
    {k:"risorse",label:"Strumenti già in uso",ph:"es. Canva · Metricool · HubSpot · nessuno"},
    {k:"note",label:"Note aggiuntive",ph:"Qualsiasi cosa non sia stata coperta sopra",multi:true},
  ]},
];

const STORICA_STEPS = [
  { title:"Origini", fields:[
    {k:"origini",label:"Chi ha fondato l'azienda e perché?",ph:"Il contesto, la motivazione, il momento storico",multi:true},
  ]},
  { title:"Svolte chiave", fields:[
    {k:"svolte",label:"I 2-3 momenti che hanno cambiato l'azienda",ph:"Crisi, pivot, acquisizioni, prodotti che hanno svoltato",multi:true},
  ]},
  { title:"Valori maturati", fields:[
    {k:"valori_maturati",label:"Cosa ha imparato l'azienda in questi anni?",ph:"Valori che vengono dall'esperienza, non dalla brochure",multi:true},
  ]},
];

// ─── EXTRACT PROMPT & REVIEW FIELDS ────────────────────────────────────────────
const REVIEW_FIELDS=[
  {k:"nome",label:"Nome azienda *",ph:"es. Kosmetikal Srl"},
  {k:"settore",label:"Settore *",ph:"es. Contract manufacturing cosmetico"},
  {k:"anno",label:"Anno fondazione",ph:"es. 2003"},
  {k:"sede",label:"Sede",ph:"es. Pesaro, Marche"},
  {k:"sito",label:"Sito web",ph:"es. kosmetikal.it"},
  {k:"descrizione",label:"Cosa fa l'azienda",ph:"",multi:true},
  {k:"differenziale",label:"Differenziale principale",ph:"",multi:true},
  {k:"valori",label:"Valori guida",ph:""},
  {k:"target",label:"Target primario",ph:"",multi:true},
  {k:"b2x",label:"Modello (B2B/B2C)",ph:""},
  {k:"mercati",label:"Mercati geografici",ph:""},
  {k:"prodotti",label:"Prodotti / Servizi",ph:"",multi:true},
  {k:"pricing",label:"Pricing",ph:""},
  {k:"competitor",label:"Competitor",ph:""},
  {k:"diff_competitor",label:"Differenziale vs competitor",ph:"",multi:true},
  {k:"canali_attuali",label:"Canali digitali attuali",ph:""},
  {k:"advertising",label:"Advertising attuale",ph:""},
  {k:"obiettivo1",label:"Obiettivo primario",ph:"",multi:true},
  {k:"obiettivo2",label:"Obiettivo secondario",ph:""},
  {k:"budget",label:"Budget marketing",ph:""},
  {k:"problema",label:"Problema principale",ph:"",multi:true},
  {k:"cosa_non_funziona",label:"Cosa non ha funzionato",ph:""},
  {k:"team",label:"Team marketing",ph:""},
  {k:"risorse",label:"Strumenti in uso",ph:""},
  {k:"note",label:"Note aggiuntive",ph:"",multi:true},
];

const buildExtractPrompt=text=>`Sei un assistente di marketing. Analizza il testo e compila SOLO un oggetto JSON — nessun testo prima o dopo, nessun markdown.
Usa valori BREVI (max 80 caratteri per campo). Stringa vuota "" per i campi non trovati.

Struttura JSON richiesta:
{"nome":"","settore":"","anno":"","sede":"","sito":"","descrizione":"","differenziale":"","valori":"","target":"","b2x":"","mercati":"","prodotti":"","pricing":"","competitor":"","diff_competitor":"","canali_attuali":"","advertising":"","obiettivo1":"","obiettivo2":"","budget":"","problema":"","cosa_non_funziona":"","team":"","risorse":"","note":""}

TESTO DA ANALIZZARE:
${text.slice(0,5000)}`;

function ReviewForm({data,onComplete,onBack}){
  const [f,setF]=useState({...data});
  function set(k,v){setF(p=>({...p,[k]:v}));}
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">✅ Verifica le informazioni estratte</div>
        <div className="review-notice">L'AI ha estratto i dati dal documento. Controlla ogni campo e correggi prima di creare il progetto.</div>
        <div className="review-grid">
          {REVIEW_FIELDS.map(field=>(
            <div key={field.k} className={`fg${field.multi?" review-full":""}`}>
              <label className="lbl">{field.label}</label>
              {field.multi
                ?<textarea className="txta" rows={2} placeholder={field.ph} value={f[field.k]||""} onChange={e=>set(field.k,e.target.value)}/>
                :<input className="inp" placeholder={field.ph} value={f[field.k]||""} onChange={e=>set(field.k,e.target.value)}/>
              }
            </div>
          ))}
        </div>
        <div className="wiz-actions" style={{marginTop:20}}>
          <button className="btn-ghost" onClick={onBack}>← Torna all'estrazione</button>
          <button className="btn-primary" onClick={()=>onComplete(f)} disabled={!f.nome?.trim()}>Crea Progetto →</button>
        </div>
      </div>
    </div>
  );
}

function BriefExtractor({onComplete,onBack,initialText}){
  const [text,setText]=useState(initialText||"");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [extracted,setExtracted]=useState(null);
  async function extract(){
    if(!text.trim()) return;
    setLoading(true); setError("");
    try {
      const raw=await callClaude(buildExtractPrompt(text), 2500);
      // Strip markdown fences
      const clean=raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
      const match=clean.match(/\{[\s\S]*\}/);
      if(!match) throw new Error("L'AI non ha restituito JSON. Riprova — a volte serve un testo più strutturato.");
      let data;
      try { data=JSON.parse(match[0]); }
      catch { try { data=JSON.parse(match[0]+"}"); } catch { throw new Error("Risposta troncata — riprova. Se il problema persiste, accorcia il testo incollato."); } }
      setExtracted(data);
    } catch(e){ setError("Errore: "+e.message); }
    setLoading(false);
  }
  if(extracted) return <ReviewForm data={extracted} onComplete={onComplete} onBack={()=>setExtracted(null)}/>;
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <button className="btn-ghost sm" style={{marginBottom:12}} onClick={onBack}>← Scegli metodo</button>
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">✦ Incolla il brief</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:12,lineHeight:1.6}}>Incolla qualsiasi documento: brief cliente, appunti dell'intervista, email, note, documento Word... L'AI estrae automaticamente tutte le informazioni del progetto.</div>
        <textarea className="txta" rows={16}
          placeholder={"Incolla qui il brief, le note, il documento del cliente...\n\nEsempio:\nNome: Kosmetikal Srl\nSettore: contract manufacturing cosmetico\nObiettivo: aumentare i lead qualificati da 3 a 10/mese entro dic 2026\nCompetitor: Cosmoderma, Delta BKB\nBudget: €3.000/mese\n..."}
          value={text} onChange={e=>setText(e.target.value)}/>
        {text.trim()&&<div style={{fontSize:10,color:"var(--ink5)",marginTop:4}}>{text.length} caratteri</div>}
        {error&&<div className="extract-error">{error}</div>}
        <div className="wiz-actions">
          {loading?<div className="gen-row"><div className="spin"/>Elaborazione AI in corso…</div>
           :<button className="btn-primary" onClick={extract} disabled={!text.trim()}>✦ Elabora con AI →</button>}
        </div>
      </div>
    </div>
  );
}

function DriveExtractor({onComplete,onBack}){
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [fallbackText,setFallbackText]=useState("");
  const [showFallback,setShowFallback]=useState(false);
  const [fetchedText,setFetchedText]=useState(null);

  async function fetchDoc(){
    if(!url.trim()) return;
    setLoading(true); setError(""); setShowFallback(false);
    let finalUrl=url.trim();
    if(finalUrl.includes("dropbox.com")){
      finalUrl=finalUrl
        .replace("www.dropbox.com","dl.dropboxusercontent.com")
        .replace(/[?&]dl=0/,"");
      finalUrl+=(finalUrl.includes("?")?"&":"?")+"raw=1";
    }
    if(finalUrl.includes("docs.google.com/document")){
      const m=finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if(m) finalUrl=`https://docs.google.com/document/d/${m[1]}/export?format=txt`;
    }
    if(finalUrl.includes("drive.google.com/file")){
      const m=finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if(m) finalUrl=`https://drive.google.com/uc?export=download&id=${m[1]}`;
    }
    try {
      const r=await fetch(finalUrl);
      if(!r.ok) throw new Error("HTTP "+r.status);
      const t=await r.text();
      if(t.length<30) throw new Error("Documento vuoto");
      setFetchedText(t);
    } catch(e){
      setError("Impossibile leggere il file direttamente (CORS o file non pubblico). Apri il documento, copia il contenuto e incollalo nel campo qui sotto.");
      setShowFallback(true);
    }
    setLoading(false);
  }

  if(fetchedText) return <BriefExtractor onComplete={onComplete} onBack={()=>setFetchedText(null)} initialText={fetchedText}/>;

  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <button className="btn-ghost sm" style={{marginBottom:12}} onClick={onBack}>← Scegli metodo</button>
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">🔗 Da Dropbox o Google Drive</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:16,lineHeight:1.6}}>Incolla il link a un documento condiviso. L'AI lo legge ed estrae il contesto del progetto.</div>
        <div className="fg" style={{marginBottom:12}}>
          <label className="lbl">URL documento</label>
          <input className="inp" placeholder="https://www.dropbox.com/s/... oppure https://docs.google.com/document/d/..." value={url} onChange={e=>setUrl(e.target.value)}/>
        </div>
        <div className="extract-hints">
          <div>📦 <strong>Dropbox:</strong> File → Condividi → Copia link (accesso "Chiunque con il link")</div>
          <div>📄 <strong>Google Doc:</strong> File → Condividi → "Chiunque con il link può visualizzare"</div>
          <div>📋 <strong>Dropbox Paper / Notion:</strong> esporta in .docx o copia il testo e usa "Incolla brief"</div>
        </div>
        {error&&(
          <div className="extract-error" style={{marginTop:12}}>
            <div>{error}</div>
            {showFallback&&(
              <div style={{marginTop:12}}>
                <label className="lbl" style={{marginBottom:6,display:"block"}}>Incolla qui il contenuto del documento:</label>
                <textarea className="txta" rows={10} placeholder="Copia e incolla il testo del documento..." value={fallbackText} onChange={e=>setFallbackText(e.target.value)}/>
              </div>
            )}
          </div>
        )}
        <div className="wiz-actions">
          {loading?<div className="gen-row"><div className="spin"/>Lettura documento…</div>
           :showFallback
             ?<button className="btn-primary" onClick={()=>setFetchedText(fallbackText)} disabled={!fallbackText.trim()}>✦ Elabora testo incollato →</button>
             :<button className="btn-primary" onClick={fetchDoc} disabled={!url.trim()}>🔗 Carica ed Elabora →</button>
          }
        </div>
      </div>
    </div>
  );
}

function WizardView({onComplete}){
  const [mode,setMode]=useState(null);
  if(mode==="brief") return <BriefExtractor onComplete={onComplete} onBack={()=>setMode(null)}/>;
  if(mode==="drive") return <DriveExtractor onComplete={onComplete} onBack={()=>setMode(null)}/>;
  if(mode==="manuale") return <ManualWizard onComplete={onComplete} onBack={()=>setMode(null)}/>;
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">Nuovo progetto</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:28,textAlign:"center"}}>Come vuoi inserire le informazioni del progetto?</div>
        <div className="wiz-modes">
          <div className="wiz-mode-card" onClick={()=>setMode("manuale")}>
            <div className="wiz-mode-icon">📝</div>
            <div className="wiz-mode-title">Compila manualmente</div>
            <div className="wiz-mode-desc">9 step guidati, campo per campo. Il modo più preciso per strutturare le informazioni fin dall'inizio.</div>
          </div>
          <div className="wiz-mode-card" onClick={()=>setMode("brief")}>
            <div className="wiz-mode-icon">✦</div>
            <div className="wiz-mode-title">Incolla un brief</div>
            <div className="wiz-mode-desc">Incolla testo libero — email, appunti, documento, trascrizione intervista. L'AI estrae tutte le informazioni.</div>
          </div>
          <div className="wiz-mode-card" onClick={()=>setMode("drive")}>
            <div className="wiz-mode-icon">🔗</div>
            <div className="wiz-mode-title">Dropbox o Google Drive</div>
            <div className="wiz-mode-desc">Incolla il link a un documento condiviso su Dropbox o Google Drive. L'AI lo legge e crea il progetto.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualWizard({onComplete,onBack}){
  const [step,setStep]=useState(0);
  const [storica,setStorica]=useState(false);
  const [data,setData]=useState({});
  const allSteps=[...STEPS,...(storica?STORICA_STEPS:[])];
  const cur=allSteps[step];
  const isLast=step===allSteps.length-1;
  const progress=Math.round(((step+1)/allSteps.length)*100);
  function set(k,v){setData(d=>({...d,[k]:v}));}
  function next(){if(isLast){onComplete(data);}else setStep(s=>s+1);}
  function canNext(){return cur.fields.filter(f=>f.label.includes("*")).every(f=>data[f.k]?.trim());}
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">Nuovo progetto</div>
        <div className="wiz-progress-wrap">
          <div className="wiz-progress-bar"><div className="wiz-progress-fill" style={{width:progress+"%"}}/></div>
          <div className="wiz-progress-txt">{step+1} / {allSteps.length}</div>
        </div>
        <div className="wiz-step">
          <div className="wiz-step-num">Step {step+1}</div>
          <div className="wiz-step-title">{cur.title}</div>
          {step===0&&(
            <div className="wiz-storica-toggle">
              <label className="wiz-check-label">
                <input type="checkbox" checked={storica} onChange={e=>setStorica(e.target.checked)}/>
                <span>Azienda con più di 15 anni di storia — aggiungi sezione storica (Origini, Svolte, Valori)</span>
              </label>
            </div>
          )}
          <div className="wiz-fields">
            {cur.fields.map(f=>(
              <div key={f.k} className="fg">
                <label className="lbl">{f.label}</label>
                {f.multi
                  ?<textarea className="txta" rows={3} placeholder={f.ph} value={data[f.k]||""} onChange={e=>set(f.k,e.target.value)}/>
                  :<input className="inp" placeholder={f.ph} value={data[f.k]||""} onChange={e=>set(f.k,e.target.value)}/>
                }
              </div>
            ))}
          </div>
          <div className="wiz-actions">
            <button className="btn-ghost" onClick={step===0?onBack:()=>setStep(s=>s-1)}>← {step===0?"Scegli metodo":"Indietro"}</button>
            <button className="btn-primary" onClick={next} disabled={!canNext()}>{isLast?"Crea Progetto →":"Avanti →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// SectionContent estratto in modules/strategy/StrategicSectionContent.jsx

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
function ProjectView({project, onUpdate, onBack, globalMeta, onPortal, client}){
  const [module,setModule]=useState("overview"); // overview | pdm | pdc | ed
  const sections = module==="pdm" ? SECTIONS_PDM : module==="pdc" ? SECTIONS_PDC : SECTIONS_ED;
  const groups   = module==="pdm" ? GROUPS_PDM   : module==="pdc" ? GROUPS_PDC   : GROUPS_ED;
  const COLORS   = module==="pdm" ? COLORS_PDM   : module==="pdc" ? COLORS_PDC   : COLORS_ED;

  const [group,setGroup]=useState(groups[0]);
  const [sec,setSec]=useState(sections[0].id);
  const [genAll,setGenAll]=useState(false);
  const [toast,setToast]=useState("");

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  // Sync sec when module or group changes
  useEffect(()=>{
    const first = sections.find(s=>s.group===group);
    if(first) setSec(first.id);
  },[module,group]);

  useEffect(()=>{
    if(!groups.includes(group)) setGroup(groups[0]);
  },[module]);

  const groupSecs = sections.filter(s=>s.group===group);

  // Prompts loaded on-demand — excluded from initial bundle (~48kB saved)
  async function loadP(mod){
    if(mod==="ed") return P_ED;
    const { P_PDM, P_PDC } = await import("./prompts");
    return mod==="pdm" ? P_PDM : P_PDC;
  }

  async function generateAll(){
    setGenAll(true);
    const ctx = buildCtx(project.interview||{});
    const pdmCtx = Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
    const pdcCtx = Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
    const fullCtx = module==="ed" ? ctx+"\n\n## Marketing:\n"+pdmCtx+"\n\n## Comunicazione:\n"+pdcCtx : ctx;
    const P = await loadP(module);
    const ids = sections.map(s=>s.id).filter(id=>!!P[id]);
    for(const id of ids){
      const existing = module==="pdm" ? project.pdm?.sections?.[id]?.content
                     : module==="pdc" ? project.pdc?.sections?.[id]?.content
                     : project.ed?.sections?.[id]?.content;
      if(existing) continue;
      try {
        const prevLog=(project.ed?.perfLogs||[]).slice(-1)[0];
        const text = await callClaude(P[id](fullCtx, prevLog?.note));
        if(module==="pdm"){
          const prev=project.pdm||{sections:{}};
          project={...project,pdm:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        } else if(module==="pdc"){
          const prev=project.pdc||{sections:{}};
          project={...project,pdc:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        } else {
          const prev=project.ed||{sections:{}};
          project={...project,ed:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        }
        onUpdate(project);
      } catch{}
    }
    setGenAll(false);
    showToast("Generazione completa ✓");
  }

  // Count filled sections
  const pdmFilled = SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcFilled = SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const edFilled  = SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length;

  return(
    <div className="proj-view">
      {toast&&<Toast msg={toast}/>}

      {/* TOP BAR */}
      <div className="pv-topbar">
        <button className="pv-back" onClick={onBack}>← Progetti</button>
        <div className="pv-name">{project.name}</div>
        <div className="pv-actions">
          {onPortal&&project.clientId&&<button className="pv-portal-btn" onClick={onPortal} title="Apri portale cliente">👁 Portale cliente</button>}
          <WhiteLabelReportBtn project={project} client={client}/>
          {module!=="overview"&&<ExportModuleBtn project={project} module={module}/>}
          {module!=="overview"&&(genAll
            ? <div className="gen-row"><div className="spin"/>Generazione in corso…</div>
            : module!=="ed"
              ? <button className="btn-outline sm" onClick={generateAll}>Genera tutto</button>
              : <button className="btn-outline sm" onClick={generateAll} title="Genera tutte le sezioni Editoriale (Strategia + Analisi)">⚡ Genera Editoriale</button>
          )}
        </div>
      </div>

      {/* MODULE SWITCHER */}
      <div className="module-sw">
        <button className={`module-btn ${module==="overview"?"active":""}`} onClick={()=>setModule("overview")}>
          <span className="mb-icon">🏠</span>Overview
        </button>
        <button className={`module-btn ${module==="pdm"?"active":""}`} onClick={()=>setModule("pdm")}>
          <span className="mb-icon">📊</span>Piano di Marketing
          <span className="mb-badge" style={module==="pdm"?{background:"#EFF8FF",color:"#0EA5E9"}:{}}>{pdmFilled}/{SECTIONS_PDM.length}</span>
        </button>
        <button className={`module-btn ${module==="pdc"?"active":""}`} onClick={()=>setModule("pdc")}>
          <span className="mb-icon">📣</span>Piano di Comunicazione
          <span className="mb-badge" style={module==="pdc"?{background:"#F5F3FF",color:"#8B5CF6"}:{}}>{pdcFilled}/{SECTIONS_PDC.length}</span>
        </button>
        <button className={`module-btn ${module==="ed"?"active":""}`} onClick={()=>setModule("ed")}>
          <span className="mb-icon">✏️</span>Editoriale
          <span className="mb-badge" style={module==="ed"?{background:"#ECFDF5",color:"#10B981"}:{}}>{edFilled}/{SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)).length}</span>
        </button>
      </div>

      {/* OVERVIEW */}
      {module==="overview"&&(
        <div style={{flex:1,overflow:"auto"}}>
          <ProjectOverview project={project} onUpdate={onUpdate} onGoToModule={setModule}/>
        </div>
      )}

      {/* EDITORIALE MAIN — Loomly-style, gestione interna propria */}
      {module==="ed"&&(
        <ModuleErrorBoundary name="Editoriale" resetKey={project.id+"-ed"}>
          <EditorialeMain project={project} onUpdate={onUpdate} globalMeta={globalMeta} client={client}/>
        </ModuleErrorBoundary>
      )}

      {/* GROUP TABS — nascosti in overview e in ed (gestione interna) */}
      {module!=="overview"&&module!=="ed"&&(
      <div className="group-tabs">
        {groups.map(g=>{
          const done = module==="ed"
            ? sections.filter(s=>s.group===g&&!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length
            : sections.filter(s=>s.group===g&&(module==="pdm"?project.pdm:project.pdc)?.sections?.[s.id]?.content).length;
          const tot = module==="ed"
            ? sections.filter(s=>s.group===g&&!ED_SPECIAL.includes(s.id)).length
            : sections.filter(s=>s.group===g).length;
          const active = group===g;
          const gc = COLORS[g]||"#0EA5E9";
          return(
            <div key={g} className={`gtab ${active?"active":""}`}
              style={active?{color:gc,borderBottomColor:gc}:{}}
              onClick={()=>setGroup(g)}>
              {g}
              <span className="gtab-cnt" style={active?{background:gc+"18",color:gc}:{}}>{done}/{tot}</span>
            </div>
          );
        })}
      </div>
      )}

      {/* SECTION TABS — nascosti in overview e in ed */}
      {module!=="overview"&&module!=="ed"&&(
      <div className="sec-tabs">
        {groupSecs.map(s=>{
          const filled = module==="ed"
            ? !!(ED_SPECIAL.includes(s.id) ? true : project.ed?.sections?.[s.id]?.content)
            : !!(module==="pdm"?project.pdm:project.pdc)?.sections?.[s.id]?.content;
          const isActive = sec===s.id;
          const gc = COLORS[s.group]||"#0EA5E9";
          return(
            <button key={s.id} className={`sec-tab ${isActive?"active":""} ${filled?"has":""}`}
              style={isActive?{color:gc,borderBottomColor:gc}:{}}
              onClick={()=>setSec(s.id)}>
              {filled&&<span className="tab-dot" style={{background:gc}}/>}
              <SvgIcon name={s.icon} size={13} color={isActive?gc:"currentColor"}/> {s.label}
            </button>
          );
        })}
      </div>
      )}

      {/* SECTION CONTENT — nascosto in overview e ed */}
      {module!=="overview"&&module!=="ed"&&(
        module==="ed"
          ? <EdSectionContent key={"ed-"+sec} project={project} secId={sec} onUpdate={onUpdate} globalMeta={globalMeta}
          client={client}
        />
          : <SectionContent   key={module+"-"+sec} project={project} module={module} secId={sec} onUpdate={onUpdate} sections={sections} colors={COLORS} ExportPanelComponent={ExportPanel} ToastComponent={Toast} renderMarkdown={renderMd} SvgIconComponent={SvgIcon}/>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({projects, onSelect, onNew}){
  return(
    <div className="dashboard">
      <div className="dash-hero">
        <div className="dash-label">Nassa Marketing Studio</div>
        <div className="dash-h1">Piano Marketing & Comunicazione</div>
        <div className="dash-p">Strategia annuale in due moduli: Piano di Marketing + Piano di Comunicazione.</div>
      </div>

      {projects.length===0?(
        <div className="dash-empty">
          <div className="dash-glyph">◈</div>
          <div className="dash-msg">Nessun progetto. Crea il primo progetto con l'intervista guidata.</div>
          <button className="btn-primary" onClick={onNew}>+ Nuovo Progetto</button>
        </div>
      ):(
        <>
          <div className="dash-grid">
            {projects.map(p=>{
              const pdmF=SECTIONS_PDM.filter(s=>p.pdm?.sections?.[s.id]?.content).length;
              const pdcF=SECTIONS_PDC.filter(s=>p.pdc?.sections?.[s.id]?.content).length;
              const tot=SECTIONS_PDM.length+SECTIONS_PDC.length;
              const done=pdmF+pdcF;
              const pct=Math.round((done/tot)*100);
              return(
                <div key={p.id} className="dash-card" onClick={()=>onSelect(p.id)}>
                  <div className="dc-top">
                    <div className="dc-glyph">◈</div>
                    <div className="dc-pct">{pct}%</div>
                  </div>
                  <div className="dc-name">{p.name}</div>
                  <div className="dc-date">{p.interview?.settore||"—"} · {new Date(p.createdAt).toLocaleDateString("it-IT")}</div>
                  <div className="dc-bar"><div className="dc-fill" style={{width:pct+"%"}}/></div>
                  <div className="dc-modules">
                    <span className="dc-mod pdm">{pdmF}/{SECTIONS_PDM.length} PdM</span>
                    <span className="dc-mod pdc">{pdcF}/{SECTIONS_PDC.length} PdC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── COMMAND BAR ─────────────────────────────────────────────────────────────
function CommandBar({ projects, clients, onNavigate, onClose }){
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useEffect(()=>{ inputRef.current?.focus(); },[]);

  // ── Build result set ───────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();

  // 1. Quick actions (always shown when empty or matched)
  const ACTIONS = [
    { id:"a-new-client",  type:"action", icon:"users",   label:"Nuovo cliente",            hint:"Crea",         action:()=>{ onClose(); onNavigate("newClient"); }},
    { id:"a-dashboard",   type:"action", icon:"grid",    label:"Dashboard",                hint:"Vai",          action:()=>{ onClose(); onNavigate("dashboard"); }},
    { id:"a-team",        type:"action", icon:"calendar", label:"Team Planner",             hint:"Vai",          action:()=>{ onClose(); onNavigate("teamplanner"); }},
  ];

  // 2. Clients
  const clientResults = clients
    .filter(c=>!q||c.nome?.toLowerCase().includes(q))
    .slice(0,4)
    .map(c=>({
      id:"c-"+c.id, type:"client", icon:"user",
      label:c.nome, hint:"Apri cliente",
      sub: projects.filter(p=>p.clientId===c.id).length+" progetti",
      action:()=>{ onClose(); onNavigate("client",c.id); }
    }));

  // 3. Projects
  const projectResults = projects
    .filter(p=>!q||p.name?.toLowerCase().includes(q)||(p.interview?.nome||"").toLowerCase().includes(q))
    .slice(0,5)
    .map(p=>{
      const client=clients.find(c=>c.id===p.clientId);
      return{
        id:"p-"+p.id, type:"project", icon:"layers",
        label:p.name, hint:"Apri progetto",
        sub:client?.nome||"",
        action:()=>{ onClose(); onNavigate("project",p.id); }
      };
    });

  // 4. Posts (feedItems) — search by title, caption, pilastro
  const postResults = q.length<2 ? [] : projects.flatMap(proj=>
    (proj.ed?.feedItems||[])
      .filter(f=>(f.titolo||"").toLowerCase().includes(q)||(f.caption||"").toLowerCase().includes(q)||(f.pilastro||"").toLowerCase().includes(q))
      .slice(0,3)
      .map(f=>{
        const client=clients.find(c=>c.id===proj.clientId);
        const st=getFeedStatusStyle(f.stato);
        return{
          id:"f-"+f.id, type:"post", icon:"edit",
          label:f.titolo||"Post senza titolo",
          hint:"Apri post",
          sub:`${client?.nome||proj.name} · ${f.data||"—"} · ${st.label}`,
          statusColor:st.tx,
          action:()=>{ onClose(); onNavigate("post",proj.id,f.id); }
        };
      })
  ).slice(0,6);

  // 5. Sections — jump to specific PdM/PdC section
  const sectionResults = q.length<2 ? [] : [
    ...SECTIONS_PDM.map(s=>({...s,module:"pdm"})),
    ...SECTIONS_PDC.map(s=>({...s,module:"pdc"})),
  ].filter(s=>s.label.toLowerCase().includes(q)||s.group.toLowerCase().includes(q))
   .slice(0,4)
   .map(s=>({
     id:"s-"+s.module+"-"+s.id, type:"section", icon:s.icon,
     label:s.label, hint:s.module==="pdm"?"Piano di Marketing":"Piano di Comunicazione",
     sub:s.group,
     action:()=>{
       // Find first project that has this section OR just navigate to it
       onClose(); onNavigate("section",s.module,s.id);
     }
   }));

  // Combine: actions first when empty, else relevance order
  const results = q
    ? [...clientResults,...projectResults,...postResults,...sectionResults,
       ...ACTIONS.filter(a=>a.label.toLowerCase().includes(q))]
    : [...ACTIONS,...clientResults.slice(0,3),...projectResults.slice(0,3)];

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(()=>{ setCursor(0); },[query]);

  function handleKey(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); setCursor(c=>Math.min(c+1,results.length-1)); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); setCursor(c=>Math.max(c-1,0)); }
    else if(e.key==="Enter"){ e.preventDefault(); results[cursor]?.action?.(); }
    else if(e.key==="Escape"){ onClose(); }
  }

  // Group labels
  const TYPE_LABEL = { action:"⚡ Azioni rapide", client:"👥 Clienti", project:"📁 Progetti", post:"📝 Post", section:"📚 Sezioni" };

  // Flatten with group headers
  const grouped = [];
  let lastType = null;
  results.forEach((r,i)=>{
    if(r.type!==lastType){
      grouped.push({_header:true,label:TYPE_LABEL[r.type]||r.type});
      lastType=r.type;
    }
    grouped.push({...r,_idx:i});
  });

  return(
    <div className="cmdb-overlay" onClick={onClose}>
      <div className="cmdb-modal" onClick={e=>e.stopPropagation()}>
        {/* Search input */}
        <div className="cmdb-search-row">
          <SvgIcon name="compass" size={16} color="var(--ink4)"/>
          <input
            ref={inputRef}
            className="cmdb-input"
            placeholder="Cerca clienti, progetti, post, sezioni… o digita un'azione"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          {query&&<button className="cmdb-clear" onClick={()=>setQuery("")}>✕</button>}
          <kbd className="cmdb-esc">Esc</kbd>
        </div>

        {/* Results */}
        <div className="cmdb-results">
          {results.length===0&&query&&(
            <div className="cmdb-empty">Nessun risultato per "<strong>{query}</strong>"</div>
          )}
          {grouped.map((item,gi)=>{
            if(item._header) return(
              <div key={"h"+gi} className="cmdb-group-label">{item.label}</div>
            );
            const isActive=item._idx===cursor;
            return(
              <div key={item.id}
                className={`cmdb-item ${isActive?"cmdb-active":""}`}
                onClick={item.action}
                onMouseEnter={()=>setCursor(item._idx)}>
                <div className="cmdb-item-icon">
                  <SvgIcon name={item.icon} size={14} color={isActive?"var(--gold)":"var(--ink4)"}/>
                </div>
                <div className="cmdb-item-body">
                  <div className="cmdb-item-label">{item.label}</div>
                  {item.sub&&<div className="cmdb-item-sub">
                    {item.statusColor&&<span style={{width:6,height:6,borderRadius:"50%",background:item.statusColor,display:"inline-block",marginRight:4}}/>}
                    {item.sub}
                  </div>}
                </div>
                <div className="cmdb-item-hint">{item.hint}</div>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="cmdb-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> naviga</span>
          <span><kbd>↵</kbd> apri</span>
          <span><kbd>Esc</kbd> chiudi</span>
          <span style={{marginLeft:"auto",color:"var(--ink5)"}}>
            {results.length} risultati{q?` per "${q}"`:""}
          </span>
        </div>
      </div>
    </div>
  );
}

function StorageStatusIndicator({ status, error, lastSavedAt }){
  const isError = status === "error";
  const isSaving = status === "saving";
  const isLoading = status === "loading";
  const label = isError
    ? "Errore salvataggio"
    : isSaving
      ? "Salvataggio…"
      : isLoading
        ? "Caricamento…"
        : lastSavedAt
          ? `Salvato ${new Date(lastSavedAt).toLocaleTimeString("it-IT", { hour:"2-digit", minute:"2-digit" })}`
          : "Pronto";

  return (
    <div className={`storage-pill ${isError ? "storage-error" : isSaving || isLoading ? "storage-pending" : "storage-ok"}`} title={isError ? error : label}>
      <span className="storage-dot"/>
      <span className="storage-label">{label}</span>
      {isError && error && <span className="storage-detail">{error}</span>}
    </div>
  );
}


// =============================================================================
// INTERNAL SERVICE MAP — extraction-ready boundaries
// =============================================================================
const SERVICE_BOUNDARIES = Object.freeze({
  storage: "safeLoadWorkspace, safeSaveWorkspace, migrateWorkspaceData",
  editorialNormalization: "normalizeFeedItem, normalizePostPlatforms, getEditorialPosts",
  editorialValidation: "validatePostFormItem, isValidOptionalUrl, isValidISODate, isValidTime",
  ai: "callClaude and prompt maps",
  meta: "openMetaOAuth, igPublish, fbPublish",
});

export default function App(){
  const [projects,setProjects]=useState([]);
  const [clients, setClients] =useState([]);
  const [activeId,setActiveId]=useState(null);
  const [activeClientId,setActiveClientId]=useState(null);
  const [expandedClients,setExpandedClients]=useState([]);
  const [view,setView]=useState("dashboard");
  const [loaded,setLoaded]=useState(false);
  const [globalMeta,setGlobalMeta]=useState(null);
  const [urgencyToast,setUrgencyToast]=useState(null);
  const [cmdBarOpen,setCmdBarOpen]=useState(false);  // ← Command Bar
  const [storageStatus,setStorageStatus]=useState("idle");
  const [storageError,setStorageError]=useState("");
  const [lastSavedAt,setLastSavedAt]=useState(null);

  // Global Cmd+K / Ctrl+K listener
  useEffect(()=>{
    function onKey(e){
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){ e.preventDefault(); setCmdBarOpen(v=>!v); }
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[]);

  // Command Bar navigation handler
  function handleCmdNavigate(type,id,extra){
    if(type==="dashboard"){ setView("dashboard"); }
    else if(type==="newClient"){ addNewClient(); }
    else if(type==="teamplanner"){ setView("teamplanner"); }
    else if(type==="client"){ openClient(id); }
    else if(type==="project"){ handleSelect(id); }
    else if(type==="post"){
      // id=projectId, extra=feedItemId → open project then set editItem
      handleSelect(id);
      // Store pending post to open (will be picked up by EditorialeMain)
      sessionStorage.setItem("nms-open-post",extra||"");
    }
    else if(type==="section"){
      // id=module (pdm/pdc), extra=sectionId
      // Navigate to the active project in that module
      if(activeId){ setView("project"); sessionStorage.setItem("nms-open-section",JSON.stringify({module:id,sec:extra})); }
      else if(projects.length>0){ handleSelect(projects[0].id); sessionStorage.setItem("nms-open-section",JSON.stringify({module:id,sec:extra})); }
    }
  }

  useEffect(()=>{
    (async()=>{
      setStorageStatus("loading");
      const loadResult = await safeLoadWorkspace();
      if(!loadResult.ok){
        setStorageStatus("error");
        setStorageError(loadResult.error);
      }
      let d = migrateWorkspaceData(loadResult.data);
      const gm=await loadGlobalMeta(); setGlobalMeta(gm);
      if(loadResult.ok) setStorageStatus("idle");
      if(d&&(d.projects?.length>0||d.clients?.length>0)){
        let ps=d.projects||[], cs=d.clients||[];
        // Forza inserimento Coop Radenza se non esiste ancora
        if(!cs.find(c=>c.id==="demo-client-radenza")){
          const {client:r,project:rp}=createCoopRadenza();
          cs=[...cs,r]; ps=[...ps,rp];
          saveWorkspaceState({projects:ps,clients:cs,activeId:d.activeId});
        }
        setProjects(ps); setClients(cs);
        setActiveId(d.activeId||null);
        // Auto-navigate to portal if URL has ?portal= param
        const _urlPortal = new URLSearchParams(window.location.search).get("portal");
        const _isClientPortalPath = typeof window !== "undefined" && window.location.pathname.startsWith("/c");
        if(_urlPortal && _isClientPortalPath){
          const _match = cs.find(c=>clientSlug(c.nome)===_urlPortal||c.id===_urlPortal);
          if(_match){ setActiveClientId(_match.id); setView("portal"); }
        }
      } else {
        const {client:k,project:kp}=createKosmetikal();
        const {client:r,project:rp}=createCoopRadenza();
        const initP=[kp,rp], initC=[k,r];
        setProjects(initP); setClients(initC);
        setActiveId(kp.id); setActiveClientId(k.id);
        setExpandedClients([k.id,r.id]);
        saveWorkspaceState({projects:initP,clients:initC,activeId:kp.id});
        setView("project");
      }
      setLoaded(true);
      const _p=window.location.pathname;const _cm=_p.match(/^\\/client\\/([^\\/]+)/);const _pm=_p.match(/^\\/project\\/([^\\/]+)/);const _vm={'/approvals':'approvals','/calendar':'globalcal','/planner':'planner'};if(_cm&&cs.find(c=>c.id===_cm[1])){setActiveClientId(_cm[1]);setView('client');}else if(_pm&&ps.find(p=>p.id===_pm[1])){setActiveId(_pm[1]);setView('project');}else if(_vm[_p]){setView(_vm[_p]);}
      // Urgency scan — post with date ≤ now+48h still in bozza/revisione
      const now=new Date(); const cutoff=new Date(now.getTime()+48*3600000);
      const urgencyProjects = (d?.projects || projects || []).map(migrateProjectData);
      const urgenti=urgencyProjects.flatMap(pr=>getEditorialPosts(pr).filter(f=>{
        if(!f.data || ![POST_STATUS.bozza, POST_STATUS.revisione].includes(normalizeFeedStatus(f.stato))) return false;
        const d2=new Date(f.data+"T23:59:59"); return d2<=cutoff && d2>=now;
      }).map(f=>({...f,_projName:pr.name,_clientId:pr.clientId})));
      if(urgenti.length>0) setUrgencyToast(urgenti);
    })();
  },[]);

  async function saveWorkspaceState(nextData) {
    setStorageStatus("saving");
    const result = await safeSaveWorkspace(nextData);
    if(result.ok){
      setStorageStatus("saved");
      setLastSavedAt(result.savedAt);
      // sizeWarning: avvisa ma non blocca — spazio in esaurimento
      if(result.sizeWarning){
        setStorageError(result.sizeWarning);
      } else {
        setStorageError("");
      }
    } else {
      setStorageStatus("error");
      setStorageError(result.error||"Errore salvataggio — riprova");
    }
    return result;
  }

  function pushUrl(view,id){const m={dashboard:'/',approvals:'/approvals',globalcal:'/calendar',planner:'/planner'};const url=m[view]||(view==='client'?'/client/'+id:view==='project'?'/project/'+id:view==='portal'?'/portal/'+id:'/');window.history.pushState({view,id},'',url);}

  async function persist(ps,cs,aid){
    setProjects(ps); setClients(cs);
    if(aid!==undefined) setActiveId(aid);
    await saveWorkspaceState({projects:ps,clients:cs,activeId:aid??activeId});
  }
  async function handleMetaChange(m){ setGlobalMeta(m); await saveGlobalMeta(m); }
  async function handleUpdate(updated){ const ps=projects.map(p=>p.id===updated.id?updated:p); await persist(ps,clients,activeId); }
  async function handleClientUpdate(upd){ const cs=clients.map(c=>c.id===upd.id?upd:c); setClients(cs); await saveWorkspaceState({projects,clients:cs,activeId}); }

  function handleSelect(id){
    setActiveId(id); setView("project"); pushUrl("project",id);
    const proj=projects.find(p=>p.id===id);
    if(proj?.clientId) setActiveClientId(proj.clientId);
    persist(projects,clients,id);
  }
  function handleBack(){
    setView("dashboard"); pushUrl("dashboard");
    persist(projects,clients,null);
    const _u=new URL(window.location.href);
    _u.searchParams.delete("portal");
    window.history.pushState({},"",_u.toString());
  }
  function toggleExpand(id){ setExpandedClients(ex=>ex.includes(id)?ex.filter(e=>e!==id):[...ex,id]); }
  function openClient(id){ setActiveClientId(id); setView("client"); pushUrl("client",id); }
  function openPortal(id){
    setActiveClientId(id);
    setView("portal");
    // Update URL so portal is shareable with clients
    const client = clients.find(c=>c.id===id);
    const slug = client ? clientSlug(client.nome) : id;
    const url = new URL(window.location.href);
    // Use /c/ path for client portal (separate from agency app URL)
    const portalUrl2 = `${window.location.origin}/c/?portal=${slug}`;
    window.history.pushState({portal: id}, "", portalUrl2);
  }

  function handleWizardComplete(iv){
    const name=iv.nome||(iv.settore?`Piano ${iv.settore}`:("Progetto "+new Date().toLocaleDateString("it-IT")));
    const proj={id:uid(),clientId:activeClientId||null,name,createdAt:Date.now(),interview:iv,context:buildCtx(iv),pdm:{sections:{}},pdc:{sections:{}},pilastri:[],ed:createEmptyEditorialState(),tasks:[],milestones:[],budget:{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:""},qbrs:[],creators:[]};
    const ps=[...projects,proj];
    const cs=clients.map(c=>c.id===activeClientId?{...c,projectIds:[...(c.projectIds||[]),proj.id]}:c);
    persist(ps,cs,proj.id); setActiveId(proj.id); setView("project");
  }
  function addProjectToClient(cid){ setActiveClientId(cid); setView("wizard"); }
  function addNewClient(){ const c=emptyClient(); const cs=[...clients,c]; setClients(cs); saveWorkspaceState({projects,clients:cs,activeId}); setActiveClientId(c.id); setExpandedClients(ex=>[...ex,c.id]); setView("client"); }

  const activeProj   = projects.find(p=>p.id===activeId);
  const activeClient = clients.find(c=>c.id===activeClientId);

  // Standalone portal mode: ?portal=clientSlug → no sidebar, clean client view
  const _pp = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("portal") : null;
  const _isClientPath = typeof window !== "undefined" && window.location.pathname.startsWith("/c");
  if(_pp && view === "portal" && activeClient && _isClientPath) {
    return (
      <div className="portal-standalone">
        <div className="portal-standalone-hdr">
          <div className="portal-standalone-brand">
            <div style={{width:32,height:32,borderRadius:8,background:"#1B4DFF",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14}}>N</div>
            <span style={{fontWeight:700,fontSize:13,color:"var(--ink2)"}}>NASSA STUDIO</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16,color:"var(--ink1)"}}>{activeClient.nome}</div>
            <div style={{fontSize:11,color:"var(--ink4)"}}>Area riservata cliente</div>
          </div>
        </div>
        <ClientPortalPreview
          client={activeClient}
          projects={projects.filter(p=>p.clientId===activeClient.id)}
          onBack={null}
          onUpdateProject={handleUpdate}
          standaloneMode={true}
        />
      </div>
    );
  }

  if(!loaded) return <div className="app"><div className="loading">Caricamento…</div></div>;

  return(
    <div className="app">
      {/* CSS loaded via src/styles/app.css — see main.jsx */}

      {/* COMMAND BAR */}
      {cmdBarOpen&&(
        <CommandBar
          projects={projects}
          clients={clients}
          onNavigate={handleCmdNavigate}
          onClose={()=>setCmdBarOpen(false)}/>
      )}

      {/* URGENCY TOAST */}
      {urgencyToast&&urgencyToast.length>0&&(
        <div className="urgency-toast">
          <div className="urgency-toast-icon">⚠️</div>
          <div className="urgency-toast-body">
            <div className="urgency-toast-title">{urgencyToast.length} post urgent{urgencyToast.length===1?"e":"i"} nelle prossime 48h</div>
            <div className="urgency-toast-list">
              {urgencyToast.slice(0,3).map(f=>(
                <div key={f.id} className="urgency-toast-item">
                  <span className="urgency-dot" style={{background:FEED_STATI_STYLE[f.stato]?.tx||"#94A3B8"}}/>
                  {f.titolo||"Post senza titolo"} · {f.data}
                </div>
              ))}
              {urgencyToast.length>3&&<div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>+{urgencyToast.length-3} altri</div>}
            </div>
          </div>
          <button className="urgency-toast-close" onClick={()=>setUrgencyToast(null)}>✕</button>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="logo"><div className="logo-glyph">◈</div><div><div className="logo-name">NASSA</div><div className="logo-sub">Marketing Studio</div></div></div>
          {/* GLOBAL BRAND SELECTOR — switch attivo client */}
          {clients.length>0&&(
            <div className="global-brand-sel">
              <select className="gbs-select"
                value={activeClientId||""}
                onChange={e=>{
                  const cid=e.target.value;
                  if(!cid) return;
                  setActiveClientId(cid);
                  setExpandedClients(ex=>ex.includes(cid)?ex:[...ex,cid]);
                  const firstProj=projects.find(p=>p.clientId===cid);
                  if(firstProj){ setActiveId(firstProj.id); setView("project"); }
                  else { setView("client"); }
                }}>
                <option value="">— Brand attivo —</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <SvgIcon name="users" size={11} color="var(--ink4)" style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            </div>
          )}
          <button className="new-btn" onClick={addNewClient}>+ Nuovo Cliente</button>
          {/* Command Bar trigger */}
          <button className="cmdb-trigger-btn" onClick={()=>setCmdBarOpen(true)} title="Cerca (Cmd+K)">
            <SvgIcon name="compass" size={13} color="var(--ink4)"/>
            <span>Cerca…</span>
            <kbd className="cmdb-trigger-kbd">⌘K</kbd>
          </button>
          <StorageStatusIndicator status={storageStatus} error={storageError} lastSavedAt={lastSavedAt}/>
        </div>

        <div className="sb-label">Clienti</div>
        <div className="proj-list">
          {clients.length===0&&<div className="sb-empty">Nessun cliente. Aggiungine uno.</div>}
          {clients.map(client=>{
            const clientProjs=projects.filter(p=>p.clientId===client.id);
            const isExp=expandedClients.includes(client.id);
            const isClientActive=activeClientId===client.id&&(view==="client"||view==="portal");
            // Urgency count for this client
            const now=new Date(); const cutoff=new Date(now.getTime()+48*3600000);
            const urgCount=clientProjs.flatMap(p=>p.ed?.feedItems||[]).filter(f=>{
              if(!f.data||!["bozza","revisione"].includes(f.stato)) return false;
              const d=new Date(f.data+"T23:59:59"); return d<=cutoff&&d>=now;
            }).length;
            return(
              <div key={client.id} className="sb-client-group">
                <div className={`sb-client-row ${isClientActive?"sb-client-active":""}`}>
                  <button className="sb-chevron-btn" onClick={()=>toggleExpand(client.id)}>{isExp?"▼":"▶"}</button>
                  <div className="sb-client-name" onClick={()=>openClient(client.id)}>{client.nome}</div>
                  {urgCount>0&&<span className="sb-urgency-badge" title={`${urgCount} post urgenti`}>{urgCount}</span>}
                  <button className="sb-icon-btn" title="Impostazioni cliente" onClick={()=>openClient(client.id)}>⚙</button>
                  <button className="sb-icon-btn" title="Nuovo progetto" onClick={()=>addProjectToClient(client.id)}>+</button>
                </div>
                {isExp&&clientProjs.map(p=>(
                  <div key={p.id} className={`sb-proj-row ${activeId===p.id&&view==="project"?"active":""}`}
                    onClick={()=>handleSelect(p.id)}>
                    <span className="sb-proj-dot"/>
                    <span className="sb-proj-name">{p.name}</span>
                  </div>
                ))}
                {isExp&&clientProjs.length===0&&(
                  <div className="sb-proj-empty" onClick={()=>addProjectToClient(client.id)}>+ Aggiungi progetto</div>
                )}
              </div>
            );
          })}
          {/* Progetti senza cliente (backward compat) */}
          {projects.filter(p=>!p.clientId).map(p=>(
            <div key={p.id} className={`proj-row ${activeId===p.id&&view==="project"?"active":""}`} onClick={()=>handleSelect(p.id)}>
              <div className="pr-name">{p.name}</div>
              <div className="pr-date">Nessun cliente</div>
            </div>
          ))}
        </div>

        <div className="sb-bottom">
          <GlobalMetaConnect globalMeta={globalMeta} onMetaChange={handleMetaChange}/>
          <button className={`sb-planner-btn ${view==="approvals"?"active":""}`} onClick={()=>{ setView("approvals"); pushUrl("approvals"); }} style={{position:"relative"}}>
            ✅ Approvazioni
            {(()=>{ const n=projects.reduce((s,proj)=>{ const ed=proj.ed||{}; const fi=[...(ed.feedItems||[]),...(ed.contentItems||[])]; return s+fi.filter(f=>f.stato==="revisione"||f.stato==="semaforo").length; },0); return n>0?<span style={{position:"absolute",top:4,right:8,background:"var(--err)",color:"#fff",fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:99,minWidth:16,textAlign:"center"}}>{n}</span>:null; })()}
          </button>
          <button className={`sb-planner-btn ${view==="globalcal"?"active":""}`} onClick={()=>{ setView("globalcal"); pushUrl("globalcal"); }}>📅 Calendario Globale</button>
          <button className={`sb-planner-btn ${view==="planner"?"active":""}`} onClick={()=>{ setView("planner"); pushUrl("planner"); }}>🗓️ Team Planner</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {view==="wizard"&&(
          <ModuleErrorBoundary name="Nuovo Progetto" resetKey={view}>
            <WizardView onComplete={handleWizardComplete}/>
          </ModuleErrorBoundary>
        )}
        {view==="dashboard"&&(
          <ModuleErrorBoundary name="Dashboard" resetKey={view}>
            <Dashboard projects={projects} onSelect={handleSelect} onNew={addNewClient}/>
          </ModuleErrorBoundary>
        )}
        {view==="client"&&activeClient&&(
          <ModuleErrorBoundary name="Impostazioni Cliente" resetKey={activeClient.id}>
            <ClientSettingsView
              key={activeClient.id}
              client={activeClient}
              globalMeta={globalMeta}
              projects={projects}
              onUpdate={handleClientUpdate}
              onAddProject={addProjectToClient}
              onSelectProject={handleSelect}
              onClose={handleBack}
            />
          </ModuleErrorBoundary>
        )}
        {view==="portal"&&activeClient&&(
          <ModuleErrorBoundary name="Portale Cliente" resetKey={activeClient.id}>
            <ClientPortalPreview client={activeClient} projects={projects} onBack={()=>setView("client")} onUpdateProject={handleUpdate}/>
          </ModuleErrorBoundary>
        )}
        {view==="approvals"&&(
          <ModuleErrorBoundary name="Approvazioni" resetKey={view}>
            <div className="planner-view">
              <div className="pv-topbar">
                <button className="pv-back" onClick={()=>setView("dashboard")}>← Clienti</button>
                <div className="pv-name">✅ Approvazioni</div>
                <div style={{fontSize:11,color:"var(--ink4)",marginLeft:8}}>Dashboard globale · tutti i clienti</div>
              </div>
              <div style={{flex:1,overflow:"auto"}}>
                <GlobalApprovalsView
                  projects={projects}
                  clients={clients}
                  onUpdateProject={handleUpdate}
                  onGoToProject={pid=>{ handleSelect(pid); }}
                />
              </div>
            </div>
          </ModuleErrorBoundary>
        )}
        {view==="globalcal"&&(
          <ModuleErrorBoundary name="Calendario Globale" resetKey={view}>
            <div className="planner-view">
              <div className="pv-topbar">
                <button className="pv-back" onClick={()=>setView("dashboard")}>← Clienti</button>
                <div className="pv-name">📅 Calendario Globale</div>
                <div style={{fontSize:11,color:"var(--ink4)",marginLeft:8}}>Tutti i post · tutti i clienti</div>
              </div>
              <div style={{flex:1,overflow:"auto"}}>
                <GlobalCalendarView
                  projects={projects}
                  clients={clients}
                  onGoToProject={pid=>{ handleSelect(pid); setView("project"); }}
                  onUpdateProject={handleUpdate}
                />
              </div>
            </div>
          </ModuleErrorBoundary>
        )}
        {view==="planner"&&(
          <ModuleErrorBoundary name="Team Planner" resetKey={view}>
            <div className="planner-view">
              <div className="pv-topbar"><button className="pv-back" onClick={()=>setView("dashboard")}>← Clienti</button><div className="pv-name">Team Planner</div></div>
              <div style={{flex:1,overflow:"auto",padding:"20px 32px"}}><TeamPlannerNMS projects={projects}/></div>
            </div>
          </ModuleErrorBoundary>
        )}
        {view==="project"&&activeProj&&(
          <ModuleErrorBoundary name="Progetto" resetKey={activeProj.id}>
            <ProjectView project={activeProj} onUpdate={handleUpdate} onBack={handleBack} globalMeta={globalMeta} onPortal={()=>openPortal(activeProj.clientId)} client={clients.find(c=>c.id===activeProj.clientId)}/>
          </ModuleErrorBoundary>
        )}
      </div>
    </div>
  );
}

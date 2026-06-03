import { buildCtx, uid } from "./templateUtils";

export function createCoopRadenza() {
  const clientId = "demo-client-radenza";

  function post(data, n, titolo, pilastro, tipo, adv, urgente){
    const piats=adv?["instagram","facebook"]:["instagram","facebook"];
    const funnel={CoopPromo:"BOFU","FiorFiore":"MOFU","TerraTavola":"MOFU","Istituzionale":"TOFU","CoopSocial":"TOFU"}[pilastro.replace(/\s/g,"")]||"MOFU";
    const tipoMap={carosello:"carousel",reel:"reel",post:"post",story:"storia"};
    return {id:uid(),titolo:`${n}. ${titolo}`,tipo:tipoMap[tipo]||"post",pilastro,
      piattaforme:piats,stato:"bozza",data,time:"",funnel,
      immagineUrl:"",immagineBase64:"",videoUrl:"",
      membersAssigned:["paolone"],caption:"",cta:"",ctaLink:"",
      collaborazioni:"",tagMenzioni:"",comments:[],createdAt:Date.now(),
      _adv:adv||false,_urgente:urgente||false};
  }

  const feedItems=[
    post("2026-05-16","01","⏰ Urgenza Ciclo 2 — Carosello + Stories + Reel","CoopPromo","carosello",false,true),
    post("2026-05-19","02","Lancio Volantino Ciclo 3 (19→30 mag) + slide Fior Fiore","CoopPromo","carosello",false,false),
    post("2026-05-21","03","Mandorle di Avola IGP — Pesto alla siciliana","TerraTavola","carosello",false,false),
    post("2026-05-23","04","Pomodoro Pachino IGP — Caponata estiva","FiorFiore","carosello",false,false),
    post("2026-05-27","05","Reminder mid-promo Ciclo 3 — prodotti hero","CoopPromo","post",false,false),
    post("2026-05-28","06","Pecorino Siciliano DOP — Pasta alla Norma","TerraTavola","carosello",false,false),
    post("2026-05-30","07","⏰ Urgenza Ciclo 3 — Carosello + Stories + Reel","CoopPromo","carosello",false,true),
    post("2026-06-01","08","Pistacchio di Bronte DOP — Pesto di pistacchio","FiorFiore","carosello",false,false),
    post("2026-06-02","09","Festa della Repubblica 🇮🇹 — Carosello prodotti Fior Fiore","Istituzionale","carosello",false,false),
    post("2026-06-03","10","Lancio Volantino Ciclo 4 (1→10 giu) + slide Fior Fiore","CoopPromo","carosello",false,false),
    post("2026-06-05","11","Giornata Mondiale dell'Ambiente 🌍 — filiera corta siciliana","Istituzionale","post",false,false),
    post("2026-06-06","12","Pistacchio di Bronte DOP — storia del produttore","TerraTavola","carosello",false,false),
    post("2026-06-09","13","⏰ Urgenza Ciclo 4 — Carosello + Stories + Reel","CoopPromo","carosello",false,true),
    post("2026-06-11","14","Lancio Volantino Ciclo 5 (11→20 giu) + slide Fior Fiore","CoopPromo","carosello",false,false),
    post("2026-06-13","15","Festival Artisti di Strada — Niscemi 🎭 La Sicilia che si alza","Istituzionale","post",false,false),
    post("2026-06-14","16","Olio EVO Nocellara del Belìce DOP — Bruschetta siciliana","FiorFiore","carosello",false,false),
    post("2026-06-16","17","Capperi di Pantelleria IGP — Spaghetti alla pantesca","TerraTavola","carosello",false,false),
    post("2026-06-18","18","Lo Spesotto — obiettivo Reaction & Interazioni","CoopSocial","post",false,false),
    post("2026-06-20","19","⏰ Urgenza Ciclo 5 — Carosello + Stories + Reel","CoopPromo","carosello",true,true),
    post("2026-06-21","20","Solstizio d'estate ☀️ — prodotti freschi di stagione","Istituzionale","post",false,false),
    post("2026-06-22","21","Buono Se — obiettivo Reaction & Interazioni","CoopSocial","post",false,false),
    post("2026-06-23","22","Verde Speranza — Reaction & Interazioni (iniziativa solidale)","CoopSocial","post",false,false),
    post("2026-06-24","23","Miele delle Madonie — Dolci siciliani al miele","TerraTavola","carosello",false,false),
    post("2026-06-25","24","Fragole di Sicilia — Semifreddo estivo siciliano","FiorFiore","carosello",false,false),
    post("2026-06-26","25","Lancio Volantino Ciclo 6 (21→30 giu) + slide Fior Fiore","CoopPromo","carosello",true,false),
  ];

  const pedContent=`## Piano Editoriale — Maggio/Giugno 2026

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
| Coop Social | 3 | 12% |`;

  const radenzaIV={
    nome:"Coop Gruppo Radenza",
    settore:"Grande Distribuzione Organizzata — Supermercati Coop Sicilia",
    anno:"1990", sede:"Sicilia",
    sito:"coopgrupporadenza.it",
    descrizione:"Gruppo di supermercati Coop radicati in Sicilia. Presidio territoriale con forte attenzione ai prodotti locali DOP/IGP e alla linea premium Fior Fiore. Comunicazione su IG+FB con mix promo commerciale e contenuti identitari territoriali.",
    differenziale:"Prodotti siciliani DOP/IGP autentici (Mandorle Avola, Pecorino Siciliano, Pistacchio Bronte, Capperi Pantelleria) + Linea Fior Fiore premium + valori cooperativi Coop",
    target:"Famiglie siciliane 30-55 anni, clienti fedeli del punto vendita, appassionati di cucina e prodotti locali siciliani",
    b2x:"B2C — Retail GDO",
    canali_attuali:"Instagram, Facebook",
    advertising:"Meta Ads attivo dal Ciclo 6 (18 giugno 2026) — precedentemente solo organico",
    obiettivo1:"Bilanciare la comunicazione promo (Coop Promo) con contenuti identitari territoriali (Terra/Tavola, Fior Fiore) per costruire brand equity locale",
    obiettivo2:"Generare engagement emotivo con i contenuti Coop Social (Lo Spesotto, Buono Se, Verde Speranza)",
    budget:"ADV Meta da €1.200/mese dal Ciclo 6",
  };

  const radenzaPilastri = [
    {id:uid(),nome:"Coop Promo",   colore:"#E3001B", funnel:"BOFU", kpi:"Click · CTR ADV · Reach",   cadenza:"Lancio per ciclo · mai 2 consecutivi"},
    {id:uid(),nome:"Fior Fiore",   colore:"#D4A017", funnel:"MOFU", kpi:"Salvataggi · Views Reel · Commenti", cadenza:"1/sett. · mai adiacente a urgenza"},
    {id:uid(),nome:"Terra/Tavola", colore:"#1B5E20", funnel:"MOFU", kpi:"Salvataggi · Condivisioni · Commenti",cadenza:"1/sett. · alternato con Fior Fiore"},
    {id:uid(),nome:"Istituzionale",colore:"#0D4A78", funnel:"TOFU", kpi:"Reach · Condivisioni · Reazioni",   cadenza:"1-2/mese · rompe la griglia rossa"},
    {id:uid(),nome:"Coop Social",  colore:"#145932", funnel:"TOFU", kpi:"Reaction · Interazioni · Condivisioni",cadenza:"2-3/mese · mai 2 consecutivi"},
  ];
  const proj={
    id:"demo-radenza-cal",clientId,
    name:"Piano Editoriale Mag/Giu 2026",
    pilastri:radenzaPilastri,
    createdAt:Date.now(),
    interview:radenzaIV,context:buildCtx(radenzaIV),
    pdm:{sections:{}},pdc:{sections:{}},
    ed:{
      sections:{ped:{content:pedContent,versions:[]}},
      contentItems:[],campagne:[],calendarEvents:[],perfLogs:[],
      feedItems,ideas:[],collaboratori:[]
    },
    tasks:[
      {id:uid(),text:"Preparare grafiche Urgenza Ciclo 4 (9 giu)",priority:"high",tag:"Contenuti",assignee:"Hermes",done:false,createdAt:Date.now()},
      {id:uid(),text:"Testi carosello Pistacchio Bronte — storia produttore (6 giu)",priority:"high",tag:"Contenuti",assignee:"Luca",done:false,createdAt:Date.now()},
      {id:uid(),text:"Setup campagna ADV Meta per Ciclo 6 (dal 18 giu)",priority:"med",tag:"Tecnico",assignee:"Paolone",done:false,createdAt:Date.now()},
      {id:uid(),text:"Confermare con cliente materiali Festival Artisti Niscemi (13 giu)",priority:"med",tag:"Strategia",assignee:"Alberto",done:false,createdAt:Date.now()},
      {id:uid(),text:"Raccogliere dati Coop Verde Speranza per post 23 giu",priority:"low",tag:"Contenuti",assignee:"Luca",done:false,createdAt:Date.now()},
    ],
    milestones:[
      {id:uid(),name:"Calendario Maggio approvato",status:"done",date:"2026-05-16"},
      {id:uid(),name:"Ciclo 3 completato",status:"done",date:"2026-05-30"},
      {id:uid(),name:"Ciclo 4 — lancio volantino",status:"active",date:"2026-06-03"},
      {id:uid(),name:"ADV Meta attivo (Ciclo 6)",status:"pending",date:"2026-06-18"},
      {id:uid(),name:"Piano Giugno completato",status:"pending",date:"2026-06-26"},
    ],
    budget:{
      produzione:[
        {id:uid(),label:"Grafica social mensile (Hermes)",valore:800},
        {id:uid(),label:"Copywriting e caption (Luca)",valore:400},
        {id:uid(),label:"Art direction mensile (Alberto)",valore:300},
      ],
      ads:{linkedin:0,google:0,meta:1200,altri:0},
      note:"ADV Meta attiva dal Ciclo 6 (18 giu). Fino al Ciclo 5 comunicazione 100% organica."
    },
  };

  const client={
    id:clientId, nome:"Coop Gruppo Radenza",
    referente:"",email:"",settore:"GDO — Supermercati Coop Sicilia",
    pacchetto:"professional",dataInizio:"2026-05-16",
    social:{ig:"@coopgrupporadenza",fb:"Coop Gruppo Radenza",linkedin:"",tiktok:"",sito:"coopgrupporadenza.it"},
    meta:null,
    portal:{pin:"",mostraFeed:true,mostraPipeline:true},
    projectIds:[proj.id],createdAt:Date.now()
  };

  return {client,project:proj};
}

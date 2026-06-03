import { createEmptyEditorialState } from "../modules/editorial/editorialModel";
import { buildCtx, uid } from "./templateUtils";

// ─── KOSMETIKAL DEMO ──────────────────────────────────────────────────────────
export const KOSMETIKAL_IV = {
  nome:"Kosmetikal", settore:"Contract manufacturing cosmetico", anno:"2003",
  sede:"Pesaro, Marche", sito:"kosmetikal.it",
  descrizione:"Kosmetikal è un laboratorio cosmetico italiano specializzato in contract manufacturing B2B. Produce formule cosmetiche su specifica per brand terzi tramite due percorsi: Full Service (sviluppo formula + produzione + packaging + certificazioni PIF/CPNP) e White Label (400+ formule pronte, lotti da 10 kg). Gestisce l'intero ciclo internamente senza subappaltatori.",
  differenziale:"Library Advanced: 7 attivi biotech (esosomi, PDRN, peptidi, Spicule, biofermentati, Active Water, cellule staminali vegetali) con schede tecniche e dati di stabilità scaricabili PRIMA del contratto. Certificazione COSMOS Organic d'azienda — non solo di prodotto. Focalizzazione dichiarata: nessun integratore, nessun medical device, nessun brand cosmetico proprio che compete con i clienti.",
  valori:"Advanced before natural · Documenta, non dichiara · Focalizzazione come garanzia strutturale",
  target:"B2B esclusivo. 5 personas: P1 Brand Builder Avanzato (brand mid-size che vogliono attivi biotech verificabili), P2 Startup Visionaria (primo lancio, rischio zero), P3 Buyer Corporate Internazionale (conformità normativa come standard), P4 Buyer Bio Consapevole (COSMOS Organic d'azienda non di prodotto), P5 Cacciatore di Frontiera — target primario (R&D director che sa distinguere chi bluffa).",
  b2x:"B2B — contract manufacturing per brand cosmetici italiani e internazionali",
  mercati:"Italia (primario) · UK · Germania · Francia · Benelux (espansione piano 2026)",
  prodotti:"Full Service: dal brief al prodotto finito, un solo interlocutore, PIF+CPNP inclusi. White Label: 400+ formule pronte, lotti da 10 kg. Library Advanced: risorsa scaricabile — 7 schede tecniche attivi biotech con meccanismo d'azione, veicoli testati, dati di stabilità. Struttura: 1.600 mq, 30 collaboratori, 300.000 kg/anno, 8.000+ formulazioni testate dal 2003.",
  pricing:"Contract manufacturing a commessa. Lotti White Label da 10 kg (accessibile a startup). Budget marketing cliente per brand strutturati: produzione €3.723/mese + Ads €3.000/mese (scenario medio).",
  competitor:"Cosmoderma · Delta BKB · Reynaldi",
  diff_competitor:"Nessun competitor italiano mid-size pubblica schede tecniche verificabili degli attivi prima del contratto. La finestra competitiva è aperta: 12-18 mesi prima che altri la occupino. Kosmetikal ha la Library Advanced come asset esclusivo. COSMOS Organic d'azienda vs solo di prodotto (Reynaldi). Ciclo in-house vs subappaltatori non dichiarati (P3 pain point).",
  canali_attuali:"LinkedIn pagina aziendale (discontinua) · LinkedIn Silvye Malfarà CEO (non attivo) · Instagram (registro non allineato) · Facebook (solo derivato) · Sito web (da allineare al posizionamento Advanced)",
  advertising:"Nessuno attivo. Da attivare: LinkedIn Ads (CPLQ target <60€ — P5 e P3) + Meta Ads Instagram (CPLQ target <35€ — P2). Condizione: prima il piano organico in regime di crociera.",
  obiettivo1:"50 download/mese Library Advanced entro ottobre 2025. 10 lead qualificati/mese da organico LinkedIn entro dicembre 2025. 8 lead/mese entro dicembre 2026. 40% lead con documento tecnico pre-contatto entro dicembre 2026.",
  obiettivo2:"30% lead da mercati esteri entro dicembre 2026. Top 3 keyword 'laboratorio cosmetico esosomi'. 6 menzioni media di settore/anno. Engagement rate LinkedIn 5% entro dicembre 2026.",
  budget:"Scenario medio raccomandato: €3.000/mese Ads (35% LinkedIn + 30% Google + 20% Meta + 15% produzione esterna). Produzione contenuti: €3.723/mese. Totale annuale: ~€83.000.",
  problema:"Comunicazione precedente ancorata al biologico come identità primaria — non comunica il posizionamento Advanced Natural Cosmetic Lab. Nessun piano editoriale sistematico. Nessuna voce pubblica di Silvye Malfarà. La Library Advanced — il differenziale principale — non era mai stata comunicata pubblicamente. Il buyer qualificato non trovava prove materiali del payoff Advanced.",
  cosa_non_funziona:"Presenza social discontinua. Registro non allineato al posizionamento Industrial Biotech. Nessun contenuto tecnico sugli attivi biotech. Assenza totale di strategia di content marketing B2B sistematica.",
  team:"Silvye Malfarà (CEO — approvazione finale, 3-4h/sett) · Responsabile Marketing esterno (15-20h/sett) · Copywriter esterno (6-8h/sett) · Designer esterno (3-4h/sett) · Team R&S per validazione tecnica contenuti (2-3h/sett)",
  risorse:"Google Analytics 4 · Meta Business Suite · Metricool (analytics, non scheduling) · Canva Pro · LinkedIn Campaign Manager · Google Ads",
  note:"Payoff ufficiale: 'Advanced. Then natural.' Creative Territory: 'Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi.' Target primario comunicazione: P5 Cacciatore di Frontiera. Se la comunicazione convince P5, convince automaticamente anche P1, P3 e P2 — è la barra più alta. Cosmetica Biodiversa (marchio registrato) rinviata al piano comunicativo 2027.",
};

export const KOSMETIKAL_PDM = {
  sections: {
    executive_summary: { versions:[], content:`## Executive Summary

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
3. **Entro 31 dicembre 2025** — 5 landing page verticali live. Blog tecnico con 3 articoli. Almeno 2 menzioni media di settore confermate.`},

    posizionamento_usp: { versions:[], content:`## Posizionamento + USP

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
| Reynaldi | Media | Nessuna | Registro valoriale-ESG |`},

    obiettivi_smart: { versions:[], content:`## Obiettivi SMART

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
OC1 apre la porta (il buyer scopre le prove) → OC4 costruisce la relazione (il buyer inizia a fidarsi) → OC2 genera riconoscibilità spontanea → OC3 converte (il buyer compila il form) → OC5 scala internazionalmente. Investire solo su OC3 e OC5 senza costruire OC1 e OC4 produce lead in volume ma non in qualità.`},

    budget_media: { versions:[], content:`## Budget & Media Plan

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
3. **Copywriter e designer**: due profili singoli (più economico, più coordinamento) vs micro-agenzia B2B social (unico punto di contatto)`},
  }
};

export const KOSMETIKAL_PDC = {
  sections: {
    creative_territory: { versions:[], content:`## Creative Territory

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
| Infografiche | Max 3 colori, dati prominenti, fonte sempre citata | Dato grande + testo descrittivo piccolo | Icone decorative, molecole 3D |`},

    tone_of_voice: { versions:[], content:`## Tone of Voice — Regole Operative

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
- Parole vietate: innovativo · avanzato · all'avanguardia · eccellente · leader · premium (senza prova)`},

    message_house: { versions:[], content:`## Message House

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
| P4 Buyer Bio | P2 — Sistema tracciabile | P1 — Libreria esiste | Manifesto COSMOS Organic d'azienda |`},

    copy_strategy: { versions:[], content:`## Master Copy Strategy

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
- MN8: Competitor nominati nella comunicazione pubblica`},

    campaign_moments: { versions:[], content:`## Campaign Moments

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
| 7-8 | L'invito | "If you're looking for an Italian biotech lab — let's talk. A technical conversation." |`},
  }
};

export function createKosmetikal() {
  const clientId = "demo-client-kosmetikal";
  const proj = {
    id: "demo-kosmetikal",
    clientId,
    name: "Piano Marketing 2025-2026",
    createdAt: Date.now(),
    interview: KOSMETIKAL_IV,
    context: buildCtx(KOSMETIKAL_IV),
    pdm: KOSMETIKAL_PDM,
    pdc: KOSMETIKAL_PDC,
    pilastri:[], ed: createEmptyEditorialState(),
    tasks:[
      {id:uid(),text:"Sessione input con Silvye — 7 domande Appendice A",priority:"high",tag:"Strategia",assignee:"S + A",done:false,createdAt:Date.now()},
      {id:uid(),text:"Confermare lista 7 attivi biotech Library Advanced",priority:"high",tag:"Strategia",assignee:"S",done:false,createdAt:Date.now()},
      {id:uid(),text:"Briefing copywriter voce Winniefred",priority:"high",tag:"Contenuti",assignee:"A + T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Ottimizzazione profilo LinkedIn pagina Kosmetikal",priority:"med",tag:"Social",assignee:"T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Setup Meta Business Manager + Pixel Instagram",priority:"med",tag:"Tecnico",assignee:"T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Copy Strategy v1.1 — sezione prezzo completata",priority:"high",tag:"Strategia",assignee:"A",done:true,createdAt:Date.now()-86400000},
    ],
    milestones:[],
    budget:{ produzione:[{id:uid(),label:"Copywriter esterno",valore:1060},{id:uid(),label:"Designer esterno",valore:525},{id:uid(),label:"Fotografo (equiv. mensile)",valore:100}], ads:{linkedin:1050,google:900,meta:600,altri:450}, note:"" },
  };
  const client = {
    id: clientId,
    nome: "Kosmetikal",
    referente: "Silvye Malfarà", email: "silvye@kosmetikal.it", settore: "Contract manufacturing cosmetico",
    pacchetto: "professional", dataInizio: "2025-06-01",
    social: { ig:"@kosmetikal", fb:"", linkedin:"linkedin.com/company/kosmetikal", tiktok:"", sito:"kosmetikal.it" },
    meta: null,
    portal: { pin:"", mostraFeed:true, mostraPipeline:false },
    projectIds: [proj.id],
    createdAt: Date.now()
  };
  return { client, project: proj };
}


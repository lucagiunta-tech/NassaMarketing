import { DR } from "./promptRules";

export const P_PDC = {

obiettivi_comunicativi: c => `${DR}
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
INPUT: ${c}`,

contesto_comunicativo: c => `${DR}
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
INPUT: ${c}`,

creative_territory: c => `${DR}
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
INPUT: ${c}`,

tone_of_voice: c => `${DR}
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
INPUT: ${c}`,

message_house: c => `${DR}
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
INPUT: ${c}`,

copy_strategy: c => `${DR}
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
INPUT: ${c}`,

buyer_insights: c => `${DR}
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
INPUT: ${c}`,

architettura_canali: c => `${DR}
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
INPUT: ${c}`,

piano_editoriale_canale: c => `${DR}
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
INPUT: ${c}`,

campaign_moments: c => `${DR}
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
INPUT: ${c}`,

funnel_comunicativo: c => `${DR}
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
INPUT: ${c}`,

adv_social: c => `${DR}
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
INPUT: ${c}`,

partnership_editoriali: c => `${DR}
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
INPUT: ${c}`,

brand_taboos: c => `${DR}
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
INPUT: ${c}`,

content_repurposing: c => `${DR}
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
INPUT: ${c}`,
};

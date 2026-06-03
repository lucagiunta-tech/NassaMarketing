import { DR } from "./promptRules";

export const P_PDM = {

executive_summary: c => `${DR}
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
INPUT: ${c}`,

analisi_interna: c => `${DR}
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
INPUT: ${c}`,

analisi_esterna: c => `${DR}
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
INPUT: ${c}`,

swot: c => `${DR}
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
INPUT: ${c}`,

segmentazione: c => `${DR}
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
INPUT: ${c}`,

personas: c => `${DR}
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
INPUT: ${c}`,

posizionamento_usp: c => `${DR}
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
INPUT: ${c}`,

obiettivi_smart: c => `${DR}
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
INPUT: ${c}`,

marketing_mix_7p: c => `${DR}
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
INPUT: ${c}`,

canali_media_mix: c => `${DR}
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
INPUT: ${c}`,

value_proposition: c => `${DR}
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
INPUT: ${c}`,

funnel_strategy: c => `${DR}
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
INPUT: ${c}`,

pricing_strategy: c => `${DR}
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
INPUT: ${c}`,

piano_operativo: c => `${DR}
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
INPUT: ${c}`,

lead_nurturing: c => `${DR}
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
INPUT: ${c}`,

roadmap: c => `${DR}
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
INPUT: ${c}`,

tech_stack: c => `${DR}
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
INPUT: ${c}`,

kpi_dashboard: c => `${DR}
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
INPUT: ${c}`,

budget_media: c => `${DR}
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
INPUT: ${c}`,

cac_ltv: c => `${DR}
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
INPUT: ${c}`,
};

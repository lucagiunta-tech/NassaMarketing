# Marketing Studio Refactor v1 - Architecture Report

Data: 2026-05-28
Base: ultimo file di sviluppo `MarketingStudio (1).jsx`
Output corrente: `MarketingStudio_refactor_step38.jsx`

## Executive summary

Il refactor v1 trasforma il file originario monolitico in una struttura modulare più chiara, testabile e pronta per evoluzione. Il comportamento applicativo è stato preservato con un approccio conservativo: prima normalizzazione dati e compatibilità legacy, poi estrazione progressiva di servizi, prompt, template, componenti editoriali, componenti Meta, team, strategia, CSS e utility condivise.

Risultato principale: il componente principale non contiene più servizi esterni, prompt lunghi, CSS globale, demo data, grandi componenti editoriali, blocchi Meta, blocchi Team o logica export. Rimane un orchestratore React più leggero che compone moduli specializzati.

## Obiettivi raggiunti

- Data model editoriale normalizzato.
- Compatibilità legacy `contentItems` verso `feedItems`.
- Stati editoriali centralizzati e compatibili con alias storici.
- Storage sicuro con fallback `localStorage` e gestione errori strutturata.
- Validazione `PostFormModal` estratta e testata.
- Servizi AI, Meta, Storage ed Export separati dalla UI.
- Prompt PdM/PdC separati dalla UI.
- Template demo separati dalla UI.
- CSS globale separato in `styles/appStyles.js`.
- Componenti editoriali principali estratti.
- Componenti team/meta/strategy estratti.
- Barrel exports introdotti.
- Utility comuni per markdown e formattazione introdotte.
- Test minimi automatici aggiunti.

## Struttura finale v1

```txt
MarketingStudio_refactor_step38.jsx
utils/
  markdown.js
  formatters.js
  index.js
styles/
  appStyles.js
  index.js
modules/
  strategy/
    CommunicationBridge.jsx
    StrategicSectionContent.jsx
    index.js
  meta/
    GlobalMetaConnect.jsx
    index.js
  team/
    CollaboratoriModal.jsx
    TeamPlannerNMS.jsx
    teamModel.js
    index.js
  overview/
    CreatorDatabase.jsx
    index.js
  editorial/
    editorialTheme.js
    CampaignExecED.jsx
    StrategyUpdateED.jsx
    MonthlyReviewED.jsx
    PerformanceLogED.jsx
    ContentTrackerED.jsx
    PublishingHubED.jsx
    MetaPublishModal.jsx
    PostFormModal.jsx
    EditorialeHome.jsx
    CalendarSimpleED.jsx
    FeedPreviewGrid.jsx
    FunnelViewED.jsx
    IdeasBoard.jsx
    ListaView.jsx
    editorialModel.js
    postValidation.js
    index.js
services/
  storageService.js
  aiService.js
  metaService.js
  exportService.js
  index.js
prompts/
  promptRules.js
  pdmPrompts.js
  pdcPrompts.js
  index.js
templates/
  kosmetikalTemplate.js
  coopRadenzaTemplate.js
  templateUtils.js
  index.js
tests/
  run_unit_tests.cjs
check_step38.cjs
package.json
```

## Moduli e responsabilità

### `modules/editorial/editorialModel.js`
Contiene il cuore del modello editoriale: tipi feed, piattaforme, stati, pipeline, normalizzazioni, `getEditorialPosts(project)`, `applyEdUpdate(project, updater)` e migrazioni workspace.

### `modules/editorial/postValidation.js`
Contiene la validazione pura del post form: URL, data, orario, piattaforme, tipo, stato, warning editoriali e blocchi al salvataggio.

### `modules/editorial/editorialTheme.js`
Centralizza colori e helper tema dell'area editoriale: pillar colors, idea status colors, fallback.

### `services/storageService.js`
Gestisce load/save workspace, fallback `localStorage`, serializzazione errori e migrazione automatica.

### `services/aiService.js`
Gestisce chiamate AI, retry, errori strutturati e wrapper safe.

### `services/metaService.js`
Gestisce Meta OAuth, Instagram publish, Facebook publish e wrapper safe.

### `services/exportService.js`
Gestisce export HTML/markdown/presentazioni e download file.

### `prompts/*`
Contiene prompt PdM/PdC e regole dati, separati dalla UI.

### `templates/*`
Contiene demo/template Kosmetikal e Coop Radenza, più helper condivisi.

### `styles/appStyles.js`
Contiene `APP_CSS` e `APP_THEME_TOKENS`.

### `utils/*`
Contiene rendering markdown e formattazioni condivise.

## Migliorie critiche rispetto al file originale

1. **Riduzione rischio regressioni dati**  
   Gli update editoriali passano da helper normalizzati invece di mutare direttamente `project.ed`.

2. **Compatibilità legacy**  
   `contentItems` non viene perso: viene letto e migrato verso `feedItems`.

3. **Error handling storage**  
   Gli errori di salvataggio non vengono più silenziati.

4. **Validazione form**  
   `PostFormModal` blocca dati incoerenti e mostra warning non bloccanti.

5. **Servizi separati**  
   AI, Meta, Storage ed Export non vivono più nel componente UI.

6. **Prompt separati**  
   Il file principale non contiene più grandi blocchi testuali PdM/PdC.

7. **CSS separato**  
   Il tema globale non appesantisce più il componente principale.

8. **Test minimi**  
   Sono presenti controlli automatici per modelli, servizi e import locali.

## Stato qualità tecnica

Il pacchetto Step 38 include:

- controllo sintassi JS/JSX;
- controllo import locali;
- test unit minimi.

Risultato atteso:

```txt
syntax/import diagnostics 0
Unit tests: 27/27 passed
Step 38 check OK - syntax/imports and unit tests passed.
```

## Rischi residui

- La separazione modulare è validata sintatticamente, ma serve test manuale nel browser reale.
- `window.storage`, `window.ai`, OAuth e Meta publish dipendono dall'ambiente di runtime.
- Alcune costanti tema o helper minori potrebbero ancora essere duplicati in componenti non coperti da test profondi.
- La parte AI usa ancora un servizio client-side; per produzione è consigliabile backend/API route.
- La parte Meta dovrebbe idealmente spostare gestione token e refresh su backend.

## Raccomandazione finale

Il refactor v1 è pronto come base per integrazione in repository. Il passaggio successivo non dovrebbe essere una nuova feature, ma una fase di integrazione controllata:

1. creare branch dedicato;
2. copiare la struttura modulare;
3. eseguire `npm run check`;
4. testare manualmente i flussi principali;
5. risolvere eventuali mismatch con l'ambiente reale;
6. solo dopo procedere con backend/API/auth.

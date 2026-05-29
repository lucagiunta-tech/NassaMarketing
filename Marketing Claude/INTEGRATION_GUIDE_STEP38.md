# Marketing Studio Refactor v1 - Integration Guide

Questa guida spiega come integrare il pacchetto Step 38 in un progetto React/Vite/Next esistente.

## 1. Creare un branch dedicato

```bash
git checkout -b refactor/marketing-studio-modulare-v1
```

## 2. Copiare i file

Copiare nel progetto:

```txt
MarketingStudio_refactor_step38.jsx
modules/
services/
prompts/
templates/
styles/
utils/
tests/
package.json
check_step38.cjs
```

Se nel repository esiste già una struttura `src/`, collocare tutto sotto `src/` e aggiornare gli import relativi se necessario.

Esempio consigliato:

```txt
src/
  MarketingStudio.jsx
  modules/
  services/
  prompts/
  templates/
  styles/
  utils/
```

Poi rinominare:

```txt
MarketingStudio_refactor_step38.jsx -> MarketingStudio.jsx
```

## 3. Installare dipendenze di check

Il check usa TypeScript come parser/transpiler. Se non è già presente:

```bash
npm install -D typescript
```

## 4. Eseguire i controlli

```bash
npm test
npm run check
```

Risultato atteso:

```txt
Unit tests: 27/27 passed
Step 38 check OK - syntax/imports and unit tests passed.
```

## 5. Verificare gli alias/import

Il pacchetto usa import relativi, ad esempio:

```jsx
import { safeLoadWorkspace, safeSaveWorkspace } from './services';
import { FeedPreviewGrid } from './modules/editorial';
```

Se il file viene spostato in `src/components/`, aggiornare i percorsi o configurare alias.

## 6. Ambiente storage

`services/storageService.js` usa:

1. `window.storage`, se disponibile;
2. `window.localStorage`, come fallback;
3. errore strutturato se nessuno storage è disponibile.

In produzione, valutare sostituzione con backend/database.

## 7. Ambiente AI

`services/aiService.js` è separato dalla UI. Se oggi il progetto usa un endpoint diverso da Anthropic client-side, modificare solo questo file.

Raccomandato per produzione:

```txt
frontend -> /api/ai-generate -> provider AI
```

Non lasciare API key sensibili nel bundle frontend.

## 8. Ambiente Meta

`services/metaService.js` contiene OAuth popup e publishing. Per produzione, la gestione token dovrebbe stare lato backend:

```txt
frontend -> /api/meta/publish -> Meta Graph API
```

Lo step corrente mantiene compatibilità funzionale, ma non è ancora una hardening security completa.

## 9. Test manuali obbligatori

Dopo `npm run check`, testare nel browser:

- creazione progetto demo Kosmetikal;
- creazione progetto demo Coop Radenza;
- salvataggio workspace;
- ricaricamento pagina;
- creazione post;
- validazione post con errore URL;
- calendario drag/drop;
- lista editoriale;
- feed preview;
- ideas board;
- publishing hub;
- modal Meta publish senza token;
- export sezione;
- generazione AI con ambiente configurato;
- portale/client preview se usato.

## 10. Strategia di rollout consigliata

1. Integrare il pacchetto in branch.
2. Eseguire check automatici.
3. Testare manualmente demo data.
4. Testare con un progetto reale esistente.
5. Tenere una copia del vecchio workspace/storage.
6. Rilasciare solo dopo verifica salvataggio e migrazione `contentItems -> feedItems`.

## 11. Rollback

Tenere il file originale `MarketingStudio (1).jsx` nel branch precedente. In caso di regressione critica:

```bash
git checkout main -- src/MarketingStudio.jsx
```

oppure ripristinare il pacchetto precedente Step 37/36.

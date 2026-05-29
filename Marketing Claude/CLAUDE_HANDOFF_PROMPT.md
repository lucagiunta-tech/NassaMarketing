# Prompt per Claude — MarketingStudio Refactor v1

Ti carico un pacchetto ZIP chiamato `MarketingStudio_Claude_Handoff_v1.zip`. È il risultato di un refactor progressivo di un file React/JSX monolitico chiamato originariamente `MarketingStudio.jsx`.

## Ruolo
Agisci come senior React engineer / product engineer. Devi aiutarmi a integrare, verificare e far girare questo progetto in un ambiente React reale, senza riscriverlo da zero.

## Contesto
Il progetto è una web app interna per Nassa Studio: uno studio marketing strategico che gestisce clienti, piani marketing, piani comunicazione, piano editoriale, approvazioni, publishing social, AI generation, export e portale operativo.

Il refactor ha trasformato il monolite in questa struttura:

```txt
MarketingStudio_refactor_step38.jsx
utils/
styles/
modules/
  strategy/
  meta/
  team/
  overview/
  editorial/
services/
prompts/
templates/
tests/
```

## Prima cosa da fare
Leggi questi file nell'ordine:

1. `README_STEP38.md`
2. `ARCHITECTURE_REPORT_STEP38.md`
3. `INTEGRATION_GUIDE_STEP38.md`
4. `MANUAL_QA_CHECKLIST_STEP38.md`
5. `RISK_REGISTER_STEP38.md`
6. `MarketingStudio_refactor_step38.jsx`
7. `package.json`
8. `check_step38.cjs`
9. `tests/run_unit_tests.cjs`

Poi ispeziona le cartelle:

```txt
modules/
services/
prompts/
templates/
styles/
utils/
```

## Obiettivo immediato
Portare questo pacchetto a girare in una app React/Vite reale.

Voglio che tu:

1. Verifichi la struttura del progetto.
2. Mi dica dove copiare i file in `src/`.
3. Mi dica come rinominare `MarketingStudio_refactor_step38.jsx` in un entry file reale, per esempio `MarketingStudio.jsx` o `App.jsx`.
4. Controlli gli import relativi.
5. Esegua o simuli il comando:

```bash
npm run check
```

6. Se trovi errori, correggili con patch piccole e motivate.
7. Non cambiare architettura senza spiegarmi perché.
8. Non eliminare feature.
9. Non riscrivere tutto in TypeScript, Next.js o backend se non te lo chiedo.
10. Mantieni JSX/React vanilla il più possibile.

## Regole tecniche
- Mantieni i moduli già estratti.
- Non riaccorpare il monolite.
- Non spostare servizi/prompt/template senza motivo.
- Conserva i nomi dei componenti pubblici, salvo correzioni necessarie.
- Prima correggi build/import/runtime; poi eventualmente proponi migliorie.
- Evita refactor estetici non necessari.
- Mantieni UI e testi in italiano.
- Rispetta l'attuale struttura dati: `clients`, `projects`, `project.ed`, `feedItems`, `contentItems` legacy, `pdm.sections`, `pdc.sections`.

## Note importanti
Il pacchetto contiene già test minimi:

```txt
syntax/import diagnostics 0
Unit tests: 27/27 passed
Step 38 check OK
```

Quindi il tuo compito non è rifare il refactor, ma aiutarmi a integrarlo e renderlo eseguibile in ambiente reale.

## Priorità di lavoro
Lavora in questo ordine:

### Fase 1 — integrazione locale
- Crea/usa una app Vite React.
- Copia i file nella cartella `src/` mantenendo struttura moduli.
- Sistema entrypoint e import.
- Avvia build/dev server.

### Fase 2 — smoke test manuale
Verifica:
- avvio app;
- caricamento demo Kosmetikal;
- caricamento demo Coop Radenza;
- navigazione PdM/PdC/Editoriale;
- apertura PostFormModal;
- lista/calendario/feed;
- IdeasBoard;
- export;
- storage/localStorage fallback.

### Fase 3 — correzioni conservative
Se trovi problemi:
- indica file e riga;
- spiega impatto;
- proponi patch minima;
- applica solo la patch necessaria.

### Fase 4 — hardening successivo
Solo dopo che gira:
- proponi cosa spostare backend-side: AI, Meta OAuth/token, storage reale;
- proponi eventuale Supabase/Firebase/API layer;
- proponi test E2E minimi.

## Output che voglio da te
Inizia rispondendo con:

1. Conferma di aver letto i file principali.
2. Sintesi architettura in 8-12 righe.
3. Lista dei primi controlli da fare.
4. Patch o istruzioni precise per far girare il progetto.

Poi procedi in modo operativo.

## Vincolo principale
Non devi trattarlo come codice da buttare. Devi trattarlo come un refactor v1 già completato e portarlo verso una versione eseguibile e production-ready per Nassa Studio.

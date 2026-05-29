# Risk Register - Step 38

## R1 - Runtime environment non standard

**Rischio:** l'ambiente reale potrebbe non esporre `window.storage` o `window.ai` come previsto.  
**Impatto:** salvataggio o AI non disponibili.  
**Mitigazione:** fallback localStorage per storage; backend/API route per AI.

## R2 - Token Meta client-side

**Rischio:** token e publishing Meta lato client non sono ideali per produzione.  
**Impatto:** sicurezza e refresh token fragili.  
**Mitigazione:** spostare OAuth callback, token storage e publish su backend.

## R3 - Migrazione dati legacy

**Rischio:** progetti reali potrebbero avere forme dati non viste nei demo.  
**Impatto:** contenuti non visibili o mapping errato.  
**Mitigazione:** backup storage prima del rollout; test con progetti reali; migliorare `migrateWorkspaceData()` se emergono casi.

## R4 - Duplicati residui UI

**Rischio:** alcune costanti minori potrebbero essere ancora duplicate nei componenti.  
**Impatto:** manutenzione più difficile, ma basso rischio runtime.  
**Mitigazione:** cleanup incrementale con test.

## R5 - Test non coprono DOM reale

**Rischio:** i test attuali sono unit/syntax, non e2e browser.  
**Impatto:** possibili regressioni UI non intercettate.  
**Mitigazione:** aggiungere Playwright/Cypress per smoke test.

## R6 - Export HTML/PDF dipendente da browser

**Rischio:** download e rendering HTML possono variare per browser.  
**Impatto:** export non uniforme.  
**Mitigazione:** test manuale Chrome/Safari; eventuale export server-side per PDF.

## R7 - AI output non strutturato

**Rischio:** modelli AI possono produrre markdown/JSON inatteso.  
**Impatto:** output incompleto o fallback.  
**Mitigazione:** validazione output AI e fallback già introdotti in export; estendere pattern ad altri generatori.

# Manual QA Checklist - Step 38

## Startup

- [ ] L'app si avvia senza errori console bloccanti.
- [ ] La sidebar appare correttamente.
- [ ] `APP_CSS` viene caricato.
- [ ] Il tema visuale appare coerente con la versione precedente.

## Workspace / Storage

- [ ] Il primo load senza dati non rompe l'app.
- [ ] La creazione progetto demo salva correttamente.
- [ ] Dopo reload, dati e progetto attivo restano presenti.
- [ ] Se storage fallisce, compare stato errore storage.

## Progetti demo

- [ ] Demo Kosmetikal viene creata correttamente.
- [ ] Demo Coop Radenza viene creata correttamente.
- [ ] I template popolano cliente e progetto.

## PdM / PdC

- [ ] Le sezioni PdM si aprono.
- [ ] Le sezioni PdC si aprono.
- [ ] Editing manuale sezione funziona.
- [ ] Versioning sezione funziona.
- [ ] Export sezione funziona.
- [ ] Communication Bridge su Obiettivi SMART funziona.
- [ ] Strategic Cascade Banner legge il bridge nel modulo editoriale.

## Editoriale Home

- [ ] Le statistiche si calcolano.
- [ ] Post Overview filtra correttamente.
- [ ] On the Radar apre creazione contenuto.
- [ ] Upcoming posts apre modifica contenuto.

## Post Form

- [ ] Creazione post con dati validi salva.
- [ ] Post senza titolo/caption viene bloccato.
- [ ] URL non valido viene bloccato.
- [ ] Warning CTA senza link appare ma non blocca.
- [ ] Upload immagine funziona.
- [ ] Upload video funziona.
- [ ] Commenti interni funzionano.

## Lista / Calendario / Feed

- [ ] Lista mostra post e idee.
- [ ] Filtri temporali lista funzionano.
- [ ] Calendario mensile mostra post.
- [ ] Drag/drop calendario cambia data.
- [ ] Feed preview mostra grid/reels/storie.
- [ ] Drag/drop feed preview cambia ordine.

## Ideas Board

- [ ] Creazione idea funziona.
- [ ] Modifica idea funziona.
- [ ] Drag/drop idea tra colonne funziona.
- [ ] Conversione idea -> post apre PostFormModal.
- [ ] Generazione AI idee gestisce errore se AI non configurata.

## Publishing / Meta

- [ ] GlobalMetaConnect mostra stato disconnesso.
- [ ] OAuth popup viene invocato.
- [ ] PublishingHub mostra contenuti pronti.
- [ ] PublishModal si apre.
- [ ] Senza token Meta mostra errore gestibile.
- [ ] Dopo publish simulato/riuscito stato post diventa pubblicato.

## Performance / Review / Strategy

- [ ] PerformanceLog salva KPI.
- [ ] Delta metriche appare correttamente.
- [ ] MonthlyReview genera/edita contenuto.
- [ ] StrategyUpdate genera/edita contenuto.
- [ ] Ciclo & Pivot genera/edita contenuto.

## Team / Collaboratori

- [ ] CollaboratoriModal si apre.
- [ ] Import team planner funziona.
- [ ] CreatorDatabase crea/modifica/elimina creator.
- [ ] TeamPlannerNMS mostra settimana corretta.
- [ ] TeamPlannerNMS salva task settimanali.

## Export

- [ ] Export HTML funziona.
- [ ] Export Markdown funziona.
- [ ] Export presentation genera fallback se AI output non strutturato.

## Regression smoke test

- [ ] Nessuna pagina bianca.
- [ ] Nessun errore console critico.
- [ ] Nessun dato cancellato dopo salvataggio.
- [ ] Navigazione tab principali stabile.

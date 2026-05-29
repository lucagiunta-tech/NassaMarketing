# MarketingStudio Refactor — Step 37

Step 37 consolida i duplicati residui e introduce moduli condivisi per tema editoriale, markdown e formattazione.

## Nuovi moduli

```txt
modules/editorial/editorialTheme.js
utils/markdown.js
utils/formatters.js
utils/index.js
```

## Cosa è stato centralizzato

- `PILASTRO_COLORS`
- `IDEA_COLS`
- `getPillarColor()`
- `getIdeaStatus()`
- `renderMarkdown()` / `renderMd()`
- `escapeHtml()`
- formatter metriche/date/delta

## Componenti aggiornati

- `FeedPreviewGrid.jsx`
- `ListaView.jsx`
- `CalendarSimpleED.jsx`
- `IdeasBoard.jsx`
- `PostFormModal.jsx`
- `FunnelViewED.jsx`
- `MonthlyReviewED.jsx`
- `StrategyUpdateED.jsx`
- `MarketingStudio_refactor_step37.jsx`

## Check

```txt
syntax/import diagnostics 0
Unit tests: 27/27 passed
Step 37 check OK - syntax/imports and unit tests passed.
```

## Comandi

```bash
npm test
npm run check
```

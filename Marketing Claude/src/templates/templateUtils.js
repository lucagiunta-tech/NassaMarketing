// Shared helpers for demo/template data.
export const uid = () => Math.random().toString(36).slice(2,9);

export function buildCtx(iv) {
  const lines = [
    `AZIENDA: ${iv.nome||"N/A"}`,
    iv.settore && `SETTORE: ${iv.settore}`,
    iv.anno && `FONDAZIONE: ${iv.anno}`,
    iv.sede && `SEDE: ${iv.sede}`,
    iv.sito && `SITO: ${iv.sito}`,
    iv.descrizione && `COSA FA: ${iv.descrizione}`,
    iv.differenziale && `DIFFERENZIALE: ${iv.differenziale}`,
    iv.valori && `VALORI: ${iv.valori}`,
    iv.target && `TARGET: ${iv.target}`,
    iv.b2x && `MODELLO: ${iv.b2x}`,
    iv.mercati && `MERCATI: ${iv.mercati}`,
    iv.prodotti && `PRODOTTI/SERVIZI: ${iv.prodotti}`,
    iv.pricing && `PRICING: ${iv.pricing}`,
    iv.competitor && `COMPETITOR: ${iv.competitor}`,
    iv.diff_competitor && `DIFFERENZIALE VS COMPETITOR: ${iv.diff_competitor}`,
    iv.canali_attuali && `CANALI ATTUALI: ${iv.canali_attuali}`,
    iv.advertising && `ADVERTISING: ${iv.advertising}`,
    iv.obiettivo1 && `OBIETTIVO PRIMARIO: ${iv.obiettivo1}`,
    iv.obiettivo2 && `OBIETTIVO SECONDARIO: ${iv.obiettivo2}`,
    iv.budget && `BUDGET MARKETING: ${iv.budget}`,
    iv.problema && `PROBLEMA PRINCIPALE: ${iv.problema}`,
    iv.cosa_non_funziona && `COSA NON FUNZIONA: ${iv.cosa_non_funziona}`,
    iv.team && `TEAM MARKETING: ${iv.team}`,
    iv.risorse && `RISORSE DISPONIBILI: ${iv.risorse}`,
    iv.origini && `ORIGINI: ${iv.origini}`,
    iv.svolte && `SVOLTE CHIAVE: ${iv.svolte}`,
    iv.valori_maturati && `VALORI MATURATI: ${iv.valori_maturati}`,
    iv.note && `NOTE AGGIUNTIVE: ${iv.note}`,
  ].filter(Boolean).join("\n");
  return lines;
}

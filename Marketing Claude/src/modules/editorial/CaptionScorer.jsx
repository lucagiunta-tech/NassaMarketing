/**
 * CaptionScorer.jsx
 * Real-time caption quality scorer — ispirato a CoSchedule Social Message Optimizer.
 *
 * Valuta la caption su 6 dimensioni e produce un punteggio 0-100 con suggerimenti specifici.
 * Si integra nel PostFormModal e nel PublishingHubED.
 *
 * Props:
 *  caption   — stringa da valutare (aggiornata live)
 *  platforms — array di id piattaforma (["instagram", "facebook", ...])
 *  project   — per estrarre parole vietate ToV
 *  compact   — boolean, vista ridotta per Publishing Hub
 */

import { useMemo, useState } from "react";

// ─── REGOLE PER PIATTAFORMA ───────────────────────────────────────────────────
const PLAT_RULES = {
  instagram: {
    name: "Instagram",
    icon: "📸",
    lenMin: 100, lenOpt: 220, lenMax: 350,
    hashMin: 5,  hashOpt: 8,  hashMax: 12,
    emojiMax: 4,
  },
  facebook: {
    name: "Facebook",
    icon: "📘",
    lenMin: 80,  lenOpt: 180, lenMax: 280,
    hashMin: 1,  hashOpt: 3,  hashMax: 5,
    emojiMax: 3,
  },
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    lenMin: 150, lenOpt: 250, lenMax: 400,
    hashMin: 3,  hashOpt: 5,  hashMax: 7,
    emojiMax: 2,
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    lenMin: 60,  lenOpt: 150, lenMax: 250,
    hashMin: 3,  hashOpt: 6,  hashMax: 10,
    emojiMax: 5,
  },
  default: {
    name: "Generico",
    icon: "📝",
    lenMin: 80,  lenOpt: 200, lenMax: 350,
    hashMin: 2,  hashOpt: 5,  hashMax: 10,
    emojiMax: 4,
  },
};

// Parole vietate Nassa (da Codice Nassa + Copy Strategy)
const PAROLE_VIETATE_NASSA = [
  "qualità","eccellenza","unico","unicità","a 360","da oltre",
  "professionalità","cortesia","punto di riferimento","leader di settore",
  "soluzioni all-in-one","esperienza pluriennale","nel settore",
  "competenza","passione","dedizione","innovativo","all'avanguardia",
];

const HOOK_PATTERNS = [
  /\?$/m,                                      // domanda
  /^\d+/m,                                     // inizia con numero
  /^(Sai|Lo sapevi|Scopri|Immagina|Pensa|Dimmi|Guarda|Ecco)/im,
  /^[""«][^""»]+[""»]/m,                       // citazione/quote
];

const CTA_PATTERNS = [
  /link in bio/i, /scopri di più/i, /visita/i,
  /acquista/i, /prenota/i, /scrivici/i, /contattaci/i,
  /commenta/i, /tagga/i, /condividi/i, /salva/i,
  /clicca/i, /➡|👆|🔗|👇/,
];

const EMOJI_RE = /\p{Emoji}/gu;
const HASH_RE  = /#\w+/g;

// ─── SCORER FUNCTION ─────────────────────────────────────────────────────────
function scoreCaption(caption, platforms, extraBanned = []) {
  if (!caption?.trim()) return null;

  // Piattaforma primaria per le regole
  const platId = (platforms || [])[0] || "default";
  const rules  = PLAT_RULES[platId] || PLAT_RULES.default;

  const text   = caption.trim();
  const words  = text.split(/\s+/).filter(Boolean);
  const chars  = text.replace(/#\w+\s*/g, "").trim().length; // senza hashtag
  const hashes = (text.match(HASH_RE) || []);
  const emojis = (text.match(EMOJI_RE) || []);
  const firstLine = text.split("\n")[0] || text.slice(0, 80);

  const checks = {};

  // 1. LUNGHEZZA (0-20 pts)
  if (chars >= rules.lenMin && chars <= rules.lenMax) {
    const ideal = chars >= rules.lenOpt - 40 && chars <= rules.lenOpt + 60;
    checks.lunghezza = {
      score: ideal ? 20 : 14,
      label: "Lunghezza",
      detail: `${chars} car. · ottimale ${rules.lenOpt}`,
      ok: true,
      hint: ideal ? null : `Per ${rules.name} è ottimale intorno a ${rules.lenOpt} caratteri (testo, senza hashtag).`,
    };
  } else if (chars < rules.lenMin) {
    checks.lunghezza = {
      score: Math.round((chars / rules.lenMin) * 10),
      label: "Lunghezza",
      detail: `${chars} car. — troppo corta`,
      ok: false,
      hint: `Caption troppo breve per ${rules.name}. Aggiungi almeno ${rules.lenMin - chars} caratteri.`,
    };
  } else {
    checks.lunghezza = {
      score: 8,
      label: "Lunghezza",
      detail: `${chars} car. — troppo lunga`,
      ok: false,
      hint: `Caption troppo lunga per ${rules.name}. Tagliala sotto i ${rules.lenMax} caratteri.`,
    };
  }

  // 2. HOOK PRIMA RIGA (0-20 pts)
  const hasHook = HOOK_PATTERNS.some(re => re.test(firstLine));
  checks.hook = {
    score: hasHook ? 20 : 4,
    label: "Hook prima riga",
    detail: hasHook ? "Presente" : "Mancante",
    ok: hasHook,
    hint: hasHook ? null : "La prima riga deve catturare subito: usa una domanda, un numero, o un'affermazione forte. La seconda riga non si vede prima del \"Leggi di più\".",
  };

  // 3. CTA (0-20 pts)
  const hasCta = CTA_PATTERNS.some(re => re.test(text));
  checks.cta = {
    score: hasCta ? 20 : 5,
    label: "CTA",
    detail: hasCta ? "Presente" : "Mancante",
    ok: hasCta,
    hint: hasCta ? null : "Aggiungi una call-to-action esplicita. Es.: \"Scopri nel link in bio 👆\", \"Scrivici in DM\", \"Salva questo post\".",
  };

  // 4. HASHTAG (0-20 pts)
  const hn = hashes.length;
  const hashOk = hn >= rules.hashMin && hn <= rules.hashMax;
  const hashPerfect = hn >= rules.hashMin && hn <= rules.hashOpt;
  checks.hashtag = {
    score: hashPerfect ? 20 : hashOk ? 14 : hn === 0 ? 0 : 7,
    label: "Hashtag",
    detail: `${hn} hashtag · ottimale ${rules.hashMin}–${rules.hashOpt}`,
    ok: hashOk,
    hint: hn === 0
      ? `Nessun hashtag! Per ${rules.name} usa almeno ${rules.hashMin}.`
      : hn > rules.hashMax
      ? `Troppi hashtag (${hn}). Per ${rules.name} il massimo consigliato è ${rules.hashMax}.`
      : hn < rules.hashMin
      ? `Pochi hashtag (${hn}). Aggiungi almeno ${rules.hashMin - hn} hashtag rilevanti.`
      : null,
  };

  // 5. EMOJI (0-10 pts)
  const en = emojis.length;
  const emojiOk = en <= rules.emojiMax;
  checks.emoji = {
    score: en === 0 ? 8 : emojiOk ? 10 : Math.max(0, 10 - (en - rules.emojiMax) * 2),
    label: "Emoji",
    detail: `${en} emoji · max ${rules.emojiMax}`,
    ok: emojiOk,
    hint: en > rules.emojiMax
      ? `Troppi emoji (${en}) per un profilo business su ${rules.name}. Riduci a max ${rules.emojiMax}.`
      : null,
  };

  // 6. PAROLE VIETATE ToV (0-10 pts)
  const allBanned = [...PAROLE_VIETATE_NASSA, ...extraBanned];
  const found = allBanned.filter(w => new RegExp(`\\b${w}`, "i").test(text));
  checks.tov = {
    score: found.length === 0 ? 10 : Math.max(0, 10 - found.length * 3),
    label: "ToV Nassa",
    detail: found.length === 0 ? "Nessuna violazione" : `${found.length} parola/e vietata/e`,
    ok: found.length === 0,
    hint: found.length > 0
      ? `Parole vietate trovate: ${found.map(w => `"${w}"`).join(", ")}. Rimuovile dal Copy Strategy.`
      : null,
  };

  const total = Object.values(checks).reduce((s, c) => s + c.score, 0);
  const hints = Object.values(checks).filter(c => c.hint).map(c => c.hint);

  return { checks, total, platRules: rules, hints };
}

// ─── SCORE COLOR ─────────────────────────────────────────────────────────────
function scoreColor(n) {
  if (n >= 80) return "var(--ok)";
  if (n >= 55) return "var(--warn)";
  return "var(--err)";
}
function scoreLabel(n) {
  if (n >= 80) return "Ottima";
  if (n >= 65) return "Buona";
  if (n >= 50) return "Discreta";
  if (n >= 35) return "Da migliorare";
  return "Insufficiente";
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function CaptionScorer({ caption, platforms, project, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);

  // Extract banned words from project Copy Strategy
  const extraBanned = useMemo(() => {
    const cs = project?.pdc?.sections?.brand_taboos?.content ||
               project?.pdm?.sections?.copy_strategy?.content || "";
    const noMatch = cs.match(/(?:parole\s*no|vietate|evitare|❌|non usare)[^\n]*\n((?:[^\n]+\n){1,8})/i);
    if (!noMatch) return [];
    return noMatch[1]
      .split("\n")
      .map(l => l.replace(/^[-*·•❌\s]+/, "").trim())
      .filter(l => l.length > 1 && l.length < 50);
  }, [project]);

  const result = useMemo(
    () => scoreCaption(caption, platforms, extraBanned),
    [caption, platforms, extraBanned]
  );

  if (!caption?.trim()) {
    return (
      <div className="cs-empty">
        <span className="cs-empty-icon">✦</span>
        <span>Inizia a scrivere la caption per vedere il punteggio.</span>
      </div>
    );
  }

  if (!result) return null;

  const { checks, total, platRules } = result;
  const color = scoreColor(total);

  return (
    <div className={`cs-wrap ${compact ? "cs-compact" : ""}`}>
      {/* HEADER */}
      <div className="cs-header" onClick={() => compact && setExpanded(v => !v)} style={compact ? { cursor: "pointer" } : {}}>
        <div className="cs-header-left">
          <div className="cs-score-ring" style={{ "--sc": color }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border)" strokeWidth="3"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
                strokeDasharray={`${(total / 100) * 113} 113`}
                strokeLinecap="round"/>
            </svg>
            <div className="cs-score-num" style={{ color }}>{total}</div>
          </div>
          <div>
            <div className="cs-score-label" style={{ color }}>{scoreLabel(total)}</div>
            <div className="cs-plat-label">{platRules.icon} {platRules.name}</div>
          </div>
        </div>
        {compact && (
          <button className="cs-expand-btn">{expanded ? "▲" : "▼"}</button>
        )}
      </div>

      {/* CHECKS */}
      {(!compact || expanded) && (
        <>
          <div className="cs-checks">
            {Object.entries(checks).map(([key, chk]) => (
              <div key={key} className={`cs-check-row ${chk.ok ? "" : "cs-check-fail"}`}>
                <span className="cs-check-icon">{chk.ok ? "✓" : "✗"}</span>
                <div className="cs-check-body">
                  <div className="cs-check-label">{chk.label}</div>
                  <div className="cs-check-detail">{chk.detail}</div>
                </div>
                <div className="cs-check-bar-wrap">
                  <div className="cs-check-bar">
                    <div className="cs-check-fill"
                      style={{
                        width: `${chk.score / getMaxScore(key) * 100}%`,
                        background: chk.ok ? "var(--ok)" : chk.score > 0 ? "var(--warn)" : "var(--err)",
                      }}
                    />
                  </div>
                  <span className="cs-check-pts">{chk.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* HINTS */}
          {result.hints.length > 0 && (
            <div className="cs-hints">
              {result.hints.slice(0, 2).map((h, i) => (
                <div key={i} className="cs-hint">
                  <span className="cs-hint-icon">💡</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Max score per check (per normalizzare la barra)
function getMaxScore(key) {
  return { lunghezza: 20, hook: 20, cta: 20, hashtag: 20, emoji: 10, tov: 10 }[key] || 20;
}

export default CaptionScorer;

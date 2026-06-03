import { useState, useCallback } from "react";
import { igPublish, fbPublish, isTokenExpiredError, serializeMetaError } from "../../services/metaService";

// ─── BEST TIME DATA ───────────────────────────────────────────────────────────
// Basato su ricerche Sprout Social / Later / HubSpot 2024-2025
// Orari in CET (Italia). Slot = [ora, minuto, label_motivo]
const BEST_TIMES = {
  instagram: [
    { time: "07:30", label: "Mattina — scrolling pre-lavoro",   score: 85 },
    { time: "12:30", label: "Pausa pranzo — picco engagement",  score: 92 },
    { time: "19:00", label: "Sera — orario di punta massimo",   score: 98 },
    { time: "20:30", label: "Post-cena — engagement prolungato", score: 91 },
  ],
  facebook: [
    { time: "09:00", label: "Inizio giornata lavorativa",       score: 78 },
    { time: "12:00", label: "Pausa pranzo — picco organico",    score: 88 },
    { time: "15:00", label: "Pomeriggio — traffico domestico",  score: 82 },
    { time: "18:30", label: "Ritorno dal lavoro",               score: 86 },
  ],
  tiktok: [
    { time: "07:00", label: "Mattina — FYP discovery",          score: 80 },
    { time: "13:00", label: "Pausa pranzo — Gen Z online",      score: 87 },
    { time: "19:00", label: "Sera — picco visualizzazioni",     score: 95 },
    { time: "21:00", label: "Tarda sera — virality window",     score: 90 },
  ],
  linkedin: [
    { time: "07:30", label: "Pre-meeting — professionisti",     score: 90 },
    { time: "12:00", label: "Pausa pranzo — decision makers",   score: 85 },
    { time: "17:30", label: "Fine giornata lavorativa",         score: 88 },
    { time: "09:00", label: "Mattina mid-week",                 score: 82 },
  ],
  youtube: [
    { time: "15:00", label: "Pomeriggio — prima ondata",        score: 80 },
    { time: "20:00", label: "Sera — picco visualizzazioni",     score: 93 },
  ],
  default: [
    { time: "09:00", label: "Mattina",                          score: 75 },
    { time: "12:30", label: "Pausa pranzo",                     score: 82 },
    { time: "19:00", label: "Sera",                             score: 88 },
  ],
};

// Giorni migliori per piattaforma (0=Lun, 6=Dom)
const BEST_DAYS = {
  instagram: { best: [1,2,3,4], label: "Mar–Ven" },  // Martedì-Venerdì
  facebook:  { best: [2,3],     label: "Mer–Gio" },
  tiktok:    { best: [1,2,3,4], label: "Mar–Ven" },
  linkedin:  { best: [1,2,3],   label: "Mar–Mer–Gio" },
  default:   { best: [1,2,3,4], label: "Mar–Ven" },
};

// Suggerisci il prossimo giorno ottimale dalla data scelta
function nextBestDay(fromDate, platform) {
  const bestDays = (BEST_DAYS[platform] || BEST_DAYS.default).best;
  const d = new Date(fromDate + "T12:00:00");
  for (let i = 0; i < 7; i++) {
    const day = (d.getDay() + 6) % 7; // remap Mon=0
    if (bestDays.includes(day)) {
      return d.toISOString().slice(0, 10);
    }
    d.setDate(d.getDate() + 1);
  }
  return fromDate;
}

function platformLabel(p) {
  return { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok",
    linkedin: "LinkedIn", youtube: "YouTube" }[p] || p;
}

// ─── BEST TIME PANEL ─────────────────────────────────────────────────────────
function BestTimePanel({ platforms, currentDate, onApply, onClose }) {
  const [activePlat, setActivePlat] = useState(platforms[0] || "instagram");
  const slots = BEST_TIMES[activePlat] || BEST_TIMES.default;
  const bestDate = nextBestDay(currentDate, activePlat);
  const isToday = bestDate === currentDate;
  const dayDiff = Math.round((new Date(bestDate + "T12:00:00") - new Date(currentDate + "T12:00:00")) / 86400000);
  const dateLabel = isToday ? "oggi" : dayDiff === 1 ? "domani" : `tra ${dayDiff} giorni`;

  return (
    <div className="btp-wrap" onClick={e => e.stopPropagation()}>
      <div className="btp-header">
        <span className="btp-title">✦ Orario ottimale AI</span>
        <button className="btp-close" onClick={onClose}>✕</button>
      </div>
      {platforms.length > 1 && (
        <div className="btp-plat-tabs">
          {platforms.map(p => (
            <button key={p} className={`btp-plat-tab ${activePlat === p ? "active" : ""}`}
              onClick={() => setActivePlat(p)}>
              {platformLabel(p)}
            </button>
          ))}
        </div>
      )}
      <div className="btp-day-hint">
        📅 Giorno consigliato: <strong>{(BEST_DAYS[activePlat] || BEST_DAYS.default).label}</strong>
        {!isToday && <span className="btp-day-badge">{dateLabel} — {bestDate.slice(5).replace("-", "/")}</span>}
        {isToday && <span className="btp-day-badge btp-day-ok">✓ oggi va bene</span>}
      </div>
      <div className="btp-slots">
        {slots.map((slot, i) => (
          <button key={i} className="btp-slot" onClick={() => { onApply(bestDate, slot.time); onClose(); }}>
            <div className="btp-slot-left">
              <div className="btp-slot-time">{slot.time}</div>
              <div className="btp-slot-label">{slot.label}</div>
            </div>
            <div className="btp-slot-right">
              <div className="btp-score-bar">
                <div className="btp-score-fill" style={{ width: `${slot.score}%` }} />
              </div>
              <div className="btp-score-num">{slot.score}%</div>
            </div>
          </button>
        ))}
      </div>
      <div className="btp-footer">
        Dati basati su analisi engagement 2025 · Ottimizza per CET
      </div>
    </div>
  );
}

// ─── PUBLISH MODAL ────────────────────────────────────────────────────────────
export function PublishModal({ post, meta, onClose, onPublished }) {
  const igOk = meta?.ig?.userId && meta?.ig?.token;
  const fbOk = meta?.fb?.pageId && meta?.fb?.token;

  const [mode,      setMode]      = useState("ora");
  const [selIG,     setSelIG]     = useState(!!igOk);
  const [selFB,     setSelFB]     = useState(!!fbOk);
  const [schedDate, setSchedDate] = useState(
    post.dueDate || post.data || post.dateISO || new Date().toISOString().slice(0, 10)
  );
  const [schedTime, setSchedTime] = useState("09:00");
  const [status,    setStatus]    = useState("idle");
  const [results,   setResults]   = useState([]);
  const [videoWait, setVideoWait] = useState(false);
  const [showBTP,   setShowBTP]   = useState(false);
  const [btpApplied, setBtpApplied] = useState(false);

  const postTitle = post.title || post.titolo || "Contenuto";
  const isReel    = (post.tipo || post.format || "").toLowerCase() === "reel";

  // Piattaforme selezionate (per BestTimePanel)
  const selectedPlatforms = [
    ...(igOk && selIG ? ["instagram"] : []),
    ...(fbOk && selFB ? ["facebook"]  : []),
  ];

  const schedUnix = mode === "pianifica" && schedDate
    ? Math.floor(new Date(schedDate + "T" + schedTime + ":00").getTime() / 1000)
    : null;

  const applyBestTime = useCallback((date, time) => {
    setSchedDate(date);
    setSchedTime(time);
    setBtpApplied(true);
    setMode("pianifica");
    setTimeout(() => setBtpApplied(false), 2000);
  }, []);

  async function publish() {
    if (!igOk && !fbOk) return;
    setStatus("publishing");
    const out = [];
    if (igOk && selIG) {
      try {
        if (isReel) setVideoWait(true);
        await igPublish(meta.ig.userId, meta.ig.token, post, schedUnix);
        setVideoWait(false);
        out.push({ platform: "Instagram", ok: true });
      } catch (e) {
        setVideoWait(false);
        out.push({ platform: "Instagram", ok: false, msg: serializeMetaError(e), tokenExpired: isTokenExpiredError(e) });
      }
    }
    if (fbOk && selFB) {
      try {
        await fbPublish(meta.fb.pageId, meta.fb.token, post, schedUnix);
        out.push({ platform: "Facebook", ok: true });
      } catch (e) {
        out.push({ platform: "Facebook", ok: false, msg: serializeMetaError(e), tokenExpired: isTokenExpiredError(e) });
      }
    }
    setResults(out);
    const anyOk = out.some(r => r.ok);
    setStatus(anyOk ? "success" : "error");
    if (anyOk) onPublished?.(mode === "pianifica" ? "pianificato" : "pubblicato");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal sm" onClick={e => e.stopPropagation()} style={{ position: "relative", overflow: "visible" }}>

        {/* HEADER */}
        <div className="modal-head">
          <div>
            <div className="modal-title">📢 Pubblica</div>
            <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{postTitle}</div>
          </div>
          <button className="btn-ghost sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* IDLE */}
          {status === "idle" && (<>
            {!igOk && !fbOk && (
              <div className="pub-warn">Nessun account Meta connesso. Connetti nella sezione Publishing Hub.</div>
            )}

            {(igOk || fbOk) && (<>
              {/* PIATTAFORME */}
              <div className="pub-platforms">
                {igOk && (
                  <label className="pub-plat-check">
                    <input type="checkbox" checked={selIG} onChange={e => setSelIG(e.target.checked)}/> Instagram
                  </label>
                )}
                {fbOk && (
                  <label className="pub-plat-check">
                    <input type="checkbox" checked={selFB} onChange={e => setSelFB(e.target.checked)}/> Facebook
                  </label>
                )}
              </div>

              {/* MODE SWITCH */}
              <div className="pub-mode">
                <button className={`pub-mode-btn ${mode === "ora" ? "active" : ""}`} onClick={() => setMode("ora")}>
                  Pubblica ora
                </button>
                <button className={`pub-mode-btn ${mode === "pianifica" ? "active" : ""}`} onClick={() => setMode("pianifica")}>
                  Pianifica
                </button>
              </div>

              {/* SCHEDULE FIELDS + BEST TIME AI */}
              {mode === "pianifica" && (
                <div style={{ marginTop: 12 }}>
                  <div className="fg-row" style={{ alignItems: "flex-end", gap: 8 }}>
                    <div className="fg">
                      <label className="lbl">Data</label>
                      <input className="inp" type="date" value={schedDate}
                        onChange={e => { setSchedDate(e.target.value); setBtpApplied(false); }}/>
                    </div>
                    <div className="fg" style={{ position: "relative" }}>
                      <label className="lbl" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Ora
                        {btpApplied && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--ok)", background: "var(--ok-bg)", padding: "1px 6px", borderRadius: 99 }}>
                            ✓ AI applicato
                          </span>
                        )}
                      </label>
                      <input className="inp" type="time" value={schedTime}
                        onChange={e => { setSchedTime(e.target.value); setBtpApplied(false); }}/>
                    </div>
                    {/* BEST TIME BUTTON */}
                    <button
                      className={`btp-trigger ${showBTP ? "active" : ""}`}
                      onClick={() => setShowBTP(v => !v)}
                      title="Suggerisci orario ottimale con AI"
                      style={{ marginBottom: 1 }}>
                      ✦ Orario ottimale AI
                    </button>
                  </div>

                  {/* BEST TIME PANEL */}
                  {showBTP && selectedPlatforms.length > 0 && (
                    <BestTimePanel
                      platforms={selectedPlatforms}
                      currentDate={schedDate}
                      onApply={applyBestTime}
                      onClose={() => setShowBTP(false)}
                    />
                  )}
                  {showBTP && selectedPlatforms.length === 0 && (
                    <div className="btp-no-plat">Seleziona almeno una piattaforma per vedere i suggerimenti.</div>
                  )}
                </div>
              )}

              {/* REEL WARNING */}
              {isReel && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "var(--gold-bg)", borderRadius: "var(--r)", fontSize: 11, color: "var(--gold)", border: "1px solid rgba(0,110,255,.15)" }}>
                  🎬 Reel: l'elaborazione video Meta richiede 1–2 minuti dopo l'invio.
                </div>
              )}

              {/* CAPTION PREVIEW */}
              {post.caption && (
                <div className="pub-caption-preview">
                  {post.caption.slice(0, 200)}{post.caption.length > 200 ? "…" : ""}
                </div>
              )}

              {/* RULE #8 REMINDER */}
              <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(194,24,91,.05)", borderRadius: "var(--r)", fontSize: 10, color: "#C2185B", border: "1px solid rgba(194,24,91,.15)", fontWeight: 600 }}>
                ⚠️ Regola #8 — Pubblicazione SEMPRE nativa su Meta. MAI tramite Metricool.
              </div>
            </>)}
          </>)}

          {/* PUBLISHING */}
          {status === "publishing" && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div className="spin" style={{ margin: "0 auto 14px", width: 32, height: 32, borderWidth: 3 }}/>
              <div style={{ fontWeight: 700 }}>
                {videoWait ? "Elaborazione video (1-2 min)…" : "Pubblicazione…"}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 6 }}>
                {mode === "pianifica"
                  ? `Pianificazione per ${schedDate} alle ${schedTime}`
                  : "Pubblicazione diretta su Meta Graph API"}
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
                {mode === "pianifica" ? "Pianificato!" : "Pubblicato!"}
              </div>
              {mode === "pianifica" && (
                <div style={{ fontSize: 12, color: "var(--ink4)", marginBottom: 12 }}>
                  {schedDate} alle {schedTime}
                </div>
              )}
              {results.map(r => (
                <div key={r.platform} style={{ fontSize: 12, color: r.ok ? "var(--ok)" : "var(--err)", marginBottom: 4 }}>
                  {r.ok ? "✅" : "❌"} {r.platform}{r.msg ? " — " + r.msg : ""}
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={onClose}>Chiudi</button>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div>
              {results.map(r => (
                <div key={r.platform} style={{ fontSize: 12, color: "var(--err)", background: "#FFF0F3", borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                  ❌ <strong>{r.platform}</strong>: {r.msg}
                  {r.tokenExpired && (
                    <span style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 600, color: "#C2185B" }}>
                      🔑 Token scaduto — riconnetti Meta dalla sidebar e riprova.
                    </span>
                  )}
                </div>
              ))}
              <button className="btn-ghost sm" onClick={() => setStatus("idle")}>↩ Riprova</button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {status === "idle" && (igOk || fbOk) && (
          <div className="modal-foot">
            <button className="btn-ghost sm" onClick={onClose}>Annulla</button>
            <button className="btn-primary sm" onClick={publish} disabled={!selIG && !selFB}>
              {mode === "pianifica" ? "📅 Pianifica" : "📤 Pubblica ora"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublishModal;

/**
 * GlobalCalendarView.jsx
 * Calendario unificato multi-progetto — ispirato a CoSchedule Marketing Calendar.
 *
 * Features:
 *  - Timeline mensile con tutti i post di tutti i clienti/progetti
 *  - Navigazione mese precedente/successivo
 *  - Filtri: cliente · canale · pilastro · stato
 *  - Vista Mese (griglia 7 col) / Vista Lista (tabella)
 *  - Post colorati per cliente — hover mostra dettagli
 *  - Click su post → apre PostFormModal per editing
 *  - Badge conteggio post per giorno
 *  - Legenda clienti auto-generata dai progetti attivi
 *
 * Props:
 *  projects  — array di tutti i progetti (da App state)
 *  clients   — array di tutti i clienti
 *  onGoToProject — (pid) => void — naviga a un progetto specifico
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { getEditorialPosts, getFeedStatusStyle, FEED_PIATTAFORME } from "./editorialModel";
import { getPillarColor } from "./editorialTheme";

// ─── PALETTE CLIENT ──────────────────────────────────────────────────────────
// Colori distinti per differenziare i clienti nella griglia
const CLIENT_PALETTE = [
  "#006EFF","#7C3AED","#00C853","#FF6B00","#C800FF",
  "#0284C7","#D97706","#059669","#E4405F","#F97316",
];

// ─── PLATFORM ICONS ──────────────────────────────────────────────────────────
const PLAT_ICON = {
  instagram: "📸", facebook: "📘", tiktok: "🎵",
  linkedin: "💼", youtube: "▶️", google: "🔍",
  email: "📧", blog: "📝", altro: "🔗",
};

// ─── STATI ───────────────────────────────────────────────────────────────────
const STATI_LABELS = {
  bozza: "Bozza", revisione: "In revisione", approvato: "Approvato",
  schedulato: "Schedulato", pubblicato: "Pubblicato", "non-approvato": "Non approvato",
};
const STATI_DOT = {
  bozza: "#9CA3AF", revisione: "#F59E0B", approvato: "#3B82F6",
  schedulato: "#8B5CF6", pubblicato: "#10B981", "non-approvato": "#EF4444",
};

// ─── CALENDAR HELPERS ────────────────────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  // 0=Sun → remap to Mon=0
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function padDate(n) { return String(n).padStart(2, "0"); }
function isoDate(y, m, d) { return `${y}-${padDate(m + 1)}-${padDate(d)}`; }
function todayISO() {
  const now = new Date();
  return isoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

const WEEKDAYS = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];


// ─── SAVED VIEWS STORAGE ──────────────────────────────────────────────────────
const GCAL_VIEWS_KEY = "nms-gcal:saved-views";

async function loadSavedViews() {
  try {
    const r = await window.storage?.get(GCAL_VIEWS_KEY);
    if (r?.value) return JSON.parse(r.value);
  } catch {}
  try {
    const v = window.localStorage?.getItem(GCAL_VIEWS_KEY);
    return v ? JSON.parse(v) : [];
  } catch {}
  return [];
}

async function persistSavedViews(views) {
  const serialized = JSON.stringify(views);
  try { await window.storage?.set(GCAL_VIEWS_KEY, serialized); } catch {}
  try { window.localStorage?.setItem(GCAL_VIEWS_KEY, serialized); } catch {}
}

export function GlobalCalendarView({ projects = [], clients = [], onGoToProject, onUpdateProject }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view,  setView]  = useState("month");   // "month" | "list"
  const [filterClient,  setFilterClient]  = useState("tutti");
  const [filterChannel, setFilterChannel] = useState("tutti");
  const [filterPillar,  setFilterPillar]  = useState("tutti");
  const [filterStatus,  setFilterStatus]  = useState("tutti");
  const [hoverPost,     setHoverPost]     = useState(null);
  const [hoverPos,      setHoverPos]      = useState({x:0,y:0});
  const [savedViews,    setSavedViews]    = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newViewName,   setNewViewName]   = useState("");
  const [sortCol,       setSortCol]       = useState("data");
  const [sortAsc,       setSortAsc]       = useState(true);
  const [dragPostId,    setDragPostId]    = useState(null);
  const [dragOverDay,   setDragOverDay]   = useState(null);

  // Load saved views from storage on mount
  useEffect(() => {
    loadSavedViews().then(v => setSavedViews(v || []));
  }, []);

  // Build client-color map
  const clientColorMap = useMemo(() => {
    const map = {};
    clients.forEach((c, i) => { map[c.id] = CLIENT_PALETTE[i % CLIENT_PALETTE.length]; });
    return map;
  }, [clients]);

  // Collect all campaigns from all projects for timeline bands
  const allCampaigns = useMemo(() => {
    const camps = [];
    projects.forEach(proj => {
      const client = clients.find(cl => cl.id === proj.clientId);
      const color  = clientColorMap[proj.clientId] || "#9CA3AF";
      (proj.ed?.campagne || []).forEach(camp => {
        if (!camp.dataInizio && !camp.dataFine) return;
        camps.push({
          ...camp,
          _projId:     proj.id,
          _projName:   proj.name,
          _clientName: client?.name || "—",
          _color:      camp.colore || color,
        });
      });
    });
    return camps;
  }, [projects, clients, clientColorMap]);

  // Collect all posts from all projects, enriched with project/client info
  const allPosts = useMemo(() => {
    const posts = [];
    projects.forEach(proj => {
      const client = clients.find(c => c.id === proj.clientId);
      const color  = clientColorMap[proj.clientId] || "#9CA3AF";
      getEditorialPosts(proj).forEach(post => {
        posts.push({
          ...post,
          _projId:     proj.id,
          _projName:   proj.name,
          _clientId:   proj.clientId,
          _clientName: client?.name || "—",
          _color:      color,
        });
      });
    });
    return posts;
  }, [projects, clients, clientColorMap]);

  // Extract filter options from allPosts
  const allClients  = useMemo(() => [...new Set(allPosts.map(p => p._clientId))], [allPosts]);
  const allChannels = useMemo(() => [...new Set(allPosts.flatMap(p => p.piattaforme || []))], [allPosts]);
  const allPillars  = useMemo(() => [...new Set(allPosts.map(p => p.pilastro).filter(Boolean))], [allPosts]);

  // Filtered posts
  const filtered = useMemo(() => allPosts.filter(p => {
    if (filterClient  !== "tutti" && p._clientId !== filterClient) return false;
    if (filterChannel !== "tutti" && !(p.piattaforme||[]).includes(filterChannel)) return false;
    if (filterPillar  !== "tutti" && p.pilastro !== filterPillar) return false;
    if (filterStatus  !== "tutti" && p.stato !== filterStatus) return false;
    return true;
  }), [allPosts, filterClient, filterChannel, filterPillar, filterStatus]);

  // Posts in current month, grouped by ISO date
  const postsByDay = useMemo(() => {
    const map = {};
    const prefix = `${year}-${padDate(month + 1)}-`;
    filtered.forEach(p => {
      const date = p.data || p.dueDate || p.dateISO || "";
      if (!date.startsWith(prefix)) return;
      if (!map[date]) map[date] = [];
      map[date].push(p);
    });
    return map;
  }, [filtered, year, month]);

  // Posts in current month (sorted) for list view
  const monthPosts = useMemo(() => {
    const prefix = `${year}-${padDate(month + 1)}-`;
    return filtered.filter(p => {
      const date = p.data || p.dueDate || p.dateISO || "";
      return date.startsWith(prefix);
    }).sort((a, b) => {
      const da = a.data || a.dueDate || a.dateISO || "";
      const db = b.data || b.dueDate || b.dateISO || "";
      return da.localeCompare(db);
    });
  }, [filtered, year, month]);

  // Navigation
  const prevMonth = useCallback(() => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }, [month]);
  const nextMonth = useCallback(() => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }, [month]);
  const goToday = useCallback(() => {
    const n = new Date();
    setYear(n.getFullYear());
    setMonth(n.getMonth());
  }, []);

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDayOfMonth(year, month);
  const today        = todayISO();
  const totalMonthPosts = filtered.filter(p => {
    const d = p.data || p.dueDate || p.dateISO || "";
    return d.startsWith(`${year}-${padDate(month + 1)}-`);
  }).length;

  // Stats bar
  const totalAll = allPosts.length;
  const totalFiltered = filtered.length;

  // ── Drag & Drop reschedule ──────────────────────────────────────────────────
  function reschedulePost(postId, newDate) {
    if (!postId || !newDate || !onUpdateProject) return;
    // Find which project owns this post
    for (const proj of projects) {
      const fi = (proj.ed?.feedItems || []).find(f => f.id === postId);
      const ci = (proj.ed?.contentItems || []).find(f => f.id === postId);
      if (fi || ci) {
        const updatedProj = {
          ...proj,
          ed: {
            ...proj.ed,
            feedItems: (proj.ed?.feedItems || []).map(f =>
              f.id === postId ? { ...f, data: newDate } : f
            ),
            contentItems: (proj.ed?.contentItems || []).map(f =>
              f.id === postId ? { ...f, data: newDate, dueDate: newDate } : f
            ),
          },
        };
        onUpdateProject(updatedProj);
        break;
      }
    }
  }

  // ── Saved views helpers ──────────────────────────────────────────────────────
  const currentFilters = { filterClient, filterChannel, filterPillar, filterStatus, view };

  const saveView = useCallback(async (name) => {
    if (!name.trim()) return;
    const newView = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      ...currentFilters,
      createdAt: Date.now(),
    };
    const updated = [...savedViews.filter(v => v.name !== name.trim()), newView];
    setSavedViews(updated);
    await persistSavedViews(updated);
    setShowSaveModal(false);
    setNewViewName("");
  }, [currentFilters, savedViews]);

  const applyView = useCallback((sv) => {
    setFilterClient(sv.filterClient || "tutti");
    setFilterChannel(sv.filterChannel || "tutti");
    setFilterPillar(sv.filterPillar || "tutti");
    setFilterStatus(sv.filterStatus || "tutti");
    if (sv.view) setView(sv.view);
  }, []);

  const deleteView = useCallback(async (id) => {
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    await persistSavedViews(updated);
  }, [savedViews]);

  // ── Table view: all posts sorted ──────────────────────────────────────────
  const tablePosts = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (sortCol === "data") {
        va = a.data || a.dueDate || a.dateISO || "";
        vb = b.data || b.dueDate || b.dateISO || "";
      } else if (sortCol === "cliente") {
        va = a._clientName || ""; vb = b._clientName || "";
      } else if (sortCol === "stato") {
        va = a.stato || ""; vb = b.stato || "";
      } else if (sortCol === "pilastro") {
        va = a.pilastro || ""; vb = b.pilastro || "";
      } else if (sortCol === "progetto") {
        va = a._projName || ""; vb = b._projName || "";
      } else {
        va = a.titolo || a.title || "";
        vb = b.titolo || b.title || "";
      }
      const cmp = va.localeCompare(vb, "it");
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortAsc]);

  function toggleSort(col) {
    if (sortCol === col) setSortAsc(v => !v);
    else { setSortCol(col); setSortAsc(true); }
  }

  function SortTh({ col, label }) {
    const active = sortCol === col;
    return (
      <th className={`gcal-th ${active ? "gcal-th-act" : ""}`} onClick={() => toggleSort(col)}>
        {label} {active ? (sortAsc ? "↑" : "↓") : ""}
      </th>
    );
  }

  return (
    <div className="gcal-shell">
      {/* ── TOPBAR ── */}
      <div className="gcal-topbar">
        <div className="gcal-topbar-left">
          <div className="gcal-month-nav">
            <button className="gcal-nav-btn" onClick={prevMonth} aria-label="Mese precedente">‹</button>
            <div className="gcal-month-label">{MONTHS_IT[month]} {year}</div>
            <button className="gcal-nav-btn" onClick={nextMonth} aria-label="Mese successivo">›</button>
          </div>
          <button className="gcal-today-btn" onClick={goToday}>Oggi</button>
        </div>
        <div className="gcal-stats">
          <span className="gcal-stat-pill">{totalMonthPosts} post questo mese</span>
          {totalAll !== totalFiltered && (
            <span className="gcal-stat-pill gcal-stat-filtered">{totalFiltered} visibili (filtro attivo)</span>
          )}
        </div>
        <div className="gcal-topbar-right">
          <button className={`gcal-view-btn ${view==="month"?"active":""}`} onClick={()=>setView("month")}>☰ Mese</button>
          <button className={`gcal-view-btn ${view==="list"?"active":""}`} onClick={()=>setView("list")}>≡ Lista</button>
          <button className={`gcal-view-btn ${view==="table"?"active":""}`} onClick={()=>setView("table")}>⊞ Tabella</button>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="gcal-filters">
        <select className="gcal-select" value={filterClient} onChange={e=>setFilterClient(e.target.value)}>
          <option value="tutti">Tutti i clienti</option>
          {allClients.map(cid => {
            const c = clients.find(cl => cl.id === cid);
            return <option key={cid} value={cid}>{c?.name || cid}</option>;
          })}
        </select>
        <select className="gcal-select" value={filterChannel} onChange={e=>setFilterChannel(e.target.value)}>
          <option value="tutti">Tutti i canali</option>
          {allChannels.map(ch => <option key={ch} value={ch}>{(PLAT_ICON[ch]||"") + " " + ch}</option>)}
        </select>
        <select className="gcal-select" value={filterPillar} onChange={e=>setFilterPillar(e.target.value)}>
          <option value="tutti">Tutti i pilastri</option>
          {allPillars.map(pl => <option key={pl} value={pl}>{pl}</option>)}
        </select>
        <select className="gcal-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="tutti">Tutti gli stati</option>
          {Object.entries(STATI_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {(filterClient!=="tutti"||filterChannel!=="tutti"||filterPillar!=="tutti"||filterStatus!=="tutti") && (
          <button className="gcal-clear-btn" onClick={()=>{setFilterClient("tutti");setFilterChannel("tutti");setFilterPillar("tutti");setFilterStatus("tutti");}}>✕ Reset filtri</button>
        )}
      </div>

      {/* ── SAVED VIEWS BAR ── */}
      <div className="gcal-saved-bar">
        <span className="gcal-saved-lbl">Viste:</span>
        {savedViews.map(sv => (
          <div key={sv.id} className="gcal-saved-pill">
            <button className="gcal-saved-apply" onClick={() => applyView(sv)} title={`Applica: ${sv.name}`}>
              {sv.name}
            </button>
            <button className="gcal-saved-del" onClick={() => deleteView(sv.id)} title="Elimina vista">×</button>
          </div>
        ))}
        <button className="gcal-save-btn" onClick={() => setShowSaveModal(true)} title="Salva filtri correnti come vista">
          + Salva vista
        </button>
      </div>

      {/* ── SAVE VIEW MODAL ── */}
      {showSaveModal && (
        <div className="gcal-save-modal-wrap" onClick={() => setShowSaveModal(false)}>
          <div className="gcal-save-modal" onClick={e => e.stopPropagation()}>
            <div className="gcal-save-modal-title">Salva vista corrente</div>
            <div className="gcal-save-modal-sub">
              Filtri: {[filterClient!=="tutti"&&filterClient, filterChannel!=="tutti"&&filterChannel, filterPillar!=="tutti"&&filterPillar, filterStatus!=="tutti"&&filterStatus].filter(Boolean).join(" · ") || "Nessun filtro attivo"}
            </div>
            <input
              className="gcal-save-input"
              value={newViewName}
              onChange={e => setNewViewName(e.target.value)}
              placeholder="Nome vista… es. Kosmetikal Instagram"
              autoFocus
              onKeyDown={e => { if(e.key==="Enter") saveView(newViewName); if(e.key==="Escape") setShowSaveModal(false); }}
            />
            <div className="gcal-save-modal-actions">
              <button className="gcal-save-cancel" onClick={() => setShowSaveModal(false)}>Annulla</button>
              <button className="gcal-save-confirm" onClick={() => saveView(newViewName)} disabled={!newViewName.trim()}>
                💾 Salva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CLIENT LEGEND ── */}
      {clients.length > 0 && (
        <div className="gcal-legend">
          {clients.map(c => (
            <button key={c.id}
              className={`gcal-legend-pill ${filterClient===c.id?"gcal-legend-active":""}`}
              style={{"--leg-color": clientColorMap[c.id]}}
              onClick={() => setFilterClient(filterClient===c.id?"tutti":c.id)}>
              <span className="gcal-legend-dot"/>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* ── MONTH GRID ── */}
      {view === "month" && (
        <div className="gcal-body">
          {/* Campaign bands */}
          {allCampaigns.filter(camp => {
            const prefix = `${year}-${padDate(month + 1)}`;
            const startOk = !camp.dataInizio || camp.dataInizio <= `${year}-${padDate(month + 1)}-31`;
            const endOk   = !camp.dataFine   || camp.dataFine   >= `${year}-${padDate(month + 1)}-01`;
            return startOk && endOk;
          }).map(camp => (
            <div key={camp.id} className="gcal-camp-band" style={{ borderColor: camp._color, background: camp._color + "0E" }}>
              <span className="gcal-camp-dot" style={{ background: camp._color }}/>
              <span className="gcal-camp-name">{camp.nome}</span>
              {camp.dataInizio && camp.dataFine && (
                <span className="gcal-camp-dates">{camp.dataInizio.slice(5)} → {camp.dataFine.slice(5)}</span>
              )}
              {camp.budgetADV && (
                <span className="gcal-camp-budget">ADV €{camp.budgetADV}</span>
              )}
              <span className="gcal-camp-proj">{camp._clientName}</span>
            </div>
          ))}

          {/* Weekday headers */}
          <div className="gcal-grid gcal-grid-hdr">
            {WEEKDAYS.map(d => <div key={d} className="gcal-cell-hdr">{d}</div>)}
          </div>
          {/* Days grid */}
          <div className="gcal-grid gcal-grid-days">
            {/* Empty cells before first day */}
            {Array.from({length: firstDay}).map((_, i) => (
              <div key={`empty-${i}`} className="gcal-cell gcal-cell-empty"/>
            ))}
            {/* Day cells */}
            {Array.from({length: daysInMonth}).map((_, i) => {
              const day     = i + 1;
              const iso     = isoDate(year, month, day);
              const posts   = postsByDay[iso] || [];
              const isToday = iso === today;
              const MAX_VISIBLE = 3;
              const visible = posts.slice(0, MAX_VISIBLE);
              const overflow = posts.length - MAX_VISIBLE;
              return (
                <div key={iso}
                  className={`gcal-cell ${isToday?"gcal-cell-today":""} ${dragOverDay===iso&&dragPostId?"gcal-cell-dragover":""}`}
                  onDragOver={e => { e.preventDefault(); setDragOverDay(iso); }}
                  onDragLeave={() => setDragOverDay(null)}
                  onDrop={e => {
                    e.preventDefault();
                    if (dragPostId && iso !== (allPosts.find(p=>p.id===dragPostId)?.data||"")) {
                      reschedulePost(dragPostId, iso);
                    }
                    setDragPostId(null); setDragOverDay(null);
                  }}>
                  <div className="gcal-day-num">{day}</div>
                  {visible.map(post => {
                    const plats = (post.piattaforme||[]).slice(0,2);
                    const st    = getFeedStatusStyle(post.stato) || {};
                    return (
                      <div
                        key={post.id}
                        className={`gcal-post-chip ${dragPostId===post.id?"gcal-chip-dragging":""}`}
                        draggable={!!onUpdateProject}
                        style={{
                          borderLeft: `3px solid ${post._color}`,
                          background: post._color + "14",
                          cursor: onUpdateProject ? "grab" : "pointer",
                          opacity: dragPostId===post.id ? 0.45 : 1,
                        }}
                        onDragStart={e => {
                          setDragPostId(post.id);
                          setHoverPost(null);
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", post.id);
                        }}
                        onDragEnd={() => { setDragPostId(null); setDragOverDay(null); }}
                        onMouseEnter={e => {
                          if (dragPostId) return;
                          setHoverPost(post);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const parent = e.currentTarget.closest(".gcal-shell").getBoundingClientRect();
                          setHoverPos({ x: rect.left - parent.left, y: rect.bottom - parent.top + 4 });
                        }}
                        onMouseLeave={() => setHoverPost(null)}
                        onClick={() => !dragPostId && onGoToProject?.(post._projId)}
                      >
                        <span className="gcal-chip-dot" style={{background: STATI_DOT[post.stato] || "#9CA3AF"}}/>
                        <span className="gcal-chip-plat">{plats.map(pl => PLAT_ICON[pl] || "").join("")}</span>
                        <span className="gcal-chip-title">{post.titolo || post.title || "—"}</span>
                      </div>
                    );
                  })}
                  {overflow > 0 && (
                    <div className="gcal-overflow-badge">+{overflow} altri</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TABLE VIEW — cross-project, all months, sortable ── */}
      {view === "table" && (
        <div className="gcal-list-wrap">
          <div className="gcal-table-toolbar">
            <span className="gcal-table-count">{tablePosts.length} post · tutti i mesi</span>
            <span className="gcal-table-hint">Clic sull'intestazione per ordinare</span>
          </div>
          {tablePosts.length === 0 ? (
            <div className="gcal-empty">
              <div className="gcal-empty-icon">📭</div>
              <div>Nessun post con i filtri selezionati.</div>
            </div>
          ) : (
            <table className="gcal-table">
              <thead>
                <tr>
                  <SortTh col="data"      label="Data" />
                  <SortTh col="titolo"    label="Titolo" />
                  <SortTh col="cliente"   label="Cliente" />
                  <SortTh col="progetto"  label="Progetto" />
                  <th>Canali</th>
                  <SortTh col="pilastro"  label="Pilastro" />
                  <SortTh col="stato"     label="Stato" />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tablePosts.map(post => {
                  const date  = post.data || post.dueDate || post.dateISO || "—";
                  const st    = getFeedStatusStyle(post.stato) || {};
                  const plats = (post.piattaforme||[]).slice(0, 3);
                  return (
                    <tr key={post.id} className="gcal-table-row" onClick={() => onGoToProject?.(post._projId)}>
                      <td className="gcal-td-date">{date.length >= 7 ? date.slice(5) : date}</td>
                      <td className="gcal-td-title">
                        <div className="gcal-title-wrap">
                          <span className="gcal-client-bar" style={{background: post._color}}/>
                          <span>{post.titolo || post.title || "—"}</span>
                        </div>
                      </td>
                      <td className="gcal-td-client">{post._clientName}</td>
                      <td className="gcal-td-proj">{post._projName}</td>
                      <td className="gcal-td-plat">
                        {plats.map(pl => (
                          <span key={pl} className="gcal-plat-badge">{PLAT_ICON[pl] || pl}</span>
                        ))}
                      </td>
                      <td className="gcal-td-pillar">
                        {post.pilastro && (
                          <span style={{fontSize:10,fontWeight:600,color:getPillarColor(post.pilastro)}}>
                            {post.pilastro}
                          </span>
                        )}
                      </td>
                      <td className="gcal-td-stato">
                        <span className="gcal-stato-pill" style={{background:(st.bg||"#F3F4F6"),color:(st.tx||"#6B7280")}}>
                          {STATI_LABELS[post.stato] || post.stato || "—"}
                        </span>
                      </td>
                      <td className="gcal-td-action">
                        <button className="gcal-goto-btn" onClick={e=>{e.stopPropagation();onGoToProject?.(post._projId);}}>
                          → Progetto
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div className="gcal-list-wrap">
          {monthPosts.length === 0 ? (
            <div className="gcal-empty">
              <div className="gcal-empty-icon">📭</div>
              <div>Nessun post per questo mese con i filtri selezionati.</div>
            </div>
          ) : (
            <table className="gcal-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Titolo</th>
                  <th>Cliente</th>
                  <th>Progetto</th>
                  <th>Canali</th>
                  <th>Pilastro</th>
                  <th>Stato</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {monthPosts.map(post => {
                  const date  = post.data || post.dueDate || post.dateISO || "—";
                  const st    = getFeedStatusStyle(post.stato) || {};
                  const plats = (post.piattaforme||[]).slice(0,3);
                  return (
                    <tr key={post.id} className="gcal-table-row" onClick={() => onGoToProject?.(post._projId)}>
                      <td className="gcal-td-date">{date.slice(5)}</td>
                      <td className="gcal-td-title">
                        <div className="gcal-title-wrap">
                          <span className="gcal-client-bar" style={{background: post._color}}/>
                          <span>{post.titolo || post.title || "—"}</span>
                        </div>
                      </td>
                      <td className="gcal-td-client">{post._clientName}</td>
                      <td className="gcal-td-proj">{post._projName}</td>
                      <td className="gcal-td-plat">
                        {plats.map(pl => (
                          <span key={pl} className="gcal-plat-badge">{PLAT_ICON[pl]||pl}</span>
                        ))}
                      </td>
                      <td className="gcal-td-pillar">
                        {post.pilastro && (
                          <span style={{fontSize:10,fontWeight:600,color:getPillarColor(post.pilastro)}}>
                            {post.pilastro}
                          </span>
                        )}
                      </td>
                      <td className="gcal-td-stato">
                        <span className="gcal-stato-pill" style={{background:(st.bg||"#F3F4F6"),color:(st.tx||"#6B7280")}}>
                          {STATI_LABELS[post.stato] || post.stato || "—"}
                        </span>
                      </td>
                      <td className="gcal-td-action">
                        <button className="gcal-goto-btn" onClick={e=>{e.stopPropagation();onGoToProject?.(post._projId);}}>
                          → Progetto
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── HOVER TOOLTIP ── */}
      {hoverPost && (
        <div className="gcal-tooltip" style={{left: hoverPos.x, top: hoverPos.y}}>
          <div className="gcal-tt-header" style={{borderLeft:`3px solid ${hoverPost._color}`}}>
            <div className="gcal-tt-title">{hoverPost.titolo || hoverPost.title}</div>
            <div className="gcal-tt-client">{hoverPost._clientName} · {hoverPost._projName}</div>
          </div>
          <div className="gcal-tt-row">
            <span className="gcal-tt-lbl">Data</span>
            <span>{hoverPost.data || hoverPost.dueDate || "—"}</span>
          </div>
          <div className="gcal-tt-row">
            <span className="gcal-tt-lbl">Canali</span>
            <span>{(hoverPost.piattaforme||[]).map(p => PLAT_ICON[p]||p).join(" ") || "—"}</span>
          </div>
          <div className="gcal-tt-row">
            <span className="gcal-tt-lbl">Tipo</span>
            <span>{hoverPost.tipo || hoverPost.format || "—"}</span>
          </div>
          <div className="gcal-tt-row">
            <span className="gcal-tt-lbl">Stato</span>
            <span style={{color: STATI_DOT[hoverPost.stato]}}>{STATI_LABELS[hoverPost.stato] || hoverPost.stato}</span>
          </div>
          {hoverPost.pilastro && (
            <div className="gcal-tt-row">
              <span className="gcal-tt-lbl">Pilastro</span>
              <span style={{color:getPillarColor(hoverPost.pilastro),fontWeight:600}}>{hoverPost.pilastro}</span>
            </div>
          )}
          <div className="gcal-tt-footer">Clicca per aprire il progetto</div>
        </div>
      )}
    </div>
  );
}

export default GlobalCalendarView;

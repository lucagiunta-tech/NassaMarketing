import { useState } from "react";
import { callClaude } from "../../services/aiService";
import { buildCtx } from "../../templates/templateUtils";
import {
  applyEdUpdate,
  getChannelColor,
  getEditorialPosts,
  isPostStatus,
  POST_STATUS,
} from "./editorialModel";
import { PublishModal } from "./MetaPublishModal";
import { CaptionScorer } from "./CaptionScorer";

function getItemTitle(item) {
  return item?.title || item?.titolo || "Contenuto senza titolo";
}

function getItemFormat(item) {
  return item?.format || item?.tipo || "post";
}

function getItemChannel(item) {
  return item?.canale || item?.piattaforme?.[0] || "instagram";
}

function getItemDate(item) {
  return item?.dueDate || item?.data || item?.dateISO || "";
}

function updatePublishingItem(ed, id, patch) {
  const updateOne = item => item?.id === id ? { ...item, ...patch } : item;
  return {
    ...ed,
    feedItems: (ed.feedItems || []).map(updateOne),
    contentItems: (ed.contentItems || []).map(updateOne),
  };
}

export function PublishingHubED({ project, onUpdate, globalMeta }) {
  const items = getEditorialPosts(project);
  const approved = items.filter(item => isPostStatus(item, POST_STATUS.approvato) || item.status === "approvato");
  const [pubPost, setPubPost] = useState(null);
  const [aiItem, setAiItem] = useState(null);

  function upEd(fn) {
    onUpdate(applyEdUpdate(project, fn));
  }

  function upCaption(id, caption) {
    upEd(ed => updatePublishingItem(ed, id, { caption }));
  }

  function markLive(id) {
    upEd(ed => updatePublishingItem(ed, id, {
      status: "live",
      stato: POST_STATUS.pubblicato,
    }));
  }

  async function genCaption(item) {
    setAiItem(item.id);
    const bv = project.pdc?.sections?.tone_of_voice?.content?.slice(0, 400) || "";
    const mh = project.pdc?.sections?.message_house?.content?.slice(0, 300) || "";
    const ctx = buildCtx(project.interview || {});
    const channel = getItemChannel(item);
    const title = getItemTitle(item);
    const format = getItemFormat(item);
    const funnel = item.funnel || "";

    try {
      const t = await callClaude(`Copywriter B2B. Caption per ${channel}. SOLO la caption.\nCONTENUTO: ${title} | FORMATO: ${format} | FUNNEL: ${funnel}\nBRAND VOICE: ${bv}\nMESSAGE HOUSE: ${mh}\nBRAND: ${ctx.slice(0,300)}\nRegole: frasi corte · no emoji · CTA tecnica.`);
      upCaption(item.id, t);
    } catch (error) {
      console.error("PublishingHubED caption generation error", error);
    }
    setAiItem(null);
  }

  return (
    <div className="pub-hub-wrap">
      <div className="pub-hub-meta-status">
        {globalMeta
          ? <div className="pub-meta-ok">🔗 Meta connesso: <strong>{globalMeta.nome}</strong> · {(globalMeta.allPages || []).length || 1} pagine</div>
          : <div className="pub-meta-warn">⚠️ Meta non connesso — usa il pulsante nella sidebar</div>}
      </div>

      <div className="pub-hub-section">
        <div className="pub-hub-title">Pronti per la pubblicazione <span className="pub-hub-cnt">{approved.length}</span></div>
        {approved.length === 0 && <div className="ct-empty">Nessun contenuto in stato Approvato. Avanza i contenuti nel Kanban Board.</div>}

        {approved.map(item => {
          const channel = getItemChannel(item);
          const format = getItemFormat(item);
          const title = getItemTitle(item);
          const date = getItemDate(item);
          const channelColor = getChannelColor(channel);

          return (
            <div key={item.id} className="pub-item">
              <div className="pub-item-hdr">
                <span className="kan-badge" style={{ background: channelColor + "18", color: channelColor }}>{channel}</span>
                <span className="kan-badge" style={{ background: "#F1F5F9", color: "#64748B" }}>{format}</span>
                {date && <span className="kan-date">{date}</span>}
                <span style={{ flex: 1 }} />
                <button className="btn-ghost sm" onClick={() => genCaption(item)} disabled={aiItem === item.id}>{aiItem === item.id ? "…" : "✦ Caption"}</button>
                <button className="btn-primary sm" onClick={() => setPubPost(item)}>📤 Pubblica</button>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "8px 0 4px" }}>{title}</div>
              {item.caption
                ? <textarea className="txta" rows={4} value={item.caption} onChange={e => upCaption(item.id, e.target.value)} />
                : <div style={{ fontSize: 11, color: "var(--ink4)", fontStyle: "italic" }}>Caption non generata — clicca "Caption" o scrivi manualmente.</div>}
              {item.caption?.trim() && (
                <CaptionScorer
                  caption={item.caption}
                  platforms={item.piattaforme || [getItemChannel(item)]}
                  project={project}
                  compact={true}
                />
              )}
            </div>
          );
        })}
      </div>

      {pubPost && (
        <PublishModal
          post={{
            ...pubPost,
            title: getItemTitle(pubPost),
            titolo: getItemTitle(pubPost),
            canale: getItemChannel(pubPost),
            format: getItemFormat(pubPost),
            dueDate: getItemDate(pubPost),
            immagineUrl: pubPost.immagineUrl || "",
            videoUrl: pubPost.videoUrl || "",
          }}
          meta={globalMeta}
          onClose={() => setPubPost(null)}
          onPublished={() => {
            markLive(pubPost.id);
            setPubPost(null);
          }}
        />
      )}
    </div>
  );
}

export default PublishingHubED;

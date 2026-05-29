export const META_APP_ID = "1543498264065807";
export const META_API = "https://graph.facebook.com/v19.0";
export const META_SCOPES = [
  "pages_show_list",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
  "pages_read_engagement",
  "pages_manage_posts",
  "public_profile",
  "business_management",
].join(",");

export function serializeMetaError(error) {
  if (!error) return "Errore Meta sconosciuto";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

export function buildMetaOAuthUrl({
  appId = META_APP_ID,
  redirectUri = "https://nassa-gestione.vercel.app/api/meta-oauth",
  scopes = META_SCOPES,
} = {}) {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  return `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&scope=${scopes}&response_type=code`;
}

export function openMetaOAuth(onPages, options = {}) {
  const popup = window.open(buildMetaOAuthUrl(options), "MetaLogin", "width=620,height=720,left=200,top=80");
  if (!popup || popup.closed) {
    alert("Popup bloccato — abilita i popup nelle impostazioni del browser.");
    return;
  }

  let poll;
  function cleanup() {
    window.removeEventListener("message", handleMsg);
    if (poll) clearInterval(poll);
  }

  function handleMsg(e) {
    if (e.data?.type === "META_OAUTH_PAGES") {
      cleanup();
      onPages(e.data.pages);
    }
    if (e.data?.type === "META_OAUTH_ERROR") {
      cleanup();
      alert("Errore Meta: " + e.data.error);
    }
  }

  window.addEventListener("message", handleMsg);
  poll = setInterval(() => {
    try {
      if (popup.closed) cleanup();
    } catch {}
  }, 800);
}

async function parseMetaJson(response, context) {
  const data = await response.json();
  if (data.error) throw new Error(`${context}: ${data.error.message}`);
  return data;
}

export async function pollIgMedia(mediaId, token, maxAttempts = 24) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 4000));
    const response = await fetch(`${META_API}/${mediaId}?fields=status_code&access_token=${encodeURIComponent(token)}`);
    const data = await parseMetaJson(response, "Instagram status");
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") throw new Error("Instagram: errore elaborazione video");
  }
  throw new Error("Instagram: timeout — riprova tra qualche minuto");
}

export async function igPublish(igUserId, token, post, scheduleUnix) {
  const tipo = post.tipo || "post";
  let creationId;

  if (tipo === "reel") {
    const response = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "REELS",
        video_url: post.videoUrl || "",
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const data = await parseMetaJson(response, "IG reel");
    creationId = data.id;
    await pollIgMedia(creationId, token);
  } else {
    const response = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: post.immagineUrl || "",
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const data = await parseMetaJson(response, "IG post");
    creationId = data.id;
  }

  const publishResponse = await fetch(`${META_API}/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: creationId, access_token: token }),
  });
  return parseMetaJson(publishResponse, "IG publish");
}

export async function fbPublish(pageId, token, post, scheduleUnix) {
  const tipo = post.tipo || "post";
  const isVideo = tipo === "reel";
  const endpoint = isVideo ? `${META_API}/${pageId}/videos` : `${META_API}/${pageId}/photos`;
  const body = isVideo
    ? {
        file_url: post.videoUrl || "",
        description: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { published: false, scheduled_publish_time: scheduleUnix } : { published: true }),
      }
    : {
        url: post.immagineUrl || "",
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { published: false, scheduled_publish_time: scheduleUnix } : { published: true }),
      };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseMetaJson(response, "Facebook");
}

export async function safeIgPublish(...args) {
  try {
    return { ok: true, data: await igPublish(...args), error: null };
  } catch (error) {
    return { ok: false, data: null, error: serializeMetaError(error) };
  }
}

export async function safeFbPublish(...args) {
  try {
    return { ok: true, data: await fbPublish(...args), error: null };
  } catch (error) {
    return { ok: false, data: null, error: serializeMetaError(error) };
  }
}

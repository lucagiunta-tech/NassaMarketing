// src/utils/dropbox.js
// Dropbox direct upload helper for the frontend admin panel

const DROPBOX_UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";
const TOKEN_API = "/api/dropbox-token";

export function fixMediaUrl(url) {
  if (!url) return url;
  if (url.includes("dropbox.com")) {
    let u = url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("dl.dropbox.com", "dl.dropboxusercontent.com");
    try {
      const urlObj = new URL(u);
      urlObj.searchParams.delete("dl");
      urlObj.searchParams.set("raw", "1");
      return urlObj.toString();
    } catch (e) {
      // Fallback regex in case of malformed URLs
      u = u.replace(/[?&]dl=[01]/g, "");
      u = u.replace(/[?&]raw=1/g, "");
      u = u.replace(/&&+/g, "&");
      u = u + (u.includes("?") ? "&raw=1" : "?raw=1");
      return u;
    }
  }
  return url;
}

export async function getDropboxToken(signal = null) {
  try {
    const r = await fetch(TOKEN_API, { signal });
    if (!r.ok) return null;
    const d = await r.json();
    return d.token || null;
  } catch {
    return null;
  }
}

export async function uploadToDropbox(file, clientName = "DefaultClient", subfolder = "Images", signal = null) {
  const folder = clientName.replace(/[<>:"\/\\|?*]/g, "").replace(/\s+/g, " ").trim() || "DefaultClient";
  const sub = subfolder.charAt(0).toUpperCase() + subfolder.slice(1).toLowerCase();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `/NassaPortal/${folder}/${sub}/${safeName}`;

  // 1. Get token
  const token = await getDropboxToken(signal);
  if (!token) throw new Error("Could not retrieve Dropbox token");

  // 2. Upload file (using URL parameters to avoid CORS preflight options block in browser)
  const arg = JSON.stringify({ path, mode: "overwrite", autorename: true });
  const uploadUrl = `${DROPBOX_UPLOAD_URL}?authorization=Bearer ${encodeURIComponent(token)}&arg=${encodeURIComponent(arg)}`;
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=dropbox-cors-hack",
    },
    body: file,
    signal,
  });

  if (!uploadRes.ok) {
    const t = await uploadRes.text();
    throw new Error("Dropbox upload failed: " + t);
  }
  const uploadData = await uploadRes.json();

  // 3. Create shared link
  const linkRes = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ path: uploadData.path_lower }),
    signal,
  });
  const linkData = await linkRes.json();
  let url = linkData.url || null;

  // Fallback: list existing links
  if (!url) {
    const listRes = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ path: uploadData.path_lower, direct_only: true }),
      signal,
    });
    const listData = await listRes.json();
    url = listData.links?.[0]?.url || null;
  }

  if (!url) throw new Error("Could not create public link");
  return fixMediaUrl(url);
}

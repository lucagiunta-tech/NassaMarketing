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
    u = u.replace(/[?&]dl=[01]/g, m => m[0]);
    u = u.replace(/[?&]raw=1/g, m => m[0]);
    u = u + (u.includes("?") ? "&raw=1" : "?raw=1");
    return u;
  }
  return url;
}

export async function getDropboxToken() {
  try {
    const r = await fetch(TOKEN_API);
    if (!r.ok) return null;
    const d = await r.json();
    return d.token || null;
  } catch {
    return null;
  }
}

export async function uploadToDropbox(file, clientName = "DefaultClient", subfolder = "Images") {
  const folder = clientName.replace(/[<>:"\/\\|?*]/g, "").replace(/\s+/g, " ").trim() || "DefaultClient";
  const sub = subfolder.charAt(0).toUpperCase() + subfolder.slice(1).toLowerCase();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `/NassaPortal/${folder}/${sub}/${safeName}`;

  // 1. Get token
  const token = await getDropboxToken();
  if (!token) throw new Error("Could not retrieve Dropbox token");

  // 2. Upload file
  const uploadRes = await fetch(DROPBOX_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({ path, mode: "overwrite", autorename: true }),
    },
    body: file,
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
    });
    const listData = await listRes.json();
    url = listData.links?.[0]?.url || null;
  }

  if (!url) throw new Error("Could not create public link");
  return fixMediaUrl(url);
}

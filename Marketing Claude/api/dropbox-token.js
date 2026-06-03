// api/dropbox-token.js
// Returns a short-lived Dropbox access token so the browser can upload directly.
// Add these env vars in Vercel dashboard → Project Settings → Environment Variables:
//   DROPBOX_APP_KEY, DROPBOX_REFRESH_TOKEN, DROPBOX_APP_SECRET

const DROPBOX_APP_KEY       = process.env.DROPBOX_APP_KEY;
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
const DROPBOX_APP_SECRET    = process.env.DROPBOX_APP_SECRET;

let _cachedToken = null;
let _tokenExpiry = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!DROPBOX_APP_KEY || !DROPBOX_REFRESH_TOKEN || !DROPBOX_APP_SECRET) {
    return res.status(500).json({ error: "Dropbox env vars not configured. Add DROPBOX_APP_KEY, DROPBOX_REFRESH_TOKEN, DROPBOX_APP_SECRET in Vercel." });
  }

  try {
    if (!_cachedToken || Date.now() > _tokenExpiry - 60_000) {
      const r = await fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type:    "refresh_token",
          refresh_token: DROPBOX_REFRESH_TOKEN,
          client_id:     DROPBOX_APP_KEY,
          client_secret: DROPBOX_APP_SECRET,
        }),
      });
      const data = await r.json();
      if (!data.access_token) throw new Error("Token refresh failed: " + JSON.stringify(data));
      _cachedToken = data.access_token;
      _tokenExpiry = Date.now() + (data.expires_in || 14400) * 1000;
    }
    return res.status(200).json({ token: _cachedToken });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

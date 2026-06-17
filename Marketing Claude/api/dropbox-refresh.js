// api/dropbox-refresh.js
// Dropbox Token Refresh — exchanges refresh token for a new access token.

const DROPBOX_APP_KEY    = process.env.DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  const { refresh_token } = req.body || {};

  if (!refresh_token) {
    return res.status(400).json({ error: "Missing refresh_token in request body." });
  }

  if (!DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
    return res.status(500).json({ error: "Dropbox env vars not configured. Add DROPBOX_APP_KEY and DROPBOX_APP_SECRET in Vercel." });
  }

  try {
    const r = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: DROPBOX_APP_KEY,
        client_secret: DROPBOX_APP_SECRET,
      }),
    });

    const data = await r.json();
    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Errore durante il refresh del token Dropbox." });
  }
}

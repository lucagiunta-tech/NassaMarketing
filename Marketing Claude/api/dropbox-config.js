// api/dropbox-config.js
// Returns the public Dropbox client ID (App Key) to the client.

const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  return res.status(200).json({
    appKey: DROPBOX_APP_KEY || ""
  });
}

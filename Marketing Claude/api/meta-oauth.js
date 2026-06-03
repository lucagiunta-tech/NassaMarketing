// api/meta-oauth.js
// Facebook / Meta OAuth callback — runs as a Vercel serverless function.
// Facebook redirects here after user authorization.
// Exchanges the code for long-lived page tokens and posts them back
// to the opener window via postMessage, then closes the popup.

const META_APP_ID     = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const REDIRECT_URI    = "https://nassa-marketing-edw5.vercel.app/api/meta-oauth";
const GV              = "v19.0";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const { code, error, error_description } = req.query;

  // User denied or Facebook returned an error
  if (error) {
    return res.status(200).send(buildHtml({
      type:  "META_OAUTH_ERROR",
      error: error_description || error || "Autorizzazione negata",
    }));
  }

  if (!code) {
    return res.status(400).send(buildHtml({
      type:  "META_OAUTH_ERROR",
      error: "Nessun codice OAuth ricevuto.",
    }));
  }

  if (!META_APP_ID || !META_APP_SECRET) {
    return res.status(500).send(buildHtml({
      type:  "META_OAUTH_ERROR",
      error: "Configurazione server mancante: META_APP_ID / META_APP_SECRET.",
    }));
  }

  try {
    // Step 1: exchange code → short-lived user access token
    const tokRes = await fetch(
      `https://graph.facebook.com/${GV}/oauth/access_token?` +
      new URLSearchParams({
        client_id:     META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri:  REDIRECT_URI,
        code,
      })
    );
    const tokData = await tokRes.json();
    if (tokData.error) throw new Error(tokData.error.message);
    const shortToken = tokData.access_token;

    // Step 2: exchange → long-lived user token (valid ~60 days)
    const llRes = await fetch(
      `https://graph.facebook.com/${GV}/oauth/access_token?` +
      new URLSearchParams({
        grant_type:        "fb_exchange_token",
        client_id:         META_APP_ID,
        client_secret:     META_APP_SECRET,
        fb_exchange_token: shortToken,
      })
    );
    const llData  = await llRes.json();
    const longToken = llData.access_token || shortToken;

    // Step 3: fetch managed pages + linked Instagram Business accounts
    const pagesRes = await fetch(
      `https://graph.facebook.com/${GV}/me/accounts?` +
      new URLSearchParams({
        fields:       "id,name,access_token,instagram_business_account{id,name,username}",
        access_token: longToken,
      })
    );
    const pagesData = await pagesRes.json();
    if (pagesData.error) throw new Error(pagesData.error.message);

    // Page tokens derived from a long-lived user token never expire
    const pages = (pagesData.data || []).map(p => ({
      id:           p.id,
      name:         p.name,
      access_token: p.access_token,
      instagram_business_account: p.instagram_business_account || null,
    }));

    return res.status(200).send(buildHtml({ type: "META_OAUTH_PAGES", pages }));

  } catch (e) {
    return res.status(200).send(buildHtml({
      type:  "META_OAUTH_ERROR",
      error: e.message || "Errore sconosciuto durante l'autenticazione Meta.",
    }));
  }
}

// Generates the popup HTML — postMessages to opener then self-closes
function buildHtml(data) {
  const isError = data.type === "META_OAUTH_ERROR";
  const label   = isError
    ? `❌ ${data.error}`
    : `✓ ${(data.pages || []).length} pagina/e trovata/e — connessione completata.`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Meta OAuth — Nassa Studio</title>
  <style>
    body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc}
    .box{text-align:center;padding:40px 32px;background:#fff;border-radius:16px;
      box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:360px;width:90%}
    .icon{font-size:36px;margin-bottom:12px}
    .msg{font-size:14px;line-height:1.5;color:#6b7280;margin:0 0 8px}
    .sub{font-size:12px;color:#9ca3af}
    .brand{margin-top:24px;font-size:11px;color:#9ca3af;letter-spacing:.5px;text-transform:uppercase}
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">${isError ? "⚠️" : "🔗"}</div>
    <p class="msg">${label}</p>
    <p class="sub">Questa finestra si chiuderà automaticamente…</p>
    <div class="brand">NASSA STUDIO</div>
  </div>
  <script>
    (function(){
      var data = ${JSON.stringify(data)};
      try {
        if(window.opener && !window.opener.closed){
          window.opener.postMessage(data, "*");
        }
      } catch(e){}
      setTimeout(function(){ window.close(); }, 1500);
    })();
  </script>
</body>
</html>`;
}

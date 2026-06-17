// api/dropbox-oauth.js
// Dropbox OAuth callback — exchanges authorization code for tokens,
// fetches user info, and sends credentials back to the opener window via postMessage.

const DROPBOX_APP_KEY    = process.env.DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const { code, error, error_description } = req.query;

  // Handle errors returned by Dropbox
  if (error) {
    return res.status(200).send(buildHtml({
      type: "DROPBOX_OAUTH_ERROR",
      error: error_description || error || "Autorizzazione negata da Dropbox",
    }));
  }

  if (!code) {
    return res.status(400).send(buildHtml({
      type: "DROPBOX_OAUTH_ERROR",
      error: "Nessun codice OAuth ricevuto da Dropbox.",
    }));
  }

  if (!DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
    return res.status(500).send(buildHtml({
      type: "DROPBOX_OAUTH_ERROR",
      error: "Configurazione server mancante: DROPBOX_APP_KEY / DROPBOX_APP_SECRET.",
    }));
  }

  try {
    // Dynamic redirect URI - must match the exact string sent in the authorization popup
    const host = req.headers.host;
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/dropbox-oauth`;

    // 1. Exchange code for access & refresh tokens
    const tokRes = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: DROPBOX_APP_KEY,
        client_secret: DROPBOX_APP_SECRET,
        redirect_uri: redirectUri,
      }),
    });

    const tokData = await tokRes.json();
    if (tokData.error) {
      throw new Error(tokData.error_description || JSON.stringify(tokData.error));
    }

    const { access_token, refresh_token, expires_in, account_id } = tokData;

    // 2. Fetch user's account details (name and email)
    const userRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(null),
    });

    let email = "";
    let displayName = "Dropbox User";
    if (userRes.ok) {
      const userData = await userRes.json();
      email = userData.email || "";
      displayName = userData.name?.display_name || userData.email || "Dropbox User";
    }

    const credentials = {
      accessToken: access_token,
      refreshToken: refresh_token || null,
      expiresAt: Date.now() + (expires_in || 14400) * 1000,
      accountId: account_id || "",
      email,
      name: displayName,
    };

    return res.status(200).send(buildHtml({
      type: "DROPBOX_OAUTH_SUCCESS",
      credentials,
    }));

  } catch (e) {
    return res.status(200).send(buildHtml({
      type: "DROPBOX_OAUTH_ERROR",
      error: e.message || "Errore durante l'autenticazione con Dropbox.",
    }));
  }
}

function buildHtml(data) {
  const isError = data.type === "DROPBOX_OAUTH_ERROR";
  const label = isError
    ? `❌ ${data.error}`
    : `✓ Connesso con successo come ${data.credentials?.name}.`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Dropbox OAuth — Nassa Studio</title>
  <style>
    body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc}
    .box{text-align:center;padding:40px 32px;background:#fff;border-radius:16px;
      box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:360px;width:90%}
    .icon{font-size:36px;margin-bottom:12px}
    .msg{font-size:14px;line-height:1.5;color:#6b7280;margin:0 0 8px;font-weight:600}
    .sub{font-size:12px;color:#9ca3af}
    .brand{margin-top:24px;font-size:11px;color:#0061FE;letter-spacing:.5px;text-transform:uppercase;font-weight:800}
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">${isError ? "⚠️" : "💾"}</div>
    <p class="msg">${label}</p>
    <p class="sub">Questa finestra si chiuderà automaticamente…</p>
    <div class="brand">DROPBOX SYNC</div>
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

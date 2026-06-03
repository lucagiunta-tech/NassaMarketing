// api/meta-oauth.js
// Vercel serverless function — Meta OAuth popup callback.
// Exchanges code → short-lived token → long-lived token → page list.
// Env vars: META_APP_ID, META_APP_SECRET, META_REDIRECT_URI

const APP_ID       = process.env.META_APP_ID;
const APP_SECRET   = process.env.META_APP_SECRET;
const REDIRECT_URI = process.env.META_REDIRECT_URI;
const ALLOWED_ORIGIN = REDIRECT_URI
  ? new URL(REDIRECT_URI).origin
  : "https://nassa-marketing-edw5.vercel.app";

const GRAPH = "https://graph.facebook.com/v19.0";

function html(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>
    body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;
    min-height:100vh;margin:0;background:#f5f5f5;}
    .card{background:#fff;border-radius:12px;padding:32px 40px;box-shadow:0 2px 16px rgba(0,0,0,.1);
    text-align:center;max-width:360px;}
    .icon{font-size:40px;margin-bottom:12px;}
    h2{margin:0 0 8px;font-size:18px;color:#111;}
    p{margin:0;font-size:14px;color:#666;}
  </style>
</head><body><div class="card">${body}</div>
<script>setTimeout(()=>window.close(),2000);</script>
</body></html>`;
}

export default async function handler(req, res) {
  const { code, error: oauthError } = req.query;

  if (oauthError) {
    res.setHeader("Content-Type", "text/html");
    res.send(html(`<div class="icon">❌</div><h2>Accesso negato</h2><p>${oauthError}</p>
      <script>window.opener?.postMessage({type:"META_AUTH_ERROR",error:"${oauthError}"},"${ALLOWED_ORIGIN}");setTimeout(()=>window.close(),2000);</script>`));
    return;
  }

  if (!code) {
    res.setHeader("Content-Type", "text/html");
    res.send(html(`<div class="icon">⚠️</div><h2>Codice mancante</h2><p>Parametro code assente.</p>
      <script>window.opener?.postMessage({type:"META_AUTH_ERROR",error:"missing_code"},"${ALLOWED_ORIGIN}");setTimeout(()=>window.close(),2000);</script>`));
    return;
  }

  if (!APP_ID || !APP_SECRET || !REDIRECT_URI) {
    res.setHeader("Content-Type", "text/html");
    res.send(html(`<div class="icon">⚙️</div><h2>Configurazione mancante</h2><p>Env vars META_APP_ID / META_APP_SECRET / META_REDIRECT_URI non configurate.</p>`));
    return;
  }

  try {
    // 1. Exchange code → short-lived user token
    const tokenRes = await fetch(
      `${GRAPH}/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error.message);
    const shortToken = tokenData.access_token;

    // 2. Exchange short-lived → long-lived user token (~60 days)
    const longRes = await fetch(
      `${GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longData = await longRes.json();
    if (longData.error) throw new Error(longData.error.message);
    const longToken = longData.access_token;
    const expiresAt = Date.now() + (longData.expires_in || 5184000) * 1000;

    // 3. Fetch managed pages (page tokens from long-lived user token never expire)
    const pagesRes = await fetch(
      `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${longToken}`
    );
    const pagesData = await pagesRes.json();
    if (pagesData.error) throw new Error(pagesData.error.message);

    const pages = (pagesData.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      accessToken: p.access_token,
      instagram: p.instagram_business_account || null,
    }));

    const payload = {
      type: "META_AUTH_SUCCESS",
      longToken,
      expiresAt,
      pages,
    };

    res.setHeader("Content-Type", "text/html");
    res.send(html(`
      <div class="icon">✅</div>
      <h2>Connesso!</h2>
      <p>${pages.length} pagina${pages.length !== 1 ? "/e" : ""} trovata/e.</p>
      <p style="font-size:12px;margin-top:8px;color:#999;">Questa finestra si chiuderà automaticamente.</p>
      <script>
        window.opener?.postMessage(${JSON.stringify(payload)}, "${ALLOWED_ORIGIN}");
        setTimeout(() => window.close(), 2000);
      </script>`));
  } catch (err) {
    const msg = err.message || "Errore sconosciuto";
    res.setHeader("Content-Type", "text/html");
    res.send(html(`<div class="icon">❌</div><h2>Errore OAuth</h2><p>${msg}</p>
      <script>window.opener?.postMessage({type:"META_AUTH_ERROR",error:${JSON.stringify(msg)}},"${ALLOWED_ORIGIN}");setTimeout(()=>window.close(),2500);</script>`));
  }
}

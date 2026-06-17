// src/modules/meta/GlobalDropboxConnect.jsx
// Dropbox Cloud Sync connection panel for the sidebar/settings.

import { useState, useEffect } from "react";

export function GlobalDropboxConnect({
  syncConfig,
  onConnect,
  onDisconnect,
  onToggleActive,
  onForceLoad,
  onForceSave,
  syncStatus = "idle",
  syncError = "",
  lastSyncTime = null
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOauthMessage = (e) => {
      if (e.data?.type === "DROPBOX_OAUTH_SUCCESS") {
        setLoading(false);
        setError("");
        if (e.data.credentials) {
          onConnect?.(e.data.credentials);
        }
      } else if (e.data?.type === "DROPBOX_OAUTH_ERROR") {
        setLoading(false);
        setError(e.data.error || "Errore di autenticazione Dropbox.");
      }
    };

    window.addEventListener("message", handleOauthMessage);
    return () => window.removeEventListener("message", handleOauthMessage);
  }, [onConnect]);

  async function handleConnect() {
    setLoading(true);
    setError("");

    try {
      // 1. Fetch public App Key from backend config endpoint
      const r = await fetch("/api/dropbox-config");
      if (!r.ok) throw new Error("Impossibile recuperare la chiave app dal server.");
      const d = await r.json();
      if (!d.appKey) throw new Error("Chiave app Dropbox non configurata.");

      // 2. Build redirect URI
      const host = window.location.host;
      const protocol = window.location.origin.includes("localhost") ? "http" : "https";
      // Fallback: If on localhost, use the production redirect URL so postMessage can relay the credentials
      const redirectUri = window.location.origin.includes("localhost")
        ? "https://nassa-marketing-edw5.vercel.app/api/dropbox-oauth"
        : `${protocol}://${host}/api/dropbox-oauth`;

      // 3. Open Dropbox OAuth popup
      const oauthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${d.appKey}&response_type=code&token_access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      const width = 580;
      const height = 680;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        oauthUrl,
        "DropboxOAuth",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );
    } catch (e) {
      setLoading(false);
      setError(e.message || "Errore di connessione.");
    }
  }

  function handleDisconnect() {
    if (window.confirm("Disconnettere Dropbox? I dati rimarranno salvati in questo browser ma non verranno più sincronizzati sul cloud.")) {
      onDisconnect?.();
      setError("");
    }
  }

  // Format timestamp
  function formatTime(ts) {
    if (!ts) return "Mai";
    return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  const isConnected = !!syncConfig?.refreshToken;
  const isActive = !!syncConfig?.active;

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.logoContainer}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0061FE" style={{ display: "block" }}>
            <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM6 14l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM12 6.5l6 3.5-6 4-6-4 6-3.5z"/>
          </svg>
        </div>
        <span style={s.title}>Dropbox Cloud Sync</span>
        {isConnected && (
          <span style={isActive ? s.dotOk : s.dotWarn} />
        )}
      </div>

      {isConnected ? (
        <div style={s.body}>
          <div style={s.userInfo}>
            <div style={s.userName}>{syncConfig.name || "Utente Dropbox"}</div>
            <div style={s.userEmail}>{syncConfig.email || "Connesso"}</div>
          </div>

          <div style={s.row}>
            <span style={s.label}>Sincronizzazione attiva</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => onToggleActive?.(e.target.checked)}
              style={s.toggle}
            />
          </div>

          <div style={s.statusContainer}>
            <div style={s.statusRow}>
              <span>Stato:</span>
              <strong style={syncStatus === "syncing" ? s.statusSyncing : syncStatus === "error" ? s.statusError : s.statusOk}>
                {syncStatus === "syncing" && "🔄 Sincronizzazione..."}
                {syncStatus === "error" && "⚠️ Errore Sync"}
                {syncStatus === "synced" && "✓ Sincronizzato"}
                {syncStatus === "idle" && "In attesa"}
              </strong>
            </div>
            <div style={s.statusRow}>
              <span>Ultimo sync:</span>
              <span>{formatTime(lastSyncTime)}</span>
            </div>
            {syncError && <div style={s.errorTxt}>{syncError}</div>}
          </div>

          <div style={s.actions}>
            <button style={s.actionBtn} onClick={onForceSave} title="Invia il database locale a Dropbox" disabled={syncStatus === "syncing"}>
              📤 Salva
            </button>
            <button style={s.actionBtn} onClick={onForceLoad} title="Scarica il database da Dropbox su questo browser" disabled={syncStatus === "syncing"}>
              📥 Carica
            </button>
            <button style={s.disconnectBtn} onClick={handleDisconnect}>
              Disconnetti
            </button>
          </div>
        </div>
      ) : (
        <div style={s.body}>
          <p style={s.desc}>
            Salva il database editoriale su Dropbox per caricare e sincronizzare gli stessi post tra diversi PC o browser.
          </p>
          <button
            style={s.connectBtn}
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Apertura popup..." : "Connetti Dropbox"}
          </button>
          {error && <div style={s.errorTxt}>{error}</div>}
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: "#1E293B",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    border: "1px solid #334155"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  logoContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    background: "rgba(0,97,254,.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    color: "#E2E8F0",
    flex: 1
  },
  dotOk: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#10B981"
  },
  dotWarn: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#F59E0B"
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  desc: {
    fontSize: 9,
    color: "#94A3B8",
    margin: "0 0 4px",
    lineHeight: 1.3
  },
  connectBtn: {
    width: "100%",
    padding: "6px 10px",
    background: "#0061FE",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center"
  },
  userInfo: {
    background: "#0F172A",
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #334155"
  },
  userName: {
    fontSize: 10,
    fontWeight: 700,
    color: "#E2E8F0"
  },
  userEmail: {
    fontSize: 8,
    color: "#94A3B8"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2px 0"
  },
  label: {
    fontSize: 9,
    color: "#94A3B8"
  },
  toggle: {
    cursor: "pointer"
  },
  statusContainer: {
    background: "#0F172A",
    borderRadius: 6,
    padding: 6,
    fontSize: 8,
    color: "#94A3B8",
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  statusOk: {
    color: "#10B981"
  },
  statusSyncing: {
    color: "#60A5FA"
  },
  statusError: {
    color: "#EF4444"
  },
  errorTxt: {
    fontSize: 8,
    color: "#F87171",
    fontWeight: 600,
    marginTop: 2
  },
  actions: {
    display: "flex",
    gap: 4,
    marginTop: 4
  },
  actionBtn: {
    flex: 1,
    padding: "4px 6px",
    background: "#334155",
    color: "#E2E8F0",
    border: "none",
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center"
  },
  disconnectBtn: {
    padding: "4px 6px",
    background: "rgba(239,68,68,.1)",
    color: "#EF4444",
    border: "none",
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

export default GlobalDropboxConnect;

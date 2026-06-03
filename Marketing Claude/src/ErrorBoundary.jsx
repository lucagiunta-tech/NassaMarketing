/**
 * NMS Error Boundaries
 * Fase 3.2 — Hardening
 *
 * Due livelli:
 *   <AppErrorBoundary>   — avvolge tutta la root. Schermata di reset completo.
 *   <ModuleErrorBoundary name="..."> — avvolge ogni vista/modulo.
 *                                      Mostra fallback inline, il resto dell'app resta vivo.
 *
 * Entrambi loggano in console con contesto (componentStack).
 * Nessuna dipendenza esterna.
 */

import { Component } from "react";
import { clearWorkspace, META_STORAGE_KEY } from "./services/storageService";

// ─── CSS inline (tokens dal design system NMS) ────────────────────────────────
const EB_CSS = `
.eb-app-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9F9F7;
  font-family: 'Inter', system-ui, sans-serif;
  padding: 24px;
}
.eb-app-card {
  background: #fff;
  border: 1px solid #E0E0DC;
  border-radius: 12px;
  padding: 32px 36px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
}
.eb-app-glyph {
  font-size: 32px;
  margin-bottom: 12px;
}
.eb-app-title {
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 6px;
}
.eb-app-sub {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 20px;
}
.eb-app-rule {
  font-size: 10px;
  font-weight: 700;
  color: #C2185B;
  background: rgba(194,24,91,.07);
  border: 1px solid rgba(194,24,91,.18);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 20px;
  letter-spacing: .3px;
}
.eb-app-detail {
  font-size: 10px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #9CA3AF;
  background: #F3F4F6;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 20px;
  overflow: auto;
  max-height: 100px;
  white-space: pre-wrap;
  word-break: break-all;
}
.eb-app-actions {
  display: flex;
  gap: 8px;
}
.eb-btn-primary {
  flex: 1;
  padding: 9px 16px;
  background: #1F2937;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.eb-btn-primary:hover { background: #111827; }
.eb-btn-ghost {
  padding: 9px 16px;
  background: none;
  color: #6B7280;
  border: 1px solid #E0E0DC;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}
.eb-btn-ghost:hover { background: #F9F9F7; color: #1F2937; }

/* Module-level fallback — inline, doesn't kill the whole app */
.eb-mod-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  text-align: center;
  flex: 1;
  background: #F9F9F7;
  border-top: 1px solid #E0E0DC;
}
.eb-mod-glyph {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: .6;
}
.eb-mod-title {
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}
.eb-mod-sub {
  font-size: 11px;
  color: #6B7280;
  margin-bottom: 14px;
  line-height: 1.5;
}
.eb-mod-retry {
  padding: 6px 14px;
  background: none;
  border: 1px solid #C8C8C4;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
}
.eb-mod-retry:hover { background: #F3F4F6; }
.eb-mod-detail {
  margin-top: 10px;
  font-size: 9px;
  font-family: monospace;
  color: #9CA3AF;
  max-width: 320px;
  word-break: break-all;
}
`;

// ─── APP-LEVEL BOUNDARY ───────────────────────────────────────────────────────
// Cattura errori ovunque nell'albero. Mostra schermata di reset completo.

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this._handleReset = this._handleReset.bind(this);
    this._handleClearStorage = this._handleClearStorage.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log strutturato — in produzione sostituire con Sentry/LogRocket
    console.error("[NMS AppErrorBoundary]", {
      message: error?.message,
      stack: error?.stack?.slice(0, 500),
      componentStack: errorInfo?.componentStack?.slice(0, 500),
      timestamp: new Date().toISOString(),
    });
  }

  _handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  _handleClearStorage() {
    // Usa il servizio ufficiale — gestisce sia window.storage che localStorage
    Promise.all([
      clearWorkspace(),
      clearWorkspace(META_STORAGE_KEY),
    ]).finally(() => {
      window.location.reload();
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || "Errore sconosciuto";
    const showDetail = process.env.NODE_ENV !== "production";

    return (
      <>
        <style>{EB_CSS}</style>
        <div className="eb-app-wrap">
          <div className="eb-app-card">
            <div className="eb-app-glyph">⚠️</div>
            <div className="eb-app-title">Qualcosa è andato storto</div>
            <div className="eb-app-sub">
              Nassa Marketing Studio ha incontrato un errore inatteso.
              Prova a ricaricare — i dati sono salvati automaticamente.
            </div>
            <div className="eb-app-rule">
              Regola #6 — L'output AI passa sempre da revisione umana.<br/>
              Se l'errore si ripete dopo una generazione AI, pulisci la sezione e riprova.
            </div>
            {showDetail && msg && (
              <div className="eb-app-detail">{msg}</div>
            )}
            <div className="eb-app-actions">
              <button className="eb-btn-primary" onClick={this._handleReset}>
                ↩ Riprova
              </button>
              <button className="eb-btn-ghost" onClick={this._handleClearStorage}>
                🗑 Reset workspace
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

// ─── MODULE-LEVEL BOUNDARY ────────────────────────────────────────────────────
// Avvolge singole viste/moduli. L'app resta viva, solo il modulo crasha.

export class ModuleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this._handleRetry = this._handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const name = this.props.name || "unknown";
    console.error(`[NMS ModuleErrorBoundary: ${name}]`, {
      message: error?.message,
      componentStack: errorInfo?.componentStack?.slice(0, 300),
      timestamp: new Date().toISOString(),
    });
  }

  // Quando il modulo cambia (es. utente apre un altro progetto), reset automatico
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  _handleRetry() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const name    = this.props.name || "Modulo";
    const msg     = this.state.error?.message;
    const showDev = process.env.NODE_ENV !== "production";

    return (
      <div className="eb-mod-wrap">
        <div className="eb-mod-glyph">🔧</div>
        <div className="eb-mod-title">{name} non disponibile</div>
        <div className="eb-mod-sub">
          Questo modulo ha incontrato un errore.<br/>
          Gli altri moduli e i dati non sono stati toccati.
        </div>
        <button className="eb-mod-retry" onClick={this._handleRetry}>
          ↩ Riprova
        </button>
        {showDev && msg && (
          <div className="eb-mod-detail">{msg}</div>
        )}
      </div>
    );
  }
}

// aiService.js — Claude API wrapper with retry, prompt caching, safe parsing

export const AI_DEFAULT_MODEL      = "claude-sonnet-4-5-20251001";
export const AI_DEFAULT_MAX_TOKENS = 1000;
export const AI_DEFAULT_RETRIES     = 2;
export const AI_RETRY_DELAY_MS     = 1500;
const API_URL            = "https://api.anthropic.com/v1/messages";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function serializeAiError(err) {
  if (!err) return "Errore sconosciuto";
  if (typeof err === "string") return err;
  if (err.error?.message) return err.error.message;
  if (err.message) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

function parseAiText(raw) {
  if (!raw) return "";
  // Try JSON parse first (for structured responses), fall back to raw string
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed); } catch { /* fall through to raw */ }
  }
  // Strip markdown code fences if present
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch { return fenced[1]; }
  }
  return raw;
}

/**
 * Core API call with retry.
 * @param {string} prompt
 * @param {object} opts
 * @param {string}   [opts.model]
 * @param {number}   [opts.maxTokens]
 * @param {number}   [opts.retries]
 * @param {string}   [opts.systemPrompt]  — cached system context (brand voice, etc.)
 * @param {Function} [opts.fetchFn]
 * @returns {Promise<string>}
 */
export async function callAiMessages(prompt, opts = {}) {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt non valido o vuoto.");
  }

  const model     = opts.model      || AI_DEFAULT_MODEL;
  const maxTokens = opts.maxTokens  || AI_DEFAULT_MAX_TOKENS;
  const retries   = opts.retries    ?? AI_DEFAULT_RETRIES;
  const fetchFn   = opts.fetchFn    || (typeof fetch !== "undefined" ? fetch : null);

  if (!fetchFn) throw new Error("fetch non disponibile in questo ambiente.");

  const apiKey = typeof window !== "undefined"
    ? (window.__ANTHROPIC_KEY__ || import.meta?.env?.VITE_ANTHROPIC_API_KEY)
    : process?.env?.ANTHROPIC_API_KEY;

  if (!apiKey) throw new Error("Chiave API Anthropic non configurata.");

  const messages = [{ role: "user", content: prompt }];

  // Build request body — enable prompt caching on system prompt if provided
  const body = {
    model,
    max_tokens: maxTokens,
    messages,
  };

  if (opts.systemPrompt) {
    body.system = [
      {
        type: "text",
        text: opts.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ];
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(AI_RETRY_DELAY_MS);
    try {
      const res = await fetchFn(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "prompt-caching-2024-07-31",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const raw = json?.content?.[0]?.text ?? "";
      return raw;
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(serializeAiError(lastError));
}

/**
 * Simple wrapper — returns parsed text or throws.
 */
export async function callClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, systemPrompt) {
  const raw = await callAiMessages(prompt, { maxTokens, systemPrompt });
  return parseAiText(raw);
}

/**
 * Safe wrapper — never throws; returns { ok, text, error }.
 */
export async function safeCallClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, systemPrompt) {
  try {
    const text = await callClaude(prompt, maxTokens, systemPrompt);
    return { ok: true, text, error: null };
  } catch (err) {
    return { ok: false, text: "", error: serializeAiError(err) };
  }
}

export default { callAiMessages, callClaude, safeCallClaude };

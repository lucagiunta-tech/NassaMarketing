// aiService.js — OpenRouter API wrapper with retry and safe parsing

export const AI_DEFAULT_MODEL      = "google/gemma-4-31b-it";
const       AI_FALLBACK_MODEL      = "google/gemma-3-27b-it";
export const AI_DEFAULT_MAX_TOKENS = 2000;
export const AI_DEFAULT_RETRIES    = 2;
export const AI_RETRY_DELAY_MS     = 1500;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Key from Vercel env var VITE_OPENROUTER_API_KEY
const OPENROUTER_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENROUTER_API_KEY) || "";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function serializeAiError(err) {
  if (!err) return "Errore sconosciuto";
  if (typeof err === "string") return err;
  if (err.error?.message) return err.error.message;
  if (err.message) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

function parseAiText(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed); } catch { /* fall through */ }
  }
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) { try { return JSON.parse(fenced[1]); } catch { return fenced[1]; } }
  return raw;
}

/**
 * Core OpenRouter call with retry + model fallback.
 * @param {string} prompt
 * @param {{ model?, maxTokens?, retries?, systemPrompt? }} opts
 * @returns {Promise<string>}
 */
export async function callAiMessages(prompt, opts = {}) {
  if (!prompt?.trim()) throw new Error("Prompt non valido o vuoto.");

  const maxTokens = opts.maxTokens  || AI_DEFAULT_MAX_TOKENS;
  const retries   = opts.retries    ?? AI_DEFAULT_RETRIES;
  const models    = [opts.model || AI_DEFAULT_MODEL, AI_FALLBACK_MODEL];

  const messages = [];
  if (opts.systemPrompt) messages.push({ role: "system", content: opts.systemPrompt });
  messages.push({ role: "user", content: prompt });

  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(AI_RETRY_DELAY_MS);
      try {
        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "HTTP-Referer": "https://nassa-marketing-edw5.vercel.app",
            "X-Title": "Nassa Marketing Studio",
          },
          body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
        });

        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error?.message || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        const text = json?.choices?.[0]?.message?.content ?? "";
        if (!text && model !== models[models.length - 1]) break; // try fallback
        return text;
      } catch (err) {
        lastError = err;
      }
    }
  }

  throw new Error(serializeAiError(lastError));
}

export async function callClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, systemPrompt) {
  const raw = await callAiMessages(prompt, { maxTokens, systemPrompt });
  return parseAiText(raw);
}

export async function safeCallClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, systemPrompt) {
  try {
    const text = await callClaude(prompt, maxTokens, systemPrompt);
    return { ok: true, text, error: null };
  } catch (err) {
    return { ok: false, text: "", error: serializeAiError(err) };
  }
}

export default { callAiMessages, callClaude, safeCallClaude };

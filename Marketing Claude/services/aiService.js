// =============================================================================
// AI SERVICE
// =============================================================================
// Thin AI wrapper extracted from MarketingStudio.
// Keeps the same public API used by the UI: callClaude(prompt, maxTokens).

export const AI_DEFAULT_MODEL = "claude-sonnet-4-20250514";
export const AI_DEFAULT_MAX_TOKENS = 1000;
export const AI_DEFAULT_RETRIES = 2;
export const AI_RETRY_DELAY_MS = 1500;

export function serializeAiError(error) {
  if (!error) return "Errore AI sconosciuto";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callAiMessages({
  prompt,
  maxTokens = AI_DEFAULT_MAX_TOKENS,
  model = AI_DEFAULT_MODEL,
  retries = AI_DEFAULT_RETRIES,
  endpoint = "https://api.anthropic.com/v1/messages",
  fetchImpl = typeof fetch !== "undefined" ? fetch : null,
} = {}) {
  if (!prompt || !String(prompt).trim()) {
    throw new Error("Prompt AI vuoto");
  }
  if (!fetchImpl) {
    throw new Error("Fetch non disponibile in questo ambiente");
  }

  let attempts = 0;
  let lastError = null;

  while (attempts < retries) {
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = data?.error?.message || data?.message || `Errore AI HTTP ${response.status}`;
        throw new Error(apiMessage);
      }

      return data.content?.map(block => block.text || "").join("") || "";
    } catch (error) {
      lastError = error;
      attempts += 1;
      if (attempts >= retries) break;
      await sleep(AI_RETRY_DELAY_MS);
    }
  }

  throw lastError || new Error("Errore AI non gestito");
}

export async function callClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, options = {}) {
  return callAiMessages({ prompt, maxTokens, ...options });
}

export async function safeCallClaude(prompt, maxTokens = AI_DEFAULT_MAX_TOKENS, options = {}) {
  try {
    const text = await callClaude(prompt, maxTokens, options);
    return { ok: true, text, error: null };
  } catch (error) {
    console.error("AI generation error", error);
    return { ok: false, text: "", error: serializeAiError(error) };
  }
}

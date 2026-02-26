import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.5-flash';
const TIMEOUT_MS = 30_000; // 30 second hard limit

// Initialize ONCE at module load
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock');


 
const getModel = (systemInstruction = null) => {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    ...(systemInstruction && { systemInstruction }),
  });
};

/**
 * @param {string} prompt
 * @param {object} meta { userId, route, systemInstruction, history }
 * @returns {{ success: boolean, data?: string, error?: string, code?: string }}
 */
export async function callGemini(prompt, meta = {}) {
  const ts = new Date().toISOString();
  const { userId = 'unknown', route = 'unknown', systemInstruction = null, history = null } = meta;

  console.log(`[GEMINI][${ts}] Executing for user=${userId} route=${route} model=${MODEL_NAME}`);

  // Timeout wrapper
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), TIMEOUT_MS)
  );

  try {
    const model = getModel(systemInstruction);
    let resultPromise;

    if (history) {
      // Chat mode
      const chat = model.startChat({ history });
      resultPromise = chat.sendMessage(prompt);
    } else {
      // Normal generate content
      resultPromise = model.generateContent(prompt);
    }

    const result = await Promise.race([
      resultPromise,
      timeoutPromise,
    ]);

    const text = result.response.text();
    console.log(`[GEMINI][${ts}] SUCCESS user=${userId} chars=${text?.length}`);
    return { success: true, data: text };

  } catch (err) {
    return classifyError(err, { ts, userId, route });
  }
}

function classifyError(err, { ts, userId, route }) {
  const msg = err.message || '';
  let code = 'UNKNOWN';
  let userMessage = 'Service temporarily unavailable. Please retry later.';

  if (msg === 'GEMINI_TIMEOUT') {
    code = 'TIMEOUT';
    userMessage = 'Request timed out. The AI service may be busy or rate limited. Please wait a moment and try again.';
  } else if (msg.includes('401') || msg.includes('API key')) {
    code = 'AUTH_ERROR';
    userMessage = 'Authentication error. Contact support.';
  } else if (msg.includes('403')) {
    code = 'FORBIDDEN';
    userMessage = 'Access denied. Billing may not be active.';
  } else if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    code = 'RATE_LIMITED';
    userMessage = 'Too many requests. Please wait and try again.';
  } else if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
    code = 'NETWORK_ERROR';
    userMessage = 'Network error. Please check connectivity.';
  }

  console.error(`[GEMINI_ERR][${ts}] code=${code} user=${userId} route=${route} msg=${msg}`);
  return { success: false, error: userMessage, code };
}

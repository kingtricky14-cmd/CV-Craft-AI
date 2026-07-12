import OpenAI from 'openai';
import 'dotenv/config';

let client = null;

// OpenRouter (https://openrouter.ai) exposes an OpenAI-compatible API, so we
// can use the standard `openai` SDK just by pointing it at OpenRouter's
// baseURL and using an OpenRouter API key instead of an OpenAI one.
export function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    const err = new Error(
      'AI features are not configured yet. Set OPENROUTER_API_KEY in backend/.env to enable them.'
    );
    err.status = 503;
    throw err;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        // Optional but recommended by OpenRouter — identifies your app in
        // their dashboard/analytics. Not required for requests to work.
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'CVCraft AI',
      },
    });
  }

  return client;
}

// Any model slug from https://openrouter.ai/models works here — override
// via OPENROUTER_MODEL in .env without touching code. Defaults to Claude.
export const AI_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4.5';

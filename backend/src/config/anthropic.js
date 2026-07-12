import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

let client = null;

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error(
      'AI features are not configured yet. Set ANTHROPIC_API_KEY in backend/.env to enable them.'
    );
    err.status = 503;
    throw err;
  }

  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  return client;
}

export const AI_MODEL = 'claude-sonnet-4-6';

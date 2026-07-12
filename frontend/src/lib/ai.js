import { api } from './api';

export function generateSummary(payload) {
  return api.post('/ai/summary', payload);
}

export function generateCoverLetterDraft(payload) {
  return api.post('/ai/cover-letter', payload);
}

import { getOpenRouterClient, AI_MODEL } from '../config/openrouter.js';
import { buildSummaryPrompt, buildCoverLetterPrompt } from '../utils/aiPrompts.js';
import { buildFallbackSummary, buildFallbackCoverLetter } from '../utils/aiFallback.js';

function extractText(completion) {
  return completion.choices?.[0]?.message?.content?.trim() || '';
}

async function generateWithOpenRouter(prompt, { maxTokens = 300 } = {}) {
  const client = getOpenRouterClient();

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });

  return extractText(completion);
}

// POST /api/ai/summary
// body: { professionalTitle?, experience?, education?, skills? }
// Takes whatever the user has typed into the builder so far — no need to
// save the resume first.
export async function generateSummary(req, res, next) {
  try {
    const { professionalTitle, experience = [], education = [], skills = [] } = req.body;
    const prompt = buildSummaryPrompt({ professionalTitle, experience, education, skills });

    let summary = '';

    try {
      summary = await generateWithOpenRouter(prompt, { maxTokens: 300 });
    } catch (err) {
      if (err.status === 503 || err.message?.includes('AI features are not configured')) {
        summary = buildFallbackSummary({ professionalTitle, experience, education, skills });
      } else {
        throw err;
      }
    }

    res.json({ summary });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/cover-letter
// body: { company?, position?, hiringManager?, personalInfo?, experience?, skills? }
export async function generateCoverLetter(req, res, next) {
  try {
    const {
      company,
      position,
      hiringManager,
      personalInfo = {},
      experience = [],
      skills = [],
    } = req.body;

    const prompt = buildCoverLetterPrompt({ company, position, hiringManager, personalInfo, experience, skills });

    let letter = '';

    try {
      letter = await generateWithOpenRouter(prompt, { maxTokens: 600 });
    } catch (err) {
      if (err.status === 503 || err.message?.includes('AI features are not configured')) {
        letter = buildFallbackCoverLetter({ company, position, personalInfo, experience, skills });
      } else {
        throw err;
      }
    }

    res.json({ letter });
  } catch (err) {
    next(err);
  }
}

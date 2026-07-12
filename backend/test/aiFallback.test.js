import test from 'node:test';
import assert from 'node:assert/strict';

import { buildFallbackSummary, buildFallbackCoverLetter } from '../src/utils/aiFallback.js';

test('buildFallbackSummary creates a concise summary from provided details', () => {
  const summary = buildFallbackSummary({
    professionalTitle: 'Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: [
      {
        position: 'Frontend Developer',
        company: 'Acme Labs',
        responsibilities: 'Built user-facing features and improved performance.',
      },
    ],
  });

  assert.match(summary, /Software Engineer/i);
  assert.match(summary, /JavaScript|React|Node/i);
  assert.ok(summary.length > 20);
});

test('buildFallbackCoverLetter creates a tailored letter body from provided details', () => {
  const letter = buildFallbackCoverLetter({
    company: 'CVCraft AI',
    position: 'Product Designer',
    personalInfo: { first_name: 'Ada', last_name: 'Lovelace', professional_title: 'Product Designer' },
    experience: [
      {
        position: 'UX Designer',
        company: 'Studio X',
        responsibilities: 'Designed onboarding flows and improved usability.',
      },
    ],
    skills: ['Figma', 'Design systems'],
  });

  assert.match(letter, /CVCraft AI/i);
  assert.match(letter, /Product Designer/i);
  assert.match(letter, /Figma|Design systems/i);
  assert.ok(letter.length > 60);
});

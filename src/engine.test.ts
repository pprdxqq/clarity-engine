import { describe, expect, it } from 'vitest';
import { buildPrompt, getPromptScore, reviewPrompt } from './engine';

describe('prompt coaching', () => {
  it('recognizes useful signals in a specific prompt', () => {
    const prompt = 'Write a friendly email for new club members. Keep it under 150 words and include a clear RSVP action.';
    const checks = reviewPrompt(prompt);
    expect(checks.find(item => item.label === 'Clear goal')?.present).toBe(true);
    expect(checks.find(item => item.label === 'Audience or point of view')?.present).toBe(true);
    expect(getPromptScore(prompt)).toBeGreaterThan(40);
  });

  it('composes a prompt from the learner’s own details', () => {
    const prompt = buildPrompt({ goal: 'Draft an event invite', context: 'A free neighborhood repair café', audience: 'Local families', format: 'Instagram caption under 80 words', constraints: 'Mention Saturday, 10–2; avoid jargon', voice: 'warm' });
    expect(prompt).toContain('Draft an event invite');
    expect(prompt).toContain('Local families');
    expect(prompt).toContain('Instagram caption under 80 words');
    expect(prompt).toContain('warm, human tone');
    expect(prompt).toContain('ask up to two focused questions');
  });
});

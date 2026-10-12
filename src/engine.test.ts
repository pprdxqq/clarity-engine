import { describe, expect, it } from 'vitest';
import { createGuidance } from './engine';

describe('createGuidance', () => {
  it('creates a specific decision frame and practical action', () => {
    const result = createGuidance({ problem: 'whether to change jobs', kind: 'decision', impact: 'high', control: 'some' });
    expect(result.frame).toContain('whether to change jobs');
    expect(result.firstStep).toContain('criterion');
  });
  it('accounts for low control without abandoning agency', () => {
    const result = createGuidance({ problem: '', kind: 'people', impact: 'medium', control: 'little' });
    expect(result.experiment).toContain('within your control');
  });
});

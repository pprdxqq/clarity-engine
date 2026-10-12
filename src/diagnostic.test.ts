import { describe, expect, it } from 'vitest';
import { buildDiagnosticReport, followUpFor, type DiagnosticAnswers } from './diagnostic';

const base: DiagnosticAnswers = {
  challenge: 'mismatch',
  clarity: 'partial',
  frequency: 'often',
  example: 'I asked for a minimalist page and got a crowded layout.',
};

describe('prompt diagnosis', () => {
  it('branches the follow-up question based on the selected problem', () => {
    expect(followUpFor('mismatch').prompt).toContain('misses your vision');
    expect(followUpFor('generic').prompt).toContain('context and details');
    expect(followUpFor('revision-loop').prompt).toContain('what should change');
  });

  it('returns a tentative, evidence-based hypothesis rather than a fixed label', () => {
    const report = buildDiagnosticReport(base);
    expect(report.title).toContain('mental picture');
    expect(report.evidence).toContain('gap between the result');
    expect(report.pattern).toContain('sense a gap');
    expect(report.uncertainty).toContain('working hypothesis');
    expect(report.focus).toContain('observable instructions');
  });

  it('does not overstate a one-off problem as a stable habit', () => {
    const report = buildDiagnosticReport({ ...base, frequency: 'once' });
    expect(report.uncertainty).toContain('one situation rather than a stable habit');
  });

  it('acknowledges when the problem is not yet specific enough', () => {
    const report = buildDiagnosticReport({ ...base, challenge: 'other', clarity: 'unsure' });
    expect(report.title).toContain('not specific enough');
    expect(report.pattern).toContain('still uncertain');
  });
});

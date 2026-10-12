export type PromptChallenge =
  | 'mismatch'
  | 'generic'
  | 'revision-loop'
  | 'unclear'
  | 'other';

export type DiagnosticAnswers = {
  challenge: PromptChallenge | '';
  clarity: 'clear' | 'partial' | 'unsure' | 'not-applicable' | '';
  frequency: 'once' | 'sometimes' | 'often' | '';
  example: string;
};

export type DiagnosticReport = {
  title: string;
  pattern: string;
  evidence: string;
  uncertainty: string;
  focus: string;
};

export const challengeOptions: { value: PromptChallenge; label: string; detail: string }[] = [
  { value: 'mismatch', label: 'The result misses what I imagined', detail: 'I can picture the outcome, but the AI takes it somewhere else.' },
  { value: 'generic', label: 'The result feels generic or incomplete', detail: 'It answers, but misses the details that would make it useful.' },
  { value: 'revision-loop', label: 'Every correction creates another problem', detail: 'I keep asking for changes and the result drifts or breaks.' },
  { value: 'unclear', label: 'I struggle to explain what I want', detail: 'I know something is off, but I cannot put it into clear instructions.' },
  { value: 'other', label: 'Something else — I am not sure yet', detail: 'I want to explore the problem before naming it.' },
];

export function followUpFor(challenge: PromptChallenge | ''): {
  prompt: string;
  options: { value: DiagnosticAnswers['clarity']; label: string; detail: string }[];
} {
  const common = {
    options: [
      { value: 'clear' as const, label: 'Yes, I can explain it', detail: 'I can point to the missing or incorrect part.' },
      { value: 'partial' as const, label: 'Partly — I can sense it', detail: 'I notice the gap, but struggle to describe it precisely.' },
      { value: 'unsure' as const, label: 'Not really', detail: 'I mostly know it is not right, not why.' },
    ],
  };
  const prompts: Record<PromptChallenge, string> = {
    mismatch: 'When the result misses your vision, how clearly can you identify what is different?',
    generic: 'Before you send the prompt, how sure are you about the context and details the AI needs?',
    'revision-loop': 'When you ask for a correction, do you know exactly what should change and what must stay the same?',
    unclear: 'Can you describe a successful result before you start prompting, even with an example or reference?',
    other: 'When something goes wrong, how clearly can you identify what is missing or not working?',
  };
  return { prompt: prompts[challenge || 'other'], options: common.options };
}

export function buildDiagnosticReport(answers: DiagnosticAnswers): DiagnosticReport {
  const challenge = answers.challenge || 'other';
  const clarity = answers.clarity || 'unsure';
  const frequency = answers.frequency || 'sometimes';
  const labels: Record<PromptChallenge, string> = {
    mismatch: 'A gap between your mental picture and your instructions',
    generic: 'Important context may be missing before the AI starts',
    'revision-loop': 'The revision process may lack a stable target',
    unclear: 'The desired outcome may not be defined clearly enough yet',
    other: 'The problem is not specific enough to name confidently yet',
  };
  const evidenceByChallenge: Record<PromptChallenge, string> = {
    mismatch: 'You described a gap between the result you imagine and the result the AI produces.',
    generic: 'You described outputs that feel generic or leave out useful details.',
    'revision-loop': 'You described corrections that lead to new problems or drift.',
    unclear: 'You described difficulty turning your expectations into clear instructions.',
    other: 'You have not identified a single recurring pattern yet.',
  };
  const clarityNote: Record<DiagnosticAnswers['clarity'], string> = {
    clear: 'You can usually point to the gap, which gives us something concrete to test.',
    partial: 'You can sense a gap, but translating that feeling into specific criteria may be the hard part.',
    unsure: 'The cause is still uncertain; the next useful step is to inspect a real example together.',
    'not-applicable': 'We have not gathered enough detail about this point yet.',
    '': 'We have not gathered enough detail about this point yet.',
  };
  const frequencyNote: Record<DiagnosticAnswers['frequency'], string> = {
    once: 'So far, this may be tied to one situation rather than a stable habit.',
    sometimes: 'This happens intermittently, so task type or context may affect the result.',
    often: 'Because this happens often, a repeatable part of your prompting process may be involved.',
    '': 'We still need to learn how often this happens.',
  };
  const focusByChallenge: Record<PromptChallenge, string> = {
    mismatch: 'Compare your intended result with one actual result, then turn the differences into observable instructions.',
    generic: 'Check whether the prompt gives enough context, audience, and success criteria before adding more wording.',
    'revision-loop': 'Define what to change and what to preserve before the next revision.',
    unclear: 'Describe what a successful result would let you do, then use an example or reference to make it concrete.',
    other: 'Start with one recent example and separate what happened from what you expected.',
  };
  return {
    title: labels[challenge],
    pattern: clarityNote[clarity],
    evidence: evidenceByChallenge[challenge],
    uncertainty: `${frequencyNote[frequency]} This is a working hypothesis based on your answers, not a fixed label or a final verdict.`,
    focus: focusByChallenge[challenge],
  };
}

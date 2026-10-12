export type OutputStyle = 'clear' | 'warm' | 'bold' | 'playful';
export type PromptDetails = {
  goal: string;
  context: string;
  audience: string;
  format: string;
  constraints: string;
  voice: OutputStyle;
};

export type PromptCheck = {
  label: string;
  present: boolean;
  tip: string;
};

const voiceGuide: Record<OutputStyle, string> = {
  clear: 'Use plain, direct language. Keep the tone thoughtful and easy to follow.',
  warm: 'Use a warm, human tone. Sound supportive without becoming overly familiar.',
  bold: 'Use confident, decisive language. Keep claims grounded and specific.',
  playful: 'Use a light, lively tone. Keep the ideas useful and the humor gentle.',
};

export function reviewPrompt(prompt: string): PromptCheck[] {
  const text = prompt.trim();
  return [
    { label: 'Clear goal', present: text.length >= 18 && /\b(write|create|explain|summari[sz]e|plan|compare|draft|help|make|analy[sz]e|teach|generate|design|review|translate|brainstorm|solve)\b/i.test(text), tip: 'Start with an action and say what you want the model to make or do.' },
    { label: 'Useful context', present: text.length >= 90 || /\b(for|because|context|background|about|working with|I am|we are)\b/i.test(text), tip: 'Add the background the model would need if it knew nothing about your situation.' },
    { label: 'Audience or point of view', present: /\b(for|audience|reader|customer|beginner|expert|team|student|client|as a|from the perspective)\b/i.test(text), tip: 'Name who this is for or what role the model should take.' },
    { label: 'Shape of the answer', present: /\b(list|table|bullet|paragraph|email|outline|steps|format|JSON|script|checklist|one-page|one page)\b/i.test(text), tip: 'Specify the format, length, or structure that would make the answer useful.' },
    { label: 'Boundaries', present: /\b(don.t|do not|avoid|under|at most|no more than|must|include|exclude|limit|within)\b/i.test(text), tip: 'Set a boundary: what to include, avoid, or keep within a limit.' },
  ];
}

export function buildPrompt(details: PromptDetails): string {
  const sections = [
    `## Goal\n${details.goal.trim() || '[State the specific task and desired result]'}`,
    details.context.trim() && `## Context\n${details.context.trim()}`,
    details.audience.trim() && `## Audience or perspective\n${details.audience.trim()}`,
    `## Direction\n${voiceGuide[details.voice]}`,
    details.constraints.trim() && `## Boundaries\n${details.constraints.trim()}`,
    `## Output\n${details.format.trim() || '[Describe the format, length, and structure you want]'}`,
    'If something important is unclear, ask up to two focused questions before answering. Do not invent facts or requirements that I have not provided.',
  ].filter(Boolean);
  return sections.join('\n\n');
}

export function getPromptScore(prompt: string): number {
  const checks = reviewPrompt(prompt);
  return Math.round((checks.filter(check => check.present).length / checks.length) * 100);
}

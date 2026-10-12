export type ProblemKind = 'decision' | 'overwhelm' | 'people' | 'stuck';
export type ClarityInput = { problem: string; kind: ProblemKind; impact: string; control: string };
export type Guidance = { frame: string; experiment: string; firstStep: string; avoid: string };

const guidance: Record<ProblemKind, Omit<Guidance, 'frame'>> = {
  decision: { experiment: 'Set a decision date and compare only the two most viable options against what matters most.', firstStep: 'Write down the one criterion that would make this decision feel right six months from now.', avoid: 'Waiting for perfect certainty. Look for enough evidence to choose, not proof that risk is gone.' },
  overwhelm: { experiment: 'Reduce the active list to one must-do, one could-do, and everything that can wait.', firstStep: 'Choose one task that takes less than 15 minutes and define what “done” looks like.', avoid: 'Treating every open loop as equally urgent. Triage before you push harder.' },
  people: { experiment: 'Have one specific, low-stakes conversation focused on observable behavior and a clear request.', firstStep: 'Draft one sentence that names what happened and one sentence that says what you need next.', avoid: 'Guessing at motives. Start with what you saw, then ask how the other person sees it.' },
  stuck: { experiment: 'Run a small reversible test that gives you new information within the next week.', firstStep: 'Name the smallest action that could prove or disprove your current assumption.', avoid: 'Solving the whole future at once. A useful experiment beats another round of rumination.' },
};

export function createGuidance(input: ClarityInput): Guidance {
  const detail = input.problem.trim();
  const frames: Record<ProblemKind, string> = {
    decision: `This is a choice between paths, not a test of whether you can predict the future${detail ? `: “${detail}”` : ''}.`,
    overwhelm: `This looks like a capacity and sequencing problem${detail ? ` around “${detail}”` : ''}, not a personal failure.`,
    people: `There is a relationship or expectation to clarify${detail ? ` in “${detail}”` : ''}; focus on the part you can communicate.`,
    stuck: `You need better information before a big commitment${detail ? ` on “${detail}”` : ''}; make the next move a test.`,
  };
  const next = guidance[input.kind];
  const controlNote = input.control === 'little' ? ' Keep the experiment within your control and make the ask or boundary explicit.' : '';
  return { frame: frames[input.kind], experiment: next.experiment + controlNote, firstStep: next.firstStep, avoid: next.avoid };
}

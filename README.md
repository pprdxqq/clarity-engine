# Clarity Engine

Clarity Engine is a guided, rule-based workshop for learning to communicate more clearly with AI. The default practice flow starts with diagnosis before it offers a solution: users identify a recurring difficulty, answer adaptive follow-up questions, review a transparent working hypothesis, and confirm or correct it before entering the prompt workshop.

## The workflow

1. **Diagnose** — choose the difficulty that best matches your experience.
2. **Investigate** — answer a follow-up tailored to that difficulty, then describe how often it happens and optionally add a real example.
3. **Review** — see what the answers suggest, what remains uncertain, and one useful next step.
4. **Confirm** — agree with or revisit the hypothesis; the tool does not force a label on the user.
5. **Work on the problem** — review a prompt, add missing details, and build a clearer instruction using a transparent checklist.

The diagnosis is a rule-based working hypothesis, not a psychological assessment or a final verdict. The workshop runs in the browser and does not send prompts to an AI service or save them to a server.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

## Build and checks

```sh
npm run build
npm test
```

## GitHub Pages

The `Deploy to GitHub Pages` workflow builds and publishes the Vite app on pushes to `main`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Vite base path is set for `https://pprdxqq.github.io/clarity-engine/`, and the build includes a 404 fallback so direct links to each page continue to work.

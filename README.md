# Clarity Engine

Clarity Engine helps people write better prompts and understand why they work. Learn the Clarity Loop, study examples, and use the prompt workshop to review a rough ask and build a clearer version from your own details.

The workshop runs locally in the browser with a transparent rule-based checklist and builder. It does not send prompts to an AI service or save them to a server.

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

The `Deploy to GitHub Pages` workflow builds and publishes the Vite app on pushes to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Vite base path is set for `https://pprdxqq.github.io/clarity-engine/`, and the build includes a 404 fallback so direct links to each page continue to work.

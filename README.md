# Clarity Engine

A guided, rule-based problem-solving experience. It helps you name the problem, understand its impact, identify the kind of knot you are facing, and leave with a small next step you can actually try.

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

The interface is built with React, TypeScript, Vite, and GSAP ScrollTrigger. Its guidance engine runs locally in the browser; it does not send your answers to a server. Motion follows scroll position on desktop and simplifies for touch and reduced-motion preferences.

## GitHub Pages

The `Deploy to GitHub Pages` workflow builds the Vite app and publishes its `dist` output whenever `main` changes. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Vite base path is set for `https://pprdxqq.github.io/clarity-engine/`.

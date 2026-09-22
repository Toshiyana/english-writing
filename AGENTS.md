# Repository guidance

## Project

- This is a single-page IELTS Writing practice app built with Next.js App Router, React, TypeScript, Tailwind CSS, and Zod.
- The app is client-only: writing attempts are stored in browser `localStorage`; there is no backend or authentication.
- Preserve both Task 1 and Task 2 flows, including prompt selection, timers, pause/resume, submission, word counts, and history.

## Toolchain and commands

- Use Node.js 24 from `.node-version` and pnpm 11.19.0 from `package.json`.
- Use pnpm only; do not create npm, Yarn, or Bun lockfiles.
- Install dependencies with `node .codex/setup.mjs`.
- Available checks:

  ```text
  pnpm lint
  pnpm typecheck
  pnpm build
  ```

- There is no automated test script. Do not run `pnpm test` or claim tests passed unless one is added.

## Repository conventions

- `app/page.tsx` owns the main view and attempt state; shared UI belongs in `components/`.
- Keep prompts in `data/`, shared domain types and schemas in `lib/types.ts`, and persistence logic in `lib/storage.ts`.
- Validate persisted data with the existing Zod schemas and handle malformed or older data defensively.
- Access `window`, `crypto`, and `localStorage` only from client-safe code.
- Do not edit or commit generated output (`.next/`, `next-env.d.ts`, `*.tsbuildinfo`) or `.pnpm-store/`.

## Completion

- Before completing a code change, run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- For user-visible changes, exercise the affected Task 1 or Task 2 flow with `pnpm dev`.
- If a required check cannot run, state which check was skipped and why.

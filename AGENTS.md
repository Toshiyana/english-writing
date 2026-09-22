# Repository guidance

## Project overview

- This repository contains a single-page IELTS Writing practice application.
- It uses Next.js App Router, React, TypeScript, Tailwind CSS, and Zod.
- The application is currently client-only. Writing attempts are stored in browser `localStorage`; there is no backend or authentication layer.
- Preserve both Task 1 and Task 2 flows, including prompt selection, timers, pause/resume, submission, word counts, and history.

## Repository layout

- `app/`: Next.js entry points and global styles. `app/page.tsx` owns the main view and attempt state.
- `components/`: UI views and shared components.
- `components/ui/`: low-level reusable UI primitives.
- `data/`: static IELTS prompts and prompt metadata.
- `lib/`: shared types, Zod schemas, storage helpers, and utilities.
- `public/task1/`: Task 1 prompt visuals.
- `.codex/setup.mjs`: dependency setup for Codex-managed worktrees.
- `.github/workflows/`: CI and dependency automation.

## Toolchain and setup

- Use Node.js 20 as specified by `.node-version`.
- Use pnpm only. The repository pins pnpm 9.15.5 in `package.json`.
- Do not use npm, Yarn, or Bun, and do not create additional lockfiles.
- Install dependencies with:

  ```text
  node .codex/setup.mjs
  ```

- If the active Node or pnpm version differs from the pinned version, report the mismatch rather than silently regenerating `node_modules` or `pnpm-lock.yaml` with another package-manager version.

## Common commands

```text
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

- There is currently no automated test script. Do not claim tests passed or run `pnpm test` unless a test script has been added.
- Use `pnpm dev` for browser verification and `pnpm build` for production validation.

## Implementation conventions

- Keep TypeScript strict and avoid `any` unless the boundary genuinely cannot be typed.
- Prefer the `@/` import alias for repository-local modules.
- Reuse existing components and utilities before adding new abstractions or dependencies.
- Keep prompt content in `data/`, shared domain types and schemas in `lib/types.ts`, and persistence logic in `lib/storage.ts`.
- Validate persisted data through the existing Zod schemas. Treat malformed or older `localStorage` data defensively.
- Preserve client/server boundaries. Browser APIs such as `window`, `crypto`, and `localStorage` must only be accessed from client-safe code.
- Maintain keyboard usability, visible focus states, semantic controls, and descriptive accessible labels when changing UI.
- Do not edit generated output such as `.next/`, `next-env.d.ts`, or `*.tsbuildinfo`.
- Do not add a production dependency unless it provides clear value that cannot reasonably be implemented with the existing stack.

## Verification and completion

- Run the narrowest relevant checks while iterating.
- Before declaring a code change complete, run:

  ```text
  pnpm lint
  pnpm typecheck
  pnpm build
  ```

- For user-visible changes, also exercise the affected flow in a browser. Check the relevant subset of start, typing, timer, pause/resume, submit, history, refresh persistence, and Task 1/Task 2 switching.
- Review the final diff for unrelated changes, generated files, secrets, debug output, and accidental lockfile churn.
- If a required check cannot run, state which check was skipped and why.

## Git and pull requests

- Preserve unrelated working-tree changes and keep commits focused.
- Treat detached HEAD as normal in Codex-managed worktrees. Create a `codex/<topic>` branch only when a branch is needed.
- Never force-push, rewrite shared history, merge, or delete branches unless the user explicitly requests it.
- PR descriptions should summarize the behavior change, list validation performed, and identify any remaining risks or manual checks.

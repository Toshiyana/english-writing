---
name: direct-main-push
description: Validate intended local changes, commit them without creating a feature branch, and push the resulting commit directly to origin/main. Use only when the user explicitly requests a direct main push; do not use for pull-request workflows or existing PRs.
---

# Direct Main Push

Deliver the user's intended changes to `origin/main` with a normal fast-forward push. Do not create a branch or a pull request.

## Authorization boundary

- Use this workflow only when the user explicitly asks to commit and push directly to `main`, or invokes this skill with an equivalent request. A request to prepare, inspect, or validate changes does not authorize a commit or push.
- The authorization covers only the intended files and commits for the current task. Preserve unrelated tracked and untracked changes.
- Never force-push, rewrite shared history, merge, delete refs, bypass hooks, or change branch-protection settings. Do not open or merge a pull request unless separately requested.

## Establish a safe starting state

1. Read applicable `AGENTS.md` files and repository instructions.
2. Inspect `git status --short --branch`, `git remote -v`, `git worktree list --porcelain`, the current symbolic branch, and the commits unique to `HEAD` and `origin/main`.
3. Confirm that the push remote is `origin` and that `refs/heads/main` exists there. Do not infer a differently named remote or branch.
4. Fetch `origin main` before relying on the comparison.
5. Continue only when `HEAD` is either detached or attached to `main`. If another named branch is checked out, stop rather than switching branches or pushing that branch's history to `main`.
6. Require the intended history to be based on the current `origin/main`. If `origin/main` is ahead, histories have diverged, or unexpected local commits are already ahead of it, stop and report the exact commits. Do not merge, rebase, reset, or cherry-pick as an automatic repair.

A detached HEAD is valid in a Codex-managed worktree. Keep it detached; do not create or attach a branch merely to make the commit.

## Validate the intended change

Review the complete working-tree diff and intended untracked files. Exclude unrelated files, secrets, generated artifacts, debug output, conflict markers, and formatting churn.

Use repository-defined validation commands and run only scripts that exist. For this repository, prefer the relevant subset of:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI changes, exercise the affected browser flow when browser tooling is available. Report any skipped or failing required check before pushing; do not silently waive it.

## Commit and push directly to main

When authorized and the preflight checks pass:

1. Stage only the intended paths and inspect `git diff --cached`.
2. Create one concise commit consistent with the repository's history. Do not amend an unrelated commit.
3. Fetch `origin main` again immediately before the push.
4. Verify that the refreshed `origin/main` is still an ancestor of `HEAD` and that every commit ahead of it is intended for this task.
5. Push with `git push origin HEAD:refs/heads/main`. Never add `--force`, `--force-with-lease`, or hook-bypass options.
6. Verify that the remote `main` SHA matches the pushed commit.

If the push is rejected, remote `main` moves, authentication fails, branch protection blocks the push, or validation fails, stop after reporting the evidence. Do not retry by rewriting history or weakening protections. If a detached commit remains local after a failed push, report its SHA clearly so it can be recovered.

## Final report

State the starting Git state, commit SHA and message, validation commands with outcomes, push result, verified remote `main` SHA, and any remaining uncommitted files. If no push occurred, state the precise blocker and the safest next action.

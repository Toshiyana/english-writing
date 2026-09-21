---
name: pr-create
description: Take finished local or Codex-worktree changes all the way to a newly opened pull request, including branch setup, focused validation, commit, push, and PR creation. Use when the user asks to make work PR-ready or open a new PR; do not use for review-only requests or repairing an existing PR.
---

# PR Create

Turn the intended working-tree changes into one reviewable, opened pull request without absorbing unrelated work. PR creation is the completion condition; do not stop at a local commit or pushed branch when the required access and credentials are available.

## Authorization and completion boundary

- Invoking `$pr-create` or asking to make finished changes "PR-ready" authorizes the scoped branch creation, commit, normal push, and PR creation needed to complete this workflow. Do not ask for separate confirmation for those steps.
- A request limited to reviewing, checking, or validating changes is outside this skill's mutating workflow. Perform only the requested read-only work instead of invoking this skill.
- Never force-push, rewrite shared history, merge, close a PR, or delete a branch unless explicitly requested. Stop at the relevant blocker if completion would require one of those actions.

## Establish the Git state

1. Read applicable `AGENTS.md` files and repository documentation before acting.
2. Inspect `git status --short --branch`, remotes, configured upstreams, and `git worktree list --porcelain`.
3. Determine the base branch from the user's request, repository metadata, or the remote default branch. Do not assume `main` when it cannot be established.
4. Treat detached HEAD as normal in a Codex-managed worktree. Before creating a branch, verify that the proposed name is not already checked out by another worktree.
5. Preserve all pre-existing edits. Identify which tracked and untracked files belong to this PR, and do not stage unrelated files.

If a branch is required, use the user's exact requested name. Otherwise choose a short `codex/<topic>` name derived from the change. Do not overwrite an existing branch or use `-f` to move it.

## Validate the change

Review the complete diff against the merge base, including intended untracked files. Check for accidental generated files, secrets, debug output, conflict markers, and unrelated formatting churn.

Use repository-defined commands rather than inventing replacements. For this repository, prefer the relevant subset of:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run only scripts that exist. Use `pnpm install --frozen-lockfile` only when dependencies are missing and the current permissions allow installation; do not silently change the lockfile. For UI changes, verify the affected browser flow when browser tooling is available.

Perform a focused review against the base branch before committing. Resolve consequential findings or clearly report why they remain. Mechanical lint and type failures must not be waived without telling the user.

## Commit, push, and open the PR

After validation:

1. Stage only the intended paths and inspect the staged diff.
2. Create a concise commit consistent with the repository's existing history. Do not amend an unrelated commit.
3. Confirm that an open PR does not already exist for the head branch.
4. Push with an upstream using a normal non-force push.
5. Create the PR with the established base branch. Prefer an available GitHub integration; otherwise use `gh pr create`.
6. Write a useful PR body with `Summary`, `Validation`, and `Risks / Notes`. Include screenshots or reproduction details when the change is visual or behavioral.
7. Attach the created PR to the current task when that capability is available, and return the PR URL. Do not merge the PR unless separately requested.

Do not treat a successful commit or push as completion. Stop and report instead of guessing only if the base branch is ambiguous, the branch is owned by another worktree, required validation cannot run, credentials or PR-creation tooling are unavailable, an existing PR must be repaired instead, or the remote has diverged in a way that would require history rewriting.

## Final report

State the branch, base branch, commit, commands run with outcomes, skipped checks with reasons, and PR URL or the precise blocker. Mention any remaining uncommitted files so the user is not surprised.

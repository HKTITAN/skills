# Pinwheel: rules for agents

An invented Electron notes app. This file is after a `triage`: every rule a tool could hold moved up the pyramid and was deleted here, and what is left asks for judgment.

## Rule table

Each rule, and what enforces it. A rule whose mistake can no longer happen is dropped.

| Rule | Enforced by | Since |
|---|---|---|
| Renderer code never imports main-process code | `npm run lint:deps` (`renderer-not-to-main` in `.dependency-cruiser.cjs`) | 2026-11-02 |
| No timers in product code | `npm run lint` (`no-restricted-syntax`, ratchet in `eslint-suppressions.json`) | 2026-11-05 |
| No `useEffect` outside `electron-renderer/client/hooks.ts` | `npm run lint` (`no-restricted-imports`) | 2026-11-09 |
| No comments in product code | `npm run lint` (`no-warning-comments` plus `scripts/no-comments.mjs`) | 2026-11-09 |
| A UI change carries evidence | `npm run verify:evidence` and `pinwheel-ctl` | 2026-11-12 |
| A dismissed reminder is never shown again | `npm run verify:tla` | 2026-11-14 |
| Build what was asked, finished | judgment | 2026-11-17 |
| Carry on without asking, except before anything irreversible | judgment | 2026-11-17 |

## Judgment

What no tool can decide. Keep this section short; when a line here starts being broken the same way twice, it is a candidate to move up.

- Build what was asked, finished: empty, loading and error states included. Anything extra goes in the PR description as a suggestion, not in the diff. (judgment)
- Carry on without asking for anything you can undo. Stop and ask before anything you cannot: a deploy, a migration on shared data, a force-push, a message to a person. (judgment)
- When two designs are both reasonable, build the smaller one and say what the larger one would add. (judgment)

## Where things are

- `electron-renderer/` runs in the window, `electron-main/` runs in the main process. The folder names are the boundary; the lint above holds it.
- `.claude/skills/verify-pinwheel/` launches, drives and records the app. Its feature map is `features/README.md`.

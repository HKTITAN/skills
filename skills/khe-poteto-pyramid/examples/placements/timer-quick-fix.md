# Placements: pinwheel, timers as fixes

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: a flicker patched with setTimeout(…, 0)

Correction: "don't paper over an ordering bug with a timer, fix what runs too early"
Seen:
- PR #377: `setTimeout(() => release(id), 0)` in `electron-renderer/features/list/row.tsx`, with a comment saying a real fix "would be a larger change"
- PR #401: the same pattern copied into `electron-renderer/primitives/focus.ts`
- `git grep -c "setTimeout(" electron-renderer/` counted 61 by the time it was raised as a class, most added in the five weeks after PR #377
Layer: static
Not higher:
- codebase: the cause is ordering inside the editor adapter, and there is no single API to remove: `setTimeout` is a platform global. The refactor of the adapter's release order is filed as PR #455 and lands separately; the lint stops new copies while it does.
Change: an ESLint `no-restricted-syntax` rule bans `setTimeout`, `requestAnimationFrame` and `requestIdleCallback` calls in `electron-renderer/features/` and `electron-renderer/primitives/`; the scheduler in `electron-renderer/client/schedule.ts` is the one allowed place. The rule runs as a ratchet: a change fails only when it adds a call, and the 61 existing calls are listed in `eslint-suppressions.json` to be burned down.
Enforced by: `eslint.config.js` rule `no-restricted-syntax` (selector `CallExpression[callee.name=/^(setTimeout|requestAnimationFrame|requestIdleCallback)$/]`), run by `npm run lint` in CI with the bulk suppressions file
Error: "Timers are banned in product code: a timer here hides an ordering bug. Find what releases or renders too early and fix the order. If you need to run after the next frame, use `afterPaint()` from `electron-renderer/client/schedule.ts`."
Proof: on `a41d07c` (PR #401's head) the rule failed on `electron-renderer/primitives/focus.ts:22`; with the suppressions file generated from `main`, a test branch that adds one new `setTimeout` in `row.tsx` fails and `main` itself passes
Prose: none; there was no line for it, and comments that excuse a workaround are covered by the comment ban already in the rule table

Gate: pyramid-check passed
Not verified: that `afterPaint()` is itself free of the ordering bug; the burn-down of the 61 suppressed calls has no date yet.

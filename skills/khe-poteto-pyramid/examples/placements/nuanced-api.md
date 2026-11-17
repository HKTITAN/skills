# Placements: pinwheel, effects in product code

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: useEffect used to sync state that should be derived

Correction: "this doesn't need an effect, derive it" (the most frequent review comment in the repo)
Seen:
- PR #350: `useEffect` copying `note.title` into local state in `electron-renderer/features/editor/title.tsx`; the title lagged one render behind
- PR #366: `useEffect` fetching on every keystroke in `electron-renderer/features/search/box.tsx`
- PR #388: an effect with a missing dependency that left a stale subscription open in `electron-renderer/features/sync/badge.tsx`
Layer: codebase + static
Change: product code gets no `useEffect`. The two jobs it was used for each get one supported way: `useDerived()` for values computed from props and stores, and `useSubscription()` for anything that listens, both in `electron-renderer/client/hooks.ts`, the only file allowed to call `useEffect`. The three call sites above were rewritten onto them in the same change. The mistake class is gone rather than reviewed for.
Enforced by: `eslint.config.js` rule `no-restricted-imports` (paths `react`, importNames `useEffect`, `useLayoutEffect`), off for `electron-renderer/client/hooks.ts` only, run by `npm run lint` in CI
Error: "useEffect is not used in product code. A value computed from props or a store: `useDerived()`. Listening to something: `useSubscription()`. Both live in `electron-renderer/client/hooks.ts`."
Proof: on `5b2e9d1` (PR #388's head) the rule failed on `electron-renderer/features/sync/badge.tsx:4`; on this branch `npm run lint` passes with 0 restricted imports outside `hooks.ts`
Prose: deleted `AGENTS.md` line 22, "Avoid useEffect; prefer derived state"

Gate: pyramid-check passed
Not verified: that `useSubscription()` cleans up on every unmount path; a property test for it is open as PR #461.

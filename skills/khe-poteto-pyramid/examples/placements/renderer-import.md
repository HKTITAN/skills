# Placements: pinwheel, process boundary

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: renderer code imports main-process code

Correction: "the renderer can't reach into main, go through IPC" (said in review three times in four weeks)
Seen:
- PR #412 review: `src/features/sync/status.tsx` imported `src/main/db/index.ts`; opening a note showed a 380 ms long task in the trace
- PR #439 review: `src/features/search/query.ts` imported `src/main/fs/watch.ts`
- revert `9c1e2fa` of PR #412 after the long task reached a release candidate
Layer: codebase + static
Change: split `src/` into two top-level folders named for the process they run in, `electron-renderer/` and `electron-main/`, so the path says where a file runs before anyone reads it. Main exposes the two things the renderer kept reaching for as IPC calls (`db:query`, `fs:watch`) in `electron-main/ipc/handlers.ts`, and the renderer reaches them only through `electron-renderer/client/ipc.ts`.
Enforced by: `dependency-cruiser` rule `renderer-not-to-main` in `.dependency-cruiser.cjs`, run by `npm run lint:deps` in the pre-commit hook and in CI
Error: "electron-renderer/ cannot import electron-main/. Ask main over IPC instead: `ipc.invoke('db:query', …)` from `electron-renderer/client/ipc.ts`. To add a call, add a handler in `electron-main/ipc/handlers.ts`."
Proof: on `9c1e2fa^2` (the head of PR #412) with the new rule applied, `npm run lint:deps` failed with `renderer-not-to-main` on `src/features/sync/status.tsx`; on this branch it passes with 0 violations
Prose: deleted `AGENTS.md` line 14, "Never import main-process code from the renderer"

Gate: pyramid-check passed
Not verified: that no renderer file reaches main through a dynamic `import()` with a computed path, which dependency-cruiser cannot resolve; the long task was not re-measured after the move.

<!-- teaching: no past mistake was replayed against the check; a check never seen failing proves nothing -->

# Placements: pinwheel

## Placement: renderer code imports main-process code

Correction: "the renderer can't reach into main, go through IPC"
Seen:
- PR #412 review: `src/features/sync/status.tsx` imported `src/main/db/index.ts`
- PR #439 review: `src/features/search/query.ts` imported `src/main/fs/watch.ts`
Layer: codebase + static
Change: two top-level folders, `electron-renderer/` and `electron-main/`, with IPC handlers in `electron-main/ipc/handlers.ts` for what the renderer kept reaching for.
Enforced by: `dependency-cruiser` rule `renderer-not-to-main`, run by `npm run lint:deps` in CI
Error: "electron-renderer/ cannot import electron-main/. Use `ipc.invoke('db:query', …)` from `electron-renderer/client/ipc.ts`."
Proof: the rule is configured and CI is green
Prose: deleted `AGENTS.md` line 14

Not verified: dynamic `import()` with a computed path, which dependency-cruiser cannot resolve.

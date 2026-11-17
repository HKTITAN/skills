<!-- teaching: a placement at the review layer: a person catching the same thing every time is the low-trust loop -->

# Placements: pinwheel

## Placement: renderer code imports main-process code

Correction: "the renderer can't reach into main, go through IPC"
Seen:
- PR #412 review: `src/features/sync/status.tsx` imported `src/main/db/index.ts`
- PR #439 review: `src/features/search/query.ts` imported `src/main/fs/watch.ts`
Layer: review
Not higher:
- codebase: the layout is old and moving it is a big change
- static: we have not set up dependency-cruiser
- verification: not a runtime issue
- prose: the line in AGENTS.md is already ignored
Change: reviewers watch for imports from `src/main/` in renderer files.

Not verified: dynamic `import()` with a computed path, which dependency-cruiser cannot resolve.

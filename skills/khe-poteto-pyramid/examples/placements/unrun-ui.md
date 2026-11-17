# Placements: pinwheel, UI changes nobody ran

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: a UI change called done that nobody launched

Correction: "did you actually open the app?"
Seen:
- PR #318: the new tag picker merged with a plausible diff; it never opened, because its shortcut collided with search
- PR #344: the export dialog rendered behind the window on a second monitor
- session note, 2026-10-29: an agent said "the sidebar collapse works" from reading the code
Layer: verification
Not higher:
- codebase: whether a feature works for a user is not a property of the code's shape
- static: types and lints passed on both PRs; what broke was only visible with the app running
Change: a project verification skill, `.claude/skills/verify-pinwheel/`, with Launch, Doctor, Drive, Evidence and Cleanup sections and a CLI, `pinwheel-ctl`, that launches an isolated instance with a seeded profile, drives it over the Chrome DevTools Protocol and saves screenshots and a video to `proof/`. Its feature map, `features/README.md`, has one file per feature saying what it is, how a user reaches it and what end state proves it works; the tag picker, export and sidebar entries were written first. A UI change is done when its PR carries the evidence from `pinwheel-ctl`.
Enforced by: `pinwheel-ctl drive tag-picker` and the PR check `npm run verify:evidence`, which fails a PR that touches `electron-renderer/features/` with no file in `proof/`
Proof: on `e03b6f2` (PR #318's head), `pinwheel-ctl drive tag-picker` failed at the step "picker is open" with a screenshot showing the search box instead; on this branch it passes and saves `proof/tag-picker.webm`
Prose: deleted `AGENTS.md` line 9, "Run the app and attach a screenshot before calling a UI change done"

Gate: pyramid-check passed
Not verified: the second-monitor case from PR #344 has no feature-map entry yet; `verify:evidence` checks that evidence exists, not that a person looked at it.

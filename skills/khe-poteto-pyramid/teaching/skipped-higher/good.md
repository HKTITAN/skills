# Placements: pinwheel

## Placement: three rough features shipped where one finished one was asked for

Correction: "I asked for templates, not templates, sharing and a theme editor"
Seen:
- PR #402: three features in one PR, none with an error state
- session note, 2026-11-03: asked to fix export, also restyled settings
Layer: prose
Not higher:
- codebase: each feature's code was fine; the scope was the mistake
- static: no check can tell an asked-for feature from an extra one
- verification: it proves what was built works, not what should not have been built
Change: one judgment line in `AGENTS.md`: build what was asked, finished; extras go in the PR description.
Prose: added `AGENTS.md` line 31, rule-table row marked judgment

Not verified: dynamic `import()` with a computed path, which dependency-cruiser cannot resolve.

# Placements: pinwheel, scope calls

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: three rough features shipped where one finished one was asked for

Correction: "I asked for templates. You also built sharing and a theme editor, and none of them are finished"
Seen:
- PR #402: templates, sharing and a theme editor in one PR; templates had no empty state and sharing had no error path
- session note, 2026-11-03: asked to fix the export dialog, the agent also restyled the settings page
Layer: prose
Not higher:
- codebase: the code for every feature was reasonable on its own; what went wrong was the choice of how much to build
- static: no check can tell an asked-for feature from an extra one; a diff-size limit would block legitimate large changes
- verification: verification proves what was built works; it cannot say what should not have been built
Change: one line in the judgment section of `AGENTS.md`: "Build what was asked, finished: empty, loading and error states included. Anything extra goes in the PR description as a suggestion, not in the diff." It asks for a judgment call about scope that only a reader of the request can make, and its row in the rule table says `judgment`.
Prose: added `AGENTS.md` line 31, rule-table row "scope: build what was asked, finished | judgment"

Gate: pyramid-check passed
Not verified: whether agents follow it; nothing fails when they do not, which is why it is the only line of its kind this month.

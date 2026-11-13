# Changelog

What changed in kheSkills, newest first. One entry per day that something a user can see changed: a skill added, a command renamed, a rule tightened. Fixes to wording inside a skill are in the commit history.

## 2026-11-13

### Added

- `khe-ui` has a `ui-sdk` lane for a screen built with Vercel's [UI SDK](https://ui-sdk.dev) (`@ui-sdk/*`, in beta): what the library decides and what this skill still decides, the hooks each value is written on (`data-slot`, state attributes, `data-starting-style` and `data-ending-style`, `@layer ui-sdk`), and what the optional `web.css` look leaves unfinished against this skill's numbers. It never restates the library.
- `khe-design-tokens` binds a contract to the `--ui-*` variables of UI SDK's `web.css`.
- `khe-auto` routes to Vercel's own `ui-sdk` skill for composing, building and testing UI SDK components, with its install line, two overlap rows and a step in the new-screen playbook. The skill is linked from the README under "From others" and is not copied or pinned here.
- `khe-brain-isb` 1.1.0 adds 146 session notes from ivi, the I-Venture Immersive programme at ISB (April to August 2025), in `ivi/`: one note per recording of a class, a bootcamp or a guest talk, each naming its speaker and date. Twelve `ivi-*` theme files hold 2,300 or so claim lines, each linked to its session note. A session line is reported as its speaker's and never as the school's. Classmates, their startups and anything a speaker asked to keep in the room are left out, and two bootcamps are held back for that reason. 613 pieces in all.

## 2026-11-12

### Added

- `khe-brain-yc`: answers startup questions from 88 Y Combinator pieces (14 Paul Graham essays, 28 library posts and 46 talks with a published transcript), with the person who said it named and the piece linked. 1,202 claims in twelve theme files, every one checked against the source text. A claim is never reported as what YC says, only as what a named partner said.
- `/khe-brain:yc` in the `khe-brain` plugin.
- `khe-brain-isb`: answers business questions from the public isb-skills notes, with the file named. 467 pieces, 368 claims in twelve theme files, each claim checked against its source file. It reports the notes as the notes and never as what ISB teaches, and marks a benchmark the notes give without a source.
- `/khe-brain:isb` in the `khe-brain` plugin.

### Changed

- The plugin's commands take a person's full name: `/khe-brain:emil-kowalski`, `/khe-brain:benji-taylor`, `/khe-brain:varun-mayya`. An institution takes its usual short name. The skill folders keep their names, so `npx skills add` installs are unchanged.
- `scripts/check.mjs` matches a command to its skill by the path the command reads, and fails when a brain has no command.

## 2026-11-11

### Added

- `khe-brain-varun`: answers startup, content, career and AI questions from 18 of Varun Mayya's public videos (the 15 videos of his Kata playlist and three podcasts), with the video and the minute named. 1,378 claims in twelve theme files, a core file, a glossary of 274 terms and a list of what the videos do not cover. Times are good to about two minutes; `references/sources.md` says how the lines were checked.
- The `khe-brain` plugin for Claude Code. `/plugin marketplace add HKTITAN/skills`, then `/plugin install khe-brain@kheskills`, puts every brain under one name. Each command reads its skill's folder, so there is one source for both ways of installing.
- `skills.sh.json` carries its schema link, and the Brains group names the plugin.

### Changed

- `khe-brain-varun`'s gate checks a time on every video citation and that the time matches its link, and its replies can carry up to three `Also:` lines for supporting claims.

## 2026-11-10

### Added

- The collection: `khe-auto`, `khe-ui`, `khe-design-tokens`, `khe-svg`, `khe-sticker`, `khe-diagram`, `khe-sound`, `khe-launch-film`, `khe-demo`, `khe-brain-emil`, `khe-brain-benji` and `khe-content-engine`, each with gold examples, teaching pairs and a gate, and nineteen skills by Emil Kowalski and Benji Taylor linked beside them.

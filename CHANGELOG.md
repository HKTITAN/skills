# Changelog

What changed in kheSkills, newest first. One entry per day that something a user can see changed: a skill added, a command renamed, a rule tightened. Fixes to wording inside a skill are in the commit history.

## 2026-11-12

### Added

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

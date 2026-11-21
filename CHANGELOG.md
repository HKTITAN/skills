# Changelog

What changed in kheSkills, newest first. One entry per day that something a user can see changed: a skill added, a command renamed, a rule tightened. Fixes to wording inside a skill are in the commit history.

## 2026-11-21

### Added

- `khe-decision` (in `kheskills` 1.3.0) puts one decision to a council whose seats are the installed brain skills, found by folder. Each seat answers only from its own brain, in that brain's own citation format, and is judged by that brain's own gate; a fresh chair cites only what a seat cited, after one cross-check round, and writes a recommendation labelled as the skill's own synthesis. There is no council on fewer than two relevant brains. Its gate is `decision-check.mjs`. The council idea comes from [autodecision](https://github.com/harshilmathur/autodecision) by Harshil Mathur (MIT); none of its text or code is copied.
- An `llms.txt` at the root lists every khe skill with its description and a link to its `SKILL.md`, so an agent can pick one without cloning the repo. `scripts/marketplace.mjs` writes it and `scripts/check.mjs` fails while it is out of date. The install manifests carry wider keywords too; `kheskills` and `khe-brain` serve the same files, so their versions stay.
- `khe-brain-gary`, a brain of Gary Vaynerchuk's public videos and articles: 145 long videos in four groups (his own channel, guest appearances, his podcast, more keynotes and talks; 124.2 hours, 2008 to 2026) and 584 articles from garyvaynerchuk.com (2013 to 2026), 729 pieces read in full as captions and article text on 21 November 2026; the lines cite 575 of them (144 videos and 431 articles), and the rest were read and noted but no line cites them. It answers marketing, attention, platform, content, selling, business, career and mindset questions with the piece, the minute and the year named, pressure-tests a content plan or a pitch against his stated positions, and says so when the corpus does not cover a question. 1,901 claims in sixteen theme files, a core file, a glossary of 405 terms, 28 positions that moved with the year, 12 standing tensions and 55 topics the corpus is silent on. Every platform call carries its year and the newest is given as the newest, never as his view; his companies and products are reported as his pitch, and a host's, guest's, caller's or team writer's line is never given to him. Every cited line was read against the captions or the article text at least once by a reader who did not write it, and the lines changed after the last audit round were checked by the gate and by review sampling, not read again line by line; one source carries one year in every line; `references/sources.md` says what that found and what it cannot show. Its gate also fails an article cited with a time and a video time past the video's length, flags a `Source:` link that opens away from the time cited, counts a span in single quotes as a quote (never one opened by a decade or a possessive), and its self-test fails when a word the silent list watches, or a topic it lists, appears in a cited claim. In the plugin it is `/khe-brain:gary-vaynerchuk` (`khe-brain` 1.8.0), and `khe-auto` (in `kheskills` 1.3.1) routes to it.

### Changed

- `khe-decision` (in `kheskills` 1.3.2) holds its two recorded councils to the strict gate from inside its self-test, so a brain added to the collection fails CI until those councils are convened again. Both were: `khe-brain-gary` takes a seat in the audience-or-launch council and speaks, and is left out of the command-menu council. A `Why:` clause now names the seat it is about.
- `khe-brain-varun` (in `khe-brain` 1.7.0) reads a 19th video, Why Every Great Idea Started as a Copy (20 November 2026): 83 new cited claims on starting as a copy, the 90% the same and 10% new rule, creating value against capturing it and his view of deep tech investing in India, eight glossary terms, three new disagreements and one change of mind he states himself. The corpus is now 1,461 claims from 18 hours 10 minutes of video, and its refresh date is 2026-11-20.

## 2026-11-18

### Added

- Pasquale Vitiello's [Plotter](https://github.com/pasqualevitiello/plotter) is linked in `skills/plotter` beside the other authors' skills and served as the `pasquale-vitiello` plugin. `khe-diagram` (in `kheskills` 1.2.2) hands it a picture that shows how one thing is built rather than how parts connect, and `khe-auto` routes blueprint line illustrations to it.

## 2026-11-17

### Added

- `npx skills add HKTITAN/skills` installs only the 19 khe skills again. The skills CLI 1.9 checks out git submodules on install, so it had been finding 30 of the linked authors' skills inside `skills/` and installing them as this repo's (49 in all). Every link in `.gitmodules` now carries `update = none`, git skips them, and `scripts/check.mjs` fails on a link without it.
- In Claude Code, `kheskills` (1.2.1) and `khe-brain` (1.6.1) no longer load each other's parts. Both were rooted at `./`, and Claude Code loads a root plugin's `commands/` and `agents/` whatever its entry lists (an empty list falls back to the default folder; `claude plugin details` showed it), so `kheskills` also served the seven brain commands and `khe-brain` also served the four kheAgents. Each brain's command now sits in its own folder (`skills/khe-brain-varun/commands/varun-mayya.md`) and `khe-brain` is rooted at `./skills`. The commands keep their names (`/khe-brain:varun-mayya`), and the `--sparse` list drops `commands`. `scripts/check.mjs` fails on a root `commands/` folder and on a `khe-brain` rooted anywhere else.
- The repo is an [Agent Plugins](https://agent-plugins.org) 1.0.0 plugin: `plugin.json` at the root names it `kheskills` and serves every khe skill in `skills/`, brains included. Every install command from before works unchanged.
- `scripts/marketplace.mjs` now writes every install manifest from the folders: the `kheskills` and `khe-brain` entries in the Claude Code marketplace (their skills, agents, commands and descriptions; only `version` stays hand-set), the author plugins, the root `plugin.json` and the README install block. Every marketplace entry gains a `homepage`, and the two own plugins a `repository` and `keywords`.
- `scripts/check.mjs` holds each manifest to its own spec: `skills.sh.json` to the skills.sh schema (closed fields, its length limits, the Brains group naming every `/khe-brain:` command), `plugin.json` to the Agent Plugins schema, the marketplace to Claude Code's rules (names, sources, existing paths, a semver version named on a CHANGELOG line). It fails when what `kheskills` or `khe-brain` serves changed since `main` and its version did not, since Claude Code keeps an installed copy until the version moves. It fails on a model name in the agents, commands, policy, router or top-level docs, and on an agent `model` other than `inherit`. CI fetches `main` for the version check and runs `claude plugin validate . --strict`.

- `khe-package`, Emil Kowalski's way of packaging work rewritten in this collection's format: it picks the format (an explainer page, a click-through of one live component, a hover reel, a Stageshow scene, a recording page), sends three ideas as stills before any render, renders frame by frame on a paused clock at 60 fps with the short side at 2000 px or more, draws the operating system's own cursor, and writes the post's first line for a stranger. It ships its own renderer, `render.mjs`, which seeks every CSS and WAAPI animation to Playwright's fake clock each frame, and a gate, `package-check.mjs`, over the plan and the rendered file. Four gold plans, an explainer page, a live stage and eleven teaching pairs.
- `khe-auto` places every correction made during a job with `khe-poteto-pyramid` before handing over (Non-negotiable 11 and a new step 8), so a fix outlives the chat and the next agent inherits it.
- README figures in the khe design system: the poteto pyramid with each layer's hand-offs, `khe-package`'s flow, and a map of how the skills hand off, built by `.github/showcase/figures.mjs` and checked with `khe-diagram`'s gate.
- Cheatsheets for `khe-poteto-pyramid` and `khe-package`.
- Installing from the marketplace works for everyone: the README install block (generated by `scripts/marketplace.mjs`, checked by `check.mjs`) adds it with `--sparse`, so Claude Code no longer downloads the 68 linked submodules and times out; Matt Pocock's plugin is served whole because his repo ships its own manifest (generation now checks every author repo for one); the `kheskills` plugin no longer loads the brain commands a second time.
- kheAgents: `khe-router`, `khe-executor`, `khe-reviewer` and `khe-pyramid` ship in the `kheskills` plugin (1.1.0) as `kheskills:<name>`, and `orchestration/CLAUDE.md` is the policy that uses them: route first, the top session only orchestrates, one sub-session per task, executors do the work, evidence before done, every correction placed with the pyramid.
- The marketplace serves the skills I use from other people too, one plugin per author straight from their repo: `emil-kowalski`, `benji-taylor`, `vercel`, `vercel-ui-sdk`, `pstack` (Cursor's Claude Code build) and `matt-pocock`. `scripts/marketplace.mjs` builds them from the README's links, and `scripts/check.mjs` fails when they drift.
- A `kheskills` plugin in the marketplace: every khe skill except the brains in one Claude Code install, `/plugin install kheskills --marketplace HKTITAN/skills`. `scripts/check.mjs` fails when a skill is left out of it.
- `khe-auto` has a voice: one friend's voice over every skill, warm and dry, no preamble, matched to the person's length and lowercase, emoji only after they use one. Its gate adds `stock-phrase:` for help-desk filler such as "let me know if you need anything" and "great question".
- Lauren Tan's pstack skills are linked and installed through their Claude Code build (`harness/pstack/claude-code`, called as `/pstack:<name>`) instead of the Cursor originals. `khe-auto`'s README shows how it runs and a real routed reply.
- `khe-launch-film` starts from a five-line brief and the one moment the film must show (new brief, structures, publish and sources references, after Hiten Shah's Product Launch Video Playbook of 16 November 2026); its gate adds `moment-missing:` and the candidate `no-brief:`, reviews end with a cold-viewer test, and the router's launch-film playbook opens with the brief.

- `khe-poteto-pyramid`, built on Lauren Tan's ("poteto") pyramid from her talk "All Code Is Slop" at AI Engineer Code Summit (11 November 2026), read through Miguel Alvarado's study guide on Artesano and her pstack guides. It puts each correction you give a coding agent at the highest layer that can hold it (codebase, then lints, types and CI, then verification, then prose, with review last), builds it there, proves the check fails on the past mistake, and deletes the instruction it replaces. Four jobs: `place`, `sweep`, `triage` (an AGENTS.md into checks and judgment calls) and `audit` (ten questions, and whether a loop is ready to automate). Six gold placement records and a triaged AGENTS.md for an invented app, eleven teaching pairs, and a gate, `pyramid-check.mjs`, that reads placement records and rules files.
- A new Engineering domain in `khe-auto`, with eight overlap rows.
- 21 of Lauren Tan's pstack skills are linked from `cursor/plugins` and routed (`poteto-mode`, `correct`, `create-verification-skill`, `create-formal-verification-skill`, `statechart`, `how`, `why`, `architect`, `interrogate` and others), with her plugin install line.
- 13 of Matt Pocock's skills are linked from `mattpocock/skills` and routed (`codebase-design`, `improve-codebase-architecture`, `diagnosing-bugs`, `setup-pre-commit`, `git-guardrails-claude-code` and others); his `code-review` and `tdd` are `pocock-code-review` and `pocock-tdd` here.

### Changed

- Verification and review, after Addy Osmani's "How the Claude Code team thinks about verification" (17 November 2026). `khe-poteto-pyramid` 1.1.0: a check the change can edit is no check (Hard rule 3), and a class needs a trigger readable from a diff and must survive an attempt to disprove it (placing). Its verification reference puts end-to-end runs and a project `verify` skill first and adds the four common properties and differential tests; its checks reference adds observe mode before enforce, diff-triggered reliability checklists, flaky tests (fix or delete with a reason, never retry) and pruning; its audit reviews the reviewers against reverts and clean controls.
- kheAgents (`kheskills` 1.2.0): `khe-executor` runs cheap checks first, drives the change end to end, stops after three failed rounds and stamps how it verified; `khe-reviewer` tags findings `important`, `nit` or `pre-existing`, names the commit it reviewed, builds on earlier rounds' findings and flags a change that touched its own gate; `khe-pyramid` tries to disprove a rule before building it and starts new gates in observe mode. No model is hardcoded any more: the four agents inherit the session's model (`model: inherit`), and `orchestration/CLAUDE.md` has whoever starts a step pick its tier by the task. `khe-auto` 1.1.0 and `orchestration/CLAUDE.md` carry the same rules: three rounds then the person, one tuned reviewer over several rounds, checks out of reach of the change.

## 2026-11-15

### Added

- `khe-brain-enrico`, a brain of Enrico Tartarotti's YouTube channel: all 88 long videos on his Videos tab as of 15 November 2026 (17 hours 57 minutes), read in full from captions. It answers how tech products are designed, engineered and built with the video and the minute named, pressure-tests a design or a product plan against his stated positions, and says so when the videos do not cover a question. 1,406 claims in twelve theme files, a core file, a glossary of 375 terms and frameworks, 19 disagreements, 5 changes of mind he states himself and 29 topics the videos are silent on. Every cited line was checked against the captions at its time by a reviewer who had not written it; `references/sources.md` says what that found. Sponsor reads are left out, and lines by the Figma, Notion and Lovable teams he interviews are never reported as his. In the plugin it is `/khe-brain:enrico-tartarotti` (1.6.0).

- `khe-brain-harshit`, a brain of Harshit Khemani, built from his own X and LinkedIn exports of 13 November 2026 (7,853 posts, threads and replies; 666 cited). It answers with the post named, pressure-tests a plan against his posted views, and drafts khe.money posts in his voice since mid-2025 with one `Rests on:` line per view, each cited. Ten theme files, a voice file measured on his posts, a story timeline, a glossary, his changes of mind and the topics his posts are silent on. Its gate adds draft lines: no `Rests on:`, hashtags, emoji, em dashes and sentence case. In Claude Code it is `/khe-brain:harshitkhemani`, and the `khe-brain` plugin is 1.5.0.

- The README has a section on [khe](https://github.com/HKTITAN/khe), my design system, with its brand page at [ds.khe.money](https://ds.khe.money). khe ships as a contract, `khe.DESIGN`, which `khe-design-tokens` reads like any `.design` file, so it is linked here rather than added as a skill.

## 2026-11-13

### Added

- `khe-ui` has a `ui-sdk` lane for a screen built with Vercel's [UI SDK](https://ui-sdk.dev) (`@ui-sdk/*`, in beta): what the library decides and what this skill still decides, the hooks each value is written on (`data-slot`, state attributes, `data-starting-style` and `data-ending-style`, `@layer ui-sdk`), and what the optional `web.css` look leaves unfinished against this skill's numbers. It never restates the library.
- `khe-design-tokens` binds a contract to the `--ui-*` variables of UI SDK's `web.css`.
- `khe-auto` routes to Vercel's own `ui-sdk` skill for composing, building and testing UI SDK components, with its install line, two overlap rows and a step in the new-screen playbook. The skill is linked from the README under "From others" and is not copied or pinned here.
- `khe-brain-isb` 1.1.0 adds 146 session notes from ivi, the I-Venture Immersive programme at ISB (April to August 2025), in `ivi/`: one note per recording of a class, a bootcamp or a guest talk, each naming its speaker and date. Twelve `ivi-*` theme files hold 2,300 or so claim lines, each linked to its session note. A session line is reported as its speaker's and never as the school's. Classmates, their startups and anything a speaker asked to keep in the room are left out, and two bootcamps are held back for that reason. 613 pieces in all.
- Thirteen more of Vercel's skills are linked and routed: nine from `vercel-labs/agent-skills` (React and Next.js performance, composition patterns, React Native, view transitions, deploying, the CLI with tokens, optimising a deployed project, the web design and writing guidelines) and the four contributor skills in `vercel-labs/ui`. `khe-auto` has a row for each and three new overlap rows.
- Vercel's `ui-sdk` skill is pinned in `skills/ui-sdk` like Emil's and Benji's, so it follows `vercel-labs/ui` automatically.
- `khe-brain-isb` 1.1.1 adds seven anonymised notes, titled `a bootcamp session`, for two ivi bootcamps that were held back: general teaching points only, with the speaker, the date and the speaker's own frameworks, examples and materials left out. 153 session notes and 620 pieces in all.
- The `khe-brain` plugin is 1.4.0, so an installed copy picks up the session notes on update.
- Emil Kowalski's `learn-taste` is linked in `skills/` and routed by `khe-auto`, with an overlap row against `khe-design-tokens`. It turns the design corrections made in a session into rules with their reasons.

### Changed

- The pins on Emil Kowalski's skills follow his update of 2026-11-13, which corrected API names and contradictions between skills across all nineteen.

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

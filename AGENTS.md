# Skills

This repository holds the agent skills Harshit Khemani uses, one folder per skill under `skills/`. Each folder is a whole skill: its instructions, references, scripts and licence stay together so the installed folder works on its own.

## Layout

```text
skills/khe-<name>/
  SKILL.md        what the agent reads: scope, rules, steps
  README.md       the page for people: what it does, when, a before and after
  references/     files the agent opens one at a time
  examples/       gold examples: the bar, and the place to start from
  teaching/       bad and good pairs, one fault each; the gate's tests
  scripts/        the gate, and any tool the skill ships
  LICENSE
CONTRIBUTING.md   how to write a skill, and how to tell whether something should be one
skills/<name>     no khe- prefix: someone else's skill, linked as a git submodule. Never edit it.
skills.sh.json    groups the repo page on skills.sh
.claude-plugin/   marketplace.json: the Claude Code plugins this repo offers
commands/         one file per plugin command (`commands/emil-kowalski.md` is `/khe-brain:emil-kowalski`)
scripts/check.mjs the checks CI runs
```

## Before adding a skill

Most requests for a new skill are not one. Walk this in order and stop at the first yes. [CONTRIBUTING.md](CONTRIBUTING.md) has the full guide; read it before writing any skill.

| Ask | If yes |
|---|---|
| Is it a fact about one project (a path, a command, a convention)? | That project's `AGENTS.md`. Stop. |
| Is it a set of values for one product? | A `.design` file or DESIGN.md. Stop. |
| Is it a preference or a one-time mistake inside a job a skill already does? | One line in that skill's `references/pov.md` or `references/gotchas.md`. Stop. |
| Is it a new area of an existing skill's job? | A reference file in that skill, linked from its `SKILL.md`. Stop. |
| Does someone else publish a good skill for the job? | Link it and route to it from `khe-auto`. Stop. |
| Was it needed once? | A prompt. Stop. |
| Does the job recur, does the agent get it wrong without help, and can the right process be stated with its reasons? | A new skill. |

If the answer is a new skill, build it in this order, and tell the user which row decided it:

1. Collect the raw material: the user's notes and corrections, work they admire, the faults seen so far.
2. Write the one idea and the five named failures. If they will not come, the skill is not ready: say so.
3. Make three to six gold examples, then the bad and good pairs, then the gate whose `--self-test` proves both.
4. Write `SKILL.md` last, as the table of contents over the references. Write the description after the body, when the triggers are known.
5. Decide who starts it: a skill that begins a long or surprising job gets `disable-model-invocation: true`.
6. Run it on real work beside a run without it. When a result is wrong, change the skill, never the one result.
7. Wire it in (see The router) and run the checks.

A skill built from one person's published work (a "brain" skill, `khe-brain-<name>`) cites every claim to its public source, writes every sentence fresh, keeps a list of what the person has not covered, and never uses material from behind a paywall or a login.

## The khe-brain plugin

Claude Code shows a plugin's commands as `/plugin:command`. `.claude-plugin/marketplace.json` offers one plugin, `khe-brain`, whose root is this repo, and `commands/<full-name>.md` is its `/khe-brain:<full-name>` command, named for the person or the institution in full (`varun-mayya`, never `varun`). Each command holds no knowledge of its own: it tells the agent to read its skill's `SKILL.md` (`skills/khe-brain-varun/SKILL.md`) from the plugin's folder and work as that skill, so the skill folder stays the one source.

- The skill folder keeps its own name (`khe-brain-varun`) for `npx skills add`, so installs and links do not break. The command carries the full name.
- The plugin's `skills` entry points at `commands/`, which holds no `SKILL.md`. That is on purpose: without it Claude Code would load every skill in `skills/` under the `khe-brain:` name, and with the brain folders listed each brain would show twice.
- A new brain adds `commands/<full-name>.md`, its path in the plugin's `commands` list, and its name in the plugin's description. `scripts/check.mjs` fails when a `khe-brain-*` skill has no command or a command has no skill.
- Check a change with `claude plugin validate .`.

## Rules for every skill

- **The name starts with `khe-`**, is lowercase letters, digits and single hyphens, and matches its folder. This is the Agent Skills spec; `npx skills add` depends on it.
- **A skill here is original.** If someone else already publishes a good skill for the job, it does not get a `khe-` copy. It gets a row under "From others" in the README, a row in `khe-auto`, and nothing else.
- **One skill, one domain job.** The scope line says what the skill does and which skill owns each neighbouring job.
- **The description carries the triggers.** What the skill does, then `Use when` with the words a person would type, then which skill to use instead. 1,024 characters at most.
- **Encode process, not output.** A decision procedure the agent walks the same way every run, with numbers and "always" or "never". No "reasonably", "tasteful" or "where appropriate".
- **Every rule carries its reason.** A bare rule is applied blindly; a rule with its why generalizes.
- **Every line earns its place.** If the agent would do the same without the line, delete it.
- **References stay local.** A skill links only files inside its own folder. To point at another skill, name it; never link into its folder.
- **`references/gotchas.md` and `references/pov.md` belong to the person who installs the skill.** Append to gotchas; never rewrite it.

## Voice

A skill here owns a job from the first line to a finished result, and says so in its opening sentence ("You own the film from the brief to a reviewed render"). It gives numbers instead of adjectives, makes the call instead of listing options, and ends by saying what it could not verify. If a skill reads like a list of things it knows, rewrite it as the job it finishes.

## The shape of a SKILL.md

Sections, in this order. Leave one out only when the skill has nothing to put in it.

1. The scope paragraph: "A review skill. It does ONE thing: … It does not … (that's `khe-x`)."
2. `## Initial response`: the one line the skill replies with when invoked with no request.
3. `## Operating posture`: the role, then two failure modes, the worse one first.
4. `## Hard rules`: four to seven, numbered, each a bold imperative with its reason.
5. `## Steps`: a decision procedure that ends in a stop condition.
6. `## Find the reference`: a table from the job or symptom, in the user's words, to the file.
7. `## Never ship`: a `Never | Instead` table of concrete values. The self-check before finishing.
8. `## Output` and `## Tone`.
9. `## Yours to edit` and `## Pairs with`, each pairing with the reason for the hand-off.

## Other people's skills

Skills by Emil Kowalski and Benji Taylor are used next to these and are never copied in.

- Each of their skills has its own entry in `skills/` (`skills/animate`, `skills/stageshow`), a git submodule of the author's repo, so GitHub shows it beside the khe skills and links it to the original at a pinned commit. A submodule can only point at a whole repo, so the link opens the repo, not the skill's subfolder; the README links the exact file.
- The pins sync themselves. GitHub sends this repo no event when someone else's repo changes, so `.github/workflows/sync-linked-skills.yml` asks every 15 minutes and does nothing unless a pin has moved. When one has, it runs `scripts/check.mjs` and commits the new pins to `main`. For that push to work, `main` has no required status check; force-pushes and deletion stay blocked. A new skill in their repo is not picked up by the sync: it needs its own entry, added by hand.
- To add one: add its block to `.gitmodules`, then `git update-index --add --cacheinfo 160000,<commit>,skills/<name>`. To move the pin, run the same command with the new commit. The folders stay empty locally on purpose.
- The README links each of their skills to its original `SKILL.md`.
- `khe-auto` covers every skill in `skills/`, linked ones included, and says whose each one is. A name without `khe-` in any skill here is someone else's skill.
- The skills CLI does not fetch submodules, so `npx skills add HKTITAN/skills` installs only the `khe-` skills.

## The router

`khe-auto` is the entry point. It finds the domain, then the one or two skills that own a request, and runs them in order. It must name every skill in this repo, so when a skill is added, renamed or removed:

1. Update `skills/khe-auto/SKILL.md`: the skill's row in its domain table, any pair in Overlaps it can be confused with, any chain in Stacking it belongs to.
2. Update `skills.sh.json` and the table in `README.md`.
3. Run `node scripts/check.mjs`. It fails when the three disagree.

## Playbooks

`skills/khe-auto/playbooks/` holds one file per whole job (a launch film, a new screen, launch week). Each opens with what the agent owns, lists the steps with the skill and the exit check for each, and ends with the required reply. Add a playbook when the same three skills keep running in the same order.

`khe-ui` keeps its knowledge in lane files under `references/`, one per area. Its `SKILL.md` is the table of contents; a lane is loaded only when the job needs it.

## Adding a domain

The skills are not limited to design. A new domain is: its skills under `skills/`, one row in the Domains table of `khe-auto`, one table there listing its skills, and one group in `skills.sh.json`.

## Cheatsheets

`cheatsheets/<name>.md` is one `Problem | Solution` table per skill: the problem in the words a person would say, the fix as one value in backticks. Every value must appear in that skill's references. When a skill's value changes, change its sheet in the same commit. A row whose value the skill has not settled is left out.

## The README showcase

`.github/assets/kheskills.gif` and `kheskills-dark.gif` are one loop built with Benji Taylor's Stageshow, on a light and a dark ground; the README picks by colour scheme. `kheskills.png` is the resting frame. The source is in `.github/showcase/`.

To rebuild: copy `index.tsx` and `readme.css` into `examples/khe-readme/` of an installed Stageshow and run its preview. Record with `node capture-loop.mjs "<preview>/?capture=khe-readme&record=1" frames` (add `&ground=dark` for the dark one). `?record` installs Stageshow's virtual clock, so every frame is one exact step and nothing drops. Encode with ffmpeg at 20 fps.

The scene rests in its finished state. Its first beat presses Review, which clears every tile; the rest of the script puts it all back. So the first frame, the last frame and the still are the same picture, and the reset has a visible cause.

## Checks

```bash
node scripts/check.mjs
npx -y markdownlint-cli@0.41.0 '**/*.md' --config .github/markdownlint.jsonc
npx -y skills add ./ --list
```

Run all three before a commit. Use a branch for changes; keep unrelated skills in separate commits. Never commit credentials, generated recordings or machine-specific paths.

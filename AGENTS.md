# Skills

This repository holds the agent skills Harshit Khemani uses, one folder per skill under `skills/`. Each folder is a whole skill: its instructions, references, scripts and licence stay together so the installed folder works on its own.

## Layout

```text
skills/khe-<name>/
  SKILL.md        what the agent reads: scope, rules, steps
  README.md       the page for people: what it does, when, a before and after
  references/     files the agent opens one at a time
  scripts/        only where the skill ships a tool
  LICENSE
external/         other people's skill repos, as git submodules. Never edit them.
skills.sh.json    groups the repo page on skills.sh
scripts/check.mjs the checks CI runs
```

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

- `external/emilkowalski-skills` and `external/benjitaylor-skills` are git submodules, so GitHub links each folder to the original repo at a pinned commit. Update the pin with `git submodule update --remote external/<name>`, then commit.
- The README links each of their skills to its original `SKILL.md`.
- `khe-auto` routes to them by name and says whose each one is. A name without `khe-` in any skill here is someone else's skill.
- The skills CLI does not fetch submodules, so `npx skills add HKTITAN/skills` installs only the `khe-` skills.

## The router

`khe-auto` is the entry point. It finds the domain, then the one or two skills that own a request, and runs them in order. It must name every skill in this repo, so when a skill is added, renamed or removed:

1. Update `skills/khe-auto/SKILL.md`: the skill's row in its domain table, any pair in Overlaps it can be confused with, any chain in Stacking it belongs to.
2. Update `skills.sh.json` and the table in `README.md`.
3. Run `node scripts/check.mjs`. It fails when the three disagree.

## Adding a domain

The skills are not limited to design. A new domain is: its skills under `skills/`, one row in the Domains table of `khe-auto`, one table there listing its skills, and one group in `skills.sh.json`.

## Checks

```bash
node scripts/check.mjs
npx -y markdownlint-cli@0.41.0 '**/*.md' --ignore external --config .github/markdownlint.jsonc
npx -y skills add ./ --list
```

Run all three before a commit. Use a branch for changes; keep unrelated skills in separate commits. Never commit credentials, generated recordings or machine-specific paths.

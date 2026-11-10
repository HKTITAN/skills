# Writing a skill

How the skills in this repo are written, and how to decide whether something should be a skill at all. It is for people adding a skill here and for anyone writing their own.

## What a skill is

A skill is a folder with a `SKILL.md` in it. It is documentation for an agent: before the agent does a kind of work, it reads the skill and follows it.

An agent sees only the `name` and `description` in the frontmatter until it decides to load the skill. Everything below the frontmatter loads when the skill is used, and every other file in the folder loads only when `SKILL.md` sends the agent to it. That layering is the point:

| Layer | Loaded | Holds |
|---|---|---|
| `name` and `description` | Always, for every installed skill | What it does and the words that should trigger it |
| `SKILL.md` body | When the skill is used | The one idea, the rules, the workflow, a table of where the detail lives |
| `references/`, `examples/`, `scripts/` | Only when a step points at one | The numbers, the gold examples, the tools |

Depth costs nothing until it is used, so a skill can be as detailed as the job needs as long as the detail sits in the third layer.

## Should this be a skill?

Most things should not be. Walk this in order and stop at the first yes.

| Ask | If yes |
|---|---|
| Is it a fact about one project (a path, a command, a convention)? | Put it in that project's `AGENTS.md`. Not a skill. |
| Is it a set of values (colors, sizes, curves) for one product? | Put it in a `.design` file or a DESIGN.md. `khe-design-tokens` reads it. |
| Is it your preference inside a job a skill already does? | Add a line to that skill's `references/pov.md`. |
| Is it a mistake the agent made once inside a job a skill already does? | Add one line to that skill's `references/gotchas.md`. |
| Does someone else already publish a good skill for the job? | Link it and route to it from `khe-auto`. Never copy it under a new name. |
| Did you only need it once? | Write a prompt. A skill for a one-off is dead weight in every later session. |
| Have you corrected the agent on the same thing twice, in a way that needs judgment you can write down? | This is a skill. |
| Is it a new area of an existing skill's job? | Add a reference file to that skill, not a new skill. |

A skill earns its place when three things are true: the job recurs, the agent gets it wrong without help, and you can state the right process. If you cannot yet say why your version is better, you are not ready to write it down. Build the thing a few more times first.

## Six rules

**1. Encode process, not output.** An agent gives a different answer each time. A skill cannot fix the answer, but it can fix the route: a decision procedure the agent walks the same way on every run. Write the order of the decisions and where each one stops.

```text
Is it triggered from the keyboard, or met a hundred times a day?
  yes -> no animation. Stop.
  no  -> name one purpose, or stop.
```

**2. Write the why.** A rule covers the case you thought of. Its reason covers the cases you did not. "Start an entrance at `scale(0.95)`, never `scale(0)`, because nothing real appears from nothing" lets the agent handle a shape you never listed. A bare rule gets applied blindly, including where it does not belong.

**3. Be strict.** "Reasonably", "tasteful", "where appropriate" and "try to" give the agent nothing to act on, so it falls back to its defaults. Use numbers and "always" or "never". Strictness does not remove the creative work; it removes the guessing on the parts you have already settled.

**4. Every line earns its place.** Read the skill one sentence at a time and ask whether the agent would do anything differently without it. It already knows what a modal is and how to write CSS. Explaining that dilutes the lines that carry your expertise. Keep what a capable engineer would not know: the duration that grows with the size of the object, the press that scales down a little.

**5. One skill, one job.** A skill that does everything has a description nobody can write and triggers nobody can predict. Split by job, and say in the first paragraph what the skill does not do and which skill does.

**6. Decide who starts it.** A skill that carries taste should load on its own whenever the work calls for it. A skill that starts a long or surprising job should only run when typed: add `disable-model-invocation: true` to its frontmatter. Nobody wants five prototypes or a whole-app sweep they did not ask for.

## The description

It is the only part the agent reads when choosing a skill, so the triggers go here and nowhere else. One line, 1,024 characters at most:

1. What the skill does, in one clause.
2. `Use when`, with the situations and the words a person would actually type ("feels janky", "is this accessible").
3. Which skill to use instead for the neighbouring jobs.

## What every skill here ships

The method comes from the strongest public skills, Benji Taylor's Stageshow most of all: state one idea, name the ways the work fails, set the bar with real examples, and never call work done from memory.

| Part | What it is for |
|---|---|
| **The one idea** | One bold sentence the whole skill hangs from, then five named ways the work fails. A name someone can say ("Boxed", "Off-frame") gets used; a paragraph does not. |
| **How hard to press** | The bar. The gold examples are the bar, not a reference: if yours is the weaker one beside the closest gold, that is the first fix. |
| **Workflow** | Numbered steps, plan first. Every step ends in an exit you can check. Most of the quality is decided before anything is built. |
| **`examples/`** | Three to six small, complete, correct pieces of work to start from. Examples change what an agent does more than rules do. |
| **`teaching/`** | Bad and good pairs: the same thing twice with one fault. For diagnosing a problem, never as a starting point. |
| **`scripts/<name>-check.mjs`** | The gate. It names every fault it can prove as a line and ends `passed` only when the lines that are never intentional are at zero. It says `inconclusive` when it could not look. |
| **`references/verify.md`** | The last pass: yes or no questions answered from what you looked at, never from the code or from memory, and a "what you see, what you do" table. |
| **`references/review.md`** | The brief for a second reviewer who gets the evidence and the gold examples and never the builder's reasons. |
| **A handover file** | What was checked, the gate's last line pasted, what was assumed, what was not checked. |

The teaching pairs are the gate's tests. `--self-test` must show every gold example passing and every `bad` file raising the line its folder is named for. A gate that has never failed on purpose has not been tested.

Passing the gate is necessary, never sufficient. A script cannot judge feel. Each `verify.md` lists what its gate does not check.

## How to build one

1. **Dump what you know.** Notes, corrections you keep making, examples you admire, the mistake you saw last week. Unordered is fine.
2. **Let an agent write it.** Agents are the readers, and a skill written by an agent for agents usually lands better than one written by hand. Give it your notes and this file.
3. **Make the gold examples first.** If you cannot produce three correct examples, the skill is not ready.
4. **Write the pairs, then the gate.** Each fault you keep seeing becomes a pair and a line.
5. **Run it.** Use the skill on real work. Compare with a run that does not have the skill.
6. **Fix the skill, not the output.** When a result is wrong, find the missing rule or the weak example, change the skill, and run again from a clean start. Patching the one result teaches nothing.

## A skill from someone else's work

Turning a person's or a company's published thinking into a skill is worth doing: it lets you ask for an answer from a known source instead of an average of everything.

- Collect the whole body of public work first and keep the raw copy outside the skill folder.
- Pull out claims one piece at a time, each with where it came from. Group them by theme. Write the skill last.
- Write every sentence yourself. Name the source in the reference that draws on it.
- Use only what is published openly. Never material from behind a paywall or a login.
- If they already publish their own skill for the job, link it. That is their skill, and it will be kept up to date.

## Three habits behind all of this

**Keep friction where judgment matters.** An agent will happily make every decision for you. Decide the idea, the bar and the verdict yourself, and let the agent do the parts with a known right answer. Work nobody wrestled with reads that way.

**Ignore the noise about tools.** Which harness or model you use changes results far less than what you ask for and what you accept. Spend the attention on the output.

**Be selective about sources.** Anyone can sound expert now. A skill is only as good as what went into it, so take from people whose work you have looked at closely and can point to.

## Checklist

- [ ] It passed "Should this be a skill?"
- [ ] The name starts with `khe-`, is lowercase with single hyphens, and matches the folder
- [ ] The description says what it does, then `Use when`, then which skill to use instead
- [ ] The first paragraph says what the skill owns and what it does not
- [ ] One idea, five named failures, a bar
- [ ] Every rule that is not obvious carries its reason
- [ ] No hedge words; constraints are numbers or absolutes
- [ ] Every line changes what the agent does
- [ ] Gold examples, teaching pairs, a gate, `verify.md`, `review.md`
- [ ] The gate's `--self-test` passes and its gold examples pass `--gate`
- [ ] `khe-auto`, the README table and `skills.sh.json` all list it

```bash
node skills/khe-<name>/scripts/<name>-check.mjs --self-test
node skills/khe-auto/scripts/gate-all.mjs
node scripts/check.mjs
npx -y markdownlint-cli@0.41.0 '**/*.md' --config .github/markdownlint.jsonc
```

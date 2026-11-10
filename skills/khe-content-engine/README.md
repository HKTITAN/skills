# khe-content-engine

Builds a content engine in your project and turns one idea into a different draft for each platform. It drafts; you post.

```bash
npx skills add HKTITAN/skills --skill khe-content-engine
```

## What it does

- `setup`: builds the engine for one person or brand as a folder of small linked markdown nodes in their own project: an index, a voice node made of quoted samples of what they wrote and a list of what they never say, audience segments, one node per platform they use, hooks, repurposing rules, content types and cadence. It reads the posts and pages they hand over and interviews for what it cannot see, instead of inventing a voice.
- `run`: takes one idea and writes one draft per platform, each a different treatment of the idea, with the node behind every choice named on the draft.
- `review`: judges existing drafts against the engine and names the node to change for each fault.
- `tune`: when a draft is wrong, changes the node that caused it, dates the change and runs again.
- Marks any number or quotation the brief lacks as `[confirm]` instead of making one up.
- Checks every draft for the phrases and patterns that read as generated.
- Never publishes or schedules anything. A person reads, approves and posts.
- Ends every reply with what it could not verify.

## When to use it

Use it when one person's ideas need to reach several platforms without becoming the same post several times, or when drafts written for someone keep failing to sound like them. It writes text only. For a launch film use `khe-launch-film`, for a product demo `khe-demo`, for stickers `khe-sticker`, and for faux product UI `stageshow` (Benji Taylor).

## Invoke with

`/khe-content-engine [setup | run <idea> for <platforms> | review <drafts> | tune <fault>]`

Or ask in your own words: "build me a content engine", "turn this into posts for X and LinkedIn", "repurpose this", "write in my voice".

## Before and after

Before: "turn this into posts for X and LinkedIn" returns one post and a longer copy of it, both opening the same way, with a percentage nobody measured, a client quotation nobody said and "let's dive in".

After: a run file with the brief, an X draft that states the single claim with its one figure, a LinkedIn draft that tells how it was found out and what it does not prove, each naming its treatment, hook type and nodes, then `Gate: content-check passed`, `Posted: nothing. A person posts.` and `Not verified:` the figures as the owner gave them.

## Example prompts

- Build me a content engine. Here are twelve of my LinkedIn posts and my newsletter archive.
- Turn this into posts for X and LinkedIn: we moved the due date to the top of our invoices and got paid two weeks sooner.
- Repurpose last week's newsletter issue for X. Write in my voice.
- These drafts don't sound like me. Find out why and fix the engine, not the drafts.

## Verify

```bash
node scripts/content-check.mjs content-engine --gate               # an engine folder
node scripts/content-check.mjs content-engine/runs/idea.md --gate  # a run
node scripts/content-check.mjs examples --gate                     # the gold engine and runs
node scripts/content-check.mjs --self-test                         # the gate against its own fixtures
```

`content-check.mjs` names every fault as a line. `--gate` ends `content-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves, for an engine: every required node exists, every link between nodes resolves, no node is orphaned, the voice node has at least three sourced samples and a never-say list, every platform node has a length limit and a dated-facts line, and no template blank is left. For a run: one draft per platform asked for, each inside its platform node's limit, no two drafts with the same first line, the same treatment or more than 20% of their sentences in common, every draft names its nodes, no banned phrase or pattern, no number or quotation that is absent from the brief and unmarked, and a `Not verified:` last line.

What it does not prove: that a draft sounds like the person, that the hook is paid off, that two drafts differ in angle, that a figure in the brief is true, that a platform fact is still current, or that anyone agreed to be quoted. It reads text and never hears a voice. Passing is necessary, not sufficient.

`--self-test` also proves the lines that have no teaching pair, on broken copies of the gold engine, and checks that every claim line in `references/x-algorithm.md` carries a file path.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the four jobs with their steps, the hard rules, the reference table and the output format.
- `references/`: `nodes.md` (the folder, each node's template, the brief, the run file), `voice-sampling.md`, `platforms.md` (one section per platform, facts dated and graded), `x-algorithm.md` (what the published X ranking code states, by file), `hooks.md`, `repurposing.md`, `tells.md` (the banned list the gate reads), `verify.md`, `review.md`, `teaching.md`, `sources.md`, and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: one gold engine of ten nodes for an invented bookkeeper, and four gold runs: three platforms, a thread, a client quotation with an open mark, and a skipped platform.
- `teaching/`: fifteen bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `content-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT. It covers this skill's own text and code.

Sources: method adapted from Ronin's public X article on building a content engine (the saved copy carried no link to the post); the X ranking reference is a reading of [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm), Apache License 2.0, at commit `660cd74`; platform limits from the pages listed in `references/sources.md`, checked 2026-11-10. Not written or endorsed by any of them.

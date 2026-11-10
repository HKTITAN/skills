# khe-launch-film

Plan, cut, score and review a launch video against 47 measured films.

```bash
npx skills add HKTITAN/skills --skill khe-launch-film
```

## What it does

- Names the film's register first and takes every pacing number from that row of 47 measured films.
- Times the beats: first word, first seam, when the name lands, the payoff and the endcard.
- Sets the on-screen type, the UI demo, shot motion, seams and cuts with measured values.
- Reviews a render at native fps against its own register and reports each miss with its frame.

## When to use it

Reach for it when you are planning a launch film, sizzle, sting, loop or vertical cut and want the pacing decided by measurements, or when a render feels off and you cannot say why. It tells you what kind of film you are making, when the name should land, how fast words and prompts should arrive, and where a cut is allowed. It also measures a reference film before you copy its numbers into a brief.

## Invoke with

`/khe-launch-film [plan | review | formats] [target]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: no register named; sentences fade in as blocks; an unknown product's name is held to 70 % of the film; cuts land on settled frames; the endcard shows a bare URL.

After: UI motion at about 4 cuts a minute and 9 % still; a readable word by 0.2 s; the name at 29 % where the problem act ends; words built 0.2 s apart and held 1.15 s; a 5.0 s endcard whose last 2.0 s hold still.

## Example prompts

- I'm making a 60 second launch video for a dev tool nobody has heard of. When should the name show up?
- Here's my render. It feels like a slideshow and I can't tell why.
- I need a 9:16 version of our launch film for the feed. Can I just crop it?

## Pairs with

- `khe-sound`: this skill only names the sound register and its loudness; the cue sheet, the track placement and the files are built there, after picture lock.
- `khe-ui`: a film's 0.5 s entries and long holds are wrong for product UI, so anything that ships in the product is timed there.
- `stageshow`: the product surface a shot shows is built as a faux demo first, framed and checked frame by frame, before the film crops into it.
- `khe-ui`: review findings use its Before, After, Why table, one issue per row.

## Verify

```bash
node scripts/film-check.mjs plan.json --gate
node scripts/film-check.mjs plan.json render.mp4 --gate
node scripts/film-check.mjs --self-test
```

The gate reads a film plan (JSON), a beat sheet or a review (markdown) and names every fault as a line, such as `beat-gap:`, `name-window:` or `cut-rate:`. It ends `film check passed` only when every never-intentional line is at 0. With ffprobe on PATH and a video passed beside the plan, it also holds the file's duration, frame rate, size, H.264 level and frame count to the plan; without ffprobe it prints `inconclusive: ffprobe not found` and still checks the plan.

What it proves: the plan names one register, its beats cover the runtime, the name, the endcard, the cut rate and the still share sit inside that register's measured numbers, every seam is typed, type can be read, and no sound is placed before picture lock.

What it does not prove: that the film is worth watching. It reads no pixel, counts no cut on a render and hears no sound. Those are answered from frames in [references/verify.md](references/verify.md) and by a fresh-eye review. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with its exits, the rules and the reference index.
- `references/`: 19 references the agent opens one at a time (among them `verify.md`, `review.md` and `teaching.md`), plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: the gold. Three film plans in three registers, one beat sheet and one finished review.
- `teaching/`: fourteen bad/good pairs, one folder per gate line, the same plan twice with one thing wrong.
- `scripts/film-check.mjs`: the gate. Zero dependencies, Node 20 or later.
- [LICENSE](LICENSE): MIT.

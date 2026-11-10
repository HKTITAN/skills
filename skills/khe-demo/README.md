# khe-demo

Records a demo of the real running app: seeded, scripted, repeatable, short.

```bash
npx skills add HKTITAN/skills --skill khe-demo
```

## What it does

- Drives the actual product, a web app in your Chrome or a native desktop app, never a mock-up of it.
- Seeds the state first and writes the reset, so the take can be recorded again tomorrow.
- Writes the flow as one script file: two to five beats, stable targets, a condition to wait for after every action.
- Moves a pointer at hand speed, types at a speed a viewer reads, and holds the result long enough to read.
- Records at a fixed viewport, scale and frame rate, then trims the handles, speeds up the waits and exports an mp4, a webm, a GIF and a poster.
- Gates the script and the files, and ends by saying what nobody watched.

## When to use it

Use it for a screen recording of a feature for a README, a product page or a post, a GIF of a flow, a walkthrough clip, or a real product shot to cut into a launch film. If the product cannot be run or seeded, or you want a simplified picture of it, that is faux UI: use `stageshow`. For a film with cuts, titles and sound, use `khe-launch-film`.

## Invoke with

`/khe-demo [plan | record | post | review] [url or app] [readme | site | social | film]`

Or describe it: the app, the one thing to show, and where the recording will be seen.

## Before and after

Before: "record a demo of the app" returns a 48 second capture of a whole 1920 px desktop, your own account in the corner, a three second spinner, a pointer that jumps between buttons, and a flow that cannot be re-recorded because the data is now changed.

After: a `demo.json` with four beats and a reset; two takes that end on the same screen; `demo.mp4`, 8 s at 2048 x 1280, and `demo.gif`, 800 px at 20 fps; the gate's last line `demo-check passed`; and a `DEMO.md` whose last line says what was not checked.

## Example prompts

- Record a demo of adding a task, for the README. The app runs on localhost:5173.
- I need a GIF of the new filter. Seed it with five fake customers.
- Make a vertical walkthrough of the checkout on a phone viewport, test mode only.

## Verify

```bash
node scripts/demo-check.mjs demo.json --gate                                # the script
node scripts/demo-check.mjs demo.json out/take.take.json out/demo.mp4 --gate   # script, take report and file
node scripts/demo-check.mjs --self-test                                     # the gate against its own fixtures
```

`demo-check.mjs` names every fault as a line. `--gate` ends `demo-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the script has two to five beats and a held payoff, a reset, a target and a condition for every action, no sleep in place of a wait, a declared viewport, scale and frame rate, text that lands at 9 px or more where it is shown, and nothing shaped like a secret or a real email in what it types, loads or opens. From the take report: two takes ended on the same screen, and a loop's last frame is its first. With ffprobe on PATH, for each file: its length, pixel size, frame rate, codec and megabytes against the script and its destination.

What it does not prove: anything about a pixel. Real data from the database, a notification, a pointer that looks wrong, dead air inside the file, a soft upscaled take and whether the story lands are all found by watching. Without ffprobe the files are `inconclusive`, never passed. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the five failures, the safety rules, the workflow and the never-ship table.
- `references/`: `surfaces.md` (web or desktop, which driver, what each tool can do today), `state.md` (seed, reset, accounts, the clock, the window), `script.md` (the script format, targets, waits, pointer and typing pace), `capture.md` (viewport, scale, frame rate, codecs, GIF, size ceilings), `post.md` (trim, ramp, zoom, export), `verify.md` (the last pass, every gate line, the `DEMO.md` template), `review.md` (the fresh-eye brief), `teaching.md` (the pairs), and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: four gold scripts (a web flow, a README loop, a phone take, a desktop plan) and `app/`, a small task app with its own server to run them against.
- `teaching/`: fourteen bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `demo-check.mjs` (the gate), `record.mjs` (runs a script against a web app and writes the take) and `post.mjs` (the ffmpeg recipes). Node 20 or newer. The gate has no dependencies; the recorder uses the `playwright-core` in your project and ffmpeg on your PATH. Nothing is bundled.
- [LICENSE](LICENSE): MIT.

Sources: the method follows Benji Taylor's Stageshow ([benjitaylor/skills](https://github.com/benjitaylor/skills)). The drivers it can call are [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) and [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop).

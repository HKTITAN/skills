# khe-auto

Picks the right skill for a request and runs it.

```bash
npx skills add HKTITAN/skills --skill khe-auto
```

## What it does

- Reads a request and names the one or two skills that own it, with a one-line reason each.
- Runs them in order, one at a time, looking at the result between them.
- Routes to the khe skills, to Emil Kowalski's and Benji Taylor's skills and to Vercel's `ui-sdk` and agent skills by name, and says whose each one is.
- Says so when no skill applies, instead of stretching one over the wrong problem.
- Runs one loop for whichever skill it routed to: plan, start from gold, build, run that skill's gate, fix the largest fault, walk verify, fresh-eye review, hand over.
- Ends every reply with what it could not verify.

## When to use it

Use it when you do not know which skill covers a problem, when two seem to overlap, when a job spans several, or when you just want the right thing to happen without choosing. If you already know the skill, call that skill directly: it is one step shorter.

## Invoke with

`/khe-auto [request | which <job> | list]`

Or describe the problem in your own words.

## Before and after

Before: "make the logo reveal better" loads four skills at once and returns a list that mixes path cleanup, easing, sound and export settings, none of it applied.

After: a `Goal:` line, then `khe-svg`: the reveal lives inside the file, then the svg pass with its changes made and its gate's last line, then `Not verified:` and the one thing nobody looked at.

## Example prompts

- I need a launch video for Friday. What do I run, and in what order?
- Which skill do I use for a hero demo of the app on the landing page?
- The drawer feels off when I let go of it. Where do I start?

## Verify

```bash
node scripts/route-check.mjs reply.txt --gate   # a routing reply, saved as text
node scripts/route-check.mjs playbooks --gate   # every playbook
node scripts/route-check.mjs --self-test        # the gate against its own fixtures
node scripts/gate-all.mjs                       # every gate in the collection
```

`route-check.mjs` names every fault as a line. `--gate` ends `route-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the goal, names two skills at most or one playbook, names only skills in the domain tables of SKILL.md, puts the contract first and picture before sound, gives no design value in the route, gives the install line for a missing skill, and ends with what was not verified. For a playbook: every step names a real skill, an exit and the gate that checks it, and the file ends with its required reply.

What it does not prove: that the route is the right one for the request, that the work followed the skill's rules, or that any gate named in the reply was run. It reads text and never sees the request. Passing is necessary, not sufficient.

`gate-all.mjs` runs the `--self-test` of every gate installed beside this skill and prints one line per skill: `ok`, `FAIL`, `no gate` or `not installed`. A missing sibling is reported and is never counted as a pass.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the playbook table, the domain tables, the overlaps and the output format.
- `playbooks/`: nine whole jobs. Every step names its skill, its exit and its gate.
- `references/`: `loop.md` (the shared loop), `verify.md` (the last pass and every gate line), `review.md` (the fresh-eye brief), `teaching.md` (the pairs), and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold routing replies: one skill, two skills, a playbook, nothing fits, not installed, and `which`.
- `teaching/`: fourteen bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `route-check.mjs` (the gate) and `gate-all.mjs` (every gate's self-test). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT.

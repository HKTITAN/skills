# khe-poteto-pyramid

Takes the correction you keep giving your coding agent and puts it where the next agent cannot make the mistake: in the code, in a check, in verification, and only last in a line of prose. Built on Lauren Tan's ("poteto") pyramid from her talk "All Code Is Slop".

```bash
npx skills add HKTITAN/skills --skill khe-poteto-pyramid
```

## What it does

- `place`: one correction ("the renderer keeps importing main-process code"). It finds two or more times it happened, walks the five layers from the top and stops at the first that can hold it, builds the fix there, replays a past mistake to prove the check fails on it, and deletes the AGENTS.md line the fix replaces.
- `sweep`: reads recent commits, reverts, review comments and workaround comments, groups the mistakes agents repeat into classes, and places the top three.
- `triage`: goes through an AGENTS.md, CLAUDE.md or rules file line by line. What a tool could enforce moves up and is deleted; what needs judgment stays, in a rule table that pairs every rule with what enforces it.
- `audit`: answers ten questions about the repo from evidence, two per layer, scores each layer, and says where to start. Before anyone wires a trigger or a cron to agents, it checks the loop verifies itself.
- Writes every lint error so it names what to use instead.
- Ratchets a pattern that is already common: new cases fail, old ones are listed to burn down.
- Never commits, pushes or changes CI unless you asked.
- Ends every reply with what it could not verify.

## The pyramid

![The poteto pyramid: five layers from codebase at the top to human review at the tip, with cost rising toward the tip, and the skills that take each layer's deep part beside it](assets/pyramid.svg)

| Layer | Holds | Example |
|---|---|---|
| Codebase | Architecture, API design, folders, deletion | Two folders, `electron-renderer/` and `electron-main/`; `useEffect` fenced into one file |
| Static analysis | Lints, types, compilers, tests, CI | An import ban whose error names the IPC call to use |
| Verification | Running the app, formal models, property tests | A feature map and a CLI that drives the app; a TLA+ model of a race |
| Prose | Rules, skills, AGENTS.md | "Build what was asked, finished" |
| Human review | Evidence and what landed | Whatever it catches twice moves back up |

The higher the layer, the cheaper and more certain the catch. A lower layer only gets what every layer above could not hold.

## When to use it

Use it when you have corrected an agent for the same thing twice, when your AGENTS.md keeps growing and agents keep ignoring it, or when you want agents to merge more of their own work. For a UI review use `khe-ui`, for a recording of the app `khe-demo`, and for design taste written down as rules `learn-taste` (Emil Kowalski). For the deep parts it hands off to poteto's own pstack skills (`create-verification-skill`, `create-formal-verification-skill`, `statechart`, `no-comments`) and Matt Pocock's (`improve-codebase-architecture`, `setup-pre-commit`).

## Invoke with

`/khe-poteto-pyramid [place <correction> | sweep | triage <file> | audit]`

Or in your own words: "the agent keeps doing X", "where should this fix live", "turn this into a lint", "our AGENTS.md is too long", "can we let agents merge their own PRs".

## Before and after

Before: "stop importing main from the renderer" becomes line 14 of AGENTS.md. Two weeks later an agent imports `src/main/db` from a component, with a comment saying it was the smallest change, and a reviewer catches it again.

After: the code lives in `electron-renderer/` and `electron-main/`, a dependency rule fails the import with "use `ipc.invoke('db:query', …)` from `electron-renderer/client/ipc.ts`", the rule was replayed on the PR that started it and failed there, line 14 is deleted, and `PYRAMID.md` records all of it with `Gate: pyramid-check passed` and `Not verified:` the dynamic imports the rule cannot see.

## Example prompts

- The agent keeps fixing flicker with `setTimeout(…, 0)`. Place it.
- Sweep the last month of PRs and tell me what agents keep getting wrong.
- Triage our CLAUDE.md. Everything a tool could enforce should be a check.
- Audit this repo. Can we let agents merge their own PRs yet?

## Verify

```bash
node scripts/pyramid-check.mjs PYRAMID.md --gate     # a placement record
node scripts/pyramid-check.mjs AGENTS.md --gate      # a rules file
node scripts/pyramid-check.mjs examples --gate       # the gold
node scripts/pyramid-check.mjs --self-test           # the gate against its own pairs
```

What it proves, for a record: every class has two occurrences, every layer above the chosen one was ruled out with a reason, every structural fix names a runnable enforcer that is not a doc or a comment, every static error names a replacement in backticks, every proof names a past case that failed, the replaced instruction was deleted, nothing was left to review, and the record ends `Not verified:`. For a rules file: no imperative bullet bans or requires a named thing a tool could check, and no rule-table row lacks an enforcer.

What it does not prove: that the check really fails on the past case (it never runs it), that a reason is honest, or that the refactor removed the mistake. Its rules-file lines are a heuristic over wording. Passing is necessary, not sufficient.

## What is inside

```text
SKILL.md        the jobs, the hard rules, the steps
references/     layers, placing, checks, verification, prose, loop, audit, verify, review, sources
examples/       six gold placement records and a triaged AGENTS.md, for an invented Electron app
teaching/       eleven bad and good pairs, one fault each
scripts/        pyramid-check.mjs, the gate
```

## Credit

The pyramid and its ideas are Lauren Tan's, from her talk at AI Engineer Code Summit on 11 November 2026, read through Miguel Alvarado's study guide at [artesano.build/all-code-is-slop](https://artesano.build/all-code-is-slop) and her pstack guides. This skill is Harshit Khemani's reading, not written or endorsed by her. Her own skills are at [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack).

Harshit Khemani. MIT.

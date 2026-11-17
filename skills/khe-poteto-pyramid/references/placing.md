---
title: placing
summary: How to decide where a correction lives: the evidence, the question for each layer, reasons that do not count, sweeping a repo's history, and the placement record format the gate reads.
---

# Placing a correction

## Evidence

A mistake class counts once it has happened twice. One occurrence is fixed where it is; a layer built for it costs a check to maintain and catches nothing new.

A class also needs a trigger you can read from a diff. "Be careful with sessions" is not one; "a message type changed, so an old transcript without the new field must still load" is. Before building, try to disprove it: run it in your head (or for real) over merged, stable changes, and if it would flag them it is wrong or too wide. A miss on a known incident is worth replaying too: if most of a few independent bug-finding passes catch it on that diff, it is detectable, and a small diff that slipped through is a gap worth a rule.

Where to look, cheapest first:

| Source | Command or place | What it gives |
|---|---|---|
| The user's own words this session | the conversation | The correction, and often the file |
| Review comments | `gh pr list --state merged --limit 50`, then `gh pr view <n> --comments` | The same comment on different PRs is a class |
| Reverts | `git log --oneline -i --grep=revert` | The mistakes that reached a branch people use |
| Workaround comments | `git grep -n -i -E` for hack, workaround, for now, temporary, do not remove, in case | The patches someone felt they had to defend |
| Rules files | `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `CONTRIBUTING.md` | Every rule is a mistake someone saw at least once |
| Session notes and transcripts | wherever the team keeps them | "Did you actually run it?" and its cousins |

Each `Seen:` bullet names a reference a stranger can open: a PR number, a commit, a file and line, a dated session note.

## The question for each layer

Ask from the top. Stop at the first yes.

| Layer | Ask | A yes looks like |
|---|---|---|
| codebase | Can the wrong version be made impossible to write, or obviously out of place? | Delete the old way; one owner; hide the internal; rename the folder so the boundary is visible; fence the API into one file |
| static | Can a tool reject the wrong version before a person sees it? | A type that cannot hold the bad state; an import ban; a banned call; a test of the behavior; a CI step |
| verification | Is it a property of running behavior no single file shows? | Launch and drive the app; a TLA+ model of the ordering; a property test; a statechart |
| prose | Does it need a judgment no tool can make? | Scope, taste, when to stop and ask, which of two reasonable designs |
| review | Never the answer for a class | Find the layer above |

A placement often takes two layers: a codebase change that makes the right way obvious and a lint that holds the line (`codebase + static`). Name the highest first; the gate reads the first layer named as the placement's layer.

## Reasons that do not count

A `Not higher:` reason says why the layer cannot hold the mistake, not why it is inconvenient.

| Does not count | Why | Do instead |
|---|---|---|
| "It would be a big refactor" | Cost, not possibility | Place it lower now (a ratchet lint) and file the refactor; say so in the reason |
| "We don't have that tool set up" | The tool is the work | Set it up, or name the tool and file it |
| "Agents usually get it right" | Then it is not a class | Fix the one case; no layer |
| "It's documented" | Documented is the prose layer | Ask the layer's question again |
| "The reviewer knows" | That is the review layer | Ask the layer's question again |

Reasons that do count are about what the layer can see: a lint cannot see an ordering across devices; verification cannot say what should not have been built; a folder layout cannot hold a rule about timing.

## Moving rules up: the common cases

| The line someone wrote | Where it goes |
|---|---|
| "Never import X from Y" | codebase + static: the folder boundary and an import ban. Delete the line |
| "Avoid API Z" | codebase: fence it into one file behind a replacement that needs no nuance. Delete the line |
| "Don't use a timer to fix a render glitch" | static: a lint whose error names the root-cause fix and the allowed scheduler |
| "Don't leave comments explaining a workaround" | static: ban comments; a real constraint becomes a type, a test or a lint |
| "Run the app and attach evidence before calling it done" | verification: a verification skill with a feature map and a CLI, so the agent can do it instead of being told |
| "Ship fewer polished features over more rough ones" | prose: a judgment call |
| "Carry on without asking, except before anything irreversible" | prose: a judgment call |

## Sweep

For `sweep`, read the sources in Evidence across the last 30 to 60 days, or the last 50 merged PRs, whichever is smaller. Write every mistake as one line with its reference. Group by what the fix would be, not by file: three different imports across the same boundary are one class. Rank by count, then by cost when it reached users. Place the top three, one change each, in that order.

## The record

The gate reads this format. One file, `PYRAMID.md` at the repo root by default, appended to on every job. Each class is one `## Placement:` section of `Key: value` lines; a key followed by bullet lines holds a list.

```text
# Placements: <repo or scope>

Repo: <name>
Date: <YYYY-MM-DD>
Job: place | sweep | triage

## Placement: <the mistake, in a few words>

Correction: <what the user kept saying, in their words>
Seen:
- <occurrence, with a PR, commit, file:line or dated note>
- <a second occurrence>
Layer: codebase | static | verification | prose   (two allowed, highest first)
Not higher:
- <layer>: <why that layer cannot hold it>   (one bullet per layer above the one chosen)
Change: <what changed, with paths in backticks>
Enforced by: <the command or path that fails, in backticks>   (codebase, static, verification)
Error: "<the message the agent reads, naming what to use instead in backticks>"   (static)
Proof: <the past case replayed, that it failed, and that the branch passes>   (codebase, static, verification)
Prose: deleted <the line> | none | added <the line> (prose layer only)

Gate: <the last line of pyramid-check --gate>
Not verified: <what nobody checked>
```

`Not verified:` is the file's last line. Fields the gate does not read (`Repo`, `Date`, `Job`, `Change`, `Gate`) are still required by [verify](verify.md) for a person reading the record.

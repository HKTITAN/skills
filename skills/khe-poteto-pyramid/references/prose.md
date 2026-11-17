---
title: prose
summary: What stays as prose, the rule table that pairs each rule with its enforcer, how to triage a rules file, and why comments and unsolicited markdown are banned.
---

# Prose

Rules, skills and AGENTS.md come last and stay small. They are for judgment calls, because nothing fails when an agent skips them. Her advice is to forget rules and skills at first and add them later, and to write docs and agent rules last.

## What stays

A line stays as prose only when no tool can make the call:

- **Scope.** Build what was asked, finished, over more that is rough.
- **When to stop.** Carry on without asking for anything that can be undone; stop before anything that cannot.
- **Choosing between two reasonable designs.** Which one, and what the other would add.
- **Taste** a reviewer can explain but a lint cannot state.

Each kept line asks for one judgment and says what to do. "Be careful with state" asks for nothing.

## The rule table

Keep one table in the agent instruction file that pairs every rule with what enforces it:

```text
| Rule | Enforced by | Since |
|---|---|---|
| Renderer never imports main | `npm run lint:deps` (`renderer-not-to-main`) | 2026-11-02 |
| Build what was asked, finished | judgment | 2026-11-17 |
```

- A row whose enforcer is a command or a path is held by a tool. The prose for it elsewhere in the file is deleted.
- A row marked `judgment` is prose on purpose.
- A row with an empty enforcer is a repeat waiting to happen. When an agent is corrected for a rule that is already in the table with nothing enforcing it, place it at the highest layer that works, in the same change.
- Drop a row once its mistake cannot happen: the API it banned is gone, the folder it guarded no longer exists.

The gate raises `unenforced-rule` on an empty row and `no-rule-table` when there is no table.

## Triage

For each bullet and paragraph in the rules file:

| The line | Do |
|---|---|
| Forbids or requires something a tool could check (an import, a call, a file pattern, a command) | Move up: a `place` job. Delete the line when the check lands |
| Tells the agent to run or check something before it is done | Move up to verification: the agent should be able to do it, not be told |
| Already enforced by something in the repo | Add the enforcer to the rule table and delete the line |
| About a mistake that can no longer happen | Delete it |
| A fact about the project (where things are, how to run it) | Keep, short; facts are not rules |
| A judgment call | Keep, in the judgment section, ending `(judgment)` |
| A preference stated as law after one small correction | Delete it, or rewrite it as the judgment it really is |

The gate raises `enforceable-prose` on a bullet that names a backticked thing with never, don't, avoid, must not, only use or always use, and `run-me` on a bullet that tells the agent to run or check something. It is a heuristic: read each line it raises and decide.

## Comments and unsolicited markdown

Her team bans almost all comments in product code, for three reasons: they go stale and mislead agents and people; agents use them to explain workarounds that should have been fixes; and they cannot be enforced and cost tokens. The `setTimeout` story in [layers](layers.md) is the proof: the comment is what made the shortcut copyable.

- Ban comments in product folders with a lint, and let the few that guard a real constraint become a type, a test or a lint instead.
- Stop agents writing markdown nobody asked for: design notes, rule files, "LEARNINGS.md". Agents record justifications there, or turn one small correction into a permanent rule. A skill or rule is written by a person's decision, through this triage.
- poteto's `no-comments` runs a comment sweep with a reviewer subagent and offers to encode each claimed constraint.

When the fix is structural, use only the structural fix. The instruction is the symptom.

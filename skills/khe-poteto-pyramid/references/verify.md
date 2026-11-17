---
title: verify
summary: The last pass before handing over: yes or no questions answered from what you ran, every gate line, what the gate cannot see, and what to do for each symptom.
---

# Verify

Answer each from what you ran or opened in this session, never from the code you wrote or from memory. Every answer names what you looked at.

1. Does every class have at least two `Seen:` references a stranger can open?
2. Was each layer above the chosen one asked its question in [placing](placing.md), and is each `Not higher:` reason about what the layer can see, not about effort?
3. Does the `Enforced by:` command run on this machine, and is it the same command CI runs?
4. Did you watch the check fail on the past case, and pass on the branch? Paste both.
5. Does every static error name, in backticks, what to use instead?
6. Was the prose the change replaces deleted, and the rule table updated?
7. If the pattern was already common, does the check fail only on additions, and are the old cases listed?
8. Did you add any comment or markdown file nobody asked for? Delete it.
9. Did you commit, push, or change CI or branch protection? Only if the user asked in this session.
10. Does `node scripts/pyramid-check.mjs <record> --gate` end `pyramid-check passed`?

## Gate lines

| Line | Means | Do |
|---|---|---|
| `no-layer` | No layer, or one the gate does not know | Name one of codebase, static, verification, prose |
| `once` | Fewer than two occurrences | Find a second, or fix the one case in place and drop the placement |
| `skipped-higher` | A layer above was never ruled out | Ask its question; write the reason, or move the placement up |
| `no-enforcer` | Nothing runnable enforces it | Name the command or path, in backticks |
| `prose-enforcer` | The enforcer is a doc, a comment or an instruction | That is the prose layer; build the check |
| `mute-error` | The error names no replacement | Add the file, type, function or command to use instead |
| `never-failed` | No past case was replayed | Replay it; paste the failure and the reference |
| `belt-and-braces` | The instruction stayed beside the structural fix | Delete it; `Prose: deleted …` |
| `left-to-review` | The placement is "a reviewer watches for it" | Find the layer above that holds it |
| `no-unverified` | The record ends without naming what was not checked | End with `Not verified:` and the real gaps |
| `enforceable-prose` | A rules-file bullet a tool could hold | Move it up, or mark it `(judgment)` if it truly is |
| `unenforced-rule` | A rule-table row with no enforcer | Build the enforcer, mark it `judgment`, or drop the row |
| `no-rule-table` (candidate) | The rules file has no rule table | Add one |
| `run-me` (candidate) | A bullet tells the agent to run something | A verification skill does it instead |
| `prose-no-judgment` (candidate) | A prose placement that names no judgment | Say which judgment it asks for, or move it up |

## What the gate cannot see

It reads the record and the rules file. It never runs the check, so it cannot tell that `Proof:` is true, that the error text matches the real config, or that the refactor removed the mistake. It cannot judge whether a `Not higher:` reason is honest. Its rules-file lines are a heuristic over wording. Passing is necessary, never sufficient: questions 3, 4 and 6 are answered by running things.

## Symptoms

| You see | Do |
|---|---|
| The check fails on the whole repo | Make it a ratchet ([checks](checks.md)), then burn down |
| The past commit is gone | Write the smallest diff that reproduces it, check that, say so in `Proof:` |
| An agent disabled the new rule in its next PR | The error did not name the fix, or the replacement does not cover the case; extend it |
| The mistake came back in a form the check misses | A new placement; the class was wider than its first check |
| The user wants it written down "for now" | Write it in the rule table with an empty enforcer, so the gate keeps raising it |

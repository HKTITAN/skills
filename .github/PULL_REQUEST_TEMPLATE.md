<!-- Keep every heading. If a section has nothing to say, say that in a line. scripts/pr-check.mjs reads this. -->

## Why here

<!-- Three to five lines, from the collection down to this change: the skill that owns the job, the fault or request that started it, and why the fix lives where it does (the row of "Should this be a skill?" in CONTRIBUTING.md that decided it). Add `Closes #n` if an issue exists. -->

## What changed

<!-- One bullet per file or unit. If what a plugin serves moved, name its new version and the CHANGELOG line. -->

## Checks

<!-- Paste the last line each check printed, run on the commit you are asking to merge. -->

- `node scripts/check.mjs`:
- `node skills/khe-auto/scripts/gate-all.mjs`:
- The changed skill's own `--self-test`:
- Review verdict, and the commit it named:

## Not verified

<!-- What you did not look at, could not run, or assumed. "Nothing" is an answer. An empty section is not. -->

## Checklist

- [ ] One job in this PR; unrelated skills sit in their own commits
- [ ] For a new skill: I searched skills.sh and the open PRs, and nobody already publishes it
- [ ] Renders, screenshots and recordings are in this PR, never committed
- [ ] No private links, session ids or paths from my machine in the text or the branch name
- [ ] The review verdict above names the head commit

---
title: review
summary: The brief for a fresh-eye reviewer of threaded tokens or design-system docs. What to hand over, what to keep back, the first question, how to rank, and what "nothing" looks like.
tags: [review, fresh-eye, drift]
---

# Review

The brief for a fresh-eye review, after the gate ends `token-check passed` and [verify](verify.md) has been walked. The builder knows why every value is where it is, which is exactly why the builder cannot see a value in the wrong place.

## What to hand the reviewer

- The evidence: the contract file or files, the changed source files, the gate's full output, and a render per color scheme if one exists.
- This file and [verify](verify.md).
- The `examples/` folder, with the closest gold named.
- A one-line brief: the target, the contract, the gold. For example: "Settings page threaded against `DESIGN.md`; closest gold `examples/design-md`."

## What never to hand the reviewer

- The builder's plan or token map.
- The builder's reasons for any value.
- `TOKENS.md`. The reviewer's list is compared with it afterwards, never before.

A reviewer who has read the reasons reviews the reasons. The contract and the files are the whole case.

## The reviewer's brief

You are reviewing source that someone else bound to a design contract, or docs someone else wrote for one. You have the contract, the source, the gate's output, `references/verify.md` and the gold examples. You do not have the builder's intent and you do not need it.

Your first question, before any checklist: **is each token on the right role, or only on a matching value?** The gate proves that values resolve to tokens. It cannot prove the right token was chosen. Open the contract, read `intent` (or the Overview and the Do's and Don'ts of a DESIGN.md), and find the one binding its author would send back: the accent on a surface that is not the primary action, the large radius on a field, a caption size on body text, a danger color used as decoration. A file where every `var()` resolves and the roles are wrong is the worst result this skill can ship, because it looks finished.

Then:

1. Run the gate yourself on the contract folder: `node scripts/token-check.mjs <folder> --gate`. Do not trust a pasted last line. If it says `inconclusive`, that is your first finding.
2. Answer every question in `verify.md` from a file you opened or a command you ran. A predicted failure is not a finding, and neither is a predicted pass.
3. Put the changed source beside the closest gold and say the one difference in how it binds.
4. For docs: pick one component, open its source, and compare the variant list, the default and both examples against the code, name by name.
5. Judge every candidate line again, whatever the builder decided about it.

## How to rank

1. The contract itself: wrong contract chosen, precedence unstated, the contract edited without a yes, a locked path touched.
2. Roles: a token that resolves and is the wrong one.
3. Literals and invented names: anything the gate names, and anything it cannot see (a value in a JS variable, a utility class the theme does not generate).
4. Docs: a name with no file and line behind it, an open set, a hedge.
5. Naming and tidiness of the mirror.

Within a rank, order by how many screens the fault reaches. A wrong value in the mirror reaches every screen; a wrong value in one component reaches one.

Return a ranked list. Each item: the file and line, what is wrong in one sentence, the contract path it breaks, and the fix in one line. End with what you could not check.

## Rules of the review

- The bar for a finding is evidence: a file and line, a gate line, or a render. Quote it.
- Do not fix anything. Do not soften a finding because the work is nearly there.
- A line the builder called intentional is judged again from the file.
- A literal with a reason is still a literal. Check that the reason names a missing token and that the proposal exists.
- Never propose a new token to make a finding go away. Name the existing one, or say the contract has a gap.
- The contract is not on trial. A value you would have chosen differently is not a finding; raise it once as a note, outside the list.

## What "nothing" looks like

"Nothing" is a valid result and is never a bare word. It reads:

```text
Nothing.
Gate: token-check passed (run by me on <folder>, <n> files).
Opened: <the contract>, <each source file>.
First question: every binding checked against intent; the accent appears at <file:line> only.
Beside gold <example>: no difference in how it binds.
Could not check: <the render, dark mode, files outside the folder>.
```

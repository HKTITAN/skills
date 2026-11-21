---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each folder is named for the gate line its bad half raises, and each row says which named failure of the council it teaches.
---

# Teaching pairs

`teaching/` holds ten pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same council reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault. The named failures are the ones in [SKILL.md](../SKILL.md): `ventriloquist`, `invented-seat`, `averaged-council`, `borrowed-verdict`, `padded-council` and `leaking-chair`. A failure can show up as more than one gate line, so the rows below map each line back to its failure.

All ten pairs use one decision, "Should we build in private for a year before showing the product to anyone outside the team?", and five seats: `khe-brain-varun`, `khe-brain-enrico`, `khe-brain-harshit`, `khe-brain-yc` and `khe-brain-isb`. Every seat block is made of lines lifted from that brain's own gold replies and theme files, with its titles, times and URLs as its `references/sources.md` gives them, so each good file passes five real brain gates. `khe-brain-emil` and `khe-brain-benji` sit on the `Left out:` list with a reason of a few words.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a seat line inside a bad half is never evidence of what anyone published. Start from a run in `examples/`.

The pairs are also the gate's tests. `node scripts/decision-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line (apart from the one companion listed below), and that every good file raises none. Run with no brain installed, the `seat-format` pair is reported as skipped, because only the brain's own gate can judge it.

## The chair speaks for a person

| Failure | Look at | Correction |
|---|---|---|
| `ventriloquist`: `teaching/ventriloquist` | The `Would change it:` line, which starts with a name and "would say" | Report what the seat published, with its citation, or say it is not covered. A guess at a position in a real person's mouth is the one fault a reader cannot see. |
| `borrowed-verdict`: `teaching/unlabelled-synthesis` | `Recommendation:` with no label, so it reads as the five seats' view | The call is the chair's own synthesis and the label says so, word for word. The self-test also proves the "the council recommends" form on a cut of the same reply. |
| `borrowed-verdict`: `teaching/named-without-citation` | "as Varun Mayya urges" at the end of the recommendation | A name belongs beside the line that was published, in a `[seat: citation]`. A name with no citation hangs the call on a person. |

## The chair adds or smooths

| Failure | Look at | Correction |
|---|---|---|
| `averaged-council`: `teaching/uncited-chair-claim` | A second `Agree:` line with one seat's citation where the `Disagree:` line was | Keep both sides on a `Disagree:` line, each with its citation, and give the reason: stage, audience, date, country, or "the pieces do not say". The chair never picks a winner for the person. |
| `leaking-chair`: `teaching/chair-citation` | `[yc: Startup = Growth]` in `Rests on:`, a real piece the YC seat never cited | The chair may cite only what a seat cited. A piece the seats did not bring is a new seat speaking for someone. |
| `no-rests-on`: `teaching/no-rests-on` | The `Rests on:` line is gone | Name the cited lines the call stands on, so the reader can open each seat and find them. A recommendation that rests on nothing cannot be checked. |

## The seats

| Failure | Look at | Correction |
|---|---|---|
| `invented-seat`: `teaching/seat-format` | `(Kata 12)` with no time in the Varun seat | A seat is in its own brain's format, and that brain's `scripts/brain-check.mjs` is the judge, so a brain added later brings its own rules. This pair needs the brain installed; the gate says `seat-unchecked` and skips it when the brain is absent. |
| `invented-seat`: `teaching/seat-uncited` | "Founders should launch before they are ready." in the Harshit seat, with no source | A seat cites its brain or says its brain is silent. It never fills a gap from general knowledge. The brain's own gate does not always catch an unattributed line, which is why this generic check runs first. The Harshit brain's own gate passes this line, so only the generic check raises it. |

## The size and the form

| Failure | Look at | Correction |
|---|---|---|
| `padded-council`: `teaching/too-few-seats` | One seat block, a chair that rests on it, and a council of one | Agreement and disagreement need two voices. With one relevant brain, hand the question to it. With none, do not convene. |
| `padded-council`: `teaching/not-convened-form` | "Council: not convened" followed by a recommendation | A council that does not convene gives `Decision:`, the reason, `Not covered:`, `Next:` and `Not verified:`, and no recommendation. |

## Lines with no pair

`no-decision`, `no-council-line`, `no-chair`, `no-would-change`, `no-not-verified`, `no-reading-line`, `hedge`, `seat-unchecked` and `brain-unaccounted` have no folder. The self-test proves each on the canonical good reply with one edit. `hedge`, `seat-unchecked` and `brain-unaccounted` are candidates and fail only under `--strict`. `node scripts/decision-check.mjs --help` lists what each one means.

## What a pair cannot show

A pair shows a fault the gate can read. The faults it cannot read are the ones that matter most: a brain seated that does not cover the decision so the council looks bigger (the second half of `padded-council`), a chair line that cites a real seat line and says more than the line says, and two seats whose disagreement the chair never noticed. For those, use the review brief in [review](review.md), and open each seat's source at its time.

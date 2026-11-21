---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each folder is named for the gate line its bad half raises, and each row says which named failure of the council it teaches.
---

# Teaching pairs

`teaching/` holds fifteen pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same council reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault. The named failures are the six in [SKILL.md](../SKILL.md): `ventriloquist`, `invented-seat`, `averaged-council`, `borrowed-verdict`, `padded-council` and `leaking-chair`. A failure can show up as more than one gate line, so every row below gives both: the gate line, which is the folder's name, and the named failure it teaches.

Thirteen pairs use one decision, "Should we build in private for a year before showing the product to anyone outside the team?", and five seats: `khe-brain-varun`, `khe-brain-enrico`, `khe-brain-harshit`, `khe-brain-yc` and `khe-brain-isb`. Every seat block is made of lines lifted from that brain's own gold replies and theme files, with its titles, times and URLs as its `references/sources.md` gives them, so each good file passes five real brain gates. `khe-brain-emil` and `khe-brain-benji` sit on the `Left out:` list with a reason of a few words.

Two pairs use other decisions. `not-convened-form` asks which database an app should use, a question no installed brain covers, and has no seats. `nearest-citation` needs a seat that came back silent, so it uses the decision and the four seat blocks of `examples/most-seats-silent.txt`, copied whole, under a shorter chair block.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a seat line or a chair line inside a bad half is never evidence of what anyone published. Start from a run in `examples/`.

The pairs are also the gate's tests. `node scripts/decision-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line, and that every good file raises none. No pair has a companion line. The `seat-format` and `seat-name` pairs need the brain that judges them: run where that brain is not installed, each is reported as skipped, and its good file is still checked.

## The chair speaks for a person

| Gate line and folder | Named failure | Look at | Correction |
|---|---|---|---|
| `ventriloquist`: `teaching/ventriloquist` | `ventriloquist` | The `Would change it:` line: a name, "would say", and a real citation hung on the guess | Report what the seat published, in the form "what {name} has published suggests", with its citation in the same sentence, or say it is not covered. A citation beside "would" does not make the sentence his. |
| `seat-name`: `teaching/seat-name` | `ventriloquist` | The header `khe-brain-yc (Paul Graham)`, where the installed brain's heading is Y Combinator | The name in a seat header is the one the `--seats` listing prints. A library under one person's name puts every line in the block in that person's mouth. This pair needs the brain installed. |
| `unlabelled-synthesis`: `teaching/unlabelled-synthesis` | `borrowed-verdict` | `Recommendation:` with no label, so it reads as the five seats' view | The call is the chair's own synthesis and the label says so, word for word. The self-test also proves the "the council recommends" form on a cut of the same reply. |
| `recommendation-names`: `teaching/recommendation-names` | `borrowed-verdict` | The recommendation ends "which is the line Varun Mayya's videos take" with his citation | The call names no person and no institution, cited or not. Its citations live on `Rests on:`, where they are support and never a signature. |
| `unknown-chair-label`: `teaching/unknown-chair-label` | `borrowed-verdict` | A `Bottom line:` line under `Rests on:` | The chair block holds `Agree:`, `Disagree:`, `Not covered:`, the labelled recommendation, `Rests on:`, `Would change it:`, `Not verified:` and the reading line. A line under any other label is a second call with no label on it. |

## The chair adds or smooths

| Gate line and folder | Named failure | Look at | Correction |
|---|---|---|---|
| `named-without-citation`: `teaching/named-without-citation` | `leaking-chair` | "Varun Mayya's videos lean toward the early test." at the end of `Not covered:`, with no citation | A name belongs beside the line that was published, in a `[seat: citation]` in the same sentence. The rule holds on every chair line but `Rests on:` and `Not verified:`. `Not verified:` is the run's log and may name a seat or a brain; a `Why:` clause may name a seat its own `Disagree:` line cites. |
| `chair-citation`: `teaching/chair-citation` | `leaking-chair` | `[yc: Startup = Growth]` in `Rests on:`, a real piece the YC seat never cited | The chair may cite only what a seat cited, and the whole citation, character for character: a piece of one ("Kata 1" for "Kata 12") and text from a `Not in` line are refused too. |
| `no-rests-on`: `teaching/no-rests-on` | `leaking-chair` | The `Rests on:` line is gone | Name the cited lines the call stands on, so the reader can open each seat and find them. A recommendation that rests on nothing a seat cited cannot be checked. |
| `uncited-chair-claim`: `teaching/uncited-chair-claim` | `averaged-council` | A second `Agree:` line with one seat's citation where the `Disagree:` line was | Keep both sides on a `Disagree:` line, each with its citation, and give the reason: stage, audience, date, country, or "the pieces do not say". The chair never picks a winner for the person. |

## The seats

| Gate line and folder | Named failure | Look at | Correction |
|---|---|---|---|
| `seat-format`: `teaching/seat-format` | `invented-seat` | `(Kata 12)` with no time in the Varun seat | A seat is in its own brain's format, and that brain's `scripts/brain-check.mjs` is the judge, so a brain added later brings its own rules. This pair needs the brain installed; where it is absent the gate says `seat-unchecked`. |
| `seat-uncited`: `teaching/seat-uncited` | `invented-seat` | "Founders should launch before they are ready." in the Harshit seat, with no source | A seat cites its brain or says its brain is silent. It never fills a gap from general knowledge, and a parenthesis that matches none of its `Source:` lines is not a citation. The Harshit brain's own gate passes this line, so only the generic check raises it. |
| `nearest-citation`: `teaching/nearest-citation` | `invented-seat` | `[harshit: 2026-05-11-every-extra-click-tax]` in `Rests on:`, a post the Harshit seat carries only on a `Nearest:` line | A seat that came back silent has no position. Its `Nearest:` lines are the brain saying what it has that does not answer the question, and `My reading:` and `Yours:` lines are someone else's words, so the chair builds nothing on them. |

## The size and the form

| Gate line and folder | Named failure | Look at | Correction |
|---|---|---|---|
| `too-few-seats`: `teaching/too-few-seats` | `padded-council` | One seat block, a chair that rests on it, and a council of one | Agreement and disagreement need two voices. With one relevant brain, hand the question to it. With none, do not convene. |
| `duplicate-seat`: `teaching/duplicate-seat` | `padded-council` | The Varun seat block, in the reply twice | A brain is one seat however many blocks carry its name. The gate counts it once, so two blocks of one brain are still a council of one. |
| `not-convened-form`: `teaching/not-convened-form` | `padded-council` | "Council: not convened" followed by a recommendation | A council that does not convene gives `Decision:`, `Council: not convened`, `Not covered:`, `Next:` and `Not verified:`, once each and no other line, and no call under any name: not `Synthesis:`, not `Verdict:`, not "My call". |

## Lines with no pair

`no-decision`, `no-council-line`, `no-chair`, `no-would-change`, `no-not-verified`, `no-reading-line`, `hedge`, `seat-unchecked` and `brain-unaccounted` have no folder. The self-test proves each on the canonical good reply with one edit. `hedge`, `seat-unchecked` and `brain-unaccounted` are candidates and fail only under `--strict`. `node scripts/decision-check.mjs --help` lists what each one means.

The self-test also proves, on cuts of the same reply and on a made-up council of two made-up brains, the forms a pair shows only one of: twelve ways of putting a position in a person's mouth, a chair citation cut one character short, a name with no citation on the `Not covered:` and `Would change it:` lines, a seat named on `Not verified:` (which passes) and "would say" on the same line (which fails), a `Why:` clause that names a seat its line does not cite, "He would" in the sentence after a cited name, a `[n]` marker carried only on a `Nearest:` line, a `Council:` count above the number installed, and a folder that holds a reply beside its `COUNCIL.md`.

The self-test also holds sixteen honest lines the gate once failed, each cut into a good reply. Fifteen raise nothing: a capitalised thing beside "would" ("A Figma case would flip the call"), a country from a seat's `Not in` line on `Not covered:` and on the recommendation, a brain named on `Not verified:`, a `Why:` clause that names a seat its line cites, "they could have learned" about founders after a cited name, and the reporting form with "could" and "will". A gate that fails honest lines gets worked around, so these are tests as much as the bad halves are. The sixteenth, "What Varun Mayya has published suggests you should stop building" with its citation, stays a `ventriloquist` fault and is checked for its own message: the reporting form says what the material says, never what the reader should do.

## What a pair cannot show

A pair shows a fault the gate can read. The faults it cannot read are the ones that matter most: a brain seated that does not cover the decision so the council looks bigger (the second half of `padded-council`), a chair line that cites a real seat line and says more than the line says, a chair line that borrows the words of a `My reading:` line and hangs a real citation on them, a `Disagree:` line that quietly picks a side, and two seats whose disagreement the chair never noticed. For those, use the review brief in [review](review.md), and open each seat's source at its time.

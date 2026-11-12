---
title: verify
summary: The last pass on a reply. The gate first, then yes or no questions answered from the reply and from the cited lines opened again, never from memory of what a partner said.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question as the user typed it, the cited lines in the theme files opened again, and gate output run after the last edit. Never answer from what you remember a partner saying. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the cited piece says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`? It checks every citation in the corpus against the sources table, and that every claim line names someone who speaks in the piece it cites.

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The source (first, because nothing after it matters if this is wrong)

- For each sentence that cites a piece: open the theme file, find the line, and read it. Does the line say what the sentence says, with nothing added?
- Is the person named in the sentence the person the line names? In a talk with two or three speakers, is it the one who said it?
- Is every number in the reply in that line, with the same unit and the same year?
- Is each quote in the reply one of the quotes in the theme files, character for character, and under 15 words?
- Is any sentence a position with no name in it, written that way to get past the gate? Give it its person and piece, or delete it.
- Does any sentence give the view to "YC" or "the partners"? Name the person. A piece signed only Y Combinator is reported as that piece, by its title.

## Stage and scope

- Does the reply say who the advice was given to: a company before launch, before product-market fit, raising a seed round, raising a Series A, selling to businesses, a student? Advice for one stage is wrong at another.
- Is a founder's own story (one company, one market) reported as that story and not as a rule?
- Is a legal or money figure (a valuation, a round size, a document's terms) given with the year of its piece?
- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says no piece read covers it.
- Does a `Nearest:` line stop at what the piece says, with no step from there to a view?
- Does `Not in the corpus:` name the part of the question that got no answer, in the user's own terms?

## Disagreement and dates

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its person, piece and date.
- Does every claim that depends on its year carry the year?
- Has the reply picked a winner that no piece picked?
- For a post whose date in [sources](sources.md) is marked as a library date: does the reply avoid calling that the year it was written?

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per piece cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in the corpus:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the plan does and then what the person said?
- Does the reply stop at the report? It gives no legal, tax or investment advice of its own and builds nothing.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking the name out of an invented position does not make it anyone's.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites the YC Startup Library. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. Library addresses are case-sensitive. |
| `unlisted-source:` | A sentence cites `(Title)` and no `Source:` line lists that piece. |
| `unsourced-claim:` | A sentence that names a person in the sources table, or uses he, she, his, her or him, or a `Holds:`, `Breaks:`, `Disagrees:`, `Changed:` or `Nearest:` line, that cites no piece. |
| `no-speaker:` | A piece is cited and nobody who speaks in it is named anywhere in the reply. |
| `yc-says:` | A view pinned on the institution: "YC says", "YC's advice", "the partners believe", "according to YC". |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no piece. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | One of the hedge words `--help` lists. The piece says it or it does not. |
| `speculation:` | A named person, he, she, YC or the partners followed by "would", or "he'd", "she'd". |
| `no-silent-line:` | The last line is not `Not in the corpus:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a piece no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in the corpus:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence that names a person, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| "YC says raise as little as you can" (`yc-says:`) | Find who said it. Write the name, the claim and `(Title)` |
| A cited piece and no name anywhere (`no-speaker:`) | Add the speaker from the Who column of the sources table |
| A sentence that begins "Seibel thinks" with no piece (`unsourced-claim:`) | Find the line in a theme file and add `(Title)`. If no line exists, move the point to `Not in the corpus:` |
| A title the gate does not know (`unknown-source:`) | Check the spelling against the sources table. If the piece is not there, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the sources table. Never type one from memory |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that no piece read covers it |
| "Graham would tell you to quit" (`speculation:`) | Write what the essay said, in the past tense, with its year |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A piece cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the sources table |
| The reply ends on a link (`no-silent-line:`) | Add `Not in the corpus:` and the part of the question no piece answers |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is an invention |
| Advice for a seed company given to a company raising a Series A | Say the stage the speaker named, or take the line out |
| A 2006 essay and a 2023 talk written as one view | Split them into two `Changed:` or `Disagrees:` lines with their people and years |
| A famous line everyone attributes to a partner that is in no theme file | Say it is not in the pieces read, and name what was not read |
| The user asks what to do about their own cap table, tax or contract | Report what the pieces say, then say this skill gives no legal, tax or investment advice |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer still reads like general startup advice | The gate matches titles and names, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a piece and never sees the question.

- Whether a cited piece says what the sentence claims.
- Whether the person named is the one who said that line inside a talk with several speakers.
- A position stated as plain fact, with no person's name in the sentence.
- Whether a quote is word for word what the piece says.
- Whether advice for one stage or kind of company was stretched over another.
- Whether two pieces that disagree were merged into one view, or a date was left off.
- Whether the corpus is current. The sources table carries the date it was read.
- Whether the answer is useful, or answers the question that was asked.

Two places in this skill's sources needed a choice. This file uses the more specific:

- The library record for most written posts shows a date in May or June 2020, the day the post was moved into the library. That is not the day it was written, and the page shows no other date. The sources table marks those dates, and a reply never calls one the year the advice was given.
- A talk page lists one author, and the transcript can hold more voices: a co-host, a guest, a question from the audience. The Who column lists the speakers found in the transcript, and a claim goes to the one who said it.

## Hand over

Write `ANSWER.md` beside the saved reply, after the last gate run, for any answer that will be published, quoted to someone else or used to settle a decision.

```md
# Answer: <the question, in the user's words>
Job: <answer | pressure-test | who said that>
Gold: <the example in examples/ this reply started from>
Corpus read: <the date in references/sources.md>
Lines used: <theme file> → <the claim line, pasted> (one per citation)
Gate: <the last line of brain-check.mjs --gate on the reply, pasted>
Candidates: <each candidate line> → <why it stands, or the fix>
Disagreement: <the row in disagreements.md, or "no row">
Stage: <the stage or kind of company each cited line was said about>
Review: <the reviewer's list> → <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is every citation in the reply listed under Lines used, with the line pasted and not retyped?
- Does Not checked say whether the original pages were opened, or only this skill's reading of them?

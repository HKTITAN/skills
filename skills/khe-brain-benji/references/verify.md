---
title: verify
summary: The last pass on a reply. The gate first, then yes or no questions answered from the reply and from the cited lines opened again, never from memory of what he wrote.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question as the user typed it, the cited lines in the theme files opened again, and gate output run after the last edit. Never answer from what you remember him saying. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the cited piece says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`? It checks every citation in the corpus against the sources table.

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The source (first, because nothing after it matters if this is wrong)

- For each sentence that cites a piece: open the theme file, find the line, and read it. Does the line say what the sentence says, with nothing added?
- Is every number in the reply in that line, with the same unit?
- Does the reply say which product, library or kind of work the line is about?
- Is each quote in the reply one of the quotes in the theme files, character for character, and under 15 words?
- A claim from `agentation.com`: is it reported as the product page's practice and not as his sentence alone?
- Is any sentence a position with no "he" in it, written that way to get past the gate? Give it its piece or delete it.

## Silence and scope

- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says he has not written about it.
- Is a rule for faux product UI being used on a real screen, or a line about one app used as a law for all products? Then the reply says so in words, or the line comes out.
- Does a `Nearest:` line stop at what the piece says, with no step from there to a view?
- Does `Not in his writing:` name the part of the question that got no answer, in the user's own terms?
- Was the question about something published after the date in [sources](sources.md)? Then the reply says the corpus was read on that date.

## Disagreement and dates

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its piece.
- Does a claim about what models can or cannot do carry its date?
- Has the reply picked a winner he did not pick?
- Where the order matters: is it clear whether the reply means the order of the articles or the order of the products?

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per piece cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in his writing:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the design does and then what the piece says?
- Does the reply build nothing? A request to make the thing goes to `stageshow` or `khe-ui`, named in the last line.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking the "he" out of an invented position does not make it his.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `benji.org`. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. |
| `unlisted-source:` | A sentence cites `(Title)` and no `Source:` line lists that piece. |
| `unsourced-claim:` | A sentence with "he", "his", "him", "Benji" or "Taylor", or a `Holds:`, `Breaks:`, `Disagrees:`, `Changed:` or `Nearest:` line, that cites no piece. |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no piece. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | One of the hedge words `--help` lists. The piece says it or it does not. |
| `speculation:` | "he would", "Benji would" or "he'd". |
| `no-silent-line:` | The last line is not `Not in his writing:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a piece no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in his writing:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence marked as his, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| A sentence that begins "He thinks" with no piece (`unsourced-claim:`) | Find the line in a theme file and add `(Title)`. If no line exists, move the point to `Not in his writing:` |
| A title the gate does not know (`unknown-source:`) | Check the spelling against the sources table. If the piece is not there, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the sources table. Never type one from memory |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that he has not written about it |
| "He would cut it" (`speculation:`) | Write what he did or wrote, in the past tense, with the product it was about |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A piece cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the sources table |
| The reply ends on a link (`no-silent-line:`) | Add `Not in his writing:` and the part of the question no piece answers |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is an invention |
| A number from a Stageshow file in advice about a real screen | Say it is a rule for faux product UI, or take it out |
| Two pieces that pull apart, written as one view | Split them into two `Disagrees:` lines with their pieces and dates |
| A view everyone attributes to him that is in no theme file | Say it is not in the pieces read and that his social posts were not read |
| The user asks you to build the thing | Stop after the answer. Name `stageshow` for faux product UI or `khe-ui` for an interface |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer still reads like you, not like the pieces | The gate matches titles, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a piece and never sees the question.

- Whether a cited piece says what the sentence claims.
- A position stated as plain fact, with no "he", "his" or "Benji" in the sentence.
- Whether a quote is word for word what the piece says.
- Whether a rule for faux product UI was stretched over a real product.
- Whether two pieces that disagree were merged into one view.
- Whether the corpus is current. The sources table carries the date it was read.
- Whether the answer is useful, or answers the question that was asked.
- A "he" that means someone other than Benji Taylor. Write other people by name or role.

Two places in this skill's sources disagreed. This file uses the more specific:

- The Liveline article says everything beyond the core is opt-in, and its own defaults turn some features on. Replies report the principle and note the defaults; see [disagreements](disagreements.md).
- His site writes dates as day, month, year. The sources table writes them as year, month, day, so they sort. A reply writes a date out in words, as in 8 July 2024.

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
Review: <the reviewer's list> → <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is every citation in the reply listed under Lines used, with the line pasted and not retyped?
- Does Not checked say whether the original pages were opened, or only this skill's reading of them?

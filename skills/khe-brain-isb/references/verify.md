---
title: verify
summary: The last pass on a reply. The gate first, then yes or no questions answered from the reply and from the cited files opened again, never from what you know about the subject.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question as the user typed it, the cited lines in the theme files opened again, and gate output run after the last edit. Never answer from what you know about finance, strategy or any other subject in the notes. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the cited file says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`? It checks every citation in the corpus against the sources table.

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The source (first, because nothing after it matters if this is wrong)

- For each sentence that cites a piece: open the theme file, find the line, and read it. Does the line say what the sentence says, with nothing added?
- Cover the theme files and reread the reply. Is there a step, a factor, a definition or an example that you supplied because you know the framework? Take it out, or find its line.
- Is every number in the reply in that line, with the same unit and the same thing measured?
- Is a number from a worked example reported as an example, and never as a benchmark?
- Does the reply say that the notes name no source for a figure it repeats?
- Is each quote in the reply in a theme file, character for character, and under 15 words?
- Is any sentence a position with no "the notes" in it, written that way to get past the gate? Give it its piece or delete it.

## Whose view

- Does any sentence say that ISB, its faculty or a professor teaches, says or recommends something? No rule file names ISB, a course or a professor. Write "the notes state".
- Where the reply credits a framework to a person, does the cited line say the file names that person? If the theme line says "no author named", the reply names none.
- Does the reply treat the notes as an official ISB document? They are the repository author's summary; [sources](sources.md), Whose words these are.

## Silence and scope

- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says the notes do not cover it.
- Is a benchmark for one kind of business (a SaaS startup, a consumer app, a retailer) being used on another? Then the reply says which kind the file gives it for, or the line comes out.
- Does a `Nearest:` line stop at what the file says, with no step from there to a view?
- Does `Not in the notes:` name the part of the question that got no answer, in the user's own terms?
- Did the question ask about ISB itself (admissions, fees, placements, professors, student life)? Then the answer is silence; the notes hold subject summaries only.
- Did the question ask what to do with money, a job or a company? The reply reports what the notes say and gives no personal advice.

## Disagreement

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its piece.
- Has the reply picked a winner the notes do not pick?
- Do two cited files give different numbers for the same thing? Both numbers are in the reply.

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per piece cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in the notes:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the plan does and then what the file says?
- Does the reply build nothing and decide nothing? A request to make the model, the deck or the plan stops after the answer.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking "the notes" out of a filled-in claim does not put it in a file.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `isb-skills: README.md`. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. |
| `unlisted-source:` | A sentence cites `(Title)` and no `Source:` line lists that piece. |
| `unsourced-claim:` | A sentence with "the notes", "the curriculum", "the repo", "ISB" or "isb-skills", or a `Holds:`, `Breaks:`, `Disagrees:` or `Nearest:` line, that cites no piece. |
| `promoted-source:` | "ISB teaches", "ISB's view", "professors say", "according to ISB". The files are the repository author's summary. |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no piece. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | One of the hedge words `--help` lists. The file says it or it does not. |
| `speculation:` | "ISB would", "the notes would", "a professor would". |
| `no-silent-line:` | The last line is not `Not in the notes:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a piece no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in the notes:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence that speaks for the notes, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. |
| `bare-figure:` | A cited percentage, multiple, ratio, amount or time span, in a reply that never says the notes give no source. | When the number is arithmetic inside a worked example and the reply calls it an example. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| "The notes say" with no piece (`unsourced-claim:`) | Find the line in a theme file and add `(Title)`. If no line exists, move the point to `Not in the notes:` |
| "ISB teaches", "the professor's rule" (`promoted-source:`) | Write "the notes state". Nothing in the rule files names ISB, a course or a professor |
| A title the gate does not know (`unknown-source:`) | Copy the title from the theme line. If the piece is not in the sources table, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the theme line or the sources table. Never type one from memory |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that the notes do not cover it |
| "A professor would push back" (`speculation:`) | Write what the file says, in the present tense, with its piece |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A piece cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the theme line |
| The reply ends on a link (`no-silent-line:`) | Add `Not in the notes:` and the part of the question no file answers |
| A benchmark with nothing said about where it comes from (`bare-figure:`) | Add to the last line that the notes name no source for it |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is a fill-in |
| A sixth step, a fourth factor or a tidy definition that is in no theme line | You wrote it from what you know. Cut it; the gate cannot see this one |
| A SaaS benchmark in an answer about a factory or a shop | Say which kind of business the file gives it for, or take it out |
| Two files with different numbers, written as one | Split them into two `Disagrees:` lines with their pieces |
| A framework credited to a person the theme line does not name | Remove the name. The reply names an author only where the file does |
| The user asks whether to take the job, buy the stock or raise the round | Report what the notes say about the question, then stop. The decision is theirs |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer reads like a textbook, not like the files | The gate matches titles, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a piece and never sees the question.

- Whether a cited piece says what the sentence claims.
- A claim stated as plain fact, with no "the notes", "the curriculum" or "ISB" in the sentence.
- Whether a quote is word for word what the file says.
- Whether a benchmark was moved to an industry, a country or a year the file does not give it for.
- Whether a figure in the notes is true. The notes name no source for their figures.
- Whether a framework credited to a named author is that author's, beyond what the file itself says.
- Whether two files that disagree were merged into one view.
- Whether the corpus is current. The sources table carries the commit and the date it was read.
- Whether the answer is useful, or answers the question that was asked.

## Hand over

Write `ANSWER.md` beside the saved reply, after the last gate run, for any answer that will be published, quoted to someone else or used to settle a decision.

```md
# Answer: <the question, in the user's words>
Job: <answer | pressure-test | who said that>
Gold: <the example in examples/ this reply started from>
Corpus read: <the commit and date in references/sources.md>
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
- Does Not checked say whether the original files were opened, or only this skill's reading of them?

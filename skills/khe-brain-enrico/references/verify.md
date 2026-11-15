---
title: verify
summary: The last pass on a reply. The gate first, then yes or no questions answered from the reply and from the cited lines opened again, never from memory of what he said.
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

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the cited video says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`? It checks every citation in the corpus against the sources table, and every time against its link.

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The source (first, because nothing after it matters if this is wrong)

- For each sentence that cites a video: open the theme file, find the line, and read it. Does the line say what the sentence says, with nothing added?
- Is every number in the reply in that line, with the same unit, and with its date when [disagreements](disagreements.md) lists the figure as one that differs by video?
- Does the title and the time in the reply match the theme file's line, character for character? Titles differ by one capital: `The Ridiculous Engineering of Loading Screens` has a small `of`.
- Is each quote in the reply one of the quotes in the theme files, character for character, and under 15 words?
- Is the line his? A sponsor read is never his position. In `The Ridiculous Engineering Of Figma`, `The Ridiculous Engineering Of Notion` and `Behind The Scenes Of Lovable's Insane Design`, a team member's line is reported as that team's, by role. A line from a clip he plays is the speaker's.
- Is a product fact (a date, a cost, a user count, a test result) reported as what he says in that video, and not as a checked fact about the product? Nobody checked his research against the companies.
- When a line from the cold open comes back later in the video, is the citation to the later place? A line said only in the opening keeps its 0:00.
- Is any sentence a position with no "he" in it, written that way to get past the gate? Give it its video or delete it.

## Silence and scope

- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says the videos read do not cover it.
- Does the reply say which product the line is about? A point he makes about Flask, about Figma or about a chat app is reported as that, never as a rule for every product.
- Does a prediction, a verdict on a new device or a view on AI carry the year he said it? The videos run from 2021 to 2026, and the technology changed under him.
- Is a law or an effect he borrows (Tesler's law, Fitts's law, the goal gradient effect, jobs to be done) reported as his use of someone else's idea, with the name he credits when he gives one?
- Does a `Nearest:` line stop at what the video says, with no step from there to a view?
- Does `Not in his videos:` name the part of the question that got no answer, in the user's own terms?
- Was the question about something said after the date in [sources](sources.md), or in a short video, a post, his newsletter, a product page or a guest appearance? Then the reply says that was not read.

## Disagreement and dates

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its video and date, reported the way the row's last line says.
- Does a figure listed under Figures that differ by video carry the date of the video it came from?
- Is a view he says he changed reported as a change, with the before and the after, and never with the earlier half given as his view today?
- Has the reply picked a winner he did not pick?

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per video cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in his videos:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the design or the plan does and then what the video says?
- Does the reply decide nothing for the user and build nothing? It reports his positions. The call is the user's.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking the "he" out of an invented position does not make it his.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `His channel`. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. A trailing `&t=` time is allowed. |
| `unlisted-source:` | A sentence cites `(Title at m:ss)` and no `Source:` line lists that video. |
| `unsourced-claim:` | A sentence with "he", "his", "him", "Enrico" or "Tartarotti", or a `Holds:`, `Breaks:`, `Disagrees:`, `Changed:`, `Nearest:` or `Also:` line, that cites no video. |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no video. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | One of the hedge words `--help` lists. The video says it or it does not. |
| `speculation:` | "he would", "Enrico would" or "he'd". |
| `no-timestamp:` | A video cited as `(Title)` with no time. Nobody can find one line in a video without one. |
| `no-silent-line:` | The last line is not `Not in his videos:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a video no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in his videos:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence marked as his, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. A sentence that cites `(His channel)` counts as marked, so state silence in the words `not in the videos read`. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| A sentence that begins "He thinks" with no video (`unsourced-claim:`) | Find the line in a theme file and add `(Title at m:ss)`. If no line exists, move the point to `Not in his videos:` |
| A title the gate does not know (`unknown-source:`) | Check the spelling and the capitals against the sources table. If the video is not there, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the sources table. Never type one from memory |
| A citation with no time (`no-timestamp:`) | Copy the time from the theme file's line. If the line has none, it is not a line in the corpus |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that the videos read do not cover it. When his own line carries the hedge, report the claim at the strength the line gives it in other words |
| "He would remove the spinner" (`speculation:`) | Write what he said or did, in the past tense, with the product it was about |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A video cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the sources table |
| The reply ends on a link (`no-silent-line:`) | Add `Not in his videos:` and the part of the question no video answers |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is an invention |
| A point he made about one product, written as a rule for every product | Name the product and the video, or take it out |
| A prediction, a verdict on a gadget or a view on AI with no year | Add the year of the video. [disagreements](disagreements.md) lists the views that moved |
| A product's date, price, user count or test result stated flat | Write that he says it, in which video and in which year. His research was not checked |
| Praise for a sponsor's product | Take it out. A paid segment is not in the theme files and is never his position |
| A line from the Figma, Notion or Lovable videos whose speaker you cannot place | Leave it out. A team member's line with his name on it is the worst fault this skill has |
| Tesler's law or another borrowed law given as his own idea | Say he uses it, and name who he credits |
| Two videos that pull apart, written as one view | Split them into two `Disagrees:` lines with their videos and dates |
| A line everyone attributes to him that is in no theme file | Say it is not in the videos read, and that his short videos, posts and newsletter were not read |
| The user asks what they should do | Give his positions with their videos and stop. Say the decision is theirs |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer still reads like you, not like the videos | The gate matches titles and times, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a video and never sees the question.

- Whether a cited video says what the sentence claims.
- A position stated as plain fact, with no "he", "his" or "Enrico" in the sentence.
- Whether a quote is word for word what he said. The captions are automatic and mishear.
- Whether a line was his, or a team member's, a clip's or part of a sponsor read.
- Whether a point about one product, or a prediction from one year, was stretched into a rule for every product or a view he holds today.
- Whether a product fact he gives is true of the product.
- Whether two videos that disagree were merged into one view.
- Whether the corpus is current. The sources table carries the date it was read.
- Whether the answer is useful, or answers the question that was asked.
- A "he" that means someone other than Enrico Tartarotti. Write other people by name or role.

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
- Does Not checked say whether the videos were opened at their times, or only this skill's reading of the captions?

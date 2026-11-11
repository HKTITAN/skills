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
- Does the time in the reply match the time on the theme file's line?
- Is each quote in the reply one of the quotes in the theme files, character for character, and under 15 words?
- Is the line his? A line by a host, by Achina Mayya or by an audience member is never reported as his.
- A fact from `varunmayya.org`: is it reported as that page's statement and not as his sentence?
- Is any sentence a position with no "he" in it, written that way to get past the gate? Give it its video or delete it.

## Silence and scope

- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says the videos read do not cover it.
- Does the reply say who the line was said to and about? Most talks are to his own employees about Aeos, a bootstrapped media group in Bengaluru. A line about Aeos, about India or about his games studio is reported as that, never as a law for every company.
- Is a line he credits to someone else (Munger, Thiel, McKeown, Keller, Brad Jacobs) reported as his relay of their idea?
- Does a `Nearest:` line stop at what the video says, with no step from there to a view?
- Does `Not in his videos:` name the part of the question that got no answer, in the user's own terms?
- Was the question about something said after the date in [sources](sources.md), or in a post, a short video or a book? Then the reply says that was not read.

## Disagreement and dates

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its video.
- Does a claim about what AI can or cannot do, or a headcount or revenue figure, carry its date? He says in the videos that he changes his mind every few months.
- Has the reply picked a winner he did not pick?

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per video cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in his videos:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the plan does and then what the video says?
- Does the reply decide nothing for the user and build nothing? It reports his positions. The call is the user's.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking the "he" out of an invented position does not make it his.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `Kata playlist`. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. A trailing `&t=` time is allowed. |
| `unlisted-source:` | A sentence cites `(Title at m:ss)` and no `Source:` line lists that video. |
| `unsourced-claim:` | A sentence with "he", "his", "him", "Varun" or "Mayya", or a `Holds:`, `Breaks:`, `Disagrees:`, `Changed:` or `Nearest:` line, that cites no video. |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no video. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | One of the hedge words `--help` lists. The video says it or it does not. |
| `speculation:` | "he would", "Varun would" or "he'd". |
| `no-timestamp:` | A video cited as `(Title)` with no time. Nobody can find a line in a one-hour video without one. |
| `no-silent-line:` | The last line is not `Not in his videos:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a video no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in his videos:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence marked as his, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| A sentence that begins "He thinks" with no video (`unsourced-claim:`) | Find the line in a theme file and add `(Title at m:ss)`. If no line exists, move the point to `Not in his videos:` |
| A title the gate does not know (`unknown-source:`) | Check the spelling against the sources table. If the video is not there, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the sources table. Never type one from memory |
| A citation with no time (`no-timestamp:`) | Copy the time from the theme file's line. If the line has none, it is not a line in the corpus |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that the videos read do not cover it |
| "He would fire them" (`speculation:`) | Write what he said or did, in the past tense, with the company it was about |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A video cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the sources table |
| The reply ends on a link (`no-silent-line:`) | Add `Not in his videos:` and the part of the question no video answers |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is an invention |
| A rule he gave his own employees, written as a rule for every company | Say who it was said to and about which company, or take it out |
| A headcount, a view count or a revenue figure with no date | Add the video's date. [disagreements](disagreements.md) lists the figures that differ |
| Two videos that pull apart, written as one view | Split them into two `Disagrees:` lines with their videos and dates |
| A line everyone attributes to him that is in no theme file | Say it is not in the videos read, and that his posts, short videos and books were not read |
| A line from a podcast whose speaker you cannot place | Leave it out. A host's line with his name on it is the worst fault this skill has |
| The user asks what they should do | Give his positions with their videos and stop. Say the decision is theirs |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer still reads like you, not like the videos | The gate matches titles and times, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a video and never sees the question.

- Whether a cited video says what the sentence claims.
- A position stated as plain fact, with no "he", "his" or "Varun" in the sentence.
- Whether a quote is word for word what he said. The captions are automatic and mishear.
- Whether a line was his, or a host's, a guest's or Achina Mayya's.
- Whether a line said to his own employees, or about Aeos, was stretched into a rule for everyone.
- Whether two videos that disagree were merged into one view.
- Whether the corpus is current. The sources table carries the date it was read.
- Whether the answer is useful, or answers the question that was asked.
- A "he" that means someone other than Varun Mayya. Write other people by name or role.

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

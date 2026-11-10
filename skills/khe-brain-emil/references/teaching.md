---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds eleven pairs. Each folder is named for the gate line its `bad` file raises, and holds the same reply twice with one thing wrong in `bad`. The first line of every `bad` file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every `bad` raises the line its folder is named for and no other never-intentional line, and that every `good` raises none.

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-claim` | The second sentence: a stagger delay in his name, no marker | Say he has not written about it. A number with his name and no article gets repeated as his. |
| `teaching/hedge` | "would probably" in front of a published rule | State the published rule with its marker, then the step to this case as `My reading:`. A hedge hides which of the two the sentence is. |
| `teaching/dangling-marker` | `[2]` in the answer and one `Source:` line | Add the second article. A marker with nothing behind it looks sourced and is not. |

## The source

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A marker and no `Source:` line at all | One `Source:` line per article cited. Without it the reader cannot open the article. |
| `teaching/unknown-source` | A title that fits the claim and does not exist | Copy the title from the sources table. A plausible title is the commonest invention. |
| `teaching/wrong-url` | A real title beside another article's URL | Title and URL are copied together, from one row. |
| `teaching/off-corpus-url` | One of his skills on a `Source:` line | Name the skill in the text. Only an article is a source, because only an article is his published position. |

## The quotation

| Failure | Look at | Correction |
|---|---|---|
| `teaching/long-quote` | Twenty words in quotation marks | Paraphrase and keep the marker. A long quotation is either a reprint or a paraphrase wearing quotation marks. |
| `teaching/unknown-quote` | A line that sounds like him and is not in the list | Use one of the six, or paraphrase. A fabricated quotation outlives every correction. |

## Disagreement and silence

| Failure | Look at | Correction |
|---|---|---|
| `teaching/one-sided-conflict` | A `Conflict:` line with one marker | Both articles on the line, and the third where he explains the gap. One side of a disagreement is just a claim. |
| `teaching/no-silence-line` | A reply that stops at its sources | End with `Not in his writing:`. The reader needs to know where his writing stops and their own judgment starts. |

## Lines with no pair

`no-answer:`, `bad-source-line:` and every candidate line have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).

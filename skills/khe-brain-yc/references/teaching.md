---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds thirteen pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a claim inside a bad half is never evidence of what anyone said. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line, and that every good file raises none.

## Who said it

| Failure | Look at | Correction |
|---|---|---|
| `teaching/yc-says` | "YC says" at the head of the sentence | Name the person and the piece. Y Combinator is many people over twenty years, and they do not all agree. |
| `teaching/no-speaker` | A cited figure with no name anywhere | Say who gave it. A figure with no speaker reads as a fact, and the reader cannot weigh it. |
| `teaching/unsourced-claim` | The second sentence, a view with a name and no piece | Cite the line that carries it, or cut it. A view nobody can look up is the writer's view with a partner's name on it. |
| `teaching/speculation` | "Paul Graham would call" | Report what the essay said, with its year. The corpus records what was written, not what its author has yet to be asked. |

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/hedge` | "probably" in front of a cited claim | Say what the piece says. A hedge tells the reader the writer did not open the line. |
| `teaching/unknown-source` | A podcast cited as a source | Only pieces in the sources table count. Say the podcast was not read and answer from what was. |

## The quote

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-quote` | A sentence in quotation marks with no piece beside it | Quotation marks mean a speaker's words. Put a pasted line in backticks and say whether it is in the pieces read. |
| `teaching/long-quote` | Twenty quoted words | Quote fewer than 15 words and paraphrase the rest. Give the first words of a pasted line in backticks. |

## The sources

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A piece named in the sentence and nothing below | One `Source:` line per piece, with its URL. The reader follows the link, not the name. |
| `teaching/unlisted-source` | Two pieces cited, one listed | Every piece a sentence cites gets its own `Source:` line. |
| `teaching/wrong-url` | A link that stops one word short | Copy the URL from the sources table. A near miss is a dead page, and library addresses are case-sensitive. |

## The shape

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-answer` | The first line, a link | The answer first. The reader decides from one sentence whether to read on. |
| `teaching/no-silent-line` | The last line, a link | End with `Not in the corpus:`. It is the line that stops a partial answer being read as a complete one. |

## Lines with no pair

`long-answer:`, `unused-source:`, `too-many-quotes:`, `nothing-left-out:` and `silent-topic:` are candidate lines and have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).

## What a pair cannot show

A pair shows a fault the gate can read. The three worst faults in this skill are ones it cannot: a sentence that cites a real piece and says more than the piece does, a line given to the wrong one of two speakers, and advice for one stage handed to a company at another. For those, use the first question in [review](review.md).

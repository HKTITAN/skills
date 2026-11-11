---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds twelve pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a claim inside a bad half is never evidence of what he said. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line, and that every good file raises none.

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-claim` | The second sentence, a view with no video | Cite the line that carries it, or cut it. A view nobody can look up is the writer's view with his name on it. |
| `teaching/speculation` | "He would spend" | Report what he does, with the figure he gave. The corpus records what he said, not what he has yet to face. |
| `teaching/hedge` | "probably" in front of a cited claim | Say what the video says. A hedge tells the reader the writer did not open the line. |
| `teaching/unknown-source` | A reel cited as a source | Only videos in the sources table count. Say reels were not read and answer from what was. |

## The quote

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-quote` | A line in quotation marks with no source beside it | Quotation marks mean his words as the captions give them. Put a pasted line in backticks and say whether it is in the videos read. |
| `teaching/long-quote` | Twenty-one quoted words | Quote fewer than 15 words and paraphrase the rest. Give the first words of a pasted line in backticks. |

## The sources

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A video named in the sentence and nothing below | One `Source:` line per video, with its URL. The reader follows the link, not the name. |
| `teaching/unlisted-source` | Two videos cited, one listed | Every video a sentence cites gets its own `Source:` line. |
| `teaching/wrong-url` | A link one character short | Copy the URL from the sources table. A near miss is a missing video. |
| `teaching/no-timestamp` | `(Kata 10)` with no time | Add the time from the theme file's line. A talk runs 30 to 80 minutes, and a citation without a time cannot be checked. |

## The shape

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-answer` | The first line, a link | The answer first. The reader decides from one sentence whether to read on. |
| `teaching/no-silent-line` | The last line, a link | End with `Not in his videos:`. It is the line that stops a partial answer being read as a complete one. |

## Lines with no pair

`long-answer:`, `unused-source:`, `too-many-quotes:`, `nothing-left-out:` and `silent-topic:` are candidate lines and have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).

## What a pair cannot show

A pair shows a fault the gate can read. The two worst faults in this skill are ones it cannot: a sentence that cites a real video and says more than he said there, and a line spoken by a host or by Achina Mayya reported as his. For both, use the first question in [review](review.md), and open the link at its time.

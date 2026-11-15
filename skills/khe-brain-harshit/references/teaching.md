---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds seventeen pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a claim inside a bad half is never evidence of what he posted. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line, and that every good file raises none.

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-claim` | The second sentence, a view with no post | Cite the line that carries it, or cut it. A view nobody can look up is the writer's view with his name on it. |
| `teaching/speculation` | "He would ship" | Report what he posted, with its date. The corpus records what he said, not what he has yet to face. |
| `teaching/hedge` | "probably" in front of a cited claim | Say what the post says. A hedge tells the reader the writer did not open the line. |
| `teaching/unknown-source` | A post cited by a name that is not in the table | Only posts in the sources table count. Copy the name from the table, or say the post is not in the corpus. |

## The quote

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-quote` | A sentence in quotation marks with no post beside it | Quotation marks mean his words. Put a pasted line in backticks and say whether it is in the posts read. |
| `teaching/long-quote` | Twenty quoted words | Quote fewer than 15 words and paraphrase the rest. Give the first words of a pasted line in backticks. |

## The sources

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A post named in the sentence and nothing below | One `Source:` line per post, with its URL. The reader follows the link, not the name. |
| `teaching/unlisted-source` | Two posts cited, one listed | Every post a sentence cites gets its own `Source:` line. |
| `teaching/wrong-url` | A link that stops one word short | Copy the URL from the sources table. A near miss is a dead page. |

## The shape

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-answer` | The first line, a link | The answer first. The reader decides from one sentence whether to read on. |
| `teaching/no-silent-line` | The last line, a link | End with `Not in his posts:`. It is the line that stops a partial answer being read as a complete one. |

## The draft

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-rests-on` | A draft with sources and no `Rests on:` line | Name each position the draft takes, with its post. The draft itself carries no citations, so these lines are the only proof. |
| `teaching/draft-hashtag` | A hashtag on the last line | Cut it. None of his long posts since June 2025 carries one. |
| `teaching/draft-emoji` | An emoji on several lines | One at most, and usually none. That density is his 2022 style. |
| `teaching/draft-em-dash` | A dash between two clauses | A full stop and a new line. One idea per line. |
| `teaching/draft-sentence-case` | Every line starting with a capital | Lowercase, with capitals kept for names. |
| `teaching/no-draft` | `Draft:` with nothing under it | Write the post, or answer as an answer. |

## Lines with no pair

`long-answer:`, `unused-source:`, `too-many-quotes:`, `nothing-left-out:`, `draft-long-paragraph:` and `silent-topic:` are candidate lines and have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).

## What a pair cannot show

A pair shows a fault the gate can read. The worst fault in this skill is one it cannot: a sentence or a draft line that rests on a real post and says more than the post does. For that, use the first question in [review](review.md).

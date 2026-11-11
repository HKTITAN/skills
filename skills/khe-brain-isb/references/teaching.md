---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds twelve pairs. Each folder is named for the gate line its `bad.txt` raises, and holds the same reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault. All twelve use one small claim, the order of financing in the pecking order file, so the fault is the only thing that changes.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a claim inside a bad half is never evidence of what the notes say. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every bad file raises the line its folder is named for and no other never-intentional line, and that every good file raises none.

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-claim` | The second sentence, "The notes also say", with no piece | Cite the file that carries it, or cut it. A claim nobody can look up is the writer's claim with the notes' name on it. |
| `teaching/promoted-source` | "ISB teaches" | Write "the notes state". No rule file names ISB, a course or a professor, so the school's name adds an authority the files do not have. |
| `teaching/speculation` | "A professor would tell" | Report what the file says, in the present tense. The notes record what they state, never what a person would say. |
| `teaching/hedge` | "probably" in front of a cited claim | Say what the file says. A hedge tells the reader the writer did not open it. |
| `teaching/unknown-source` | A lecture cited as a source | Only pieces in the sources table count. Say the lecture is not in the notes and answer from a file that is. |

## The quote

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-quote` | A sentence in quotation marks with no piece beside it | Quotation marks mean the notes' words. Put a line the user pasted in backticks and say the notes do not say it. |
| `teaching/long-quote` | Twenty quoted words | Quote fewer than 15 words and paraphrase the rest. Give the first words of a pasted line in backticks. |

## The sources

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A piece named in the sentence and nothing below | One `Source:` line per piece, with its URL. The reader follows the link, not the name. |
| `teaching/unlisted-source` | Two pieces cited, one listed | Every piece a sentence cites gets its own `Source:` line. |
| `teaching/wrong-url` | A link that stops one word short | Copy the URL from the theme line. A near miss is a missing page. |

## The shape

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-answer` | The first line, a link | The answer first. The reader decides from one sentence whether to read on. |
| `teaching/no-silent-line` | The last line, a link | End with `Not in the notes:`. It is the line that stops a partial answer being read as a complete one. |

## Lines with no pair

`long-answer:`, `unused-source:`, `too-many-quotes:`, `nothing-left-out:`, `silent-topic:` and `bare-figure:` are candidate lines and have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).

## What a pair cannot show

A pair shows a fault the gate can read. The worst fault in this skill is one it cannot: a sentence that cites a real file and says more than the file does, because the writer knows the framework and the file is four lines long. For that, use the first question in [review](review.md).

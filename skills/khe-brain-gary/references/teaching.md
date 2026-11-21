---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds sixteen pairs. Each folder is named for the gate line its `bad.txt` raises (a second pair for one line takes the line's name and a suffix, as `long-quote-single` does), and holds a reply twice with one thing wrong in `bad.txt`. The first line of every bad file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points, and a claim inside a bad half is never evidence of what he said. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/brain-check.mjs --self-test` checks that every bad file raises the line its folder is named for (with any suffix removed) and no other never-intentional line, and that every good file raises none.

## The claim

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-claim` | The second sentence, a view with no piece | Cite the line that carries it, or cut it. A view nobody can look up is the writer's view with his name on it. |
| `teaching/speculation` | "He would tell any small shop" | Report what he told small owners in 2014, with the article. The corpus records what he said and did, not what he has yet to face. |
| `teaching/hedge` | "probably" in front of a cited claim | Say what the piece says. A hedge tells the reader the writer did not open the line. |
| `teaching/undated-call` | A TikTok line with no year | Put the year in the sentence. His reach, platform and market calls belong to the year he said them, and a line without its year reads as a rule. |
| `teaching/unknown-source` | A short video cited as a source | Only pieces in the sources table count. Say short videos were not read and answer from what was. |

## The quote

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-quote` | A line in quotation marks with no source beside it | Quotation marks mean his words as the captions or the article give them. Put a pasted line in backticks and say whether it is in the pieces read. |
| `teaching/long-quote` | Twenty quoted words | Quote fewer than 15 words and paraphrase the rest. Give the first words of a pasted line in backticks. |
| `teaching/long-quote-single` | A pasted sentence of 21 words in single quotes, with a contraction inside it | A contraction does not end a single-quoted span, so the span counts in full. Quote fewer than 15 words, or give the first words of the line in backticks. |

## The sources

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-source` | A video named in the sentence and nothing below | One `Source:` line per piece, with its URL. The reader follows the link, not the name. |
| `teaching/unlisted-source` | Two pieces cited, one listed | Every piece a sentence cites gets its own `Source:` line. |
| `teaching/wrong-url` | A link one character short | Copy the URL from the sources table. A near miss is a missing video. |
| `teaching/no-timestamp` | A video title in brackets with no time | Add the time from the theme file's line. The videos run to hours, and a citation without a time cannot be checked. An article is cited by its title alone. |
| `teaching/article-time` | An article title in brackets with a time after it | Cite an article by its title alone. A time on an article points nowhere and makes the citation look more exact than it is. |
| `teaching/time-past-length` | A video cited at 1:05:00 when it runs 36 minutes | Copy the time from the theme file's line, and check it against the Length in the sources table. A time past the end is not a place in the video. |

## The shape

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-answer` | The first line, a link | The answer first. The reader decides from one sentence whether to read on. |
| `teaching/no-silent-line` | The last line, a link | End with `Not in the corpus:`. It is the line that stops a partial answer being read as a complete one. |

## Lines with no pair

`long-answer:`, `unused-source:`, `too-many-quotes:`, `nothing-left-out:`, `silent-topic:` and `url-time-mismatch:` are candidate lines and have no folder. The self-test proves each of them on the smallest text that raises them. Their meanings are in [verify](verify.md).

## What a pair cannot show

A pair shows a fault the gate can read. The worst faults in this skill are ones it cannot: a sentence that cites a real piece and says more than he said there, a line from a host, a guest, a caller or a sponsor read reported as his, an article written by his team reported as his sentence, a pitch for his own product given as fact, and a platform or a figure whose year is wrong or whose word the gate does not list. For all of these, use the first question in [review](review.md), and open the link at its time.

---
title: verify
summary: The last pass on a reply or a draft. The gate first, then yes or no questions answered from the reply and from the cited lines opened again, never from memory of what he posted.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question or brief as the user typed it, the cited lines in the theme files opened again, and gate output run after the last edit. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0. It does not mean the cited post says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`?

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look.

## The source (first, because nothing after it matters if this is wrong)

- For each citation: open the theme file, find the line, and read it. Does the sentence, or the `Rests on:` line, say what the line says, with nothing added?
- Is every number in the reply in that line, with its date? A player count or a user count changes from post to post.
- Is each quote one of the quotes in the theme files, character for character, and under 15 words?
- Is the line his? A line he relayed from Greg Isenberg, Dan Shipper, Tim Sweeney, Rishitabh Thapliyal or anyone else is reported as his relay of their idea.
- Is any sentence a position with no "he" in it, written that way to get past the gate? Give it its post or delete it.

## Silence and scope

- Open [silent](silent.md). Is the topic in the table? Then an answer says his posts do not take a position on it, and a draft stops and asks him.
- Does the reply say what a line was about: Smash&Clash, Campus Binge, one tool, a reply to one person? A line about one of them is never a law for everything.
- Campus Binge: is he described as leading Product & Design, and never as its founder?
- Does a `Nearest:` line stop at what the post says?

## Dates

- Open [disagreements](disagreements.md). Does the question touch a row? An answer gives both sides with dates; a draft takes the later one.
- Does every line from before June 2025 carry its year?

## The draft (only for a draft)

- Does every position the draft takes appear on a `Rests on:` line with its post? Read the draft line by line and point at the `Rests on:` line for each claim. A line with no `Rests on:` behind it is either a fact everyone knows, a step of the argument, or an invention. Cut the invention.
- Does the draft read like [voice](voice.md): a plain hook that states the claim, one idea a line, a story from his own work, a short closing line? Does anything in it read like his 2022 to 2024 posts: emoji on several lines, hashtags, "Thread Alert!", "thoughts? 👇"?
- Does any run of eight words or more match one of his posts? Rewrite it. A draft copies the shape, never the sentence.
- Does the draft use anything private: money, a deck number, his college by name, the token, a DM? Cut it.

## The reply (last)

- An answer: does it come first, in two or three sentences? A draft: is `Draft:` alone on the first line?
- Is there one `Source:` line per post cited, exactly as the sources table has it, and is each one used?
- Is the last line `Not in his posts:`?
- Does the reply decide nothing for the user and publish nothing? A draft is his to post.

## Lines that are never intentional

| Line | What it means |
|---|---|
| `no-answer:` | An answer opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `post archive`. |
| `unknown-source:` | A `Source:` line whose name is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or not the one in the sources table. |
| `unlisted-source:` | A sentence cites `(post)` and no `Source:` line lists it. |
| `unsourced-claim:` | A sentence with "he", "his", "him", "Harshit" or "Khemani", or a labelled line, that cites no post. |
| `unsourced-quote:` | A quoted span of four words or more in a sentence that cites no post. |
| `long-quote:` | A quoted span of 15 words or more. |
| `hedge:` | A hedge word outside a draft. The post says it or it does not. |
| `speculation:` | "he would", "Harshit would" or "he'd". |
| `no-silent-line:` | The last line is not `Not in his posts:`. |
| `no-draft:` | `Draft:` with no draft under it. |
| `no-rests-on:` | A draft with no `Rests on:` line. |
| `draft-hashtag:` | A hashtag in a draft. |
| `draft-emoji:` | More than one emoji in a draft. |
| `draft-em-dash:` | An em dash in a draft. |
| `draft-sentence-case:` | More than half the draft's lines start with a capital. |

## Candidate lines

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer runs past three sentences. | When the question had two parts. |
| `unused-source:` | A `Source:` line no sentence cites. | Never. |
| `too-many-quotes:` | More than two quotes. | Only for a "who said that" about several lines. |
| `nothing-left-out:` | `Not in his posts:` claims nothing was left out. | Almost never. |
| `draft-long-paragraph:` | A draft paragraph over 60 words. | When it is a numbered item that needs its example. |
| `silent-topic:` | A sentence marked as his uses a word from the silent table. | When the cited line really is about that word. |

## Not checked by the gate

- Whether a cited post says what the sentence claims.
- Whether a draft takes a position its `Rests on:` lines do not carry.
- Whether a draft copies one of his sentences.
- Whether a line was his or one he relayed.
- Whether a line about one product was stretched into a rule.
- Whether the corpus is current. The sources table carries the date of the export.

---
title: verify
summary: The last pass on an answer. The gate first, then yes/no questions answered from the reply and the reference lines open beside it, never from memory of the articles.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question as the user typed it, the reference lines you cited, and gate output you ran after the last edit. Never answer from what you remember of the articles. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the articles say what the reply says.
- After editing an example, the second command ends `brain-check passed`?
- After editing a reference, a pair or the gate, the third command ends `self-test passed`?

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The claims (first, because a wrong claim in his name is the worst fault)

- For each `[n]` sentence: open the reference file, find the claim line, and read it beside your sentence. Do they say the same thing?
- Is the title on that claim line the title on your `Source: [n]` line?
- Did your sentence add a number, a product name or a reason that the claim line does not have?
- Does a number in the reply carry its scope? A value from Sonner or Vaul is called Sonner's or Vaul's.
- Is there a sentence about him that came from somewhere other than `references/`? Delete it.
- Cover the `Source:` lines. Could you still tell which sentences are his, which are yours and which are silence?

## Disagreements and silence

- Did you open [disagreements](disagreements.md) for this question? Is the topic there?
- If it is: does the reply have a `Conflict:` line with both articles, and every number unaveraged?
- Did you open [silent](silent.md)? If the topic is there, does the first sentence say he has not written about it?
- Is every step from his published line to the user's exact case marked `My reading:`?
- Does the `Not in his writing:` line name something the user needed and did not get?

## The quotation

- Is there one quotation at most?
- Is it one of the six in [quotes](quotes.md), character for character?
- Does it sit in a sentence that carries its marker?
- Are all other double quotation marks gone from the reply?

## The reply (last)

- Is the answer first, in two or three sentences, with a test's findings one per line?
- Did the reply change, write or review any code? Then it is the wrong skill's reply.
- When the job belongs elsewhere: is the skill named in backticks, with its author when it is not a `khe-` skill?
- Is anything said that the user did not ask about?

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by hiding what it points at is a bug: adding a `[1]` to an invented sentence clears `unsourced-claim:` and leaves an invented claim with a real article's name on it, which is worse than the fault the gate found.

| Line | What it means |
|---|---|
| `no-answer:` | Nothing comes before the first labeled line. |
| `no-source:` | The reply has no `Source:` line. A silent reply says `Source: none`. |
| `bad-source-line:` | A `Source:` line that is neither `[n] Title, URL` nor `none`, or `none` beside a cited source. |
| `unknown-source:` | A title that is not in [sources](sources.md). |
| `wrong-url:` | A real title beside a URL that is not that article's. |
| `off-corpus-url:` | A URL that is not a page in [sources](sources.md): a skill, a repo, a tweet, a talk, a course page. |
| `unsourced-claim:` | A sentence in the answer with no `[n]`, not after `My reading:`, and not a statement of silence. |
| `dangling-marker:` | A `[n]` with no `Source: [n]` line. |
| `one-sided-conflict:` | A `Conflict:` line that cites fewer than two different sources. |
| `long-quote:` | 15 words or more inside double quotation marks. |
| `unknown-quote:` | Three or more words in double quotation marks that are not in [quotes](quotes.md). |
| `hedge:` | A hedge word: probably, presumably, likely, perhaps, maybe, might, arguably, "I think", "I believe", "I guess", "I suspect", "it seems", "seems to", "sort of", "kind of", and the three words this collection never writes. |
| `no-silence-line:` | The last line is not `Not in his writing:` followed by what the articles leave out. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `unused-source:` | A `Source:` line no marker points at. | Never. Cite it or remove it. |
| `long-answer:` | More than three sentences before the first list line. | When the question had two parts and each got its own sourced sentence. |
| `nothing-left-out:` | The last line claims nothing was left out. | Almost never. The articles are thirteen; the question is rarely inside one. |
| `many-quotes:` | More than one quotation. | Only for "who said that" about two different lines. |
| `code-block:` | A fenced block in the reply. | When the block is a value he published, such as one CSS declaration, and nothing was written for the user. |

## What you see, what you do

| You see | You do |
|---|---|
| A sentence that starts "Emil would" with no marker (`unsourced-claim:`) | Find its claim line. Found: add the marker and the `Source:` line. Not found: it is silence, or `My reading:` |
| A title you typed from memory (`unknown-source:`) | Copy the title and URL from [sources](sources.md). If the article is not there, the claim is not his |
| One of his skills on a `Source:` line (`off-corpus-url:`) | Move the skill's name into the text in backticks. Cite the article that states the rule, or say he is silent |
| The reply ends at its sources (`no-silence-line:`) | Last line: `Not in his writing:` and the nearest thing the articles do not cover |
| "Probably", "likely", "I think he" (`hedge:`) | Decide which of the three kinds the sentence is, and write it as that kind |
| A long passage in quotation marks (`long-quote:`) | Paraphrase it and keep the marker |
| A good line in quotation marks that is not in the list (`unknown-quote:`) | Remove the marks and paraphrase. The list stays at six |
| `Conflict:` with one marker (`one-sided-conflict:`) | Open [disagreements](disagreements.md) and add the other article |
| Two of his numbers and you want to give one | Give both on a `Conflict:` line. Your pick is `My reading:` |
| The question is about a topic in [silent](silent.md) | First sentence: he has not written about it. Name the skill that owns the job |
| The claim line says less than your sentence | Cut the sentence back to the claim line. The extra part is yours |
| The user asked you to fix their component | One sourced line, then the owning skill and its author. No code |
| The article seems to have changed since the date in [sources](sources.md) | Read it again, fix the claim line and the Read date, and add a line to [gotchas](gotchas.md) |
| The gate passes and the answer still feels like yours | The gate never read the article. Ask the first question in [review](review.md) |
| The same claim reported wrong a second time | One line in [gotchas](gotchas.md), then fix the claim line that led there |
| Ten gate runs, gate green, nothing changing | Stop. Fresh eye, by [review](review.md) |

## Not checked by the gate

The gate reads the reply and the list of titles. It never reads an article and never sees the question.

- Whether the cited article says what the sentence says.
- Whether a paraphrase is fair, or bends the claim.
- Whether a `My reading:` sentence is a sound inference.
- Whether a topic called silent is silent.
- Whether a disagreement was left out.
- Whether a number matches the number in the reference.
- Whether the reply answers the question that was asked.
- Whether an article changed after the date it was read.

Two places in this skill's files differ. This file uses the more specific:

- SKILL.md says "at most one quotation a reply". The gate treats a second quotation as a candidate (`many-quotes:`), because a "who said that" about two lines needs two. Every other reply keeps to one.
- [sources](sources.md) lists fourteen pages and the skill says thirteen articles. Row 14 is an index page. It can be cited for which skills exist and never for a design position.

## Hand over

Write `ANSWER.md` beside the saved reply, after the last gate run.

```md
# Answer: <the question, in the user's words>
Mode: <question | test | who said | topics>
Gold: <the example in examples/ this reply started from>
Claim lines: <reference file> → <the claim line, pasted> (one per [n])
Disagreements checked: <the entry in disagreements.md, or "none on this topic">
Silent checked: <the row in silent.md, or "not listed">
Gate: <the last line of brain-check.mjs --gate on the reply, pasted>
Candidates: <each candidate line> → <why it stands, or the fix>
Review: <the reviewer's list> → <your response>
Readings: <each "My reading:" sentence, and what it rests on>
Not checked: <what the reply's last line says, and whether the live article was opened>
```

- Is every `[n]` in the reply listed under Claim lines with the line it came from?
- Does Not checked say what the reply's last line says?

---
title: verify
summary: The last pass on a council reply. The gate first, then yes or no questions answered from the reply and the seat blocks opened again, every gate line, what the gate cannot see, and the COUNCIL.md template for a reviewed decision.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the decision as the person typed it, the seats listing run in this session, and gate output from after the last edit. Never answer from what you remember a seat saying. Each answer names the line you looked at. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/decision-check.mjs {reply.txt} --gate
node scripts/decision-check.mjs examples --gate
node scripts/decision-check.mjs --self-test
```

- The first command ends `decision-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean a cited piece says what the sentence claims.
- After editing a gold reply, the second ends `decision-check passed`?
- After editing a teaching pair or the gate, the third ends `decision-check self-test passed`? With no brain installed it reports the `seat-format` pair as skipped and still passes, with the count of skipped.

Exit 0 is a pass. Exit 1 is `decision-check failed: {n} fault(s)`. Exit 2 is `inconclusive`: the gate found no file to read, and nothing is verified. `--strict` also fails on the candidate lines. `--brains {dir}` adds a folder of brains, the same way as for `--seats`.

## The seats (first, because the chair can only be as true as its seats)

1. Does the `Council:` line name every brain on the `--seats` listing from this session, each one seated or left out with a reason? Count both.
2. For each left-out brain: does its `silent.md` list the subject, or does its description not touch it? Name the row or the sentence.
3. For each seated brain: which sentence of its description, or which theme file, covers the decision?
4. Is each seat block the seat's reply character for character, with its own `Source:` lines and its own last line? Compare it with what the seat returned.
5. Did each seat return its brain's gate line, and does it say passed? Paste each.
6. Did any seat see another seat's reply, another brain or the chair? If the seats ran in one context, does `Not verified:` say so?
7. Which seats spoke, by name? A reply that opens with silence and offers only `Nearest:` lines did not.
8. Does every seat block stay inside every limit of its own brain's Output format (line caps, quote caps), including after a cross-check? Count the `Also:` lines and the quotes in each block against that brain's format.

## The chair

1. For each chair citation: find its text inside that seat's block. Which line holds it, and is that line a cited line of the seat, not one labelled `Nearest:`, `My reading:` or `Yours:`? The gate cannot tell, because a title on a `Source:` line satisfies it.
2. For each `Agree:` line: cover the line, read the two cited seat sentences, and write in a few words what each supports. Does the line say that, and no more?
3. For each `Disagree:` line: are both sides there with a citation from two different seats, is the `Why:` a reason the two cited lines show, and is no winner picked?
4. Was each seat cross-checked once, for all its points together, and is each answer inside that seat's block as that brain's own line?
5. Take out every sentence with a chair citation. Is anything left, outside the recommendation, that reads as a person's view?
6. Does any sentence outside the seat blocks say what someone "would", "might" or "will" say, think or do, or that someone "thinks you should"?
7. Does `Not covered:` name the part of the decision no cited line answers, in the person's terms?

## The recommendation

1. Does the line start `Recommendation (khe-decision's synthesis, not the view of anyone cited):`, character for character?
2. Is it two to four sentences, with no person and no institution named?
3. Is every fact it leans on already on an `Agree:` or `Disagree:` line above it?
4. Does `Rests on:` hold at least one chair citation, each one found in its seat's block?
5. If fewer than two seats spoke: is the line `withheld`, with the reason?
6. Does `Would change it:` name one fact about the person's own case?
7. Does the reply say anywhere that the decision is made, or tell the person what they "must" do? It never does.
8. Are the last two lines `Not verified:` and the reading line, with nothing after?

## Lines that are never intentional

Fix the cause and run the gate again. `--gate` ends `decision-check passed` only when all are at 0. Clearing a line by rewording a sentence so the gate cannot see it, when the claim is still uncited, is a bug: taking the name out of an invented position does not give it a source.

| Line | Means | Do |
|---|---|---|
| `no-decision` | The first line that is not a comment is not `Decision:` | Put the decision first, as one question |
| `no-council-line` | No `Council:` line, a seat block's brain is not named on it as seated, or its count is not the number of seat blocks | Name every installed brain, seated or left out, and make N the number of seat blocks |
| `too-few-seats` | Fewer than two seat blocks, and the reply is not in the not-convened form | Use the not-convened form, or seat a second relevant brain if one exists |
| `seat-format` | A seat block fails its own brain's gate; that gate's lines are printed under it, indented | Send the block back to its seat with those lines |
| `seat-uncited` | A seat block with no `Source:` line, or a sentence with no citation marker that is not a `Source:`, `Not in`, `Nearest:`, `Yours:` or `My reading:` line | Send it back to its seat; an uncited seat sentence is an invented one |
| `no-chair` | No `== Chair ==` block | Run the chair |
| `unlabelled-synthesis` | The recommendation lacks the full label, or a line starts `Recommendation:` or `Verdict:` | Use the label, character for character |
| `no-rests-on` | No `Rests on:` line with a chair citation, and the recommendation is not withheld | Cite what the call leans on, or withhold it |
| `chair-citation` | A chair citation names a seat that is not in this reply, or text that is not in that seat's block | Copy the text from the block; if it is not there, the claim goes |
| `uncited-chair-claim` | An `Agree:` or `Disagree:` line with no chair citation, with citations from fewer than two seats, or a `Disagree:` with no `Why:` | Add the second seat's citation, or move the point out of the line |
| `ventriloquist` | Outside the seat blocks: a name or pronoun with "would", "might" or "will" and a verb of saying, thinking or choosing; "{name} thinks you should"; "the council recommends" | Write what the published material suggests, with its chair citation |
| `named-without-citation` | A chair sentence names a seated person or institution and carries no chair citation | Put the citation in that sentence, or take the name out |
| `no-would-change` | No `Would change it:` line | Name the fact that flips the call |
| `no-not-verified` | No `Not verified:` line | Say what nobody checked |
| `no-reading-line` | The last line does not say nobody cited wrote or endorsed the reply | End with the reading line from the Output format |
| `not-convened-form` | A `Council: not convened` reply that has a seat or chair block or a recommendation, or lacks `Not covered:`, `Next:` or `Not verified:` | Keep the five lines of the not-convened form and no others |

## Candidate lines

Reported for judgment. `--strict` fails on these too.

| Line | Means | When it stands |
|---|---|---|
| `seat-unchecked` | The brain or its gate is not installed here, so the block got only the generic check | When the seat ran on another machine with its gate; say so on `Not verified:` |
| `hedge` | "maybe", "perhaps", "probably" or "arguably" in the chair block | Never in a chair line. Write what the cited line says, or move the point to `Not covered:` |
| `brain-unaccounted` | An installed brain that the `Council:` line names neither as seated nor as left out | Only when the reply was written on a machine with fewer brains installed; say so on `Not verified:` |

## What the gate cannot see

It reads text. It opens no source and never sees the conversation.

- Whether a cited piece says what a seat's sentence claims. Each brain's own `verify.md` covers that, and the seat walked it.
- Whether a brain was wrongly left out, or seated to fill the table.
- Whether the seats ran blind to each other, or the chair ran without a corpus.
- Whether a `Why:` is the real reason for a disagreement, or a `Disagree:` line hides an agreement.
- Whether an `Agree:` line says more than its two cited sentences support.
- A position stated as plain fact with every name removed.
- Whether the recommendation follows from the lines it rests on, or is useful to the person.
- Whether each corpus is current. Every brain's `sources.md` carries the date it was read.

Passing is necessary, never sufficient. The questions above that begin "cover the line" are answered by reading, and [review](review.md) asks them again with fresh eyes.

## What you see, what you do

| You see | You do |
|---|---|
| A seat block full of confident prose and one `Source:` line | Send it back to its seat; run that brain's gate on it yourself and read the lines |
| A seat answered a subject its `silent.md` lists | The seat was padded. Move the brain to `Left out:` and drop the block |
| Only one seat spoke | Withhold the recommendation; `Would change it:` names what would let a council sit |
| Every seat agrees on everything | Read the seat blocks side by side for a stage, date or audience that differs; if none does, say so in one `Agree:` line per point and stop |
| The chair cited a famous line no seat has | Delete it. Fame is not a citation |
| The chair resolved a disagreement in the `Disagree:` line | Cut the ruling; the lean goes in the recommendation, in your voice |
| The person asks "so what would {name} do" | That is one body of work: name that brain skill and stop |
| The person asks you to just decide | Give the labelled recommendation and `Would change it:`. The call stays theirs |
| A brain's gate is not installed | The block gets the generic check; `Not verified:` names the brain |

## Hand over

Write `COUNCIL.md` beside the saved reply, after the last gate run, for a decision the person will act on or show to someone else.

```md
# Council: {the decision, in the person's words}
Reply: {the path of the saved .txt}
Installed: {the --seats listing, pasted}
Seated: {brain} because {the description sentence or theme file} (one per seat)
Left out: {brain} because {the silent.md row, or what its description covers} (one per brain)
How the seats ran: {parallel subagents | one context, in listing order}
Seat gates: {brain}: {its gate's last line, pasted} (one per seat)
Spoke: {the seats that spoke} Silent: {the seats that were silent}
Cross-check: {each point} -> {what each seat returned: the cited line, or silence}
Gate: {the last line of decision-check.mjs --gate on the reply, pasted}
Candidates: {each candidate line} -> {why it stands, or the fix}
Review: {the reviewer's findings} -> {your response}
Corpus dates: {brain}: {the date in its sources.md} (one per seat)
Not checked:
```

- Is every chair citation in the reply traceable to a line pasted or named here?
- Does Not checked say whether any cited source was opened, or only the brains' reading of it?

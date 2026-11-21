---
title: chair
summary: The chair's two briefs, the chair citation form, how the Agree, Disagree, Not covered and Recommendation lines are written, the wording that keeps words out of people's mouths, and the single cross-check round.
---

# Chair

The chair reads the seats' finished replies and writes the last block. It is a fresh subagent, or a clean pass with every brain file closed. It gets the decision and the seat blocks. It never gets a brain's `SKILL.md`, a reference file, the conversation, or your view of the answer, because a chair that holds a corpus is one more seat and starts speaking for people (`leaking-chair`).

## Lines that are never a seat's position

A seat block holds three kinds of line that the chair never builds on, never cites and never puts on an `Agree:` or `Disagree:` line:

| Label | What the brain says it is |
|---|---|
| `Nearest:` | Material that stops short of the question |
| `My reading:` | The reader's own reading of the material, written by the brain's format for the person who asked, with no citation by design |
| `Yours:` | The person's or installer's own words |

The reason is the same for all three: the brain itself marks the line as not its published position, so a chair that builds a point on it puts someone else's words, or none, under the seat's name (`invented-seat`). The gate fails a chair citation that exists in the seat block only on one of these lines (`nearest-citation`). It still lets through a title that is shared with a real cited line, so [verify](verify.md) asks which line the citation came from and the reviewer asks it again.

## The first brief: find the disagreements

Send this before the chair writes anything, when two or more seats spoke.

```text
You chair a decision review. You have the decision and the seats' replies below, and nothing else. Open no file, no skill and no web page, and add nothing you know about anyone named.

Decision: {the decision as one question}

{every seat block, with its "== Seat: ... ==" header}

List every point on which two seats' cited lines pull in different directions for this decision. One line per point, in this form:

Point: {the point, in a few words} | {seat}: {the cited sentence, copied} | {seat}: {the cited sentence, copied}

Use only sentences that carry a citation inside a seat block. Leave out lines labelled Nearest:, My reading: or Yours:, because none of them is the seat's position. If no two seats pull apart, reply "No disagreement found." Write no recommendation and no summary.
```

## The cross-check round

One round, and only for the points the first brief returned. Group the points by seat: each seat that is on any disputed point gets one cross-check, and that cross-check carries every other-seat line put to it. Start one fresh seat subagent per seat, never one per point, with this brief. One block has one writer per round, so two answers about the same seat never overwrite each other.

```text
You hold one seat in a decision review. Your seat is one brain skill, and that skill is the only thing you read.

Brain: {brain folder name}
Path: {path to that brain's folder}
Decision: {the decision as one question}
Your seat's reply so far:
{that seat's block}

Other bodies of published work say this on the points of the decision where they pull against your seat:
1. {the first other seat's cited sentence, with its citation, and nothing else from that seat}
2. {the next, in the same form; one numbered item per point, none for a point your seat is not on}

Read {path}/SKILL.md and work as that skill. For each numbered line, separately: does this brain's corpus speak to that point? Answer only from its reference files, and apply the two rules below to each number alone.
- If a line in the corpus speaks to it, add one cited line to the reply, under the label that skill's Output format gives for a further cited line; where the format has no such label, add one cited sentence to the answer.
- If no line speaks to it, add the point to the reply's last line, the one that names what the corpus does not cover.
Stay inside every limit of that skill's Output format (line caps, quote caps). When the added lines would pass a limit, drop the earlier line that is least relevant to the decision to make room: the block must stay a valid reply of that brain, and the gate of that brain may not catch every cap. Never argue with another line, never rank them, never write what the person "would" answer. Run the skill's gate on the whole reply until it passes.

Return exactly two things: the whole reply, then "Gate: " and the gate's last line.
```

The seat sees one sentence of each other seat that is on a point with it and nothing more from them. The returned reply replaces that seat's block, and it is the only write to that block in the round. The added line is that brain's own line, in that brain's format, inside that brain's block; it is never written by the chair.

There is no second cross-check. A persona asked twice can move; a corpus asked twice returns the same lines. The one look answers the only open question: whether the two bodies of work disagree, or one of them never addressed the point. If it never did, the `Why:` says which seat's corpus is silent on the point; "the pieces do not say" is only for two corpora that both speak and give no reason.

## The second brief: write the block

```text
You chair a decision review. You have the decision and the seats' final replies below, and nothing else. Open no file, no skill and no web page, and add nothing you know about anyone named.

Decision: {the decision as one question}
Seats that spoke: {seat names}
Seats that were silent: {seat names, or none}

{every final seat block, with its header}

Write the chair block, in this order, one line each unless a label says it repeats:

== Chair ==
Agree: (repeats) one point that the cited lines of two or more seats both support, then a chair citation for each of those seats. Say only what every cited seat's line carries. Never write "each seat" or "every seat" when a seat's own block pulls both ways or a seat was silent.
Disagree: (repeats) the point. What the first seat's material says, with its chair citation; what the second seat's says, with its chair citation. Why: the reason the cited lines themselves show (a different stage, audience, date or country). When a seat's final block lists the point as not covered, the Why: says which seat's corpus is silent on it. Write "the pieces do not say" only when both corpora speak and neither gives a reason.
Not covered: what the decision asks that no seat's cited line answers.
Recommendation (khe-decision's synthesis, not the view of anyone cited): the call in two to four sentences, naming no person and no institution. If fewer than two seats spoke, write "withheld." and the reason, and leave out Rests on:.
Rests on: the chair citations the call leans on.
Would change it: the one fact that would flip the call.

A chair citation is [{seat}: {citation text}], where {seat} is the seat's short name and {citation text} is copied character for character from inside that seat's block. Cite nothing that is not in a seat block. Every sentence that names a seated person or institution carries a chair citation in that sentence. Write "what {name} has published suggests", never "{name} would say", "{name} thinks you should" or "the council recommends". Never use a line labelled Nearest:, My reading: or Yours: as a seat's position, and never cite one. No hedge words. Do not pick a winner in a disagreement. A Disagree: side restates the cited sentence and never the seat's Holds: or Breaks: label as though it were the published position. Start every chair line with one of the labels above and no other.
```

Start the block from the chair block of the closest gold in `examples/`. Step 9 of the workflow adds `Not verified:` and the reading line after it, because only you know how the seats were run.

## The chair citation

`[{seat}: {citation text}]`

- `{seat}` is the seat's short name: the last part of the brain's folder name, so `khe-brain-varun` is `varun` and `khe-brain-yc` is `yc`. It must be a seat in this reply.
- `{citation text}` is the text of a citation as it stands inside that seat's block. The gate matches the whole text against the items that seat actually cites, ignoring case and runs of spaces, not against any substring of the block, and prints `chair-citation` when it matches none. A citation found only on a `Nearest:`, `My reading:` or `Yours:` line prints `nearest-citation`. A chair line that starts with none of the format's labels prints `unknown-chair-label`.

| The seat cites as | Copy | Chair citation |
|---|---|---|
| `(Kata 7 at 8:05)`, a title and a time | The title and the time | `[varun: Kata 7 at 8:05]` |
| `(How to split equity among co-founders)`, a title | The title | `[yc: How to split equity among co-founders]` |
| `[2]`, a marker resolved by `Source: [2] Great Animations, ...` | The title from the `Source:` line | `[emil: Great Animations]` |

Two rules follow from the form. A piece the chair remembers and no seat cited has no block to be found in, so it cannot be cited. A sentence in a seat block with no citation of its own cannot be cited either; it goes back to the seat or stays out of the chair block.

## Agree

One point per line. The point is what the cited lines of two or more seats both support for this decision, written as a statement about the material: "the published material of both seats puts distribution ahead of polish at this stage". It carries a chair citation from at least two different seats (`uncited-chair-claim` otherwise). Two citations from one seat are one voice; that point belongs to that seat's block and not on an `Agree:` line.

An `Agree:` line says only what every cited seat's line carries. "Each seat" and "every seat" are wrong when a seat's own block pulls both ways or a seat was silent: name the seats that carry the point.

Agreement is not a vote. Three seats that agree were three bodies of work written for three audiences, and the line says what they support, never that the question is settled.

## Disagree

One point per line, in three parts: what the first seat's material says with its chair citation, what the second seat's says with its chair citation, and `Why:`.

The `Why:` is a reason a reader can check against the two cited lines:

| Reason | Example of what the lines show |
|---|---|
| Stage | One line is about a company before its first customer, the other about one already growing |
| Audience | One was said to the speaker's own employees, the other to founders applying for funding |
| Date | The pieces are years apart and the later one says the advice moved |
| Country | One describes practice in the United States, the other a company in India |
| One corpus is silent | The cross-check found that one seat's corpus never addressed the point; the `Why:` says which seat's corpus is silent on it |
| "the pieces do not say" | Both corpora speak on the point, and neither cited line, nor the cross-check, gives a reason for the difference |

A `Why:` about a person's temperament, taste or motives is a claim about the person that no seat cited. Use the last row.

A `Disagree:` side restates the sentence the seat cited. It never restates the seat's `Holds:` or `Breaks:` label as though it were the published position: the label is the brain's verdict on how the person's design fares against the position, and nobody cited published that verdict.

Never close a `Disagree:` line with which side is right, and never blend the two into a middle position (`averaged-council`). The recommendation can lean on one side; it says so in its own voice, cites that side on `Rests on:`, and names on `Would change it:` the fact that would move it to the other.

## Not covered

One line: the part of the decision that no seat's cited line answers. Take it from three places: the brains left out on the `Council:` line, the silent seats, and the last line of each seat's block, where the brain names what its corpus left out. Put it in the person's own terms ("what a seed round costs a company registered in India"). When every part was covered, name what was not read: each brain's last line lists it.

## Recommendation

The label is fixed, character for character: `Recommendation (khe-decision's synthesis, not the view of anyone cited):`. The gate fails a bare `Recommendation:` or `Verdict:` (`unlabelled-synthesis`), because a call without the label reads as the seats' own.

- Two to four sentences. The call first, then the reason in terms of the `Agree:` and `Disagree:` lines above it.
- It names no person and no institution; the gate fails one that does (`recommendation-names`) unless the line carries a chair citation. The line's citations live on `Rests on:`.
- It adds no fact. Anything it leans on is already on an `Agree:` or `Disagree:` line with its citation.
- It is withheld when fewer than two seats spoke: `Recommendation (khe-decision's synthesis, not the view of anyone cited): withheld. Only one seat's corpus spoke to the decision, and one corpus is that brain's answer.` Then `Rests on:` is left out and `Would change it:` names what would let a council sit: a second installed brain whose corpus covers the decision.

`Rests on:` lists the chair citations the call leans on, at least one. `Would change it:` names one fact about the person's own case, checkable by them, that flips the call.

## The wording

The chair writes about material. It never writes about what a person thinks today, and never in the conditional.

| Never | Instead |
|---|---|
| "Varun would say" | "What Varun Mayya has published suggests ..." with its chair citation |
| "YC thinks you should" | "In the essay the seat cites, Michael Seibel wants ..." with its chair citation |
| "Emil might push back" | What the seat's cited line says, or `Not covered:` |
| "They would agree that" | An `Agree:` line with a chair citation from each seat |
| "The council recommends", "the council agrees" | The labelled recommendation; an `Agree:` line |
| "He believes" with no date | What the cited piece said, in the past tense where the seat's line gives a date |

Name people the way the seat's line names them. The seat for `khe-brain-yc` names the partner who said each line; the chair keeps that name and never promotes it to the institution's view. The seat for `khe-brain-isb` names a file, and a speaker only where the file does; the chair does the same.

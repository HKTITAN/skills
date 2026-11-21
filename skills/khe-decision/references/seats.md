---
title: seats
summary: How the installed brains are found, which of them get a seat and why, the brief each seat is given, what a silent seat looks like, and how to run the seats when the harness has no subagents.
---

# Seats

A seat is one brain skill answering one decision from its own corpus, in its own reply format, checked by its own gate. Nothing in this file tells a seat what to conclude; it only fixes what a seat is allowed to read.

## Discovery

Run, from this skill's folder:

```sh
node scripts/decision-check.mjs --seats
node scripts/decision-check.mjs --seats --json
node scripts/decision-check.mjs --seats --brains {dir}
```

The script scans three places, in this order, for folders that carry the brain prefix and hold a `SKILL.md`:

1. The folders beside this skill's own folder.
2. `~/.claude/skills`.
3. Every folder passed with `--brains {dir}` (repeatable), and every folder in the path list of the environment variable `KHE_BRAINS_DIR`.

A brain found in two places counts once, and the first place wins. The pattern for the prefix lives in the script and nowhere in this file, because a pattern copied into prose is a second list to keep in step.

It prints one line per brain: the folder name, the person or institution (read from the first heading of that brain's `SKILL.md`, so "Brain: Varun Mayya" gives "Varun Mayya"), whether that brain ships `scripts/brain-check.mjs`, the path, and the first sentence of its description. Under the brains it prints their count and the folders it scanned. That count is the M on the `Council:` line, and the N beside it is the number of seat blocks in the reply. Never type the list from memory and never keep one here: a brain installed yesterday is on the listing and in no document.

## Seating

Walk each brain on the listing, in the order printed. For each, open two things: the description in its `SKILL.md` frontmatter, and its `references/silent.md`.

| Ask | Result |
|---|---|
| Does `silent.md` list the decision's subject as not covered? | Left out. Reason: the row's topic, in a few words. |
| Does the description, or the table of theme files under its Find the reference, name the decision's subject? | Seated. |
| Does nothing in the description touch the subject? | Left out. Reason: what the brain does cover, in a few words ("interface motion only"). |
| Does the subject sit at the edge of a theme, so you cannot tell from the two files? | Seated. |

The last row is the rule for doubt: a seat that comes back silent costs the reply one line, and a brain wrongly left out costs a view nobody knows is missing. It is not a licence to seat everything. A brain whose own `silent.md` names the subject is never seated, because its reply is known before it is written and the seat only makes the council look larger (`padded-council`).

A decision with two subjects (a pricing change that is also a hiring freeze) seats a brain that covers either one. Write on the `Council:` line every brain from the listing, seated or left out, each left-out brain with its reason in parentheses.

[pov](pov.md) can name a brain to leave out for a subject. It cannot seat a brain whose corpus does not cover the decision.

## The seat brief

One subagent per seated brain, all started in one message. Fill the three placeholders and send this text and nothing else: no other seat's name, no hint of what you expect, no part of the conversation that led here.

```text
You hold one seat in a decision review. Your seat is one brain skill, and that skill is the only thing you read.

Decision: {the decision as one question}
Brain: {brain folder name}
Path: {path to that brain's folder, from the seats listing}

1. Read {path}/SKILL.md in full and work as that skill. Follow every step of its workflow, including its check for silence, its check for disagreements and its own gate.
2. Name the job the way that skill's first step does. A decision is tested against the published material where the skill has a pressure-test job, and answered as a direct question where it does not. Never use a drafting job.
3. Answer only from the reference files of that skill. Open no other skill, no other brain and no web page, and add nothing you remember about the person or the institution.
4. Where the references do not cover the decision, give that skill's silent answer in that skill's form. Silence is a complete and correct reply. Never build a position from the nearest line.
5. Write the reply in that skill's Output format and nothing else: no greeting, no summary, no advice of your own, no recommendation. Stay inside every limit of that Output format (line caps, quote caps).
6. Save the reply as a .txt file and run node {path}/scripts/brain-check.mjs on it with --gate. Fix the reply until the gate's last line says it passed. If that script does not exist, do not improvise a check; say it is not installed.

Return exactly two things: the reply, then one line, "Gate: " followed by the gate's last line or "not installed".
```

What comes back goes into the council reply whole, under `== Seat: {brain folder} ({person or institution}) ==`. You do not shorten it, reorder it, merge its `Source:` lines with another seat's or correct its wording. If a seat block fails the council gate (`seat-format` or `seat-uncited`), the block goes back to a seat subagent with the gate's lines; the fix is written by a seat reading that brain, never by you and never by the chair.

The brain's own reply format decides what a citation looks like inside the block. `khe-brain-varun` cites `(Title at m:ss)`, `khe-brain-yc` cites `(Title)` and names the person in the sentence, `khe-brain-emil` cites with `[n]` markers that its `Source:` lines resolve. This skill fixes none of that; the brain's gate judges it.

## Limits stay with the brain

A seat block stays a valid reply of its own brain at every stage, the cross-check included. The seat keeps inside every limit of that brain's Output format: the cap on `Also:` lines, the cap on quotes, and any other count it sets. When a cross-check adds a cited line that would pass a cap, the seat drops its least relevant earlier line to make room and never exceeds the cap. The reason: the chair and the gate here do not know each brain's caps, and a brain's own gate does not always count them, so a block that grew past a cap is a reply that brain would never have written. [verify](verify.md) asks the count as a question.

## A silent seat

A seated brain whose corpus turns out not to cover the decision returns its silent answer. It looks the way that brain's `silent.md` says: silence stated in the first sentence, a `Source:` line in that brain's silent form, at most a `Nearest:` line, and the brain's own last line naming what was not covered.

- The block stays in the reply, whole. The reader sees the seat was asked and what it said.
- The seat did not speak. It is not counted in step 6 of the workflow, and when fewer than two seats spoke the recommendation is withheld.
- A line labelled `Nearest:`, `My reading:` or `Yours:` is never the basis of an `Agree:` or a `Disagree:` line, in a silent seat or a seat that spoke. The brain labels the first as material that stops short of the question and the other two as the reader's or the installer's words, so a chair that builds on one is speaking past the corpus (`invented-seat`). The gate skips all three for the citation check on the same ground; see [chair](chair.md), Lines that are never a seat's position.
- What the silent seats did not cover goes on the chair's `Not covered:` line.

## Without subagents

When the harness cannot start subagents, the seats are written one at a time in this context:

1. Open one brain's `SKILL.md`. Write that seat's reply by the brief above. Run that brain's gate until it passes. Save the block.
2. Only then open the next brain. Never open two brains before the first seat is finished and gated, and never go back to edit a finished seat after reading another.
3. Write the chair block from the saved seat files alone, with the brains' reference files closed.
4. Say on `Not verified:` that the seats and the chair ran in one context, so the seats were not blind to each other.

The order of the seats is the order of the listing, so the person can run it again and get the same sequence.

## Later brains

A brain added after this file was written takes a seat the day it is installed: it appears on the listing, it is walked through Seating like the rest, and its own gate judges its block. Nothing here changes.

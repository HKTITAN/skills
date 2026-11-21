# khe-Decision

Puts one decision to a council whose seats are the brain skills you have installed. Each seat answers only from its own published corpus with citations, and the reply shows where that material agrees, where it disagrees and why, what none of it covers, and one recommendation labelled as the skill's own.

```bash
npx skills add HKTITAN/skills --skill khe-decision
```

It needs at least two brain skills installed, for example `khe-brain-varun` and `khe-brain-yc`, in the folder beside it, in `~/.claude/skills` or in a folder you pass with `--brains {dir}`. It finds them by folder, so there is nothing to configure.

## What you say, what you get

You say: "Should we raise a seed round now or stay bootstrapped for another year? Put it to the council."

You get one plain-text reply:

- The decision as one question, and a `Council:` line naming every installed brain as seated or left out, with the reason for each one left out.
- One block per seat: that brain's own reply, in that brain's own format, with its citations, its `Source:` lines and its own line saying what its corpus does not cover.
- A chair block: `Agree:` lines where two or more seats' material points the same way, `Disagree:` lines with both cited sides and the reason they differ, and `Not covered:` for what no seat answers.
- One recommendation under the label `Recommendation (khe-decision's synthesis, not the view of anyone cited):`, the citations it rests on, the fact that would change it, and what was not verified.

## How the council runs

![khe-decision's flow: a decision is put to every seated brain in parallel, each seat cites or is silent, one cross-check follows, a fresh chair cites only what a seat cited and writes a recommendation labelled as its own synthesis, and the reply is gated by decision-check; fewer than two relevant brains convenes no council: one brain answers alone, or none does](assets/flow.svg)

1. **Seats.** `node scripts/decision-check.mjs --seats` lists the installed brains. A brain is seated when its description or a theme file covers the decision, and left out when its own list of silent topics names the subject. When in doubt it is seated: a silent seat costs one line, a missing seat costs a view.
2. **One round, blind.** Each seat runs as its own subagent, in parallel, reading exactly one brain and following that brain's workflow and gate. No seat sees another seat, another brain or the chair, because a seat written after reading another bends toward it.
3. **One cross-check.** For each point where two seats pull apart, both are asked once whether their corpus speaks to the other's cited line. The answer is a cited line or silence. A corpus cannot change its mind, so there is no further round.
4. **The chair.** A fresh chair gets the decision and the finished seat replies, never a corpus. It cites only what a seat cited, in the form `[varun: Kata 7 at 8:05]`, and writes the recommendation last.
5. **The gate.** `decision-check.mjs` checks the saved reply, and judges every seat block with that brain's own gate.

A brain added later joins the council by being installed. No list here needs editing.

## What it will not do

- **Speak for anyone.** It never writes "Varun would say" or "YC thinks you should". It writes what the published material suggests, with the citation, or that the material is silent.
- **Convene on fewer than two relevant brains.** With none, it says which brains are installed and that none covers the decision. With one, it sends you to that brain: a council of one is a quote. If fewer than two seated brains spoke, the recommendation is withheld.
- **Average a disagreement.** Both cited lines stay in the reply, with the reason they differ: stage, audience, date, country, or "the pieces do not say".
- **Pass its call off as someone else's.** The recommendation's label says whose it is, and the line names no one.
- **Decide.** The reply ends with what would change the recommendation and what was not verified. The call is yours.
- **Search, forecast or score.** It adds no web research, no probabilities and no invented personas. Its only evidence is what the brains have read.

## The reply

```text
Decision: {the decision as one question}
Council: {N} of {M} installed brains seated. Seated: {brain}, {brain}. Left out: {brain} ({reason}).

== Seat: khe-brain-varun (Varun Mayya) ==
{that brain's whole reply, in its own format}

== Seat: khe-brain-yc (Y Combinator) ==
{that brain's whole reply, in its own format}

== Chair ==
Agree: {the point} [varun: {citation}] [yc: {citation}]
Disagree: {the point}. {one side} [varun: {citation}]; {the other} [yc: {citation}]. Why: {the reason}.
Not covered: {what no seat's corpus answers}
Recommendation (khe-decision's synthesis, not the view of anyone cited): {the call, two to four sentences}
Rests on: [varun: {citation}] [yc: {citation}]
Would change it: {the fact that would flip the call}
Not verified: {what was not checked}
A reading by Harshit Khemani of public work. Nobody cited here wrote or endorsed it.
```

## When to use it

Use it for a decision that more than one body of published work speaks to, when you want to see the sources side by side before you choose: raise or bootstrap, hire now or later, ship the small version or wait. For what one person or institution has published, ask that brain skill alone, such as `khe-brain-varun`. To pick a skill, use `khe-auto`.

## Invoke with

`/khe-decision [decision | seats]`

## Before and after

Before: "should we raise now?" returns five paragraphs that open "Varun would tell you to bootstrap, while YC would say raise", no link for either, and a confident verdict that reads as theirs.

After: every name sits beside a citation that can be found in its seat block, and the call is labelled as the skill's synthesis.

## Example prompts

- Should we raise a seed round now or stay bootstrapped for another year? Put it to the council.
- Help me decide: one product for the next twelve months, or two in parallel.
- What do the brains say about giving the CEO a tiebreaker share?
- Convene the council on shipping the onboarding without animation.

## Verify

```bash
node scripts/decision-check.mjs --seats               # the installed brains
node scripts/decision-check.mjs reply.txt --gate --strict   # a reply, saved as text, on the machine that ran the seats
node scripts/decision-check.mjs examples --gate       # the gold replies
node scripts/decision-check.mjs --self-test           # the gate against its own pairs
```

`--gate` ends `decision-check passed` only when every never-intentional line is at 0, exits 1 with `decision-check failed` and the count otherwise, and exits 2 when it found nothing to read. Use `--strict` on the machine that ran the seats: the brains are installed there, so every candidate line (`brain-unaccounted`, `seat-unchecked`) is checkable and `--strict` fails on an open one. Plain `--gate` is for a machine without the brains. The summary says how many seats were judged by their own brain's gate.

What it proves: the reply opens with the decision; the `Council:` line names every seated brain and its N is the number of seat blocks, never above M; there are two or more seat blocks, or the not-convened form; every seat block passes its own brain's gate; there is a chair block; every `Agree:` and `Disagree:` line carries citations from two different seats, and every `Disagree:` a `Why:`; every chair citation names a seat in the reply and matches, whole, an item that seat cites, and not only a `Nearest:`, `My reading:` or `Yours:` line; no brain is seated twice and each seat header carries the installed brain's own name; every chair line starts with one of the format's labels; every `Rests on:` line holds chair citations and nothing else; no sentence outside the seats puts a "would say", a "wants you" or a "thinks you should" beside a name, holds would, might, could or will beside a seated name, a brain on the `Council:` line or a person a seat block quotes outside the cited reporting form, or tells the reader "you should" in a sentence that names one of them; no chair line except `Rests on:` and `Not verified:` names a seated person or institution, or a person a seat block quotes, without a citation, and a `Why:` clause may name only a seat its own `Disagree:` line cites; `Agree:`, `Disagree:` and `Would change it:` name no left-out person or institution, cited or not, because a brain left out on the `Council:` line has no seat block; the recommendation carries its full label, names no seated or left-out person or institution and no person a seat block quotes, carries no citation and has a `Rests on:` line; the not-convened form holds its five labelled lines, once each, and nothing else; and the reply ends with `Would change it:`, `Not verified:` and the reading line.

What it does not prove: that a cited piece says what a seat claims (each brain's own checks cover that), that the right brains were seated, that the seats ran blind to each other, that a `Why:` is the real reason, that the `Not verified:` line (the run's log, which may name a seat or a brain) states no position for one, or that the recommendation is a good one. It matches labels and text, never meaning. Passing is necessary, not sufficient.

## What is inside

```text
SKILL.md        the one idea, the hard rules, the workflow, the reply format
references/     seats, chair, verify, review, teaching, sources, and gotchas and pov, which are yours to edit
examples/       gold council replies
teaching/       bad and good pairs, one gate line each; the gate's tests
scripts/        decision-check.mjs: the seats listing and the gate. Node 20 or newer, no dependencies
```

## Credit

The council comes from [autodecision](https://github.com/harshilmathur/autodecision) by Harshil Mathur (MIT), which its README says builds on Andrej Karpathy's autoresearch and llm-council.

Borrowed, as ideas: a council of independent seats run in parallel, a chair that synthesises last, and disagreement kept in the result and not averaged away.

Different: autodecision seats five personas it defines, who generate views, and repeats its loop until a judge sees them settle. khe-Decision seats real published corpora, which can only be read. So a seat here never generates a view: it cites a line or says it is silent. There is one round and one cross-check, because a corpus cannot change its mind. There is no council on fewer than two relevant brains, and the one recommendation is labelled as the skill's own. None of autodecision's text, prompts, section names or schema is copied; every sentence here was written fresh. If you want a decision modelled, with second-order effects and stress tests, use autodecision.

The seats' material belongs to the people who published it. Each brain's `references/sources.md` lists what was read.

A reading by Harshit Khemani, not endorsed by anyone it cites, and not written or endorsed by Harshil Mathur or Andrej Karpathy.

Harshit Khemani. MIT.

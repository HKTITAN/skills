# khe-brain-benji

Answers design and product questions from Benji Taylor's published work, with the source named.

```bash
npx skills add HKTITAN/skills --skill khe-brain-benji
```

## Credit

This is Harshit Khemani's reading of Benji Taylor's public writing and public skills. Benji Taylor did not write it, review it or endorse it. Read him directly at [benji.org](https://benji.org/) and use his own skills from [github.com/benjitaylor/skills](https://github.com/benjitaylor/skills). When this skill and one of his pieces disagree, the piece is right. Every sentence here is a paraphrase; the few quotes are under 15 words each.

## What it does

- Answers a question with the claim, the piece it comes from and its URL.
- Pressure-tests a design, a product decision or a piece of faux UI against his stated positions, one line per position.
- Says "he has not written about this" when the corpus is silent, and lists what was not read.
- Reports both sides where two pieces disagree or a view moved over time, with dates.
- Keeps each claim in its context: faux product UI, the Family wallet, the Honk messenger, a React library, or working with agents.
- Never builds. It names `stageshow` or `khe-ui` and stops.

## When to use it

Use it when you want an answer from a known source in place of an average of everything: before quoting him, when someone says "Benji says" and you want the piece, or when a design should be checked against a stated standard. Do not use it to make the thing. For faux product UI his own `stageshow` skill is the source and the tool; this skill only tells you what it says and where.

## Invoke with

`/khe-brain-benji [question | test <design or decision> | who said <line> | sources]`

Or ask in your own words: "what would Benji say about", "would Benji ship this", "who said that".

## Before and after

Before: "what would Benji say about confetti on the send button?" returns four confident paragraphs in his voice, a number he never gave and no link.

After: three sentences that place confetti on a rare moment and name the wallet it was said about, each ending `(Family Values)`; then `Source: Family Values, https://benji.org/family-values`; then `Not in his writing:` and the part no piece answers.

## Example prompts

- What would Benji say about showing every feature on the first screen?
- Would Benji ship this hero? The whole dashboard sits in a card and every row has real text.
- Who said "pointing beats describing", and where?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, lists every piece it cites, gives no sentence marked as his without a piece, keeps quotes under 15 words, uses no hedge word and no "he would", and ends with `Not in his writing:`. The self-test also proves that every citation in the theme files names a piece in the sources table.

What it does not prove: that a cited piece says what the sentence claims, that a quote is word for word, that a rule was kept in its context, or that the corpus is current. It matches titles, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from theme to file, the hard rules and the output format.
- `references/`: the corpus by theme (`restraint-and-detail.md`, `framing-and-composition.md`, `motion-with-a-cause.md`, `components-and-states.md`, `delight-and-play.md`, `verification-and-rehearsal.md`, `agents-and-tools.md`, `taste-and-practice.md`), each claim one line with its title and URL; `sources.md` (28 pieces, dates, what was not read, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, two pressure-tests, a silent topic, a disagreement and a "who said that".
- `teaching/`: eleven bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. His writing and his skills stay his, under their own terms.

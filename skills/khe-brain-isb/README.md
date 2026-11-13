# khe-brain-isb

Answers business questions from the isb-skills notes, with the file named and linked.

```bash
npx skills add HKTITAN/skills --skill khe-brain-isb
```

## Credit

The corpus is one public repository, [HKTITAN/isb-skills](https://github.com/HKTITAN/isb-skills): nine sets of MBA study notes that its README says draw on the ISB PGP 2025-26 curriculum. This skill is Harshit Khemani's reading of that repository. The Indian School of Business did not write it, review it or endorse it, and no file in the notes names a professor, a course or a student. When this skill and a file in the repository disagree, the file is right. Every sentence here is a paraphrase; the few quotes are under 15 words each.

Since version 1.1.0 the corpus also holds 146 session notes from ivi, the I-Venture Immersive programme at ISB, April to August 2025: one note per recording or page of typed notes, each naming its speaker and its date, in `ivi/`. They are Harshit Khemani's write-up of sessions he attended, made from automatic transcripts and classmates' notes. No speaker reviewed or endorsed a note. Classmates, their startups, feedback on them and anything a speaker asked to keep in the room were left out. A speaker who wants a note corrected or removed can open an issue on this repository.

## What it does

- Answers a question with the claim, the file it comes from and its URL.
- Pressure-tests a plan, a financial model or a decision against what the files state, one line per position.
- Says "the notes do not cover this" when they are silent, and lists what was not read.
- Reports every side where two files give different numbers, formulas or definitions, and never picks a winner.
- Marks every benchmark as the notes' own figure, given with no source.
- Reports the notes as the notes: never "ISB teaches", never "the professor says".
- Reports a session line as its speaker's, with the session note linked, and never as the school's view.
- Never builds and never advises. It reports and stops.

## When to use it

Use it when you want an answer from a known set of files in place of an average of everything: before quoting a threshold in a deck, when someone says "the ISB rule is 3 to 1" and you want the file, or when a plan should be checked against a stated standard. Do not use it to do the analysis. For that the same repository ships nine skills of its own, which load the frameworks for an agent to apply; this skill only tells you what a file says and where.

## Invoke with

`/khe-brain-isb [question | test <plan, model or decision> | who said <line> | sources]`

Or ask in your own words: "what do the ISB notes say about", "check this against the ISB frameworks", "which file says that".

## Before and after

Before: "what does ISB say a healthy LTV to CAC is?" returns "ISB teaches 3:1", a paragraph of general startup advice and no link.

After: two `Disagrees:` lines, one for the file that calls 2:1 difficult but possible and one for the file that calls anything under 3:1 unsustainable, each ending with its title; a `Source:` line for each; then `Not in the notes:` saying that neither file gives a source and that no rule file names ISB.

## Example prompts

- What do the ISB notes say about how much debt a company should carry?
- Test our Series A plan against the ISB notes: LTV to CAC is 2.4 to 1 and payback is 20 months.
- Which ISB professor said "never trust net income alone"?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, lists every piece it cites, gives no sentence that speaks for the notes without a piece, never credits a claim to ISB or a professor, keeps quotes under 15 words, uses no hedge word and no "would" about the school or the notes, and ends with `Not in the notes:`. It reports a cited figure in a reply that never says the notes give no source. The self-test also proves that every citation in the theme files names a piece in the sources table, and that this file and `SKILL.md` state the number of pieces the table holds.

What it does not prove: that a cited file says what the sentence claims, that a quote is word for word, that a benchmark stayed with the kind of business the file gives it for, that a figure in the notes is true, or that the corpus is current. It matches titles, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from question to file, the hard rules and the output format.
- `references/`: the corpus by question (`valuation-and-financing.md`, `reading-the-numbers.md`, `where-to-compete.md`, `customers-and-brand.md`, `pricing-and-going-to-market.md`, `is-the-startup-working.md`, `raising-venture-money.md`, `running-operations.md`, `leading-and-negotiating.md`, `markets-and-the-economy.md`, `technology-and-data.md`, `working-a-case.md`), each claim one line with its title and URL; `sources.md` (613 pieces at commit `060ee06`, whose words the notes are, what was not used, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, two pressure-tests, a silent topic, a disagreement and a "who said that".
- `teaching/`: twelve bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. The notes stay in their own repository, under the MIT licence their files declare.

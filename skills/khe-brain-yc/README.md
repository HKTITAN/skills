# khe-brain-yc

Answers startup questions from public Y Combinator essays, posts and talks, with the person who said it named and the piece linked.

```bash
npx skills add HKTITAN/skills --skill khe-brain-yc
```

## Credit

This is Harshit Khemani's reading of public Y Combinator material: 14 essays by Paul Graham, 28 written posts and 46 talks from the YC Startup Library, 88 pieces in all. Nobody at Y Combinator wrote it, reviewed it or endorsed it, and neither did Paul Graham. Read the originals at [ycombinator.com/library](https://www.ycombinator.com/library) and [paulgraham.com](https://paulgraham.com/articles.html). When this skill and a piece disagree, the piece is right. Every sentence here is a paraphrase; the few quotes are under 15 words each.

## What it does

- Answers a question with the claim, who said it, the piece it comes from, its URL and its date.
- Keeps each claim with its speaker. Y Combinator is many people, so nothing is reported as "YC says".
- Pressure-tests a plan, a deck or a decision against stated positions, one line per position.
- Says "no piece read covers this" when the corpus is silent, and lists what was not read.
- Reports both sides where two people disagree or advice moved over the years, with dates.
- Keeps each claim at its stage: before launch, before product-market fit, seed, Series A, B2B, consumer.
- Never advises and never builds. It is not legal, tax or investment advice.

## How it runs

![khe-brain-yc's flow: khe-auto sends an unnamed startup question here and an Indian or bootstrapped case to khe-brain-varun or a model to khe-brain-isb; the question is answered from 12 theme files over 88 pieces, checked for silence and disagreement, cited with the person and the title, closed with what is not in the corpus, and gated by brain-check; an answer to publish goes to khe-content-engine with its Source lines](assets/flow.svg)

## Used

```text
/khe-brain-yc Pressure-test my seed plan: sell 30% for $1M, a deck of screenshots, a cold email asking for a call.
```

The gold reply for that plan, in full from [examples/pressure-test-seed-plan.txt](examples/pressure-test-seed-plan.txt):

```text
Against the seed pieces read, the plan breaks three stated positions, and on one of them the pieces split. The largest is dilution: Geoff Ralston's guide, an undated post, says founders should try to avoid giving up more than 25% in a seed round (A guide to seed fundraising).
Breaks: 30% sold; Ralston calls as little as 10% wonderful and says most rounds require up to 20%, and Brad Flora said in a talk the library dates to 2023 that founders raising millions of dollars on SAFEs sell only ten to twenty percent (A guide to seed fundraising; How startup fundraising works).
Breaks: the first email asks for a call; Michael Seibel says the first email should aim for a reply and a back-and-forth, and that founders reach for too much when it asks for a meeting, a call or an investment (How to cold email investors).
Breaks: a deck built from screenshots; Kevin Hale, writing about Demo Day slides, says he usually hates screenshots because they are almost always illegible, complex and non-obvious (How to design a better pitch deck).
Disagrees: Ralston says graphics, charts and screenshots in a deck are more powerful than many words (A guide to seed fundraising).
Source: A guide to seed fundraising, https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising
Source: How startup fundraising works, https://www.ycombinator.com/library/Il-how-startup-fundraising-works
Source: How to cold email investors, https://www.ycombinator.com/library/65-how-to-cold-email-investors
Source: How to design a better pitch deck, https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck
Not in the corpus: whether $1M is the right amount for this company, and what a seed round looks like outside Silicon Valley. This is a report of published positions and not investment advice.
```

## When to use it

Use it when you want an answer from a known source in place of an average of all startup advice: before quoting a partner, when someone says "YC says" and you want the person and the piece, or when a plan should be checked against a stated position. Do not use it as a lawyer, an accountant or an investor, and do not read its silence as Y Combinator's: it read 88 pieces of a library of more than 400.

## Invoke with

`/khe-brain-yc [question | test <plan, deck or decision> | who said <line> | sources]`

Or ask in your own words: "what does YC say about", "what would Paul Graham say", "who said that", "do the partners agree on".

## Before and after

Before: "what does YC say about how fast we should grow?" returns four confident paragraphs headed "YC recommends", a number with no year and no link.

After: three sentences that give Paul Graham's 2012 figures for a company in the batch, the footnote that limits them, and Divya Bhat's 2023 repeat of two of them, each ending in its title; then two `Source:` lines; then `Not in the corpus:` and the part no piece answers.

## Example prompts

- What does YC say about splitting equity with a co-founder?
- Pressure-test my seed plan: sell 30% for $1M, a deck of screenshots, a cold email asking for a call.
- Who said "default alive", and what did they mean by it?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, lists every piece it cites, names someone who speaks in every piece it cites, pins no view on "YC", gives no sentence about a person without a piece, keeps quotes under 15 words, uses no hedge word and no "would", and ends with `Not in the corpus:`. The self-test also proves that every claim in the theme files cites a piece in the sources table and names one of its speakers.

What it does not prove: that a cited piece says what the sentence claims, that the right one of two speakers is named, that advice was kept at its stage, or that the corpus is current. It matches titles and names, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from question to file, the hard rules and the output format.
- `references/`: the corpus by the question a founder brings, in twelve theme files (`starting-and-ideas.md`, `co-founders.md`, `mvp-and-launch.md`, `users-and-product-market-fit.md`, `growth-and-metrics.md`, `pricing-sales-and-business-models.md`, `seed-fundraising.md`, `series-a-and-boards.md`, `money-legal-and-runway.md`, `hiring-and-managing.md`, `failure-and-founders.md`, `applying-to-yc.md`), each claim one line with its speaker, title and URL; `sources.md` (88 pieces, who speaks in each, dates, what was not read, how it was checked, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, a disagreement, a view that changed, a pressure-test, a silent topic and a "who said that".
- `teaching/`: thirteen bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. The essays, posts and talks stay their authors', under their own terms.

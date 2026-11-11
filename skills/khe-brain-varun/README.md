# khe-brain-varun

Answers startup, content, career and AI questions from what Varun Mayya has said in 18 public videos, with the video and the minute named.

```bash
npx skills add HKTITAN/skills --skill khe-brain-varun
```

## Credit

This is Harshit Khemani's reading of Varun Mayya's public videos. Varun Mayya did not write it, review it or endorse it. Watch him directly in the [Kata playlist](https://www.youtube.com/playlist?list=PLSAVyiM48sqvzLBEbPqD8TZpfu5UyzO9t) on his channel. When this skill and a video disagree, the video is right. Every sentence here is a paraphrase; the few quotes are under 15 words each and come from automatic captions.

## What it does

- Answers a question with the claim, the video it comes from, the time it is said and a link that opens there.
- Pressure-tests a plan, a pitch or a career decision against his stated positions, one line per position.
- Says "the videos read do not cover this" when the corpus is silent, and lists what was not read.
- Reports both sides where two talks disagree or he says he changed his mind, with dates.
- Keeps each claim in its context: Aeos, his games studio, Indian startups, his own employees, his own career.
- Never drafts and never decides. It reports his positions and stops.

## The corpus

18 videos, 17 hours 40 minutes, read in full from YouTube's automatic captions on 2026-11-11:

- The 15 videos of his Kata playlist, from Kata 1 (21 December 2025) to Why Belief Matters More Than Power and Money (3 November 2026).
- Three podcasts where he is the guest: PGX Ideas (18 March 2026), KK Create with Achina Mayya (18 October 2026) and Masters' Union (29 October 2026).

That is 1,378 cited claims across 12 theme files (2,274 timed citations in all), a glossary of 274 of his terms and frameworks, 21 disagreements, 18 changes of mind he states himself and 27 figures that differ by video.

Not read: his books, his posts, his short videos and every other podcast. His Substack held one placeholder post. varunmayya.org is a profile built by a third party and is cited only for what that page states.

## When to use it

Use it when you want an answer from a known source in place of an average of everything: before quoting him, when someone says "Varun says" and you want the video and the minute, or when a plan should be checked against a stated position. Do not use it to make the decision or to write the post.

## Invoke with

`/khe-brain-varun [question | test <plan or decision> | who said <line> | sources]`

Or ask in your own words: "what would Varun say about", "which Kata was that", "pressure-test my plan against Varun".

## Before and after

Before: "what would Varun Mayya say about raising money?" returns four confident paragraphs in his voice, a number he never gave and no link.

After: two sentences on why he bootstrapped Aeos and his one condition for raising, each ending in a citation such as `(Kata 1 at 12:58)`; two `Changed:` lines for the view of investors he reversed; then `Source: Kata 1, https://www.youtube.com/watch?v=9NjA41wShTI`; then `Not in his videos:` and the part no video answers.

## Example prompts

- What would Varun say about spending a year on the product before any marketing?
- Pressure-test this against Varun: I am keeping an MBA, a job and a side startup open for a year.
- Which Kata has the line about complexity being for idiots?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, gives a time for every video it cites, lists every video it cites, gives no sentence marked as his without a video, keeps quotes under 15 words, uses no hedge word and no "he would", and ends with `Not in his videos:`. The self-test also proves that every citation in the theme files names a video in the sources table and that its time matches its link.

What it does not prove: that he says what the sentence claims at that minute (times are good to about two minutes; `references/sources.md` says how the lines were checked), that a quote is word for word (the captions mishear), that the speaker was him and not a host, that a line was kept in its context, or that the corpus is current. It matches titles and times, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from theme to file, the hard rules and the output format.
- `references/`: `core.md` (the thesis, fourteen ideas and his method); the corpus by theme (`building-a-company.md`, `distribution-and-content.md`, `brand-and-marketing.md`, `risk-luck-and-bets.md`, `projects-and-simplicity.md`, `leading-teams.md`, `hiring-and-getting-hired.md`, `careers-belief-and-attempts.md`, `money-status-and-the-rich.md`, `ai-and-the-future-of-work.md`, `india.md`, `aeos-and-his-story.md`), each claim one line with its video, time and link; `glossary.md`; `sources.md` (the videos, dates, one-line arguments, what was not read, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, two pressure-tests, a silent topic, a disagreement and a "who said that".
- `teaching/`: twelve bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. His videos stay his.

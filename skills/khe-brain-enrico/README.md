# khe-brain-enrico

Answers how tech products are designed, engineered and built from what Enrico Tartarotti has said in the 88 long videos on his YouTube channel, with the video and the time named.

```bash
npx skills add HKTITAN/skills --skill khe-brain-enrico
```

## Credit

This is Harshit Khemani's reading of Enrico Tartarotti's public videos. Enrico Tartarotti did not write it, review it or endorse it. Watch him directly on [his channel](https://www.youtube.com/@enricotartarotti/videos). When this skill and a video disagree, the video is right. Every sentence here is a paraphrase; the few quotes are under 15 words each and come from automatic captions.

## What it does

- Answers a question with the claim, the video it comes from, the time it is said and a link that opens there.
- Pressure-tests a design, a product decision or a product plan against his stated positions, one line per position.
- Says "the videos read do not cover this" when the corpus is silent, and lists what was not read.
- Reports both sides where two videos disagree or he says he changed his mind, with dates.
- Keeps each claim with its product and its year: a point about Figma, about a loading screen or about his own product stays there, and a prediction or a view on AI carries the year he said it.
- Reports a product fact as what he says in that video, never as a checked fact about the product.
- Never builds, never drafts and never decides. It reports his positions and stops.

## The corpus

88 videos, 17 hours 57 minutes, about 219,000 words of captions, read in full on 2026-11-15. They are every video on the Videos tab of his channel that day, from I'm Switching to English and Starting From Scratch (24 August 2021) to Something New Is Coming (15 November 2026). 86 were read from YouTube's automatic English captions, one from a transcript of its audio made on the reader's own computer because it has no captions, and one, spoken in Italian, through YouTube's machine translation.

That is 1,435 cited claims: 1,406 across the 12 theme files and 29 in `core.md`, with 1,864 timed citations between them. Beside them sit a glossary of 375 of his terms, frameworks and borrowed laws, 19 disagreements, 5 changes of mind he states himself and 9 figures that differ by video.

How it was checked: every cited claim in the theme files, the glossary and the disagreements file was checked against the caption text at its cited time by a reviewer who had not written it. About one in seven carried a detail the captions did not support at that time and was cut back to what the captions carry. None stated the opposite of what he said.

Not read: his 24 short videos, his posts, his newsletter, the pages of his own products and his guest appearances on other channels and podcasts. Sponsor reads inside the videos are left out, and nothing behind a login or a payment was used.

## When to use it

Use it when you want an answer from a known source in place of an average of everything: before quoting him, when someone says "Enrico says" and you want the video and the time, or when a design or a plan should be checked against a stated position. Do not use it to build the screen, make the decision or write the post.

## Invoke with

`/khe-brain-enrico [question | test <design, product or plan> | who said <line> | sources]`

Or ask in your own words: "what would Enrico say about", "which video was that", "pressure-test my design against Enrico".

## Before and after

Before: "what would Enrico Tartarotti say about spinners?" returns four confident paragraphs in his voice, a statistic stated as fact and no link.

After: three sentences on why he calls the spinning wheel a poor answer to a wait and why he says skeleton loaders feel shorter, each ending in a citation such as `(The Sneaky Psychology Of Loading Screens at 3:45)`; two `Also:` lines for what he added in 2023 and 2026; then `Source: The Sneaky Psychology Of Loading Screens, https://www.youtube.com/watch?v=g8uhdyLTAvY`; then `Not in his videos:` and the part no video answers.

## Example prompts

- What would Enrico say about showing a spinner while my dashboard loads?
- Pressure-test this against Enrico: every sidebar item animates in, and the push notification greets the user by name.
- Which video has the line about the psychology of waiting?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, gives a time for every video it cites, lists every video it cites, gives no sentence marked as his without a video, keeps quotes under 15 words, uses no hedge word and no "he would", and ends with `Not in his videos:`. The self-test also proves that every citation in the theme files names a video in the sources table and that its time matches its link.

What it does not prove: that he says what the sentence claims at that time (a time is the start of a 45-second caption block; `references/sources.md` says how the lines were read), that a quote is word for word (the captions mishear), that the speaker was him and not a team member, a clip or a sponsor read, that a line was kept with its product and its year, that a product fact he gives is true, or that the corpus is current. It matches titles and times, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from theme to file, the hard rules and the output format.
- `references/`: `core.md` (the thesis, thirteen ideas and his method); the corpus by theme (`hidden-details-and-simplicity.md`, `psychology-and-persuasion.md`, `waiting-motion-sound-and-feel.md`, `attention-feeds-and-notifications.md`, `ai-products-and-models.md`, `interfaces-past-and-future.md`, `devices-and-life-after-the-phone.md`, `why-products-win.md`, `business-models-and-platforms.md`, `building-products-and-startups.md`, `youtube-and-creator-work.md`, `his-story-and-working-life.md`), each claim one line with its video, time and link; `glossary.md`; `sources.md` (the videos, dates, one-line arguments, what was not read, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, a design tested, a product plan tested, a silent topic, a disagreement and a "who said that".
- `teaching/`: twelve bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. His videos stay his.

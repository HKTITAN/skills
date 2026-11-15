# khe-brain-harshit

A brain of Harshit Khemani. It answers the way Harshit Khemani thinks, from every post he made on X and LinkedIn, with the post named, and drafts posts for [khe.money](https://www.khe.money) in his current voice that rest only on views he has actually posted.

```bash
npx skills add HKTITAN/skills --skill khe-brain-harshit
```

In Claude Code the brains plugin also gives it as the command `harshitkhemani` (see the root README).

## What it does

- Answers a question with his position, the post it comes from, its date and a link.
- Drafts a khe.money post in the voice he has written in since mid-2025: lowercase, one idea a line, a plain hook, a story from his own work, a short closing line, no hashtags. Under the draft, one `Rests on:` line per view it takes, each with its post.
- Pressure-tests a plan against what he has posted, one line per position.
- Says "his posts do not take a position on this" when they do not, and a draft stops and asks rather than inventing one.
- Shows both sides where he changed his mind, with dates, and drafts from the later one.
- Keeps each line in its context: Smash&Clash, Campus Binge (where he leads Product & Design; the founder is Rishitabh Thapliyal), one tool, or a reply to one person.

## The corpus

His own X and LinkedIn exports of 13 November 2026, read on 15 November 2026: 7,853 items from December 2020 to November 2026. That is 1,951 posts, self-threads, long replies, two X articles and 199 LinkedIn posts read in full, and 5,902 short replies read for any view or story. 666 of those posts are cited across ten theme files, a glossary, a story timeline and a file of changes of mind. Every quote in them was checked by script against the post it cites.

Left out on purpose: direct messages (never opened), money, deal and deck numbers, the $SMASH token, and the names of his school and college. Not in the corpus: khe.money itself, Notion, and anything after 13 November 2026.

## When to use it

When another session needs to write as Harshit Khemani or answer for him and should not make anything up: a khe.money post, a reply to "what does Harshit Khemani think about X", or a check of whether a draft says something he never said. For posts across several platforms, use `khe-content-engine` and take the views from here.

## Invoke with

`/khe-brain-harshit [question | test <plan> | draft <topic> | who said <line> | sources]`

## Before and after

Before: "write a khe.money post about onboarding in Harshit's voice" returns a sentence-case essay with three emoji, a hashtag line and a view on B2B onboarding he never posted.

After: `Draft:`, then a lowercase post built on the Smash&Clash board zoom that replaced a tutorial, closing on one short line; then two `Rests on:` lines citing the 2026-09-13 post and the 2026-05-12 post on motion and feedback; then their `Source:` lines; then `Not in his posts:` naming what the brief asked for that no post covers.

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # an answer or a draft, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its fixtures, and every citation against sources.md
```

What it proves: an answer opens with the answer, cites only posts in `references/sources.md` with the right URL, gives no sentence marked as his without a post, keeps quotes under 15 words, uses no hedge and no "he would", and ends with `Not in his posts:`. A draft has a `Rests on:` line, no hashtag, one emoji at most, no em dash, and mostly lowercase lines.

What it does not prove: that a post says what the sentence claims, that a draft takes no position its `Rests on:` lines miss, or that a draft does not copy one of his sentences. [verify](references/verify.md) and [review](references/review.md) cover those by hand.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the hard rules and the output format.
- `references/`: `core.md` and `voice.md`; the theme files (`product-and-design.md`, `games-and-smashandclash.md`, `ai-and-agents.md`, `tools-and-workflow.md`, `building-and-startups.md`, `distribution-and-audience.md`, `learning-work-and-age.md`); `his-story.md`; `glossary.md`; `disagreements.md`; `silent.md`; `sources.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are his to edit.
- `examples/`: six gold replies: a direct question, a pressure-test, a draft, a silent topic, a change of mind and a "who said that".
- `teaching/`: seventeen bad/good pairs, each named for the gate line its bad half raises.
- `scripts/brain-check.mjs`: the gate. Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT.

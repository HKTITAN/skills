# khe-brain-gary

Answers marketing, business, career and mindset questions from what Gary Vaynerchuk has said in 145 long videos and written in 584 articles on his site, with the piece, the minute and the year named.

```bash
npx skills add HKTITAN/skills --skill khe-brain-gary
```

In Claude Code the brains plugin also gives it as the command `gary-vaynerchuk` (see the root README).

## Credit

A reading by Harshit Khemani, not endorsed by Gary Vaynerchuk. He did not write it, review it or endorse it. Watch and read him directly on [his channel](https://www.youtube.com/@garyvee/videos) and at [garyvaynerchuk.com](https://garyvaynerchuk.com/). When this skill and a piece disagree, the piece is right. Every sentence here is a paraphrase; the few quotes are under 15 words each and come from captions or from the article text.

## What it does

- Answers a question with the claim, the video and the time it is said or the article it is written in, the year, and a link that opens there.
- Puts the year on every line about a platform, an app, NFTs, crypto, cards, AI, a market or a figure about his companies, and gives the newest dated line in the corpus as the newest, never as his view today.
- Pressure-tests a plan, a pitch or a content strategy against his stated positions, one line per position.
- Says "the corpus does not cover this" when it is silent, and lists what was not read.
- Reports both sides, in date order, where his position moved or two of his positions pull against each other.
- Keeps other voices out: a host's, guest's, caller's or team writer's line is never given to him.
- Reports what he says about VaynerMedia, VeeFriends, Wine Library and his other companies as his pitch and his own figures.
- Never drafts, never advises and never decides. A money, collectibles, health or parenting line is a report of what he said in a year.

## How it runs

![khe-brain-gary's flow: khe-auto sends a question about attention that names Gary Vaynerchuk here, and a question about starting up to khe-brain-varun or khe-brain-yc; the question is answered from 16 theme files holding 1,902 claims from 145 videos and 584 articles, checked for silence and disagreement, cited with the piece, the minute and the year, closed with what is not in the corpus, and gated by brain-check; writing the post goes to khe-content-engine](assets/flow.svg)

## Used

```text
/khe-brain-gary What has Gary Vee said about LinkedIn for a B2B company, and is that still his view?
```

A reply that passes the gate, built from the LinkedIn lines in `references/platforms-year-by-year.md` and `references/disagreements.md`:

```text
His LinkedIn call moved with the year: in 2013 he said he had been down on LinkedIn for half a decade and was starting to like it, because it had become a media company (Get Off Your Ass & Get Noticed with Gary Vaynerchuk Chase Jarvis Live ChaseJarvis at 15:45). In January 2019 he called 2019 "the year of LinkedIn" and told B2B businesses to publish an enormous amount of content there every day (6 Sales Tips on How to Sell Without Selling in 2019). The newest dated line in the corpus on LinkedIn for a business is from December 2025, when he said LinkedIn acts like Facebook did in 2015 (This Is What AI Changes Forever at 4:30).
Changed: in March 2019 he said LinkedIn's organic reach was incredible and that it would go away in a year (The 79 / 21 Rule to Build a Long Term Business).
Changed: in 2021 he told B2B companies to run three to four original LinkedIn ads a day, and said LinkedIn ads were worse than 24 months earlier as more people had come in (35 Minutes of Marketing Strategy You Can Start to Use Today Sage Summit 2021 at 9:00; 35 Minutes of Marketing Strategy You Can Start to Use Today Sage Summit 2021 at 9:45).
Also: in August 2025 he said LinkedIn was disproportionately the biggest opportunity in social media marketing for B2B (AI + Social Media = The Biggest Opportunity of Our Lifetime at 1:06:00).
Source: Get Off Your Ass & Get Noticed with Gary Vaynerchuk Chase Jarvis Live ChaseJarvis, https://www.youtube.com/watch?v=BT_vv5moEm8&t=945s
Source: 6 Sales Tips on How to Sell Without Selling in 2019, https://garyvaynerchuk.com/6-sales-tips-on-how-to-sell-without-selling/
Source: This Is What AI Changes Forever, https://www.youtube.com/watch?v=X4tgfKUPVrI&t=270s
Source: The 79 / 21 Rule to Build a Long Term Business, https://garyvaynerchuk.com/the-79-21-rule-to-build-a-long-term-business/
Source: 35 Minutes of Marketing Strategy You Can Start to Use Today Sage Summit 2021, https://www.youtube.com/watch?v=Ie_pcLsdb5E&t=540s
Source: AI + Social Media = The Biggest Opportunity of Our Lifetime, https://www.youtube.com/watch?v=OQwHXDgKaT8&t=3960s
Not in the corpus: how LinkedIn performs for your company now, a 2026 line on LinkedIn for a business, and his posts on LinkedIn itself, which were not read. The call for your company is yours.
```

## The corpus

729 pieces, fetched on 2026-11-21:

- 101 long videos from his own YouTube channel, 2015 to 2026: keynotes, interviews, #AskGaryVee episodes, DailyVee and long solo videos, chosen from the 1,799 on the channel that run 12 minutes to 2 hours 15 minutes.
- 25 guest appearances on other people's shows, 2012 to 2026, each from the host's own channel.
- 8 episodes of his podcast, The GaryVee Audio Experience, 2020 to 2025, from its YouTube playlist.
- 11 more keynotes and talks, 2008 to 2024, chosen to fill the years and the audiences the rest leaves thin.
- 584 articles from garyvaynerchuk.com, 2013 to 2026: every post on the site's sitemap with 400 or more words that is not a transcript and could be read on the day.

The 145 videos run 124.2 hours and 1,397,236 words of captions; 65 have captions uploaded by the channel or the host and 80 have YouTube's automatic English captions. The articles run 522,931 words.

That is 1,902 cited claims across 16 theme files, with `core.md` over them, a glossary of 405 of his terms, rules, shows and projects, 28 positions that moved with the year, 12 standing tensions between his positions, and 57 topics the corpus does not cover.

How it was checked: every cited line in the references was checked against the raw captions or the article text by a reviewer who had not written it, over five rounds; [references/sources.md](references/sources.md) has the numbers and what the check cannot show.

Not read: his books (only what he says about them in these pieces is in), Shorts, clips and videos under 12 minutes, his posts on X, LinkedIn, Instagram, TikTok and elsewhere, the audio-only podcast feed of about 2,000 episodes, his other guest appearances, the videos and posts outside the sample, the 95 posts that returned "Page Not Found", and anything behind a login or a payment. Sponsor reads are left out.

## When to use it

Use it when you want an answer from a known source in place of an average of everything: before quoting him, when someone says "Gary Vee says" and you want the piece and the year, or when a plan should be checked against a stated position. Do not use it to make the decision, to get advice on money or collectibles, or to write the post.

## Invoke with

`/khe-brain-gary [question | test <plan or pitch> | who said <line> | sources]`, or the brains plugin's `gary-vaynerchuk` command with the same arguments.

Or ask in your own words: "what would Gary Vee say about", "which keynote was that", "pressure-test my plan against Gary Vee".

## Before and after

Before: "what would Gary Vee say about LinkedIn?" returns three paragraphs in his voice, "LinkedIn is the biggest opportunity" as a rule with no year, and no link.

After: three sentences on how his LinkedIn call moved from 2013 to December 2025, each ending in a citation such as `(This Is What AI Changes Forever at 4:30)` for a video or `(6 Sales Tips on How to Sell Without Selling in 2019)` for an article; two `Changed:` lines for 2019 and 2021 and one `Also:` line for August 2025; a `Source:` line per piece; then `Not in the corpus:` and the part no piece answers.

## Example prompts

- What has Gary Vee said about LinkedIn for a B2B company, and is that still his view?
- Pressure-test this against Gary Vee: one polished video a week on YouTube and nothing anywhere else.
- Which video has the line about macro patience and micro speed?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # a reply, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures, and the corpus against its sources
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply opens with the answer, has at least one `Source:` line, cites only titles that are in `references/sources.md` with the right URL, gives a time for every video it cites and none is needed for an article, lists every piece it cites, gives no sentence marked as his without a piece, puts a year on every sentence marked as his that names a platform or a product, keeps quotes under 15 words, uses no hedge word and no "he would", and ends with `Not in the corpus:`. The self-test also proves that every citation in the theme files names a piece in the sources table and that each video's time matches its link.

What it does not prove: that the piece says what the sentence claims (a time is the start of a caption block), that a quote is word for word (the captions mishear), that the speaker was him and not a host, guest, caller or audience member, that an article was written by him and not his team, that the year is the right one, that a line from one year was not stretched into his view today, that a figure he gives is true, or that the corpus is current. It matches titles, times and years, never meaning. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from theme to file, the hard rules and the output format.
- `references/`: `core.md` (the one sentence, sixteen ideas, his method, what moves with the year and how he talks); the corpus by theme (`attention-and-media-shifts.md`, `platforms-year-by-year.md`, `content-and-documenting.md`, `brand-marketing-and-sales.md`, `starting-and-running-a-business.md`, `patience-hustle-and-work.md`, `self-awareness.md`, `happiness-judgment-and-accountability.md`, `kindness-and-empathy.md`, `leadership-hiring-and-culture.md`, `careers-college-and-your-twenties.md`, `family-and-parenting.md`, `his-story-and-businesses.md`, `collectibles-flipping-and-nfts.md`, `ai-and-new-technology.md`, `money-and-investing.md`), each claim one line with its year and its video time and link or its article URL; `glossary.md`; `sources.md` (every piece, its date, how each group was chosen, how it was read, what was not read, how to refresh); `disagreements.md`; `silent.md`; `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: the gold replies, one per job.
- `teaching/`: bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `commands/gary-vaynerchuk.md`: the brains plugin's `gary-vaynerchuk` command, which reads this skill's `SKILL.md`.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT, for this skill's own text and code. His videos and articles stay his.

---
title: verify
summary: The last pass on a reply. The gate first, then yes or no questions answered from the reply and from the cited lines opened again, then twelve test questions with the answer each must produce.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the question as the user typed it, the cited lines in the theme files opened again, and gate output run after the last edit. Never answer from what you remember him saying. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Save the reply as a `.txt` file and run, from this skill's folder:

```sh
node scripts/brain-check.mjs reply.txt --gate
node scripts/brain-check.mjs examples --gate
node scripts/brain-check.mjs --self-test
```

- The first command ends `brain-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the cited piece says what the sentence claims.
- After editing a gold reply, the second command ends `brain-check passed`?
- After editing a theme file, [sources](sources.md), [silent](silent.md) or the gate, the third command ends `self-test passed`? It checks every citation in the corpus against the sources table, every time against its link and its video's length, and that no word the silent table watches appears in a cited claim of a theme file.

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The source (first, because nothing after it matters if this is wrong)

- For each sentence that cites a piece: open the theme file, find the line, and read it. Does the line say what the sentence says, with nothing added?
- Is every number in the reply in that line, with the same unit, and with its date when [disagreements](disagreements.md) lists the figure under Figures that change by source?
- Does the title and the time in the reply match the theme file's line, character for character? A video is cited as `(Title at m:ss)` and an article as `(Title)`.
- Is each quote in the reply one of the quotes in the theme files, character for character, and under 15 words?
- Is the line his? A host's, a guest's or a caller's line is never his, and a sponsor read is never his position. The captions have no speaker labels, so the theme line's context decides.
- Is an article reported as what the article says? Some are team-written guides under his byline, and some are written by named colleagues.
- Is any sentence a position with no "he" in it, written that way to get past the gate? Give it its piece or delete it.

## Year, pitch and advice

- Does every line about a platform, an app, NFTs, crypto, sports cards, AI, a market or a company figure carry the year he said it, in the same sentence? A year in the title of a cited piece does not count.
- Is a line from one year given as a view he holds today, or as a rule for another platform? Say it was his reading in that year.
- Is a pitch for VaynerMedia, VeeFriends, Wine Library, his events or his books reported as his own claim about his own product, with its year, and with his warning beside it where [disagreements](disagreements.md) gives one?
- Is a figure about his companies or other people's businesses reported as what he says, and never as a checked fact?
- Does a line on money or collectibles say only what he said he bought, rated or warned, with its year and his own disclaimer? The reply never tells anyone to buy, sell, hold or pay a price.
- Does the reply write as him anywhere, in the first person or as a post or caption in his voice? It reports. It never writes as him.

## Silence and scope

- Open [silent](silent.md). Is the question's topic in the table? Then the first sentence says the corpus does not cover it.
- Does a `Nearest:` line stop at what the piece says, with no step from there to a view?
- Does `Not in the corpus:` name the part of the question that got no answer, in the user's own terms?
- Was the question about something said after the date in [sources](sources.md), or in a short video, a post, a book, the audio-only podcast feed or paid material? Then the reply says that was not read.

## Disagreement and dates

- Open [disagreements](disagreements.md). Does the question touch a row? Then both sides are in the reply, each with its piece and year, reported the way the row's last line says.
- Is a view he says he changed reported as a change, with the before and the after, and never with the earlier half given as his view today? Where the row says he does not say he changed, the reply says that too.
- Has the reply picked a winner he did not pick?

## The reply (last)

- Does the answer come first, in two or three sentences?
- Is there one `Source:` line per piece cited, with the title and URL exactly as the sources table has them?
- Is every `Source:` line used by a sentence?
- Is the last line `Not in the corpus:`?
- For a pressure-test: is the largest fault first, and does each `Breaks:` or `Holds:` line say what the plan does and then what the piece says?
- Does the reply decide nothing for the user? It reports his positions. The call is the user's.

## Test questions

Run these against the skill when it changes. Each question has the answer a good reply produces, the file that carries it and the pieces it cites. The theme line is the truth: open it, and when the table below and the line differ, the line wins.

### 1. Broad: what does he believe?

- Question: `what does Gary Vaynerchuk believe`
- A good reply gives the one sentence in [core](core.md): know yourself and bet on your strengths, go where attention is underpriced, give more than you ask, and play the long game with macro patience and micro speed. It cites the four pieces that line cites: My Biggest Weakness: Q&A; 2015 Gary Vaynerchuk Keynote - Online Marketing Rockstars at 9:00; Giving Without Expectation; How a $350000000+ Company's CEO Makes Decisions Decoder Podcast with Nilay Patel at 14:15.
- It fails when it picks one of the alternates in core as his single view, or adds a belief that no line carries.

### 2. Broad: attention for a small business

- Question: `how do I get attention for a small business`
- A good reply is `examples/direct-question.txt`: in 2015 everyone has one job, to grab attention, tell the story and then sell (2015 Gary Vaynerchuk Keynote - Online Marketing Rockstars at 15:45); in 2023 attention only buys the chance to tell people about the product (How a $350000000+ Company's CEO Makes Decisions Decoder Podcast with Nilay Patel at 42:00); in 2026 attention can be overpriced or underpriced with no general rule (If You're Not Posting You're Falling Behind at 9:45).
- Carried by [attention-and-media-shifts](attention-and-media-shifts.md), with the 2014 small business line from [content-and-documenting](content-and-documenting.md) (How Small Businesses Can Compete With Fortune 500s).
- It fails when it gives a plan or a budget. The corpus gives his lines, not a plan for this business.

### 3. Broad: hiring

- Question: `what does he ask in a hiring interview`
- A good reply says that in 2015 he wrote that his main question is where the candidate wants their career to go (5 Things You Need To Do When Hiring Someone), and that in 2015 he said he spends the first 15 minutes making the candidate cozy (Gary Vaynerchuk Interview on the Startup Grind LA 2015 at 1:26:15).
- Carried by [leadership-hiring-and-culture](leadership-hiring-and-culture.md), the section on whom he hires and how he interviews.
- It fails when it adds a question list, or presents the interview host's wording as his.

### 4. One named piece

- Question: `what does The 79 / 21 Rule to Build a Long Term Business say`
- A good reply says that in 2019 he gave the rule as about 79 percent of time on the platform bringing the most value and about 21 percent tasting others, and that diversifying attention is the only way to a long-term business. It cites the article with no time (The 79 / 21 Rule to Build a Long Term Business) and gives its source line.
- Carried by [attention-and-media-shifts](attention-and-media-shifts.md), the section on day trading attention and underpriced attention; the same article carries the 2019 lines on where his own effort went in [platforms-year-by-year](platforms-year-by-year.md), and each of those lines names a platform and so carries its year.
- It fails when a platform line from the article is given without 2019, or when the rule is given as his advice for every platform today.

### 5. Dated platform

- Question: `what did he say about TikTok, in 2020 and in 2023`
- A good reply gives the two years in order. In 2020 he said TikTok had the best organic reach of any platform in his career and was already declining (How to Get Over Your Fear of Judgment on the Internet Senior Bowl Summit Keynote 2020 at 52:30). In January 2023 he said its organic reach was subsiding as more people and ads came in (The Main Reason Why Brand is Built on Social Lost in Found Podcast at 3:45).
- Carried by [platforms-year-by-year](platforms-year-by-year.md), the section on TikTok and Musical.ly. The model for the shape is `examples/dated-platform.txt`.
- It fails when it merges the years into one view of TikTok, or leaves a year off.

### 6. A change of mind

- Question: `did he change his mind about Snapchat Stories`
- A good reply says yes, in his own words: in 2013 he called Snapchat Stories high-friction and a bad fit, in 2014 he said he was wrong, and in January 2016 he said every business should take Snapchat seriously (I Made a Bad Call on Snapchat but Here's Why I'm Totally Cool With It; Deploying Against the Snap: Takeaways from Snapchatting in Vegas & Ces). It never gives the 2013 verdict as his view without the 2014 line.
- Carried by [disagreements](disagreements.md), the section on Snapchat, from Stories to Spotlight.
- It fails when only the first half is reported.

### 7. A standing tension

- Question: `is he for patience or for speed`
- A good reply is `examples/disagreement.txt`: in 2015 and 2016 he called too much patience a fault (AskGaryVee Episode 100 The Live Show at 32:15; The Ultimate Advice Every Entrepreneur Needs To Hear Gary Vee & Lewis Howes - School of Greatness at 37:30), in 2019 he said he is slow in his mind and fast in his actions (13 Core Business Principles to Start Immediately Auckland Keynote 2019 at 6:00), and in 2021 he gave macro patience and micro speed as one combination (What You're Misunderstanding about Patience: Road to Twelve and a Half series). It says the corpus holds no line where he says he changed his mind.
- Carried by [disagreements](disagreements.md), the section on patience or speed.
- It fails when it picks a winner.

### 8. A glossary term

- Question: `what does he mean by jab, jab, jab, right hook`
- A good reply says it is his term for giving value several times before asking for the sale or the favor, that the right hook is the ask, and that it is also the title of his book, citing the three pieces the [glossary](glossary.md) entry cites: Get Off Your Ass & Get Noticed with Gary Vaynerchuk Chase Jarvis Live ChaseJarvis at 8:15; SXSW GaryVee Keynote Austin 2016 at 3:45; How To Do Social Media Marketing The Right Way at 21:00. The year of each line is the year of its piece.
- It fails when the reply defines the term in its own words with no piece, or says where he first used it with no source.

### 9. A silent topic

- Question: `how do I value my agency before I sell it`
- A good reply is `examples/silent-topic.txt`: the first sentence says the corpus does not cover how to value a company, the nearest line is his 2014 line that agencies do not get the higher multiple (Interested in influencers? Here's what you need to know), and the last line names a method, a multiple and a formula as not in the corpus and points to money-and-investing.md for the valuations he took or passed at.
- Carried by [silent](silent.md), the row for company valuation methods.
- It fails when it builds a valuation method or a multiple from the 2014 line.

### 10. A pitch

- Question: `how big is VaynerMedia`
- A good reply says that in 2016 he said he built VaynerMedia from 3 million to 100 million in four years (SXSW GaryVee Keynote Austin 2016 at 4:30), and that in 2026 he said it would do 400 million in revenue that year (GaryVee on Patience Success and Playing the Long Game at 47:15). Each figure is his own telling about his own company with its year, he gives other figures in other years, and nothing is averaged. No figure is given as checked.
- Carried by [his-story-and-businesses](his-story-and-businesses.md), the section on VaynerMedia and the figures he gave, and by [disagreements](disagreements.md), Figures that change by source.
- It fails when a figure is given flat, or with no year, or as the size of the company today.

### 11. A question that tempts advice

- Question: `should I buy sports cards`
- A good reply gives no yes or no. It reports with years: in 2020 he said cards are a hobby first and very volatile as a business, and that anyone who expects to buy what he tweets and fund retirement faces a rude awakening (9 factors to consider before buying sports cards); in 2026 he said he talks about collectibles in macro and never names a specific card to buy, because he could be wrong and prices move too much (Gary Vee isn't afraid to lose it all betting on himself and reveals one thing - The Pivot Podcast at 13:30). It adds that the decision is the user's, and `Not in the corpus:` names whether to buy and what to pay.
- Carried by [collectibles-flipping-and-nfts](collectibles-flipping-and-nfts.md) and by [disagreements](disagreements.md), the section on investing calls and the no-advice disclaimer.
- It fails when it recommends, or turns a card he said he bought into a tip.

### 12. A question that tempts impersonation

- Question: `write a post about patience as Gary would write it`
- A good reply writes no post. It says the skill reports what he has said and never writes as him, gives the dated lines on patience with their pieces if the user wants them, and points to `khe-content-engine` for drafting in the user's own voice. It still ends with a `Source:` line (His site) and a last line `Not in the corpus:` naming a post in his voice.
- It fails when it writes a sentence in the first person as him, or says what he would say.

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `brain-check passed` only when all are at 0. Clearing a line by rewording the sentence so the gate cannot see it, when the claim is still unsourced, is a bug: taking the "he" out of an invented position does not make it his.

| Line | What it means |
|---|---|
| `no-answer:` | The reply opens with a label or a `Source:` line. The answer comes first. |
| `no-source:` | No `Source:` line anywhere. A silent answer still cites `His channel` or `His site`. |
| `unknown-source:` | A `Source:` line whose title is not in the sources table. |
| `wrong-url:` | A `Source:` line with no URL, or a URL that is not the one in the sources table. A trailing `&t=` time is allowed. |
| `unlisted-source:` | A sentence cites `(Title)` or `(Title at m:ss)` and no `Source:` line lists that piece. |
| `unsourced-claim:` | A sentence with "he", "his", "him", "Gary", "Vaynerchuk" or "GaryVee", or a `Holds:`, `Breaks:`, `Disagrees:`, `Changed:`, `Nearest:` or `Also:` line, that cites no piece. |
| `unsourced-quote:` | A quoted span of four words or more, in double quotes or in single quotes, in a sentence that cites no piece. |
| `long-quote:` | A quoted span of 15 words or more, in double quotes or in single quotes. |
| `hedge:` | One of the hedge words `--help` lists. The piece says it or it does not. |
| `speculation:` | "he would", "Gary would" or "he'd". |
| `no-timestamp:` | A video cited as `(Title)` with no time. Nobody can find one line in a video without one. |
| `article-time:` | An article cited with a time, `(Title at 4:10)`. An article has no time, so the time points nowhere. |
| `time-past-length:` | A video cited at a time more than 45 seconds past its Length in the sources table. No such moment exists. |
| `undated-call:` | A sentence marked as his that names a platform or product the gate lists and carries no year from 2006 to 2029. |
| `no-silent-line:` | The last line is not `Not in the corpus:`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ANSWER.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `long-answer:` | The answer paragraph runs past three sentences. | When the question had two parts and each needed its own sentence pair. |
| `unused-source:` | A `Source:` line for a piece no sentence cites. | Never. Cite it in a sentence or delete the line. |
| `too-many-quotes:` | More than two quotes of four words or more. | Only for a "who said that" about several lines at once. |
| `nothing-left-out:` | `Not in the corpus:` claims nothing was left out. | Almost never. Name what was not read. |
| `silent-topic:` | A sentence marked as his, with a citation, uses a word from the silent table. | When the cited line really is about that word. Open the line and check. |
| `url-time-mismatch:` | A `Source:` link whose `&t=` seconds are within 60 seconds of no time the reply cites for that video, so the link opens somewhere the answer does not point. | Never. Set `&t=` to the cited time in seconds. |

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with a link or a label (`no-answer:`) | Move the answer to the top: two or three sentences, then the labelled lines, then the sources |
| A sentence that begins "He thinks" with no piece (`unsourced-claim:`) | Find the line in a theme file and add `(Title at m:ss)` or `(Title)`. If no line exists, move the point to `Not in the corpus:` |
| A title the gate does not know (`unknown-source:`) | Check the spelling and the capitals against the sources table. If the piece is not there, it was not read: say so and remove the claim |
| A link that is nearly right (`wrong-url:`) | Copy the URL from the sources table. Never type one from memory |
| A video cited with no time (`no-timestamp:`) | Copy the time from the theme file's line. If the line has none, it is not a line in the corpus |
| An article cited with a time (`article-time:`) | Cite it as `(Title)`. An article has no time |
| A video time past its length (`time-past-length:`) | Copy the time from the theme file's line, and check it against the Length in the sources table |
| A `Source:` link that opens away from the cited time (`url-time-mismatch:`) | Set `&t=` to the cited time in seconds |
| "probably", "likely", "might" (`hedge:`) | Open the line. Write what it says, or write that the corpus does not cover it |
| "He would post daily" (`speculation:`) | Write what he said or did, in the past tense, with its year and its piece |
| A platform or product with no year (`undated-call:`) | Add the year of the piece, from the theme line. His platform calls change by year |
| A sentence in quotation marks that you cannot find in a theme file (`unsourced-quote:`) | It is not a verified quote. Paraphrase with a citation, or put the user's own words in backticks |
| A quote that runs on (`long-quote:`) | Keep the few words that matter, under 15, and paraphrase the rest |
| A piece cited in a sentence and missing below (`unlisted-source:`) | Add its `Source:` line from the sources table |
| The reply ends on a link (`no-silent-line:`) | Add `Not in the corpus:` and the part of the question no piece answers |
| A watched word in a cited sentence (`silent-topic:`) | Read the cited line again. If it is not about that topic, the sentence is an invention |
| A point about one platform written as a rule for every platform | Name the platform and the year, or take it out |
| A figure about VaynerMedia, VeeFriends or Wine Library stated flat | Write that he says it, in which piece and in which year. His figures were not checked |
| A line on cards, NFTs or crypto that reads as a tip | Report what he said he bought or warned, with its year and his disclaimer, and say the decision is the user's |
| Praise for a sponsor's product | Take it out. A paid segment is not in the theme files and is never his position |
| A line from a host, a guest or a caller | Leave it out. A line whose speaker cannot be placed is not his |
| Two pieces that pull apart, written as one view | Split them into two `Disagrees:` lines with their pieces and years |
| A line everyone attributes to him that is in no theme file | Say it is not in the pieces read, and that his short videos, posts and books were not read |
| The user asks what they should do | Give his positions with their pieces and stop. Say the decision is theirs |
| The user asks for a post as him | Write nothing as him. Report the lines, and point to `khe-content-engine` for their own voice |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ANSWER.md` |
| The gate passes and the answer still reads like you, not like the pieces | The gate matches titles and times, never meaning. Ask the first question in [review](review.md) |

## Not checked by the gate

The gate reads text. It never opens a piece and never sees the question.

- Whether a cited piece says what the sentence claims.
- A position stated as plain fact, with no "he", "his", "Gary", "Vaynerchuk" or "GaryVee" in the sentence.
- Whether a quote is word for word what he said. The captions are mostly automatic and mishear.
- A `Yours:` line. It is skipped on purpose: it is the installer's own position from [pov](pov.md) and is never his, so a guess at his view written there, such as `Gary would say ...`, is not caught. Read it by eye.
- Whether a line was his, or a host's, a guest's, a caller's or part of a sponsor read.
- Whether an article was written by him or by his team under his byline.
- Whether a line about one platform, or a prediction from one year, was stretched into a rule for every platform or a view he holds today. The gate only asks that a year be present, and only for the words it lists.
- Whether the year in a sentence is the right one.
- Whether two pieces that disagree were merged into one view.
- Whether the corpus is current. The sources table carries the date it was read.
- Whether the answer is useful, or answers the question that was asked.
- A "he" that means someone other than Gary Vaynerchuk. Write other people by name or role.

## Hand over

Write `ANSWER.md` beside the saved reply, after the last gate run, for any answer that will be published, quoted to someone else or used to settle a decision.

```md
# Answer: <the question, in the user's words>
Job: <answer | pressure-test | who said that>
Gold: <the example in examples/ this reply started from>
Corpus read: <the date in references/sources.md>
Lines used: <theme file> → <the claim line, pasted> (one per citation)
Gate: <the last line of brain-check.mjs --gate on the reply, pasted>
Candidates: <each candidate line> → <why it stands, or the fix>
Disagreement: <the row in disagreements.md, or "no row">
Review: <the reviewer's list> → <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is every citation in the reply listed under Lines used, with the line pasted and not retyped?
- Does Not checked say whether the pieces were opened at their times, or only this skill's reading of the captions?

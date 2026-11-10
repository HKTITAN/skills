---
title: x-algorithm
summary: What xAI's public repository says the X For You feed does, each statement tied to a file path at one commit, then what follows for a draft and what the repository does not tell you.
---

# The X For You feed, from its published code

A reading of `xai-org/x-algorithm`, the public repository for the X For You feed. It replaces growth folklore in the X platform node with what the published system states. Every statement is in this file's own words and names the file it rests on.

- Repository: <https://github.com/xai-org/x-algorithm>, Apache License 2.0 (as stated in its `LICENSE` and `README.md`).
- Commit read: `660cd7407c5726ec8d3aef27c32e1377b1c7e480`, committed 2026-11-10, read 2026-11-10.
- How it was read: the README in full, then the scoring, parameter and filter files it points to. Nothing in the repository was run.

This is a reading by an outsider. It is not written or endorsed by xAI or X. When the repository moves, read it again, change the commit above and the statements below, and add a line to [gotchas](gotchas.md).

## How to use this file

A platform node for X may state a ranking fact only when a statement below supports it, with the statement's number beside it. Anything else about reach on X goes under that node's `Confirm before relying on this` heading. The scope is the For You feed on X. It says nothing about any other platform, and nothing about search, notifications or the Following feed.

## What the repository states

### The pipeline

- **S1.** The feed is built for each request. Candidate posts come from accounts the viewer follows and from accounts they do not, and both kinds are ranked together by one model. (`README.md`, Overview)
- **S2.** Posts from followed accounts come from a service that holds recent posts in memory. Posts from other accounts come from an embedding retrieval model, from a clustering system that groups accounts and posts by who engages with what, and from a shared list of popular recent posts. (`README.md`, Candidate Sources; `home-mixer/sources/popular_posts_source.rs`)
- **S3.** The stages run in this order: read the viewer's context, fetch candidates, load their details, filter, score, keep the top of the list, filter again, then blend in ads and other items the model does not rank. (`README.md`, Request Path; `home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs`)
- **S4.** The viewer's own recent engagement history is the main input to the ranking model. (`README.md`, Request Path, step 1)

### What is removed before ranking

- **S5.** A post older than 48 hours is removed before scoring. (`home-mixer/params/config.rs`, `MAX_POST_AGE`; `home-mixer/filters/age_filter.rs`)
- **S6.** Reposts and replies from accounts the viewer does not follow are removed before scoring. (`README.md`, Filtering; `home-mixer/filters/oon_retweet_reply_filter.rs`)
- **S7.** Posts the viewer has already been shown, posts from accounts the viewer blocks or mutes, and posts that match the viewer's muted keywords are removed before scoring. (`README.md`, Filtering; `home-mixer/filters/`)
- **S8.** After the order is fixed, extra branches of one conversation are collapsed. (`README.md`, Post-Selection Filters; `home-mixer/filters/dedup_conversation_filter.rs`)

### What the ranking model predicts

- **S9.** For each post and viewer the model predicts how likely the viewer is to take each of many actions, instead of one relevance number. The actions include like, reply, repost, quote, three kinds of share, clicks on the post, a link, a photo or a profile, following the author, and time spent. (`README.md`, Scoring and Ranking; `xai-value-model/scoring.rs`)
- **S10.** The model also predicts negative actions: marking not interested, muting the author, blocking the author, reporting, and scrolling past without dwelling. (`README.md`, Scoring and Ranking; `xai-value-model/scoring.rs`)
- **S11.** During scoring, a post is judged against the viewer's context only. The other candidates in the batch do not change its score. (`README.md`, Key Design Decisions, 2)
- **S12.** Recent releases say the ranking model was changed to estimate time spent on a post better, and that retrieval is now also trained to surface posts people read to the end. (`README.md`, Notable Updates, October 8th and October 13th, 2026; `phoenix/xrex/models/loss_recsys.py`)

### How the predictions become a score

- **S13.** The score is a weighted sum: each predicted probability, or predicted amount of time, is multiplied by a weight and the products are added. Positive actions carry positive weights and negative actions carry negative ones. (`xai-value-model/scoring.rs`, `weighted_terms`; `README.md`, Scoring and Ranking)
- **S14.** The default weights are published. At this commit the positive defaults are: like 0.708, reply 5.0, repost 1.0, quote 5.0, share 2.118, share by direct message 5.0, share by copying the link 20.0, follow the author 4.0, click on the post 0.274, open a link 0.2, dwell 0.05, photo expand 0.05, dwell time 0.0075, click dwell time 0.385. Video open, profile click and video quality view are 0.0. (`home-mixer/params/param.rs`)
- **S15.** The negative defaults at this commit are: not interested -53.07, block the author -31.2, mute the author -58.8, report -234.0, not dwelled -0.02. (`home-mixer/params/param.rs`)
- **S16.** The repository warns against reading the weights as exchange rates between counts. A weight multiplies one viewer's predicted probability, never a tally of what other people did, and negative actions are weighted heavily because they are predicted to be rare. (`home-mixer/params/param.rs`, comment above the weights; `README.md`, August 14th, 2026)
- **S17.** The same comment says an action counts toward recommendations only when it happens on a post served in the home timeline; opening a post directly has no ranking effect. (`home-mixer/params/param.rs`, comment above the weights)
- **S18.** When the viewer and the author follow each other, the weight on the predicted reply is raised by a boost whose default is 15.0. The repository documents this change and its history as a worked example. (`home-mixer/params/param.rs`, `BidirectionalFollowReplyWeightBoost`; `xai-value-model/weights.rs`, `reply_weight_for`; `docs/BIDIRECTIONAL_BOOST_CHANGE.md`)

### Adjustments after the sum

- **S19.** Repeated authors are discounted. Each further post by an author who already appears higher in the same ranked list is multiplied by a factor that shrinks with each repeat and stops at a floor. The reranking service's defaults are a decay of 0.5 and a floor of 0.25, switched on. (`xai-value-model/scoring.rs`, `diversity_multiplier` and `author_pool_counts`; `vm-ranker/params.rs`)
- **S20.** A post from an account the viewer does not follow is multiplied by a factor below 1. The reranking service's default is 0.75. (`xai-value-model/scoring.rs`, `oon_applies`; `vm-ranker/params.rs`, `OonWeightFactor`)
- **S21.** Posts by authors with few impressions are lifted toward a target position. The defaults name a threshold of 200 impressions, a follower cap of 50000 and a maximum post age of 7200 seconds. (`README.md`, New-Author Boost; `home-mixer/params/param.rs`, `ColdStart` parameters)
- **S22.** A separate service then reorders the scored posts, trading a little score for less similarity between neighbouring posts. (`README.md`, Ranking; `vm-ranker/dpp.rs`)

### Visibility is a separate decision

- **S23.** Whether a post can be shown at all is decided apart from ranking, per post and viewer, with four answers: show it, show it with a notice, show it behind an interstitial, or drop it. (`README.md`, Labeling Path; `visibility-filtering/rules/`)
- **S24.** Some visibility rules drop a post only when it is a recommendation to someone who does not follow the author. The same post still reaches followers. Spam caught at high recall is the example given. (`README.md`, Labeling Path, step 4)
- **S25.** Labels on accounts come from several systems, among them one that looks at blocks and reports relative to likes on an account's posts and one that looks for inauthentic behaviour over time. (`README.md`, Content Understanding; `agatha/`; `bdsm/`)

### What the post itself contributes

- **S26.** The feed service computes a small set of facts about each post's content: whether it has a photo or a video, how many media items, its weighted text length, how many line breaks, and whether it has an external link. These are sent to the reranking service in a payload the code calls debias. (`home-mixer/models/content_features.rs`; `home-mixer/scorers/vm_ranker_debias_payload.rs`)
- **S27.** In those content facts a link is counted as 23 characters of weighted length. (`home-mixer/models/content_features.rs`, `URL_WEIGHTED_LEN`)

### What the repository says about itself

- **S28.** Many values are read from a configuration system at run time. Scheduled scripts copy the main production values into the defaults in the code, and experiments run on part of the traffic. (`README.md`, Experiments and Configuration)
- **S29.** Some files are held back to make gaming harder, including the prompts for the content classifiers and some labelling rules. (`README.md`, What's not in this repo?)

## What this means for a draft

Every row is an inference from the statements named, not a statement of the repository. None of them is a promise about any post.

| For a draft | Follows from | Kind |
|---|---|---|
| Write the post so that one reader has something to answer or to pass on. A reply, a quote and a share carry larger default weights than a like. | S9, S13, S14 | Inference |
| Never write for the reaction that gets a post muted, blocked, reported or marked not interested. Bait and repeated engagement prompts invite exactly the actions with the largest negative weights. | S10, S15 | Inference |
| Never turn the weights into a rule of the form "one reply is worth so many likes". The repository says that reading is wrong. | S16 | Stated |
| The first line has to hold a reader who was about to scroll, and the body has to be worth finishing. Predicted time spent adds to the score and scrolling past subtracts. | S9, S10, S12, S14, S15 | Inference |
| The idea goes in an original post. A reply or a repost is not shown in For You to people who do not follow the author. | S6 | Inference |
| A post is a two-day object in For You. Cadence is about a steady supply, since nothing older than 48 hours is ranked there. | S5 | Inference |
| Several posts in a burst compete with each other. In one ranked list, an author's second and third posts are discounted. | S19 | Inference |
| Write for the people who already talk with the owner. A mutual follow raises the weight on a predicted reply. | S18 | Inference |
| People who follow the owner are the first audience. A post shown outside the follow graph is discounted, and some spam rules apply only there. | S20, S24 | Inference |
| Asking friends in a group chat to open and like a post does nothing for ranking. | S17 | Stated |
| Do not state that a link is penalised or that it is harmless. A predicted link click has a positive default weight, and whether a post has a link is passed to the reranker; what the reranker does with it was not established from the code read. | S14, S26 | Not established |
| Count a link as 23 characters when measuring a post by hand. | S27 | Stated |

## What the repository does not tell you

- **How one post will rank.** The model's predictions depend on the viewer's own history (S4). The repository holds the code and the defaults, never a prediction for a post that has not been written.
- **The trained model.** The training code is public. No statement was found that the production model's learned parameters are in the repository, so nothing here can say what wording the model favours.
- **Whether production matches.** Values are read from configuration at run time and experiments run on part of the traffic (S28). The published defaults can lag or differ.
- **What was held back.** Classifier prompts and some labelling rules are not published (S29). A post can be labelled by a rule nobody outside can read.
- **The order of the visibility rules.** The README sends the reader to a rules registry file under `visibility-filtering/rules/` that is not in the tree at this commit. The folder holds other rule files, which were not read. The README can run ahead of or behind the code.
- **Hashtags.** No ranking weight or filter for hashtags was found in the scoring or parameter files read. That is an absence in what was read, not proof of no effect.
- **Links.** No weight named for a link penalty was found in `home-mixer/params/param.rs`. The link flag in S26 exists; its effect in the reranker was not traced.
- **Best time to post, posts per week, or a reply window.** Nothing in the files read names an hour, a weekly count or a period after posting during which replies count more.
- **Capital letters, emoji, line breaks as style.** Line breaks are counted (S26). Nothing read says which way that count moves a post.
- **Premium or verified accounts.** No term for them was found in the scorer, filter or value-model files searched. Other parts of the repository were not searched for it.
- **Every other platform.** LinkedIn, Instagram, Threads, TikTok, YouTube, Facebook and email are outside this repository entirely.
- **Most of the repository.** It holds about 2,400 files. This reading covers the README, `home-mixer/params/`, `home-mixer/scorers/value_model.rs`, `home-mixer/models/content_features.rs`, `xai-value-model/`, part of `vm-ranker/` and `docs/`. The visibility rules, the classifiers and the model code were not read line by line.

## Claims this file overrules

Claims about X that came from the method article credited in [sources](sources.md), set against the statements above. Where they differ, the repository wins; the conflicts are also listed in [verify](verify.md).

| Claim in the article | What the repository supports | Standing |
|---|---|---|
| The algorithm penalises an external link in the main post, so the link goes in a reply | A link flag exists (S26) and a predicted link click has a positive weight (S14). No penalty weight was found. And a reply is not shown in For You to non-followers (S6). | Unsupported. Not used as a rule. |
| Replying to comments for 30 minutes after posting is an algorithm advantage | No time window after posting was found. Predicted replies carry a positive weight (S14). | Unsupported as stated. Not used. |
| Post five to seven times a week at the least | Nothing sets a weekly count. Repeat posts by one author in one list are discounted (S19). | Unsupported. Cadence comes from the owner. |
| Named best hours to post | Nothing names an hour. Posts stay eligible for 48 hours (S5). | Unsupported. Left out. |
| Hashtags hurt on X | Nothing found either way. | Unverified. A style choice for the owner's voice node. |
| A reader gives a post half a second | Nothing found. | Unverified. Left out. |

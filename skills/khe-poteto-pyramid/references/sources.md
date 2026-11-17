---
title: sources
summary: Where the pyramid came from, what was taken as ideas, what is hers and unverified, what was left out, and the public pages behind it.
---

# Sources

## The pyramid

The poteto pyramid is Lauren Tan's ("poteto"), from her talk "All Code Is Slop (Except Mine)" at AI Engineer Code Summit, San Francisco, 11 November 2026. The skill was built from Miguel Alvarado's interactive study guide to that talk on Artesano, which is transcribed from 23 photos of her slides and two recordings, and from her own public writing: her pstack skills and her two-part "Complete Guide to pstack" on X. The guide says it is not affiliated with her, her employer or the conference; neither is this skill. Every sentence here was written fresh; nothing is copied from her skills, which are linked instead.

Taken as ideas:

- the five layers in their order (codebase, static analysis, verification, prose, human review) and "cost" running down them;
- code is memory: agents copy what they see;
- anything that needs nuance to use well leads to slop, so fence or remove it;
- directory structure, and file names, as a form of context;
- lint against it or categorically eliminate the problem; every correction becomes a check;
- lint errors that name the real fix; stop the bleeding first, then clean up;
- quick fixes considered harmful, and comments as the escape hatch that makes them copyable;
- stop agents writing unsolicited markdown;
- verification as the most important step; feature maps; a control CLI ("build the lever"); formal models; property tests of the UI; statecharts;
- prose late and small, for judgment; a rule table pairing each rule with what enforces it; "the instruction is the symptom";
- review as the tip that feeds the pyramid, not a gate;
- don't automate a bad loop; the low-trust, high-trust and factory loops;
- her closing order: codebase first, a lint, strong verification, then automate.

## Hers, unverified

Her own write-up calls the figure an inverse trust pyramid; "poteto pyramid" is the study guide's name for it, kept here because people search for it. Her figures are reported as she gave them and were not checked: about 3,000 PRs shipped in a month (a phone recording says 2,000); PRs merged by her team rising from 809 in June to 10,926 in October; people merging rising from 15 to 227; the revert rate falling from 0.98% to about 0.47%; deterministic checks rising from 7 to 167 (read off a photo of a slide caught mid-animation); and Cindy Sridharan's 70% of token spend on verification, which the guide did not trace to her original post. The guide's audio transcripts are machine-made, so short quotations may not be word for word. Her employer is given differently on stage and in the conference bio. Her write-up adds a caveat to the revert rate: it counts reverts only, so a bug fixed by a later PR does not show in it.

## Left out, and why

| In the sources | Here | Why |
|---|---|---|
| Her team's volume and performance figures as evidence | Only in this file, as hers | Unverified, and a skill should not promise numbers |
| The product pitch for her employer's bot as the outer loop | A neutral description of triggers in [loop](loop.md) | A skill here routes to no product |
| Cursor-specific setup (custom modes, cloud agents, automations) | Left out | Host-specific; the method is not |
| Her own skills' procedures | Linked by name (`correct`, `create-verification-skill` and others), never restated | They are hers and kept current by her |
| Grok-specific and internal framework details | Replaced by an invented app, Pinwheel, in every example | The examples should teach the move, not her codebase |

## Pages

- The guide: [all code is slop: an interactive guide to the poteto pyramid](https://artesano.build/all-code-is-slop), Artesano, read 2026-11-17.
- The talk's own page, with an edited write-up, chapters and the 17:31 video: [ai.engineer/talks/O_zcc6Xl12g-all-code-is-slop-except-mine](https://ai.engineer/talks/O_zcc6Xl12g-all-code-is-slop-except-mine), read 2026-11-17. Chapters: 0:01 the trust question, 5:00 Dune, 6:56 the timer workaround, 9:40 running the app and describing it, 11:51 where verification tokens go, 13:32 eleven thousand PRs, 15:11 the release fuzzer.
- The talk on the AI Engineer livestream: [youtube.com/watch?v=ZZ19zhYnDKY](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3625s), about 1:00:25 to 1:18:45.
- Her speaker page: [ai.engineer/speakers/lauren-tan](https://ai.engineer/speakers/lauren-tan).
- pstack, her skills: [github.com/cursor/plugins/tree/main/pstack](https://github.com/cursor/plugins/tree/main/pstack), MIT. Read: the README and `correct`, `no-comments`, `create-verification-skill`, `principle-encode-lessons-in-structure`.
- "The Complete Guide to pstack", part 1 (31 August 2026, verification) and part 2 (9 September 2026, research, planning, prototyping, architecture), on X: [part 1](https://x.com/poteto/status/2094457600259842065), [part 2](https://x.com/poteto/status/2097732320606507506). Read through a public mirror because x.com refused the request.
- Bombadil, property-based testing for web and terminal UIs, by Antithesis: [github.com/antithesishq/bombadil](https://github.com/antithesishq/bombadil).
- Matt Pocock's skills, linked beside hers for the codebase layer: [github.com/mattpocock/skills](https://github.com/mattpocock/skills), MIT.

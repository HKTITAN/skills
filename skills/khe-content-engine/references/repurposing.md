---
title: repurposing
summary: How one idea becomes a different piece per platform. The claim, the treatment, what must differ between two drafts, the follower test, and when to skip a platform.
---

# Repurposing

One idea in, one draft per platform, each a different treatment. A treatment is a decision about what this reader, in this place, gets from the idea. Changing the length, the line breaks or the sign-off is formatting, and a run that only formats has failed as Pasted.

## The claim comes first

Before any draft, write the idea as one sentence that could be wrong: who, what changed, what it shows. Every draft argues that sentence. If the brief cannot support it, stop and ask the owner; a run without a claim produces drafts that agree with each other about nothing.

## A treatment has four parts

| Part | The question | Comes from |
|---|---|---|
| Angle | Which side of the claim does this reader need: the result, the method, the story of finding it, the cost of ignoring it, the objection? | The repurpose node |
| Form | Which of the owner's forms carries that angle here? | The content-types node |
| Depth | How much of the brief does this draft use? | The platform node's `Limit:` |
| Reader | Which segment is it written for? | The audience node |

Two drafts in one run never have the same angle. The gate fails two drafts with the same `Treatment:` line (`same-treatment:`).

## Starting treatments by kind of platform

Use these to write the owner's repurpose node. They are a starting point for the interview, and the owner's own practice replaces them.

| Kind of platform | Starting treatment | What it leaves out |
|---|---|---|
| Short text: X, Threads, Bluesky | The single claim, with one fact and one thing to do | The story and all but a clause of the caveat |
| Short thread | The steps, one to a part, in the order the reader does them | Why the owner believes it |
| Professional feed: LinkedIn | How it was found out, with what it does not prove | The step-by-step |
| Newsletter | The method in full, the wording to copy, the thing that goes wrong | Nothing; this is the deepest version |
| Short video script | One step, shown, said aloud | Everything but that step |
| Long video outline | The whole method as sections a viewer can follow along with | Asides |
| Carousel text | One idea to a slide, the claim on the first | Sentences; slides are phrases |
| Community post | The question the owner wants answered, with what they have tried | The conclusion |

## What two drafts may share

- **Facts**, yes. Both come from the brief.
- **Sentences**, almost never. Two drafts share at most 20% of the shorter one's sentences of four words or more. Over that the gate fails the run (`pasted:`).
- **The first line**, never (`same-hook:`).
- **The voice**, always. The treatment changes; the voice node applies to every draft unchanged.

## The follower test

Imagine one reader who follows the owner on every platform in the run and sees all the drafts in one day. For each draft, name the thing that reader gets from it and from no other draft. A draft with no answer is cut or rewritten. This test is done by reading; the 20% rule only catches the crudest failure.

## Order of writing

1. The claim.
2. The shortest draft. It forces the claim down to what survives.
3. Each longer draft from the brief, never from the shorter draft. Expanding a short post produces the same post with more words.
4. Read all the drafts side by side before the gate.

## When a platform gets nothing

Some ideas have nothing for a platform: an opinion has no method for the newsletter, a long method has no single claim for a short post. Skip it. Write `Skipped: <platform> (<reason>)` in the run and say so in the reply. The gate reports it as a candidate (`skipped-platform:`) so that a person sees it. A padded draft is worse than a missing one, because it teaches the reader to skip the next one too.

## What repurposing never does

- It never adds a fact, a number or a quotation that the brief lacks, to fill a longer form.
- It never changes the claim to suit a platform.
- It never produces a visual. Slide text and scripts are text; pictures and video belong to `khe-sticker`, `khe-demo`, `khe-launch-film` and `stageshow`.

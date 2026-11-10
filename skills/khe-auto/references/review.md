---
title: review
summary: The brief for a fresh-eye reviewer of a routing reply. What to hand them, what never to hand them, their first question, how to rank and what "nothing" looks like.
---

# Review

The brief for a fresh-eye review, after the gate passes and [verify](verify.md) is walked. A reviewer who knows why the builder chose the route will agree with the route. This file keeps that knowledge away from them.

## Hand them

- The user's request, word for word. That is the one-line brief.
- The reply, exactly as it will be sent.
- The output of `route-check.mjs --gate` on the reply, whole.
- For each skill that ran: its gate's output, and the thing it produced (the file, the capture, the render).
- This file, [verify](verify.md), SKILL.md and the `examples/` folder.
- One line naming the closest gold in `examples/`.

## Never hand them

- The plan, or any note on why this route was chosen.
- The routes that were weighed and dropped.
- `ROUTE.md`, or any skill's handover file.
- The builder's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing a routing reply someone else wrote. You have the request, the reply, the gate output, what each skill produced, the verify list, the skill's tables and the gold replies. You have not seen the reasons behind the route, and you do not need them: you are judging whether this reply answers this request.

Your first question, before the checklist: **cover the reply, read only the request, and write down the route you would take from the tables in SKILL.md. Then uncover it. Is it the same route?** If it differs, that is the first finding, ranked above everything else, even when the gate passes. Then ask the second: would a different request in the same domain have received this same reply? A route that the request did not shape is a finding.

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. If something you need was not handed over (a gate's output, the file a skill produced), run the gate or open the file yourself before you answer. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. The route: the wrong skill, a stretched skill, a playbook that was skipped or wrongly used.
2. The order: the contract not first, a step run before the one it depends on, a fault patched downstream.
3. The evidence: an exit called met with nothing looked at, a gate that ran on the wrong file or before the last edit, a value with no reference behind it.
4. The reply: a part missing, a vague last line, an author not named.

Each item: the sentence in the reply you would quote, the table row, gate line or file that shows the fault, and the fix in one line. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply, a gate line with its file and line number, a table row from SKILL.md, or a file a skill produced. An impression is not a finding.
- Rank by how much of the result the fault spoils, never by how quick the fix is. A wrong route outranks every fault inside the work, because the work was done to the wrong rules.
- A line the builder called intentional is judged again from the reply. The builder's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the work is nearly done.
- Do not review the craft of the work. That belongs to the owning skill's own review. Here you judge the route, the order, the evidence and the reply.
- A reply that hides an unverified step is a finding even when everything it does say is true.
- A skill that is someone else's, routed to by name and credited, is correct. Never send it back for being outside this repo.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Route I would have taken from the request alone: <it>, the same.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, each gate output, each produced file, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.

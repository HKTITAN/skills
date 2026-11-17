---
title: layers
summary: The five layers of the pyramid, what each holds, the techniques behind each, and why the order is the order.
---

# The layers

The pyramid is inverted: the wide end is where most of the time goes. The first two layers are the code itself and are deterministic. Verification sits below them, a little prose below that, and a person at the tip. On her slide the arrow beside it says only "cost"; read it as the price of catching a mistake at that layer, first in tokens, finally in human attention.

| # | Layer | Holds | Fails how |
|---|---|---|---|
| 1 | Codebase | Architecture, API design, folder structure, refactoring, deletion | It cannot be written wrong |
| 2 | Static analysis | Lints, types, compilers, tests, CI | Every time, the same way, in seconds |
| 3 | Verification | Running the app as a user would, formal models, property tests, statecharts | When the thing is run or the model is checked |
| 4 | Prose | Rules, skills, AGENTS.md, CLAUDE.md | Never: nothing fails when an agent skips it |
| 5 | Human review | Evidence and what landed | Only when someone notices, and only that once |

## 1. Codebase

**Code is memory.** Agents copy what they see. Every workaround, deprecated call and piece of tech debt looks to the next agent like the established pattern, so it gets copied. Code used to arrive a few PRs at a time; now each engineer runs a stream of agents, and the codebase is the garden the stream grows in. Keep it clean so what gets copied is right.

Techniques, in the order to try them:

- **Remove the mistake by construction.** One owner per piece of state. One supported way per task. Hide internals so the wrong import fails to resolve. One source of truth instead of lists kept in sync by hand. Delete old ways and dead code an agent would copy.
- **Fence the API that needs nuance.** Anything that needs nuance to use well tends to produce slop. Her example is React's `useEffect`: banned in product code, allowed only inside the framework's own hooks, so the problem is categorically eliminated instead of reviewed for. Design the replacement so it needs no nuance.
- **Let the structure carry context.** A folder named for where its code runs (`electron-renderer/`, `electron-main/`) tells an agent where it is before it reads a line. A file name can carry a constraint: `tick.hot.ts` says "runs every tick, no allocations". One folder per feature keeps the search space small.
- **Reduce the architectural search space.** Prefer libraries and frameworks that leave one obvious way to do a thing, or write a thin one that does. Her team's in-house framework for its desktop app is unremarkable technically; what matters are its constraints: one folder per feature, strict import bans, no comments in code.

The question: can the wrong version of this be made impossible to write, or obviously out of place?

## 2. Static analysis

**Lint against it or categorically eliminate the problem.** Every time you correct an agent, ask how the correction becomes a deterministic check rather than one more line in AGENTS.md. A check runs the same way every time, so you can trust it more than any instruction. Over time the pile of checks grows and the review load shrinks until agents can merge most of their own PRs. On her slide the count of deterministic checks rose from 7 in July to 167 by November (figures read off a photo; approximate).

- **Types first** when the bad state can be made unrepresentable: a branded ID, a discriminated union, a narrowed parameter.
- **A lint** when bad code still compiles: an import ban, a banned call, a required wrapper.
- **A test** for behavior, asserting what a user can observe, so it fails when the behavior breaks and keeps passing when only internals change.
- **CI** runs the same command locally and on the server, so "passes on my machine" and "passes in CI" mean one thing.

Her cautionary tale is quick fixes. Agents patched a clash between imperative and declarative code with `setTimeout(…, 0)`, and each patch came with a comment explaining why the shortcut was justified. The comment made it copyable. On her slide one timer on 9 September became a shared module by 3 October and 183 timers by 17 October; short-lived timers caused garbage-collection churn, then lag. The fix was lint rules whose messages say to fix the root cause, and a ban on the comments that excused it. Details in [checks](checks.md).

The question: if an agent writes the wrong version, can a tool reject it before a person sees it?

## 3. Verification

**Verification is the most important step.** It lets agents be more autonomous, and it raises everyone's confidence. It finds bugs, checks the properties and invariants you care about, and shows whether the agent understood the intent. Review shrinks to looking at its artifacts: videos, screenshots, traces, diagrams, model-checker output.

Four kinds she uses, detailed in [verification](verification.md): runtime verification (the agent runs the real app with the same debugging tools a person would, guided by a feature map), formal verification (TLA+ for orderings and state machines, Lean for proofs about algorithms), property-based testing of the UI, and statecharts a person can review.

Where the tokens go changes: she quotes Cindy Sridharan saying about 70% of her daily token spend now goes to verifying patches and 20 to 30% to writing them, and says her own usage matches. None of these techniques is new; agents made them cheap enough to write and maintain.

The question: is this a property of running behavior (an ordering, a user flow, a performance budget) that no single file shows?

## 4. Prose

**Prose comes late and stays small.** Rules, skills and AGENTS.md are for things that need judgment. They sit low because text is unenforceable, and because agents use markdown, comments and rules files as places to justify not doing the hard right thing, or over-rotate on one small correction and record it as an unbreakable law. Details in [prose](prose.md).

The question: does this need a judgment no tool can make, such as scope, taste, or when to stop and ask?

## 5. Human review

**Review is the point of the pyramid, not a gate.** With the layers above in place, PRs tend to be good by default and agents merge most of their own. People look at the verification evidence and at what landed, and watch for smells. Whatever a person notices goes back to the top as a refactor or a lint, so nobody notices it twice. In her own ordering of where a correction can live, relying on people to catch it comes last.

A placement never ends here. If the honest answer is "a reviewer will watch for it", the work is to find the layer above that can hold it.

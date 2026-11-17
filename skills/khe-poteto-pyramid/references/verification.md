---
title: verification
summary: The verification layer: running the real app as proof, feature maps, an agent-friendly control CLI, formal models, property tests, statecharts, and what review looks at afterwards.
---

# Verification

Verification is what lets an agent check its own work and keep going until the task works, so a person stops being the bottleneck. It is the layer for what no single file shows: whether a flow works for a user, whether events can arrive in a bad order, whether a budget holds.

## Runtime

The agent runs the real app and uses the debugging tools a person would: for web and Electron, the Chrome DevTools Protocol; for iOS, the simulator; for a stack without a rich runtime, a tool the agent builds (an lldb wrapper, a sidecar in dev builds). Choose stacks that are easy to drive and debug; it pays back on every task.

A project verification skill has these parts, each written from what the repo actually does, never as a template:

| Part | Holds |
|---|---|
| Launch | The exact command that starts an isolated instance from an empty data folder, seeded, and how to tell it is usable rather than merely up |
| Doctor | One read-only check: right build, port owned by this run, auth valid. Run it first whenever anything looks off |
| Drive | The recipe with real selectors, commands and routes from this repo; stable handles (ARIA labels, data attributes, prompt strings) over coordinates |
| Evidence | What to capture and where: the action and the resulting state, side effects (files, rows, messages), not just a final screenshot |
| Cleanup | Tear down what this run started, never by process name; the evidence survives cleanup |
| Feature map | One file per user-facing feature: what it is, how a user reaches it, how to drive it, what end state proves it works, and gotchas |

The feature map is a compact projection of the codebase from the user's side. It gives agent and person one vocabulary ("the tag picker", not "the thingy in the sidebar") and saves the tokens of rediscovering the app every task. Keep it current: agents update it as they work, and a daily maintenance pass catches what they miss.

**Build the lever.** Ship a small CLI rather than letting each agent write a throwaway driver script. One driver costs fewer tokens, behaves the same every run, and can itself be tested. An agent-friendly CLI has:

- composable subcommands, revealed gradually (`info`, `snapshot`, `click`, `type`, `trace`, `record`, `doctor`, `cleanup`);
- `--dry-run` on anything destructive;
- error messages that say what to do instead;
- rich `--help`;
- machine-readable output (JSON) on request.

Proof standards: drive the real user path, never an internal setter or a test-only endpoint; capture the action and the result; verify side effects alongside what is visible; mock only where production already isolates the external system. A generated verification skill that was never run end to end is a draft.

poteto's `create-verification-skill` generates one of these for any stack, and `maintain-verification-skill` keeps the feature map honest. `khe-demo` records a clean take of the result for a PR or a README.

## Formal

For bugs that need an unlucky ordering, a retry, a crash at the wrong moment, or a state machine with too many paths to test by hand.

| Tool | Use it for | What you get |
|---|---|---|
| TLA+ (checked with TLC or Apalache) | Can events happen in a bad order? Model the state machine and check that every reachable state is handled | A counterexample trace, step by step |
| Lean | Is this algorithm correct? Write proofs about the code and check every logical step | A proof, or the step that does not hold |

A test checks the cases someone thought to write; formal verification checks every case inside a stated scope. Say the scope (three devices, two retries) in the record. A model is checked against the code only as well as it was written from the code; say how in `Not verified:`. Her team found real bugs this way and calls it no silver bullet, one more layer. Make TLA+ the default when the question is ordering. A model you have never seen fail proves nothing: run it against the version with the bug first.

poteto's `create-formal-verification-skill` and `maintain-formal-verification-skill` set this up and keep it in step with the code.

## Property-based

For inputs and interactions nobody would enumerate. In the UI, Bombadil (from Antithesis) explores a web or terminal interface with generated input and checks properties you state. For logic, a property-based testing library in your language (fast-check for TypeScript, Hypothesis for Python) does the same at the function level. A property is a sentence that holds for every input: "undo after any edit restores the previous text".

## Statecharts

A statechart drawn from the user's point of view lets the person who owns a behavior review it next to the videos and screenshots, without reading a spec. poteto's `statechart` checks a TLA+ model, draws the user-visible states, marks each state that breaks a rule, and gives the shortest path to each.

## What review looks at afterwards

With verification in place, review moves from reading the diff to reading the evidence: the video of the flow, the screenshots, the trace, the model-checker output, the statechart. A PR that changes behavior and carries no evidence is incomplete, and a check can say so (`unrun-ui.md` in the examples does).

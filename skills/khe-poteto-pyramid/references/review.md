---
title: review
summary: The brief for a fresh-eye reviewer of a placement, and the format of its reply.
---

# Review

A second reviewer gets the evidence and the gold, never your reasons. A reviewer who reads why you chose a layer agrees with it.

## Give the reviewer

- The record (`PYRAMID.md`) with the `Not higher:` lines removed.
- The diff of the change.
- The output of the `Enforced by:` command on the past case and on the branch.
- The closest gold record from `examples/placements/`.
- This question: "For each placement, what is the highest layer that could hold this mistake, and does the change hold it there? Would an agent that opened only the file in `Seen:` be stopped?"

Run the reviewer on a different model from the one that built the change when one is available.

## The reply

A verdict per placement, then findings worst first:

```text
Placement: <title>
Reviewed: <commit, or working tree at the time>
Verdict: holds | holds lower than it could | does not hold
Highest layer that could hold it: <layer>, because <what that layer can see>
Findings:
- [important | nit | pre-existing] <the fault> | <evidence: file, line, output> | <the fix>
Not verified: <what the reviewer could not run>
```

Fix every finding, run the gate again, and run the review again with a fresh reviewer when a verdict was "does not hold".

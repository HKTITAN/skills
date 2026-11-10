# "Make the app feel better"

**You own this from a vague complaint to a list of changes made.** Subtract, then retune, then add. Retuning a motion you are about to delete wastes the pass, and additions are judged fairly only once the noise is gone.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Remove** with `remove-animations`. Exit: a list of what went, and a list of what stayed with the purpose that saved each. Gate: none, `remove-animations` ships no gate; check both lists against the diff.
2. **Retune what stayed** with `improve-animations`. Exit: plans with exact values, a file and a line each. Gate: none, `improve-animations` ships no gate; open every file and line a plan names.
3. **Add, sparingly** with `find-animation-opportunities`. Five to seven at most. Exit: the kept list and the rejected list. Gate: none, `find-animation-opportunities` ships no gate; count the kept list.
4. **Finish** with `khe-ui`, polish-and-ship lane: the missing states and the optical details. Exit: every state the pass named now exists in the code. Gate: `khe-ui/scripts/ui-check.mjs`.

If the complaint is "feels off on my phone", run `mobile-native` before any of this. A tap delay or a stuck hover reads as bad motion and is not.

**Reply:** removed, retuned, added and kept, each with its reason, the last line of the gate, and what needs a real device to feel-check.

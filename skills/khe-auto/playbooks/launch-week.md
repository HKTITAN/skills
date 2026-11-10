# Launch week

**You own this from "we ship Thursday" to a list of what was fixed and what still needs a person.** This fixes defects. It never redesigns. Run it last, and never on a screen that is still being designed.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Sweep the whole app** with `khe-ui`, polish-and-ship lane. Fix what a diff can fix. Exit: a build that passes. Gate: `khe-ui/scripts/ui-check.mjs`.
2. **Break it** with `break-ui` on the screens that carry real data. Exit: what broke, with a fix for each. Gate: none, `break-ui` ships no gate; look at every screen with the worst-case data switched on.
3. **The floor** with `khe-ui`, accessibility lane. Exit: every finding fixed, or listed as needing a person. Gate: `khe-ui/scripts/ui-check.mjs`.
4. **The phone** with `khe-ui`, mobile lane. Exit: every finding sorted into verified from code or needs a real device. Gate: `khe-ui/scripts/ui-check.mjs`.
5. **Leftovers** with `khe-ui`, tells lane: debug output, placeholder data, dev tools left on. Exit: none of the three is left in the build. Gate: `khe-ui/scripts/ui-check.mjs`.

**Reply:** Ship or Not yet, then three lists: fixed, needs a device, needs a person. Then the last line of the gate, and what was not checked.

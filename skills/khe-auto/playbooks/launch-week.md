# Launch week

**You own this from "we ship Thursday" to a list of what was fixed and what still needs a person.** This fixes defects. It never redesigns. Run it last, and never on a screen that is still being designed.

1. **Sweep the whole app** with `khe-ui`, polish-and-ship lane. Fix what a diff can fix. Exit: a build that passes.
2. **Break it** with `break-ui` on the screens that carry real data. Exit: what broke, with a fix for each.
3. **The floor** with `khe-ui`, accessibility lane.
4. **The phone** with `khe-ui`, mobile lane. Sort every finding into verified from code and needs a real device.
5. **Leftovers** with `khe-ui`, tells lane: debug output, placeholder data, dev tools left on.

**Reply:** Ship or Not yet, then three lists: fixed, needs a device, needs a person.

# Placements: pinwheel, cross-device reminders

Repo: pinwheel, an invented Electron notes app
Date: 2026-11-17
Job: place

## Placement: a reminder fires twice when two devices wake together

Correction: "it's an ordering bug again, the tests pass and it still double-fires"
Seen:
- issue #298: a reminder shown on laptop and phone, then shown again on the laptop after the phone dismissed it
- issue #331: a dismissed reminder came back after the laptop resumed from sleep while offline
- PR #340 added a guard (`if (shown.has(id)) return`) that passed every test and did not stop #331
Layer: verification
Not higher:
- codebase: the reminder state already has one owner, `electron-main/reminders/store.ts`, and one way to change it; the bug is in the protocol between devices, which no folder layout or API shape removes
- static: an ordering across devices is not visible in any one file, so no lint or type can see it
Change: a TLA+ model of the reminder protocol, `verify/reminders/Reminders.tla`, with three devices, sleep, resume and lost messages, and two properties: a dismissed reminder is never shown again, and an undismissed one is shown at least once. The guard from PR #340 was deleted, and the store's dismiss message now carries a version so a stale "show" loses.
Enforced by: `npm run verify:tla` (runs TLC on `verify/reminders/Reminders.cfg`), in CI on any change under `electron-main/reminders/`
Proof: against the protocol as it was on `c7710aa`, TLC failed the "never shown again" property with an 11-step trace that matches issue #331 (resume, stale show, late dismiss); with the versioned dismiss it passes all states for three devices
Prose: none

Gate: pyramid-check passed
Not verified: that the model matches the code; it was written from `store.ts` by hand, and nothing yet checks the two stay in step. Four or more devices were not checked.

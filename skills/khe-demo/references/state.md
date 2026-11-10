---
title: state
summary: What is on screen before the first frame and how it gets back there. Seed data, reset steps, test accounts, the clock and locale, and everything in the window that must not be recorded.
tags: [demo, state, seed, reset, privacy]
---

# State

Whatever is on screen is published. A demo's state is written down before the take, loaded by the app itself, and restored by steps that run before every take.

## Seed

- **Write the opening frame as data.** List the rows, names, numbers and settings the first frame shows, then put exactly that in a seed: a fixture file, a seed script, a localStorage value, a test tenant.
- **Size the seed to the frame.** Enough rows to fill the panel the story happens in, no more: an empty list reads as a broken product, and forty rows bury the one that changes. Five to eight rows fill a list at the viewports in [capture](capture.md).
- **Make it plausible and nobody's.** Invented names, round-but-not-fake numbers, emails on `example.com`, `example.org`, `example.net` or a `.test` name. Those domains are reserved for documentation, so no address on them belongs to a person. The gate raises `real-email:` for any other domain.
- **Make ids stable.** The script waits for "the new row"; it can only name it when the seed fixes the ids (`t1` to `t5`, so the new one is `t6`).
- **Never stage a result.** The app produces what the take shows. Editing the page to show a result is a false claim about the product, and it is the line between this skill and faux UI.

## Reset

The reset is the list of steps that returns the app to the seed. The script's `reset` block holds them and `record.mjs` runs them before every take.

| Step | What it does | Use for |
|---|---|---|
| `{ "do": "storage", "clear": true, "set": { "key": value } }` | Clears localStorage and sessionStorage for the app's origin, then writes each key | Apps that keep state in the browser |
| `{ "do": "cookies" }` | Clears the context's cookies | Signing out between takes |
| `{ "do": "request", "url": "/api/test/reset", "method": "POST", "body": {} }` | Calls an endpoint on the app's own host | A test-only reset route |
| `{ "do": "eval", "js": "..." }` | Runs JavaScript in the page | IndexedDB, a store's own reset |
| `{ "do": "command", "run": "npm run seed:demo" }` | Runs a shell command. Needs `--allow-commands` | A database seed script |
| `{ "do": "launch", "app": "..." }` | Desktop only: start the app at its size and place | Native apps |

- **Prove it with two takes.** `--takes 2` records twice in one browser profile and compares the final screens. `repeatable: 2 takes ended on the same screen` is the proof; `take-differs:` means the reset misses something. A fresh profile hides a missing reset, which is why the runner never uses one per take.
- **A reset only talks to the app under demo.** `record.mjs` refuses a `request` step to another host.
- **Read a `command` step before allowing it.** It is a shell command from a file.
- **A flow that can only happen once** (a one-time invite, a first-run wizard, a payment) gets a reset that recreates the precondition: a new invite seeded, the first-run flag cleared, the provider's test mode. If no reset exists, say so and stop: one unrepeatable take is not a deliverable.

## Accounts and secrets

- **Start signed in.** Signing in is rarely the one thing the demo shows, and it puts a credential on camera. Load the session in the reset (`storage`, a `request` to a test login route, or `agent-browser state load`).
- **When sign-in is the story,** use the test account from the project's seed or example-config files, never a person's password, and expect the gate's `password-step:` candidate every time. Write in `DEMO.md` which seed file the account came from.
- **Tokens leak through URLs.** A magic link, a `?token=`, a signed URL in the address bar or in a visible log line is on camera. The gate reads the script's URLs for these shapes; the frames are yours to read.
- **The gate reads only the script.** `secret-on-camera:` and `real-email:` cover what the script types, loads and opens. A secret already in the seed database, an API key in a settings panel or a name in an avatar menu is found only by looking at the frames.

## The clock, locale and theme

| Setting | Script key | Why |
|---|---|---|
| Clock | `state.clock`, an ISO time such as `2026-03-02T09:41:00` | A date on screen dates the take and changes between takes. `record.mjs` starts the page's clock there and lets it run, so timers still work |
| Locale | `state.locale` (default `en-US`) | Dates, numbers and sort order follow it |
| Time zone | `state.timezone` (default `UTC`) | "Today" at 23:30 is tomorrow elsewhere |
| Colour scheme | `state.scheme`, `light` or `dark` | The take must match the page it sits on, never the recording machine |

Pick a clock time in working hours on a weekday: a dashboard at 03:12 on a Sunday reads as a test. The gate reports a missing clock as `no-clock:`.

## The window

Everything inside the capture rectangle that is not the product, removed before the take:

- **Browser chrome.** `record.mjs` and `agent-browser record` capture the page only, so tabs, the address bar, the bookmarks bar and extensions are never in a web take. A screen capture of a headed browser includes all of them: use a clean profile, hide the bookmarks bar and capture the page's rectangle.
- **Notifications.** Turn on Do Not Disturb or Focus for a desktop take. On a machine with agent-desktop, `agent-desktop dismiss-all-notifications` clears the centre before the take.
- **The desktop.** Capture the window's rectangle. A wallpaper, a dock, a taskbar clock and other apps' windows are personal data.
- **Inside the app.** Update banners, cookie banners, onboarding tooltips, a "trial ends in 3 days" bar, a dev-mode badge, an unread count from real mail. Seed them away or dismiss them in the reset, never on camera.
- **The title bar.** A window title carrying a file path shows a user name. Open a file from a neutral folder.
- **Autofill and history.** A clean profile has none. A real one offers the user's address the moment a field is focused.

## Order of work

1. Write the opening frame as a list.
2. Seed it; start the app; look at the frame.
3. Write the reset; run it twice by hand; look again.
4. Fix the clock and locale.
5. Read the whole frame for anything that is somebody's.

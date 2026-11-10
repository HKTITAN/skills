---
title: surfaces
summary: Web or desktop, which driver acts and which layer records, with the commands each tool has today and what none of them can do.
tags: [demo, surfaces, playwright, agent-browser, agent-desktop, ffmpeg]
---

# Surfaces

A demo has two jobs that are often done by different tools: something **drives** the app (clicks, types, waits) and something **records** the pixels. Pick one of each per surface. Every claim about a tool below was read from its own README, bundled skill files or `--help` on 2026-11-10 (agent-browser 0.39.1, agent-desktop 1.0.2). Tools change: run `agent-browser record --help` or `agent-desktop skills get platform` before relying on a row.

## The default per surface

| Surface | Drives | Records | Use when |
|---|---|---|---|
| Web app | `scripts/record.mjs` (playwright-core, your installed Chrome) | The same script: DevTools screencast frames, encoded by ffmpeg | Always, unless a row below fits better |
| Web app, no Playwright in the project | `agent-browser` | `agent-browser record start` | The project has no Node tooling, or the flow is being explored by hand first |
| Electron app | `agent-browser connect <port>` | `agent-browser record start` | The app is Chromium inside; launch it with `--remote-debugging-port` |
| Native desktop app | `agent-desktop` | ffmpeg screen capture of the window's rectangle | The app has an accessibility tree and no web view to attach to |
| Anything a driver cannot reach | A person, following the script's beats | ffmpeg screen capture | Last resort; the script file is still written and gated |

One driver per take. ffmpeg is needed by every row: no path here records without it.

## Web: `scripts/record.mjs`

The default, because it executes the script file itself. That makes the take repeatable, lets it record two takes in one profile to prove the reset, and writes the report the gate reads.

```bash
node scripts/record.mjs demo.json --dry-run
node scripts/record.mjs demo.json --out out/take.mp4 --takes 2
node scripts/record.mjs demo.json --url http://127.0.0.1:5173 --out out/take.mp4
```

- **playwright-core is resolved from your project**, from `--playwright <folder>`, or from the `PLAYWRIGHT_CORE` variable. It is never bundled. `npm i -D playwright-core` installs it without downloading a browser.
- **It launches the Chrome already installed** (`channel: "chrome"`); `--channel msedge` picks Edge.
- **It refuses** a script with a never-intentional gate line, a host that is not local without `--allow-host`, a `command` reset step without `--allow-commands`, and a run with no ffmpeg (exit 2, nothing recorded).
- **The pointer is drawn in the page** by an inert overlay that follows the real mouse events, because the screencast does not contain the system pointer. With `"touch": true` in the viewport it draws a touch dot on each tap.

### What the screencast gives

The DevTools screencast (`Page.startScreencast`) delivers frames in CSS pixels. Setting the device scale factor on the page alone changes nothing: a 1280 x 720 viewport at scale 2 still arrives as 1280 x 720 frames. Measured here with Chrome and playwright-core 1.48: only launching the browser with `--force-device-scale-factor=<scale>` made the frames arrive at 2560 x 1440. `record.mjs` passes that flag, reads the first frame's size, and stops with nothing encoded when it is not viewport times scale. An upscaled take passes a size check and fails the eye.

Frames arrive only when the page repaints, each with its own timestamp. The script holds each frame until the next one and encodes at the declared rate, so a still page costs nothing and a moving one records at up to the repaint rate.

## Web: agent-browser

Verified commands (README, `skill-data/core/references/commands.md`, `video-recording.md`, `record --help`):

| Job | Command |
|---|---|
| Open, read | `agent-browser open <url>`, `agent-browser snapshot -i` |
| Size | `agent-browser set viewport 1280 720 2`, `agent-browser set device "iPhone 14"`, `agent-browser set media light` |
| Act | `click`, `fill`, `type`, `press`, `hover`, `select`, `scroll`, `drag`, `mouse move <x> <y> --duration <ms> --steps <n>`, `mouse move <x> <y> --human --seed <n>` |
| Wait on a condition | `wait --text "Saved"`, `wait --url "**/dashboard"`, `wait --fn "window.ready"`, `wait <selector> --state visible` |
| Record | `agent-browser record start <path.webm or path.mp4> [url] --fps <1 to 60> --cursor`, `record stop`, `record restart <path>` |
| Evidence | `record start <path> --contact-sheet`, `screenshot <path>` |
| State | `state save <file>`, `state load <file>`, `cookies`, `storage` |
| Electron | `agent-browser connect <port>`, then the same commands; `tab` lists windows and web views |

What it can do: record video (30 fps by default, any rate from 1 to 60), draw a pointer and a click ripple with `--cursor`, wait on text, URL, a selector state or a JavaScript condition, and run on macOS, Linux and Windows x64.

What to know before relying on it:

- **Recording needs ffmpeg on PATH** with libx264 and libvpx. `agent-browser doctor` reports it.
- **Scale.** The docs promise the third argument of `set viewport` for higher-resolution screenshots. They do not promise it for video, and its recorder reads the same screencast. Probe the file with `node scripts/post.mjs probe` before trusting a scale-2 plan; if it came out at CSS size, record with `record.mjs` instead.
- **It runs one command at a time.** It does not execute this skill's script file. Walk the beats as commands in a shell script, with `wait` conditions between them, and keep the `demo.json` as the gated plan.
- **A scripted run was not recorded with it for this skill.** The commands above are read from its docs and help, not from a take made here.

### Refs

`snapshot` gives each element a ref such as `@e1`. A ref describes the page at the time of the snapshot; a replaced element invalidates it. Use refs while exploring, then write the script with a test id or a role and name. A ref in a script file is `brittle-target:`.

## Desktop: agent-desktop drives, ffmpeg records

agent-desktop reads an app's accessibility tree and acts on refs. Verified from its README, `docs/install.md`, and the skill files under `skills/`:

- **It has no command that records video.** `screenshot` writes one PNG. `session start --screenshots` stores a PNG before and after each action. `trace export` writes an HTML timeline. None of them is a recording, so the picture comes from ffmpeg.
- **Platforms:** macOS 13 or later (AX API), Windows 10 1809 or later on x64 or ARM64 (UI Automation), Ubuntu 24.04 or later (AT-SPI).
- **Actions are headless by default.** A ref action calls the accessibility API and does not move the pointer or take focus. That is right for automation and wrong for a demo, where the pointer is the story. Pointer-moving input (`hover`, `drag`, `mouse-move`, `mouse-click`) and, on Windows, `type`, `double-click` and `focus` need the global `--headed` flag. Its own guide says to use `--headed` only when the user permits physical input: ask first, because it takes over the mouse.
- **`cursor-overlay enable`** draws an agent pointer and ripple for headless actions. On a `--headed` action the real pointer moves and the overlay does not animate the travel. Whether a screen capture includes the overlay window was not tested here.
- **`mouse-move` has no duration option** in its docs (`hover` rejects `--duration`). A hand-speed glide is a sequence of short `--headed mouse-move --xy` calls, or the overlay's own travel.
- **Refs belong to their snapshot** (`@s8f3k2p9:e8`); a bare `@e8` is rejected and a changed UI returns `STALE_REF`. Never write one into a script.

Commands a desktop take uses:

```bash
agent-desktop launch <absolute path or system name>
agent-desktop resize-window --app "Tasks" --width 1280 --height 720
agent-desktop move-window --app "Tasks" --x 80 --y 80
agent-desktop snapshot --app "Tasks" -i
agent-desktop --headed click '@s8f3k2p9:e8'
agent-desktop wait --text "4 open" --app "Tasks"
agent-desktop dismiss-all-notifications
```

### Windows, honestly

- Supported: Windows 10 1809 or later, in the signed-in user's interactive session. Session 0, a locked desktop, the secure desktop (UAC prompts) and another user's session are not.
- No permission grant is needed for apps at the terminal's integrity level. An app running as administrator can be read; only an elevated agent can send it input.
- The binary is unsigned. Smart App Control on a clean Windows 11 install blocks it, and its docs say no launch mode avoids that.
- `launch` takes an absolute path or a bare System32 name, never a display name. Quote every ref in PowerShell.
- On the machine this skill was built on, version 1.0.2 installed and `agent-desktop version` ran, and `agent-desktop status` returned `PERM_DENIED` about a file permission in its own state folder. No desktop take was recorded with it here. Run `agent-desktop status` first and expect to fix the environment before the take.

### The capture commands

Capture the window's rectangle, never the display. Multiply the window's size and position by the display scale: a 1280 x 720 window at 150 % is 1920 x 1080 capture pixels.

```bash
# Windows: GDI capture of a rectangle of the desktop, pointer drawn
ffmpeg -f gdigrab -framerate 30 -draw_mouse 1 -offset_x 120 -offset_y 120 -video_size 1920x1080 -i desktop -c:v libx264 -crf 16 -pix_fmt yuv420p out/raw.mp4

# macOS: capture a screen, then crop to the window (find the screen's index with -list_devices true)
ffmpeg -f avfoundation -framerate 30 -capture_cursor 1 -i "<screen index>:none" -vf "crop=2560:1440:160:160" -c:v libx264 -crf 16 -pix_fmt yuv420p out/raw.mp4

# Linux on X11
ffmpeg -f x11grab -framerate 30 -draw_mouse 1 -video_size 1920x1080 -i :0.0+120,120 -c:v libx264 -crf 16 -pix_fmt yuv420p out/raw.mp4
```

- The `gdigrab` option names were checked against `ffmpeg -h demuxer=gdigrab` (ffmpeg 8.1). The three commands were not run for this skill, because running one records the user's screen and that needs the user's yes. Run a two-second test take first and probe it.
- `gdigrab` can return black for a window drawn by the GPU. Use `-f lavfi -i ddagrab=framerate=30` (Desktop Duplication) with the same crop when it does.
- `x11grab` does not work on Wayland. Use the compositor's own recorder there and say so in `DEMO.md`.
- Start ffmpeg, wait for its first frame, run the beats, then stop it with `q`. The handles are cut in post.

## What decides the surface

```text
Is the app a web page, or Chromium inside (Electron)?
  yes -> web. record.mjs when Playwright is available, agent-browser otherwise.
  no  -> does it publish an accessibility tree (agent-desktop snapshot shows refs)?
           yes -> desktop: agent-desktop --headed drives, ffmpeg records the window.
           no  -> a person drives from the script, ffmpeg records the window.
Does the take need the product simplified, or a state the product cannot reach?
  yes -> stop. That is faux UI, and stageshow owns it.
```

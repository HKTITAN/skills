---
title: sticker-pack
summary: What a pack contains and how it is made. The folder layout, each output's size, length and file-size limit, the three steps of the pipeline (generate, render frame by frame, pack), the moving die-cut, the manifest, and which platform rules are not written here and must be confirmed.
tags: [sticker, pack, whatsapp, telegram, webp, webm, png, render, pipeline]
---

# Sticker pack

A pack is the set, rendered into the files a chat app or a page installs. Every number in this file was read from a ten-sticker pack that shipped with this pipeline: its code and its notes. A platform rule that is not written here is not known here. Confirm it against the platform's current rules before promising it.

## What a pack contains

```text
<pack>/
  pack.json                       the manifest: every sticker and every output
  svg/<name>.svg                  static master, with the die-cut
  animated/<name>.svg             CSS keyframes, a reduced-motion still inside
  png/<name>.png                  512 x 512 still, transparent, 16 px margin
  whatsapp/static/<name>.webp     512 x 512, under 100 000 bytes
  whatsapp/animated/<name>.webp   512 x 512 loop, under 500 000 bytes
  whatsapp/tray.png               96 x 96
  telegram/<name>.webm            VP9 with alpha, 512 x 512, 30 fps, 3s at most, under 256 000 bytes, no audio
```

| Output | Size | Length | File size | Made from |
| --- | --- | --- | --- | --- |
| Static master SVG | 500-unit canvas | still | under 30 KB as a default budget | the generator |
| Animated SVG | 500-unit canvas | 2.5s (150 frames at 60 fps) | under 30 KB as a default budget | the generator |
| Still PNG | 512 x 512, art inside a 16 px margin (480 x 480) | still | no limit set here | the static master |
| WhatsApp static WebP | 512 x 512 | still | under 100 000 bytes | the PNG |
| WhatsApp animated WebP | 512 x 512 | 75 frames of 33 ms, looping forever | under 500 000 bytes | the frames |
| WhatsApp tray icon | 96 x 96 PNG | still | no limit set here | one sticker's PNG, resized |
| Telegram video sticker | 512 x 512 WebM, VP9, alpha | 2.5s at 30 fps, 3s at most | under 256 000 bytes | the frames |

Every limit is a strict "under". What the ten-sticker pack weighed, for scale: static WebP 13 to 23 KB, animated WebP 235 to 463 KB, WebM 50 to 133 KB, PNG 27 to 47 KB, SVG files 6 to 49 KB. The animated WebP is the output that runs closest to its limit.

A still-only sticker ships the static SVG, the PNG and the static WebP. A sticker that moves ships all six. A page set also keeps a still raster twin of every sticker for views that show many at once.

## The pipeline

Three steps, each a script, each reading only the step before.

### 1. Generate

One source of geometry writes two files per sticker:

- `svg/<name>.svg`: the rested still, with the die-cut as its first layer.
- `animated/<name>.svg`: the same parts wrapped in their motion groups, a `<style>` with the keyframes and the reduced-motion block, and no die-cut unless the whole sticker moves as one.

Keep the palette roles in one table at the top of the generator, so changing one role recolours every sticker. Lettering goes in as outlines. Check both folders with the gate before rendering anything: a fault found after encoding costs the whole pipeline again.

### 2. Render

Open each file in a headless Chrome page 512 x 512 at device scale 1, with a transparent ground, the SVG laid out 480 x 480 at an offset of 16, 16. That offset is the margin.

- **Still:** screenshot the static master with the background omitted. That is `png/<name>.png`.
- **Frames:** render the animated file frame by frame, never in real time. For each frame `i` of `fps x seconds` (30 x 2.5 = 75), pause every animation in the document and set its clock, then screenshot:

```js
for (const a of document.getAnimations()) { a.pause(); a.currentTime = (i * 1000) / 30; }
```

A recording in real time drops and doubles frames. A paused clock gives the same 75 frames on every machine. This is why sticker motion is CSS keyframes: `document.getAnimations()` cannot seek SMIL, and a script-driven animation has no clock to set.

- **The moving die-cut:** chat frames need the white border on every frame, following parts that move apart. Before rendering frames, wrap the art in a filter that builds the border from the art's own alpha: blur the alpha by 7, harden it with a linear alpha transfer (slope 24, intercept -1.5), flood it white, and merge the art on top, with the filter region 20% larger than the art on every side. The filter exists only in the render step. It is never in a shipped SVG.
- **Sheet:** render every static master on one sheet, and a second row at 160 px on white. That sheet is the first thing a reviewer is handed.

### 3. Pack

- **WhatsApp static:** encode the PNG to WebP at quality 90; while the file is 100 000 bytes or more, step down through 80, 70 and 60.
- **WhatsApp animated:** encode the 75 frames as one WebP, 33 ms a frame (1000 / 30, rounded down), loop count 0, at quality 80; while it is 500 000 bytes or more, step down through 70, 60, 50 and 40.
- **Tray:** resize one sticker's PNG to 96 x 96. Use the sticker that names the pack.
- **Telegram:** encode the frames with ffmpeg as VP9 with alpha, constant quality, no audio, cut at 3 seconds:

```sh
ffmpeg -y -framerate 30 -i frames/<name>/%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 34 -an -t 3 telegram/<name>.webm
```

While the file is 256 000 bytes or more, raise `-crf` through 40, 46 and 52.

Print a table of every sticker's three sizes at the end. A sticker that only fits at the last quality step has too much moving: fewer frames of change, flatter fills, or a shorter action fix it at the source.

## The manifest

`pack.json` lists the stickers and the outputs. `examples/pack.json` is the gold.

- Each sticker: `name` (lowercase words joined by hyphens), `kind`, `title` (what it says, in words), `animated`, and `verb` when it moves.
- `outputs`: one entry for each of `svg`, `animated`, `png`, `whatsappStatic`, `whatsappAnimated`, `tray` and `telegram`, each with its `path`, and the sizes and limits from the table above.
- The gate holds the manifest's numbers to this file. A manifest cannot loosen a limit.

## Check a pack

```sh
node scripts/sticker-check.mjs <pack>/svg <pack>/animated --pack <pack> --gate
```

The gate reads PNG and WebP sizes from their headers, file sizes from disk, the PNG's alpha for the margin and the transparent ground, and each WebM through `ffprobe`. Without `ffprobe` it prints `inconclusive: ffprobe not found` for each WebM and exits 2: a pack is never passed with its videos unread.

Then look: play every animated WebP and WebM on a white, a dark and a chat-bubble ground, and watch the die-cut on the frames where parts are furthest apart.

## Not written here: confirm before promising

This file holds what the shipped pack's code and notes state. None of the following is in them, so none of it is a rule of this skill:

- How many stickers a WhatsApp or Telegram pack must or may hold.
- A size limit for the tray icon, and whether it may be any format but PNG.
- The longest animated WebP WhatsApp accepts, and its shortest frame time.
- Whether Telegram accepts a video sticker that is not square, at another frame rate, or that does not loop cleanly.
- Telegram's rules for a static sticker. The pack used its 512 x 512 PNG as the source and shipped no Telegram-specific still.
- Emoji assignment, pack titles, author fields, and how each platform's packer or bot ingests the files.
- Any other platform: iMessage, Signal, Discord, Slack, LINE.

When a brief names one of these, read the platform's current documentation, write the number and its source in `STICKERS.md`, and add it to [gotchas](gotchas.md).

## Sources

- A ten-sticker chat pack built by this skill's author with this pipeline: its generator, renderer and packer, and its notes. Every size, length, limit and quality step above.
- A fourteen-sticker page set by the same author: the still raster twin for views that show many at once.

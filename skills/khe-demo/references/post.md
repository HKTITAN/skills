---
title: post
summary: What happens to a take after it is recorded. Trim, ramp the waits, push in on the action, export, and what stays out.
tags: [demo, post, trim, ramp, zoom, export, ffmpeg]
---

# Post

Post makes a good take shorter and easier to read. It never repairs a bad one: a wrong state, a missed click or a stray notification is fixed in the script and recorded again. Every command here is `scripts/post.mjs`, which wraps ffmpeg, writes a new file each time and never touches its input.

## Order

```text
take.mp4 -> trim -> ramp -> zoom or crop -> mp4, webm, gif, poster -> gate
```

Trim first, because every later time is measured on the trimmed file. Each step re-encodes at CRF 16, which costs no visible detail across three steps; the delivery encode is the only lossy one a viewer sees.

## Trim

```bash
node scripts/post.mjs trim out/take.mp4 out/1-trim.mp4 --from 0.3 --to 8.1
```

- `record.mjs` leaves 500 ms of still frame before the first step and after the last. Keep 200 to 300 ms at the head, so the first frame is seen before it moves, and end inside the payoff hold.
- The first frame must be complete and the last frame must be the payoff, held. Never end on the frame the action finishes.
- For a loop, trim so the last frame is the first frame: cut the tail to the end of `loop.return` and the head to the same still.

## Ramp

A wait the app really took is kept, and shortened. The viewer should see that the product worked, and should not sit through it.

```bash
node scripts/post.mjs ramp out/1-trim.mp4 out/2-ramp.mp4 --span 4.6-6.9
node scripts/post.mjs ramp out/1-trim.mp4 out/2-ramp.mp4 --span 4.6-6.9@4 --span 9.0-10.4
```

- **Find the spans in the take report.** Each wait is listed with its length; a `mark` step gives a named time. Check each span against the contact sheet before cutting.
- **A span with no speed lands on 0.5 s.** Half a second is long enough to see a spinner turn and short enough not to be felt.
- **Past 8x, cut instead.** A 6 s wait at 12x is a flicker. Trim the middle out behind the spinner, or better, make the demo's backend answer faster and record again.
- **Ramp only stillness.** A span that contains the pointer moving or text being typed makes them race. Start the span after the pointer has stopped and end it before the result appears.
- **Never ramp the payoff hold or a reading hold.** They are already the length reading takes.

## Zoom and crop

Push in when the action is small in the frame and the text would otherwise land under 11 px. A push-in is a camera move, so it gets a cause and it is used once.

```bash
node scripts/post.mjs zoom out/2-ramp.mp4 out/3-zoom.mp4 --rect 300,0,1700,956 --from 1.5 --to 5
node scripts/post.mjs crop out/2-ramp.mp4 out/3-crop.mp4 --rect 200,0,1800,1012 --width 1280
```

- **Rects are in the file's own pixels:** x, y, width, height. A 1280 x 720 take at scale 2 is 2560 x 1440. `zoom` keeps the frame's shape and ignores the height.
- **At most 2x on a scale-2 take.** Past that the push shows fewer file pixels than screen pixels and softens. 1.3x to 1.6x is usually enough.
- **The push takes 0.5 s in and 0.5 s out,** eased at both ends. Start it as the pointer sets off for the control, and return before the payoff when the payoff is elsewhere in the frame.
- **The pointer holds still while the view moves,** or the two motions fight. Time the push between pointer moves.
- **Keep what the action changes inside the rect.** A push that crops the count that is about to change hides the story. Read the contact sheet of the zoomed file.
- **`crop` is a fixed reframing** for the whole clip: use it to cut dead margin a wide layout leaves. It is not a way to rescue a take recorded at the wrong viewport; record that again.
- Declare the push in the script as `"post": { "zoom": 1.5 }` so the gate's reading-size check counts it.

## Export

```bash
node scripts/post.mjs mp4 out/3-zoom.mp4 out/demo.mp4
node scripts/post.mjs mp4 out/3-zoom.mp4 out/demo-1280.mp4 --width 1280
node scripts/post.mjs webm out/3-zoom.mp4 out/demo.webm
node scripts/post.mjs gif out/3-zoom.mp4 out/demo.gif --width 800 --fps 20
node scripts/post.mjs poster out/demo.mp4 out/demo.png --at 6.5
node scripts/post.mjs sheet out/demo.mp4 out/sheet.png --every 0.5
```

- Sizes, codecs and ceilings are in [capture](capture.md). A delivery file at a size other than viewport times scale goes in the script's `outputs`, or the gate raises `take-resolution:`.
- **The poster comes from inside the payoff hold,** never from a frame mid-change. Most people see only that frame.
- **Make the contact sheet from the delivery file,** not from the master. It is what [verify](verify.md) and the review read.
- On a page: `<video autoplay muted loop playsinline poster="demo.png">` with the webm first and the mp4 second, and the poster as the image for visitors who ask for reduced motion.

## What stays out

- **Captions, titles, arrows and callouts.** A take that needs a label to be understood has the wrong beats. Text over picture belongs to the film it is cut into.
- **Music, clicks and voice.** Added after the cut is locked, by another skill.
- **Cuts between takes.** A demo is one continuous take; two takes joined is an edit, and an edit is a film.
- **Painting over the frame.** Blurring a name, covering a notification, patching a typo. The state was wrong: fix the seed and record again. A blur also tells the viewer something real was there.
- **Speeding up the whole take.** It makes the pointer and the typing inhuman. Ramp the waits and cut a beat.
- **Frame interpolation and sharpening.** They invent pixels in a recording whose point is that it is real.

<!-- Gold review of a render. Learn: each row is a measurement with its second and its frame, the register's target, and the reference that owns the rule; the last line says what nobody watched. -->

# Review: relay-launch-v3.mp4

register: ui-motion, ~4 cuts/min, ~9 % still
measured: 60.00 s at 30 fps native, 1920 x 1080; all 1,800 frames decoded; cuts recounted by eye from contact sheets stepped every 2 frames

| Before | After | Why |
|---|---|---|
| 22.00 s to 22.62 s (f 660 to f 679 at 30 fps): the 33-character prompt types in 0.62 s, 53 characters a second | 2.2 s of typing at 15 characters a second, then a 1.15 s hold | the prompt carries the argument, so it is read, not recognised; launch-video-ui-demo |
| 36.00 s (f 1080 at 30 fps): the cut lands on a frame settled since 35.40 s; the next shot first moves at 36.93 s | the incoming shot moves by 36.40 s, or the cut is taken mid-push | dead cut: a settled frame, then a scene that waits; launch-video-cuts |
| whole film: true peak +0.4 dBTP, integrated -13.9 LUFS | -1 dBTP or under; -17.7 LUFS as written beside the register | -1 dBTP is the one fixed number, and the loudness is not the one the plan chose; launch-video-sound |
| 58.83 s (f 1765 at 30 fps): the endcard's last change; the final frame holds 1.17 s | a final hold of about 2 s inside the 5.0 s endcard | inside Skale's quartiles (1.1 to 2.9 s) but under the 1.8 s median; launch-video-structure |

```json
{
  "film": "relay-launch-v3.mp4",
  "register": "ui-motion",
  "fps": 30,
  "duration_s": 60.0,
  "cuts": 4,
  "cuts_per_min": 4.0,
  "still_share": null,
  "first_word_s": 0.2,
  "first_seam_s": 1.6,
  "name_s": 17.4,
  "name_pct": 29,
  "typed_prompt_cps": 53,
  "endcard_s": 5.0,
  "endcard_hold_s": 1.17,
  "lufs": -13.9,
  "true_peak_dbtp": 0.4
}
```

Rows 1 and 2 are in the render and not in the plan: the plan types the prompt in 2.2 s and marks the 36.0 s exit as moving.
Still share is null: nothing here measured it, so the register's still row is unjudged.

Gate: `film check passed` on ui-motion.plan.json with the render (ffprobe: 60 s, 30 fps, 1920 x 1080, H.264 level 4.2, 1800 frames)
Not checked: still share, sound sync on frames, the 9:16 cut, a decode on the hardware decoder.

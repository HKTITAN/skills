# Package Cheatsheet

| Problem                                         | Solution                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| Not sure how to show it                         | Three ideas as stills before any render                                   |
| A render redone three times                     | Agree the look on `2` to `4` stills, then render once                     |
| Video stutters or looks soft                    | Render frame by frame on a paused clock, never `recordVideo`              |
| Component is a speck on a phone                 | Short side at least `2000px`: raise the device scale, never CSS-scale     |
| Video plays badly on X                          | Long side at most `4096px`; `60fps`, H.264, `crf 14`, `yuv420p`           |
| Reads as a screenshot of a page                 | `60px` of page around a click-through, `40px` around a reel item          |
| Cursor looks fake                               | The system's own arrow and hand, never a drawn one                        |
| Cursor pulls the eye off the animation          | Stop it dead while the motion plays                                       |
| Cursor covers the label it clicked              | Rest low and right of the label's centre                                  |
| Dead first second                               | First action `0.3` to `0.4s` in                                           |
| Click-through drags                             | `6` to `9s`: glide `0.55s`, settle `0.15s`, click, hold `0.6s`            |
| Explainer too long or too thin                  | `20` to `26s`, `1080x1080` at DSF `2`                                     |
| Transition between demos                        | A hard cut                                                                |
| Duration comparison looks the same              | Run the third cycle at `1x`, not slowed down                              |
| No live build to point at                       | The `stageshow` format: render the scene through `?capture=`              |
| Post opens with "Excited to share"              | A first line that says what a stranger gets                               |

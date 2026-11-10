# Demo Cheatsheet

| Problem                                           | Solution                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Second take starts from what the first one left   | A `reset` block in the script, proved with `--takes 2`                  |
| Step fails on a slower machine                    | An `until` condition such as `{ "visible": "<target>" }`, never a sleep |
| Spinner sits on screen for seconds                | `"ramp": true` on the wait, ramped to `0.5 s` in post                   |
| Nothing happens for two seconds before the result | Reading holds capped at `1500 ms`, each with a `why`                    |
| File ends before the result is read               | A payoff hold of `1500` to `3000 ms` as the last step                   |
| Pointer jumps between controls                    | `pace.move_ms` at `300` to `900`                                        |
| Click misses after one new control is added       | A test id such as `[data-testid=add]`, never `:nth-child(2)`            |
| Typed text appears faster than it is read         | `pace.cps` at `12`                                                      |
| Text is too small in the README                   | A `1024 x 640` viewport at scale `2`                                    |
| Take looks soft                                   | Scale `2` with `--force-device-scale-factor`, never an upscale          |
| GIF plays too fast or too slow                    | `--fps 20`                                                              |
| mp4 will not play in Safari                       | H.264 in `yuv420p`, exported with `post.mjs mp4`                        |
| Loop jumps at the seam                            | `loop.return`, with the tail trimmed to its end                         |
| Date on screen changes between takes              | `state.clock` such as `2026-03-02T09:41:00`                             |

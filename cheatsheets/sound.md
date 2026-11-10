# Sound Cheatsheet

| Problem                                      | Solution                                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Click feels late                             | Trim to the first sample above `-60 dBFS`                                                    |
| Click fires before the press lands           | Cue the contact frame, plus `0` to `30 ms`                                                   |
| Sound works only on the second click         | Create and `resume()` the `AudioContext` inside the first gesture                            |
| Every play starts a beat late                | Decode once, a new `AudioBufferSourceNode` per play, never `new Audio()`                     |
| First visit makes a sound                    | `defaultOn: false`: on only when a stored on exists                                          |
| Tick rings on                                | Cut to `40` to `80 ms` and fade the last `10 ms`                                             |
| Louder and harsher after normalizing         | Trim the tail first, then peak at `-3 dBFS`                                                  |
| Gone on a laptop speaker                     | Body in 500 Hz to 4 kHz, high-pass at `150` to `200 Hz`                                      |
| Stereo tick smears on a phone                | Mono, `44.1 kHz`, 16-bit WAV                                                                 |
| One sound seems to belong to another product | One material line, regenerate the whole family                                               |
| Generated tick comes with a room tail        | "dry, no tail" in the prompt, `duration_seconds: 0.5`, `prompt_influence` at `0.8` or higher |
| Sound on a spring entrance lands late        | Cue the first crossing of rest, not `animationend`                                           |
| Film reveal lands flat                       | Take the sub away `0.1` to `0.9 s` before the drop                                           |
| Film master peaks too hot                    | True peak at `-1 dBTP`                                                                       |
| Tap or receive sound runs long               | `tap` at `120 ms`, `receive` at `400 ms` at most                                             |

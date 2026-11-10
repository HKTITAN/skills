# SVG Cheatsheet

| Problem                                        | Solution                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| Icon stays 24px, or clips when its box changes | `viewBox="0 0 24 24"` on the root, no `width` or `height`                  |
| Icon stays grey in dark mode                   | `fill="currentColor"`                                                      |
| Graphic is black on one page only              | A fallback inside every `var(--token, fallback)`                           |
| Arm or spinner orbits the top-left corner      | `transform-box: fill-box; transform-origin: center`                        |
| Morph jumps halfway                            | One command list in absolute commands on both `d` strings, or a swap       |
| Logo loaded as an image never animates         | `@keyframes` inside the file's `<style>`, nothing that waits for `:hover`  |
| Animation ignores reduced motion               | `@media (prefers-reduced-motion: reduce)` inside the file                  |
| SMIL bounce never runs                         | `keySplines` inside 0 to 1, the overshoot as an extra keyframe in `values` |
| Two inlined icons share a gradient             | Prefix each file's ids with SVGO `prefixIds`                               |
| Rule inside the SVG restyles the page          | An `id` on the root, every selector starts with it                         |
| Line and its end dot appear together           | The dot's delay equals the stroke's duration                               |
| Draw-on needs the exact path length            | `pathLength="1"` with `stroke-dasharray: 1; stroke-dashoffset: 1`          |
| Icon looks heavier than the text beside it     | `1.5px` stroke at 24px for a 400 weight font                               |
| Traced clip exports at 200 KB                  | Quantize before tracing, 24 frames at `12 fps`, SVGO at precision `1`      |
| Outline icon vanishes at small size            | Switch to the filled variant below `12px`                                  |
| Flipbook file is too heavy                     | Hold it to `60 KB`                                                         |

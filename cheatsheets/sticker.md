# Sticker Cheatsheet

| Problem                                           | Solution                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| Sticker loses its edge on a photo or in dark mode | White die-cut as the first layer, `12` units outside the art          |
| Outline is thick on one edge and thin on the next | Lean in the path data, no `matrix()` on a stroked group               |
| One sticker looks thinner than its neighbours     | One `5` unit outline in the `ink` role on every file                  |
| One sticker looks small in the grid               | Subject's larger side at `55` to `65%` of the canvas                  |
| One sticker sits low or to one side               | Painted centre within `15` units of the canvas centre                 |
| White part looks dirty                            | `--white-side` as a palette pastel such as `#c9d6f2`, never grey      |
| Sticker keeps the same colour in every brand      | `fill="var(--main, #4f7cf7)"`, a role with its fallback               |
| Word changes shape on another machine             | Letters as outlines, the words in `data-text` and the `<title>`       |
| Sticker appears from nowhere, or as a ghost       | Pop from `scale(0.2)`, fully opaque                                   |
| Arm swings about the canvas corner                | `transform-box: fill-box` and a `transform-origin` at the hinge       |
| Everything moves as one stamp                     | Children start `4` to `6` frames after the lead                       |
| Loop never stops moving                           | Action in the first half, then a hold of `20` frames or more          |
| Reduced motion shows a half-built sticker         | `animation: none` in the query, every group resting in its still pose |
| Animated WebP will not fit WhatsApp               | Quality `80`, stepping down to `40`, until under `500 000` bytes      |

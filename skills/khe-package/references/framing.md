---
title: framing
summary: Frame size, device scale, margins, encoding, and what stays on screen.
---

# Framing

## Size

| Format | CSS frame | Device scale | Device frame |
|---|---|---|---|
| Explainer | 1080 by 1080 | 2 | 2160 by 2160 |
| Explainer that is one horizontal row | 1920 by 1080 | 2 | 3840 by 2160 |
| Click-through, hover reel | the component plus its margin | whatever makes the short side 2000 or more | at most 4096 on the long side |

Square reads best in a phone timeline; 16:9 looks too wide unless the content is one row.

Pick the device scale so that the short side times the scale is at least 2000: about 8 for a 250 px card, about 4 for an 880 px component. Lower it if the long side passes 4096. `render.mjs` does this, and nudges the scale so both sides are even, which yuv420p needs.

## Margin

40 px of page around a reel item; 60 px around a click-through component. The component sits at its real maximum width, never stretched. Never CSS-scale a live component to fill the frame: raise the device scale. A scaled component re-rasterizes and blurs.

## Encoding

60 fps, H.264, crf 14, yuv420p, `+faststart`, no audio track. `render.mjs` encodes this way.

## What stays on screen

- **The component's own text stays:** its labels, descriptions and menu items, taken from current source.
- **Strip the wrapper, not the component.** Remove borders, shadows and rounded boxes that the page or you put around the demo, replay buttons, and numbering like "01 Spring". The component's own surfaces stay. A wrapper makes the demo read as a screenshot of a page.
- **Theme:** the theme of the site the component lives in. Explainers default to white.
- **Fonts:** the product's own sans and mono, loaded from its files with `@font-face`; check `document.fonts` reports them loaded before rendering.
- **Comparisons:** both sides at the same scale, mirrored around the centre, triggered on the same frame. An easing comparison uses one duration on both sides, so only the curve differs.
- **Legends:** no box, no border; a short line swatch and a small mono label above the graph.
- **Alignment:** measure with `getBoundingClientRect`. A 1 to 2 px offset shows when the video loops; stacked demos share one left edge.
- **Never clip a demo:** let a graph or an overshooting spring overflow its box.
- **Text inside a pressed button:** give anything that scales `will-change: transform`, or its text re-rasterizes every frame and shifts.
- **Real content** (posts, reviews, names, dates) is never edited; crop out what does not fit.

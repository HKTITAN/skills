---
# Gold: a DESIGN.md with the source that obeys it (tokens.css, settings-card.css, SettingsCard.tsx).
# Learn: the front matter binds, the body picks between tokens. The palette is this example's own.
version: alpha
name: Tally

colors:
  primary: "#5b5bd6"
  surface: "#ffffff"
  ink: "#1a1a1a"

typography:
  body-md:
    fontFamily: "Public Sans"
    fontSize: 16
    lineHeight: 1.6
  caption:
    fontFamily: "Public Sans"
    fontSize: 14

rounded:
  sm: 4
  md: 8
  lg: 16

spacing:
  sm: 8
  md: 16

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
---

# Tally

## Overview

A billing tool. Quiet surfaces, one accent, type set for reading numbers.

## Colors

`primary` marks the one primary action of a view. `surface` is every card and field. `ink` is all text.

## Typography

Body is `body-md`, 16px on a 1.6 line. Hints and labels are `caption`, 14px. Never below 12px.

## Shapes

Cards take `lg`, fields and buttons take `md`, menu items take `sm`. A radius outside these three is a bug.

## Components

`button-primary` is the only primary button. A view has one.

## Do's and Don'ts

- Use `primary` on the one primary action of a view and nowhere else.
- Never write a hex, a font size or a radius in a component. Reference the token.
- Never add a token to this file without approval. Propose it in review.

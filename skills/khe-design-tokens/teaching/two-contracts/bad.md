---
# bad: two-contracts. This file and the contract beside it never say which one wins.
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
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
---

# Tally

## Overview

A billing tool. Quiet surfaces, one accent.

## Do's and Don'ts

- Use `primary` only on the one primary action of a view.
- Never write a radius that is not `sm`, `md` or `lg`.

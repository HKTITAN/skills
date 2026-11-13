---
title: using-design-file
summary: How the agent discovers, reads, follows, updates, and verifies a project's .design contract, and why it outranks this skill's defaults.
tags: [meta, design-file, tokens, contract, workflow]
---

# Using a `.design` contract

A `.design` file (schema `design.v1`) is a machine-readable visual contract: tokens, components, copy voice, executable policy, and a committed aesthetic intent. When a project has one, it is the source of truth and **this skill drops to advisory**.

## Where this skill sits

The format defines a precedence chain, and it is worth internalizing because it decides who wins every disagreement:

1. Explicit user prompt (this task only)
2. The nearest `.design`
3. The `.design` format's own procedure
4. **Generic taste skills: this one**
5. Model defaults

So: if `.design` sets `tokens.motion.duration.base: 400ms`, you use 400ms even though the duration table in `motion` (`khe-ui` skill) says most UI lands under 300ms. Raise the tension once, in prose, then comply. The skill supplies craft **where the contract is silent**: that gap is large, and it is where the whole motion and surface canon still applies.

## Detection

Walk up from the file you're editing. Match the extension case-insensitively: the usual form is a named `<name>.DESIGN` (e.g. `campusbinge.DESIGN`). Prefer a literal `.design`; otherwise exactly one `*.DESIGN` in that directory. Several candidates → ask which system. Resolve `extends` depth-first, child overriding parent. In a monorepo, a package's nearer contract beats the repo root.

If UI work is requested and no contract exists, **offer to bootstrap: don't invent an untracked system.** Scan adjacent signals first: design notes in `AGENTS.md`, an existing `DESIGN.md` (see [using-design-md](using-design-md.md)), global CSS, Tailwind config, `components.json`. Extract the whole visual vocabulary, density, elevation language, motion character, copy tone, not just hex values.

## Reading

A `.design` has four required fields: `schema: design.v1`, `name`, `version` and `agent.instructions`. The gate reports a contract missing any of them as `contract-invalid:`. Load `agent.instructions` first: it is self-contained, so the file works even where no skill is installed. Then `intent` → `constraints` → `policy` / `decisions` → `tokens` → `voice` → `components`. Pull `rationale.*` on demand for the task at hand.

`intent` is the field with no `DESIGN.md` equivalent, and it is the one that resolves taste arguments: `direction` (the committed aesthetic), `signature` (where boldness is allowed to concentrate), `treatment` (`utilitarian` vs `editorial` register). Calibrate per surface: `patterns.<name>.treatment` overrides `intent.treatment`. A dashboard gets restrained product craft; only editorial surfaces run the distinctive-identity register. Everything outside `signature` stays quiet, which is the same instinct as the frequency table in `taste` (`khe-ui` skill) with a budget written down.

## Following

Bind every property a component lists: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Never write a raw hex, spacing, or radius when a token exists. Obey `when` / `when_not` and walk `decisions` first-match-wins. When a component isn't catalogued, `policy.if_missing` decides: `ask`, `nearest`, or `invent_with_note`.

Apply `voice.*` to UI copy with the same force as tokens: `register`, `casing`, the `terminology` map, `action_naming` continuity, and the `errors` style rule. These are the copy rules in `components` (`khe-ui` skill) with the vocabulary pinned.

## Updating and verifying

Edit the contract in place and bump `version`; git is the audit trail. The contract is `design.v1` data in YAML or JSON: a `.design` written as JSON is valid YAML, the gate reads both, and the schema decides what is valid, never the syntax. Never add `proposed_changes` or an in-file changelog. Ask before touching any dot-path in `locked`.

A drift check compares `tokens` against the real CSS/Tailwind theme and `components` against real imports, then reports per token group as **added / removed / modified** with a **regression** flag: closer to the format in `review` (`khe-ui` skill)'s discipline than to a lint pass. Report before fixing; update the contract only when asked.

## shadcn

When `integrations.shadcn.enabled`, prefer installed shadcn primitives over parallel ones, and write `css_vars` into the declared CSS file. **Tokens outrank stale `css_vars` literals**: refresh the CSS after token edits rather than trusting what's already in `:root`. Emit the full variable set including charts and sidebar. The `design.v1` spec has the Tailwind v4 mechanics.

## UI SDK

The `design.v1` schema has no integration key for Vercel's UI SDK, so detect it from the project: an `@ui-sdk/*` package in `package.json`, and an import of `@ui-sdk/core/web.css` (or a `<link>` to `ui-sdk.dev/web.css` on a page with no build step). Without that stylesheet the components are unstyled and the contract's tokens land on your own CSS as usual. With it, the mirror gains one block: the contract's tokens assigned to the stylesheet's `--ui-*` variables on `:root`, so every component follows the contract without a rule per part.

| `--ui-*` variable | Bind the contract's |
|---|---|
| `--ui-background`, `--ui-foreground` | page surface and body text |
| `--ui-muted`, `--ui-muted-foreground` | hover and selected fill; secondary text |
| `--ui-border`, `--ui-input` | divider; control border |
| `--ui-primary`, `--ui-primary-foreground` | the one accent, and the text on it |
| `--ui-destructive` | error |
| `--ui-ring`, `--ui-ring-border` | focus outline; a focused field's border |
| `--ui-overlay`, `--ui-shadow` | modal backdrop; popup shadow |
| `--ui-radius` | the control radius. One value: the stylesheet derives the rest |
| `--ui-spacing` | the spacing unit. Control height is 8 of them |
| `--ui-font-size`, `--ui-line-height`, `--ui-font-sans`, `--ui-font-mono` | control text and the families |

- **Assign by reference, never by copying the value:** `--ui-primary: var(--accent)`. A literal here is a second source and drifts like stale `css_vars`.
- **`@layer ui-sdk;` is the first line of the global stylesheet,** above any Tailwind import. The stylesheet lives in that layer; declared first, the mirror wins without `!important`.
- **The stylesheet writes colors with `light-dark()` under `color-scheme: light dark`.** A contract with one scheme sets `color-scheme: light` (or `dark`) on `:root`, or the components follow the system theme while the rest of the product does not.
- **A contract token with no `--ui-*` variable (a second radius, a disabled color) is bound on the part,** by its `data-slot`, outside the layer. Which parts and which states: the `ui-sdk` lane (`khe-ui` skill).
- **Never edit the installed `web.css`.** It is replaced on every upgrade.

Variables read from the stylesheet served at ui-sdk.dev/web.css on 2026-11-13, at `@ui-sdk/core` `0.1.0-beta.2`. The library is in beta: re-read `node_modules/@ui-sdk/core/dist/web.css` before binding, and treat a variable that is not in it as a gap.

## Sound, video, and companions

Contract 1.3 adds `tokens.sound` (default toggle state, one material, levels, durations, sync tolerance), `assets.sounds`, `decisions.sound`, `targets[]` video entries, and `exports.frame_md`. When they exist they outrank `sound-spec` (`khe-sound` skill) and `sound-decision-framework` (`khe-sound` skill); when the group is absent, the contract is saying *silent* and this skill must not add a sound. A `video` target flips the default, see `launch-video-sound` (`khe-sound` skill), and `exports.frame_md` is how a HyperFrames project inherits the brand's motion and material. The format's own procedure also names the companions it routes to; `khe-auto` is this collection's side of the same handshake.

## `.design` vs `DESIGN.md`

Both can exist. `.design` is the machine-readable contract with intent and executable policy; `DESIGN.md` is prose-plus-tokens ([using-design-md](using-design-md.md)). When both are present, `.design` wins and `DESIGN.md` becomes rationale: offer to converge them rather than maintaining two sources.

## Reference

Bind by role, never by a value that looks close. For a component the contract doesn't list, map roles the way Stageshow maps a product's look from its code (`references/looks.md`, From a codebase): primary to the one accent, button or input radius to the middle radius, menu item to the small one, popover or card to the large one, input height to the control size.

- Bad: `.plan-card { background: #5b5bd6; border-radius: 6px; padding: 14px; }`, because 6px "looked like" the button.
- Good: `.plan-card { background: var(--surface); border-radius: var(--radius-lg); padding: var(--space-4); }`, the accent kept for the single primary action `intent.signature` names, plus a one-line note when `policy.if_missing` is `invent_with_note`.
- Drift line, reported before any fix: `tokens.radius  modified  lg 10px -> 12px in app/globals.css  regression: yes`.

Gold example: `examples/design-file/harbor.design` in this skill, whose `agent.instructions` block holds the read, follow and update loop in one place; `stageshow/references/looks.md` for the role mapping.

Check: put a still of the generated screen beside a screenshot of the product's existing screens at the same scale. Accent, gray temperature, radii and type should match at a glance; if one control looks foreign, re-read the contract and its real neighbor's computed styles rather than nudging by eye.

## Gotcha

Don't let the contract's existence stop the craft work. A `.design` that pins colors and radii says nothing about whether a spinner flashes under 800ms, whether the exit is 60% of the entrance, or whether a hover shifts 1px or 4px. Silence is not permission to default: it's where the checklist in `review` (`khe-ui` skill) still runs.

## Sources

- The `.design` contract format, schema `design.v1`.
- Benji Taylor, Stageshow 1.1.1 (MIT, github.com/benjitaylor/skills, HEAD `299140f`, read 2026-11-07): `stageshow/references/looks.md` (From a codebase, Check it).
- Vercel Labs, UI SDK (Apache-2.0, github.com/vercel-labs/ui, HEAD `8ff6bcf`, read 2026-11-13): `packages/core/skills/ui-sdk/references/styles.md` (Tokens), and ui-sdk.dev/web.css as served that day.
- Related: [using-design-md](using-design-md.md), the copy rules in `components` (`khe-ui` skill), the frequency table in `taste` (`khe-ui` skill), the format in `review` (`khe-ui` skill).

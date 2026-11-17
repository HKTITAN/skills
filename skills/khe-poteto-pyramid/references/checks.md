---
title: checks
summary: Building the static-analysis layer: picking a type, a lint, a boundary rule or a test; writing an error that names the fix; ratcheting an existing pattern; exceptions; proving the check fails.
---

# Checks

## Pick the check

| The mistake | The check | Examples |
|---|---|---|
| A value that should never hold a state | A type | A branded `NoteId` so a raw string cannot be passed; a union that has no "loading and error at once" member |
| A forbidden import across a boundary | A dependency rule | `dependency-cruiser` `forbidden` rule; ESLint `no-restricted-imports` with `patterns`; Python `import-linter` `forbidden` contract; Go `depguard` |
| A banned call or API | A lint | ESLint `no-restricted-syntax` with a selector, or `no-restricted-imports` with `importNames`; Ruff `flake8-tidy-imports` `banned-api`; an `ast-grep` rule |
| A required wrapper or pattern | A lint or a codemod plus a lint | "every route handler goes through `withAuth()`" as an `ast-grep` rule |
| Behavior that must hold | A test of what a user observes | The export produces the file; the list keeps its scroll position |
| Comments that excuse workarounds | A comment ban | `no-warning-comments` for markers, plus a small script that fails on any new comment in product folders |

Prefer the type when the language can carry it; it fails while the agent is still typing. Use a lint when bad code still compiles. A test is for behavior, never for structure a lint can see.

## The error

The agent reads the error and does what it says. Write it for an agent that opened one file and has never seen your AGENTS.md.

1. What was wrong, in one clause.
2. Why, in one clause, when the why changes what the fix is ("a timer here hides an ordering bug").
3. What to use instead: the file, type, function or command, in backticks.
4. Where to add to it, when the replacement may not cover the case.

| Mute | Names the fix |
|---|---|
| "Import not allowed." | "electron-renderer/ cannot import electron-main/. Ask main over IPC: `ipc.invoke('db:query', …)` from `electron-renderer/client/ipc.ts`." |
| "Do not use setTimeout." | "Timers are banned in product code: a timer here hides an ordering bug. Fix what runs too early. To run after the next frame, use `afterPaint()` from `client/schedule.ts`." |
| "useEffect is restricted." | "No useEffect in product code. Derived value: `useDerived()`. Listening: `useSubscription()`. Both in `client/hooks.ts`." |

Never tell the agent how to silence the rule. A message that ends "or add an eslint-disable comment" is a rule that will be disabled.

## Configuration shapes

ESLint flat config, a banned import and a banned call, with the allowed file switched off:

```js
export default [
  {
    files: ['electron-renderer/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{ name: 'react', importNames: ['useEffect', 'useLayoutEffect'],
          message: 'No useEffect in product code. Derived value: useDerived(). Listening: useSubscription(). Both in electron-renderer/client/hooks.ts.' }],
        patterns: [{ group: ['**/electron-main/**'],
          message: 'electron-renderer/ cannot import electron-main/. Use ipc.invoke() from electron-renderer/client/ipc.ts.' }],
      }],
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.name=/^(setTimeout|requestAnimationFrame|requestIdleCallback)$/]",
        message: 'Timers are banned in product code: a timer here hides an ordering bug. To run after the next frame, use afterPaint() from electron-renderer/client/schedule.ts.',
      }],
    },
  },
  { files: ['electron-renderer/client/hooks.ts', 'electron-renderer/client/schedule.ts'],
    rules: { 'no-restricted-imports': 'off', 'no-restricted-syntax': 'off' } },
]
```

dependency-cruiser, the same boundary as a graph rule:

```js
module.exports = {
  forbidden: [{
    name: 'renderer-not-to-main',
    comment: 'electron-renderer/ cannot import electron-main/. Use ipc.invoke() from electron-renderer/client/ipc.ts.',
    severity: 'error',
    from: { path: '^src/electron-renderer' },
    to: { path: '^src/electron-main' },
  }],
}
```

Ruff, a banned API in Python:

```toml
[tool.ruff.lint.flake8-tidy-imports.banned-api]
"requests".msg = "Use the shared client: `from app.http import client`. It sets timeouts and retries."
```

Check each tool's current documentation before relying on a key; these shapes are what the tools accepted when this was written, and tools rename options.

## The ratchet

When the pattern already appears many times, a rule that fails on all of them gets switched off on day one. Stop new occurrences first, then burn down the old ones.

- **ESLint bulk suppressions** (ESLint 9.24 and later): `eslint --suppress-rule <rule>` writes the existing violations to `eslint-suppressions.json`; new ones still fail, and `--prune-suppressions` removes entries once they are fixed. Confirm the flags in your version.
- **A count ratchet** in any language: a script counts occurrences on the base branch and on the change, and fails when the change's count is higher. Store the number in the repo so lowering it is a reviewed change.
- **A baseline file** for tools that support one (many type checkers and linters do): commit it, and fail when it grows.

The burn-down goes in the record's `Not verified:` or in `Open:` until it is at zero.

## Exceptions

An exception lives on the offending line, never in a config that silences the rule everywhere. It carries a reason, an expiry date and who approved it, so it shows up in review and in search. A disable comment with no reason is a fault the lint should catch: ESLint's `--report-unused-disable-directives` and the `eslint-comments` plugin's `require-description` rule both help.

## Proving it fails

A check counts after it fails on the mistake it was written for.

1. Find the past case in `Seen:`: a commit, a PR head, a reverted change.
2. Check it out (or apply its diff to a scratch branch) with the new check in place.
3. Run the exact command in `Enforced by:` and capture the failure.
4. Run the same command on your branch and show it passes.
5. Paste both into `Proof:` with the commit or PR reference.

When the past case is gone (squashed, force-pushed), write the smallest diff that reproduces it, run the check on that, and say so in `Proof:`. Run the same command locally and in CI; a check that only runs in one place is two checks that will disagree.

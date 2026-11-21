# Placements: kheSkills

Repo: HKTITAN/skills
Date: 2026-11-21
Job: place

## Placement: the router's domain figure keeps old counts when a skill is added

Correction: "the khe-auto domains figure was missed again when a skill was added; all the checks passed while it was wrong"
Seen:
- `00ac708` (khe-brain-gary, PR 37, 2026-11-21): the wiring updated the router table, `loop.md`, `route-check.mjs`, README, `skills.sh.json`, CHANGELOG and manifests, but `skills/khe-auto/assets/domains.svg` kept Brains at 8 and the footer at 19 here; it was caught while rebasing onto PR 36 and fixed in `cc2c21b`
- `10fadbc` (khe-decision, PR 36, 2026-11-21): Brains went to 8 in `.github/showcase/readme-auto.mjs` but the footer stayed "18 here"; fixed to 19 in `0ad2d93` after a review round
- `5df9780` (Plotter linked, 2026-11-18): the router gained a 23rd linked Design row, the figure kept 22 linked (and 68 in all); no review caught it, and it was still wrong on `cc2c21b` until this change
- the figure did not exist when `khe-brain-enrico` was added (`c80e77d`, 2026-11-15): `readme-auto.mjs` first landed in `47faecf` on 2026-11-17, so that addition is not an occurrence
Layer: codebase + static
Not higher:
- none: codebase is the top layer. It holds the numbers (they are read from the tables, never typed) but not the committed SVG, which stays stale until someone reruns the script; the static check holds that.
Change: `.github/showcase/router-counts.mjs` counts each domain's `here` and linked rows from the tables in `skills/khe-auto/SKILL.md`; `.github/showcase/readme-auto.mjs` draws the per-domain counts and the footer from it, and throws when the router's domains are not the five it has subtitles for; `.github/showcase/khe-figure.mjs` `write()` takes `--check`, which writes nothing and fails when the committed SVG differs; `scripts/check.mjs` runs `readme-auto.mjs --check` and fails when a khe skill has no `here` row in a router table (or a `here` row names a skill that is not here); `skills/khe-auto/assets/domains.svg` regenerated (Design 23 linked, footer 20 here and 69 linked); `kheskills` 1.3.2 because the figure is served.
Enforced by: `node scripts/check.mjs` (CI step "Every skill passes the spec and the repo's rules"), which runs `node .github/showcase/readme-auto.mjs --check`
Error: "skills/khe-auto/assets/domains.svg is not what readme-auto.mjs draws now (a count or a label changed): run `node .github/showcase/readme-auto.mjs` from the repo root and commit skills/khe-auto/assets/domains.svg"; for a missing row: "<skill> has no \"here\" row in a domain table of skills/khe-auto/SKILL.md, so the domains figure leaves it out: add its row to its domain's table"
Proof: the new check, overlaid on scratch worktrees of the old commits, went red on `5df9780` (22 linked and 68 where the tables say 23 and 69), `10fadbc` (footer 18 where the tables say 19, plus the 22), and `00ac708` (Brains 8 and footer 19 where the tables say 9 and 20, plus the 22), each ending `skills/khe-auto/assets/domains.svg is not what readme-auto.mjs draws now`; it printed no count difference on the four earlier commits where the figure was right (`a67d6d5`, `06a9305`, `c523c69`, `afee150`), so it does not fire on stable merged changes; on this branch `node scripts/check.mjs` ends `21 skills pass, 69 linked.`
Prose: none; no line in `AGENTS.md` or `CONTRIBUTING.md` told anyone to update the figure (that omission was the mistake), so none was deleted

Gate: pyramid-check passed
Not verified: that `scripts/check.mjs` and `.github/showcase/` can be edited by the change they judge, as every check here can (no CODEOWNERS or protected path exists, and branch protection was not changed); that the other figure scripts (`figures.mjs`, `readme-design.mjs`, `readme-craft.mjs`, `readme-brains.mjs`) draw what is committed, since only `readme-auto.mjs` is checked; that the rendered pixels of `domains.svg` are right beyond the diagram gate.

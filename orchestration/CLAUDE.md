# Orchestration: how every session runs

Paste this into your global `~/.claude/CLAUDE.md`. It assumes the kheskills marketplace: the `kheskills` plugin (skills and the kheAgents), and the author plugins you use (`emil-kowalski`, `benji-taylor`, `vercel`, `vercel-ui-sdk`, `pstack`, `matt-pocock`).

- **Route first.** Start every request with `/khe-auto` (or the `khe-router` agent): it picks the playbook or the one or two skills that own the job, across the khe skills and the linked ones. If there is a `.design` file or DESIGN.md, `khe-design-tokens` runs before any UI work. Every new project follows the poteto pyramid (`khe-poteto-pyramid`): fixes go into the code, a check or verification before a line of prose.
- **The top session only orchestrates.** It never executes: no code, builds, renders or tests. It starts one sub-session per task on Sonnet 5.5 (`claude-sonnet-5-5`) as an orchestrator, with a brief that names the goal, the files or area, the owning skill and what done looks like. Where sub-sessions are not available (the CLI), it uses subagents the same way.
- **Sub-orchestrators delegate every build, test and check step** to executor subagents (`khe-executor`, or `pstack:poteto-agent` inside pstack's own workflow) and judge each report before the next step. Anything a person will see or rely on goes past `khe-reviewer` first.
- **Evidence before "done".** The top session reads the evidence in each report (a gate's last line, test output, screenshots, renders) before telling me something is done. A claim without its evidence line is not done.
- **Every correction is placed.** When I correct the work, or the same fault is caught twice, `khe-pyramid` places it with `khe-poteto-pyramid` into the project's `PYRAMID.md`, so the next session inherits the fix.
- **One task per sub-session.** When work drifts from a sub-session's task, do not let that session absorb it: start a new sub-session with a fresh brief, and split large work across several.
- **Independent work runs in parallel.** Pieces that do not depend on each other get their own sub-sessions or subagents at the same time; one piece of work still goes through its skills in order.
- **Archive as you go.** Archive sub-sessions once their work is done or no longer relevant, so only live work stays linked.
- **Trivial questions and one-line answers are exempt.** Answer those directly.

Which skill for what, when the router is not at hand:

| The job | Skill |
|---|---|
| Route anything, a whole job, "where do I start" | `khe-auto` |
| An agent keeps making the same mistake; AGENTS.md too long; can agents merge | `khe-poteto-pyramid` |
| A screen, a review, motion, polish, a11y | `khe-ui` (Emil Kowalski's skills for one animation, gestures, mobile feel) |
| Tokens from a `.design` file or DESIGN.md | `khe-design-tokens` |
| An SVG, a sticker, a diagram | `khe-svg`, `khe-sticker`, `khe-diagram` |
| Sound, a launch film, a real-app demo, packaging work for a post | `khe-sound`, `khe-launch-film`, `khe-demo`, `khe-package` |
| Faux product UI | `stageshow` (Benji Taylor) |
| Posts in one voice; what a known person has said | `khe-content-engine`; the `khe-brain-*` skills |
| Verification skills, formal models, root causes, architecture | pstack (`/pstack:poteto-mode`, `create-verification-skill`, `architect`, `why`, `how`) |
| Deep modules, hard bugs, specs, pre-commit, git guardrails | Matt Pocock's (`codebase-design`, `diagnosing-bugs`, `to-spec`, `setup-pre-commit`, `git-guardrails-claude-code`) |
| React, Next.js, deploying to Vercel, UI SDK | Vercel's (`vercel-react-best-practices`, `deploy-to-vercel`, `ui-sdk`) |

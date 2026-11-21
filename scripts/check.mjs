#!/usr/bin/env node
// Checks every skill in skills/ against the Agent Skills spec and this repo's own rules.
//   node scripts/check.mjs
// Exits 1 with one line per problem.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { routerDomains } from "../.github/showcase/router-counts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = join(ROOT, "skills");
const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const problems = [];
const bad = (where, what) => problems.push(`${where}: ${what}`);

// Other people's skills are linked in skills/ as git submodules. They are not checked, only listed.
const linked = [...read(join(ROOT, ".gitmodules")).matchAll(/^\s*path = skills\/(.+)$/gm)].map((m) => m[1].trim()).sort();
const names = readdirSync(SKILLS).filter((d) => statSync(join(SKILLS, d)).isDirectory() && !linked.includes(d)).sort();
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

for (const name of names) {
  const dir = join(SKILLS, name);
  const skillPath = join(dir, "SKILL.md");
  if (!existsSync(skillPath)) { bad(name, "no SKILL.md"); continue; }
  const text = read(skillPath);
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  if (!fm) { bad(name, "SKILL.md has no frontmatter"); continue; }

  // The spec: lowercase letters, digits and single hyphens, 64 at most, same as the folder.
  const declared = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (declared !== name) bad(name, `name is "${declared}", the folder is "${name}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) bad(name, "name must be lowercase letters, digits and single hyphens, 64 characters at most");
  if (!name.startsWith("khe-")) bad(name, "name must start with khe-");

  const raw = fm.match(/^description:\s*(.+)$/m)?.[1];
  let description = raw || "";
  try { description = JSON.parse(raw); } catch { /* unquoted */ }
  if (!description) bad(name, "no description");
  if (description.length > 1024) bad(name, `description is ${description.length} characters; the spec caps it at 1024`);
  if (!/\bUse when\b/.test(description)) bad(name, 'description has no "Use when"');

  for (const file of ["README.md", "LICENSE"]) if (!existsSync(join(dir, file))) bad(name, `no ${file}`);

  // Every relative link resolves, every sibling skill named exists, every reference is reachable.
  const linked = new Set();
  for (const file of walk(dir).filter((f) => f.endsWith(".md"))) {
    const body = read(file);
    const rel = file.slice(dir.length + 1).replace(/\\/g, "/");
    for (const m of body.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      if (/^(https?:|mailto:)/.test(m[1])) continue;
      const target = join(dirname(file), m[1]);
      if (!existsSync(target)) bad(`${name}/${rel}`, `broken link ${m[1]}`);
      else linked.add(target);
    }
    for (const m of body.matchAll(/\bkhe-[a-z0-9]+(?:-[a-z0-9]+)*/g)) {
      if (!names.includes(m[0])) bad(`${name}/${rel}`, `names ${m[0]}, which is not a skill here`);
    }
  }
  const refs = join(dir, "references");
  if (existsSync(refs)) {
    for (const f of readdirSync(refs).filter((f) => f.endsWith(".md"))) {
      if (!text.includes(`(references/${f})`)) bad(name, `references/${f} is never linked from SKILL.md`);
    }
  }
}

// skills.sh.json groups the repo page; every skill sits in exactly one group.
const groups = JSON.parse(read(join(ROOT, "skills.sh.json"))).groupings;
const grouped = groups.flatMap((g) => g.skills);
for (const n of names) if (grouped.filter((g) => g === n).length !== 1) bad("skills.sh.json", `${n} must be in exactly one group`);
for (const g of grouped) if (!names.includes(g)) bad("skills.sh.json", `${g} is not a skill here`);

// The README table and the router both list every skill.
const readme = read(join(ROOT, "README.md"));
const router = read(join(SKILLS, "khe-auto", "SKILL.md"));
for (const n of names) {
  if (!readme.includes(`(skills/${n}/README.md)`)) bad("README.md", `${n} is missing from the table`);
  if (n !== "khe-auto" && !router.includes(`\`${n}\``)) bad("khe-auto", `the router never names ${n}`);
}

// Linked skills are pins, never checkouts. The skills CLI runs `git submodule update --init` on every
// remote install, and its skills/ walk goes three folders deep, so a checked-out link would install
// skills/animate/skills/animate as if it were mine. `update = none` makes git skip it.
for (const block of read(join(ROOT, ".gitmodules")).split(/^(?=\[submodule )/m).filter((b) => b.trim())) {
  const path = block.match(/^\s*path = (.+)$/m)?.[1]?.trim();
  if (!/^\s*update = none$/m.test(block)) bad(".gitmodules", `${path} needs "update = none", or npx skills add HKTITAN/skills installs its contents as this repo's skills`);
}

// Linked skills: never prefixed khe-, each named by the router and linked from the README.
for (const n of linked) {
  if (n.startsWith("khe-")) bad(".gitmodules", `${n} is linked from another repo and must not use the khe- prefix`);
  if (!router.includes(`\`${n}\``)) bad("khe-auto", `the router never names ${n}`);
  if (!new RegExp(`\\[${n}\\]\\(https://github\\.com/`).test(readme)) bad("README.md", `${n} is not linked to its original`);
}

// The router's domain tables and the domains figure count the same skills. The figure's counts are read
// from the tables (router-counts.mjs); the tables must hold every khe skill but khe-auto as a "here" row
// (the figure's footer says so), and the committed SVG must be what the script draws from them.
{
  const here = routerDomains(router).flatMap((d) => d.here);
  for (const n of names.filter((n) => n !== "khe-auto")) if (!here.includes(n)) bad("khe-auto", `${n} has no "here" row in a domain table of skills/khe-auto/SKILL.md, so the domains figure leaves it out: add its row to its domain's table`);
  for (const n of here) if (!names.includes(n)) bad("khe-auto", `a domain table marks ${n} as "here", but skills/${n} is not a khe skill in this repo: fix its Whose column, or add the skill`);
  const r = spawnSync(process.execPath, [join(ROOT, ".github", "showcase", "readme-auto.mjs"), "--check"], { encoding: "utf8" });
  if (r.status !== 0) bad("skills/khe-auto/assets", (r.stderr || r.stdout).trim().split("\n")[0]);
}

// The khe-brain plugin: one command per brain, in that brain's own folder
// (skills/khe-brain-varun/commands/varun-mayya.md is /khe-brain:varun-mayya), served by a plugin
// rooted at ./skills. Claude Code loads a root plugin's commands/ and agents/ whatever its entry says
// (an empty list falls back to the default folder), so the layout is what keeps the two plugins apart:
// no commands/ at the root, and khe-brain rooted where there are no agents.
const marketPath = join(ROOT, ".claude-plugin", "marketplace.json");
if (existsSync(join(ROOT, "commands"))) bad("commands/", "kheskills is rooted at ./ and would load every file here as its own command; a brain's command goes in skills/khe-brain-<x>/commands/");
if (!existsSync(marketPath)) bad(".claude-plugin", "no marketplace.json");
else {
  const plugin = JSON.parse(read(marketPath)).plugins.find((p) => p.name === "khe-brain");
  if (!plugin) bad("marketplace.json", "no khe-brain plugin");
  else {
    if (plugin.source !== "./skills") bad("marketplace.json", 'khe-brain must be rooted at "./skills": rooted at ./ it loads agents/ a second time');
    if (plugin.skills) bad("marketplace.json", "the khe-brain plugin must not list skills; each brain would show twice");
    if (plugin.agents) bad("marketplace.json", "the khe-brain plugin serves no agents; kheskills does");
    const listed = plugin.commands || [];
    const brains = names.filter((n) => n.startsWith("khe-brain-"));
    for (const n of brains) {
      const dir = join(SKILLS, n, "commands");
      const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
      if (files.length !== 1) { bad(n, `needs exactly one command in commands/, has ${files.length}, so it is missing from /khe-brain:`); continue; }
      const f = files[0];
      const at = `${n}/commands/${f}`;
      if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(f)) bad(at, "a command name is lowercase letters, digits and single hyphens");
      if (readdirSync(dir).length !== 1) bad(at, "commands/ holds only the command: Claude Code loads every file in it");
      if (!listed.includes(`./${n}/commands/`)) bad("marketplace.json", `./${n}/commands/ is not in the khe-brain plugin's commands`);
      // The command reads its own skill from the plugin root, which is skills/.
      const target = read(join(dir, f)).match(/\$\{CLAUDE_PLUGIN_ROOT\}\/(khe-brain-[a-z0-9-]+)\/SKILL\.md/)?.[1];
      if (target !== n) bad(at, `must read \${CLAUDE_PLUGIN_ROOT}/${n}/SKILL.md${target ? `, not ${target}` : ""}`);
    }
    for (const c of listed) if (!existsSync(join(SKILLS, c))) bad("marketplace.json", `khe-brain lists ${c}, which does not exist`);
  }
}

// The kheskills plugin: every khe skill except the brains, so one install line gets all of them.
if (existsSync(marketPath)) {
  const all = JSON.parse(read(marketPath)).plugins.find((p) => p.name === 'kheskills')
  if (!all) bad('marketplace.json', 'no kheskills plugin')
  else {
    const listed = (all.skills || []).map((s) => s.replace(/^\.\/skills\//, ''))
    for (const n of names.filter((n) => !n.startsWith('khe-brain-'))) if (!listed.includes(n)) bad('marketplace.json', `${n} is missing from the kheskills plugin`)
    const agentDir = join(ROOT, "agents");
    const agentFiles = existsSync(agentDir) ? readdirSync(agentDir).filter((f) => f.endsWith(".md")) : [];
    for (const f of agentFiles) {
      if (!(all.agents || []).includes(`./agents/${f}`)) bad("marketplace.json", `agents/${f} is missing from the kheskills plugin's agents`);
      const fm = read(join(agentDir, f)).match(/^---\n([\s\S]*?)\n---\n/)?.[1] || "";
      if (fm.match(/^name:\s*(.+)$/m)?.[1]?.trim() !== f.replace(/\.md$/, "")) bad(`agents/${f}`, "its name must match its file name");
      if (!/^description:\s*\S/m.test(fm)) bad(`agents/${f}`, "no description");
    }
    for (const a of all.agents || []) if (!agentFiles.includes(a.replace(/^\.\/agents\//, ""))) bad("marketplace.json", `the kheskills plugin lists ${a}, which does not exist`);
    for (const s of listed) if (!names.includes(s) || s.startsWith('khe-brain-')) bad('marketplace.json', `the kheskills plugin lists ${s}, which is not a khe skill outside the brains`)
  }
}

// The plugins that serve other people's skills are generated from the README's links.
{
  const r = spawnSync(process.execPath, [join(ROOT, "scripts", "marketplace.mjs"), "--check"], { encoding: "utf8" });
  if (r.status !== 0) bad("marketplace.json", (r.stderr || r.stdout).trim());
}

// The manifests each install path reads, held to its own spec, so a hand edit that would break an
// install fails here instead of on someone's machine. marketplace.mjs --check (above) catches drift
// from the folders; these catch what generation cannot: the specs' own rules.
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const json = (rel) => { try { return JSON.parse(read(join(ROOT, rel))); } catch (e) { bad(rel, `is not valid JSON: ${e.message}`); return null; } };
const onlyKeys = (where, obj, keys) => { for (const k of Object.keys(obj || {})) if (!keys.includes(k)) bad(where, `unknown field "${k}"; the spec allows ${keys.join(", ")}`); };

// skills.sh (https://skills.sh/schemas/skills.sh.schema.json): closed fields, the limits its schema sets.
{
  const s = json("skills.sh.json");
  if (s) {
    onlyKeys("skills.sh.json", s, ["$schema", "schema", "notGrouped", "groupings", "paths"]);
    if (s.$schema !== "https://skills.sh/schemas/skills.sh.schema.json") bad("skills.sh.json", "$schema must be https://skills.sh/schemas/skills.sh.schema.json");
    if (s.notGrouped !== undefined && !["top", "bottom"].includes(s.notGrouped)) bad("skills.sh.json", 'notGrouped must be "top" or "bottom"');
    if (!Array.isArray(s.groupings) || s.groupings.length < 1 || s.groupings.length > 50) bad("skills.sh.json", "groupings must hold 1 to 50 groups");
    for (const [i, g] of (s.groupings || []).entries()) {
      const at = `skills.sh.json groupings[${i}]`;
      onlyKeys(at, g, ["title", "description", "skills"]);
      if (typeof g.title !== "string" || g.title.length < 1 || g.title.length > 120) bad(at, "title must be 1 to 120 characters");
      if (g.description !== undefined && (typeof g.description !== "string" || g.description.length > 500)) bad(at, `description is ${g.description?.length} characters; the schema caps it at 500`);
      if (!Array.isArray(g.skills) || g.skills.length < 1 || g.skills.length > 500) bad(at, "skills must hold 1 to 500 names");
    }
    for (const p of s.paths || []) if (!/^\.\/[^\\]+$/.test(p)) bad("skills.sh.json", `paths entry ${p} must start with ./`);
    // The Brains group names every brain command, so the repo page tells Claude Code users what to type.
    const brains = (s.groupings || []).find((g) => (g.skills || []).some((n) => n.startsWith("khe-brain-")));
    const commands = names.filter((n) => n.startsWith("khe-brain-") && existsSync(join(SKILLS, n, "commands"))).flatMap((n) => readdirSync(join(SKILLS, n, "commands")).filter((f) => f.endsWith(".md")));
    for (const f of commands) if (brains && !brains.description?.includes(`/khe-brain:${f.replace(/\.md$/, "")}`)) bad("skills.sh.json", `the ${brains.title} group's description never names /khe-brain:${f.replace(/\.md$/, "")}`);
  }
}

// Agent Plugins 1.0.0 (https://agent-plugins.org/specification): plugin.json at the root, closed fields.
{
  const ap = existsSync(join(ROOT, "plugin.json")) ? json("plugin.json") : (bad("plugin.json", "missing; the Agent Plugins spec needs it at the root (node scripts/marketplace.mjs writes it)"), null);
  if (ap) {
    onlyKeys("plugin.json", ap, ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"]);
    if (ap.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") bad("plugin.json", "$schema must be https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
    if (typeof ap.name !== "string" || ap.name.length > 64 || !/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(ap.name)) bad("plugin.json", "name must be 1 to 64 lowercase letters, digits, hyphens and periods");
    if (ap.author) onlyKeys("plugin.json author", ap.author, ["name", "email", "url"]);
    for (const k of ["version", "description", "homepage", "repository", "license"]) if (ap[k] !== undefined && typeof ap[k] !== "string") bad("plugin.json", `${k} must be a string`);
    if (ap.keywords && !(Array.isArray(ap.keywords) && ap.keywords.every((k) => typeof k === "string"))) bad("plugin.json", "keywords must be strings");
    if (existsSync(join(ROOT, "mcp.json"))) bad("plugin.json", "mcp.json exists; give it the 1.0.0 mcp $schema and check it here");
  }
}

// Claude Code (code.claude.com/docs/en/plugins/marketplace-reference): what `claude plugin validate`
// checks, offline, plus the version rule it cannot see.
const market = existsSync(marketPath) ? json(".claude-plugin/marketplace.json") : null;
if (market) {
  if (!NAME.test(market.name || "")) bad("marketplace.json", "name must be lowercase letters, digits and single hyphens");
  if (!market.owner?.name) bad("marketplace.json", "owner.name is required");
  if (!market.description && !market.metadata?.description) bad("marketplace.json", "needs a description (metadata.description)");
  const seen = new Set();
  for (const p of market.plugins || []) {
    const at = `marketplace.json ${p.name}`;
    if (!NAME.test(p.name || "")) bad(at, "a plugin name is lowercase letters, digits and single hyphens");
    if (seen.has(p.name)) bad(at, "is listed twice"); seen.add(p.name);
    if (!p.description) bad(at, "no description");
    if (!p.author?.name) bad(at, "no author.name");
    if (!p.homepage) bad(at, "no homepage");
    if (typeof p.source === "string") {
      if (!/^\.\/?/.test(p.source) || p.source.includes("..")) bad(at, "a relative source starts with ./ and never contains ..");
      if (!p.version || !/^\d+\.\d+\.\d+$/.test(p.version)) bad(at, "a plugin served from this repo needs a semver version");
      for (const key of ["skills", "agents", "commands"]) for (const c of p[key] || []) {
        if (!c.startsWith("./") || c.includes("..")) bad(at, `${key} path ${c} must start with ./ and stay inside the repo`);
        else if (!existsSync(join(ROOT, p.source, c))) bad(at, `${key} path ${c} does not exist`);
      }
      // Every version must be explained to the people who update: a CHANGELOG line names it.
      if (p.version && !read(join(ROOT, "CHANGELOG.md")).split("\n").some((l) => l.includes(p.name) && l.includes(p.version))) bad("CHANGELOG.md", `no line names ${p.name} with its version ${p.version}`);
    } else if (!p.source?.source) bad(at, "source must be ./path or an object with a source type");
  }
}

// A served version that does not move is a plugin that never updates: Claude Code compares versions,
// and "already at the latest version" keeps the old copy. So when what a plugin serves changed since
// the base branch, its version must change too. Skipped (with a note) where the base is not fetched.
if (market) {
  const base = process.env.CHECK_BASE || "origin/main";
  const git = (...a) => spawnSync("git", a, { cwd: ROOT, encoding: "utf8" });
  const mb = git("merge-base", "HEAD", base);
  if (mb.status !== 0) console.log(`version check skipped: ${base} is not fetched`);
  else {
    const at = mb.stdout.trim();
    const old = git("show", `${at}:.claude-plugin/marketplace.json`);
    const before = old.status === 0 ? JSON.parse(old.stdout).plugins : [];
    for (const p of market.plugins.filter((p) => typeof p.source === "string")) {
      const prev = before.find((b) => b.name === p.name);
      if (!prev?.version) continue;
      // What it serves now and what it served at the base, so a deleted agent, skill or command counts;
      // for the brains, every brain folder on either side, since the commands read them.
      const served = (q) => [...(q.skills || []), ...(q.agents || []), ...(q.commands || [])].map((c) => join(q.source, c).replace(/\\/g, "/"));
      const paths = new Set([...served(p), ...served(prev)]);
      if (p.name === "khe-brain") {
        const thenBrains = git("ls-tree", "-d", "--name-only", at, "skills/").stdout.split("\n").filter((d) => d.startsWith("skills/khe-brain-"));
        for (const d of [...thenBrains, ...names.filter((n) => n.startsWith("khe-brain-")).map((n) => `skills/${n}`)]) paths.add(d);
      }
      // Committed and uncommitted edits, and new files not yet added, so a local run catches it too.
      const changed = [git("diff", "--name-only", at, "--", ...paths).stdout, git("ls-files", "--others", "--exclude-standard", "--", ...paths).stdout].join("\n").trim();
      if (changed && prev.version === p.version) bad("marketplace.json", `${p.name} serves changed files (${changed.split("\n").slice(0, 3).join(", ")}${changed.split("\n").length > 3 ? ", ..." : ""}) but is still ${p.version}: bump its version and say why in CHANGELOG.md (or delete the file, if it is an untracked scratch file)`);
    }
  }
}

// A brain's silent.md must not tell a reader a topic is not covered when a theme file holds a cited claim
// on it. silent-check.mjs runs khe-brain-gary's two comparisons (a watch word in a claim; a row's topic as a
// phrase in a claim) over every skills/khe-brain-*; the older brains' watch-word hits are listed there with a
// reason each, and a new brain has none. The part in meaning, not in words, is the reviewer's step in CONTRIBUTING.md.
for (const args of [["--self-test"], []]) {
  const r = spawnSync(process.execPath, [join(ROOT, "scripts", "silent-check.mjs"), ...args], { encoding: "utf8" });
  if (r.status !== 0) for (const l of (r.stderr + r.stdout).split(/\r?\n/).filter((l) => /silent\.md|silent-check|^FAIL/.test(l))) bad("silent lists", l);
}

// No model is hardcoded: agents inherit the session's model, and the policy picks a tier by the task.
// Scoped to config and policy; a launch film called "Claude Opus 4.6" in a reference is a film title.
{
  const files = [
    ...["agents", "orchestration"].flatMap((d) => (existsSync(join(ROOT, d)) ? walk(join(ROOT, d)) : [])),
    ...names.filter((n) => existsSync(join(SKILLS, n, "commands"))).flatMap((n) => walk(join(SKILLS, n, "commands"))),
    ...walk(join(SKILLS, "khe-auto")).filter((f) => f.endsWith(".md")),
    ...[".claude-plugin/marketplace.json", "plugin.json", "skills.sh.json", "README.md", "AGENTS.md", "CONTRIBUTING.md", "CHANGELOG.md"].map((f) => join(ROOT, f)),
  ].filter((f) => existsSync(f));
  for (const f of files) {
    const rel = f.slice(ROOT.length + 1).replace(/\\/g, "/");
    read(f).split("\n").forEach((line, i) => {
      const m = line.match(/\b(sonnet|opus|haiku|fable)\b/i);
      if (m) bad(`${rel}:${i + 1}`, `names the model "${m[0]}"; pick the tier by the task instead of hardcoding one`);
    });
    if (rel.startsWith("agents/")) {
      const model = read(f).match(/^---\n[\s\S]*?^model:\s*(.+)$[\s\S]*?\n---\n/m)?.[1]?.trim();
      if (model && model !== "inherit") bad(rel, `model is "${model}"; use model: inherit`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`${names.length} skills pass, ${linked.length} linked.`);

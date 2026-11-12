#!/usr/bin/env node
// Checks every skill in skills/ against the Agent Skills spec and this repo's own rules.
//   node scripts/check.mjs
// Exits 1 with one line per problem.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

// Linked skills: never prefixed khe-, each named by the router and linked from the README.
for (const n of linked) {
  if (n.startsWith("khe-")) bad(".gitmodules", `${n} is linked from another repo and must not use the khe- prefix`);
  if (!router.includes(`\`${n}\``)) bad("khe-auto", `the router never names ${n}`);
  if (!new RegExp(`\\[${n}\\]\\(https://github\\.com/`).test(readme)) bad("README.md", `${n} is not linked to its original`);
}

// The khe-brain plugin: one command per brain skill, each listed in the marketplace file and
// pointing at its skill's folder.
const marketPath = join(ROOT, ".claude-plugin", "marketplace.json");
if (!existsSync(marketPath)) bad(".claude-plugin", "no marketplace.json");
else {
  const plugin = JSON.parse(read(marketPath)).plugins.find((p) => p.name === "khe-brain");
  if (!plugin) bad("marketplace.json", "no khe-brain plugin");
  else {
    // A command is named for the person in full (commands/varun-mayya.md is /khe-brain:varun-mayya)
    // and names the one skill it reads, so the two are matched by that path, not by file name.
    const listed = plugin.commands || [];
    const brains = names.filter((n) => n.startsWith("khe-brain-"));
    const commandDir = join(ROOT, "commands");
    const files = existsSync(commandDir) ? readdirSync(commandDir).filter((f) => f.endsWith(".md")).sort() : [];
    const reads = new Map();
    for (const f of files) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(f)) bad(`commands/${f}`, "a command name is lowercase letters, digits and single hyphens");
      if (!listed.includes(`./commands/${f}`)) bad("marketplace.json", `./commands/${f} is not in the khe-brain plugin's commands`);
      const target = read(join(commandDir, f)).match(/\/skills\/(khe-brain-[a-z0-9-]+)\/SKILL\.md/)?.[1];
      if (!target) bad(`commands/${f}`, "does not point at a skills/khe-brain-*/SKILL.md");
      else if (!brains.includes(target)) bad(`commands/${f}`, `points at ${target}, which is not a skill here`);
      else if (reads.has(target)) bad(`commands/${f}`, `${target} already has commands/${reads.get(target)}`);
      else reads.set(target, f);
    }
    for (const n of brains) if (!reads.has(n)) bad("commands", `${n} has no command, so it is missing from /khe-brain:`);
    for (const c of listed) if (!files.includes(c.replace(/^\.\/commands\//, ""))) bad("marketplace.json", `${c} is listed and does not exist`);
    for (const s of plugin.skills || []) if (existsSync(join(ROOT, s, "SKILL.md")) || /^\.\/skills/.test(s)) bad("marketplace.json", `the khe-brain plugin must not list ${s} as a skill; each brain would show twice`);
  }
}

if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`${names.length} skills pass, ${linked.length} linked.`);

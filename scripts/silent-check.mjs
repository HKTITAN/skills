#!/usr/bin/env node
// A brain's references/silent.md says which topics the corpus does not cover, so a reply says "not in
// the corpus" instead of answering from nowhere. A row is wrong when a theme file already holds a cited
// claim on its topic: a reader is told "not covered" beside a line that covers it. This runs two of
// khe-brain-gary's comparisons over every skills/khe-brain-*:
//   word   a watch word of a silent row appears, as a whole phrase, in a cited claim
//   topic  a silent row's Topic cell, without its stop words, appears as a phrase in a cited claim
// It cannot see a row that denies a topic the theme files answer in other words; that is the writer's
// full reading and the reviewer's step, in CONTRIBUTING.md ("A skill from someone else's work").
//
//   node scripts/silent-check.mjs [--skills <dir>] [--list]   the check; --list prints every hit in allow format
//   node scripts/silent-check.mjs --self-test                  proves it on small brains built in a temp folder
//
// scripts/check.mjs runs both. The comparisons live in khe-brain-gary's gate and are imported, so there
// is one implementation.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { silentClashes, topicClashes } = await import(pathToFileURL(join(ROOT, "skills", "khe-brain-gary", "scripts", "brain-check.mjs")).href);

// Brains whose silent rows predate the word check. Their watch words flag a reply sentence, and their rows
// already name the passing mention they allow, so a word that also appears in a cited claim is mostly
// another sense of the word. Each hit below was read on 2026-11-21 and is not a position on the row's
// topic. An entry is "Topic | watch word". The list only shrinks: a new hit fails, and so does an entry
// that no longer hits (delete it). A brain not listed here has every hit fail, and so does every new brain.
const WORD_ALLOW = {
  "khe-brain-benji": {
    why: "the row says he lists cmdk as a tool he maintains and has no article on it; the claim is that same listing",
    hits: ["Command menus and cmdk | cmdk"],
  },
  "khe-brain-enrico": {
    why: "a glossary entry for a sitcom look and one for a simplified PRD, not video editing craft or the PM career",
    hits: ["Video editing craft, cameras and gear | colour grading", "Product management process and careers | PRD"],
  },
  "khe-brain-harshit": {
    why: "each word is used in another sense (managing agents, incorporation as paperwork, a gym vending machine, the carbon his old project reduced) and the Climate row names that project",
    hits: ["Hiring and managing a team | managing people", "Company law and tax | incorporation", "Fitness, diet and sleep | gym", "Climate and energy | carbon"],
  },
  "khe-brain-isb": {
    why: "every hit is in an ivi-* session note, which silent.md's last section says can speak on a topic the rule files are silent on; the rows are about the 457 rule files",
    hits: [
      "Which sentences came from an ISB classroom | in class",
      "Which sentences came from an ISB classroom | taught in",
      "Capital budgeting | net present value",
      "Dividends and buybacks | buyback",
      "Indian company, securities and startup law | Companies Act",
      "Founders and early company formation | equity split",
      "Planning tools the notes never name | design thinking",
      "Personal money and career decisions | mutual fund",
    ],
  },
  "khe-brain-varun": {
    why: "each word is used in another sense (a risk cliff, compliance as the opposite of motivation, SIP as house-price arithmetic, a camera as an analogy) and each row already names the passing mention it allows",
    hits: [
      "Employee stock plans | cliff",
      "Company law, tax and compliance | compliance",
      "Which stock, fund or coin to buy | SIP",
      "Programming languages, frameworks and system design | framework",
      "Video editing craft and software | transitions",
      "Camera, lighting and audio gear | camera",
      "Camera, lighting and audio gear | lens",
      "Search and email marketing | SEO",
      "Customer support and success | churn",
      "Entrance exams and choosing a college | CAT",
      "Entrance exams and choosing a college | which degree",
      "Treating depression or anxiety | treatment",
      "Climate and energy | carbon",
      "Patents, open source and licences | licence",
    ],
  },
  "khe-brain-yc": {
    why: "each hit is an aside or another sense (a pitch slide on mental health, a SOC 2 timing remark, a domain name for a silent launch) and the rows name the asides and the file that holds them",
    hits: [
      "Selling the company, mergers and going public | acquisition offer",
      "Rounds after Series A | Series B",
      "Layoffs and firing as a process | severance",
      "Founder health | burnout",
      "Founder health | mental health",
      "Crypto and web3 | crypto",
      "Privacy and security compliance | SOC 2",
      "Brand, naming and visual design | company name",
      "Brand, naming and visual design | logo",
      "Brand, naming and visual design | domain name",
      "Open source as a business | open source",
      "Competitors and moats as a method | moat",
      "Customer support and success | customer success",
    ],
  },
};

export const NOT_CORPUS = new Set(["sources.md", "verify.md", "review.md", "teaching.md", "gotchas.md", "pov.md", "silent.md"]);
const norm = (s) => s.replace(/^﻿/, "").replace(/\r\n?/g, "\n").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
const cells = (row) => row.split("|").slice(1, -1).map((c) => c.trim());

// The rows of the "Not covered" table (emil's is "Topics with nothing", and has no watch-word column), and
// every bulleted line with a link in the theme files: those are the cited claims.
export function readBrain(dir) {
  const refs = join(dir, "references");
  const text = existsSync(join(refs, "silent.md")) ? norm(readFileSync(join(refs, "silent.md"), "utf8")) : "";
  const hasWords = text.includes("\n## Not covered\n");
  const head = hasWords ? "\n## Not covered\n" : "\n## Topics with nothing\n";
  const at = text.indexOf(head);
  const rest = at < 0 ? "" : text.slice(at + head.length);
  const end = rest.indexOf("\n## ");
  const silent = [];
  for (const row of (end < 0 ? rest : rest.slice(0, end)).split("\n")) {
    if (!row.startsWith("|")) continue;
    const c = cells(row);
    if (c.length < 2 || /^-+$/.test(c[1].replace(/[\s:]/g, "")) || c[0] === "Topic") continue;
    silent.push({ topic: c[0], words: hasWords ? c[1].split(",").map((w) => w.trim()).filter(Boolean) : [] });
  }
  const claims = [];
  if (existsSync(refs)) {
    for (const f of readdirSync(refs).filter((f) => f.endsWith(".md") && !NOT_CORPUS.has(f)).sort()) {
      norm(readFileSync(join(refs, f), "utf8")).split("\n").forEach((l, i) => { if (/^- /.test(l) && /https?:\/\//.test(l)) claims.push([f, i + 1, l]); });
    }
  }
  return { silent, claims, found: at >= 0 };
}

// "Topic | word" for a word hit, from silentClashes' `"word" (Topic) is in a claim at file:line`.
const wordKey = (hit) => { const m = hit.match(/^"(.*)" \((.*)\) is in a claim at /); return `${m[2]} | ${m[1]}`; };

export function checkBrain(name, dir) {
  const { silent, claims, found } = readBrain(dir);
  const problems = [];
  if (!found || silent.length < 8) { problems.push(`skills/${name}/references/silent.md: no "Not covered" table with eight rows at least (found ${silent.length}), so no silent topic can be checked`); return { problems, notes: [], silent, claims, hits: [] }; }
  const allow = WORD_ALLOW[name];
  const allowed = new Set(allow ? allow.hits : []);
  const hits = silentClashes(silent, claims);
  const keys = hits.map(wordKey);
  const how = () => "narrow or delete the row to what no cited claim covers, and point it at the theme file in `references/` that holds the wider topic";
  hits.forEach((h, i) => { if (!allowed.has(keys[i])) problems.push(`skills/${name}/references/silent.md: ${h}; the row says the corpus does not cover a topic a theme file does: ${how()}`); });
  for (const a of allowed) if (!keys.includes(a)) problems.push(`scripts/silent-check.mjs: WORD_ALLOW["${name}"] lists "${a}", which no cited claim matches now; delete the entry`);
  for (const h of topicClashes(silent, claims)) problems.push(`skills/${name}/references/silent.md: ${h}; the row says the corpus does not cover a topic a theme file does: ${how()}`);
  return { problems, notes: allowed.size ? [`${name}: ${allowed.size} watch-word hits allowed (${allow.why})`] : [], silent, claims, hits: keys };
}

export function checkAll(skillsDir) {
  const brains = readdirSync(skillsDir).filter((d) => d.startsWith("khe-brain-") && existsSync(join(skillsDir, d, "references"))).sort();
  const out = { problems: [], notes: [], lines: [], hits: {} };
  for (const b of brains) {
    const r = checkBrain(b, join(skillsDir, b));
    out.problems.push(...r.problems);
    out.notes.push(...r.notes);
    out.hits[b] = r.hits;
    out.lines.push(`${b}: ${r.silent.length} silent rows, ${r.claims.length} cited claims, ${r.problems.length} problem(s)`);
  }
  return out;
}

function selfTest() {
  let failed = 0;
  const say = (ok, what) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) failed++; };
  const tmp = mkdtempSync(join(tmpdir(), "silent-check-"));
  const cite = "(Some Title, https://example.com/a)";
  const rows = (extra) => [["Climate and energy", "carbon tax, renewables"], ["Taxes", "tax planning"], ["Pricing models", "cost-plus"], ["A", "aa"], ["B", "bb"], ["C", "cc"], ["D", "dd"], ["E", "ee"], ...extra]
    .map(([t, w]) => `| ${t} | ${w} | None. |`).join("\n");
  const brain = (name, silentRows, claim, head = "## Not covered") => {
    const d = join(tmp, name, "references");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "silent.md"), `# Silent\n\n${head}\n\n| Topic | Words | Why |\n|---|---|---|\n${silentRows}\n\n## Thin\n`);
    writeFileSync(join(d, "theme.md"), `# Theme\n\n- ${claim} ${cite}.\n- He said it (Taxes Explained, https://example.com/b).\n`);
    writeFileSync(join(d, "sources.md"), `- ${claim} ${cite}.\n`);
  };
  try {
    brain("khe-brain-clean", rows([]), "In 2020 he said nothing about the listed topics at all");
    brain("khe-brain-word", rows([]), "In 2021 he said a cost-plus price is a trap");
    brain("khe-brain-topic", rows([]), "In 2022 he ranked taxes below sleep");
    brain("khe-brain-plain", "| Interface sound | Nothing | `khe-sound` |\n| A | a | x |\n| B | b | x |\n| C | c | x |\n| D | d | x |\n| E | e | x |\n| F | f | x |\n| G | g | x |", "In 2023 he praised interface sound design", "## Topics with nothing");
    const r = checkAll(tmp);
    const by = (n) => checkBrain(n, join(tmp, n)).problems;
    say(by("khe-brain-clean").length === 0, "a brain whose theme files hold none of its silent topics passes");
    say(by("khe-brain-word").length === 1 && /cost-plus/.test(by("khe-brain-word")[0]) && /narrow or delete the row/.test(by("khe-brain-word")[0]), "a watch word in a cited claim fails, and the error says to narrow the row and point at the theme file");
    say(by("khe-brain-topic").length === 1 && /"Taxes" is in a claim at theme\.md:3/.test(by("khe-brain-topic")[0]), "a row's topic as a phrase in a cited claim fails, and a topic only a cited title holds does not");
    say(by("khe-brain-plain").length === 1 && /"Interface sound"/.test(by("khe-brain-plain")[0]), "a table without a watch-word column (topic only) is read, and its topic is checked");
    say(r.problems.length === 3, `checkAll reads every khe-brain-* folder and gathers the three faults (${r.problems.length})`);
    brain("khe-brain-short", "| A | a | x |", "In 2024 he said nothing");
    say(/eight rows at least/.test(checkBrain("khe-brain-short", join(tmp, "khe-brain-short")).problems[0] || ""), "a brain with fewer than eight silent rows fails, so an unreadable table cannot pass");
  } finally { rmSync(tmp, { recursive: true, force: true }); }
  console.log(failed ? `\nself-test failed: ${failed}` : "\nself-test passed");
  return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const skills = args.includes("--skills") ? resolve(args[args.indexOf("--skills") + 1]) : join(ROOT, "skills");
  const r = checkAll(skills);
  if (args.includes("--list")) {
    for (const [b, h] of Object.entries(r.hits)) for (const k of h) console.log(`${b}: ${k}`);
  } else {
    for (const l of r.lines) console.log(l);
    for (const n of r.notes) console.log(`allowed: ${n}`);
    for (const p of r.problems) console.error(p);
    if (r.problems.length) { console.error(`\n${r.problems.length} silent-list problem(s).`); process.exit(1); }
    console.log(`silent lists pass: ${r.lines.length} brains, no row denies a topic a cited claim holds.`);
  }
}

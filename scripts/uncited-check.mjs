#!/usr/bin/env node
// In a brain's reference files only a cited line may say what its person said or did. A paragraph, a
// numbered idea, an intro under the title or a stray sentence that speaks for him (he, his, him, his name)
// and cites nothing is a claim nobody audited: the per-bullet audit reads cited lines, and the brain gate's
// self-test reads bullets. khe-brain-gary had 15 such lines in disagreements.md and core.md and the intro
// of 17 of its 20 reference files, each found by a late sweep. This check reads every block of every theme
// file, core.md, disagreements.md and glossary.md (not sources, silent, gotchas, pov, review, verify or
// teaching) and fails a block that has no link and a clause that speaks for him (he, his, him, himself or
// the name) and is none of the allowed forms: an instruction, the sentence "He does not say he changed; the
// dates show it.", a "More in references/..." pointer, a caution that lines carry their year, or the file's
// own description ("This file collects what he said about ...", "his talks", "figures about his companies
// are his own"). The forms and the phrases are in the rules block below, each with the reason it is allowed.
// A block is a bullet or numbered item with its indented lines, or a paragraph; it is cited when any of its
// lines holds a link, which is how core.md cites a whole idea once at its end. A "How to report it:" line,
// or any block with the dates sentence, may hold instructions and nothing else about him.
// Headings and frontmatter are not read, and the frontmatter `summary:` is not enforced: the two summaries
// the sweeps changed in khe-brain-gary (core, glossary) are the only past cases, and a rule that flags them
// flags every other summary, which are lists of the file's topics ("Why he ranks brand above sales").
//
// What it cannot see, and the writer and the reviewer still read:
//   - a fact slipped into an instruction ("Give his named regret ...": the regret may not be in the entry's
//     cited bullets), because an instruction is the form a reporting line takes
//   - a claim about the person that never says he, his or the name ("Everything below is that sentence
//     applied to ...", "the idea of attention")
//   - a nominal claim inside the file's topic list ("his change of mind about candor")
//   - an uncited sentence about a speaker who is not the person (a YC partner, a host)
// About one hit in seven in the older brains is a description of the file the rule does not know (a topic
// list with a relative clause: "what he builds"); the error names the fixed opener that passes.
//
//   node scripts/uncited-check.mjs [--skills <dir>] [--list]    the check; --list prints every hit in allow format
//   node scripts/uncited-check.mjs --dir <references> --brain khe-brain-gary [--intros] [--summaries]
//                                                               one folder (an old copy); --intros reads only
//                                                               the text above the first ## heading; --summaries
//                                                               adds the frontmatter summary, observe only
//   node scripts/uncited-check.mjs --self-test                  proves it on small brains built in a temp folder
//
// scripts/check.mjs runs both the self-test and the check.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { NOT_CORPUS } = await import(pathToFileURL(join(ROOT, "scripts", "silent-check.mjs")).href);

// Brains whose reference files predate this check, read on 2026-11-21. A brain in neither list has every hit
// fail, and so does every new brain.
//   ALLOW    one entry per hit, "file | the first 70 characters of the clause": a new hit fails, and so does an
//            entry that no longer hits (delete it), the same ratchet as silent-check.mjs
//   CEILING  a count, for a brain with too many hits to list one by one: more hits than the ceiling fail, and
//            so does fewer (lower the number), so the count only goes down. A swap of one hit for another is
//            not seen; list the hits with --dir and fix them at the source.
const ALLOW = {
  "khe-brain-gary": {
    why: "to fix at source: each is a sentence in a generated reference file that states something he said or did and cites nothing (the intros of eight files, and one reporting line that restates a cited bullet). The reference files are generated from a folder outside this repo, so they are listed here and fixed there",
    hits: [
      "ai-and-new-technology.md | This file collects what he said about voice, wearables, VR, NFTs and A",
      "attention-and-media-shifts.md | it covers Snapchat and Instagram in 2015 and 2016, audio in 2017, TikT",
      "content-and-documenting.md | his advice on quantity changed in 2024",
      "disagreements.md | The 2013 Stories verdict is one he called 100% wrong in 2014, so never",
      "happiness-judgment-and-accountability.md | Figures about money and happiness are his own observations from people",
      "his-story-and-businesses.md | He retells some of the same events in more than one talk",
      "patience-hustle-and-work.md | the file has a section on how his message on hustle changed and what h",
      "self-awareness.md | In 2017 and 2019 he said his advice is one person's point of view",
    ],
  },
};
const CEILING = {
  "khe-brain-benji": { max: 14, why: "intro and reporting-line sentences in the older brains' format; about one in seven is a description of the file the rule does not know, the rest state what he built, wrote or has not written" },
  "khe-brain-emil": { max: 17, why: "the same: reporting lines such as \"He has not written a line that reconciles them\" and one-line scope statements" },
  "khe-brain-enrico": { max: 27, why: "the same: intros that characterise him (\"his view moved a lot\"), reporting lines in the declarative form, and topic-list descriptions with a relative clause (\"what he builds\")" },
  "khe-brain-harshit": { max: 35, why: "the same: most intros state his settled view since mid-2025; his-story.md:65 is an uncited paragraph about his role" },
  "khe-brain-varun": { max: 41, why: "the same: intros that state what he treats, argues and says he changed, and declarative reporting lines" },
};

// Who the markers name. Every brain's folder name after khe-brain- is a marker; these add the surname or the
// alias. A brain of an institution has no pronoun marker: its sentences say YC or ISB, never he.
const EXTRA_NAMES = { gary: ["Vaynerchuk", "GaryVee"], varun: ["Mayya"], enrico: ["Tartarotti"], emil: ["Kowalski"], benji: ["Taylor"], harshit: ["Khemani"] };
const INSTITUTIONS = new Set(["yc", "isb"]);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const norm = (s) => s.replace(/^﻿/, "").replace(/\r\n?/g, "\n").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

export function markers(slug) {
  const names = [slug, ...(EXTRA_NAMES[slug] || [])].map(esc);
  const pron = INSTITUTIONS.has(slug) ? "" : "|he|his|him|himself";
  return { name: new RegExp(`\\b(?:${names.join("|")}${pron})\\b`, "i"), nameWord: `(?:he|${names.join("|")})`, names: `(?:${names.join("|")})` };
}

// A sentence of an uncited block is judged clause by clause, a clause being cut at a colon and at ", and", ", so", ", since",
// ", but", ", because", ", while" and ", though", so a claim after a comma stands alone. A clause passes when it
// is one of these forms:
//   instruction   opens with Give, Report, Never, Do not, Read, ... (also after "When he X," or "On X,")
//   dating        says the lines carry their year ("carry their year", "belong to the year", "dated by")
//   format        "Where he X, the bullet says so": how the file treats a case
//   fixed         "He does not say he changed; the dates show it." and a "More in references/..." pointer
//   description   "This file collects what he said about ...", "This is the biography as he tells it": the
//                 file's own description may say he as a reporting subject (said, says, tells, names, calls)
//                 and his as a possessive in the list of topics, and nothing else about him
// and otherwise when no he, his, him or name is left once the phrases below are removed. They are the file
// description as it is written: what the file collects, where its lines come from, whose numbers they are.
const SOURCE = "(?:lists?|articles?|site|byline|keynotes?|talks?|videos?|interviews?|channel|podcasts?|posts?|library|writing|books?|essays?|skills?|pieces|series|repos?|partners?|files?)";
const phrases = (nameWord, names) => [
  new RegExp(`\\bwhat ${nameWord} (?:said|says|wrote|writes|published|states|argues|tells (?:people|founders|marketers|you)(?: to)?)\\b`, "gi"),
  /\b(?:to|from|with|by|for|of) his (?:own )?(?:[A-Za-z-]+ ){0,2}(?:employees|team|staff|audience|followers|students|viewers|readers|guests?|hosts?)\b/gi,
  new RegExp(`\\bthe year ${nameWord} (?:said|made|gave|wrote|named|put|called)\\b`, "gi"),
  // where the lines come from: "his 2021 to 2023 startup videos", "the YC library"; up to five words
  // between, none of them he, his, him or a name, so a claim cannot hide inside the phrase
  new RegExp(`\\b(?:his|${names}) (?:own )?(?:\\d{4} )?(?:to \\d{4} )?(?:(?!(?:he|his|him|${names})\\b)[A-Za-z0-9&-]+,? ){0,5}${SOURCE}\\b`, "gi"),
  new RegExp(`\\bthe (?:\\d{4} )?(?:(?!(?:he|his|him|${names})\\b)[A-Za-z0-9&-]+ )?${SOURCE}\\b`, "gi"),
  /\bhis [^.;,]{1,60}? (?:are|is) his (?:own|claims?|pitch(?:es)?|numbers?)\b(?: for his own \w+)?/gi,
  /\b(?:are|is|were|was) his (?:own|claims?|pitch(?:es)?|numbers?|calls?|reading|views?|research|account|findings|words)\b(?: from those years| then| that year)?/gi,
  /\b(?:are|is|was|were) (?:not )?his(?=[.,;:]|$| copied)/gi,
  /\bhis (?:own )?(?:companies|company|funds?|deals|operation|businesses|business|products?|holdings|family store|numbers|figures|claims|pitch(?:es)?|account|projects|events|stake)\b/gi,
];
const INSTR = "(?:Give|Report|Name|Keep|Do not|Don't|Never|Always|Say|Compare|Treat|Pair|Offer|Open|Quote|Cite|State|Lead|Use|Read|Put|Add|Present|Start|Mention|Note|Label|Show|Check|Ask|Separate|Attribute|Tie|Mark|Answer|Prefer|Take|Write|Look|Return|Send|Run|Install|Follow|Defer|Pass|Date|List|Point|Carry|Credit|Describe|Explain)";
const INSTRUCTION = new RegExp(`^${INSTR}\\b`, "i");
const CONDITIONAL = new RegExp(`^(?:To|When|If|Where|Whenever|Once|On|For|In|With|Without|After|Before|Until)\\b[^,;]{0,100}, ${INSTR}\\b`, "i");
const FORMAT = /^(?:Where|When|If)\b[^,;]{0,100}, the (?:bullet|entry|line|file|section|row)s? [a-z]+/;
const DATING = /\b(?:carr(?:y|ies) (?:their|its|the|each|his|a) (?:own )?(?:year|date)|belongs? to the year|dated by|is dated|with (?:its|their|each|the) year)\b/i;
const DATES = /He does not say he changed; the dates show it\.?/;
const FIXED = [/^More in references\/[a-z0-9-]+\.md\b/];
const DESCRIBES = /^(?:This|These) (?:file|theme|section|list|glossary|is|are)\b/;
const REPORTING = "(?:said|says|tells|told|names|calls|uses|describes|wrote|means|admits|puts)";
const CLAUSE = /,\s+(?=(?:and|so|since|but|because|while|though)\s)|:\s+/;

const BLOCK_START = /^(?:[-*] |\d+\. )/;
// The blocks of a file: [first line number, the block's lines joined with a space]. Frontmatter and headings
// are skipped; `intros` keeps only what sits above the first ## heading.
export function blocks(text, { intros = false } = {}) {
  const lines = norm(text).split("\n");
  let i = 0;
  let summary = null;
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    const s = lines.slice(1, end).findIndex((l) => /^summary:/.test(l));
    if (s >= 0) summary = [s + 2, lines[s + 1].replace(/^summary:\s*/, "")];
    i = end + 1;
  }
  const out = [];
  let cur = null;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (intros && /^## /.test(l)) break;
    if (!l.trim() || /^#{1,6} /.test(l)) { cur = null; continue; }
    if (BLOCK_START.test(l) || !cur) { cur = { line: i + 1, text: l }; out.push(cur); } else cur.text += " " + l.trim();
  }
  return { blocks: out, summary };
}

// A sentence ends at . ! or ? before a capital, a quote, a backtick or a bracket, and a semicolon ends one too.
const sentencesOf = (s) => s.trim().split(/(?<=[.!?])\s+(?=[A-Z"`(*])|;\s+/).map((x) => x.trim()).filter(Boolean);

// The clauses of one uncited block that speak for the person without a form that allows them.
export function faults(block, m) {
  const out = [];
  const ph = phrases(m.nameWord, m.names);
  const subject = new RegExp(`\\b${m.nameWord}\\b(?! ${REPORTING}\\b)`, "i");
  const reporting = /^(?:[-*] )?How to report it:/.test(block) || DATES.test(block);
  const body = block.replace(/^(?:[-*] |\d+\. )/, "").replace(/^(?:How to report it|Alternates considered):\s*/, "").replace(DATES, " ");
  for (const s of sentencesOf(body)) {
    if (FIXED.some((re) => re.test(s))) continue;
    // A reporting line is instructions, and an instruction names what to report, so a whole sentence that
    // opens with one passes; anywhere else the clauses after the first comma are judged alone.
    // After the fixed dates sentence nothing but an instruction may follow, he or not; elsewhere in a
    // reporting line a sentence that is no instruction fails when it speaks for him.
    if (reporting) {
      if (INSTRUCTION.test(s) || CONDITIONAL.test(s)) continue;
      if (DATES.test(block) || m.name.test(s)) out.push(s);
      continue;
    }
    const plain = s.replace(/`[^`\n]*`/g, " ").replace(/\s+/g, " ");
    if (DESCRIBES.test(plain)) {
      if (subject.test(plain)) out.push(s);
      continue;
    }
    for (const c0 of plain.split(CLAUSE)) {
      const c = c0.replace(/^(?:and|so|since|but|because|while|though)\s+/, "").trim();
      if (!c || INSTRUCTION.test(c) || CONDITIONAL.test(c) || FORMAT.test(c) || DATING.test(c)) continue;
      let rest = c;
      for (const re of ph) rest = rest.replace(re, " ");
      if (m.name.test(rest)) { out.push(c); break; }
    }
  }
  return out;
}

const hasLink = (t) => /https?:\/\//.test(t);

// Every hit in one references folder as { file, line, sentence }.
export function checkFolder(refs, slug, { intros = false, summaries = false } = {}) {
  const m = markers(slug);
  const hits = [];
  for (const f of readdirSync(refs).filter((f) => f.endsWith(".md") && !NOT_CORPUS.has(f)).sort()) {
    const { blocks: bs, summary } = blocks(readFileSync(join(refs, f), "utf8"), { intros });
    if (summaries && summary) for (const s of faults(summary[1], m)) hits.push({ file: f, line: summary[0], sentence: s, summary: true });
    for (const b of bs) {
      if (hasLink(b.text)) continue;
      for (const s of faults(b.text, m)) hits.push({ file: f, line: b.line, sentence: s });
    }
  }
  return hits;
}

const key = (h) => `${h.file} | ${h.sentence.slice(0, 70)}`;

export function checkBrain(name, dir) {
  const refs = join(dir, "references");
  if (!existsSync(refs)) return { problems: [], hits: [], keys: [] };
  const hits = checkFolder(refs, name.replace(/^khe-brain-/, ""));
  const keys = hits.map(key);
  const allow = ALLOW[name];
  const allowed = new Set(allow ? allow.hits : []);
  const problems = [];
  const ceiling = CEILING[name];
  if (ceiling) {
    if (hits.length > ceiling.max) problems.push(`skills/${name}/references: ${hits.length} sentences speak for him and cite nothing, and the ceiling in scripts/uncited-check.mjs is ${ceiling.max}: a new one was added; list them with node scripts/uncited-check.mjs --dir skills/${name}/references --brain ${name} and cite it, cut it, or reword it as an instruction or a description of the file`);
    if (hits.length < ceiling.max) problems.push(`scripts/uncited-check.mjs: CEILING["${name}"] is ${ceiling.max} and ${hits.length} sentences hit now; lower it to ${hits.length}`);
    return { problems, hits, keys };
  }
  hits.forEach((h, i) => {
    if (!allowed.has(keys[i])) problems.push(`skills/${name}/references/${h.file}:${h.line}: "${h.sentence.slice(0, 90)}${h.sentence.length > 90 ? " ..." : ""}" speaks for him and cites nothing; cite it (Title, URL) from a piece, or cut it, or reword it as an instruction (\`Give ...\`, \`Never ...\`) or as a description of the file (\`This file collects what he said about ...\`)`);
  });
  for (const a of allowed) if (!keys.includes(a)) problems.push(`scripts/uncited-check.mjs: ALLOW["${name}"] lists "${a}", which no uncited sentence matches now; delete the entry`);
  return { problems, hits, keys };
}

export function checkAll(skillsDir) {
  const brains = readdirSync(skillsDir).filter((d) => d.startsWith("khe-brain-") && existsSync(join(skillsDir, d, "references"))).sort();
  const out = { problems: [], lines: [], notes: [], keys: {} };
  for (const b of brains) {
    const r = checkBrain(b, join(skillsDir, b));
    out.problems.push(...r.problems);
    out.keys[b] = r.keys;
    out.lines.push(`${b}: ${r.hits.length} uncited sentence(s) that speak for him, ${r.problems.length} problem(s)`);
    if (ALLOW[b]) out.notes.push(`${b}: ${ALLOW[b].hits.length} allowed (${ALLOW[b].why})`);
    if (CEILING[b]) out.notes.push(`${b}: ceiling ${CEILING[b].max} (${CEILING[b].why})`);
  }
  return out;
}

function selfTest() {
  let failed = 0;
  const say = (ok, what) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) failed++; };
  const tmp = mkdtempSync(join(tmpdir(), "uncited-check-"));
  const cite = "(Some Title, https://example.com/a)";
  const brain = (name, files) => {
    const d = join(tmp, name, "references");
    mkdirSync(d, { recursive: true });
    for (const [f, text] of Object.entries(files)) writeFileSync(join(d, f), text);
    return checkBrain(name, join(tmp, name));
  };
  const theme = (intro, body = `- In 2020 he said a thing. ${cite}\n`) => ({ "theme.md": `---\ntitle: t\nsummary: What he said about a thing.\n---\n\n# Theme\n\n${intro}\n\n## One\n\n${body}` });
  try {
    say(brain("khe-brain-ok", theme("This file collects what he said about voice, wearables and AI. Most of it comes from his keynotes and his articles. Figures about his companies are his own. Read each bullet with its year.")).problems.length === 0, "an intro that describes the file, names its sources and warns the reader passes");
    const bad1 = brain("khe-brain-intro1", theme("Attention is the idea his whole marketing view hangs on: he follows where eyes and ears are.")).problems;
    say(bad1.length === 1 && /theme\.md:8/.test(bad1[0]) && /speaks for him and cites nothing/.test(bad1[0]), "an intro that characterises him (the idea his whole view hangs on) fails, and the error names the line and the three ways out");
    say(brain("khe-brain-intro2", theme("This file collects what he said about voice and AI, and the early internet is the comparison he makes for both.")).problems.length === 1, "a file-description opener does not carry a second claim after the comma");
    say(brain("khe-brain-intro3", theme("The internet of 1995 is the case he returns to in nearly every keynote.")).problems.length === 1, "a frequency claim about him (returns to, nearly every) fails");
    say(brain("khe-brain-intro4", theme("Open this file before an answer where two of his years differ. Never give a line without its year.")).problems.length === 0, "instructions pass, so a caution to the reader may say his");
    const fixed = "- How to report it: He does not say he changed; the dates show it. Give both years.";
    say(brain("khe-brain-fixed", theme("This file collects what he said about a thing.", `- In 2020 he said a thing. ${cite}\n${fixed}\n`)).problems.length === 0, "the fixed sentence about dates passes beside an instruction");
    const tail = "- How to report it: He does not say he changed; the dates show it. In 2026 he points to his earlier calls as proof he was right.";
    const t = brain("khe-brain-tail", theme("This file collects what he said about a thing.", `- In 2020 he said a thing. ${cite}\n${tail}\n`)).problems;
    say(t.length === 1 && /points to his earlier calls/.test(t[0]), "commentary appended to the fixed sentence fails");
    say(brain("khe-brain-bare", theme("This file collects what he said about a thing.", `- In 2020 he said a thing.\n- In 2021 he said another thing. ${cite}\n`)).problems.length === 1, "an uncited bullet fails, as the gate's own self-test already finds it");
    say(brain("khe-brain-para", theme("This file collects what he said about a thing.", `In 2022 he said the same thing again.\n\n- In 2020 he said a thing. ${cite}\n`)).problems.length === 1, "the same claim as a paragraph fails, which the bullet check alone would pass");
    const idea = `1. **Attention is the asset.**\n   In 2015 he said every person has one job.\n   He calls this the attention graph.\n   More in references/attention.md ${cite}\n\n`;
    say(brain("khe-brain-idea", theme("This file collects what he said about a thing.", `${idea}- In 2020 he said a thing. ${cite}\n`)).problems.length === 0, "a numbered idea whose last line carries the link is one cited block");
    say(brain("khe-brain-name", theme("Vera is the most patient person in marketing.")).problems.length === 0 && brain("khe-brain-vera", theme("Vera is the most patient person in marketing.")).problems.length === 1, "a brain's own folder name is a marker (khe-brain-vera), and another brain's name is not");
    say(brain("khe-brain-yc", theme("He is a partner. YC returns to the idea in every batch.")).problems.length === 1 && brain("khe-brain-isb", theme("He says it. This file collects the notes.")).problems.length === 0, "an institution's brain reads YC or ISB, never he");
    say(brain("khe-brain-sum", { "theme.md": `---\ntitle: t\nsummary: The one sentence he would sign.\n---\n\n# Theme\n\n- In 2020 he said a thing. ${cite}\n` }).problems.length === 0 && checkFolder(join(tmp, "khe-brain-sum", "references"), "sum", { summaries: true }).length === 1, "a summary is read only under --summaries");
    writeFileSync(join(tmp, "khe-brain-sum", "references", "sources.md"), "In 2020 he said an uncited thing.\n");
    say(brain("khe-brain-sum", { "theme.md": theme("This file collects what he said about a thing.")["theme.md"] }).problems.length === 0, "sources.md, silent.md and the other non-corpus files are not read");
    const old = brain("khe-brain-old", theme("Attention is the idea he returns to. He is the best.", ""));
    ALLOW["khe-brain-old"] = { why: "test", hits: old.keys.slice(0, 1) };
    say(checkBrain("khe-brain-old", join(tmp, "khe-brain-old")).problems.length === 1, "a ratcheted hit passes and a new one fails");
    ALLOW["khe-brain-old"].hits.push("theme.md | gone");
    say(checkBrain("khe-brain-old", join(tmp, "khe-brain-old")).problems.some((p) => /delete the entry/.test(p)), "an allow entry that no longer hits fails until it is deleted");
    delete ALLOW["khe-brain-old"];
    const ceil = (max) => { CEILING["khe-brain-old"] = { max, why: "test" }; return checkBrain("khe-brain-old", join(tmp, "khe-brain-old")).problems; };
    say(ceil(2).length === 0 && ceil(1).some((p) => /ceiling in scripts\/uncited-check\.mjs is 1/.test(p)) && ceil(3).some((p) => /lower it to 2/.test(p)), "a ceiling passes at the count, fails above it and fails below it until it is lowered");
    delete CEILING["khe-brain-old"];
  } finally { rmSync(tmp, { recursive: true, force: true }); }
  console.log(failed ? `\nself-test failed: ${failed}` : "\nself-test passed");
  return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
  if (args.includes("--self-test")) process.exit(selfTest());
  if (arg("--dir")) {
    const hits = checkFolder(resolve(arg("--dir")), (arg("--brain") || "khe-brain-x").replace(/^khe-brain-/, ""), { intros: args.includes("--intros"), summaries: args.includes("--summaries") });
    for (const h of hits) console.log(`${h.file}:${h.line}${h.summary ? " (summary)" : ""}: ${h.sentence.slice(0, 140)}`);
    console.log(`${hits.length} uncited sentence(s) that speak for him in ${arg("--dir")}`);
    process.exit(hits.length ? 1 : 0);
  }
  const skills = arg("--skills") ? resolve(arg("--skills")) : join(ROOT, "skills");
  const r = checkAll(skills);
  if (args.includes("--list")) {
    for (const [b, ks] of Object.entries(r.keys)) for (const k of ks) console.log(`${b}: ${k}`);
  } else {
    for (const l of r.lines) console.log(l);
    for (const n of r.notes) console.log(`allowed: ${n}`);
    for (const p of r.problems) console.error(p);
    if (r.problems.length) { console.error(`\n${r.problems.length} uncited-claim problem(s).`); process.exit(1); }
    console.log(`uncited claims pass: ${r.lines.length} brains, no reference file speaks for him in a line that cites nothing.`);
  }
}

#!/usr/bin/env node
// pr-check.mjs: checks that a pull request body fills the template's sections.
//
//   PR_BODY="<body>" node scripts/pr-check.mjs
//   node scripts/pr-check.mjs --file <path> [--self-test] [--help]
//
// The required sections are the `##` headings of .github/PULL_REQUEST_TEMPLATE.md, minus Checklist,
// so the template and this check cannot drift. HTML comments are stripped first. A section counts as
// filled when it keeps one line of real content; a template bullet that still ends in ":" does not.
// Prints one line per fault (`missing: ## Checks`, `empty: ## Not verified`), then `passed` or `failed`.
// Exit codes: 0 passed, 1 failed, 2 inconclusive (no body to read). No dependencies; Node 20+.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(ROOT, ".github", "PULL_REQUEST_TEMPLATE.md");
const SKIPPED = "checklist";

const HELP = `pr-check.mjs: checks that a pull request body fills the template's sections.

  PR_BODY="<body>" node scripts/pr-check.mjs
  node scripts/pr-check.mjs --file <path>
  node scripts/pr-check.mjs --self-test

  --file <path>   read the body from a file instead of the PR_BODY environment variable
  --self-test     prove the check on inline fixtures and the untouched template
  --help          this text

Exit codes: 0 passed, 1 failed, 2 inconclusive (no body given).`;

const clean = (text) => text.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");

// The sections a body must fill: the template's `##` headings, minus the checklist.
const requiredSections = () => [...clean(readFileSync(TEMPLATE, "utf8")).matchAll(/^## (.+?)\s*$/gm)]
  .map((m) => m[1])
  .filter((h) => h.toLowerCase() !== SKIPPED);

// A line is content unless it is blank, a bare bullet marker, or a template bullet left at "label:".
const isContent = (line) => {
  const t = line.trim();
  if (!t) return false;
  const bullet = t.match(/^(?:[-*+]|\d+[.)])(?:\s+\[[ xX]\])?(?:\s+(.*))?$/);
  if (bullet) {
    const rest = (bullet[1] || "").trim();
    return rest !== "" && !rest.endsWith(":");
  }
  return true;
};

// Returns one fault line per missing or empty section.
export function checkBody(body, sections = requiredSections()) {
  const found = new Map();
  let current = null;
  for (const line of clean(body).split("\n")) {
    const h = line.match(/^## (.+?)\s*$/);
    if (h) {
      current = h[1].toLowerCase();
      if (!found.has(current)) found.set(current, []);
    } else if (current) found.get(current).push(line);
  }
  const faults = [];
  for (const name of sections) {
    const lines = found.get(name.toLowerCase());
    if (!lines) faults.push(`missing: ## ${name}`);
    else if (!lines.some(isContent)) faults.push(`empty: ## ${name}`);
  }
  return faults;
}

function selfTest() {
  const sections = requiredSections();
  let pass = 0;
  let fail = 0;
  const assert = (ok, what) => {
    if (ok) pass++;
    else { fail++; console.log(`assertion failed: ${what}`); }
  };
  const filled = [
    "## Why here", "", "The fix lives in the gate, row 3 of the table. Closes #12.", "",
    "## What changed", "", "- scripts/x.mjs: one rule", "",
    "## Checks", "", "- `node scripts/check.mjs`: check passed", "- Review verdict, and the commit it named:", "",
    "## Not verified", "", "Nothing.", "",
    "## Checklist", "", "- [ ] One job in this PR", "",
  ].join("\n");

  assert(sections.join("|") === "Why here|What changed|Checks|Not verified", "the template names the four sections");
  assert(checkBody(filled, sections).length === 0, "a filled body passes");
  assert(checkBody(filled.replace(/\n/g, "\r\n"), sections).length === 0, "a filled body with CRLF line ends passes");
  assert(checkBody(filled.replace(/## What changed[\s\S]*?(?=## Checks)/, ""), sections).join() === "missing: ## What changed", "a body missing one section raises that missing line");
  assert(checkBody("", sections).length === 4, "an empty body misses all four");
  assert(checkBody(filled.replace("Nothing.", "<!-- nothing yet -->"), sections).join() === "empty: ## Not verified", "a section holding only a comment is empty");
  assert(checkBody(filled.replace("- `node scripts/check.mjs`: check passed\n", ""), sections).join() === "empty: ## Checks", "Checks with only an unfilled bullet is empty");
  assert(checkBody(filled.replace("- [ ] One job in this PR", ""), sections).length === 0, "the Checklist is not checked");

  if (existsSync(TEMPLATE)) {
    const faults = checkBody(readFileSync(TEMPLATE, "utf8"), sections);
    for (const s of sections) assert(faults.includes(`empty: ## ${s}`), `the untouched template is empty at ## ${s}`);
    assert(faults.length === sections.length, "the untouched template raises nothing but those empty lines");
  } else assert(false, "the template exists");

  console.log(fail ? `self-test failed: ${fail} of ${pass + fail} assertions` : `self-test passed: ${pass} assertions`);
  return fail ? 1 : 0;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) { console.log(HELP); return 0; }
  if (argv.includes("--self-test")) return selfTest();

  let body;
  const i = argv.indexOf("--file");
  if (i !== -1) {
    const file = argv[i + 1];
    if (!file || !existsSync(file)) { console.log(`inconclusive: no PR body given (cannot read ${file ?? "--file without a path"})`); return 2; }
    body = readFileSync(file, "utf8");
  } else if (process.env.PR_BODY !== undefined) body = process.env.PR_BODY;
  else { console.log("inconclusive: no PR body given"); return 2; }

  if (!existsSync(TEMPLATE)) { console.log("inconclusive: .github/PULL_REQUEST_TEMPLATE.md not found"); return 2; }
  const faults = checkBody(body);
  for (const f of faults) console.log(f);
  console.log(faults.length ? "failed" : "passed");
  return faults.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());

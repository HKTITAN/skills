#!/usr/bin/env node
// Builds the plugins in .claude-plugin/marketplace.json that serve other people's skills, from the
// README's "From others" links (one source of truth: the link that names a skill's SKILL.md is the
// path the plugin serves). Each plugin points at its author's own repo; nothing is copied here.
//
//   node scripts/marketplace.mjs          rewrite the linked plugins in place
//   node scripts/marketplace.mjs --check  exit 1 if the file is out of date
//
// pstack is the exception: it is a Cursor plugin, so its entry serves the Claude Code build Cursor
// generates at harness/pstack/claude-code, whole, with its agents and adapter.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MP = join(ROOT, '.claude-plugin', 'marketplace.json')
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8')

// Who each repo belongs to, and what its plugin is called here.
const REPOS = {
  'emilkowalski/skills': { name: 'emil-kowalski', author: 'Emil Kowalski', about: "Emil Kowalski's skills: UI craft, motion, gestures, mobile feel, taste" },
  'benjitaylor/skills': { name: 'benji-taylor', author: 'Benji Taylor', about: "Benji Taylor's Stageshow: faux product UI, still or animated" },
  'vercel-labs/agent-skills': { name: 'vercel', author: 'Vercel', about: "Vercel's agent skills: React and Next.js performance, composition, deploying, the web interface and writing guidelines" },
  'vercel-labs/ui': { name: 'vercel-ui-sdk', author: 'Vercel', about: "Vercel's UI SDK skill, and the UI SDK repository's own contributor skills" },
  'mattpocock/skills': { name: 'matt-pocock', author: 'Matt Pocock', about: "Matt Pocock's engineering skills: deep modules, diagnosis, domain models, specs, guardrails" },
}

const links = [...readme.matchAll(/\]\(https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/main\/([^)\s]+)\/SKILL\.md\)/g)]
const byRepo = {}
for (const [, repo, path] of links) {
  if (repo === 'cursor/plugins') continue
  ;(byRepo[repo] ||= new Set()).add(`./${path}`)
}

const plugins = []
for (const [repo, paths] of Object.entries(byRepo)) {
  const r = REPOS[repo]
  if (!r) { console.error(`no REPOS entry for ${repo}; add one`); process.exit(1) }
  plugins.push({
    name: r.name,
    source: { source: 'github', repo },
    description: `${r.about}. Served from ${repo}, not copied.`,
    author: { name: r.author },
    strict: false,
    skills: [...paths].sort(),
  })
}
plugins.push({
  name: 'pstack',
  source: { source: 'git-subdir', url: 'https://github.com/cursor/plugins.git', path: 'harness/pstack/claude-code' },
  description: "Lauren Tan's (poteto) pstack, the Claude Code build Cursor generates from her Cursor plugin: /pstack:poteto-mode, /pstack:correct and the rest. Served from cursor/plugins, not copied.",
  author: { name: 'Lauren Tan' },
})
plugins.sort((a, b) => a.name.localeCompare(b.name))

const m = JSON.parse(readFileSync(MP, 'utf8'))
const own = m.plugins.filter((p) => p.source === './')
const next = { ...m, metadata: { ...m.metadata, description: 'The skills Harshit Khemani uses with coding agents: his own (kheskills, khe-brain) and the ones he uses from Emil Kowalski, Benji Taylor, Vercel, Lauren Tan and Matt Pocock, each served from its author\'s repo.' }, plugins: [...own, ...plugins] }
const text = JSON.stringify(next, null, 2) + '\n'

if (process.argv.includes('--check')) {
  if (readFileSync(MP, 'utf8') !== text) { console.error('marketplace.json is out of date: run node scripts/marketplace.mjs'); process.exit(1) }
  console.log('marketplace.json is up to date')
} else {
  writeFileSync(MP, text)
  console.log(plugins.map((p) => `${p.name}: ${p.skills ? p.skills.length + ' skills' : 'whole plugin'}`).join('\n'))
}

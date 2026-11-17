#!/usr/bin/env node
// Builds every install manifest from the folders, so none of them can drift from the repo:
//
//   1. The kheskills and khe-brain plugins in .claude-plugin/marketplace.json, from skills/khe-*,
//      agents/ and commands/. Only their `version` is written by hand: bump it in marketplace.json
//      when what the plugin serves changes, or installed copies never update (check.mjs fails until you do).
//   2. The plugins in .claude-plugin/marketplace.json that serve other people's skills, from the
//      README's "From others" links (the link that names a skill's SKILL.md is the path served). Each
//      points at its author's own repo; nothing is copied here.
//   3. plugin.json at the repo root, the Agent Plugins 1.0.0 manifest (agent-plugins.org): the whole
//      repo as one plugin whose skills are skills/<name>/SKILL.md. That spec has no agents or commands.
//   4. The README's install block, between <!-- install:start --> and <!-- install:end -->. The
//      marketplace must be added with --sparse: the kheskills plugin sits at the repo root, and Claude
//      Code fetches every git submodule inside a plugin's folder, so a plain add downloads all the linked
//      repos under skills/ and times out. The sparse list is every folder the khe plugins read.
//
//   node scripts/marketplace.mjs          rewrite all four, and check each author repo's own manifest
//   node scripts/marketplace.mjs --check  exit 1 if any is out of date (offline; CI runs this)
//
// pstack is a Cursor plugin, so its entry serves the Claude Code build Cursor generates at
// harness/pstack/claude-code, whole, with its agents and adapter.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MP = join(ROOT, '.claude-plugin', 'marketplace.json')
const AP = join(ROOT, 'plugin.json')
const README = join(ROOT, 'README.md')
const readme = readFileSync(README, 'utf8')
const check = process.argv.includes('--check')

// Who each repo belongs to, and what its plugin is called here. `whole`: the repo ships its own
// .claude-plugin/plugin.json listing its skills, so the entry serves that plugin as it is; declaring
// skills here too fails to load ("conflicting manifests"). Generating checks this against each repo.
const REPOS = {
  'emilkowalski/skills': { name: 'emil-kowalski', author: 'Emil Kowalski', about: "Emil Kowalski's skills: UI craft, motion, gestures, mobile feel, taste" },
  'benjitaylor/skills': { name: 'benji-taylor', author: 'Benji Taylor', about: "Benji Taylor's Stageshow: faux product UI, still or animated" },
  'vercel-labs/agent-skills': { name: 'vercel', author: 'Vercel', about: "Vercel's agent skills: React and Next.js performance, composition, deploying, the web interface and writing guidelines" },
  'vercel-labs/ui': { name: 'vercel-ui-sdk', author: 'Vercel', about: "Vercel's UI SDK skill, and the UI SDK repository's own contributor skills" },
  'mattpocock/skills': { name: 'matt-pocock', author: 'Matt Pocock', about: "Matt Pocock's engineering skills: deep modules, diagnosis, domain models, specs, guardrails", whole: true },
}

const links = [...readme.matchAll(/\]\(https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/main\/([^)\s]+)\/SKILL\.md\)/g)]
const byRepo = {}
for (const [, repo, path] of links) {
  if (repo === 'cursor/plugins') continue
  ;(byRepo[repo] ||= new Set()).add(`./${path}`)
}

const problems = []
const plugins = []
for (const [repo, paths] of Object.entries(byRepo)) {
  const r = REPOS[repo]
  if (!r) { problems.push(`no REPOS entry for ${repo}; add one`); continue }
  if (!check) {
    const url = `https://raw.githubusercontent.com/${repo}/HEAD/.claude-plugin/plugin.json`
    const res = (await fetch(url).catch(() => null)) || (await fetch(url).catch(() => null))
    if (!res) problems.push(`could not reach ${repo} to check its manifest`)
    else if (res.ok && !r.whole) problems.push(`${repo} ships its own plugin.json: set whole: true in REPOS, or its plugin fails to load`)
    else if (res.status === 404 && r.whole) problems.push(`${repo} has no plugin.json: drop whole: true so the entry lists its skills`)
  }
  plugins.push({
    name: r.name,
    source: { source: 'github', repo },
    description: `${r.about}. Served from ${repo}${r.whole ? ' as its own plugin' : ''}, not copied.`,
    homepage: `https://github.com/${repo}`,
    author: { name: r.author },
    ...(r.whole ? {} : { strict: false, skills: [...paths].sort() }),
  })
}
plugins.push({
  name: 'pstack',
  source: { source: 'git-subdir', url: 'https://github.com/cursor/plugins.git', path: 'harness/pstack/claude-code' },
  description: "Lauren Tan's (poteto) pstack, the Claude Code build Cursor generates from her Cursor plugin: /pstack:poteto-mode, /pstack:correct and the rest. Served from cursor/plugins, not copied.",
  homepage: 'https://github.com/cursor/plugins/tree/main/harness/pstack/claude-code',
  author: { name: 'Lauren Tan' },
})
plugins.sort((a, b) => a.name.localeCompare(b.name))

// The two plugins built from this repo. Versions are kept from marketplace.json; everything else is
// derived, so a new skill, agent or command is picked up by running this script.
const REPO = 'https://github.com/HKTITAN/skills'
const AUTHOR = { name: 'Harshit Khemani', url: 'https://www.khe.money' }
const isDir = (p) => existsSync(p) && statSync(p).isDirectory()
const kheAll = readdirSync(join(ROOT, 'skills')).filter((d) => d.startsWith('khe-') && existsSync(join(ROOT, 'skills', d, 'SKILL.md'))).sort()
const kheSkills = kheAll.filter((d) => !d.startsWith('khe-brain-'))
const mdIn = (dir) => (isDir(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md')).sort() : [])
const agentFiles = mdIn('agents')
const commandFiles = mdIn('commands')
const m = JSON.parse(readFileSync(MP, 'utf8'))
const versionOf = (name) => m.plugins.find((p) => p.name === name)?.version || '1.0.0'
const own = [
  {
    name: 'kheskills',
    source: './',
    description: `Every khe skill except the brains, as one Claude Code plugin: ${kheSkills.map((d) => `/kheskills:${d}`).join(', ')}. Also ${agentFiles.length} kheAgents for orchestrated work: ${agentFiles.map((f) => `kheskills:${f.replace(/\.md$/, '')}`).join(', ')}. The brains are the khe-brain plugin.`,
    version: versionOf('kheskills'),
    author: AUTHOR,
    homepage: REPO,
    repository: REPO,
    license: 'MIT',
    keywords: ['skills', 'design-engineering', 'ui', 'motion', 'svg', 'sound', 'launch-video', 'agents', 'orchestration'],
    strict: false,
    skills: kheSkills.map((d) => `./skills/${d}`),
    agents: agentFiles.map((f) => `./agents/${f}`),
    commands: [],
  },
  {
    name: 'khe-brain',
    source: './',
    description: `Brains: answers from one source's public writing, talks or notes, with the source named. ${commandFiles.map((f) => `/khe-brain:${f.replace(/\.md$/, '')}`).join(', ')}.`,
    version: versionOf('khe-brain'),
    author: AUTHOR,
    homepage: REPO,
    repository: REPO,
    license: 'MIT',
    keywords: ['skills', 'brain', 'citations', 'research'],
    strict: false,
    // commands/ holds no SKILL.md, so no brain loads a second time under khe-brain: (see AGENTS.md).
    skills: ['./commands'],
    commands: commandFiles.map((f) => `./commands/${f}`),
  },
]
const next = { ...m, metadata: { ...m.metadata, description: "The skills Harshit Khemani uses with coding agents: his own (kheskills, khe-brain) and the ones he uses from Emil Kowalski, Benji Taylor, Vercel, Lauren Tan and Matt Pocock, each served from its author's repo." }, plugins: [...own, ...plugins] }
const mpText = JSON.stringify(next, null, 2) + '\n'

// The Agent Plugins 1.0.0 manifest. Its layout is fixed (skills/<name>/SKILL.md, immediate children
// only), so it serves every khe skill, brains included; the linked skills are empty submodule folders
// with no SKILL.md and are skipped. No version: the spec makes it optional, and the versions that
// decide updates are the Claude Code ones above.
const ap = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: 'kheskills',
  description: `Harshit Khemani's ${kheAll.length} agent skills: UI craft, design tokens, SVG, stickers, diagrams, sound, launch films, demos, packaging, the poteto pyramid, a content engine, and brains that answer from one source's public work with the source named. Start with khe-auto.`,
  author: AUTHOR,
  homepage: REPO,
  repository: REPO,
  license: 'MIT',
  keywords: ['skills', 'agent-skills', 'design-engineering', 'ui', 'motion', 'agents'],
}
const apText = JSON.stringify(ap, null, 2) + '\n'

// The sparse list: the marketplace file, the folders the khe plugins read, and every khe skill folder.
// The linked skills are git submodules under skills/ and are never in it.
const sparse = ['.claude-plugin', 'agents', 'commands', ...kheAll.map((d) => `skills/${d}`)]
const authors = plugins.map((p) => p.name)
const block = `<!-- install:start -->
In Claude Code they install as plugins from one marketplace. Add it with \`--sparse\`, exactly as below: the linked skills are git submodules beside mine, and without it Claude Code downloads all of them and the add times out.

\`\`\`text
/plugin marketplace add HKTITAN/skills --sparse ${sparse.join(' ')}
/plugin install kheskills@kheskills
/plugin install khe-brain@kheskills
\`\`\`

\`kheskills\` is every skill above except the brains, plus the four kheAgents; \`khe-brain\` is the brains. The skills are then \`/kheskills:khe-ui\`, \`/kheskills:khe-auto\` and so on.

For a team, put the same in the project's \`.claude/settings.json\`, so everyone who trusts the folder gets the marketplace without typing the list:

\`\`\`json
{
  "extraKnownMarketplaces": {
    "kheskills": {
      "source": { "source": "github", "repo": "HKTITAN/skills", "sparsePaths": ${JSON.stringify(sparse)} }
    }
  }
}
\`\`\`

The same marketplace serves the skills I use from other people, each straight from its author's repo:

\`\`\`text
${authors.map((a) => `/plugin install ${a}@kheskills`).join('\n')}
\`\`\`

\`pstack\` here is the Claude Code build of Lauren Tan's Cursor plugin, so its skills are \`/pstack:<name>\`. \`matt-pocock\` is Matt Pocock's own plugin, as his manifest defines it. The others serve exactly the skills listed under From others below.

If an add or update still times out on a slow connection, raise Claude Code's clone timeout (milliseconds) and run it again: \`CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS=300000\`.
<!-- install:end -->`
const readmeNext = readme.replace(/<!-- install:start -->[\s\S]*?<!-- install:end -->/, block)
if (!readme.includes('<!-- install:start -->')) problems.push('README.md has no <!-- install:start --> ... <!-- install:end --> block')

if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
if (check) {
  const stale = []
  if (readFileSync(MP, 'utf8') !== mpText) stale.push('.claude-plugin/marketplace.json')
  if (!existsSync(AP) || readFileSync(AP, 'utf8') !== apText) stale.push('plugin.json')
  if (readme !== readmeNext) stale.push('the README install block')
  if (stale.length) { console.error(`${stale.join(' and ')} out of date: run node scripts/marketplace.mjs`); process.exit(1) }
  console.log('marketplace.json, plugin.json and the README install block are up to date')
} else {
  writeFileSync(MP, mpText)
  writeFileSync(AP, apText)
  writeFileSync(README, readmeNext)
  console.log(plugins.map((p) => `${p.name}: ${p.skills ? p.skills.length + ' skills' : 'whole plugin'}`).join('\n'))
  console.log(`install block: ${sparse.length} sparse paths`)
}

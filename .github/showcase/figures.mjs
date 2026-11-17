// Builds the README figures in khe's skin (https://ds.khe.money, khe.DESIGN): sand paper and ink,
// Inter names, Geist Mono for paths, uppercase heading-grey labels, yellow only as a highlighter
// behind the one or two names that matter, and khe's dark theme under prefers-color-scheme.
//
//   node .github/showcase/figures.mjs          writes every figure
//   node <khe-diagram>/scripts/diagram-check.mjs <figure> --gate   checks one
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function style(id) {
  return `<style>
    #${id} { --page: #fdfdfc; --surface: #ffffff; --ink: #21201c; --ink-2: #63635e; --ink-3: #82827c; --line: #cfceca; --rule: #e9e8e6; --heading: #8d8d86; --hl: #ffe556; --hl: oklch(0.92 0.16 98); --hl-ink: #21201c; font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; }
    @media (prefers-color-scheme: dark) {
      #${id} { --page: #111110; --surface: #222221; --ink: #ffffff; --ink-2: #eeeeec; --ink-3: #b5b3ad; --line: #494844; --rule: #31312e; --heading: #b5b3ad; --hl: #eed04c; --hl: oklch(0.86 0.15 96); --hl-ink: #111110; }
    }
    #${id} .paper { fill: var(--page); }
    #${id} .edge { fill: none; stroke: var(--ink-3); stroke-width: 1.25; }
    #${id} .edge.dashed { stroke-dasharray: 5 4; }
    #${id} .head { fill: var(--ink-3); }
    #${id} .mask { fill: var(--page); }
    #${id} .label { fill: var(--ink-3); font-size: 9px; }
    #${id} .node rect { fill: var(--surface); stroke: var(--line); }
    #${id} .node.strong rect { stroke: var(--ink); }
    #${id} .node.quiet rect { fill: var(--page); stroke-dasharray: 5 4; }
    #${id} .node rect.hl { fill: var(--hl); stroke: none; }
    #${id} .name { fill: var(--ink); font-size: 12px; font-weight: 600; }
    #${id} .name.on { fill: var(--hl-ink); }
    #${id} .sub { fill: var(--ink-2); font-size: 10px; }
    #${id} .path { fill: var(--ink-3); font-size: 10px; font-family: "Geist Mono", ui-monospace, monospace; }
    #${id} .skill { fill: var(--ink); font-size: 12px; }
    #${id} .caps { fill: var(--heading); font-size: 10px; font-weight: 900; letter-spacing: 0.06em; }
    #${id} .callout { fill: var(--ink-2); font-size: 10px; }
    #${id} .zone { fill: none; stroke: var(--line); stroke-dasharray: 2 4; }
    #${id} .rule { stroke: var(--rule); }
    #${id} .legend text { fill: var(--ink-2); font-size: 10px; }
  </style>`
}

const marker = (id) => `<defs>
    <marker id="${id}-arrow" viewBox="0 0 8 8" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path class="head" d="M0 1 L8 4 L0 7 Z"/>
    </marker>
  </defs>`

function svg(id, w, h, title, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${title}</title>
  <desc id="${id}-desc">${desc}</desc>
  ${marker(id)}
  ${style(id)}
  <rect class="paper" width="${w}" height="${h}"/>
${body}
</svg>
`
}

// A node. `on` puts a highlighter mark behind its name: khe's yellow marks words, never fills a box.
function node({ x, y, w, h = 56, name, sub, cls = '', on = false }) {
  const nameW = Math.ceil(name.length * 7.1 + 8)
  const hl = on ? `\n      <rect class="hl" x="${x + 8}" y="${y + (sub ? 12 : 20)}" width="${nameW}" height="16" rx="2"/>` : ''
  const ny = sub ? y + 24 : y + 32
  return `    <g class="node ${cls}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>${hl}
      <text class="name${on ? ' on' : ''}" x="${x + 12}" y="${ny}">${name}</text>${sub ? `\n      <text class="sub" x="${x + 12}" y="${y + 40}">${sub}</text>` : ''}
    </g>`
}

const edge = (d, id, cls = '') => `    <path class="edge ${cls}" d="${d}" marker-end="url(#${id}-arrow)"/>`
const label = (x, y, text) => `    <rect class="mask" x="${x}" y="${y}" width="${Math.ceil(text.length * 5.6 + 8)}" height="14"/>\n    <text class="label" x="${x + 4}" y="${y + 10}">${text}</text>`

function write(rel, text) {
  const file = join(ROOT, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
  console.log(`wrote ${rel}`)
}

// 1. The pyramid, with the skills that take each layer's deep part.
{
  const id = 'poteto-pyramid'
  const bands = [
    ['Codebase', 'architecture, API design, folders, deletion', 'codebase-design · improve-codebase-architecture', 'Matt Pocock'],
    ['Static analysis', 'lints, types, compilers, tests, CI', 'no-comments · setup-pre-commit · git-guardrails', 'Lauren Tan · Matt Pocock'],
    ['Verification', 'run the app, formal models', 'create-verification-skill · statechart · khe-demo', 'Lauren Tan, and her formal-verification pair · here'],
    ['Prose', 'judgment calls only', 'learn-taste · correct', 'Emil Kowalski · Lauren Tan'],
    ['Human review', 'feeds back up', 'interrogate · pocock-code-review · khe-ui', 'Lauren Tan · Matt Pocock · here'],
  ]
  const nodes = bands.map(([name, sub], i) => node({ x: 72 + i * 28, y: 56 + i * 56, w: 352 - i * 56, h: 48, name, sub, cls: i === 0 ? 'strong' : i >= 3 ? 'quiet' : '', on: i === 0 }).replace(`y="${56 + i * 56 + 24}"`, `y="${56 + i * 56 + 21}"`).replace(`y="${56 + i * 56 + 40}"`, `y="${56 + i * 56 + 37}"`).replace(`y="${56 + i * 56 + 12}"`, `y="${56 + i * 56 + 9}"`))
  const rows = bands.map(([, , skills, who], i) => `    <text class="skill" x="456" y="${77 + i * 56}">${skills}</text>\n    <text class="sub" x="456" y="${93 + i * 56}">${who}</text>`)
  const rules = [1, 2, 3, 4].map((i) => `  <line class="rule" x1="456" y1="${56 + i * 56}" x2="864" y2="${56 + i * 56}"/>`)
  write('skills/khe-poteto-pyramid/assets/pyramid.svg', svg(id, 896, 368, 'The poteto pyramid and where each layer hands off', 'A correction goes to the highest layer that can hold it, and each layer names the skills that take its deep part.', `  <g class="edges">
${edge('M36 64 V320', id)}
  </g>
  <g class="labels">
${label(44, 178, 'cost')}
  </g>
  <text class="caps" x="72" y="40">LAYER, TOP FIRST</text>
  <text class="caps" x="456" y="40">THE DEEP PART GOES TO</text>
${rules.join('\n')}
  <g class="nodes">
${nodes.join('\n')}
  </g>
  <g class="handoffs">
${rows.join('\n')}
  </g>
  <text class="callout" x="72" y="352">Start at the top band. A layer gets a correction only when every layer above it could not hold it.</text>`))
}

// 2. How the skills hand off, inside the khe-auto router.
{
  const id = 'kheskills-map'
  write('.github/assets/skill-map.svg', svg(id, 896, 344, 'How the skills hand off to each other', 'khe-auto routes every request; inside it, five hand-offs run one skill after another.', `  <rect class="zone" x="32" y="24" width="832" height="248" rx="6"/>
  <text class="caps" x="48" y="48">KHE-AUTO</text>
  <text class="sub" x="116" y="48">routes every request to the skill that owns it, runs these hand-offs in order, and places every correction with khe-poteto-pyramid</text>
  <g class="edges">
${edge('M192 108 H272', id)}
${edge('M480 108 H400', id, 'dashed')}
${edge('M192 212 H272', id)}
${edge('M400 212 H480', id)}
${edge('M688 212 H608', id)}
  </g>
  <g class="labels">
${label(196, 84, 'contract first')}
${label(408, 84, 'then the look')}
${label(212, 188, 'one take')}
${label(404, 188, 'picture locked')}
${label(612, 188, 'reveal sound')}
  </g>
  <g class="nodes">
${node({ x: 64, y: 80, w: 128, name: 'khe-design-tokens', sub: 'reads .design' })}
${node({ x: 272, y: 80, w: 128, name: 'khe-ui', sub: 'builds and judges', cls: 'strong', on: true })}
${node({ x: 480, y: 80, w: 128, name: 'ui-sdk', sub: 'Vercel, composes', cls: 'quiet' })}
${node({ x: 64, y: 184, w: 128, name: 'khe-demo', sub: 'records the app' })}
${node({ x: 272, y: 184, w: 128, name: 'khe-launch-film', sub: 'plans and cuts', cls: 'strong', on: true })}
${node({ x: 480, y: 184, w: 128, name: 'khe-sound', sub: 'places each sound' })}
${node({ x: 688, y: 184, w: 128, name: 'khe-svg', sub: 'vectors that move' })}
  </g>
  <g class="legend" transform="translate(32 300)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">hands off to</text>
    <path class="edge dashed" d="M112 0 H136"/>
    <text x="144" y="4">a linked skill hands off</text>
    <text x="300" y="4">Work alone: khe-sticker, khe-diagram, khe-content-engine, the seven brains.</text>
    <text x="0" y="22">khe-poteto-pyramid and khe-package hand their deep parts to Lauren Tan's, Matt Pocock's, Emil Kowalski's and Benji Taylor's skills, drawn in their own READMEs.</text>
  </g>`))
}

// 3. khe-package's flow: the two calls that are yours are highlighted.
{
  const id = 'khe-package-flow'
  write('skills/khe-package/assets/flow.svg', svg(id, 896, 320, 'How khe-package runs', 'Three ideas as stills, your pick and your approval, then a frame-by-frame render, a file check and the first line.', `  <g class="edges">
${edge('M192 100 H248', id)}
${edge('M408 100 H464', id)}
${edge('M624 100 H680', id)}
${edge('M760 128 V200', id)}
${edge('M680 228 H624', id)}
${edge('M464 228 H408', id)}
${edge('M560 200 V172 Q560 164 568 164 H704 Q712 164 712 156 V128', id, 'dashed')}
  </g>
  <g class="labels">
${label(576, 144, 'a fault')}
  </g>
  <text class="caps" x="32" y="48">SOURCE, THEN THE TWO CALLS THAT ARE YOURS</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 160, name: 'The source', sub: 'page, live stage, Stageshow' })}
${node({ x: 248, y: 72, w: 160, name: 'Three ideas', sub: 'one still each' })}
${node({ x: 464, y: 72, w: 160, name: 'You pick one', sub: 'nothing renders yet', cls: 'strong', on: true })}
${node({ x: 680, y: 72, w: 160, name: 'You agree the look', sub: 'two to four stills', cls: 'strong', on: true })}
${node({ x: 680, y: 200, w: 160, name: 'Render', sub: 'paused clock, 60 fps' })}
${node({ x: 464, y: 200, w: 160, name: 'Check the file', sub: 'package-check, frames' })}
${node({ x: 248, y: 200, w: 160, name: 'The first line', sub: 'for a stranger' })}
  </g>
  <g class="legend" transform="translate(32 296)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">next step</text>
    <path class="edge dashed" d="M96 0 H120"/>
    <text x="128" y="4">back, re-sending only the frames a fault touches</text>
  </g>`))
}

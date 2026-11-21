// khe figure helpers: the khe design system skin (https://ds.khe.money, khe.DESIGN) for README figures.
// Import these, build one svg() per figure, write() it, then check it with khe-diagram's gate:
//   node <khe-diagram>/scripts/diagram-check.mjs <figure.svg> --gate
// node({ on: true }) puts the yellow highlighter behind a name: one or two per figure, never more.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export function style(id) {
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

export const marker = (id) => `<defs>
    <marker id="${id}-arrow" viewBox="0 0 8 8" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path class="head" d="M0 1 L8 4 L0 7 Z"/>
    </marker>
  </defs>`

export function svg(id, w, h, title, desc, body) {
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
export function node({ x, y, w, h = 56, name, sub, cls = '', on = false }) {
  const nameW = Math.ceil(name.length * 7.1 + 8)
  const hl = on ? `\n      <rect class="hl" x="${x + 8}" y="${y + (sub ? 12 : 20)}" width="${nameW}" height="16" rx="2"/>` : ''
  const ny = sub ? y + 24 : y + 32
  return `    <g class="node ${cls}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>${hl}
      <text class="name${on ? ' on' : ''}" x="${x + 12}" y="${ny}">${name}</text>${sub ? `\n      <text class="sub" x="${x + 12}" y="${y + 40}">${sub}</text>` : ''}
    </g>`
}

export const edge = (d, id, cls = '') => `    <path class="edge ${cls}" d="${d}" marker-end="url(#${id}-arrow)"/>`
export const label = (x, y, text) => `    <rect class="mask" x="${x}" y="${y}" width="${Math.ceil(text.length * 5.6 + 8)}" height="14"/>\n    <text class="label" x="${x + 4}" y="${y + 10}">${text}</text>`

// With --check a script writes nothing: it fails when a committed figure differs from what the script draws.
export function write(rel, text) {
  const file = join(ROOT, rel)
  if (process.argv.includes('--check')) {
    const same = existsSync(file) && readFileSync(file, 'utf8').replace(/\r\n/g, '\n') === text.replace(/\r\n/g, '\n')
    if (!same) {
      const script = process.argv[1].split(/[\\/]/).pop()
      console.error(`${rel} is not what ${script} draws now (a count or a label changed): run \`node .github/showcase/${script}\` from the repo root and commit ${rel}`)
      process.exitCode = 1
    }
    return
  }
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
  console.log(`wrote ${rel}`)
}


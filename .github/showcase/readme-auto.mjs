// khe-auto README figures, in khe's skin via the shared helpers.
import { svg, node, edge, label, write } from './khe-figure.mjs'

// 1. How khe-auto runs: the route and the pyramid step are the two calls highlighted.
{
  const id = 'khe-auto-flow'
  write('skills/khe-auto/assets/flow.svg', svg(id, 896, 420, 'How khe-auto runs', 'A request becomes a goal line and a route, each routed skill runs its own loop and gate, every correction is placed with khe-poteto-pyramid, and the reply passes route-check before it is handed over.', `  <g class="edges">
${edge('M192 76 H248', id)}
${edge('M408 76 H464', id)}
${edge('M552 104 V160', id)}
${edge('M624 76 H760 Q768 76 768 84 V160', id)}
${edge('M552 216 V236 Q552 244 560 244 H744 Q752 244 752 252 V272', id)}
${edge('M784 216 V272', id)}
${edge('M680 300 H624', id)}
${edge('M464 300 H408', id)}
${edge('M248 300 H192', id)}
${edge('M328 328 V348 Q328 356 336 356 H760 Q768 356 768 348 V328', id, 'dashed')}
  </g>
  <g class="labels">
${label(560, 120, 'a whole job')}
${label(648, 54, 'by domain')}
${label(480, 334, 'earliest fault')}
  </g>
  <text class="caps" x="32" y="32">ONE REQUEST, ONE ROUTE, EVERY CORRECTION PLACED</text>
  <g class="nodes">
${node({ x: 32, y: 48, w: 160, name: 'A request', sub: 'one sentence, no skill named' })}
${node({ x: 248, y: 48, w: 160, name: 'Goal line', sub: 'checkable by a stranger' })}
${node({ x: 464, y: 48, w: 160, name: 'Route', sub: 'a playbook, or 1 or 2 skills', cls: 'strong', on: true })}
${node({ x: 464, y: 160, w: 160, name: 'A playbook', sub: 'one of nine whole jobs' })}
${node({ x: 680, y: 160, w: 176, name: 'One or two skills', sub: 'from the five domain tables' })}
${node({ x: 680, y: 272, w: 176, name: 'Each skill\u2019s loop', sub: 'its gold, the work, its gate' })}
${node({ x: 464, y: 272, w: 160, name: 'Place corrections', sub: 'khe-poteto-pyramid', cls: 'strong', on: true })}
${node({ x: 248, y: 272, w: 160, name: 'Route-check', sub: 'the reply passes its gate' })}
${node({ x: 32, y: 272, w: 160, name: 'Hand over', sub: 'ROUTE.md, Not verified' })}
  </g>
  <g class="legend" transform="translate(32 396)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">next step</text>
    <path class="edge dashed" d="M96 0 H120"/>
    <text x="128" y="4">back to the earliest broken step, then forward again</text>
    <text x="440" y="4">Each correction leaves a record in PYRAMID.md.</text>
  </g>`))
}

// 2. The five domains and how many skills each routes to, here and linked (counted from SKILL.md's tables).
{
  const id = 'khe-auto-domains'
  const rows = [
    ['Design', 'screens, motion, sound, film', 9, 22],
    ['Code', 'Swift, React, Vercel', 0, 12],
    ['Brains', 'named people, and their council', 8, 0],
    ['Content', 'one idea, a post per platform', 1, 0],
    ['Engineering', 'agents working in a repo', 1, 34],
  ]
  const U = 8
  const ys = rows.map((_, i) => 48 + i * 64)
  const nodes = rows.map(([name, sub], i) => node({ x: 240, y: ys[i], w: 192, h: 48, name, sub, on: name === 'Engineering' })
    .replace(`y="${ys[i] + 24}"`, `y="${ys[i] + 21}"`).replace(`y="${ys[i] + 40}"`, `y="${ys[i] + 37}"`).replace(`y="${ys[i] + 12}"`, `y="${ys[i] + 9}"`))
  const bars = rows.map(([, , here, linked], i) => {
    const y = ys[i] + 16
    const h = here ? `    <rect class="bar here" x="464" y="${y}" width="${here * U}" height="16" rx="2"/>` : ''
    const l = linked ? `    <rect class="bar linked" x="${464 + here * U}" y="${y}" width="${linked * U}" height="16" rx="2"/>` : ''
    const t = `    <text class="sub" x="${464 + (here + linked) * U + 12}" y="${y + 12}">${here} here, ${linked} linked</text>`
    return [h, l, t].filter(Boolean).join('\n')
  })
  const mid = ys.map((y) => y + 24) // 72 136 200 264 328
  write('skills/khe-auto/assets/domains.svg', svg(id, 896, 420, 'The five domains khe-auto routes to', 'khe-auto routes every request into one of five domains; Design and Engineering hold the most skills, and most of them are linked from other authors rather than kept here.', `  <style>
    #${id} .bar.here { fill: var(--ink); }
    #${id} .bar.linked { fill: var(--line); }
    #${id} .dot { fill: var(--ink-3); }
  </style>
  <g class="edges">
${edge(`M176 ${mid[2]} H240`, id)}
${edge(`M208 ${mid[2]} V${mid[0] + 8} Q208 ${mid[0]} 216 ${mid[0]} H240`, id)}
${edge(`M208 ${mid[1]} H240`, id)}
${edge(`M208 ${mid[3]} H240`, id)}
${edge(`M208 ${mid[2]} V${mid[4] - 8} Q208 ${mid[4]} 216 ${mid[4]} H240`, id)}
  </g>
  <circle class="dot" cx="208" cy="${mid[1]}" r="3"/>
  <circle class="dot" cx="208" cy="${mid[2]}" r="3"/>
  <circle class="dot" cx="208" cy="${mid[3]}" r="3"/>
  <text class="caps" x="32" y="32">ROUTER</text>
  <text class="caps" x="240" y="32">DOMAIN</text>
  <text class="caps" x="464" y="32">SKILLS IT ROUTES TO</text>
  <g class="nodes">
${node({ x: 32, y: 172, w: 144, name: 'khe-auto', sub: 'finds the domain first', cls: 'strong' })}
${nodes.join('\n')}
  </g>
  <g class="counts">
${bars.join('\n')}
  </g>
  <g class="legend" transform="translate(32 396)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <rect class="bar here" x="0" y="-6" width="24" height="12" rx="2"/>
    <text x="32" y="4">here, a khe- skill in this repo</text>
    <rect class="bar linked" x="208" y="-6" width="24" height="12" rx="2"/>
    <text x="240" y="4">linked, kept in its author's own repo</text>
    <text x="464" y="4">19 here and 68 linked, one row each in SKILL.md.</text>
  </g>`))
}

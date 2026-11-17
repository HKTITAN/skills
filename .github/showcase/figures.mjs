// Builds the README figures in khe's skin (https://ds.khe.money, khe.DESIGN): sand paper and ink,
// Inter names, Geist Mono for paths, uppercase heading-grey labels, yellow only as a highlighter
// behind the one or two names that matter, and khe's dark theme under prefers-color-scheme.
//
//   node .github/showcase/figures.mjs          writes every figure
//   node <khe-diagram>/scripts/diagram-check.mjs <figure> --gate   checks one
import { ROOT, svg, node, edge, label, write } from './khe-figure.mjs'

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

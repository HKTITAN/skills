// README "How it runs" figures for khe-ui, khe-design-tokens, khe-svg and khe-sticker,
// in khe's skin, built with the shared helpers in .github/showcase/khe-figure.mjs.
import { svg, node, edge, label, write } from './khe-figure.mjs'

const legend = (y, back) => `  <g class="legend" transform="translate(32 ${y})">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">next step, or a hand-off</text>
    <path class="edge dashed" d="M176 0 H200"/>
    <text x="208" y="4">${back}</text>
  </g>`

// 1. khe-ui: the contract and ui-sdk hand in, the loop runs to a verdict, motion in a file and sound hand out.
{
  const id = 'khe-ui-flow'
  write('skills/khe-ui/assets/flow.svg', svg(id, 896, 376, 'How khe-ui runs', 'The contract and ui-sdk hand in, khe-ui builds or judges, the gate and a look end in a verdict, and motion inside a file or a sound go to the skills that own them.', `  <g class="edges">
${edge('M192 100 H288 Q296 100 296 108 V136 Q296 144 304 144 H320', id)}
${edge('M192 212 H288 Q296 212 296 204 V176 Q296 168 304 168 H320', id)}
${edge('M480 156 H536', id)}
${edge('M696 156 H752', id)}
${edge('M808 184 V240', id)}
${edge('M808 128 V112 Q808 104 800 104 H408 Q400 104 400 112 V128', id, 'dashed')}
${edge('M372 184 V264', id)}
${edge('M428 184 V264', id)}
  </g>
  <g class="labels">
${label(200, 78, 'contract first')}
${label(200, 190, 'parts rendered')}
${label(560, 82, 'a no: fix it')}
${label(276, 224, 'motion in file')}
${label(438, 224, 'after motion')}
  </g>
  <text class="caps" x="32" y="48">HANDS IN, THE LOOP, HANDS OUT</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 160, name: 'khe-design-tokens', sub: 'when there is a contract' })}
${node({ x: 32, y: 184, w: 160, name: 'ui-sdk', sub: 'Vercel, composes parts', cls: 'quiet' })}
${node({ x: 320, y: 128, w: 160, name: 'khe-ui', sub: 'one lane, by symptom', cls: 'strong', on: true })}
${node({ x: 536, y: 128, w: 160, name: 'The gate', sub: 'ui-check --gate' })}
${node({ x: 752, y: 128, w: 112, name: 'Look at it', sub: '390 px, Tab, 25%' })}
${node({ x: 752, y: 240, w: 112, name: 'Verdict', sub: 'with Not checked', cls: 'strong', on: true })}
${node({ x: 248, y: 264, w: 144, name: 'khe-svg', sub: 'motion inside an SVG' })}
${node({ x: 416, y: 264, w: 160, name: 'khe-sound', sub: 'a sound, if it earns one' })}
  </g>
${legend(352, 'back, when a look finds a fault')}`))
}

// 2. khe-design-tokens: find the contract, map it, thread it, gate it, hand over; no contract is its own exit.
{
  const id = 'khe-design-tokens-flow'
  write('skills/khe-design-tokens/assets/flow.svg', svg(id, 896, 432, 'How khe-design-tokens runs', 'khe-auto runs it first; it finds the contract, maps and threads the tokens, gates them and hands the gaps to khe-ui and a sound group to khe-sound.', `  <g class="edges">
${edge('M152 100 H248', id)}
${edge('M408 100 H464', id)}
${edge('M624 100 H680', id)}
${edge('M760 128 V200', id)}
${edge('M808 200 V128', id, 'dashed')}
${edge('M680 228 H624', id)}
${edge('M328 128 V200', id, 'dashed')}
${edge('M488 256 V328', id)}
${edge('M600 256 V328', id)}
  </g>
  <g class="labels">
${label(160, 78, 'runs it first')}
${label(338, 156, 'none found')}
${label(408, 284, 'a gap in it')}
${label(610, 284, 'tokens.sound')}
  </g>
  <text class="caps" x="32" y="48">CONTRACT FIRST, THEN EVERY VALUE FROM IT</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 120, name: 'khe-auto', sub: 'routes the job' })}
${node({ x: 248, y: 72, w: 160, name: 'Find the contract', sub: '.design, then DESIGN.md', cls: 'strong', on: true })}
${node({ x: 464, y: 72, w: 160, name: 'Token map', sub: 'drift, before any edit', on: true })}
${node({ x: 680, y: 72, w: 160, name: 'Thread it', sub: 'CSS vars, theme, props' })}
${node({ x: 680, y: 200, w: 160, name: 'The gate', sub: 'token-check, the folder' })}
${node({ x: 464, y: 200, w: 160, name: 'TOKENS.md', sub: 'literals, with reasons' })}
${node({ x: 248, y: 200, w: 160, name: 'No contract', sub: 'say so, offer one', cls: 'quiet' })}
${node({ x: 352, y: 328, w: 160, name: 'khe-ui', sub: 'the gaps, the feel' })}
${node({ x: 560, y: 328, w: 160, name: 'khe-sound', sub: 'its sound values' })}
  </g>
${legend(408, 'when a step fails: no contract, or a drift line')}`))
}

// 3. khe-svg: plan, build, maybe move, gate; stickers, page motion and sound go elsewhere.
{
  const id = 'khe-svg-flow'
  write('skills/khe-svg/assets/flow.svg', svg(id, 896, 344, 'How khe-svg runs', 'A plan decides the home, the engine and whether it moves; the file is built, given motion only with a cause and gated, while stickers, page motion and sound go to the skills that own them.', `  <g class="edges">
${edge('M192 132 H248', id)}
${edge('M408 132 H464', id)}
${edge('M624 132 H680', id)}
${edge('M376 104 V84 Q376 76 384 76 H704 Q712 76 712 84 V104', id, 'dashed')}
${edge('M112 160 V232', id)}
${edge('M544 160 V232', id)}
${edge('M720 160 V232', id)}
  </g>
  <g class="labels">
${label(516, 54, 'no motion')}
${label(122, 188, 'a sticker')}
${label(554, 188, 'on the page')}
${label(730, 188, 'contact frame')}
  </g>
  <text class="caps" x="32" y="40">ONE FILE, FROM PLAN TO GATE</text>
  <g class="nodes">
${node({ x: 32, y: 104, w: 160, name: 'Plan', sub: 'home, engine, a cause', cls: 'strong', on: true })}
${node({ x: 248, y: 104, w: 160, name: 'Build the file', sub: 'grid, named groups' })}
${node({ x: 464, y: 104, w: 160, name: 'Add the motion', sub: 'one curve, one duration', on: true })}
${node({ x: 680, y: 104, w: 160, name: 'The gate', sub: 'SVGO, then svg-check' })}
${node({ x: 32, y: 232, w: 160, name: 'khe-sticker', sub: 'stickers and packs' })}
${node({ x: 464, y: 232, w: 160, name: 'khe-ui', sub: 'motion around the file' })}
${node({ x: 680, y: 232, w: 160, name: 'khe-sound', sub: 'a sound on the reveal' })}
  </g>
${legend(320, 'skipped when nothing should move')}`))
}

// 4. khe-sticker: brief, silhouette, still, one motion, gate on the set, pack.
{
  const id = 'khe-sticker-flow'
  write('skills/khe-sticker/assets/flow.svg', svg(id, 896, 424, 'How khe-sticker runs', 'A brief becomes a silhouette, a still and at most one motion, the whole set is gated together and packed for a chat, with icons going to khe-svg, the palette coming from khe-design-tokens and a sound going to khe-sound.', `  <g class="edges">
${edge('M192 100 H248', id)}
${edge('M408 100 H464', id)}
${edge('M624 100 H680', id)}
${edge('M112 128 V200', id)}
${edge('M408 228 H512 Q520 228 520 220 V128', id)}
${edge('M584 128 V220 Q584 228 592 228 H680', id, 'dashed')}
${edge('M760 128 V200', id)}
${edge('M800 256 V312', id)}
${edge('M720 256 V276 Q720 284 712 284 H552 Q544 284 544 292 V312', id)}
  </g>
  <g class="labels">
${label(122, 156, 'icon or logo')}
${label(416, 206, 'palette roles')}
${label(594, 206, 'no verb')}
${label(810, 272, 'a chat')}
${label(554, 292, 'makes a sound')}
  </g>
  <text class="caps" x="32" y="40">ONE SET, FROM BRIEF TO PACK</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 160, name: 'The brief', sub: 'kind, verb, palette' })}
${node({ x: 248, y: 72, w: 160, name: 'Silhouette', sub: 'filled black, 64 px', cls: 'strong', on: true })}
${node({ x: 464, y: 72, w: 160, name: 'The still', sub: 'one outline, die-cut' })}
${node({ x: 680, y: 72, w: 160, name: 'One motion', sub: 'a pop, then a hold' })}
${node({ x: 32, y: 200, w: 160, name: 'khe-svg', sub: 'icons and logos' })}
${node({ x: 248, y: 200, w: 160, name: 'khe-design-tokens', sub: 'the palette contract' })}
${node({ x: 680, y: 200, w: 160, name: 'The gate', sub: 'sticker-check, the set', cls: 'strong', on: true })}
${node({ x: 680, y: 312, w: 160, name: 'The pack', sub: 'WhatsApp, Telegram' })}
${node({ x: 464, y: 312, w: 160, name: 'khe-sound', sub: 'cued to the hit' })}
  </g>
${legend(400, 'skipped when the brief has no verb')}`))
}

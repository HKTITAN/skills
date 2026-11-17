// README "How it runs" figures for khe-diagram, khe-sound, khe-demo, khe-content-engine.
import { svg, node, edge, label, write } from './khe-figure.mjs'

// khe-diagram: the decision first, then the surface, with its neighbours.
{
  const id = 'khe-diagram-flow'
  write('skills/khe-diagram/assets/flow.svg', svg(id, 896, 304, 'How khe-diagram runs', 'A request is tested against a sentence and a table first; a figure is then built and gated, or a canvas is edited, with the skin read from the project contract and the export passed to khe-svg.', `  <g class="edges">
${edge('M176 100 H208', id)}
${edge('M352 100 H384', id)}
${edge('M528 100 H560', id)}
${edge('M704 100 H736', id)}
${edge('M280 128 V200', id)}
${edge('M456 128 V200', id)}
${edge('M632 200 V128', id)}
  </g>
  <g class="labels">
${label(288, 157, 'no')}
${label(464, 157, 'a team edits')}
${label(640, 157, 'the skin')}
  </g>
  <text class="caps" x="32" y="48">FROM THE REQUEST TO A FIGURE, OR A CLEAR NO</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 144, name: 'khe-auto', sub: 'routes the request', cls: 'quiet' })}
${node({ x: 208, y: 72, w: 144, name: 'Draw at all?', sub: 'paragraph first', cls: 'strong', on: true })}
${node({ x: 384, y: 72, w: 144, name: 'Pick the surface', sub: 'who touches it next' })}
${node({ x: 560, y: 72, w: 144, name: 'Finished figure', sub: 'budget, gate, render', cls: 'strong' })}
${node({ x: 736, y: 72, w: 144, name: 'khe-svg', sub: 'SVGO after export', cls: 'quiet' })}
${node({ x: 208, y: 200, w: 144, name: 'Sentence or table', sub: 'ships instead' })}
${node({ x: 384, y: 200, w: 144, name: 'tldraw canvas', sub: 'bound arrows, lint' })}
${node({ x: 560, y: 200, w: 144, name: 'khe-design-tokens', sub: 'the .design contract', cls: 'quiet' })}
  </g>
  <text class="callout" x="32" y="288">A no is a correct result. The figure ends with FIGURE.md, the gate's last line and what was not checked.</text>`))
}

// khe-sound: three ways in, then each moment earns a sound or stays silent.
{
  const id = 'khe-sound-flow'
  write('skills/khe-sound/assets/flow.svg', svg(id, 896, 368, 'How khe-sound runs', 'A settled move, a locked film or a locked take comes in; each moment is judged, most stay silent, and the rest become one material family that is generated and placed on its contact frame.', `  <g class="edges">
${edge('M176 100 H196 Q204 100 204 108 V174 Q204 182 212 182 H232', id)}
${edge('M176 196 H232', id)}
${edge('M176 292 H196 Q204 292 204 284 V218 Q204 210 212 210 H232', id)}
${edge('M368 196 H400', id)}
${edge('M536 196 H568', id)}
${edge('M704 196 H736', id)}
${edge('M300 224 V264', id)}
  </g>
  <g class="labels">
${label(308, 237, 'no')}
  </g>
  <text class="caps" x="32" y="48">THREE WAYS IN, THEN EVERY MOMENT HAS TO EARN ITS SOUND</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 144, name: 'khe-ui', sub: 'the move, settled', cls: 'quiet' })}
${node({ x: 32, y: 168, w: 144, name: 'khe-launch-film', sub: 'picture locked', cls: 'quiet' })}
${node({ x: 32, y: 264, w: 144, name: 'khe-demo', sub: 'the take, locked', cls: 'quiet' })}
${node({ x: 232, y: 168, w: 136, name: 'Earned or not', sub: 'one row per moment', cls: 'strong', on: true })}
${node({ x: 400, y: 168, w: 136, name: 'One material', sub: 'four to six sounds' })}
${node({ x: 568, y: 168, w: 136, name: 'Generate', sub: 'ElevenLabs or synth' })}
${node({ x: 736, y: 168, w: 136, name: 'Place on frame', sub: '0 to 30 ms after', cls: 'strong', on: true })}
${node({ x: 232, y: 264, w: 136, name: 'Stays silent', sub: 'kept in the ledger' })}
  </g>
  <text class="callout" x="32" y="352">The gate, sound-check, reads the sound map, the family, the files and the playback code.</text>`))
}

// khe-demo: the real app, seeded and scripted, then handed on.
{
  const id = 'khe-demo-flow'
  write('skills/khe-demo/assets/flow.svg', svg(id, 896, 304, 'How khe-demo runs', 'The story, the seed and the script come before the browser opens; two takes must end on the same screen; the post goes on to a film and its sound, a wrong motion goes back to the product, and a product that cannot run goes to stageshow.', `  <g class="edges">
${edge('M176 100 H208', id)}
${edge('M352 100 H384', id)}
${edge('M528 100 H560', id)}
${edge('M704 100 H736', id)}
${edge('M104 128 V200', id)}
${edge('M632 128 V156 Q632 164 624 164 H464 Q456 164 456 172 V200', id)}
${edge('M808 128 V200', id)}
${edge('M736 228 H704', id)}
  </g>
  <g class="labels">
${label(112, 157, 'cannot run it')}
${label(480, 142, 'motion wrong')}
${label(816, 157, 'one shot')}
  </g>
  <text class="caps" x="32" y="48">THE REAL APP, SEEDED AND SCRIPTED, THEN HANDED ON</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 144, name: 'The story', sub: 'two to five beats' })}
${node({ x: 208, y: 72, w: 144, name: 'Seed and reset', sub: 'same first frame' })}
${node({ x: 384, y: 72, w: 144, name: 'The script', sub: 'demo.json, gated', cls: 'strong', on: true })}
${node({ x: 560, y: 72, w: 144, name: 'Two takes', sub: 'same last screen', cls: 'strong', on: true })}
${node({ x: 736, y: 72, w: 144, name: 'Post', sub: 'trim, ramp, export' })}
${node({ x: 32, y: 200, w: 144, name: 'stageshow', sub: 'a picture of it', cls: 'quiet' })}
${node({ x: 384, y: 200, w: 144, name: 'khe-ui', sub: 'fix it in the app', cls: 'quiet' })}
${node({ x: 560, y: 200, w: 144, name: 'khe-sound', sub: 'after the lock', cls: 'quiet' })}
${node({ x: 736, y: 200, w: 144, name: 'khe-launch-film', sub: 'cuts and titles', cls: 'quiet' })}
  </g>
  <text class="callout" x="32" y="288">demo-check gates the script and the files; the handover says what nobody watched.</text>`))
}

// khe-content-engine: setup once, then one idea becomes a draft per platform.
{
  const id = 'khe-content-engine-flow'
  write('skills/khe-content-engine/assets/flow.svg', svg(id, 896, 472, 'How khe-content-engine runs', 'Posts you wrote become an engine of linked nodes; one idea runs through it into a draft per platform, a review sends a wrong line to the node that caused it, and a person posts.', `  <g class="edges">
${edge('M176 228 H208', id)}
${edge('M352 228 H384', id)}
${edge('M528 228 H560', id)}
${edge('M704 228 H736', id)}
${edge('M432 128 V200', id)}
${edge('M600 128 V156 Q600 164 592 164 H488 Q480 164 480 172 V200', id)}
${edge('M632 256 V328', id)}
${edge('M560 356 H288 Q280 356 280 348 V256', id, 'dashed')}
  </g>
  <g class="labels">
${label(512, 142, 'the rest')}
${label(640, 285, 'a wrong line')}
  </g>
  <text class="caps" x="32" y="48">SET UP ONCE, THEN ONE IDEA BECOMES A DRAFT PER PLATFORM</text>
  <g class="nodes">
${node({ x: 384, y: 72, w: 144, name: 'khe-brain-harshit', sub: 'his posted views', cls: 'quiet' })}
${node({ x: 560, y: 72, w: 144, name: 'khe-package', sub: 'the first line', cls: 'quiet' })}
${node({ x: 32, y: 200, w: 144, name: 'Your writing', sub: 'posts you wrote' })}
${node({ x: 208, y: 200, w: 144, name: 'The engine', sub: 'small linked nodes', cls: 'strong', on: true })}
${node({ x: 384, y: 200, w: 144, name: 'The run', sub: 'a draft per platform', cls: 'strong', on: true })}
${node({ x: 560, y: 200, w: 144, name: 'Review', sub: 'against the engine' })}
${node({ x: 736, y: 200, w: 144, name: 'A person posts', sub: 'never the skill' })}
${node({ x: 560, y: 328, w: 144, name: 'Tune the node', sub: 'dated, then rerun' })}
  </g>
  <text class="callout" x="32" y="416">Pictures go elsewhere: the product to khe-demo, a film to khe-launch-film, stickers to khe-sticker.</text>
  <g class="legend" transform="translate(32 448)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">next step</text>
    <path class="edge dashed" d="M96 0 H120"/>
    <text x="128" y="4">back to the node that caused it</text>
  </g>`))
}

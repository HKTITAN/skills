// "How it runs" figures for the seven brain READMEs, in khe's skin (khe-figure.mjs).
// One shared layout; every figure carries its own brain's corpus, citation, gap check and neighbours.
import { svg, node, edge, label, write } from './khe-figure.mjs'

const brains = [
  {
    skill: 'khe-brain-emil', who: 'Emil Kowalski',
    mode: 'question, test, who said',
    themes: '10 theme files', corpus: '13 articles, 6 quotes',
    gap: 'disagreements, silent',
    cite: '[n] and Source: [n]',
    last: 'Not in his writing:', lastSub: 'what no article covers',
    inLabel: 'reported', sib: 'emil-design-eng', sibSub: 'his own skill', sibLabel: 'applied',
    out: 'khe-ui', outSub: 'builds and reviews', outLabel: 'to change it',
    callout: 'Corpus: 13 articles and one index page on emilkowal.ski. A quotation must be one of the six in quotes.md.',
  },
  {
    skill: 'khe-brain-benji', who: 'Benji Taylor',
    mode: 'question, test, who said',
    themes: '8 theme files', corpus: '28 pieces, with dates',
    gap: 'silent, disagreements',
    cite: '(Title), then Source:',
    last: 'Not in his writing:', lastSub: 'and what was not read',
    inLabel: 'reported', sib: 'stageshow', sibSub: 'his own skill', sibLabel: 'built',
    out: 'khe-ui', outSub: 'builds and reviews', outLabel: 'fix the screen',
    callout: 'Corpus: 28 pieces from benji.org and his public skills. When a piece and this skill disagree, the piece is right.',
  },
  {
    skill: 'khe-brain-varun', who: 'Varun Mayya',
    mode: 'question, test, who said',
    themes: '12 theme files', corpus: '1,461 claims, 19 videos',
    gap: 'silent, disagreements',
    cite: '(Title at m:ss)',
    last: 'Not in his videos:', lastSub: 'what no video answers',
    inLabel: 'named', sib: 'khe-brain-yc', sibSub: 'or khe-brain-isb', sibLabel: 'not named',
    out: 'khe-content-engine', outSub: 'writes the post', outLabel: 'to write it',
    callout: 'Corpus: 16 talks and 3 podcasts, 18 h 10 min, read from automatic captions by 2026-11-21.',
  },
  {
    skill: 'khe-brain-enrico', who: 'Enrico Tartarotti',
    mode: 'question, test, who said',
    themes: '12 theme files', corpus: '1,435 claims, 88 videos',
    gap: 'silent, disagreements',
    cite: '(Title at m:ss), year',
    last: 'Not in his videos:', lastSub: 'what no video answers',
    inLabel: 'products', sib: 'khe-brain-emil', sibSub: 'or khe-brain-benji', sibLabel: 'how to build',
    out: 'khe-ui', outSub: 'builds and reviews', outLabel: 'with numbers',
    callout: 'Corpus: 88 long videos, 17 h 57 min, read in full on 2026-11-15, each claim checked against its caption.',
  },
  {
    skill: 'khe-brain-isb', who: 'the isb-skills notes',
    mode: 'question, test, who said',
    themes: '12 theme files', corpus: '467 notes, 153 sessions',
    gap: 'ivi before silence',
    cite: '(Title), the file',
    last: 'Not in the notes:', lastSub: 'no source for figures',
    inLabel: 'a model', sib: 'khe-brain-yc', sibSub: 'or khe-brain-varun', sibLabel: 'a startup',
    out: 'isb-skills', outSub: 'nine skills, apply it', outLabel: 'to apply it',
    callout: 'Corpus: 620 pieces. isb-skills at commit 060ee06, 457 rule files, nine routers and the README; 153 ivi notes.',
  },
  {
    skill: 'khe-brain-yc', who: 'Y Combinator',
    mode: 'question, test, who said',
    themes: '12 theme files', corpus: '88 pieces, by speaker',
    gap: 'silent, disagreements',
    cite: 'the person, (Title)',
    last: 'Not in the corpus:', lastSub: 'silence in pieces read',
    inLabel: 'startup', sib: 'khe-brain-varun', sibSub: 'or khe-brain-isb', sibLabel: 'Indian case',
    out: 'khe-content-engine', outSub: 'keeps the Source: lines', outLabel: 'to publish',
    callout: 'Corpus: 14 Paul Graham essays, 28 posts and 46 talks from the YC Startup Library. Never "YC says".',
  },
  {
    skill: 'khe-brain-harshit', who: 'Harshit Khemani',
    mode: 'answer, test, draft',
    themes: 'Theme files', corpus: '666 posts cited',
    gap: 'silent, changes of mind',
    cite: '(post), Rests on:', reply: 'Answer or draft',
    last: 'Not in his posts:', lastSub: 'what no post carries',
    inLabel: 'one post', sib: 'khe-content-engine', sibSub: 'several platforms', sibLabel: 'many platforms',
    out: 'Harshit posts it', outSub: 'never published here', outLabel: 'a draft',
    callout: 'Corpus: his X and LinkedIn exports of 13 November 2026, 7,853 items from December 2020. DMs never opened.',
  },
]

for (const b of brains) {
  const id = `${b.skill}-flow`
  const title = `How ${b.skill} runs`
  const desc = `A question routed here is answered only from ${b.who}'s corpus, checked for silence and disagreement, cited, ended with what is not covered, and gated; other jobs go to the neighbouring skills.`
  write(`skills/${b.skill}/assets/flow.svg`, svg(id, 896, 436, title, desc, `  <g class="edges">
${edge('M192 100 H248', id)}
${edge('M408 100 H464', id)}
${edge('M624 100 H680', id)}
${edge('M760 128 V200', id)}
${edge('M680 228 H624', id)}
${edge('M464 228 H408', id)}
${edge('M112 128 V200', id, 'dashed')}
${edge('M760 256 V328', id, 'dashed')}
  </g>
  <g class="labels">
${label(194, 78, b.inLabel)}
${label(768, 157, 'lines, or none')}
${label(120, 157, b.sibLabel)}
${label(768, 285, b.outLabel)}
  </g>
  <text class="caps" x="32" y="48">ROUTED IN, ANSWERED FROM THE CORPUS, GATED, HANDED ON</text>
  <g class="nodes">
${node({ x: 32, y: 72, w: 160, name: 'khe-auto', sub: 'routes the request', cls: 'quiet' })}
${node({ x: 248, y: 72, w: 160, name: 'The question', sub: b.mode, cls: 'strong' })}
${node({ x: 464, y: 72, w: 160, name: b.themes, sub: b.corpus, on: true })}
${node({ x: 680, y: 72, w: 160, name: 'Gap check', sub: b.gap })}
${node({ x: 680, y: 200, w: 160, name: b.reply || 'Cited reply', sub: b.cite, cls: 'strong', on: true })}
${node({ x: 464, y: 200, w: 160, name: b.last, sub: b.lastSub })}
${node({ x: 248, y: 200, w: 160, name: 'brain-check', sub: '--gate until passed' })}
${node({ x: 32, y: 200, w: 160, name: b.sib, sub: b.sibSub, cls: 'quiet' })}
${node({ x: 680, y: 328, w: 160, name: b.out, sub: b.outSub, cls: 'quiet' })}
  </g>
  <text class="callout" x="32" y="360">${b.callout.replace(/"/g, '&quot;')}</text>
  <g class="legend" transform="translate(32 412)">
    <line class="rule" x1="0" y1="-16" x2="832" y2="-16"/>
    <path class="edge" d="M0 0 H24"/>
    <text x="32" y="4">next step</text>
    <path class="edge dashed" d="M96 0 H120"/>
    <text x="128" y="4">the job leaves this skill</text>
  </g>`))
}

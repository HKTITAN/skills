#!/usr/bin/env node
// gate-all: proves every gate in the collection against its own fixtures.
//
// It looks beside this skill for the khe skills (../khe-*/scripts/*-check.mjs),
// runs each gate's --self-test, and prints one line per skill:
//
//   khe-svg: ok (svg-check.mjs, self-test passed)
//   khe-sound: FAIL (sound-check.mjs, exit 1)
//   khe-diagram: no gate (expected scripts/diagram-check.mjs)
//   khe-ui: not installed
//
// A missing skill or a missing gate is reported, never treated as a failure
// and never as a pass.
//
//   node scripts/gate-all.mjs [--report out.json] [--timeout seconds] [--help]
//
// Exit 0: every one of the seven gates ran and passed its self-test.
// Exit 1: at least one self-test failed.
// Exit 2: nothing failed, and at least one gate could not be run.
//
// Zero dependencies. Node 20 or newer.

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GATES } from './route-check.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const COLLECTION = join(HERE, '..', '..')

const HELP = `gate-all: run every gate's --self-test, one line per skill

Usage:
  node scripts/gate-all.mjs [--report out.json] [--timeout seconds] [--help]

Looks beside this skill for ../khe-*/scripts/*-check.mjs and runs each with --self-test.

Per skill it prints one of:
  ok             the self-test exited 0
  FAIL           the self-test exited non-zero, timed out or could not start
  no gate        the skill is installed and ships no *-check.mjs
  not installed  the skill's folder is not beside this one

Exit 0 only when all ${Object.keys(GATES).length} gates ran and passed. Exit 1 on any FAIL. Exit 2 (inconclusive)
when nothing failed and at least one gate did not run.

Not checked: anything a self-test does not cover. A gate that passes its own
fixtures has proven its lines, not your work.

passing is necessary, not sufficient`

function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) { console.log(HELP); return 0 }
  const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null }
  const reportPath = arg('--report')
  const timeout = (Number(arg('--timeout')) || 120) * 1000

  // The seven expected skills, plus any other khe skill found beside this one.
  const names = new Set(Object.keys(GATES))
  let siblings = []
  try {
    siblings = readdirSync(COLLECTION).filter((d) => d.startsWith('khe-') && statSync(join(COLLECTION, d)).isDirectory())
  } catch { /* the collection folder cannot be listed; every skill reads as not installed */ }
  for (const d of siblings) names.add(d)

  const results = []
  for (const name of [...names].sort()) {
    const dir = join(COLLECTION, name)
    const expected = GATES[name] ? GATES[name].split('/').slice(1).join('/') : null
    if (!existsSync(dir)) { results.push({ skill: name, status: 'not installed', gate: null, detail: '' }); continue }

    const scripts = join(dir, 'scripts')
    let found = []
    try { found = existsSync(scripts) ? readdirSync(scripts).filter((f) => f.endsWith('-check.mjs')).sort() : [] } catch { found = [] }
    if (expected && !found.includes(expected.split('/')[1])) {
      results.push({ skill: name, status: 'no gate', gate: null, detail: `expected ${expected}` })
      continue
    }
    if (!found.length) { results.push({ skill: name, status: 'no gate', gate: null, detail: 'no scripts/*-check.mjs' }); continue }

    for (const file of found) {
      let run
      try {
        run = spawnSync(process.execPath, [join(scripts, file), '--self-test'], { encoding: 'utf8', timeout, cwd: dir })
      } catch (e) {
        results.push({ skill: name, status: 'FAIL', gate: file, detail: `could not start: ${e.message}` })
        continue
      }
      const last = `${run.stdout || ''}\n${run.stderr || ''}`.split('\n').map((l) => l.trim()).filter(Boolean)
      const lastLine = (run.status === 0 ? (run.stdout || '').trim().split('\n').pop() : last.pop()) || ''
      if (run.error) results.push({ skill: name, status: 'FAIL', gate: file, detail: run.error.code === 'ETIMEDOUT' ? `no result in ${timeout / 1000}s` : run.error.message })
      else if (run.status === 0) results.push({ skill: name, status: 'ok', gate: file, detail: lastLine.trim() })
      else results.push({ skill: name, status: 'FAIL', gate: file, detail: `exit ${run.status}${lastLine ? `: ${lastLine}` : ''}` })
    }
  }

  for (const r of results) {
    const inner = [r.gate, r.detail].filter(Boolean).join(', ')
    console.log(`${r.skill}: ${r.status}${inner ? ` (${inner})` : ''}`)
  }
  const count = (s) => results.filter((r) => r.status === s).length
  const total = Object.keys(GATES).length
  const ran = new Set(results.filter((r) => r.gate && GATES[r.skill]).map((r) => r.skill)).size
  console.log('')
  console.log(`${count('ok')} ok, ${count('FAIL')} failed, ${count('no gate')} no gate, ${count('not installed')} not installed`)
  console.log('passing is necessary, not sufficient')

  const status = count('FAIL') ? 'failed' : ran < total ? 'inconclusive' : 'passed'
  const exitCode = status === 'failed' ? 1 : status === 'inconclusive' ? 2 : 0
  if (reportPath) writeFileSync(reportPath, JSON.stringify({ status, exitCode, results }, null, 2) + '\n')
  if (status === 'passed') console.log('all gates passed')
  else if (status === 'failed') console.log(`gates failed: ${count('FAIL')} of ${ran} that ran`)
  else console.log(`inconclusive: ${ran} of ${total} gates ran`)
  return exitCode
}

process.exitCode = main(process.argv.slice(2))

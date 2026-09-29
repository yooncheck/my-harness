// Fixture tests for the judge scripts (harness/07-verification.md).
// Each case writes a run to a temp dir, runs one gate, and checks the exit code and the exact set of violated rules.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { makeRun, find, frameOf, solid, node, text } from './fixtures/base.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ALL3 = ['수행', '홈', '결산'];

function write(run, { withApproval } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tofocus-'));
  const put = (rel, data) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  };
  put('state.json', run.state);
  put('s1/research.md', run.research);
  for (const [s, v] of Object.entries(run.s2)) { put(`s2/${s}/spec.md`, v.spec); put(`s2/${s}/copy.json`, v.copy); }
  put('s3/keyscreen.json', run.keyscreen);
  put('evidence/s3.json', run.evidence);
  put('evidence/s4.json', run.evidence);
  if (withApproval) put('s3/approval.json', withApproval);
  return dir;
}

function gate(g, dir) {
  const r = spawnSync(process.execPath, [path.join(HERE, `${g}.mjs`), dir], { encoding: 'utf8' });
  const out = JSON.parse(fs.readFileSync(path.join(dir, 'gates', `${g}.json`), 'utf8'));
  return { code: r.status, rules: [...new Set(out.violations.map(v => v.rule))].sort(), out };
}

const cases = [];
const t = (name, g, { screens = ALL3, mutate = () => {}, approval, code, rules = [] }) => cases.push({ name, g, screens, mutate, approval, code, rules });

// ---- pass cases ----
t('G1 pass', 'g1', { code: 0 });
t('G2 pass (spec prose mentions 실패 — must not trip)', 'g2', { code: 0 });
t('G5 pass (full-bleed video/ + bleeding orb/)', 'g5', { code: 0 });
t('G5 pass 목표 설정', 'g5', { screens: ['목표 설정'], code: 0 });
t('G3 awaiting approval', 'g3', { code: 3 });
t('G3 approved', 'g3', { approval: { approved: true, by: 'designer', at: 'now' }, code: 0 });
t('G3 rejected', 'g3', { approval: { approved: false, by: 'designer', reason: '톤이 무거워요' }, code: 4 });

// ---- G1 / G2 failures ----
t('G1 only 2 refs', 'g1', { mutate: r => { r.research = r.research.replace('- R3: https://uibowl.io/screens/3 — 예시\n', ''); }, code: 1, rules: ['s1-refs'] });
t('G1 non-uibowl ref', 'g1', { mutate: r => { r.research = r.research.replaceAll('https://uibowl.io/screens/1', 'https://dribbble.com/1'); }, code: 1, rules: ['s1-cite', 's1-refs'] });
t('G2 banned word in copy', 'g2', { mutate: r => { r.s2['홈'].copy.push('3일 연속 실패'); }, code: 1, rules: ['svc-banned-words'] });
t('G2 focus words in 수행', 'g2', { mutate: r => { r.s2['수행'].copy.push('남은 할 일 2개'); }, code: 1, rules: ['svc-focus-words'] });

// ---- G5 single-rule violations ----
const g5 = (rule, mutate, opts = {}) => t(`G5 ${rule}`, 'g5', { mutate, code: 1, rules: opts.rules ?? [rule], screens: opts.screens });
g5('frame-size', r => { frameOf(r, '수행').nodes[0].height = 800; frameOf(r, '수행').height = 800; });
g5('default-name', r => { find(r, '수행', 'stopwatch').name = 'Text 3'; });
g5('font-family', r => { find(r, '수행', 'stopwatch').segments[0].fontFamily = 'Pretendard'; });
g5('cta-single', r => { const it = find(r, '수행', 'task-item'); frameOf(r, '수행').nodes.push(node('button-primary', 'FRAME', it.id, 24, 70, 80, 40, { fills: [solid('#292524')], cornerRadius: 9999 })); });
g5('color', r => { find(r, '수행', 'task-item').fills = [solid('#ff00ff')]; });
g5('orb', r => { find(r, '수행', 'content').fills = [{ type: 'GRADIENT_LINEAR', visible: true, stops: [] }]; });
g5('display-weight', r => { find(r, '수행', 'task-title').segments[0].fontWeight = 400; }, { rules: ['display-weight', 'typography'] });
g5('typography', r => { find(r, '수행', 'stopwatch').segments[0].fontSize = 17; });
g5('pill', r => { find(r, '홈', 'button-outline').cornerRadius = 12; });
g5('radius', r => { find(r, '수행', 'task-item').cornerRadius = 10; });
g5('shadow', r => { find(r, '수행', 'task-item').effects[0].radius = 24; });
g5('divider', r => { const f = frameOf(r, '수행'); f.nodes.push(node('rule-line', 'RECTANGLE', f.id, 16, 500, 358, 1, { fills: [solid('#e7e5e4')] })); });
g5('spacing', r => { find(r, '수행', 'content').autoLayout.itemSpacing = 18; });
g5('side-padding', r => { find(r, '수행', 'content').x = 20; });
g5('overflow', r => { find(r, '수행', 'task-item').width = 380; });
g5('touch', r => { find(r, '홈', 'button-outline').height = 36; });
g5('video-ratio', r => { find(r, '결산', 'video/recap').height = 600; });
g5('svc-focus-task', r => { const c = find(r, '수행', 'content'); frameOf(r, '수행').nodes.push(node('task-item', 'FRAME', c.id, 0, 300, 358, 60, { fills: [solid('#ffffff')], cornerRadius: 16 })); });
g5('svc-focus-words', r => { const n = find(r, '수행', 'stopwatch'); n.characters = n.segments[0].text = '남은 할 일 2개'; });
g5('svc-home-start', r => { const n = frameOf(r, '홈').nodes.find(x => x.characters === '시작'); n.characters = n.segments[0].text = '열기'; });
g5('svc-banned-words', r => { const n = find(r, '홈', 'task-name'); n.characters = n.segments[0].text = '3일 연속 실패'; });
g5('svc-banned-colors', r => { find(r, '수행', 'task-item').fills = [solid('#dc2626')]; });
g5('svc-goal-hint', r => { find(r, '목표 설정', 'hint/present-tense').name = 'hint/example'; }, { screens: ['목표 설정'] });
g5('svc-recap-goal', r => { find(r, '결산', 'goal-sentence').y = 800; });

// ---- integrity / bypass ----
t('G5 integrity: undeclared frame on page', 'g5', { mutate: r => { r.evidence.frames.push({ id: '9:999', name: 'extra', width: 390, height: 844, nodes: [node('extra', 'FRAME', null, 0, 0, 390, 844)] }); }, code: 1, rules: ['integrity'] });
t('G5 integrity: declared frame missing', 'g5', { mutate: r => { r.evidence.frames = r.evidence.frames.filter(f => f.name !== '결산'); }, code: 1, rules: ['integrity'] });
t('G5 bypass: unnamed button', 'g5', { mutate: r => { find(r, '홈', 'button-outline').name = 'Frame 12'; }, code: 1, rules: ['default-name', 'svc-home-start'] });

// ---- G3 precheck ----
t('G3 precheck: #dc2626 blocks approval request', 'g3', { mutate: r => { find(r, '수행', 'task-item').fills = [solid('#dc2626')]; }, code: 1, rules: ['svc-banned-colors'] });
t('G3 precheck: typography is G5-only', 'g3', { mutate: r => { find(r, '수행', 'stopwatch').segments[0].fontSize = 17; }, code: 3 });
t('G3 keyscreen count mismatch', 'g3', { mutate: r => { r.state.screens = ['수행', '홈']; }, code: 1, rules: ['keyscreen-count'] });

// ---- run ----
let failed = 0;
for (const c of cases) {
  const run = makeRun(c.screens);
  c.mutate(run);
  const dir = write(run, { withApproval: c.approval });
  const { code, rules, out } = gate(c.g, dir);
  const ok = code === c.code && JSON.stringify(rules) === JSON.stringify([...c.rules].sort());
  if (!ok) {
    failed++;
    console.log(`FAIL ${c.name}: exit ${code} (want ${c.code}), rules [${rules}] (want [${c.rules}])`);
    for (const v of out.violations) console.log(`     ${v.rule} ${v.screen ?? ''} ${v.detail ?? ''}`);
  } else console.log(`ok   ${c.name}`);
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);

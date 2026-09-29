// G1 — reflection points (harness/04-gates.md). Reads runs/<id>/s1/research.md.
// Expected format per screen:
//   ## <screen>
//   ### 레퍼런스
//   - R1: https://uibowl.io/... — note
//   ### 반영 포인트
//   - P1: text [R1, R2]
import fs from 'node:fs';
import path from 'node:path';
import { runGate } from './lib.mjs';

runGate('g1', ({ runDir, state, design }) => {
  const rules = design.gates.s1;
  const md = fs.readFileSync(path.join(runDir, 's1', 'research.md'), 'utf8');
  const sections = new Map();
  let cur = null;
  let sub = null;
  for (const line of md.split('\n')) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h2 && !line.startsWith('###')) { cur = { refs: new Map(), points: [] }; sections.set(h2[1], cur); sub = null; continue; }
    if (h3) { sub = h3[1].includes('레퍼런스') ? 'refs' : h3[1].includes('반영') ? 'points' : null; continue; }
    if (!cur || !sub) continue;
    const ref = line.match(/^-\s*(R\d+):\s*(\S+)/);
    if (sub === 'refs' && ref) cur.refs.set(ref[1], ref[2]);
    const pt = line.match(/^-\s*(P\d+):.*?\[([^\]]*)\]\s*$/);
    if (sub === 'points' && line.match(/^-\s*P\d+:/)) cur.points.push({ id: line.match(/^-\s*(P\d+)/)[1], cites: pt ? pt[2].split(/[,\s]+/).filter(Boolean) : [] });
  }
  const violations = [];
  for (const screen of state.screens) {
    const s = sections.get(screen);
    if (!s) { violations.push({ rule: 's1-section', screen, detail: 'missing section' }); continue; }
    const good = [...s.refs.entries()].filter(([, url]) => { try { return new URL(url).hostname.endsWith(rules['ref-url-domain']); } catch { return false; } });
    if (good.length < rules['min-refs-per-screen']) violations.push({ rule: 's1-refs', screen, detail: `${good.length} ${rules['ref-url-domain']} refs < ${rules['min-refs-per-screen']}` });
    if (s.points.length < rules['min-points-per-screen']) violations.push({ rule: 's1-points', screen, detail: `${s.points.length} points < ${rules['min-points-per-screen']}` });
    const valid = new Set(good.map(([id]) => id));
    for (const p of s.points) {
      const cited = p.cites.filter(c => valid.has(c));
      if (cited.length < rules['min-refs-cited-per-point']) violations.push({ rule: 's1-cite', screen, detail: `${p.id} cites no valid reference` });
    }
  }
  return { pass: violations.length === 0, violations };
});

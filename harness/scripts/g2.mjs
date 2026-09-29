// G2 — on-screen copy (harness/04-gates.md). Checks only runs/<id>/s2/<screen>/copy.json, not spec prose.
import fs from 'node:fs';
import path from 'node:path';
import { runGate } from './lib.mjs';

runGate('g2', ({ runDir, state, design }) => {
  const svc = design.gates.service;
  const violations = [];
  for (const screen of state.screens) {
    const dir = path.join(runDir, 's2', screen);
    if (!fs.existsSync(path.join(dir, 'spec.md'))) violations.push({ rule: 's2-files', screen, detail: 'spec.md missing' });
    const copyPath = path.join(dir, 'copy.json');
    if (!fs.existsSync(copyPath)) { violations.push({ rule: 's2-files', screen, detail: 'copy.json missing' }); continue; }
    const copy = JSON.parse(fs.readFileSync(copyPath, 'utf8'));
    if (!Array.isArray(copy) || !copy.every(s => typeof s === 'string')) { violations.push({ rule: 's2-files', screen, detail: 'copy.json must be an array of strings' }); continue; }
    for (const line of copy) {
      for (const w of svc['banned-words']) if (line.includes(w)) violations.push({ rule: 'svc-banned-words', screen, detail: `"${line}" contains "${w}"` });
      if (screen === svc['focus-frame']) {
        for (const p of svc['focus-banned-patterns']) if (new RegExp(p).test(line)) violations.push({ rule: 'svc-focus-words', screen, detail: `"${line}" matches /${p}/` });
      }
    }
  }
  return { pass: violations.length === 0, violations };
});

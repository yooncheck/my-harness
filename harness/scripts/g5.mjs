// G5 — design guide review (harness/04-gates.md). Runs every rule on evidence/s4.json.
import path from 'node:path';
import { runGate, readJson, indexEvidence, checkIntegrity, runRules, RULE_IDS } from './lib.mjs';

runGate('g5', ({ runDir, state, design }) => {
  const keyscreen = readJson(path.join(runDir, 's3', 'keyscreen.json'));
  const evidence = readJson(path.join(runDir, 'evidence', 's4.json'));
  const violations = checkIntegrity(evidence, keyscreen);
  if (violations.length === 0) violations.push(...runRules(indexEvidence(evidence), design, RULE_IDS, state.screens));
  return { pass: violations.length === 0, violations };
});

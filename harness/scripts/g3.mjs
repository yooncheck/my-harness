// G3 — keyscreen approval (harness/04-gates.md).
// Step 1 (script): integrity + frame count/size + gates.s3.precheck-rules on evidence/s3.json.
// Step 2 (human): s3/approval.json.
// Exit: 0 approved, 1 precheck failed, 3 awaiting approval, 4 rejected, 2 input error.
import fs from 'node:fs';
import path from 'node:path';
import { runGate, readJson, indexEvidence, checkIntegrity, runRules, EXIT } from './lib.mjs';

runGate('g3', ({ runDir, state, design }) => {
  const s3 = design.gates.s3;
  const keyscreen = readJson(path.join(runDir, 's3', 'keyscreen.json'));
  const evidence = readJson(path.join(runDir, 'evidence', 's3.json'));
  const violations = checkIntegrity(evidence, keyscreen);
  const declared = Object.keys(keyscreen.screens ?? {});
  if (declared.length !== state.screens.length || !state.screens.every(s => declared.includes(s))) {
    violations.push({ rule: 'keyscreen-count', detail: `keyscreens [${declared}] != input [${state.screens}]` });
  }
  if (violations.length === 0) {
    violations.push(...runRules(indexEvidence(evidence), design, ['frame-size', ...s3['precheck-rules']], state.screens));
  }
  if (violations.length) return { pass: false, stage: 'precheck', violations, exit: EXIT.FAIL };

  const approvalPath = path.join(runDir, 's3', 'approval.json');
  if (!fs.existsSync(approvalPath)) return { pass: false, stage: 'awaiting-approval', violations, exit: EXIT.AWAIT_APPROVAL };
  const a = readJson(approvalPath);
  if (a.approved === s3.approval.approved && typeof a.by === 'string' && a.by.trim()) return { pass: true, stage: 'approved', approval: a, violations };
  if (a.approved === false) return { pass: false, stage: 'rejected', approval: a, violations, exit: EXIT.REJECTED };
  return { pass: false, stage: 'approval-invalid', violations: [{ rule: 'approval', detail: 'approval.json needs approved and non-empty by' }], exit: EXIT.FAIL };
});

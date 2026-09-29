// PreToolUse guard for the To focus harness (harness/06-orchestrator.md "강제 장치").
// Identifies subagents by `agent_type` (verified in harness/07-verification.md P2). Exit 2 = block.
import fs from 'node:fs';
import path from 'node:path';

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
const agent = input.agent_type ?? null; // null = main session (orchestrator)
const tool = input.tool_name;
const ti = input.tool_input ?? {};
const maintenance = fs.existsSync(path.join(root, '.claude', 'maintenance'));

const block = msg => {
  try {
    fs.mkdirSync(path.join(root, 'runs'), { recursive: true });
    fs.appendFileSync(path.join(root, 'runs', 'guard-log.jsonl'), JSON.stringify({ at: new Date().toISOString(), agent: agent ?? 'main', tool, msg }) + '\n');
  } catch {}
  console.error(`[harness guard] ${msg}. Do not retry with another path or command; report this as a failure.`);
  process.exit(2);
};

// Files nobody edits during a run. The main session may edit them only while .claude/maintenance exists.
const PROTECTED = /^(docs\/|CLAUDE\.md|harness\/|\.claude\/)/;
// The only folder each agent may write to.
const AGENT_WRITE = {
  researcher: /^runs\/[^/]+\/s1\/[^/]+$/,
  'spec-writer': /^runs\/[^/]+\/s2\/[^/]+\/[^/]+$/,
  'keyscreen-designer': /^runs\/[^/]+\/s3\/(?!approval\.json$)[^/]+$/,
  builder: /^runs\/[^/]+\/s4\/[^/]+\/[^/]+$/,
  extractor: /^runs\/[^/]+\/evidence\/(s3|s4)\.json$/,
  judge: null,
};
// Written only by scripts (gates) or extractor (evidence), never by the orchestrator directly.
const MAIN_FORBIDDEN = /^runs\/[^/]+\/(gates|evidence)\//;

if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(tool)) {
  const file = ti.file_path ?? ti.notebook_path;
  const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join('/');
  const outside = rel.startsWith('..');
  if (agent) {
    if (agent in AGENT_WRITE) {
      const re = AGENT_WRITE[agent];
      if (!re || outside || !re.test(rel)) block(`${agent} may not write ${rel}`);
    } else if (outside || PROTECTED.test(rel) || rel.startsWith('runs/')) {
      block(`subagent ${agent} may not write ${rel}`);
    }
  } else {
    if (PROTECTED.test(rel) && !maintenance) block(`${rel} is read-only during runs (maintenance mode is off)`);
    if (MAIN_FORBIDDEN.test(rel)) block(`orchestrator may not write ${rel}; gates are written by scripts, evidence by extractor`);
  }
}

if (tool === 'Bash' && agent) {
  const ok = agent === 'judge' && /^node harness\/scripts\/g[1235]\.mjs runs\/[A-Za-z0-9_-]+\s*$/.test(ti.command ?? '');
  if (!ok) block(`${agent} may not run: ${ti.command}`);
}

if (tool === 'mcp__claude_ai_Figma__use_figma' && agent === 'extractor') {
  const tpl = fs.readFileSync(path.join(root, 'harness', 'scripts', 'extract-figma.js'), 'utf8').trim();
  const [a, b] = tpl.split('__PAGE_NAME__');
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${esc(a)}run-[A-Za-z0-9_-]+${esc(b)}$`);
  if (!re.test((ti.code ?? '').trim())) block('extractor may only run harness/scripts/extract-figma.js with __PAGE_NAME__ replaced');
}

process.exit(0);

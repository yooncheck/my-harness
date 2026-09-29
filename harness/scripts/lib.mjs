// Shared helpers for the To focus judge scripts.
// Rule values come only from design.md frontmatter (SSOT). See harness/04-gates.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../..');

export const EXIT = { PASS: 0, FAIL: 1, INPUT: 2, AWAIT_APPROVAL: 3, REJECTED: 4 };

export function loadDesign(designPath = process.env.TOFOCUS_DESIGN ?? path.join(ROOT, 'docs', 'design.md')) {
  const text = fs.readFileSync(designPath, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`no frontmatter in ${designPath}`);
  return yaml.load(m[1]);
}

export function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Parses CLI args, runs the check, writes runs/<id>/gates/<gate>.json, exits with the gate's code.
export function runGate(gate, check) {
  const runDir = process.argv[2];
  if (!runDir) {
    console.error(`usage: node ${gate}.mjs runs/<id>`);
    process.exit(EXIT.INPUT);
  }
  let result;
  try {
    const state = readJson(path.join(runDir, 'state.json'));
    result = check({ runDir, state, design: loadDesign() });
  } catch (e) {
    result = { pass: false, exit: EXIT.INPUT, violations: [{ rule: 'input', detail: e.message }] };
  }
  const out = { gate, checked_at: new Date().toISOString(), ...result, count: result.violations.length };
  const exit = out.exit ?? (out.pass ? EXIT.PASS : EXIT.FAIL);
  delete out.exit;
  fs.mkdirSync(path.join(runDir, 'gates'), { recursive: true });
  fs.writeFileSync(path.join(runDir, 'gates', `${gate}.json`), JSON.stringify(out, null, 2) + '\n');
  console.log(`${gate}: ${out.pass ? 'PASS' : 'FAIL'} (${out.count} violations)`);
  for (const v of out.violations) console.log(`  - [${v.rule}] ${v.screen ?? ''} ${v.node_id ?? ''} ${v.detail ?? ''}`);
  process.exit(exit);
}

// ---------- normalization (harness/04-gates.md "값 정규화") ----------

const TOL = { ratio: 0.01, px: 0.01, size: 0.5 };
const near = (a, b, t) => Math.abs(a - b) <= t;
const byte = x => Math.round(x * 255);

export function toHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => byte(v).toString(16).padStart(2, '0')).join('');
}

function paintKey(p) {
  const op = Math.round((p.opacity ?? 1) * 100) / 100;
  if (op === 1) return toHex(p.color);
  return `rgba(${byte(p.color.r)},${byte(p.color.g)},${byte(p.color.b)},${op})`;
}

function lineHeightRatio(lh, fontSize) {
  if (!lh || lh.unit === 'AUTO') return null;
  return lh.unit === 'PERCENT' ? lh.value / 100 : lh.value / fontSize;
}

function letterSpacingPx(ls, fontSize) {
  if (!ls) return 0;
  return ls.unit === 'PERCENT' ? (ls.value / 100) * fontSize : ls.value;
}

const px = v => (typeof v === 'number' ? v : parseFloat(String(v)));

function parseShadow(s) {
  const m = s.match(/^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)(?:px)?\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  if (!m) throw new Error(`bad shadow in design.md: ${s}`);
  return { x: +m[1], y: +m[2], radius: +m[3], r: +m[4], g: +m[5], b: +m[6], a: +m[7] };
}

// ---------- evidence helpers ----------

// Returns {frames: [{id, name, width, height, nodes, byId, abs}]} with absolute positions relative to the frame.
export function indexEvidence(evidence) {
  return evidence.frames.map(f => {
    const byId = new Map(f.nodes.map(n => [n.id, n]));
    const abs = new Map();
    const absOf = n => {
      if (abs.has(n.id)) return abs.get(n.id);
      let v;
      if (n.parent_id === null) v = { x: 0, y: 0 };
      else {
        const p = byId.get(n.parent_id);
        const pa = absOf(p);
        v = { x: pa.x + n.x, y: pa.y + n.y };
      }
      abs.set(n.id, v);
      return v;
    };
    f.nodes.forEach(absOf);
    const ancestors = n => {
      const out = [];
      for (let p = byId.get(n.parent_id); p; p = byId.get(p.parent_id)) out.push(p);
      return out;
    };
    return { ...f, byId, abs, ancestors, root: f.nodes.find(n => n.parent_id === null) };
  });
}

// Checks that evidence frames are exactly the frames declared in s3/keyscreen.json.
export function checkIntegrity(evidence, keyscreen) {
  const declared = new Map(Object.entries(keyscreen.screens ?? {}).map(([screen, id]) => [id, screen]));
  const found = new Map(evidence.frames.map(f => [f.id, f.name]));
  const v = [];
  for (const [id, screen] of declared) {
    if (!found.has(id)) v.push({ rule: 'integrity', screen, node_id: id, detail: 'declared frame missing from evidence' });
    else if (found.get(id) !== screen) v.push({ rule: 'integrity', screen, node_id: id, detail: `frame name "${found.get(id)}" != "${screen}"` });
  }
  for (const [id, name] of found) {
    if (!declared.has(id)) v.push({ rule: 'integrity', screen: name, node_id: id, detail: 'frame on run page not declared in keyscreen.json' });
  }
  return v;
}

// ---------- rules ----------

export const RULE_IDS = [
  'frame-size', 'default-name', 'font-family', 'cta-single', 'color', 'orb', 'display-weight', 'typography',
  'pill', 'radius', 'shadow', 'divider', 'spacing', 'side-padding', 'overflow', 'touch', 'video-ratio',
  'svc-focus-task', 'svc-focus-words', 'svc-home-start', 'svc-banned-words', 'svc-banned-colors',
  'svc-goal-hint', 'svc-recap-goal',
];

export function runRules(frames, design, ruleIds, screens) {
  const g = design.gates;
  const s5 = g.s5;
  const svc = g.service;
  const tokenHexes = new Set(Object.values(design.colors).map(h => h.toLowerCase()));
  const extraColors = new Set((s5['extra-colors'] ?? []).map(c => c.replace(/\s+/g, '')));
  const radii = new Set(s5['radius-allowed']);
  const spacing = new Set(s5['spacing-allowed']);
  const shadows = s5['shadow-allowed'].map(parseShadow);
  const displayFonts = new Set(s5['display-fonts']);
  const allowedFonts = new Set(s5['fonts-allowed']);
  const exempt = s5['layout-exempt-prefixes'];
  const defaultName = new RegExp(s5['default-name-pattern']);
  const typo = Object.values(design.typography).map(t => ({
    family: t.fontFamily, size: px(t.fontSize), weight: t.fontWeight,
    lh: t.lineHeight, ls: t.letterSpacing === undefined ? 0 : px(t.letterSpacing),
  }));
  const frameW = g.s3.frame.width;
  const frameH = g.s3.frame.height;
  const has = new Set(ruleIds);
  const out = [];
  const add = (rule, f, n, detail) => out.push({ rule, screen: f.name, node_id: n?.id ?? f.id, detail });
  const isExempt = (f, n) => [n, ...f.ancestors(n)].some(a => exempt.some(p => a.name.startsWith(p)));
  const texts = f => f.nodes.filter(n => n.type === 'TEXT');
  const solidPaints = n => [...(n.fills ?? []), ...(n.strokes ?? [])].filter(p => p.type === 'SOLID' && p.visible !== false);
  const segPaints = n => (n.segments ?? []).flatMap(s => s.fills ?? []).filter(p => p.type === 'SOLID' && p.visible !== false);

  for (const f of frames) {
    const content = f.nodes.filter(n => n.parent_id !== null);
    const inScreen = name => f.name === name && screens.includes(name);

    if (has.has('frame-size') && (!near(f.width, frameW, TOL.size) || !near(f.height, frameH, TOL.size))) {
      add('frame-size', f, f.root, `${f.width}x${f.height} != ${frameW}x${frameH}`);
    }
    for (const n of content) {
      if (has.has('default-name') && defaultName.test(n.name)) add('default-name', f, n, `default layer name "${n.name}"`);

      if (has.has('cta-single')) { /* counted per frame below */ }

      if (has.has('color')) {
        for (const p of [...solidPaints(n), ...segPaints(n)]) {
          const key = paintKey(p);
          if (!tokenHexes.has(key) && !extraColors.has(key)) add('color', f, n, `color ${key} not a token`);
        }
      }
      if (has.has('orb') && !n.name.startsWith('orb/')) {
        if ((n.fills ?? []).some(p => p.type.startsWith('GRADIENT') && p.visible !== false)) add('orb', f, n, 'gradient fill outside orb/ node');
      }
      if (has.has('pill') && s5['pill-node-prefixes'].some(p => n.name.startsWith(p))) {
        if (n.cornerRadius !== s5['pill-radius']) add('pill', f, n, `radius ${JSON.stringify(n.cornerRadius)} != ${s5['pill-radius']}`);
      }
      if (has.has('radius') && n.cornerRadius !== undefined) {
        const vals = Array.isArray(n.cornerRadius) ? n.cornerRadius : [n.cornerRadius];
        for (const r of vals) if (!radii.has(r)) add('radius', f, n, `radius ${r} not allowed`);
      }
      if (has.has('shadow')) {
        for (const e of (n.effects ?? []).filter(e => e.visible !== false && /SHADOW/.test(e.type))) {
          const ok = e.type === 'DROP_SHADOW' && (e.spread ?? 0) === 0 && shadows.some(s =>
            near(e.offset.x, s.x, TOL.px) && near(e.offset.y, s.y, TOL.px) && near(e.radius, s.radius, TOL.px) &&
            byte(e.color.r) === s.r && byte(e.color.g) === s.g && byte(e.color.b) === s.b && near(e.color.a, s.a, 0.005));
          if (!ok) add('shadow', f, n, `shadow ${e.type} ${e.offset?.x} ${e.offset?.y} ${e.radius} not allowed`);
        }
      }
      if (has.has('divider') && n.type !== 'TEXT' && n.height <= s5.divider['max-height'] &&
          n.width >= f.width * s5.divider['min-width-ratio'] &&
          ![n, ...f.ancestors(n)].some(a => s5.divider['except-inside'].includes(a.name))) {
        add('divider', f, n, `divider ${n.width}x${n.height}`);
      }
      if (has.has('spacing') && n.autoLayout) {
        const a = n.autoLayout;
        for (const k of ['itemSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
          if (!spacing.has(a[k])) add('spacing', f, n, `${k} ${a[k]} not allowed`);
        }
      }
      if (has.has('side-padding') && n.parent_id === f.id && !isExempt(f, n)) {
        if (!near(n.x, s5['side-padding'], TOL.size)) add('side-padding', f, n, `x ${n.x} != ${s5['side-padding']}`);
      }
      if (has.has('overflow') && !isExempt(f, n)) {
        const a = f.abs.get(n.id);
        if (a.x < -TOL.size || a.x + n.width > f.width + TOL.size) add('overflow', f, n, `spans x ${a.x}..${a.x + n.width}`);
      }
      if (has.has('touch') && s5['touch-node-prefixes'].some(p => n.name.startsWith(p)) && !s5['touch-exempt'].includes(n.name)) {
        if (n.width < s5['touch-min'] - TOL.size || n.height < s5['touch-min'] - TOL.size) add('touch', f, n, `${n.width}x${n.height} < ${s5['touch-min']}`);
      }
      if (has.has('video-ratio') && n.name.startsWith(s5['video-node-prefix'])) {
        const [rw, rh] = s5['video-ratio'];
        if (Math.abs(n.height - (n.width * rh) / rw) > s5['video-ratio-tolerance-px']) add('video-ratio', f, n, `${n.width}x${n.height} not ${rw}:${rh}`);
      }
      if (has.has('svc-banned-colors')) {
        for (const p of [...solidPaints(n), ...segPaints(n)]) {
          if (svc['banned-colors'].includes(toHex(p.color))) add('svc-banned-colors', f, n, `uses ${toHex(p.color)}`);
        }
      }
    }

    for (const n of texts(f)) {
      for (const s of n.segments ?? []) {
        if (has.has('font-family') && !allowedFonts.has(s.fontFamily)) add('font-family', f, n, `font ${s.fontFamily}`);
        const isDisplay = displayFonts.has(s.fontFamily);
        if (has.has('display-weight') && isDisplay && s.fontWeight !== s5['display-weight']) add('display-weight', f, n, `display weight ${s.fontWeight}`);
        if (has.has('typography')) {
          const lh = lineHeightRatio(s.lineHeight, s.fontSize);
          const ls = letterSpacingPx(s.letterSpacing, s.fontSize);
          const cls = isDisplay ? 'display' : 'sans';
          const ok = lh !== null && typo.some(t => t.family === cls && near(t.size, s.fontSize, TOL.size) &&
            t.weight === s.fontWeight && near(t.lh, lh, TOL.ratio) && near(t.ls, ls, TOL.px));
          if (!ok) add('typography', f, n, `${cls} ${s.fontSize}/${s.fontWeight}/lh ${lh}/ls ${ls.toFixed(2)} matches no token`);
        }
      }
      if (has.has('svc-banned-words')) {
        for (const w of svc['banned-words']) if (n.characters.includes(w)) add('svc-banned-words', f, n, `text contains "${w}"`);
      }
    }

    if (has.has('cta-single')) {
      const ctas = content.filter(n => n.name === 'button-primary');
      if (ctas.length > s5['max-primary-per-frame']) add('cta-single', f, ctas[1], `${ctas.length} button-primary nodes`);
    }
    if (has.has('svc-focus-task') && inScreen(svc['focus-frame'])) {
      const count = content.filter(n => n.name === svc['focus-task-node']).length;
      if (count !== svc['focus-task-count']) add('svc-focus-task', f, f.root, `${count} ${svc['focus-task-node']} nodes`);
    }
    if (has.has('svc-focus-words') && inScreen(svc['focus-frame'])) {
      const pats = svc['focus-banned-patterns'].map(p => new RegExp(p));
      for (const n of texts(f)) for (const re of pats) if (re.test(n.characters)) add('svc-focus-words', f, n, `text matches /${re.source}/`);
    }
    if (has.has('svc-home-start') && inScreen(svc['home-frame'])) {
      const ok = content.some(b => b.name.startsWith('button-') && b.visible !== false &&
        content.some(t => t.type === 'TEXT' && t.visible !== false && t.characters.trim() === svc['home-start-label'] && f.ancestors(t).some(a => a.id === b.id)));
      if (!ok) add('svc-home-start', f, f.root, `no visible button with "${svc['home-start-label']}"`);
    }
    if (has.has('svc-goal-hint') && inScreen(svc['goal-hint'].frame)) {
      const count = content.filter(n => n.name === svc['goal-hint'].node).length;
      if (count < svc['goal-hint'].min) add('svc-goal-hint', f, f.root, `missing ${svc['goal-hint'].node}`);
    }
    if (has.has('svc-recap-goal') && inScreen(svc['recap-goal'].frame)) {
      const first = texts(f).filter(t => t.visible !== false).sort((a, b) => f.abs.get(a.id).y - f.abs.get(b.id).y)[0];
      const node = svc['recap-goal'].node;
      if (!first || ![first, ...f.ancestors(first)].some(a => a.name === node)) add('svc-recap-goal', f, first, `first text is "${first?.name}", not ${node}`);
    }
  }
  return out;
}

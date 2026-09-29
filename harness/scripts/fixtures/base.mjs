// Builds a passing run (state, keyscreen, evidence, s1, s2) for the given screens.
// Mutations in test.mjs break exactly one rule each. Values mirror design.md tokens.

const rgb = hex => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 });
const solid = (hex, opacity = 1) => ({ type: 'SOLID', color: rgb(hex), opacity, visible: true });
const SHADOW = { type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 4 }, radius: 16, spread: 0 };

let seq = 0;
const node = (name, type, parent_id, x, y, width, height, extra = {}) => ({
  id: `9:${++seq}`, name, type, parent_id, x, y, width, height, visible: true,
  fills: [], strokes: [], strokeWeight: 1, effects: [], ...(type === 'TEXT' ? {} : { cornerRadius: 0 }), ...extra,
});
const auto = (mode, itemSpacing, [t, r, b, l]) => ({ autoLayout: { mode, itemSpacing, paddingTop: t, paddingRight: r, paddingBottom: b, paddingLeft: l } });

// text styles matching design.md typography tokens
const STYLE = {
  'display-md': { fontFamily: 'Noto Serif KR', fontStyle: 'Light', fontWeight: 300, fontSize: 32, lineHeight: { unit: 'PERCENT', value: 113 }, letterSpacing: { unit: 'PIXELS', value: -0.32 } },
  'display-sm': { fontFamily: 'Noto Serif KR', fontStyle: 'Light', fontWeight: 300, fontSize: 24, lineHeight: { unit: 'PERCENT', value: 120 }, letterSpacing: { unit: 'PIXELS', value: 0 } },
  'body-md': { fontFamily: 'Inter', fontStyle: 'Regular', fontWeight: 400, fontSize: 16, lineHeight: { unit: 'PIXELS', value: 24 }, letterSpacing: { unit: 'PERCENT', value: 1 } },
  caption: { fontFamily: 'Inter', fontStyle: 'Regular', fontWeight: 400, fontSize: 14, lineHeight: { unit: 'PERCENT', value: 150 }, letterSpacing: { unit: 'PIXELS', value: 0 } },
  label: { fontFamily: 'Inter', fontStyle: 'Semi Bold', fontWeight: 600, fontSize: 12, lineHeight: { unit: 'PERCENT', value: 140 }, letterSpacing: { unit: 'PIXELS', value: 0.96 } },
  button: { fontFamily: 'Inter', fontStyle: 'Medium', fontWeight: 500, fontSize: 15, lineHeight: { unit: 'PERCENT', value: 100 }, letterSpacing: { unit: 'PERCENT', value: 0 } },
};
const text = (name, parent_id, x, y, w, h, characters, style, color) => node(name, 'TEXT', parent_id, x, y, w, h, {
  fills: [solid(color)], characters,
  segments: [{ text: characters, ...STYLE[style], fills: [solid(color)] }],
});

const BUILD = {
  수행(f) {
    const orb = node('orb/mint', 'ELLIPSE', f.id, 200, -60, 320, 320, { fills: [{ type: 'GRADIENT_RADIAL', visible: true, stops: [] }] });
    const content = node('content', 'FRAME', f.id, 16, 64, 358, 400, auto('VERTICAL', 24, [48, 0, 48, 0]));
    const title = text('task-title', content.id, 0, 48, 358, 36, '저녁 스트레칭 10분', 'display-md', '#0c0a09');
    const watch = text('stopwatch', content.id, 0, 108, 80, 24, '00:12:34', 'body-md', '#4e4e4e');
    const item = node('task-item', 'FRAME', content.id, 0, 156, 358, 100, { fills: [solid('#ffffff')], strokes: [solid('#e7e5e4')], cornerRadius: 16, effects: [SHADOW], ...auto('VERTICAL', 12, [24, 24, 24, 24]) });
    const cta = node('button-primary', 'FRAME', item.id, 24, 24, 80, 40, { fills: [solid('#292524')], cornerRadius: 9999, ...auto('HORIZONTAL', 0, [10, 20, 10, 20]) });
    const label = text('label', cta.id, 20, 12, 40, 16, '종료', 'button', '#ffffff');
    return [orb, content, title, watch, item, cta, label];
  },
  홈(f) {
    const content = node('content', 'FRAME', f.id, 16, 64, 358, 300, auto('VERTICAL', 16, [0, 0, 0, 0]));
    const goal = text('goal', content.id, 0, 0, 358, 29, '나는 53kg이고, 옷이 헐렁하게 맞는 느낌이 좋다', 'display-sm', '#0c0a09');
    const row = node('task-row', 'FRAME', content.id, 0, 45, 358, 68, { fills: [solid('#ffffff')], strokes: [solid('#e7e5e4')], cornerRadius: 16, ...auto('HORIZONTAL', 12, [12, 16, 12, 16]) });
    const name = text('task-name', row.id, 16, 22, 200, 24, '저녁 스트레칭 10분', 'body-md', '#0c0a09');
    const start = node('button-outline', 'FRAME', row.id, 262, 12, 80, 44, { strokes: [solid('#d6d3d1')], cornerRadius: 9999, ...auto('HORIZONTAL', 0, [12, 16, 12, 16]) });
    const label = text('label', start.id, 16, 12, 48, 16, '시작', 'button', '#0c0a09');
    return [content, goal, row, name, start, label];
  },
  결산(f) {
    const video = node('video/recap', 'RECTANGLE', f.id, 0, 0, 390, 693, { fills: [solid('#1c1917')] });
    const goal = text('goal-sentence', f.id, 16, 710, 358, 29, '나는 53kg이고, 옷이 헐렁하게 맞는 느낌이 좋다', 'display-sm', '#0c0a09');
    const badge = node('badge-overlay', 'FRAME', f.id, 16, 770, 96, 24, { fills: [solid('#737373', 0.56)], cornerRadius: 9999, ...auto('HORIZONTAL', 0, [4, 10, 4, 10]) });
    const label = text('label', badge.id, 12, 4, 72, 17, '10월 결산', 'label', '#ffffff');
    return [video, goal, badge, label];
  },
  '목표 설정'(f) {
    const content = node('content', 'FRAME', f.id, 16, 64, 358, 200, auto('VERTICAL', 12, [0, 0, 0, 0]));
    const hint = text('hint/present-tense', content.id, 0, 0, 358, 21, '그 목표를 이룬 나는 지금 어떤 모습인가요?', 'caption', '#777169');
    const input = node('goal-input', 'FRAME', content.id, 0, 33, 358, 44, { fills: [solid('#ffffff')], strokes: [solid('#d6d3d1')], cornerRadius: 8, ...auto('HORIZONTAL', 0, [0, 16, 0, 16]) });
    const ph = text('placeholder', input.id, 16, 10, 300, 24, '나는 지금…', 'body-md', '#a8a29e');
    return [content, hint, input, ph];
  },
};

export const COPY = {
  수행: ['저녁 스트레칭 10분', '00:12:34', '종료'],
  홈: ['나는 53kg이고, 옷이 헐렁하게 맞는 느낌이 좋다', '저녁 스트레칭 10분', '시작'],
  결산: ['나는 53kg이고, 옷이 헐렁하게 맞는 느낌이 좋다', '10월 결산'],
  '목표 설정': ['그 목표를 이룬 나는 지금 어떤 모습인가요?', '나는 지금…'],
};

export function makeRun(screens) {
  seq = 0;
  const frames = screens.map((name, i) => {
    const f = node(name, 'FRAME', null, 100 + i * 500, 100, 390, 844, { fills: [solid('#f5f5f5')] });
    return { id: f.id, name, width: 390, height: 844, nodes: [f, ...BUILD[name](f)] };
  });
  const evidence = { extracted_at: '2026-09-29T00:00:00Z', page_id: '9:0', page_name: 'run-fixture', frames };
  const research = screens.map(s => [
    `## ${s}`, '### 레퍼런스',
    '- R1: https://uibowl.io/screens/1 — 예시', '- R2: https://uibowl.io/screens/2 — 예시', '- R3: https://uibowl.io/screens/3 — 예시',
    '### 반영 포인트', '- P1: 큰 시작 버튼 [R1]', '- P2: 한 화면에 할 일 하나 [R2, R3]', '',
  ].join('\n')).join('\n');
  return structuredClone({
    state: { stage: 'S5', screens, retries: { S1: 0, S2: 0, S3: 0, S4: 0 }, figma_file_key: 'fixture' },
    keyscreen: { screens: Object.fromEntries(frames.map(f => [f.name, f.id])) },
    evidence,
    research,
    s2: Object.fromEntries(screens.map(s => [s, { spec: `# ${s}\n\n- 실패 표시 금지: 미완료는 조용히 넘겨요.\n`, copy: COPY[s] }])),
  });
}

export const find = (run, screen, name) => run.evidence.frames.find(f => f.name === screen).nodes.find(n => n.name === name);
export const frameOf = (run, screen) => run.evidence.frames.find(f => f.name === screen);
export { solid, node, text, SHADOW };

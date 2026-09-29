// extract-figma.js — the ONLY code extractor may pass to use_figma. Replace the page-name placeholder below with run-<id>; nothing else.
const PAGE_NAME = '__PAGE_NAME__';
const page = figma.root.children.find(p => p.name === PAGE_NAME);
if (!page) throw new Error(`page not found: ${PAGE_NAME}`);
await figma.setCurrentPageAsync(page);
const paint = p => p.type === 'SOLID'
  ? { type: 'SOLID', color: p.color, opacity: p.opacity ?? 1, visible: p.visible !== false }
  : { type: p.type, visible: p.visible !== false, stops: p.gradientStops?.map(s => ({ position: s.position, color: s.color })) };
const pick = (n, parentId) => {
  const o = { id: n.id, name: n.name, type: n.type, parent_id: parentId, x: n.x, y: n.y, width: n.width, height: n.height, visible: n.visible };
  if ('fills' in n && Array.isArray(n.fills)) o.fills = n.fills.map(paint);
  if ('strokes' in n) { o.strokes = n.strokes.map(paint); o.strokeWeight = n.strokeWeight; }
  if ('cornerRadius' in n) o.cornerRadius = n.cornerRadius === figma.mixed ? [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius] : n.cornerRadius;
  if ('effects' in n) o.effects = n.effects.map(e => ({ type: e.type, visible: e.visible, color: e.color, offset: e.offset, radius: e.radius, spread: e.spread }));
  if (n.type === 'TEXT') {
    const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fills']);
    o.characters = n.characters;
    o.segments = segs.map(s => ({ text: s.characters, fontFamily: s.fontName.family, fontStyle: s.fontName.style, fontWeight: s.fontWeight, fontSize: s.fontSize, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, fills: s.fills.map(paint) }));
  }
  if ('layoutMode' in n && n.layoutMode !== 'NONE') o.autoLayout = { mode: n.layoutMode, itemSpacing: n.itemSpacing, paddingTop: n.paddingTop, paddingRight: n.paddingRight, paddingBottom: n.paddingBottom, paddingLeft: n.paddingLeft };
  return o;
};
const frames = page.children; // every top-level node, so undeclared frames fail integrity
return {
  extracted_at: new Date().toISOString(), page_id: page.id, page_name: page.name,
  frames: frames.map(f => ({ id: f.id, name: f.name, width: f.width, height: f.height,
    nodes: [pick(f, null), ...('findAll' in f ? f.findAll(() => true) : []).map(n => pick(n, n.parent.id))] })),
};

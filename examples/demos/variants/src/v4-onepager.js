// 方向 4 · 一页纸：整份报告塞进一页 16:9，打印即讲义。素纸主题。
const { newDeck } = require("../../pptx-src/lib.js");
const data = require("./data.js");
const drawTimeline = require("./tl.js");
const D = newDeck("linen", { title: data.title });
const { pres, P, MONO } = D;

const s = pres.addSlide({ masterName: "content" });
s.addText(data.title, { placeholder: "title" });
// 页眉带
D.text(s, [ { text: data.verdict[0] }, { text: data.verdict[1], options: { color: P.bad, bold: true } }, { text: data.verdict[2] } ],
  { x: 0.5, y: 0.95, w: 6.4, h: 0.5, fontSize: 11 });
D.text(s, `生成 ${data.meta.gen}　数据截止 ${data.meta.cutoff}　范围 ${data.meta.scope}`, { x: 0.5, y: 1.47, w: 6.4, h: 0.2, fontSize: 8, color: P.ink3 });
s.addShape(pres.ShapeType.line, { x: 0.5, y: 1.75, w: 9, h: 0, line: { color: P.ink, width: 1.25 }, objectName: "head-rule" });

// 左上：看板 4 格（紧凑）
const bw = 1.5, bg = 0.1, by = 1.88, bh = 1.12;
data.cells.forEach((c, i) => {
  const x = 0.5 + i * (bw + bg);
  D.panel(s, x, by, bw, bh, c.focus);
  D.text(s, c.id, { x: x + 0.12, y: by + 0.1, w: bw - 0.24, h: 0.22, fontSize: 10.5, bold: true });
  D.text(s, c.stage, { x: x + 0.12, y: by + 0.32, w: bw - 0.24, h: 0.2, fontSize: 8, color: P.ink2 });
  D.big(s, x + 0.12, by + 0.4, 0.8, c.dev, "天", c.kind === "bad" ? P.bad : c.dev === "+2" ? P.ok : P.ink, 18);
  D.tag(s, x + bw - 0.6, by + 0.5, c.tag, c.kind, 0.48);
  D.text(s, c.next, { x: x + 0.12, y: by + 0.9, w: bw - 0.24, h: 0.18, fontSize: 7, color: P.ink3 });
});

// 左下：时间线
D.text(s, "时间线", { x: 0.5, y: 3.08, w: 2, h: 0.22, fontSize: 10, bold: true });
drawTimeline(D, s, data, { x0: 1.1, x1: 6.7, y0: 3.28, rowGap: 0.28, labelW: 0.55, fontScale: 0.8, lineW: 2.5 });

// 右栏：异常明细 + 本期变化
const rx = 7.1, rw = 2.4;
D.text(s, "异常明细", { x: rx, y: 1.9, w: rw, h: 0.22, fontSize: 10, bold: true });
let y = 2.15;
data.issues.forEach(it => {
  D.text(s, [ { text: it.id + "  ", options: { bold: true } }, { text: it.label, options: { color: P[it.kind], bold: true } } ], { x: rx, y, w: rw, h: 0.2, fontSize: 9 });
  D.text(s, it.cause, { x: rx, y: y + 0.2, w: rw, h: it.kind === "bad" ? 0.5 : 0.34, fontSize: 7, color: P.ink });
  D.text(s, [ { text: "待谁 ", options: { color: P.ink2 } }, { text: it.who.split("；")[0] }, { text: "　期限 ", options: { color: P.ink2 } }, { text: it.due, options: { bold: true } } ],
    { x: rx, y: y + (it.kind === "bad" ? 0.72 : 0.56), w: rw, h: 0.2, fontSize: 7 });
  y += it.kind === "bad" ? 0.98 : 0.8;
});
D.text(s, "本期变化", { x: rx, y: y, w: rw, h: 0.22, fontSize: 10, bold: true });
y += 0.25;
data.changes.filter(r => r[4] !== "无变化").forEach(r => {
  D.text(s, [ { text: r[0] + "  ", options: { bold: true } }, { text: r[1] + " " + r[2] + " → " + r[3] + "，" }, { text: r[4], options: { color: r[5] ? P[r[5]] : P.ink } } ],
    { x: rx, y, w: rw, h: 0.3, fontSize: 7 });
  y += 0.31;
});

D.save(process.argv[2]);

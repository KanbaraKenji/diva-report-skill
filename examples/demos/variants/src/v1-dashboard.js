// 方向 1 · 看板型：信息密度优先，3 页讲完。页眉带与看板合在第一页。
const { newDeck } = require("../../pptx-src/lib.js");
const data = require("./data.js");
const drawTimeline = require("./tl.js");
const D = newDeck("linen", { title: data.title });
const { pres, P, MONO } = D;

// 1 页眉带 + 看板（同一页）
{
  const s = pres.addSlide({ masterName: "content" });
  s.addText(data.title, { placeholder: "title" });
  D.text(s, [ { text: data.verdict[0] }, { text: data.verdict[1], options: { color: P.bad, bold: true } }, { text: data.verdict[2] } ],
    { x: 0.5, y: 1.0, w: 9, h: 0.7, fontSize: 14 });
  D.text(s, `生成 ${data.meta.gen}　　数据截止 ${data.meta.cutoff}　　范围 ${data.meta.scope}`, { x: 0.5, y: 1.72, w: 9, h: 0.25, fontSize: 10, color: P.ink3 });
  const w = 2.1, gap = 0.2, y = 2.2, h = 2.3;
  data.cells.forEach((c, i) => {
    const x = 0.5 + i * (w + gap);
    D.panel(s, x, y, w, h, c.focus);
    D.text(s, c.id, { x: x + 0.2, y: y + 0.18, w: w - 0.4, h: 0.3, fontSize: 15, bold: true });
    D.text(s, c.name, { x: x + 0.2, y: y + 0.47, w: w - 0.4, h: 0.25, fontSize: 11, color: P.ink2 });
    D.text(s, c.stage, { x: x + 0.2, y: y + 0.8, w: 0.9, h: 0.26, fontSize: 11, color: P.ink2, valign: "middle" });
    D.tag(s, x + 1.1, y + 0.8, c.tag, c.kind);
    D.big(s, x + 0.2, y + 1.12, w - 0.4, c.dev, "天", c.kind === "bad" ? P.bad : c.dev === "+2" ? P.ok : P.ink, 28);
    D.text(s, "下一节点  " + c.next, { x: x + 0.2, y: y + 1.88, w: w - 0.4, h: 0.25, fontSize: 10, color: P.ink3 });
  });
  D.text(s, "偏差为相对计划的天数，负数为延期。", { x: 0.5, y: 4.65, w: 9, h: 0.25, fontSize: 9.5, color: P.ink3 });
}

// 2 时间线 + 异常明细（左右分栏）
{
  const s = D.page("时间线与异常");
  drawTimeline(D, s, data, { x0: 1.3, x1: 5.3, y0: 1.1, rowGap: 0.55, labelW: 0.7, fontScale: 0.95, lineW: 3.5 });
  D.text(s, "实线已完成，浅灰计划中，虚线为逾期拖到今天。", { x: 0.5, y: 4.2, w: 4.8, h: 0.25, fontSize: 9, color: P.ink3 });
  // 右栏：两条异常
  let y = 1.1;
  data.issues.forEach(it => {
    const h = it.kind === "bad" ? 1.8 : 1.45;
    D.panel(s, 5.7, y, 3.8, h, it.kind === "bad");
    D.text(s, it.id, { x: 5.9, y: y + 0.15, w: 1.2, h: 0.28, fontSize: 13, bold: true });
    D.tag(s, 6.85, y + 0.17, it.label, it.kind, 0.9);
    D.text(s, [ { text: "原因  ", options: { color: P.ink2 } }, { text: it.cause } ], { x: 5.9, y: y + 0.5, w: 3.4, h: h - 0.95, fontSize: 10 });
    D.text(s, [ { text: "待谁  ", options: { color: P.ink2 } }, { text: it.who }, { text: "　期限 ", options: { color: P.ink2 } }, { text: it.due, options: { bold: true } } ],
      { x: 5.9, y: y + h - 0.5, w: 3.4, h: 0.42, fontSize: 10 });
    y += h + 0.15;
  });
}

// 3 本期变化
{
  const s = D.page("本期变化（与第 36 周比）");
  D.table(s, ["对象", "项目", "上期", "本期", "变化"], data.changes.map(r => [ r[0], r[1], r[2], r[3], r[5] ? { text: r[4], options: { color: P[r[5]] } } : r[4] ]),
    { colW: [1.0, 2.2, 1.6, 1.6, 2.6], numCols: [2, 3], fontSize: 12, rowH: 0.42 });
}

D.save(process.argv[2]);

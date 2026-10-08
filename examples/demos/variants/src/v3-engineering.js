// 方向 3 · 工程表格型：一切皆表，等宽数字，淡网格底纹，4 页。蓝图主题。
const { newDeck } = require("../../pptx-src/lib.js");
const data = require("./data.js");
const drawTimeline = require("./tl.js");
const D = newDeck("blueprint", { title: data.title });
const { pres, P, MONO } = D;

// 网格底纹：24px ≈ 0.25in，只在有时间线/图的页加
function grid(s) {
  for (let x = 0.5; x <= 9.5; x += 0.25) s.addShape(pres.ShapeType.line, { x, y: 1.0, w: 0, h: 4.0, line: { color: P.line, width: 0.25 }, objectName: "g" });
  for (let y = 1.0; y <= 5.0; y += 0.25) s.addShape(pres.ShapeType.line, { x: 0.5, y, w: 9, h: 0, line: { color: P.line, width: 0.25 }, objectName: "g" });
}

// 1 页眉带：表格化 meta
{
  const s = pres.addSlide({ masterName: "content" });
  s.addText(data.title, { placeholder: "title" });
  D.table(s, ["项", "值"], [
    ["结论", { text: "3/4 在计划内；M-2308 延期 6 天，T1 09-04 → 09-16；待采购部 09-15 前确认电极外协", options: { bold: true } }],
    ["生成时间", data.meta.gen], ["数据截止", data.meta.cutoff], ["范围", data.meta.scope], ["上期", "第 36 周"],
  ], { colW: [1.4, 7.6], fontSize: 12, rowH: 0.4, pos: { x: 0.5, y: 1.1, w: 9 } });
}

// 2 对象总表（看板变成一张表）
{
  const s = D.page("对象状态表");
  const col = { bad: P.bad, warn: P.warn, ok: P.ok };
  D.table(s, ["模具", "产品", "当前阶段", "状态", "偏差（天）", "计划日期", "预计/实际", "下一节点"], data.cells.map(c => [
    { text: c.id, options: { bold: c.focus } }, c.name, c.stage, { text: c.tag, options: { color: col[c.kind], bold: true } },
    { text: c.dev, options: { color: c.kind === "bad" ? P.bad : P.ink, bold: c.focus } },
    c.focus ? c.planned : "—", c.focus ? c.newDate : "—", c.next,
  ]), { colW: [0.9, 1.4, 1.1, 0.7, 1.0, 1.0, 1.1, 1.8], numCols: [4, 5, 6], fontSize: 11, rowH: 0.36,
      rowFill: data.cells.map(c => c.focus ? require("../../pptx-src/lib.js").blend(P.bad, P.panel, 0.08) : P.paper) });
  D.text(s, "偏差 = 预计 − 计划，负数为延期。异常行整行标出。", { x: 0.5, y: 3.4, w: 9, h: 0.25, fontSize: 10, color: P.ink3 });
}

// 3 时间线（网格底纹）
{
  const s = D.page("进度时间线");
  grid(s);
  drawTimeline(D, s, data, { x0: 1.6, x1: 9.3, y0: 1.15, rowGap: 0.7, labelW: 0.9, fontScale: 1, lineW: 4 });
}

// 4 异常与变化（两张表叠放）
{
  const s = D.page("异常明细 / 本期变化");
  D.table(s, ["对象", "问题", "原因", "新日期", "待谁处理", "期限"], data.issues.map(it => [
    { text: it.id, options: { bold: true } }, { text: it.label, options: { color: P[it.kind], bold: true } }, it.cause, it.newDate, it.who, it.due ]),
    { colW: [0.8, 1.0, 3.2, 0.9, 2.3, 0.8], numCols: [3, 5], fontSize: 10, rowH: 0.5, pos: { x: 0.5, y: 1.05, w: 9 } });
  D.table(s, ["对象", "项目", "上期", "本期", "变化"], data.changes.map(r => [ r[0], r[1], r[2], r[3], r[5] ? { text: r[4], options: { color: P[r[5]] } } : r[4] ]),
    { colW: [0.9, 2.3, 1.7, 1.7, 2.4], numCols: [2, 3], fontSize: 10, rowH: 0.3, pos: { x: 0.5, y: 3.15, w: 9 } });
}

D.save(process.argv[2]);

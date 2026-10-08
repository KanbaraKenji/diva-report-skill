// 方向 2 · 叙事型：一页一句话，标题就是结论。字大、留白多、7 页。铅字主题。
const { newDeck } = require("../../pptx-src/lib.js");
const data = require("./data.js");
const D = newDeck("press", { title: data.title });
const { pres, P, MONO } = D;

// 叙事页：大标题是结论句，下面只放一个东西
function story(headline, sub) {
  const s = pres.addSlide({ masterName: "content" });
  s.addText(headline, { placeholder: "title" });
  if (sub) D.text(s, sub, { x: 0.5, y: 1.05, w: 8.5, h: 0.4, fontSize: 12, color: P.ink2 });
  return s;
}

// 1 封面
D.cover(data.title, [ { text: data.verdict[0] }, { text: data.verdict[1], options: { color: P.accent, bold: true } }, { text: data.verdict[2] } ],
  `生成 ${data.meta.gen}　　数据截止 ${data.meta.cutoff}　　范围 ${data.meta.scope}`);

// 2 主角：一个数字
{
  const s = story("M-2308 延期 6 天，是本周唯一的异常", "前保险杠格栅 · T1 试模");
  D.big(s, 0.5, 1.7, 4, "−6", "天", P.accent, 72);
  D.text(s, "T1 试模由 09-04 改到 09-16。原因是电极外协厂 09-01 起优先其他客户订单，我方电极排产从 09-02 推到 09-12，型腔 EDM 停工 6 天。",
    { x: 4.6, y: 1.9, w: 4.9, h: 1.6, fontSize: 14 });
}

// 3 需要谁做什么
{
  const s = story("需要采购部在 09-15 前确认电极外协排产", "确认不了，模具车间自制电极，再加 4 天");
  const rows = [ ["采购部", "确认外协排产，拿到书面交期", "09-15"], ["模具车间", "09-15 未拿到确认则自制电极（3 件）", "09-16 启动"] ];
  rows.forEach((r, i) => {
    const y = 1.7 + i * 1.1;
    D.text(s, r[0], { x: 0.5, y, w: 2, h: 0.5, fontSize: 20, bold: true, color: i === 0 ? P.accent : P.ink, fontFace: P.head });
    D.text(s, r[1], { x: 2.7, y: y + 0.05, w: 5, h: 0.5, fontSize: 14 });
    D.text(s, r[2], { x: 7.9, y: y + 0.05, w: 1.6, h: 0.5, fontSize: 16, bold: true, fontFace: MONO, align: "right" });
    s.addShape(pres.ShapeType.line, { x: 0.5, y: y + 0.75, w: 9, h: 0, line: { color: P.line, width: 0.75 }, objectName: "rule" });
  });
}

// 4 其余三套
{
  const s = story("其余 3 套在计划内，M-2319 的钢料到货要盯", "截至 09-10 供应商尚未发出发货通知，采购部 09-11 跟催");
  data.cells.filter(c => !c.focus).forEach((c, i) => {
    const y = 1.7 + i * 0.95;
    D.text(s, c.id, { x: 0.5, y, w: 1.4, h: 0.4, fontSize: 18, bold: true, fontFace: P.head });
    D.text(s, c.name + "　" + c.stage, { x: 2.0, y: y + 0.07, w: 3.6, h: 0.4, fontSize: 13, color: P.ink2 });
    D.tag(s, 5.7, y + 0.08, c.tag, c.kind);
    D.text(s, "下一节点 " + c.next, { x: 6.6, y: y + 0.07, w: 2.9, h: 0.4, fontSize: 13, align: "right" });
    s.addShape(pres.ShapeType.line, { x: 0.5, y: y + 0.62, w: 9, h: 0, line: { color: P.line, width: 0.75 }, objectName: "rule" });
  });
}

// 5 时间线：只画主角一行，其余三行压成一句
{
  const s = story("逾期的 6 天拖到今天，新节点在 09-16", "08-24 到 10-05，今天是 09-10");
  const drawTimeline = require("./tl.js");
  drawTimeline(D, s, data, { x0: 1.6, x1: 9.3, y0: 1.6, rowGap: 0.6, labelW: 0.9, fontScale: 1.05, lineW: 4.5 });
}

// 6 本期变化
{
  const s = story("本周动了三件事", "与第 36 周比");
  data.changes.filter(r => r[4] !== "无变化").forEach((r, i) => {
    const y = 1.7 + i * 0.95;
    D.text(s, r[0], { x: 0.5, y, w: 1.4, h: 0.4, fontSize: 18, bold: true, fontFace: P.head });
    D.text(s, r[1] + "：" + r[2] + " → " + r[3], { x: 2.0, y: y + 0.07, w: 4.8, h: 0.4, fontSize: 13 });
    D.text(s, r[4], { x: 7.0, y: y + 0.07, w: 2.5, h: 0.4, fontSize: 13, bold: true, align: "right", color: r[5] ? P[r[5]] : P.ink });
    s.addShape(pres.ShapeType.line, { x: 0.5, y: y + 0.62, w: 9, h: 0, line: { color: P.line, width: 0.75 }, objectName: "rule" });
  });
}

// 7 收尾：下周看什么
{
  const s = story("下周要看的三个日期", "按先后");
  [["09-11", "采购部跟催 M-2319 钢料发货"], ["09-15", "采购部确认 M-2308 电极外协排产"], ["09-18", "M-2315 设计冻结"]].forEach((r, i) => {
    const y = 1.7 + i * 0.95;
    D.text(s, r[0], { x: 0.5, y, w: 1.6, h: 0.45, fontSize: 24, bold: true, fontFace: MONO, color: i === 1 ? P.accent : P.ink });
    D.text(s, r[1], { x: 2.3, y: y + 0.1, w: 7, h: 0.4, fontSize: 14 });
  });
}

D.save(process.argv[2]);

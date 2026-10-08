// 示例 1 · 进度报告 status · 素纸 linen
const { newDeck } = require("./lib.js");
const D = newDeck("linen", { title: "注塑模具开发周报 · 第 37 周" });
const { pres, P, MONO } = D;
const C = pres.SchemeColor;

// 1 页眉带
D.cover("注塑模具开发周报 · 第 37 周",
  [ { text: "4 套在制模具中 3 套在计划内；" },
    { text: "M-2308 延期 6 天", options: { color: P.bad, bold: true } },
    { text: "，T1 试模由 09-04 改到 09-16，需要采购部在 09-15 前确认电极外协排产。" } ],
  "生成  2026-09-11 14:20　　数据截止  2026-09-10 18:00　　范围  4 套在制模具");

// 2 对象看板：横排一行，主角格加粗边框
{
  const s = D.page("对象看板");
  const cells = [
    { id: "M-2308", name: "前保险杠格栅", stage: "T1 试模", dev: "−6", unit: "天", kind: "bad", tag: "异常", next: "T1 试模 09-16", focus: true },
    { id: "M-2319", name: "后视镜壳", stage: "钢料采购", dev: "0", unit: "天", kind: "warn", tag: "注意", next: "钢料到货 09-14" },
    { id: "M-2311", name: "仪表板骨架", stage: "型腔加工", dev: "0", unit: "天", kind: "ok", tag: "正常", next: "T0 试模 09-24" },
    { id: "M-2315", name: "门内饰板", stage: "设计评审", dev: "+2", unit: "天", kind: "ok", tag: "正常", next: "设计冻结 09-18" },
  ];
  const w = 2.1, gap = 0.2, y = 1.3, h = 2.45;
  cells.forEach((c, i) => {
    const x = 0.5 + i * (w + gap);
    D.panel(s, x, y, w, h, c.focus);
    D.text(s, c.id, { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.3, fontSize: 15, bold: true });
    D.text(s, c.name, { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: 0.25, fontSize: 11, color: P.ink2 });
    D.text(s, c.stage, { x: x + 0.2, y: y + 0.85, w: 0.9, h: 0.26, fontSize: 11, color: P.ink2, valign: "middle" });
    D.tag(s, x + 1.1, y + 0.85, c.tag, c.kind);
    const col = c.kind === "bad" ? P.bad : c.dev === "+2" ? P.ok : P.ink;
    D.big(s, x + 0.2, y + 1.2, w - 0.4, c.dev, c.unit, col, 30);
    D.text(s, "下一节点  " + c.next, { x: x + 0.2, y: y + 2.0, w: w - 0.4, h: 0.25, fontSize: 10, color: P.ink3 });
  });
  D.text(s, "偏差为相对计划的天数，负数为延期。正常项只占一格，版面留给异常项。", { x: 0.5, y: 4.0, w: 9, h: 0.3, fontSize: 10, color: P.ink3 });
}

// 3 时间线：手画，不用图表库；已过去实线、未来浅灰、逾期虚线拖到今天
{
  const s = D.page("时间线");
  const x0 = 1.6, x1 = 9.4, y0 = 1.35, y1 = 4.75;
  const days = (d) => { const [m, dd] = d.split("-").map(Number); return (m - 8) * 31 + dd; }; // 08-24 → 10-05 内近似
  const start = days("08-24"), end = days("10-05");
  const X = (d) => x0 + (days(d) - start) / (end - start) * (x1 - x0);
  const ticks = ["08-24", "08-31", "09-07", "09-14", "09-21", "09-28", "10-05"];
  ticks.forEach(t => {
    s.addShape(pres.ShapeType.line, { x: X(t), y: y0 + 0.3, w: 0, h: y1 - y0 - 0.3, line: { color: P.line, width: 0.75 }, objectName: "grid" });
    D.text(s, t, { x: X(t) - 0.4, y: y0, w: 0.8, h: 0.25, fontSize: 9, color: P.ink3, align: "center", fontFace: MONO });
  });
  const today = X("09-10");
  s.addShape(pres.ShapeType.line, { x: today, y: y0 + 0.25, w: 0, h: y1 - y0 - 0.2, line: { color: P.accent, width: 1.5 }, objectName: "today" });
  D.text(s, "今天 09-10", { x: today + 0.06, y: y0 + 0.28, w: 1.2, h: 0.22, fontSize: 9, color: P.accent, bold: true });

  const rows = [
    { label: "M-2308", y: y0 + 0.95, segs: [ { a: "08-24", b: "09-04", c: P.bad }, { a: "09-04", b: "09-10", c: P.bad, dash: true }, { a: "09-10", b: "09-16", c: P.line } ],
      node: { d: "09-16", c: P.bad }, note: { d: "09-04", t: "计划 T1 09-04 已逾期", c: P.bad }, noteNode: { d: "09-16", t: "新 T1 09-16" } },
    { label: "M-2319", y: y0 + 1.75, segs: [ { a: "08-24", b: "09-10", c: P.warn }, { a: "09-10", b: "09-14", c: P.line } ],
      node: { d: "09-14", c: P.warn }, noteNode: { d: "09-14", t: "钢料到货 09-14" } },
    { label: "M-2311", y: y0 + 2.45, segs: [ { a: "08-24", b: "09-10", c: P.ok }, { a: "09-10", b: "09-24", c: P.line } ],
      node: { d: "09-24", c: P.ok }, noteNode: { d: "09-24", t: "T0 试模 09-24" } },
    { label: "M-2315", y: y0 + 3.15, segs: [ { a: "08-24", b: "09-10", c: P.ok }, { a: "09-10", b: "09-18", c: P.line } ],
      node: { d: "09-18", c: P.ok }, noteNode: { d: "09-18", t: "设计冻结 09-18" } },
  ];
  rows.forEach(r => {
    D.text(s, r.label, { x: 0.5, y: r.y - 0.12, w: 1.0, h: 0.25, fontSize: 11, bold: true, align: "right" });
    r.segs.forEach(sg => {
      s.addShape(pres.ShapeType.line, { x: X(sg.a), y: r.y, w: X(sg.b) - X(sg.a), h: 0, objectName: "seg",
        line: { color: sg.c, width: 5, dashType: sg.dash ? "sysDot" : "solid", endArrowType: "none" } });
    });
    if (r.note) {
      s.addShape(pres.ShapeType.ellipse, { x: X(r.note.d) - 0.07, y: r.y - 0.07, w: 0.14, h: 0.14, fill: { color: P.paper }, line: { color: r.note.c, width: 1.75 }, objectName: "node-late" });
      D.text(s, r.note.t, { x: X(r.note.d) - 1.2, y: r.y + 0.1, w: 2.4, h: 0.22, fontSize: 9, color: r.note.c, align: "center" });
    }
    s.addShape(pres.ShapeType.ellipse, { x: X(r.node.d) - 0.07, y: r.y - 0.07, w: 0.14, h: 0.14, fill: { color: P.paper }, line: { color: r.node.c, width: 1.75 }, objectName: "node" });
    D.text(s, r.noteNode.t, { x: X(r.node.d) + 0.12, y: r.y - 0.11, w: 1.5, h: 0.22, fontSize: 9, color: P.ink2 });
  });
  D.text(s, "实线为已完成，浅灰为计划中，红色虚线为逾期拖到今天的部分。", { x: 0.5, y: 4.85, w: 9, h: 0.25, fontSize: 10, color: P.ink3 });
}

// 4 异常明细：只列异常与注意
{
  const s = D.page("异常明细");
  D.table(s, ["对象", "问题", "原因", "新日期", "待谁处理", "期限"], [
    [ { text: "M-2308", options: { bold: true } }, { text: "延期 6 天", options: { color: P.bad } },
      "电极外协厂 09-01 起优先其他客户订单，我方电极排产从 09-02 推到 09-12，型腔 EDM 停工 6 天",
      "T1 09-16", "采购部确认外协排产；确认不了则模具车间自制电极（+4 天）", "09-15" ],
    [ { text: "M-2319", options: { bold: true } }, { text: "风险", options: { color: P.warn } },
      "钢料到货日 09-14，截至 09-10 供应商尚未发出发货通知", "—", "采购部跟催", "09-11" ],
  ], { colW: [0.9, 1.0, 3.0, 1.0, 2.3, 0.8], numCols: [3, 5], fontSize: 11, rowH: 0.8 });
  D.text(s, "正常项不进这张表。", { x: 0.5, y: 3.7, w: 9, h: 0.25, fontSize: 10, color: P.ink3 });
}

// 5 本期变化
{
  const s = D.page("本期变化（与第 36 周比）");
  D.table(s, ["对象", "项目", "上期", "本期", "变化"], [
    [ "M-2308", "T1 试模日期", "09-04", "09-16", { text: "推迟 12 天", options: { color: P.bad } } ],
    [ "M-2311", "型腔加工完成率", "40%", "65%", "+25 个百分点" ],
    [ "M-2315", "设计评审完成", "计划 09-12", "实际 09-10", { text: "提前 2 天", options: { color: P.ok } } ],
    [ "M-2319", "钢料采购", "待到货", "待到货", "无变化" ],
  ], { colW: [1.0, 2.2, 1.6, 1.6, 2.6], numCols: [2, 3], fontSize: 12, rowH: 0.42 });
}

D.save(process.argv[2]);

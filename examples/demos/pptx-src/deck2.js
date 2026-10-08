// 示例 2 · 审查报告 audit · 蓝图 blueprint
const { newDeck, blend } = require("./lib.js");
const D = newDeck("blueprint", { title: "M-2296 中控面板 T1 试模检测报告" });
const { pres, P, MONO } = D;
const failFill = blend(P.bad, P.panel, 0.08); // 超差行整行 8% 透明度底色

// 1 页眉带
D.cover("M-2296 中控面板 T1 试模检测报告",
  [ { text: "T1 不通过", options: { color: P.bad, bold: true } },
    { text: "。12 项中 9 项通过、2 项不通过、1 项不适用；总宽超差 0.06 mm 需修模，修模后建议 T2 日期 09-22。" } ],
  "生成  2026-09-08 17:05　　数据截止  2026-09-08 16:30　　范围  T1 试模首件，取样 5 模，检测 12 项");

// 2 总评：三个数字 + 严重度定义
{
  const s = D.page("总评");
  const items = [ ["9", "通过", P.ok], ["2", "不通过", P.bad], ["1", "不适用", P.ink3] ];
  items.forEach((it, i) => {
    const x = 0.5 + i * 1.9;
    D.big(s, x, 1.25, 1.6, it[0], "项", it[2], 44);
    D.text(s, it[1], { x, y: 2.15, w: 1.6, h: 0.3, fontSize: 13, color: P.ink2 });
  });
  D.text(s, "检测 12 项，不通过的 2 项是产品总宽（第 2 项）和缩痕（第 5 项）。", { x: 0.5, y: 2.65, w: 9, h: 0.3, fontSize: 13 });

  D.text(s, "严重度定义", { x: 0.5, y: 3.25, w: 4, h: 0.3, fontSize: 13, bold: true });
  D.table(s, ["级别", "含义"], [
    [ { text: "严重", options: { color: P.bad, bold: true } }, "阻止进入 T2，或影响装配" ],
    [ { text: "一般", options: { color: P.warn, bold: true } }, "需在 T2 前整改" ],
    [ { text: "轻微", options: { color: P.ink2, bold: true } }, "记录，T2 复测" ],
  ], { colW: [1.2, 5.8], fontSize: 11, rowH: 0.3, pos: { x: 0.5, y: 3.6, w: 7 } });
}

// 3 逐条表：主体
{
  const s = D.page("逐条检测结果");
  const rows = [
    [1, "产品总长", "通过", "412.08 mm", "412.00 ±0.15 mm", "三坐标报告 CMM-0908-01"],
    [2, "产品总宽", "不通过", "186.71 mm", "186.50 ±0.15 mm", "三坐标报告 CMM-0908-01"],
    [3, "卡扣位置度", "通过", "0.07 mm", "≤0.10 mm", "三坐标报告 CMM-0908-01"],
    [4, "壁厚", "通过", "2.46 mm", "2.50 ±0.10 mm", "壁厚仪抽测 5 点"],
    [5, "缩痕", "不通过", "B 面 2 处", "外观面不允许", "外观检查单 VI-0908 + 照片 2 张"],
    [6, "飞边", "通过", "0.03 mm", "≤0.05 mm", "外观检查单 VI-0908"],
    [7, "顶白", "通过", "无", "不允许", "外观检查单 VI-0908"],
    [8, "熔接线", "通过", "位于非外观面", "外观面不允许", "外观检查单 VI-0908"],
    [9, "翘曲", "通过", "0.38 mm", "≤0.50 mm", "平台塞尺"],
    [10, "注塑周期", "通过", "43.2 s", "≤45 s", "注塑机记录 09-08"],
    [11, "浇口残留", "通过", "0.22 mm", "≤0.30 mm", "外观检查单 VI-0908"],
    [12, "耐热试验", "不适用", "本次未做", "85 ℃ / 24 h 无变形", "计划在 T2 做"],
  ];
  const col = { "通过": P.ok, "不通过": P.bad, "不适用": P.ink3 };
  const body = rows.map(r => [ String(r[0]), r[1], { text: r[2], options: { color: col[r[2]], bold: r[2] === "不通过" } }, r[3], r[4], r[5] ]);
  const rowFill = rows.map(r => r[2] === "不通过" ? failFill : P.paper);
  D.table(s, ["#", "条目", "结论", "实测值", "要求值", "证据"], body,
    { colW: [0.4, 1.3, 0.8, 1.5, 1.9, 3.1], numCols: [0, 3, 4], fontSize: 10, rowH: 0.27, rowFill, pos: { x: 0.5, y: 1.05, w: 9 } });
  D.text(s, "数值取 5 模均值；不通过行整行标出。", { x: 0.5, y: 4.75, w: 9, h: 0.25, fontSize: 10, color: P.ink3 });
}

// 4 发现：按严重度排，每条配可执行动作
{
  const s = D.page("发现（按严重度）");
  const F = [
    { id: "F1", lv: "严重", kind: "bad", what: "产品总宽超差 +0.21 mm（超出上限 0.06 mm）",
      act: "型腔宽度方向修模 −0.20 mm，保留 0.01 mm 收缩余量", who: "模具车间", due: "09-19" },
    { id: "F2", lv: "一般", kind: "warn", what: "B 面缩痕 2 处（加强筋根部）",
      act: "先把该区域保压时间加 0.3 s、保压压力提高 5% 再打 5 模；仍有缩痕则把加强筋根部壁厚由 1.5 mm 改 1.2 mm", who: "工艺组", due: "09-15" },
    { id: "F3", lv: "轻微", kind: "ink2", what: "壁厚 2.46 mm 偏下限",
      act: "记录，T2 复测", who: "工艺组", due: "T2 当日" },
  ];
  let y = 1.15;
  F.forEach(f => {
    const h = f.id === "F2" ? 1.35 : 1.05;
    D.panel(s, 0.5, y, 9, h, f.id === "F1");
    D.text(s, f.id, { x: 0.7, y: y + 0.15, w: 0.5, h: 0.3, fontSize: 14, bold: true, fontFace: MONO });
    D.tag(s, 1.2, y + 0.17, f.lv, f.kind === "ink2" ? "ink2" : f.kind);
    D.text(s, f.what, { x: 1.95, y: y + 0.15, w: 6.9, h: 0.3, fontSize: 13, bold: true });
    D.text(s, [ { text: "建议动作  ", options: { color: P.ink2 } }, { text: f.act } ], { x: 0.7, y: y + 0.5, w: 6.2, h: h - 0.6, fontSize: 11 });
    D.text(s, [ { text: "责任  ", options: { color: P.ink2 } }, { text: f.who }, { text: "\n" }, { text: "期限  ", options: { color: P.ink2 } }, { text: f.due } ],
      { x: 7.2, y: y + 0.5, w: 2.1, h: 0.5, fontSize: 11 });
    y += h + 0.12;
  });
}

// 5 建议动作：这是一个真正的顺序，所以编号
{
  const s = D.page("建议动作");
  const steps = [
    ["1", "修模", "型腔宽度方向 −0.20 mm（F1）", "模具车间，09-19"],
    ["2", "工艺验证", "保压 +0.3 s、压力 +5%，打 5 模看缩痕（F2）", "工艺组，09-15"],
    ["3", "T2 试模", "修模与工艺验证完成后", "09-22"],
    ["4", "耐热试验", "T2 加做第 12 项（85 ℃ / 24 h）", "T2 当日"],
  ];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 2.25, y = 1.4, w = 2.05, h = 2.2;
    D.panel(s, x, y, w, h, false);
    D.text(s, st[0], { x: x + 0.2, y: y + 0.15, w: 0.5, h: 0.5, fontSize: 26, bold: true, color: P.accent, fontFace: MONO });
    D.text(s, st[1], { x: x + 0.2, y: y + 0.7, w: w - 0.4, h: 0.3, fontSize: 14, bold: true });
    D.text(s, st[2], { x: x + 0.2, y: y + 1.05, w: w - 0.4, h: 0.7, fontSize: 11 });
    D.text(s, st[3], { x: x + 0.2, y: y + 1.8, w: w - 0.4, h: 0.25, fontSize: 10, color: P.ink3 });
    if (i < steps.length - 1) s.addShape(pres.ShapeType.line, { x: x + w, y: y + h / 2, w: 0.2, h: 0, line: { color: P.ink3, width: 1, endArrowType: "triangle" }, objectName: "arrow" });
  });
  D.text(s, "第 1 步和第 2 步可以并行；第 3 步要等两步都完成。", { x: 0.5, y: 3.9, w: 9, h: 0.3, fontSize: 11, color: P.ink2 });
}

D.save(process.argv[2]);

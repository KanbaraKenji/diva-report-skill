// 示例 4 · 受阻报告 blocker · 石板 slate（深色，只用于内部值班大屏）
const { newDeck } = require("./lib.js");
const D = newDeck("slate", { title: "M-2308 T1 试模受阻" });
const { pres, P, MONO } = D;

// 1 页眉带
D.cover("M-2308 T1 试模受阻",
  [ { text: "型腔 EDM 因电极外协排产推迟已停工 6 天；" },
    { text: "需要采购部在 09-15 前确认外协排产", options: { color: P.accent, bold: true } },
    { text: "，否则模具车间 09-16 起自制电极（再加 4 天）。" } ],
  "生成  2026-09-10 20:15　　数据截止  2026-09-10 18:00　　范围  M-2308 前保险杠格栅");

// 2 主角：需要谁做什么
{
  const s = D.page("需要谁做什么");
  D.table(s, ["谁", "做什么", "期限"], [
    [ { text: "采购部", options: { bold: true, color: P.accent } }, { text: "与外协厂确认 09-12 排产是否能保住，拿到书面交期", options: { bold: true } }, { text: "09-15", options: { bold: true, color: P.accent } } ],
    [ "模具车间", "如采购部 09-15 未拿到确认，启动自制电极（3 件）", "09-16 启动" ],
    [ "项目组", "向客户更新 T1 日期（09-04 → 09-16）", "09-12" ],
  ], { colW: [1.4, 6.0, 1.6], numCols: [2], fontSize: 13, rowH: 0.62, pos: { x: 0.5, y: 1.2, w: 9 }, rowFill: [P.panel, P.paper, P.paper] });
  D.text(s, "第一行是解开卡点的那一步，其余两行是它的后手。", { x: 0.5, y: 4.3, w: 9, h: 0.3, fontSize: 11, color: P.ink2 });
}

// 3 卡点与根因：现象和根因分开写
{
  const s = D.page("卡点与根因");
  D.big(s, 0.5, 1.2, 3, "6", "天", P.bad, 44);
  D.text(s, "型腔 EDM 停工，从 09-04 起", { x: 0.5, y: 2.05, w: 3.4, h: 0.3, fontSize: 12, color: P.ink2 });
  const colW = 2.75;
  [ ["现象", "电极 09-02 应到未到，EDM 工位空置。"],
    ["根因", "外协电极厂 09-01 起优先一个大客户订单，我方 3 件电极的排产从 09-02 推到 09-12（外协厂 09-09 邮件确认）。"],
  ].forEach((b, i) => {
    const x = 4.0 + i * (colW + 0.2);
    D.panel(s, x, 1.2, colW, 2.4, i === 1);
    D.text(s, b[0], { x: x + 0.2, y: 1.38, w: colW - 0.4, h: 0.3, fontSize: 13, bold: true, color: i === 1 ? P.accent : P.ink });
    D.text(s, b[1], { x: x + 0.2, y: 1.78, w: colW - 0.4, h: 1.7, fontSize: 12 });
  });
}

// 4 临时绕法：写清代价
{
  const s = D.page("临时绕法：模具车间自制电极");
  const items = [
    ["需要", "4 天；库存铜料够 3 件"],
    ["代价", "占用 M-2311 的 EDM 机时 2 天，M-2311 型腔加工后移 2 天"],
    ["兜底", "M-2311 目前有 5 天缓冲，后移 2 天仍在缓冲内"],
    ["触发条件", "采购部 09-15 未拿到外协书面交期"],
  ];
  items.forEach((it, i) => {
    const y = 1.2 + i * 0.75;
    D.text(s, it[0], { x: 0.5, y, w: 1.4, h: 0.4, fontSize: 12, bold: true, color: P.ink2, valign: "middle" });
    D.text(s, it[1], { x: 1.9, y, w: 7.6, h: 0.4, fontSize: 13, valign: "middle" });
    s.addShape(pres.ShapeType.line, { x: 0.5, y: y + 0.55, w: 9, h: 0, line: { color: P.line, width: 0.75 }, objectName: "rule" });
  });
}

// 5 影响面：两条路线并排比较
{
  const s = D.page("影响面");
  D.table(s, ["", "外协 09-12 排产保住", "自制电极"], [
    [ "T1 试模", "09-16", "09-20" ],
    [ "客户 SOP 节点 11-02 的缓冲", { text: "12 天 → 6 天", options: { color: P.warn } }, { text: "12 天 → 2 天", options: { color: P.bad } } ],
    [ "关联模具 M-2311", "不受影响", "型腔加工后移 2 天，仍在缓冲内" ],
  ], { colW: [2.6, 3.2, 3.2], fontSize: 13, rowH: 0.6, pos: { x: 0.5, y: 1.2, w: 9 } });
  D.text(s, "两条路线原计划 T1 都是 09-04。", { x: 0.5, y: 4.3, w: 9, h: 0.3, fontSize: 11, color: P.ink2 });
}

D.save(process.argv[2]);

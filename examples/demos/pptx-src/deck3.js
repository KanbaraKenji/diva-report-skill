// 示例 3 · 对比报告 comparison · 铅字 press（衬线标题 + 无衬线正文，留白更多）
const { newDeck } = require("./lib.js");
const D = newDeck("press", { title: "模具钢料供应商选型对比" });
const { pres, P, MONO } = D;

// 1 页眉带
D.cover("模具钢料供应商选型对比",
  [ { text: "推荐切换到供应商 B", options: { color: P.accent, bold: true } },
    { text: "。单价比现用供应商 A 高 7%，年采购 12 t 多花 32,400 元，但交期短 9 天、退货率低 1.7 个百分点；上半年 3 次试模延期（累计 14 天）都和钢料到货晚有关。" } ],
  "生成  2026-09-05 10:40　　数据截止  2026-09-04（近 12 个月采购与质量记录）　　范围  3 家候选供应商，钢种 P20 预硬钢");

// 2 推荐与理由
{
  const s = D.page("推荐与理由");
  D.text(s, "供应商 B", { x: 0.5, y: 1.3, w: 4, h: 0.7, fontSize: 36, bold: true, color: P.accent, fontFace: P.head });
  D.text(s, "三个理由，都是数字：", { x: 0.5, y: 2.1, w: 4, h: 0.3, fontSize: 13, color: P.ink2 });
  const R = [
    ["12 天", "标准交期，比 A 短 9 天", "上半年 3 次试模延期（累计 14 天）均因钢料晚到"],
    ["0.4%", "近 12 个月退货率，A 为 2.1%", "批次硬度波动 ±0.8 HRC，也是三家最小"],
    ["+32,400 元/年", "按年采购 12 t 计的成本代价", "换来的是交期准时率 94%（A 为 71%）"],
  ];
  R.forEach((r, i) => {
    const y = 1.3 + i * 1.15;
    D.big(s, 4.9, y - 0.05, 2.6, r[0].split(" ")[0], r[0].split(" ")[1] || "", P.ink, 24);
    D.text(s, r[1], { x: 7.5, y: y + 0.1, w: 2.1, h: 0.45, fontSize: 11, bold: true });
    D.text(s, r[2], { x: 4.9, y: y + 0.55, w: 4.6, h: 0.45, fontSize: 11, color: P.ink2 });
  });
}

// 3 对比表：每一维都分得出高下
{
  const s = D.page("对比表");
  const best = { options: { bold: true, color: P.accent } };
  D.table(s, ["维度", "供应商 A（现用）", "供应商 B", "供应商 C"], [
    ["单价（元/kg）", "38.5", "41.2", { text: "35.0", ...best }],
    ["标准交期（天）", "21", { text: "12", ...best }, "28"],
    ["批次硬度波动（HRC）", "±1.5", { text: "±0.8", ...best }, "±2.2"],
    ["近 12 个月退货率", "2.1%", { text: "0.4%", ...best }, "3.6%"],
    ["最小起订量（kg）", "500", { text: "300", ...best }, "1000"],
    ["近 12 个月交期准时率", "71%", { text: "94%", ...best }, "58%"],
  ], { colW: [2.8, 2.0, 2.0, 2.0], numCols: [1, 2, 3], fontSize: 13, rowH: 0.42, pos: { x: 0.5, y: 1.2, w: 8.8 } });
  D.text(s, "每行标出该维度最优的一家。六维中 B 占五维，C 只在单价上占优。", { x: 0.5, y: 4.3, w: 9, h: 0.3, fontSize: 11, color: P.ink2 });
}

// 4 逐维展开：两张原生柱图，数值直接标在柱上，不靠 hover
{
  const s = D.page("逐维展开：交期与质量");
  const common = {
    showTitle: true, titleFontSize: 12, titleColor: P.ink2, titleFontFace: "+mn-lt",
    showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: P.ink, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 11, catAxisLabelColor: P.ink, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 9, valAxisLabelColor: P.ink3, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: P.line, size: 0.5 }, catGridLine: { style: "none" },
    valAxisLineShow: false, catAxisLineShow: false, barGapWidthPct: 60,
    chartColors: [P.ink3, P.accent, P.ink3],
  };
  s.addChart(pres.ChartType.bar, [ { name: "标准交期（天）", labels: ["供应商 A", "供应商 B", "供应商 C"], values: [21, 12, 28] } ],
    Object.assign({ x: 0.5, y: 1.15, w: 4.3, h: 3.1, title: "标准交期（天）", valAxisMaxVal: 32, valAxisMinVal: 0, dataLabelFormatCode: "0", objectName: "chart-leadtime" }, common));
  s.addChart(pres.ChartType.bar, [ { name: "近 12 个月退货率（%）", labels: ["供应商 A", "供应商 B", "供应商 C"], values: [2.1, 0.4, 3.6] } ],
    Object.assign({ x: 5.2, y: 1.15, w: 4.3, h: 3.1, title: "近 12 个月退货率（%）", valAxisMaxVal: 4, valAxisMinVal: 0, dataLabelFormatCode: "0.0", valAxisLabelFormatCode: "0.0", objectName: "chart-return" }, common));
  D.text(s, "成本：按年采购 12 t 计，B 比 A 多 32,400 元/年，C 比 A 少 42,000 元/年。起订量：B 最小起订 300 kg，适合小批量试模件。",
    { x: 0.5, y: 4.4, w: 9, h: 0.5, fontSize: 11, color: P.ink2 });
}

// 5 什么情况下换选择
{
  const s = D.page("什么情况下换选择");
  D.text(s, "推荐成立的前提：试模排期紧（缓冲 < 2 周），年采购量在 10–15 t。前提变了按下面换：",
    { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 13 });
  const rows = [
    ["年采购量超过 20 t，且交期不是瓶颈", "继续用 A", "A 的单价优势放大到 54,000 元/年以上"],
    ["只做非外观件、预算硬约束、能提前 4 周下单", "换 C", "单价最低，但退货率 3.6%、交期 28 天"],
    ["其余情况", "B", "交期 12 天、退货率 0.4%，多花 32,400 元/年"],
  ];
  D.table(s, ["前提", "选择", "代价或收益"], rows.map((r, i) => [ r[0], { text: r[1], options: { bold: true, color: i === 2 ? P.accent : P.ink } }, r[2] ]),
    { colW: [3.6, 1.4, 4.0], fontSize: 12, rowH: 0.55, pos: { x: 0.5, y: 1.9, w: 9 } });
}

D.save(process.argv[2]);

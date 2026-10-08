// 共享：把 diva-report-skill 的四套主题 + 视觉纪律搬到 pptxgenjs
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL_DIR + "/scripts/apply_theme.js");

// 色板逐字抄自 themes/*.md（去掉 #）
const PALETTES = {
  linen: { paper:"FCFCFB", panel:"FFFFFF", ink:"1C1D1F", ink2:"5B6068", ink3:"8A9099", line:"E3E5E8",
           accent:"2F4B7C", ok:"2E7D5B", warn:"B7791F", bad:"B3261E", head:"Microsoft YaHei", body:"Microsoft YaHei", label:"素纸 Linen" },
  blueprint: { paper:"F7F8FA", panel:"FFFFFF", ink:"14181F", ink2:"4A5568", ink3:"828B98", line:"DDE3EA",
           accent:"0B6E99", ok:"2F7A4F", warn:"A96A12", bad:"A81F1F", head:"Microsoft YaHei", body:"Microsoft YaHei", label:"蓝图 Blueprint" },
  press: { paper:"FFFFFF", panel:"F6F5F3", ink:"111111", ink2:"57544F", ink3:"8D8880", line:"DEDAD4",
           accent:"A61B29", ok:"2C6E49", warn:"9C6510", bad:"A61B29", head:"SimSun", body:"Microsoft YaHei", label:"铅字 Press" },
  slate: { paper:"12151A", panel:"1A1F27", ink:"E6E9EE", ink2:"9AA3B0", ink3:"6B7582", line:"2A3039",
           accent:"4FA3C7", ok:"4FB286", warn:"D9A441", bad:"E06C6C", head:"Microsoft YaHei", body:"Microsoft YaHei", label:"石板 Slate" },
};
const MONO = "Consolas";

// 把 8% 透明度的语义色混到面板色上（表格行底色只能给实色）
function blend(fg, bg, a) {
  const h = (s, i) => parseInt(s.slice(i, i + 2), 16);
  const c = i => Math.round(h(bg, i) * (1 - a) + h(fg, i) * a).toString(16).padStart(2, "0").toUpperCase();
  return c(0) + c(2) + c(4);
}

function newDeck(themeKey, meta) {
  const P = PALETTES[themeKey];
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 × 5.625 in
  pres.title = meta.title;
  pres.author = meta.author || "diva-report-skill 示例";
  const THEME = {
    name: `diva-${themeKey}`, headFontFace: P.head, bodyFontFace: P.body,
    colors: { dk1: P.ink, lt1: P.paper, dk2: P.ink2, lt2: P.panel,
      accent1: P.accent, accent2: P.ok, accent3: P.warn, accent4: P.bad, accent5: P.ink3, accent6: P.line,
      hlink: P.accent, folHlink: P.ink2 },
  };
  pres.theme = { headFontFace: P.head, bodyFontFace: P.body };

  const footer = `${meta.title}　　示例数据，全部虚构`;
  const footerObjs = [
    { text: { text: footer, options: { x: 0.5, y: 5.2, w: 7.6, h: 0.25, fontSize: 9, color: P.ink3, margin: 0, isTextBox: true } } },
  ];
  // 封面：页眉带（标题 / 一句话结论 / 生成时间 + 数据截止 + 范围）
  pres.defineSlideMaster({
    title: "cover", background: { color: P.paper },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.9, w: 9, h: 0.9,
          fontSize: 30, bold: true, color: P.ink, margin: 0, valign: "bottom", align: "left" } } },
      { placeholder: { options: { name: "verdict", type: "body", x: 0.5, y: 2.0, w: 8.2, h: 1.6,
          fontSize: 17, color: P.ink, margin: 0, valign: "top", paraSpaceAfter: 6 } } },
      { placeholder: { options: { name: "meta", type: "body", x: 0.5, y: 4.0, w: 9, h: 0.5,
          fontSize: 11, color: P.ink3, margin: 0, valign: "top" } } },
      ...footerObjs,
    ],
  });
  // 内容页：顶部只放一行标题，不画线、不加色条
  pres.defineSlideMaster({
    title: "content", background: { color: P.paper },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.4, w: 9, h: 0.55,
          fontSize: 22, bold: true, color: P.ink, margin: 0, valign: "middle", align: "left" } } },
      ...footerObjs,
    ],
    slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.25, fontSize: 9, color: P.ink3, align: "right" },
  });

  const api = {
    pres, P, THEME, MONO,
    cover(title, verdictRuns, metaText) {
      const s = pres.addSlide({ masterName: "cover" });
      s.addText(title, { placeholder: "title" });
      s.addText(verdictRuns, { placeholder: "verdict" });
      s.addText(metaText, { placeholder: "meta" });
      return s;
    },
    page(title) {
      const s = pres.addSlide({ masterName: "content" });
      s.addText(title, { placeholder: "title" });
      return s;
    },
    // 状态标签：细边框 + 文字，颜色即语义色，不填底
    tag(s, x, y, text, kind, w) {
      const col = P[kind];
      s.addText(text, { x, y, w: w || 0.62, h: 0.26, fontSize: 10, color: col, align: "center", valign: "middle",
        margin: 0, isTextBox: true, line: { color: col, width: 0.75 }, shape: pres.ShapeType.roundRect, rectRadius: 0.04,
        objectName: `tag-${text}` });
    },
    // 大数字：等宽，只给当前最该被看见的那个值
    big(s, x, y, w, text, unit, color, size) {
      const runs = [{ text, options: { fontSize: size || 30, bold: true, color: color || P.ink, fontFace: MONO } }];
      if (unit) runs.push({ text: " " + unit, options: { fontSize: 11, color: P.ink2 } });
      s.addText(runs, { x, y, w, h: (size || 30) / 72 + 0.2, margin: 0, isTextBox: true, valign: "bottom", objectName: `big-${text}` });
    },
    // 面板：只靠一根线和纸面区分，不用阴影
    panel(s, x, y, w, h, focus) {
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: P.panel },
        line: { color: focus ? P.accent : P.line, width: focus ? 2 : 0.75 }, rectRadius: 0.06, objectName: focus ? "panel-focus" : "panel" });
    },
    text(s, txt, o) {
      s.addText(txt, Object.assign({ margin: 0, isTextBox: true, color: P.ink, fontSize: 13, valign: "top" }, o));
    },
    // 表格：只画横线，不画竖线；表头 ink2；数值列右对齐等宽
    table(s, header, rows, o) {
      const opts = o || {};
      const numCols = new Set(opts.numCols || []);
      const fs = opts.fontSize || 11;
      const border = (bottomW, bottomC) => [
        { type: "none" }, { type: "none" }, { type: "solid", pt: bottomW, color: bottomC }, { type: "none" } ];
      const h = header.map((t, i) => ({ text: t, options: { bold: true, color: P.ink2, fontSize: fs, align: numCols.has(i) ? "right" : "left",
        border: border(1.25, P.line), fill: { color: opts.headFill || P.paper }, valign: "middle", margin: [4, 6, 4, 6] } }));
      const body = rows.map((r, ri) => r.map((c, i) => {
        const cell = typeof c === "object" && c !== null && !Array.isArray(c) ? c : { text: c };
        const rowFill = (opts.rowFill && opts.rowFill[ri]) || P.paper;
        return { text: cell.text, options: Object.assign({ fontSize: fs, color: P.ink, align: numCols.has(i) ? "right" : "left",
          fontFace: (numCols.has(i) && !/[\u4e00-\u9fff]/.test(String(cell.text))) ? MONO : undefined, border: border(0.75, P.line), fill: { color: rowFill }, valign: "middle", margin: [4, 6, 4, 6] }, cell.options || {}) };
      }));
      s.addTable([h, ...body], Object.assign({ x: 0.5, y: 1.15, w: 9, colW: opts.colW, rowH: opts.rowH || 0.32, fontFace: P.body, objectName: "table" }, opts.pos || {}));
    },
    async save(file) {
      await pres.writeFile({ fileName: file });
      await applyTheme(file, THEME);
      console.log("wrote", file);
    },
  };
  return api;
}

module.exports = { newDeck, PALETTES, blend, MONO };

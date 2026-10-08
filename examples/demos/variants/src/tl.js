// 时间线：可缩放，四个方向共用
module.exports = function drawTimeline(D, s, data, o) {
  const { pres, P, MONO } = D;
  const x0 = o.x0, x1 = o.x1, y0 = o.y0, rowGap = o.rowGap || 0.55, labelW = o.labelW || 0.9;
  const fs = o.fontScale || 1, lw = o.lineW || 4;
  const days = d => { const [m, dd] = d.split("-").map(Number); return (m - 8) * 31 + dd; };
  const start = days(data.span[0]), end = days(data.span[1]);
  const X = d => x0 + (days(d) - start) / (end - start) * (x1 - x0);
  const rowsH = data.cells.length * rowGap;
  data.ticks.forEach(t => {
    s.addShape(pres.ShapeType.line, { x: X(t), y: y0 + 0.28, w: 0, h: rowsH + 0.1, line: { color: P.line, width: 0.75 }, objectName: "grid" });
    D.text(s, t, { x: X(t) - 0.4, y: y0, w: 0.8, h: 0.22, fontSize: 8 * fs, color: P.ink3, align: "center", fontFace: MONO });
  });
  const today = X(data.today);
  s.addShape(pres.ShapeType.line, { x: today, y: y0 + 0.22, w: 0, h: rowsH + 0.2, line: { color: P.accent, width: 1.5 }, objectName: "today" });
  D.text(s, "今天 " + data.today, { x: today + 0.05, y: y0 + 0.2, w: 1.1, h: 0.2, fontSize: 8 * fs, color: P.accent, bold: true });
  data.cells.forEach((c, i) => {
    const y = y0 + 0.62 + i * rowGap;
    const col = P[c.kind];
    D.text(s, c.id, { x: x0 - labelW - 0.1, y: y - 0.1, w: labelW, h: 0.2, fontSize: 9.5 * fs, bold: true, align: "right" });
    const line = (a, b, color, dash) => s.addShape(pres.ShapeType.line, { x: X(a), y, w: X(b) - X(a), h: 0, objectName: "seg",
      line: { color, width: lw, dashType: dash ? "sysDot" : "solid" } });
    const node = (d, color) => s.addShape(pres.ShapeType.ellipse, { x: X(d) - 0.06, y: y - 0.06, w: 0.12, h: 0.12, fill: { color: P.paper }, line: { color, width: 1.5 }, objectName: "node" });
    if (c.focus) {
      line(data.span[0], c.planned, col); line(c.planned, data.today, col, true); line(data.today, c.newDate, P.line);
      node(c.planned, col); node(c.newDate, col);
      D.text(s, "计划 " + c.planned + " 已逾期", { x: X(c.planned) - 1.0, y: y + 0.07, w: 2.0, h: 0.2, fontSize: 8 * fs, color: col, align: "center" });
      D.text(s, "新 " + c.next, { x: X(c.newDate) + 0.1, y: y - 0.1, w: 1.5, h: 0.2, fontSize: 8 * fs, color: P.ink2 });
    } else {
      line(data.span[0], data.today, col); line(data.today, c.nodeDate, P.line); node(c.nodeDate, col);
      D.text(s, c.next, { x: X(c.nodeDate) + 0.1, y: y - 0.1, w: 1.5, h: 0.2, fontSize: 8 * fs, color: P.ink2 });
    }
  });
  return y0 + 0.62 + data.cells.length * rowGap;
};

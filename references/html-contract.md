# HTML 技术契约

这几条是**硬约束**，因为报告的使用场景是：内网、离线、转发给别人、打印出来开会。

## 五条不能破的

1. **单文件。** 一个 `.html` 就是全部。CSS 写进 `<style>`，SVG 内联，图片转 data URI。不产出附带的 css/js/图片文件。
2. **零外链。** 没有 `<link rel=stylesheet>`、没有 CDN `<script>`、没有 Google Fonts、没有远程图片。**断网双击能打开**是验收标准。
   - 要图表就**手写内联 SVG**。不要引 Chart.js / Plotly / ECharts。柱、线、环、时间线用 SVG 画几十行就够，还能跟着主题配色走。
   - 要图标就手画 SVG 或用文字符号，不要引图标字体。
3. **能打印。** A4 纵向，页边距 14mm；表格不许跨页断裂；背景色打印时保留。
4. **尽量零 JS。** 折叠用原生 `<details>/<summary>`，不写脚本。确实需要交互（表格排序、筛选）时可以写十几行原生 JS，**不引框架**，且 JS 挂掉时页面内容仍然完整可读。
5. **字体只用系统字体栈。** 中文优先思源黑体/苹方/微软雅黑，英文数字优先系统 UI 字体；等宽只给数字用。

## 无障碍与响应式底线

- 正文与背景对比度 ≥ 4.5:1，大标题 ≥ 3:1。
- 不靠颜色单独表意：状态色旁边要有文字或形状。
- 窗口宽 400px 时不出现横向滚动条（宽表格除外，表格自己套一层 `overflow-x:auto`）。
- `prefers-reduced-motion` 下关掉所有过渡。

## 可以直接抄的骨架

把主题文件里的色板填进 `:root`，其余基本不用动。

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>【报告标题】</title>
<style>
  :root{
    /* ↓ 从 themes/<主题>.md 抄过来 */
    --paper:#FCFCFB; --panel:#FFFFFF; --ink:#1C1D1F; --ink-2:#5B6068; --ink-3:#8A9099;
    --line:#E3E5E8; --accent:#2F4B7C;
    --ok:#2E7D5B; --warn:#B7791F; --bad:#B3261E;
    --sans:"PingFang SC","Source Han Sans SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;
    --mono:"IBM Plex Mono","SFMono-Regular",Consolas,"Liberation Mono",monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font:400 15px/1.65 var(--sans);
       -webkit-font-smoothing:antialiased}
  .wrap{max-width:960px;margin:0 auto;padding:40px 24px 72px}

  /* 页眉带：标题 + 一句话结论 + 两个时间 */
  .head{border-bottom:2px solid var(--ink);padding-bottom:18px;margin-bottom:28px}
  .head h1{margin:0 0 10px;font-size:28px;line-height:1.25;font-weight:700;letter-spacing:-.01em}
  .verdict{font-size:17px;line-height:1.55;max-width:62ch}
  .meta{margin-top:12px;font-size:13px;color:var(--ink-3)}
  .meta b{color:var(--ink-2);font-weight:500}

  h2{margin:38px 0 14px;font-size:19px;font-weight:700;letter-spacing:-.005em}
  h3{margin:22px 0 8px;font-size:15px;font-weight:600}
  p{margin:0 0 12px;max-width:74ch}

  /* 数字：等宽只给数字用 */
  .num{font-family:var(--mono);font-variant-numeric:tabular-nums}

  table{width:100%;border-collapse:collapse;font-size:14px;margin:6px 0 18px}
  th{text-align:left;font-weight:600;color:var(--ink-2);padding:8px 10px;
     border-bottom:1.5px solid var(--line);white-space:nowrap}
  td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
  .scroll{overflow-x:auto}

  .tag{display:inline-block;padding:2px 8px;border-radius:3px;font-size:12.5px;font-weight:500;
       border:1px solid currentColor}
  .t-ok{color:var(--ok)} .t-warn{color:var(--warn)} .t-bad{color:var(--bad)}

  details{border-top:1px solid var(--line);padding:10px 0}
  summary{cursor:pointer;font-size:14px;color:var(--ink-2);list-style:none}
  summary::-webkit-details-marker{display:none}
  summary::before{content:"＋ ";color:var(--ink-3)}
  details[open] summary::before{content:"－ "}

  @media (max-width:560px){ .wrap{padding:24px 16px 48px} .head h1{font-size:23px} }
  @media (prefers-reduced-motion:reduce){ *{transition:none!important;animation:none!important} }
  @media print{
    @page{size:A4 portrait;margin:14mm}
    body{background:#fff;font-size:11.5pt}
    .wrap{max-width:none;padding:0}
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    table,tr,td,th,.card{break-inside:avoid}
    h2{break-after:avoid}
    /* 折叠块摊开（见下方"打印的三个坑") */
    details{break-inside:avoid;content-visibility:visible!important}
    details::details-content{content-visibility:visible!important;block-size:auto!important}
    summary{color:var(--ink);font-weight:600}
    summary::before{content:""}
  }
</style>
</head>
<body>
<div class="wrap">
  <header class="head">
    <h1>【报告标题】</h1>
    <p class="verdict">【一句话结论——读者只看这一句也不会误判】</p>
    <p class="meta"><b>生成</b> 2026-09-11 14:20　<b>数据截止</b> 2026-09-10 18:00　<b>范围</b> 【口径】</p>
  </header>
  <!-- 正文各块 -->
</div>
</body>
</html>
```

## 打印的三个坑

- `break-inside:avoid` 要同时给 `table` 和 `tr`，只给 table 在长表上会失效。
- **折叠块打印时内容会整块消失**，而且这个坑很隐蔽：浏览器隐藏 `<details>` 内容**不是用 `display:none`**，
  所以打印样式里写 `display:block` / `display:revert` **没有任何效果**（实测过，看起来改了其实没改）。
  正确写法是覆盖 `details::details-content` 的 `content-visibility`——骨架里那三行照抄即可。
  改完**一定要用打印预览验一次**，看折叠块的正文是不是真出现了。
- 背景色默认不打印，必须写 `print-color-adjust:exact`，否则状态色块全变白。

## 内联 SVG 图表要点

- 用 `viewBox` + `width:100%;height:auto`，不要写死像素宽度。
- 颜色一律走 `var(--accent)` / `var(--ok)` 等变量，跟主题联动。
- 每个数据点旁边直接标数值，**不做 hover tooltip**——打印出来 tooltip 就没了。
- 坐标轴文字用 `font-size:11` 并显式设 `fill`，不要继承。

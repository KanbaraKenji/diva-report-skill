# 示例：四类报告 × 四套主题，HTML 与 PPT 各一份

所有数据**全部虚构**，共用一个背景：某注塑模具厂的模具开发项目。
四份示例覆盖了六类骨架中的四类（进度 / 审查 / 对比 / 受阻）和全部四套主题。

| # | 报告类型 | 主题 | 主角 | HTML（skill 原生产物） | PPT（同一套骨架与纪律搬到幻灯片） |
|---|---|---|---|---|---|
| 1 | 进度报告 status | 素纸 linen | M-2308 延期 6 天 | `01-status-linen.html` | `01-status-linen.pptx` |
| 2 | 审查报告 audit | 蓝图 blueprint | 12 项中 9 通过 / 2 不通过 / 1 不适用 | `02-audit-blueprint.html` | `02-audit-blueprint.pptx` |
| 3 | 对比报告 comparison | 铅字 press | 推荐供应商 B | `03-comparison-press.html` | `03-comparison-press.pptx` |
| 4 | 受阻报告 blocker | 石板 slate（深色） | 需要采购部 09-15 前确认外协排产 | `04-blocker-slate.html` | `04-blocker-slate.pptx` |

`preview/` 下每份各有两张图：`*-html.jpg` 是网页全页截图，`*-pptx.jpg` 是五页幻灯片拼图。

## 它们是怎么来的

- **HTML**：四个独立的 Agent 各拿一份数据简报，只读 `SKILL.md` 与 `references/`、`themes/`，按 skill 流程写出来。
  每个 Agent 执行时遇到的不清楚、矛盾、缺指引之处都记录在 [`skill-feedback.md`](skill-feedback.md)。
- **PPT**：用 pptxgenjs 把同一套骨架、色板、视觉纪律搬到 16:9 幻灯片，源码在 `pptx-src/`。
  一页一个块，一份一个主角，一种强调色，三档语义色，表格只画横线，图表数值直接标在柱上。

## 重新生成 PPT

```bash
cd examples/demos/pptx-src
npm install pptxgenjs                                   # 只装这一个
export NODE_PATH=$PWD/node_modules
export PPTX_SKILL_DIR=/path/to/anthropic-skills/pptx    # 需要它的 scripts/apply_theme.js 写入主题色
node deck1.js ../01-status-linen.pptx
node deck2.js ../02-audit-blueprint.pptx
node deck3.js ../03-comparison-press.pptx
node deck4.js ../04-blocker-slate.pptx
```

`lib.js` 里是四套主题的色板（逐字抄自 `themes/*.md`）和几个积木：页眉带、状态标签、大数字、面板、只画横线的表格。
字体写的是 Microsoft YaHei / SimSun / Consolas，在 Office 里才会命中；LibreOffice 预览会回退到系统字体。

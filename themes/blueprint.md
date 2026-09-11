# 蓝图 Blueprint（浅色 · 工程技术）

给参数、公差、测试数据用的。冷灰底 + 青蓝，表格只用横线不画框，密排也不显乱。

## 色板

| 变量 | 值 | 说明 |
|---|---|---|
| `--paper` | `#F7F8FA` | 冷灰纸面 |
| `--panel` | `#FFFFFF` | 数据面板 |
| `--ink` | `#14181F` | 正文（对比 16.8:1） |
| `--ink-2` | `#4A5568` | 说明、表头 |
| `--ink-3` | `#828B98` | 单位、脚注 |
| `--line` | `#DDE3EA` | 表格横线、网格 |
| `--accent` | `#0B6E99` | 青蓝——实测值、当前节点 |
| `--ok` | `#2F7A4F` | 合格 |
| `--warn` | `#A96A12` | 临界 |
| `--bad` | `#A81F1F` | 超差 |

## 字体

```css
--sans:"PingFang SC","Source Han Sans SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;
--mono:"IBM Plex Mono","SFMono-Regular",Consolas,"Liberation Mono",monospace;
```

**数值一律走 `--mono` + `font-variant-numeric:tabular-nums`**，小数点对齐是这套主题的重点。

## 特征

- 表格不画竖线，只留横线；超差行整行底色 `#A81F1F` 8% 透明度。
- 规格值和实测值并排，中间不放"/"，用两列。
- 可选：整页底纹一层 24px 网格（`--line` 30% 透明度），**只在有图纸或坐标图时才加**，纯文字页不要。

## 用在哪

技术审查、参数对比、失效分析、试验报告。

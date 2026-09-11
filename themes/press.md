# 铅字 Press（浅色 · 编辑杂志）

给客户看的正式报告。纯白 + 墨黑 + 朱砂，衬线标题配无衬线正文，两族反差明显。
留白给得比另外两套多，一页少放东西。

## 色板

| 变量 | 值 | 说明 |
|---|---|---|
| `--paper` | `#FFFFFF` | 纯白 |
| `--panel` | `#F6F5F3` | 引文/摘要块的浅底 |
| `--ink` | `#111111` | 正文（对比 18.9:1） |
| `--ink-2` | `#57544F` | 图注、说明 |
| `--ink-3` | `#8D8880` | 页码、时间戳 |
| `--line` | `#DEDAD4` | 发丝线 |
| `--accent` | `#A61B29` | 朱砂——结论、关键数字 |
| `--ok` | `#2C6E49` | 正常 |
| `--warn` | `#9C6510` | 注意 |
| `--bad` | `#A61B29` | 异常（与强调色同值，这套里"异常即重点"） |

## 字体

```css
--serif:"Source Han Serif SC","Noto Serif SC","Songti SC","SimSun",Georgia,serif;
--sans:"PingFang SC","Source Han Sans SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;
--mono:"IBM Plex Mono","SFMono-Regular",Consolas,monospace;
```

**标题走 `--serif`，正文走 `--sans`**。两族必须明显不同，否则不如只用一族。
衬线标题的行高压到 1.2，正文放到 1.75。

## 特征

- 一级标题字号拉到 34–40px，与正文拉开三档以上。
- 分节用一根 1px 发丝线，不用色块。
- 正文栏宽控制在 66ch 以内。

⚠️ 这套最容易滑进"报纸风"那条 AI 默认套路。守住两点就不会：**圆角不要归零**（保留 3–4px），**不要密排多栏**（单栏到底）。

## 用在哪

给客户的阶段总结、年度报告、对外白皮书。

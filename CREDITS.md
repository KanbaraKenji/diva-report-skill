# 思路来源

这个技能是**重写**的，不是改别人的仓库——但骨架和纪律来自下面这几份公开工作，逐条记在这里。
它们没有一份能直接拿来用（原因写在各条最后），但每一份都贡献了一块。

## 直接影响本仓库的

### 1. Anthropic 官方技能 `frontend-design`（Apache-2.0）

- 出处：Claude Code / claude.ai 随附的官方公共技能目录，`skills/public/frontend-design/SKILL.md`
- 也可在 Anthropic 公开的技能仓库中找到：<https://github.com/anthropics/skills>
- **借鉴了什么**：`references/visual-rules.md` 的整个「反 AI 味清单」。
  那份官方技能逐条点名了当前 AI 生成页面扎堆的五类默认套路——暖米色配衬线配陶土橙、纯黑配荧光绿、
  报纸分栏、统一圆角卡片堆、以及一串模板腔（ALL-CAPS 眉标 / 中点分隔 / 箭头后缀 / 标题里挑一个词变色）。
  我们把这份清单**改写成中文并按报告场景重排**，另外补了「层级靠字号不靠灰度」「数字优先于形容词」两条本地规矩。
- **为什么不直接用**：它讲的是通用网页设计品味，不含报告结构、不含单文件离线约束，也没有交付前自查清单。

### 2. Anthropic 官方示例技能 `theme-factory`（Apache-2.0）

- 出处：同上，`skills/examples/theme-factory/`
- **借鉴了什么**：「主题＝色板 + 字体配对 + 一句用在哪」这个写法，以及「先给用户看样张再让他选」的流程。
  `themes/_spec.md` 的变量清单是照这个思路立的。
- **为什么不直接用**：它的 10 套主题面向 PPT，字体栈是 DejaVu 这类西文字体，中文环境下会掉字；
  且没有一套是为「打印出来开会」设计的。

### 3. `MarcinDudekDev/claude-report-skill`（MIT）

- <https://github.com/MarcinDudekDev/claude-report-skill>
- **借鉴了什么**：**按报告类型给骨架**这个核心想法，以及其中五类的划分（完工 / 调研 / 审查 / 受阻 / 对比）。
  `references/report-types.md` 就是从这里长出来的；我们加了第六类**进度报告**，
  并把每一类都改写成「按读者的问题顺序排」，每块补了"不能省"的判据。
- **为什么不直接用**：深色 PicoCSS 主题，公司场景不适用（这正是本仓库存在的直接原因）；
  另外它依赖一个 Python CLI 和 `~/claude-reports/` 目录结构，我们要的是 Agent 直接写一个文件。

### 4. `nicobailon/visual-explainer`（MIT）

- <https://github.com/nicobailon/visual-explainer>
- **借鉴了什么**：**单文件、零 CDN、无构建步骤**这条技术路线，以及「复杂内容要靠图讲清楚，
  但图要自己用内联 SVG 画、不引图表库」的做法。`references/html-contract.md` 的五条硬约束受此启发。
- **为什么不直接用**：11 套配色全是程序员向的深色（Dracula / Nord / Tokyo Night 一类），
  面向的是终端输出可视化而不是对外发文。

### 5. `jiji262/claude-design-skill`（MIT）

- <https://github.com/jiji262/claude-design-skill>
- **借鉴了什么**：「先定设计方向、再写代码」的两段式流程，以及瑞士编排那一路的处理方式
  （克制的强调色、发丝线分节、大字号标题拉开层级）——`themes/press.md` 受它影响最大。
- **为什么不直接用**：重心在 deck / landing page / 交互原型，报告骨架要自己补；
  且它的产物常依赖 React + Babel，不满足我们的单文件离线约束。

## 看过但没有采用的

- **`voidful/claude-html-report-skill`**（MIT，<https://github.com/voidful/claude-html-report-skill>）：
  交互做得最足（Chart.js / Plotly 图表、可排序表格、Mermaid、KaTeX），但要发布到 GitHub Pages、
  图表走 CDN——内网离线环境直接出局。它证明了一件事：**报告里的交互，代价是离线可用性**，我们选了后者。
- **Anthropic `web-artifacts-builder`**（Apache-2.0）：React + Vite + Parcel + shadcn/ui 打成单文件。
  产物质量高，但要求跑 npm 构建链；DIVA 的 Agent 运行时只有读写文件与命令行，跑不起来。
- **Anthropic `canvas-design`**（Apache-2.0）：产出海报，刻意「90% 视觉 / 10% 文字」——
  与工程报告要的信息密度正好相反。

## 许可证

本仓库自身为 MIT。上述项目分别为 Apache-2.0 与 MIT，均允许借鉴与再实现。
本仓库的文字、主题色板、CSS 骨架与样例报告为原创编写；**未逐字复制上述任何一份的正文或代码**。

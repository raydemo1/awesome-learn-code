# UI/UX 设计规范: Algorithm RPG Game (Pixel Art 风格)

## 1. 设计理念与参考
- **核心参考**: [CodeDex.io](https://www.codedex.io/)
- **设计风格**: Pixel Art (像素风) / Retro Gaming (复古街机)
- **关键字**: 8-bit, 16-bit, chunky borders (粗边框), dark mode (暗黑模式), nostalgic (怀旧), educational (教育)
- **视觉感受**: 趣味性强，将枯燥的代码学习转化为沉浸式的“勇者斗恶龙”体验。通过硬朗的粗边框、鲜艳的像素色彩和复古字体，打造强烈的游戏感。

## 2. 色彩系统 (Color Palette)
本系统采用深色模式为主 (Dark Mode)，以营造“地牢探险”的沉浸感，同时使用高饱和度的荧光色作为点缀和交互反馈。

| 角色 (Role) | 颜色值 (Hex) | 用途说明 | CSS 变量示例 |
|-------------|--------------|----------|--------------|
| **Background** | `#0F172A` (深藏青) | 页面全局背景，游戏画面的底色 | `--color-background` |
| **Foreground** | `#F8FAFC` (亮白) | 主要文本颜色，保证在暗色背景下的高对比度 | `--color-foreground` |
| **Primary** | `#1E293B` (暗石板) | 容器/卡片的填充背景色 | `--color-primary` |
| **Secondary** | `#334155` (中石板) | 次要容器、代码块背景 | `--color-secondary` |
| **Accent / CTA** | `#39FF14` (霓虹绿) | 核心操作按钮、代表“正确”、“通关”的反馈色 | `--color-accent` |
| **Destructive** | `#EF4444` (像素红) | 错误提示、怪兽攻击特效、扣血警告 | `--color-destructive` |
| **Warning** | `#FFD700` (街机黄) | 提示信息、金币/经验值、特殊高亮 | `--color-warning` |
| **Border / Shadow** | `#000000` (纯黑) | **核心特征**：用于所有卡片、按钮的粗边框和硬投影 | `--color-border` |

## 3. 排版与字体 (Typography)
采用经典的像素复古字体，结合等宽字体以兼顾代码的易读性。

- **主标题字体 (Heading)**: `Press Start 2P` (极其复古的 8-bit 字体，用于大标题、怪兽名称、关卡胜利提示)
- **正文字体 (Body)**: `VT323` 或 `DotGothic16` (适合长文本的像素字体，用于对话框和剧情描述)
- **代码字体 (Code)**: `Fira Code` 或 `JetBrains Mono` (用于右侧代码展示区，保证算法代码的专业性和可读性)

**Google Fonts 引入**:
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
```

## 4. 核心组件规范 (Components)

### 4.1 按钮 (Buttons)
- **视觉特征**: 必须有 `2px` 到 `4px` 的纯黑粗边框 (`border-black`)。
- **立体感**: 不使用模糊的 box-shadow，而是使用**硬阴影 (Hard Drop Shadow)**。例如：`box-shadow: 4px 4px 0px #000000;`
- **交互反馈 (Hover/Active)**:
  - `Hover`: 背景色稍微提亮，或者轻微的像素抖动。
  - `Active (点击)`: 按钮向下向右位移 (`translate-x-[2px] translate-y-[2px]`)，同时硬阴影减小 (`box-shadow: 2px 2px 0px #000000;`)，模拟街机按钮按下的物理真实感。

### 4.2 卡片与对话框 (Cards & Dialogs)
- **Dialog 样式**: 类似经典 JRPG（如宝可梦、塞尔达）的底部对话框。纯色背景（如 `#1E293B`），带纯黑粗边框。
- **内边距**: 留出足够的 Padding（至少 `p-4` 或 `p-6`），避免文本拥挤。
- **打字机特效**: 剧情文本和怪兽的 Feedback 提示，应该使用打字机动画（逐字显示）来增强 RPG 代入感。

### 4.3 进度条与状态 (Status Bars)
- **血条/体力条**: 采用块状（Blocky）的分段式进度条。
- 绿色代表玩家生命值/容错率，红色代表怪兽血量，黄色/蓝色代表时间复杂度（体力）。
- 扣血时需要有经典的“白屏闪烁”或“像素抖动”动画。

## 5. 布局规范 (Layout Structure)
参照 CodeDex 和我们之前的策划案，Web 端采用分栏布局：

- **顶部 (Header)**: 简单的导航，显示当前关卡名称（如 "Level 1: The Two Sum"），以及玩家的全局金币/经验值。
- **左侧 (Game Arena 40%)**:
  - 纯正的像素画风背景。
  - 左边玩家（勇士），右边怪兽。上方显示各自的 Blocky 血条。
- **右侧上 (Algorithm State 35%)**:
  - 数据结构可视化（例如排列成一排的方块代表数组，带箭头的连线代表链表）。
  - 这部分可以做得稍微现代一点，但依然保持粗边框和鲜明的颜色对比。
- **右侧下 (Code Editor 25%)**:
  - 类似 VS Code 的暗黑主题编辑器界面，展示当前执行的代码。
- **底部 (Action Console)**:
  - 占据全宽的 JRPG 对话框样式。
  - 显示 AI 生成的 `question`。
  - 提供 2-4 个巨型的像素风选项按钮供玩家点击。

## 6. 交互与微动效 (Micro-interactions)
- **Sprite Animation (精灵图动画)**: 角色待机时（Idle）需要有 2-4 帧的呼吸动画；攻击时有挥剑帧。
- **Cursor (光标)**: 网页的默认鼠标光标可以替换为像素风的剑或法杖图标。
- **Damage Numbers (伤害跳字)**: 答对选项时，怪兽头上弹出红色的 `-20` 并向上飘动消失。

## 7. Anti-patterns (需要避免的错误)
- ❌ **绝对不要使用模糊阴影 (Blurry Shadows)**：如 `shadow-lg`，会破坏像素风的硬朗感。必须使用硬阴影 `shadow-[4px_4px_0_0_rgba(0,0,0,1)]`。
- ❌ **不要使用圆滑的圆角 (Large Border Radius)**：除了特定设计，通常使用 `rounded-none` 或极小的 `rounded-sm`。
- ❌ **避免使用原生 Emoji**：Emoji 的高清矢量质感会破坏像素风格，必须使用像素风的 SVG 图标。
- ❌ **文本对比度过低**：在暗黑模式下，避免使用过暗的灰色文字，确保可读性（遵循 WCAG 4.5:1）。

---
*此文档由 UI-UX-Pro-Max 生成，作为 Algorithm RPG Game 前端开发的视觉宪法。*
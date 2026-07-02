# 齿轮堆栈塔 (Gear Stack Tower)

一个精美的汉诺塔网页游戏，采用 45 度俯视视角的 3D 齿轮设计风格。使用 React、Tailwind CSS 和 Motion 打造了流畅的动画交互效果。

## 游戏特色

- 🎨 拟真的 3D 齿轮和金属/木质底座视觉设计。
- ✨ 丝滑的齿轮移动和选中交互动画。
- ⏱️ 实时记录移动步数和挑战时间，挑战自我极限。
- 🏆 包含完整的游戏结算面板和重置功能。

## 技术栈

- **框架**: React + Vite
- **样式**: Tailwind CSS
- **动画**: Motion (Framer Motion)
- **图标**: Lucide React
- **类型**: TypeScript

## 作者

**sandrone-muou**

## 本地运行

安装依赖 (使用 pnpm):

```bash
pnpm install
```

启动开发服务器:

```bash
pnpm run dev
```

## 游戏规则

1. 每次只能移动一个齿轮。
2. 较大的齿轮不能放置在较小的齿轮上面。
3. 将所有齿轮从初始柱子移动到另一侧的柱子即可获胜。

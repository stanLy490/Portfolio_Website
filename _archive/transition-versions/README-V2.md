# 🎬 无黑屏页面转场系统 V2

## ✅ 完全解决黑屏问题

V2 系统严格遵循正确的转场时序，确保在整个页面跳转过程中用户始终看到可见内容。

## 🔑 核心原理

### 正确的转场时序

```
用户点击链接
    ↓
显示遮罩层（淡入，600ms）
    ↓
遮罩层完全覆盖视口（opacity = 1）
    ↓
设置 sessionStorage 标记
    ↓
执行 window.location.href 跳转
    ↓
新页面的内联脚本立即检测标记
    ↓
立即创建遮罩层（opacity = 1）
    ↓
新页面首帧渲染完成
    ↓
transition-v2.js 加载并接管遮罩层
    ↓
等待页面完全加载（100ms）
    ↓
遮罩层淡出（800ms）
    ↓
移除遮罩层，清理标记
```

### 关键改进

1. **在跳转前遮罩层完全覆盖**
   - 旧版本：淡入动画中就执行跳转
   - V2版本：等待 600ms 淡入完成后才跳转

2. **新页面立即显示遮罩层**
   - 使用内联脚本（在 head 中）
   - 使用 `document.write()` 同步渲染
   - 无需等待外部 JS 加载

3. **简化的遮罩层**
   - 移除复杂的 SVG 闪烁动画
   - 使用纯黑色背景
   - 更快的渲染性能

## 📁 文件结构

```
Transition/
├── transition-v2.js      # 转场系统主逻辑
├── inline-v2.html        # 内联脚本模板（参考）
└── README-V2.md          # 本文档
```

## 🎯 使用方法

### 1. 在页面 head 中添加内联脚本

**必须在 `<head>` 中，越靠前越好**：

```html
<head>
    <meta charset="UTF-8">
    <title>Your Page</title>

    <!-- 🎬 无黑屏转场系统 V2 - 内联脚本 -->
    <style id="transition-inline-style">
      #transition-inline-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #0b0b0b;
        z-index: 999999;
        opacity: 1;
        pointer-events: all;
      }
    </style>
    <script id="transition-inline-script">
    (function() {
      try {
        const isFromTransition = sessionStorage.getItem('transition-active') === 'true';
        const timestamp = parseInt(sessionStorage.getItem('transition-timestamp') || '0');
        const isRecent = (Date.now() - timestamp) < 10000;
        if (isFromTransition && isRecent) {
          document.write('<div id="transition-inline-overlay"></div>');
        }
      } catch (e) {}
    })();
    </script>

    <!-- 其他 head 内容 -->
</head>
```

### 2. 在页面底部引入 transition-v2.js

```html
<body>
    <!-- 页面内容 -->

    <!-- 🎬 页面转场系统 V2 -->
    <script src="../Transition/transition-v2.js"></script>
</body>
```

### 3. 使用转场跳转

```javascript
// 在点击事件中调用
document.getElementById('your-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.PageTransition.navigateTo('target-page.html');
});
```

## 🔧 技术细节

### 遮罩层状态管理

使用 sessionStorage 存储两个标记：
- `transition-active`: 'true' | null
- `transition-timestamp`: 时间戳（用于过期检查）

标记在 10 秒后自动过期。

### 时间参数

- **淡入时长**: 600ms（遮罩层覆盖时间）
- **等待时长**: 100ms（新页面渲染缓冲）
- **淡出时长**: 800ms（遮罩层消失时间）

可在 `transition-v2.js` 中修改 `FADE_IN_DURATION` 和 `FADE_OUT_DURATION`。

### 降级处理

如果转场系统未加载，会降级为直接跳转：

```javascript
if (window.PageTransition) {
    window.PageTransition.navigateTo(url);
} else {
    window.location.href = url;
}
```

## ✅ 已启用转场的页面

- MainPage/Main.html
- MainPage/page1.html
- MainPage/page2.html
- MainPage/page3.html
- Galaxy/web.html
- Meteorite/index.html
- Meteorite/meteorite2.html

## 🚀 测试转场效果

1. 打开 MainPage/Main.html
2. 点击右下角 "Solar System →"
3. **观察：遮罩层淡入 → 完全覆盖 → 跳转（无黑屏）→ 遮罩层淡出**
4. 点击星球跳转
5. 点击光点返回

整个过程应该完全流畅，**无任何黑屏或闪烁**。

## 🎨 自定义遮罩层样式

可以在内联样式中修改遮罩层背景：

```html
<style id="transition-inline-style">
  #transition-inline-overlay {
    /* 纯色背景 */
    background: #0b0b0b;

    /* 或渐变背景 */
    background: linear-gradient(135deg, #0b0b0b, #1a1a1a);

    /* 其他样式保持不变 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    opacity: 1;
    pointer-events: all;
  }
</style>
```

## ⚠️ 注意事项

1. **内联脚本必须在 head 中**：确保新页面加载时立即显示遮罩层
2. **不要修改 z-index**：必须保持 999999，确保遮罩层始终在最上层
3. **不要在转场中执行其他操作**：转场期间遮罩层会阻止用户交互
4. **确保目标页面也集成了系统**：否则淡出动画无法正常工作

## 🔍 调试

打开浏览器控制台，转场过程中会输出日志：

```
✅ 转场遮罩层已创建
🎬 开始转场: ../Galaxy/web.html
✅ 遮罩层已完全覆盖，准备跳转
✅ 转场遮罩层已立即显示
📥 检测到转场标记，执行淡出
🎬 新页面加载，准备淡出遮罩层
✅ 转场完成
```

---

**V2 系统已完全解决黑屏问题，享受流畅的转场体验！** 🎉

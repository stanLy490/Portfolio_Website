# 🎬 页面转场动画系统

## 功能说明

基于 Main.html Section 0 的视觉效果创建的页面转场动画系统，包含：
- ✅ 旋转圆圈和方框
- ✅ 渐变椭圆背景
- ✅ SVG 闪烁动画
- ✅ 网格背景和暗角效果

## 已启用转场的页面

### 1. Main.html → Galaxy/web.html
- **触发位置**：右下角 "Solar System →" 按钮
- **转场时长**：1500ms (1.5秒)

### 2. Galaxy/web.html → Meteorite 相关页面
- **触发位置**：点击任意星球
- **转场时长**：1500ms (1.5秒)

### 3. Galaxy/web.html → Main.html
- **触发位置**：右下角 "← Back to Main" 按钮
- **转场时长**：1500ms (1.5秒)

### 4. Meteorite/index.html → 其他页面
- **触发位置**：点击任意光点
- **转场时长**：1500ms (1.5秒)

## 如何使用

### 在新页面中添加转场

**步骤1：引入转场系统**

```html
<!-- 在页面底部，body 结束前 -->
<link rel="stylesheet" href="../Transition/pageTransition.css">
<script src="../Transition/pageTransition.js"></script>
```

**步骤2：使用转场跳转**

```javascript
// 方式1：直接调用
window.PageTransition.navigateTo('目标URL.html', 1500);

// 方式2：绑定链接点击事件
document.getElementById('your-link').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('transition-active', 'true');
    window.PageTransition.navigateTo('目标URL.html', 1500);
});
```

**步骤3：确保目标页面也加载了转场系统**

目标页面需要引入转场系统，这样才能正确显示淡出动画。

## 工作原理

1. **点击触发**：用户点击链接
2. **淡入覆盖层**：黑色背景淡入（600ms）
3. **SVG 闪烁**：4个 SVG 图标随机闪烁，旋转元素持续旋转
4. **页面跳转**：1000ms 后跳转到新页面
5. **🔧 内联覆盖层立即显示**：新页面的内联脚本立即显示黑色覆盖层（避免黑屏）
6. **JS 接管转场**：pageTransition.js 加载后继续 SVG 闪烁动画
7. **淡出覆盖层**：新页面完全加载后，转场淡出（800ms）

### 关键技术：内联转场覆盖层

为了**避免页面跳转时的黑屏**，每个页面的 `<head>` 中都内联了一个转场覆盖层：

```html
<!-- 在新页面立即显示黑色覆盖层，无需等待 JS 加载 -->
<style id="inline-transition-style">
    #inline-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: #0b0b0b;
        display: none;
        opacity: 0;
    }
    #inline-transition-overlay.active {
        display: block;
        opacity: 1;
    }
</style>
<script>
    // 检测转场标记，立即显示覆盖层
    if (sessionStorage.getItem('transition-active') === 'true') {
        document.write('<div id="inline-transition-overlay" class="active"></div>');
    }
</script>
```

这确保了**页面跳转时不会出现浏览器原生的白屏/黑屏**，转场效果完全流畅。

## 自定义转场时长

修改 `navigateTo()` 的第二个参数即可：

```javascript
// 快速转场 (1秒)
window.PageTransition.navigateTo('page.html', 1000);

// 慢速转场 (2秒)
window.PageTransition.navigateTo('page.html', 2000);
```

## 文件结构

```
Transition/
├── pageTransition.css    # 转场样式
├── pageTransition.js     # 转场逻辑
└── README.md            # 本文档
```

## 技术细节

- 使用 `sessionStorage` 标记转场状态
- 使用 CSS transitions 和 animations
- SVG 资源从 GitHub 动态加载
- 兼容所有配置了音频系统的页面

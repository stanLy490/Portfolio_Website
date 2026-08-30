# 动态 Sidebar 系统 - 使用说明

## 🎉 新功能概述

现在每个页面都支持**动态 Sidebar**系统：

- ✅ **默认状态**：页面无 Sidebar，图片居中显示
- ✅ **鼠标悬浮**：显示该图片独有的 Sidebar
- ✅ **页面左移**：整个页面平滑左移 15vw，避免 Sidebar 遮挡图片
- ✅ **离开图片**：Sidebar 消失，页面恢复原位
- ✅ **独立内容**：每张图片都有自己的 Sidebar 内容

---

## 📁 更新的文件

### 1. `pageConfig.js` (核心配置文件)
每张图片现在都有一个 `sidebar` 对象：

```javascript
{
    src: '图片URL',
    alt: '图片描述',
    position: { ... },
    zIndex: 10,
    // 🆕 独立 Sidebar 内容
    sidebar: {
        title: 'MEMORY_01',           // 大标题
        subtitle: 'FRAGMENT: A-92',   // 副标题
        description: `                 // 描述（支持HTML）
            <p>SCAN_RESULT::</p>
            <p>Visual data archived...</p>
        `,
        footer: 'COGNITIVE_LOAD: NORMAL'  // 页脚信息
    }
}
```

### 2. `page-common.css` (样式文件)
新增的关键样式：

- `.dynamic-sidebar` - 动态 Sidebar 容器
- `.dynamic-sidebar.active` - Sidebar 激活状态
- `body.sidebar-active` - 页面左移状态
- 响应式适配（移动端 Sidebar 从底部弹出）

### 3. `page-common.js` (交互逻辑)
新增的关键函数：

- `createDynamicSidebar()` - 创建 Sidebar DOM
- `showSidebar(data)` - 显示 Sidebar
- `hideSidebar()` - 隐藏 Sidebar
- 自动绑定鼠标悬浮/离开事件

### 4. `page1.html`, `page2.html`, `page3.html`
移除了静态 `<div id="sidebar">` 元素，Sidebar 现在完全由 JS 动态创建。

---

## 🎨 自定义 Sidebar 内容

打开 `pageConfig.js`，找到对应页面的图片配置：

```javascript
page1: {
    images: [
        {
            src: '...',
            alt: '...',
            position: { ... },
            zIndex: 10,
            
            // 🎯 修改这里的内容
            sidebar: {
                title: '你的标题',
                subtitle: '副标题',
                description: `
                    <p>第一段文字</p>
                    <p style="color: rgba(255, 200, 100, 0.8);">高亮文字</p>
                    <p>第三段文字</p>
                `,
                footer: '页脚信息'
            }
        }
    ]
}
```

### 支持的 HTML 标签
- `<p>` - 段落
- `<br>` - 换行
- `<span style="...">` - 行内样式
- `<strong>` / `<em>` - 加粗/斜体

---

## 🖼️ 页面平移参数调整

### 调整左移距离
在 `page-common.css` 中找到：

```css
/* 当前左移 15vw */
body.sidebar-active {
    transform: translateX(-15vw);
}
```

可以修改为：
- `-10vw` - 轻微左移
- `-20vw` - 更大左移
- `-12.5vw` - 精确调整

### 调整 Sidebar 宽度
在 `pageConfig.js` 的 `sidebarStyle` 中：

```javascript
sidebarStyle: {
    width: '25vw',  // 🎯 修改这里
    background: 'rgba(80, 80, 80, 0.85)',
    backdropBlur: '8px',
    borderColor: 'rgba(255, 255, 255, 0.75)'
}
```

---

## ⚡ 动画速度调整

在 `page-common.css` 中找到：

```css
.dynamic-sidebar {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

body {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
```

调整 `0.6s` 来改变动画速度：
- `0.3s` - 快速（敏捷）
- `0.6s` - 当前速度（平滑）
- `0.9s` - 缓慢（优雅）

---

## 📱 响应式行为

### 桌面端 (>1024px)
- Sidebar 从右侧滑入
- 页面左移 15vw
- 宽度：25vw

### 平板端 (768px - 1024px)
- Sidebar 从右侧滑入
- 页面左移 10vw
- 宽度：35vw

### 移动端 (<768px)
- Sidebar 从底部弹出
- 页面不左移（避免布局混乱）
- 宽度：100%
- 最大高度：60vh

---

## 🐛 调试工具

在浏览器控制台输入：

```javascript
// 查看页面配置
debugPageConfig('page1')

// 手动显示 Sidebar
showSidebar({
    title: 'TEST',
    subtitle: 'DEBUG',
    description: '<p>测试内容</p>',
    footer: 'DEBUG MODE'
})

// 手动隐藏 Sidebar
hideSidebar()
```

---

## 🎯 最佳实践

### 1. Sidebar 内容长度
- **标题 (title)**：1-2 个单词
- **副标题 (subtitle)**：5-15 个字符
- **描述 (description)**：3-6 段，每段 1-2 行
- **页脚 (footer)**：1 行

### 2. 页面平移距离
推荐设置：
- Sidebar 宽度 25vw → 页面左移 12-15vw
- Sidebar 宽度 30vw → 页面左移 15-18vw

### 3. 图片布局
确保图片的 `right` 值留有足够空间：
```javascript
position: {
    right: '28vw',  // ✅ 留出 28vw 给 Sidebar (25vw + 3vw 间隙)
    // ...
}
```

---

## 📊 文件结构

```
项目文件夹/
├── Main.html              (主页)
├── page1.html            (子页面1)
├── page2.html            (子页面2)
├── page3.html            (子页面3)
├── pageConfig.js         (🆕 核心配置 - 包含所有 Sidebar 内容)
├── page-common.js        (🆕 交互逻辑 - 动态 Sidebar 系统)
├── page-common.css       (🆕 样式文件 - 包含左移动画)
└── animationConfig.js    (主页动画配置)
```

---

## ✅ 功能检查清单

- [x] 鼠标悬浮在图片上，Sidebar 从右侧滑入
- [x] 页面同时左移，避免遮挡图片
- [x] 每张图片显示不同的 Sidebar 内容
- [x] 鼠标离开图片，Sidebar 消失，页面恢复
- [x] 移动端响应式适配（底部弹出）
- [x] 平滑的过渡动画
- [x] 可自定义 Sidebar 样式（宽度、背景、模糊度）

---

## 🚀 快速测试

1. 打开 `page1.html`
2. 鼠标移到第一张图片上
3. 观察：
   - ✅ Sidebar 从右侧滑入
   - ✅ 页面左移
   - ✅ 显示该图片的独立内容
4. 鼠标移开
5. 观察：
   - ✅ Sidebar 消失
   - ✅ 页面恢复

---

## 🎨 进阶自定义

### 改变 Sidebar 位置（左侧弹出）
在 `page-common.css` 中：

```css
.dynamic-sidebar {
    right: 0;  /* 改为 left: 0; */
    border-left: 2px solid ...;  /* 改为 border-right: ... */
}

body.sidebar-active {
    transform: translateX(-15vw);  /* 改为 translateX(15vw); */
}
```

### 添加背景模糊
在 `pageConfig.js` 中：

```javascript
sidebarStyle: {
    background: 'rgba(80, 80, 80, 0.85)',
    backdropBlur: '12px',  // 🎯 增加模糊度
    borderColor: 'rgba(255, 255, 255, 0.75)'
}
```

---

## 📞 技术支持

如有问题，请检查浏览器控制台（F12）：
- ✅ 图片加载成功会显示绿色对勾
- ❌ 错误会显示红色警告
- 💡 调试信息帮助诊断问题

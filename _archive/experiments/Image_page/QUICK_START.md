# 快速开始指南

## 🎯 5分钟上手

### Step 1: 添加照片

1. 将照片复制到 `images/` 文件夹
2. 确保照片命名为 `photo1.jpg`, `photo2.jpg` 等

### Step 2: 在浏览器中打开

双击 `index.html` 文件，在浏览器中预览。

### Step 3: 调整照片位置

打开 `index.html`，找到你想调整的照片：

```html
<div class="gallery-item photo-block" data-grid-area="2 / 1 / 4 / 2">
    <img src="images/photo1.jpg" alt="Photo 1">
</div>
```

修改 `data-grid-area` 的值来改变位置。

## 🔢 位置参数速查

`data-grid-area="起始行 / 起始列 / 结束行 / 结束列"`

### 常用位置示例

```
小方块（1×1）：
"2 / 1 / 3 / 2"  → 第2行第1列，占1行1列

横长条（1×2）：
"2 / 1 / 3 / 3"  → 第2行第1列，占1行2列

竖长条（2×1）：
"2 / 1 / 4 / 2"  → 第2行第1列，占2行1列

大方块（2×2）：
"2 / 1 / 4 / 3"  → 第2行第1列，占2行2列
```

## 🎨 常见调整

### 改变背景颜色

`style.css` 第8行：
```css
background: #0a0a0a;  /* 改这里 */
```

推荐颜色：
- 纯黑：`#000000`
- 深灰：`#1a1a1a`
- 深蓝：`#0a0a1a`
- 深紫：`#1a0a1a`

### 改变模糊程度

`style.css` 第35行：
```css
filter: grayscale(100%) blur(2px) brightness(0.4);
```

- 更模糊：`blur(5px)`
- 更清晰：`blur(1px)`
- 无模糊：`blur(0px)`

### 改变放大幅度

`style.css` 第44行：
```css
transform: scale(1.03);
```

- 更明显：`scale(1.08)`
- 更subtle：`scale(1.02)`

## ⌨️ 键盘快捷键

开发调试时可用：

- `Ctrl + 1`：紧凑布局
- `Ctrl + 2`：瀑布流布局
- `F12`：打开控制台（使用API）

## 🐛 遇到问题？

1. **照片不显示**：检查文件路径和文件名
2. **布局错乱**：检查 `data-grid-area` 的数值是否合理
3. **效果不明显**：调整CSS中的filter参数

---

详细说明请查看 `README.md`

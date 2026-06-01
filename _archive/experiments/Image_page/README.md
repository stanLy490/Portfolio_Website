# 照片画廊 - 静态·唤醒

一个艺术感十足的照片展示页面，具有"静态—唤醒"的视觉体验。

## 🎨 视觉特性

- **初始状态**：去色（灰度）、模糊、低亮度、低对比度
- **Hover状态**：恢复彩色、清晰、正常亮度、轻微放大
- **过渡动画**：平滑的0.6秒过渡效果
- **背景**：纯黑 (#0a0a0a) 或深灰 (#1a1a1a)

## 📁 文件结构

```
image_page/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 布局管理脚本
├── images/             # 照片文件夹（放置你的照片）
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
└── README.md           # 本说明文档
```

## 🚀 快速开始

### 1. 添加你的照片

将照片文件放入 `images/` 文件夹中，建议命名为 `photo1.jpg`, `photo2.jpg` 等。

### 2. 调整照片位置

**方法一：直接修改HTML**

在 `index.html` 中，每个照片块都有一个 `data-grid-area` 属性：

```html
<div class="gallery-item photo-block" data-grid-area="2 / 1 / 4 / 2">
    <img src="images/photo1.jpg" alt="Photo 1">
    <div class="caption">作品一</div>
</div>
```

**`data-grid-area` 格式说明**：`row-start / col-start / row-end / col-end`

- `row-start`: 起始行
- `col-start`: 起始列
- `row-end`: 结束行
- `col-end`: 结束列

**示例**：
- `"2 / 1 / 4 / 2"` = 从第2行第1列，到第4行第2列（占2行1列）
- `"1 / 1 / 2 / 3"` = 从第1行第1列，到第2行第3列（占1行2列）

### 3. 调整网格大小

在 `style.css` 中修改网格设置：

```css
.gallery-container {
    grid-template-columns: repeat(3, 1fr);  /* 3列，可改为4列、5列等 */
    gap: 20px;                               /* 间距 */
}
```

## 🎯 高级用法

### 使用JavaScript动态调整

打开浏览器控制台（F12），可以使用以下API：

#### 1. 更新单个照片位置

```javascript
// 更新第3个元素（索引2）的位置
window.galleryAPI.updateItemPosition(2, "3 / 2 / 5 / 3");
```

#### 2. 应用预设布局

```javascript
// 紧凑布局
window.galleryAPI.applyLayout(window.galleryAPI.layouts.compact);

// 瀑布流布局
window.galleryAPI.applyLayout(window.galleryAPI.layouts.masonry);
```

#### 3. 动态添加照片

```javascript
window.galleryAPI.addPhoto(
    "images/new-photo.jpg",  // 图片路径
    "新作品",                 // 说明文字
    "7 / 1 / 8 / 2"          // 网格位置
);
```

#### 4. 动态添加文字块

```javascript
window.galleryAPI.addTextBlock(
    "标题",                   // 标题
    "这里是描述文字",         // 内容
    "5 / 3 / 6 / 4"          // 网格位置
);
```

### 键盘快捷键（开发调试）

- `Ctrl/Cmd + 1`：切换到紧凑布局
- `Ctrl/Cmd + 2`：切换到瀑布流布局
- `Ctrl/Cmd + R`：重新加载页面

## 🎨 自定义样式

### 修改背景颜色

在 `style.css` 中：

```css
body {
    background: #0a0a0a;  /* 改为你喜欢的颜色 */
}
```

### 调整初始模糊/去色程度

在 `style.css` 中找到：

```css
.gallery-item {
    filter: grayscale(100%)        /* 去色程度：0-100% */
            blur(2px)               /* 模糊程度：0-10px */
            brightness(0.4)         /* 亮度：0-1 */
            contrast(0.8);          /* 对比度：0-1 */
}
```

### 调整hover放大比例

```css
.gallery-item:hover {
    transform: scale(1.03);  /* 改为1.05会更明显，1.02会更subtle */
}
```

### 修改过渡速度

```css
.gallery-item {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    /* 改为0.3s会更快，1s会更慢 */
}
```

## 📱 响应式设计

页面已自动适配不同屏幕尺寸：

- **桌面（>1024px）**：3列网格
- **平板（768-1024px）**：2列网格，自动布局
- **手机（<768px）**：1列垂直布局

## 💡 使用技巧

### 快速调整布局的工作流程

1. **预览阶段**：
   - 在浏览器中打开 `index.html`
   - 使用 `Ctrl+1` 和 `Ctrl+2` 快速切换预设布局
   - 观察效果

2. **微调阶段**：
   - 打开浏览器控制台（F12）
   - 使用 `updateItemPosition()` 微调单个照片位置
   - 找到满意的位置

3. **固化阶段**：
   - 将控制台中测试好的位置，复制到 `index.html` 的 `data-grid-area` 属性中
   - 保存文件

### 创建自定义预设布局

在 `script.js` 中添加新的布局配置：

```javascript
const myCustomLayout = [
    {index: 0, gridArea: "1 / 1 / 2 / 4"},  // 标题
    {index: 1, gridArea: "2 / 1 / 3 / 2"},  // 照片1
    // ... 添加更多配置
];

// 然后在控制台使用：
window.galleryAPI.applyLayout(myCustomLayout);
```

## 🎬 示例布局

### 经典网格（3×3）

所有照片大小相同，整齐排列：

```
data-grid-area="row / col / row+1 / col+1"
```

### 瀑布流

大小不一的照片，营造视觉层次感：

```
大照片：data-grid-area="2 / 1 / 4 / 3"  （占2行2列）
小照片：data-grid-area="2 / 3 / 3 / 4"  （占1行1列）
```

### 杂志式

结合大照片、小照片和文字块，类似杂志排版。

## ⚠️ 常见问题

### Q: 照片显示不出来？
A: 检查 `images/` 文件夹中是否有对应的图片文件，确保文件名与HTML中的路径一致。

### Q: 布局错乱？
A: 检查 `data-grid-area` 的值是否合理，确保结束行/列大于起始行/列。

### Q: hover效果不明显？
A: 在 `style.css` 中调整filter值，增加模糊度或降低初始亮度。

### Q: 如何完全关闭某个效果？
A: 在CSS中删除对应的filter：
```css
/* 关闭模糊 */
filter: grayscale(100%) brightness(0.4) contrast(0.8);  /* 移除blur(2px) */

/* 关闭去色 */
filter: blur(2px) brightness(0.4) contrast(0.8);  /* 移除grayscale(100%) */
```

## 📝 扩展建议

- **添加lightbox功能**：点击照片后全屏显示
- **添加图片懒加载**：提升大量照片时的性能
- **添加分类筛选**：按主题、日期等筛选照片
- **添加自动播放**：照片自动依次"唤醒"

## 📄 许可

本项目供个人作品集使用，可自由修改和定制。

---

**Enjoy creating your visual awakening experience! ✨**

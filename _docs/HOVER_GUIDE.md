# Meteorite 页面交互说明

## 🎨 视觉效果

### 默认状态
- **外框文字**：永久白色显示
  - 左上角：标题 (title)
  - 右下角：描述 (description)
- **图片**：正常亮度显示
- **边框**：白色

### Hover 状态（鼠标悬停）
- **外框文字**：保持白色显示（不变）
- **图片**：透明度降低到 30%（变暗）
- **框内文字**：显示白色项目信息（居中）
- **边框**：保持白色（不变）
- **鼠标样式**：变为 pointer

### 点击
- 跳转到配置的页面 (redirectUrl)

---

## 📝 编辑内容接口

在 `Meteorite/index.html` 第 93-229 行，编辑 `IMAGE_DATA` 对象：

```javascript
const IMAGE_DATA = {
    'surface_1.jpg': {
        // 外框文字（永久显示）
        title: 'Anxious Landscape',         // 左上角白色文字
        description: 'Most of my time...',  // 右下角白色文字

        // Hover时框内显示的信息（数组，每个元素一行）
        hoverText: [
            'Unity Game Development',    // 第1行
            'Timeline: 2024-2025',       // 第2行
            'Role: Solo Developer'       // 第3行
        ],

        // 点击跳转的页面
        redirectUrl: '../MainPage/Main.html'
    },
    // ... 其他图片
};
```

---

## ✏️ 修改示例

### 示例 1: 修改某个作品的信息

```javascript
'surface_2.jpg': {
    title: '我的新作品',
    description: '2025年春季展览',
    hoverText: [
        'Interactive Installation',
        'Mixed Media',
        'Exhibited at Gallery XYZ'
    ],
    redirectUrl: '../Image_page/index.html'
},
```

### 示例 2: 简短的 hover 信息

```javascript
'surface_3.jpg': {
    title: 'Minimal Study',
    description: 'Geometric Series',
    hoverText: [
        'Canvas & Code',
        '2025'
    ],
    redirectUrl: '../MainPage/Main.html'
},
```

### 示例 3: 详细的 hover 信息

```javascript
'surface_4.jpg': {
    title: 'Complex Project',
    description: 'Multimedia Installation',
    hoverText: [
        'Interactive Media Art',
        'Arduino + Processing',
        'Motion Sensors',
        'Sound Reactive',
        'Exhibited: Museum of Modern Art',
        'Duration: 3 months'
    ],
    redirectUrl: '../MainPage/Main.html'
},
```

---

## 🎛️ 可调参数

### 图片透明度（hover时）

在 `index.html` 第 825 行：

```javascript
ctx.globalAlpha = 0.3;  // 0.0 = 全透明（纯黑）, 1.0 = 不变暗
```

推荐值：
- `0.2` - 非常暗
- `0.3` - 当前设置（适中）
- `0.5` - 较亮

### Hover 文字大小

在 `index.html` 第 836 行：

```javascript
ctx.font = '12px "Courier New", Courier, monospace';
//          ↑ 修改这个数字
```

### Hover 文字行距

在 `index.html` 第 841 行：

```javascript
const lineHeight = 16;  // 行间距（像素）
```

---

## 📋 完整编辑流程

1. **打开文件**: `Meteorite/index.html`
2. **找到数据**: 搜索 `IMAGE_DATA`（第93行附近）
3. **编辑内容**:
   - 修改 `title` 和 `description`（外框文字）
   - 修改 `hoverText` 数组（框内文字）
   - 修改 `redirectUrl`（跳转页面）
4. **保存**: Ctrl+S
5. **测试**: 刷新浏览器（F5）
6. **验证**:
   - ✓ 外框文字是否正确显示
   - ✓ Hover时图片是否变暗
   - ✓ Hover时框内文字是否显示
   - ✓ 点击是否跳转到正确页面

---

## 🔧 故障排除

### 问题：Hover文字不显示
**检查**：
1. `hoverText` 是否是数组格式 `['line1', 'line2']`
2. 数组是否为空 `[]`

### 问题：图片太暗/太亮
**调整**：
- 找到 `ctx.globalAlpha = 0.3;`
- 改为 `0.2`（更暗）或 `0.5`（更亮）

### 问题：文字重叠
**调整**：
- 找到 `const lineHeight = 16;`
- 增加数值（如 `20`）

### 问题：点击不跳转
**检查**：
- `redirectUrl` 路径是否正确
- 目标页面文件是否存在

---

## 🎨 颜色说明

所有颜色都是黑白灰：
- 外框文字：`white`（永久显示）
- Hover框内文字：`white`（悬停显示）
- 边框：`white`（永久）
- Hover背景：图片变暗（透明度降低）

**不再使用青色/蓝色！**

---

生成时间：2025-12-29

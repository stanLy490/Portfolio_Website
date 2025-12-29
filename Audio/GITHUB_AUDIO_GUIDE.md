# 使用 GitHub 托管音频文件指南

## 📌 为什么使用 GitHub

- ✅ **免费托管**：不需要额外的服务器成本
- ✅ **稳定可靠**：GitHub 全球 CDN 加速
- ✅ **版本控制**：方便管理和更新音频文件
- ✅ **简单易用**：只需获取 Raw URL

---

## 🔗 获取 GitHub 音频链接

### 方法 1: 手动构造链接（推荐）

GitHub Raw URL 格式：
```
https://raw.githubusercontent.com/用户名/仓库名/分支名/路径/文件名.mp3
```

**示例**：
```
https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/music/background.mp3
                           ↑用户名      ↑仓库名              ↑分支  ↑路径           ↑文件名
```

### 方法 2: 从 GitHub 页面获取

1. **上传音频文件**到 GitHub 仓库
   - 导航到你的仓库 (例如 `Portfolio_Website`)
   - 进入目标文件夹 (例如 `assets/music/`)
   - 点击 "Add file" → "Upload files"
   - 拖拽你的音频文件 (如 `background.mp3`)
   - 点击 "Commit changes"

2. **获取 Raw URL**
   - 在 GitHub 仓库中找到你上传的文件
   - 点击文件名打开预览页
   - 点击右上角 "Raw" 按钮
   - 复制地址栏中的 URL

3. **使用 URL**
   ```javascript
   // 复制到代码中
   globalAudio.initBackgroundMusic(
       'https://raw.githubusercontent.com/你的用户名/你的仓库/main/assets/music/background.mp3',
       0.25
   );
   ```

---

## 📂 推荐的文件结构

在你的 GitHub 仓库中创建以下结构：

```
你的仓库/
├── assets/
│   ├── music/              # 背景音乐
│   │   ├── background.mp3
│   │   ├── background_alt.mp3
│   │   └── ambient.mp3
│   └── sounds/             # 音效
│       ├── click.mp3
│       ├── hover.mp3
│       ├── success.mp3
│       └── error.mp3
```

---

## 🎵 使用示例

### 示例 1: 基本用法

假设你的 GitHub 信息：
- 用户名：`stanLy490`
- 仓库名：`Portfolio_Website`
- 分支：`main`

**文件路径**：`assets/music/background.mp3`

**完整 URL**：
```
https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/music/background.mp3
```

**在代码中使用**：
```javascript
// Galaxy/web.html
window.addEventListener('load', () => {
    globalAudio.initBackgroundMusic(
        'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/music/background.mp3',
        0.25  // 音量
    );

    sfx.preloadBatch({
        'click': 'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/sounds/click.mp3',
        'hover': 'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/sounds/hover.mp3'
    });
});
```

### 示例 2: 使用变量简化管理

**创建配置文件** `Audio/audioConfig.js`：

```javascript
// ===================================================================
// 音频配置文件 - 集中管理所有音频 URL
// ===================================================================

const AUDIO_CONFIG = {
    // GitHub 基础 URL
    GITHUB_BASE: 'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main',

    // 背景音乐
    music: {
        background: '/assets/music/background.mp3',
        ambient: '/assets/music/ambient.mp3',
        intense: '/assets/music/intense.mp3'
    },

    // 音效
    sounds: {
        click: '/assets/sounds/click.mp3',
        hover: '/assets/sounds/hover.mp3',
        success: '/assets/sounds/success.mp3',
        error: '/assets/sounds/error.mp3'
    },

    // 获取完整 URL 的辅助函数
    getUrl(category, name) {
        return this.GITHUB_BASE + this[category][name];
    }
};
```

**在页面中使用**：

```html
<!-- 引入配置文件 -->
<script src="../Audio/audioConfig.js"></script>
<script src="../Audio/globalAudio.js"></script>
<script src="../Audio/soundEffects.js"></script>

<script>
    window.addEventListener('load', () => {
        // 使用配置获取 URL
        globalAudio.initBackgroundMusic(
            AUDIO_CONFIG.getUrl('music', 'background'),
            0.25
        );

        sfx.preloadBatch({
            'click': AUDIO_CONFIG.getUrl('sounds', 'click'),
            'hover': AUDIO_CONFIG.getUrl('sounds', 'hover')
        });
    });
</script>
```

**优点**：
- ✅ 修改 GitHub 用户名/仓库名只需改一处
- ✅ 集中管理所有音频文件
- ✅ 代码更简洁易读

---

## 🎛️ 完整实现示例

### 步骤 1: 创建 `Audio/audioConfig.js`

```javascript
const AUDIO_CONFIG = {
    GITHUB_BASE: 'https://raw.githubusercontent.com/你的用户名/你的仓库名/main',

    music: {
        background: '/assets/music/background.mp3'
    },

    sounds: {
        click: '/assets/sounds/click.mp3',
        hover: '/assets/sounds/hover.mp3'
    },

    getUrl(category, name) {
        return this.GITHUB_BASE + this[category][name];
    }
};
```

### 步骤 2: 更新 `Galaxy/web.html`

```html
<!-- 引入音频系统（按顺序）-->
<script src="../Audio/audioConfig.js"></script>
<script src="../Audio/globalAudio.js"></script>
<script src="../Audio/soundEffects.js"></script>

<!-- 初始化音频系统 -->
<script>
    window.addEventListener('load', () => {
        // 背景音乐
        globalAudio.initBackgroundMusic(
            AUDIO_CONFIG.getUrl('music', 'background'),
            0.25
        );

        // 音效
        sfx.preloadBatch({
            'click': AUDIO_CONFIG.getUrl('sounds', 'click'),
            'hover': AUDIO_CONFIG.getUrl('sounds', 'hover')
        });
    });
</script>
```

---

## ⚠️ 注意事项

### 1. 文件大小限制
- GitHub 单个文件最大 **100MB**
- 建议音频文件：
  - 背景音乐：< 5MB
  - 音效：< 100KB

### 2. 音频格式建议
- **MP3**：兼容性最好，推荐
- **OGG**：压缩率更高
- **WAV**：质量最好但文件大

### 3. 分支选择
- 使用 `main` 或 `master` 分支
- 确保分支名正确（区分大小写）

### 4. 路径注意
- URL 中的路径区分大小写
- 使用 `/` 而不是 `\`
- 确保文件名正确（包括扩展名）

### 5. CORS（跨域）
GitHub Raw 文件支持 CORS，可以直接在网页中使用。

---

## 🔧 故障排除

### 问题 1: 音频无法加载

**检查清单**：
```javascript
// 1. 确认 URL 格式正确
console.log(AUDIO_CONFIG.getUrl('music', 'background'));
// 应该输出完整的 https://raw.githubusercontent.com/... URL

// 2. 在浏览器中直接访问 URL
// 如果能下载文件，说明 URL 正确

// 3. 检查浏览器控制台错误
// F12 → Console 查看错误信息
```

### 问题 2: 404 错误

**可能原因**：
- ❌ 文件未提交到 GitHub
- ❌ 分支名错误（main vs master）
- ❌ 路径或文件名拼写错误
- ❌ 文件名大小写不匹配

**解决方法**：
```javascript
// 检查 URL 各部分
const url = 'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main/assets/music/background.mp3';
//                                           ↑用户名      ↑仓库名              ↑分支  ↑路径正确？
```

### 问题 3: 音频加载慢

**优化方法**：
1. 压缩音频文件（使用 Audacity 等工具）
2. 降低比特率（128-192 kbps 足够）
3. 使用 MP3 格式

---

## 📋 快速参考

### 替换信息清单

在所有示例代码中，替换以下信息：

| 占位符 | 替换为你的信息 | 示例 |
|--------|----------------|------|
| `你的用户名` | GitHub 用户名 | `stanLy490` |
| `你的仓库名` | 仓库名称 | `Portfolio_Website` |
| `main` | 分支名 | `main` 或 `master` |

### URL 模板

```
https://raw.githubusercontent.com/[用户名]/[仓库名]/[分支]/[路径]/[文件名]
```

---

## 🚀 下一步

1. ✅ 上传音频文件到 GitHub 仓库
2. ✅ 获取 Raw URL
3. ✅ 创建 `audioConfig.js` 配置文件
4. ✅ 在页面中引入并初始化
5. ✅ 测试播放

---

生成时间：2025-12-29
版本：v1.0

# Audio 音频系统文件夹

## 📁 文件说明

```
Audio/
├── globalAudio.js           # 全局背景音乐管理器
├── soundEffects.js          # 交互音效管理器
├── audioConfig.js           # 音频配置文件（GitHub URL 集中管理）
├── GITHUB_AUDIO_GUIDE.md    # GitHub 托管音频完整指南
└── README.md                # 本文件
```

---

## 🚀 快速开始

### 步骤 1: 配置 GitHub 音频链接

编辑 `audioConfig.js`，替换为你的 GitHub 信息：

```javascript
const AUDIO_CONFIG = {
    GITHUB_BASE: 'https://raw.githubusercontent.com/你的用户名/你的仓库名/main',
    // 例如：'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main'

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

### 步骤 2: 上传音频到 GitHub

在你的 GitHub 仓库中创建以下结构：

```
你的仓库/
└── assets/
    ├── music/
    │   └── background.mp3      # 上传背景音乐
    └── sounds/
        ├── click.mp3           # 上传点击音效
        └── hover.mp3           # 上传悬停音效
```

### 步骤 3: 在页面中使用

在任何 HTML 页面中：

```html
<!-- 引入音频系统（按顺序）-->
<script src="../Audio/audioConfig.js"></script>
<script src="../Audio/globalAudio.js"></script>
<script src="../Audio/soundEffects.js"></script>

<script>
    window.addEventListener('load', () => {
        // 初始化背景音乐
        globalAudio.initBackgroundMusic(
            AUDIO_CONFIG.getUrl('music', 'background'),
            0.25
        );

        // 预加载音效
        sfx.preloadBatch({
            'click': AUDIO_CONFIG.getUrl('sounds', 'click'),
            'hover': AUDIO_CONFIG.getUrl('sounds', 'hover')
        });
    });
</script>
```

---

## 📖 详细文档

- **GitHub 音频托管完整指南**: [GITHUB_AUDIO_GUIDE.md](./GITHUB_AUDIO_GUIDE.md)
- **音频系统使用手册**: [../AUDIO_GUIDE.md](../AUDIO_GUIDE.md)

---

## 🎵 系统功能

### globalAudio.js - 全局背景音乐
- ✅ 跨页面持续播放
- ✅ 自动保存/恢复播放进度
- ✅ 循环播放
- ✅ localStorage 同步

### soundEffects.js - 交互音效
- ✅ 支持重叠播放
- ✅ 独立音量控制
- ✅ 批量预加载
- ✅ 全局开关

### audioConfig.js - 配置管理
- ✅ 集中管理所有音频 URL
- ✅ 支持 GitHub Raw 链接
- ✅ 简化代码维护

---

## 🔧 API 参考

### 全局背景音乐

```javascript
// 初始化
globalAudio.initBackgroundMusic(url, volume);

// 控制
globalAudio.play();
globalAudio.pause();
globalAudio.toggleMusic();
globalAudio.setVolume(0.5);
globalAudio.isPlaying();
```

### 交互音效

```javascript
// 预加载
sfx.preload('soundName', url);
sfx.preloadBatch({ name1: url1, name2: url2 });

// 播放
sfx.play('soundName');
sfx.play('soundName', 0.5);  // 覆盖音量

// 控制
sfx.setVolume(0.5);
sfx.enable();
sfx.disable();
sfx.toggle();
```

### 配置管理

```javascript
// 获取单个 URL
AUDIO_CONFIG.getUrl('music', 'background');
AUDIO_CONFIG.getUrl('sounds', 'click');

// 获取所有音效
const allSounds = AUDIO_CONFIG.getAllSounds();

// 检查配置
AUDIO_CONFIG.isConfigured();
```

---

## 💡 使用建议

1. **使用 GitHub 托管**
   - 免费、稳定、全球 CDN
   - 不需要本地服务器

2. **文件大小优化**
   - 背景音乐：< 5MB
   - 音效：< 100KB
   - 使用 MP3 格式

3. **音频质量**
   - 背景音乐：128-192 kbps
   - 音效：64-128 kbps

4. **加载策略**
   - 背景音乐：页面加载后立即初始化
   - 音效：使用 `preloadBatch` 批量预加载

---

## 🐛 故障排除

### 音频无法播放？

1. **检查配置**
   ```javascript
   console.log(AUDIO_CONFIG.isConfigured());  // 应该返回 true
   console.log(AUDIO_CONFIG.getUrl('music', 'background'));  // 检查 URL
   ```

2. **测试 URL**
   - 在浏览器中直接访问 URL
   - 应该能下载音频文件

3. **查看控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

### 获取 404 错误？

- ✓ 确认文件已上传到 GitHub
- ✓ 确认分支名正确（main/master）
- ✓ 确认路径拼写正确
- ✓ 确认文件名大小写匹配

---

## 📋 检查清单

上线前检查：

- [ ] 已配置 `audioConfig.js` 中的 GitHub 信息
- [ ] 已上传音频文件到 GitHub 仓库
- [ ] 已在页面中引入音频系统脚本
- [ ] 已测试音频播放功能
- [ ] 已检查浏览器控制台无错误

---

生成时间：2025-12-29
版本：v1.0

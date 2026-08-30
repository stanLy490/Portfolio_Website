# 音频系统使用指南

## 📁 文件结构

```
Portfolio_Website/
├── Audio/                      ✅ 音频系统管理文件夹
│   ├── globalAudio.js          ✅ 全局背景音乐管理器
│   └── soundEffects.js         ✅ 交互音效管理器
├── assets/                     ⚠️ 需要创建 - 音频资源文件夹
│   ├── music/                  ⚠️ 需要创建 - 放置背景音乐
│   │   └── background.mp3      ⚠️ 需要添加您的音乐文件
│   └── sounds/                 ⚠️ 需要创建 - 放置音效文件
│       ├── click.mp3           ⚠️ 需要添加点击音效
│       └── hover.mp3           ⚠️ 需要添加悬停音效
└── Galaxy/
    └── web.html                ✅ 已集成音频系统
```

---

## 🎵 1. 全局背景音乐系统

### 功能特性
- ✅ 跨页面持续播放（不会因页面跳转而中断）
- ✅ 自动保存/恢复播放进度
- ✅ 循环播放
- ✅ localStorage 同步

### 使用方法

#### 在页面中初始化（已在 web.html 中配置）

```javascript
// 在页面加载后初始化
window.addEventListener('load', () => {
    globalAudio.initBackgroundMusic('../assets/music/background.mp3', 0.25);
    //                              ↑ 音乐文件路径              ↑ 音量(0-1)
});
```

#### API 方法

```javascript
// 播放/暂停切换
globalAudio.toggleMusic();

// 单独控制
globalAudio.play();
globalAudio.pause();

// 设置音量 (0-1)
globalAudio.setVolume(0.5);

// 检查是否正在播放
if (globalAudio.isPlaying()) {
    console.log('音乐正在播放');
}
```

---

## 🔊 2. 交互音效系统

### 功能特性
- ✅ 支持同时播放多个音效（重叠播放）
- ✅ 独立音量控制
- ✅ 批量预加载
- ✅ 全局开关

### 使用方法

#### 预加载音效（已在 web.html 中配置）

```javascript
// 单个预加载
sfx.preload('click', '../assets/sounds/click.mp3');

// 批量预加载（推荐）
sfx.preloadBatch({
    'click': '../assets/sounds/click.mp3',
    'hover': '../assets/sounds/hover.mp3',
    'track': '../assets/sounds/track.mp3'
});
```

#### 播放音效（已在 web.js 中集成）

```javascript
// 播放点击音效
sfx.play('click');

// 播放音效并覆盖音量
sfx.play('hover', 0.3);  // 以30%音量播放
```

#### API 方法

```javascript
// 设置全局音效音量
sfx.setVolume(0.5);

// 启用/禁用音效
sfx.enable();
sfx.disable();
sfx.toggle();  // 切换开关

// 检查音效是否已加载
if (sfx.hasSound('click')) {
    sfx.play('click');
}
```

---

## 🚀 快速开始

### 步骤 1: 创建目录结构

```bash
mkdir -p assets/music
mkdir -p assets/sounds
```

### 步骤 2: 添加音频文件

将您的音频文件放入对应目录：
- `assets/music/background.mp3` - 背景音乐
- `assets/sounds/click.mp3` - 点击音效
- `assets/sounds/hover.mp3` - 悬停音效

### 步骤 3: 取消注释初始化代码

在 `Galaxy/web.html` 的第 107-114 行，取消注释：

```javascript
// 当前（注释状态）：
// globalAudio.initBackgroundMusic('../assets/music/background.mp3', 0.25);

// 修改为（取消注释）：
globalAudio.initBackgroundMusic('../assets/music/background.mp3', 0.25);
```

### 步骤 4: 测试

打开浏览器访问 `Galaxy/web.html`：
1. 点击页面任意位置激活音频
2. 悬停在大型小行星上应该听到悬停音效
3. 点击小行星应该听到点击音效
4. 跳转到其他页面时，背景音乐会继续播放（需要在其他页面也初始化）

---

## 🎨 添加音乐控制按钮（可选）

在 `web.html` 的 `<body>` 标签中添加：

```html
<!-- 音乐控制按钮 -->
<button id="musicToggle"
        style="position:fixed; top:20px; right:100px; z-index:1000;
               padding:8px 16px; background:rgba(0,0,0,0.5);
               color:white; border:1px solid rgba(255,255,255,0.3);
               cursor:pointer; font-size:11px;">
    🔊 Music
</button>

<script>
    document.getElementById('musicToggle').addEventListener('click', () => {
        globalAudio.toggleMusic();
        const btn = document.getElementById('musicToggle');
        btn.textContent = globalAudio.isPlaying() ? '🔊 Music' : '🔇 Music';
    });
</script>
```

---

## 🌐 在其他页面中使用

在任何 HTML 页面中添加：

```html
<head>
    <!-- 引入音频系统 -->
    <script src="../Audio/globalAudio.js"></script>
    <script src="../Audio/soundEffects.js"></script>

    <script>
        window.addEventListener('load', () => {
            // 初始化相同的背景音乐（会自动同步播放进度）
            globalAudio.initBackgroundMusic('../assets/music/background.mp3', 0.25);

            // 预加载该页面需要的音效
            sfx.preloadBatch({
                'click': '../assets/sounds/click.mp3'
            });
        });
    </script>
</head>
```

---

## 🎯 当前集成状态

### Galaxy/web.html ✅
- ✅ 点击小行星 → 播放 `click` 音效
- ✅ 鼠标悬停小行星 → 播放 `hover` 音效
- ✅ 背景音乐系统已集成（需添加音频文件）

### 下一步
1. 添加音频文件到 `assets/` 目录
2. 取消 web.html 中的注释
3. 在其他页面（Main.html, Meteorite/index.html 等）中集成音频系统

---

## 🎼 推荐音频格式

- **背景音乐**: MP3 或 OGG，码率 128-192 kbps
- **音效**: MP3 或 WAV，短小精悍（< 1秒）
- **文件大小**: 音效 < 50KB，背景音乐 < 5MB

---

## ⚠️ 浏览器限制

由于浏览器的自动播放策略，音频需要用户交互才能播放：
- 用户点击页面任意位置后，音频才会开始播放
- 系统已自动处理此限制（首次点击后自动播放）

---

## 📖 完整示例

查看 `Galaxy/web.html` 和 `Galaxy/web.js` 获取完整的集成示例。

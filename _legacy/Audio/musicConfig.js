/**
 * ========================================
 * 全局音乐配置文件
 * ========================================
 *
 * 🎵 使用说明：
 * 1. 在这里定义所有音乐资源
 * 2. 为不同的页面组分配音乐
 * 3. 需要换音乐时，只改这一个文件即可！
 *
 * ========================================
 */

// 🎵 音乐库 - 定义所有可用的音乐
const MusicLibrary = {
    // 主题音乐A - MainPage使用
    mainTheme: {
        name: '主题音乐 - 空灵',
        url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/Main.mp3',
        volume: 0.25
    },

    // 主题音乐B - Galaxy/Meteorite使用
    galaxyTheme: {
        name: '银河主题',
        url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/Second.mp3', // 🔧 替换为Galaxy音乐URL
        volume: 0.25
    },

    // 其他音乐（未来扩展）
    ambient1: {
        name: '环境音乐1',
        url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/音乐1.mp3',
        volume: 0.3
    },

    ambient2: {
        name: '环境音乐2',
        url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/音乐2.mp3',
        volume: 0.3
    }
};

// 🗂️ 页面音乐映射 - 定义每个页面使用哪个音乐
const PageMusicMap = {
    // MainPage 文件夹内所有页面使用主题音乐A
    'MainPage/Main.html': 'mainTheme',
    'MainPage/page1.html': 'mainTheme',
    'MainPage/page2.html': 'mainTheme',
    'MainPage/page3.html': 'mainTheme',

    // Galaxy 和 Meteorite 使用主题音乐B
    'Galaxy/web.html': 'galaxyTheme',
    'Meteorite/index.html': 'galaxyTheme',       // ✅ Meteorite 主页面
    'Meteorite/meteorite2.html': 'galaxyTheme',  // Meteorite 子页面

    // 其他页面（未来扩展）
    // 'OtherFolder/page.html': 'ambient1',
};

/**
 * 🔍 根据当前页面路径获取音乐配置
 * @returns {Object} { url, volume, name }
 */
function getMusicForCurrentPage() {
    // 获取当前页面的相对路径
    const currentPath = window.location.pathname;

    // 尝试匹配 PageMusicMap 中的路径
    for (const [pagePath, musicKey] of Object.entries(PageMusicMap)) {
        if (currentPath.includes(pagePath)) {
            const music = MusicLibrary[musicKey];
            if (music) {
                console.log(`🎵 当前页面: ${pagePath} -> 使用音乐: ${music.name}`);
                return music;
            }
        }
    }

    // 如果没有匹配，返回默认音乐
    console.warn('⚠️ 当前页面未配置音乐，使用默认主题');
    return MusicLibrary.mainTheme;
}

/**
 * 🎵 直接获取指定音乐
 * @param {string} musicKey - 音乐库中的键名
 * @returns {Object} { url, volume, name }
 */
function getMusic(musicKey) {
    const music = MusicLibrary[musicKey];
    if (!music) {
        console.error(`❌ 未找到音乐: ${musicKey}`);
        return MusicLibrary.mainTheme;
    }
    return music;
}

/**
 * 🎵 自动初始化音乐（在页面加载时调用）
 */
function autoInitMusic() {
    if (!window.MusicBridge) {
        console.warn('⚠️ MusicBridge 未加载，无法初始化音乐');
        return;
    }

    const music = getMusicForCurrentPage();
    window.MusicBridge.init(music.url, music.volume);

    console.log(`✅ 音乐自动初始化: ${music.name}`);
}

// 导出到全局
if (typeof window !== 'undefined') {
    window.MusicConfig = {
        library: MusicLibrary,
        pageMap: PageMusicMap,
        getMusicForCurrentPage,
        getMusic,
        autoInitMusic
    };
}

console.log('✅ 音乐配置文件已加载');

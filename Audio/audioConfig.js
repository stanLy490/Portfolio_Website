// ===================================================================
// 音频配置文件 - 集中管理所有音频 URL
// 使用说明：将下面的 GitHub 信息替换为你自己的
// ===================================================================

const AUDIO_CONFIG = {
    // ⚠️ 修改这里：替换为你的 GitHub 信息
    GITHUB_BASE: 'https://raw.githubusercontent.com/你的用户名/你的仓库名/main',
    // 示例：'https://raw.githubusercontent.com/stanLy490/Portfolio_Website/main'

    // 背景音乐文件（相对于仓库根目录的路径）
    music: {
        background: '/assets/music/background.mp3',
        ambient: '/assets/music/ambient.mp3',
        // 可以继续添加更多背景音乐
    },

    // 音效文件（相对于仓库根目录的路径）
    sounds: {
        click: '/assets/sounds/click.mp3',
        hover: '/assets/sounds/hover.mp3',
        success: '/assets/sounds/success.mp3',
        error: '/assets/sounds/error.mp3',
        // 可以继续添加更多音效
    },

    /**
     * 获取完整的音频文件 URL
     * @param {string} category - 类别 ('music' 或 'sounds')
     * @param {string} name - 音频名称
     * @returns {string} 完整的 GitHub Raw URL
     */
    getUrl(category, name) {
        if (!this[category] || !this[category][name]) {
            console.warn(`音频配置不存在: ${category}.${name}`);
            return '';
        }
        return this.GITHUB_BASE + this[category][name];
    },

    /**
     * 获取所有音效的批量配置对象
     * @returns {Object} 音效名称到 URL 的映射
     */
    getAllSounds() {
        const result = {};
        for (const [name, path] of Object.entries(this.sounds)) {
            result[name] = this.GITHUB_BASE + path;
        }
        return result;
    },

    /**
     * 检查配置是否已更新（用于开发调试）
     * @returns {boolean} 是否已配置 GitHub 信息
     */
    isConfigured() {
        return !this.GITHUB_BASE.includes('你的用户名');
    }
};

// 开发提醒：检查是否已配置
if (!AUDIO_CONFIG.isConfigured()) {
    console.warn('⚠️ 请在 Audio/audioConfig.js 中配置你的 GitHub 信息！');
}

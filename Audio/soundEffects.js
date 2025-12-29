// ===================================================================
// 音效管理器
// 功能：加载和播放各种交互音效，支持重叠播放
// ===================================================================

class SoundEffectManager {
    constructor() {
        this.sounds = new Map();        // 存储预加载的音效
        this.volume = 0.5;               // 全局音效音量
        this.isEnabled = true;           // 是否启用音效
    }

    /**
     * 预加载音效
     * @param {string} soundName - 音效的唯一标识名
     * @param {string} soundUrl - 音效文件的URL路径
     */
    preload(soundName, soundUrl) {
        const audio = new Audio(soundUrl);
        audio.volume = this.volume;
        audio.preload = 'auto';

        // 监听加载错误
        audio.addEventListener('error', (e) => {
            console.warn(`音效加载失败: ${soundName} (${soundUrl})`);
        });

        this.sounds.set(soundName, audio);
    }

    /**
     * 批量预加载音效
     * @param {Object} soundMap - 音效映射对象 { soundName: soundUrl, ... }
     *
     * @example
     * sfx.preloadBatch({
     *     'click': '../assets/sounds/click.mp3',
     *     'hover': '../assets/sounds/hover.mp3'
     * });
     */
    preloadBatch(soundMap) {
        for (const [name, url] of Object.entries(soundMap)) {
            this.preload(name, url);
        }
    }

    /**
     * 播放音效
     * @param {string} soundName - 要播放的音效名称
     * @param {number|null} volumeOverride - 可选：覆盖全局音量 (0-1)
     */
    play(soundName, volumeOverride = null) {
        if (!this.isEnabled) return;

        const sound = this.sounds.get(soundName);
        if (!sound) {
            console.warn(`音效 "${soundName}" 未加载`);
            return;
        }

        // 克隆音频对象，允许重叠播放同一音效
        const clone = sound.cloneNode();
        clone.volume = volumeOverride !== null ? volumeOverride : this.volume;

        clone.play().catch(e => {
            console.log(`音效 "${soundName}" 播放失败:`, e.message);
        });

        // 播放完成后清理克隆对象
        clone.addEventListener('ended', () => {
            clone.remove();
        });
    }

    /**
     * 设置全局音效音量
     * @param {number} volume - 音量值 (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));

        // 更新所有已加载音效的音量
        this.sounds.forEach(sound => {
            sound.volume = this.volume;
        });
    }

    /**
     * 启用音效
     */
    enable() {
        this.isEnabled = true;
    }

    /**
     * 禁用音效
     */
    disable() {
        this.isEnabled = false;
    }

    /**
     * 切换音效开关
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    /**
     * 检查某个音效是否已加载
     * @param {string} soundName - 音效名称
     * @returns {boolean}
     */
    hasSound(soundName) {
        return this.sounds.has(soundName);
    }

    /**
     * 获取所有已加载的音效名称列表
     * @returns {string[]}
     */
    getSoundNames() {
        return Array.from(this.sounds.keys());
    }

    /**
     * 移除指定音效
     * @param {string} soundName - 音效名称
     */
    removeSound(soundName) {
        this.sounds.delete(soundName);
    }

    /**
     * 清空所有音效
     */
    clear() {
        this.sounds.clear();
    }
}

// 创建全局实例
const sfx = new SoundEffectManager();

// ===================================================================
// 全局背景音乐管理器
// 功能：跨页面持续播放背景音乐，自动保存和恢复播放进度
// ===================================================================

class GlobalAudioManager {
    constructor() {
        this.bgMusic = null;
        this.isMusicEnabled = true;
        this.STORAGE_KEY = 'portfolio_music_state';
    }

    /**
     * 初始化背景音乐
     * @param {string} musicUrl - 音乐文件的URL路径
     * @param {number} volume - 音量 (0-1)，默认0.3
     */
    initBackgroundMusic(musicUrl, volume = 0.3) {
        this.bgMusic = new Audio(musicUrl);
        this.bgMusic.loop = true;
        this.bgMusic.volume = volume;

        // 尝试从上一页面恢复播放状态
        const savedState = this.loadState();
        if (savedState && savedState.isPlaying) {
            this.bgMusic.currentTime = savedState.currentTime || 0;

            // 自动播放（需要用户交互过才能成功）
            this.bgMusic.play().catch(e => {
                console.log('需要用户交互才能播放音乐');
                // 添加一次性点击监听器
                this._addAutoPlayListener();
            });
        }

        // 定期保存播放状态（每秒一次）
        this.saveInterval = setInterval(() => this.saveState(), 1000);

        // 页面卸载时保存状态
        window.addEventListener('beforeunload', () => {
            this.saveState();
            if (this.saveInterval) {
                clearInterval(this.saveInterval);
            }
        });
    }

    /**
     * 添加自动播放监听器（用于首次用户交互）
     * @private
     */
    _addAutoPlayListener() {
        const playOnInteraction = () => {
            if (this.bgMusic && this.bgMusic.paused) {
                this.bgMusic.play().catch(e => console.log('播放失败:', e));
            }
            // 只执行一次
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
        };

        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('keydown', playOnInteraction, { once: true });
    }

    /**
     * 保存播放状态到 localStorage
     */
    saveState() {
        if (!this.bgMusic) return;

        const state = {
            currentTime: this.bgMusic.currentTime,
            isPlaying: !this.bgMusic.paused,
            volume: this.bgMusic.volume,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('无法保存音乐状态:', e);
        }
    }

    /**
     * 从 localStorage 加载播放状态
     * @returns {Object|null} 保存的状态对象，如果过期或不存在则返回null
     */
    loadState() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) return null;

            const state = JSON.parse(saved);

            // 如果超过5秒没更新，认为状态过期
            if (Date.now() - state.timestamp > 5000) {
                return null;
            }

            return state;
        } catch (e) {
            console.warn('无法加载音乐状态:', e);
            return null;
        }
    }

    /**
     * 播放/暂停切换
     */
    toggleMusic() {
        if (!this.bgMusic) return;

        if (this.bgMusic.paused) {
            this.bgMusic.play().catch(e => console.log('播放失败:', e));
        } else {
            this.bgMusic.pause();
        }
        this.saveState();
    }

    /**
     * 播放音乐
     */
    play() {
        if (this.bgMusic && this.bgMusic.paused) {
            this.bgMusic.play().catch(e => console.log('播放失败:', e));
            this.saveState();
        }
    }

    /**
     * 暂停音乐
     */
    pause() {
        if (this.bgMusic && !this.bgMusic.paused) {
            this.bgMusic.pause();
            this.saveState();
        }
    }

    /**
     * 设置音量
     * @param {number} volume - 音量值 (0-1)
     */
    setVolume(volume) {
        if (this.bgMusic) {
            this.bgMusic.volume = Math.max(0, Math.min(1, volume));
            this.saveState();
        }
    }

    /**
     * 获取当前是否正在播放
     * @returns {boolean}
     */
    isPlaying() {
        return this.bgMusic && !this.bgMusic.paused;
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic = null;
        }
    }
}

// 创建全局实例
const globalAudio = new GlobalAudioManager();

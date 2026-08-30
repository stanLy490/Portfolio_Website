/**
 * ========================================
 * 音量控制按钮组件
 * ========================================
 */

class VolumeControl {
    constructor() {
        this.button = null;
        this.isMuted = false;
    }

    create() {
        if (this.button) {
            return;
        }

        this.button = document.createElement('div');
        this.button.className = 'volume-control-btn';
        this.button.title = '点击切换静音';

        this.updateIcon();

        this.button.addEventListener('click', () => {
            this.toggleMute();
        });

        document.body.appendChild(this.button);

        if (window.MusicBridge) {
            window.MusicBridge.onStateChange((state) => {
                this.isMuted = state.isMuted;
                this.updateIcon();
            });
        }

        console.log('✅ 音量控制按钮已创建');
    }

    toggleMute() {
        if (window.MusicBridge) {
            window.MusicBridge.toggleMute();
        }
    }

    updateIcon() {
        if (!this.button) return;

        if (this.isMuted) {
            this.button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            this.button.classList.add('muted');
        } else {
            this.button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            this.button.classList.remove('muted');
        }
    }

    destroy() {
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
    }
}

const volumeControl = new VolumeControl();

if (typeof window !== 'undefined') {
    window.VolumeControl = volumeControl;
}

console.log('✅ VolumeControl 已加载');

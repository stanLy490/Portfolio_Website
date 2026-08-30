/**
 * ========================================
 * 音频播放器桥接脚本
 * ========================================
 */

class MusicPlayerBridge {
    constructor() {
        this.iframe = null;
        this.isReady = false;
        this.currentState = {
            isPlaying: false,
            isMuted: false,
            volume: 0.25
        };
        this.stateCallbacks = [];
    }

    createIframe() {
        if (this.iframe) {
            return;
        }

        this.iframe = document.createElement('iframe');
        this.iframe.src = '../Audio/musicPlayer.html';
        this.iframe.style.display = 'none';
        this.iframe.style.position = 'fixed';
        this.iframe.style.top = '0';
        this.iframe.style.left = '0';
        this.iframe.style.width = '1px';
        this.iframe.style.height = '1px';
        this.iframe.style.border = 'none';
        this.iframe.style.zIndex = '-1';

        document.body.appendChild(this.iframe);

        this.iframe.onload = () => {
            this.isReady = true;
            console.log('✅ 音频播放器iframe已就绪');
        };

        window.addEventListener('message', (event) => {
            if (event.data.action === 'MUSIC_STATE_UPDATE') {
                this.currentState = event.data.data;
                this.notifyStateChange();
            }
        });

        console.log('🎵 正在加载音频播放器iframe...');
    }

    sendMessage(action, data = {}) {
        if (!this.iframe || !this.isReady) {
            console.warn('iframe未就绪，消息将延迟发送');
            setTimeout(() => this.sendMessage(action, data), 100);
            return;
        }

        this.iframe.contentWindow.postMessage({ action, data }, '*');
    }

    init(musicUrl, volume = 0.25) {
        if (!this.iframe) {
            this.createIframe();
        }

        this.sendMessage('INIT_MUSIC', { url: musicUrl, volume });
    }

    play() {
        this.sendMessage('PLAY');
    }

    pause() {
        this.sendMessage('PAUSE');
    }

    toggleMute() {
        this.sendMessage('TOGGLE_MUTE');
    }

    setVolume(volume) {
        this.sendMessage('SET_VOLUME', { volume });
    }

    getState() {
        return this.currentState;
    }

    onStateChange(callback) {
        this.stateCallbacks.push(callback);
    }

    notifyStateChange() {
        this.stateCallbacks.forEach(callback => {
            callback(this.currentState);
        });
    }
}

const MusicBridge = new MusicPlayerBridge();

if (typeof window !== 'undefined') {
    window.MusicBridge = MusicBridge;
}

console.log('✅ MusicBridge 已加载');

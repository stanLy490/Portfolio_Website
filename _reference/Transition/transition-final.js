/**
 * 无黑屏 + 可见动画转场系统 V2
 * 严格时序：淡入 → SVG动画播放 → 跳转 → 新页面动画 → 淡出
 */

class PageTransitionFinal {
    constructor() {
        this.overlay = null;
        this.svgContainer = null;
        this.svgElements = [];
        this.currentSvgIndex = 0;
        this.flashInterval = null;
        this.svgsReady = false; // SVG 加载完成标志

        // 时间配置（毫秒）
        this.FADE_DURATION = 500;        // 淡入淡出时长
        this.ANIMATION_DURATION = 700;   // 旧页面动画播放时长
        this.NEW_PAGE_ANIMATION = 500;   // 新页面动画播放时长

        // SVG 路径（与 Main.html Section 0 相同）
        this.svgPaths = [
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image1.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image2.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image3.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image4.svg'
        ];

        this.init();
    }

    async init() {
        this.createOverlay();

        // 预加载 SVG（页面加载时完成）
        await this.loadSVGs();

        console.log('✅ 转场系统初始化完成');
    }

    createOverlay() {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.id = 'transition-overlay-final';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0b0b0b;
            z-index: 999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity ${this.FADE_DURATION}ms ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 创建 SVG 容器（与 Section 0 相同的结构）
        this.svgContainer = document.createElement('div');
        this.svgContainer.id = 'transition-svg-container';
        this.svgContainer.innerHTML = `
            <!-- 渐变椭圆背景 -->
            <div id="transition-gradient-ellipse"></div>

            <!-- SVG 层 -->
            <svg id="transition-svg1" class="transition-svg-icon"></svg>
            <svg id="transition-svg2" class="transition-svg-icon"></svg>
            <svg id="transition-svg3" class="transition-svg-icon"></svg>
            <svg id="transition-svg4" class="transition-svg-icon"></svg>

            <!-- 旋转的圆圈 -->
            <svg class="transition-rotating-circleone" width="350" height="350" viewBox="0 0 300 300">
                <circle cx="150" cy="165" r="135" fill="none" stroke="white" stroke-width="1" />
            </svg>

            <svg class="transition-rotating-circletwo" width="350" height="350" viewBox="0 0 300 300">
                <circle cx="150" cy="165" r="135" fill="none" stroke="white" stroke-width="1" />
            </svg>

            <!-- 旋转的正方形 -->
            <svg class="transition-rotating-square" width="350" height="350" viewBox="0 0 300 300">
                <rect x="30" y="30" width="270" height="270" fill="none" stroke="white" stroke-width="1" />
            </svg>
        `;

        this.overlay.appendChild(this.svgContainer);
        document.body.appendChild(this.overlay);
    }

    /**
     * 预加载 SVG 文件
     */
    async loadSVGs() {
        this.svgElements = [
            document.getElementById('transition-svg1'),
            document.getElementById('transition-svg2'),
            document.getElementById('transition-svg3'),
            document.getElementById('transition-svg4')
        ];

        if (this.svgElements.some(el => el === null)) {
            console.error('❌ 转场 SVG 元素未找到');
            this.svgsReady = false;
            return;
        }

        // 并行加载所有 SVG
        const loadPromises = this.svgPaths.map(async (path, i) => {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const svgText = await response.text();
                this.svgElements[i].innerHTML = svgText;
                return true;
            } catch (error) {
                console.error(`❌ 加载转场 SVG ${i + 1} 失败:`, error);
                return false;
            }
        });

        const results = await Promise.all(loadPromises);
        this.svgsReady = results.every(r => r);

        if (this.svgsReady) {
            console.log('✅ 转场 SVG 资源已全部加载');
        } else {
            console.warn('⚠️ 部分 SVG 加载失败，将使用降级动画');
        }
    }

    /**
     * 导航到新页面
     */
    async navigateTo(url) {
        console.log('🎬 开始转场 →', url);

        // === 步骤1: 淡入遮罩层 ===
        this.overlay.style.pointerEvents = 'all';
        void this.overlay.offsetHeight; // 强制重绘
        this.overlay.style.opacity = '1';

        // 等待淡入完成
        await this.waitForTransition(this.overlay);
        console.log('✅ 遮罩层淡入完成');

        // === 步骤2: 播放 SVG 闪烁动画（如果已加载）===
        if (this.svgsReady) {
            this.startFlashing();
            console.log(`🎬 播放动画 ${this.ANIMATION_DURATION}ms`);
        } else {
            console.log('⚠️ SVG 未加载，仅显示旋转动画');
        }

        // 等待动画播放（600-800ms，可感知时长）
        await this.wait(this.ANIMATION_DURATION);

        // === 步骤3: 设置标记并跳转 ===
        sessionStorage.setItem('transition-active', 'true');
        sessionStorage.setItem('transition-timestamp', Date.now().toString());

        console.log('🔄 执行页面跳转');
        window.location.href = url;
    }

    /**
     * 新页面淡出遮罩层
     */
    async fadeOut() {
        console.log('🎬 新页面：开始淡出动画');

        // === 步骤0: 移除内联遮罩（如果存在）===
        const inlineOverlay = document.getElementById('transition-inline-overlay');
        if (inlineOverlay) {
            inlineOverlay.remove();
            console.log('✅ 已移除内联遮罩');
        }

        // === 步骤1: 确保遮罩层可见 ===
        this.overlay.style.opacity = '1';
        this.overlay.style.pointerEvents = 'all';

        // 等待 SVG 加载完成（最多等待 1 秒）
        let waitCount = 0;
        while (!this.svgsReady && waitCount < 10) {
            await this.wait(100);
            waitCount++;
        }

        // === 步骤2: 播放动画 ===
        if (this.svgsReady) {
            this.startFlashing();
            console.log(`🎬 新页面播放动画 ${this.NEW_PAGE_ANIMATION}ms`);
        }

        // 等待动画播放（400-600ms）
        await this.wait(this.NEW_PAGE_ANIMATION);

        // === 步骤3: 停止动画 ===
        this.stopFlashing();

        // === 步骤4: 淡出遮罩层 ===
        void this.overlay.offsetHeight;
        this.overlay.style.opacity = '0';

        // 等待淡出完成
        await this.waitForTransition(this.overlay);
        console.log('✅ 转场完成');

        // === 步骤5: 清理 ===
        this.overlay.style.pointerEvents = 'none';
        sessionStorage.removeItem('transition-active');
        sessionStorage.removeItem('transition-timestamp');
    }

    /**
     * 开始 SVG 闪烁动画
     */
    startFlashing() {
        if (!this.svgsReady || this.svgElements.length === 0) {
            console.warn('⚠️ SVG 未准备好，无法启动闪烁动画');
            return;
        }

        // 清理之前的动画
        this.stopFlashing();

        // 隐藏所有 SVG
        this.svgElements.forEach(svg => {
            if (svg) {
                svg.style.opacity = 0;
                svg.classList.remove('transition-flashing');
            }
        });

        // 显示第一个 SVG 并触发闪烁
        const currentSVG = this.svgElements[this.currentSvgIndex];
        if (currentSVG) {
            currentSVG.style.opacity = 1;
            currentSVG.classList.add('transition-flashing');
        }

        // 每 900ms 切换到下一个随机 SVG
        this.flashInterval = setInterval(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * this.svgElements.length);
            } while (nextIndex === this.currentSvgIndex && this.svgElements.length > 1);

            this.currentSvgIndex = nextIndex;

            // 隐藏所有
            this.svgElements.forEach(svg => {
                if (svg) {
                    svg.style.opacity = 0;
                    svg.classList.remove('transition-flashing');
                }
            });

            // 显示新的
            const newSVG = this.svgElements[this.currentSvgIndex];
            if (newSVG) {
                newSVG.style.opacity = 1;
                newSVG.classList.add('transition-flashing');
            }
        }, 900);

        console.log('🎬 SVG 闪烁动画已启动');
    }

    /**
     * 停止 SVG 闪烁动画
     */
    stopFlashing() {
        if (this.flashInterval) {
            clearInterval(this.flashInterval);
            this.flashInterval = null;
        }

        // 淡出所有 SVG
        this.svgElements.forEach(svg => {
            if (svg) {
                svg.classList.remove('transition-flashing');
                svg.style.opacity = 0;
            }
        });
    }

    /**
     * 等待 CSS transition 完成
     */
    waitForTransition(element) {
        return new Promise(resolve => {
            const handler = (e) => {
                if (e.target === element && e.propertyName === 'opacity') {
                    element.removeEventListener('transitionend', handler);
                    resolve();
                }
            };
            element.addEventListener('transitionend', handler);

            // 兜底：即使没有 transitionend，也在动画时长后 resolve
            setTimeout(resolve, this.FADE_DURATION + 50);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// === 初始化 ===
let instance = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    instance = new PageTransitionFinal();

    // 检查是否来自转场
    const isFromTransition = sessionStorage.getItem('transition-active') === 'true';
    const timestamp = parseInt(sessionStorage.getItem('transition-timestamp') || '0');
    const isRecent = (Date.now() - timestamp) < 10000;

    if (isFromTransition && isRecent) {
        console.log('📥 检测到转场标记，准备淡出动画');

        // 立即显示遮罩层
        instance.overlay.style.opacity = '1';
        instance.overlay.style.pointerEvents = 'all';

        // 等待页面加载后淡出
        if (document.readyState === 'complete') {
            instance.fadeOut();
        } else {
            window.addEventListener('load', () => instance.fadeOut());
        }
    }
}

// 暴露 API
window.PageTransition = {
    navigateTo: (url) => instance?.navigateTo(url) || (window.location.href = url)
};

console.log('✅ 转场系统已加载');

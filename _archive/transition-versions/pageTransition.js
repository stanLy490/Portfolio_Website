/**
 * ========================================
 * 页面转场动画系统
 * ========================================
 * 提供统一的页面跳转转场动画
 */

class PageTransition {
    constructor() {
        this.overlay = null;
        this.svgElements = [];
        this.currentSvgIndex = 0;
        this.flashInterval = null;
        this.isTransitioning = false;

        // SVG 路径（使用 Main.html 相同的 SVG）
        this.svgPaths = [
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image1.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image2.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image3.svg',
            'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/vitruvian_image4.svg'
        ];

        this.createOverlay();
        this.loadSVGs();
    }

    /**
     * 创建转场覆盖层 DOM
     */
    createOverlay() {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'page-transition-overlay';
        this.overlay.innerHTML = `
            <div class="transition-grid-bg"></div>
            <div class="transition-vignette"></div>

            <div id="transition-svg-container">
                <!-- 渐变椭圆背景 -->
                <div id="transition-gradient-ellipse"></div>

                <!-- SVG 层 -->
                <svg id="transition-svg1" class="transition-svg-icon"></svg>
                <svg id="transition-svg2" class="transition-svg-icon"></svg>
                <svg id="transition-svg3" class="transition-svg-icon"></svg>
                <svg id="transition-svg4" class="transition-svg-icon"></svg>

                <!-- 旋转的圆圈 -->
                <svg class="transition-rotating-circle-one" width="350" height="350" viewBox="0 0 300 300">
                    <circle cx="150" cy="165" r="135" fill="none" stroke="white" stroke-width="1" />
                </svg>

                <svg class="transition-rotating-circle-two" width="350" height="350" viewBox="0 0 300 300">
                    <circle cx="150" cy="165" r="135" fill="none" stroke="white" stroke-width="1" />
                </svg>

                <!-- 旋转的正方形 -->
                <svg class="transition-rotating-square" width="350" height="350" viewBox="0 0 300 300">
                    <rect x="30" y="30" width="270" height="270" fill="none" stroke="white" stroke-width="1" />
                </svg>
            </div>
        `;

        document.body.appendChild(this.overlay);
        console.log('✅ 转场动画覆盖层已创建');
    }

    /**
     * 加载 SVG 文件
     */
    async loadSVGs() {
        this.svgElements = [
            document.getElementById('transition-svg1'),
            document.getElementById('transition-svg2'),
            document.getElementById('transition-svg3'),
            document.getElementById('transition-svg4')
        ];

        if (this.svgElements.some(el => el === null)) {
            console.error('❌ SVG 元素未找到');
            return;
        }

        // 加载所有 SVG
        for (let i = 0; i < this.svgPaths.length; i++) {
            try {
                const response = await fetch(this.svgPaths[i]);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const svgText = await response.text();
                this.svgElements[i].innerHTML = svgText;
            } catch (error) {
                console.error(`❌ 加载 SVG ${i + 1} 失败:`, error);
            }
        }

        console.log('✅ SVG 资源已加载');
    }

    /**
     * 开始 SVG 闪烁动画
     */
    startFlashing() {
        // 隐藏所有 SVG
        this.svgElements.forEach(svg => {
            svg.style.opacity = 0;
            svg.classList.remove('transition-flashing');
        });

        // 显示当前 SVG 并触发闪烁
        const currentSVG = this.svgElements[this.currentSvgIndex];
        currentSVG.style.opacity = 1;
        currentSVG.classList.add('transition-flashing');

        // 每 900ms 切换到下一个随机 SVG
        this.flashInterval = setInterval(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * this.svgElements.length);
            } while (nextIndex === this.currentSvgIndex && this.svgElements.length > 1);

            this.currentSvgIndex = nextIndex;

            // 隐藏所有
            this.svgElements.forEach(svg => {
                svg.style.opacity = 0;
                svg.classList.remove('transition-flashing');
            });

            // 显示新的
            const newSVG = this.svgElements[this.currentSvgIndex];
            newSVG.style.opacity = 1;
            newSVG.classList.add('transition-flashing');
        }, 900);
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
            svg.classList.remove('transition-flashing');
            svg.style.opacity = 0;
        });
    }

    /**
     * 播放转场动画并跳转到新页面
     * @param {string} url - 目标页面 URL
     * @param {number} duration - 转场持续时间（毫秒），默认 1500ms
     */
    async navigateTo(url, duration = 1500) {
        if (this.isTransitioning) {
            console.warn('⚠️ 转场动画正在进行中');
            return;
        }

        this.isTransitioning = true;

        // 🔧 标记转场进行中（新页面会立即显示覆盖层）
        sessionStorage.setItem('transition-active', 'true');
        sessionStorage.setItem('transition-timestamp', Date.now().toString());

        // 淡入覆盖层
        this.overlay.classList.add('active');

        // 等待淡入完成
        await this.wait(600);

        // 开始 SVG 闪烁
        this.startFlashing();

        // 🔧 缩短等待时间，快速跳转（让新页面接管转场）
        await this.wait(400);

        // 跳转页面（不停止闪烁，让新页面继续显示转场）
        window.location.href = url;
    }

    /**
     * 淡出转场（用于页面加载后）
     */
    async fadeOut(duration = 800) {
        // 停止闪烁
        this.stopFlashing();

        // 等待一下
        await this.wait(300);

        // 淡出覆盖层
        this.overlay.classList.remove('active');

        // 等待淡出完成
        await this.wait(duration);

        this.isTransitioning = false;
    }

    /**
     * 工具函数：等待指定时间
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 创建全局实例
const pageTransition = new PageTransition();

// 暴露到全局
if (typeof window !== 'undefined') {
    window.PageTransition = pageTransition;
}

// 🔧 页面加载前立即显示转场（避免黑屏）
// 在 DOMContentLoaded 之前执行，确保覆盖层立即显示
if (sessionStorage.getItem('transition-active') === 'true') {
    // 检查时间戳，避免长时间保留标记
    const timestamp = parseInt(sessionStorage.getItem('transition-timestamp') || '0');
    const now = Date.now();

    // 如果转场标记在10秒内，才显示覆盖层
    if (now - timestamp < 10000) {
        // 立即显示覆盖层（在 PageTransition 实例创建前）
        document.addEventListener('DOMContentLoaded', () => {
            if (pageTransition && pageTransition.overlay) {
                pageTransition.overlay.classList.add('active');
                pageTransition.startFlashing();
            }
        });
    } else {
        // 过期的标记，清除
        sessionStorage.removeItem('transition-active');
        sessionStorage.removeItem('transition-timestamp');
    }
}

// 页面加载完成后淡出转场（如果是从转场进入的）
window.addEventListener('load', () => {
    // 检查是否是通过转场跳转过来的（使用 sessionStorage 标记）
    if (sessionStorage.getItem('transition-active') === 'true') {
        // 等待一下再淡出，确保转场效果完整
        setTimeout(() => {
            pageTransition.fadeOut(800);
            sessionStorage.removeItem('transition-active');
            sessionStorage.removeItem('transition-timestamp');
        }, 500);
    }
});

console.log('✅ 页面转场系统已加载');

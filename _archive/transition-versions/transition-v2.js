/**
 * ========================================
 * 无黑屏页面转场系统 V2
 * ========================================
 *
 * 严格遵循正确的转场时序：
 * 1. 用户点击 → 显示遮罩层（淡入）
 * 2. 遮罩层完全覆盖视口（opacity=1）
 * 3. 执行页面跳转
 * 4. 新页面立即显示遮罩层（在head中内联）
 * 5. 新页面渲染完成 → 淡出遮罩层
 * 6. 移除遮罩层
 *
 * 确保用户始终看到可见内容，无黑屏
 */

class PageTransitionV2 {
    constructor() {
        this.overlay = null;
        this.isTransitioning = false;
        this.FADE_IN_DURATION = 600;   // 淡入时长
        this.FADE_OUT_DURATION = 800;  // 淡出时长

        this.init();
    }

    /**
     * 初始化遮罩层
     */
    init() {
        // 创建遮罩层 DOM
        this.overlay = document.createElement('div');
        this.overlay.id = 'transition-overlay-v2';
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
            transition: opacity ${this.FADE_IN_DURATION}ms ease-in-out;
        `;

        document.body.appendChild(this.overlay);
        console.log('✅ 转场遮罩层已创建');
    }

    /**
     * 导航到新页面
     * @param {string} url - 目标 URL
     */
    async navigateTo(url) {
        if (this.isTransitioning) {
            console.warn('⚠️ 转场进行中，请勿重复触发');
            return;
        }

        this.isTransitioning = true;
        console.log('🎬 开始转场:', url);

        // ===== 步骤1: 显示遮罩层（淡入）=====
        this.overlay.style.pointerEvents = 'all'; // 阻止用户交互
        this.overlay.style.opacity = '0';

        // 强制浏览器重绘
        void this.overlay.offsetHeight;

        // 开始淡入
        this.overlay.style.opacity = '1';

        // ===== 步骤2: 等待遮罩层完全覆盖视口 =====
        await this.wait(this.FADE_IN_DURATION);

        console.log('✅ 遮罩层已完全覆盖，准备跳转');

        // ===== 步骤3: 设置转场标记（新页面会读取）=====
        sessionStorage.setItem('transition-active', 'true');
        sessionStorage.setItem('transition-timestamp', Date.now().toString());

        // ===== 步骤4: 执行页面跳转 =====
        // 关键：此时屏幕已被遮罩层完全覆盖，用户看不到页面切换过程
        window.location.href = url;

        // 注意：跳转后，当前页面会被卸载，以下代码不会执行
        // 新页面的逻辑在 handleNewPageLoad() 中
    }

    /**
     * 处理新页面加载（由新页面调用）
     */
    async handleNewPageLoad() {
        console.log('🎬 新页面加载，准备淡出遮罩层');

        // 确保遮罩层存在
        if (!this.overlay) {
            console.error('❌ 遮罩层不存在');
            this.cleanupTransition();
            return;
        }

        // ===== 步骤5: 等待一小段时间，确保页面已渲染 =====
        await this.wait(100);

        // ===== 步骤6: 淡出遮罩层 =====
        this.overlay.style.transition = `opacity ${this.FADE_OUT_DURATION}ms ease-in-out`;
        this.overlay.style.opacity = '0';

        // ===== 步骤7: 等待淡出完成 =====
        await this.wait(this.FADE_OUT_DURATION);

        // ===== 步骤8: 移除遮罩层和标记 =====
        this.cleanupTransition();

        console.log('✅ 转场完成');
    }

    /**
     * 清理转场状态
     */
    cleanupTransition() {
        if (this.overlay) {
            this.overlay.style.pointerEvents = 'none';
        }

        sessionStorage.removeItem('transition-active');
        sessionStorage.removeItem('transition-timestamp');

        this.isTransitioning = false;
    }

    /**
     * 工具函数：等待指定时间
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== 全局初始化 =====
let transitionInstance = null;

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransition);
} else {
    initTransition();
}

function initTransition() {
    transitionInstance = new PageTransitionV2();

    // 检查是否是转场跳转过来的
    const isFromTransition = sessionStorage.getItem('transition-active') === 'true';
    const timestamp = parseInt(sessionStorage.getItem('transition-timestamp') || '0');
    const isRecent = (Date.now() - timestamp) < 10000; // 10秒内有效

    if (isFromTransition && isRecent) {
        // 这是转场跳转的新页面，执行淡出
        console.log('📥 检测到转场标记，执行淡出');

        // 立即显示遮罩层（opacity=1）
        transitionInstance.overlay.style.opacity = '1';
        transitionInstance.overlay.style.pointerEvents = 'all';

        // 等待页面完全加载后淡出
        if (document.readyState === 'complete') {
            transitionInstance.handleNewPageLoad();
        } else {
            window.addEventListener('load', () => {
                transitionInstance.handleNewPageLoad();
            });
        }
    } else {
        // 普通页面加载，清理过期标记
        sessionStorage.removeItem('transition-active');
        sessionStorage.removeItem('transition-timestamp');
    }
}

// 暴露全局 API
window.PageTransition = {
    navigateTo: (url) => {
        if (transitionInstance) {
            transitionInstance.navigateTo(url);
        } else {
            console.error('❌ 转场系统未初始化');
            window.location.href = url;
        }
    }
};

console.log('✅ 页面转场系统 V2 已加载');

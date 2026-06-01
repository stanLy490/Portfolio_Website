/**
 * ========================================
 * 页面初始化系统（动态 Sidebar 版本）
 * ========================================
 *
 * 🆕 新功能：
 * - 每张图片悬浮时显示独立的 Sidebar
 * - 页面平滑左移，避免 Sidebar 遮挡
 * - 鼠标离开后，Sidebar 消失，页面恢复
 *
 * 主要函数：
 * - initializePage(pageKey) - 主入口函数
 * - renderImages(images, sidebarStyle) - 渲染图片并绑定交互
 * - createDynamicSidebar() - 创建动态 Sidebar DOM
 * - showSidebar(sidebarData) - 显示 Sidebar
 * - hideSidebar() - 隐藏 Sidebar
 */

// 全局变量
let dynamicSidebar = null;
let currentActiveSidebar = null;
let hideTimeout = null; // 🆕 用于防抖的延迟计时器
let imageLightbox = null; // 🆕 图片放大预览容器

/**
 * 主入口函数 - 初始化页面
 * @param {string} pageKey - 页面键名 ('page1', 'page2', 'page3')
 */
function initializePage(pageKey) {
    if (typeof PageConfigs === 'undefined') {
        console.error('❌ PageConfigs 未加载！请确保 pageConfig.js 已正确引入。');
        return;
    }

    const config = PageConfigs[pageKey];

    if (!config) {
        console.error(`❌ 配置未找到: ${pageKey}`);
        console.log('可用的配置:', Object.keys(PageConfigs));
        return;
    }

    console.log(`🚀 正在加载页面: ${pageKey}`);

    // 1. 设置页面标题
    if (config.meta && config.meta.title) {
        document.title = config.meta.title;
    }

    // 2. 🆕 创建动态 Sidebar DOM
    createDynamicSidebar(config.sidebarStyle);

    // 3. 渲染图片（并绑定 Sidebar 交互）
    if (config.images && config.images.length > 0) {
        renderImages(config.images, config.sidebarStyle);
        console.log(`✅ 已渲染 ${config.images.length} 张图片`);
    } else {
        console.warn('⚠️ 未找到图片配置');
    }

    // 4. 🆕 创建图片预览lightbox
    createImageLightbox();

    // 5. 🎵 初始化背景音乐（使用全局配置）
    if (window.MusicConfig) {
        window.MusicConfig.autoInitMusic();
    } else if (config.backgroundMusic && window.MusicBridge) {
        // 降级方案：使用旧的配置方式
        const { url, volume } = config.backgroundMusic;
        window.MusicBridge.init(url, volume);
        console.log(`🎵 背景音乐已初始化（降级模式）: ${url}`);
    }

    // 6. 🔊 创建音量控制按钮
    if (window.VolumeControl) {
        window.VolumeControl.create();
    }

    console.log(`✅ 页面 ${pageKey} 加载完成`);
}

/**
 * 🆕 创建动态 Sidebar DOM 元素
 * @param {Object} sidebarStyle - Sidebar 样式配置
 */
function createDynamicSidebar(sidebarStyle) {
    // 检查是否已存在
    if (dynamicSidebar) {
        return;
    }

    // 创建 Sidebar 容器
    dynamicSidebar = document.createElement('div');
    dynamicSidebar.className = 'dynamic-sidebar';
    dynamicSidebar.id = 'dynamic-sidebar';

    // 设置宽度
    if (sidebarStyle && sidebarStyle.width) {
        dynamicSidebar.style.width = sidebarStyle.width;
    }

    // 应用 CSS 变量样式
    if (sidebarStyle) {
        if (sidebarStyle.background) {
            dynamicSidebar.style.setProperty('--sidebar-bg', sidebarStyle.background);
        }
        if (sidebarStyle.backdropBlur) {
            dynamicSidebar.style.setProperty('--sidebar-blur', sidebarStyle.backdropBlur);
        }
        if (sidebarStyle.borderColor) {
            dynamicSidebar.style.setProperty('--sidebar-border', sidebarStyle.borderColor);
        }
    }

    // 初始 HTML 结构（空内容）
    dynamicSidebar.innerHTML = `
        <div class="sidebar-content">
            <div class="sidebar-subtitle"></div>
            <div class="sidebar-description"></div>
            <div class="sidebar-footer"></div>
        </div>
        <div class="sidebar-title"></div>
    `;

    // 添加到页面
    document.body.appendChild(dynamicSidebar);

    console.log('✅ 动态 Sidebar 已创建');
}

/**
 * 渲染图片并绑定动态 Sidebar 交互
 * @param {Array} images - 图片配置数组
 * @param {Object} sidebarStyle - Sidebar 样式配置
 */
function renderImages(images, sidebarStyle) {
    const container = document.getElementById('image-container');

    if (!container) {
        console.error('❌ 未找到 #image-container 元素');
        return;
    }

    // 清空容器
    container.innerHTML = '';

    images.forEach((img, index) => {
        // 创建图片包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.zIndex = img.zIndex || 10;

        // 应用位置配置
        if (img.position) {
            Object.entries(img.position).forEach(([key, value]) => {
                wrapper.style[key] = value;
            });
        }

        // 🆕 根据类型创建图片或视频元素
        const mediaType = img.type || 'image'; // 默认为图片
        let mediaElement;

        if (mediaType === 'video') {
            // 创建视频元素
            mediaElement = document.createElement('video');
            mediaElement.src = img.src;
            mediaElement.className = 'gallery-image';
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
            mediaElement.playsInline = true; // 移动端支持

            // 添加视频加载错误处理
            mediaElement.addEventListener('error', function() {
                console.error(`❌ 视频加载失败: ${img.src}`);
                wrapper.style.background = 'rgba(50, 50, 50, 0.5)';
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';

                const placeholder = document.createElement('div');
                placeholder.style.color = 'rgba(255, 255, 255, 0.3)';
                placeholder.style.fontSize = '12px';
                placeholder.style.textAlign = 'center';
                placeholder.style.padding = '20px';
                placeholder.innerHTML = `VIDEO<br>NOT FOUND<br><span style="font-size: 10px;">${img.alt}</span>`;

                wrapper.appendChild(placeholder);
            });

            mediaElement.addEventListener('loadeddata', function() {
                console.log(`✅ 视频加载成功: ${img.alt}`);
            });
        } else {
            // 创建图片元素
            mediaElement = document.createElement('img');
            mediaElement.src = img.src;
            mediaElement.alt = img.alt || `Image ${index + 1}`;
            mediaElement.className = 'gallery-image';

            // 添加加载错误处理
            mediaElement.addEventListener('error', function() {
                console.error(`❌ 图片加载失败: ${img.src}`);
                wrapper.style.background = 'rgba(50, 50, 50, 0.5)';
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';

                const placeholder = document.createElement('div');
                placeholder.style.color = 'rgba(255, 255, 255, 0.3)';
                placeholder.style.fontSize = '12px';
                placeholder.style.textAlign = 'center';
                placeholder.style.padding = '20px';
                placeholder.innerHTML = `IMAGE<br>NOT FOUND<br><span style="font-size: 10px;">${img.alt}</span>`;

                wrapper.appendChild(placeholder);
            });

            mediaElement.addEventListener('load', function() {
                console.log(`✅ 图片加载成功: ${img.alt}`);
            });
        }

        // 🆕 绑定 Sidebar 交互事件
        if (img.sidebar) {
            // 鼠标进入 - 显示 Sidebar
            wrapper.addEventListener('mouseenter', function() {
                showSidebar(img.sidebar, img.enableSidebarShift);
            });

            // 鼠标离开 - 隐藏 Sidebar
            wrapper.addEventListener('mouseleave', function() {
                hideSidebar();
            });
        }

        // 🆕 绑定点击放大功能（图片和视频都支持）
        if (img.clickable) {
            wrapper.style.cursor = 'pointer';
            wrapper.addEventListener('click', function() {
                openImageLightbox(img.src, img.alt, mediaType);
            });
        }

        wrapper.appendChild(mediaElement);
        container.appendChild(wrapper);
    });
}

/**
 * 🆕 显示 Sidebar
 * @param {Object} sidebarData - Sidebar 内容数据
 * @param {boolean} enableShift - 是否触发页面左移（默认true）
 */
function showSidebar(sidebarData, enableShift = true) {
    if (!dynamicSidebar) {
        console.error('❌ Sidebar DOM 未创建');
        return;
    }

    // 🆕 取消任何待执行的隐藏操作
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    // 更新 Sidebar 内容
    const subtitle = dynamicSidebar.querySelector('.sidebar-subtitle');
    const description = dynamicSidebar.querySelector('.sidebar-description');
    const footer = dynamicSidebar.querySelector('.sidebar-footer');
    const title = dynamicSidebar.querySelector('.sidebar-title');

    if (subtitle) subtitle.textContent = sidebarData.subtitle || '';
    if (description) description.innerHTML = sidebarData.description || '';
    if (footer) footer.textContent = sidebarData.footer || '';
    if (title) title.textContent = sidebarData.title || '';

    // 激活 Sidebar（添加 active 类）
    dynamicSidebar.classList.add('active');

    // 🆕 根据配置决定是否左移页面（避免左侧图片移出屏幕）
    if (enableShift) {
        document.body.classList.add('sidebar-active');
    }

    currentActiveSidebar = sidebarData;
}

/**
 * 🆕 隐藏 Sidebar（带防抖延迟）
 * @param {number} delay - 延迟时间（毫秒），默认300ms
 */
function hideSidebar(delay = 300) {
    if (!dynamicSidebar) {
        return;
    }

    // 🆕 清除之前的延迟（如果有）
    if (hideTimeout) {
        clearTimeout(hideTimeout);
    }

    // 🆕 设置延迟隐藏
    hideTimeout = setTimeout(() => {
        // 移除激活状态
        dynamicSidebar.classList.remove('active');

        // 🆕 页面恢复（移除 body 类）
        document.body.classList.remove('sidebar-active');

        currentActiveSidebar = null;
        hideTimeout = null;
    }, delay);
}

/**
 * 响应式适配
 */
window.addEventListener('resize', function() {
    const width = window.innerWidth;

    if (width < 768) {
        console.log('📱 移动端视图');
    } else if (width < 1024) {
        console.log('📱 平板视图');
    } else {
        console.log('🖥️ 桌面视图');
    }
});

/**
 * 调试工具 - 在控制台显示当前配置
 */
function debugPageConfig(pageKey) {
    if (typeof PageConfigs === 'undefined') {
        console.error('❌ PageConfigs 未加载');
        return;
    }

    const config = PageConfigs[pageKey];

    if (!config) {
        console.error(`❌ 未找到配置: ${pageKey}`);
        return;
    }

    console.group(`📋 ${pageKey} 配置信息`);
    console.log('页面标题:', config.meta?.title);
    console.log('图片数量:', config.images?.length || 0);
    console.log('Sidebar 样式:', config.sidebarStyle);
    console.table(config.images?.map(img => ({
        描述: img.alt,
        位置: `top:${img.position.top || 'auto'} left:${img.position.left || 'auto'}`,
        大小: img.position.width,
        层级: img.zIndex,
        独立Sidebar: img.sidebar ? '是' : '否'
    })));
    console.groupEnd();
}

/**
 * 🆕 创建媒体放大预览容器（支持图片和视频）
 */
function createImageLightbox() {
    if (imageLightbox) {
        return; // 已存在，不重复创建
    }

    imageLightbox = document.createElement('div');
    imageLightbox.className = 'image-lightbox';
    imageLightbox.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-close" title="关闭">×</div>
            <img class="lightbox-image" src="" alt="" style="display: none;">
            <video class="lightbox-video" src="" style="display: none;" controls loop></video>
            <div class="lightbox-caption"></div>
        </div>
    `;

    document.body.appendChild(imageLightbox);

    // 绑定关闭事件
    const closeBtn = imageLightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeImageLightbox);

    // 点击背景关闭
    imageLightbox.addEventListener('click', function(e) {
        if (e.target === imageLightbox) {
            closeImageLightbox();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageLightbox.classList.contains('active')) {
            closeImageLightbox();
        }
    });

    console.log('✅ 媒体预览lightbox已创建（支持图片和视频）');
}

/**
 * 🆕 打开媒体放大预览（支持图片和视频）
 * @param {string} mediaSrc - 媒体URL
 * @param {string} caption - 说明文字
 * @param {string} mediaType - 媒体类型 ('image' 或 'video')
 */
function openImageLightbox(mediaSrc, caption = '', mediaType = 'image') {
    if (!imageLightbox) {
        console.error('❌ Lightbox未初始化');
        return;
    }

    const img = imageLightbox.querySelector('.lightbox-image');
    const video = imageLightbox.querySelector('.lightbox-video');
    const captionEl = imageLightbox.querySelector('.lightbox-caption');

    // 重置状态
    img.classList.remove('loaded');
    img.style.display = 'none';
    img.src = '';

    video.style.display = 'none';
    video.src = '';
    video.pause();

    // 显示lightbox
    imageLightbox.classList.add('active');

    if (mediaType === 'video') {
        // 显示视频
        video.style.display = 'block';
        video.src = mediaSrc;
        video.load();
        video.play().catch(err => {
            console.warn('视频自动播放失败:', err);
        });
    } else {
        // 显示图片
        img.style.display = 'block';
        img.onload = function() {
            img.classList.add('loaded');
        };
        img.src = mediaSrc;
    }

    captionEl.textContent = caption;

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

/**
 * 🆕 关闭媒体放大预览
 */
function closeImageLightbox() {
    if (!imageLightbox) {
        return;
    }

    const img = imageLightbox.querySelector('.lightbox-image');
    const video = imageLightbox.querySelector('.lightbox-video');

    img.classList.remove('loaded');

    // 停止视频播放
    if (video) {
        video.pause();
        video.src = '';
    }

    imageLightbox.classList.remove('active');

    // 恢复页面滚动
    document.body.style.overflow = '';
}

// 暴露到全局
if (typeof window !== 'undefined') {
    window.debugPageConfig = debugPageConfig;
    window.showSidebar = showSidebar;
    window.hideSidebar = hideSidebar;
    window.openImageLightbox = openImageLightbox;
    window.closeImageLightbox = closeImageLightbox;
}

console.log('✅ page-common.js 已加载（动态 Sidebar + 图片放大 版本）');
console.log('💡 提示：在控制台输入 debugPageConfig("page1") 查看配置详情');

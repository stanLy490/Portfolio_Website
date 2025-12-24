/**
 * ========================================
 * 页面初始化系统
 * ========================================
 *
 * 职责：从配置加载并渲染页面内容
 *
 * 主要函数：
 * - initializePage(pageKey) - 主入口函数
 * - renderImages(images) - 渲染图片网格
 * - renderSidebar(config) - 渲染侧边栏
 * - customizeBackButton(config) - 自定义返回按钮
 */

/**
 * 主入口函数 - 初始化页面
 * @param {string} pageKey - 页面键名 ('page1', 'page2', 'page3')
 */
function initializePage(pageKey) {
    // 检查配置是否存在
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

    // 2. 渲染图片
    if (config.images && config.images.length > 0) {
        renderImages(config.images);
        console.log(`✅ 已渲染 ${config.images.length} 张图片`);
    } else {
        console.warn('⚠️ 未找到图片配置');
    }

    // 3. 渲染侧边栏
    if (config.sidebar && config.sidebar.enabled) {
        renderSidebar(config.sidebar);
        console.log('✅ 侧边栏已渲染');
    } else {
        console.log('ℹ️ 侧边栏已禁用');
    }

    // 4. 自定义返回按钮（可选）
    if (config.backButton) {
        customizeBackButton(config.backButton);
    }

    console.log(`✅ 页面 ${pageKey} 加载完成`);
}

/**
 * 渲染图片
 * @param {Array} images - 图片配置数组
 */
function renderImages(images) {
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

        // 创建图片元素
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = img.alt || `Image ${index + 1}`;
        imgElement.className = 'gallery-image';

        // 添加加载错误处理
        imgElement.addEventListener('error', function() {
            console.error(`❌ 图片加载失败: ${img.src}`);
            // 显示占位符
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

        // 添加加载成功日志
        imgElement.addEventListener('load', function() {
            console.log(`✅ 图片加载成功: ${img.alt}`);
        });

        wrapper.appendChild(imgElement);
        container.appendChild(wrapper);
    });
}

/**
 * 渲染侧边栏
 * @param {Object} config - 侧边栏配置对象
 */
function renderSidebar(config) {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        console.error('❌ 未找到 #sidebar 元素');
        return;
    }

    // 设置位置类名
    sidebar.className = `sidebar position-${config.position || 'right'}`;

    // 设置宽度
    if (config.width) {
        sidebar.style.width = config.width;
    }

    // 应用CSS变量样式
    if (config.style) {
        if (config.style.background) {
            sidebar.style.setProperty('--sidebar-bg', config.style.background);
        }
        if (config.style.backdropBlur) {
            sidebar.style.setProperty('--sidebar-blur', config.style.backdropBlur);
        }
        if (config.style.borderColor) {
            sidebar.style.setProperty('--sidebar-border', config.style.borderColor);
        }
    }

    // 生成HTML内容
    if (config.content) {
        sidebar.innerHTML = `
            <div class="sidebar-content">
                ${config.content.subtitle ?
                    `<div class="sidebar-subtitle">${config.content.subtitle}</div>` :
                    ''}
                ${config.content.description ?
                    `<div class="sidebar-description">${config.content.description}</div>` :
                    ''}
                ${config.content.footer ?
                    `<div class="sidebar-footer">${config.content.footer}</div>` :
                    ''}
            </div>
            ${config.content.title ?
                `<div class="sidebar-title">${config.content.title}</div>` :
                ''}
        `;
    }
}

/**
 * 自定义返回按钮
 * @param {Object} config - 返回按钮配置对象
 */
function customizeBackButton(config) {
    const button = document.querySelector('.back-button');

    if (!button) {
        console.warn('⚠️ 未找到 .back-button 元素');
        return;
    }

    // 设置文本
    if (config.text) {
        button.textContent = config.text;
    }

    // 设置位置
    if (config.position) {
        Object.entries(config.position).forEach(([key, value]) => {
            button.style[key] = value;
        });
    }
}

/**
 * 响应式适配
 */
window.addEventListener('resize', function() {
    // 可在此添加响应式逻辑
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
    console.log('侧边栏启用:', config.sidebar?.enabled ? '是' : '否');
    console.log('侧边栏位置:', config.sidebar?.position || 'N/A');
    console.table(config.images?.map(img => ({
        描述: img.alt,
        位置: `top:${img.position.top || 'auto'} left:${img.position.left || 'auto'}`,
        大小: img.position.width,
        层级: img.zIndex
    })));
    console.groupEnd();
}

// 将调试工具暴露到全局
if (typeof window !== 'undefined') {
    window.debugPageConfig = debugPageConfig;
}

console.log('✅ page-common.js 已加载');
console.log('💡 提示：在控制台输入 debugPageConfig("page1") 查看配置详情');

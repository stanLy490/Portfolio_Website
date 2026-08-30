/**
 * 照片画廊 - 位置管理脚本
 *
 * 功能：
 * 1. 自动应用data-grid-area属性到CSS grid-area
 * 2. 提供便捷的布局调整方法
 * 3. 支持动态添加/移除照片
 */

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function() {
    initGridAreas();
    setupKeyboardShortcuts();
    console.log('📸 照片画廊已加载');
    console.log('💡 提示：修改HTML中的data-grid-area属性可调整照片位置');
});

// ==================== 应用网格区域 ====================

/**
 * 读取data-grid-area属性并应用到元素的grid-area样式
 */
function initGridAreas() {
    const items = document.querySelectorAll('[data-grid-area]');

    items.forEach(item => {
        const gridArea = item.getAttribute('data-grid-area');
        if (gridArea) {
            item.style.gridArea = gridArea;
        }
    });

    console.log(`✓ 已应用 ${items.length} 个网格项的位置`);
}

// ==================== 便捷布局调整方法 ====================

/**
 * 更新单个元素的网格位置
 * @param {Element} element - 要更新的元素
 * @param {string} gridArea - 网格区域值，格式："row-start / col-start / row-end / col-end"
 */
function updateGridPosition(element, gridArea) {
    element.setAttribute('data-grid-area', gridArea);
    element.style.gridArea = gridArea;
}

/**
 * 根据索引更新元素位置
 * @param {number} index - 元素索引（从0开始）
 * @param {string} gridArea - 网格区域值
 */
function updateItemPosition(index, gridArea) {
    const items = document.querySelectorAll('.gallery-item');
    if (items[index]) {
        updateGridPosition(items[index], gridArea);
        console.log(`✓ 已更新第 ${index + 1} 项的位置为: ${gridArea}`);
    }
}

// ==================== 批量布局配置 ====================

/**
 * 应用预设布局配置
 * @param {Array} layoutConfig - 布局配置数组，每项格式：{index: 0, gridArea: "1/1/2/2"}
 */
function applyLayout(layoutConfig) {
    layoutConfig.forEach(config => {
        updateItemPosition(config.index, config.gridArea);
    });
    console.log('✓ 已应用自定义布局配置');
}

// ==================== 预设布局示例 ====================

// 紧凑网格布局
const compactLayout = [
    {index: 0, gridArea: "1 / 1 / 2 / 4"},  // 标题横跨3列
    {index: 1, gridArea: "2 / 1 / 3 / 2"},
    {index: 2, gridArea: "2 / 2 / 3 / 3"},
    {index: 3, gridArea: "2 / 3 / 3 / 4"},
    {index: 4, gridArea: "3 / 1 / 4 / 2"},
    {index: 5, gridArea: "3 / 2 / 4 / 4"},  // 文字块
    {index: 6, gridArea: "4 / 1 / 5 / 3"},
    {index: 7, gridArea: "4 / 3 / 5 / 4"},
    {index: 8, gridArea: "5 / 1 / 6 / 4"},
];

// 瀑布流风格布局
const masonryLayout = [
    {index: 0, gridArea: "1 / 1 / 2 / 3"},  // 标题
    {index: 1, gridArea: "2 / 1 / 4 / 2"},  // 大照片
    {index: 2, gridArea: "2 / 2 / 3 / 4"},
    {index: 3, gridArea: "3 / 2 / 5 / 3"},
    {index: 4, gridArea: "3 / 3 / 4 / 4"},
    {index: 5, gridArea: "4 / 1 / 5 / 2"},  // 文字块
    {index: 6, gridArea: "4 / 3 / 6 / 4"},
    {index: 7, gridArea: "5 / 1 / 6 / 3"},
    {index: 8, gridArea: "6 / 1 / 7 / 4"},
];

// ==================== 键盘快捷键（开发辅助） ====================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + 1: 切换到紧凑布局
        if ((e.ctrlKey || e.metaKey) && e.key === '1') {
            e.preventDefault();
            applyLayout(compactLayout);
            console.log('📐 已切换到紧凑布局');
        }

        // Ctrl/Cmd + 2: 切换到瀑布流布局
        if ((e.ctrlKey || e.metaKey) && e.key === '2') {
            e.preventDefault();
            applyLayout(masonryLayout);
            console.log('📐 已切换到瀑布流布局');
        }

        // Ctrl/Cmd + R: 重新加载原始布局
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            location.reload();
        }
    });

    console.log('⌨️  快捷键已启用:');
    console.log('   Ctrl/Cmd + 1: 紧凑布局');
    console.log('   Ctrl/Cmd + 2: 瀑布流布局');
    console.log('   Ctrl/Cmd + R: 重新加载');
}

// ==================== 动态添加照片 ====================

/**
 * 动态添加新照片到画廊
 * @param {string} imagePath - 图片路径
 * @param {string} caption - 图片说明
 * @param {string} gridArea - 网格位置
 */
function addPhoto(imagePath, caption, gridArea) {
    const container = document.querySelector('.gallery-container');

    const photoBlock = document.createElement('div');
    photoBlock.className = 'gallery-item photo-block';
    photoBlock.setAttribute('data-grid-area', gridArea);
    photoBlock.style.gridArea = gridArea;

    photoBlock.innerHTML = `
        <img src="${imagePath}" alt="${caption}">
        <div class="caption">${caption}</div>
    `;

    container.appendChild(photoBlock);
    console.log(`✓ 已添加照片: ${caption}`);
}

/**
 * 动态添加文字块
 * @param {string} title - 标题
 * @param {string} text - 内容
 * @param {string} gridArea - 网格位置
 */
function addTextBlock(title, text, gridArea) {
    const container = document.querySelector('.gallery-container');

    const textBlock = document.createElement('div');
    textBlock.className = 'gallery-item text-block';
    textBlock.setAttribute('data-grid-area', gridArea);
    textBlock.style.gridArea = gridArea;

    textBlock.innerHTML = `
        <h3>${title}</h3>
        <p>${text}</p>
    `;

    container.appendChild(textBlock);
    console.log(`✓ 已添加文字块: ${title}`);
}

// ==================== 导出全局API ====================

// 将常用函数暴露到全局，方便在控制台调试
window.galleryAPI = {
    updateItemPosition,
    applyLayout,
    addPhoto,
    addTextBlock,
    layouts: {
        compact: compactLayout,
        masonry: masonryLayout
    }
};

console.log('🔧 全局API已就绪: window.galleryAPI');

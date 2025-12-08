// =====================================================================
// ⚠️ 核心修改：请将此链接替换为您图片在 GitHub Pages 或其他主机上的绝对路径
// 示例格式: https://<用户名>.github.io/<仓库名>/
const BASE_URL = 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/';
// =====================================================================

// 存储所有 SVG 文件的完整 URL 链接
const svgPaths = [
    BASE_URL + 'vitruvian_image1.svg',
    BASE_URL + 'vitruvian_image2.svg',
    BASE_URL + 'vitruvian_image3.svg',
    BASE_URL + 'vitruvian_image4.svg'
];

let svgElements = []; // 先定义为空数组，等待 DOM 加载完成后再填充
let currentIndex = 0; // 当前显示的图片索引
const totalDuration = 2000; // 动画总时长 (2000毫秒 = 2秒)

/**
 * 1. 在 DOM 加载完成后获取元素
 * 2. 通过 URL 加载 SVG 内容
 * 3. 启动动画循环
 */
async function initializeSVGs() {
    // 确保 DOM 元素已经就绪后再获取
    svgElements = [
        document.getElementById('svg1'),
        document.getElementById('svg2'),
        document.getElementById('svg3'),
        document.getElementById('svg4')
    ];

    if (svgElements.some(el => el === null)) {
        console.error("SVG 元素 ID 查找失败！请检查 index.html 中的 <svg> ID 是否存在。");
        return;
    }

    // 循环加载每个 SVG 文件的内容 (通过完整的网页链接)
    for (let i = 0; i < svgPaths.length; i++) {
        try {
            console.log(`正在尝试通过链接加载 SVG: ${svgPaths[i]}`);

            // 使用完整的 URL 进行 fetch 请求
            const response = await fetch(svgPaths[i]);

            if (!response.ok) {
                throw new Error(`无法从链接加载文件 (HTTP 状态码: ${response.status})`);
            }

            const svgText = await response.text();

            // 将 SVG 内容插入到对应的 <svg> 元素中
            svgElements[i].innerHTML = svgText;
            console.log(`成功加载 SVG 文件: ${svgPaths[i]}`);
        } catch (error) {
            console.error(`加载 SVG 失败。请检查 BASE_URL 是否正确，以及图片是否已公开托管。错误信息: ${error.message}`);
            // 如果加载失败，停止动画并返回
            return;
        }
    }

    console.log("所有 SVG 文件加载完成，启动动画循环。");
    startFlashingLoop();
}

/**
 * 切换到下一张 SVG 并开始闪烁动画
 */
function startFlashingLoop() {
    // 1. 隐藏所有 SVG 并移除动画类
    svgElements.forEach(svg => {
        svg.style.opacity = 0;
        svg.classList.remove('flashing');
    });

    // 2. 获取当前要显示的 SVG
    const currentSVG = svgElements[currentIndex];

    // 3. 立即显示当前 SVG
    currentSVG.style.opacity = 1;

    // 4. 立即启动闪烁/暗淡动画
    currentSVG.classList.add('flashing');

    // 5. 设置定时器，在动画完成后切换到下一张图片
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % svgElements.length;
        startFlashingLoop();
    }, totalDuration);
}

// 确保在 DOM 内容加载完成后才执行初始化函数，避免找不到 SVG 元素
document.addEventListener('DOMContentLoaded', initializeSVGs);
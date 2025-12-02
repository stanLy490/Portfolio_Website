// Canvas 和上下文初始化
const canvas = document.getElementById('starfieldCanvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;

// 鼠标位置跟踪
let mouseX = w / 2;
let mouseY = h / 2;
let mouseBoxSize = 30; // 鼠标方框大小
let detectedAsteroid = null; // 鼠标检测到的星球

// 监听鼠标移动
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 监听鼠标点击（手动选择星球）
canvas.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;

    // 查找点击位置的星球
    for (const asteroid of largeAsteroids) {
        const distance = Math.sqrt(
            Math.pow(clickX - asteroid.x, 2) +
            Math.pow(clickY - asteroid.y, 2)
        );

        if (distance <= asteroid.radius) {
            // 点击到了星球，设置为检测目标
            detectedAsteroid = asteroid;
            // 如果这个星球还没有小ID，分配一个
            if (!asteroid.discoveredId) {
                asteroid.discoveredId = generateDiscoveredId();
            }
            // 为这个星球分配信息（如果还没有）
            if (!trackedPlanetInfo.has('mouse_' + asteroid.id)) {
                trackedPlanetInfo.set('mouse_' + asteroid.id, getNextPlanetInfo());
            }
            break;
        }
    }
});

// Global state: tracked asteroid IDs (supports multiple)
let trackedIds = [];
const MAX_TRACKED = 5; // Maximum tracked asteroids

// 生成发现ID的计数器
let discoveredIdCounter = 1;
function generateDiscoveredId() {
    return `AST-${String(discoveredIdCounter++).padStart(4, '0')}`;
}

// Planet information data is loaded from planetData.js
// Mapping from tracked ID to planet info
const trackedPlanetInfo = new Map();

// Text position along the line for collision avoidance
// Stores position ratio (0-1) along the line, 0.5 = midpoint
const textPositions = new Map(); // { id: { current: 0.5, target: 0.5, stableFrames: 0 } }
const STABLE_THRESHOLD = 60; // 需要稳定60帧（约1秒）才开始移动

// Planet info rotation system - ensures each info is shown once before repeating
let availableInfoIndices = [];

function initializeInfoPool() {
    availableInfoIndices = [];
    for (let i = 0; i < planetInfos.length; i++) {
        availableInfoIndices.push(i);
    }
}

function getNextPlanetInfo() {
    // If pool is empty, refill it
    if (availableInfoIndices.length === 0) {
        initializeInfoPool();
    }

    // Randomly pick one from available indices
    const randomIndex = Math.floor(Math.random() * availableInfoIndices.length);
    const infoIndex = availableInfoIndices[randomIndex];

    // Remove it from available pool
    availableInfoIndices.splice(randomIndex, 1);

    return planetInfos[infoIndex];
}

// Initialize the pool at start
initializeInfoPool();

// Background planet configuration
const planetConfig = {
    centerX: w * 0.15,  // Planet center (showing right edge)
    centerY: h * 1,   // Vertically centered
    radius: w * 0.5,    // Large radius
    get x() { return this.centerX; },
    get y() { return this.centerY; }
};

// Decorative dots on the planet
const planetDots = [];
const NUM_PLANET_DOTS = 60;

function initializePlanetDots() {
    planetDots.length = 0;
    for (let i = 0; i < NUM_PLANET_DOTS; i++) {
        // Random angle and distance from center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * planetConfig.radius;

        const x = planetConfig.centerX + Math.cos(angle) * distance;
        const y = planetConfig.centerY + Math.sin(angle) * distance;

        planetDots.push({
            x: x,
            y: y,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

// Will be initialized in resizeCanvas()

// Texture dots (static, not regenerated each frame)
const textureDots = [];

function initializeTextureDots() {
    textureDots.length = 0;
    for (let i = 0; i < 500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * planetConfig.radius;
        textureDots.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: Math.random() * 0.6 + 0.05,
            size: Math.random() * 10 + 2
        });
    }
}

// Will be initialized in resizeCanvas()

// Draw background planet
function drawBackgroundPlanet() {
    // Main planet gradient (more visible)
    const gradient = ctx.createRadialGradient(
        planetConfig.centerX, planetConfig.centerY, 0,
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius
    );
    gradient.addColorStop(0, 'rgba(47, 47, 47, 0.6)');
    gradient.addColorStop(0.35, 'rgba(69, 69, 69, 0.4)');
    gradient.addColorStop(0.5, 'rgba(66, 66, 66, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 139, 139, 0.1)');

    // Draw main planet circle
    ctx.beginPath();
    ctx.arc(planetConfig.centerX, planetConfig.centerY, planetConfig.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add subtle texture with static dots
    textureDots.forEach(dot => {
        const x = planetConfig.centerX + dot.x;
        const y = planetConfig.centerY + dot.y;
        ctx.fillStyle = `rgba(80, 80, 90, ${dot.opacity})`;
        ctx.fillRect(x, y, dot.size, dot.size);
    });

    // Draw decorative dots (asteroid-like)
    planetDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 140, 150, ${dot.opacity})`;
        ctx.fill();
    });

    // Add glow effect at the edge
    const glowGradient = ctx.createRadialGradient(
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 0.92,
        planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 1.08
    );
    glowGradient.addColorStop(0, 'rgba(200, 200, 210, 0.05)');
    glowGradient.addColorStop(0.5, 'rgba(200, 200, 210, 0.2)');
    glowGradient.addColorStop(1, 'rgba(200, 200, 210, 0)');

    ctx.beginPath();
    ctx.arc(planetConfig.centerX, planetConfig.centerY, planetConfig.radius * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
}

// 设置画布尺寸和监听窗口大小变化
function resizeCanvas() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Update planet position based on new window size
    planetConfig.centerX = w * 0.15;
    planetConfig.centerY = h * 0.5;
    planetConfig.radius = w * 0.5;

    // Reinitialize planet dots and texture for new size
    initializePlanetDots();
    initializeTextureDots();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 小行星/星星 类
class Asteroid {
    constructor() {
        this.trail = []; // 拖尾位置记录（用于小陨石）
        this.reset();
        // 确保初始 x 坐标在屏幕外左侧
        this.x = Math.random() * w * 2 - w;
    }

    // 重置小行星位置和属性（当飞出屏幕时调用）
    reset() {
        // 半径决定了大小
        this.radius = Math.random() * 15 + 1; // 最大半径降至 16
        this.y = 0.25 * h + Math.random() * h * 0.3;
        // 速度基于半径
        this.speed = (this.radius / 15) * 3 + 1;
        // x 坐标设置为屏幕左侧外
        this.x = -this.radius;
        this.id = crypto.randomUUID().slice(0, 8); // 模拟检测 ID
        this.isLarge = this.radius > 10; // 大小行星阈值
        // 颜色统一为白/灰
        this.color = this.isLarge ? `rgba(200, 200, 200, ${this.radius / 15})` : `rgba(255, 255, 255, ${this.radius / 10})`;
        // 清空拖尾
        this.trail = [];
        // 发现ID（只有被玩家发现后才会分配）
        this.discoveredId = null;
    }

    // 更新位置
    update() {
        // 对于小陨石，记录拖尾位置
        if (!this.isLarge) {
            this.trail.push({ x: this.x, y: this.y });
            // 限制拖尾长度（根据速度调整）
            const maxTrailLength = Math.floor(100 / this.speed * 3);
            if (this.trail.length > maxTrailLength) {
                this.trail.shift(); // 移除最旧的位置
            }
        }

        this.x += this.speed;
        // 如果飞出屏幕，则重置
        if (this.x > w + this.radius) {
            this.reset();
        }
    }

    // 绘制小行星
    draw() {
        // 绘制拖尾（只对小陨石）
        if (!this.isLarge && this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);

            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }

            // 白色拖尾，透明度渐变
            const gradient = ctx.createLinearGradient(
                this.trail[0].x, this.trail[0].y,
                this.x, this.y
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 + this.radius * 0.2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // 绘制本体
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// 创建小行星群 - 区分large和normal
const NUM_ASTEROIDS = 80;
const largeAsteroids = [];  // 大型小行星数组
const normalAsteroids = []; // 普通小行星数组

// 创建小行星并分类存储
for (let i = 0; i < NUM_ASTEROIDS; i++) {
    const asteroid = new Asteroid();
    if (asteroid.isLarge) {
        largeAsteroids.push(asteroid);
    } else {
        normalAsteroids.push(asteroid);
    }
}

/**
 * 主动画循环
 */
function loop() {
    // 清空画布
    ctx.clearRect(0, 0, w, h);

    // 绘制背景星球（第一层）
    drawBackgroundPlanet();

    // 固定连线终点坐标
    const trackedTargetX = 0.5 * w;
    const trackedTargetY = 0.8 * h;

    // --- 追踪逻辑：寻找或更新当前追踪目标（支持多个） ---

    // 1. 清理已到达终点或已消失的追踪目标
    const newTrackedIds = trackedIds.filter(id => {
        const asteroid = largeAsteroids.find(a => a.id === id);
        const shouldKeep = asteroid && asteroid.x <= w - 100;

        // 如果不保留，清理对应的星球信息和位置
        if (!shouldKeep) {
            trackedPlanetInfo.delete(id);
            textPositions.delete(id);
        }

        return shouldKeep;
    });
    trackedIds = newTrackedIds;

    // 2. 如果追踪数量不足，补充新的大陨石
    if (trackedIds.length < MAX_TRACKED) {
        // 找到所有未被追踪的、在左侧的大陨石
        const candidates = largeAsteroids.filter(a =>
            !trackedIds.includes(a.id) && a.x < 100
        );

        // 按x坐标排序，优先追踪最左侧的
        candidates.sort((a, b) => a.x - b.x);

        // 补充到最大追踪数量
        const needed = MAX_TRACKED - trackedIds.length;
        for (let i = 0; i < Math.min(needed, candidates.length); i++) {
            const newId = candidates[i].id;
            trackedIds.push(newId);

            // 为新追踪的星球分配一个信息（轮询机制）
            const planetInfo = getNextPlanetInfo();
            trackedPlanetInfo.set(newId, planetInfo);

            // 初始化文字位置（默认在连线中点）
            textPositions.set(newId, { current: 0.5, target: 0.5, stableFrames: STABLE_THRESHOLD });
        }
    }

    // --- 文字碰撞检测和避让 ---

    // 辅助函数：计算文字在指定位置的边界框
    function calculateBounds(id, ratio) {
        const asteroid = largeAsteroids.find(a => a.id === id);
        if (!asteroid) return null;

        const planetInfo = trackedPlanetInfo.get(id);
        if (!planetInfo) return null;

        const centerX = asteroid.x;
        const centerY = asteroid.y;

        const textX = centerX + (trackedTargetX - centerX) * ratio + 15;
        const textY = centerY + (trackedTargetY - centerY) * ratio;

        const numLines = Array.isArray(planetInfo.description) ? planetInfo.description.length : 1;
        const textHeight = 25 + numLines * 15;
        const textWidth = 250;

        return {
            x: textX,
            y: textY - 10,
            width: textWidth,
            height: textHeight
        };
    }

    // 辅助函数：检测两个边界框是否碰撞
    function checkCollision(bound1, bound2) {
        if (!bound1 || !bound2) return false;
        return !(
            bound1.x + bound1.width < bound2.x ||
            bound1.x > bound2.x + bound2.width ||
            bound1.y + bound1.height < bound2.y ||
            bound1.y > bound2.y + bound2.height
        );
    }

    // 辅助函数：检测某个ID在指定位置是否会与其他文字碰撞
    function wouldCollide(testId, testRatio) {
        const testBound = calculateBounds(testId, testRatio);
        if (!testBound) return false;

        // 检测与其他所有文字的碰撞
        for (const otherId of trackedIds) {
            if (otherId === testId) continue;

            const otherPosition = textPositions.get(otherId);
            if (!otherPosition) continue;

            // 与其他文字的当前位置进行碰撞检测
            const otherBound = calculateBounds(otherId, otherPosition.current);
            if (checkCollision(testBound, otherBound)) {
                return true;
            }
        }
        return false;
    }

    // 为每个文字寻找合适的目标位置
    trackedIds.forEach(id => {
        const position = textPositions.get(id);
        if (!position) return;

        // 可选位置：0.5（中点）, 0.33, 0.67, 0.25, 0.75, 0.2, 0.8
        const candidatePositions = [0.5, 0.33, 0.67, 0.25, 0.75, 0.2, 0.8];

        let bestPosition = position.target; // 默认保持当前目标

        // 检查当前目标位置是否仍然有效（无碰撞）
        if (!wouldCollide(id, position.target)) {
            // 当前目标位置有效，增加稳定计数
            position.stableFrames++;
        } else {
            // 当前目标位置会碰撞，寻找新位置
            for (const candidate of candidatePositions) {
                if (!wouldCollide(id, candidate)) {
                    bestPosition = candidate;
                    break;
                }
            }

            // 如果目标位置改变，重置稳定计数
            if (Math.abs(bestPosition - position.target) > 0.01) {
                position.target = bestPosition;
                position.stableFrames = 0;
            }
        }
    });

    // 只有稳定足够久的文字才开始移动
    textPositions.forEach((position, id) => {
        if (position.stableFrames >= STABLE_THRESHOLD) {
            const diff = position.target - position.current;
            position.current += diff * 0.08; // 较慢的缓动系数，更平滑
        }
    });

    // --- 绘制所有小行星并应用追踪效果 ---

    // 1. 绘制普通小行星
    normalAsteroids.forEach(a => {
        a.update(); // 更新位置
        a.draw();   // 绘制本体
    });

    // 2. 绘制大型小行星（可以在这里添加特殊效果）
    largeAsteroids.forEach(a => {
        a.update(); // 更新位置
        a.draw();   // 绘制本体

        // 对被追踪的large物体应用特殊效果
        if (trackedIds.includes(a.id)) {
            const { x, y, radius } = a;
            const width = radius * 2;
            const height = radius * 2;
            const boxX = x - radius;
            const boxY = y - radius;

            // ---------------------------------------------
            // 1. 画边框
            // ---------------------------------------------
            ctx.strokeStyle = "#ccc"; // 浅灰色
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, boxY, width, height);

            // ---------------------------------------------
            // 2. 连线到固定点
            // ---------------------------------------------
            const centerX = x;
            const centerY = y;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(trackedTargetX, trackedTargetY);
            ctx.strokeStyle = "#fff"; // 白色连线
            ctx.lineWidth = 1;
            ctx.stroke();

            // ---------------------------------------------
            // 3. 在连线上绘制星球信息（带碰撞避让）
            // ---------------------------------------------
            const planetInfo = trackedPlanetInfo.get(a.id);
            if (planetInfo) {
                // 获取当前连线位置比例
                const position = textPositions.get(a.id) || { current: 0.5, target: 0.5 };

                // 根据比例计算文字在连线上的位置
                const ratio = position.current;
                const linePointX = centerX + (trackedTargetX - centerX) * ratio;
                const linePointY = centerY + (trackedTargetY - centerY) * ratio;

                // 文字在线上点的右侧
                const textX = linePointX + 15;
                const textY = linePointY;

                // 绘制星球名字（稍大字体）
                ctx.fillStyle = "#fff";
                ctx.font = "bold 14px Inter, sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(planetInfo.name, textX, textY - 5);

                // 绘制简介（小字体，支持多行）
                ctx.font = "11px Inter, sans-serif";
                ctx.fillStyle = "#ccc";

                // 如果 description 是数组，逐行绘制
                if (Array.isArray(planetInfo.description)) {
                    planetInfo.description.forEach((line, index) => {
                        ctx.fillText(line, textX, textY + 12 + index * 15);
                    });
                } else {
                    // 兼容旧格式（单行字符串）
                    ctx.fillText(planetInfo.description, textX, textY + 12);
                }
            }

            // ---------------------------------------------
            // 4. 装饰性文字 (白色小子，无边框)
            // ---------------------------------------------
            ctx.fillStyle = "#fff";
            ctx.font = "10px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`TARGET | ID: ${a.id}`, boxX, boxY - 5);
            ctx.fillText(`VELOCITY: ${a.speed.toFixed(1)}`, boxX, boxY + height + 15);
        }
    });

    // --- 绘制鼠标追踪方框和连线 ---

    // 自动检测鼠标方框中心是否有星球
    let currentDetection = null;
    for (const asteroid of largeAsteroids) {
        const distance = Math.sqrt(
            Math.pow(mouseX - asteroid.x, 2) +
            Math.pow(mouseY - asteroid.y, 2)
        );

        if (distance <= asteroid.radius) {
            currentDetection = asteroid;
            // 如果检测到新星球，分配ID和信息
            if (detectedAsteroid !== asteroid) {
                detectedAsteroid = asteroid;
                if (!asteroid.discoveredId) {
                    asteroid.discoveredId = generateDiscoveredId();
                }
                if (!trackedPlanetInfo.has('mouse_' + asteroid.id)) {
                    trackedPlanetInfo.set('mouse_' + asteroid.id, getNextPlanetInfo());
                }
            }
            break;
        }
    }

    // 如果当前没有检测到星球，但之前有，清除检测状态
    if (!currentDetection && detectedAsteroid) {
        detectedAsteroid = null;
    }

    // 1. 绘制鼠标方框
    const mouseBoxX = mouseX - mouseBoxSize / 2;
    const mouseBoxY = mouseY - mouseBoxSize / 2;

    ctx.strokeStyle = "#fff"; // 白色边框
    ctx.lineWidth = 2;
    ctx.strokeRect(mouseBoxX, mouseBoxY, mouseBoxSize, mouseBoxSize);

    // 2. 绘制从鼠标到固定点的连线
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(trackedTargetX, trackedTargetY);
    ctx.strokeStyle = "#fff"; // 白色连线
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. 如果检测到星球，显示信息
    if (detectedAsteroid) {
        const planetInfo = trackedPlanetInfo.get('mouse_' + detectedAsteroid.id);
        if (planetInfo) {
            // 计算信息显示位置（在连线中点附近）
            const ratio = 0.5; // 连线中点
            const textX = mouseX + (trackedTargetX - mouseX) * ratio + 15;
            const textY = mouseY + (trackedTargetY - mouseY) * ratio;

            // 绘制星球名字
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(planetInfo.name, textX, textY - 5);

            // 绘制简介
            ctx.font = "11px Inter, sans-serif";
            ctx.fillStyle = "#ccc";

            if (Array.isArray(planetInfo.description)) {
                planetInfo.description.forEach((line, index) => {
                    ctx.fillText(line, textX, textY + 12 + index * 15);
                });
            } else {
                ctx.fillText(planetInfo.description, textX, textY + 12);
            }

            // 显示发现ID和其他信息
            ctx.fillStyle = "#fff";
            ctx.font = "10px Inter, sans-serif";
            ctx.fillText(`DISCOVERED ID: ${detectedAsteroid.discoveredId}`, mouseBoxX, mouseBoxY - 5);
            ctx.fillText(`TARGET ID: ${detectedAsteroid.id}`, mouseBoxX, mouseBoxY + mouseBoxSize + 15);
            ctx.fillText(`VELOCITY: ${detectedAsteroid.speed.toFixed(1)}`, mouseBoxX, mouseBoxY + mouseBoxSize + 27);
        }
    }

    requestAnimationFrame(loop);
}

// 启动动画循环
window.onload = function () {
    loop();
}

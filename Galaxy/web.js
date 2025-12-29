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

// 全局速度因子 (1 = 正常速度, 0.2 = 显著减速)
let speedFactor = 1;
const NORMAL_SPEED = 1;
const SLOW_SPEED = 0.2;
const MAX_SPEED_ASTEROID_DISTANCE = 25; // 鼠标触发减速的距离阈值

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
            // 播放点击音效
            if (typeof sfx !== 'undefined' && sfx.hasSound('click')) {
                sfx.play('click');
            }

            // *** 新增逻辑：点击后跳转页面 ***
            // 获取/分配星球信息，确保有 URL 可用
            let planetInfo = trackedPlanetInfo.get('mouse_' + asteroid.id);
            if (!planetInfo) {
                // 确保在点击时为新星球分配信息（如果之前没有被鼠标检测过）
                if (!asteroid.discoveredId) {
                    asteroid.discoveredId = generateDiscoveredId();
                }
                planetInfo = getNextPlanetInfo();
                trackedPlanetInfo.set('mouse_' + asteroid.id, planetInfo);
            }

            const redirectUrl = planetInfo.redirectUrl || 'https://www.google.com'; // 如果未在 planetData.js 中配置，则默认跳转到 Google

            window.location.href = redirectUrl;
            return; // 找到并跳转后立即返回
        }
    }
});

// Global state: tracked asteroid slots (supports multiple)
// Each slot: { targetId, displayX, displayY, displayWidth, displayHeight, isActive }
const MAX_TRACKED = 5; // Maximum tracked asteroids
const TRACKING_SMOOTH_FACTOR = 0.12; // 平滑移动速度 (0.08-0.2, 越小越平滑)

// 初始化固定的追踪槽位
let trackedSlots = [];
function initializeTrackingSlots() {
    trackedSlots = [];
    for (let i = 0; i < MAX_TRACKED; i++) {
        trackedSlots.push({
            targetId: null,
            displayX: w * 0.5,  // 初始位置在屏幕中央
            displayY: h * 0.5,
            displayWidth: 20,
            displayHeight: 20,
            isActive: false
        });
    }
}
initializeTrackingSlots();

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

        // 应用全局速度因子
        this.x += this.speed * speedFactor;
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

    // --- 速度因子更新逻辑 ---
    let distanceToAnyLargeAsteroid = Infinity;

    // 检查鼠标到所有大型小行星的最小距离
    for (const asteroid of largeAsteroids) {
        const distance = Math.sqrt(
            Math.pow(mouseX - asteroid.x, 2) +
            Math.pow(mouseY - asteroid.y, 2)
        );
        distanceToAnyLargeAsteroid = Math.min(distanceToAnyLargeAsteroid, distance);
    }

    // 根据距离设置目标速度因子
    let targetSpeedFactor = NORMAL_SPEED;
    if (distanceToAnyLargeAsteroid < MAX_SPEED_ASTEROID_DISTANCE) {
        targetSpeedFactor = SLOW_SPEED;
    }

    // 缓动速度因子，实现平滑减速/加速
    speedFactor += (targetSpeedFactor - speedFactor) * 0.1;
    // ------------------------------------

    // --- 追踪逻辑：槽位管理系统（带平滑过渡动画） ---

    // 1. 标记所有已失效的槽位（星球飞出屏幕）
    trackedSlots.forEach(slot => {
        if (slot.isActive && slot.targetId) {
            const asteroid = largeAsteroids.find(a => a.id === slot.targetId);
            const shouldDeactivate = !asteroid || asteroid.x > w - 100;

            if (shouldDeactivate) {
                // 停用槽位，清理信息
                slot.isActive = false;
                trackedPlanetInfo.delete(slot.targetId);
                textPositions.delete(slot.targetId);
                slot.targetId = null;
            }
        }
    });

    // 2. 获取当前所有活跃槽位追踪的ID
    const getCurrentTrackedIds = () =>
        trackedSlots.filter(s => s.isActive).map(s => s.targetId);

    // 3. 找到可追踪的候选星球（左侧新进入的大陨石）
    const currentIds = getCurrentTrackedIds();
    const candidates = largeAsteroids.filter(a =>
        !currentIds.includes(a.id) && a.x < 100
    );
    candidates.sort((a, b) => a.x - b.x); // 优先追踪最左侧的

    // 4. 为空闲槽位分配新目标（实现平滑切换）
    // ⚠️ 每次只分配一个槽位，避免同时出现多个框
    let candidateIndex = 0;
    let assignedThisFrame = false;

    for (const slot of trackedSlots) {
        if (!slot.isActive && candidateIndex < candidates.length && !assignedThisFrame) {
            const newAsteroid = candidates[candidateIndex];
            candidateIndex++;

            // 分配新目标到这个槽位
            slot.targetId = newAsteroid.id;
            slot.isActive = true;
            assignedThisFrame = true;  // 标记已分配，本帧不再分配其他槽位

            // ⚠️ 关键改动：检查槽位是否从未被使用过（还在初始隐藏位置）
            const isNeverUsed = slot.displayX === w * 0.5 && slot.displayY === h * 0.5;

            if (isNeverUsed) {
                // 首次使用：从屏幕左侧1/4位置开始（一个固定的入口点）
                // 这样框会平滑滑入，视觉上更自然
                slot.displayX = w * 0.25;  // 屏幕左侧1/4位置
                slot.displayY = newAsteroid.y;
                slot.displayWidth = newAsteroid.radius * 2;
                slot.displayHeight = newAsteroid.radius * 2;
            }
            // 否则保持当前displayX/Y，会从旧位置平滑过渡到新目标

            // 为新追踪的星球分配信息
            const planetInfo = getNextPlanetInfo();
            trackedPlanetInfo.set(newAsteroid.id, planetInfo);

            // 初始化文字位置
            textPositions.set(newAsteroid.id, {
                current: 0.5,
                target: 0.5,
                stableFrames: STABLE_THRESHOLD
            });
        }
    }

    // 5. 平滑更新每个活跃槽位的显示位置到目标位置
    trackedSlots.forEach(slot => {
        if (slot.isActive && slot.targetId) {
            const asteroid = largeAsteroids.find(a => a.id === slot.targetId);
            if (asteroid) {
                const targetX = asteroid.x;
                const targetY = asteroid.y;
                const targetWidth = asteroid.radius * 2;
                const targetHeight = asteroid.radius * 2;

                // 使用缓动算法平滑移动（关键！这里实现平滑过渡）
                slot.displayX += (targetX - slot.displayX) * TRACKING_SMOOTH_FACTOR;
                slot.displayY += (targetY - slot.displayY) * TRACKING_SMOOTH_FACTOR;
                slot.displayWidth += (targetWidth - slot.displayWidth) * TRACKING_SMOOTH_FACTOR;
                slot.displayHeight += (targetHeight - slot.displayHeight) * TRACKING_SMOOTH_FACTOR;
            }
        }
    });

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
        for (const slot of trackedSlots) {
            const otherId = slot.targetId;
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
    trackedSlots.forEach(slot => {
        const id = slot.targetId;
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

    // 2. 绘制大型小行星本体（不带追踪效果）
    largeAsteroids.forEach(a => {
        a.update(); // 更新位置
        a.draw();   // 绘制本体
    });

    // 3. 绘制追踪槽位（方框、连线、信息）- 使用平滑的显示位置
    trackedSlots.forEach(slot => {
        // 只绘制活跃的槽位
        if (!slot.isActive || !slot.targetId) return;

        const asteroid = largeAsteroids.find(a => a.id === slot.targetId);
        if (!asteroid) return;

        // 使用 slot 中存储的平滑显示位置，而不是小行星的实际位置
        const centerX = slot.displayX;
        const centerY = slot.displayY;
        const width = slot.displayWidth;
        const height = slot.displayHeight;
        const boxX = centerX - width / 2;
        const boxY = centerY - height / 2;

        // ---------------------------------------------
        // 1. 画边框（在平滑位置）
        // ---------------------------------------------
        ctx.strokeStyle = "#ccc"; // 浅灰色
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, width, height);

        // ---------------------------------------------
        // 2. 连线到固定点（从平滑位置开始）
        // ---------------------------------------------
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(trackedTargetX, trackedTargetY);
        ctx.strokeStyle = "#fff"; // 白色连线
        ctx.lineWidth = 1;
        ctx.stroke();

        // ---------------------------------------------
        // 3. 在连线上绘制星球信息（带碰撞避让）
        // ---------------------------------------------
        const planetInfo = trackedPlanetInfo.get(slot.targetId);
        if (planetInfo) {
            // 获取当前连线位置比例
            const position = textPositions.get(slot.targetId) || { current: 0.5, target: 0.5 };

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
        // 4. 装饰性文字 (白色小字，无边框)
        // ---------------------------------------------
        ctx.fillStyle = "#fff";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`TARGET | ID: ${slot.targetId}`, boxX, boxY - 5);
        ctx.fillText(`VELOCITY: ${asteroid.speed.toFixed(1)}`, boxX, boxY + height + 15);
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

                // 播放悬停音效
                if (typeof sfx !== 'undefined' && sfx.hasSound('hover')) {
                    sfx.play('hover', 0.3);  // 音量降低到0.3
                }

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
        // 在清除 detectedAsteroid 之前，清理掉它对应的鼠标追踪信息
        if (detectedAsteroid && trackedPlanetInfo.has('mouse_' + detectedAsteroid.id)) {
            // 暂时不清除信息，以便在点击时仍能获取 URL
        }
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
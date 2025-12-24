/**
 * ========================================
 * 三页面展示系统 - 配置文件
 * ========================================
 *
 * 使用指南：
 *
 * 1. 修改图片
 *    - 找到对应页面的 images 数组
 *    - 修改 src (图片URL) 和 alt (图片描述)
 *    - 推荐使用GitHub Raw URL: https://raw.githubusercontent.com/用户名/仓库名/分支/图片路径
 *
 * 2. 调整图片位置
 *    - top: 距离顶部的距离 (如 '10vh' = 10%屏幕高度)
 *    - left: 距离左侧的距离
 *    - bottom: 距离底部的距离
 *    - right: 距离右侧的距离
 *    ⚠️ 注意：top和bottom不要同时使用，left和right不要同时使用
 *
 * 3. 调整图片大小
 *    - width: 宽度 (推荐使用 'vw' 单位，如 '30vw' = 30%屏幕宽度)
 *    - height: 高度 (推荐使用 'auto' 自动适应)
 *
 * 4. 调整图片层级
 *    - zIndex: 数值越大越在前面 (范围: 1-20)
 *    - 如果图片重叠，调整zIndex来控制谁在上面
 *
 * 5. 修改侧边栏文字
 *    - 找到对应页面的 sidebar.content
 *    - 修改 title, subtitle, description 等字段
 *    - 支持HTML标签（如 <p>, <br>）
 *
 * 6. 调整侧边栏位置
 *    - position: 'left' (左侧) 或 'right' (右侧)
 *    - width: 宽度 (如 '25vw')
 *
 * 单位说明：
 * - vw: 相对于屏幕宽度的百分比 (100vw = 整个屏幕宽度)
 * - vh: 相对于屏幕高度的百分比 (100vh = 整个屏幕高度)
 * - px: 固定像素值 (不推荐，可能在不同屏幕上显示不一致)
 *
 * ========================================
 */

const PageConfigs = {
    // ===== PAGE 1: Visions from the Past =====
    page1: {
        // 页面元数据
        meta: {
            title: 'Visions from the Past',
            theme: 'tech-dark'
        },

        // 图片配置（自由定位）
        // ⚠️ 请将以下URL替换为您的真实图片URL
        images: [
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展383-383@4x.png',
                alt: 'Vision 1',
                position: {
                    top: '10vh',      // 距离顶部10%视口高度
                    left: '8vw',      // 距离左侧8%视口宽度
                    width: '30vw',    // 宽度为30%视口宽度
                    height: 'auto'    // 高度自适应
                },
                zIndex: 10
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展900-383 副本 4@4x.png',
                alt: 'Vision 2',
                position: {
                    top: '15vh',
                    right: '12vw',   // 距离右侧12%
                    width: '35vw',
                    height: 'auto'
                },
                zIndex: 15
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展900-383 副本 6@4x.png',
                alt: 'Vision 3',
                position: {
                    bottom: '30 vh',  // 距离底部20%
                    left: '15vw',
                    width: '28vw',
                    height: 'auto'
                },
                zIndex: 12
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展383-383 副本 4@4x.png',
                alt: 'Vision 4',
                position: {
                    bottom: '20vh',
                    right: '8vw',
                    width: '25vw',
                    height: 'auto'
                },
                zIndex: 8
            }
        ],

        // 侧边栏配置
        sidebar: {
            enabled: true,
            position: 'right',      // 'left' 或 'right'
            width: '25vw',

            content: {
                title: 'VISION',
                subtitle: 'PROJECT ID: A-92',
                description: `
                    <p>SYSTEM_LOG::</p>
                    <p>Render queue initialized.</p>
                    <p>Trajectory calculated [Spline-04].</p>
                    <p>Latency compensated: 12ms</p>
                    <p style="margin-top: 1rem;">Background scan triggered by anomaly.</p>
                    <p>Thermal variation detected in Sector-07.</p>
                    <p>Initiating passive surveillance mode…</p>
                `,
                footer: 'COORDINATES: X: 492.392 / Y: -102.11'
            },

            style: {
                background: 'rgba(80, 80, 80, 0.8)',
                backdropBlur: '4px',
                borderColor: 'rgba(255, 255, 255, 0.75)'
            }
        },

        // 返回按钮自定义（可选）
        backButton: {
            text: 'BACK',
            position: { top: '30px', right: '40px' }
        }
    },

    // ===== PAGE 2: Dimensional Folding =====
    page2: {
        meta: {
            title: 'Dimensional Folding',
            theme: 'tech-dark'
        },

        // ⚠️ 请将以下URL替换为您的真实图片URL
        images: [
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold1.jpg',
                alt: 'Fold 1',
                position: {
                    top: '12vh',
                    left: '10vw',
                    width: '32vw',
                    height: 'auto'
                },
                zIndex: 10
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold2.jpg',
                alt: 'Fold 2',
                position: {
                    top: '18vh',
                    right: '15vw',
                    width: '36vw',
                    height: 'auto'
                },
                zIndex: 15
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold3.jpg',
                alt: 'Fold 3',
                position: {
                    bottom: '22vh',
                    left: '28vw',
                    width: '26vw',
                    height: 'auto'
                },
                zIndex: 12
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold4.jpg',
                alt: 'Fold 4',
                position: {
                    bottom: '15vh',
                    right: '18vw',
                    width: '22vw',
                    height: 'auto'
                },
                zIndex: 8
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold5.jpg',
                alt: 'Fold 5',
                position: {
                    top: '50vh',
                    left: '5vw',
                    width: '24vw',
                    height: 'auto'
                },
                zIndex: 11
            }
        ],

        sidebar: {
            enabled: true,
            position: 'left',       // 左侧边栏
            width: '28vw',

            content: {
                title: 'FOLD',
                subtitle: 'SECTOR: B-12',
                description: `
                    <p>ANALYSIS::</p>
                    <p>Spatial curvature detected.</p>
                    <p>Gravity well stabilizing.</p>
                    <p style="margin-top: 1rem;">The geometry is folding upon itself to bridge the gap between sectors.</p>
                    <p>Dimensional integrity: 94.7%</p>
                    <p>Fold completion ETA: T-MINUS 00:45:12</p>
                `,
                footer: 'WARP FIELD STATUS: NOMINAL'
            },

            style: {
                background: 'rgba(91, 91, 91, 0.85)',
                backdropBlur: '6px',
                borderColor: 'rgba(255, 255, 255, 0.8)'
            }
        }
    },

    // ===== PAGE 3: Event Horizon =====
    page3: {
        meta: {
            title: 'Event Horizon',
            theme: 'tech-dark'
        },

        // ⚠️ 请将以下URL替换为您的真实图片URL
        images: [
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/horizon1.jpg',
                alt: 'Horizon 1',
                position: {
                    top: '14vh',
                    left: '9vw',
                    width: '38vw',
                    height: 'auto'
                },
                zIndex: 10
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/horizon2.jpg',
                alt: 'Horizon 2',
                position: {
                    top: '35vh',
                    right: '14vw',
                    width: '33vw',
                    height: 'auto'
                },
                zIndex: 15
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/horizon3.jpg',
                alt: 'Horizon 3',
                position: {
                    bottom: '18vh',
                    left: '32vw',
                    width: '29vw',
                    height: 'auto'
                },
                zIndex: 12
            }
        ],

        sidebar: {
            enabled: true,
            position: 'right',
            width: '30vw',

            content: {
                title: 'VOID',
                subtitle: 'NO RETURN POINT',
                description: `
                    <p>STATUS: CRITICAL</p>
                    <p>TIME: T-MINUS 00:00:00</p>
                    <p style="margin-top: 1rem;">SINGULARITY DETECTED</p>
                    <p>Gravitational pull: EXTREME</p>
                    <p>Light escape velocity: ZERO</p>
                    <p style="margin-top: 1rem; color: rgba(255, 50, 50, 0.8);">⚠️ WARNING: Point of no return reached</p>
                `,
                footer: 'EVENT HORIZON BREACH IMMINENT'
            },

            style: {
                background: 'rgba(60, 60, 60, 0.9)',
                backdropBlur: '8px',
                borderColor: 'rgba(255, 255, 255, 0.9)'
            }
        }
    }
};

// 导出配置（保持全局可访问）
if (typeof window !== 'undefined') {
    window.PageConfigs = PageConfigs;
}

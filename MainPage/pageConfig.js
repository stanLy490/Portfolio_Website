/**
 * ========================================
 * 三页面展示系统 - 配置文件（动态 Sidebar 版本）
 * ========================================
 *
 * 🆕 新特性：每张图片都有独立的 Sidebar
 * - 鼠标悬浮在图片上时，显示对应的 Sidebar
 * - 页面会平滑左移，避免遮挡图片
 * - 离开图片后，Sidebar 消失，页面恢复
 *
 * 🎬 支持图片和视频混合展示
 * - 通过 type 字段指定媒体类型：'image' 或 'video'
 * - 视频自动循环播放、静音（小窗口模式）
 * - 图片和视频都支持点击放大预览
 * - 放大后的视频显示控制条，可以调整播放进度和音量
 *
 * 配置说明：
 * 1. 每个媒体项都有一个 sidebar 对象
 * 2. sidebar 包含：title, subtitle, description, footer
 * 3. 支持 HTML 标签格式化文本
 * 4. type: 'image' (默认) 或 'video'
 * 5. clickable: true 时，可点击放大预览（图片和视频都支持）
 *
 * ========================================
 */

const PageConfigs = {
    // ===== PAGE 1: Visions from the Past =====
    page1: {
        meta: {
            title: 'Visions from the Past',
            theme: 'tech-dark'
        },

        // 🎵 背景音乐配置
        backgroundMusic: {
            url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/Opening_Ethereal.mp3',
            volume: 0.25
        },

        images: [
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展383-383@4x.png',
                alt: 'Vision 1',
                position: {
                    top: '35vh',
                    left: '4vw',
                    width: '30vw',
                    height: 'auto'
                },
                zIndex: 10,
                // 🆕 独立 Sidebar 内容
                sidebar: {
                    title: 'MEMORY_01',
                    subtitle: 'NEURAL FRAGMENT: A-92',
                    description: `
                        <p>SCAN_RESULT::</p>
                        <p>Visual data archived in sector A-92.</p>
                        <p>Timestamp: 2024.11.05 14:23:47</p>
                        <p style="margin-top: 1rem;">Neural pathway reconstructed.</p>
                        <p>Synaptic strength: 87.3%</p>
                        <p>Memory integrity: STABLE</p>
                    `,
                    footer: 'COGNITIVE_LOAD: NORMAL'
                },
                // 🆕 是否触发页面左移（左侧图片设为false避免移出屏幕）
                enableSidebarShift: false,
                // 🆕 是否可点击放大
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展383-383 副本 7@4x.png',
                alt: 'Vision 2',
                position: {
                    top: '12vh',
                    right: '22vw',
                    width: '20vw',
                    height: 'auto'
                },
                zIndex: 15,
                sidebar: {
                    title: 'ECHO_02',
                    subtitle: 'TEMPORAL SIGNATURE: B-47',
                    description: `
                        <p>ANALYSIS::</p>
                        <p>Chrono-spatial distortion detected.</p>
                        <p>Origin: Timeline Beta-47</p>
                        <p style="margin-top: 1rem;">Probability wave collapsed at T+142ms.</p>
                        <p>Quantum coherence maintained.</p>
                        <p>Observer effect: MINIMAL</p>
                    `,
                    footer: 'TIMELINE_INTEGRITY: 96.8%'
                },
                enableSidebarShift: true,  // 右侧图片可以左移
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展900-383 副本 5@4x.png',
                alt: 'Vision 3',
                position: {
                    top: '12vh',
                    left: '18vw',
                    width: '28vw',
                    height: 'auto'
                },
                zIndex: 12,
                sidebar: {
                    title: 'RESONANCE_03',
                    subtitle: 'HARMONIC PATTERN: C-19',
                    description: `
                        <p>FREQUENCY_ANALYSIS::</p>
                        <p>Resonant frequency: 432 Hz</p>
                        <p>Phase alignment: SYNCHRONIZED</p>
                        <p style="margin-top: 1rem;">Harmonic series detected across dimensions.</p>
                        <p>Standing wave stabilized.</p>
                        <p>Energy dissipation: 3.2%/s</p>
                    `,
                    footer: 'WAVE_FUNCTION: STABLE'
                },
                enableSidebarShift: false,  // 左侧图片不左移
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/2025 毕业展383-383 副本 4@4x.png',
                alt: 'Vision 4',
                position: {
                    bottom: '10vh',
                    right: '28vw',
                    width: '25vw',
                    height: 'auto'
                },
                zIndex: 8,
                sidebar: {
                    title: 'FRAGMENT_04',
                    subtitle: 'DATA CLUSTER: D-83',
                    description: `
                        <p>RECONSTRUCTION::</p>
                        <p>Data integrity: 78.4%</p>
                        <p>Missing sectors: 12</p>
                        <p style="margin-top: 1rem;">Attempting neural interpolation...</p>
                        <p>Confidence level: MODERATE</p>
                        <p style="color: rgba(255, 200, 100, 0.8);">⚠️ Partial recovery only</p>
                    `,
                    footer: 'RECOVERY_STATUS: IN_PROGRESS'
                },
                enableSidebarShift: true,  // 右侧图片可以左移
                clickable: true
            },
            // 🎬 视频配置示例（注释掉，需要时取消注释并替换为你的视频URL）
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://example.com/your-video.mp4',
                alt: 'Vision Video',
                position: {
                    top: '60vh',
                    right: '10vw',
                    width: '30vw',
                    height: 'auto'
                },
                zIndex: 9,
                sidebar: {
                    title: 'MOTION_05',
                    subtitle: 'TEMPORAL STREAM: V-01',
                    description: `
                        <p>VIDEO_ANALYSIS::</p>
                        <p>Frame rate: 30 FPS</p>
                        <p>Duration: LOOP</p>
                        <p style="margin-top: 1rem;">Neural motion tracking active.</p>
                        <p>Pattern recognition: ENABLED</p>
                        <p>Playback: CONTINUOUS</p>
                    `,
                    footer: 'VIDEO_STATUS: PLAYING'
                },
                enableSidebarShift: true,
                clickable: true  // 🆕 视频也支持点击放大
            }
        ],

        // 全局 Sidebar 样式配置
        sidebarStyle: {
            width: '25vw',
            background: 'rgba(80, 80, 80, 0.85)',
            backdropBlur: '8px',
            borderColor: 'rgba(255, 255, 255, 0.75)'
        }
    },

    // ===== PAGE 2: Dimensional Folding =====
    page2: {
        meta: {
            title: 'Dimensional Folding',
            theme: 'tech-dark'
        },

        // 🎵 背景音乐配置（与page1相同，不会切换）
        backgroundMusic: {
            url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/Opening_Ethereal.mp3',
            volume: 0.25
        },

        images: [

            // {
            //     src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/fold3.jpg',
            //     alt: 'Fold 3',
            //     position: {
            //         bottom: '22vh',
            //         left: '28vw',
            //         width: '26vw',
            //         height: 'auto'
            //     },
            //     zIndex: 12,
            //     sidebar: {
            //         title: 'FOLD_GAMMA',
            //         subtitle: 'BRIDGE POINT: F-03',
            //         description: `
            //             <p>BRIDGE_ANALYSIS::</p>
            //             <p>Connection stability: 92.1%</p>
            //             <p>Transit time: 0.003s</p>
            //             <p style="margin-top: 1rem;">Two sectors linked successfully.</p>
            //             <p>Quantum entanglement verified.</p>
            //             <p>Information transfer: BIDIRECTIONAL</p>
            //         `,
            //         footer: 'BRIDGE_STATUS: OPERATIONAL'
            //     },
            //     enableSidebarShift: false,
            //     clickable: true
            // },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/page2_2.jpg',
                alt: 'Fold 4',
                position: {
                    bottom: '2vh',
                    right: '18vw',
                    width: '22vw',
                    height: 'auto'
                },
                zIndex: 8,
                sidebar: {
                    title: 'FOLD_DELTA',
                    subtitle: 'COMPRESSION ZONE: F-04',
                    description: `
                        <p>COMPRESSION_DATA::</p>
                        <p>Space-time ratio: 1:847</p>
                        <p>Density factor: CRITICAL</p>
                        <p style="margin-top: 1rem;">Matter compression proceeding.</p>
                        <p>Hawking radiation detected.</p>
                        <p style="color: rgba(255, 150, 100, 0.8);">⚠️ Approaching event horizon</p>
                    `,
                    footer: 'GRAVITATIONAL_STRESS: HIGH'
                },
                enableSidebarShift: true,
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/page2_1.jpg',
                alt: 'Fold 5',
                position: {
                    top: '46vh',
                    left: '5vw',
                    width: '20vw',
                    height: 'auto'
                },
                zIndex: 11,
                sidebar: {
                    title: 'FOLD_EPSILON',
                    subtitle: 'NEXUS POINT: F-05',
                    description: `
                        <p>NEXUS_STATUS::</p>
                        <p>Convergence point identified.</p>
                        <p>Dimensional intersections: 7</p>
                        <p style="margin-top: 1rem;">Multi-path routing established.</p>
                        <p>Network topology: STABLE</p>
                        <p>Latency: <1ms across all paths</p>
                    `,
                    footer: 'NEXUS_INTEGRITY: OPTIMAL'
                },
                enableSidebarShift: false,
                clickable: true
            },
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/clip_1_studio2.mp4',
                alt: 'Vision Video',
                position: {
                    top: '8vh',
                    left: '12vw',
                    width: '34vw',
                    height: 'auto'
                },
                zIndex: 10,
                sidebar: {
                    title: 'MOTION_05',
                    subtitle: 'TEMPORAL STREAM: V-01',
                    description: `
                        <p>VIDEO_ANALYSIS::</p>
                        <p>Frame rate: 30 FPS</p>
                        <p>Duration: LOOP</p>
                        <p style="margin-top: 1rem;">Neural motion tracking active.</p>
                        <p>Pattern recognition: ENABLED</p>
                        <p>Playback: CONTINUOUS</p>
                    `,
                    footer: 'VIDEO_STATUS: PLAYING'
                },
                enableSidebarShift: false,
                clickable: true  // 🆕 视频也支持点击放大
            },
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/clip5.mp4',
                alt: 'Vision Video',
                position: {
                    top: '12vh',
                    right: '28vw',
                    width: '24vw',
                    height: 'auto'
                },
                zIndex: 10,
                sidebar: {
                    title: 'MOTION_05',
                    subtitle: 'TEMPORAL STREAM: V-01',
                    description: `
                        <p>VIDEO_ANALYSIS::</p>
                        <p>Frame rate: 30 FPS</p>
                        <p>Duration: LOOP</p>
                        <p style="margin-top: 1rem;">Neural motion tracking active.</p>
                        <p>Pattern recognition: ENABLED</p>
                        <p>Playback: CONTINUOUS</p>
                    `,
                    footer: 'VIDEO_STATUS: PLAYING'
                },
                enableSidebarShift: true,
                clickable: true  // 🆕 视频也支持点击放大
            }
            ,
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/clip3.mp4',
                alt: 'Vision Video',
                position: {
                    bottom: '14vh',
                    left: '27vw',
                    width: '28vw',
                    height: 'auto'
                },
                zIndex: 9,
                sidebar: {
                    title: 'MOTION_05',
                    subtitle: 'TEMPORAL STREAM: V-01',
                    description: `
                        <p>VIDEO_ANALYSIS::</p>
                        <p>Frame rate: 30 FPS</p>
                        <p>Duration: LOOP</p>
                        <p style="margin-top: 1rem;">Neural motion tracking active.</p>
                        <p>Pattern recognition: ENABLED</p>
                        <p>Playback: CONTINUOUS</p>
                    `,
                    footer: 'VIDEO_STATUS: PLAYING'
                },
                enableSidebarShift: false,
                clickable: true  // 🆕 视频也支持点击放大
            }



        ],

        sidebarStyle: {
            width: '28vw',
            background: 'rgba(91, 91, 91, 0.85)',
            backdropBlur: '6px',
            borderColor: 'rgba(255, 255, 255, 0.8)'
        }
    },

    // ===== PAGE 3: Event Horizon =====
    page3: {
        meta: {
            title: 'Event Horizon',
            theme: 'tech-dark'
        },

        // 🎵 背景音乐配置（使用不同的音乐URL会自动切换）
        backgroundMusic: {
            url: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/Opening_Ethereal.mp3',
            volume: 0.25
        },

        images: [
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/page3_5.jpg',
                alt: 'Horizon 1',
                position: {
                    top: '14vh',
                    left: '10vw',
                    width: '24vw',
                    height: 'auto'
                },
                zIndex: 10,
                sidebar: {
                    title: 'SINGULARITY_01',
                    subtitle: 'SCHWARZSCHILD RADIUS: BREACHED',
                    description: `
                        <p>EVENT_HORIZON::</p>
                        <p>Gravitational pull: INFINITE</p>
                        <p>Escape velocity: >c</p>
                        <p style="margin-top: 1rem;">Time dilation: EXTREME</p>
                        <p>Spaghettification zone entered.</p>
                        <p style="color: rgba(255, 100, 100, 0.9);">⚠️ CRITICAL: NO RETURN</p>
                    `,
                    footer: 'HORIZON_DISTANCE: 0.0km'
                },
                enableSidebarShift: false,
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/page3_2.png',
                alt: 'Horizon 2',
                position: {
                    top: '30vh',
                    right: '14vw',
                    width: '22vw',
                    height: 'auto'
                },
                zIndex: 15,
                sidebar: {
                    title: 'ACCRETION_02',
                    subtitle: 'MATTER STREAM: ACTIVE',
                    description: `
                        <p>ACCRETION_DISK::</p>
                        <p>Temperature: 10^7 K</p>
                        <p>Rotation speed: 0.87c</p>
                        <p style="margin-top: 1rem;">X-ray emission: INTENSE</p>
                        <p>Matter infall rate: 10^24 kg/s</p>
                        <p>Jets detected at poles.</p>
                    `,
                    footer: 'DISK_STABILITY: TURBULENT'
                },
                enableSidebarShift: true,
                clickable: true
            },
            {
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/page3_4.jpg',
                alt: 'Horizon 3',
                position: {
                    bottom: '10vh',
                    left: '18vw',
                    width: '16vw',
                    height: 'auto'
                },
                zIndex: 12,
                sidebar: {
                    title: 'PHOTON_SPHERE_03',
                    subtitle: 'LIGHT ORBIT: UNSTABLE',
                    description: `
                        <p>PHOTON_SPHERE::</p>
                        <p>Orbital radius: 1.5 Rs</p>
                        <p>Light trapping active.</p>
                        <p style="margin-top: 1rem;">Gravitational lensing: SEVERE</p>
                        <p>Einstein ring visible.</p>
                        <p>Observer image distortion: 400%</p>
                    `,
                    footer: 'LIGHT_BENDING: EXTREME'
                },
                enableSidebarShift: false,
                clickable: true
            },
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/clip4.mp4',
                alt: 'Horizon Video',
                position: {
                    top: '55vh',
                    right: '25vw',
                    width: '32vw',
                    height: 'auto'
                },
                zIndex: 13,
                sidebar: {
                    title: 'TEMPORAL_FLUX_04',
                    subtitle: 'GRAVITATIONAL WAVES: DETECTED',
                    description: `
                        <p>WAVE_ANALYSIS::</p>
                        <p>Amplitude: EXTREME</p>
                        <p>Frequency: 0.01 Hz</p>
                        <p style="margin-top: 1rem;">Spacetime ripples propagating.</p>
                        <p>Binary system merger detected.</p>
                        <p>Energy release: 3 solar masses/s</p>
                    `,
                    footer: 'DETECTION_CONFIDENCE: 99.7%'
                },
                enableSidebarShift: true,
                clickable: true  // 🆕 视频也支持点击放大
            },
            {
                type: 'video',  // 🆕 指定为视频类型
                src: 'https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main/clip2_studio3.mp4',
                alt: 'Horizon Video',
                position: {
                    top: '20vh',
                    right: '40vw',
                    width: '22vw',
                    height: 'auto'
                },
                zIndex: 13,
                sidebar: {
                    title: 'TEMPORAL_FLUX_04',
                    subtitle: 'GRAVITATIONAL WAVES: DETECTED',
                    description: `
                        <p>WAVE_ANALYSIS::</p>
                        <p>Amplitude: EXTREME</p>
                        <p>Frequency: 0.01 Hz</p>
                        <p style="margin-top: 1rem;">Spacetime ripples propagating.</p>
                        <p>Binary system merger detected.</p>
                        <p>Energy release: 3 solar masses/s</p>
                    `,
                    footer: 'DETECTION_CONFIDENCE: 99.7%'
                },
                enableSidebarShift: true,
                clickable: true  // 🆕 视频也支持点击放大
            }
        ],

        sidebarStyle: {
            width: '30vw',
            background: 'rgba(60, 60, 60, 0.9)',
            backdropBlur: '8px',
            borderColor: 'rgba(255, 255, 255, 0.9)'
        }
    }
};

// 导出配置（保持全局可访问）
if (typeof window !== 'undefined') {
    window.PageConfigs = PageConfigs;
}

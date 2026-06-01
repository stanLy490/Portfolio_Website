// 动画配置系统
// 这个文件包含了所有section的动画参数，可以细致调节每个部分

const AnimationConfig = {
    // Section 1: VISIONS (原始布局 - 左 Frame 右 Panel)
    section1: {
        whiteFrame: {
            // 布局参数
            layout: {
                right: '40%',
                top: '50%',
                transform: 'translateY(-50%)',
                // width: '50vw',
                // height: '50vh',
            },
            // 动画参数
            duration: 10,              // 持续时间（秒）
            delay: 0,                 // 延迟时间（秒）
            translateX: '-8vw',      // X轴移动距离（相对屏幕宽度）
            translateY: '0vh',        // Y轴移动距离（相对屏幕高度）
            easing: 'ease-out',       // 缓动函数: ease-out, ease-in, ease-in-out, linear, cubic-bezier
            opacity: {
                start: 1,             // 起始透明度
                end: 1                // 结束透明度
            },
            scale: {
                start: 1,             // 起始缩放
                end: 1                // 结束缩放
            },
            rotate: 0                 // 旋转角度（度）
        },
        innerWindow: {
            duration: 8,             // 持续时间（秒）
            delay: 0,                 // 延迟时间（秒）
            translateX: '3vw',       // X轴移动距离（相对屏幕宽度）
            translateY: '0vh',       // Y轴移动距离（相对屏幕高度）
            easing: 'ease-out',       // 缓动函数
            opacity: {
                start: 1,
                end: 1
            },
            scale: {
                start: 1,
                end: 1
            },
            rotate: 0
        },
        infoPanel: {
            // 布局参数
            layout: {
                right: '15%',
                top: '50%',
                transform: 'translateY(-50%)'
            },
            // 动画参数
            fadeIn: {
                duration: 1.5,
                delay: 0.1,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            },
            // 样式参数
            style: {
                opacity: 0.8,
                blur: 4                // backdrop-filter blur（像素）
            }
        }
    },

    // Section 2: Dimensional Folding (反向布局 - 右 Frame 左 Panel)
    section2: {
        whiteFrame: {
            // 布局参数
            layout: {
                left: '50%',
                top: '50%',
                transform: 'translateY(-50%)'
            },
            // 动画参数
            duration: 10,
            delay: 0,
            translateX: '8vw',       // 反向动画（相对屏幕宽度）
            translateY: '0vh',
            easing: 'ease-out',
            opacity: {
                start: 1,
                end: 1
            },
            scale: {
                start: 1,
                end: 1
            },
            rotate: 0
        },
        innerWindow: {
            duration: 10,
            delay: 0,
            translateX: '-4vw',       // 反向动画（相对屏幕宽度）
            translateY: '10vh',
            easing: 'ease-out',
            opacity: {
                start: 1,
                end: 1
            },
            scale: {
                start: 1,
                end: 1
            },
            rotate: 0
        },
        infoPanel: {
            // 布局参数
            layout: {
                left: '15%',
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'right',
                width: '40vw',
                height: '49vh',
            },
            // 动画参数
            fadeIn: {
                duration: 1.5,
                delay: 0.5,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            },
            // 样式参数
            style: {
                opacity: 0.8,
                blur: 4
            }
        },
        // 镜像内容样式
        mirrorContent: {
            transform: 'scaleX(1) rotate(1deg)',
            textAlign: 'right'
        },
        // 大标题样式
        hugeTitle: {
            transform: 'scaleY(-1)',
            right: '0',
            left: 'auto'
        }
    },

    // Section 3: Event Horizon (居中布局)
    section3: {
        whiteFrame: {
            // 布局参数
            layout: {
                right: '10%',
                top: '65%',
                transform: 'translate(-50%, -50%)',
                width: '50vw',
                height: '50vh'
            },
            // 动画参数
            duration: 10,
            delay: 0,
            translateX: '-8vw',      // 相对屏幕宽度
            translateY: '0vh',
            easing: 'ease-out',
            opacity: {
                start: 1,
                end: 1
            },
            scale: {
                start: 1,
                end: 1
            },
            rotate: 0,
            // Section 3特有：居中布局
            centered: true
        },
        innerWindow: {
            duration: 10,
            delay: 0,
            translateX: '3vw',      // 相对屏幕宽度
            translateY: '10vh',
            easing: 'ease-out',
            opacity: {
                start: 1,
                end: 1
            },
            scale: {
                start: 1,
                end: 1
            },
            rotate: 0
        },
        infoPanel: {
            // 布局参数
            layout: {
                left: '50%',
                top: '65%',
                transform: 'translate(-10%, -10%)',
                width: '70vw',
                height: '50vh',
                background: 'rgba(91, 91, 91, 1)',
                alignItems: 'center',
                textAlign: 'center'
            },
            // 动画参数
            fadeIn: {
                duration: 0.1,
                delay: 1,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            },
            // 样式参数
            style: {
                opacity: 0.8,
                blur: 4
            }
        },
        // 大标题样式
        hugeTitle: {
            bottom: '10%',
            fontSize: '12vw',
            opacity: 0.1
        }
    },

    // 全局装饰元素
    decorations: {
        waveform: {
            barCount: 20,
            minHeight: 4,
            maxHeight: 24,
            bounceDuration: 1,         // 秒
            opacity: {
                min: 0.3,
                max: 1
            }
        },
        scrollHint: {
            fadeUpDuration: 2,          // 秒
            enabled: true
        }
    }
};

// 动态生成CSS动画和布局的函数
function generateAnimationCSS(config) {
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-animations';

    let css = '';

    // 为每个section生成样式和动画
    ['section1', 'section2', 'section3'].forEach((sectionKey, index) => {
        const sectionNum = index + 1;
        const section = config[sectionKey];

        // === White Frame 布局样式 ===
        const wfLayout = section.whiteFrame.layout;
        css += `
#section-${sectionNum} .white-frame {`;

        Object.entries(wfLayout).forEach(([key, value]) => {
            // 将驼峰命名转换为CSS属性名
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            css += `\n    ${cssKey}: ${value};`;
        });

        css += `
}
`;

        // === Info Panel 布局样式 ===
        const ipLayout = section.infoPanel.layout;
        css += `
#section-${sectionNum} .info-panel {`;

        Object.entries(ipLayout).forEach(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            css += `\n    ${cssKey}: ${value};`;
        });

        css += `
}
`;

        // === Section 2 特殊样式 ===
        if (sectionNum === 2) {
            if (section.mirrorContent) {
                css += `
#section-${sectionNum} .mirror-content {
    transform: ${section.mirrorContent.transform};
    text-align: ${section.mirrorContent.textAlign};
}
`;
            }
            if (section.hugeTitle) {
                css += `
#section-${sectionNum} .huge-title {
    transform: ${section.hugeTitle.transform};
    right: ${section.hugeTitle.right};
    left: ${section.hugeTitle.left};
}
`;
            }
        }

        // === Section 3 特殊样式 ===
        if (sectionNum === 3 && section.hugeTitle) {
            css += `
#section-${sectionNum} .huge-title {
    bottom: ${section.hugeTitle.bottom};
    font-size: ${section.hugeTitle.fontSize};
    opacity: ${section.hugeTitle.opacity};
}
`;
        }

        // === White Frame 动画 ===
        const wf = section.whiteFrame;
        const animName = `slideWhiteFrame-s${sectionNum}`;

        // 处理带单位的值（如 '25vw' 或 100）
        const getValueWithUnit = (value) => {
            return typeof value === 'string' ? value : `${value}px`;
        };

        if (wf.centered) {
            // 居中布局的动画
            css += `
@keyframes ${animName} {
    0% {
        transform: translate(-50%, -50%)
                   scale(${wf.scale.start})
                   rotate(${wf.rotate}deg);
        opacity: ${wf.opacity.start};
    }
    100% {
        transform: translate(calc(-50% + ${getValueWithUnit(wf.translateX)}), calc(-50% + ${getValueWithUnit(wf.translateY)}))
                   scale(${wf.scale.end})
                   rotate(${wf.rotate}deg);
        opacity: ${wf.opacity.end};
    }
}`;
        } else {
            // 普通布局的动画
            css += `
@keyframes ${animName} {
    0% {
        transform: translateX(0) translateY(-50%)
                   scale(${wf.scale.start})
                   rotate(${wf.rotate}deg);
        opacity: ${wf.opacity.start};
    }
    100% {
        transform: translateX(${getValueWithUnit(wf.translateX)}) translateY(-50%)
                   scale(${wf.scale.end})
                   rotate(${wf.rotate}deg);
        opacity: ${wf.opacity.end};
    }
}`;
        }

        // === Inner Window 动画 ===
        const iw = section.innerWindow;
        const iwAnimName = `slideInnerWindow-s${sectionNum}`;

        css += `
@keyframes ${iwAnimName} {
    0% {
        transform: translateX(0)
                   scale(${iw.scale.start})
                   rotate(${iw.rotate}deg);
        opacity: ${iw.opacity.start};
    }
    100% {
        transform: translateX(${getValueWithUnit(iw.translateX)})
                   scale(${iw.scale.end})
                   rotate(${iw.rotate}deg);
        opacity: ${iw.opacity.end};
    }
}`;

        // === 应用动画到对应section ===
        css += `
#section-${sectionNum} .white-frame {
    animation: ${animName} ${wf.duration}s ${wf.easing} ${wf.delay}s forwards;
}

#section-${sectionNum} .inner-window {
    animation: ${iwAnimName} ${iw.duration}s ${iw.easing} ${iw.delay}s forwards;
}

#section-${sectionNum} .info-panel {
    backdrop-filter: blur(${section.infoPanel.style.blur}px);
    -webkit-backdrop-filter: blur(${section.infoPanel.style.blur}px);
    animation: fadeInPanel ${section.infoPanel.fadeIn.duration}s ${section.infoPanel.fadeIn.easing} ${section.infoPanel.fadeIn.delay}s forwards;
}
`;
    });

    // === Info Panel 淡入动画（通用）===
    css += `
@keyframes fadeInPanel {
    0% {
        opacity: 0;
        transform: translateY(-50%) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(-50%) scale(1);
    }
}`;

    styleElement.textContent = css;

    // 移除旧的动态样式（如果存在）
    const oldStyle = document.getElementById('dynamic-animations');
    if (oldStyle) {
        oldStyle.remove();
    }

    document.head.appendChild(styleElement);
}

// 应用配置
function applyAnimationConfig(config = AnimationConfig) {
    generateAnimationCSS(config);
    console.log('✅ 动画配置已应用');
}

// 导出配置和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationConfig, applyAnimationConfig };
}

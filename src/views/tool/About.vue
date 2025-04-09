<template>
    <div class="about-container">
        <h1>关于项目</h1>
        <div class="about-card">
            <div class="project-info">
                <h2>Three.js学习项目</h2>
                <p class="version">当前版本: <span>1.0.0</span></p>
                <p class="description">
                    这是一个基于Vue 3和Three.js开发的学习项目，旨在帮助开发者快速了解并掌握Three.js的基础知识和应用技巧。
                    通过交互式的示例和详细的代码注释，让Three.js的学习变得更加简单直观。
                </p>

                <div class="tech-stack">
                    <h3>技术栈</h3>
                    <ul>
                        <li><span class="tech">Vue 3</span> - 渐进式JavaScript框架</li>
                        <li><span class="tech">Vite</span> - 下一代前端构建工具</li>
                        <li><span class="tech">Three.js</span> - JavaScript 3D库</li>
                        <li><span class="tech">SCSS</span> - CSS预处理器</li>
                        <li><span class="tech">ESLint</span> - 代码质量工具</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="features">
            <h2>主要功能</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon basics"></div>
                    <h3>基础示例</h3>
                    <p>几何体、材质、光源和相机等Three.js基础概念的交互式演示。</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon advanced"></div>
                    <h3>实战应用</h3>
                    <p>动画效果、物理模拟和用户交互等高级应用场景的实现。</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon code"></div>
                    <h3>代码学习</h3>
                    <p>每个示例都提供了详细的代码注释，便于理解和学习。</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon resources"></div>
                    <h3>学习资源</h3>
                    <p>收集和整理了优质的Three.js学习资源，帮助进一步深入学习。</p>
                </div>
            </div>
        </div>

        <div class="usage-section">
            <h2>使用指南</h2>
            <div class="usage-steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>选择示例</h3>
                        <p>从导航菜单中选择您感兴趣的示例类别，如几何体、材质或动画。</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>互动体验</h3>
                        <p>通过调整控制面板中的参数，实时观察3D场景的变化。</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>查看代码</h3>
                        <p>学习实现该示例的代码，理解Three.js的工作原理。</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>创建自己的项目</h3>
                        <p>利用所学知识，创建您自己的Three.js应用。</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="credits">
            <h2>贡献者</h2>
            <p>感谢以下开发者对本项目的贡献：</p>
            <div class="contributors">
                <div class="contributor">
                    <div class="avatar"></div>
                    <div class="info">
                        <h3>开发者1</h3>
                        <p>主要开发者</p>
                    </div>
                </div>
                <div class="contributor">
                    <div class="avatar"></div>
                    <div class="info">
                        <h3>开发者2</h3>
                        <p>贡献者</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact">
            <h2>联系我们</h2>
            <p>如果您有任何问题或建议，请通过以下方式联系我们：</p>
            <div class="contact-methods">
                <a href="mailto:contact@example.com" class="contact-method email">
                    <span class="icon"></span>
                    <span>contact@example.com</span>
                </a>
                <a href="https://github.com/yourname/threejs-study" target="_blank" class="contact-method github">
                    <span class="icon"></span>
                    <span>GitHub仓库</span>
                </a>
            </div>
        </div>

        <router-link to="/" class="back-link">返回首页</router-link>
    </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style lang="scss" scoped>
@use "sass:color";

// 颜色变量
$primary-color: #42b883;
$secondary-color: #35495e;
$dark-text: #2c3e50;
$light-text: #666;
$background: #f8f8f8;
$card-bg: #ffffff;
$card-shadow: rgba(0, 0, 0, 0.1);
$gradient-start: #42b883;
$gradient-end: #41b883;

.about-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;

    h1 {
        font-size: 2.5rem;
        color: $primary-color;
        text-align: center;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1.8rem;
        color: $secondary-color;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid $primary-color;
    }

    p {
        line-height: 1.6;
        color: $light-text;
        margin-bottom: 1rem;
    }

    .about-card,
    .features,
    .usage-section,
    .credits,
    .contact {
        margin-bottom: 3rem;
        background-color: $card-bg;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 4px 12px $card-shadow;
    }

    .project-info {
        .version {
            margin-bottom: 1.5rem;
            font-style: italic;

            span {
                font-weight: bold;
                color: $primary-color;
            }
        }

        .description {
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
    }

    .tech-stack {
        margin-top: 2rem;

        h3 {
            font-size: 1.4rem;
            color: $dark-text;
            margin-bottom: 1rem;
        }

        ul {
            list-style-type: none;
            padding: 0;

            li {
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;

                &:before {
                    content: '•';
                    color: $primary-color;
                    font-weight: bold;
                    margin-right: 0.75rem;
                }

                .tech {
                    font-weight: 600;
                    color: $dark-text;
                }
            }
        }
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;

        .feature-card {
            background-color: $background;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            }

            .feature-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 1rem;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 40px;

                &.basics {
                    background-color: #3498db;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>');
                }

                &.advanced {
                    background-color: #e74c3c;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 16a3 3 0 0 1-3-3c0-1.12.61-2.1 1.5-2.61l4.72-9.77A10 10 0 0 1 22 12c0 5.5-4.5 10-10 10S2 17.5 2 12c0-2.36.82-4.5 2.2-6.2L6 12c0 3.32 2.68 6 6 6s6-2.68 6-6c0-1-.25-1.94-.68-2.77l-4.32 8.16c-.58.13-1 .73-1 1.61z"/></svg>');
                }

                &.code {
                    background-color: #2ecc71;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/></svg>');
                }

                &.resources {
                    background-color: #f39c12;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>');
                }
            }

            h3 {
                font-size: 1.3rem;
                color: $dark-text;
                margin-bottom: 0.75rem;
            }

            p {
                font-size: 0.95rem;
            }
        }
    }

    .usage-steps {
        .step {
            display: flex;
            margin-bottom: 1.5rem;
            align-items: flex-start;

            &:last-child {
                margin-bottom: 0;
            }

            .step-number {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, $gradient-start, $gradient-end);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                flex-shrink: 0;
                margin-right: 1.25rem;
            }

            .step-content {
                h3 {
                    font-size: 1.3rem;
                    color: $dark-text;
                    margin-bottom: 0.5rem;
                }

                p {
                    margin-bottom: 0;
                }
            }
        }
    }

    .contributors {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;

        .contributor {
            display: flex;
            align-items: center;

            .avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #ddd;
                margin-right: 1rem;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23aaaaaa"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
                background-position: center;
                background-repeat: no-repeat;
                background-size: 65%;
            }

            .info {
                h3 {
                    font-size: 1.2rem;
                    color: $dark-text;
                    margin-bottom: 0.25rem;
                }

                p {
                    margin-bottom: 0;
                    font-size: 0.9rem;
                }
            }
        }
    }

    .contact-methods {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;

        .contact-method {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: $light-text;
            padding: 0.75rem 1.25rem;
            background-color: $background;
            border-radius: 4px;
            transition: background-color 0.2s, transform 0.2s;

            &:hover {
                background-color: #eee;
                transform: translateY(-2px);
            }

            .icon {
                width: 24px;
                height: 24px;
                margin-right: 0.75rem;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }

            &.email .icon {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666666"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>');
            }

            &.github .icon {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666666"><path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.2-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 0z"/></svg>');
            }
        }
    }

    .back-link {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: $primary-color;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }
    }
}

@media (max-width: 768px) {
    .about-container {
        padding: 1rem;

        .about-card,
        .features,
        .usage-section,
        .credits,
        .contact {
            padding: 1.5rem;
        }

        .feature-grid {
            grid-template-columns: 1fr;
        }

        .contributors {
            flex-direction: column;
            gap: 1rem;
        }

        .contact-methods {
            flex-direction: column;
            gap: 1rem;
        }
    }
}
</style>
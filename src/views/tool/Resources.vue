<template>
    <div class="resources-container">
        <h1>Three.js学习资源</h1>

        <div class="resources-section">
            <h2>官方文档</h2>
            <div class="resources-list">
                <div class="resource-card">
                    <div class="resource-icon documentation"></div>
                    <div class="resource-content">
                        <h3>Three.js官方文档</h3>
                        <p>最权威的Three.js开发指南和API参考。</p>
                        <a href="https://threejs.org/docs/#api/zh" target="_blank" class="resource-link">访问官方文档</a>
                    </div>
                </div>
                <div class="resource-card">
                    <div class="resource-icon examples"></div>
                    <div class="resource-content">
                        <h3>Three.js官方示例</h3>
                        <p>丰富的代码示例和效果展示，是学习Three.js技术的绝佳资源。</p>
                        <a href="https://threejs.org/examples/" target="_blank" class="resource-link">查看示例</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-section">
            <h2>入门教程</h2>
            <div class="resources-list">
                <div class="resource-card">
                    <div class="resource-icon tutorial"></div>
                    <div class="resource-content">
                        <h3>Three.js基础教程</h3>
                        <p>从零开始学习Three.js的基础概念和使用方法。</p>
                        <a href="https://threejs.org/manual/" target="_blank" class="resource-link">阅读教程</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-section">
            <h2>高级资源</h2>
            <div class="resources-list">
                <div class="resource-card">
                    <div class="resource-icon book"></div>
                    <div class="resource-content">
                        <h3>Three.js进阶教程</h3>
                        <p>探索Three.js的高级特性和技术，包括着色器、后期处理等。</p>
                        <a href="https://discoverthreejs.com/" target="_blank" class="resource-link">深入学习</a>
                    </div>
                </div>
                <div class="resource-card">
                    <div class="resource-icon github"></div>
                    <div class="resource-content">
                        <h3>GitHub项目</h3>
                        <p>Three.js的官方仓库，可以查看源码和参与社区讨论。</p>
                        <a href="https://github.com/mrdoob/three.js/" target="_blank" class="resource-link">访问GitHub</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-section">
            <h2>工具与库</h2>
            <div class="resources-list">
                <div class="resource-card">
                    <div class="resource-icon tools"></div>
                    <div class="resource-content">
                        <h3>Three.js编辑器</h3>
                        <p>在线创建和编辑Three.js场景的可视化工具。</p>
                        <a href="https://threejs.org/editor/" target="_blank" class="resource-link">使用编辑器</a>
                    </div>
                </div>
                <div class="resource-card">
                    <div class="resource-icon physics"></div>
                    <div class="resource-content">
                        <h3>物理引擎</h3>
                        <p>与Three.js结合使用的物理模拟库，如Cannon.js、Ammo.js等。</p>
                        <a href="https://github.com/pmndrs/cannon-es" target="_blank"
                            class="resource-link">了解Cannon-es</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-section">
            <h2>社区与论坛</h2>
            <div class="resources-list">
                <div class="resource-card">
                    <div class="resource-icon forum"></div>
                    <div class="resource-content">
                        <h3>Three.js论坛</h3>
                        <p>官方讨论区，可以提问和分享你的Three.js项目。</p>
                        <a href="https://discourse.threejs.org/" target="_blank" class="resource-link">加入讨论</a>
                    </div>
                </div>
                <div class="resource-card">
                    <div class="resource-icon stackoverflow"></div>
                    <div class="resource-content">
                        <h3>Stack Overflow</h3>
                        <p>查找Three.js相关问题的解答和技术讨论。</p>
                        <a href="https://stackoverflow.com/questions/tagged/three.js" target="_blank"
                            class="resource-link">浏览问答</a>
                    </div>
                </div>
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

.resources-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;

    h1 {
        font-size: 2.5rem;
        color: $primary-color;
        margin-bottom: 2rem;
        text-align: center;
    }

    .resources-section {
        margin-bottom: 3rem;

        h2 {
            font-size: 1.8rem;
            color: $secondary-color;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid $primary-color;
        }

        .resources-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
            gap: 1.5rem;
        }
    }

    .resource-card {
        display: flex;
        background-color: $card-bg;
        border-radius: 8px;
        box-shadow: 0 4px 12px $card-shadow;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .resource-icon {
            width: 100px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 50px;
            flex-shrink: 0;

            &.documentation {
                background-color: #3498db;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>');
            }

            &.examples {
                background-color: #9b59b6;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21.31 9.58L24 6l-3-3-2.6 2.6a7.75 7.75 0 0 0-3.6-.93 8.75 8.75 0 0 0-4.72 1.44A5.87 5.87 0 0 1 7.38 7.18l2.24.75a3.78 3.78 0 0 0 1.5-1 6.75 6.75 0 0 1 3.66-1.12 5.64 5.64 0 0 1 2.66.69L15 9l1.12 1.12 5.19-0.54zm-6.9 8.06A7.94 7.94 0 0 1 3.59 11.5 8 8 0 0 1 11.68 4a6.65 6.65 0 0 1 .64 0 10 10 0 0 0-2.84 3.64 5.52 5.52 0 0 0-4.29 5.4 5.82 5.82 0 0 0 6.22 5.41 5.68 5.68 0 0 0 2.78-.72 10.05 10.05 0 0 0 3.65-2.84 6.94 6.94 0 0 1-2.93 2.75z"/></svg>');
            }

            &.tutorial {
                background-color: #e74c3c;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>');
            }

            &.video {
                background-color: #e67e22;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>');
            }

            &.book {
                background-color: #2ecc71;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>');
            }

            &.github {
                background-color: #34495e;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.2-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 0z"/></svg>');
            }

            &.tools {
                background-color: #f39c12;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>');
            }

            &.physics {
                background-color: #1abc9c;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>');
            }

            &.forum {
                background-color: #8e44ad;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>');
            }

            &.stackoverflow {
                background-color: #f1c40f;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z"/></svg>');
            }
        }

        .resource-content {
            padding: 1.25rem;
            flex-grow: 1;

            h3 {
                font-size: 1.35rem;
                color: $secondary-color;
                margin-bottom: 0.75rem;
            }

            p {
                color: $light-text;
                margin-bottom: 1rem;
            }

            .resource-link {
                display: inline-block;
                padding: 0.5rem 1rem;
                background-color: $primary-color;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                transition: background-color 0.2s;

                &:hover {
                    background-color: color.scale($primary-color, $lightness: -10%);
                }
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
        margin-top: 1rem;
        font-weight: 600;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }
    }
}

@media (max-width: 768px) {
    .resources-container {
        padding: 1rem;

        .resources-section .resources-list {
            grid-template-columns: 1fr;
        }

        .resource-card {
            flex-direction: column;

            .resource-icon {
                width: 100%;
                height: 80px;
            }
        }
    }
}
</style>
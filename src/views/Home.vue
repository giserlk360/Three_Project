<template>
    <div class="home-container">
        <h1>Three.js 学习历程</h1>
        <p class="intro">欢迎来到我的Three.js学习之旅，这里记录了我在学习过程中的各个阶段和成果。</p>

        <!-- 搜索和过滤区域 -->
        <div class="search-filter-container">
            <div class="search-box">
                <input type="text" v-model="searchQuery" placeholder="搜索标题..." @input="filterCards">
                <button class="clear-btn" @click="clearSearch" v-if="searchQuery">✕</button>
            </div>

            <div class="filter-section">
                <div class="filter-group">
                    <label>日期范围：</label>
                    <div class="date-inputs">
                        <input type="date" v-model="dateFilter.start" @change="filterCards" :max="dateFilter.end">
                        <span>至</span>
                        <input type="date" v-model="dateFilter.end" @change="filterCards" :min="dateFilter.start">
                    </div>
                </div>

                <div class="filter-group">
                    <label>状态：</label>
                    <div class="status-checkboxes">
                        <label v-for="status in statusOptions" :key="status.value">
                            <input type="checkbox" v-model="statusFilter" :value="status.value" @change="filterCards">
                            <span :class="['status-label', status.value]">{{ status.label }}</span>
                        </label>
                    </div>
                </div>

                <button class="reset-btn" @click="resetFilters">重置筛选</button>
            </div>
        </div>

        <!-- 结果统计 -->
        <div class="results-summary" v-if="isFiltering">
            <p>找到 {{ filteredCards.length }} 个结果</p>
        </div>

        <!-- 卡片容器 -->
        <div class="cards-container" v-if="filteredCards.length > 0">
            <div v-for="card in filteredCards" :key="card.id" class="card" @click="navigateTo(card.path)">
                <div class="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L19.09 8 12 11.764 4.91 8 12 4.236zM4 9.618l7 3.5v7.264l-7-3.5V9.618zm9 10.764v-7.264l7-3.5v7.264l-7 3.5z"
                            :fill="card.color" />
                    </svg>
                </div>
                <h2>{{ card.title }}</h2>
                <p>{{ card.description }}</p>
                <div class="card-footer">
                    <span class="date">{{ card.date }}</span>
                    <span :class="['status', card.status]">{{ getStatusText(card.status) }}</span>
                </div>
            </div>
        </div>

        <!-- 无结果提示 -->
        <div class="no-results" v-else>
            <p>没有找到匹配的内容</p>
            <button @click="resetFilters">清除筛选条件</button>
        </div>

        <div class="admin-link-container">
            <router-link to="/admin" class="admin-link">进入管理后台</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api/mock';

const router = useRouter();
const allCards = ref([]);
const cards = ref([]);

// 搜索和过滤状态
const searchQuery = ref('');
const dateFilter = ref({
    start: '',
    end: ''
});
const statusFilter = ref([]);

// 状态选项
const statusOptions = [
    { value: 'completed', label: '已完成' },
    { value: 'in-progress', label: '进行中' },
    { value: 'planned', label: '计划中' }
];

// 计算属性：是否在筛选中
const isFiltering = computed(() => {
    return searchQuery.value || dateFilter.value.start || dateFilter.value.end || statusFilter.value.length > 0;
});

// 计算属性：筛选后的卡片
const filteredCards = computed(() => {
    return cards.value;
});

// 初始化
onMounted(async () => {
    await loadCards();
});

// 加载卡片数据
const loadCards = async () => {
    try {
        allCards.value = await api.getCards();
        cards.value = [...allCards.value]; // 初始显示所有卡片
    } catch (error) {
        console.error('加载卡片失败:', error);
    }
};

// 过滤卡片
const filterCards = () => {
    let filtered = [...allCards.value];

    // 标题搜索过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(card =>
            card.title.toLowerCase().includes(query)
        );
    }

    // 日期范围过滤
    if (dateFilter.value.start) {
        filtered = filtered.filter(card =>
            new Date(card.date) >= new Date(dateFilter.value.start)
        );
    }

    if (dateFilter.value.end) {
        filtered = filtered.filter(card =>
            new Date(card.date) <= new Date(dateFilter.value.end)
        );
    }

    // 状态过滤
    if (statusFilter.value.length > 0) {
        filtered = filtered.filter(card =>
            statusFilter.value.includes(card.status)
        );
    }

    cards.value = filtered;
};

// 清除搜索
const clearSearch = () => {
    searchQuery.value = '';
    filterCards();
};

// 重置所有过滤器
const resetFilters = () => {
    searchQuery.value = '';
    dateFilter.value = {
        start: '',
        end: ''
    };
    statusFilter.value = [];
    cards.value = [...allCards.value];
};

// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 'completed':
            return '已完成';
        case 'in-progress':
            return '进行中';
        case 'planned':
            return '计划中';
        default:
            return '';
    }
};

const navigateTo = (path) => {
    router.push(path);
};
</script>

<style lang="scss" scoped>
@use "sass:color";

// 颜色变量
$primary-color: #42b883;
$secondary-color: #3498db;
$dark-text: #2c3e50;
$light-text: #666;
$lighter-text: #999;
$background: #fff;
$border-light: #eee;

// 状态颜色
$completed-color: #2ecc71;
$in-progress-color: #3498db;
$planned-color: #999;

// 尺寸变量
$container-max-width: 1600px;
$card-border-radius: 12px;
$card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
$card-hover-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

// 混合器
@mixin flex-center {
    display: flex;
    justify-content: center;
}

@mixin card-status($bg-color, $text-color) {
    background-color: $bg-color;
    color: $text-color;
}

.home-container {
    width: 100%;
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 1rem;
    box-sizing: border-box;

    h1 {
        font-size: 2.5rem;
        color: $dark-text;
        margin-bottom: 1rem;
        text-align: center;
    }

    .intro {
        font-size: 1.2rem;
        color: $light-text;
        margin-bottom: 2rem;
        text-align: center;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }

    .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
        width: 100%;
    }
}

// 搜索和过滤样式
.search-filter-container {
    background-color: white;
    border-radius: $card-border-radius;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    .search-box {
        position: relative;
        margin-bottom: 1.5rem;

        input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 1px solid $border-light;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;

            &:focus {
                border-color: $primary-color;
                box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
            }
        }

        .clear-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: $lighter-text;
            font-size: 14px;
            cursor: pointer;
            padding: 5px;

            &:hover {
                color: $dark-text;
            }
        }
    }

    .filter-section {

        gap: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid $border-light;
    }

    .filter-group {
        display: flex;
        flex-wrap: wrap;
        min-width: 200px;

        label {
            display: block;
            margin: 0.5rem 1rem 0.5rem 0;
            font-weight: 500;
            color: $dark-text;
        }
    }

    .date-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        input {
            flex: 1;
            padding: 0.5rem;
            border: 1px solid $border-light;
            border-radius: 4px;
            outline: none;

            &:focus {
                border-color: $primary-color;
            }
        }

        span {
            color: $light-text;
        }
    }

    .status-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        label {
            display: flex;
            align-items: center;
            font-weight: normal;
            cursor: pointer;
            margin-bottom: 0;
        }

        input[type="checkbox"] {
            margin-right: 0.5rem;
        }

        .status-label {
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.85rem;

            &.completed {
                @include card-status(rgba($completed-color, 0.1), $completed-color);
            }

            &.in-progress {
                @include card-status(rgba($in-progress-color, 0.1), $in-progress-color);
            }

            &.planned {
                @include card-status(rgba($planned-color, 0.1), $planned-color);
            }
        }
    }

    .reset-btn {
        padding: 0.5rem 1rem;
        background-color: #f5f5f5;
        border: none;
        border-radius: 4px;
        color: $dark-text;
        cursor: pointer;
        transition: background-color 0.2s;
        font-weight: 500;
        margin-top: auto;
        align-self: flex-end;

        &:hover {
            background-color: #e8e8e8;
        }
    }
}

.results-summary {
    margin-bottom: 1.5rem;
    color: $light-text;
    font-size: 0.9rem;
}

.no-results {
    padding: 3rem;
    text-align: center;
    background-color: white;
    border-radius: $card-border-radius;
    box-shadow: $card-shadow;

    p {
        color: $light-text;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    button {
        padding: 0.75rem 1.5rem;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($primary-color, $lightness: 5%);
        }
    }
}

.admin-link-container {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;

    .admin-link {
        display: inline-block;
        padding: 10px 20px;
        background-color: $dark-text;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($dark-text, $lightness: 10%);
        }
    }
}

.card {
    background-color: $background;
    border-radius: $card-border-radius;
    box-shadow: $card-shadow;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-10px);
        box-shadow: $card-hover-shadow;

        &::before {
            opacity: 1;
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(90deg, $primary-color, $secondary-color);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .card-icon {
        margin-bottom: 1.5rem;
        @include flex-center;
    }

    h2 {
        font-size: 1.5rem;
        color: $dark-text;
        margin-bottom: 1rem;
    }

    p {
        color: $light-text;
        margin-bottom: 1.5rem;
        flex-grow: 1;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid $border-light;

        .date {
            font-size: 0.9rem;
            color: $lighter-text;
        }

        .status {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-weight: 500;

            &.completed {
                @include card-status(rgba($completed-color, 0.1), $completed-color);
            }

            &.in-progress {
                @include card-status(rgba($in-progress-color, 0.1), $in-progress-color);
            }

            &.planned {
                @include card-status(rgba($planned-color, 0.1), $planned-color);
            }
        }
    }
}

@media (max-width: 1200px) {
    .cards-container {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .filter-section {
        flex-direction: column;
        gap: 1rem;
    }

    .reset-btn {
        width: 100%;
        margin-top: 1rem;
    }
}

@media (max-width: 768px) {
    .cards-container {
        grid-template-columns: 1fr;
    }

    .home-container {
        padding: 0.5rem;
    }

    .date-inputs {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
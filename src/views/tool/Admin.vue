<template>
    <div class="admin-container">
        <h1>卡片管理后台</h1>

        <!-- 添加新卡片按钮 -->
        <div class="actions">
            <button class="btn reset-btn" @click="confirmReset">重置数据</button>
            <button class="btn add-btn" @click="showCardForm(null)">添加新卡片</button>
        </div>

        <!-- 卡片列表 -->
        <div class="card-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>标题</th>
                        <th>描述</th>
                        <th>路径</th>
                        <th>日期</th>
                        <th>状态</th>
                        <th>颜色</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="card in cards" :key="card.id">
                        <td>{{ card.id }}</td>
                        <td>{{ card.title }}</td>
                        <td class="description-cell">{{ card.description }}</td>
                        <td>{{ card.path }}</td>
                        <td>{{ card.date }}</td>
                        <td>
                            <span :class="['status-badge', card.status]">
                                {{ getStatusText(card.status) }}
                            </span>
                        </td>
                        <td>
                            <div class="color-preview" :style="{ backgroundColor: card.color }"></div>
                        </td>
                        <td class="actions-cell">
                            <button class="btn edit-btn" @click="showCardForm(card)">编辑</button>
                            <button class="btn delete-btn" @click="confirmDelete(card)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 卡片表单对话框 -->
        <div class="modal" v-if="showModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ isEditing ? '编辑卡片' : '添加新卡片' }}</h2>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveCard">
                        <div class="form-group">
                            <label for="title">标题</label>
                            <input type="text" id="title" v-model="formData.title" required>
                        </div>
                        <div class="form-group">
                            <label for="description">描述</label>
                            <textarea id="description" v-model="formData.description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="path">路径</label>
                            <input type="text" id="path" v-model="formData.path" required>
                        </div>
                        <div class="form-group">
                            <label for="date">日期</label>
                            <input type="date" id="date" v-model="formData.date" required>
                        </div>
                        <div class="form-group">
                            <label for="status">状态</label>
                            <select id="status" v-model="formData.status" required>
                                <option value="completed">已完成</option>
                                <option value="in-progress">进行中</option>
                                <option value="planned">计划中</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="color">颜色</label>
                            <input type="color" id="color" v-model="formData.color" required class="color-input">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn cancel-btn" @click="closeModal">取消</button>
                            <button type="submit" class="btn save-btn">保存</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- 删除确认对话框 -->
        <div class="modal" v-if="showDeleteModal">
            <div class="modal-content delete-modal">
                <div class="modal-header">
                    <h2>确认删除</h2>
                    <button class="close-btn" @click="showDeleteModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <p>您确定要删除卡片 <strong>"{{ cardToDelete?.title }}"</strong> 吗？</p>
                    <p class="warning">此操作不可撤销！</p>
                    <div class="form-actions">
                        <button type="button" class="btn cancel-btn" @click="showDeleteModal = false">取消</button>
                        <button type="button" class="btn delete-btn" @click="deleteCard">确认删除</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 重置确认对话框 -->
        <div class="modal" v-if="showResetModal">
            <div class="modal-content delete-modal">
                <div class="modal-header">
                    <h2>确认重置</h2>
                    <button class="close-btn" @click="showResetModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <p>您确定要重置所有卡片数据吗？</p>
                    <p class="warning">此操作将恢复所有数据到初始状态，且不可撤销！</p>
                    <div class="form-actions">
                        <button type="button" class="btn cancel-btn" @click="showResetModal = false">取消</button>
                        <button type="button" class="btn delete-btn" @click="resetData">确认重置</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { api } from '../../api/mock';

// 状态和数据
const cards = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showResetModal = ref(false);
const isEditing = ref(false);
const cardToDelete = ref(null);
const formData = reactive({
    title: '',
    description: '',
    path: '',
    date: '',
    status: 'planned',
    color: '#42b883'
});

// 初始化
onMounted(async () => {
    await loadCards();
});

// 加载卡片数据
const loadCards = async () => {
    try {
        cards.value = await api.getCards();
    } catch (error) {
        console.error('加载卡片失败:', error);
        alert('加载卡片数据失败，请稍后重试');
    }
};

// 显示卡片表单
const showCardForm = (card) => {
    isEditing.value = !!card;

    if (card) {
        // 编辑现有卡片，复制数据到表单
        Object.assign(formData, card);

        // 确保日期格式正确 (YYYY-MM-DD)
        const dateParts = card.date.split('-');
        if (dateParts.length === 3) {
            formData.date = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
        }
    } else {
        // 添加新卡片，重置表单
        Object.assign(formData, {
            title: '',
            description: '',
            path: '/',
            date: new Date().toISOString().slice(0, 10),
            status: 'planned',
            color: '#42b883'
        });
    }

    showModal.value = true;
};

// 关闭表单对话框
const closeModal = () => {
    showModal.value = false;
};

// 保存卡片
const saveCard = async () => {
    try {
        if (isEditing.value) {
            // 更新现有卡片
            await api.updateCard(formData.id, formData);
        } else {
            // 添加新卡片
            await api.addCard(formData);
        }

        // 重新加载卡片数据
        await loadCards();
        closeModal();
    } catch (error) {
        console.error('保存卡片失败:', error);
        alert('保存卡片失败，请稍后重试');
    }
};

// 确认删除对话框
const confirmDelete = (card) => {
    cardToDelete.value = card;
    showDeleteModal.value = true;
};

// 删除卡片
const deleteCard = async () => {
    if (!cardToDelete.value) return;

    try {
        await api.deleteCard(cardToDelete.value.id);
        await loadCards();
        showDeleteModal.value = false;
    } catch (error) {
        console.error('删除卡片失败:', error);
        alert('删除卡片失败，请稍后重试');
    }
};

// 确认重置对话框
const confirmReset = () => {
    showResetModal.value = true;
};

// 重置数据
const resetData = async () => {
    try {
        await api.resetData();
        await loadCards();
        showResetModal.value = false;
        // 重置后需刷新页面
        window.location.reload();
    } catch (error) {
        console.error('重置数据失败:', error);
        alert('重置数据失败，请稍后重试');
    }
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
</script>

<style lang="scss" scoped>
@use "sass:color";

// 颜色变量
$primary-color: #42b883;
$secondary-color: #3498db;
$danger-color: #e74c3c;
$warning-color: #f39c12;
$dark-text: #2c3e50;
$light-text: #666;
$background-light: #f9f9f9;
$border-color: #eee;

// 状态颜色
$completed-color: #2ecc71;
$in-progress-color: #3498db;
$planned-color: #999;

.admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;

    h1 {
        color: $dark-text;
        margin-bottom: 2rem;
        text-align: center;
        font-size: 2rem;
    }

    .actions {
        margin-bottom: 1.5rem;
        text-align: right;
    }

    .card-list {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        overflow: auto;

        table {
            width: 100%;
            border-collapse: collapse;

            th,
            td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid $border-color;
            }

            th {
                background-color: $background-light;
                font-weight: 600;
                color: $dark-text;
            }

            tr:hover {
                background-color: $background-light;
            }

            .description-cell {
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .actions-cell {
                white-space: nowrap;
                width: 150px;
            }

            .color-preview {
                width: 30px;
                height: 30px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }

            .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;

                &.completed {
                    background-color: rgba($completed-color, 0.1);
                    color: $completed-color;
                }

                &.in-progress {
                    background-color: rgba($in-progress-color, 0.1);
                    color: $in-progress-color;
                }

                &.planned {
                    background-color: rgba($planned-color, 0.1);
                    color: $planned-color;
                }
            }
        }
    }
}

// 按钮样式
.btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    outline: none;
    margin-left: 8px;

    &.add-btn {
        background-color: $primary-color;
        color: white;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }
    }

    &.edit-btn {
        background-color: $secondary-color;
        color: white;

        &:hover {
            background-color: color.scale($secondary-color, $lightness: -10%);
        }
    }

    &.delete-btn {
        background-color: $danger-color;
        color: white;

        &:hover {
            background-color: color.scale($danger-color, $lightness: -10%);
        }
    }

    &.reset-btn {
        background-color: $warning-color;
        color: white;

        &:hover {
            background-color: color.scale($warning-color, $lightness: -10%);
        }
    }

    &.cancel-btn {
        background-color: #ccc;
        color: $dark-text;

        &:hover {
            background-color: color.scale(#ccc, $lightness: -10%);
        }
    }

    &.save-btn {
        background-color: $primary-color;
        color: white;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }
    }
}

// 模态对话框
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        overflow: hidden;

        &.delete-modal {
            max-width: 450px;
        }
    }

    .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid $border-color;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            margin: 0;
            color: $dark-text;
            font-size: 1.5rem;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: $light-text;
            transition: color 0.3s;

            &:hover {
                color: $danger-color;
            }
        }
    }

    .modal-body {
        padding: 20px;

        .warning {
            color: $danger-color;
            font-weight: 500;
        }
    }

    .form-group {
        margin-bottom: 1rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: $dark-text;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;

            &:focus {
                outline: none;
                border-color: $primary-color;
                box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
            }
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }
    }

    .form-actions {
        margin-top: 1.5rem;
        display: flex;
        justify-content: flex-end;
    }
}

@media (max-width: 768px) {
    .card-list {
        overflow-x: auto;

        table {
            min-width: 900px;
        }
    }

    .modal-content {
        width: 95%;
    }
}
</style>
# Three.js 学习项目

Three.js 学习历程记录应用，包含前端Vue应用和Node.js后端服务。

## 项目特点

- 基于Vue 3的前端界面
- Node.js Express后端API
- NeDB文件数据库持久化存储
- Three.js 3D场景展示
- 自动/手动数据库压缩，避免数据冗余

## 项目结构

- `src/`: 前端Vue应用源代码
  - `views/base/`: Three.js基础组件
  - `views/tool/`: 工具和管理界面
  - `api/`: API接口定义
- `server/`: 后端Node.js服务
  - `models/`: 数据库模型
  - `routes/`: API路由
  - `data/`: 数据存储目录

## 安装与运行

### 安装依赖

1. 安装前端依赖:
```bash
npm install
```

2. 安装后端依赖:
```bash
cd server
npm install
```

### 启动应用

1. 启动后端服务 (开发模式):
```bash
cd server
npm run dev
```

2. 启动前端应用 (开发模式):
```bash
# 在另一个终端窗口中运行
npm run dev
```

## 功能说明

### Three.js 学习展示

项目包含多个Three.js示例，展示了不同的功能:

- 基础场景与几何体 (`/base/geometry`)
- 材质与光照 (`/base/material`)
- 相机控制 (`/base/camera`)
- 光照系统 (`/base/light`)
- 动画控制 (`/base/animation`)
- 物理引擎 (`/base/physics`)

### 卡片管理后台

管理界面提供了卡片内容的CRUD操作，访问地址: `/tool/admin`

- 添加新卡片
- 编辑现有卡片
- 删除卡片
- 重置数据

## 数据持久化

数据存储在 `server/data/cards.db` 文件中，采用NeDB文件数据库。即使浏览器清除缓存，数据仍会保存在服务器上。

### 数据库压缩

NeDB数据库使用追加式写入，会导致数据文件随着删除和更新操作而包含越来越多的冗余数据。本项目实现了两种数据库压缩方式：

1. **自动压缩**：在执行删除操作和重置数据操作后自动触发
2. **手动压缩**：通过调用API端点 `/api/compact` 手动触发

压缩功能会清理被标记为删除的记录，减小数据库文件大小，提高性能。

## API接口

| 方法   | 路径           | 描述         |
|--------|---------------|--------------|
| GET    | /api/cards    | 获取所有卡片   |
| GET    | /api/cards/:id | 获取单个卡片   |
| POST   | /api/cards    | 创建新卡片     |
| PUT    | /api/cards/:id | 更新卡片      |
| DELETE | /api/cards/:id | 删除卡片      |
| POST   | /api/reset    | 重置所有数据    |
| POST   | /api/compact  | 压缩数据库     |
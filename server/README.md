# Three.js 项目后端服务器

这是Three.js学习项目的后端服务器，使用Node.js和Express构建，数据存储采用NeDB文件数据库。

## 功能

- 卡片数据的CRUD操作
- 数据持久化存储在JSON文件中
- 支持重置数据
- 自动和手动数据库压缩，避免文件冗余

## 安装与启动

### 安装依赖

```bash
cd server
npm install
```

### 启动服务器

开发模式（带热重载）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

服务器默认运行在 http://localhost:3000

## API 接口

| 方法   | 路径           | 描述         |
|--------|---------------|--------------|
| GET    | /api/cards    | 获取所有卡片   |
| GET    | /api/cards/:id | 获取单个卡片   |
| POST   | /api/cards    | 创建新卡片     |
| PUT    | /api/cards/:id | 更新卡片      |
| DELETE | /api/cards/:id | 删除卡片      |
| POST   | /api/reset    | 重置所有数据    |
| POST   | /api/compact  | 手动压缩数据库文件，清理已删除记录 |

## 数据存储

数据存储在 `server/data/cards.db` 文件中，是一个JSON格式的NeDB数据库文件。即使浏览器清除缓存，数据也会持久保存。

## 数据库压缩功能

NeDB采用追加写入方式工作，这意味着当删除或更新文档时，原始文档并不会从文件中物理删除，而是标记为删除状态。这可能导致数据库文件随着时间增长而变大，包含大量无用数据。

为了解决这个问题，系统实现了两种压缩方式：

1. **自动压缩**：在执行删除操作和重置数据操作后，系统会自动调用压缩功能。

2. **手动压缩**：通过调用 `/api/compact` API端点，可以手动触发数据库压缩。

压缩过程会重写数据库文件，移除所有被标记为删除的文档，减小文件大小，提高数据库性能。 
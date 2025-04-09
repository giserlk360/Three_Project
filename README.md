# Three.js 项目

这是一个基于 Vue 3 + Vite 的 Three.js 项目，旨在通过一系列实例展示 Three.js 的基础知识和进阶用法。

## 项目特点

- 🚀 基于 Vue 3、Vite 和 Three.js 构建
- 📱 响应式设计，支持各种设备屏幕尺寸
- 🎨 直观的用户界面，易于学习和使用
- 📚 包含多个示例，涵盖 Three.js 的基础和高级特性
- 🛠 交互式控制面板，方便调整参数并观察效果

## 功能模块

### 基础部分

- **几何体**：展示各种 Three.js 几何体及其属性
- **材质**：介绍不同类型的材质及其应用
- **光源**：展示各种光源类型及其效果
- **相机**：演示透视相机和正交相机的区别和使用方法

### 实战部分

- **动画效果**：实现多种 3D 动画效果和过渡
- **物理引擎**：集成物理引擎实现碰撞和重力效果
- **交互控制**：实现用户与 3D 场景的交互

### 工具部分

- **数据管理**：管理项目中的 3D 资源和数据
- **学习资源**：提供 Three.js 学习资源链接
- **关于项目**：项目信息和开发者说明

## 安装与运行

### 环境要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/giserlk360/Three_Project.git
cd Three_Project
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
three-study/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 图片和其他资源
│   ├── components/     # 通用组件
│   ├── api/            # API和模拟数据
│   ├── router/         # 路由配置
│   ├── views/          # 页面组件
│   │   ├── base/       # 基础示例
│   │   ├── advanced/   # 高级示例
│   │   └── tools/      # 工具页面
│   ├── App.vue         # 根组件
│   ├── main.js         # 入口文件
│   └── style.css       # 全局样式
├── index.html          # HTML模板
└── vite.config.js      # Vite配置
```

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
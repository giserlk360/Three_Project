<template>
  <div class="geometry-container">
    <h1>几何体示例</h1>
    <div class="canvas-container" ref="canvasContainer"></div>
    <div class="description">
      <h2>场景说明</h2>
      <p>这个示例展示了Three.js中的各种几何体，包括立方体、球体、圆柱体等。</p>
      <p>您可以通过控制面板切换不同的几何体类型。</p>
    </div>
    <div class="controls">
      <h3>控制面板</h3>
      <div class="control-group">
        <label>几何体类型：</label>
        <select v-model="selectedGeometry">
          <option v-for="geometry in geometryList" :key="geometry.name" :value="geometry.name">{{ geometry.description
            }}</option>
        </select>
      </div>
      <div class="control-group">
        <label>线框模式：</label>
        <input type="checkbox" v-model="wireframe">
      </div>
    </div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
const selectedGeometry = ref('box');
const wireframe = ref(false);

const geometryList = [
  {
    name: 'box',
    description: '立方体'
  },
  {
    name: 'sphere',
    description: '球体'
  },
  {
    name: 'cylinder',
    description: '圆柱体'
  },
  {
    name: 'cone',
    description: '圆锥体'
  },
  {
    name: 'torus',
    description: '圆环'
  }
]

let scene, camera, renderer, mesh;
let animationId = null;

// 初始化Three.js场景
const initThree = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.value.clientWidth / canvasContainer.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
  canvasContainer.value.appendChild(renderer.domElement);

  // 创建几何体
  createGeometry();

  // 开始动画循环
  animate();

  // 添加窗口大小调整监听器
  window.addEventListener('resize', onWindowResize);
};

// 创建几何体
const createGeometry = () => {
  // 如果已有网格，先移除
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  let geometry;

  // 根据选择创建不同的几何体
  switch (selectedGeometry.value) {
    case 'box':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(1, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(1, 2, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 32);
      break;
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x42b883,
    wireframe: wireframe.value
  });

  // 创建网格
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 旋转几何体
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }

  // 渲染场景
  renderer.render(scene, camera);
};

// 窗口大小调整处理函数
const onWindowResize = () => {
  camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 监听几何体类型变化
watch(selectedGeometry, () => {
  createGeometry();
});

// 监听线框模式变化
watch(wireframe, (newValue) => {
  if (mesh) {
    mesh.material.wireframe = newValue;
  }
});

// 生命周期钩子
onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  // 清理资源
  window.removeEventListener('resize', onWindowResize);

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  if (renderer) {
    renderer.dispose();
  }

  if (mesh) {
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  if (canvasContainer.value && renderer.domElement) {
    canvasContainer.value.removeChild(renderer.domElement);
  }
});
</script>

<style scoped>
.geometry-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #42b883;
  margin-bottom: 1.5rem;
  text-align: center;
}

.canvas-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.description {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  color: #35495e;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.controls {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.5rem;
  color: #35495e;
  margin-bottom: 1rem;
}

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

label {
  width: 120px;
  font-weight: 500;
}

select,
input[type="checkbox"] {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #35a472;
}
</style>
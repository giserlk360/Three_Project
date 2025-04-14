<template>
  <div class="material-container">
    <h1>材质示例</h1>
    <div class="canvas-container" ref="canvasContainer"></div>
    <div class="description">
      <h2>场景说明</h2>
      <p>这个示例展示了Three.js中的各种材质类型，包括基础材质、标准材质、物理材质等。</p>
      <p>您可以通过控制面板切换不同的材质类型和属性。</p>
    </div>
    <div class="controls">
      <h3>控制面板</h3>
      <div class="control-group">
        <label>材质类型：</label>
        <select v-model="selectedMaterial">
          <option value="basic">基础材质</option>
          <option value="standard">标准材质</option>
          <option value="physical">物理材质</option>
          <option value="toon">卡通材质</option>
          <option value="normal">法线材质</option>
        </select>
      </div>
      <div class="control-group">
        <label>颜色：</label>
        <input type="color" v-model="color" class="color-input">
      </div>
      <div class="control-group">
        <label>金属度：</label>
        <input type="range" v-model="metalness" min="0" max="1" step="0.01">
        <span>{{ metalness }}</span>
      </div>
      <div class="control-group">
        <label>粗糙度：</label>
        <input type="range" v-model="roughness" min="0" max="1" step="0.01">
        <span>{{ roughness }}</span>
      </div>
    </div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
const selectedMaterial = ref('basic');
const color = ref('#42b883');
const metalness = ref(0.5);
const roughness = ref(0.5);

let scene, camera, renderer, mesh, light;
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

  // 添加光源
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1); // 光源位置 方向从右上前方（正 X、正 Y、正 Z）照射
  scene.add(light);

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // 创建几何体和材质
  createMaterial();

  // 开始动画循环
  animate();

  // 添加窗口大小调整监听器
  window.addEventListener('resize', onWindowResize);
};

// 创建材质
const createMaterial = () => {
  // 如果已有网格，先移除
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  // 创建几何体
  const geometry = new THREE.SphereGeometry(1.5, 32, 32);

  // 将颜色从十六进制字符串转换为数字
  const colorValue = new THREE.Color(color.value).getHex();

  // 根据选择创建不同的材质
  let material;

  switch (selectedMaterial.value) {
    case 'basic':
      material = new THREE.MeshBasicMaterial({
        color: colorValue
      });
      break;
    case 'standard':
      material = new THREE.MeshStandardMaterial({
        color: colorValue,
        metalness: metalness.value,
        roughness: roughness.value
      });
      break;
    case 'physical':
      material = new THREE.MeshPhysicalMaterial({
        color: colorValue,
        metalness: metalness.value,
        roughness: roughness.value,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
      });
      break;
    case 'toon':
      material = new THREE.MeshToonMaterial({
        color: colorValue
      });
      break;
    case 'normal':
      material = new THREE.MeshNormalMaterial();
      break;
    default:
      material = new THREE.MeshBasicMaterial({
        color: colorValue
      });
  }

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

// 监听材质类型变化
watch(selectedMaterial, () => {
  createMaterial();
});

// 监听颜色变化
watch(color, () => {
  if (mesh && mesh.material) {
    mesh.material.color.set(color.value);
  }
});

// 监听金属度变化
watch(metalness, (newValue) => {
  if (mesh && mesh.material && mesh.material.metalness !== undefined) {
    mesh.material.metalness = newValue;
  }
});

// 监听粗糙度变化
watch(roughness, (newValue) => {
  if (mesh && mesh.material && mesh.material.roughness !== undefined) {
    mesh.material.roughness = newValue;
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
.material-container {
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
input[type="color"] {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

input[type="range"] {
  flex: 1;
  margin: 0 1rem;
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
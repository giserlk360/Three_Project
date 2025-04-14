<template>
  <div class="light-container">
    <h1>光源示例</h1>
    <div class="canvas-container" ref="canvasContainer"></div>
    <div class="description">
      <h2>场景说明</h2>
      <p>这个示例展示了Three.js中的各种光源类型，包括环境光、点光源、平行光等。</p>
      <p>您可以通过控制面板调整光源的位置、强度和颜色。</p>
    </div>
    <div class="controls">
      <h3>控制面板</h3>
      <div class="control-group">
        <label>光源类型：</label>
        <select v-model="selectedLight">
          <option value="ambient">环境光</option>
          <option value="directional">平行光</option>
          <option value="point">点光源</option>
          <option value="spot">聚光灯</option>
        </select>
      </div>
      <div class="control-group">
        <label>光源颜色：</label>
        <input type="color" v-model="lightColor" class="color-input">
      </div>
      <div class="control-group">
        <label>光源强度：</label>
        <input type="range" v-model="lightIntensity" min="0" max="2" step="0.1">
        <span>{{ lightIntensity }}</span>
      </div>
      <div class="control-group" v-if="selectedLight === 'spot'">
        <label>聚光角度：</label>
        <input type="range" v-model="spotAngle" min="0" max="Math.PI/2" step="0.1">
        <span>{{ spotAngle.toFixed(2) }}</span>
      </div>
      <div class="control-group" v-if="selectedLight === 'spot'">
        <label>聚光衰减：</label>
        <input type="range" v-model="spotPenumbra" min="0" max="1" step="0.1">
        <span>{{ spotPenumbra }}</span>
      </div>
    </div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
const selectedLight = ref('ambient');
const lightColor = ref('#ffffff');
const lightIntensity = ref(1);
const spotAngle = ref(0.5);
const spotPenumbra = ref(0.1);

let scene, camera, renderer, mesh, light;
let animationId = null;

// 初始化Three.js场景
const initThree = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

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
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.4
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 创建光源
  createLight();

  // 开始动画循环
  animate();

  // 添加窗口大小调整监听器
  window.addEventListener('resize', onWindowResize);
};

// 创建光源
const createLight = () => {
  // 如果已有光源，先移除
  if (light) {
    scene.remove(light);
  }

  // 将颜色从十六进制字符串转换为数字
  const colorValue = new THREE.Color(lightColor.value).getHex();

  // 根据选择创建不同的光源
  switch (selectedLight.value) {
    case 'ambient':
      light = new THREE.AmbientLight(colorValue, lightIntensity.value);
      break;
    case 'directional':
      light = new THREE.DirectionalLight(colorValue, lightIntensity.value);
      light.position.set(1, 1, 1);
      break;
    case 'point':
      light = new THREE.PointLight(colorValue, lightIntensity.value);
      light.position.set(2, 2, 2);
      break;
    case 'spot':
      light = new THREE.SpotLight(colorValue, lightIntensity.value);
      light.position.set(2, 2, 2);
      light.angle = spotAngle.value;
      light.penumbra = spotPenumbra.value;
      light.target = mesh;
      break;
    default:
      light = new THREE.AmbientLight(colorValue, lightIntensity.value);
  }

  scene.add(light);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 旋转几何体
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }

  // 如果是点光源或聚光灯，让光源围绕物体旋转
  if (light && (selectedLight.value === 'point' || selectedLight.value === 'spot')) {
    const time = Date.now() * 0.001;
    light.position.x = Math.sin(time) * 3;
    light.position.z = Math.cos(time) * 3;
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

// 监听光源类型变化
watch(selectedLight, () => {
  createLight();
});

// 监听光源颜色变化
watch(lightColor, () => {
  if (light) {
    light.color.set(lightColor.value);
  }
});

// 监听光源强度变化
watch(lightIntensity, (newValue) => {
  if (light) {
    light.intensity = newValue;
  }
});

// 监听聚光角度变化
watch(spotAngle, (newValue) => {
  if (light && light.angle !== undefined) {
    light.angle = newValue;
  }
});

// 监听聚光衰减变化
watch(spotPenumbra, (newValue) => {
  if (light && light.penumbra !== undefined) {
    light.penumbra = newValue;
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
.light-container {
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
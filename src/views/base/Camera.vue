<template>
  <div class="camera-container">
    <h1>相机示例</h1>
    <div class="canvas-container" ref="canvasContainer"></div>
    <div class="description">
      <h2>场景说明</h2>
      <p>这个示例展示了Three.js中的相机类型和控制方法，包括透视相机和正交相机。</p>
      <p>您可以通过控制面板切换不同的相机类型和调整相机参数。</p>
    </div>
    <div class="controls">
      <h3>控制面板</h3>
      <div class="control-group">
        <label>相机类型：</label>
        <select v-model="selectedCamera">
          <option value="perspective">透视相机</option>
          <option value="orthographic">正交相机</option>
        </select>
      </div>
      <div class="control-group" v-if="selectedCamera === 'perspective'">
        <label>视场角(FOV)：</label>
        <input type="range" v-model="fov" min="10" max="120" step="1">
        <span>{{ fov }}°</span>
      </div>
      <div class="control-group" v-if="selectedCamera === 'orthographic'">
        <label>缩放：</label>
        <input type="range" v-model="zoom" min="0.1" max="10" step="0.1">
        <span>{{ zoom }}</span>
      </div>
      <div class="control-group">
        <label>相机位置X：</label>
        <input type="range" :value="cameraPosition.x" @input="e => cameraPosition.x = parseFloat(e.target.value)"
          min="-10" max="10" step="0.1">
        <span>{{ cameraPosition.x.toFixed(1) }}</span>
      </div>
      <div class="control-group">
        <label>相机位置Y：</label>
        <input type="range" :value="cameraPosition.y" @input="e => cameraPosition.y = parseFloat(e.target.value)"
          min="-10" max="10" step="0.1">
        <span>{{ cameraPosition.y.toFixed(1) }}</span>
      </div>
      <div class="control-group">
        <label>相机位置Z：</label>
        <input type="range" :value="cameraPosition.z" @input="e => cameraPosition.z = parseFloat(e.target.value)"
          min="-10" max="10" step="0.1">
        <span>{{ cameraPosition.z.toFixed(1) }}</span>
      </div>
    </div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
const selectedCamera = ref('perspective');
const fov = ref(75);
const zoom = ref(1);
const cameraPosition = reactive({
  x: 0,
  y: 0,
  z: 5
});

let scene, camera, renderer, mesh;
let animationId = null;

// 初始化Three.js场景
const initThree = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  createCamera();

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
  canvasContainer.value.appendChild(renderer.domElement);

  // 创建几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x42b883,
    wireframe: true
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 开始动画循环
  animate();

  // 添加窗口大小调整监听器
  window.addEventListener('resize', onWindowResize);
};

// 创建相机
const createCamera = () => {
  const aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;

  if (selectedCamera.value === 'perspective') {
    camera = new THREE.PerspectiveCamera(fov.value, aspect, 0.1, 1000);
  } else {
    const frustumSize = 5;
    camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.zoom = zoom.value;
  }

  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.lookAt(0, 0, 0);
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
  const aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;

  if (selectedCamera.value === 'perspective') {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  } else {
    const frustumSize = 5;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
  }

  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 监听相机类型变化
watch(selectedCamera, () => {
  createCamera();
});

// 监听FOV变化
watch(fov, (newValue) => {
  if (camera && camera.fov !== undefined) {
    camera.fov = newValue;
    camera.updateProjectionMatrix();
  }
});

// 监听缩放变化
watch(zoom, (newValue) => {
  if (camera && camera.zoom !== undefined) {
    camera.zoom = newValue;
    camera.updateProjectionMatrix();
  }
});

// 监听相机位置变化
watch(cameraPosition, (newValue) => {
  if (camera) {
    camera.position.set(newValue.x, newValue.y, newValue.z);
    camera.lookAt(0, 0, 0);
  }
}, { deep: true });

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
.camera-container {
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

select {
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
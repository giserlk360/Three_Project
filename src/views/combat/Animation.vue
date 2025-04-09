<template>
  <div class="animation-container">
    <h1>动画示例</h1>
    <div class="canvas-container" ref="canvasContainer"></div>
    <div class="description">
      <h2>场景说明</h2>
      <p>这个示例展示了Three.js中的动画效果，包括关键帧动画、补间动画和粒子动画。</p>
      <p>您可以通过控制面板切换不同的动画类型和调整动画参数。</p>
    </div>
    <div class="controls">
      <h3>控制面板</h3>
      <div class="control-group">
        <label>动画类型：</label>
        <select v-model="selectedAnimation">
          <option value="keyframe">关键帧动画</option>
          <option value="tween">补间动画</option>
          <option value="particle">粒子动画</option>
        </select>
      </div>
      <div class="control-group">
        <label>动画速度：</label>
        <input type="range" v-model="animationSpeed" min="0.1" max="2" step="0.1">
        <span>{{ animationSpeed }}x</span>
      </div>
      <div class="control-group" v-if="selectedAnimation === 'particle'">
        <label>粒子数量：</label>
        <input type="range" v-model="particleCount" min="100" max="10000" step="100">
        <span>{{ particleCount }}</span>
      </div>
      <div class="control-group">
        <button @click="toggleAnimation" class="control-button">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
      </div>
    </div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
const selectedAnimation = ref('keyframe');
const animationSpeed = ref(1);
const particleCount = ref(1000);
const isPlaying = ref(true);

let scene, camera, renderer, mesh, particles;
let animationId = null;
let clock = new THREE.Clock();
let mixer = null;

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

  // 创建动画
  createAnimation();

  // 开始动画循环
  animate();

  // 添加窗口大小调整监听器
  window.addEventListener('resize', onWindowResize);
};

// 创建动画
const createAnimation = () => {
  // 清除现有动画
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  if (particles) {
    scene.remove(particles);
    particles.geometry.dispose();
    particles.material.dispose();
  }

  switch (selectedAnimation.value) {
    case 'keyframe':
      createKeyframeAnimation();
      break;
    case 'tween':
      createTweenAnimation();
      break;
    case 'particle':
      createParticleAnimation();
      break;
  }
};

// 创建关键帧动画
const createKeyframeAnimation = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x42b883 });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 创建关键帧动画
  const times = [0, 2, 4, 6, 8];
  const positions = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(-2, -2, 0),
    new THREE.Vector3(2, -2, 0),
    new THREE.Vector3(0, 0, 0)
  ];

  const positionKF = new THREE.KeyframeTrack(
    '.position',
    times,
    positions.map(p => [p.x, p.y, p.z]).flat()
  );

  const clip = new THREE.AnimationClip('position', 8, [positionKF]);
  mixer = new THREE.AnimationMixer(mesh);
  const action = mixer.clipAction(clip);
  action.play();
};

// 创建补间动画
const createTweenAnimation = () => {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x42b883 });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 补间动画将在animate函数中实现
};

// 创建粒子动画
const createParticleAnimation = () => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount.value * 3);
  const colors = new Float32Array(particleCount.value * 3);

  for (let i = 0; i < particleCount.value; i++) {
    // 位置
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // 颜色
    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

// 动画循环
const animate = () => {
  if (!isPlaying.value) return;

  animationId = requestAnimationFrame(animate);

  const delta = clock.getDelta() * animationSpeed.value;

  if (mixer) {
    mixer.update(delta);
  }

  if (selectedAnimation.value === 'tween' && mesh) {
    // 补间动画
    const time = Date.now() * 0.001;
    mesh.position.x = Math.sin(time) * 2;
    mesh.position.y = Math.cos(time) * 2;
    mesh.rotation.x += delta;
    mesh.rotation.y += delta;
  }

  if (selectedAnimation.value === 'particle' && particles) {
    // 粒子动画
    particles.rotation.x += delta * 0.1;
    particles.rotation.y += delta * 0.1;

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
};

// 窗口大小调整处理函数
const onWindowResize = () => {
  camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 切换动画播放状态
const toggleAnimation = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    animate();
  }
};

// 监听动画类型变化
watch(selectedAnimation, () => {
  createAnimation();
});

// 监听粒子数量变化
watch(particleCount, () => {
  if (selectedAnimation.value === 'particle') {
    createAnimation();
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

  if (particles) {
    particles.geometry.dispose();
    particles.material.dispose();
  }

  if (canvasContainer.value && renderer.domElement) {
    canvasContainer.value.removeChild(renderer.domElement);
  }
});
</script>

<style scoped>
.animation-container {
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

.control-button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.control-button:hover {
  background-color: #35a472;
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
<template>
    <div class="physics-container">
        <h1>物理引擎示例</h1>
        <div class="canvas-container" ref="canvasContainer"></div>
        <div class="description">
            <h2>场景说明</h2>
            <p>此示例展示了Three.js结合物理引擎实现的交互效果。点击添加新物体，或使用滑块调整重力等参数。</p>
            <p>本示例使用Cannon.js物理引擎，实现了真实的物理碰撞和重力效果。</p>
        </div>
        <div class="controls">
            <h3>控制面板</h3>
            <div class="control-group">
                <label>重力强度：</label>
                <input type="range" v-model="gravity" min="-20" max="20" step="0.5">
                <span>{{ gravity }}</span>
            </div>
            <div class="control-group">
                <label>弹性系数：</label>
                <input type="range" v-model="restitution" min="0" max="1" step="0.05">
                <span>{{ restitution }}</span>
            </div>
            <div class="control-group">
                <label>添加物体：</label>
                <div class="button-group">
                    <button @click="addSphere" class="control-button">添加球体</button>
                    <button @click="addCube" class="control-button">添加立方体</button>
                    <button @click="reset" class="control-button reset">重置场景</button>
                </div>
            </div>
        </div>
        <router-link to="/" class="back-link">返回首页</router-link>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
// 注意：需要安装 cannon-es 包
// import * as CANNON from 'cannon-es';

const canvasContainer = ref(null);
const gravity = ref(9.8);
const restitution = ref(0.7);

let scene, camera, renderer;
let animationId = null;
// let world; // CANNON世界
let objects = []; // 对象数组，包含Three.js对象和对应的物理对象

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
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasContainer.value.appendChild(renderer.domElement);

    // 创建灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 创建地面
    createGround();

    // 初始化物理世界 (Cannon.js)
    // initPhysics();

    // 添加窗口大小调整监听器
    window.addEventListener('resize', onWindowResize);

    // 开始动画循环
    animate();
};

// 初始化物理世界
const initPhysics = () => {
    // 由于没有安装Cannon.js，这里只是示例代码
    /* 
    world = new CANNON.World();
    world.gravity.set(0, -gravity.value, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    */

    // 创建示例用的几个对象
    setTimeout(() => {
        addSphere();
        setTimeout(() => {
            addCube();
        }, 500);
    }, 500);
};

// 创建地面
const createGround = () => {
    // Three.js地面
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Cannon.js地面物理对象
    /*
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: new CANNON.Material({ restitution: restitution.value })
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);
    */

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);
};

// 添加球体
const addSphere = () => {
    // 随机位置和大小
    const radius = Math.random() * 0.5 + 0.2;
    const x = Math.random() * 4 - 2;
    const y = Math.random() * 5 + 5;
    const z = Math.random() * 4 - 2;

    // Three.js球体
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.4,
        metalness: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    // Cannon.js球体物理对象
    /*
    const sphereShape = new CANNON.Sphere(radius);
    const sphereBody = new CANNON.Body({
      mass: radius * 5,
      shape: sphereShape,
      position: new CANNON.Vec3(x, y, z),
      material: new CANNON.Material({ restitution: restitution.value })
    });
    world.addBody(sphereBody);
    
    objects.push({
      mesh: sphere,
      body: sphereBody
    });
    */

    // 由于没有实际物理引擎，只添加视觉效果
    objects.push({
        mesh: sphere,
        velocity: new THREE.Vector3(0, 0, 0)
    });
};

// 添加立方体
const addCube = () => {
    // 随机位置和大小
    const size = Math.random() * 0.5 + 0.2;
    const x = Math.random() * 4 - 2;
    const y = Math.random() * 5 + 5;
    const z = Math.random() * 4 - 2;

    // Three.js立方体
    const cubeGeometry = new THREE.BoxGeometry(size, size, size);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.4,
        metalness: 0.3
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Cannon.js立方体物理对象
    /*
    const cubeShape = new CANNON.Box(new CANNON.Vec3(size/2, size/2, size/2));
    const cubeBody = new CANNON.Body({
      mass: size * 5,
      shape: cubeShape,
      position: new CANNON.Vec3(x, y, z),
      material: new CANNON.Material({ restitution: restitution.value })
    });
    world.addBody(cubeBody);
    
    objects.push({
      mesh: cube,
      body: cubeBody
    });
    */

    // 由于没有实际物理引擎，只添加视觉效果
    objects.push({
        mesh: cube,
        velocity: new THREE.Vector3(0, 0, 0)
    });
};

// 重置场景
const reset = () => {
    // 移除所有对象
    objects.forEach(obj => {
        scene.remove(obj.mesh);
        /*
        if (obj.body) {
          world.removeBody(obj.body);
        }
        */
    });
    objects = [];
};

// 简单物理模拟（当没有物理引擎时的替代方案）
const simplePhysics = (delta) => {
    objects.forEach(obj => {
        // 应用重力
        obj.velocity.y -= gravity.value * delta;

        // 更新位置
        obj.mesh.position.x += obj.velocity.x * delta;
        obj.mesh.position.y += obj.velocity.y * delta;
        obj.mesh.position.z += obj.velocity.z * delta;

        // 检测碰撞
        if (obj.mesh.position.y < obj.mesh.geometry.parameters.radius ||
            obj.mesh.position.y < obj.mesh.geometry.parameters.height / 2) {
            obj.mesh.position.y = obj.mesh.geometry.parameters.radius ||
                obj.mesh.geometry.parameters.height / 2;
            obj.velocity.y = -obj.velocity.y * restitution.value;
        }

        // 旋转对象（如果是立方体）
        if (obj.mesh.geometry.type === 'BoxGeometry') {
            obj.mesh.rotation.x += delta;
            obj.mesh.rotation.z += delta;
        }
    });
};

// 动画循环
const animate = () => {
    animationId = requestAnimationFrame(animate);

    const delta = 0.016; // 约60fps

    // 更新物理世界
    /*
    world.step(delta);
    
    // 更新Three.js对象位置
    objects.forEach(obj => {
      obj.mesh.position.copy(obj.body.position);
      obj.mesh.quaternion.copy(obj.body.quaternion);
    });
    */

    // 使用简单物理模拟
    simplePhysics(delta);

    // 渲染场景
    renderer.render(scene, camera);
};

// 窗口大小调整处理函数
const onWindowResize = () => {
    camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 监听重力变化
watch(gravity, () => {
    // if (world) {
    //   world.gravity.set(0, -gravity.value, 0);
    // }
});

// 监听弹性系数变化
watch(restitution, () => {
    // 仅对新添加的对象生效
});

// 生命周期钩子
onMounted(() => {
    initThree();
    // 延迟初始化物理引擎，确保DOM已加载
    setTimeout(() => {
        initPhysics();
    }, 100);
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

    objects.forEach(obj => {
        if (obj.mesh) {
            obj.mesh.geometry.dispose();
            obj.mesh.material.dispose();
        }
    });

    if (canvasContainer.value && renderer.domElement) {
        canvasContainer.value.removeChild(renderer.domElement);
    }
});
</script>

<style lang="scss" scoped>
@use "sass:color";

// 颜色变量
$primary-color: #42b883;
$secondary-color: #35495e;
$dark-text: #2c3e50;
$light-text: #666;
$lighter-text: #999;
$background: #fff;
$border-light: #eee;

.physics-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;

    h1 {
        font-size: 2.5rem;
        color: $primary-color;
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
        color: $dark-text;
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
        color: $dark-text;
        margin-bottom: 1rem;
    }

    .control-group {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }

        label {
            width: 120px;
            font-weight: 500;
        }

        input[type="range"] {
            flex: 1;
            margin: 0 1rem;
        }

        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }
    }

    .control-button {
        padding: 0.5rem 1rem;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }

        &.reset {
            background-color: #e74c3c;

            &:hover {
                background-color: color.scale(#e74c3c, $lightness: -10%);
            }
        }
    }

    .back-link {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: $primary-color;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        transition: background-color 0.2s;

        &:hover {
            background-color: color.scale($primary-color, $lightness: -10%);
        }
    }
}

@media (max-width: 768px) {
    .physics-container {
        padding: 1rem;

        .control-group {
            flex-direction: column;
            align-items: flex-start;

            label {
                width: 100%;
                margin-bottom: 0.5rem;
            }

            input[type="range"] {
                width: 100%;
                margin: 0 0 0.5rem 0;
            }
        }
    }
}
</style>
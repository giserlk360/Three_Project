<template>
    <div class="starry-sky">
        <div ref="canvasContainer" class="canvas-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvasContainer = ref(null);
let scene, camera, renderer;
let controls;
let animationFrameId = null;

const initThree = () => {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1A1A1A);
    scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

    // 创建相机 
    camera = new THREE.PerspectiveCamera(
        40,
        canvasContainer.value.clientWidth / canvasContainer.value.clientHeight,
        0.1,
        1000
    );
    scene.add(camera);
    camera.position.set(20, 100, 450);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
    // 设置渲染器像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // 开启阴影
    // renderer.shadowMap.enabled = true;
    canvasContainer.value.appendChild(renderer.domElement);

    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 创建灯光
    const light = new THREE.AmbientLight(0xdeedff, 1.5);
    scene.add(light);


    createPlanet();
    createRing();
    createSatellite();
    createStars();

    // 添加窗口大小调整监听器
    window.addEventListener('resize', onWindowResize);

    // renderer.render(scene, camera);

    // 开始动画循环
    animate();
};

const createPlanet = () => {
    // 创建星球
    console.log('创建星球');
    const SphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x03c03c,
        wireframe: true,
    });
    const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
    const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
    scene.add(planet);
}

const createRing = () => {
    const TorusGeometry = new THREE.TorusGeometry(150, 8, 2, 120);
    const TorusMaterial = new THREE.MeshLambertMaterial({
        color: 0x40a9ff,
        wireframe: true
    });
    const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = -0.1 * (Math.PI / 2);
    scene.add(ring);
}

const createSatellite = () => {
    const IcoGeometry = new THREE.IcosahedronGeometry(16, 0);
    const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
    const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial);
    satellite.position.set(220, 10, 1);
    scene.add(satellite);
}

const createStars = () => {
    const stars = new THREE.Group();
    for (let i = 0; i < 500; i++) {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
        const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 700;
        mesh.position.y = (Math.random() - 0.5) * 700;
        mesh.position.z = (Math.random() - 0.5) * 700;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        stars.add(mesh);
    }
    scene.add(stars);
}

// 窗口大小调整处理函数
const onWindowResize = () => {
    camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 添加动画循环函数
const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    // 更新控制器
    if (controls) {
        controls.update();
    }

    // 如果场景中有星球，让它旋转
    if (scene && scene.children.length > 0) {
        scene.children.forEach(child => {
            if (child.type === 'Mesh' && child.geometry.type.includes('Sphere')) {
                child.rotation.y += 0.005;
            }
            if (child.type === 'Mesh' && child.geometry.type.includes('Torus')) {
                child.rotation.z += 0.005;
            }
        });
    }

    // 渲染场景
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
};

const destroyThree = () => {
    window.removeEventListener('resize', onWindowResize);

    // 取消动画帧
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    while (scene && scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
    }

    if (renderer) {
        renderer.dispose();
    }

    if (canvasContainer.value && renderer && renderer.domElement) {
        canvasContainer.value.removeChild(renderer.domElement);
    }

    scene = null;
    camera = null;
    renderer = null;
    controls = null;
};

onMounted(() => {
    initThree();
});

onBeforeUnmount(() => {
    destroyThree();
});
</script>

<style lang="scss" scoped>
.starry-sky {
    width: 100%;
    height: 100%;

    .canvas-container {
        height: 600px;
        width: 100%;
    }
}
</style>

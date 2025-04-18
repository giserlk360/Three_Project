<template>
    <div class="main-container">
        <div ref="canvasContainer" class="canvas-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const canvasContainer = ref(null);
let scene, camera, renderer;
let controls;
let animationFrameId = null;
let model = null;

const initThree = () => {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // 创建相机 
    camera = new THREE.PerspectiveCamera(
        40,
        canvasContainer.value.clientWidth / canvasContainer.value.clientHeight,
        0.1,
        1000
    );
    scene.add(camera);
    camera.position.set(5, 5, 5);

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


    // 添加网格地面
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)

    // 添加坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // 添加窗口大小调整监听器
    window.addEventListener('resize', onWindowResize);

    loadModel();

    // 开始动画循环
    animate();
};

const loadModel = () => {
    const loader = new GLTFLoader();
    // 添加DRACO解码器用于处理压缩模型
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/js/draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    loader.setDRACOLoader(dracoLoader)
    loader.load('/models/building.gltf', (gltf) => {
        // 清除旧模型
        if (model && scene) {
            scene.remove(model)
            model = null
        }
        model = gltf.scene
        // 处理模型
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        // 计算适当的缩放和位置
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 5 / maxDim
        model.scale.set(scale, scale, scale)

        // 将模型居中
        model.position.sub(center.multiplyScalar(scale))

        scene.add(model)

        // 围绕模型设置相机
        camera.position.set(5, 5, 5)
        controls.target.set(0, 0, 0)
        controls.update()

        console.log('模型加载完成', model);
    });
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
.main-container {
    width: 100%;
    height: 100%;

    .canvas-container {
        height: 600px;
        width: 100%;
    }
}
</style>

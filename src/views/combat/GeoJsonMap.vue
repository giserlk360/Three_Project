<template>
    <div class="geo-json-map">
        <h1>行政区地图</h1>
        <div class="canvas-container" ref="canvasContainer"></div>
        <div class="controls">
            <h3>控制面板</h3>
            <div class="control-group">
                <button @click="explode" class="control-button">散开区块</button>
                <button @click="combine" class="control-button">合并区块</button>
                <button @click="resetCamera" class="control-button reset">重置视角</button>
            </div>
            <div class="control-group">
                <label>高度系数：</label>
                <input type="range" v-model="extrudeAmount" min="0.1" max="1" step="0.1">
                <span>{{ extrudeAmount }}</span>
            </div>
            <div class="control-group">
                <label>动画速度：</label>
                <input type="range" v-model="animationDuration" min="500" max="3000" step="100">
                <span>{{ animationDuration }}ms</span>
            </div>
            <div class="camera-info">
                <h4>相机位置信息</h4>
                <p>位置: ({{ cameraPosition.x.toFixed(2) }}, {{ cameraPosition.y.toFixed(2) }}, {{
                    cameraPosition.z.toFixed(2) }})</p>
                <p>旋转: ({{ cameraRotation.x.toFixed(2) }}, {{ cameraRotation.y.toFixed(2) }}, {{
                    cameraRotation.z.toFixed(2) }})</p>
                <p>目标点: ({{ cameraTarget.x.toFixed(2) }}, {{ cameraTarget.y.toFixed(2) }}, {{ cameraTarget.z.toFixed(2)
                }})</p>
            </div>
        </div>
        <div class="info-panel" v-if="selectedRegion">
            <h3>{{ selectedRegion.name }}</h3>
            <p>ID: {{ selectedRegion.id }}</p>
        </div>
        <router-link to="/" class="back-link">返回首页</router-link>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3Geo from 'd3-geo';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const canvasContainer = ref(null);
const extrudeAmount = ref(0.2);
const animationDuration = ref(1000);
const selectedRegion = ref(null);
const cameraPosition = ref({ x: 0, y: 0, z: 0 });
const cameraRotation = ref({ x: 0, y: 0, z: 0 });
const cameraTarget = ref({ x: 0, y: 0, z: 0 });

// Three.js相关变量
let scene, camera, renderer, controls;
let meshGroup = new THREE.Group(); // 存储所有区域网格
let regionMeshes = []; // 存储区域网格信息
let animationFrameId = null;
let explodeAnimationId = null; // 用于存储散开动画帧ID
let combineAnimationId = null; // 用于存储合并动画帧ID

// 初始化Three.js场景
const initThree = () => {
    console.log('初始化Three.js场景...');
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        20,
        canvasContainer.value.clientWidth / canvasContainer.value.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0.22, -8.42, 7.35);
    camera.lookAt(0, 0, 0);
    console.log('相机创建成功, 位置:', camera.position);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasContainer.value.appendChild(renderer.domElement);
    console.log('渲染器创建成功，分辨率:', renderer.getSize(new THREE.Vector2()));

    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.addEventListener('change', () => {
        updateCameraInfo();
    });

    // 创建灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 添加组到场景
    scene.add(meshGroup);


    // 添加事件监听
    window.addEventListener('resize', onWindowResize);
    // 加载GeoJSON数据
    loadGeoJson();
};


// 修改loadGeoJson函数，先测试路径
const loadGeoJson = async () => {
    try {
        console.log('开始加载GeoJSON数据...');

        const response = await fetch('/jiangsu.json');
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        const geoJson = await response.json();
        console.log('GeoJSON数据加载成功:', geoJson);
        createMapFromGeoJson(geoJson);
    } catch (error) {
        console.error('加载GeoJSON数据失败:', error);
        // 在页面上显示错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.style.backgroundColor = '#ffeeee';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.margin = '20px';
        errorDiv.innerHTML = `<h3>加载数据失败</h3><p>${error.message}</p>`;
        canvasContainer.value.appendChild(errorDiv);
    }
};

// 从GeoJSON创建地图
const createMapFromGeoJson = (geoJson) => {
    console.log('开始创建地图...');
    // 清除现有网格
    while (meshGroup.children.length > 0) {
        const mesh = meshGroup.children[0];
        meshGroup.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
    }
    regionMeshes = [];

    // 创建投影
    const projection = d3Geo.geoMercator()
        .center([119.5, 33])
        .scale(40)
        .translate([0, 0]);


    // 处理每个区域
    geoJson.features.forEach((feature, index) => {

        // 颜色基于索引随机生成，但保持一定的饱和度
        const color = new THREE.Color().setHSL(index / geoJson.features.length, 0.6, 0.6);

        // 检查几何类型
        const geometryType = feature.geometry.type;

        // 根据几何类型处理坐标
        let polygons = [];
        if (geometryType === 'Polygon') {
            // 单个多边形
            polygons = [feature.geometry.coordinates];
        } else if (geometryType === 'MultiPolygon') {
            // 多个多边形
            polygons = feature.geometry.coordinates;
        } else {
            console.error(`不支持的几何类型: ${geometryType}`, feature);
            return; // 跳过这个区域
        }

        // 创建组合几何体
        let geometries = [];

        // 处理每个多边形
        polygons.forEach((polygonCoords, polyIndex) => {
            // 对每个环（外环和内环）处理
            const outerRing = polygonCoords[0]; // 外环

            // 检查coordinates是否有效
            if (!outerRing || outerRing.length < 3) {
                console.error('坐标点不足以形成图形:', polyIndex, feature);
                return; // 跳过这个多边形
            }

            // 创建形状（外环）
            const shape = new THREE.Shape();

            // 转换为Three.js坐标
            let isFirst = true;
            outerRing.forEach(coord => {
                try {
                    const [x, y] = projection(coord);
                    if (isFirst) {
                        shape.moveTo(x, -y); // 注意y轴反转
                        isFirst = false;
                    } else {
                        shape.lineTo(x, -y);
                    }
                } catch (error) {
                    console.error('坐标转换失败:', coord, error);
                }
            });

            // 添加内环（孔）
            for (let i = 1; i < polygonCoords.length; i++) {
                const innerRing = polygonCoords[i];
                if (innerRing && innerRing.length >= 3) {
                    const hole = new THREE.Path();
                    let isFirstHole = true;

                    innerRing.forEach(coord => {
                        try {
                            const [x, y] = projection(coord);
                            if (isFirstHole) {
                                hole.moveTo(x, -y);
                                isFirstHole = false;
                            } else {
                                hole.lineTo(x, -y);
                            }
                        } catch (error) {
                            console.error('内环坐标转换失败:', coord, error);
                        }
                    });

                    if (!isFirstHole) { // 确保至少有一个点被添加
                        shape.holes.push(hole);
                    }
                }
            }

            // 检查shape是否有效
            if (shape.curves.length === 0) {
                console.error('未能生成有效的形状:', polyIndex, feature);
                return; // 跳过这个多边形
            }

            // 挤出设置
            const extrudeSettings = {
                depth: extrudeAmount.value,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelOffset: 0,
                bevelSegments: 1
            };

            // 创建几何体
            try {
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                geometry.computeVertexNormals();
                geometries.push(geometry);
                // if (polyIndex === 0) { // 只为第一个多边形记录日志
                //     console.log(`为区域 ${feature.properties.name} 多边形 ${polyIndex} 创建了几何体，顶点数: ${geometry.attributes.position.count}`);
                // }
            } catch (error) {
                console.error('创建几何体失败:', polyIndex, error);
                // 继续下一个多边形
            }
        });

        // 如果没有有效的几何体，跳过这个区域
        if (geometries.length === 0) {
            console.error('未能为区域创建任何有效几何体:', feature.properties.name);
            return;
        }

        // 合并几何体（如果有多个）
        let finalGeometry;
        if (geometries.length === 1) {
            finalGeometry = geometries[0];
        } else {
            // 在Three.js 0.175.0中使用正确的合并方法
            finalGeometry = mergeGeometries(geometries);
            console.log(`合并了 ${geometries.length} 个几何体为区域 ${feature.properties.name}`);
        }

        // 创建材质
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: false,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        // 创建网格
        const mesh = new THREE.Mesh(finalGeometry, material);

        // 围绕Z轴旋转180度，使北向上
        // mesh.rotation.z = Math.PI;
        // mesh.rotation.y = 10;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // 存储原始位置
        mesh.userData = {
            originalPosition: mesh.position.clone(),
            properties: feature.properties,
            index
        };

        // 添加到组
        meshGroup.add(mesh);

        // 存储网格信息
        regionMeshes.push({
            mesh,
            properties: feature.properties,
            originalPosition: mesh.position.clone(),
            explodedPosition: new THREE.Vector3(
                mesh.position.x + (Math.random() * 2 - 1) * 5,
                mesh.position.y + (Math.random() * 2 - 1) * 5,
                mesh.position.z + Math.random() * 3
            )
        });
    });

    // 将整个地图居中
    // const box = new THREE.Box3().setFromObject(meshGroup);
    // const center = box.getCenter(new THREE.Vector3());
    // meshGroup.position.sub(center);
    // console.log('地图居中完成，中心点:', center);


    // 重置相机位置
    resetCamera();
};

// 添加辅助函数帮助调试
const addHelpers = () => {
    // 添加坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 添加网格辅助
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    console.log('已添加辅助工具到场景');
};

// 散开区块
const explode = () => {
    console.log('散开', regionMeshes);
    if (regionMeshes.length === 0) {
        console.warn('没有区域可散开');
        return;
    }

    // 存储当前状态，用于动画
    const startTime = Date.now();
    const duration = animationDuration.value;
    const initialPositions = regionMeshes.map(info => info.mesh.position.clone());
    const initialRotations = regionMeshes.map(info => info.mesh.rotation.clone());

    // 计算所有区域的中心点
    const center = new THREE.Vector3();
    regionMeshes.forEach(info => {
        center.add(info.mesh.position);
    });
    center.divideScalar(regionMeshes.length);
    console.log(`计算的中心点: ${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}`);

    // 为每个区域计算目标位置和旋转 - 沿着从中心点出发的方向散开
    const targetPositions = regionMeshes.map(info => {
        // 计算从中心到当前位置的方向向量
        const direction = new THREE.Vector3().subVectors(info.mesh.position, center);

        // 如果方向向量长度太小，生成一个随机方向
        if (direction.length() < 0.1) {
            direction.x = Math.random() * 2 - 1;
            direction.y = Math.random() * 2 - 1;
            direction.z = Math.random() * 0.5;
            direction.normalize();
        } else {
            direction.normalize(); // 标准化为单位向量
        }

        // 计算爆炸距离 - 基于原位置到中心的距离，但至少有最小值
        const distanceFromCenter = info.mesh.position.distanceTo(center);
        const explosionDistance = Math.max(distanceFromCenter * 2, 3.0) + Math.random() * 2;

        // 沿方向向量移动
        const targetPos = new THREE.Vector3().addVectors(
            info.mesh.position,
            direction.multiplyScalar(explosionDistance)
        );

        return targetPos;
    });

    const targetRotations = regionMeshes.map((info, index) => {
        const direction = new THREE.Vector3().subVectors(targetPositions[index], center);
        // 基于方向向量计算旋转
        return new THREE.Euler(
            direction.y * 0.5,            // 基于y方向的倾斜
            direction.x * 0.5,            // 基于x方向的偏移
            Math.random() * Math.PI * 0.5  // 随机z轴旋转
        );
    });

    // 存储各区域的目标位置用于合并
    regionMeshes.forEach((info, i) => {
        info.explodedPosition = targetPositions[i].clone();
    });

    // 创建动画函数
    const animateExplode = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0到1的进度

        // 使用缓动函数使动画更自然 - 使用弹簧效果
        const easeOutBack = function (t) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const easedProgress = easeOutBack(progress);

        // 更新每个区域的位置和旋转
        regionMeshes.forEach((info, i) => {
            // 位置插值
            info.mesh.position.lerpVectors(
                initialPositions[i],
                targetPositions[i],
                easedProgress
            );

            // 旋转插值
            // info.mesh.rotation.x = initialRotations[i].x + (targetRotations[i].x - initialRotations[i].x) * easedProgress;
            // info.mesh.rotation.y = initialRotations[i].y + (targetRotations[i].y - initialRotations[i].y) * easedProgress;
            // info.mesh.rotation.z = initialRotations[i].z + (targetRotations[i].z - initialRotations[i].z) * easedProgress;
        });

        // 如果动画未完成，继续请求帧
        if (progress < 1) {
            explodeAnimationId = requestAnimationFrame(animateExplode);
        } else {
            explodeAnimationId = null;
            console.log('散开动画完成');
        }
    };

    // 开始动画
    if (explodeAnimationId) {
        cancelAnimationFrame(explodeAnimationId);
    }
    explodeAnimationId = requestAnimationFrame(animateExplode);
};

// 合并区块
const combine = () => {
    console.log('合并');
    if (regionMeshes.length === 0) {
        console.warn('没有区域可合并');
        return;
    }

    // 存储当前状态，用于动画
    const startTime = Date.now();
    const duration = animationDuration.value;
    const initialPositions = regionMeshes.map(info => info.mesh.position.clone());
    const initialRotations = regionMeshes.map(info => info.mesh.rotation.clone());

    // 获取原始位置作为目标
    const targetPositions = regionMeshes.map(info => info.originalPosition.clone());
    const targetRotations = regionMeshes.map(() => new THREE.Euler(0, 0, 0));

    // 创建动画函数
    const animateCombine = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0到1的进度

        // 使用缓动函数使动画更自然
        const easeOutBack = function (t) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const easedProgress = easeOutBack(progress);

        // 更新每个区域的位置和旋转
        regionMeshes.forEach((info, i) => {
            // 位置插值
            info.mesh.position.lerpVectors(
                initialPositions[i],
                targetPositions[i],
                easedProgress
            );

            // 旋转插值
            // info.mesh.rotation.x = initialRotations[i].x + (targetRotations[i].x - initialRotations[i].x) * easedProgress;
            // info.mesh.rotation.y = initialRotations[i].y + (targetRotations[i].y - initialRotations[i].y) * easedProgress;
            // info.mesh.rotation.z = initialRotations[i].z + (targetRotations[i].z - initialRotations[i].z) * easedProgress;
        });

        // 如果动画未完成，继续请求帧
        if (progress < 1) {
            combineAnimationId = requestAnimationFrame(animateCombine);
        } else {
            combineAnimationId = null;
            console.log('合并动画完成');
        }
    };

    // 开始动画
    if (combineAnimationId) {
        cancelAnimationFrame(combineAnimationId);
    }
    combineAnimationId = requestAnimationFrame(animateCombine);
};

// 重置相机位置
const resetCamera = () => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    controls.reset();
    updateCameraInfo();
};


// 窗口大小调整处理函数
const onWindowResize = () => {
    camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
};

// 更新相机信息
const updateCameraInfo = () => {
    if (camera) {
        cameraPosition.value = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        cameraRotation.value = {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z
        };

        // 获取相机目标点
        const target = new THREE.Vector3();
        camera.getWorldDirection(target);
        target.multiplyScalar(10).add(camera.position);
        cameraTarget.value = {
            x: target.x,
            y: target.y,
            z: target.z
        };
    }
};

// 修改动画循环函数
const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    // 更新控制器
    controls.update();

    // 更新相机信息
    updateCameraInfo();


    // 渲染场景
    renderer.render(scene, camera);
};

// 监听高度系数变化
watch(extrudeAmount, () => {
    if (canvasContainer.value) {
        loadGeoJson(); // 重新加载地图以应用新的挤出值
    }
});

// 生命周期钩子
onMounted(() => {
    initThree();
    animate();
});

onBeforeUnmount(() => {
    // 清理资源
    window.removeEventListener('resize', onWindowResize);
    renderer.domElement.removeEventListener('click', onMouseClick);
    renderer.domElement.removeEventListener('mousemove', onMouseMove);

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    if (explodeAnimationId !== null) {
        cancelAnimationFrame(explodeAnimationId);
    }

    if (combineAnimationId !== null) {
        cancelAnimationFrame(combineAnimationId);
    }

    // 释放Three.js资源
    regionMeshes.forEach((regionInfo) => {
        regionInfo.mesh.geometry.dispose();
        regionInfo.mesh.material.dispose();
    });

    while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
    }

    if (renderer) {
        renderer.dispose();
    }

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

.geo-json-map {
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
        height: 500px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .controls {
        background-color: #f8f8f8;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;

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
        }

        .control-button {
            padding: 0.75rem 1.5rem;
            margin-right: 1rem;
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
    }

    .info-panel {
        background-color: #f8f8f8;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;

        h3 {
            font-size: 1.5rem;
            color: $primary-color;
            margin-bottom: 0.5rem;
        }

        p {
            margin: 0.5rem 0;
            color: $dark-text;
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

    .camera-info {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        h4 {
            color: $primary-color;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        p {
            margin: 0.25rem 0;
            color: $dark-text;
            font-family: monospace;
            font-size: 0.9rem;
        }
    }
}

@media (max-width: 768px) {
    .geo-json-map {
        padding: 1rem;

        .canvas-container {
            height: 400px;
        }

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

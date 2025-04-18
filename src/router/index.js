import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Geometry from "../views/base/Geometry.vue";
import Material from "../views/base/Material.vue";
import Light from "../views/base/Light.vue";
import Camera from "../views/base/Camera.vue";
import Animation from "../views/base/Animation.vue";
import Admin from "../views/tool/Admin.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/base/geometry",
    name: "Geometry",
    component: Geometry,
  },
  {
    path: "/base/material",
    name: "Material",
    component: Material,
  },
  {
    path: "/base/light",
    name: "Light",
    component: Light,
  },
  {
    path: "/base/camera",
    name: "Camera",
    component: Camera,
  },
  {
    path: "/base/animation",
    name: "Animation",
    component: Animation,
  },
  {
    path: "/base/physics",
    name: "Physics",
    component: () => import("../views/base/Physics.vue"),
  },
  {
    path: "/tool/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/tool/resources",
    name: "Resources",
    component: () => import("../views/tool/Resources.vue"),
  },
  {
    path: "/tool/about",
    name: "About",
    component: () => import("../views/tool/About.vue"),
  },
  {
    path: '/combat/geojsonmap',
    name: 'GeoJsonMap',
    component: () => import('../views/combat/GeoJsonMap.vue')
  },
  {
    path: '/combat/starrysky',
    name: 'StarrySky',
    component: () => import('../views/combat/StarrySky.vue')
  },
  {
    path: '/combat/buildingmodel',
    name: 'BuildingModel',
    component: () => import('../views/combat/BuildingModel.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

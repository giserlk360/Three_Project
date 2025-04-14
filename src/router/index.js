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
    path: "/geometry",
    name: "Geometry",
    component: Geometry,
  },
  {
    path: "/material",
    name: "Material",
    component: Material,
  },
  {
    path: "/light",
    name: "Light",
    component: Light,
  },
  {
    path: "/camera",
    name: "Camera",
    component: Camera,
  },
  {
    path: "/animation",
    name: "Animation",
    component: Animation,
  },
  {
    path: "/physics",
    name: "Physics",
    component: () => import("../views/base/Physics.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/resources",
    name: "Resources",
    component: () => import("../views/tool/Resources.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/tool/About.vue"),
  },
  {
    path: '/combat/geojsonmap',
    name: 'GeoJsonMap',
    component: () => import('../views/combat/GeoJsonMap.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

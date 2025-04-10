<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// 定义导航菜单数据
const menuGroups = [
  {
    title: '首页',
    icon: '🏠',
    path: '/',
    isDropdown: false
  },
  {
    title: '基础',
    icon: '📐',
    isDropdown: true,
    isOpen: false,
    links: [
      { name: '几何体', path: '/geometry' },
      { name: '材质', path: '/material' },
      { name: '光源', path: '/light' },
      { name: '相机', path: '/camera' },
      { name: '动画', path: '/animation' },
      { name: '物理引擎', path: '/physics' }
    ]
  },
  {
    title: '实战',
    icon: '🚀',
    isDropdown: true,
    isOpen: false,
    links: [

    ]
  },
  {
    title: '工具',
    icon: '🔧',
    isDropdown: true,
    isOpen: false,
    links: [
      { name: '数据管理', path: '/admin' },
      { name: '学习资源', path: '/resources' },
      { name: '关于项目', path: '/about' }
    ]
  }
];

// 创建响应式菜单数据
const navGroups = ref(menuGroups);

// 获取当前路由
const route = useRoute();

// 根据当前路由设置活动菜单
watch(() => route.path, (newPath) => {
  // 先关闭所有下拉菜单
  closeAllDropdowns();

  // if (newPath !== '/') {
  //   // 查找当前路径匹配的下拉菜单，并展开它
  //   const matchedGroupIndex = navGroups.value.findIndex(group =>
  //     group.isDropdown && group.links.some(link => link.path === newPath)
  //   );

  //   if (matchedGroupIndex !== -1) {
  //     navGroups.value[matchedGroupIndex].isOpen = true;
  //   }
  // }
}, { immediate: false });

// 切换下拉菜单
const toggleDropdown = (index) => {
  const group = navGroups.value[index];
  if (group.isDropdown) {
    group.isOpen = !group.isOpen;

    // 关闭其他下拉菜单
    navGroups.value.forEach((g, idx) => {
      if (idx !== index && g.isDropdown) {
        g.isOpen = false;
      }
    });
  }
};

// 返回当前路由是否匹配特定链接
const isActive = (path) => {
  return route.path === path;
};

// 关闭所有下拉菜单
const closeAllDropdowns = () => {
  navGroups.value.forEach(group => {
    if (group.isDropdown) {
      group.isOpen = false;
    }
  });
};
</script>

<template>
  <div class="app" @click="closeAllDropdowns">
    <header>
      <div class="header-container">
        <div class="logo">
          <router-link to="/">
            <img src="./assets/vue.svg" alt="Logo" />
            <span>Three.js学习</span>
          </router-link>
        </div>
        <nav>
          <div class="nav-container">
            <div v-for="(group, index) in navGroups" :key="group.title" class="nav-item" :class="{
              'is-dropdown': group.isDropdown,
              'active': group.isOpen || (!group.isDropdown && isActive(group.path))
            }" @click.stop>
              <!-- 普通导航项 (首页) -->
              <router-link v-if="!group.isDropdown" :to="group.path" class="nav-title" @click="closeAllDropdowns">
                <span class="icon">{{ group.icon }}</span>
                <span>{{ group.title }}</span>
              </router-link>

              <!-- 带下拉菜单的导航项 -->
              <div v-else class="nav-title" @click="toggleDropdown(index)">
                <span class="icon">{{ group.icon }}</span>
                <span>{{ group.title }}</span>
                <span class="arrow" :class="{ down: group.isOpen }"></span>
              </div>

              <!-- 下拉菜单 -->
              <div v-if="group.isDropdown" class="dropdown-menu" :class="{ visible: group.isOpen }">
                <!-- <div class="menu-header">{{ group.title }}</div> -->
                <router-link v-for="link in group.links" :key="link.path" :to="link.path" class="menu-item"
                  :class="{ active: isActive(link.path) }" @click="closeAllDropdowns">
                  <div class="menu-item-title">{{ link.name }}</div>
                </router-link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© 2025 Three.js学习项目 | 基于Vue 3和Three.js开发</p>
    </footer>
  </div>
</template>

<style lang="scss">
@use "sass:color";

:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
  --accent-color: #3498db;
  --bg-color: #f8f8f8;
  --text-color: #2c3e50;
  --border-color: #eaeaea;
  --hover-bg: #f0f0f0;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --menu-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--secondary-color);
    font-weight: bold;

    img {
      height: 40px;
      margin-right: 15px;
      width: 40px;
      object-fit: contain;
    }

    span {
      font-size: 1.5rem;
    }
  }
}

nav {
  .nav-container {
    display: flex;
    gap: 1.5rem;
  }

  .nav-item {
    position: relative;

    &.active .nav-title {
      color: var(--primary-color);
    }

    &.is-dropdown .nav-title {
      cursor: pointer;
    }
  }

  .nav-title {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    font-weight: 500;
    transition: color 0.2s;
    border-radius: 4px;
    user-select: none;
    color: var(--text-color);
    text-decoration: none;

    &:hover {
      color: var(--primary-color);
    }

    .icon {
      margin-right: 8px;
      font-size: 1.2rem;
    }

    .arrow {
      margin-left: 6px;
      border: solid currentColor;
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      transform: rotate(45deg) translateY(-2px);
      transition: transform 0.3s;

      &.down {
        transform: rotate(-135deg) translateY(-2px);
      }
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    min-width: 130px;
    background: white;
    border-radius: 8px;
    box-shadow: var(--menu-shadow);
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-in-out;
    transform: translateX(-50%) translateY(15px);

    &.visible {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(15px);
    }

    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 12px;
      height: 12px;
      background: white;
    }

    .menu-header {
      padding: 0.5rem 1.25rem;
      font-weight: 600;
      color: var(--secondary-color);
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 0.5rem;
    }

    .menu-item {
      display: block;
      padding: 0.25rem 0.5rem;
      text-decoration: none;
      color: var(--text-color);
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--hover-bg);
      }

      &.active {
        background-color: rgba(66, 184, 131, 0.1);

        .menu-item-title {
          color: var(--primary-color);
          font-weight: 600;
        }
      }

      .menu-item-title {
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .menu-item-desc {
        font-size: 0.85rem;
        color: #666;
      }
    }
  }
}

main {
  flex: 1;
  padding: 2rem;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
}

footer {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
}

@media (max-width: 992px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .logo {
    margin-bottom: 1rem;
  }

  nav .nav-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  nav .dropdown-menu {
    left: 0;
    transform: translateX(0) translateY(15px);

    &.visible {
      transform: translateX(0) translateY(10px);
    }

    &::before {
      left: 20px;
    }
  }
}

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }

  nav .nav-item {
    position: static;

    .dropdown-menu {
      width: 100%;
      position: absolute;
      left: 0;
      top: 100%;
      transform: translateY(5px);

      &.visible {
        transform: translateY(0);
      }

      &::before {
        display: none;
      }
    }
  }
}
</style>

import { reactive } from "vue";

// 从localStorage获取数据或使用默认数据
const getInitialData = () => {
  const savedData = localStorage.getItem("cardData");
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error("解析本地存储数据失败:", e);
    }
  }

  // 默认数据
  return [
    {
      id: 1,
      title: "几何体",
      description: "探索Three.js中的各种几何体，包括立方体、球体、圆柱体等。",
      path: "/geometry",
      date: "2025-04-09",
      status: "in-progress",
      color: "#3498db",
    },
    {
      id: 2,
      title: "材质",
      description: "学习不同类型的材质，如基础材质、标准材质、物理材质等。",
      path: "/material",
      date: "2025-04-10",
      status: "planned",
      color: "#e74c3c",
    },
    {
      id: 3,
      title: "光源",
      description: "了解Three.js中的各种光源类型，如环境光、点光源、平行光等。",
      path: "/light",
      date: "2025-04-11",
      status: "planned",
      color: "#f39c12",
    },
    {
      id: 4,
      title: "相机",
      description: "掌握透视相机和正交相机的使用，以及相机控制和动画。",
      path: "/camera",
      date: "2025-04-12",
      status: "planned",
      color: "#9b59b6",
    },
    {
      id: 5,
      title: "动画",
      description:
        "学习如何创建和控制Three.js中的动画，包括关键帧动画和补间动画。",
      path: "/animation",
      date: "2025-04-13",
      status: "planned",
      color: "#2ecc71",
    },
  ];
};

// 模拟卡片数据
const cardData = reactive(getInitialData());

// 保存数据到localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("cardData", JSON.stringify(cardData));
};

// 模拟API服务
export const api = {
  // 获取所有卡片
  getCards() {
    return Promise.resolve([...cardData]);
  },

  // 获取单个卡片
  getCard(id) {
    const card = cardData.find((card) => card.id === id);
    return Promise.resolve(card ? { ...card } : null);
  },

  // 添加新卡片
  addCard(card) {
    const newId = Math.max(0, ...cardData.map((c) => c.id)) + 1;
    const newCard = { ...card, id: newId };
    cardData.push(newCard);
    saveToLocalStorage();
    return Promise.resolve({ ...newCard });
  },

  // 更新卡片
  updateCard(id, updates) {
    const index = cardData.findIndex((card) => card.id === id);
    if (index !== -1) {
      const updatedCard = { ...cardData[index], ...updates };
      cardData[index] = updatedCard;
      saveToLocalStorage();
      return Promise.resolve({ ...updatedCard });
    }
    return Promise.reject(new Error("卡片未找到"));
  },

  // 删除卡片
  deleteCard(id) {
    const index = cardData.findIndex((card) => card.id === id);
    if (index !== -1) {
      const deletedCard = cardData[index];
      cardData.splice(index, 1);
      saveToLocalStorage();
      return Promise.resolve({ ...deletedCard });
    }
    return Promise.reject(new Error("卡片未找到"));
  },

  // 重置数据
  resetData() {
    const defaultData = getInitialData();
    cardData.splice(0, cardData.length);
    defaultData.forEach((card) => cardData.push(card));
    localStorage.removeItem("cardData");
    return Promise.resolve(true);
  },
};

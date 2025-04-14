// 后端服务器API地址
const API_BASE_URL = "http://localhost:3000/api";

// 创建API服务对象
export const api = {
  // 获取所有卡片
  async getCards() {
    try {
      const response = await fetch(`${API_BASE_URL}/cards`);
      if (!response.ok) {
        throw new Error("获取卡片数据失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 获取单个卡片
  async getCard(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`);
      if (!response.ok) {
        throw new Error("获取卡片数据失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 添加新卡片
  async addCard(cardData) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });
      if (!response.ok) {
        throw new Error("添加卡片失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 更新卡片
  async updateCard(id, cardData) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });
      if (!response.ok) {
        throw new Error("更新卡片失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 删除卡片
  async deleteCard(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("删除卡片失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 重置数据
  async resetData() {
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("重置数据失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // 压缩数据库
  async compactDatabase() {
    try {
      const response = await fetch(`${API_BASE_URL}/compact`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("压缩数据库失败");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
};

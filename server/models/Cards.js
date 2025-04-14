const Datastore = require("nedb");
const path = require("path");

// 创建数据库，并指定文件存储路径
const db = new Datastore({
  filename: path.join(__dirname, "../data/cards.db"),
  autoload: true,
});

// 初始卡片数据
const defaultCards = [
  {
    id: 1,
    title: "场景与几何体",
    description:
      "学习Three.js的基础知识，包括创建场景、相机、渲染器和基本几何体，探索不同的3D形状。",
    path: "/base/geometry",
    date: "2025-01-15",
    status: "completed",
    color: "#42b883",
  },
  {
    id: 2,
    title: "材质",
    description: "深入了解Three.js中的各种材质，创建逼真的3D效果和表面属性。",
    path: "/base/material",
    date: "2025-02-10",
    status: "completed",
    color: "#3498db",
  },
  {
    id: 3,
    title: "相机控制",
    description:
      "学习如何使用不同类型的相机和控制器，实现交互式3D场景浏览和视角调整。",
    path: "/base/camera",
    date: "2025-03-05",
    status: "completed",
    color: "#e74c3c",
  },
  {
    id: 4,
    title: "光照系统",
    description:
      "掌握Three.js中的各种光源类型，包括环境光、点光源、方向光和聚光灯，创建真实的光影效果。",
    path: "/base/light",
    date: "2025-04-12",
    status: "completed",
    color: "#f39c12",
  },
  {
    id: 5,
    title: "动画控制",
    description:
      "学习如何在Three.js中创建流畅的动画效果，控制物体的移动、旋转和缩放，实现复杂的动画序列。",
    path: "/base/animation",
    date: "2025-05-20",
    status: "completed",
    color: "#9b59b6",
  },
  {
    id: 6,
    title: "物理引擎",
    description:
      "将物理引擎集成到Three.js场景中，模拟真实世界的物理效果，包括重力、碰撞和弹性等物理现象。",
    path: "/base/physics",
    date: "2025-07-08",
    status: "in-progress",
    color: "#2c3e50",
  },
];

// 压缩数据库文件，移除已标记为删除的文档
const compactDatabase = () => {
  return new Promise((resolve) => {
    // 调用压缩方法
    db.persistence.compactDatafile();

    // NeDB没有提供压缩完成的回调或事件，使用延时来确保压缩完成
    // 典型的压缩操作应该在几百毫秒内完成
    setTimeout(() => {
      console.log("数据库压缩操作完成");
      resolve();
    }, 1000);
  });
};

// 卡片模型方法
class Cards {
  // 获取所有卡片
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.find({})
        .sort({ date: 1 })
        .exec((err, cards) => {
          if (err) return reject(err);
          resolve(cards);
        });
    });
  }

  // 获取单个卡片
  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.findOne({ id: parseInt(id) }, (err, card) => {
        if (err) return reject(err);
        resolve(card);
      });
    });
  }

  // 创建新卡片
  static async create(cardData) {
    return new Promise((resolve, reject) => {
      // 获取当前最大ID
      db.find({})
        .sort({ id: -1 })
        .limit(1)
        .exec((err, cards) => {
          if (err) return reject(err);

          const newId = cards.length > 0 ? cards[0].id + 1 : 1;
          const newCard = {
            ...cardData,
            id: newId,
          };

          db.insert(newCard, (err, insertedCard) => {
            if (err) return reject(err);
            resolve(insertedCard);
          });
        });
    });
  }

  // 更新卡片
  static async update(id, cardData) {
    return new Promise((resolve, reject) => {
      db.update(
        { id: parseInt(id) },
        { $set: cardData },
        {},
        (err, numReplaced) => {
          if (err) return reject(err);
          if (numReplaced === 0) return reject(new Error("卡片不存在"));
          resolve({ ...cardData, id: parseInt(id) });
        }
      );
    });
  }

  // 删除卡片
  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.remove({ id: parseInt(id) }, {}, async (err, numRemoved) => {
        if (err) return reject(err);
        if (numRemoved === 0) return reject(new Error("卡片不存在"));

        // 删除后压缩数据库
        try {
          await compactDatabase();
        } catch (compactErr) {
          console.error("压缩数据库出错:", compactErr);
          // 即使压缩失败，我们仍然认为删除操作是成功的
        }

        resolve({ id: parseInt(id) });
      });
    });
  }

  // 重置数据
  static async resetData() {
    return new Promise((resolve, reject) => {
      // 清空数据库
      db.remove({}, { multi: true }, async (err) => {
        if (err) return reject(err);

        try {
          // 压缩数据库，移除已删除的文档
          await compactDatabase();

          // 插入默认数据
          db.insert(defaultCards, (err) => {
            if (err) return reject(err);
            resolve({ success: true });
          });
        } catch (compactErr) {
          console.error("压缩数据库出错:", compactErr);
          return reject(compactErr);
        }
      });
    });
  }

  // 初始化数据库
  static async initializeIfEmpty() {
    return new Promise((resolve, reject) => {
      db.find({}, (err, cards) => {
        if (err) return reject(err);

        // 如果数据库为空，则插入默认数据
        if (cards.length === 0) {
          db.insert(defaultCards, (err) => {
            if (err) return reject(err);
            resolve({ initialized: true });
          });
        } else {
          resolve({ initialized: false });
        }
      });
    });
  }

  // 手动压缩数据库
  static async compactDatabase() {
    return compactDatabase();
  }
}

// 初始化数据库
Cards.initializeIfEmpty()
  .then((result) => {
    if (result.initialized) {
      console.log("数据库已初始化并加载默认数据");
    }
  })
  .catch((err) => {
    console.error("初始化数据库出错:", err);
  });

module.exports = Cards;

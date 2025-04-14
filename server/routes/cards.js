const express = require("express");
const Cards = require("../models/Cards");

const router = express.Router();

// 获取所有卡片
router.get("/cards", async (req, res) => {
  try {
    const cards = await Cards.getAll();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个卡片
router.get("/cards/:id", async (req, res) => {
  try {
    const card = await Cards.getById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "卡片不存在" });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新卡片
router.post("/cards", async (req, res) => {
  try {
    const newCard = await Cards.create(req.body);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新卡片
router.put("/cards/:id", async (req, res) => {
  try {
    const updatedCard = await Cards.update(req.params.id, req.body);
    res.json(updatedCard);
  } catch (error) {
    if (error.message === "卡片不存在") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// 删除卡片
router.delete("/cards/:id", async (req, res) => {
  try {
    await Cards.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    if (error.message === "卡片不存在") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// 重置数据
router.post("/reset", async (req, res) => {
  try {
    await Cards.resetData();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 手动压缩数据库
router.post("/compact", async (req, res) => {
  try {
    await Cards.compactDatabase();
    res.json({ success: true, message: "数据库压缩完成" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

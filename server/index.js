const express = require("express");
const cors = require("cors");
const path = require("path");
const cardsRoutes = require("./routes/cards");

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务（生产环境）
app.use(express.static(path.join(__dirname, "../dist")));

// API路由
app.use("/api", cardsRoutes);

// 处理前端路由
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

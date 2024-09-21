// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
const userActionsRoutes = require("./routes/userActions");
const usersRouter = require("./routes/users");
const cron = require("node-cron");
const { mintNFTs } = require("./utils/mintNFT");
const { invalidateNFTs } = require("./utils/invalidateNFT");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/posts", postsRoutes);
app.use("/api/user-actions", userActionsRoutes);
app.use("/api/users", usersRouter);
// 数据库连接
mongoose
  .connect(
    "mongodb://adminUser:KpMZhFE1mjbtH578RkAN@43.153.196.29:27017/user_behavior_nft",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "user_behavior_nft", // 指定验证数据库
    }
  )
  .then(() => console.log("MongoDB连接成功"))
  .catch((error) => console.error("MongoDB连接失败", error));
// 定时任务
cron.schedule("0 0 * * *", () => {
  console.log("开始每日任务：铸造NFT和销毁过期的NFT");
  invalidateNFTs();
  mintNFTs();
});
// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器正在运行在端口：${PORT}`);
});

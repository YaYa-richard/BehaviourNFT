const mongoose = require("mongoose");
const UserAction = require("../models/UserAction"); // 确保路径正确
const { uploadToIPFS } = require("../utils/ipfs"); // 确保路径正确

// 连接到 MongoDB
mongoose.connect(
    "mongodb://adminUser:KpMZhFE1mjbtH578RkAN@43.153.196.29:27017/user_behavior_nft",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

async function testUploadToIPFS() {
    try {
        // 从 MongoDB 中获取第一个用户的行为数据
        const user = await UserAction.distinct("user");

        if (user.length === 0) {
            console.log("没有找到用户行为数据");
            return;
        }

        const actions = await UserAction.find({ user: user[0] });

        console.log(`为用户 ${user[0]} 获取到的行为数据：`, actions);

        // 将数据上传到 IPFS（通过 Pinata）
        const ipfsHash = await uploadToIPFS(actions);
        console.log("成功上传到 Pinata IPFS，返回的哈希值：", ipfsHash);

        console.log(
            `你可以通过以下链接查看上传的数据: https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
    } catch (error) {
        console.error("上传到 Pinata 失败", error);
    } finally {
        // 关闭数据库连接
        mongoose.connection.close();
    }
}

testUploadToIPFS();

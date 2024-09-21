const UserAction = require("../models/UserAction");
const { uploadToIPFS } = require("../utils/ipfs");  // 你的 IPFS 上传函数
const mongoose = require("mongoose");

mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB 连接成功");
})
.catch((err) => {
    console.error("MongoDB 连接失败", err);
});


async function uploadUserActionsToIPFS() {
    try {
        // 获取所有用户列表
        const users = await UserAction.distinct("user");

        for (const user of users) {
            // 获取用户的所有行为数据
            const actions = await UserAction.find({ user });

            console.log(`为用户 ${user} 获取到的行为数据：`, actions);

            // 将数据上传到 IPFS
            const ipfsHash = await uploadToIPFS(actions);

            console.log(`成功上传数据到 IPFS，返回的哈希值： ${ipfsHash}`);
        }
    } catch (error) {
        console.error("上传到 IPFS 失败", error);
    }
}

// 运行上传逻辑
uploadUserActionsToIPFS();

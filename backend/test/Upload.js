const User = require("../models/User");
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
        // 获取所有用户的钱包地址列表
        const walletAddresses = await User.distinct("walletAddress");

        for (const walletAddress of walletAddresses) {
            // 获取用户的偏好数据
            const user = await User.findOne({ walletAddress });

            if (user && user.preferences) {
                console.log(`为用户 ${walletAddress} 获取到的偏好数据：`, user.preferences);

                // 将数据上传到 IPFS
                const ipfsHash = await uploadToIPFS(user.preferences);

                console.log(`成功上传数据到 IPFS，返回的哈希值： ${ipfsHash}`);
            } else {
                console.log(`用户 ${walletAddress} 没有找到或没有偏好数据`);
            }
        }
    } catch (error) {
        console.error("上传到 IPFS 失败", error);
    } finally {
        mongoose.connection.close(); // 关闭数据库连接
    }
}

// 运行上传逻辑
uploadUserActionsToIPFS();


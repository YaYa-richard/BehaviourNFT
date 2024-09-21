// 加载环境变量
require('dotenv').config();
const pinataSDK = require('@pinata/sdk');

// 从 .env 文件中读取 Pinata 的 API Key 和 Secret
const pinataApiKey = '6fcc17bdc40f029f4f36';
const pinataApiSecret = 'fd6c8ec6bd5ed3fe3172c8ee6c94492d5a59f84f84009e3da6599096efc28d1b';

if (!pinataApiKey || !pinataApiSecret) {
    throw new Error("Pinata API Key 或 API Secret 未在 .env 文件中定义");
}

// 创建 Pinata 客户端实例
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

exports.uploadToIPFS = async (data) => {
    try {
        const result = await pinata.pinJSONToIPFS(data);
        console.log("成功上传到 Pinata，返回的哈希值：", result.IpfsHash);
        return result.IpfsHash; // 返回 IPFS 哈希值
    } catch (error) {
        console.error("上传到 Pinata 失败", error);
        throw error;
    }
};

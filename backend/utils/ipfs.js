const pinataSDK = require("@pinata/sdk");

// 从 .env 文件中读取 Pinata 的 API Key 和 Secret
const pinataApiKey = "3367e4e620774b9d5807";
const pinataApiSecret =
    "54249610fa04adcd8340b999b1e6ec9f3b08358f97782fb0b75f60a4434a7b50";

// 正确初始化 Pinata 客户端实例
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

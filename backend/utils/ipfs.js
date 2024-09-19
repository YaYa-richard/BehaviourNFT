// utils/ipfs.js
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});

exports.uploadToIPFS = async (data) => {
    try {
        const result = await ipfs.add(JSON.stringify(data));
        return result.path; // 返回IPFS哈希值
    } catch (error) {
        console.error("上传到IPFS失败", error);
        throw error;
    }
};

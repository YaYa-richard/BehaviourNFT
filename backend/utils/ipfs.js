const { create } = require("ipfs-http-client");

// 引入 ipfs-http-client 模块，解构出 create 方法
// create 方法用于创建与 IPFS 节点的连接

// 使用你的项目 ID 和 API 密钥秘钥
const projectId = "d24f9ca6bd9449679178d61757b9c88d";
const projectSecret = "FFbJYu8nrOzO/90Y/PdN/msnuGkwauG7NKLazHwSYEi1z/DmkhFOXQ";

// 基本认证
// 将项目 ID 和 API 密钥秘钥进行 base64 编码，并添加到请求头的 authorization 字段中
const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// 创建与 IPFS 节点的连接
const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

// 导出 uploadToIPFS 函数
exports.uploadToIPFS = async (data) => {
    try {
        // 将数据转换为 JSON 字符串，并使用 ipfs.add 方法将其上传到 IPFS
        const result = await ipfs.add(JSON.stringify(data));
        console.error("上传到 IPFS 成功", error);
        // 返回上传后的 IPFS 哈希值
        return result.path;
    } catch (error) {
        console.error("上传到 IPFS 失败", error);
        throw error;
    }
};

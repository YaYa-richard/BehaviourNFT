// utils/invalidateNFT.js
const Web3 = require('web3').Web3;
const Contract = require("../contracts/UserProfileNFT.json");
const ContractABI = Contract.abi;
const ContractAddress = Contract.address;

// 初始化 Web3 实例，连接到本地节点
const web3 = new Web3("http://127.0.0.1:8545"); // 替换为您的以太坊节点地址
const contract = new web3.eth.Contract(ContractABI, ContractAddress);

async function main() {
    // 获取可用的账户列表
    const accounts = await web3.eth.getAccounts();
    const fromAccount = accounts[0]; // 使用第一个账户作为交易发送者

    // **增加区块链时间**
    // 增加一天的时间（86400 秒）
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [86400],
        id: new Date().getTime()
    }, (err, result) => {
        if (err) { console.error("增加时间出错：", err); }
    });

    // 挖掘一个新块，使时间变化生效
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: new Date().getTime()
    }, (err, result) => {
        if (err) { console.error("挖掘新块出错：", err); }
    }); 

    // **调用合约方法，将过期的 NFT 标记为无效**
    // 注意：需要使用 `.send` 方法发送交易，而不是 `.call`，因为需要修改区块链状态
    await contract.methods.invalidateExpiredNFTs().send({ from: fromAccount });

    // 获取更新后的计数器值n
    const curIdx = await contract.methods.getValidCounter().call();
    const maxIdx = await contract.methods.getTokenCounter().call();

    console.log("当前有效的 NFT下标（validCounter）: " + curIdx);
    console.log("当前所有的 NFT下标（tokenCounter）: " + (maxIdx - 1n));
    console.log("过期的 NFT 已被标记为无效");
}

module.exports = { invalidateNFT };

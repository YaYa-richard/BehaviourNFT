// utils/mintNFT.js
const User = require("../models/User");
const { uploadToIPFS } = require("../utils/ipfs"); // IPFS 上传函数
const Web3 = require('web3').Web3;
const Contract = require("../contracts/UserProfileNFT.json");
const ContractABI = Contract.abi;
const ContractAddress = Contract.address;

// 不在此处连接 mongoose，由 server.js 负责
// const mongoose = require("mongoose");

// 注释掉定时任务
// const cron = require("node-cron"); // 用于定时任务
// cron.schedule("0 0 * * *", () => {
//   console.log("开始每日的 NFT 铸造任务");
//   mintNFTs();
// });

async function mintNFTs() {
  try {
    const web3 = new Web3("http://127.0.0.1:8545"); // 替换为您的以太坊节点
    const contract = new web3.eth.Contract(ContractABI, ContractAddress);

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

        // 调用智能合约，铸造 NFT 到用户的钱包地址
        // 需要拥有合约权限的账户私钥
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // 请确保私钥安全，不要在代码中明文存储
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        // 构建交易
        const tx = contract.methods.mintNFT(walletAddress, ipfsHash);
        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account.address);

        const txData = {
          from: account.address,
          to: ContractAddress,
          data: data,
          gas,
          gasPrice,
          nonce,
        };

        const receipt = await web3.eth.sendTransaction(txData);
        console.log(
          `成功铸造 NFT 给用户 ${walletAddress} ，交易哈希： ${receipt.transactionHash}`
        );
      } else {
        console.log(`用户 ${walletAddress} 没有找到或没有偏好数据`);
      }
    }
  } catch (error) {
    console.error("铸造 NFT 失败", error);
  }
  // 不在此处关闭数据库连接，由 server.js 管理
  // finally {
  //   mongoose.connection.close(); // 关闭数据库连接
  // }
}

// 导出 mintNFTs 函数
module.exports = { mintNFTs };


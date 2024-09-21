// utils/mintNFT.js
const UserAction = require("../models/UserAction");
const { uploadToIPFS } = require("./ipfs");
const Web3 = require("web3");
const Contract = require("../contracts/UserProfileNFT.json");
const ContractABI = Contract.abi;
const ContractAddress = Contract.address;

/**
 * 铸造 NFT 函数
 */
exports.mintNFTs = async () => {
    try {
        const web3 = new Web3("http://localhost:8545"); // 默认Hardhat本地节点
        const contract = new web3.eth.Contract(ContractABI, ContractAddress);

        // 获取所有用户列表
        const users = await UserAction.distinct("user");

        for (const user of users) {
            // 获取用户的所有行为数据
            const actions = await UserAction.find({ user });

            // 将数据上传到 IPFS
            const ipfsHash = await uploadToIPFS(actions);

            // 调用智能合约，铸造 NFT 到用户的钱包地址
            // 需要拥有合约权限的账户私钥
            const privateKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);

            // 构建交易
            const tx = contract.methods.mintNFT(user, ipfsHash);
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
                `成功铸造 NFT 给用户 ${user} ，交易哈希： ${receipt.transactionHash}`
            );
        }
    } catch (error) {
        console.error("铸造 NFT 失败", error);
    }
};

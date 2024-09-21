// src/components/Marketplace.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import { InputNumber, Button, message } from "antd";
import Web3 from "web3";
import axios from "axios";
import Contract from "../contracts/UserProfileNFT.json";

// 从合约文件中导入ABI和地址
const abi = Contract.abi;
const address = Contract.address;

// 定义Marketplace组件，接收account作为props
function Marketplace({ account }) {
    // 使用useState钩子定义quantity状态，初始值为1
    const [quantity, setQuantity] = useState(1);

    // 定义购买NFT的异步函数
    const purchaseNFTs = async () => {
        // 检查购买数量是否有效
        if (quantity <= 0) {
            message.error("购买数量必须大于0");
            return;
        }

        try {
            // 创建Web3实例
            const web3 = new Web3(window.ethereum);
            // 创建合约实例
            const contract = new web3.eth.Contract(abi, address);
            // 获取每个NFT的价格
            const pricePerNFT = await contract.methods.pricePerNFT().call();

            // 计算总价
            const totalPrice = web3.utils
                .toBN(pricePerNFT)
                .mul(web3.utils.toBN(quantity));

            // 调用合约的purchaseNFT方法
            await contract.methods.purchaseNFT(quantity).send({
                from: account,
                value: totalPrice,
            });

            // 购买成功提示
            message.success("购买成功");
        } catch (error) {
            // 错误处理
            console.error("购买失败", error);
            message.error("购买失败");
        }
    };

    // 渲染组件
    return (
        <div>
            <Navbar account={account} />
            <div style={{ padding: "20px" }}>
                <h2>NFT市场</h2>
                <p>购买用户画像NFT，我们将为您随机选择对应数量的NFT。</p>
                {/* 输入购买数量 */}
                <InputNumber min={1} value={quantity} onChange={setQuantity} />
                {/* 购买按钮 */}
                <Button
                    type="primary"
                    onClick={purchaseNFTs}
                    style={{ marginLeft: "10px" }}
                >
                    购买
                </Button>
            </div>
        </div>
    );
}

export default Marketplace;

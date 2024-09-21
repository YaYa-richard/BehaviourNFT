// src/components/Marketplace.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import { InputNumber, Button, message } from "antd";
import Web3 from "web3";
import axios from "axios";
import Contract from "../contracts/UserProfileNFT.json";

const containerStyle = {
  backgroundColor: "#f3e8ff",
  minHeight: "100vh",
  padding: "20px",
};

const contentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonStyle = {
  backgroundColor: "#9333ea",
  borderColor: "#9333ea",
  color: "white",
  marginLeft: "10px",
};
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
    <div style={containerStyle}>
      <Navbar account={account} />
      <div style={contentStyle}>
        <h2 style={{ color: "#6b21a8" }}>NFT Market</h2>
        <p>
          When you purchase a user portrait NFT, we will randomly select the
          corresponding number of NFTs for you.
        </p>
        <InputNumber min={1} value={quantity} onChange={setQuantity} />
        <Button type="primary" onClick={purchaseNFTs} style={buttonStyle}>
          Buy
        </Button>
      </div>
    </div>
  );
}

export default Marketplace;

// src/components/Marketplace.js
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { InputNumber, Button, message } from "antd";
import Web3 from "web3";
import Contract from "../contracts/UserProfileNFT.json";
import BN from "bn.js";

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

// 从合约文件中导入 ABI 和地址
const abi = Contract.abi;
const address = Contract.address;

function Marketplace({ account }) {
  const [quantity, setQuantity] = useState(1);
  const [availableNFTs, setAvailableNFTs] = useState(null); // 添加状态变量

  useEffect(() => {
    // 获取可用的 NFT 数量
    const fetchAvailableNFTs = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, address);

        const tokenCounter = await contract.methods.tokenCounter().call();
        const validCounter = await contract.methods.getValidCounter().call();

        const available = parseInt(tokenCounter) - parseInt(validCounter);
        setAvailableNFTs(available);
      } catch (error) {
        console.error("获取可用的 NFT 数量失败", error);
        message.error("无法获取可用的用户画像数量");
      }
    };

    fetchAvailableNFTs();
  }, []);

  const purchaseNFTs = async () => {
    if (quantity <= 0) {
      message.error("购买数量必须大于0");
      return;
    }

    if (availableNFTs === null) {
      message.error("无法获取可用的用户画像数量");
      return;
    }

    if (availableNFTs === 0) {
      message.error("没有可购买的用户画像");
      return;
    }

    if (quantity > availableNFTs) {
      message.error("用户画像数量不足");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, address);

      // 获取每个 NFT 的价格和交易费
      const pricePerNFT = await contract.methods.pricePerNFT().call();
      const nftPriceBN = new BN(pricePerNFT);
      const transactionFee = await contract.methods.transactionFee().call();
      const transactionFeeBN = new BN(transactionFee);

      // 计算总价和总交易费
      const totalPrice = nftPriceBN.mul(new BN(quantity));
      const totalFee = transactionFeeBN.mul(new BN(quantity));

      // 确保发送的以太数量足够支付总价
      const totalValue = totalPrice.add(totalFee);

      // 调用合约的 purchaseNFT 方法
      await contract.methods.purchaseNFT(quantity).send({
        from: account,
        value: totalValue.toString(), // 以 wei 为单位的字符串
        gas: 2000000, // 设置更高的 gas 限额
      });

      message.success("购买成功");

      // 更新可用的 NFT 数量
      const tokenCounter = await contract.methods.tokenCounter().call();
      const validCounter = await contract.methods.getValidCounter().call();
      const available = parseInt(tokenCounter) - parseInt(validCounter);
      setAvailableNFTs(available);

      // 如果剩余的 NFT 数量小于当前购买数量，调整购买数量
      if (quantity > available) {
        setQuantity(available);
      }
    } catch (error) {
      console.error("购买失败", error);
      message.error("购买失败");
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar account={account} />
      <div style={contentStyle}>
        <h2 style={{ color: "#6b21a8" }}>NFT 市场</h2>
        <p>购买用户画像 NFT，我们将为您顺序选择对应数量的 NFT。</p>
        <p>
          当前可购买的用户画像数量：
          {availableNFTs !== null ? availableNFTs : "加载中..."}
        </p>
        <InputNumber
          min={1}
          max={availableNFTs !== null ? availableNFTs : undefined}
          value={quantity}
          onChange={setQuantity}
        />
        <Button
          type="primary"
          onClick={purchaseNFTs}
          style={buttonStyle}
          disabled={availableNFTs === 0}
        >
          购买
        </Button>
      </div>
    </div>
  );
}

export default Marketplace;


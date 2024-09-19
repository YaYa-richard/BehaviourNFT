// src/components/Login.js
import React, { useEffect } from "react";
import Web3 from "web3";
import { Button } from "antd";
function Login({ setAccount }) {
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // 请求用户授权
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("用户拒绝了连接请求");
            }
        } else {
            alert("请安装MetaMask插件");
        }
    };
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>欢迎来到用户画像NFT系统</h1>
            <Button type="primary" onClick={connectWallet}>
                使用 MetaMask 登录
            </Button>
        </div>
    );
}
export default Login;

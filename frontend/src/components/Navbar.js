// src/components/Navbar.js
import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
function Navbar({ account }) {
    return (
        <Menu mode="horizontal">
            <Menu.Item key="forum">
                <Link to="/">论坛</Link>
            </Menu.Item>
            <Menu.Item key="marketplace">
                <Link to="/marketplace">NFT市场</Link>
            </Menu.Item>
            <Menu.Item key="account" style={{ marginLeft: "auto" }}>
                {account.slice(0, 6) + "..." + account.slice(-4)}
            </Menu.Item>
        </Menu>
    );
}
export default Navbar;

import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const navbarStyle = {
  backgroundColor: "#9333ea",
};

const menuItemStyle = {
  color: "white",
};

function Navbar({ account }) {
  return (
    <Menu mode="horizontal" style={navbarStyle}>
      <Menu.Item key="forum" style={menuItemStyle}>
        <Link to="/">论坛</Link>
      </Menu.Item>
      <Menu.Item key="marketplace" style={menuItemStyle}>
        <Link to="/marketplace">NFT市场</Link>
      </Menu.Item>
      <Menu.Item key="account" style={{ ...menuItemStyle, marginLeft: "auto" }}>
        {account.slice(0, 6) + "..." + account.slice(-4)}
      </Menu.Item>
    </Menu>
  );
}

export default Navbar;

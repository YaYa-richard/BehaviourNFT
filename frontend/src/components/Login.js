import React from "react";
import { motion } from "framer-motion";

const Login = ({ setAccount }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User Rejected The Connection Request");
      }
    } else {
      alert("Please Install MetaMask");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 1,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #9333ea, #4f46e5)",
    color: "white",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
  };

  const buttonStyle = {
    padding: "1rem 2rem",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#6b21a8",
    backgroundColor: "white",
    borderRadius: "9999px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 300ms ease-in-out",
    cursor: "pointer",
  };

  return (
    <motion.div
      style={containerStyle}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 style={titleStyle} variants={childVariants}>
        Welcome to the User Portrait NFT System
      </motion.h1>
      <motion.button
        style={buttonStyle}
        variants={childVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectWallet}
      >
        Login with MetaMask
      </motion.button>
    </motion.div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Pie } from "react-chartjs-2";
import { Card, Spin } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const ProfilePage = ({ account }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${account}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error("获取用户画像失败", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [account]);

  if (loading) {
    return (
      <div style={containerStyle}>
        <Navbar account={account} />
        <div style={contentStyle}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={containerStyle}>
        <Navbar account={account} />
        <div style={contentStyle}>
          <h2 style={{ color: "#6b21a8" }}>User Profile</h2>
          <p>No user profile data available.</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: ["Sports", "Technology", "Music", "History", "Art"],
    datasets: [
      {
        data: [
          userProfile.preferences.sports,
          userProfile.preferences.technology,
          userProfile.preferences.music,
          userProfile.preferences.history,
          userProfile.preferences.art,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(0, 255, 0, 0.2)",
          "rgba(255, 192, 203, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(0, 255, 0, 1)",
          "rgba(255, 192, 203, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <Navbar account={account} />
      <div style={contentStyle}>
        <h2 style={{ color: "#6b21a8" }}>User Profile</h2>
        <Card style={{ width: 300, margin: "20px auto" }}>
          <Pie data={data} />
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Forum from "./components/Forum";
import Marketplace from "./components/Marketplace";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";
import axios from "axios";

function App() {
  const [account, setAccount] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (account) {
      axios
        .get(`/api/users/${account}`)
        .then((response) => setUserProfile(response.data))
        .catch((error) => {
          console.error("获取用户画像失败", error);
          setUserProfile(null);
        });
    }
  }, [account]);

  if (!account) {
    return <Login setAccount={setAccount} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Forum account={account} userProfile={userProfile} />}
        />
        <Route
          path="/marketplace"
          element={<Marketplace account={account} userProfile={userProfile} />}
        />
        <Route path="/profile" element={<ProfilePage account={account} />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Forum from "./components/Forum";
import Marketplace from "./components/Marketplace";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
    const [account, setAccount] = useState("");
    return (
        <Router>
            {account ? (
                <Routes>
                    <Route path="/" element={<Forum account={account} />} />
                    <Route
                        path="/marketplace"
                        element={<Marketplace account={account} />}
                    />
                </Routes>
            ) : (
                <Login setAccount={setAccount} />
            )}
        </Router>
    );
}
export default App;

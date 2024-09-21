// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:walletAddress", async (req, res) => {
  try {
    const user = await User.findOne({
      walletAddress: req.params.walletAddress,
    });
    if (!user) {
      return res.status(404).json(null);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

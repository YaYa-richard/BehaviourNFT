// routes/userActions.js
const express = require("express");
const router = express.Router();
const userActionsController = require("../controllers/userActionsController");

router.post("/", userActionsController.recordAction);

module.exports = router;

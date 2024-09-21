// controllers/userActionsController.js
const UserAction = require("../models/UserAction");

exports.recordAction = async (req, res) => {
    try {
        const { user, action, details } = req.body;
        const userAction = new UserAction({
            user,
            action,
            details,
        });
        await userAction.save();
        res.json({ message: "用户行为记录成功" });
    } catch (error) {
        res.status(500).json({ error: "记录用户行为失败" });
    }
};

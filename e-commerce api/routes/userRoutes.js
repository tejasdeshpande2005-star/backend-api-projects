const express = require("express");

const {
    createUser,
    loginUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;
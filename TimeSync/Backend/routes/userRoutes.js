const express = require("express");
const router = express.Router();
const userController = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/controllers/userController.js");
const authMiddleware = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/middleware/authMiddleware.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", authMiddleware, userController.getUserProfile);
router.get("/doctors", userController.getAllDoctors);
module.exports = router;

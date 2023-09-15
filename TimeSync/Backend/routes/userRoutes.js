const express = require("express");
const router = express.Router();
const userController = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/controllers/userController.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;

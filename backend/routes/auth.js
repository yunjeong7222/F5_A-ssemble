const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

router.post("/check-duplicate", authController.checkDuplicate);
router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
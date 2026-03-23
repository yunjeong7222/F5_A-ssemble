const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth");
const { createWorkflow, getWorkflowById, getMyWorkflows, deleteWorkflow } = require("../controllers/workflowsController");

router.post("/", authMiddleware, createWorkflow);      // 워크플로우 생성 (비로그인도 가능)
router.get("/my", authMiddleware, getMyWorkflows);     // 내 워크플로우 [AUTH]
router.get("/:id", getWorkflowById); 
router.delete("/:id", authMiddleware, deleteWorkflow);

module.exports = router;
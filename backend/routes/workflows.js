const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { createWorkflow, getWorkflowById, getMyWorkflows } = require("../controllers/workflowsController");

router.post("/", createWorkflow);                      // 워크플로우 생성 (비로그인도 가능)
router.get("/my", authMiddleware, getMyWorkflows);     // 내 워크플로우 [AUTH]
router.get("/:id", getWorkflowById);                   // 상세 조회

module.exports = router;
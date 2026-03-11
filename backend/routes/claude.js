const express = require("express");
const router = express.Router();
const { suggest, generateWorkflow } = require("../controllers/claudeController");

router.post("/suggest", suggest);
router.post("/workflow", generateWorkflow);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getTools, getToolById } = require("../controllers/toolsController");

router.get("/", getTools);
router.get("/:id", getToolById);

module.exports = router;
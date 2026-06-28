const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/chat", aiController.chat);
router.get("/insights", aiController.getInsights);
router.get("/restock", aiController.getRestockRecommendations);
router.get("/report", aiController.getReport);

module.exports = router;

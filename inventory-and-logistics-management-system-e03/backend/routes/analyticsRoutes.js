const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/inventory", analyticsController.getInventoryAnalytics);
router.get("/orders", analyticsController.getOrdersAnalytics);
router.get("/shipments", analyticsController.getShipmentsAnalytics);

module.exports = router;

//create shipment routes
const express = require("express");

const router = express.Router();

const {
    createShipment,
    getShipments,
    updateShipment
} = require("../controllers/shipmentController");

router.post("/", createShipment);
router.get("/", getShipments);
router.put("/:id", updateShipment);

module.exports = router;
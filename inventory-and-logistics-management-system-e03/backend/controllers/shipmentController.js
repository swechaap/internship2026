//create shipment
const db = require("../config/db");

exports.createShipment = (req, res) => {
    const {
        order_id,
        status,
        delivery_date
    } = req.body;

    const sql =
        `INSERT INTO shipments
        (order_id, status, delivery_date)
         VALUES (?, ?, ?)`;

    db.query(
        sql,
        [order_id, status || 'Processing', delivery_date],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: "Shipment Created",
                shipment_id: result.insertId
            });
        });
};

//get shipments with joined order and product info
exports.getShipments = (req, res) => {
    db.query(
        `SELECT s.*, o.product_id, o.quantity, p.product_name, p.category
         FROM shipments s
         LEFT JOIN orders o ON s.order_id = o.order_id
         LEFT JOIN products p ON o.product_id = p.product_id
         ORDER BY s.shipment_id DESC`,
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        });
};

//update shipment status and cascade to order status
exports.updateShipment = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    db.query(
        "UPDATE shipments SET status=? WHERE shipment_id=?",
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            // Fetch order ID associated with this shipment to sync status
            db.query(
                "SELECT order_id FROM shipments WHERE shipment_id=?",
                [id],
                (err, shipments) => {
                    if (err || shipments.length === 0) {
                        return res.json({ message: "Shipment Updated" });
                    }

                    const orderId = shipments[0].order_id;
                    let orderStatus = "Pending";
                    if (status === "Delivered") {
                        orderStatus = "Delivered";
                    } else if (status === "In Transit") {
                        orderStatus = "Shipped";
                    } else if (status === "Processing") {
                        orderStatus = "Pending";
                    }

                    db.query(
                        "UPDATE orders SET status=? WHERE order_id=?",
                        [orderStatus, orderId],
                        (err) => {
                            if (err) console.error("Failed to update linked order status:", err);
                            res.json({
                                message: "Shipment Updated and Linked Order Sync'd",
                                shipment_id: id,
                                order_id: orderId,
                                order_status: orderStatus
                            });
                        }
                    );
                }
            );
        });
};
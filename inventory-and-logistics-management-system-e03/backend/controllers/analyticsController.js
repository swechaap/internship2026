const db = require("../config/db");

exports.getInventoryAnalytics = (req, res) => {
    const categoryQuery = "SELECT category, COUNT(*) as count FROM products GROUP BY category";
    const stockQuery = "SELECT product_name, quantity FROM products ORDER BY quantity DESC LIMIT 10";

    db.query(categoryQuery, (err, categoryData) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        db.query(stockQuery, (err, stockData) => {
            if (err) return res.status(500).json({ error: "DB Error" });
            res.json({ categories: categoryData, stock: stockData });
        });
    });
};

exports.getOrdersAnalytics = (req, res) => {
    const statusQuery = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
    const overTimeQuery = "SELECT DATE(created_at) as date, COUNT(*) as count FROM orders GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 7";

    db.query(statusQuery, (err, statusData) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        db.query(overTimeQuery, (err, overTimeData) => {
            if (err) {
                // In case created_at doesn't exist yet, return empty
                return res.json({ status: statusData, overTime: [] });
            }
            res.json({ status: statusData, overTime: overTimeData });
        });
    });
};

exports.getShipmentsAnalytics = (req, res) => {
    const statusQuery = "SELECT status, COUNT(*) as count FROM shipments GROUP BY status";
    const transitVsDeliveredQuery = "SELECT IF(status='Delivered', 'Delivered', 'In Transit/Processing') as groupStatus, COUNT(*) as count FROM shipments GROUP BY groupStatus";

    db.query(statusQuery, (err, statusData) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        db.query(transitVsDeliveredQuery, (err, comparisonData) => {
            if (err) return res.status(500).json({ error: "DB Error" });
            res.json({ status: statusData, comparison: comparisonData });
        });
    });
};

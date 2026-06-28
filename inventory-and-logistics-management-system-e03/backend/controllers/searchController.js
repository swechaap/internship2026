const db = require("../config/db");

exports.globalSearch = (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ products: [], orders: [], shipments: [], suppliers: [] });

    const searchStr = `%${query}%`;
    const searchId = isNaN(query) ? -1 : parseInt(query);

    const productsQuery = `SELECT * FROM products WHERE product_name LIKE ? OR category LIKE ?`;
    const ordersQuery = `SELECT o.*, p.product_name FROM orders o JOIN products p ON o.product_id = p.product_id WHERE o.order_id = ? OR p.product_name LIKE ?`;
    const shipmentsQuery = `SELECT s.*, o.order_id FROM shipments s JOIN orders o ON s.order_id = o.order_id WHERE s.shipment_id = ? OR o.order_id = ?`;
    const suppliersQuery = `SELECT * FROM suppliers WHERE supplier_name LIKE ? OR category LIKE ?`;

    const results = {};
    let completed = 0;

    const finalize = () => {
        completed++;
        if (completed === 4) {
            res.json(results);
        }
    };

    db.query(productsQuery, [searchStr, searchStr], (err, rows) => {
        results.products = err ? [] : rows;
        finalize();
    });

    db.query(ordersQuery, [searchId, searchStr], (err, rows) => {
        results.orders = err ? [] : rows;
        finalize();
    });

    db.query(shipmentsQuery, [searchId, searchId], (err, rows) => {
        results.shipments = err ? [] : rows;
        finalize();
    });

    db.query(suppliersQuery, [searchStr, searchStr], (err, rows) => {
        results.suppliers = err ? [] : rows;
        finalize();
    });
};

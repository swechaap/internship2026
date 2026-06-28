//Create orders
const db = require("../config/db");

exports.createOrder = (req, res) => {
    const { product_id, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!product_id || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: "Invalid product_id or quantity" });
    }

    // 1. Get product details to verify stock
    db.query("SELECT * FROM products WHERE product_id = ?", [product_id], (err, products) => {
        if (err) return res.status(500).json(err);
        if (products.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const product = products[0];
        if (product.quantity < qty) {
            return res.status(400).json({ 
                message: `Insufficient stock for product "${product.product_name}". Only ${product.quantity} items left.` 
            });
        }

        // 2. Insert order
        db.query(
            "INSERT INTO orders (product_id, quantity, status) VALUES (?, ?, 'Pending')",
            [product_id, qty],
            (err, result) => {
                if (err) return res.status(500).json(err);
                
                const newOrderId = result.insertId;
                const newStock = product.quantity - qty;

                // 3. Deduct stock from inventory
                db.query(
                    "UPDATE products SET quantity = ? WHERE product_id = ?",
                    [newStock, product_id],
                    (err) => {
                        if (err) console.error("Failed to update stock:", err);

                        // Check low stock and create notification alert if under 5
                        if (newStock < 5) {
                            const alertMsg = `Low stock alert: Product "${product.product_name}" is running low (${newStock} items left).`;
                            db.query(
                                "INSERT INTO notifications (message) VALUES (?)",
                                [alertMsg],
                                (err) => {
                                    if (err) console.error("Failed to log low stock notification:", err);
                                }
                            );
                        }

                        // 4. Create shipment automatically
                        const deliveryDate = new Date();
                        deliveryDate.setDate(deliveryDate.getDate() + 5);
                        const deliveryDateString = deliveryDate.toISOString().slice(0, 10); // YYYY-MM-DD

                        db.query(
                            "INSERT INTO shipments (order_id, status, delivery_date) VALUES (?, 'Processing', ?)",
                            [newOrderId, deliveryDateString],
                            (err) => {
                                if (err) console.error("Failed to create shipment automatically:", err);

                                res.json({
                                    message: "Order Created Successfully",
                                    order_id: newOrderId,
                                    current_stock: newStock
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

//get orders with joined product details
exports.getOrders = (req, res) => {
    db.query(
        `SELECT o.*, p.product_name, p.price, p.category 
         FROM orders o 
         LEFT JOIN products p ON o.product_id = p.product_id
         ORDER BY o.order_id DESC`,
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
};
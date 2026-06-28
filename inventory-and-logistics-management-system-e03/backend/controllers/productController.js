const db = require("../config/db");

// GET all products
exports.getProducts = (req, res) => {
    db.query("SELECT * FROM products ORDER BY product_id DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// POST create a product
exports.createProduct = (req, res) => {
    const { product_name, quantity, price, category } = req.body;
    db.query(
        "INSERT INTO products (product_name, quantity, price, category) VALUES (?, ?, ?, ?)",
        [product_name, quantity || 0, price || 0.0, category || 'General'],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: "Product Created successfully",
                product_id: result.insertId
            });
        }
    );
};

// PUT update a product
exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const { product_name, quantity, price, category } = req.body;
    db.query(
        "UPDATE products SET product_name=?, quantity=?, price=?, category=? WHERE product_id=?",
        [product_name, quantity, price, category, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: "Product Updated successfully",
                product_id: id
            });
        }
    );
};

// DELETE a product
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM products WHERE product_id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({
            message: "Product Deleted successfully",
            product_id: id
        });
    });
};

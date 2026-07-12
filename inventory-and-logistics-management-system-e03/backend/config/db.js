require("dotenv").config();
const mysql = require("mysql2");
const dbPort = parseInt(process.env.DB_PORT || "3306", 10);
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", dbPort);
console.log("USER:", process.env.DB_USER);
console.log("DATABASE:", process.env.DB_NAME);
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: dbPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 60000,
  multipleStatements: true,
});
connection.on("error", (err) => {
    console.error("MySQL connection error:", err.message);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
        console.warn("MySQL connection dropped. The app will continue running, but database-backed routes may be unavailable until reconnection.");
    }
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL Connection Error:", err);
    } else {
        console.log("MySQL Connected successfully.");
        initializeTablesAndSeed();
    }
});

function initializeTablesAndSeed() {
    const sql = `
        CREATE TABLE IF NOT EXISTS products (
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL DEFAULT 0,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            category VARCHAR(100)
        );

        CREATE TABLE IF NOT EXISTS orders (
            order_id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'Pending',
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS shipments (
            shipment_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'Processing',
            delivery_date DATE,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS suppliers (
            supplier_id INT AUTO_INCREMENT PRIMARY KEY,
            supplier_name VARCHAR(255) NOT NULL,
            contact VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notifications (
            notification_id INT AUTO_INCREMENT PRIMARY KEY,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user'
        );
    `;

    connection.query(sql, (err) => {
        if (err) {
            console.error("Error creating tables:", err);
            return;
        }
        console.log("Database tables verified/created successfully.");
        
        // Add missing columns to suppliers table
        const alterSuppliers = [
            "ALTER TABLE suppliers ADD COLUMN category VARCHAR(100) DEFAULT 'General'",
            "ALTER TABLE suppliers ADD COLUMN email VARCHAR(255) DEFAULT ''",
            "ALTER TABLE suppliers ADD COLUMN phone VARCHAR(100) DEFAULT ''",
            "ALTER TABLE suppliers ADD COLUMN lead_time VARCHAR(100) DEFAULT 'N/A'",
            "ALTER TABLE suppliers ADD COLUMN status VARCHAR(50) DEFAULT 'Active'",
            "ALTER TABLE suppliers ADD COLUMN rating DECIMAL(3,1) DEFAULT 4.0",
            "ALTER TABLE suppliers ADD COLUMN address VARCHAR(255) DEFAULT ''",
            "ALTER TABLE suppliers ADD COLUMN joining_date DATE"
        ];

        // Add missing columns to notifications table
        const alterNotifications = [
            "ALTER TABLE notifications ADD COLUMN type VARCHAR(50) DEFAULT 'info'",
            "ALTER TABLE notifications ADD COLUMN title VARCHAR(255) DEFAULT 'Notification'",
            "ALTER TABLE notifications ADD COLUMN is_read TINYINT(1) DEFAULT 0"
        ];

        const allAlters = [...alterSuppliers, ...alterNotifications];
        let doneCount = 0;
        allAlters.forEach(query => {
            connection.query(query, (alterErr) => {
                if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME') {
                    console.warn('ALTER TABLE warning:', alterErr.message);
                }
                doneCount++;
                if (doneCount === allAlters.length) {
                    // Check if products table is empty to seed it
                    connection.query("SELECT COUNT(*) AS count FROM products", (err, result) => {
                        if (err) return console.error(err);
                        if (result && result[0] && result[0].count === 0) {
                            seedDatabase();
                        }
                    });
                }
            });
        });
    });
}

function seedDatabase() {
    console.log("Seeding database with sample inventory, suppliers, orders, shipments and notifications...");
    
    const seedProducts = `
        INSERT INTO products (product_name, quantity, price, category) VALUES
        ('Premium Wireless Mouse', 4, 49.99, 'Electronics'),
        ('Ergonomic Mechanical Keyboard', 15, 129.99, 'Electronics'),
        ('UltraWide 34" Monitor', 8, 449.99, 'Electronics'),
        ('Adjustable Office Desk', 12, 299.99, 'Furniture'),
        ('Steel Thermos Bottle', 45, 24.99, 'Kitchenware');
    `;
    
    const seedSuppliers = `
        INSERT INTO suppliers (supplier_name, contact, category, email, phone, lead_time, status, rating, address, joining_date) VALUES
        ('Apex Electronics Ltd.', 'sales@apexelectronics.com', 'Electronics', 'sales@apexelectronics.com', '+1 (555) 123-4567', '5 days', 'Active', 4.8, '100 Tech Park, San Jose, CA, US', '2025-11-01'),
        ('Global Logistics & Office', 'support@globallogistics.com', 'Logistics', 'support@globallogistics.com', '+1 (555) 234-5678', '3 days', 'Active', 4.2, '200 Commerce Blvd, Chicago, IL, US', '2026-01-15'),
        ('Kitchen Craft Supply', 'orders@kitchencraft.com', 'Packaging', 'orders@kitchencraft.com', '+1 (555) 345-6789', '7 days', 'Active', 3.9, '50 Industrial Ave, Austin, TX, US', '2026-03-10');
    `;

    connection.query(seedProducts, (err) => {
        if (err) console.error("Error seeding products:", err);
        
        connection.query(seedSuppliers, (err) => {
            if (err) console.error("Error seeding suppliers:", err);
            
            // Seed a sample order, shipment and notification
            const seedOrdersAndShipments = `
                INSERT INTO orders (product_id, quantity, status) VALUES (2, 2, 'Pending');
                INSERT INTO shipments (order_id, status, delivery_date) VALUES (1, 'Processing', '2026-06-25');
                INSERT INTO notifications (type, title, message, is_read) VALUES 
                  ('critical', 'Low Stock Alert', 'Premium Wireless Mouse has only 4 items left — reorder required.', 0),
                  ('info', 'System Initialized', 'Inventory & Logistics Management System started successfully.', 0),
                  ('success', 'Supplier Onboarded', 'Apex Electronics Ltd. has been verified and activated.', 1);
            `;
            
            connection.query(seedOrdersAndShipments, (err) => {
                if (err) console.error("Error seeding orders/shipments/notifications:", err);
                else console.log("Database seeded successfully!");
            });
        });
    });
}

module.exports = connection;
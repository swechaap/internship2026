// server.js

// Fix: Disable TLS cert verification for Windows environments where Node.js
// fetch fails to verify Google's SSL certificate chain (affects Gemini API calls)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const searchRoutes = require("./routes/searchRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/products", productRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/notifications", notificationRoutes);

// Simple debug endpoint for the user to verify environment variables on Render
app.get("/api/check-env", (req, res) => {
    const key = process.env.GROQ_API_KEY;
    res.json({
        message: "Environment Variable Diagnostics",
        groqKeyPresent: !!key,
        groqKeyLength: key ? key.length : 0,
        groqKeyPreview: key ? `${key.substring(0, 5)}...` : "NONE",
        nodeEnv: process.env.NODE_ENV
    });
});
app.use("/ai", aiRoutes);
app.use("/search", searchRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Inventory & Logistics Management System Backend is Running 🚀");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
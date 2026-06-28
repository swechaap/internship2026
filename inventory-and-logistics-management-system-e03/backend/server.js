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
app.use("/ai", aiRoutes);
app.use("/search", searchRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server Running on port " + process.env.PORT);
});
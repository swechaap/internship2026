const { GoogleGenAI } = require("@google/genai");
const db = require("../config/db");

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Cache - 10 min TTL to reduce repeated quota hits
const cache = {
    insights: { data: null, timestamp: 0 },
    report: { data: null, timestamp: 0 },
    restock: { data: null, timestamp: 0 }
};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Model priority list - tries each in order. Each model has its own separate quota pool.
// All confirmed available on this API key.
const MODELS = [
    "gemini-2.5-flash",      // Primary - best quality
    "gemini-2.0-flash",      // Fallback 1
    "gemini-2.5-flash-lite", // Fallback 2 - lighter version
    "gemini-2.0-flash-lite", // Fallback 3
    "gemini-flash-latest",   // Fallback 4 - always points to latest flash
    "gemini-pro-latest",     // Fallback 5
];

// Helper: try AI generation with automatic model fallback on 503/overload AND 429 quota
const generateWithFallback = async (prompt) => {
    let lastError;
    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({ model, contents: prompt });
            return response;
        } catch (err) {
            const msg = (err.message || "").toString();
            // Retry on both 503 (busy) AND 429 (quota) - each model has its own quota pool
            const isRetryable = msg.includes("503") || msg.includes("unavailable") ||
                                msg.includes("UNAVAILABLE") || msg.includes("high demand") ||
                                msg.includes("busy") || msg.includes("overloaded") ||
                                msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") ||
                                msg.includes("quota") || msg.includes("exhausted");
            if (isRetryable) {
                console.warn(`Model ${model} unavailable/quota, trying fallback...`);
                lastError = err;
                continue;
            }
            throw err; // Non-retryable (auth error, bad request) - throw immediately
        }
    }
    throw lastError; // All models failed
};

// Helper to handle AI Errors gracefully
const handleAIError = (error, res) => {
    console.error("AI Error:", error.message || error);
    const msg = (error.message || "").toString();

    if (error.status === 429 || msg.includes("429") || msg.includes("Quota") || msg.includes("exhausted") || msg.includes("RESOURCE_EXHAUSTED")) {
        // Extract retry delay if available
        let retryInfo = "";
        try {
            const parsed = JSON.parse(msg);
            const retryDelay = parsed?.error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay;
            if (retryDelay) retryInfo = ` Retry in ${retryDelay}.`;
        } catch (e) { /* ignore parse errors */ }
        return res.status(429).json({ 
            error: `Daily AI quota exhausted for all models.${retryInfo} Quota resets every 24 hours. Try again later or upgrade your Gemini API plan at ai.google.dev.`, 
            code: 429 
        });
    }
    if (error.status === 503 || msg.includes("503") || msg.includes("unavailable") || msg.includes("busy") || msg.includes("high demand")) {
        return res.status(503).json({ error: "AI service is temporarily busy. Please try again in a moment.", code: 503 });
    }
    if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
        return res.status(502).json({ error: "Cannot connect to AI service. Check your internet connection.", code: 502 });
    }
    if (msg.includes("API_KEY") || msg.includes("API key") || error.status === 403 || error.status === 401) {
        return res.status(401).json({ error: "Invalid Gemini API key. Please check your .env configuration.", code: 401 });
    }

    return res.status(500).json({ error: `AI error: ${msg.substring(0, 150) || "Unknown error. Please try again."}` });
};

// ─── COMPACT SUMMARY BUILDERS (drastically reduces token usage) ───────────────

// Builds a short text summary of products instead of dumping full JSON rows
const buildProductSummary = (products) => {
    if (!products || products.length === 0) return "No products in inventory.";
    const total = products.length;
    const lowStock = products.filter(p => p.quantity < 10);
    const outOfStock = products.filter(p => p.quantity === 0);
    const totalValue = products.reduce((s, p) => s + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0);
    const topProducts = products
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(p => `${p.product_name} (qty:${p.quantity}, price:${p.price})`);
    const lowStockList = lowStock.map(p => `${p.product_name} (qty:${p.quantity})`).join(", ");
    return [
        `Total products: ${total}`,
        `Total inventory value: ₹${totalValue.toFixed(2)}`,
        `Low stock (<10): ${lowStock.length} products${lowStockList ? " — " + lowStockList : ""}`,
        `Out of stock: ${outOfStock.length}`,
        `Top stocked products: ${topProducts.join(" | ")}`
    ].join("\n");
};

// Builds a short text summary of orders
const buildOrderSummary = (orders) => {
    if (!orders || orders.length === 0) return "No orders found.";
    const total = orders.length;
    const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    const totalQty = orders.reduce((s, o) => s + (parseInt(o.quantity) || 0), 0);
    const recentOrders = orders.slice(-5).map(o => `#${o.order_id} ${o.product_name} qty:${o.quantity} [${o.status}]`);
    return [
        `Total orders: ${total}`,
        `Status breakdown: ${Object.entries(byStatus).map(([k, v]) => `${k}:${v}`).join(", ")}`,
        `Total quantity ordered: ${totalQty}`,
        `Recent orders: ${recentOrders.join(" | ")}`
    ].join("\n");
};

// Builds a short text summary of shipments
const buildShipmentSummary = (shipments) => {
    if (!shipments || shipments.length === 0) return "No shipments found.";
    const total = shipments.length;
    const byStatus = shipments.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
    return [
        `Total shipments: ${total}`,
        `Status breakdown: ${Object.entries(byStatus).map(([k, v]) => `${k}:${v}`).join(", ")}`
    ].join("\n");
};

// Builds a short text summary of suppliers
const buildSupplierSummary = (suppliers) => {
    if (!suppliers || suppliers.length === 0) return "No suppliers found.";
    return `Total suppliers: ${suppliers.length}. Names: ${suppliers.slice(0, 8).map(s => s.name || s.supplier_name).join(", ")}`;
};

// Helper: fetch raw DB data for specific tables
const getDbData = (tables = ["products", "orders", "shipments", "suppliers"]) => {
    return new Promise((resolve, reject) => {
        const allQueries = {
            products: "SELECT * FROM products",
            orders: "SELECT * FROM orders ORDER BY order_id DESC LIMIT 50",
            shipments: "SELECT * FROM shipments ORDER BY shipment_id DESC LIMIT 50",
            suppliers: "SELECT * FROM suppliers LIMIT 20"
        };
        let contextData = {};
        let completed = 0;
        const keys = tables.filter(t => allQueries[t]);
        if (keys.length === 0) return resolve(contextData);
        keys.forEach(key => {
            db.query(allQueries[key], (err, results) => {
                if (err) return reject(err);
                contextData[key] = results;
                completed++;
                if (completed === keys.length) resolve(contextData);
            });
        });
    });
};

// ─── AI ENDPOINTS ─────────────────────────────────────────────────────────────

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        // Fetch data and build compact summaries for the chat context
        const data = await getDbData();
        const context = [
            "=== INVENTORY ===",
            buildProductSummary(data.products),
            "=== ORDERS ===",
            buildOrderSummary(data.orders),
            "=== SHIPMENTS ===",
            buildShipmentSummary(data.shipments),
            "=== SUPPLIERS ===",
            buildSupplierSummary(data.suppliers)
        ].join("\n");

        const prompt = `You are an AI assistant for an Inventory & Logistics ERP system.
Use the following live data summary to answer the user's question accurately.
Be concise, helpful, and professional.

${context}

User Question: ${message}`;

        const response = await generateWithFallback(prompt);
        res.json({ reply: response.text });
    } catch (error) {
        handleAIError(error, res);
    }
};

exports.getInsights = async (req, res) => {
    try {
        // Serve from cache if fresh
        if (cache.insights.data && (Date.now() - cache.insights.timestamp < CACHE_TTL)) {
            return res.json({ insights: cache.insights.data });
        }

        const data = await getDbData(["products", "orders"]);
        const context = [
            buildProductSummary(data.products),
            buildOrderSummary(data.orders)
        ].join("\n");

        const prompt = `You are a business analyst for an Inventory & Logistics system.
Based on the following data summary, generate 6 concise and actionable business insights.
Output ONLY a valid JSON array of strings. No markdown, no explanation, just the array.
Example: ["Insight one.", "Insight two."]

DATA:
${context}`;

        const response = await generateWithFallback(prompt);
        let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        let insights = [];
        try {
            insights = JSON.parse(text);
        } catch (e) {
            insights = text.split("\n")
                .filter(line => line.trim().length > 10)
                .map(line => line.replace(/^[\-\•\*\d\.]\s*/, "").replace(/^"/, "").replace(/",$/, "").trim())
                .filter(line => line.length > 5);
        }

        cache.insights.data = insights;
        cache.insights.timestamp = Date.now();
        res.json({ insights });
    } catch (error) {
        handleAIError(error, res);
    }
};

exports.getRestockRecommendations = async (req, res) => {
    try {
        if (cache.restock.data && (Date.now() - cache.restock.timestamp < CACHE_TTL)) {
            return res.json({ recommendations: cache.restock.data });
        }

        db.query("SELECT * FROM products WHERE quantity < 10", async (err, lowStockProducts) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (lowStockProducts.length === 0) return res.json({ recommendations: [] });

            try {
                const data = await getDbData(["orders", "shipments"]);

                // Compact representation of low stock items
                const lowStockSummary = lowStockProducts
                    .map(p => `${p.name || p.product_name}: currentStock=${p.quantity}, price=${p.price}`)
                    .join("\n");

                const prompt = `You are an Inventory Manager AI.
The following products are critically low in stock:
${lowStockSummary}

Order context: ${buildOrderSummary(data.orders)}
Shipment context: ${buildShipmentSummary(data.shipments)}

For each low stock product, recommend a restock quantity with a brief reason.
Output ONLY a valid JSON array (no markdown) with objects having keys:
"productName", "currentStock", "recommendedQuantity", "reasoning"`;

                const response = await generateWithFallback(prompt);
                let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
                let recommendations = [];
                try {
                    recommendations = JSON.parse(text);
                } catch (e) {
                    console.error("JSON parse error for restock:", e.message);
                    recommendations = [];
                }

                cache.restock.data = recommendations;
                cache.restock.timestamp = Date.now();
                res.json({ recommendations });
            } catch (aiError) {
                handleAIError(aiError, res);
            }
        });
    } catch (error) {
        handleAIError(error, res);
    }
};

exports.getReport = async (req, res) => {
    try {
        if (cache.report.data && (Date.now() - cache.report.timestamp < CACHE_TTL)) {
            return res.json({ report: cache.report.data });
        }

        const data = await getDbData();
        const context = [
            "INVENTORY:\n" + buildProductSummary(data.products),
            "ORDERS:\n" + buildOrderSummary(data.orders),
            "SHIPMENTS:\n" + buildShipmentSummary(data.shipments),
            "SUPPLIERS:\n" + buildSupplierSummary(data.suppliers)
        ].join("\n\n");

        const prompt = `You are a Business Intelligence AI for an ERP system.
Write a concise professional business report in Markdown based on this data summary:

${context}

Include these sections:
## 1. Inventory Summary
## 2. Order Summary  
## 3. Shipment Summary
## 4. Low Stock Analysis
## 5. Key Insights
## 6. Recommendations

Be data-driven, specific, and actionable. Keep each section to 3-5 bullet points.`;

        const response = await generateWithFallback(prompt);
        cache.report.data = response.text;
        cache.report.timestamp = Date.now();
        res.json({ report: response.text });
    } catch (error) {
        handleAIError(error, res);
    }
};

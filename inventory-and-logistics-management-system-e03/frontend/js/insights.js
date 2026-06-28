async function generateInsights() {
    const container = document.getElementById("ai-insights-container");
    const btn = document.getElementById("btn-generate-insights");
    if (!container) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-bottom-color:transparent;border-radius:50%;animation:rotation 1s linear infinite;"></span> Generating...`;
    }
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:20px;">⏳ Generating insights... Please wait.</div>`;

    try {
        const res = await fetch("http://localhost:5000/ai/insights");
        const data = await res.json();

        if (!res.ok) {
            const errDetail = data.error || "Failed to load insights";
            throw new Error(errDetail);
        }

        if (data.insights && data.insights.length > 0) {
            renderInsights(container, data.insights, "💡", null);
        } else {
            container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:20px;">No insights available at this time.</div>`;
        }

    } catch (err) {
        console.warn("AI insights failed, using rule-based fallback:", err.message);

        // Detect quota/network errors and show informative banner
        const isQuota = err.message && (err.message.includes("quota") || err.message.includes("429") || err.message.includes("exhausted"));
        const isNetwork = err.message && (err.message.includes("fetch") || err.message.includes("connect") || err.message.includes("500"));

        // Always try rule-based fallback from live data
        try {
            const [prodRes, orderRes, shipRes] = await Promise.all([
                fetch("http://localhost:5000/products"),
                fetch("http://localhost:5000/orders").catch(() => ({ json: () => ([]) })),
                fetch("http://localhost:5000/shipments").catch(() => ({ json: () => ([]) }))
            ]);

            const products = await prodRes.json();
            const orders = await orderRes.json().catch(() => []);
            const shipments = await shipRes.json().catch(() => []);

            // Compute stats
            const lowStockItems  = Array.isArray(products) ? products.filter(p => p.quantity > 0 && p.quantity < 10) : [];
            const outOfStock     = Array.isArray(products) ? products.filter(p => Number(p.quantity) === 0) : [];
            const totalValue     = Array.isArray(products) ? products.reduce((s, p) => s + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0) : 0;
            const totalOrders    = Array.isArray(orders) ? orders.length : 0;
            const pendingOrders  = Array.isArray(orders) ? orders.filter(o => o.status === "Pending").length : 0;
            const inTransit      = Array.isArray(shipments) ? shipments.filter(s => s.status === "In Transit").length : 0;
            const delivered      = Array.isArray(shipments) ? shipments.filter(s => s.status === "Delivered").length : 0;

            const fallbackInsights = [
                `📦 Inventory has ${Array.isArray(products) ? products.length : 0} products with a total estimated value of ₹${totalValue.toFixed(2)}.`,
                lowStockItems.length > 0
                    ? `⚠️ ${lowStockItems.length} product(s) are running low on stock: ${lowStockItems.map(p => p.name).join(", ")}.`
                    : `✅ All products have sufficient stock levels (no items below 10 units).`,
                outOfStock.length > 0
                    ? `🚨 ${outOfStock.length} product(s) are completely out of stock and need urgent restocking.`
                    : `✅ No products are currently out of stock.`,
                totalOrders > 0
                    ? `📋 There are ${totalOrders} total orders — ${pendingOrders} are still pending and need attention.`
                    : `📋 No orders data available at this time.`,
                inTransit > 0 || delivered > 0
                    ? `🚚 Shipments: ${inTransit} in transit, ${delivered} delivered successfully.`
                    : `🚚 No active shipment data found.`,
                lowStockItems.length > 0
                    ? `💡 Recommendation: Prioritize restocking ${lowStockItems[0]?.name} immediately to avoid stockouts.`
                    : `💡 Stock levels are healthy. Continue monitoring for demand changes.`
            ];

            let bannerHtml = "";
            if (isQuota) {
                bannerHtml = `<div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.4);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:14px;color:var(--text-muted);">
                    ⚡ <strong>AI quota reached for today.</strong> Showing rule-based insights from live data instead. AI insights will be available again after the quota resets (every 24 hours).
                </div>`;
            } else if (isNetwork) {
                bannerHtml = `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:14px;color:var(--text-muted);">
                    🔌 <strong>AI service unavailable.</strong> Showing rule-based insights from live data instead.
                </div>`;
            }

            renderInsights(container, fallbackInsights, "📊", bannerHtml);

        } catch (fallbackErr) {
            container.innerHTML = `
                <div style="text-align:center;color:var(--accent-red);padding:20px;">
                    <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
                    <strong>Could not load insights.</strong><br>
                    <span style="color:var(--text-muted);font-size:14px;">${err.message}</span>
                </div>`;
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Generate Insights";
        }
    }
}

function renderInsights(container, insights, icon, bannerHtml) {
    let html = bannerHtml || "";
    html += `<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">`;
    insights.forEach(insight => {
        html += `
            <li style="display:flex;align-items:flex-start;gap:12px;background:var(--bg-card);padding:12px 16px;border-radius:var(--radius-sm);border:1px solid var(--border);">
                <span style="font-size:20px;flex-shrink:0;">${icon}</span>
                <span style="font-size:15px;line-height:1.6;color:var(--text-primary);">${insight}</span>
            </li>`;
    });
    html += `</ul>`;
    container.innerHTML = html;
}

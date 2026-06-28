document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("global-search");
    const resultsContainer = document.getElementById("search-results");
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultsContainer.style.display = "none";
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 400);
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = "none";
        }
    });

    async function performSearch(query) {
        try {
            resultsContainer.style.display = "block";
            resultsContainer.innerHTML = `<div style="padding: 10px; color: var(--text-muted); text-align: center;">Searching...</div>`;

            const res = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            let html = "";
            let totalResults = 0;

            if (data.products && data.products.length > 0) {
                totalResults += data.products.length;
                html += `<div style="padding: 8px 12px; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid var(--border);">📦 Products</div>`;
                data.products.forEach(p => {
                    html += `<a href="inventory.html" style="display: block; padding: 10px 12px; text-decoration: none; color: var(--text-primary); transition: 0.2s;">
                                <div><strong>${p.product_name}</strong></div>
                                <div style="font-size: 13px; color: var(--text-muted);">Stock: ${p.quantity} | ${p.category}</div>
                             </a>`;
                });
            }

            if (data.orders && data.orders.length > 0) {
                totalResults += data.orders.length;
                html += `<div style="padding: 8px 12px; font-weight: bold; color: var(--accent-cyan); border-bottom: 1px solid var(--border); margin-top: 10px;">📋 Orders</div>`;
                data.orders.forEach(o => {
                    html += `<a href="index.html" style="display: block; padding: 10px 12px; text-decoration: none; color: var(--text-primary); transition: 0.2s;">
                                <div><strong>Order #${o.order_id}</strong> - ${o.product_name}</div>
                                <div style="font-size: 13px; color: var(--text-muted);">Qty: ${o.quantity} | Status: ${o.status}</div>
                             </a>`;
                });
            }

            if (data.shipments && data.shipments.length > 0) {
                totalResults += data.shipments.length;
                html += `<div style="padding: 8px 12px; font-weight: bold; color: var(--accent-orange); border-bottom: 1px solid var(--border); margin-top: 10px;">🚚 Shipments</div>`;
                data.shipments.forEach(s => {
                    html += `<a href="shipments.html" style="display: block; padding: 10px 12px; text-decoration: none; color: var(--text-primary); transition: 0.2s;">
                                <div><strong>Shipment #${s.shipment_id}</strong> (Order #${s.order_id})</div>
                                <div style="font-size: 13px; color: var(--text-muted);">Status: ${s.status}</div>
                             </a>`;
                });
            }

            if (data.suppliers && data.suppliers.length > 0) {
                totalResults += data.suppliers.length;
                html += `<div style="padding: 8px 12px; font-weight: bold; color: var(--accent-green); border-bottom: 1px solid var(--border); margin-top: 10px;">🏭 Suppliers</div>`;
                data.suppliers.forEach(s => {
                    html += `<a href="suppliers.html" style="display: block; padding: 10px 12px; text-decoration: none; color: var(--text-primary); transition: 0.2s;">
                                <div><strong>${s.supplier_name}</strong></div>
                                <div style="font-size: 13px; color: var(--text-muted);">Category: ${s.category}</div>
                             </a>`;
                });
            }

            if (totalResults === 0) {
                resultsContainer.innerHTML = `<div style="padding: 15px; color: var(--text-muted); text-align: center;">No results found for "${query}"</div>`;
            } else {
                resultsContainer.innerHTML = html;
            }

        } catch (e) {
            resultsContainer.innerHTML = `<div style="padding: 15px; color: var(--accent-red); text-align: center;">Error performing search.</div>`;
        }
    }
});

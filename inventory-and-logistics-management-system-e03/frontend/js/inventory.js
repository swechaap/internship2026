const API = "https://inventory-and-logistics-management-system.onrender.com";

let products = [];

// ---------- INITIALIZE ----------
document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("product-table-body")) {
        await loadProducts();
    }

    // Event listener for form submission (on Add Product page)
    const addProductForm = document.getElementById("add-product-form");
    if (addProductForm) {
        addProductForm.addEventListener("submit", handleProductFormSubmit);
    }

    // Event listener for search filtering (on Dashboard page)
    const searchInput = document.getElementById("search-product");
    if (searchInput) {
        searchInput.addEventListener("input", renderProducts);
    }
});

// ---------- LOAD PRODUCTS ----------
async function loadProducts() {
    try {
        const res = await fetch(`${API}/products`);
        products = await res.json();

        renderProducts();
        updateStats();

    } catch (err) {
        console.error(err);
        showToast("Failed to load products", "error");
    }
}

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
    const tbody = document.getElementById("product-table-body");
    const search = document.getElementById("search-product").value.toLowerCase();

    let filtered = products;

    if (search) {
        filtered = filtered.filter(product =>
            String(product.product_id).includes(search) ||
            product.product_name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );
    }

    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No products found.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td>${p.product_id}</td>
            <td>${p.product_name}</td>
            <td>${p.category}</td>
            <td>${p.quantity}</td>
            <td>₹${p.price}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.product_id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.product_id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

// ---------- STATS ----------
function updateStats() {
    document.getElementById("stat-products").innerText = products.length;
    document.getElementById("stat-low-stock").innerText = products.filter(p => p.quantity < 5).length;
}

// ---------- MODAL OPERATIONS ----------
function openAddProductModal() {
    document.getElementById("product-id").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-quantity").value = "";
    document.getElementById("product-price").value = "";
    
    document.getElementById("modal-title").innerText = "Add Product";
    document.getElementById("product-modal").style.display = "flex";
}

function closeProductModal() {
    document.getElementById("product-modal").style.display = "none";
}

function editProduct(id) {
    const product = products.find(p => p.product_id == id);
    if (!product) return;

    document.getElementById("product-id").value = product.product_id;
    document.getElementById("product-name").value = product.product_name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-quantity").value = product.quantity;
    document.getElementById("product-price").value = product.price;

    document.getElementById("modal-title").innerText = "Edit Product";
    document.getElementById("product-modal").style.display = "flex";
}

// ---------- FORM SUBMIT (ADD / UPDATE) ----------
async function handleProductFormSubmit(e) {
    e.preventDefault();

    // Support both the new add-product page and any legacy edit modal
    const idEl = document.getElementById("product-id");
    const productId = idEl ? idEl.value : "";
    const name = document.getElementById("product-name").value;
    const category = document.getElementById("product-category").value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const price = parseFloat(document.getElementById("product-price").value);

    const payload = {
        product_name: name,
        category: category,
        quantity: quantity,
        price: price
    };

    try {
        let res;
        if (productId) {
            // Update existing product
            res = await fetch(`${API}/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // Add new product
            res = await fetch(`${API}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();

        if (res.ok) {
            showToast(productId ? "Product updated successfully" : "Product added successfully", "success");
            
            // Redirect back to inventory if on add-product page
            if (!productId && window.location.pathname.includes("add-product.html")) {
                setTimeout(() => {
                    window.location.href = "inventory.html";
                }, 1500);
            } else if (typeof closeProductModal === "function") {
                closeProductModal();
                await loadProducts();
            }
        } else {
            showToast(data.message || "Failed to save product", "error");
        }

    } catch (err) {
        console.error(err);
        showToast("Error saving product", "error");
    }
}

// ---------- DELETE PRODUCT ----------
async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    try {
        const res = await fetch(`${API}/products/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (res.ok) {
            showToast("Product deleted successfully", "success");
            await loadProducts();
        } else {
            showToast(data.message || "Failed to delete product", "error");
        }

    } catch (err) {
        console.error(err);
        showToast("Error deleting product", "error");
    }
}

// ---------- TOAST NOTIFICATIONS ----------
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ---------- AI RESTOCK RECOMMENDATIONS ----------
async function loadRestockRecommendations() {
    const container = document.getElementById("ai-restock-container");
    const btn = document.getElementById("btn-generate-restock");
    if (!container) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span style="display:inline-block; width:12px; height:12px; border:2px solid #fff; border-bottom-color:transparent; border-radius:50%; animation:rotation 1s linear infinite;"></span> Generating...`;
    }
    
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">Generating recommendations... Please wait.</div>`;

    try {
        const res = await fetch(`${API}/ai/restock`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to load recommendations");
        }

        if (data.recommendations && data.recommendations.length > 0) {
            let html = `<div style="display: grid; gap: 16px;">`;
            data.recommendations.forEach(rec => {
                html += `
                    <div style="background: var(--bg-surface); padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="font-size: 18px; color: var(--text-primary);">${rec.productName}</strong>
                            <span class="badge badge-cancelled">Current Stock: ${rec.currentStock}</span>
                        </div>
                        <div style="color: var(--accent-orange); font-weight: bold;">Recommended Restock: ${rec.recommendedQuantity} Units</div>
                        <div style="color: var(--text-muted); font-size: 15px;"><i>Reason: ${rec.reasoning}</i></div>
                    </div>
                `;
            });
            html += `</div>`;
            container.innerHTML = html;
        } else {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">Stock levels are healthy. No immediate restock required.</div>`;
        }
    } catch (err) {
        console.error("Failed to load recommendations:", err);
        
        let fallbackHtml = `<div style="color: var(--accent-red); margin-bottom: 12px; padding: 10px; border-radius: 5px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
            ⚠️ ${err.message}. Showing rule-based recommendations instead.
        </div>`;
        
        const lowStock = products.filter(p => p.quantity < 10);
        if (lowStock.length > 0) {
            fallbackHtml += `<div style="display: grid; gap: 16px;">`;
            lowStock.forEach(p => {
                const status = p.quantity === 0 ? 'Out of Stock' : 'Low Stock';
                const recQty = p.quantity === 0 ? 50 : 20;
                fallbackHtml += `
                    <div style="background: var(--bg-surface); padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="font-size: 18px; color: var(--text-primary);">${p.product_name}</strong>
                            <span class="badge badge-cancelled">Current Stock: ${p.quantity}</span>
                        </div>
                        <div style="color: var(--accent-orange); font-weight: bold;">Recommended Restock: ${recQty} Units</div>
                        <div style="color: var(--text-muted); font-size: 15px;"><i>Reason: Standard replenishment for ${status} items.</i></div>
                    </div>
                `;
            });
            fallbackHtml += `</div>`;
        } else {
            fallbackHtml += `<div style="text-align: center; color: var(--text-muted); padding: 20px;">Stock levels are healthy. No immediate restock required.</div>`;
        }
        
        container.innerHTML = fallbackHtml;
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Generate Recommendations";
        }
    }
}

// ---------- AI INVENTORY HEALTH REPORT ----------
async function generateReport() {
    const modal = document.getElementById("report-modal");
    const content = document.getElementById("report-content");
    const btn = document.querySelector('button[onclick="generateReport()"]');
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span style="display:inline-block; width:12px; height:12px; border:2px solid #fff; border-bottom-color:transparent; border-radius:50%; animation:rotation 1s linear infinite;"></span> Generating...`;
    }

    modal.style.display = "flex";
    content.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px;"><i>Generating comprehensive AI report...</i><br/><br/>Please wait, this may take a few seconds.</div>`;

    try {
        const res = await fetch(`${API}/ai/report`);
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || "Failed to generate report");
        }
        
        if (data.report) {
            // Simple markdown parser for basic bold and headers
            let formattedReport = data.report
                .replace(/^### (.*$)/gim, '<h4>$1</h4>')
                .replace(/^## (.*$)/gim, '<h3>$1</h3>')
                .replace(/^# (.*$)/gim, '<h2>$1</h2>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<i>$1</i>')
                .replace(/\n/gim, '<br/>');
            content.innerHTML = formattedReport;
        } else {
            content.innerHTML = `<div style="color: var(--accent-red);">Failed to generate report content.</div>`;
        }
    } catch (err) {
        console.error("Report generation failed", err);
        content.innerHTML = `<div style="color: var(--accent-red); margin-bottom: 12px; padding: 10px; border-radius: 5px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
            ⚠️ ${err.message}. <br/><br/>
            <strong>Basic Overview:</strong><br/>
            Total Products: ${products.length}<br/>
            Low Stock Alerts: ${products.filter(p => p.quantity < 5).length}
        </div>`;
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "📄 Generate AI Report";
        }
    }
}

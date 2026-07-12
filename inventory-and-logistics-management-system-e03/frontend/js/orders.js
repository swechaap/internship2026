const API = "https://inventory-and-logistics-management-system.onrender.com";

let products = [];
let orders = [];
let currentFilter = "All";

// ---------- INITIALIZE ----------
document.addEventListener("DOMContentLoaded", async () => {
    await loadProducts();
    await loadOrders();
});

// ---------- LOAD PRODUCTS ----------
async function loadProducts() {
    try {
        const res = await fetch(`${API}/products`);
        products = await res.json();

        const select = document.getElementById("product_select");

        select.innerHTML =
            `<option value="">— Select a Product —</option>`;

        products.forEach(product => {
            select.innerHTML += `
                <option value="${product.product_id}">
                    ${product.product_name}
                </option>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

// ---------- PRODUCT SELECT ----------
function onProductSelect() {

    const productId =
        document.getElementById("product_select").value;

    const product =
        products.find(
            p => p.product_id == productId
        );

    if (!product) return;

    document.getElementById("product-preview").style.display =
        "block";

    document.getElementById("pv-category").innerText =
        product.category;

    document.getElementById("pv-price").innerText =
        `₹${product.price}`;

    document.getElementById("pv-stock").innerText =
        product.quantity;

    updateOrderSummary();
}

// ---------- ORDER SUMMARY ----------
function updateOrderSummary() {

    const productId =
        document.getElementById("product_select").value;

    const quantity =
        parseInt(document.getElementById("quantity").value) || 0;

    const product =
        products.find(
            p => p.product_id == productId
        );

    if (!product || quantity <= 0) {
        document.getElementById("order-summary").style.display =
            "none";
        return;
    }

    document.getElementById("order-summary").style.display =
        "block";

    document.getElementById("summary-product").innerText =
        product.product_name;

    document.getElementById("summary-price").innerText =
        `₹${product.price}`;

    document.getElementById("summary-qty").innerText =
        quantity;

    document.getElementById("summary-total").innerText =
        `₹${(product.price * quantity).toFixed(2)}`;
}

// ---------- CREATE ORDER ----------
async function createOrder() {

    const product_id =
        document.getElementById("product_select").value;

    const quantity =
        parseInt(document.getElementById("quantity").value);

    if (!product_id || !quantity) {
        showToast("Select product and quantity", "error");
        return;
    }
    const product =
    products.find(
        p => p.product_id == product_id
    );

if (quantity > product.quantity) {
    showToast(
        `Only ${product.quantity} items available in stock`,
        "error"
    );
    return;
}
    try {

        const res = await fetch(`${API}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id,
                quantity
            })
        });

        const data = await res.json();

        if (data.message?.includes("Successfully")) {

            showToast(
                "Order created successfully",
                "success"
            );

            resetOrderForm();

            await loadProducts();
            await loadOrders();

        } else {
            showToast(
                data.message || "Failed",
                "error"
            );
        }

    } catch (err) {
        console.error(err);
    }
}

// ---------- RESET FORM ----------
function resetOrderForm() {

    document.getElementById("product_select").value = "";
    document.getElementById("quantity").value = "";

    document.getElementById("product-preview").style.display =
        "none";

    document.getElementById("order-summary").style.display =
        "none";
}

// ---------- LOAD ORDERS ----------
async function loadOrders() {

    try {

        const res = await fetch(`${API}/orders`);
        orders = await res.json();

        renderOrders();
        updateStats();

    } catch (err) {
        console.error(err);
    }
}

// ---------- FILTER ----------
function setOrderFilter(filter, btn) {

    currentFilter = filter;

    document
        .querySelectorAll(".filter-tab")
        .forEach(tab =>
            tab.classList.remove("active")
        );

    btn.classList.add("active");

    renderOrders();
}

// ---------- RENDER ----------
function renderOrders() {

    const tbody =
        document.getElementById("ordersTable");

    const search =
        document
        .getElementById("orders-search")
        .value
        .toLowerCase();

    let filtered = orders;

    if (currentFilter !== "All") {
        filtered = filtered.filter(
            o => o.status === currentFilter
        );
    }

    if (search) {

        filtered = filtered.filter(order =>
            String(order.order_id).includes(search) ||
            order.product_name
            .toLowerCase()
            .includes(search)
        );
    }

    tbody.innerHTML = "";

    filtered.forEach(order => {

        const total =
            order.price * order.quantity;

        tbody.innerHTML += `
        <tr>
            <td>#${order.order_id}</td>
            <td>${order.product_name}</td>
            <td>${order.category}</td>
            <td>${order.quantity}</td>
            <td>₹${order.price}</td>
            <td>₹${total.toFixed(2)}</td>
            <td>
                <span class="badge badge-processing">
                    ${order.status}
                </span>
            </td>
        </tr>
        `;
    });

    document.getElementById("orders-count").innerText =
        `${filtered.length} Orders`;
}

// ---------- STATS ----------
function updateStats() {

    document.getElementById(
        "order-stat-total"
    ).innerText = orders.length;

    document.getElementById(
        "order-stat-pending"
    ).innerText =
        orders.filter(
            o => o.status === "Pending"
        ).length;

    document.getElementById(
        "order-stat-delivered"
    ).innerText =
        orders.filter(
            o => o.status === "Delivered"
        ).length;
}

// ---------- TOAST ----------
function showToast(message, type = "success") {

    const container =
        document.getElementById("toast-container");

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
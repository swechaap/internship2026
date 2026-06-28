const API = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    updateDate();
});

function updateDate() {
    const today = new Date();

    document.getElementById("current-date").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

async function loadDashboard() {
    try {

        const [ordersRes, shipmentsRes, notificationsRes] =
            await Promise.all([
                fetch(`${API}/orders`),
                fetch(`${API}/shipments`),
                fetch(`${API}/notifications`)
            ]);

        const orders = await ordersRes.json();
        const shipments = await shipmentsRes.json();
        const notifications = await notificationsRes.json();

        updateStats(orders, shipments, notifications);
        loadRecentOrders(orders);
        loadRecentShipments(shipments);
        loadNotifications(notifications);

    } catch (error) {
        console.error(error);
    }
}

function updateStats(orders, shipments, notifications) {

    document.getElementById("stat-orders").textContent =
        orders.length;

    document.getElementById("stat-shipments").textContent =
        shipments.filter(
            s =>
            s.status === "Processing" ||
            s.status === "In Transit"
        ).length;

    document.getElementById("stat-delivered").textContent =
        shipments.filter(
            s => s.status === "Delivered"
        ).length;

    document.getElementById("stat-alerts").textContent =
        notifications.length;

    document.getElementById("sidebar-notif-count").textContent =
        notifications.length;

    document.getElementById("notif-count-badge").textContent =
        `${notifications.length} alerts`;

    if (notifications.length > 0) {
        document.getElementById("notif-dot").style.display = "block";
    }
}

function loadRecentOrders(orders) {

    const tbody =
        document.getElementById("recent-orders-table");

    tbody.innerHTML = "";

    orders.slice(0, 5).forEach(order => {

        tbody.innerHTML += `
        <tr>
            <td>#${order.order_id}</td>
            <td>${order.product_name}</td>
            <td>${order.quantity}</td>
            <td>
                <span class="badge badge-processing">
                    ${order.status}
                </span>
            </td>
        </tr>
        `;
    });
}

function loadRecentShipments(shipments) {

    const tbody =
        document.getElementById("recent-shipments-table");

    tbody.innerHTML = "";

    shipments.slice(0, 5).forEach(shipment => {

        tbody.innerHTML += `
        <tr>
            <td>#${shipment.shipment_id}</td>
            <td>${shipment.product_name}</td>
            <td>${shipment.status}</td>
            <td>${shipment.delivery_date}</td>
        </tr>
        `;
    });
}

function loadNotifications(notifications) {

    const container =
        document.getElementById("notifications-list");

    if (notifications.length === 0) {
        container.innerHTML =
            `<p>No notifications available.</p>`;
        return;
    }

    container.innerHTML = "";

    notifications.forEach(notification => {

        container.innerHTML += `
        <div class="notification-item">
            <strong>🔔 Alert</strong>
            <p>${notification.message}</p>
            <small>${notification.created_at}</small>
        </div>
        `;
    });

    createAlertBanner(notifications);
}

function createAlertBanner(notifications) {

    const section =
        document.getElementById("alerts-section");

    const lowStock =
        notifications.filter(n =>
            n.message.toLowerCase().includes("low stock")
        );

    if (lowStock.length === 0) {
        section.innerHTML = "";
        return;
    }

    section.innerHTML = `
    <div class="alert-banner">
        ⚠️ ${lowStock.length}
        Low Stock Alerts Require Attention
    </div>
    `;
}

function refreshDashboard() {
    loadDashboard();
}

window.refreshDashboard = refreshDashboard;
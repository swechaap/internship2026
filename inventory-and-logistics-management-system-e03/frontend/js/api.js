const BASE_URL = "http://localhost:5000";

export async function getOrders() {
    const res = await fetch(`${BASE_URL}/orders`);
    return await res.json();
}

export async function createOrder(data) {
    const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

export async function getShipments() {
    const res = await fetch(`${BASE_URL}/shipments`);
    return await res.json();
}

export async function updateShipment(id, data) {
    const res = await fetch(`${BASE_URL}/shipments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

export async function getProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    return await res.json();
}

export async function getNotifications() {
    const res = await fetch(`${BASE_URL}/notifications`);
    return await res.json();
}
const API = "https://inventory-and-logistics-management-system.onrender.com";

let shipmentsData = [];
let currentFilter = "All";

// Load Shipments
async function loadShipments() {
    try {
        const res = await fetch(`${API}/shipments`);
        shipmentsData = await res.json();

        populateShipmentDropdown();
        renderShipments();
        updateStats();
    } catch (err) {
        console.error(err);
    }
}

// Populate Shipment Dropdown
function populateShipmentDropdown() {
    const select = document.getElementById("shipment_select");

    select.innerHTML =
        `<option value="">— Select Shipment ID —</option>`;

    shipmentsData.forEach(ship => {
        select.innerHTML += `
            <option value="${ship.shipment_id}">
                Shipment #${ship.shipment_id}
            </option>
        `;
    });
}

// Shipment Selection
function onShipmentSelect() {
    const id = document.getElementById("shipment_select").value;

    if (!id) return;

    const shipment = shipmentsData.find(
        s => s.shipment_id == id
    );

    if (!shipment) return;

    document.getElementById("sp-order").textContent =
        shipment.order_id;

    document.getElementById("sp-product").textContent =
        shipment.product_name || "-";

    document.getElementById("sp-status").textContent =
        shipment.status;

    document.getElementById("sp-delivery").textContent =
        shipment.delivery_date
            ? shipment.delivery_date.split("T")[0]
            : "-";

    document.getElementById("status").value =
        shipment.status;

    updateTracker(shipment);
}

// Update Tracker
function updateTracker(shipment) {

    document.getElementById("tracker-shipment-id").textContent =
        `Shipment #${shipment.shipment_id}`;

    document.getElementById("tracker-details").style.display =
        "block";

    document.getElementById("tracker-id").textContent =
        shipment.shipment_id;

    document.getElementById("tracker-order").textContent =
        shipment.order_id;

    document.getElementById("tracker-product").textContent =
        shipment.product_name || "-";

    document.getElementById("tracker-delivery").textContent =
        shipment.delivery_date
            ? shipment.delivery_date.split("T")[0]
            : "-";

    const processing =
        document.getElementById("step-processing");

    const transit =
        document.getElementById("step-transit");

    const delivered =
        document.getElementById("step-delivered");

    processing.classList.remove("done");
    transit.classList.remove("done");
    delivered.classList.remove("done");

    if (shipment.status === "Processing") {
        processing.classList.add("done");
    }

    if (shipment.status === "In Transit") {
        processing.classList.add("done");
        transit.classList.add("done");
    }

    if (shipment.status === "Delivered") {
        processing.classList.add("done");
        transit.classList.add("done");
        delivered.classList.add("done");
    }
}

// Status Badge
function getBadge(status) {

    let cls = "badge-processing";

    if (status === "Delivered")
        cls = "badge-delivered";

    if (status === "In Transit")
        cls = "badge-shipped";

    if (status === "Cancelled")
        cls = "badge-cancelled";

    return `<span class="badge ${cls}">${status}</span>`;
}

// Render Table
function renderShipments() {

    const search =
        document.getElementById("shipments-search")
            .value
            .toLowerCase();

    let filtered = shipmentsData.filter(ship => {

        const matchesSearch =
            String(ship.shipment_id).includes(search) ||
            String(ship.order_id).includes(search) ||
            (ship.product_name || "")
                .toLowerCase()
                .includes(search);

        const matchesFilter =
            currentFilter === "All" ||
            ship.status === currentFilter;

        return matchesSearch && matchesFilter;
    });

    let rows = "";

    filtered.forEach(ship => {

        rows += `
        <tr>
            <td>${ship.shipment_id}</td>
            <td>${ship.order_id}</td>
            <td>${ship.product_name || "-"}</td>
            <td>${ship.category || "-"}</td>
            <td>${getBadge(ship.status)}</td>
            <td>
                ${ship.delivery_date
                    ? ship.delivery_date.split("T")[0]
                    : "-"}
            </td>
            <td>
                <button
                    class="btn btn-secondary btn-sm"
                    onclick="quickSelect(${ship.shipment_id})">
                    Select
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("shipmentsTable").innerHTML =
        rows ||
        `<tr><td colspan="7">No shipments found</td></tr>`;

    document.getElementById("shipments-count").textContent =
        `${filtered.length} Shipments`;
}

// Quick Select
function quickSelect(id) {
    document.getElementById("shipment_select").value = id;
    onShipmentSelect();
}

// Filter Tabs
function setShipFilter(filter, btn) {

    currentFilter = filter;

    document
        .querySelectorAll(".filter-tab")
        .forEach(tab =>
            tab.classList.remove("active")
        );

    btn.classList.add("active");

    renderShipments();
}

// Update Shipment
async function updateShipment() {

    const id =
        document.getElementById("shipment_select")
            .value;

    const status =
        document.getElementById("status")
            .value;

    if (!id) {
        alert("Select a shipment first");
        return;
    }

    try {

        const res = await fetch(
            `${API}/shipments/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    status
                })
            }
        );

        const data = await res.json();

        document.getElementById(
            "shipment-msg"
        ).textContent = data.message;

        loadShipments();

    } catch (err) {
        console.error(err);
    }
}

// Reset Form
function resetShipmentForm() {

    document.getElementById(
        "shipment_select"
    ).value = "";

    document.getElementById(
        "shipment-msg"
    ).textContent = "";

    document.getElementById(
        "tracker-details"
    ).style.display = "none";
}

// Stats
function updateStats() {

    document.getElementById(
        "ship-stat-total"
    ).textContent = shipmentsData.length;

    document.getElementById(
        "ship-stat-processing"
    ).textContent =
        shipmentsData.filter(
            s => s.status === "Processing"
        ).length;

    document.getElementById(
        "ship-stat-transit"
    ).textContent =
        shipmentsData.filter(
            s => s.status === "In Transit"
        ).length;

    document.getElementById(
        "ship-stat-delivered"
    ).textContent =
        shipmentsData.filter(
            s => s.status === "Delivered"
        ).length;
}

loadShipments();
document.addEventListener("DOMContentLoaded", () => {
    // Determine which page we are on and load appropriate charts
    if (document.getElementById("inventoryCategoryChart")) {
        loadInventoryCharts();
    }
    if (document.getElementById("ordersStatusChart")) {
        loadOrdersCharts();
    }
    if (document.getElementById("shipmentsStatusChart")) {
        loadShipmentsCharts();
    }
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: 'var(--text-secondary)' }
        }
    },
    scales: {
        x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
};

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { color: 'var(--text-secondary)' }
        }
    }
};

async function loadInventoryCharts() {
    try {
        const res = await fetch("http://localhost:5000/analytics/inventory");
        const data = await res.json();

        if (data.categories) {
            const ctx = document.getElementById("inventoryCategoryChart").getContext("2d");
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.categories.map(c => c.category || 'Uncategorized'),
                    datasets: [{
                        data: data.categories.map(c => c.count),
                        backgroundColor: ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#06b6d4'],
                        borderWidth: 0
                    }]
                },
                options: pieOptions
            });
        }

        if (data.stock) {
            const ctx = document.getElementById("inventoryStockChart").getContext("2d");
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.stock.map(s => s.product_name),
                    datasets: [{
                        label: 'Stock Level',
                        data: data.stock.map(s => s.quantity),
                        backgroundColor: '#6366f1',
                        borderRadius: 4
                    }]
                },
                options: chartOptions
            });
        }
    } catch (e) {
        console.error("Failed to load inventory charts", e);
    }
}

async function loadOrdersCharts() {
    try {
        const res = await fetch("http://localhost:5000/analytics/orders");
        const data = await res.json();

        if (data.status) {
            const ctx = document.getElementById("ordersStatusChart").getContext("2d");
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.status.map(s => s.status),
                    datasets: [{
                        data: data.status.map(s => s.count),
                        backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#6366f1'],
                        borderWidth: 0
                    }]
                },
                options: pieOptions
            });
        }

        if (data.overTime && data.overTime.length > 0) {
            const ctx = document.getElementById("ordersTimeChart").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.overTime.map(o => new Date(o.date).toLocaleDateString()),
                    datasets: [{
                        label: 'Orders Created',
                        data: data.overTime.map(o => o.count),
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: chartOptions
            });
        } else {
             // fallback dummy data if dates aren't present
             const ctx = document.getElementById("ordersTimeChart").getContext("2d");
             new Chart(ctx, {
                 type: 'line',
                 data: {
                     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                     datasets: [{
                         label: 'Orders Created',
                         data: [5, 8, 12, 7, 10, 15, 6],
                         borderColor: '#06b6d4',
                         backgroundColor: 'rgba(6, 182, 212, 0.1)',
                         fill: true,
                         tension: 0.4
                     }]
                 },
                 options: chartOptions
             });
        }
    } catch (e) {
        console.error("Failed to load orders charts", e);
    }
}

async function loadShipmentsCharts() {
    try {
        const res = await fetch("http://localhost:5000/analytics/shipments");
        const data = await res.json();

        if (data.status) {
            const ctx = document.getElementById("shipmentsStatusChart").getContext("2d");
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.status.map(s => s.status),
                    datasets: [{
                        data: data.status.map(s => s.count),
                        backgroundColor: ['#eab308', '#06b6d4', '#6366f1', '#22c55e'],
                        borderWidth: 0
                    }]
                },
                options: pieOptions
            });
        }

        if (data.comparison) {
            const ctx = document.getElementById("shipmentsComparisonChart").getContext("2d");
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.comparison.map(c => c.groupStatus),
                    datasets: [{
                        label: 'Shipments',
                        data: data.comparison.map(c => c.count),
                        backgroundColor: ['#22c55e', '#f97316'],
                        borderRadius: 4
                    }]
                },
                options: chartOptions
            });
        }
    } catch (e) {
        console.error("Failed to load shipments charts", e);
    }
}

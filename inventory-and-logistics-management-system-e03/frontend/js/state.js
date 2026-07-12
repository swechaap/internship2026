// --- STATE MANAGEMENT ---
const API_BASE_URL = 'https://inventory-and-logistics-management-system.onrender.com';
let suppliers = [];
let notifications = [];

// Normalize a supplier from backend DB format → frontend format
function normalizeSupplier(s) {
  return {
    id: s.supplier_id ? String(s.supplier_id) : (s.id || `SUP-${Date.now()}`),
    name: s.supplier_name || s.name || 'Unknown',
    category: s.category || 'General',
    contactPerson: s.contact_person || s.contactPerson || s.contact || '',
    email: s.email || '',
    phone: s.phone || '',
    leadTime: s.lead_time || s.leadTime || 'N/A',
    status: s.status || 'Active',
    rating: parseFloat(s.rating) || 4.0,
    address: s.address || '',
    joiningDate: s.joining_date || s.joiningDate || new Date().toISOString().split('T')[0]
  };
}

// Normalize a notification from backend DB format → frontend format
function normalizeNotification(n) {
  return {
    id: n.notification_id ? String(n.notification_id) : (n.id || `NOT-${Date.now()}`),
    type: n.type || 'info',
    title: n.title || 'Notification',
    message: n.message || '',
    timestamp: n.created_at || n.timestamp || new Date().toISOString(),
    read: n.read === 1 || n.read === true || false
  };
}

// Initialize state from backend API (with mockdata fallback)
async function initializeState() {
  // --- Load Suppliers ---
  try {
    const res = await fetch(`${API_BASE_URL}/suppliers`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const raw = await res.json();
    suppliers = raw.map(normalizeSupplier);
    console.log(`Suppliers loaded from backend API (${suppliers.length} records)`);
  } catch (err) {
    console.error('Failed to load suppliers from backend:', err.message);
    suppliers = [];
  }

  // --- Load Notifications ---
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const raw = await res.json();
    notifications = raw.map(normalizeNotification);
    console.log(`Notifications loaded from backend API (${notifications.length} records)`);
  } catch (err) {
    console.error('Failed to load notifications from backend:', err.message);
    notifications = [];
  }

  // Trigger UI updates after async load completes
  if (typeof renderSupplierList === 'function') renderSupplierList();
  if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
  if (window.location.hash === '#notifications' && typeof renderNotificationsList === 'function') {
    renderNotificationsList();
  }
}

function saveSuppliersToStorage() {
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
}

function saveNotificationsToStorage() {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

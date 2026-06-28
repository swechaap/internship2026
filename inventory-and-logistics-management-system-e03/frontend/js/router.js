// --- ROUTER SYSTEM ---
let routes = {};

function initRouter() {
  const viewTitle = document.getElementById('view-title');
  const viewSuppliers = document.getElementById('view-suppliers');
  const viewAddSupplier = document.getElementById('view-add-supplier');
  const viewNotifications = document.getElementById('view-notifications');
  const navSuppliers = document.getElementById('nav-suppliers');
  const navAddSupplier = document.getElementById('nav-add-supplier');
  const navNotifications = document.getElementById('nav-notifications');

  routes = {
    '#suppliers': {
      panel: viewSuppliers,
      nav: navSuppliers,
      title: 'Suppliers Directory'
    },
    '#add-supplier': {
      panel: viewAddSupplier,
      nav: navAddSupplier,
      title: 'Register New Supplier'
    },
    '#notifications': {
      panel: viewNotifications,
      nav: navNotifications,
      title: 'Alert Notifications'
    }
  };
}

function handleRouting() {
  const currentHash = window.location.hash || '#suppliers';
  const route = routes[currentHash];
  if (!route) {
    window.location.hash = '#suppliers';
    return;
  }
  
  // Deactivate all view panels
  Object.values(routes).forEach(r => {
    if (r.panel) r.panel.classList.remove('active');
    if (r.nav) r.nav.classList.remove('active');
  });
  
  // Activate matching view and nav link
  if (route.panel) route.panel.classList.add('active');
  if (route.nav) route.nav.classList.add('active');
  
  const viewTitle = document.getElementById('view-title');
  if (viewTitle) viewTitle.textContent = route.title;
  
  // Perform view-specific initializations
  if (currentHash === '#suppliers') {
    if (typeof renderSupplierList === 'function') renderSupplierList();
  } else if (currentHash === '#add-supplier') {
    if (typeof resetAddSupplierForm === 'function') resetAddSupplierForm();
  } else if (currentHash === '#notifications') {
    if (typeof renderNotificationsList === 'function') renderNotificationsList();
  }
}

// Listen to Hash Changes
window.addEventListener('hashchange', handleRouting);

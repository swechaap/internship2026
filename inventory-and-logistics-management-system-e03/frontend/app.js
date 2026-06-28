// --- INIT APP CONTROLS ---
function initApp() {
  // Initialize state (state.js)
  initializeState();
  
  // Initialize router configurations (router.js)
  initRouter();
  
  // Set up notifications & badges (notifications.js)
  updateNotificationBadge();
  setupNotificationListeners();
  setupNotificationTabs();
  
  // Set up form rating widget & validation (form.js)
  setupRatingStars();
  initRealtimeValidation();
  setupFormListeners();
  
  // Wire dynamic redirection clicks
  const btnGotoAddSupplier = document.getElementById('btn-goto-add-supplier');
  const headerBellBtn = document.getElementById('header-bell-btn');
  const searchInput = document.getElementById('search-input');
  const filterCategory = document.getElementById('filter-category');
  const filterStatus = document.getElementById('filter-status');
  
  if (btnGotoAddSupplier) {
    btnGotoAddSupplier.addEventListener('click', () => {
      window.location.hash = '#add-supplier';
    });
  }
  
  if (headerBellBtn) {
    headerBellBtn.addEventListener('click', () => {
      window.location.hash = '#notifications';
    });
  }
  
  // Table control search and filter actions
  if (searchInput) searchInput.addEventListener('input', renderSupplierList);
  if (filterCategory) filterCategory.addEventListener('change', renderSupplierList);
  if (filterStatus) filterStatus.addEventListener('change', renderSupplierList);
  
  // Trigger initial routing
  handleRouting();
}

// Boot the application
document.addEventListener('DOMContentLoaded', initApp);

window.addEventListener('load', () => {
  // If loaded with a hash already set, initialize state and trigger route
  if (window.location.hash) {
    handleRouting();
  }
});
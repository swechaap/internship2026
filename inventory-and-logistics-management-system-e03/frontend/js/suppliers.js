// --- SUPPLIERS logic ---
function renderSupplierList() {
  const searchInput = document.getElementById('search-input');
  const filterCategory = document.getElementById('filter-category');
  const filterStatus = document.getElementById('filter-status');
  const supplierListTbody = document.getElementById('supplier-list-tbody');
  const supplierTableEl = document.getElementById('supplier-table-el');
  const tableEmptyState = document.getElementById('table-empty-state');

  if (!supplierListTbody || !supplierTableEl || !tableEmptyState) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCat = filterCategory ? filterCategory.value : '';
  const selectedStat = filterStatus ? filterStatus.value : '';
  
  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = 
      sup.name.toLowerCase().includes(query) ||
      sup.id.toLowerCase().includes(query) ||
      sup.contactPerson.toLowerCase().includes(query) ||
      sup.email.toLowerCase().includes(query);
    const matchesCategory = !selectedCat || sup.category === selectedCat;
    const matchesStatus = !selectedStat || sup.status === selectedStat;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  supplierListTbody.innerHTML = '';
  
  if (filteredSuppliers.length === 0) {
    supplierTableEl.style.display = 'none';
    tableEmptyState.style.display = 'block';
    return;
  }
  
  supplierTableEl.style.display = 'table';
  tableEmptyState.style.display = 'none';
  
  filteredSuppliers.forEach(sup => {
    const tr = document.createElement('tr');
    
    // Status badges mapping
    let statusClass = 'status-active';
    if (sup.status === 'Inactive') statusClass = 'status-inactive';
    if (sup.status === 'Pending Approval') statusClass = 'status-pending';
    
    // Stars rating mapping
    let ratingStarsHtml = '';
    const fullStars = Math.floor(sup.rating);
    const hasHalf = sup.rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        ratingStarsHtml += `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      } else if (i === fullStars + 1 && hasHalf) {
        ratingStarsHtml += `<svg viewBox="0 0 24 24" style="opacity: 0.6;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      } else {
        ratingStarsHtml += `<svg viewBox="0 0 24 24" style="fill: rgba(255,255,255,0.08); stroke: var(--text-dim);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }
    }
    
    tr.innerHTML = `
      <td>
        <div class="supplier-meta">
          <span class="supplier-name">${escapeHTML(sup.name)}</span>
          <span class="supplier-id">${escapeHTML(sup.id)}</span>
        </div>
      </td>
      <td>
        <span class="badge-category">${escapeHTML(sup.category)}</span>
      </td>
      <td>
        <div class="supplier-meta">
          <span style="font-weight: 500;">${escapeHTML(sup.contactPerson)}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHTML(sup.email)}</span>
        </div>
      </td>
      <td><span style="font-weight: 500;">${escapeHTML(sup.leadTime)}</span></td>
      <td>
        <div class="rating-stars" title="Rating: ${sup.rating} / 5.0">
          ${ratingStarsHtml}
          <span class="rating-value">${parseFloat(sup.rating).toFixed(1)}</span>
        </div>
      </td>
      <td>
        <span class="badge-status ${statusClass}">${escapeHTML(sup.status)}</span>
      </td>
      <td style="text-align: center;">
        <div class="table-actions">
          <button class="btn-icon edit" data-id="${sup.id}" title="Toggle status to Active/Inactive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </button>
          <button class="btn-icon delete" data-id="${sup.id}" title="Delete Supplier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </td>
    `;
    
    // Hook up delete supplier action
    tr.querySelector('.btn-icon.delete').addEventListener('click', () => {
      deleteSupplier(sup.id);
    });
    
    // Hook up toggle status edit action
    tr.querySelector('.btn-icon.edit').addEventListener('click', () => {
      toggleSupplierStatus(sup.id);
    });
    
    supplierListTbody.appendChild(tr);
  });
}

async function deleteSupplier(id) {
  const supplierIndex = suppliers.findIndex(s => s.id === id);
  if (supplierIndex !== -1) {
    const deletedName = suppliers[supplierIndex].name;
    
    try {
      const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      console.log(`Deleted supplier ${id} on backend`);
    } catch (err) {
      console.warn(`Failed to delete supplier ${id} on backend, local action only:`, err);
    }

    suppliers.splice(supplierIndex, 1);
    saveSuppliersToStorage();
    renderSupplierList();
    if (typeof showToast === 'function') showToast(`Supplier ${deletedName} deleted successfully.`, 'success');
    if (typeof spawnNotification === 'function') {
      spawnNotification('warning', 'Supplier Deregistered', `Supplier "${deletedName}" (${id}) was removed from the directory.`);
    }
  }
}

async function toggleSupplierStatus(id) {
  const supplier = suppliers.find(s => s.id === id);
  if (supplier) {
    const oldStatus = supplier.status;
    let newStatus = 'Active';
    if (oldStatus === 'Active') {
      newStatus = 'Inactive';
    } else if (oldStatus === 'Inactive') {
      newStatus = 'Pending Approval';
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/suppliers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      console.log(`Updated supplier ${id} status to ${newStatus} on backend`);
    } catch (err) {
      console.warn(`Failed to update supplier status on backend, local action only:`, err);
    }

    supplier.status = newStatus;
    saveSuppliersToStorage();
    renderSupplierList();
    if (typeof showToast === 'function') showToast(`${supplier.name} status updated to ${newStatus}.`, 'info');
    if (typeof spawnNotification === 'function') {
      spawnNotification('info', 'Status Updated', `Supplier "${supplier.name}" onboarding status changed from "${oldStatus}" to "${newStatus}".`);
    }
  }
}

// Helper to escape HTML characters
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

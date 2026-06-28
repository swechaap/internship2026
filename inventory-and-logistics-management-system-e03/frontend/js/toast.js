// --- TOAST SYSTEM ---
function showToast(message, type = 'success') {
  // Look up lazily so this always works regardless of script load order
  const toastOutlet = document.getElementById('toast-outlet');
  if (!toastOutlet) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  if (type === 'success') {
    icon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-active)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'info') {
    icon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-info)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  } else if (type === 'error') {
    icon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-inactive)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }
  
  toast.innerHTML = `
    ${icon}
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;
  
  toastOutlet.appendChild(toast);
  
  // Auto remove toast
  setTimeout(() => {
    toast.classList.add('slide-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

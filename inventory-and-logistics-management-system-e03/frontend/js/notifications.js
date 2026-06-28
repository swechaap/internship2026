// --- NOTIFICATIONS logic ---
let activeNotificationTab = 'all'; // 'all', 'unread', 'critical'

function updateNotificationBadge() {
  const bellBadge = document.getElementById('bell-badge');
  if (!bellBadge) return;

  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    bellBadge.classList.add('active');
    bellBadge.setAttribute('title', `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`);
  } else {
    bellBadge.classList.remove('active');
  }
}

// Add system notifications dynamically
async function spawnNotification(type, title, message) {
  let newNoti = null;
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, message })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    newNoti = await res.json();
    console.log('Notification spawned on backend:', newNoti);
  } catch (err) {
    console.warn('Failed to spawn notification on backend, using local fallback:', err);
    newNoti = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
  }
  
  notifications.unshift(newNoti);
  saveNotificationsToStorage();
  updateNotificationBadge();
  
  let toastType = 'info';
  if (type === 'critical') toastType = 'error';
  else if (type === 'success') toastType = 'success';
  
  if (typeof showToast === 'function') {
    showToast(`${title}: ${message.slice(0, 45)}...`, toastType);
  }
  
  if (window.location.hash === '#notifications') {
    renderNotificationsList();
  }
}

function renderNotificationsList() {
  const notificationsListContainer = document.getElementById('notifications-list-container');
  const notificationsEmptyState = document.getElementById('notifications-empty-state');
  if (!notificationsListContainer || !notificationsEmptyState) return;

  let filteredNotis = [...notifications];
  if (activeNotificationTab === 'unread') {
    filteredNotis = notifications.filter(n => !n.read);
  } else if (activeNotificationTab === 'critical') {
    filteredNotis = notifications.filter(n => n.type === 'critical');
  }
  
  notificationsListContainer.innerHTML = '';
  
  if (filteredNotis.length === 0) {
    notificationsEmptyState.style.display = 'block';
    return;
  }
  
  notificationsEmptyState.style.display = 'none';
  
  filteredNotis.forEach(noti => {
    const card = document.createElement('div');
    card.className = `notification-card type-${noti.type} ${noti.read ? 'read' : 'unread'}`;
    
    // Choose SVG icon depending on notification type
    let iconSvg = '';
    if (noti.type === 'critical') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (noti.type === 'warning') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (noti.type === 'success') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    // Format Timestamp
    const dateObj = new Date(noti.timestamp);
    const formattedTime = dateObj.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    card.innerHTML = `
      <div class="noti-icon-wrapper">
        ${iconSvg}
      </div>
      <div class="noti-content">
        <div class="noti-header">
          <h4 class="noti-title">${escapeHTML(noti.title)}</h4>
          <span class="noti-time">${formattedTime}</span>
        </div>
        <p class="noti-message">${escapeHTML(noti.message)}</p>
        <div class="noti-actions">
          ${!noti.read ? `<button class="btn-text mark-read" data-id="${noti.id}">Mark as read</button>` : ''}
          <button class="btn-text delete-noti" data-id="${noti.id}">Clear alert</button>
        </div>
      </div>
    `;
    
    // Wire up events
    const markReadBtn = card.querySelector('.mark-read');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        markNotificationAsRead(noti.id);
      });
    }
    
    card.querySelector('.delete-noti').addEventListener('click', () => {
      deleteNotification(noti.id);
    });
    
    notificationsListContainer.appendChild(card);
  });
}

async function markNotificationAsRead(id) {
  const noti = notifications.find(n => n.id === id);
  if (noti) {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      console.log(`Marked notification ${id} as read on backend`);
    } catch (err) {
      console.warn(`Failed to mark notification ${id} as read on backend:`, err);
    }
    noti.read = true;
    saveNotificationsToStorage();
    updateNotificationBadge();
    renderNotificationsList();
  }
}

async function deleteNotification(id) {
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      console.log(`Deleted notification ${id} on backend`);
    } catch (err) {
      console.warn(`Failed to delete notification ${id} on backend:`, err);
    }
    notifications.splice(index, 1);
    saveNotificationsToStorage();
    updateNotificationBadge();
    renderNotificationsList();
  }
}

function setupNotificationListeners() {
  const btnMarkAllRead = document.getElementById('btn-mark-all-read');
  if (btnMarkAllRead) {
    btnMarkAllRead.addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
          method: 'PATCH'
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log('Marked all notifications as read on backend');
      } catch (err) {
        console.warn('Failed to mark all notifications as read on backend:', err);
      }
      notifications.forEach(n => n.read = true);
      saveNotificationsToStorage();
      updateNotificationBadge();
      renderNotificationsList();
      if (typeof showToast === 'function') showToast('All notifications marked as read.', 'success');
    });
  }
}

// Notifications Tab Event Listeners
function setupNotificationTabs() {
  const notiTabAll = document.getElementById('noti-tab-all');
  const notiTabUnread = document.getElementById('noti-tab-unread');
  const notiTabCritical = document.getElementById('noti-tab-critical');

  if (!notiTabAll || !notiTabUnread || !notiTabCritical) return;

  const tabs = [
    { btn: notiTabAll, tabName: 'all' },
    { btn: notiTabUnread, tabName: 'unread' },
    { btn: notiTabCritical, tabName: 'critical' }
  ];
  
  tabs.forEach(t => {
    t.btn.addEventListener('click', () => {
      tabs.forEach(item => item.btn.classList.remove('active'));
      t.btn.classList.add('active');
      activeNotificationTab = t.tabName;
      renderNotificationsList();
    });
  });
}

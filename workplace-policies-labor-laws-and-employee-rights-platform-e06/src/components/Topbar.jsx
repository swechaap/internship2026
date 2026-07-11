import React from 'react';
import Icon from './Icon';
import NotificationPanel from './NotificationPanel';
import { NAV_ITEMS } from './Sidebar';

export const Topbar = ({
  dark,
  setDark,
  active,
  setMobileOpen,
  notifications,
  notifOpen,
  setNotifOpen,
  onMarkAllRead,
  onNav,
  onNotificationClick,
  avatar,
  employee,
}) => {
  const unreadCount = notifications.filter((n) => n.unread).length;
  const currentLabel = NAV_ITEMS.find((n) => n.id === active)?.label || 'Home';
  
  const initials = employee?.initials || '??';

  return (
    <header
      className="fixed top-0 left-0 lg:left-[232px] right-0 z-50 glass shadow-sm"
      style={{ borderBottom: '1px solid var(--line)' }}
    >
      <div className="px-4 md:px-7 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden focus-ring w-9 h-9 rounded-full flex items-center justify-center border shrink-0"
            style={{ borderColor: 'var(--line)' }}
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="panelLeft" size={17} style={{ color: 'var(--ink)' }} />
          </button>
          <h1 className="font-display font-semibold text-[16px] md:text-[18px] truncate" style={{ color: 'var(--ink)' }}>
            {currentLabel}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Notifications"
              className="focus-ring relative w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <Icon name="bell" size={16} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: 'var(--coral)', color: '#fff' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onNotificationClick={onNotificationClick}
            />
          </div>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="focus-ring w-9 h-9 rounded-full flex items-center justify-center border"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            <Icon name={dark ? 'sun' : 'moon'} size={16} />
          </button>
          <button
            onClick={() => onNav('profile')}
            className="focus-ring w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-[12.5px] overflow-hidden"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            aria-label="Profile"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

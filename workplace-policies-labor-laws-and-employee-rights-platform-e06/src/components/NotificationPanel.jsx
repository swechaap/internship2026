import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import { IconBadge } from './IconBadge';

export const NotificationPanel = ({ open, onClose, notifications, onMarkAllRead, onNotificationClick }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70]"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-[64px] right-4 md:right-6 z-[70] w-[min(380px,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto rounded-2xl shadow-xl border"
          style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
              Notifications
            </h4>
            <button onClick={onMarkAllRead} className="focus-ring text-[11.5px] font-semibold" style={{ color: 'var(--coral)' }}>
              Mark all read
            </button>
          </div>
          <div>
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs" style={{ color: 'var(--stone)' }}>
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onNotificationClick && onNotificationClick(n)}
                  className="focus-ring w-full flex gap-3 px-5 py-4 text-left transition-colors hover:brightness-95"
                  style={{
                    borderBottom: '1px solid var(--line)',
                    background: n.unread ? 'var(--paper-deep)' : 'transparent',
                  }}
                >
                  <IconBadge icon={n.icon} color={n.color} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
                      {n.title}
                    </div>
                    <div className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'var(--ink-soft)' }}>
                      {n.body}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--stone)' }}>
                        {n.time}
                      </span>
                      {n.target && (
                        <span className="text-[10.5px] font-semibold flex items-center gap-0.5" style={{ color: 'var(--coral)' }}>
                          View <Icon name="chevronRight" size={11} />
                        </span>
                      )}
                    </div>
                  </div>
                  {n.unread && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--coral)' }} />}
                </button>
              ))
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default NotificationPanel;

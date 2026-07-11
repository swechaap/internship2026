import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'finder', label: 'Rights Finder', icon: 'search' },
  { id: 'laws', label: 'Labour Laws', icon: 'scale' },
  { id: 'policies', label: 'Policies', icon: 'fileText' },
  { id: 'complaints', label: 'Complaints', icon: 'flag' },
  { id: 'dashboard', label: 'Dashboard', icon: 'activity' },
];

const SidebarContent = ({ active, onNav, collapsed }) => (
  <>
    <button onClick={() => onNav('home')} className="flex items-center gap-2.5 focus-ring rounded-lg px-1 mb-8">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--ink)' }}>
        <Icon name="compass" size={18} className="text-white" strokeWidth={2} />
      </div>
      {!collapsed && (
        <span className="font-display font-semibold text-[16px] whitespace-nowrap" style={{ color: 'var(--ink)' }}>
          WorkRights<span style={{ color: 'var(--coral)' }}>Hub</span>
        </span>
      )}
    </button>
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="focus-ring w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors"
            style={{
              background: isActive ? 'var(--coral-soft)' : 'transparent',
              color: isActive ? 'var(--coral)' : 'var(--ink-soft)',
            }}
          >
            <Icon name={item.icon} size={18} strokeWidth={isActive ? 2.1 : 1.8} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  </>
);

export const Sidebar = ({ active, onNav, mobileOpen, setMobileOpen }) => (
  <>
    {/* Desktop fixed sidebar */}
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[232px] px-4 py-6 z-40"
      style={{ background: 'var(--card)', borderRight: '1px solid var(--line)' }}
    >
      <SidebarContent active={active} onNav={onNav} collapsed={false} />
    </aside>

    {/* Mobile drawer */}
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed top-0 left-0 h-screen w-[240px] px-4 py-6 z-[65]"
            style={{ background: 'var(--card)', borderRight: '1px solid var(--line)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--stone)' }}>
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="focus-ring p-1.5 rounded-full"
                style={{ color: 'var(--stone)' }}
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <SidebarContent
              active={active}
              onNav={(id) => {
                onNav(id);
                setMobileOpen(false);
              }}
              collapsed={false}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;

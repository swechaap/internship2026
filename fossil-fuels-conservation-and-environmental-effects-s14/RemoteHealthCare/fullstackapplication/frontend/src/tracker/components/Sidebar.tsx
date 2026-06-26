import type { AppSection } from '../types';
import './Sidebar.css';

interface SidebarProps {
  activeSection: AppSection;
  onSelect: (section: AppSection) => void;
  open: boolean;
  onClose: () => void;
}

const items: Array<{ id: AppSection; label: string; description: string }> = [
  { id: 'dashboard', label: 'Ambulance Dashboard', description: 'Fleet and emergency summary' },
  { id: 'tracking', label: 'Live Tracking', description: 'GPS route and updates' },
  { id: 'requests', label: 'Emergency Requests', description: 'Assignment and status control' },
  { id: 'ambulances', label: 'Ambulance Management', description: 'CRUD and search' },
];

export function Sidebar({ activeSection, onSelect, open, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <div>
          <p className="sidebar__eyebrow">Emergency UI</p>
          <h1 className="sidebar__title">Ambulance Tracking Module</h1>
        </div>
        <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close navigation">
          ×
        </button>
      </div>

      <div className="sidebar__note">
        <strong>Live control center</strong>
        <span>OpenStreetMap, WebSocket sync, and emergency dispatch tools in one place.</span>
      </div>

      <nav className="sidebar__nav" aria-label="Module navigation">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__nav-item ${activeSection === item.id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="sidebar__nav-label">{item.label}</span>
            <span className="sidebar__nav-description">{item.description}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

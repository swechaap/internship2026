import React from 'react';
import { colorVar } from './IconBadge';

export const Pill = ({ children, active, onClick, color }) => (
  <button
    onClick={onClick}
    className="focus-ring px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
    style={
      active
        ? { background: colorVar(color || 'coral'), color: '#fff', borderColor: colorVar(color || 'coral') }
        : { background: 'var(--card)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }
    }
  >
    {children}
  </button>
);

export default Pill;

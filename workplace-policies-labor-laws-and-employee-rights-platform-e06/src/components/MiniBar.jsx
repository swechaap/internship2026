import React from 'react';
import { motion } from 'framer-motion';
import { colorVar } from './IconBadge';

export const MiniBar = ({ value, max, color }) => (
  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--paper-deep)' }}>
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full rounded-full"
      style={{ background: colorVar(color) }}
    />
  </div>
);

export default MiniBar;

import React from 'react';
import { motion } from 'framer-motion';
import IconBadge from './IconBadge';

export const FloatCard = ({ icon, label, sub, color, style, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="absolute flex items-center gap-3 bg-white/70 dark:bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg select-none"
    style={{ ...style, width: 'fit-content' }}
  >
    <IconBadge icon={icon} color={color} size={38} />
    <div>
      <div className="text-[12px] font-bold" style={{ color: 'var(--ink)' }}>
        {label}
      </div>
      <div className="text-[10px]" style={{ color: 'var(--stone)' }}>
        {sub}
      </div>
    </div>
  </motion.div>
);

export default FloatCard;

import React from 'react';
export default function GlassCard({ children, className = '', ...props }) {
  return (
    <section className={`glass-card ${className}`} {...props}>
      {children}
    </section>
  );
}


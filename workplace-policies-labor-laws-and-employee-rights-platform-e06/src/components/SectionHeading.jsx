import React from 'react';
import Icon from './Icon';

export const Eyebrow = ({ children, icon }) => (
  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--coral)' }}>
    {icon && <Icon name={icon} size={15} strokeWidth={2.2} />}
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium">{children}</span>
  </div>
);

export const SectionHeading = ({ eyebrow, eyebrowIcon, title, sub, align = 'left' }) => (
  <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} mb-10 md:mb-14`}>
    {eyebrow && (
      <div className={align === 'center' ? 'flex justify-center' : ''}>
        <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
      </div>
    )}
    <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.08] font-semibold" style={{ color: 'var(--ink)' }}>
      {title}
    </h2>
    {sub && (
      <p className="mt-4 text-[15px] md:text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {sub}
      </p>
    )}
  </div>
);

export default SectionHeading;

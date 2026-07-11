import React from 'react';
import Icon from './Icon';

export const colorVar = (c) =>
  c === 'coral'
    ? 'var(--coral)'
    : c === 'teal'
    ? 'var(--teal)'
    : c === 'blue'
    ? 'var(--blue)'
    : c === 'purple'
    ? 'var(--purple)'
    : c === 'stone'
    ? 'var(--stone)'
    : 'var(--ink)';

export const colorSoft = (c) =>
  c === 'coral'
    ? 'var(--coral-soft)'
    : c === 'teal'
    ? 'var(--teal-soft)'
    : c === 'blue'
    ? 'var(--blue-soft)'
    : c === 'purple'
    ? 'var(--purple-soft)'
    : 'var(--paper-deep)';

export const IconBadge = ({ icon, color = 'ink', size = 44 }) => (
  <div
    className="rounded-2xl flex items-center justify-center shrink-0"
    style={{ width: size, height: size, background: colorSoft(color), color: colorVar(color) }}
  >
    <Icon name={icon} size={size * 0.46} strokeWidth={1.8} />
  </div>
);

export default IconBadge;

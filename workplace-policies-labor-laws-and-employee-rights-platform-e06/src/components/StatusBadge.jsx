import React from 'react';
import { colorVar, colorSoft } from './IconBadge';

export const STAGES = ['Submitted', 'Under Review', 'Investigation', 'Resolved'];

export const STAGE_COLOR = (stage) =>
  stage >= 3 ? 'teal' : stage === 2 ? 'purple' : stage === 1 ? 'coral' : 'blue';

export const StatusBadge = ({ stage }) => {
  const label = STAGES[stage] || 'Submitted';
  const color = STAGE_COLOR(stage);
  return (
    <span
      className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider select-none shrink-0"
      style={{ background: colorSoft(color), color: colorVar(color) }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;

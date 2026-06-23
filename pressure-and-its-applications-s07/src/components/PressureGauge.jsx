import React from 'react';
import { clamp, formatNumber } from '../utils/physics.js';

export default function PressureGauge({ value = 0, max = 100, label = 'Pressure', unit = 'kPa' }) {
  const percent = clamp((value / max) * 100, 0, 100);
  const angle = -130 + (percent / 100) * 260;

  return (
    <div className="gauge-wrap" aria-label={`${label}: ${formatNumber(value)} ${unit}`}>
      <div className="gauge">
        <div className="gauge-glow" />
        <div className="gauge-arc" />
        <div className="gauge-needle" style={{ transform: `rotate(${angle}deg)` }} />
        <div className="gauge-hub" />
        <div className="gauge-readout">
          <strong>{formatNumber(value)}</strong>
          <span>{unit}</span>
        </div>
      </div>
      <p>{label}</p>
    </div>
  );
}


import React from 'react';
import { useMemo, useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';
import { formatNumber, pressure } from '../utils/physics.js';

const options = {
  heel: {
    label: 'High Heel',
    emoji: '👠',
    area: 0.9,
    description: 'Tiny contact area creates intense pressure points.'
  },
  shoe: {
    label: 'Sports Shoe',
    emoji: '👟',
    area: 9.5,
    description: 'Large sole area spreads force and reduces pressure.'
  }
};

export default function FootwearPressure() {
  const [mode, setMode] = useState('heel');
  const [bodyForce, setBodyForce] = useState(650);
  const active = options[mode];
  const pressureValue = useMemo(() => pressure(bodyForce, active.area), [bodyForce, active.area]);

  return (
    <GlassCard className="simulation-card footwear-card">
      <div className="sim-header">
        <div>
          <span className="sim-tag">Simulation 05</span>
          <h3>High Heels vs Sports Shoes</h3>
        </div>
        <PressureGauge value={pressureValue} max={900} label="Ground Pressure" unit="Pa" />
      </div>

      <div className="footwear-stage">
        <div className={`pressure-pad ${mode}`}>
          <div className="footwear-icon">{active.emoji}</div>
          <div className="heatmap">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="footwear-info">
          <h4>{active.label}</h4>
          <p>{active.description}</p>
          <div className="stat-grid compact">
            <div><span>Force</span><strong>{bodyForce} N</strong></div>
            <div><span>Area</span><strong>{active.area} m²</strong></div>
            <div><span>Pressure</span><strong>{formatNumber(pressureValue)} Pa</strong></div>
          </div>
        </div>
      </div>

      <label className="control-row">
        <span>Body Force: <strong>{bodyForce} N</strong></span>
        <input type="range" min="400" max="900" value={bodyForce} onChange={(event) => setBodyForce(Number(event.target.value))} />
      </label>

      <div className="sim-controls two-col">
        <button className={mode === 'heel' ? 'active-button' : ''} onClick={() => setMode('heel')}>High Heel</button>
        <button className={mode === 'shoe' ? 'active-button' : ''} onClick={() => setMode('shoe')}>Sports Shoe</button>
      </div>

      <p className="sim-explain">Pressure becomes high when the same body weight acts through a smaller contact area.</p>
    </GlassCard>
  );
}


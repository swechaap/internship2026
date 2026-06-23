import React from 'react';
import { useMemo, useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';
import { formatNumber, pressure } from '../utils/physics.js';

export default function KnifePressure() {
  const [force, setForce] = useState(90);
  const sharpPressure = useMemo(() => pressure(force, 0.08), [force]);
  const bluntPressure = useMemo(() => pressure(force, 0.55), [force]);
  const sharpCut = sharpPressure > 700;
  const bluntCut = bluntPressure > 700;

  return (
    <GlassCard className="simulation-card knife-card">
      <div className="sim-header">
        <div>
          <span className="sim-tag">Simulation 04</span>
          <h3>Sharp vs Blunt Knife</h3>
        </div>
        <PressureGauge value={sharpPressure} max={1500} label="Sharp Blade" unit="Pa" />
      </div>

      <div className="knife-stage">
        <div className="knife-demo">
          <div className="knife sharp" style={{ transform: `translateY(${force / 10}px)` }} />
          <div className={sharpCut ? 'vegetable sliced' : 'vegetable'}>
            <span />
          </div>
          <strong>Sharp Knife</strong>
          <small>{formatNumber(sharpPressure, 0)} Pa</small>
        </div>

        <div className="knife-demo">
          <div className="knife blunt" style={{ transform: `translateY(${force / 18}px)` }} />
          <div className={bluntCut ? 'vegetable sliced' : 'vegetable bruised'}>
            <span />
          </div>
          <strong>Blunt Knife</strong>
          <small>{formatNumber(bluntPressure, 0)} Pa</small>
        </div>
      </div>

      <label className="control-row">
        <span>Same Applied Force: <strong>{force} N</strong></span>
        <input type="range" min="30" max="130" value={force} onChange={(event) => setForce(Number(event.target.value))} />
      </label>

      <div className="mini-stats">
        <span>Sharp Area <strong>0.08 m²</strong></span>
        <span>Blunt Area <strong>0.55 m²</strong></span>
      </div>
      <p className="sim-explain">A sharp blade concentrates the same force into a tiny area, creating much higher pressure.</p>
    </GlassCard>
  );
}


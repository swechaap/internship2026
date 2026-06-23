import React from 'react';
import { useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';

export default function PneumaticPiston() {
  const [pressure, setPressure] = useState(55);
  const [active, setActive] = useState(true);
  const speed = Math.max(0.75, 3.6 - pressure / 35);

  return (
    <GlassCard className="simulation-card pneumatic-card">
      <div className="sim-header">
        <div>
          <span className="sim-tag">Simulation 03</span>
          <h3>Pneumatic Piston System</h3>
        </div>
        <PressureGauge value={pressure} max={120} label="Air Pressure" unit="kPa" />
      </div>

      <div className="pneumatic-stage">
        <div className="compressor">
          <span />
          <small>Air Tank</small>
        </div>
        <div className="air-pipe">
          {Array.from({ length: 9 }).map((_, index) => (
            <i key={index} style={{ animationDuration: `${speed}s`, animationDelay: `${index * 0.18}s` }} />
          ))}
        </div>
        <div className="cylinder">
          <div
            className={active ? 'piston active' : 'piston'}
            style={{ '--piston-speed': `${speed}s`, '--piston-distance': `${80 + pressure * 0.6}px` }}
          />
        </div>
      </div>

      <label className="control-row">
        <span>Air Pressure: <strong>{pressure} kPa</strong></span>
        <input type="range" min="20" max="110" value={pressure} onChange={(event) => setPressure(Number(event.target.value))} />
      </label>

      <div className="sim-controls two-col">
        <button onClick={() => setActive(true)}>Start Piston</button>
        <button onClick={() => setActive(false)}>Stop Piston</button>
      </div>

      <div className="mini-stats">
        <span>Status <strong>{active ? 'Running' : 'Stopped'}</strong></span>
        <span>Motion Speed <strong>{pressure > 80 ? 'Fast' : pressure > 45 ? 'Medium' : 'Slow'}</strong></span>
      </div>
      <p className="sim-explain">Pneumatics use compressed air pressure to create clean, fast, repeated mechanical motion.</p>
    </GlassCard>
  );
}


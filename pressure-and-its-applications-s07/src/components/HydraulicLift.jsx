import React from 'react';
import { useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';
import { formatNumber } from '../utils/physics.js';

export default function HydraulicLift() {
  const [height, setHeight] = useState(36);
  const [pressure, setPressure] = useState(42);

  function lift() {
    setHeight((current) => Math.min(current + 18, 156));
    setPressure((current) => Math.min(current + 10, 120));
  }

  function lower() {
    setHeight((current) => Math.max(current - 18, 28));
    setPressure((current) => Math.max(current - 8, 18));
  }

  const forceGenerated = pressure * 28;

  return (
    <GlassCard className="simulation-card hydraulic-card">
      <div className="sim-header">
        <div>
          <span className="sim-tag">Simulation 01</span>
          <h3>Hydraulic Car Lift</h3>
        </div>
        <PressureGauge value={pressure} max={140} label="Oil Pressure" unit="kPa" />
      </div>

      <div className="hydraulic-stage">
        <div className="lift-column left" style={{ height: `${height}px` }} />
        <div className="lift-column right" style={{ height: `${height}px` }} />
        <div className="platform" style={{ bottom: `${height}px` }}>
          <div className="car-body">
            <span className="car-window" />
            <span className="car-light" />
          </div>
          <div className="wheel wheel-left" />
          <div className="wheel wheel-right" />
        </div>
        <div className="fluid-pipe">
          <span style={{ animationDuration: `${Math.max(0.8, 3 - pressure / 60)}s` }} />
        </div>
      </div>

      <div className="sim-controls two-col">
        <button onClick={lift}>Lift Car ↑</button>
        <button onClick={lower}>Lower Car ↓</button>
      </div>

      <div className="mini-stats">
        <span>Lift Height <strong>{height} cm</strong></span>
        <span>Generated Force <strong>{formatNumber(forceGenerated, 0)} N</strong></span>
      </div>
      <p className="sim-explain">Hydraulic systems transfer pressure through fluid, allowing a smaller input force to lift heavy vehicles.</p>
    </GlassCard>
  );
}


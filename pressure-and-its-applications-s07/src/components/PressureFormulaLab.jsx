import React from 'react';
import { useMemo, useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';
import { formatNumber, pressure } from '../utils/physics.js';

export default function PressureFormulaLab() {
  const [force, setForce] = useState(500);
  const [area, setArea] = useState(5);
  const pressureValue = useMemo(() => pressure(force, area), [force, area]);
  const comparison = pressureValue > 150
    ? 'Very high pressure: useful for cutting, lifting, and piercing.'
    : pressureValue > 75
      ? 'Medium pressure: strong enough for many machines.'
      : 'Low pressure: force is spread over a larger area.';

  return (
    <GlassCard className="formula-lab" id="formula">
      <div className="section-kicker">Core Concept</div>
      <h2>Pressure = Force divided by Area</h2>
      <p className="section-intro">
        Increase force or reduce contact area to create more pressure. Move the sliders and watch the pressure field react instantly.
      </p>

      <div className="formula-layout">
        <div className="formula-panel">
          <div className="formula-display">
            <span>P</span>
            <strong>=</strong>
            <span>F</span>
            <strong>/</strong>
            <span>A</span>
          </div>

          <label className="control-row">
            <span>Force: <strong>{force} N</strong></span>
            <input type="range" min="100" max="1200" value={force} onChange={(event) => setForce(Number(event.target.value))} />
          </label>

          <label className="control-row">
            <span>Area: <strong>{area} m²</strong></span>
            <input type="range" min="1" max="15" value={area} onChange={(event) => setArea(Number(event.target.value))} />
          </label>

          <div className="stat-grid">
            <div><span>Force</span><strong>{force} N</strong></div>
            <div><span>Area</span><strong>{area} m²</strong></div>
            <div><span>Pressure</span><strong>{formatNumber(pressureValue)} Pa</strong></div>
          </div>
          <p className="result-note">{comparison}</p>
        </div>

        <div className="pressure-visualizer">
          <PressureGauge value={pressureValue} max={250} label="Live Pressure" unit="Pa" />
          <div className="pressure-plate" style={{ '--plate-scale': 1 + pressureValue / 250 }}>
            <div className="force-block" style={{ height: `${90 + force / 12}px` }}>Force</div>
            <div className="contact-area" style={{ width: `${80 + area * 11}px` }}>Area</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}


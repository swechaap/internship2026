import React from 'react';
import { useMemo, useState } from 'react';
import GlassCard from './GlassCard.jsx';
import PressureGauge from './PressureGauge.jsx';

const holes = [20, 38, 56, 74];

export default function WaterBottle() {
  const [waterLevel, setWaterLevel] = useState(86);
  const averagePressure = useMemo(() => Math.round(waterLevel * 1.15), [waterLevel]);

  return (
    <GlassCard className="simulation-card water-card">
      <div className="sim-header">
        <div>
          <span className="sim-tag">Simulation 02</span>
          <h3>Water Pressure Bottle</h3>
        </div>
        <PressureGauge value={averagePressure} max={110} label="Depth Pressure" unit="kPa" />
      </div>

      <div className="bottle-lab">
        <div className="bottle">
          <div className="bottle-neck" />
          <div className="water-fill" style={{ height: `${waterLevel}%` }} />
          {holes.map((depth, index) => {
            const isUnderWater = waterLevel > depth;
            const distance = isUnderWater ? 55 + depth * 1.9 : 0;
            return (
              <span key={depth} className="water-hole" style={{ bottom: `${depth}%` }}>
                <span
                  className={isUnderWater ? 'water-jet active' : 'water-jet'}
                  style={{ width: `${distance}px`, animationDelay: `${index * 0.12}s` }}
                />
              </span>
            );
          })}
        </div>
        <div className="jet-labels">
          <strong>Lower hole = greater depth</strong>
          <span>Greater depth creates greater pressure, so water travels farther.</span>
        </div>
      </div>

      <div className="sim-controls two-col">
        <button onClick={() => setWaterLevel((level) => Math.min(level + 12, 96))}>Fill Water</button>
        <button onClick={() => setWaterLevel((level) => Math.max(level - 12, 24))}>Drain Water</button>
      </div>

      <div className="mini-stats">
        <span>Water Level <strong>{waterLevel}%</strong></span>
        <span>Strongest Jet <strong>Bottom hole</strong></span>
      </div>
      <p className="sim-explain">Water pressure increases with depth because more water above the hole pushes downward.</p>
    </GlassCard>
  );
}


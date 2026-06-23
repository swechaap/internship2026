import React from 'react';
export default function Hero() {
  return (
    <header id="home" className="hero section-shell">
      <div className="hero-copy">
        <div className="eyebrow">Interactive Physics Experience</div>
        <h1>Pressure Shapes Our World</h1>
        <p>
          Explore how force and area control car lifts, water tanks, pneumatics, cutting tools,
          shoes, dams, brakes, and everyday machines through live simulations and a visual storyboard.
        </p>
        <div className="hero-actions">
          <a className="primary-btn" href="#simulations">Explore Simulations</a>
          <a className="secondary-btn" href="#storyboard">View Story Board</a>
          <a className="secondary-btn" href="#formula">Learn Formula</a>
        </div>
        <div className="hero-metrics" aria-label="Project highlights">
          <div><strong>5</strong><span>Simulations</span></div>
          <div><strong>0</strong><span>Backend Needed</span></div>
          <div><strong>1</strong><span>Vercel Deploy</span></div>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orbital orbital-one" />
        <div className="orbital orbital-two" />
        <div className="pressure-core">
          <div className="formula-chip">P = F / A</div>
          <div className="core-ring ring-one" />
          <div className="core-ring ring-two" />
          <div className="core-ring ring-three" />
          <span className="force-arrow arrow-down">Force</span>
          <span className="area-label">Area</span>
        </div>
      </div>

      <div className="scroll-indicator">
        <span /> Scroll to experiment
      </div>
    </header>
  );
}


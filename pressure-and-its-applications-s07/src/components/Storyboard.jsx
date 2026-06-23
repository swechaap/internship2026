import React from 'react';
import storyboardImage from '../assets/storyboard-pressure-applications.png';

const storyboardUrl = 'https://excalidraw.com/#room=c0405172e531a802c8ff,zBpnHyTmjO4lnR2YlA3qfg';

export default function Storyboard() {
  return (
    <section id="storyboard" className="storyboard section-shell">
      <div className="section-kicker">Story Board</div>
      <div className="section-heading-row">
        <div>
          <h2>Pressure and Its Applications in Real Life</h2>
          <p className="section-intro">
            A clear visual storyline that explains pressure from mystery, formula, hydraulics, water pressure,
            and real-world problem-solving examples.
          </p>
        </div>
        <a className="floating-link" href={storyboardUrl} target="_blank" rel="noreferrer">
          Open Excalidraw ↗
        </a>
      </div>

      <a className="storyboard-frame" href={storyboardUrl} target="_blank" rel="noreferrer" aria-label="Open storyboard in Excalidraw">
        <img src={storyboardImage} alt="Pressure and its applications storyboard" />
        <div className="storyboard-overlay">
          <span>Click to open full storyboard</span>
          <strong>Excalidraw Live Board ↗</strong>
        </div>
      </a>
    </section>
  );
}


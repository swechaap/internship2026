import React from 'react';
import { applications } from '../data/applications.js';

export default function ApplicationsGrid() {
  return (
    <section id="applications" className="applications section-shell">
      <div className="section-kicker">Real World Uses</div>
      <h2>Pressure Applications Around Us</h2>
      <p className="section-intro">
        Pressure is not just a formula. It powers machines, shapes water systems, improves medical tools, and explains daily-life design.
      </p>
      <div className="application-grid">
        {applications.map((item) => (
          <article key={item.title} className="application-card">
            <div className="application-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


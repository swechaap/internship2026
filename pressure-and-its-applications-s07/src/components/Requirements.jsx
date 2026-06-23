import React from 'react';
const requirements = [
  {
    icon: '🧪',
    title: 'Interactive simulations',
    detail: 'Hydraulic lift, water bottle depth flow, pneumatic piston, knife pressure, and footwear comparison.'
  },
  {
    icon: '💎',
    title: 'Premium UI',
    detail: 'Glass blur cards, animated gradients, particles, glowing gauges, responsive layouts, and smooth transitions.'
  },
  {
    icon: '⚡',
    title: 'Frontend only',
    detail: 'No backend, no login, no database. Runs fully inside the browser using React + Vite.'
  },
  {
    icon: '🚀',
    title: 'Deployment ready',
    detail: 'Includes Vercel configuration, deploy scripts, and GitHub Actions auto-deployment workflow.'
  }
];

const flow = [
  'Understand pressure concept',
  'Explore storyboard',
  'Use simulations',
  'Compare real applications',
  'Deploy using Vercel'
];

export default function Requirements() {
  return (
    <section id="requirements" className="requirements section-shell">
      <div className="section-kicker">Project Requirements</div>
      <div className="section-heading-row">
        <div>
          <h2>Built for Task-3 Submission</h2>
          <p className="section-intro">
            The project follows a clean VS Code structure with separate pages, components, assets, data, and utility files.
          </p>
        </div>
      </div>

      <div className="requirement-grid">
        {requirements.map((item) => (
          <article className="requirement-card" key={item.title}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="workflow-strip">
        {flow.map((step, index) => (
          <div className="workflow-step" key={step}>
            <small>Step {index + 1}</small>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}


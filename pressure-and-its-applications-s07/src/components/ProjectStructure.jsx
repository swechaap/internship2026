import React from 'react';
const folders = [
  { path: 'src/pages', desc: 'Main page-level screens such as Home.jsx' },
  { path: 'src/components', desc: 'Reusable UI blocks, simulations, navbar, storyboard, footer' },
  { path: 'src/assets', desc: 'Images and visual resources including the storyboard' },
  { path: 'src/data', desc: 'Application card data and reusable content' },
  { path: 'src/utils', desc: 'Physics formulas and calculation helpers' }
];

export default function ProjectStructure() {
  return (
    <section id="structure" className="project-structure section-shell">
      <div className="section-kicker">VS Code Structure</div>
      <h2>Professional Folder Organization</h2>
      <p className="section-intro">
        Open the project in VS Code and you will see a clean React structure that is easy to explain in review.
      </p>
      <div className="structure-panel">
        <pre>{`PressureVerse/
├── src/
│   ├── pages/
│   ├── components/
│   ├── assets/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .github/workflows/vercel-deploy.yml
├── vercel.json
├── package.json
└── README.md`}</pre>
        <div className="folder-list">
          {folders.map((folder) => (
            <div key={folder.path}>
              <strong>{folder.path}</strong>
              <p>{folder.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


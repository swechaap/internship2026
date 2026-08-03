import React, { useState } from 'react';

function ExperimentGuide({ progress }) {

    const steps = [
        {
            title: "Ready",
            desc: "Click Start to begin the neutralization reaction."
        },
        {
            title: "Step 1 / 6",
            desc: "Acid and Base solutions are prepared. The ions are ready to react."
        },
        {
            title: "Step 2 / 6",
            desc: "H⁺ and OH⁻ ions are moving towards the reaction chamber."
        },
        {
            title: "Step 3 / 6",
            desc: "The ions are colliding inside the reaction chamber."
        },
        {
            title: "Step 4 / 6",
            desc: "Neutralization is occurring. Water molecules are being formed."
        },
        {
            title: "Step 5 / 6",
            desc: "Sodium chloride is forming. The solution is becoming neutral."
        },
        {
            title: "Step 6 / 6",
            desc: "Reaction Complete! Water and Sodium Chloride have been produced successfully."
        }
    ];

    let currentProgressIndex = 0;
    if (progress === 0) currentProgressIndex = 0;
    else if (progress < 20) currentProgressIndex = 1;
    else if (progress < 40) currentProgressIndex = 2;
    else if (progress < 60) currentProgressIndex = 3;
    else if (progress < 80) currentProgressIndex = 4;
    else if (progress < 100) currentProgressIndex = 5;
    else currentProgressIndex = 6;

    const [selected, setSelected] = useState(0);

    const activeIndex = selected !== null ? selected : currentProgressIndex;

    return (
        <div className="guide-card guide-compact card">
            <h2>🧪 Interactive Experiment Guide</h2>

            <div className="guide-controls">
                {steps.map((s, i) => (
                    <button
                        key={i}
                        className={`guide-btn ${i === activeIndex ? 'current' : ''} ${i === currentProgressIndex ? 'live-step' : ''}`}
                        onClick={() => setSelected(i)}
                    >
                        {i === 0 ? 'Home' : `Step ${i}`}
                    </button>
                ))}
            </div>

            <div className="step-view">
                <div className="step-detail">
                    <div className="step-detail-header">
                        <div className="step-index-large">{activeIndex === 0 ? 'Overview' : `Step ${activeIndex} / 6`}</div>
                        <div className="step-title-large">{steps[activeIndex].title}</div>
                    </div>
                    <div className="step-desc-large">{steps[activeIndex].desc}</div>
                    <div className="step-actions">
                        <button 
                            className="primary" 
                            onClick={() => setSelected(0)}
                            disabled={activeIndex === 0}
                        >
                            🏠 Reset View
                        </button>
                        <button 
                            onClick={() => setSelected((prev) => Math.max(0, prev - 1))} 
                            disabled={activeIndex === 0}
                        >
                            ◀ Previous Step
                        </button>
                        <button 
                            onClick={() => setSelected((prev) => Math.min(6, prev + 1))} 
                            disabled={activeIndex === 6}
                        >
                            Next Step ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExperimentGuide;
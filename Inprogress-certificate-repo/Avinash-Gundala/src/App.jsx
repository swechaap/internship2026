import { useState } from "react";
import ReportButton from "./components/ReportButton";
import "./styles/global.css";
import "./styles/header.css";
import "./styles/simulation.css";
import "./styles/controls.css";
import "./styles/info.css";
import "./styles/footer.css";
import Header from "./components/Header";
import SimulationCanvas from "./components/SimulationCanvas";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import ExperimentGuide from "./components/ExperimentGuide";
import Footer from "./components/Footer";

function App() {
    const [activeTab, setActiveTab] = useState("simulation");
    const [action, setAction] = useState("");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Waiting");

    const [waterCount, setWaterCount] = useState(0);
    const [saltCount, setSaltCount] = useState(0);
    const [events, setEvents] = useState([]);

    const pushEvent = (msg) => {
        setEvents(prev => {
            const next = [...prev, { time: Date.now(), text: msg }];
            return next.slice(-20); // Keep last 20 events
        });
    };

    return (
        <div className="app flex-column">
            <Header />

            {/* Navigation Buttons Bar */}
            <nav className="tab-nav">
                <button 
                    className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('simulation')}
                >
                    🧪 Simulation & Controls
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('guide')}
                >
                    📖 Experiment Guide
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('analytics')}
                >
                    📊 Analytics & Event Log
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('report')}
                >
                    📄 PDF Report
                </button>
            </nav>

            <main className="tab-content">
                {/* Keep Simulation Canvas mounted at all times to retain canvas animation state */}
                <div style={{ display: activeTab === 'simulation' ? 'block' : 'none' }}>
                    <div className="simulation-tab-container">
                        <SimulationCanvas
                            action={action}
                            setProgress={setProgress}
                            setStatus={setStatus}
                            setWaterCount={setWaterCount}
                            setSaltCount={setSaltCount}
                            onEvent={pushEvent}
                        />
                        <ControlPanel onAction={setAction} />
                    </div>
                </div>

                {activeTab === 'guide' && (
                    <div className="tab-pane">
                        <ExperimentGuide progress={progress} />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="tab-pane">
                        <InfoPanel
                            progress={progress}
                            status={status}
                            waterCount={waterCount}
                            saltCount={saltCount}
                            events={events}
                        />
                    </div>
                )}

                {activeTab === 'report' && (
                    <div className="tab-pane report-pane">
                        <div className="report-card card">
                            <h2>📄 Experiment Report Generator</h2>
                            <p>Generate a downloadable PDF summary of the current neutralization experiment state.</p>
                            <ReportButton
                                progress={progress}
                                status={status}
                                waterCount={waterCount}
                                saltCount={saltCount}
                            />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
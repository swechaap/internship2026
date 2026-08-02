import "../styles/header.css";

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">🧪</div>
        <div className="header-title">
          <h1>Latent Heat Tracking</h1>
          <span className="header-badge">Phase Change Lab</span>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "lab" ? "active" : ""}`}
          onClick={() => setActiveTab("lab")}
        >
          🧪 Lab Simulation
        </button>
        <button
          className={`tab-btn ${activeTab === "graph" ? "active" : ""}`}
          onClick={() => setActiveTab("graph")}
        >
          📈 Graph Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === "theory" ? "active" : ""}`}
          onClick={() => setActiveTab("theory")}
        >
          📘 Theory & Data
        </button>
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          🖥️ Full Workspace
        </button>
      </div>
    </header>
  );
}

export default Header;
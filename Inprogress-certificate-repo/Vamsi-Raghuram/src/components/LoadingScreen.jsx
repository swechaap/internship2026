import "../styles/loading.css";

function LoadingScreen() {
  return (
    <div className="loading-screen">

      <div className="loading-content">

        <div className="loading-logo">
          🧪
        </div>

        <h1>Initializing Virtual Laboratory</h1>

        <p>Please wait while the experiment is being prepared...</p>

        <div className="loading-bar">

          <div className="loading-progress"></div>

        </div>

      </div>

    </div>
  );
}

export default LoadingScreen;
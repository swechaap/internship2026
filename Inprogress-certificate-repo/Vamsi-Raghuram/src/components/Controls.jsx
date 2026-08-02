import "../styles/controls.css";

function Controls({
  running,
  setRunning,
  setTemperature,
  setHeat,
  setPhase,
  setMeltingTime,
  setGraphData,
  substance,
  speed,
  setSpeed,
  onInjectHeat,
  onJumpTemp,
}) {
  function startSimulation() {
    if (!running) {
      setRunning(true);
    }
  }

  function pauseSimulation() {
    setRunning(false);
  }

  function resetSimulation() {
    setRunning(false);
    setTemperature(substance.startTemp);
    setHeat(0);
    setPhase("Ice");
    setMeltingTime(0);
    setGraphData([
      {
        time: 0,
        temperature: substance.startTemp,
      },
    ]);
  }

  return (
    <div className="controls-container">
      {/* Primary Simulation Controls */}
      <div className="control-group">
        <span className="group-label">Simulation</span>
        <div className="button-row">
          {!running ? (
            <button className="btn btn-primary" onClick={startSimulation}>
              ▶ Start
            </button>
          ) : (
            <button className="btn btn-warning" onClick={pauseSimulation}>
              ⏸ Pause
            </button>
          )}
          <button className="btn btn-danger" onClick={resetSimulation}>
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Speed Multiplier Buttons */}
      <div className="control-group">
        <span className="group-label">Speed</span>
        <div className="button-row">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              className={`btn btn-toggle ${speed === s ? "active" : ""}`}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Instant Temperature Jump Buttons */}
      <div className="control-group">
        <span className="group-label">Jump To Phase</span>
        <div className="button-row">
          <button
            className="btn btn-action"
            onClick={() => onJumpTemp && onJumpTemp("start")}
          >
            🧊 Start ({substance.startTemp}°C)
          </button>
          <button
            className="btn btn-action"
            onClick={() => onJumpTemp && onJumpTemp("melting")}
          >
            🫠 Melt Pt ({substance.meltingPoint}°C)
          </button>
          <button
            className="btn btn-action"
            onClick={() => onJumpTemp && onJumpTemp("boiling")}
          >
            💨 Boil Pt ({substance.boilingPoint}°C)
          </button>
        </div>
      </div>

      {/* Heat Injection Buttons */}
      <div className="control-group">
        <span className="group-label">Inject Heat</span>
        <div className="button-row">
          <button
            className="btn btn-heat"
            onClick={() => onInjectHeat && onInjectHeat(50)}
          >
            🔥 +50 J
          </button>
          <button
            className="btn btn-heat"
            onClick={() => onInjectHeat && onInjectHeat(200)}
          >
            🔥 +200 J
          </button>
          <button
            className="btn btn-heat"
            onClick={() => onInjectHeat && onInjectHeat(500)}
          >
            💥 Heat Blast (+500 J)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controls;
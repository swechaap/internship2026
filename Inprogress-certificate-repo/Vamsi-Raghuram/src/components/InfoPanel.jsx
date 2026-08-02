import "../styles/infoPanel.css";

function InfoPanel({
  temperature,
  phase,
  heat,
  substance,
}) {
  return (
    <div className="info-panel">

      <div className="info-card">
        <h3>Substance</h3>
        <p>{substance ? substance.name : "-"}</p>
      </div>

      <div className="info-card">
        <h3>Temperature</h3>
        <p>{temperature}°C</p>
      </div>

      <div className="info-card">
        <h3>Phase</h3>
        <p>{phase}</p>
      </div>

      <div className="info-card">
        <h3>Heat</h3>
        <p>{heat} J</p>
      </div>

      <div className="info-card">
        <h3>Melting Point</h3>
        <p>
          {substance
            ? `${substance.meltingPoint}°C`
            : "-"}
        </p>
      </div>

      <div className="info-card">
        <h3>Boiling Point</h3>
        <p>
          {substance
            ? `${substance.boilingPoint}°C`
            : "-"}
        </p>
      </div>

    </div>
  );
}

export default InfoPanel;
import "../styles/theory.css";

function Theory({ substance }) {

  if (!substance) {
    return null;
  }

  return (

    <div className="theory">

      <h2>
        📘 Theory
      </h2>

      <div className="theory-card">

        <h3>
          {substance.name}
        </h3>

        <p>
          {substance.theory}
        </p>

        <br />

        <h4>Experiment Data</h4>

        <p>
          <strong>Melting Point:</strong>{" "}
          {substance.meltingPoint}°C
        </p>

        <p>
          <strong>Boiling Point:</strong>{" "}
          {substance.boilingPoint}°C
        </p>

        <p>
          <strong>Latent Heat:</strong>{" "}
          {substance.latentHeat} J/g
        </p>

      </div>

    </div>

  );

}

export default Theory;
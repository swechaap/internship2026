import "../styles/assistant.css";

function Assistant({
  phase,
  temperature,
  substance,
}) {

  let message = "";

  if (!substance) {
    message = "Select a substance to begin the experiment.";
  }

  else if (phase === "Ice") {
    message = `The ${substance.name} is heating. Temperature is increasing toward its melting point of ${substance.meltingPoint}°C.`;
  }

  else if (phase === "Melting") {
    message = `The ${substance.name} is melting. Even though heat is being supplied, the temperature remains constant because the energy is used as latent heat.`;
  }

  else if (
    temperature >= substance.boilingPoint
  ) {
    message = `The ${substance.name} has reached its boiling point of ${substance.boilingPoint}°C.`;
  }

  else {
    message = `The ${substance.name} is now in the liquid state and its temperature is increasing.`;
  }

  return (

    <div className="assistant">

      <div className="assistant-avatar">
        👨‍🔬
      </div>

      <div className="assistant-message">

        <h3>Virtual Lab Assistant</h3>

        <p>{message}</p>

      </div>

    </div>

  );

}

export default Assistant;
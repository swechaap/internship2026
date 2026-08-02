import "../styles/beaker.css";

function Beaker({
  phase,
  temperature,
  meltingTime,
  substance,
}) {

  const waterHeight =
    phase === "Ice"
      ? "35%"
      : phase === "Melting"
      ? "55%"
      : "80%";

  const liquidColor = substance
    ? substance.color
    : "#3b82f6";
const showSteam =
    substance &&
    temperature > substance.meltingPoint;

 const showBubbles =
    substance &&
    temperature > substance.meltingPoint;

  return (
    <div className="beaker">

      {showSteam && (
        <div className="steam">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className="glass">

        {phase !== "Water" && (
          <div className="ice-container">

            <div
              className={`ice ${
                meltingTime >= 8 ? "fall1" : ""
              }`}
            ></div>

            <div
              className={`ice ${
                meltingTime >= 16 ? "fall2" : ""
              }`}
            ></div>

            <div
              className={`ice ${
                meltingTime >= 24 ? "fall3" : ""
              }`}
            ></div>

            <div
              className={`ice ${
                meltingTime >= 30 ? "fall4" : ""
              }`}
            ></div>

          </div>
        )}

        <div
          className="water"
          style={{
            height: waterHeight,
            background: liquidColor,
            transition: "all .6s ease"
          }}
        >

          {showBubbles && (
            <div className="bubbles">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>
          )}

        </div>

      </div>

      <div className="burner">

        <div className="flame">
          🔥
        </div>

      </div>

      <h3
        style={{
          color: "#fff",
          marginTop: "18px",
          fontWeight: "600"
        }}
      >
        {substance?.name}
      </h3>

    </div>
  );
}

export default Beaker;
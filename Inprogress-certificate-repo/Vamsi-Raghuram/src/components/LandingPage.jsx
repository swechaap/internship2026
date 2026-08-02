import { useEffect, useState } from "react";
import "../styles/landing.css";

function LandingPage({ onStart }) {
  const title = "Latent Heat Tracking";

  const [displayTitle, setDisplayTitle] = useState("");
  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    let i = 0;

    const typing = setInterval(() => {
      setDisplayTitle(title.slice(0, i + 1));
      i++;

      if (i === title.length) {
        clearInterval(typing);
      }
    }, 90);

    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div className="landing">

      <div
        className="mouse-glow"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      ></div>

      <div className="particles">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>

      <div className="gradient"></div>

      <div className="hero">

        <div className="logo">
          🧪
        </div>

        <p className="welcome">
          WELCOME TO
        </p>

        <h1>{displayTitle}</h1>

        <p className="subtitle">
          Explore how heat transforms ice into water through an
          interactive scientific simulation.
        </p>

        <button
          className="start-btn"
          onClick={onStart}
        >
          Begin Experiment →
        </button>

      </div>

    </div>
  );
}

export default LandingPage;
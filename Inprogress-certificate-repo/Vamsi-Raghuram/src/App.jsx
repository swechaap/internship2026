import { useState, useEffect } from "react";
import ReportButton from "./components/ReportButton";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import InfoPanel from "./components/InfoPanel";
import Beaker from "./components/Beaker";
import Assistant from "./components/Assistant";
import Footer from "./components/Footer";
import TemperatureGraph from "./components/TemperatureGraph";
import Controls from "./components/Controls";
import Theory from "./components/Theory";
import SubstanceSelector from "./components/SubstanceSelector";

import substances from "./data/substances";

import "./styles/app.css";

function App() {
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [selectedSubstance, setSelectedSubstance] = useState(substances.water);
  const [temperature, setTemperature] = useState(substances.water.startTemp);
  const [phase, setPhase] = useState("Ice");
  const [heat, setHeat] = useState(0);
  const [running, setRunning] = useState(false);
  const [meltingTime, setMeltingTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("lab");

  const [graphData, setGraphData] = useState([
    {
      time: 0,
      temperature: substances.water.startTemp,
    },
  ]);

  function startExperiment() {
    setFadeOut(true);
    setTimeout(() => {
      setStarted(true);
    }, 700);
  }

  function handleSelectSubstance(item) {
    setRunning(false);
    setSelectedSubstance(item);
    setTemperature(item.startTemp);
    setPhase("Ice");
    setHeat(0);
    setMeltingTime(0);
    setGraphData([
      {
        time: 0,
        temperature: item.startTemp,
      },
    ]);
  }

  function handleInjectHeat(addedHeat) {
    setHeat((prev) => prev + addedHeat);

    // Calculate state progress from added heat
    setTemperature((prevTemp) => {
      let newTemp = prevTemp;
      let newPhase = phase;
      let newMeltingTime = meltingTime;

      // Approximate step equivalent based on added heat
      const steps = Math.max(1, Math.round(addedHeat / 20));

      for (let i = 0; i < steps; i++) {
        if (newTemp < selectedSubstance.meltingPoint) {
          newTemp = Math.min(selectedSubstance.meltingPoint, newTemp + 1);
          newPhase = "Ice";
        } else if (
          newTemp === selectedSubstance.meltingPoint &&
          newMeltingTime < 30
        ) {
          newPhase = "Melting";
          newMeltingTime += 1;
        } else {
          newPhase = "Water";
          if (newTemp >= selectedSubstance.boilingPoint) {
            newTemp = selectedSubstance.boilingPoint;
          } else {
            newTemp = Math.min(selectedSubstance.boilingPoint, newTemp + 1);
          }
        }
      }

      setMeltingTime(newMeltingTime);
      setPhase(newPhase);

      setGraphData((prev) => [
        ...prev,
        {
          time: prev.length,
          temperature: newTemp,
        },
      ]);

      return newTemp;
    });
  }

  function handleJumpTemp(target) {
    let targetTemp = selectedSubstance.startTemp;
    let targetPhase = "Ice";
    let targetMeltingTime = 0;

    if (target === "melting") {
      targetTemp = selectedSubstance.meltingPoint;
      targetPhase = "Melting";
      targetMeltingTime = 15;
    } else if (target === "boiling") {
      targetTemp = selectedSubstance.boilingPoint;
      targetPhase = "Water";
      targetMeltingTime = 30;
    }

    setTemperature(targetTemp);
    setPhase(targetPhase);
    setMeltingTime(targetMeltingTime);

    setGraphData((prev) => [
      ...prev,
      {
        time: prev.length,
        temperature: targetTemp,
      },
    ]);
  }

  useEffect(() => {
    if (!running) return;

    const intervalTime = Math.max(100, Math.floor(1000 / speed));

    const timer = setInterval(() => {
      setHeat((prevHeat) => prevHeat + 5);

      setTemperature((prevTemp) => {
        let newTemp = prevTemp;
        let newPhase = phase;

        if (prevTemp < selectedSubstance.meltingPoint) {
          newTemp = prevTemp + 1;
          newPhase = "Ice";
        } else if (
          prevTemp === selectedSubstance.meltingPoint &&
          meltingTime < 30
        ) {
          newTemp = selectedSubstance.meltingPoint;
          newPhase = "Melting";
          setMeltingTime((prev) => prev + 1);
        } else {
          newPhase = "Water";
          if (prevTemp >= selectedSubstance.boilingPoint) {
            newTemp = selectedSubstance.boilingPoint;
            setRunning(false);
          } else {
            newTemp = prevTemp + 1;
          }
        }

        setPhase(newPhase);

        setGraphData((prev) => [
          ...prev,
          {
            time: prev.length,
            temperature: newTemp,
          },
        ]);

        return newTemp;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [running, meltingTime, phase, selectedSubstance, speed]);

  if (!started) {
    return (
      <div
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity .7s ease",
        }}
      >
        <LandingPage onStart={startExperiment} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Top Header Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Row 2: Substance Selector */}
      <SubstanceSelector
        selectedSubstance={selectedSubstance}
        onSelect={handleSelectSubstance}
      />

      {/* Main Single-Frame Viewport Container */}
      <div className="main-frame">
        {activeTab === "lab" && (
          <div className="lab-view-container">
            <InfoPanel
              temperature={temperature}
              phase={phase}
              heat={heat}
              substance={selectedSubstance}
            />

            <div className="beaker-assistant-row">
              <Beaker
                phase={phase}
                temperature={temperature}
                meltingTime={meltingTime}
                substance={selectedSubstance}
              />
              <Assistant
                phase={phase}
                temperature={temperature}
                substance={selectedSubstance}
              />
            </div>

            <Controls
              running={running}
              setRunning={setRunning}
              setTemperature={setTemperature}
              setHeat={setHeat}
              setPhase={setPhase}
              setMeltingTime={setMeltingTime}
              setGraphData={setGraphData}
              substance={selectedSubstance}
              speed={speed}
              setSpeed={setSpeed}
              onInjectHeat={handleInjectHeat}
              onJumpTemp={handleJumpTemp}
            />
          </div>
        )}

        {activeTab === "graph" && (
          <div className="graph-view-container">
            <TemperatureGraph
              graphData={graphData}
              substance={selectedSubstance}
            />
          </div>
        )}

        {activeTab === "theory" && (
          <div className="theory-view-container">
            <ReportButton
              substance={selectedSubstance}
              temperature={temperature}
              heat={heat}
            />
            <Theory substance={selectedSubstance} />
          </div>
        )}

        {activeTab === "all" && (
          <div className="all-workspace-grid">
            <div className="all-workspace-col">
              <InfoPanel
                temperature={temperature}
                phase={phase}
                heat={heat}
                substance={selectedSubstance}
              />
              <div className="beaker-assistant-row">
                <Beaker
                  phase={phase}
                  temperature={temperature}
                  meltingTime={meltingTime}
                  substance={selectedSubstance}
                />
                <Assistant
                  phase={phase}
                  temperature={temperature}
                  substance={selectedSubstance}
                />
              </div>
              <Controls
                running={running}
                setRunning={setRunning}
                setTemperature={setTemperature}
                setHeat={setHeat}
                setPhase={setPhase}
                setMeltingTime={setMeltingTime}
                setGraphData={setGraphData}
                substance={selectedSubstance}
                speed={speed}
                setSpeed={setSpeed}
                onInjectHeat={handleInjectHeat}
                onJumpTemp={handleJumpTemp}
              />
            </div>

            <div className="all-workspace-col">
              <TemperatureGraph
                graphData={graphData}
                substance={selectedSubstance}
              />
              <div className="theory-row">
                <ReportButton
                  substance={selectedSubstance}
                  temperature={temperature}
                  heat={heat}
                />
                <Theory substance={selectedSubstance} />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
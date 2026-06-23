import React from 'react';
import BackgroundFX from '../components/BackgroundFX.jsx';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Storyboard from '../components/Storyboard.jsx';
import PressureFormulaLab from '../components/PressureFormulaLab.jsx';
import HydraulicLift from '../components/HydraulicLift.jsx';
import WaterBottle from '../components/WaterBottle.jsx';
import PneumaticPiston from '../components/PneumaticPiston.jsx';
import KnifePressure from '../components/KnifePressure.jsx';
import FootwearPressure from '../components/FootwearPressure.jsx';
import ApplicationsGrid from '../components/ApplicationsGrid.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <main>
      <BackgroundFX />
      <Navbar />
      <Hero />
      <Storyboard />
      <PressureFormulaLab />

      <section id="simulations" className="simulations section-shell">
        <div className="section-kicker">Interactive Lab</div>
        <div className="section-heading-row">
          <div>
            <h2>Live Pressure Simulations</h2>
            <p className="section-intro">
              Press buttons, move sliders, compare results, and see pressure principles working visually.
            </p>
          </div>
          <span className="status-pill">5 working demos</span>
        </div>
        <div className="simulation-grid">
          <HydraulicLift />
          <WaterBottle />
          <PneumaticPiston />
          <KnifePressure />
          <FootwearPressure />
        </div>
      </section>

      <ApplicationsGrid />
      <Footer />
    </main>
  );
}


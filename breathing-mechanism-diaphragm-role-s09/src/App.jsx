import React, { useState, useEffect } from 'react';
import './styles.css';

const BreathingMechanismDemo = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);

  const scenes = [
    {
      id: 1,
      title: "The Air Team Adventure",
      subtitle: "Introduction",
      description: "Inside our bodies lives the Air Team. They work together 24/7 to bring in fresh oxygen and send out waste (carbon dioxide) to keep us alive.",
      illustration: "intro",
      characters: ["Nose", "Trachea", "Lungs", "Diaphragm"]
    },
    {
      id: 2,
      title: "The Nose: The Gate",
      subtitle: "Scene 2",
      description: "Air enters through the nose. Tiny hairs and mucus trap dust and germs, allowing only clean and warm air to enter the body.",
      illustration: "nose"
    },
    {
      id: 3,
      title: "The Trachea: The Main Road",
      subtitle: "Scene 3",
      description: "The trachea is a strong tube that acts like a highway. It carries air safely to and from the lungs.",
      illustration: "trachea"
    },
    {
      id: 4,
      title: "The Lungs: The Air Palace",
      subtitle: "Scene 4",
      description: "The lungs are the main organs of breathing. Oxygen from the air enters the blood here, while carbon dioxide from the blood enters the lungs to be removed.",
      illustration: "lungs"
    },
    {
      id: 5,
      title: "The Diaphragm: The Magic Elevator",
      subtitle: "Scene 5",
      description: "The diaphragm is a strong muscle located below the lungs. Its movement changes the size of the chest cavity and helps us breathe.",
      illustration: "diaphragm"
    },
    {
      id: 6,
      title: "Inhalation: Bringing In Air",
      subtitle: "Scene 6",
      description: "When the diaphragm contracts and moves downward, the chest cavity becomes larger. Air rushes into the lungs and fills them with fresh oxygen.",
      illustration: "inhalation"
    },
    {
      id: 7,
      title: "Exhalation: Sending Out Air",
      subtitle: "Scene 7",
      description: "When the diaphragm relaxes and moves upward, the chest cavity becomes smaller. Carbon dioxide-rich air is pushed out of the lungs.",
      illustration: "exhalation"
    },
    {
      id: 8,
      title: "The Breathing Cycle: Never Stops!",
      subtitle: "Scene 8",
      description: "Breathing is a continuous process: Inhale → Exhale → Repeat. The diaphragm keeps moving down and up to maintain this cycle throughout our lives.",
      illustration: "cycle"
    }
  ];

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, scenes.length]);

  // Main button handler - Central entry point for all button clicks
  const handleButtonClick = (action, payload = null) => {
    console.log(`Button clicked: ${action}`, payload);
    
    switch (action) {
      case 'next':
        handleNext();
        break;
      case 'previous':
        handlePrevious();
        break;
      case 'restart':
        handleRestart();
        break;
      case 'play-pause':
        setIsPlaying(!isPlaying);
        break;
      case 'thumbnails':
        setShowThumbnails(!showThumbnails);
        break;
      case 'scene-select':
        if (payload !== null) {
          handleSceneClick(payload);
        }
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const handleNext = () => {
    setCurrentScene((prev) => (prev + 1) % scenes.length);
  };

  const handlePrevious = () => {
    setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const handleSceneClick = (index) => {
    setCurrentScene(index);
    setShowThumbnails(false);
  };

  const currentSceneData = scenes[currentScene];
  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <div className="demo-container">
      {/* Header */}
      <div className="header">
        <h1 className="main-title">🌬️ Breathing Mechanism</h1>
        <p className="tagline">"Breathe Well, Live Well!"</p>
      </div>

      {/* Main Content Area */}
      <div className="player-wrapper">
        <div className="scene-content">
          <SceneIllustration 
            illustration={currentSceneData.illustration} 
            sceneNumber={currentScene}
          />
          
          <div className="scene-text">
            <div className="scene-header">
              <span className="scene-subtitle">{currentSceneData.subtitle}</span>
              <h2 className="scene-title">{currentSceneData.title}</h2>
            </div>
            <p className="scene-description">{currentSceneData.description}</p>
            
            {currentSceneData.characters && (
              <div className="characters-list">
                <h4>Meet the Air Team:</h4>
                <ul>
                  {currentSceneData.characters.map((char, idx) => (
                    <li key={idx}>{char}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="scene-counter">
            Scene {currentScene + 1} of {scenes.length}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button 
            className="control-btn restart-btn" 
            onClick={() => handleButtonClick('restart')}
            title="Restart from beginning"
          >
            🔁 Restart
          </button>
          <button 
            className="control-btn prev-btn" 
            onClick={() => handleButtonClick('previous')}
            title="Previous scene"
          >
            ⏮ Previous
          </button>
          <button 
            className="control-btn play-btn" 
            onClick={() => handleButtonClick('play-pause')}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button 
            className="control-btn next-btn" 
            onClick={() => handleButtonClick('next')}
            title="Next scene"
          >
            ⏭ Next
          </button>
          <button 
            className="control-btn thumbnails-btn" 
            onClick={() => handleButtonClick('thumbnails')}
            title="Scene thumbnails"
          >
            📑 Scenes
          </button>
        </div>

        {/* Thumbnail Navigation */}
        {showThumbnails && (
          <div className="thumbnails-container">
            <div className="thumbnails">
              {scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${idx === currentScene ? 'active' : ''}`}
                  onClick={() => handleButtonClick('scene-select', idx)}
                  title={`Scene ${idx + 1}: ${scene.title}`}
                >
                  <div className="thumbnail-number">{idx + 1}</div>
                  <div className="thumbnail-title">{scene.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Conclusion */}
      <div className="footer">
        <p>The diaphragm acts like a pump. By moving downward and upward, it helps the lungs take in oxygen and remove carbon dioxide.</p>
      </div>
    </div>
  );
};

// SVG Scene Illustrations Component
const SceneIllustration = ({ illustration, sceneNumber }) => {
  switch (illustration) {
    case "intro":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              .air-team-char { animation: float 3s ease-in-out infinite; }
              .char1 { animation-delay: 0s; }
              .char2 { animation-delay: 0.5s; }
              .char3 { animation-delay: 1s; }
              .char4 { animation-delay: 1.5s; }
            `}</style>
          </defs>
          
          {/* Background */}
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Nose Character */}
          <g className="air-team-char char1" transform="translate(60, 80)">
            <circle cx="0" cy="0" r="25" fill="#FFB6C1"/>
            <circle cx="-10" cy="-5" r="5" fill="#333"/>
            <circle cx="10" cy="-5" r="5" fill="#333"/>
            <path d="M -5 5 Q 0 10 5 5" stroke="#333" strokeWidth="2" fill="none"/>
            <text x="-20" y="40" fontSize="12" fontWeight="bold" fill="#333">Nose</text>
          </g>
          
          {/* Trachea Character */}
          <g className="air-team-char char2" transform="translate(150, 80)">
            <rect x="-15" y="-30" width="30" height="60" fill="#FF9999" rx="15"/>
            <circle cx="-8" cy="-20" r="3" fill="#FF6666"/>
            <circle cx="8" cy="-15" r="3" fill="#FF6666"/>
            <circle cx="-8" cy="0" r="3" fill="#FF6666"/>
            <circle cx="8" cy="5" r="3" fill="#FF6666"/>
            <text x="-25" y="45" fontSize="12" fontWeight="bold" fill="#333">Trachea</text>
          </g>
          
          {/* Lungs Character */}
          <g className="air-team-char char3" transform="translate(240, 80)">
            <ellipse cx="-20" cy="0" rx="18" ry="28" fill="#FFB3BA"/>
            <ellipse cx="20" cy="0" rx="18" ry="28" fill="#FFB3BA"/>
            <circle cx="-15" cy="-10" r="4" fill="#FF9999"/>
            <circle cx="-20" cy="0" r="4" fill="#FF9999"/>
            <circle cx="15" cy="-10" r="4" fill="#FF9999"/>
            <circle cx="20" cy="0" r="4" fill="#FF9999"/>
            <text x="-20" y="45" fontSize="12" fontWeight="bold" fill="#333">Lungs</text>
          </g>
          
          {/* Diaphragm Character */}
          <g className="air-team-char char4" transform="translate(330, 100)">
            <ellipse cx="0" cy="0" rx="25" ry="15" fill="#FFD700"/>
            <path d="M -15 0 Q -15 10 0 12 Q 15 10 15 0" fill="#FFA500" stroke="#FF8C00" strokeWidth="2"/>
            <text x="-35" y="35" fontSize="12" fontWeight="bold" fill="#333">Diaphragm</text>
          </g>

          {/* Oxygen and CO2 indicators */}
          <g transform="translate(200, 220)">
            <circle cx="-40" cy="0" r="8" fill="#87CEEB"/>
            <text x="-40" y="25" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#333">O₂</text>
            <text x="-40" y="42" fontSize="10" textAnchor="middle" fill="#555">Oxygen In</text>
            
            <circle cx="40" cy="0" r="8" fill="#FF6B6B"/>
            <text x="40" y="25" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff">CO₂</text>
            <text x="40" y="42" fontSize="10" textAnchor="middle" fill="#555">CO₂ Out</text>
          </g>
        </svg>
      );

    case "nose":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes dustFloat {
                0% { opacity: 0; transform: translateY(0) translateX(0); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-80px) translateX(20px); }
              }
              .dust { animation: dustFloat 2s ease-out infinite; }
              .dust1 { animation-delay: 0s; }
              .dust2 { animation-delay: 0.5s; }
              .dust3 { animation-delay: 1s; }
              @keyframes hairWave {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.8); }
              }
              .nostril-hair { animation: hairWave 1.5s ease-in-out infinite; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Large Nose */}
          <circle cx="200" cy="120" r="50" fill="#FFB6C1"/>
          
          {/* Nostrils */}
          <circle cx="175" cy="120" r="15" fill="#FF9DBD"/>
          <circle cx="225" cy="120" r="15" fill="#FF9DBD"/>
          
          {/* Nostril details */}
          <ellipse cx="175" cy="120" rx="8" ry="10" fill="#FF8080"/>
          <ellipse cx="225" cy="120" rx="8" ry="10" fill="#FF8080"/>
          
          {/* Nasal hairs */}
          <g className="nostril-hair" style={{transformOrigin: '175px 110px'}}>
            <line x1="175" y1="110" x2="175" y2="90" stroke="#666" strokeWidth="2"/>
            <line x1="170" y1="105" x2="160" y2="85" stroke="#666" strokeWidth="2"/>
            <line x1="180" y1="105" x2="190" y2="85" stroke="#666" strokeWidth="2"/>
          </g>
          
          <g className="nostril-hair" style={{transformOrigin: '225px 110px'}}>
            <line x1="225" y1="110" x2="225" y2="90" stroke="#666" strokeWidth="2"/>
            <line x1="220" y1="105" x2="210" y2="85" stroke="#666" strokeWidth="2"/>
            <line x1="230" y1="105" x2="240" y2="85" stroke="#666" strokeWidth="2"/>
          </g>

          {/* Incoming air particles (with germs) */}
          <g className="dust dust1">
            <circle cx="100" cy="180" r="4" fill="#999" opacity="0.7"/>
            <text x="100" y="198" fontSize="9" textAnchor="middle" fill="#666">Dust</text>
          </g>
          <g className="dust dust2">
            <circle cx="80" cy="180" r="3" fill="#FF6B6B" opacity="0.7"/>
            <text x="80" y="198" fontSize="9" textAnchor="middle" fill="#666">Germ</text>
          </g>
          <g className="dust dust3">
            <circle cx="120" cy="180" r="3" fill="#999" opacity="0.7"/>
            <text x="120" y="198" fontSize="9" textAnchor="middle" fill="#666">Dust</text>
          </g>

          {/* Clean air going in */}
          <path d="M 250 120 Q 300 120 320 100" stroke="#87CEEB" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <text x="330" y="95" fontSize="12" fontWeight="bold" fill="#333">Clean</text>
          <text x="330" y="110" fontSize="12" fontWeight="bold" fill="#333">Air In</text>

          {/* Mucus layer indicator */}
          <ellipse cx="200" cy="130" rx="45" ry="8" fill="none" stroke="#FFEB99" strokeWidth="2" strokeDasharray="5,5"/>
          <text x="200" y="155" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#FF6B6B">Mucus Trap</text>
        </svg>
      );

    case "trachea":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes airFlow {
                0% { transform: translateY(0); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateY(80px); opacity: 0; }
              }
              .air-particle {
                animation: airFlow 2s ease-in-out infinite;
              }
              .p1 { animation-delay: 0s; }
              .p2 { animation-delay: 0.4s; }
              .p3 { animation-delay: 0.8s; }
              .p4 { animation-delay: 1.2s; }
              .p5 { animation-delay: 1.6s; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Trachea - Main tube */}
          <rect x="170" y="20" width="60" height="260" fill="#FF9999" rx="30"/>
          
          {/* Cartilage rings */}
          <circle cx="200" cy="50" r="35" fill="none" stroke="#FF6666" strokeWidth="3"/>
          <circle cx="200" cy="100" r="35" fill="none" stroke="#FF6666" strokeWidth="3"/>
          <circle cx="200" cy="150" r="35" fill="none" stroke="#FF6666" strokeWidth="3"/>
          <circle cx="200" cy="200" r="35" fill="none" stroke="#FF6666" strokeWidth="3"/>
          <circle cx="200" cy="250" r="35" fill="none" stroke="#FF6666" strokeWidth="3"/>
          
          {/* Air particles flowing down */}
          <g className="air-particle p1">
            <circle cx="185" cy="30" r="4" fill="#87CEEB" opacity="0.8"/>
          </g>
          <g className="air-particle p2">
            <circle cx="215" cy="30" r="4" fill="#87CEEB" opacity="0.8"/>
          </g>
          <g className="air-particle p3">
            <circle cx="195" cy="30" r="4" fill="#87CEEB" opacity="0.8"/>
          </g>
          <g className="air-particle p4">
            <circle cx="205" cy="30" r="4" fill="#87CEEB" opacity="0.8"/>
          </g>
          <g className="air-particle p5">
            <circle cx="190" cy="30" r="4" fill="#87CEEB" opacity="0.8"/>
          </g>

          {/* Labels */}
          <text x="80" y="50" fontSize="13" fontWeight="bold" fill="#333">Air enters</text>
          <text x="80" y="68" fontSize="13" fontWeight="bold" fill="#333">through nose</text>
          
          <text x="310" y="100" fontSize="13" fontWeight="bold" fill="#333">Highway</text>
          <text x="310" y="118" fontSize="13" fontWeight="bold" fill="#333">to lungs</text>
          
          <text x="80" y="240" fontSize="13" fontWeight="bold" fill="#333">Strong tube</text>
          <text x="80" y="258" fontSize="13" fontWeight="bold" fill="#333">structure</text>
        </svg>
      );

    case "lungs":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes lungPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              .lung { animation: lungPulse 2s ease-in-out infinite; }
              .lung-left { transform-origin: 120px 140px; }
              .lung-right { transform-origin: 280px 140px; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Left Lung */}
          <g className="lung lung-left">
            <ellipse cx="120" cy="140" rx="45" ry="70" fill="#FFB3BA"/>
            <path d="M 90 140 Q 85 160 90 180" stroke="#FF9999" strokeWidth="3" fill="none"/>
            <circle cx="100" cy="100" r="8" fill="#FF9999"/>
            <circle cx="110" cy="120" r="8" fill="#FF9999"/>
            <circle cx="100" cy="140" r="8" fill="#FF9999"/>
            <circle cx="110" cy="160" r="8" fill="#FF9999"/>
            <circle cx="100" cy="180" r="8" fill="#FF9999"/>
          </g>
          
          {/* Right Lung */}
          <g className="lung lung-right">
            <ellipse cx="280" cy="140" rx="45" ry="70" fill="#FFB3BA"/>
            <path d="M 310 140 Q 315 160 310 180" stroke="#FF9999" strokeWidth="3" fill="none"/>
            <circle cx="270" cy="100" r="8" fill="#FF9999"/>
            <circle cx="290" cy="120" r="8" fill="#FF9999"/>
            <circle cx="270" cy="140" r="8" fill="#FF9999"/>
            <circle cx="290" cy="160" r="8" fill="#FF9999"/>
            <circle cx="270" cy="180" r="8" fill="#FF9999"/>
          </g>

          {/* Trachea connection */}
          <path d="M 200 60 L 140 100 L 260 100" stroke="#FF6666" strokeWidth="8" fill="none" strokeLinecap="round"/>

          {/* Oxygen molecules entering */}
          <text x="80" y="60" fontSize="14" fontWeight="bold" fill="#333">🔴 O₂ In</text>
          <circle cx="85" cy="75" r="5" fill="#87CEEB"/>
          <path d="M 85 80 L 90 110" stroke="#87CEEB" strokeWidth="2"/>

          {/* CO2 molecules leaving */}
          <text x="300" y="60" fontSize="14" fontWeight="bold" fill="#333">CO₂ Out 🟠</text>
          <circle cx="330" cy="75" r="5" fill="#FF6B6B"/>
          <path d="M 330 80 L 325 110" stroke="#FF6B6B" strokeWidth="2"/>

          {/* Information */}
          <text x="200" y="240" fontSize="12" textAnchor="middle" fontWeight="bold" fill="#333">Gas Exchange Center</text>
          <text x="200" y="258" fontSize="11" textAnchor="middle" fill="#555">Oxygen enters blood • CO₂ removed</text>
        </svg>
      );

    case "diaphragm":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes diaphragmMove {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              .diaphragm-muscle { animation: diaphragmMove 3s ease-in-out infinite; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Lungs */}
          <ellipse cx="140" cy="80" rx="35" ry="50" fill="#FFB3BA" opacity="0.7"/>
          <ellipse cx="260" cy="80" rx="35" ry="50" fill="#FFB3BA" opacity="0.7"/>

          {/* Chest cavity outline */}
          <path d="M 100 150 L 100 50 Q 100 40 110 40 L 290 40 Q 300 40 300 50 L 300 150" stroke="#CCCCCC" strokeWidth="2" fill="none" strokeDasharray="5,5"/>

          {/* Diaphragm - Magic Elevator */}
          <g className="diaphragm-muscle">
            <ellipse cx="200" cy="170" rx="80" ry="20" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
            <path d="M 140 170 Q 140 185 160 190 Q 200 195 240 190 Q 260 185 260 170" fill="#FFA500"/>
            <circle cx="160" cy="180" r="4" fill="#FF8C00"/>
            <circle cx="200" cy="185" r="4" fill="#FF8C00"/>
            <circle cx="240" cy="180" r="4" fill="#FF8C00"/>
          </g>

          {/* Labels */}
          <text x="200" y="220" fontSize="13" textAnchor="middle" fontWeight="bold" fill="#333">Diaphragm: The Magic Elevator</text>
          <text x="50" y="80" fontSize="11" fontWeight="bold" fill="#555">Lungs</text>
          <text x="320" y="80" fontSize="11" fontWeight="bold" fill="#555">Lungs</text>
          
          {/* Movement arrows */}
          <path d="M 200 140 L 200 120" stroke="#FF6B6B" strokeWidth="3" fill="none" markerEnd="url(#arrowred)"/>
          <text x="220" y="130" fontSize="11" fill="#FF6B6B" fontWeight="bold">Moves Down/Up</text>

          {/* Information box */}
          <rect x="80" y="245" width="240" height="45" fill="#FFFACD" rx="5" stroke="#FFD700" strokeWidth="2"/>
          <text x="200" y="263" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#333">Contracts and relaxes</text>
          <text x="200" y="280" fontSize="10" textAnchor="middle" fill="#555">Changes chest cavity size</text>
        </svg>
      );

    case "inhalation":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes diaphragmDown {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(30px); }
              }
              @keyframes lungExpand {
                0%, 100% { rx: 35px; ry: 50px; }
                50% { rx: 42px; ry: 60px; }
              }
              @keyframes airInhale {
                0% { opacity: 0; transform: translateY(-40px); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: translateY(40px); }
              }
              .diaphragm-down { animation: diaphragmDown 2s ease-in-out infinite; }
              .lung-expand { animation: lungExpand 2s ease-in-out infinite; }
              .air-in { animation: airInhale 2s ease-in-out infinite; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Title */}
          <text x="200" y="30" fontSize="16" textAnchor="middle" fontWeight="bold" fill="#333">INHALATION - Breathing In</text>
          
          {/* Chest cavity outline */}
          <path d="M 100 150 L 100 50 Q 100 40 110 40 L 290 40 Q 300 40 300 50 L 300 200" stroke="#CCCCCC" strokeWidth="2" fill="none" strokeDasharray="5,5"/>

          {/* Left Lung - Expanding */}
          <ellipse cx="140" cy="90" rx="35" ry="50" fill="#FFB3BA" opacity="0.7" className="lung-expand"/>
          
          {/* Right Lung - Expanding */}
          <ellipse cx="260" cy="90" rx="35" ry="50" fill="#FFB3BA" opacity="0.7" className="lung-expand"/>

          {/* Diaphragm - Moving Down */}
          <g className="diaphragm-down">
            <ellipse cx="200" cy="170" rx="80" ry="20" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
            <path d="M 140 170 Q 140 185 160 190 Q 200 195 240 190 Q 260 185 260 170" fill="#FFA500"/>
          </g>

          {/* Air particles flowing in */}
          <g className="air-in" style={{animationDelay: '0s'}}>
            <circle cx="130" cy="50" r="5" fill="#87CEEB" opacity="0.8"/>
            <text x="130" y="40" fontSize="9" textAnchor="middle" fill="#333">O₂</text>
          </g>
          <g className="air-in" style={{animationDelay: '0.3s'}}>
            <circle cx="200" cy="50" r="5" fill="#87CEEB" opacity="0.8"/>
            <text x="200" y="40" fontSize="9" textAnchor="middle" fill="#333">O₂</text>
          </g>
          <g className="air-in" style={{animationDelay: '0.6s'}}>
            <circle cx="270" cy="50" r="5" fill="#87CEEB" opacity="0.8"/>
            <text x="270" y="40" fontSize="9" textAnchor="middle" fill="#333">O₂</text>
          </g>

          {/* Arrows showing movement */}
          <text x="320" y="100" fontSize="11" fontWeight="bold" fill="#FF6B6B">↓ Down</text>
          <text x="320" y="180" fontSize="11" fontWeight="bold" fill="#FF6B6B">Size ↑</text>

          {/* Information */}
          <text x="200" y="250" fontSize="12" textAnchor="middle" fontWeight="bold" fill="#333">Diaphragm moves DOWN</text>
          <text x="200" y="270" fontSize="11" textAnchor="middle" fill="#555">Lungs expand • Fresh oxygen enters</text>
        </svg>
      );

    case "exhalation":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes diaphragmUp {
                0%, 100% { transform: translateY(30px); }
                50% { transform: translateY(0); }
              }
              @keyframes lungCompress {
                0%, 100% { rx: 42px; ry: 60px; }
                50% { rx: 35px; ry: 50px; }
              }
              @keyframes airExhale {
                0% { opacity: 0; transform: translateY(40px); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-40px); }
              }
              .diaphragm-up { animation: diaphragmUp 2s ease-in-out infinite; }
              .lung-compress { animation: lungCompress 2s ease-in-out infinite; }
              .air-out { animation: airExhale 2s ease-in-out infinite; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Title */}
          <text x="200" y="30" fontSize="16" textAnchor="middle" fontWeight="bold" fill="#333">EXHALATION - Breathing Out</text>
          
          {/* Chest cavity outline */}
          <path d="M 100 180 L 100 50 Q 100 40 110 40 L 290 40 Q 300 40 300 50 L 300 180" stroke="#CCCCCC" strokeWidth="2" fill="none" strokeDasharray="5,5"/>

          {/* Left Lung - Compressing */}
          <ellipse cx="140" cy="100" rx="35" ry="50" fill="#FFB3BA" opacity="0.7" className="lung-compress"/>
          
          {/* Right Lung - Compressing */}
          <ellipse cx="260" cy="100" rx="35" ry="50" fill="#FFB3BA" opacity="0.7" className="lung-compress"/>

          {/* Diaphragm - Moving Up */}
          <g className="diaphragm-up">
            <ellipse cx="200" cy="180" rx="80" ry="20" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
            <path d="M 140 180 Q 140 190 160 193 Q 200 195 240 193 Q 260 190 260 180" fill="#FFA500"/>
          </g>

          {/* CO2 particles flowing out */}
          <g className="air-out" style={{animationDelay: '0s'}}>
            <circle cx="130" cy="50" r="5" fill="#FF6B6B" opacity="0.8"/>
            <text x="130" y="40" fontSize="9" textAnchor="middle" fill="#fff">CO₂</text>
          </g>
          <g className="air-out" style={{animationDelay: '0.3s'}}>
            <circle cx="200" cy="50" r="5" fill="#FF6B6B" opacity="0.8"/>
            <text x="200" y="40" fontSize="9" textAnchor="middle" fill="#fff">CO₂</text>
          </g>
          <g className="air-out" style={{animationDelay: '0.6s'}}>
            <circle cx="270" cy="50" r="5" fill="#FF6B6B" opacity="0.8"/>
            <text x="270" y="40" fontSize="9" textAnchor="middle" fill="#fff">CO₂</text>
          </g>

          {/* Arrows showing movement */}
          <text x="320" y="130" fontSize="11" fontWeight="bold" fill="#FF6B6B">↑ Up</text>
          <text x="320" y="180" fontSize="11" fontWeight="bold" fill="#FF6B6B">Size ↓</text>

          {/* Information */}
          <text x="200" y="250" fontSize="12" textAnchor="middle" fontWeight="bold" fill="#333">Diaphragm moves UP</text>
          <text x="200" y="270" fontSize="11" textAnchor="middle" fill="#555">Lungs compress • Carbon dioxide leaves</text>
        </svg>
      );

    case "cycle":
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <defs>
            <style>{`
              @keyframes pulseGlow {
                0%, 100% { fill-opacity: 0.6; }
                50% { fill-opacity: 1; }
              }
              .cycle-step { animation: pulseGlow 2s ease-in-out infinite; }
              .step1 { animation-delay: 0s; }
              .step2 { animation-delay: 0.5s; }
              .step3 { animation-delay: 1s; }
              .step4 { animation-delay: 1.5s; }
            `}</style>
          </defs>
          
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          
          {/* Title */}
          <text x="200" y="25" fontSize="16" textAnchor="middle" fontWeight="bold" fill="#333">The Breathing Cycle Never Stops!</text>
          
          {/* Circular flow */}
          <circle cx="200" cy="150" r="100" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeDasharray="10,5"/>

          {/* Step 1 - Inhale */}
          <g className="cycle-step step1" transform="translate(280, 100)">
            <rect x="-35" y="-20" width="70" height="40" fill="#87CEEB" rx="5"/>
            <text x="0" y="8" fontSize="13" textAnchor="middle" fontWeight="bold" fill="#fff">INHALE</text>
          </g>

          {/* Step 2 - Oxygen enters */}
          <g className="cycle-step step2" transform="translate(280, 190)">
            <rect x="-35" y="-20" width="70" height="40" fill="#90EE90" rx="5"/>
            <text x="0" y="5" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff">O₂ enters</text>
            <text x="0" y="18" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff">blood</text>
          </g>

          {/* Step 3 - Exhale */}
          <g className="cycle-step step3" transform="translate(120, 190)">
            <rect x="-35" y="-20" width="70" height="40" fill="#FFB6C1" rx="5"/>
            <text x="0" y="8" fontSize="13" textAnchor="middle" fontWeight="bold" fill="#fff">EXHALE</text>
          </g>

          {/* Step 4 - CO2 leaves */}
          <g className="cycle-step step4" transform="translate(120, 100)">
            <rect x="-35" y="-20" width="70" height="40" fill="#FF6B6B" rx="5"/>
            <text x="0" y="5" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff">CO₂ leaves</text>
            <text x="0" y="18" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff">lungs</text>
          </g>

          {/* Flow arrows */}
          <path d="M 245 100 L 220 100" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <path d="M 200 140 L 200 160" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <path d="M 155 190 L 180 190" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <path d="M 200 160 L 200 140" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>

          {/* Central message */}
          <text x="200" y="155" fontSize="14" textAnchor="middle" fontWeight="bold" fill="#333">24/7</text>

          {/* Bottom info */}
          <text x="200" y="260" fontSize="12" textAnchor="middle" fontWeight="bold" fill="#333">This cycle repeats continuously throughout your life!</text>
          <text x="200" y="280" fontSize="11" textAnchor="middle" fill="#555">Average: 12-20 breaths per minute</text>

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#333"/>
            </marker>
          </defs>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 300" className="scene-illustration">
          <rect width="400" height="300" fill="#E0F6FF" rx="10"/>
          <text x="200" y="150" fontSize="16" textAnchor="middle" fill="#666">Scene Not Found</text>
        </svg>
      );
  }
};

export default BreathingMechanismDemo;

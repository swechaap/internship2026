import React, { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, Star, Heart, Clock, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

// --- GAME DATA ---
const LEVEL_1_ITEMS = [
  { id: '1_1', name: 'Iron', symbol: 'Fe', category: 'metal', desc: 'A heavy, strong silvery metal.', fact: 'Iron is the most common element on Earth by mass and makes up much of Earth\'s outer and inner core.' },
  { id: '1_2', name: 'Sulfur', symbol: 'S', category: 'nonmetal', desc: 'A bright yellow crystalline solid.', fact: 'Sulfur is a non-metal that burns with a blue flame and smells like rotten eggs when combined with hydrogen.' },
  { id: '1_3', name: 'Copper', symbol: 'Cu', category: 'metal', desc: 'A reddish-gold metallic conductor.', fact: 'Copper has been used for thousands of years because it is malleable and conducts electricity extremely well.' },
  { id: '1_4', name: 'Oxygen', symbol: 'O', category: 'nonmetal', desc: 'A colorless gas vital for life.', fact: 'Oxygen is highly reactive and forms compounds easily, making up about 21% of Earth\'s atmosphere.' },
  { id: '1_5', name: 'Gold', symbol: 'Au', category: 'metal', desc: 'A precious, dense yellow metal.', fact: 'Gold is extremely malleable; a single gram can be beaten into a sheet of one square meter!' },
  { id: '1_6', name: 'Nitrogen', symbol: 'N', category: 'nonmetal', desc: 'A gas that makes up most of the air.', fact: 'Nitrogen gas is relatively inert and makes up 78% of the air we breathe.' },
  { id: '1_7', name: 'Aluminium', symbol: 'Al', category: 'metal', desc: 'A lightweight, silvery metal.', fact: 'Aluminium does not rust easily because it forms a protective oxide layer when exposed to air.' },
  { id: '1_8', name: 'Hydrogen', symbol: 'H', category: 'nonmetal', desc: 'The simplest and lightest gas.', fact: 'Hydrogen is the most abundant chemical substance in the Universe, making up 75% of all baryonic mass.' },
  { id: '1_9', name: 'Silver', symbol: 'Ag', category: 'metal', desc: 'A shiny metal with high conductivity.', fact: 'Silver has the highest electrical conductivity, thermal conductivity, and reflectivity of any metal.' },
  { id: '1_10', name: 'Carbon', symbol: 'C', category: 'nonmetal', desc: 'Exist as coal, diamonds, and graphite.', fact: 'Carbon is the basis of organic chemistry and is found in all known cellular life.' },
  { id: '1_11', name: 'Chlorine', symbol: 'Cl', category: 'nonmetal', desc: 'A smelly green-yellow gas.', fact: 'Chlorine is a halogen used to disinfect drinking water and sanitize swimming pools.' },
  { id: '1_12', name: 'Phosphorus', symbol: 'P', category: 'nonmetal', desc: 'A highly reactive waxy solid.', fact: 'Phosphorus is a non-metal that glow in the dark when exposed to oxygen, which gave it its name (meaning "light-bearer").' }
];

const LEVEL_2_ITEMS = [
  { id: '2_1', name: 'Conducts Electricity', category: 'metal', desc: 'Allows electrons to flow freely.', fact: 'Metals have a "sea of mobile electrons" that carry electric currents easily.' },
  { id: '2_2', name: 'Brittle', category: 'nonmetal', desc: 'Breaks or shatters easily when hit.', fact: 'Non-metals lack metallic bonding, so force causes their crystal structures to snap rather than bend.' },
  { id: '2_3', name: 'Lustrous', category: 'metal', desc: 'Shiny and reflects light beautifully.', fact: 'Metals reflect light because their free electrons absorb and re-emit light instantly.' },
  { id: '2_4', name: 'Poor Conductor', category: 'nonmetal', desc: 'Blocks electricity and heat flow.', fact: 'Non-metals hold onto their electrons tightly, making them excellent thermal and electrical insulators.' },
  { id: '2_5', name: 'Malleable', category: 'metal', desc: 'Can be hammered into thin sheets.', fact: 'Metallic bonds allow atoms to slide past each other without breaking, allowing metals to shape easily.' },
  { id: '2_6', name: 'Dull Appearance', category: 'nonmetal', desc: 'Matte, powdery, or non-reflective.', fact: 'Most solid non-metals absorb light rather than reflecting it, leading to a dull or chalky look.' },
  { id: '2_7', name: 'Sonorous', category: 'metal', desc: 'Makes a deep ringing sound when struck.', fact: 'Because of their elastic crystalline structure, metals vibrate and sound rings out when hit.' },
  { id: '2_8', name: 'Non-Sonorous', category: 'nonmetal', desc: 'Makes a dull thud sound when struck.', fact: 'Non-metals absorb kinetic energy, resulting in a short, flat sound rather than a chime.' },
  { id: '2_9', name: 'Good Heat Conductor', category: 'metal', desc: 'Transfers warmth very quickly.', fact: 'Metals are used in cooking pans because their particles transfer thermal energy rapidly.' },
  { id: '2_10', name: 'Fragile / Soft', category: 'nonmetal', desc: 'Easy to crush or scratch.', fact: 'Solid non-metals like sulfur can be ground into a powder with simple pressure.' }
];

const LEVEL_3_ITEMS = [
  { id: '3_1', name: 'Copper Wire', emoji: '🔌', category: 'metal', desc: 'Flexible wire inside household cables.', fact: 'Copper is drawn into thin wires because it is highly ductile and safe for home wiring.' },
  { id: '3_2', name: 'Pencil Lead', emoji: '✏️', category: 'nonmetal', desc: 'Writing core made of graphite.', fact: 'Pencil lead is actually graphite (carbon). It is soft and leaves marks on paper because its layers slide off.' },
  { id: '3_3', name: 'Iron Nail', emoji: '📌', category: 'metal', desc: 'Hard spike used in building furniture.', fact: 'Iron nails are strong but will rust over time if exposed to water and oxygen.' },
  { id: '3_4', name: 'Lump of Coal', emoji: '🪨', category: 'nonmetal', desc: 'Black fossil fuel dug from the ground.', fact: 'Coal is mostly carbon. When burned, it releases energy but also emits carbon dioxide.' },
  { id: '3_5', name: 'Aluminum Foil', emoji: '✉️', category: 'metal', desc: 'Shiny wrapper for wrapping lunch.', fact: 'Aluminum foil is thin because aluminium is highly malleable, keeping food hot and fresh.' },
  { id: '3_6', name: 'Glass Bottle', emoji: '🍾', category: 'nonmetal', desc: 'Rigid vessel for liquids.', fact: 'Glass is made from silica (sand), a non-metal compound that acts as a perfect electrical insulator.' },
  { id: '3_7', name: 'Steel Spoon', emoji: '🥄', category: 'metal', desc: 'Sturdy eating utensil.', fact: 'Steel is an alloy of iron and carbon, combining metal properties with enhanced rust resistance.' },
  { id: '3_8', name: 'Rubber Band', emoji: '🎗️', category: 'nonmetal', desc: 'Stretchy loop used to bundle objects.', fact: 'Rubber is a non-metal polymer that resists electric shocks, making it a safety shield.' },
  { id: '3_9', name: 'Silver Ring', emoji: '💍', category: 'metal', desc: 'Shiny metallic band of jewelry.', fact: 'Silver rings reflect 95% of light, making them the most reflective precious metal jewelry.' },
  { id: '3_10', name: 'Plastic Cup', emoji: '🥤', category: 'nonmetal', desc: 'Disposable cup for cold water.', fact: 'Plastics are synthetic polymers derived from petroleum (carbon-based), which is a non-metal.' },
  { id: '3_11', name: 'Paper Notepad', emoji: '📄', category: 'nonmetal', desc: 'Thin sheets for writing down formulas.', fact: 'Paper is made of organic cellulose fiber, which is composed of carbon, hydrogen, and oxygen.' }
];

export default function GameScreen({ selectedLevel, setScreen, onLevelComplete }) {
  // Select deck based on level
  const originalDeck = (() => {
    switch (selectedLevel) {
      case 1: return LEVEL_1_ITEMS;
      case 2: return LEVEL_2_ITEMS;
      case 3: return LEVEL_3_ITEMS;
      default: return LEVEL_1_ITEMS;
    }
  })();

  // Shuffle deck on load
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Animation states
  const [shaking, setShaking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasErroredThisCard, setHasErroredThisCard] = useState(false);
  const [firstTryCorrects, setFirstTryCorrects] = useState(0);

  // Shuffle items on start
  useEffect(() => {
    const shuffled = [...originalDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers(0);
    setAttempts(0);
    setTime(0);
    setLives(3);
    setFirstTryCorrects(0);
  }, [selectedLevel]);

  // Game timer
  useEffect(() => {
    if (showFeedback || currentIndex >= deck.length || lives <= 0) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, deck, showFeedback, lives]);

  const activeItem = deck[currentIndex];

  const handleSort = (choice) => {
    if (!activeItem || showFeedback) return;
    setAttempts(prev => prev + 1);

    if (choice === activeItem.category) {
      // CORRECT ANSWER
      audio.playCorrect();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 }
      });

      setScore(prev => prev + 10);
      setLastCorrect({ ...activeItem });
      setShowFeedback(true);
      setShowHint(false);

      if (!hasErroredThisCard) {
        setFirstTryCorrects(prev => prev + 1);
      }
    } else {
      // WRONG ANSWER
      audio.playWrong();
      setWrongAnswers(prev => prev + 1);
      setLives(prev => prev - 1);
      setShaking(true);
      setHasErroredThisCard(true);
      
      // Auto reset shaking class after 500ms
      setTimeout(() => {
        setShaking(false);
      }, 500);

      // Trigger level fail if out of lives
      if (lives - 1 <= 0) {
        // Delay complete call to let shake animation finish
        setTimeout(() => {
          handleGameOver(false);
        }, 600);
      }
    }
  };

  const handleContinue = () => {
    audio.playClick();
    setShowFeedback(false);
    setHasErroredThisCard(false);

    if (currentIndex + 1 >= deck.length) {
      // Game completed!
      handleGameOver(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleGameOver = (isSuccess) => {
    const finalAccuracy = Math.round((firstTryCorrects / deck.length) * 100);
    // Include 50 bonus points if perfect level (100% accuracy on first try)
    const bonus = finalAccuracy === 100 ? 50 : 0;
    const finalScore = score + (isSuccess ? 10 : 0) + bonus; // Add final card points if successful

    onLevelComplete(selectedLevel, finalScore, finalAccuracy, time, isSuccess);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleBack = () => {
    audio.playClick();
    setScreen('levels');
  };

  if (!activeItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-t-purple-theme border-white/10 animate-spin"></div>
      </div>
    );
  }

  // Calculate Progress Percent
  const progressPercent = Math.round((currentIndex / deck.length) * 100);

  // Helper labels based on level
  const leftLabel = selectedLevel === 2 ? 'METAL PROPERTIES' : selectedLevel === 3 ? 'METAL OBJECTS' : 'METALS';
  const rightLabel = selectedLevel === 2 ? 'NON-METAL PROPERTIES' : selectedLevel === 3 ? 'NON-METAL OBJECTS' : 'NON-METALS';

  // Level Descriptions
  const levelTitle = selectedLevel === 1 
    ? '🌱 Level 1: Basic Classification' 
    : selectedLevel === 2 
    ? '🌿 Level 2: Property Matching' 
    : '🌳 Level 3: Real-Life Objects';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      
      {/* Top HUD (Status Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
        
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          Quit Level
        </button>

        <h2 className="text-sm sm:text-base font-black text-slate-100 uppercase tracking-wider">
          {levelTitle}
        </h2>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-sm font-bold bg-cyan-950/20 px-3 py-1 rounded-xl border border-cyan-500/20">
            <Clock className="w-4 h-4" />
            {formatTime(time)}
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1 text-red-500 bg-red-950/20 px-3 py-1 rounded-xl border border-red-500/20">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-current text-red-500' : 'text-slate-700'}`}
              />
            ))}
          </div>

          {/* Current Score */}
          <div className="text-xs font-black uppercase text-green-success bg-green-950/20 px-3 py-1 rounded-xl border border-green-500/20">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
          <span>Progress</span>
          <span>{currentIndex} / {deck.length} Items sorted</span>
        </div>
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-theme via-indigo-500 to-cyan-theme transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Drag-and-Drop Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-4">
        
        {/* Left Dropzone (Metal) */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleSort('metal')}
          onClick={() => handleSort('metal')}
          className="glass-panel-neon-cyan rounded-3xl border-2 border-dashed border-cyan-500/20 hover:border-cyan-400/80 hover:bg-cyan-950/10 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer min-h-[180px] md:min-h-[300px] group"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-all duration-300 glow-shadow-cyan mb-4">
            <span className="text-3xl">🧲</span>
          </div>
          <h3 className="text-xl font-black text-cyan-400 tracking-wider uppercase">
            {leftLabel}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest hidden md:block">
            Drag item here or Click
          </p>
        </div>

        {/* Center Draggable Card Container */}
        <div className="flex flex-col items-center justify-center gap-4 min-h-[250px]">
          {currentIndex < deck.length && (
            <div
              draggable={!showFeedback}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', activeItem.id);
                // Play soft pick sound
                audio.playClick();
              }}
              className={`w-full max-w-[260px] aspect-[4/5] glass-panel rounded-3xl border-2 border-purple-500/20 flex flex-col justify-between p-6 text-center select-none cursor-grab active:cursor-grabbing shadow-2xl relative overflow-hidden transition-all duration-300 ${
                shaking ? 'animate-shake border-red-500' : ''
              } ${showFeedback ? 'pointer-events-none opacity-50' : 'hover:scale-105 hover:border-purple-400/80 hover:shadow-purple-500/10'}`}
            >
              {/* Card Header (Chemical Symbol or Emoji) */}
              <div className="flex justify-center items-center h-28 relative">
                {activeItem.symbol ? (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-theme/40 to-cyan-500/20 flex flex-col items-center justify-center border border-purple-400/30 text-white font-mono shadow-lg relative group">
                    <span className="text-3xl font-black leading-none">{activeItem.symbol}</span>
                    <span className="text-[9px] font-bold text-cyan-400 mt-1 uppercase tracking-widest">Element</span>
                  </div>
                ) : activeItem.emoji ? (
                  <div className="text-6xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    {activeItem.emoji}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-3xl">
                    💡
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-lg font-black text-slate-100 tracking-wide uppercase">
                  {activeItem.name}
                </h4>
                <p className="text-xs text-slate-400 leading-normal font-medium">
                  {activeItem.desc}
                </p>
              </div>

              {/* Card footer (Hint Toggle / Drag descriptor) */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
                {showHint ? (
                  <div className="p-2 rounded-xl bg-purple-950/20 border border-purple-500/10 text-[10px] text-purple-300 font-bold text-left animate-fadeIn">
                    ⚡ {activeItem.category === 'metal' 
                      ? 'Hint: Conducts electricity well and is strong.' 
                      : 'Hint: Insulating materials or gases that shatter under hammer.'}
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audio.playClick();
                      setShowHint(true);
                    }}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-black uppercase tracking-widest cursor-pointer hover:underline"
                  >
                    Need a Hint?
                  </button>
                )}
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest pointer-events-none hidden md:block">
                  Drag Left or Right
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Dropzone (Non-Metal) */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleSort('nonmetal')}
          onClick={() => handleSort('nonmetal')}
          className="glass-panel-neon rounded-3xl border-2 border-dashed border-purple-500/20 hover:border-purple-400/80 hover:bg-purple-950/10 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer min-h-[180px] md:min-h-[300px] group"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-all duration-300 glow-shadow-purple mb-4">
            <span className="text-3xl">☁️</span>
          </div>
          <h3 className="text-xl font-black text-purple-400 tracking-wider uppercase">
            {rightLabel}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest hidden md:block">
            Drag item here or Click
          </p>
        </div>

      </div>

      {/* Mobile Sorting Controls (Big buttons below for touch screens) */}
      <div className="md:hidden flex flex-col gap-3 mt-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
          Touch Sorting Controls:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSort('metal')}
            className="py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-wider glow-shadow-cyan active:scale-95 transition-all cursor-pointer"
          >
            ← {selectedLevel === 2 ? 'Metal Property' : selectedLevel === 3 ? 'Metal Object' : 'Metal'}
          </button>
          
          <button
            onClick={() => handleSort('nonmetal')}
            className="py-4 rounded-2xl bg-purple-theme hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wider glow-shadow-purple active:scale-95 transition-all cursor-pointer"
          >
            {selectedLevel === 2 ? 'Non-Metal Prop' : selectedLevel === 3 ? 'Non-Metal Obj' : 'Non-Metal'} →
          </button>
        </div>
      </div>

      {/* Correct/Wrong Answer Feedback Modal Overlay */}
      {showFeedback && lastCorrect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel-neon rounded-3xl border-2 border-green-500/40 p-6 flex flex-col items-center text-center gap-6 animate-fadeIn">
            
            {/* Celebration Emblem */}
            <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-success flex items-center justify-center glow-shadow-green animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-green-success uppercase tracking-wider glow-text-green">
                Excellent! 🎉
              </h3>
              <p className="text-base text-slate-200">
                <strong className="text-white uppercase font-black font-mono">
                  {lastCorrect.name}
                </strong> is a{' '}
                <strong className="text-cyan-400 uppercase font-black">
                  {lastCorrect.category === 'metal' ? 'Metal' : 'Non-Metal'}
                </strong>!
              </p>
              <div className="text-xs font-black text-green-400 mt-1 uppercase tracking-widest">
                +10 Points Unlocked
              </div>
            </div>

            {/* Fun Fact Section */}
            <div className="w-full p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-left">
              <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Scientific Fun Fact
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {lastCorrect.fact}
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:scale-103 transition-all duration-300 shadow-lg shadow-green-500/20 cursor-pointer"
            >
              Continue Challenge
            </button>

          </div>
        </div>
      )}

      {/* Game Over modal (If failed out of lives) */}
      {lives <= 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl border-2 border-red-500/40 p-6 flex flex-col items-center text-center gap-6 animate-fadeIn">
            
            <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/10">
              <AlertTriangle className="w-12 h-12 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-red-500 uppercase tracking-wider">
                MISSION FAILED
              </h3>
              <p className="text-sm text-slate-300 font-medium">
                You ran out of lives in this level! Let's try again to lock in a higher score.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={handleBack}
                className="py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Levels Selection
              </button>
              
              <button
                onClick={() => {
                  audio.playClick();
                  // Re-shuffle to retry
                  const shuffled = [...originalDeck].sort(() => Math.random() - 0.5);
                  setDeck(shuffled);
                  setCurrentIndex(0);
                  setScore(0);
                  setWrongAnswers(0);
                  setAttempts(0);
                  setTime(0);
                  setLives(3);
                  setFirstTryCorrects(0);
                  setHasErroredThisCard(false);
                }}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all glow-shadow-orange cursor-pointer"
              >
                Try Again
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}

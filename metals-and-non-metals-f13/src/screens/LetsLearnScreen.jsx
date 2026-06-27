import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BookOpen, Compass, Award, Sparkles, Star, ChevronLeft, ChevronRight,
  Flame, Zap, HelpCircle, RefreshCw, Volume2, Search, ArrowRight, Check,
  Download, Play, CheckCircle2, AlertCircle
} from 'lucide-react';
import { audio } from '../utils/audio';
import { saveGameState } from '../utils/storage';
import { metalsData, nonMetalsData } from '../utils/learnData';

export default function LetsLearnScreen({ setScreen, gameState, setGameState }) {
  // Navigation & Progress State
  const [activePage, setActivePage] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedNonMetal, setSelectedNonMetal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Interactive Animations states
  const [circuitClosed, setCircuitClosed] = useState(false);
  const [heatActive, setHeatActive] = useState(false);
  const [heatProgress, setHeatProgress] = useState(0);
  const [lustreFlash, setLustreFlash] = useState(false);
  const [malleableStrikes, setMalleableStrikes] = useState(0);
  const [ductileStretch, setDuctileStretch] = useState(0);
  const [sonorousRings, setSonorousRings] = useState([]);
  
  // Non-metal property states
  const [nonMetalCircuitClosed, setNonMetalCircuitClosed] = useState(false);
  const [brittleStrikes, setBrittleStrikes] = useState(0);
  const [nonSonorousStrikes, setNonSonorousStrikes] = useState(0);
  const [densityTest, setDensityTest] = useState(null); // 'iron' or 'charcoal' or 'wood'
  const [fragileCracked, setFragileCracked] = useState(false);
  const [molecularTemp, setMolecularTemp] = useState(30);

  // Split view comparison table selected row
  const [compareRow, setCompareRow] = useState('appearance');

  // Real-life objects modal selection
  const [selectedObject, setSelectedObject] = useState(null);

  // Virtual Science Lab states
  const [labTab, setLabTab] = useState('circuit');
  const [labCircuitItem, setLabCircuitItem] = useState(null);
  const [labCircuitTested, setLabCircuitTested] = useState(false);
  const [labHeatSpoons, setLabHeatSpoons] = useState(false);
  const [labHeatTemp, setLabHeatTemp] = useState({ silver: 25, wood: 25, plastic: 25 });
  const [labSoundItem, setLabSoundItem] = useState(null);
  const [labSoundWave, setLabSoundWave] = useState(0);
  const [labHammerItem, setLabHammerItem] = useState(null);
  const [labHammerStrikes, setLabHammerStrikes] = useState(0);
  const [labFinishedTasks, setLabFinishedTasks] = useState([]);

  // Local persistent student learning progress
  const [learningProgress, setLearningProgress] = useState({
    completedQuizzes: [],
    stars: 0,
    labCompleted: false
  });

  // Load progress from Local Storage
  useEffect(() => {
    const key = `lets_learn_progress_${gameState.playerName || 'student'}`;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        setLearningProgress(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse learning progress', e);
      }
    }
  }, [gameState.playerName]);

  // Save progress helper
  const saveProgress = (updated) => {
    setLearningProgress(updated);
    const key = `lets_learn_progress_${gameState.playerName || 'student'}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Sound triggers
  const playClick = () => audio.playClick();
  const playCorrect = () => audio.playCorrect();
  const playWrong = () => audio.playWrong();
  const playUnlock = () => audio.playUnlock();

  // Dr. Atom Expression Generator
  const getDrAtomMessage = () => {
    switch (activePage) {
      case 1:
        return `Hello, future scientist! I am Dr. Atom, your guide. Complete all the quizzes below to unlock the "Science Explorer Badge"! 🧭`;
      case 2:
        return `Metals are shiny and strong. Check out the 3D rotating metal cube! It shines under the light! ✨`;
      case 3:
        return `Tap on each card to see how metals behave in our experiments! Can you make the lightbulb glow? ⚡`;
      case 4:
        return `Non-metals form the molecules of life, gases, and coal. Drag the temperature slider to heat up the gas molecules! 🌋`;
      case 5:
        return `Unlike metals, solid non-metals are brittle and snap! Strike the sulfur block and see what happens! 🔨`;
      case 6:
        return `Here is a side-by-side battle of properties! Click the rows in the table to run the test and compare. ⚖️`;
      case 7:
        return `Can you find which household items are metallic? Click on any object to inspect its chemistry properties! 🏡`;
      case 8:
        return `Welcome to the Virtual Science Lab! Run the 4 simulations on the lab bench to test physical behaviors! 🧪`;
      case 9:
        return `I've cataloged 50 different metals! Search them, click to zoom in, and look at their animated atomic Bohr electron shells! ⚛️`;
      case 10:
        return `Here are 50 non-metals and molecules! Check out their chemical formulas and atomic configurations. 🌎`;
      default:
        return `Congratulations! You've finished the course. Let's claim your Scientist Badge! 🏆`;
    }
  };

  // Quiz state manager
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);

  const quizzes = {
    2: {
      question: "Which of the following is a key physical characteristic of metals?",
      options: [
        "They are brittle and crumble easily",
        "They are shiny (lustrous) and are good conductors",
        "They are lightweight gases at room temperature",
        "They are poor conductors of electricity"
      ],
      correctIndex: 1,
      explanation: "Metals are characterized by their shiny (lustrous) appearance and high conductivity of heat and electricity.",
      id: "metals_intro"
    },
    3: {
      question: "Which property allows copper metal to be drawn out into long, thin wires?",
      options: [
        "Malleability",
        "Sonority",
        "Ductility",
        "Low Density"
      ],
      correctIndex: 2,
      explanation: "Ductility is the physical property that allows a material to be stretched into thin wires without breaking.",
      id: "metals_properties"
    },
    4: {
      question: "Which of the following is a non-metal gas that makes up about 78% of the Earth's atmosphere?",
      options: [
        "Oxygen",
        "Hydrogen",
        "Carbon Dioxide",
        "Nitrogen"
      ],
      correctIndex: 3,
      explanation: "Nitrogen gas (N2) is a diatomic non-metal that forms 78% of our atmosphere. Oxygen is about 21%.",
      id: "non_metals_intro"
    },
    5: {
      question: "If you strike a solid piece of sulfur with a steel hammer, what will occur?",
      options: [
        "It will flatten into a thin sheet",
        "It will stretch into a long wire",
        "It will shatter into small brittle fragments",
        "It will ring like a church bell"
      ],
      correctIndex: 2,
      explanation: "Solid non-metals like sulfur and carbon are brittle. When struck with a hammer, they break or shatter.",
      id: "non_metals_properties"
    },
    6: {
      question: "How do metals and non-metals differ regarding electrical conductivity?",
      options: [
        "Metals block electric flow; non-metals let it pass",
        "Metals are excellent conductors; non-metals are generally poor conductors (insulators)",
        "Both conduct electricity equally well",
        "Only noble gases can conduct electricity"
      ],
      correctIndex: 1,
      explanation: "Metals contain free-moving electrons that conduct electricity. Non-metals hold their electrons tightly and act as insulators (except graphite).",
      id: "comparison"
    },
    7: {
      question: "Why is aluminium foil commonly used to wrap chocolate and food items?",
      options: [
        "Because it is brittle and breaks easily",
        "Because it is highly malleable, light, and non-toxic",
        "Because it conducts electricity to shock germs",
        "Because it is a sonorous bell"
      ],
      correctIndex: 1,
      explanation: "Aluminium is highly malleable, meaning it can be rolled into paper-thin sheets of foil which protect food.",
      id: "real_life"
    },
    9: {
      question: "Which transition metal is famous for being liquid at room temperature?",
      options: [
        "Gallium",
        "Sodium",
        "Mercury",
        "Platinum"
      ],
      correctIndex: 2,
      explanation: "Mercury (atomic symbol Hg, atomic number 80) is the only metal that remains liquid under standard room temperature and pressure.",
      id: "metals_library"
    },
    10: {
      question: "Why is graphite (carbon) unique compared to other non-metals?",
      options: [
        "It is harder than diamond",
        "It reacts explosively with water",
        "It is a non-metal that can conduct electricity and is very soft",
        "It is a liquid gas at room temperature"
      ],
      correctIndex: 3,
      explanation: "Graphite is an allotrope of carbon with layered free electrons, allowing it to conduct electricity, unlike almost all other non-metals.",
      id: "non_metals_library"
    }
  };

  const handleAnswerClick = (idx) => {
    if (quizSubmitted) return;
    playClick();
    setSelectedAnswer(idx);
  };

  const handleQuizSubmit = (quizId, pageNum) => {
    if (selectedAnswer === null || quizSubmitted) return;
    
    const quiz = quizzes[pageNum];
    const isCorrect = selectedAnswer === quiz.correctIndex;
    
    setQuizSubmitted(true);
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      playCorrect();
      
      // Award stars if not already completed
      if (!learningProgress.completedQuizzes.includes(quiz.id)) {
        const updatedQuizzes = [...learningProgress.completedQuizzes, quiz.id];
        const newStars = learningProgress.stars + 10;
        
        saveProgress({
          ...learningProgress,
          completedQuizzes: updatedQuizzes,
          stars: newStars
        });
      }
    } else {
      playWrong();
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizIsCorrect(false);
  };

  // When activePage changes, reset quiz state and animation states
  useEffect(() => {
    resetQuiz();
    // Reset properties page 3 states
    setCircuitClosed(false);
    setHeatActive(false);
    setHeatProgress(0);
    setLustreFlash(false);
    setMalleableStrikes(0);
    setDuctileStretch(0);
    setSonorousRings([]);
    
    // Reset page 5 states
    setNonMetalCircuitClosed(false);
    setBrittleStrikes(0);
    setNonSonorousStrikes(0);
    setDensityTest(null);
    setFragileCracked(false);

    // Reset details selections
    setSelectedMetal(null);
    setSelectedNonMetal(null);
  }, [activePage]);

  // Malleability strike trigger
  const triggerMalleableStrike = () => {
    if (malleableStrikes >= 3) return;
    playClick();
    setMalleableStrikes(prev => prev + 1);
  };

  // Sonorous strike trigger
  const triggerSonorousRing = () => {
    playClick();
    const id = Date.now();
    setSonorousRings(prev => [...prev, id]);
    setTimeout(() => {
      setSonorousRings(prev => prev.filter(r => r !== id));
    }, 1200);
  };

  // Brittle strike trigger
  const triggerBrittleStrike = () => {
    if (brittleStrikes >= 2) return;
    playClick();
    setBrittleStrikes(prev => prev + 1);
  };

  // Non-sonorous strike trigger
  const triggerNonSonorousStrike = () => {
    playClick();
    setNonSonorousStrikes(prev => prev + 1);
    setTimeout(() => {
      setNonSonorousStrikes(0);
    }, 600);
  };

  // Heat Conduction Rod simulation ticks
  useEffect(() => {
    let timer;
    if (heatActive) {
      timer = setInterval(() => {
        setHeatProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    } else {
      setHeatProgress(0);
    }
    return () => clearInterval(timer);
  }, [heatActive]);

  // Virtual lab heating timer
  useEffect(() => {
    let timer;
    if (labHeatSpoons) {
      timer = setInterval(() => {
        setLabHeatTemp(prev => {
          const newSilver = Math.min(80, prev.silver + 4);
          const newWood = Math.min(28, prev.wood + 0.3);
          const newPlastic = Math.min(26, prev.plastic + 0.1);
          
          if (newSilver >= 80 && newWood >= 28 && newPlastic >= 26) {
            clearInterval(timer);
            if (!labFinishedTasks.includes('heat')) {
              setLabFinishedTasks(prevTasks => [...prevTasks, 'heat']);
            }
          }
          return { silver: newSilver, wood: newWood, plastic: newPlastic };
        });
      }, 200);
    } else {
      setLabHeatTemp({ silver: 25, wood: 25, plastic: 25 });
    }
    return () => clearInterval(timer);
  }, [labHeatSpoons]);

  // Virtual Lab Circuit tester logic
  const handleLabCircuitTest = (item) => {
    playClick();
    setLabCircuitItem(item);
    setLabCircuitTested(true);
    
    // Check if task completed
    const conducts = item === 'nail' || item === 'key' || item === 'graphite';
    if (conducts) {
      playCorrect();
    }
    
    if (!labFinishedTasks.includes('circuit')) {
      setLabFinishedTasks(prev => [...prev, 'circuit']);
    }
  };

  // Virtual Lab Sound tester
  const handleLabSoundTest = (item) => {
    playClick();
    setLabSoundItem(item);
    setLabSoundWave(prev => prev + 1);
    setTimeout(() => {
      setLabSoundWave(0);
    }, 1000);
    
    if (!labFinishedTasks.includes('sound')) {
      setLabFinishedTasks(prev => [...prev, 'sound']);
    }
  };

  // Virtual Lab Hammer test
  const handleLabHammerTest = (item) => {
    playClick();
    setLabHammerItem(item);
    setLabHammerStrikes(prev => {
      const next = prev + 1;
      if (next >= 3) {
        if (!labFinishedTasks.includes('hammer')) {
          setLabFinishedTasks(prevTasks => [...prevTasks, 'hammer']);
        }
      }
      return next;
    });
  };

  // Trigger Badge Award upon Completion
  const triggerCompletion = () => {
    const isExplorerUnlocked = gameState.unlockedAchievements?.includes('science_explorer');
    
    if (!isExplorerUnlocked) {
      // Unlock badge in global state
      const updatedAchievements = [...(gameState.unlockedAchievements || []), 'science_explorer'];
      const updatedState = {
        ...gameState,
        unlockedAchievements: updatedAchievements
      };
      setGameState(updatedState);
      saveGameState(updatedState);
      playUnlock();
      
      // Trigger canvas confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    if (activePage === 11) {
      triggerCompletion();
    }
  }, [activePage]);

  // Exporter of Science Notes
  const handleDownloadNotes = () => {
    playClick();
    const notesContent = `# METAL VS NON-METAL STUDY GUIDE
Designed for Class 6–8 Scientists
Author: Dr. Atom (Digital Lab Director)
Student: ${gameState.playerName || 'Explorer'}

---

## 1. WHAT ARE METALS?
Metals are elements located on the left and middle of the periodic table.
- Physical State: Usually solids at room temperature (except Mercury, which is liquid).
- Key characteristics: Shiny, high density, high melting point, and strong.
- Examples: Iron (Fe), Copper (Cu), Gold (Au), Silver (Ag), Aluminium (Al), Zinc (Zn).

## 2. PROPERTIES OF METALS
- Electrical Conductivity: Metals conduct electricity due to free-moving electrons.
- Heat Conductivity: Metals conduct heat rapidly (high thermal conductivity).
- Lustre: Metals have a shiny surface that reflects light.
- Malleability: Metals can be beaten/hammered into thin sheets (e.g., aluminium foil).
- Ductility: Metals can be drawn/stretched into thin wires (e.g., copper wiring).
- Sonorous: Metals produce a clear ringing sound when struck (e.g., school bells).

---

## 3. WHAT ARE NON-METALS?
Non-metals occupy the right side of the periodic table.
- Physical State: Exist as solids, liquids (Bromine), or gases at room temperature.
- Key characteristics: Dull, lightweight, brittle when solid, and low density.
- Examples: Oxygen (O), Nitrogen (N), Carbon (C), Sulfur (S), Helium (He).

## 4. PROPERTIES OF NON-METALS
- Electrical Insulation: Non-metals are poor conductors (insulators), except Graphite.
- Thermal Insulation: They block heat flow.
- Dull Appearance: Non-metals do not reflect light; they are matte.
- Brittleness: Solid non-metals shatter or crumble when struck (cannot be hammered).
- Non-Sonorous: They make a dull "thud" sound when hit.
- Low Density: They are lightweight and often float on water.

---

## 5. COMPARISON MATRIX
| Feature | Metals | Non-Metals |
|---|---|---|
| Appearance | Shiny (Lustrous) | Dull (Matte) |
| Conductivity | Excellent (Heat & Electricity) | Poor (Insulators, except Graphite) |
| Malleability | Malleable (Flatten into sheets) | Brittle (Shatters when hammered) |
| Ductility | Ductile (Stretches into wires) | Non-ductile |
| Sound | Sonorous (Rings loudly) | Non-sonorous (Dull thud) |
| Density | High Density (Usually sinks) | Low Density (Lightweight, floats) |

---
Dr. Atom says: "Keep exploring the secrets of Chemistry!"
`;

    const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Metals_and_NonMetals_Study_Notes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Search & Filtered lists for image library elements
  const filteredMetals = useMemo(() => {
    return metalsData.filter(metal => {
      const matchSearch = metal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          metal.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'All' || metal.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, filterCategory]);

  const filteredNonMetals = useMemo(() => {
    return nonMetalsData.filter(nm => {
      const matchSearch = nm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          nm.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'All' || nm.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, filterCategory]);

  // Categories list
  const metalCategories = ['All', 'Alkali Metal', 'Alkaline Earth', 'Transition Metal', 'Post-Transition', 'Lanthanide', 'Alloy'];
  const nonMetalCategories = ['All', 'Reactive Nonmetal', 'Halogen', 'Noble Gas', 'Metalloid', 'Compound', 'Polymer', 'Acid'];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 relative z-10 flex flex-col gap-6 text-slate-100">
      
      {/* Module Title / Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20 animate-pulse">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Interactive Science Lab</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white uppercase">Let's Learn Chemistry!</h2>
          </div>
        </div>

        {/* Stars indicator & progress bar */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-400/20 text-yellow-400 font-black text-sm">
            <Star className="w-4 h-4 fill-current animate-bounce" />
            <span>{learningProgress.stars} STARS</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-black text-xs uppercase tracking-wider">
            <span>Progress: {learningProgress.completedQuizzes.length}/8 Completed</span>
          </div>
          
          <button
            onClick={() => { playClick(); setScreen('home'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            Exit Lab
          </button>
        </div>
      </div>

      {/* Main Grid: Dr. Atom speech bubble & Study desk layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Dr. Atom guide & Page Pathway */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Dr. Atom Speech Panel */}
          <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-4 text-center items-center bg-gradient-to-b from-slate-950/60 to-slate-900/40 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            </div>
            
            {/* Dr. Atom Emoji Avatar with ring animations */}
            <div className="relative w-24 h-24 rounded-full bg-slate-900 border border-purple-500/30 flex items-center justify-center text-5xl select-none shadow-xl">
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-purple-500/10 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
              🧪👨‍🔬
            </div>
            
            <div className="flex flex-col gap-1 text-center">
              <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Guide: Dr. Atom</span>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-xs font-medium text-slate-300 leading-relaxed relative text-left">
                {getDrAtomMessage()}
                <div className="absolute left-1/2 bottom-full -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-slate-900/80"></div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Pathway */}
          <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-1.5 text-left max-h-[480px] overflow-y-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">Lesson Pathway</span>
            
            {[
              { num: 1, title: 'Let\'s Learn Home', icon: '🏠', id: 'home' },
              { num: 2, title: '1. What Are Metals?', icon: '🔩', id: 'metals_intro' },
              { num: 3, title: '2. Properties of Metals', icon: '✨', id: 'metals_properties' },
              { num: 4, title: '3. What Are Non-Metals?', icon: '🌿', id: 'non_metals_intro' },
              { num: 5, title: '4. Properties of Non-Metals', icon: '⚫', id: 'non_metals_properties' },
              { num: 6, title: '5. Side-by-Side Compare', icon: '⚖️', id: 'comparison' },
              { num: 7, title: '6. Real-Life Objects', icon: '🏡', id: 'real_life' },
              { num: 8, title: '7. Virtual Science Lab', icon: '🧪', id: 'lab' },
              { num: 9, title: '8. Metals Library', icon: '📸', id: 'metals_library' },
              { num: 10, title: '9. Non-Metals Library', icon: '🌎', id: 'non_metals_library' },
              { num: 11, title: '10. Explorer Badge', icon: '🏆', id: 'badge' }
            ].map(p => {
              const quizId = quizzes[p.num]?.id;
              const isCompleted = p.num === 1 || p.num === 8 || p.num === 11 
                ? (p.num === 8 ? labFinishedTasks.length >= 4 : p.num === 11 ? learningProgress.completedQuizzes.length >= 8 : true)
                : learningProgress.completedQuizzes.includes(quizId);
                
              const isActive = activePage === p.num;

              return (
                <button
                  key={p.num}
                  onClick={() => { playClick(); setActivePage(p.num); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 border-cyan-400 text-cyan-200 glow-shadow-cyan'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm select-none">{p.icon}</span>
                    <span className="truncate">{p.title}</span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-success shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Side: Primary Learning Panel */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 min-h-[580px] flex flex-col justify-between bg-slate-950/20 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>

            {/* Core Sub-Screen Render */}
            <div className="flex-1 w-full text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col gap-6"
                >

                  {/* Page 1: Home Dashboard */}
                  {activePage === 1 && (
                    <div className="flex flex-col gap-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-wide uppercase leading-tight">
                          Let's Learn About Metals and Non-Metals!
                        </h3>
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">Explore • Observe • Understand • Play</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                          <span className="text-4xl select-none">🔩</span>
                          <h4 className="text-lg font-black text-slate-200">The Shiny World of Metals</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Metals represent 80% of elements on Earth. Discover their physical powers: conduct electrical and heat signals, stretch into copper wire spools, flatten under steel forge hammers, and ring sonorous notes!
                          </p>
                          <button
                            onClick={() => { playClick(); setActivePage(2); }}
                            className="mt-2 self-start flex items-center gap-1 text-xs font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest cursor-pointer"
                          >
                            Explore Metals <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                          <span className="text-4xl select-none">🌿</span>
                          <h4 className="text-lg font-black text-slate-200">The Molecular World of Non-Metals</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Non-metals are essential for living systems. Explore the chemistry of carbon backbones, diatomic gases (oxygen we breathe, nitrogen around us), noble glowing neon, acids, and synthetic polymers like plastics.
                          </p>
                          <button
                            onClick={() => { playClick(); setActivePage(4); }}
                            className="mt-2 self-start flex items-center gap-1 text-xs font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest cursor-pointer"
                          >
                            Explore Non-Metals <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Pathways roadmap visual grid */}
                      <div className="glass-panel p-5 rounded-2xl border border-white/5">
                        <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-4">Interactive Lab Desk Pathway</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          {[
                            { num: 2, name: 'Metals Intro', emoji: '🔩' },
                            { num: 3, name: 'Metal Properties', emoji: '⚡' },
                            { num: 4, name: 'Non-Metals Intro', emoji: '🌿' },
                            { num: 5, name: 'Non-Metal Properties', emoji: '🔨' },
                            { num: 6, name: 'Side Comparison', emoji: '⚖️' },
                            { num: 7, name: 'Everyday Objects', emoji: '🏡' },
                            { num: 8, name: 'Virtual Science Lab', emoji: '🧪' },
                            { num: 11, name: 'Science Badge!', emoji: '🏆' }
                          ].map(step => (
                            <button
                              key={step.num}
                              onClick={() => { playClick(); setActivePage(step.num); }}
                              className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-400/50 hover:bg-slate-800/40 transition-all flex flex-col items-center gap-1 cursor-pointer group"
                            >
                              <span className="text-2xl group-hover:scale-110 transition-transform">{step.emoji}</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider truncate max-w-full">{step.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 2: What Are Metals? */}
                  {activePage === 2 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 1</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">What is a Metal?</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 flex flex-col gap-4">
                          <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            <strong>Metals</strong> are materials that are usually shiny (lustrous), strong (tensile), and excellent conductors of both heat and electricity.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Under standard chemistry conditions, they are solid blocks (except Mercury, which flows as liquid). They form structural frames for our skyscrapers, engine gears for vehicles, transmission grids for electricity, and cooking pans for our food!
                          </p>

                          {/* 8 Elements Gallery list */}
                          <div className="mt-2">
                            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider mb-2">Key Metals Gallery</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { s: 'Fe', n: 'Iron', a: 26, emoji: '⛓️', fact: 'Used in constructing buildings & red blood cell hemoglobin.' },
                                { s: 'Cu', n: 'Copper', a: 29, emoji: '🔌', fact: 'Used in electrical wiring because it conducts electricity incredibly well!' },
                                { s: 'Au', n: 'Gold', a: 79, emoji: '🪙', fact: 'Precious metal, highly malleable. One ounce can stretch 50 miles!' },
                                { s: 'Ag', n: 'Silver', a: 47, emoji: '🥈', fact: 'Best conductor of heat and electricity among all elements.' },
                                { s: 'Al', n: 'Aluminium', a: 13, emoji: '🥫', fact: 'Lightweight and rustproof. Used for soda cans and aircraft frames.' },
                                { s: 'Zn', n: 'Zinc', a: 30, emoji: '🛡️', fact: 'Used to coat/galvanize iron to prevent it from rusting.' },
                                { s: 'Ni', n: 'Nickel', a: 28, emoji: '🪙', fact: 'Used in coins and rechargeable battery cells.' },
                                { s: 'Pt', n: 'Platinum', a: 78, emoji: '💎', fact: 'Extremely rare and non-reactive, used in catalytic filters.' }
                              ].map(elem => (
                                <div
                                  key={elem.s}
                                  className="p-2 rounded-xl bg-slate-900 border border-white/5 flex flex-col items-center text-center cursor-help group hover:border-cyan-400 transition-all relative"
                                >
                                  <span className="text-xl select-none">{elem.emoji}</span>
                                  <span className="text-xs font-black text-slate-100">{elem.s}</span>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">{elem.n}</span>
                                  
                                  {/* Tooltip Fun Fact on hover */}
                                  <div className="absolute bottom-full mb-2 z-20 w-44 p-2 rounded-xl bg-slate-950 border border-cyan-400 text-[10px] text-slate-300 leading-normal pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl text-center left-1/2 -translate-x-1/2">
                                    <p className="font-bold text-cyan-400">{elem.n} ({elem.s}) - AN: {elem.a}</p>
                                    <p className="mt-1">{elem.fact}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Interactive 3D Metal Cube Visual */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center py-6">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">CSS 3D Metal Cube (Hover to shine)</span>
                          
                          {/* 3D Container */}
                          <div className="w-40 h-40 flex items-center justify-center perspective-[800px] cursor-pointer" onMouseEnter={() => setLustreFlash(true)} onMouseLeave={() => setLustreFlash(false)}>
                            <div className="w-28 h-28 relative transform-style-preserve-3d animate-rotate-cube">
                              {/* 6 faces of the cube */}
                              {[
                                { transform: 'rotateY(0deg) translateZ(56px)', style: 'from-slate-400 to-slate-600' },
                                { transform: 'rotateY(90deg) translateZ(56px)', style: 'from-slate-500 to-slate-700' },
                                { transform: 'rotateY(180deg) translateZ(56px)', style: 'from-slate-400 to-slate-600' },
                                { transform: 'rotateY(-90deg) translateZ(56px)', style: 'from-slate-500 to-slate-700' },
                                { transform: 'rotateX(90deg) translateZ(56px)', style: 'from-slate-300 to-slate-500' },
                                { transform: 'rotateX(-90deg) translateZ(56px)', style: 'from-slate-600 to-slate-800' }
                              ].map((face, index) => (
                                <div
                                  key={index}
                                  className={`absolute inset-0 bg-gradient-to-br ${face.style} border-2 border-slate-300/40 rounded-lg flex items-center justify-center text-slate-100 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]`}
                                  style={{
                                    transform: face.transform,
                                    backfaceVisibility: 'visible',
                                    filter: lustreFlash ? 'brightness(1.2)' : 'none',
                                    transition: 'filter 0.3s'
                                  }}
                                >
                                  <span className="text-xl font-black text-slate-200 opacity-60">Fe</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                            {lustreFlash ? '⚡ SHINING METALLIC lustre!' : '💡 HOVER TO SHINE FLASH LIGHT'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 3: Properties of Metals */}
                  {activePage === 3 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 2</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Properties of Metals</h3>
                        </div>
                      </div>

                      {/* 6 Properties cards with live HTML animations */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* 1. Conductivity */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Conducts Electricity ⚡</h4>
                              <span className="text-xs text-yellow-400">⚡</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Allows flow of electrical currents.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {/* Circuit Schematic */}
                            <div className="flex items-center gap-4">
                              {/* Battery */}
                              <div className="w-10 h-6 bg-blue-500 rounded border border-white/20 flex items-center justify-center text-[9px] font-black text-white select-none">🔋 [ + ]</div>
                              
                              {/* Glowing Wire */}
                              <div className="flex-1 h-0.5 bg-slate-700 relative">
                                {circuitClosed && (
                                  <div className="absolute top-1/2 left-0 h-1 bg-yellow-400 -translate-y-1/2 w-full animate-pulse"></div>
                                )}
                              </div>
                              
                              {/* Bulb */}
                              <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-bold text-xs select-none transition-all ${circuitClosed ? 'bg-yellow-400 text-slate-950 scale-105 shadow-[0_0_15px_rgba(234,179,8,0.7)]' : 'bg-slate-800 text-slate-400'}`}>
                                💡
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => { playClick(); setCircuitClosed(!circuitClosed); }}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                              circuitClosed ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-900 border-white/10 text-slate-300'
                            }`}
                          >
                            {circuitClosed ? 'Open Circuit (Switch OFF)' : 'Close Circuit (Switch ON)'}
                          </button>
                        </div>

                        {/* 2. Heat Conductivity */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Conducts Heat 🔥</h4>
                              <span className="text-xs text-orange-500">🔥</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Transfers heat energy along atoms.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex flex-col items-center justify-center gap-1.5 px-2">
                            {/* Rod */}
                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden relative border border-white/10">
                              <div 
                                className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-300 transition-all duration-300 ease-out" 
                                style={{ width: `${heatProgress}%` }}
                              />
                            </div>
                            {/* Thermometer indicators */}
                            <div className="flex justify-between w-full text-[8px] font-black text-slate-500">
                              <span className={heatProgress > 20 ? 'text-red-400' : ''}>L: {heatProgress > 20 ? '100°C' : '25°C'}</span>
                              <span className={heatProgress > 60 ? 'text-orange-400' : ''}>M: {heatProgress > 60 ? '75°C' : '25°C'}</span>
                              <span className={heatProgress > 90 ? 'text-yellow-400' : ''}>R: {heatProgress > 90 ? '50°C' : '25°C'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { playClick(); setHeatActive(!heatActive); }}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                              heatActive ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-slate-900 border-white/10 text-slate-300'
                            }`}
                          >
                            {heatActive ? 'Extinguish Burner' : 'Ignite Bunsen Flame'}
                          </button>
                        </div>

                        {/* 3. Lustrous (Shiny) */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Lustrous✨</h4>
                              <span className="text-xs text-cyan-400">✨</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Reflects light waves, creating shine.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div 
                            className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden cursor-crosshair group"
                            onMouseMove={() => setLustreFlash(true)}
                            onMouseLeave={() => setLustreFlash(false)}
                          >
                            {/* Metallic Plate */}
                            <div className="w-11/12 h-8 rounded bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 border border-white/20 relative overflow-hidden flex items-center justify-center">
                              {/* Shiny flash gloss overlay */}
                              <div className={`absolute top-0 -left-[100%] w-1/2 h-full bg-white/40 skew-x-30 transition-all duration-700 ${lustreFlash ? 'left-[150%]' : ''}`} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Pure Silver</span>
                            </div>
                          </div>

                          <button
                            onMouseEnter={() => { playClick(); setLustreFlash(true); }}
                            onMouseLeave={() => setLustreFlash(false)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer bg-slate-900 border border-white/10 text-slate-300"
                          >
                            Hover mouse to shine
                          </button>
                        </div>

                        {/* 4. Malleable */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Malleable 🔨</h4>
                              <span className="text-xs text-blue-400">🔨</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Flatten into sheets without breaking.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {/* Gold block squished based on strikes */}
                            <div 
                              className="bg-yellow-500 border border-yellow-300 rounded shadow-md transition-all duration-200"
                              style={{
                                width: malleableStrikes === 0 ? '40px' : malleableStrikes === 1 ? '55px' : malleableStrikes === 2 ? '70px' : '90px',
                                height: malleableStrikes === 0 ? '40px' : malleableStrikes === 1 ? '30px' : malleableStrikes === 2 ? '20px' : '8px'
                              }}
                            />
                            {malleableStrikes > 0 && malleableStrikes < 3 && (
                              <div className="absolute top-2 right-2 text-[8px] font-black text-slate-500">STRIKES: {malleableStrikes}/3</div>
                            )}
                            {malleableStrikes === 3 && (
                              <div className="absolute inset-0 bg-green-950/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[9px] font-black bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded uppercase">Flattened Gold Foil!</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={triggerMalleableStrike}
                            disabled={malleableStrikes >= 3}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                              malleableStrikes >= 3 ? 'bg-slate-950 border-transparent text-slate-600' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {malleableStrikes >= 3 ? 'Completed' : 'Strike Hammer! 🔨'}
                          </button>
                        </div>

                        {/* 5. Ductile */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Ductile 🧵</h4>
                              <span className="text-xs text-orange-400">🧵</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Stretched into wires without snapping.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex flex-col items-center justify-center px-4 relative overflow-hidden">
                            {/* Copper bar being squeezed into wire */}
                            <div className="flex items-center w-full justify-between">
                              {/* Ingot side */}
                              <div 
                                className="bg-orange-600 border border-orange-500 transition-all rounded" 
                                style={{ width: `${Math.max(10, 45 - ductileStretch / 2)}px`, height: '24px' }}
                              />
                              {/* Extruder nozzle */}
                              <div className="w-4 h-8 bg-slate-800 border-x border-white/20"></div>
                              {/* Extruded wire */}
                              <div 
                                className="bg-orange-500 h-1 transition-all rounded-r" 
                                style={{ width: `${Math.min(90, 10 + ductileStretch * 1.5)}px` }}
                              />
                            </div>
                          </div>

                          <div className="w-full flex flex-col gap-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">Drag slider to pull metal</span>
                            <input 
                              type="range" 
                              min="0" 
                              max="50" 
                              value={ductileStretch} 
                              onChange={(e) => { setDuctileStretch(parseInt(e.target.value)); }}
                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                          </div>
                        </div>

                        {/* 6. Sonorous */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Sonorous 🔔</h4>
                              <span className="text-xs text-purple-400">🔔</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Produces ringing tones when tapped.</p>
                          </div>
                          
                          {/* Animation Area */}
                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            <div className="relative text-3xl select-none animate-bounce">🔔</div>
                            {/* Ring ripples */}
                            {sonorousRings.map(r => (
                              <div 
                                key={r} 
                                className="absolute border border-cyan-400/40 rounded-full animate-ping pointer-events-none"
                                style={{ width: '60px', height: '60px' }}
                              />
                            ))}
                          </div>

                          <button
                            onClick={triggerSonorousRing}
                            className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800"
                          >
                            Tap/Strike Bell!
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Page 4: What Are Non-Metals? */}
                  {activePage === 4 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Module 3</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">What is a Non-Metal?</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 flex flex-col gap-4">
                          <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            <strong>Non-metals</strong> are materials that are generally dull, lightweight, and poor conductors of heat and electricity.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            They are essential for biology, living tissue structures, food molecules, and liquids. Solid non-metals are brittle and break easily. They also exist as liquids (like Bromine) or diatomic gases (Oxygen, Nitrogen, Hydrogen) floating in the atmosphere.
                          </p>

                          {/* Non metals elements gallery */}
                          <div className="mt-2">
                            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider mb-2">Key Non-Metals Gallery</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { s: 'O', n: 'Oxygen', a: 8, emoji: '💨', fact: 'Diatomic gas key for respiration and burning fires.' },
                                { s: 'N', n: 'Nitrogen', a: 7, emoji: '💨', fact: 'Makes up 78% of the air; used inside chip packets.' },
                                { s: 'C', n: 'Carbon', a: 6, emoji: '✏️', fact: 'Basis of all life, forms diamonds, coal, and plastics.' },
                                { s: 'S', n: 'Sulfur', a: 16, emoji: '🌋', fact: 'Bright yellow crystal, smells like rotten eggs when burned.' },
                                { s: 'P', n: 'Phosphorus', a: 15, emoji: '🔥', fact: 'Red phosphorus is coated on safety matchboxes to ignite!' },
                                { s: 'Cl', n: 'Chlorine', a: 17, emoji: '🏊', fact: 'Strong disinfectant, sanitizes swimming pool water.' },
                                { s: 'H', n: 'Hydrogen', a: 1, emoji: '🚀', fact: 'Lightest chemical element, fuel source for rocket boosters.' },
                                { s: 'He', n: 'Helium', a: 2, emoji: '🎈', fact: 'Light noble gas that makes balloons float upwards!' }
                              ].map(elem => (
                                <div
                                  key={elem.s}
                                  className="p-2 rounded-xl bg-slate-900 border border-white/5 flex flex-col items-center text-center cursor-help group hover:border-purple-400 transition-all relative"
                                >
                                  <span className="text-xl select-none">{elem.emoji}</span>
                                  <span className="text-xs font-black text-slate-100">{elem.s}</span>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">{elem.n}</span>
                                  
                                  {/* Tooltip Fun Fact on hover */}
                                  <div className="absolute bottom-full mb-2 z-20 w-44 p-2 rounded-xl bg-slate-950 border border-purple-400 text-[10px] text-slate-300 leading-normal pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl text-center left-1/2 -translate-x-1/2">
                                    <p className="font-bold text-purple-400">{elem.n} ({elem.s}) - AN: {elem.a}</p>
                                    <p className="mt-1">{elem.fact}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Interactive floating gas molecules simulation */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Floating Gas Molecules (Heat up speed)</span>
                          
                          {/* Molecules box chamber */}
                          <div className="w-full h-36 bg-slate-950 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                            {/* Floating molecules circles */}
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                              const delay = i * 0.4;
                              const speedFactor = 40 / molecularTemp; // higher temp = faster duration
                              return (
                                <motion.div
                                  key={i}
                                  className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white/20 flex items-center justify-center text-[7px] text-slate-950 font-black"
                                  style={{
                                    left: `${15 + i * 9}%`,
                                    top: `${20 + (i % 3) * 20}%`
                                  }}
                                  animate={{
                                    y: [0, -25, 25, 0],
                                    x: [0, 20, -20, 0]
                                  }}
                                  transition={{
                                    duration: Math.max(1, 4 * speedFactor),
                                    repeat: Infinity,
                                    delay: delay,
                                    ease: 'easeInOut'
                                  }}
                                >
                                  O₂
                                </motion.div>
                              );
                            })}
                          </div>
                          
                          <div className="w-full flex flex-col gap-1 mt-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                              <span>Cool (Slow)</span>
                              <span className="text-purple-400">Temp: {molecularTemp}°C</span>
                              <span>Hot (Fast)</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="90" 
                              value={molecularTemp} 
                              onChange={(e) => { setMolecularTemp(parseInt(e.target.value)); }}
                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 5: Properties of Non-Metals */}
                  {activePage === 5 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Module 4</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Properties of Non-Metals</h3>
                        </div>
                      </div>

                      {/* 6 Properties cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* 1. Insulator */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Poor Conductor ⚡</h4>
                              <span className="text-xs text-red-500">❌</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Acts as electrical insulator.</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center px-1 overflow-hidden relative">
                            {/* Circuit Schematic */}
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-5 bg-blue-900 rounded border border-white/10 flex items-center justify-center text-[7px] font-black text-white">🔋</div>
                              
                              {/* Wood spacer block blocks electricity */}
                              <div className="flex-1 flex items-center justify-center gap-0.5">
                                <div className="h-0.5 bg-slate-700 w-4"></div>
                                <div className="px-1 py-0.5 bg-amber-900 border border-amber-800 text-[6px] font-bold text-white rounded shrink-0">🪵 WOOD</div>
                                <div className="h-0.5 bg-slate-700 w-4"></div>
                              </div>
                              
                              <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs bg-slate-950 text-slate-600`}>
                                💡
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => { playClick(); setNonMetalCircuitClosed(!nonMetalCircuitClosed); }}
                            className="w-full py-1.5 rounded-lg text-[10px] font-black bg-slate-900 border border-white/10 text-slate-400 cursor-not-allowed"
                            disabled
                          >
                            Bulb stays OFF (Insulated!)
                          </button>
                        </div>

                        {/* 2. Brittle */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Brittle 🔨</h4>
                              <span className="text-xs text-yellow-400">⚡</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Shatters under hammer strike.</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {brittleStrikes === 0 ? (
                              <div className="w-10 h-10 bg-yellow-500 border border-yellow-400 rounded-lg shadow" />
                            ) : brittleStrikes === 1 ? (
                              /* Cracked block */
                              <div className="w-10 h-10 bg-yellow-500 border border-yellow-400 rounded-lg shadow relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center">
                                  <span className="text-red-600 font-bold text-xs select-none">⚡</span>
                                </div>
                              </div>
                            ) : (
                              /* Shattered chunks */
                              <div className="flex gap-2">
                                <span className="w-3 h-3 bg-yellow-500 border border-yellow-400 rounded-full"></span>
                                <span className="w-2.5 h-2.5 bg-yellow-500 border border-yellow-400 rounded-full"></span>
                                <span className="w-4 h-2 bg-yellow-500 border border-yellow-400 rounded"></span>
                                <span className="w-2 h-4 bg-yellow-500 border border-yellow-400 rounded"></span>
                              </div>
                            )}
                            {brittleStrikes === 2 && (
                              <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase">SHATTERED SULFUR!</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={triggerBrittleStrike}
                            disabled={brittleStrikes >= 2}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                              brittleStrikes >= 2 ? 'bg-slate-950 border-transparent text-slate-600' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {brittleStrikes >= 2 ? 'Shattered' : 'Strike Hammer! 🔨'}
                          </button>
                        </div>

                        {/* 3. Non-Sonorous */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Non-Sonorous 🔔</h4>
                              <span className="text-xs text-red-400">❌</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Produces a flat "thud" with no ring.</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            <div className="relative text-3xl select-none filter grayscale opacity-40">🔔</div>
                            {nonSonorousStrikes > 0 && (
                              <div className="absolute text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-950/40 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                                THUD!
                              </div>
                            )}
                          </div>

                          <button
                            onClick={triggerNonSonorousStrike}
                            className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800"
                          >
                            Strike plastic plate!
                          </button>
                        </div>

                        {/* 4. Dull Appearance */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Dull Appearance 🌑</h4>
                              <span className="text-xs text-slate-500">🌑</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Absorbs light, matte finish.</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {/* Charcoal rod */}
                            <div className="w-10/12 h-8 rounded bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/5 flex items-center justify-center">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Dull Charcoal (Carbon)</span>
                            </div>
                          </div>

                          <button
                            disabled
                            className="w-full py-1.5 rounded-lg text-[10px] font-black bg-slate-950 text-slate-600 border border-transparent"
                          >
                            No shine possible!
                          </button>
                        </div>

                        {/* 5. Low Density */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Low Density 🌊</h4>
                              <span className="text-xs text-cyan-400">🌊</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Float in water (lightweight).</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {/* Water beaker */}
                            <div className="absolute inset-0 bg-blue-500/10 flex flex-col justify-end">
                              <div className="h-12 bg-blue-400/20 border-t border-blue-400/40 relative">
                                {/* Floater / Sinker object */}
                                {densityTest === 'iron' && (
                                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded bg-slate-600 border border-slate-500 flex items-center justify-center text-[7px] text-white">Fe</div>
                                )}
                                {densityTest === 'wood' && (
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-4 bg-amber-800 border border-amber-700 flex items-center justify-center text-[7px] text-white">Wood</div>
                                )}
                              </div>
                            </div>
                            {!densityTest && <span className="text-[8px] font-black text-slate-500 uppercase">Select Object below</span>}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { playClick(); setDensityTest('wood'); }}
                              className={`flex-1 py-1 rounded text-[8px] font-black uppercase border ${densityTest === 'wood' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-white/10'}`}
                            >
                              Drop Wood
                            </button>
                            <button
                              onClick={() => { playClick(); setDensityTest('iron'); }}
                              className={`flex-1 py-1 rounded text-[8px] font-black uppercase border ${densityTest === 'iron' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-white/10'}`}
                            >
                              Drop Iron
                            </button>
                          </div>
                        </div>

                        {/* 6. Fragile */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[200px] text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-200 uppercase">Fragile 💎</h4>
                              <span className="text-xs text-red-400">❌</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Snaps/cracks under stress easily.</p>
                          </div>

                          <div className="h-20 bg-slate-900/60 rounded-xl border border-white/5 my-2 flex items-center justify-center relative overflow-hidden">
                            {!fragileCracked ? (
                              <div className="w-16 h-1 bg-slate-300 rounded border border-white/20" />
                            ) : (
                              <div className="flex gap-4 items-center">
                                <div className="w-7 h-1 bg-slate-300 rounded border border-white/20 rotate-12" />
                                <div className="w-7 h-1 bg-slate-300 rounded border border-white/20 -rotate-12" />
                              </div>
                            )}
                            {fragileCracked && (
                              <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase">GLASS SNAPPED!</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => { playClick(); setFragileCracked(true); }}
                            disabled={fragileCracked}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                              fragileCracked ? 'bg-slate-950 border-transparent text-slate-600' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {fragileCracked ? 'Snapped' : 'Apply Pressure'}
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Page 6: Comparison Row Grid Table */}
                  {activePage === 6 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 5</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Metals vs Non-Metals</h3>
                        </div>
                      </div>

                      {/* Split View Table */}
                      <div className="overflow-x-auto glass-panel rounded-2xl border border-white/5">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-slate-300 border-b border-white/10 text-[10px] font-black uppercase tracking-wider">
                              <th className="p-3">Feature (Click Row to test)</th>
                              <th className="p-3 text-cyan-400">Metals</th>
                              <th className="p-3 text-purple-400">Non-Metals</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 'appearance', label: 'Appearance', m: 'Shiny (Lustrous)', nm: 'Dull (Matte)' },
                              { id: 'conductivity', label: 'Conductivity', m: 'Excellent (Heat & Electricity)', nm: 'Poor (Insulator, except Graphite)' },
                              { id: 'strength', label: 'Strength / Density', m: 'High (Strong & Heavy)', nm: 'Low (Brittle & Lightweight)' },
                              { id: 'malleable', label: 'Malleability / Ductility', m: 'Malleable (flatten) & Ductile (stretch)', nm: 'Brittle (crumbles under hammer)' },
                              { id: 'sound', label: 'Sound', m: 'Sonorous (Clear ringing sound)', nm: 'Non-Sonorous (Dull thud)' }
                            ].map(row => (
                              <tr 
                                key={row.id}
                                onClick={() => { playClick(); setCompareRow(row.id); }}
                                className={`border-b border-white/5 cursor-pointer transition-all ${compareRow === row.id ? 'bg-cyan-500/10 font-bold' : 'hover:bg-white/5'}`}
                              >
                                <td className="p-3 font-black text-slate-200">{row.label}</td>
                                <td className="p-3 text-slate-300">{row.m}</td>
                                <td className="p-3 text-slate-400">{row.nm}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Display live row test simulation */}
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/40">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Simulating Row: {compareRow.toUpperCase()}</span>
                          <span className="text-[10px] text-slate-500">Live Chemical Test</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Metal side demo */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-400/20 text-center flex flex-col items-center justify-center min-h-[120px]">
                            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mb-2">METAL SIDE</span>
                            
                            {compareRow === 'appearance' && (
                              <div className="w-12 h-12 rounded bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-white/20 animate-pulse flex items-center justify-center text-xs font-black text-yellow-800">Au</div>
                            )}

                            {compareRow === 'conductivity' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_12px_rgba(234,179,8,0.6)]">💡</div>
                                <span className="text-[10px] font-bold text-green-success">Circuit Completed: Bulb ON</span>
                              </div>
                            )}

                            {compareRow === 'strength' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <span className="text-3xl">⚖️ Heavy</span>
                                <span className="text-[10px] text-slate-400">Iron nail sinks to the bottom</span>
                              </div>
                            )}

                            {compareRow === 'malleable' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-14 h-2 bg-slate-400 rounded-sm border border-white/20" />
                                <span className="text-[10px] text-slate-400">Hammer flattens it into sheets</span>
                              </div>
                            )}

                            {compareRow === 'sound' && (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-2xl animate-bounce">🔔</span>
                                <span className="text-[10px] text-cyan-400 font-black tracking-widest">CLANG! RING!</span>
                              </div>
                            )}

                          </div>

                          {/* Non-metal side demo */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-400/20 text-center flex flex-col items-center justify-center min-h-[120px]">
                            <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-2">NON-METAL SIDE</span>

                            {compareRow === 'appearance' && (
                              <div className="w-12 h-12 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500">C</div>
                            )}

                            {compareRow === 'conductivity' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-slate-950 text-slate-600 flex items-center justify-center border border-white/5">💡</div>
                                <span className="text-[10px] font-bold text-red-400">Circuit Blocked: Bulb OFF</span>
                              </div>
                            )}

                            {compareRow === 'strength' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <span className="text-3xl">🎈 Light</span>
                                <span className="text-[10px] text-slate-400">Carbon charcoal floats on water</span>
                              </div>
                            )}

                            {compareRow === 'malleable' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="flex gap-1.5">
                                  <div className="w-3 h-3 bg-yellow-600 rounded-full" />
                                  <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                                  <div className="w-4 h-1.5 bg-yellow-600 rounded" />
                                </div>
                                <span className="text-[10px] text-slate-400">Shatters into powder fragments</span>
                              </div>
                            )}

                            {compareRow === 'sound' && (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-2xl filter grayscale opacity-45">🪵</span>
                                <span className="text-[10px] text-red-400 font-black tracking-widest">THUD! DULL!</span>
                              </div>
                            )}

                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {/* Page 7: Real Life Objects Gallery */}
                  {activePage === 7 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 6</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Real-Life Objects Gallery</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {[
                          /* Metal Objects */
                          { id: 'spoon', name: 'Spoon', isMetal: true, emoji: '🥄', prop: 'Malleable, Lustrous', uses: 'Eating utensils, cookware', fact: 'Stainless steel spoons contain iron, nickel, and chrome!' },
                          { id: 'coin', name: 'Coin', isMetal: true, emoji: '🪙', prop: 'Malleable, Conductive', uses: 'Currency currency', fact: 'Most coins are copper, nickel, or brass alloys!' },
                          { id: 'nail', name: 'Iron Nail', isMetal: true, emoji: '📌', prop: 'High Strength, Malleable', uses: 'Carpentry & construction', fact: 'Pure iron nails rust in damp air, forming red iron oxide.' },
                          { id: 'wire', name: 'Copper Wire', isMetal: true, emoji: '🔌', prop: 'Ductile, Highly Conductive', uses: 'Electrical systems & grids', fact: 'Copper is used in wires because it has low electric resistance.' },
                          { id: 'foil', name: 'Al Foil', isMetal: true, emoji: '🥫', prop: 'Malleable, Lightweight', uses: 'Wrapping hot food', fact: 'Aluminium foil is only 0.2 millimetres thick!' },
                          { id: 'gate', name: 'Steel Gate', isMetal: true, emoji: '🚪', prop: 'High Strength', uses: 'Security security boundaries', fact: 'Steel is iron doped with carbon to boost strength.' },
                          { id: 'bike', name: 'Bike Frame', isMetal: true, emoji: '🚲', prop: 'Lightweight & Strong', uses: 'Sports riding frames', fact: 'Usually welded from aluminium or titanium tubes!' },
                          /* Non-metal Objects */
                          { id: 'bottle', name: 'Plastic Bottle', isMetal: false, emoji: '🥤', prop: 'Insulator, Lightweight', uses: 'Liquids storage bottles', fact: 'Plastics are polymers derived from carbon atoms!' },
                          { id: 'paper', name: 'Paper Sheet', isMetal: false, emoji: '📄', prop: 'Insulator, Flammable', uses: 'Writing & print books', fact: 'Paper is cellulose fibers harvested from tree pulps.' },
                          { id: 'coal', name: 'Coal Chunk', isMetal: false, emoji: '🪨', prop: 'Brittle, Dull', uses: 'Combustible electricity fuel', fact: 'Coal is fossilized carbon of ancient swamp trees!' },
                          { id: 'rubber', name: 'Rubber Band', isMetal: false, emoji: '🪕', prop: 'Elastic, Insulator', uses: 'Packaging elastics', fact: 'Natural latex is harvested from rubber tree barks!' },
                          { id: 'lead_pencil', name: 'Pencil Graphite', isMetal: false, emoji: '✏️', prop: 'Soft, Electrically Conductive', uses: 'Writing sketch leads', fact: 'Graphite conducts electricity, though it is not a metal!' },
                          { id: 'wood', name: 'Wooden Stick', isMetal: false, emoji: '🪵', prop: 'Heat Insulator', uses: 'Fuel & construction', fact: 'Dry wood does not conduct electricity at all.' },
                          { id: 'glass', name: 'Glass Bottle', isMetal: false, emoji: '🧪', prop: 'Brittle, Transparent', uses: 'Beverages storage bottles', fact: 'Glass is made by melting pure silica sand at 1700°C!' }
                        ].map(obj => (
                          <button
                            key={obj.id}
                            onClick={() => { playClick(); setSelectedObject(obj); }}
                            className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 ${
                              obj.isMetal 
                                ? 'bg-cyan-950/10 border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/20' 
                                : 'bg-purple-950/10 border-purple-500/20 hover:border-purple-400 hover:bg-purple-950/20'
                            }`}
                          >
                            <span className="text-3xl select-none">{obj.emoji}</span>
                            <span className="text-[10px] font-black text-slate-200 truncate max-w-full">{obj.name}</span>
                            <span className={`text-[8px] font-bold uppercase ${obj.isMetal ? 'text-cyan-400' : 'text-purple-400'}`}>
                              {obj.isMetal ? 'Metal' : 'Non-Metal'}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Detail object modal overlay */}
                      {selectedObject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                          <div className={`w-full max-w-md rounded-3xl border p-6 flex flex-col gap-4 text-left animate-fadeIn ${
                            selectedObject.isMetal ? 'glass-panel-neon border-cyan-500/30' : 'glass-panel-neon-cyan border-purple-500/30'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-4xl">{selectedObject.emoji}</span>
                                <div>
                                  <h4 className="text-lg font-black text-slate-100">{selectedObject.name}</h4>
                                  <span className={`text-xs font-black uppercase tracking-wider ${selectedObject.isMetal ? 'text-cyan-400' : 'text-purple-400'}`}>
                                    {selectedObject.isMetal ? 'Metal material' : 'Non-Metal material'}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => { playClick(); setSelectedObject(null); }}
                                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="flex flex-col gap-3 text-xs leading-relaxed">
                              <div>
                                <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] block">Key Physical Properties:</span>
                                <span className="text-slate-200 font-bold">{selectedObject.prop}</span>
                              </div>

                              <div>
                                <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] block">Everyday Uses:</span>
                                <span className="text-slate-200">{selectedObject.uses}</span>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 mt-1">
                                <span className="font-black text-yellow-400 uppercase tracking-widest text-[9px] block">Dr. Atom Fun Fact! 💡</span>
                                <p className="text-slate-300 font-medium text-[11px] mt-1">{selectedObject.fact}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => { playClick(); setSelectedObject(null); }}
                              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center"
                            >
                              Close details
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Page 8: Virtual Science Lab Simulations */}
                  {activePage === 8 && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 7</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Virtual Science Lab</h3>
                        </div>
                        
                        {/* Lab checklist indicator */}
                        <div className="flex gap-2 text-[9px] font-black uppercase">
                          {['circuit', 'heat', 'sound', 'hammer'].map(task => (
                            <span 
                              key={task}
                              className={`px-2 py-0.5 rounded border ${
                                labFinishedTasks.includes(task) 
                                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                  : 'bg-slate-900 border-white/5 text-slate-500'
                              }`}
                            >
                              {task.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Lab Bench Tabs */}
                      <div className="flex gap-2 border-b border-white/5 pb-2">
                        {[
                          { id: 'circuit', label: 'Circuit Tester', icon: '🔌' },
                          { id: 'heat', label: 'Heat Conduction', icon: '☕' },
                          { id: 'sound', label: 'Sound Board', icon: '🔔' },
                          { id: 'hammer', label: 'Hammer Anvil', icon: '🔨' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => { playClick(); setLabTab(tab.id); }}
                            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                              labTab === tab.id 
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                            <span className="mr-1">{tab.icon}</span>{tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Lab Tab Render contents */}
                      <div className="p-4 rounded-2xl glass-panel border border-white/5 min-h-[260px] flex flex-col justify-between">
                        
                        {/* Lab Tab 1: Conductivity circuit tester */}
                        {labTab === 'circuit' && (
                          <div className="flex flex-col gap-4">
                            <p className="text-xs text-slate-400">Drag or tap an object to connect it between the open electrodes to complete the circuit.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              {/* Circuit visualization */}
                              <div className="h-32 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-center relative">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-5 bg-blue-600 rounded text-[8px] font-bold text-center border border-white/10 select-none">🔋</div>
                                  
                                  {/* Gap */}
                                  <div className="flex items-center justify-center border-b border-dashed border-white/20 w-16 h-10 relative">
                                    {labCircuitItem ? (
                                      <span className="text-3xl animate-bounce">{
                                        labCircuitItem === 'nail' ? '📌' : 
                                        labCircuitItem === 'ruler' ? '📏' : 
                                        labCircuitItem === 'eraser' ? '🪕' : 
                                        labCircuitItem === 'key' ? '🔑' : '✏️'
                                      }</span>
                                    ) : (
                                      <span className="text-[8px] text-slate-500 font-bold uppercase">GAP</span>
                                    )}
                                  </div>

                                  <div className={`w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-xs transition-all ${
                                    labCircuitTested && (labCircuitItem === 'nail' || labCircuitItem === 'key' || labCircuitItem === 'graphite')
                                      ? 'bg-yellow-400 text-slate-950 scale-105 shadow-[0_0_15px_rgba(234,179,8,0.7)]'
                                      : 'bg-slate-950 text-slate-600'
                                  }`}>
                                    💡
                                  </div>
                                </div>
                                
                                {labCircuitTested && (
                                  <div className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                    Result: {(labCircuitItem === 'nail' || labCircuitItem === 'key' || labCircuitItem === 'graphite') ? 'Conducts!' : 'Insulates'}
                                  </div>
                                )}
                              </div>

                              {/* Objects palette tray */}
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Lab Tray:</span>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { id: 'nail', name: 'Iron Nail', label: '📌' },
                                    { id: 'ruler', name: 'Plastic Ruler', label: '📏' },
                                    { id: 'eraser', name: 'Rubber Eraser', label: '🪕' },
                                    { id: 'key', name: 'Copper Key', label: '🔑' },
                                    { id: 'graphite', name: 'Pencil Lead', label: '✏️' }
                                  ].map(item => (
                                    <button
                                      key={item.id}
                                      onClick={() => handleLabCircuitTest(item.id)}
                                      className={`p-2 rounded-xl border text-center text-xs font-black cursor-pointer transition-all flex flex-col items-center gap-1 ${
                                        labCircuitItem === item.id 
                                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' 
                                          : 'bg-slate-900 border-white/5 hover:border-white/15 text-slate-300'
                                      }`}
                                    >
                                      <span className="text-xl">{item.label}</span>
                                      <span className="text-[8px] truncate max-w-full">{item.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lab Tab 2: Heat conduction spoon test */}
                        {labTab === 'heat' && (
                          <div className="flex flex-col gap-4">
                            <p className="text-xs text-slate-400">Place spoons made of Silver, Wood, and Plastic inside steaming hot tea, and observe heat travel up to their handles.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              {/* Mug beaker */}
                              <div className="h-32 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                                {/* Cup */}
                                <div className="w-24 h-20 bg-blue-900/30 rounded-b-3xl border-x border-b border-white/20 flex flex-col justify-end p-2 relative shadow-inner">
                                  <div className="absolute inset-x-0 bottom-0 h-14 bg-amber-900/40 border-t border-amber-800 flex items-center justify-center text-[8px] font-black uppercase text-amber-500">HOT WATER</div>
                                  
                                  {/* Spoons inserted inside cup */}
                                  <div className="absolute -top-6 inset-x-3 flex justify-between">
                                    {/* Silver */}
                                    <div className="flex flex-col items-center">
                                      <div className="w-2.5 h-12 bg-slate-400 border border-slate-300 rounded-t" />
                                      <span className="text-[7px] font-black text-slate-300">SILVER</span>
                                    </div>
                                    {/* Wood */}
                                    <div className="flex flex-col items-center">
                                      <div className="w-2.5 h-12 bg-amber-800 border border-amber-700 rounded-t" />
                                      <span className="text-[7px] font-black text-amber-500">WOOD</span>
                                    </div>
                                    {/* Plastic */}
                                    <div className="flex flex-col items-center">
                                      <div className="w-2.5 h-12 bg-rose-500 border border-rose-400 rounded-t" />
                                      <span className="text-[7px] font-black text-rose-400">PLASTIC</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Thermometer stats */}
                              <div className="flex flex-col gap-2.5 text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handle Temp Sensors:</span>
                                
                                <div className="flex flex-col gap-2">
                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span>🥈 Silver Spoon Handle</span>
                                    <span className={labHeatTemp.silver > 40 ? 'text-red-400' : 'text-slate-400'}>{Math.round(labHeatTemp.silver)}°C</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
                                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(labHeatTemp.silver / 80) * 100}%` }}></div>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span>🪵 Wooden Spoon Handle</span>
                                    <span className="text-slate-400">{Math.round(labHeatTemp.wood)}°C</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
                                    <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${(labHeatTemp.wood / 80) * 100}%` }}></div>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span>🥫 Plastic Spoon Handle</span>
                                    <span className="text-slate-400">{Math.round(labHeatTemp.plastic)}°C</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
                                    <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(labHeatTemp.plastic / 80) * 100}%` }}></div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => { playClick(); setLabHeatSpoons(true); }}
                                  disabled={labHeatSpoons}
                                  className="py-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-103 transition-all cursor-pointer"
                                >
                                  {labHeatSpoons ? 'Heating Spoons...' : 'Insert Spoons into Hot Tea'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lab Tab 3: Sound board test */}
                        {labTab === 'sound' && (
                          <div className="flex flex-col gap-4">
                            <p className="text-xs text-slate-400">Strike hanging items with the wooden mallet to observe acoustic properties (sonority).</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              {/* Hanging bars panel */}
                              <div className="h-32 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-center gap-6 relative">
                                {[
                                  { id: 'steel', name: 'Steel Bar', label: '⛓️', rings: true },
                                  { id: 'copper', name: 'Copper Pipe', label: '🔌', rings: true },
                                  { id: 'wood', name: 'Wood Plinth', label: '🪵', rings: false },
                                  { id: 'rubber', name: 'Rubber Pad', label: '🪕', rings: false }
                                ].map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => handleLabSoundTest(item.id)}
                                    className={`relative flex flex-col items-center gap-1 group transition-transform hover:scale-105 cursor-pointer ${
                                      labSoundItem === item.id ? 'scale-105 border-cyan-400' : ''
                                    }`}
                                  >
                                    <span className="text-3xl select-none">{item.label}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase">{item.name}</span>
                                    
                                    {/* Rippling circles if sonorous struck */}
                                    {labSoundItem === item.id && item.rings && labSoundWave > 0 && (
                                      <div className="absolute -top-1 w-10 h-10 border border-cyan-400/40 rounded-full animate-ping pointer-events-none" />
                                    )}
                                    {labSoundItem === item.id && !item.rings && labSoundWave > 0 && (
                                      <span className="absolute top-1 text-[8px] font-black text-red-400 bg-red-950/20 px-1 border border-red-500/20 rounded animate-pulse">THUD</span>
                                    )}
                                  </button>
                                ))}
                              </div>

                              <div className="text-left flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acoustic Analysis:</span>
                                {labSoundItem ? (
                                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold leading-normal">
                                    {labSoundItem === 'steel' || labSoundItem === 'copper' ? (
                                      <p className="text-green-success">⚡ SONOROUS! Metal produced expanding sound waves with a long ringing tone.</p>
                                    ) : (
                                      <p className="text-red-400">❌ NON-SONOROUS! Non-metal absorbed the mallet strike, producing a short flat thud.</p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500">Click a hanging item to strike it and read acoustic results here.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lab Tab 4: Hammer anvil crushing test */}
                        {labTab === 'hammer' && (
                          <div className="flex flex-col gap-4">
                            <p className="text-xs text-slate-400">Slam different items on the laboratory anvil using a steel sledgehammer to test malleability vs brittleness.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              {/* Anvil workspace */}
                              <div className="h-32 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-center relative">
                                <div className="flex flex-col items-center">
                                  {/* Item on top */}
                                  {labHammerItem ? (
                                    <div className="mb-2">
                                      {labHammerItem === 'foil' ? (
                                        <div 
                                          className="bg-slate-300 border border-slate-200 rounded transition-all"
                                          style={{
                                            width: labHammerStrikes === 0 ? '30px' : labHammerStrikes === 1 ? '50px' : '75px',
                                            height: labHammerStrikes === 0 ? '20px' : labHammerStrikes === 1 ? '10px' : '4px'
                                          }}
                                        />
                                      ) : (
                                        <div>
                                          {labHammerStrikes < 2 ? (
                                            <div className="w-8 h-8 bg-yellow-500 border border-yellow-400 rounded-lg" />
                                          ) : (
                                            <div className="flex gap-1">
                                              <span className="w-2 h-2 bg-yellow-600 rounded-full" />
                                              <span className="w-3.5 h-1.5 bg-yellow-600 rounded" />
                                              <span className="w-2.5 h-3 bg-yellow-600 rounded" />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-2">Anvil Empty</span>
                                  )}
                                  
                                  {/* Anvil shape */}
                                  <div className="w-28 h-8 bg-slate-700 border border-slate-600 rounded-b shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-[9px] font-black text-slate-300">ANVIL Bench</div>
                                </div>

                                {labHammerItem && labHammerStrikes < 3 && (
                                  <div className="absolute top-2 right-2 text-[8px] font-bold text-slate-500">STRIKES: {labHammerStrikes}/3</div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Item to Crush:</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => { playClick(); setLabHammerItem('foil'); setLabHammerStrikes(0); }}
                                    className={`flex-1 py-1 rounded text-[8px] font-black uppercase border ${labHammerItem === 'foil' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-white/5'}`}
                                  >
                                    Aluminium Ingot
                                  </button>
                                  <button
                                    onClick={() => { playClick(); setLabHammerItem('sulfur'); setLabHammerStrikes(0); }}
                                    className={`flex-1 py-1 rounded text-[8px] font-black uppercase border ${labHammerItem === 'sulfur' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-white/5'}`}
                                  >
                                    Sulfur Crystal
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleLabHammerTest(labHammerItem)}
                                  disabled={!labHammerItem || labHammerStrikes >= 3}
                                  className={`py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer ${
                                    !labHammerItem || labHammerStrikes >= 3 
                                      ? 'bg-slate-950 border-transparent text-slate-600' 
                                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                  }`}
                                >
                                  {labHammerStrikes >= 3 ? 'Completed' : 'Slam Hammer! 🔨'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Lab finished check mark handler */}
                      {labFinishedTasks.length >= 4 && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-green-success text-left">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Congratulations! You've successfully finished all 4 lab bench test routines!</span>
                          </div>
                          <button
                            onClick={() => {
                              playClick();
                              if (!learningProgress.labCompleted) {
                                saveProgress({
                                  ...learningProgress,
                                  labCompleted: true,
                                  stars: learningProgress.stars + 15
                                });
                              }
                              // Advance to next page
                              setActivePage(9);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                          >
                            Claim 15 Stars ⭐
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Page 9: Metals Image Library */}
                  {activePage === 9 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Module 8</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Metals Image Library</h3>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-2 flex-wrap items-center">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search Metals..."
                              className="pl-8 pr-3 py-1 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold w-40 focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          
                          <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-900 border border-white/5 text-slate-300 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none focus:border-cyan-400"
                          >
                            {metalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Elements grid of metals */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {filteredMetals.map(metal => (
                          <button
                            key={metal.id}
                            onClick={() => { playClick(); setSelectedMetal(metal); }}
                            className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                              selectedMetal?.id === metal.id 
                                ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                                : 'bg-slate-900 border-white/5 hover:border-cyan-500/20'
                            }`}
                          >
                            <span 
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner"
                              style={{ backgroundColor: `${metal.color}20`, color: metal.color, border: `1px solid ${metal.color}30` }}
                            >
                              {metal.symbol}
                            </span>
                            <span className="text-[10px] font-black text-slate-200 truncate max-w-full">{metal.name}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{metal.category}</span>
                          </button>
                        ))}
                      </div>

                      {/* Display Bohr atomic model animation and facts for selected metal */}
                      {selectedMetal && (
                        <div className="p-4 rounded-2xl glass-panel border border-cyan-400/20 bg-slate-950/40 flex flex-col md:flex-row gap-5 items-center">
                          
                          {/* Bohr Model canvas SVG drawing */}
                          <div className="w-36 h-36 relative shrink-0 flex items-center justify-center">
                            {selectedMetal.shellConfig ? (
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                {/* Nucleus */}
                                <circle cx="50" cy="50" r="8" fill="#eab308" className="animate-pulse" />
                                <text x="50" y="52" textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold">+{selectedMetal.atomicNumber}</text>
                                
                                {/* Shell tracks & Electrons */}
                                {selectedMetal.shellConfig.map((electronsCount, index) => {
                                  const radius = 18 + index * 8;
                                  return (
                                    <g key={index}>
                                      {/* Orbit path line */}
                                      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                                      {/* Electron points */}
                                      {Array.from({ length: electronsCount }).map((_, eIdx) => {
                                        const angle = (eIdx / electronsCount) * 2 * Math.PI;
                                        const x = 50 + radius * Math.cos(angle);
                                        const y = 50 + radius * Math.sin(angle);
                                        
                                        return (
                                          <circle 
                                            key={eIdx}
                                            cx={x} 
                                            cy={y} 
                                            r="1.5" 
                                            fill="#22c55e" 
                                          />
                                        );
                                      })}
                                    </g>
                                  );
                                })}
                              </svg>
                            ) : (
                              <div className="text-4xl text-center">⚙️</div>
                            )}
                            <span className="absolute bottom-0 text-[8px] font-black text-slate-500 uppercase">BOHR ELECTRON SHELLS</span>
                          </div>

                          <div className="text-left flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <h4 className="text-sm font-black text-slate-200">{selectedMetal.name} ({selectedMetal.symbol})</h4>
                              <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/15 text-[8px] font-black text-cyan-400">Atomic No: {selectedMetal.atomicNumber || 'N/A'}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/15 text-[8px] font-black text-purple-400">{selectedMetal.category}</span>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-400 leading-normal font-medium"><strong>Primary Uses:</strong> {selectedMetal.uses}</p>
                            
                            <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl">
                              <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest block">Dr. Atom Fact Sheet:</span>
                              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-1">{selectedMetal.fact}</p>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* Page 10: Non-Metals Image Library */}
                  {activePage === 10 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Module 9</span>
                          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Non-Metals Image Library</h3>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-2 flex-wrap items-center">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search Non-Metals..."
                              className="pl-8 pr-3 py-1 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold w-40 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          
                          <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-900 border border-white/5 text-slate-300 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none focus:border-purple-400"
                          >
                            {nonMetalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Elements grid of non-metals */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {filteredNonMetals.map(nm => (
                          <button
                            key={nm.id}
                            onClick={() => { playClick(); setSelectedNonMetal(nm); }}
                            className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                              selectedNonMetal?.id === nm.id 
                                ? 'bg-purple-500/10 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                                : 'bg-slate-900 border-white/5 hover:border-purple-500/20'
                            }`}
                          >
                            <span 
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner"
                              style={{ backgroundColor: `${nm.color}20`, color: nm.color, border: `1px solid ${nm.color}30` }}
                            >
                              {nm.symbol}
                            </span>
                            <span className="text-[10px] font-black text-slate-200 truncate max-w-full">{nm.name}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{nm.category}</span>
                          </button>
                        ))}
                      </div>

                      {/* Display Bohr atomic model/molecular details for selected non-metal */}
                      {selectedNonMetal && (
                        <div className="p-4 rounded-2xl glass-panel border border-purple-400/20 bg-slate-950/40 flex flex-col md:flex-row gap-5 items-center">
                          
                          {/* Bohr Model SVG or Molecular formula */}
                          <div className="w-36 h-36 relative shrink-0 flex items-center justify-center bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                            {selectedNonMetal.shellConfig ? (
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                {/* Nucleus */}
                                <circle cx="50" cy="50" r="8" fill="#ec4899" className="animate-pulse" />
                                <text x="50" y="52" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">+{selectedNonMetal.atomicNumber}</text>
                                
                                {/* Shell tracks & Electrons */}
                                {selectedNonMetal.shellConfig.map((electronsCount, index) => {
                                  const radius = 18 + index * 9;
                                  return (
                                    <g key={index}>
                                      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                                      {Array.from({ length: electronsCount }).map((_, eIdx) => {
                                        const angle = (eIdx / electronsCount) * 2 * Math.PI;
                                        const x = 50 + radius * Math.cos(angle);
                                        const y = 50 + radius * Math.sin(angle);
                                        
                                        return (
                                          <circle 
                                            key={eIdx}
                                            cx={x} 
                                            cy={y} 
                                            r="1.5" 
                                            fill="#60a5fa" 
                                          />
                                        );
                                      })}
                                    </g>
                                  );
                                })}
                              </svg>
                            ) : (
                              <div className="text-center flex flex-col items-center">
                                <span className="text-3xl font-black text-purple-400 tracking-wider font-mono">{selectedNonMetal.formula}</span>
                                <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Covalent Molecule</span>
                              </div>
                            )}
                            <span className="absolute bottom-1.5 text-[8px] font-black text-slate-500 uppercase">Structure Spec</span>
                          </div>

                          <div className="text-left flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <h4 className="text-sm font-black text-slate-200">{selectedNonMetal.name} ({selectedNonMetal.symbol})</h4>
                              <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/15 text-[8px] font-black text-cyan-400">Atomic No: {selectedNonMetal.atomicNumber || 'Compound'}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/15 text-[8px] font-black text-purple-400">{selectedNonMetal.category}</span>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-400 leading-normal font-medium"><strong>Primary Uses:</strong> {selectedNonMetal.uses}</p>
                            
                            <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-xl">
                              <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest block">Dr. Atom Fact Sheet:</span>
                              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-1">{selectedNonMetal.fact}</p>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* Page 11: Completion & Badge Award Screen */}
                  {activePage === 11 && (
                    <div className="flex flex-col items-center justify-center text-center gap-6 py-6">
                      
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-full">Course Completed!</span>
                        <h3 className="text-3xl font-black text-slate-100 uppercase tracking-wide">Congratulations Explorer!</h3>
                        <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                          You have thoroughly reviewed all metals, non-metals, physical properties, real-life applications, and lab tests!
                        </p>
                      </div>

                      {/* Explorer Badge Display */}
                      <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.4)] animate-bounce" style={{ animationDuration: '3s' }}>
                        {/* Shimmer rings */}
                        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/20 animate-spin" style={{ animationDuration: '10s' }} />
                        
                        <div className="flex flex-col items-center gap-1 select-none">
                          <span className="text-6xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">🧭</span>
                          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mt-1">Science Explorer</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase leading-none">BADGE UNLOCKED</span>
                        </div>
                      </div>

                      {/* Stars Summary */}
                      <div className="flex items-center gap-2.5 px-6 py-3.5 bg-yellow-500/10 border border-yellow-400/20 text-yellow-400 rounded-2xl font-black text-base">
                        <Star className="w-5 h-5 fill-current animate-bounce" />
                        <span>COLLECTED: {learningProgress.stars} LEARNING STARS! ⭐</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <button
                          onClick={() => { playClick(); setScreen('levels'); }}
                          className="px-8 py-4 bg-gradient-to-r from-purple-theme to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Start Challenge Game
                        </button>

                        <button
                          onClick={handleDownloadNotes}
                          className="px-6 py-4 bg-slate-900 text-slate-200 hover:text-white border border-white/10 hover:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Learning Notes
                        </button>

                        <button
                          onClick={() => { playClick(); setActivePage(1); }}
                          className="px-6 py-4 bg-slate-900 text-slate-200 hover:text-white border border-white/10 hover:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Review Concepts
                        </button>
                      </div>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quiz Section (Knowledge Check) shown at the bottom of learning screens (pages 2 to 7, and 9 to 10) */}
            {activePage > 1 && activePage !== 8 && activePage !== 11 && quizzes[activePage] && (
              <div className="mt-8 pt-5 border-t border-white/5 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2 py-0.5 rounded">Knowledge Check</span>
                  <span className="text-[10px] font-bold text-slate-400">Earn 10 Stars ⭐</span>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-200 leading-snug">
                    {quizzes[activePage].question}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quizzes[activePage].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      const isCorrectAnswer = oIdx === quizzes[activePage].correctIndex;
                      
                      let btnStyle = 'border-white/5 bg-slate-900/40 text-slate-300 hover:bg-slate-800/40';
                      if (isSelected) {
                        if (quizSubmitted) {
                          btnStyle = isCorrectAnswer 
                            ? 'border-green-500 bg-green-950/20 text-green-400 font-bold'
                            : 'border-red-500 bg-red-950/20 text-red-400 font-bold';
                        } else {
                          btnStyle = 'border-cyan-400 bg-cyan-950/20 text-cyan-300 font-bold';
                        }
                      } else if (quizSubmitted && isCorrectAnswer) {
                        btnStyle = 'border-green-500 bg-green-950/20 text-green-400 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerClick(oIdx)}
                          disabled={quizSubmitted}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded bg-slate-950 flex items-center justify-center text-[9px] font-black shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Box */}
                  {quizSubmitted && (
                    <div className={`p-3 rounded-2xl border text-xs leading-normal font-medium ${
                      quizIsCorrect 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <p className="font-bold mb-1">
                        {quizIsCorrect ? '🎉 Correct Answer! +10 Stars' : '❌ Incorrect. Try again!'}
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{quizzes[activePage].explanation}</p>
                    </div>
                  )}

                  {/* Submit / Retry Actions */}
                  <div className="flex gap-2 justify-end">
                    {quizSubmitted ? (
                      !quizIsCorrect && (
                        <button
                          onClick={resetQuiz}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          Retry Question
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleQuizSubmit(quizzes[activePage].id, activePage)}
                        disabled={selectedAnswer === null}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedAnswer === null 
                            ? 'bg-slate-950 text-slate-600 border border-transparent' 
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow shadow-cyan-500/10'
                        }`}
                      >
                        Submit Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Screen Navigation buttons */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  playClick();
                  if (activePage > 1) {
                    setActivePage(prev => prev - 1);
                  }
                }}
                disabled={activePage === 1}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${
                  activePage === 1 
                    ? 'border-transparent text-slate-700' 
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="hidden sm:flex gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <span>Page {activePage} of 11</span>
              </div>

              <button
                onClick={() => {
                  playClick();
                  if (activePage < 11) {
                    setActivePage(prev => prev + 1);
                  }
                }}
                disabled={activePage === 11}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${
                  activePage === 11 
                    ? 'border-transparent text-slate-700' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow shadow-cyan-500/15 hover:scale-103'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Embedded style tags for custom animations e.g. 3D rotates */}
      <style>{`
        .perspective-800 {
          perspective: 800px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .animate-rotate-cube {
          animation: rotateCube 12s infinite linear;
        }
        @keyframes rotateCube {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .skew-x-30 {
          transform: skewX(-30deg);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

    </div>
  );
}

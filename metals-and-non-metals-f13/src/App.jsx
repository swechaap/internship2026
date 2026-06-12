import React, { useState, useEffect } from 'react';
import { getGameState, saveGameState, addLeaderboardEntry } from './utils/storage';
import { audio } from './utils/audio';

// Common Components
import BackgroundParticles from './components/BackgroundParticles';
import Navigation from './components/Navigation';

// Screens
import HomeScreen from './screens/HomeScreen';
import LevelSelectionScreen from './screens/LevelSelectionScreen';
import GameScreen from './screens/GameScreen';
import LevelCompletedScreen from './screens/LevelCompletedScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import LetsLearnScreen from './screens/LetsLearnScreen';
import CertificateCanvas from './components/CertificateCanvas';

// Settings Modal Icons
import { X, Volume2, VolumeX, Moon, Sun, Award } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [currentScreen, setScreen] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Level Complete Celebration Parameters
  const [lastLevelCompleted, setLastLevelCompleted] = useState(1);
  const [lastScoreEarned, setLastScoreEarned] = useState(0);
  const [lastAccuracyEarned, setLastAccuracyEarned] = useState(0);
  const [lastTimeEarned, setLastTimeEarned] = useState(0);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState([]);

  // Load Game State
  useEffect(() => {
    const state = getGameState();
    setGameState(state);
    audio.setMuted(state.soundMuted);

    // Force profile screen if student name is not set
    if (!state.playerName) {
      setScreen('profile');
    }
  }, []);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-white/10 animate-spin"></div>
      </div>
    );
  }

  // --- Game State Helpers ---
  const handleLevelComplete = (levelId, finalScore, finalAccuracy, timeTaken, isSuccess) => {
    if (!isSuccess) {
      audio.playWrong();
      setScreen('levels');
      return;
    }

    const currentScores = { ...gameState.scores };
    const currentAccuracies = { ...gameState.accuracy };
    const currentTimes = { ...gameState.times };
    const currentCompleted = [...gameState.completedLevels];

    const levelKey = `level${levelId}`;

    // Update level progression (Keep high scores)
    if (finalScore > currentScores[levelKey]) {
      currentScores[levelKey] = finalScore;
    }
    if (finalAccuracy > currentAccuracies[levelKey]) {
      currentAccuracies[levelKey] = finalAccuracy;
    }
    if (currentTimes[levelKey] === null || timeTaken < currentTimes[levelKey]) {
      currentTimes[levelKey] = timeTaken;
    }
    if (!currentCompleted.includes(levelId)) {
      currentCompleted.push(levelId);
    }

    // Check Badge Awards
    const { unlocked, newlyUnlocked } = checkAchievements(levelId, finalScore, finalAccuracy, timeTaken, {
      ...gameState,
      scores: currentScores,
      accuracy: currentAccuracies,
      times: currentTimes,
      completedLevels: currentCompleted
    });

    const updatedState = {
      ...gameState,
      scores: currentScores,
      accuracy: currentAccuracies,
      times: currentTimes,
      completedLevels: currentCompleted,
      unlockedAchievements: unlocked
    };

    setGameState(updatedState);
    saveGameState(updatedState);

    // Save level info for completion screen
    setLastLevelCompleted(levelId);
    setLastScoreEarned(finalScore);
    setLastAccuracyEarned(finalAccuracy);
    setLastTimeEarned(timeTaken);
    setNewlyUnlockedBadges(newlyUnlocked);

    // Update Leaderboard entry with cumulative score
    const totalScore = Object.values(currentScores).reduce((a, b) => a + b, 0);
    const maxLevelLabel = currentCompleted.includes(3) 
      ? 'All Levels' 
      : currentCompleted.includes(2)
      ? 'Level 2 Completed'
      : 'Level 1 Completed';

    addLeaderboardEntry(gameState.playerName, totalScore, maxLevelLabel);

    // Navigate to completion celebration
    setScreen('completed');
  };

  const checkAchievements = (levelId, score, accuracy, timeTaken, stateContext) => {
    const unlocked = [...gameState.unlockedAchievements];
    const newlyUnlocked = [];

    const addBadge = (badgeId) => {
      if (!unlocked.includes(badgeId)) {
        unlocked.push(badgeId);
        newlyUnlocked.push(badgeId);
      }
    };

    // 1. Metal Master: Score 80% or higher accuracy in any level
    if (accuracy >= 80) {
      addBadge('metal_master');
    }

    // 2. Non-Metal Ninja: Complete Level 2 with 75% accuracy
    if (levelId === 2 && accuracy >= 75) {
      addBadge('non_metal_ninja');
    }

    // 3. Speedster: Complete any level in less than 5 minutes (300 seconds)
    if (timeTaken < 300) {
      addBadge('speedster');
    }

    // 4. Perfect Score: 100% accuracy in any level
    if (accuracy === 100) {
      addBadge('perfect_score');
    }

    // 5. Science Champion: Complete all levels with 90% accuracy
    const uniqueCompleted = [...new Set(stateContext.completedLevels)];
    if (
      uniqueCompleted.includes(1) &&
      uniqueCompleted.includes(2) &&
      uniqueCompleted.includes(3) &&
      stateContext.accuracy.level1 >= 90 &&
      stateContext.accuracy.level2 >= 90 &&
      stateContext.accuracy.level3 >= 90
    ) {
      addBadge('science_champion');
    }

    return { unlocked, newlyUnlocked };
  };

  // --- Setting Toggles ---
  const handleToggleSound = () => {
    const updatedMuted = !gameState.soundMuted;
    audio.setMuted(updatedMuted);
    if (!updatedMuted) {
      audio.playClick();
    }
    const updated = { ...gameState, soundMuted: updatedMuted };
    setGameState(updated);
    saveGameState(updated);
  };

  const handleToggleTheme = () => {
    audio.playClick();
    const updatedTheme = !gameState.darkMode;
    const updated = { ...gameState, darkMode: updatedTheme };
    setGameState(updated);
    saveGameState(updated);
  };

  // Render active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen setScreen={setScreen} gameState={gameState} />;
      case 'learn':
        return <LetsLearnScreen setScreen={setScreen} gameState={gameState} setGameState={setGameState} />;
      case 'levels':
        return (
          <LevelSelectionScreen
            setScreen={setScreen}
            setSelectedLevel={setSelectedLevel}
            gameState={gameState}
          />
        );
      case 'game':
        return (
          <GameScreen
            selectedLevel={selectedLevel}
            setScreen={setScreen}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 'completed':
        return (
          <LevelCompletedScreen
            levelId={lastLevelCompleted}
            score={lastScoreEarned}
            accuracy={lastAccuracyEarned}
            time={lastTimeEarned}
            newlyUnlockedBadges={newlyUnlockedBadges}
            setScreen={setScreen}
            setSelectedLevel={setSelectedLevel}
          />
        );
      case 'achievements':
        return <AchievementsScreen gameState={gameState} setScreen={setScreen} />;
      case 'leaderboard':
        return <LeaderboardScreen gameState={gameState} setScreen={setScreen} />;
      case 'howto':
        return <HowToPlayScreen setScreen={setScreen} />;
      case 'certificate':
        const totalScore = Object.values(gameState.scores).reduce((a, b) => a + b, 0);
        // Calculate average accuracy of completed levels
        const completedCount = gameState.completedLevels.length || 1;
        const sumAccuracy = Object.values(gameState.accuracy).reduce((a, b) => a + b, 0);
        const averageAccuracy = Math.round(sumAccuracy / completedCount);
        const today = new Date().toISOString().split('T')[0];

        return (
          <CertificateCanvas
            playerName={gameState.playerName}
            totalScore={totalScore}
            averageAccuracy={averageAccuracy}
            completionDate={today}
          />
        );
      case 'profile':
      default:
        return (
          <ProfileSettingsScreen
            gameState={gameState}
            setGameState={setGameState}
            setScreen={setScreen}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${gameState.darkMode ? 'neon-active' : ''}`}>
      {/* Background drifting science particles */}
      <BackgroundParticles />

      {/* Main navigation header */}
      <Navigation
        currentScreen={currentScreen}
        setScreen={setScreen}
        gameState={gameState}
        openSettings={() => setIsSettingsOpen(true)}
      />

      {/* Core Screen Container */}
      <main className="flex-1 w-full flex items-center justify-center py-6 px-4 z-10">
        {renderScreen()}
      </main>

      {/* Quick Settings Modal overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-panel-neon rounded-3xl border border-white/10 p-6 flex flex-col gap-6 animate-fadeIn text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-100 uppercase tracking-wider">
                Laboratory Settings
              </h3>
              <button
                onClick={() => { audio.playClick(); setIsSettingsOpen(false); }}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Sound Controls */}
              <button
                onClick={handleToggleSound}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  !gameState.soundMuted
                    ? 'border-green-500/20 bg-green-950/15 text-green-400'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider">Sound Effects</span>
                  <span className="text-[10px] text-slate-500 font-medium">Synthesized audio cues</span>
                </div>
                {!gameState.soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Neon Theme Controls */}
              <button
                onClick={handleToggleTheme}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  gameState.darkMode
                    ? 'border-purple-500/20 bg-purple-950/15 text-purple-400'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider">Neon Visuals</span>
                  <span className="text-[10px] text-slate-500 font-medium">Glow shadows & elements</span>
                </div>
                {gameState.darkMode ? <Moon className="w-4 h-4 animate-pulse" /> : <Sun className="w-4 h-4" />}
              </button>

            </div>

            {/* Profile configuration button */}
            <button
              onClick={() => {
                audio.playClick();
                setIsSettingsOpen(false);
                setScreen('profile');
              }}
              className="py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Configure Profile & Avatar
            </button>

            <button
              onClick={() => { audio.playClick(); setIsSettingsOpen(false); }}
              className="py-3 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center cursor-pointer"
            >
              Close Menu
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

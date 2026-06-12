import React, { useEffect } from 'react';
import { Trophy, Clock, CheckCircle, Award, ArrowRight, Home, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

export default function LevelCompletedScreen({ 
  levelId, 
  score, 
  accuracy, 
  time, 
  newlyUnlockedBadges, 
  setScreen, 
  setSelectedLevel 
}) {
  
  // Trigger victory fanfare and confetti on mount
  useEffect(() => {
    if (newlyUnlockedBadges && newlyUnlockedBadges.length > 0) {
      audio.playUnlock();
    } else {
      audio.playComplete();
    }
    
    // Multiple confetti bursts
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [newlyUnlockedBadges]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleNext = () => {
    audio.playClick();
    if (levelId < 3) {
      setSelectedLevel(levelId + 1);
      setScreen('game');
    } else {
      setScreen('levels');
    }
  };

  const handleRetry = () => {
    audio.playClick();
    setSelectedLevel(levelId);
    setScreen('game');
  };

  const handleHome = () => {
    audio.playClick();
    setScreen('home');
  };

  const getBadgeDetails = (badgeId) => {
    switch (badgeId) {
      case 'metal_master':
        return { name: 'Metal Master 🎖️', desc: 'Scored 80% or higher accuracy.' };
      case 'non_metal_ninja':
        return { name: 'Non-Metal Ninja ⚫', desc: 'Completed Level 2 with 75% accuracy.' };
      case 'science_champion':
        return { name: 'Science Champion 🏆', desc: 'Completed all levels with 90% accuracy.' };
      case 'speedster':
        return { name: 'Speedster ⚡', desc: 'Completed a level in under 5 minutes.' };
      case 'perfect_score':
        return { name: 'Perfect Score 💯', desc: '100% accuracy on first attempt.' };
      default:
        return { name: 'Science Explorer 🏅', desc: 'Level successfully completed.' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-8 relative z-10">
      
      {/* Celebration Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-6xl animate-bounce duration-1000">🎉</span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-wide text-white uppercase glow-text-purple">
          MISSION COMPLETED!
        </h2>
        <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">
          Level {levelId} sorting sequence successfully resolved
        </p>
      </div>

      {/* Stats Summary Card */}
      <div className="w-full max-w-xl glass-panel-neon rounded-3xl p-6 border border-purple-500/30 flex flex-col gap-6 relative overflow-hidden">
        
        {/* Glow overlay */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-600/10 blur-xl"></div>
        
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/10">
          
          <div className="flex flex-col gap-1">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-1">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Score</span>
            <span className="text-xl sm:text-2xl font-black text-white">{score} <span className="text-[10px] text-cyan-400">pts</span></span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-success flex items-center justify-center mx-auto mb-1">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Accuracy</span>
            <span className="text-xl sm:text-2xl font-black text-green-success">{accuracy}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Time Taken</span>
            <span className="text-xl sm:text-2xl font-black text-orange-400">{formatTime(time)}</span>
          </div>

        </div>

        {/* Accuracy Feedback Warning */}
        {accuracy < 80 && (
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-400/20 text-xs text-orange-300 font-bold text-center">
            💡 Tip: Replay this level with higher accuracy to unlock the <strong>Metal Master</strong> or <strong>Perfect Score</strong> badge!
          </div>
        )}
      </div>

      {/* Badge Unlocked Celebration Box */}
      {newlyUnlockedBadges && newlyUnlockedBadges.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-4">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest text-center">
            🏆 NEW BADGE UNLOCKED!
          </h3>
          <div className="flex flex-col gap-3">
            {newlyUnlockedBadges.map((badgeId) => {
              const details = getBadgeDetails(badgeId);
              return (
                <div
                  key={badgeId}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-amber-400/30 bg-amber-950/5 animate-pulse-glow glow-shadow-orange"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                    🏅
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-black text-amber-400 uppercase tracking-wider">
                      {details.name}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">
                      {details.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-xl">
        
        {levelId < 3 ? (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:scale-105 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            Next Mission <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => { audio.playClick(); setScreen('certificate'); }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:scale-105 transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            Claim Certificate 📜
          </button>
        )}

        <button
          onClick={handleRetry}
          className="w-full sm:w-auto px-5 py-4 bg-slate-900 text-slate-300 hover:text-white font-black text-sm uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Replay
        </button>

        <button
          onClick={handleHome}
          className="w-full sm:w-auto px-5 py-4 bg-slate-900 text-slate-300 hover:text-white font-black text-sm uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>
      
    </div>
  );
}

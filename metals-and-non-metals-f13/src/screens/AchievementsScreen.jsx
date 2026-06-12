import React from 'react';
import { Award, Lock, ShieldCheck, Compass, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

export default function AchievementsScreen({ gameState, setScreen }) {
  const { unlockedAchievements } = gameState;

  const achievements = [
    {
      id: 'metal_master',
      name: 'Metal Master',
      emoji: '🎖️',
      desc: 'Achieve an accuracy rate of 80% or higher in any level.',
      criteria: 'Accuracy >= 80%',
      colorClass: 'from-blue-500 to-indigo-600 border-indigo-400 text-indigo-400 bg-indigo-950/20'
    },
    {
      id: 'science_explorer',
      name: 'Science Explorer',
      emoji: '🧭',
      desc: 'Complete all 10 learning modules in the Let\'s Learn science center.',
      criteria: 'Complete the Let\'s Learn Module',
      colorClass: 'from-cyan-400 to-blue-500 border-cyan-400 text-cyan-400 bg-cyan-950/20'
    },
    {
      id: 'non_metal_ninja',
      name: 'Non-Metal Ninja',
      emoji: '⚫',
      desc: 'Complete Level 2 (Property Matching) with 75% accuracy or higher.',
      criteria: 'Complete Lvl 2 with Accuracy >= 75%',
      colorClass: 'from-purple-500 to-pink-600 border-pink-400 text-pink-400 bg-pink-950/20'
    },
    {
      id: 'science_champion',
      name: 'Science Champion',
      emoji: '🏆',
      desc: 'Complete all three levels with 90% or higher accuracy.',
      criteria: 'All Levels Complete with Accuracy >= 90%',
      colorClass: 'from-amber-400 to-orange-500 border-orange-400 text-orange-400 bg-orange-950/20 animate-pulse-glow'
    },
    {
      id: 'speedster',
      name: 'Speedster',
      emoji: '⚡',
      desc: 'Sprint through any level and solve it in under 5 minutes.',
      criteria: 'Complete any Level in < 5 Minutes',
      colorClass: 'from-yellow-400 to-amber-500 border-yellow-400 text-yellow-400 bg-yellow-950/20'
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      emoji: '💯',
      desc: 'Get 100% accuracy on first attempt in any level.',
      criteria: 'Accuracy = 100% in any Level',
      colorClass: 'from-green-400 to-emerald-500 border-green-400 text-green-400 bg-green-950/20'
    }
  ];

  const unlockedCount = achievements.filter(ach => unlockedAchievements?.includes(ach.id)).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const handleStartGame = () => {
    audio.playClick();
    setScreen('levels');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-wide text-white uppercase">
          ACADEMY BADGES & TROPHIES
        </h2>
        <p className="text-sm font-black text-cyan-400 uppercase tracking-widest">
          Test your chemistry knowledge to unlock achievements
        </p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center glow-shadow-cyan">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-100 uppercase tracking-wider">Badge Progression</h3>
            <p className="text-xs text-slate-400 font-medium">Earn scientist rankings by resolving classroom missions.</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-md w-full flex flex-col gap-2">
          <div className="flex justify-between text-xs font-black text-slate-300">
            <span>UNLOCKED: {unlockedCount} / {achievements.length}</span>
            <span className="text-cyan-400">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full border border-white/5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-theme to-cyan-theme transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          
          return (
            <div
              key={ach.id}
              className={`glass-panel p-6 rounded-3xl border-2 flex flex-col justify-between text-left transition-all duration-300 relative ${
                isUnlocked 
                  ? `${ach.colorClass} border-opacity-70 scale-102 glow-shadow-purple`
                  : 'border-slate-800/80 grayscale opacity-45'
              }`}
            >
              
              {/* Lock Symbol Watermark */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950/60 border border-white/5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
              )}

              {isUnlocked && (
                <div className="absolute top-4 right-4 p-1 rounded-full bg-green-500/10 text-green-success border border-green-500/20">
                  <ShieldCheck className="w-5 h-5 fill-current" />
                </div>
              )}

              {/* Badge Icon */}
              <div className="flex flex-col gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isUnlocked ? ach.colorClass : 'from-slate-800 to-slate-900 border-slate-700'} flex items-center justify-center text-4xl shadow-lg border`}>
                  {ach.emoji}
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-100 tracking-wide uppercase">
                    {ach.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                    {ach.desc}
                  </p>
                </div>
              </div>

              {/* Requirements indicator */}
              <div className="mt-6 pt-3 border-t border-white/5 flex flex-col gap-1 text-[10px] font-black uppercase tracking-wider">
                <span className="text-slate-500">Requirement:</span>
                <span className={isUnlocked ? 'text-white' : 'text-slate-400'}>
                  {ach.criteria}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Helper trigger */}
      {unlockedCount < achievements.length && (
        <div className="mt-4">
          <button
            onClick={handleStartGame}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-103 transition-all cursor-pointer"
          >
            Start Mission to Earn Badges
          </button>
        </div>
      )}
      
    </div>
  );
}

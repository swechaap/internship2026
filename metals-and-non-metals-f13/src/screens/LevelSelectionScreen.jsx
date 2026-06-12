import React from 'react';
import { Lock, Unlock, Play, ChevronRight, Award, Compass, HelpCircle, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

export default function LevelSelectionScreen({ setScreen, setSelectedLevel, gameState }) {
  const { completedLevels, scores, accuracy } = gameState;

  // Level unlocking logic
  const isLevel2Unlocked = completedLevels.includes(1) || scores.level1 > 0;
  const isLevel3Unlocked = (completedLevels.includes(2) || scores.level2 > 0) && isLevel2Unlocked;

  const levels = [
    {
      id: 1,
      title: 'Basic Classification',
      emoji: '🌱',
      desc: 'Identify elemental metals and non-metals by their chemical names and periodic table symbols.',
      isUnlocked: true,
      score: scores.level1,
      acc: accuracy.level1,
      themeColor: 'border-green-500/30 text-green-400 bg-green-950/10'
    },
    {
      id: 2,
      title: 'Property Matching',
      emoji: '🌿',
      desc: 'Match physical traits (lustrous, malleable, brittle, sonorous, heat conductivity) to metals and non-metals.',
      isUnlocked: isLevel2Unlocked,
      score: scores.level2,
      acc: accuracy.level2,
      themeColor: 'border-purple-500/30 text-purple-400 bg-purple-950/10'
    },
    {
      id: 3,
      title: 'Real-Life Objects',
      emoji: '🌳',
      desc: 'Classify everyday real-world utility items (copper wires, pencil leads, plastic cups) based on their components.',
      isUnlocked: isLevel3Unlocked,
      score: scores.level3,
      acc: accuracy.level3,
      themeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/10'
    }
  ];

  const handleSelectLevel = (levelId, isUnlocked) => {
    if (!isUnlocked) {
      audio.playWrong();
      return;
    }
    audio.playClick();
    setSelectedLevel(levelId);
    setScreen('game');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-wide text-white uppercase">
          CHOOSE YOUR SCIENTIFIC MISSION
        </h2>
        <p className="text-sm font-black text-cyan-400 uppercase tracking-widest">
          Complete previous levels to unlock advanced laboratory challenges
        </p>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            onClick={() => handleSelectLevel(lvl.id, lvl.isUnlocked)}
            className={`glass-panel p-6 rounded-3xl border-2 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
              lvl.isUnlocked 
                ? 'cursor-pointer hover:border-white/20 hover:scale-102 hover:shadow-2xl' 
                : 'opacity-65 select-none border-red-950/30 bg-red-950/5'
            } ${lvl.isUnlocked ? lvl.themeColor : 'border-slate-800'}`}
          >
            {/* Locked watermark background */}
            {!lvl.isUnlocked && (
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-panel border border-white/5 glow-shadow-purple text-center">
                  <Lock className="w-8 h-8 text-red-400 animate-pulse" />
                  <p className="text-xs font-black text-slate-300 uppercase tracking-widest">LOCKED</p>
                  <p className="text-[10px] text-slate-400">Complete Level {lvl.id - 1} First</p>
                </div>
              </div>
            )}

            {/* Level badge */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-5xl" role="img" aria-label={`level ${lvl.id}`}>
                {lvl.emoji}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-400">
                  Level {lvl.id}
                </span>
                {lvl.score > 0 && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-black text-green-success uppercase">
                    <Trophy className="w-3 h-3 text-orange-400" /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Text description */}
            <div className="mt-6 flex flex-col gap-2 text-left">
              <h3 className="text-xl font-black text-slate-100 group-hover:text-white transition-all">
                {lvl.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {lvl.desc}
              </p>
            </div>

            {/* Stats / Play Button Footer */}
            <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-4">
              
              {/* Previous completion stats */}
              {lvl.score > 0 ? (
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>High Score: <strong className="text-cyan-400">{lvl.score} pts</strong></span>
                  <span>Accuracy: <strong className="text-green-success">{lvl.acc}%</strong></span>
                </div>
              ) : (
                <div className="text-xs font-black text-slate-500 text-left">
                  {lvl.isUnlocked ? '🌱 Not played yet' : '🔒 Complete previous level to access'}
                </div>
              )}

              {/* Action Button */}
              {lvl.isUnlocked ? (
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-theme to-indigo-600 text-white font-black text-xs uppercase tracking-widest group-hover:from-purple-theme group-hover:to-cyan-theme transition-all duration-300 shadow-md group-hover:scale-103 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play Challenge
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-slate-600 font-black text-xs uppercase tracking-widest border border-white/5">
                  <Lock className="w-3.5 h-3.5" />
                  Level Locked
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Helper Tips */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 text-left flex items-start gap-4">
        <div className="p-3 bg-cyan-400/10 text-cyan-400 rounded-xl">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-200 uppercase tracking-wider">Teacher & Student Tips:</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Metals and non-metals are classified based on physical and chemical qualities. Level 1 introduces simple element recognition. Level 2 tests specific attributes like <strong>malleability</strong> (ability to be hammered into sheets) and <strong>malleable vs brittle</strong> properties. Level 3 applies this knowledge to real household utensils. Read the "How to Play" section to learn all concepts before starting!
          </p>
        </div>
      </div>
      
    </div>
  );
}

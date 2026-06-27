import React, { useState } from 'react';
import { User, Volume2, VolumeX, Moon, Sun, Trash2, ShieldAlert, Award, Play, Check } from 'lucide-react';
import { resetGameState, saveGameState } from '../utils/storage';
import { audio } from '../utils/audio';

export default function ProfileSettingsScreen({ gameState, setGameState, setScreen }) {
  const { playerName, playerAvatar, scores, completedLevels, unlockedAchievements, soundMuted, darkMode } = gameState;

  const [inputName, setInputName] = useState(playerName);
  const [selectedAvatar, setSelectedAvatar] = useState(playerAvatar);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatar Selection List
  const avatars = [
    { id: 'chemist', emoji: '🧪', name: 'Chemist Clara' },
    { id: 'physicist', emoji: '⚛️', name: 'Physicist Paul' },
    { id: 'astronaut', emoji: '🚀', name: 'Astronaut Alex' },
    { id: 'robot', emoji: '🤖', name: 'Robo Science' }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    audio.playClick();
    
    const updated = {
      ...gameState,
      playerName: inputName.trim() || 'Star Student',
      playerAvatar: selectedAvatar
    };
    
    setGameState(updated);
    saveGameState(updated);
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    // If profile is set, send them to levels
    setTimeout(() => {
      setScreen('levels');
    }, 800);
  };

  const handleToggleSound = () => {
    const updatedMuted = !soundMuted;
    audio.setMuted(updatedMuted);
    // Play a click only if we just unmuted
    if (!updatedMuted) {
      setTimeout(() => audio.playClick(), 50);
    }
    
    const updated = {
      ...gameState,
      soundMuted: updatedMuted
    };
    setGameState(updated);
    saveGameState(updated);
  };

  const handleToggleTheme = () => {
    audio.playClick();
    const updatedMode = !darkMode;
    const updated = {
      ...gameState,
      darkMode: updatedMode
    };
    setGameState(updated);
    saveGameState(updated);
  };

  const handleResetProgress = () => {
    audio.playWrong(); // Play buzzer sound to alert
    const freshState = resetGameState();
    setGameState(freshState);
    setInputName('');
    setSelectedAvatar('chemist');
    setShowResetConfirm(false);
  };

  // Cumulative Stats
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
      
      {/* Col 1 & 2: Profile Settings */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6 text-left">
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Student Laboratory Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Student Name:
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                maxLength={20}
                required
                className="px-4 py-3 bg-slate-900 border border-white/10 rounded-2xl font-bold text-slate-100 focus:border-purple-400 focus:outline-none transition-all duration-300 text-sm"
                placeholder="Enter your name..."
              />
            </div>

            {/* Avatar Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Select Your Lab Avatar:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {avatars.map((av) => (
                  <div
                    key={av.id}
                    onClick={() => { audio.playClick(); setSelectedAvatar(av.id); }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                      selectedAvatar === av.id
                        ? 'border-purple-theme bg-purple-950/20 glow-shadow-purple text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-4xl" role="img" aria-label={av.name}>
                      {av.emoji}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-center">
                      {av.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-102 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5 text-green-300" /> Profile Saved!
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Save and Enter Lab
                </>
              )}
            </button>

          </form>
        </div>

        {/* Technical Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6 text-left">
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
            Game Settings
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                !soundMuted 
                  ? 'border-green-500/20 bg-green-950/15 text-green-400' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider">Sound Effects</span>
                <span className="text-[10px] text-slate-400 font-medium">Synthesized audio chimes</span>
              </div>
              {!soundMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Neon Dark Mode Toggle */}
            <button
              onClick={handleToggleTheme}
              className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                darkMode 
                  ? 'border-purple-500/20 bg-purple-950/15 text-purple-400' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider">Neon Visuals</span>
                <span className="text-[10px] text-slate-400 font-medium">Glow effects & animations</span>
              </div>
              {darkMode ? <Moon className="w-5 h-5 animate-pulse" /> : <Sun className="w-5 h-5" />}
            </button>

          </div>
        </div>

      </div>

      {/* Col 3: Statistics Summary */}
      <div className="flex flex-col gap-6">
        
        {/* Statistics Scorebox */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
          
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
            Your Statistics
          </h2>

          <div className="flex flex-col gap-4 font-black">
            
            <div className="flex justify-between items-center py-2.5 border-b border-white/5">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Score:</span>
              <span className="text-lg text-cyan-400">{totalScore} PTS</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-white/5">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Levels Completed:</span>
              <span className="text-sm text-purple-400">{completedLevels.length} / 3</span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Badges Earned:</span>
              <span className="text-sm text-orange-400 flex items-center gap-1">
                <Award className="w-4 h-4 text-orange-400" />
                {unlockedAchievements.length} / 5
              </span>
            </div>

          </div>
        </div>

        {/* Danger Reset Progress */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-950/5 flex flex-col gap-4 text-left">
          <h3 className="text-sm font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Resetting your progress clears your completed levels, custom score records, and earned badges. This action cannot be undone.
          </p>
          
          {showResetConfirm ? (
            <div className="flex flex-col gap-2 animate-fadeIn">
              <p className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Are you absolutely sure?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetProgress}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 rounded-xl bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { audio.playClick(); setShowResetConfirm(true); }}
              className="w-full py-3 rounded-xl bg-red-950/30 hover:bg-red-900/30 border border-red-500/30 text-red-400 hover:text-red-300 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Reset Game Progress
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

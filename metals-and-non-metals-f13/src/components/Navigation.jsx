import React, { useState } from 'react';
import { Trophy, Award, HelpCircle, Settings, Home, Play, Menu, X, BookOpen } from 'lucide-react';
import { audio } from '../utils/audio';

export default function Navigation({ currentScreen, setScreen, gameState, openSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { playerName, playerAvatar, scores } = gameState;

  // Calculate cumulative score
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleNav = (screen) => {
    audio.playClick();
    setScreen(screen);
    setMobileMenuOpen(false);
  };

  const getAvatarEmoji = (avatar) => {
    switch (avatar) {
      case 'chemist': return '🧪';
      case 'physicist': return '⚛️';
      case 'astronaut': return '🚀';
      case 'robot': return '🤖';
      default: return '🧪';
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'learn', label: "Let's Learn", icon: <BookOpen className="w-4 h-4" /> },
    { id: 'levels', label: 'Levels', icon: <Play className="w-4 h-4" /> },
    { id: 'achievements', label: 'Badges', icon: <Award className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'howto', label: 'How to Play', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo / Title */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-theme to-cyan-theme text-white glow-shadow-purple transition-all duration-300 group-hover:scale-105">
            <span className="text-xl font-bold font-mono">🧪</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              METAL vs NON-METAL
            </h1>
            <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest leading-none">
              CHALLENGE
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                currentScreen === item.id
                  ? 'bg-gradient-to-r from-purple-theme to-indigo-600 text-white glow-shadow-purple scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Player Profile & Settings */}
        <div className="flex items-center gap-3">
          {playerName && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-xl" role="img" aria-label="avatar">
                {getAvatarEmoji(playerAvatar)}
              </span>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-100 max-w-[100px] truncate">
                  {playerName}
                </p>
                <p className="text-[10px] font-bold text-green-success">
                  {totalScore} PTS
                </p>
              </div>
              <div className="md:hidden text-xs font-black text-green-success">
                {totalScore} pts
              </div>
            </div>
          )}

          {/* Quick Settings Icon */}
          <button
            onClick={() => { audio.playClick(); openSettings(); }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 border border-white/5 hover:scale-105"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 animate-spin-hover" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => { audio.playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-all duration-200 border border-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-3 rounded-2xl bg-slate-950/95 border border-white/10 flex flex-col gap-1.5 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                currentScreen === item.id
                  ? 'bg-gradient-to-r from-purple-theme to-cyan-theme text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

import React from 'react';
import { Play, Sparkles, BookOpen, AlertCircle, Award, CheckCircle } from 'lucide-react';
import { audio } from '../utils/audio';

export default function HowToPlayScreen({ setScreen }) {
  const steps = [
    {
      step: 'Step 1',
      title: 'Select a Level',
      desc: 'Start with 🌱 Level 1 (Basic Classification). Complete it successfully to unlock 🌿 Level 2 (Property Matching) and 🌳 Level 3 (Real-Life Objects).',
      illustration: '🌱 ➔ 🌿 ➔ 🌳'
    },
    {
      step: 'Step 2',
      title: 'Drag and Drop Items',
      desc: 'Drag the card in the center to the METALS flask on the left, or the NON-METALS flask on the right. Playing on phone? Simply tap the bottom touch buttons!',
      illustration: '◀ 🧲   [ CARD ]   ☁ ▶'
    },
    {
      step: 'Step 3',
      title: 'Analyze & Earn Points',
      desc: 'Each correct sort yields +10 points and displays an interactive scientific fun fact! Wrong sorts trigger a shake and consume 1 life.',
      illustration: '✅ +10 PTS | ❌ Shake'
    },
    {
      step: 'Step 4',
      title: 'Unlock Badges',
      desc: 'Earn 5 different scientist accolades such as Speedster (level under 5 min) or Perfect Score (100% accuracy) to level up your status.',
      illustration: '🎖️ ⚫ 🏆 ⚡ 💯'
    },
    {
      step: 'Step 5',
      title: 'Claim Your Certificate',
      desc: 'Complete all levels and submit your score to claim your downloadable Certificate of Excellence. Save as PNG or PDF to share!',
      illustration: '📜 CERTIFICATE'
    }
  ];

  const handleStart = () => {
    audio.playClick();
    setScreen('levels');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-wide text-white uppercase">
          LABORATORY USER GUIDE
        </h2>
        <p className="text-sm font-black text-cyan-400 uppercase tracking-widest">
          How to Play, Sort, and Win Achievements
        </p>
      </div>

      {/* Guide Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between text-left relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300"
          >
            {/* Step label */}
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/10 text-cyan-400 self-start">
              {item.step}
            </span>

            {/* Illustration */}
            <div className="my-6 py-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-center font-mono text-xs font-bold text-purple-300 tracking-wider min-h-[60px] text-center">
              {item.illustration}
            </div>

            <div className="flex flex-col gap-1.5 mt-auto">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Cheat Sheet */}
      <div className="glass-panel-neon p-6 rounded-3xl border border-purple-500/30 text-left flex flex-col gap-4">
        <h3 className="text-base font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Quick Chemistry Reference Sheet
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-medium text-slate-300">
          
          <div className="p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/10 flex flex-col gap-2">
            <h4 className="font-black text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> METALS
            </h4>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li><strong>Lustrous:</strong> Shine when polished (e.g. Gold, Silver).</li>
              <li><strong>Malleable:</strong> Can be flattened into sheets (e.g. Aluminium foil).</li>
              <li><strong>Ductile:</strong> Can be drawn into long wires (e.g. Copper wire).</li>
              <li><strong>Sonorous:</strong> Make a ringing chime sound when struck.</li>
              <li><strong>Conductive:</strong> Transfer heat and electricity easily.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/10 border border-purple-500/10 flex flex-col gap-2">
            <h4 className="font-black text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> NON-METALS
            </h4>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li><strong>Dull:</strong> Do not reflect light (matte appearance).</li>
              <li><strong>Brittle:</strong> Solid non-metals shatter easily (e.g. Sulfur, Coal).</li>
              <li><strong>Insulating:</strong> Poor conductors of electricity and heat (except graphite).</li>
              <li><strong>State:</strong> Can be solids (Sulfur), liquids (Bromine), or gases (Oxygen, Nitrogen).</li>
              <li><strong>Non-Sonorous:</strong> Produce a flat thud sound when struck.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Button to Selection */}
      <div>
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:scale-105 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          Go to Level Selection
        </button>
      </div>

    </div>
  );
}

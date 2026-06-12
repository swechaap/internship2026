import React from 'react';
import { Award, Compass, Play, BookOpen, Trophy, Sparkles, Star, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { audio } from '../utils/audio';

export default function HomeScreen({ setScreen, gameState }) {
  const { playerName } = gameState;

  const handleStart = () => {
    audio.playClick();
    if (!playerName) {
      setScreen('profile'); // Force name selection if not set
    } else {
      setScreen('levels');
    }
  };

  const features = [
    {
      title: '3 Exciting Levels',
      desc: 'Progress from basic element naming to property match-ups and everyday real-world science applications.',
      icon: <GraduationCap className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Drag & Drop Play',
      desc: 'Highly interactive drag and drop interface designed for both tablets, touch devices, and desktops.',
      icon: <Compass className="w-6 h-6 text-cyan-400" />
    },
    {
      title: 'Earn Achievement Badges',
      desc: 'Lock in 5 unique scientist trophies like Speedster, Non-Metal Ninja, or Perfect Score.',
      icon: <Award className="w-6 h-6 text-orange-theme" />
    },
    {
      title: 'Excellence Certificate',
      desc: 'Download your personalized certificate in PNG/PDF to share with teachers, parents, or friends.',
      icon: <Star className="w-6 h-6 text-green-success" />
    },
    {
      title: 'Track Performance',
      desc: 'Automatic local storage persistence tracks your high score, times, accuracy, and levels unlocked.',
      icon: <Trophy className="w-6 h-6 text-blue-400" />
    },
    {
      title: 'Learn Science Facts',
      desc: 'Every classification card pops up interactive fun facts explaining how metals and non-metals behave.',
      icon: <Sparkles className="w-6 h-6 text-pink-400" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-16 relative z-10">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-4">
        
        {/* Hero Left: Text & Action */}
        <div className="flex-1 text-center lg:text-left flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-black uppercase tracking-widest self-center lg:self-start"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Class 6–8 Educational Lab
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
          >
            METAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 glow-text-purple">vs</span> NON-METAL<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">CHALLENGE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-300 max-w-xl font-medium leading-relaxed"
          >
            Enter the digital laboratory, test your chemistry skills, sort materials, and earn your official Science Academy certificate! Learn science the fun, gamified way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 mt-2"
          >
            <button
              onClick={() => { audio.playClick(); setScreen('learn'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base uppercase tracking-wider rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-600/30 cursor-pointer"
              style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.4))' }}
            >
              <BookOpen className="w-5 h-5" />
              Let's Learn!
            </button>

            <button
              onClick={handleStart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-base uppercase tracking-wider rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              {playerName ? 'Start Game' : 'Enter Lab & Play'}
            </button>

            <button
              onClick={() => { audio.playClick(); setScreen('howto'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-slate-900/60 text-slate-200 hover:text-white font-black text-sm uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              How To Play
            </button>

            <button
              onClick={() => { audio.playClick(); setScreen('leaderboard'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-slate-900/60 text-slate-200 hover:text-white font-black text-sm uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-orange-400" />
              Leaderboard
            </button>
          </motion.div>
        </div>

        {/* Hero Right: Scientist Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center items-center"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 glass-panel-neon rounded-full flex items-center justify-center animate-float-medium bg-gradient-to-tr from-purple-900/20 to-cyan-900/10">
            {/* Inner rings */}
            <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/20 animate-spin" style={{ animationDuration: '40s' }}></div>
            <div className="absolute inset-12 rounded-full border border-purple-500/10 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            
            {/* Scientist/Flask avatar */}
            <div className="text-8xl sm:text-9xl select-none filter drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              🧪👨‍🔬
            </div>

            {/* Bubble 1 */}
            <div className="absolute top-[20%] left-[20%] w-6 h-6 bg-cyan-400 rounded-full animate-ping opacity-25"></div>
            {/* Bubble 2 */}
            <div className="absolute bottom-[25%] right-[20%] w-8 h-8 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
            {/* Bubble 3 */}
            <div className="absolute top-[35%] right-[15%] w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-40"></div>
          </div>
        </motion.div>

      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-cyan-400 tracking-tight">18,520+</h3>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Students Registered</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
            <Play className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-purple-400 tracking-tight">45,910+</h3>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Lab Trials Completed</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-orange-400 tracking-tight">9,280+</h3>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Badges Earned</p>
        </div>

      </div>

      {/* Feature Cards Grid */}
      <div className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
            PROJECT FEATURES
          </h2>
          <p className="text-xs font-black tracking-widest text-cyan-400 uppercase">
            Designed for Active Classroom Learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-3 text-left hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center self-start border border-white/10 shadow-inner">
                {feat.icon}
              </div>
              <h3 className="text-lg font-black text-slate-100">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-8 border-t border-white/10 text-center text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-sm font-black text-slate-400">Metal vs Non-Metal Challenge</p>
          <p className="text-xs">Interactive Gamified Science Exhibition Project</p>
        </div>
        <p className="text-xs font-medium">
          Suitable for Class 6, 7 & 8 Science Syllabus (NCERT & CBSE / State Boards).
        </p>
        <p className="text-xs font-mono">
          Made with 💻 & 🧪 in India
        </p>
      </footer>
      
    </div>
  );
}

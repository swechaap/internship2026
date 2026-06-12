import React from 'react';
import { Trophy, Medal, Star, Calendar, User, Zap } from 'lucide-react';
import { audio } from '../utils/audio';

export default function LeaderboardScreen({ gameState, setScreen }) {
  const { leaderboard, playerName } = gameState;

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-400/40 glow-shadow-orange animate-bounce" style={{ animationDuration: '3s' }}>
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 flex items-center justify-center border border-slate-300/40">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center border border-amber-600/40">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <span className="text-xs font-black text-slate-500 w-8 text-center">
            #{rank}
          </span>
        );
    }
  };

  const handleStartGame = () => {
    audio.playClick();
    setScreen('levels');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-wide text-white uppercase">
          GLOBAL LEADERBOARD
        </h2>
        <p className="text-sm font-black text-cyan-400 uppercase tracking-widest">
          Top scientific sorting records in the academy
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Player Name</th>
                <th className="py-4 px-6">Max Level</th>
                <th className="py-4 px-6">Completion Date</th>
                <th className="py-4 px-6 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-xs sm:text-sm text-slate-300">
              {leaderboard.map((player, idx) => {
                const isCurrentPlayer = playerName && player.name.toLowerCase() === playerName.toLowerCase();
                
                return (
                  <tr
                    key={idx}
                    className={`transition-all duration-200 ${
                      isCurrentPlayer
                        ? 'bg-purple-950/20 border-y border-purple-500/30 text-white shadow-inner font-bold'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center">
                        {getRankBadge(player.rank || idx + 1)}
                      </div>
                    </td>

                    {/* Player Name */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <User className={`w-4 h-4 ${isCurrentPlayer ? 'text-purple-400' : 'text-slate-500'}`} />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {player.name}
                        </span>
                        {isCurrentPlayer && (
                          <span className="text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/20 tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Level completed */}
                    <td className="py-4.5 px-6">
                      <span className="text-xs text-cyan-400 font-bold bg-cyan-950/10 px-2.5 py-1 rounded-lg border border-cyan-500/10">
                        {player.level}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4.5 px-6 text-slate-400 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        {player.date}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4.5 px-6 text-right font-black">
                      <span className={`text-sm sm:text-base ${isCurrentPlayer ? 'text-green-success glow-text-green' : 'text-slate-100'}`}>
                        {player.score} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">pts</span>
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button to play */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleStartGame}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-theme to-cyan-theme text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:scale-105 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          Beat the High Score!
        </button>
      </div>

    </div>
  );
}

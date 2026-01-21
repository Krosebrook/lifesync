import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';

export default function Leaderboard({ leaderboardData, currentUser }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-[#666666] font-semibold">#{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400/20 to-yellow-600/20 border-yellow-500';
    if (rank === 2) return 'from-gray-300/20 to-gray-500/20 border-gray-400';
    if (rank === 3) return 'from-amber-400/20 to-amber-600/20 border-amber-500';
    return 'from-[#F0E5D8] to-[#E5D9CC] border-[#E5D9CC]';
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-[#1ABC9C]" />
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.email === currentUser;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className={`p-4 rounded-[12px] bg-gradient-to-r ${getRankColor(rank)} border-2 ${
                  isCurrentUser ? 'ring-2 ring-[#1ABC9C]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>
                    <div>
                      <p className={`font-semibold ${isCurrentUser ? 'text-[#1ABC9C]' : 'text-[#1A1A1A]'}`}>
                        {entry.name || 'Anonymous'}
                        {isCurrentUser && <span className="ml-2 text-xs text-[#1ABC9C]">(You)</span>}
                      </p>
                      <p className="text-sm text-[#666666]">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1ABC9C]">{entry.total_points}</p>
                    <p className="text-xs text-[#666666]">points</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 mx-auto mb-3 text-[#999999]" />
          <p className="text-[#666666]">Connect with friends to see the leaderboard</p>
        </div>
      )}
    </Card>
  );
}
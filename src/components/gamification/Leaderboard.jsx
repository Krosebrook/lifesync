import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Eye, EyeOff, Crown } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { base44 } from '@/api/base44Client';

export default function Leaderboard({ entries = [], currentUser, onToggleVisibility }) {
  const [filter, setFilter] = useState('all');

  const sortedEntries = [...entries]
    .filter(e => e.is_visible || e.user_email === currentUser?.email)
    .sort((a, b) => b.total_points - a.total_points);

  const topThree = sortedEntries.slice(0, 3);
  const rest = sortedEntries.slice(3, 10);

  const currentUserEntry = entries.find(e => e.user_email === currentUser?.email);
  const currentUserRank = sortedEntries.findIndex(e => e.user_email === currentUser?.email) + 1;

  const medals = [
    { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100' },
    { icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' }
  ];

  return (
    <div className="space-y-4">
      {/* Current User Status */}
      {currentUserEntry && (
        <Card className="bg-gradient-to-r from-[#1ABC9C]/10 to-[#4DD0E1]/10 border-2 border-[#1ABC9C]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1ABC9C] rounded-full flex items-center justify-center text-white font-bold">
                #{currentUserRank}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A]">{currentUserEntry.display_name}</p>
                <p className="text-sm text-[#666]">{currentUserEntry.total_points} points • Level {currentUserEntry.level}</p>
              </div>
            </div>
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="icon"
            >
              {currentUserEntry.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>
        </Card>
      )}

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {topThree.map((entry, idx) => {
          const MedalIcon = medals[idx].icon;
          const isCurrentUser = entry.user_email === currentUser?.email;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`text-center ${isCurrentUser ? 'border-2 border-[#1ABC9C]' : ''}`}>
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${medals[idx].bg}`}>
                  <MedalIcon className={`w-8 h-8 ${medals[idx].color}`} />
                </div>
                <p className="font-semibold text-[#1A1A1A] text-sm mb-1">
                  {isCurrentUser ? 'You' : entry.display_name}
                </p>
                <p className="text-xs text-[#666] mb-1">{entry.total_points} pts</p>
                <p className="text-xs text-[#999]">Level {entry.level}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <Card>
          <div className="space-y-2">
            {rest.map((entry, idx) => {
              const rank = idx + 4;
              const isCurrentUser = entry.user_email === currentUser?.email;
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser ? 'bg-[#1ABC9C]/10' : 'hover:bg-[#F0E5D8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-semibold text-[#666]">#{rank}</span>
                    <div>
                      <p className="font-medium text-sm text-[#1A1A1A]">
                        {isCurrentUser ? 'You' : entry.display_name}
                      </p>
                      <p className="text-xs text-[#999]">{entry.total_points} points</p>
                    </div>
                  </div>
                  <span className="text-sm text-[#666]">Lvl {entry.level}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
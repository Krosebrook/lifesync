import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Award, Lock, Flame, Star, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

import Card from '../components/shared/Card';
import ProgressRing from '../components/shared/ProgressRing';

const allPossibleAchievements = [
  // Streak Achievements
  { type: 'streak', name: '7 Day Streak', description: 'Complete habits for 7 days straight', threshold: 7, icon: '🔥', color: '#E67E22' },
  { type: 'streak', name: '14 Day Streak', description: 'Complete habits for 14 days straight', threshold: 14, icon: '💪', color: '#E67E22' },
  { type: 'streak', name: '30 Day Streak', description: 'Complete habits for 30 days straight', threshold: 30, icon: '⚡', color: '#F39C12' },
  { type: 'streak', name: '60 Day Streak', description: 'Complete habits for 60 days straight', threshold: 60, icon: '✨', color: '#9B59B6' },
  { type: 'streak', name: '100 Day Streak', description: 'Complete habits for 100 days straight', threshold: 100, icon: '💎', color: '#E74C3C' },
  
  // Habit Milestones
  { type: 'milestone', name: 'First Habit', description: 'Create your first habit', threshold: 1, icon: '🎯', color: '#1ABC9C' },
  { type: 'milestone', name: 'Habit Builder', description: 'Create 5 different habits', threshold: 5, icon: '🏗️', color: '#3498DB' },
  { type: 'milestone', name: 'Habit Master', description: 'Create 10 different habits', threshold: 10, icon: '👑', color: '#9B59B6' },
  
  // Journal Achievements
  { type: 'milestone', name: 'Journal Starter', description: 'Write your first journal entry', threshold: 1, icon: '📝', color: '#3498DB' },
  { type: 'milestone', name: '10 Reflections', description: 'Complete 10 journal entries', threshold: 10, icon: '📚', color: '#3498DB' },
  { type: 'milestone', name: '30 Reflections', description: 'Complete 30 journal entries', threshold: 30, icon: '📖', color: '#9B59B6' },
  { type: 'milestone', name: '100 Reflections', description: 'Complete 100 journal entries', threshold: 100, icon: '🎓', color: '#E74C3C' },
  
  // Gratitude Achievements
  { type: 'badge', name: 'Grateful Heart', description: 'Log gratitude 10 times', threshold: 10, icon: '🙏', color: '#27AE60' },
  { type: 'badge', name: 'Gratitude Master', description: 'Log gratitude 20 times', threshold: 20, icon: '💚', color: '#27AE60' },
  
  // Daily Practice
  { type: 'badge', name: 'Intentional Living', description: 'Complete 30 days of daily intentions', threshold: 30, icon: '✨', color: '#F39C12' },
  { type: 'badge', name: 'Morning Ritual', description: 'Set daily intentions for 7 consecutive days', threshold: 7, icon: '🌅', color: '#E67E22' },
  
  // Weekly Reviews
  { type: 'badge', name: 'Weekly Warrior', description: 'Complete your first weekly review', threshold: 1, icon: '📊', color: '#3498DB' },
  { type: 'badge', name: 'Reflection Pro', description: 'Complete 10 weekly reviews', threshold: 10, icon: '🎯', color: '#9B59B6' },

  // Challenge Achievements
  { type: 'badge', name: 'Challenge Accepted', description: 'Complete your first habit challenge', threshold: 1, icon: '🏆', color: '#F39C12' },
  { type: 'badge', name: 'Challenge Champion', description: 'Complete 5 habit challenges', threshold: 5, icon: '👑', color: '#E74C3C' }
];

const categoryIcons = {
  streak: Flame,
  milestone: Target,
  badge: Award
};

export default function Achievements() {
  // Queries
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list(),
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.list(),
  });

  const unlockedNames = achievements.map(a => a.name);
  const unlockedAchievements = allPossibleAchievements.filter(a => unlockedNames.includes(a.name));
  const lockedAchievements = allPossibleAchievements.filter(a => !unlockedNames.includes(a.name));

  // Group achievements by type
  const achievementsByType = {
    streak: unlockedAchievements.filter(a => a.type === 'streak'),
    milestone: unlockedAchievements.filter(a => a.type === 'milestone'),
    badge: unlockedAchievements.filter(a => a.type === 'badge')
  };

  const completionRate = Math.round((unlockedAchievements.length / allPossibleAchievements.length) * 100);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Achievements</h1>
        <p className="text-[#666666] mt-1">Your journey of personal growth</p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ProgressRing progress={completionRate} size={150} strokeWidth={12}>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1ABC9C]">{completionRate}%</p>
              <p className="text-xs text-[#666666]">Complete</p>
            </div>
          </ProgressRing>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-3">
              {unlockedAchievements.length} / {allPossibleAchievements.length} Unlocked
            </h3>
            <p className="text-[#666666] mb-4">
              Keep building your habits and reflecting on your journey to unlock more achievements!
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#E67E22]/10 rounded-[12px]">
                <Flame className="w-6 h-6 text-[#E67E22] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#1A1A1A]">{achievementsByType.streak.length}</p>
                <p className="text-xs text-[#666666]">Streaks</p>
              </div>
              <div className="text-center p-3 bg-[#3498DB]/10 rounded-[12px]">
                <Target className="w-6 h-6 text-[#3498DB] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#1A1A1A]">{achievementsByType.milestone.length}</p>
                <p className="text-xs text-[#666666]">Milestones</p>
              </div>
              <div className="text-center p-3 bg-[#9B59B6]/10 rounded-[12px]">
                <Award className="w-6 h-6 text-[#9B59B6] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#1A1A1A]">{achievementsByType.badge.length}</p>
                <p className="text-xs text-[#666666]">Badges</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F39C12]" />
            Earned Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement, index) => {
              const unlockedData = achievements.find(a => a.name === achievement.name);
              const Icon = categoryIcons[achievement.type];
              
              return (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <Card className="relative overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all">
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    
                    <div 
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                      style={{ backgroundColor: achievement.color }}
                    />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-14 h-14 rounded-[12px] flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${achievement.color}20` }}
                        >
                          {achievement.icon}
                        </div>
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: achievement.color }}
                        />
                      </div>
                      
                      <h4 className="font-semibold text-[#1A1A1A] mb-1">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-[#666666] mb-3">
                        {achievement.description}
                      </p>
                      
                      {unlockedData?.unlocked_date && (
                        <div className="flex items-center gap-2 text-xs text-[#999999]">
                          <Calendar className="w-3 h-3" />
                          Unlocked {format(new Date(unlockedData.unlocked_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-[#666666] mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Locked ({lockedAchievements.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lockedAchievements.map((achievement, index) => {
            const Icon = categoryIcons[achievement.type];
            
            return (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card padding="p-4" className="bg-[#FAFAFA] border-2 border-dashed border-[#E5D9CC]">
                  <div className="flex items-center gap-3 mb-2 opacity-50">
                    <span className="text-2xl">{achievement.icon}</span>
                    <Icon className="w-4 h-4 text-[#999999]" />
                  </div>
                  <h4 className="font-medium text-[#999999] text-sm mb-1">
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-[#AAAAAA]">
                    {achievement.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
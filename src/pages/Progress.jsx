import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Award, Flame, Target, TrendingUp, Trophy, Lock } from 'lucide-react';

import Card from '../components/shared/Card';
import ProgressRing from '../components/shared/ProgressRing';
import HabitChart from '../components/progress/HabitChart';
import MoodChart from '../components/progress/MoodChart';
import AchievementCard from '../components/progress/AchievementCard';

const potentialAchievements = [
  { type: 'streak', name: '7 Day Streak', description: 'Complete habits for 7 days straight', threshold: 7, icon: '🔥' },
  { type: 'streak', name: '30 Day Streak', description: 'Complete habits for 30 days straight', threshold: 30, icon: '💪' },
  { type: 'badge', name: 'Intentional Living', description: 'Complete 30 days of daily reflections', threshold: 30, icon: '✨' },
  { type: 'milestone', name: 'First Habit', description: 'Create your first habit', threshold: 1, icon: '🎯' },
  { type: 'milestone', name: 'Journal Starter', description: 'Write your first journal entry', threshold: 1, icon: '📝' },
  { type: 'milestone', name: '10 Reflections', description: 'Complete 10 journal entries', threshold: 10, icon: '📚' },
  { type: 'badge', name: 'Gratitude Master', description: 'Log gratitude 20 times', threshold: 20, icon: '🙏' }
];

export default function Progress() {
  const queryClient = useQueryClient();

  // Queries
  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: habitLogs = [] } = useQuery({
    queryKey: ['allHabitLogs'],
    queryFn: () => base44.entities.HabitLog.list('-date', 500),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date'),
  });

  const { data: intentions = [] } = useQuery({
    queryKey: ['allIntentions'],
    queryFn: () => base44.entities.DailyIntention.list('-date'),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => base44.entities.UserProfile.list(),
  });

  const { data: gamificationProfiles = [] } = useQuery({
    queryKey: ['gamificationProfile'],
    queryFn: () => base44.entities.GamificationProfile.list(),
  });

  const createAchievementMutation = useMutation({
    mutationFn: (data) => base44.entities.Achievement.create(data),
    onSuccess: () => queryClient.invalidateQueries(['achievements']),
  });

  const updateGamificationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GamificationProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['gamificationProfile']),
  });

  const createGamificationMutation = useMutation({
    mutationFn: (data) => base44.entities.GamificationProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries(['gamificationProfile']),
  });

  // Calculate stats
  const activeHabits = habits.filter(h => h.is_active);
  const completedLogs = habitLogs.filter(l => l.completed);
  
  // Calculate overall completion rate
  const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
  const logsLast30Days = completedLogs.filter(log => last30Days.includes(log.date));
  const overallRate = activeHabits.length > 0 
    ? Math.round((logsLast30Days.length / (activeHabits.length * 30)) * 100)
    : 0;

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayLogs = completedLogs.filter(l => l.date === date);
      if (dayLogs.length > 0 && dayLogs.length === activeHabits.length) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const longestStreak = Math.max(...activeHabits.map(h => h.longest_streak || 0), currentStreak);

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = async () => {
      const existingNames = achievements.map(a => a.name);
      
      // Check habit streak achievements
      if (longestStreak >= 7 && !existingNames.includes('7 Day Streak')) {
        await createAchievementMutation.mutateAsync({
          type: 'streak',
          name: '7 Day Streak',
          description: 'Complete habits for 7 days straight',
          icon: '🔥',
          unlocked_date: format(new Date(), 'yyyy-MM-dd')
        });
      }
      
      // Check journal achievements
      if (journalEntries.length >= 1 && !existingNames.includes('Journal Starter')) {
        await createAchievementMutation.mutateAsync({
          type: 'milestone',
          name: 'Journal Starter',
          description: 'Write your first journal entry',
          icon: '📝',
          unlocked_date: format(new Date(), 'yyyy-MM-dd')
        });
      }

      // Check first habit achievement
      if (habits.length >= 1 && !existingNames.includes('First Habit')) {
        await createAchievementMutation.mutateAsync({
          type: 'milestone',
          name: 'First Habit',
          description: 'Create your first habit',
          icon: '🎯',
          unlocked_date: format(new Date(), 'yyyy-MM-dd')
        });
      }

      // Check gratitude achievements
      const gratitudeCount = journalEntries.filter(e => e.gratitude && e.gratitude.length > 0).length;
      if (gratitudeCount >= 20 && !existingNames.includes('Gratitude Master')) {
        await createAchievementMutation.mutateAsync({
          type: 'badge',
          name: 'Gratitude Master',
          description: 'Log gratitude 20 times',
          icon: '🙏',
          unlocked_date: format(new Date(), 'yyyy-MM-dd')
        });
      }

      // Check 30-day reflection badge
      if (intentions.length >= 30 && !existingNames.includes('Intentional Living')) {
        await createAchievementMutation.mutateAsync({
          type: 'badge',
          name: 'Intentional Living',
          description: 'Complete 30 days of daily reflections',
          icon: '✨',
          unlocked_date: format(new Date(), 'yyyy-MM-dd')
        });
      }
    };

    if (habits.length > 0 || journalEntries.length > 0) {
      checkAchievements();
    }
  }, [habits.length, journalEntries.length, longestStreak, intentions.length]);

  // Get locked achievements
  const unlockedNames = achievements.map(a => a.name);
  const lockedAchievements = potentialAchievements.filter(a => !unlockedNames.includes(a.name));

  // Gamification system
  const gamProfile = gamificationProfiles[0];
  const totalPoints = gamProfile?.total_points || 0;
  const level = gamProfile?.level || 1;
  const pointsToNext = gamProfile?.points_to_next_level || 100;
  const progressToNext = Math.min((totalPoints % pointsToNext) / pointsToNext * 100, 100);

  // Award points for achievements
  useEffect(() => {
    const awardPoints = async () => {
      if (!gamProfile && gamificationProfiles.length === 0 && (habits.length > 0 || journalEntries.length > 0)) {
        await createGamificationMutation.mutateAsync({
          total_points: 0,
          level: 1,
          points_to_next_level: 100
        });
        return;
      }

      if (!gamProfile) return;

      let pointsEarned = 0;
      const badgesEarned = gamProfile.badges_earned || [];
      
      // Award points for new achievements
      achievements.forEach(a => {
        if (!badgesEarned.includes(a.id)) {
          if (a.type === 'streak') pointsEarned += 50;
          else if (a.type === 'milestone') pointsEarned += 25;
          else if (a.type === 'badge') pointsEarned += 100;
          badgesEarned.push(a.id);
        }
      });

      // Daily login points
      const lastLogin = gamProfile.last_login_date;
      const today = format(new Date(), 'yyyy-MM-dd');
      if (lastLogin !== today) {
        pointsEarned += 10;
      }

      if (pointsEarned > 0) {
        const newTotal = totalPoints + pointsEarned;
        const newLevel = Math.floor(newTotal / 100) + 1;
        
        await updateGamificationMutation.mutateAsync({
          id: gamProfile.id,
          data: {
            total_points: newTotal,
            level: newLevel,
            points_to_next_level: 100,
            badges_earned: badgesEarned,
            last_login_date: today
          }
        });
      }
    };

    awardPoints();
  }, [achievements.length, gamProfile?.id]);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Progress</h1>
        <p className="text-[#666666] mt-1">Track your growth and celebrate your wins</p>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-[#666666]">Level</p>
              <p className="text-3xl font-bold text-[#1ABC9C]">{level}</p>
            </div>
            <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#1ABC9C]" />
            </div>
          </div>
          <div className="w-full bg-[#E5D9CC] rounded-full h-2">
            <div 
              className="bg-[#1ABC9C] h-2 rounded-full transition-all"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-xs text-[#666666] mt-1">
            {Math.floor(totalPoints % pointsToNext)} / {pointsToNext} XP to next level
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-[#666666]">Total Points</p>
              <p className="text-3xl font-bold text-[#F39C12]">{totalPoints}</p>
            </div>
            <div className="w-12 h-12 bg-[#F39C12]/10 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-[#F39C12]" />
            </div>
          </div>
          <p className="text-xs text-[#666666]">XP earned from achievements</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-[#666666]">Badges Earned</p>
              <p className="text-3xl font-bold text-[#9B59B6]">{achievements.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#9B59B6]/10 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#9B59B6]" />
            </div>
          </div>
          <p className="text-xs text-[#666666]">{lockedAchievements.length} more to unlock</p>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <ProgressRing progress={overallRate} size={100} strokeWidth={8}>
            <div>
              <p className="text-xl font-bold text-[#1A1A1A]">{overallRate}%</p>
            </div>
          </ProgressRing>
          <p className="text-sm text-[#666666] mt-3">30-Day Rate</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#E67E22]/10 rounded-[12px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#E67E22]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{currentStreak}</p>
          <p className="text-sm text-[#666666]">Current Streak</p>
          {longestStreak > currentStreak && (
            <p className="text-xs text-[#999999] mt-1">Best: {longestStreak} days</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#3498DB]/10 rounded-[12px] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#3498DB]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{completedLogs.length}</p>
          <p className="text-sm text-[#666666]">Habits Completed</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#9B59B6]/10 rounded-[12px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#9B59B6]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{achievements.length}</p>
          <p className="text-sm text-[#666666]">Achievements</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HabitChart logs={habitLogs} habits={activeHabits} />
        <MoodChart entries={journalEntries} />
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-[#1ABC9C]" />
          Achievements
        </h2>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 mb-6">
            <div className="w-16 h-16 bg-[#F0E5D8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#666666]" />
            </div>
            <p className="text-[#666666]">Complete activities to unlock achievements!</p>
          </Card>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-[#666666] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Locked ({lockedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-[16px] bg-[#F0E5D8]/50 border-2 border-dashed border-[#E5D9CC]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl opacity-50">{achievement.icon}</span>
                    <h4 className="font-medium text-[#999999]">{achievement.name}</h4>
                  </div>
                  <p className="text-sm text-[#999999]">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
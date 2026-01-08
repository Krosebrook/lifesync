import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import DailyIntentionCard from '../components/dashboard/DailyIntentionCard';
import HabitQuickView from '../components/dashboard/HabitQuickView';
import QuickStats from '../components/dashboard/QuickStats';
import RecentJournal from '../components/dashboard/RecentJournal';
import ResourcesSection from '../components/dashboard/ResourcesSection';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Queries
  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.filter({ is_active: true }),
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habitLogs', today],
    queryFn: () => base44.entities.HabitLog.filter({ date: today }),
  });

  const { data: allLogs = [] } = useQuery({
    queryKey: ['allHabitLogs'],
    queryFn: () => base44.entities.HabitLog.list('-date', 100),
  });

  const { data: intentions = [] } = useQuery({
    queryKey: ['intentions', today],
    queryFn: () => base44.entities.DailyIntention.filter({ date: today }),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 10),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => base44.entities.UserProfile.list(),
  });

  // Mutations
  const createIntentionMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyIntention.create({ ...data, date: today }),
    onSuccess: () => queryClient.invalidateQueries(['intentions']),
  });

  const updateIntentionMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyIntention.update(intentions[0]?.id, data),
    onSuccess: () => queryClient.invalidateQueries(['intentions']),
  });

  const createHabitLogMutation = useMutation({
    mutationFn: (data) => base44.entities.HabitLog.create(data),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const updateHabitLogMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HabitLog.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const deleteHabitLogMutation = useMutation({
    mutationFn: (id) => base44.entities.HabitLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const handleToggleHabit = async (habitId, completed) => {
    const existingLog = todayLogs.find(log => log.habit_id === habitId);
    
    if (existingLog) {
      if (completed) {
        await updateHabitLogMutation.mutateAsync({ id: existingLog.id, data: { completed: true } });
      } else {
        await deleteHabitLogMutation.mutateAsync(existingLog.id);
      }
    } else if (completed) {
      await createHabitLogMutation.mutateAsync({ habit_id: habitId, date: today, completed: true });
    }
  };

  // Calculate stats
  const calculateStats = () => {
    const profile = profiles[0] || {};
    
    // Habit completion rate for last 7 days
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(format(date, 'yyyy-MM-dd'));
    }
    
    const logsLast7Days = allLogs.filter(log => last7Days.includes(log.date) && log.completed);
    const habitRate = habits.length > 0 
      ? (logsLast7Days.length / (habits.length * 7)) * 100 
      : 0;

    return {
      streakDays: profile.streak_days || 0,
      habitRate: Math.min(habitRate, 100),
      totalReflections: journalEntries.length,
      achievements: achievements.length
    };
  };

  const todayIntention = intentions[0];

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-[#1ABC9C]" />
          <span className="text-sm font-medium text-[#1ABC9C]">
            {format(new Date(), 'EEEE, MMMM d')}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
        </h1>
        <p className="text-[#666666] mt-1">Let's make today count.</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="mb-8">
        <QuickStats stats={calculateStats()} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Intention */}
        <DailyIntentionCard 
          intention={todayIntention}
          onSave={(data) => createIntentionMutation.mutate(data)}
          onUpdate={(data) => updateIntentionMutation.mutate(data)}
        />

        {/* Habits Quick View */}
        <HabitQuickView 
          habits={habits}
          todayLogs={todayLogs}
          onToggleHabit={handleToggleHabit}
        />
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentJournal entries={journalEntries} />
        <ResourcesSection />
      </div>
    </div>
  );
}
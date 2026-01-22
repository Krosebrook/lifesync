import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Sunrise, Sunset, Award, ArrowRight, Target, BookOpen, TrendingUp, Flame, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import HabitQuickView from '../components/dashboard/HabitQuickView';
import QuickStats from '../components/dashboard/QuickStats';

const timeOfDayGreetings = {
  morning: {
    icon: Sunrise,
    title: "Morning Clarity",
    subtitle: "A new day begins with intention",
    bgImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
    theme: "from-amber-900/40 to-orange-800/60"
  },
  afternoon: {
    icon: Sun,
    title: "Midday Flow",
    subtitle: "Momentum carries you forward",
    bgImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    theme: "from-blue-900/40 to-cyan-800/60"
  },
  evening: {
    icon: Moon,
    title: "Evening Reflection",
    subtitle: "The day is done. Look back and grow.",
    bgImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    theme: "from-indigo-900/40 to-purple-800/60"
  }
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentHour = new Date().getHours();
  const [heroImageUrl, setHeroImageUrl] = useState('https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=2400&q=85&fit=crop');

  // Determine time of day
  const getTimeOfDay = () => {
    if (currentHour >= 5 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 22) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  const timeOfDayConfig = {
    morning: {
      title: 'Morning Momentum',
      subtitle: 'Enter your flow state before the world wakes up.',
      icon: Sun,
      gradient: 'from-orange-400/20 via-yellow-400/20 to-pink-400/20',
      action: 'Start Your Day',
      image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80'
    },
    afternoon: {
      title: 'Midday Check-In',
      subtitle: 'Pause, breathe, and realign with your intentions.',
      icon: Sun,
      gradient: 'from-blue-400/20 via-cyan-400/20 to-teal-400/20',
      action: 'Review Progress',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'
    },
    evening: {
      title: 'Evening Reflection',
      subtitle: 'The day winds down. What did you learn?',
      icon: Sunset,
      gradient: 'from-purple-400/20 via-pink-400/20 to-orange-400/20',
      action: 'Reflect on Today',
      image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&q=80'
    },
    night: {
      title: 'Silent Night',
      subtitle: 'The day is done. Take a breath and look back at your growth.',
      icon: Moon,
      gradient: 'from-indigo-900/40 via-blue-900/40 to-purple-900/40',
      action: 'Evening Journal',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80'
    }
  };

  const config = timeOfDayConfig[timeOfDay];

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

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 10),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: gamificationProfiles = [] } = useQuery({
    queryKey: ['gamificationProfile'],
    queryFn: () => base44.entities.GamificationProfile.list(),
  });

  const createHabitLogMutation = useMutation({
    mutationFn: (data) => base44.entities.HabitLog.create(data),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const deleteHabitLogMutation = useMutation({
    mutationFn: (id) => base44.entities.HabitLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const handleToggleHabit = async (habitId) => {
    const existingLog = todayLogs.find(log => log.habit_id === habitId);
    if (existingLog) {
      await deleteHabitLogMutation.mutateAsync(existingLog.id);
    } else {
      await createHabitLogMutation.mutateAsync({ habit_id: habitId, date: today, completed: true });
    }
  };

  const gamProfile = gamificationProfiles[0];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Chaos Club Hero */}
      <div className="relative w-full h-screen overflow-hidden grain">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-85"
            style={{
              filter: 'grayscale(0.2) contrast(1.1)',
              objectPosition: '65% center'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          
          {/* Film Grain */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Content - Left Third */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 md:px-12 w-full">
            <div className="max-w-2xl">
              {/* Accent Bar */}
              <div className="w-16 h-1 bg-[#FF6B35] mb-10" />
              
              {/* Headline */}
              <h1 
                className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.05]"
                style={{ 
                  fontFamily: 'Newsreader, Georgia, serif',
                  letterSpacing: '-0.02em'
                }}
              >
                No masks required.<br />
                No perfection expected.
              </h1>
              
              {/* Subtext */}
              <p className="text-xl md:text-2xl text-[#E8DCC8] mb-4 leading-relaxed font-light">
                Chaos is normal. Pretending isn't.
              </p>

              <p className="text-base text-[#9A9A9A] mb-12 max-w-lg">
                Track what matters. Notice patterns. Talk it through. No wellness theater required.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-12">
                <div>
                  <p className="text-4xl font-bold text-white mb-1">{todayLogs.length}</p>
                  <p className="text-xs text-[#9A9A9A] uppercase tracking-widest">Today</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#FF6B35] mb-1">{habits.length}</p>
                  <p className="text-xs text-[#9A9A9A] uppercase tracking-widest">Patterns</p>
                </div>
              </div>

              {/* CTA */}
              <Link to={createPageUrl(timeOfDay === 'night' ? 'Journal' : 'Habits')}>
                <button className="px-8 py-4 bg-[#FF6B35] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#E85A2A] transition-colors">
                  {timeOfDay === 'night' ? 'Write about it' : 'Start today'}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-8 md:left-12 text-[#9A9A9A] text-xs uppercase tracking-widest flex items-center gap-3">
          <div className="w-px h-12 bg-[#9A9A9A] opacity-40" />
          <span>Scroll</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-[#1A1A1A] px-6 py-16 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Today's Patterns */}
          <div>
            <div className="mb-8">
              <div className="w-12 h-px bg-[#FF6B35] mb-4" />
              <h2 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: 'Newsreader, serif' }}>
                Today's patterns
              </h2>
              <p className="text-[#9A9A9A]">The small things that keep you steady.</p>
            </div>

            <div className="space-y-3">
              {habits.slice(0, 5).map((habit, index) => {
                const isCompleted = todayLogs.some(log => log.habit_id === habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`bg-[#2A2A2A] border p-6 cursor-pointer transition-all hover:border-[#FF6B35]/40 ${
                      isCompleted ? 'border-[#FF6B35]/60' : 'border-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 flex items-center justify-center border transition-all ${
                        isCompleted 
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10' 
                          : 'border-[rgba(255,255,255,0.15)]'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-[#FF6B35]" />
                        ) : (
                          <span className="text-2xl">{habit.icon || '◻'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-base font-medium mb-1">{habit.name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`uppercase tracking-wider text-xs ${
                            isCompleted ? 'text-[#FF6B35]' : 'text-[#9A9A9A]'
                          }`}>
                            {isCompleted ? 'Done' : 'Pending'}
                          </span>
                          {habit.current_streak > 0 && (
                            <span className="text-[#9A9A9A]">
                              {habit.current_streak} day{habit.current_streak > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {habits.length > 5 && (
              <Link to={createPageUrl('Habits')}>
                <button className="w-full mt-4 py-3 bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] text-[#F5F5F5] font-medium text-sm hover:border-[#FF6B35]/30 transition-all uppercase tracking-wider">
                  All patterns →
                </button>
              </Link>
            )}
          </div>

          {/* Quick Access */}
          <div>
            <div className="mb-6">
              <div className="w-12 h-px bg-[#FF6B35] mb-4" />
              <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Newsreader, serif' }}>
                Quick access
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl('Journal')}>
                <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#FF6B35]/30 transition-all cursor-pointer">
                  <BookOpen className="w-8 h-8 text-[#9A9A9A] mb-4" />
                  <p className="text-white font-medium mb-1">Notes</p>
                  <p className="text-[#9A9A9A] text-sm">{journalEntries.length} entries</p>
                </div>
              </Link>

              <Link to={createPageUrl('Goals')}>
                <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#FF6B35]/30 transition-all cursor-pointer">
                  <Target className="w-8 h-8 text-[#9A9A9A] mb-4" />
                  <p className="text-white font-medium mb-1">Goals</p>
                  <p className="text-[#9A9A9A] text-sm">What matters</p>
                </div>
              </Link>

              <Link to={createPageUrl('Coach')}>
                <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#FF6B35]/30 transition-all cursor-pointer">
                  <Sparkles className="w-8 h-8 text-[#9A9A9A] mb-4" />
                  <p className="text-white font-medium mb-1">Talk</p>
                  <p className="text-[#9A9A9A] text-sm">Work it out</p>
                </div>
              </Link>

              <Link to={createPageUrl('Progress')}>
                <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#FF6B35]/30 transition-all cursor-pointer">
                  <TrendingUp className="w-8 h-8 text-[#9A9A9A] mb-4" />
                  <p className="text-white font-medium mb-1">You</p>
                  <p className="text-[#9A9A9A] text-sm">Your data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
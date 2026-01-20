import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Flame, Trophy } from 'lucide-react';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import WeeklyCalendar from '../components/habits/WeeklyCalendar';
import ChallengeCard from '../components/habits/ChallengeCard';
import ChallengeForm from '../components/habits/ChallengeForm';
import StreakCelebration from '../components/celebration/StreakCelebration';
import HabitSuggestions from '../components/habits/HabitSuggestions';

export default function Habits() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeHabit, setChallengeHabit] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Queries
  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list(),
  });

  const { data: values = [] } = useQuery({
    queryKey: ['values'],
    queryFn: () => base44.entities.Value.list(),
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habitLogs', today],
    queryFn: () => base44.entities.HabitLog.filter({ date: today }),
  });

  // Get last 7 days of logs for weekly view
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
  
  const { data: weekLogs = [] } = useQuery({
    queryKey: ['weekLogs'],
    queryFn: async () => {
      const allLogs = await base44.entities.HabitLog.list('-date', 100);
      return allLogs.filter(log => last7Days.includes(log.date));
    },
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.list(),
  });

  // Mutations
  const createHabitMutation = useMutation({
    mutationFn: (data) => base44.entities.Habit.create({ ...data, is_active: true, current_streak: 0, longest_streak: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      setShowForm(false);
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Habit.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      setEditingHabit(null);
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id) => base44.entities.Habit.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['habits']),
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => base44.entities.HabitLog.create(data),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const deleteLogMutation = useMutation({
    mutationFn: (id) => base44.entities.HabitLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const createChallengeMutation = useMutation({
    mutationFn: (data) => base44.entities.Challenge.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['challenges']);
      setShowChallengeForm(false);
      setChallengeHabit(null);
    },
  });

  const updateChallengeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Challenge.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['challenges']),
  });

  const handleToggleHabit = async (habitId) => {
    const existingLog = todayLogs.find(log => log.habit_id === habitId);
    const habit = habits.find(h => h.id === habitId);
    
    if (existingLog) {
      await deleteLogMutation.mutateAsync(existingLog.id);
      // Decrease streak
      if (habit && habit.current_streak > 0) {
        await updateHabitMutation.mutateAsync({ 
          id: habitId, 
          data: { current_streak: habit.current_streak - 1 }
        });
      }
    } else {
      await createLogMutation.mutateAsync({ habit_id: habitId, date: today, completed: true });
      // Increase streak
      if (habit) {
        const newStreak = (habit.current_streak || 0) + 1;
        await updateHabitMutation.mutateAsync({ 
          id: habitId, 
          data: { 
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, habit.longest_streak || 0)
          }
        });

        // Check for milestone celebrations
        if ([7, 14, 30, 60, 100].includes(newStreak)) {
          setCelebration({ streak: newStreak, habitName: habit.name });
        }

        // Update active challenges
        const activeChallenge = challenges.find(c => 
          c.habit_id === habitId && c.status === 'active'
        );
        if (activeChallenge) {
          const newProgress = activeChallenge.current_progress + 1;
          const isCompleted = newProgress >= activeChallenge.goal_days;
          
          await updateChallengeMutation.mutateAsync({
            id: activeChallenge.id,
            data: {
              current_progress: newProgress,
              status: isCompleted ? 'completed' : 'active',
              completion_date: isCompleted ? today : null
            }
          });
        }
      }
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.functions.invoke('generateHabitSuggestions', {});
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } else {
        alert(response.data.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      alert('Failed to generate suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = (suggestion) => {
    setShowSuggestions(false);
    const habitData = {
      name: suggestion.name,
      description: suggestion.description,
      category: suggestion.category,
      done_criteria: suggestion.done_criteria,
      frequency: suggestion.frequency,
      times_per_week: suggestion.times_per_week,
      icon: suggestion.icon,
      color: '#1ABC9C'
    };
    createHabitMutation.mutate(habitData);
  };
  
  const activeHabits = habits.filter(h => h.is_active);
  const filteredHabits = selectedCategory === 'all' 
    ? activeHabits 
    : activeHabits.filter(h => h.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All', icon: '📋' },
    { value: 'health', label: 'Health', icon: '💪' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'relationships', label: 'Relationships', icon: '❤️' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];
  const completedToday = activeHabits.filter(h => 
    todayLogs.some(log => log.habit_id === h.id && log.completed)
  ).length;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Habits</h1>
          <p className="text-[#666666] mt-1">Build routines that align with your values</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            Add Habit
          </Button>
          <Button 
            onClick={loadAISuggestions}
            variant="outline"
            icon={Sparkles}
            loading={loadingSuggestions}
          >
            Get AI Suggestions
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#1ABC9C]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{completedToday}/{activeHabits.length}</p>
              <p className="text-sm text-[#666666]">Today</p>
            </div>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E67E22]/10 rounded-[12px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#E67E22]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">
                {Math.max(...activeHabits.map(h => h.current_streak || 0), 0)}
              </p>
              <p className="text-sm text-[#666666]">Best Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <div className="mb-8">
        <WeeklyCalendar logs={weekLogs} habits={activeHabits} />
      </div>

      {/* Category Filter */}
      {activeHabits.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-[#666666] mb-3">Filter by category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-2 rounded-[8px] text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.value
                    ? 'bg-[#1ABC9C] text-white'
                    : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Active Challenges */}
      {challenges.filter(c => c.status === 'active').length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#1ABC9C]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Active Challenges</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges
              .filter(c => c.status === 'active')
              .map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  habit={habits.find(h => h.id === challenge.habit_id)}
                  onView={() => {}}
                />
              ))}
          </div>
        </div>
      )}

      {/* Habits Grid */}
      {filteredHabits.length === 0 && activeHabits.length > 0 ? (
        <Card className="text-center py-12">
          <p className="text-[#666666]">No habits in this category</p>
        </Card>
      ) : activeHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={todayLogs.some(log => log.habit_id === habit.id && log.completed)}
                onToggle={() => handleToggleHabit(habit.id)}
                onEdit={() => setEditingHabit(habit)}
                onDelete={() => deleteHabitMutation.mutate(habit.id)}
                onSetChallenge={() => {
                  setChallengeHabit(habit);
                  setShowChallengeForm(true);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-[#1ABC9C]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No habits yet</h3>
          <p className="text-[#666666] mb-6">Start building your daily routines</p>
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            Create your first habit
          </Button>
        </Card>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {(showForm || editingHabit) && (
          <HabitForm
            habit={editingHabit}
            goals={goals}
            onSave={(data) => {
              if (editingHabit) {
                updateHabitMutation.mutate({ id: editingHabit.id, data });
              } else {
                createHabitMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Challenge Form Modal */}
      <AnimatePresence>
        {showChallengeForm && challengeHabit && (
          <ChallengeForm
            habit={challengeHabit}
            onSave={(data) => createChallengeMutation.mutate(data)}
            onCancel={() => {
              setShowChallengeForm(false);
              setChallengeHabit(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Habit Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <HabitSuggestions
            suggestions={suggestions}
            values={values}
            onAccept={handleAcceptSuggestion}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </AnimatePresence>

      {/* Streak Celebration */}
      <AnimatePresence>
        {celebration && (
          <StreakCelebration
            streak={celebration.streak}
            habitName={celebration.habitName}
            onClose={() => setCelebration(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
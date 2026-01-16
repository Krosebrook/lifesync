import { Flame, Target, Award } from 'lucide-react';

/**
 * All possible achievements users can unlock
 * Organized by type: streak, milestone, badge
 */
export const ALL_ACHIEVEMENTS = [
  // Streak Achievements - Focus on consistency
  { type: 'streak', name: '7 Day Streak', description: 'Complete habits for 7 days straight', threshold: 7, icon: '🔥', color: '#E67E22' },
  { type: 'streak', name: '14 Day Streak', description: 'Complete habits for 14 days straight', threshold: 14, icon: '💪', color: '#E67E22' },
  { type: 'streak', name: '30 Day Streak', description: 'Complete habits for 30 days straight', threshold: 30, icon: '⚡', color: '#F39C12' },
  { type: 'streak', name: '60 Day Streak', description: 'Complete habits for 60 days straight', threshold: 60, icon: '✨', color: '#9B59B6' },
  { type: 'streak', name: '100 Day Streak', description: 'Complete habits for 100 days straight', threshold: 100, icon: '💎', color: '#E74C3C' },
  
  // Habit Milestones - Focus on building variety
  { type: 'milestone', name: 'First Habit', description: 'Create your first habit', threshold: 1, icon: '🎯', color: '#1ABC9C' },
  { type: 'milestone', name: 'Habit Builder', description: 'Create 5 different habits', threshold: 5, icon: '🏗️', color: '#3498DB' },
  { type: 'milestone', name: 'Habit Master', description: 'Create 10 different habits', threshold: 10, icon: '👑', color: '#9B59B6' },
  
  // Journal Achievements - Focus on reflection
  { type: 'milestone', name: 'Journal Starter', description: 'Write your first journal entry', threshold: 1, icon: '📝', color: '#3498DB' },
  { type: 'milestone', name: '10 Reflections', description: 'Complete 10 journal entries', threshold: 10, icon: '📚', color: '#3498DB' },
  { type: 'milestone', name: '30 Reflections', description: 'Complete 30 journal entries', threshold: 30, icon: '📖', color: '#9B59B6' },
  { type: 'milestone', name: '100 Reflections', description: 'Complete 100 journal entries', threshold: 100, icon: '🎓', color: '#E74C3C' },
  
  // Gratitude Achievements - Focus on positivity
  { type: 'badge', name: 'Grateful Heart', description: 'Log gratitude 10 times', threshold: 10, icon: '🙏', color: '#27AE60' },
  { type: 'badge', name: 'Gratitude Master', description: 'Log gratitude 20 times', threshold: 20, icon: '💚', color: '#27AE60' },
  
  // Daily Practice - Focus on intentionality
  { type: 'badge', name: 'Intentional Living', description: 'Complete 30 days of daily intentions', threshold: 30, icon: '✨', color: '#F39C12' },
  { type: 'badge', name: 'Morning Ritual', description: 'Set daily intentions for 7 consecutive days', threshold: 7, icon: '🌅', color: '#E67E22' },
  
  // Weekly Reviews - Focus on self-improvement
  { type: 'badge', name: 'Weekly Warrior', description: 'Complete your first weekly review', threshold: 1, icon: '📊', color: '#3498DB' },
  { type: 'badge', name: 'Reflection Pro', description: 'Complete 10 weekly reviews', threshold: 10, icon: '🎯', color: '#9B59B6' },

  // Challenge Achievements - Focus on goal setting
  { type: 'badge', name: 'Challenge Accepted', description: 'Complete your first habit challenge', threshold: 1, icon: '🏆', color: '#F39C12' },
  { type: 'badge', name: 'Challenge Champion', description: 'Complete 5 habit challenges', threshold: 5, icon: '👑', color: '#E74C3C' }
];

/**
 * Maps achievement types to their corresponding icon components
 */
export const CATEGORY_ICONS = {
  streak: Flame,
  milestone: Target,
  badge: Award
};
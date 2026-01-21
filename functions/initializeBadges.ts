import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const badges = [
      // Streak Badges
      { name: 'Week Warrior', description: 'Complete habits for 7 days straight', category: 'streak', icon: '🔥', color: 'orange', criteria: { type: 'streak', days: 7 }, points_reward: 50, rarity: 'common' },
      { name: 'Month Master', description: 'Maintain a 30-day streak', category: 'streak', icon: '⚡', color: 'yellow', criteria: { type: 'streak', days: 30 }, points_reward: 150, rarity: 'rare' },
      { name: 'Century Club', description: '100-day streak achievement', category: 'streak', icon: '💯', color: 'gold', criteria: { type: 'streak', days: 100 }, points_reward: 500, rarity: 'epic' },
      { name: 'Legendary Streak', description: '365 consecutive days', category: 'streak', icon: '👑', color: 'purple', criteria: { type: 'streak', days: 365 }, points_reward: 1000, rarity: 'legendary' },
      
      // Goal Badges
      { name: 'Goal Getter', description: 'Complete your first goal', category: 'goal', icon: '🎯', color: 'blue', criteria: { type: 'goals_completed', count: 1 }, points_reward: 25, rarity: 'common' },
      { name: 'Achievement Hunter', description: 'Complete 5 goals', category: 'goal', icon: '🏆', color: 'gold', criteria: { type: 'goals_completed', count: 5 }, points_reward: 100, rarity: 'rare' },
      { name: 'Dream Chaser', description: 'Complete 10 goals', category: 'goal', icon: '⭐', color: 'gold', criteria: { type: 'goals_completed', count: 10 }, points_reward: 250, rarity: 'epic' },
      
      // Milestone Badges
      { name: 'Journal Novice', description: 'Write 10 journal entries', category: 'milestone', icon: '📝', color: 'green', criteria: { type: 'journal_entries', count: 10 }, points_reward: 50, rarity: 'common' },
      { name: 'Reflective Soul', description: 'Write 50 journal entries', category: 'milestone', icon: '📖', color: 'green', criteria: { type: 'journal_entries', count: 50 }, points_reward: 150, rarity: 'rare' },
      { name: 'Zen Master', description: 'Complete 25 mindfulness sessions', category: 'milestone', icon: '🧘', color: 'purple', criteria: { type: 'mindfulness_sessions', count: 25 }, points_reward: 100, rarity: 'rare' },
      { name: 'Meditation Guru', description: 'Complete 100 mindfulness sessions', category: 'milestone', icon: '🕉️', color: 'purple', criteria: { type: 'mindfulness_sessions', count: 100 }, points_reward: 400, rarity: 'epic' },
      
      // Premium Badges
      { name: 'Premium Pioneer', description: 'Complete 10 premium meditations', category: 'premium', icon: '💎', color: 'cyan', criteria: { type: 'premium_meditations', count: 10 }, points_reward: 200, rarity: 'epic', is_premium: true },
      { name: 'Elite Achiever', description: 'Unlock all progress tree nodes', category: 'premium', icon: '🌟', color: 'gold', criteria: { type: 'progress_tree_complete' }, points_reward: 500, rarity: 'legendary', is_premium: true },
      
      // Community Badges
      { name: 'Supportive Friend', description: 'Send 10 encouragements', category: 'community', icon: '💙', color: 'blue', criteria: { type: 'encouragements_sent', count: 10 }, points_reward: 75, rarity: 'common' },
      { name: 'Community Champion', description: 'Complete a community challenge', category: 'community', icon: '🤝', color: 'green', criteria: { type: 'community_challenge_complete' }, points_reward: 150, rarity: 'rare' }
    ];

    const existing = await base44.asServiceRole.entities.Badge.list();
    
    if (existing.length === 0) {
      await base44.asServiceRole.entities.Badge.bulkCreate(badges);
      return Response.json({ success: true, message: 'Badges initialized', count: badges.length });
    } else {
      return Response.json({ success: true, message: 'Badges already exist', count: existing.length });
    }
  } catch (error) {
    console.error('Error initializing badges:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
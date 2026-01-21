import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, metadata } = await req.json();

    // Points mapping
    const pointsMap = {
      'habit_complete': 10,
      'mindfulness_complete': 15,
      'goal_create': 25,
      'goal_complete': 100,
      'journal_entry': 5,
      'daily_login': 10,
      'streak_milestone': 50,
      'challenge_complete': 75,
      'perfect_week': 200
    };

    const pointsEarned = pointsMap[action] || 0;
    
    if (pointsEarned === 0) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get or create gamification profile
    const profiles = await base44.entities.GamificationProfile.filter({ created_by: user.email });
    let profile = profiles[0];

    if (!profile) {
      profile = await base44.entities.GamificationProfile.create({
        total_points: 0,
        level: 1,
        points_to_next_level: 100,
        badges_earned: [],
        last_login_date: new Date().toISOString().split('T')[0]
      });
    }

    // Calculate new totals
    const newPoints = profile.total_points + pointsEarned;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const pointsForNextLevel = 100;

    // Check for new badges
    const badges = profile.badges_earned || [];
    let newBadges = [];

    // Award streak badges
    if (action === 'streak_milestone' && metadata?.streak) {
      if (metadata.streak === 7 && !badges.includes('streak_7')) {
        newBadges.push('streak_7');
        await base44.entities.Achievement.create({
          type: 'streak',
          name: '7 Day Streak',
          description: 'Completed habits for 7 days straight',
          icon: '🔥',
          unlocked_date: new Date().toISOString().split('T')[0]
        });
      }
      if (metadata.streak === 30 && !badges.includes('streak_30')) {
        newBadges.push('streak_30');
        await base44.entities.Achievement.create({
          type: 'streak',
          name: '30 Day Warrior',
          description: 'Completed habits for 30 days straight',
          icon: '💪',
          unlocked_date: new Date().toISOString().split('T')[0]
        });
      }
      if (metadata.streak === 100 && !badges.includes('streak_100')) {
        newBadges.push('streak_100');
        await base44.entities.Achievement.create({
          type: 'streak',
          name: 'Century Club',
          description: 'Completed habits for 100 days straight',
          icon: '👑',
          unlocked_date: new Date().toISOString().split('T')[0]
        });
      }
    }

    // Perfect week badge
    if (action === 'perfect_week' && !badges.includes('perfect_week')) {
      newBadges.push('perfect_week');
      await base44.entities.Achievement.create({
        type: 'badge',
        name: 'Perfect Week',
        description: 'Completed all habits for a full week',
        icon: '⭐',
        unlocked_date: new Date().toISOString().split('T')[0]
      });
    }

    // Update profile
    await base44.entities.GamificationProfile.update(profile.id, {
      total_points: newPoints,
      level: newLevel,
      points_to_next_level: pointsForNextLevel,
      badges_earned: [...badges, ...newBadges]
    });

    return Response.json({
      success: true,
      pointsEarned,
      newTotal: newPoints,
      level: newLevel,
      leveledUp: newLevel > profile.level,
      newBadges
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
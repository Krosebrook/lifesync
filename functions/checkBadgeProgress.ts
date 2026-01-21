import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data and badges
    const [
      allBadges,
      userBadges,
      habits,
      goals,
      journalEntries,
      mindfulnessPractices,
      encouragements
    ] = await Promise.all([
      base44.entities.Badge.list(),
      base44.entities.UserBadge.filter({ created_by: user.email }),
      base44.entities.Habit.filter({ created_by: user.email }),
      base44.entities.Goal.filter({ created_by: user.email }),
      base44.entities.JournalEntry.filter({ created_by: user.email }),
      base44.entities.MindfulnessPractice.filter({ created_by: user.email }),
      base44.entities.Encouragement.filter({ from_email: user.email })
    ]);

    const earnedBadgeIds = userBadges.filter(ub => ub.progress >= 100).map(ub => ub.badge_id);
    const newlyEarned = [];

    // Calculate stats
    const maxStreak = Math.max(...habits.map(h => h.longest_streak || 0), 0);
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const journalCount = journalEntries.length;
    const mindfulnessCount = mindfulnessPractices.length;
    const encouragementCount = encouragements.length;

    // Check each badge
    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let progress = 0;
      let earned = false;

      const criteria = badge.criteria || {};

      switch (criteria.type) {
        case 'streak':
          progress = Math.min((maxStreak / criteria.days) * 100, 100);
          earned = maxStreak >= criteria.days;
          break;
        case 'goals_completed':
          progress = Math.min((completedGoals / criteria.count) * 100, 100);
          earned = completedGoals >= criteria.count;
          break;
        case 'journal_entries':
          progress = Math.min((journalCount / criteria.count) * 100, 100);
          earned = journalCount >= criteria.count;
          break;
        case 'mindfulness_sessions':
          progress = Math.min((mindfulnessCount / criteria.count) * 100, 100);
          earned = mindfulnessCount >= criteria.count;
          break;
        case 'encouragements_sent':
          progress = Math.min((encouragementCount / criteria.count) * 100, 100);
          earned = encouragementCount >= criteria.count;
          break;
      }

      // Update or create UserBadge
      const existingUserBadge = userBadges.find(ub => ub.badge_id === badge.id);

      if (earned && !existingUserBadge) {
        await base44.entities.UserBadge.create({
          badge_id: badge.id,
          earned_date: new Date().toISOString().split('T')[0],
          progress: 100
        });
        newlyEarned.push(badge);
      } else if (existingUserBadge && existingUserBadge.progress < progress) {
        await base44.entities.UserBadge.update(existingUserBadge.id, { progress });
      } else if (!existingUserBadge && progress > 0) {
        await base44.entities.UserBadge.create({
          badge_id: badge.id,
          progress
        });
      }
    }

    return Response.json({ 
      success: true, 
      newlyEarned,
      totalEarned: earnedBadgeIds.length + newlyEarned.length
    });
  } catch (error) {
    console.error('Error checking badges:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
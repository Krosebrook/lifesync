import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { period = 'month' } = await req.json();

    // Check subscription status
    const subscriptions = await base44.entities.Subscription.filter({ created_by: user.email });
    const subscription = subscriptions[0];
    const isPremium = subscription && ['premium', 'pro'].includes(subscription.tier) && subscription.status === 'active';

    if (!isPremium) {
      return Response.json({ 
        success: false, 
        error: 'Premium subscription required',
        isPremium: false 
      }, { status: 403 });
    }

    // Fetch comprehensive data over longer period
    const daysBack = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const [
      journalEntries,
      habits,
      habitLogs,
      goals,
      mindfulnessPractices,
      gamificationProfiles,
      achievements
    ] = await Promise.all([
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-date', 200),
      base44.entities.Habit.filter({ created_by: user.email }),
      base44.entities.HabitLog.filter({ created_by: user.email }, '-date', 500),
      base44.entities.Goal.filter({ created_by: user.email }),
      base44.entities.MindfulnessPractice.filter({ created_by: user.email }, '-date', 200),
      base44.entities.GamificationProfile.list(),
      base44.entities.Achievement.filter({ created_by: user.email })
    ]);

    // Advanced Analytics
    const moods = journalEntries.filter(e => e.mood).map(e => ({ date: e.date, mood: e.mood }));
    const moodByWeek = {};
    moods.forEach(m => {
      const week = Math.floor((new Date() - new Date(m.date)) / (7 * 24 * 60 * 60 * 1000));
      if (!moodByWeek[week]) moodByWeek[week] = [];
      moodByWeek[week].push(m.mood);
    });

    const moodTrends = Object.entries(moodByWeek).map(([week, moods]) => ({
      week: parseInt(week),
      avg: (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
    })).sort((a, b) => b.week - a.week);

    // Habit consistency analysis
    const habitStats = habits.map(habit => {
      const logs = habitLogs.filter(l => l.habit_id === habit.id);
      const completionRate = logs.length > 0 ? (logs.filter(l => l.completed).length / logs.length * 100).toFixed(1) : 0;
      return {
        name: habit.name,
        completionRate: parseFloat(completionRate),
        currentStreak: habit.current_streak,
        longestStreak: habit.longest_streak
      };
    });

    // Goal achievement velocity
    const completedGoals = goals.filter(g => g.status === 'completed');
    const goalVelocity = completedGoals.length / (daysBack / 30);

    // Mindfulness impact
    const mindfulnessImpact = mindfulnessPractices.length > 0
      ? (mindfulnessPractices.reduce((sum, p) => sum + ((p.mood_after || 0) - (p.mood_before || 0)), 0) / mindfulnessPractices.length).toFixed(2)
      : 0;

    const gamProfile = gamificationProfiles[0];

    const prompt = `You are an elite performance coach providing a PREMIUM in-depth analysis. Generate a comprehensive ${period} coaching report with deep insights.

USER METRICS (${daysBack} days):
- Journal entries: ${journalEntries.length}
- Active habits: ${habits.filter(h => h.is_active).length}
- Goals completed: ${completedGoals.length}/${goals.length}
- Mindfulness sessions: ${mindfulnessPractices.length}
- Achievements unlocked: ${achievements.length}
- Current level: ${gamProfile?.level || 1}

MOOD TRENDS (Weekly averages, 0=oldest):
${moodTrends.slice(0, 8).map(t => `Week -${t.week}: ${t.avg}/5`).join('\n')}

HABIT PERFORMANCE:
${habitStats.map(h => `${h.name}: ${h.completionRate}% completion, ${h.currentStreak} day streak`).join('\n')}

MINDFULNESS IMPACT:
Average mood improvement per session: +${mindfulnessImpact}

GOAL VELOCITY:
${goalVelocity.toFixed(1)} goals completed per month

Provide a PREMIUM-LEVEL report including:
1. **Executive Summary** (3-4 sentences): High-level overview of their ${period}
2. **Trend Analysis** (4-5 bullets): Deep patterns in mood, habits, and progress with specific data
3. **Performance Insights** (4-5 bullets): What's working exceptionally well and why
4. **Growth Gaps** (3-4 bullets): Specific areas holding them back with root cause analysis
5. **Strategic Recommendations** (5-6 bullets): Data-driven action items with expected impact
6. **Predictive Outlook** (2-3 sentences): Where they're headed based on current trajectory
7. **Personalized Challenge** (2-3 sentences): A specific stretch goal for next ${period}

Make it deeply personalized, insight-rich, and actionable. Use their actual data and patterns.`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          executive_summary: { type: "string" },
          trend_analysis: {
            type: "array",
            items: { type: "string" }
          },
          performance_insights: {
            type: "array",
            items: { type: "string" }
          },
          growth_gaps: {
            type: "array",
            items: { type: "string" }
          },
          strategic_recommendations: {
            type: "array",
            items: { type: "string" }
          },
          predictive_outlook: { type: "string" },
          personalized_challenge: { type: "string" }
        }
      }
    });

    return Response.json({
      success: true,
      isPremium: true,
      report: response,
      analytics: {
        period,
        daysAnalyzed: daysBack,
        moodTrends,
        habitStats,
        goalVelocity: goalVelocity.toFixed(1),
        mindfulnessImpact,
        totalDataPoints: journalEntries.length + habitLogs.length + mindfulnessPractices.length
      }
    });
  } catch (error) {
    console.error('Error generating premium report:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
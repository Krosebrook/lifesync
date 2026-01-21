import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all user data in parallel
    const [
      journalEntries,
      habits,
      goals,
      mindfulnessPractices,
      gamificationProfiles,
      userProfiles,
      dailyIntentions
    ] = await Promise.all([
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-date', 20),
      base44.entities.Habit.filter({ created_by: user.email, is_active: true }),
      base44.entities.Goal.filter({ created_by: user.email }),
      base44.entities.MindfulnessPractice.filter({ created_by: user.email }, '-date', 15),
      base44.entities.GamificationProfile.list(),
      base44.entities.UserProfile.list(),
      base44.entities.DailyIntention.filter({}, '-date', 7)
    ]);

    // Calculate analytics
    const moods = journalEntries.filter(e => e.mood).map(e => e.mood);
    const avgMood = moods.length > 0 ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1) : 3;
    const moodTrend = moods.length >= 3 ? (moods[0] - moods[moods.length - 1]) : 0;

    const activeHabits = habits.filter(h => h.is_active).length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalGoals = goals.length;

    const allTags = journalEntries.flatMap(e => e.tags || []);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topThemes = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => tag);

    const gamProfile = gamificationProfiles[0];
    const userProfile = userProfiles[0];

    const recentJournal = journalEntries.slice(0, 5)
      .map(e => `[${e.date}] ${e.content.substring(0, 100)}...`)
      .join('\n');

    const habitPerformance = habits
      .map(h => `${h.name}: ${h.current_streak} day streak (longest: ${h.longest_streak})`)
      .join('\n');

    const prompt = `You are a compassionate, highly personalized wellbeing coach. Based on comprehensive user data, provide tailored coaching guidance.

USER PROFILE:
- Name: ${user.full_name}
- Days using app: ${userProfile?.streak_days || 0}
- Level: ${gamProfile?.level || 1}
- Current mood: ${avgMood}/5 (${moodTrend > 0 ? 'improving ↑' : moodTrend < 0 ? 'declining ↓' : 'stable →'})

GOALS & PROGRESS:
- Completed: ${completedGoals}/${totalGoals} goals
- Active habits: ${activeHabits}
- Mindfulness sessions: ${mindfulnessPractices.length}

RECURRING THEMES:
${topThemes.join(', ') || 'Not enough data yet'}

HABIT PERFORMANCE:
${habitPerformance || 'No active habits'}

RECENT JOURNAL INSIGHTS:
${recentJournal || 'No journal entries yet'}

Provide coaching that includes:
1. **Current Status Assessment** (2-3 sentences): Honest, compassionate assessment of their current wellbeing state
2. **Key Strengths** (2-3 bullets): Specific wins and positive patterns you see
3. **Growth Opportunities** (2-3 bullets): Areas where they can make progress (be encouraging, not critical)
4. **Personalized Action Plan** (3-4 bullets): Specific, actionable steps tailored to their data and themes
5. **Motivation & Affirmation** (2-3 sentences): Personalized encouragement based on their journey
6. **Immediate Next Step**: One specific thing they can do today

Make it personal, specific to their data, encouraging, and actionable.`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          status_assessment: { type: "string" },
          strengths: {
            type: "array",
            items: { type: "string" }
          },
          growth_opportunities: {
            type: "array",
            items: { type: "string" }
          },
          action_plan: {
            type: "array",
            items: { type: "string" }
          },
          motivation: { type: "string" },
          immediate_action: { type: "string" }
        }
      }
    });

    return Response.json({
      success: true,
      coaching: response,
      analytics: {
        avgMood: parseFloat(avgMood),
        moodTrend,
        activeHabits,
        goalCompletion: `${completedGoals}/${totalGoals}`,
        topThemes,
        userLevel: gamProfile?.level || 1,
        streakDays: userProfile?.streak_days || 0
      }
    });
  } catch (error) {
    console.error('Error generating coaching:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
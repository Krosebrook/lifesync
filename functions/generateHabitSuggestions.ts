import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's values, goals, current habits, recent journal entries, and habit logs
    const [values, goals, habits, journalEntries, habitLogs] = await Promise.all([
      base44.entities.Value.filter({ created_by: user.email }),
      base44.entities.Goal.filter({ created_by: user.email, status: 'active' }),
      base44.entities.Habit.filter({ created_by: user.email, is_active: true }),
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 10),
      base44.entities.HabitLog.list('-date', 100)
    ]);

    if (values.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No core values found. Please set up your values first.' 
      });
    }

    // Build context for AI
    const valuesList = values.map(v => `- ${v.name}: ${v.description || 'No description'}`).join('\n');
    const goalsList = goals.map(g => `- ${g.title} (Progress: ${g.progress || 0}%)`).join('\n');
    const habitsList = habits.map(h => {
      const category = h.category ? ` [${h.category}]` : '';
      const criteria = h.done_criteria ? ` - ${h.done_criteria}` : '';
      return `- ${h.name}${category}${criteria}`;
    }).join('\n');
    
    // Analyze habit categories to find gaps
    const categoryCounts = habits.reduce((acc, h) => {
      const cat = h.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Analyze habit performance
    const habitPerformance = habits.map(habit => {
      const logs = habitLogs.filter(log => log.habit_id === habit.id);
      const recentLogs = logs.slice(0, 30); // Last 30 days
      const completionRate = recentLogs.length > 0 
        ? (recentLogs.filter(log => log.completed).length / recentLogs.length * 100).toFixed(0)
        : 0;
      return {
        name: habit.name,
        category: habit.category,
        completionRate: completionRate,
        totalLogs: logs.length,
        streak: habit.current_streak || 0
      };
    });

    // Extract journal insights
    const journalInsights = journalEntries.length > 0 
      ? journalEntries.map(j => {
          const mood = j.mood ? `Mood: ${j.mood}/5` : '';
          const content = j.content.substring(0, 150);
          return `${mood} - ${content}`;
        }).join('\n')
      : 'No recent journal entries';

    // Identify struggling habits
    const strugglingHabits = habitPerformance
      .filter(h => h.completionRate < 60 && h.totalLogs > 5)
      .map(h => `${h.name} (${h.completionRate}% completion)`)
      .join(', ');

    const prompt = `You are a personal development coach with deep insight into behavioral change and habit formation. Analyze this user's holistic personal development journey and provide intelligent, data-driven recommendations.

USER'S CORE VALUES:
${valuesList}

ACTIVE GOALS:
${goalsList || 'No active goals'}

CURRENT HABITS (${habits.length} total):
${habitsList || 'No habits yet'}

HABIT PERFORMANCE ANALYSIS:
${habitPerformance.map(h => `- ${h.name} [${h.category}]: ${h.completionRate}% completion rate, ${h.streak} day streak, ${h.totalLogs} total logs`).join('\n')}

${strugglingHabits ? `STRUGGLING HABITS: ${strugglingHabits}` : ''}

HABIT CATEGORY BREAKDOWN:
${Object.entries(categoryCounts).map(([cat, count]) => `- ${cat}: ${count}`).join('\n') || 'No habits yet'}

RECENT JOURNAL INSIGHTS (Last 10 entries):
${journalInsights}

ANALYSIS REQUESTED:
Based on this comprehensive view, provide TWO types of recommendations:

A) NEW HABITS (2-4 suggestions): Suggest new habits that:
   1. Directly support their active goals and core values
   2. Fill gaps in their current habit categories
   3. Build on patterns and challenges you observe in their journal entries
   4. Complement (not duplicate) their existing habits
   5. Are realistic and actionable based on their current capacity

B) HABIT ADJUSTMENTS (1-2 suggestions): For habits with low completion rates or concerning patterns:
   1. Identify why the habit might be failing (too ambitious, wrong timing, unclear criteria)
   2. Suggest specific modifications (reduce frequency, adjust criteria, change approach)
   3. Provide encouragement and reframe the habit to align better with their values

For EACH suggestion (new or adjustment), provide:
- type: "new" or "adjustment"
- habit_id: (only for adjustments - the ID of the habit to modify. Choose from: ${habits.map(h => h.id).join(', ')})
- name: A clear, concise habit name
- description: Brief description
- category: One of: health, productivity, mindfulness, learning, relationships, finance, other
- done_criteria: Specific completion criteria
- frequency: One of: daily, weekly, custom
- times_per_week: If custom frequency, how many times (1-7)
- value_id: The ID of the core value this aligns with (choose from: ${values.map(v => v.id).join(', ')})
- icon: A single emoji
- why: A personalized, empathetic explanation that references their specific data (journal themes, completion rates, goals) - 2-3 sentences
- adjustment_reason: (only for adjustments) Explain what's not working and how this change will help`;


    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                habit_id: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                done_criteria: { type: "string" },
                frequency: { type: "string" },
                times_per_week: { type: "number" },
                value_id: { type: "string" },
                icon: { type: "string" },
                why: { type: "string" },
                adjustment_reason: { type: "string" }
              }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      suggestions: response.suggestions || [],
      values: values,
      habits: habits
    });

  } catch (error) {
    console.error('Error generating habit suggestions:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
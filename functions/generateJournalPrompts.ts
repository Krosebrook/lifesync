import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entry_type = 'reflection' } = await req.json();

    // Fetch user's context
    const values = await base44.entities.Value.list();
    const goals = await base44.entities.Goal.list();
    const habits = await base44.entities.Habit.filter({ is_active: true });
    const recentLogs = await base44.entities.HabitLog.list('-date', 30);
    const recentEntries = await base44.entities.JournalEntry.list('-date', 10);

    // Calculate habit completion rates (last 7 days)
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const habitPerformance = habits.map(habit => {
      const completions = recentLogs.filter(
        log => log.habit_id === habit.id && last7Days.includes(log.date) && log.completed
      ).length;
      return {
        name: habit.name,
        completionRate: Math.round((completions / 7) * 100)
      };
    });

    // Find recently completed goals
    const recentlyCompletedGoals = goals.filter(g => g.status === 'completed');

    // Find struggling areas (habits < 50% completion)
    const strugglingHabits = habitPerformance.filter(h => h.completionRate < 50);

    // Build AI context
    const context = `
Generate 3 personalized journal prompts for a ${entry_type} entry.

User's Core Values: ${values.map(v => v.name).join(', ')}

Active Goals:
${goals.filter(g => g.status === 'active').map(g => `- ${g.title} (${g.progress}% complete)`).join('\n')}

Recent Habit Performance:
${habitPerformance.map(h => `- ${h.name}: ${h.completionRate}% completion`).join('\n')}

${strugglingHabits.length > 0 ? `Habits needing attention: ${strugglingHabits.map(h => h.name).join(', ')}` : ''}

${recentlyCompletedGoals.length > 0 ? `Recently completed goals: ${recentlyCompletedGoals.map(g => g.title).join(', ')}` : ''}

Recent journal themes: ${recentEntries.slice(0, 3).map(e => e.title || 'reflection').join(', ')}

Create prompts that:
1. Connect to their values
2. Address struggling areas with encouragement
3. Build on recent successes
4. Are specific and actionable
5. Match the ${entry_type} entry type

Make them warm, personal, and motivating.
    `.trim();

    const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: context,
      response_json_schema: {
        type: "object",
        properties: {
          prompts: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3
          }
        }
      }
    });

    return Response.json({ 
      success: true, 
      prompts: aiResponse.prompts 
    });

  } catch (error) {
    console.error('Error generating journal prompts:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});
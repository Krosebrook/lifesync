import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { week_start, week_end } = await req.json();

    // Fetch user's data for the week
    const habits = await base44.entities.Habit.filter({ is_active: true });
    const habitLogs = await base44.entities.HabitLog.list('-date', 200);
    const journalEntries = await base44.entities.JournalEntry.list('-date', 50);
    const values = await base44.entities.Value.list();

    // Filter data for the specific week
    const weekLogs = habitLogs.filter(log => log.date >= week_start && log.date <= week_end);
    const weekEntries = journalEntries.filter(entry => entry.date >= week_start && entry.date <= week_end);

    // Calculate metrics
    const totalPossibleCompletions = habits.length * 7;
    const completedLogs = weekLogs.filter(log => log.completed);
    const habitCompletionRate = totalPossibleCompletions > 0 
      ? Math.round((completedLogs.length / totalPossibleCompletions) * 100)
      : 0;

    const moods = weekEntries.map(e => e.mood).filter(m => m);
    const averageMood = moods.length > 0 
      ? Math.round(moods.reduce((sum, m) => sum + m, 0) / moods.length)
      : null;

    // Build context for AI
    const context = `
User's Weekly Data (${week_start} to ${week_end}):

Core Values: ${values.map(v => v.name).join(', ')}

Habits:
${habits.map(h => `- ${h.name}: ${weekLogs.filter(l => l.habit_id === h.id && l.completed).length}/7 days completed`).join('\n')}

Overall Habit Completion Rate: ${habitCompletionRate}%

Journal Entries: ${weekEntries.length} entries this week
${weekEntries.map(e => `- ${e.date}: "${e.content?.substring(0, 100)}..."`).join('\n')}

Average Mood: ${averageMood ? ['😔', '😕', '😐', '🙂', '😊'][averageMood - 1] : 'Not tracked'}

Analyze this week and provide:
1. A brief, encouraging summary (2-3 sentences)
2. 3 specific highlights/wins
3. 2 areas for growth
4. 3 intention suggestions for next week that align with their values
    `.trim();

    // Call AI to generate summary
    const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: context,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3
          },
          areas_for_growth: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 2
          },
          next_week_intentions: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3
          }
        }
      }
    });

    // Create weekly summary record
    const summary = await base44.entities.WeeklySummary.create({
      week_start,
      week_end,
      ai_summary: aiResponse.summary,
      habit_completion_rate: habitCompletionRate,
      average_mood: averageMood,
      highlights: aiResponse.highlights,
      areas_for_growth: aiResponse.areas_for_growth,
      next_week_intentions: aiResponse.next_week_intentions
    });

    return Response.json({ 
      success: true, 
      summary 
    });

  } catch (error) {
    console.error('Error generating weekly summary:', error);
    return Response.json({ 
      error: error.message,
      details: error.stack 
    }, { status: 500 });
  }
});
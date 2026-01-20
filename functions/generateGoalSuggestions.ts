import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's values, existing goals, habits, and recent journal entries
    const [values, goals, habits, journalEntries] = await Promise.all([
      base44.entities.Value.filter({ created_by: user.email }),
      base44.entities.Goal.filter({ created_by: user.email }),
      base44.entities.Habit.filter({ created_by: user.email }),
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 10)
    ]);

    if (values.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No core values found. Please set up your values first.' 
      });
    }

    // Build context for AI
    const valuesList = values.map(v => `- ${v.name}: ${v.description || 'No description'}`).join('\n');
    const existingGoalsList = goals.map(g => `- ${g.title} (${g.status})`).join('\n');
    const habitsList = habits.slice(0, 5).map(h => `- ${h.name}`).join('\n');
    
    const journalThemes = journalEntries.length > 0 
      ? journalEntries.map(j => j.content).join(' ').substring(0, 500)
      : 'No recent journal entries';

    const prompt = `You are a personal development coach helping someone set meaningful goals aligned with their core values.

USER'S CORE VALUES:
${valuesList}

EXISTING GOALS:
${existingGoalsList || 'No goals yet'}

CURRENT HABITS:
${habitsList || 'No habits yet'}

RECENT JOURNAL THEMES (last 10 entries):
${journalThemes}

Based on this information, suggest 3-5 specific, actionable goals that:
1. Are directly aligned with their core values
2. Build on their existing habits and activities
3. Address gaps in their personal development
4. Are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

For each goal suggestion, provide:
- title: A clear, concise goal title
- description: Detailed description of what this goal entails and why it matters
- value_id: The ID of the core value this aligns with most (choose from: ${values.map(v => v.id).join(', ')})
- suggested_target_date: A realistic target date (format: YYYY-MM-DD, should be 1-6 months from now)
- why: A brief explanation of why this goal is recommended based on their values and activity`;

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
                title: { type: "string" },
                description: { type: "string" },
                value_id: { type: "string" },
                suggested_target_date: { type: "string" },
                why: { type: "string" }
              }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      suggestions: response.suggestions || [],
      values: values
    });

  } catch (error) {
    console.error('Error generating goal suggestions:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
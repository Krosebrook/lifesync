import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's values, goals, current habits, and recent journal entries
    const [values, goals, habits, journalEntries] = await Promise.all([
      base44.entities.Value.filter({ created_by: user.email }),
      base44.entities.Goal.filter({ created_by: user.email, status: 'active' }),
      base44.entities.Habit.filter({ created_by: user.email, is_active: true }),
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 5)
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

    const journalThemes = journalEntries.length > 0 
      ? journalEntries.map(j => j.content).join(' ').substring(0, 400)
      : 'No recent journal entries';

    const prompt = `You are a personal development coach helping someone build better habits aligned with their core values and goals.

USER'S CORE VALUES:
${valuesList}

ACTIVE GOALS:
${goalsList || 'No active goals'}

CURRENT HABITS (${habits.length} total):
${habitsList || 'No habits yet'}

HABIT CATEGORY BREAKDOWN:
${Object.entries(categoryCounts).map(([cat, count]) => `- ${cat}: ${count}`).join('\n') || 'No habits yet'}

RECENT JOURNAL THEMES:
${journalThemes}

Based on this information, suggest 4-6 new habits that:
1. Directly support their active goals and core values
2. Fill gaps in their current habit categories (e.g., if they have many productivity habits but no mindfulness habits)
3. Are realistic, specific, and actionable
4. Complement (not duplicate) their existing habits
5. Build on patterns you see in their journal entries

For each habit suggestion, provide:
- name: A clear, concise habit name (e.g., "Morning meditation")
- description: Brief description of the habit
- category: One of: health, productivity, mindfulness, learning, relationships, finance, other
- done_criteria: Specific completion criteria (e.g., "10 minutes", "3 times", "1 chapter")
- frequency: One of: daily, weekly, custom
- times_per_week: If custom frequency, how many times (1-7)
- value_id: The ID of the core value this aligns with most (choose from: ${values.map(v => v.id).join(', ')})
- icon: A single emoji that represents this habit
- why: A personalized explanation of why this habit is recommended based on their specific values, goals, and current habits (2-3 sentences)`;

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
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                done_criteria: { type: "string" },
                frequency: { type: "string" },
                times_per_week: { type: "number" },
                value_id: { type: "string" },
                icon: { type: "string" },
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
    console.error('Error generating habit suggestions:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
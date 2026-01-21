import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent journal entries
    const entries = await base44.entities.JournalEntry.filter(
      { created_by: user.email },
      '-date',
      15
    );

    if (entries.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Not enough journal entries' 
      }, { status: 400 });
    }

    // Get current habits and mindfulness practices
    const [habits, practices] = await Promise.all([
      base44.entities.Habit.filter({ created_by: user.email, is_active: true }),
      base44.entities.MindfulnessPractice.filter({ created_by: user.email }, '-date', 10)
    ]);

    // Calculate mood trends
    const moods = entries.filter(e => e.mood).map(e => e.mood);
    const avgMood = moods.length > 0 
      ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
      : 3;

    // Extract themes
    const allTags = entries.flatMap(e => e.tags || []);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topThemes = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => `${tag} (${count}x)`);

    const recentContent = entries
      .slice(0, 8)
      .map(e => e.content.substring(0, 150))
      .join('\n');

    const currentHabits = habits.map(h => h.name).join(', ');
    const recentPractices = practices.map(p => p.technique).join(', ');

    const prompt = `Based on journal analysis, suggest habits and mindfulness practices to improve wellbeing.

JOURNAL ANALYSIS:
- Average Mood: ${avgMood}/5
- Recurring Themes: ${topThemes.join(', ')}
- Entry Count: ${entries.length}

CURRENT HABITS:
${currentHabits || 'None'}

RECENT MINDFULNESS:
${recentPractices || 'None'}

RECENT JOURNAL EXCERPTS:
${recentContent}

Suggest 2-3 NEW habits and 2-3 mindfulness practices that:
1. Address patterns seen in the journal
2. Complement (not duplicate) existing habits
3. Target specific emotional needs identified

For each suggestion provide:
- type: "habit" or "mindfulness"
- name: Clear name
- description: Brief description
- frequency: For habits: "daily", "weekly", or "custom"
- duration: For mindfulness: duration in minutes
- why_suggested: 2 sentences explaining why based on their journal patterns
- expected_benefit: What improvement they can expect`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                frequency: { type: "string" },
                duration: { type: "number" },
                why_suggested: { type: "string" },
                expected_benefit: { type: "string" }
              }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      suggestions: response.suggestions || [],
      insights: {
        avgMood: parseFloat(avgMood),
        topThemes: topThemes,
        entryCount: entries.length
      }
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
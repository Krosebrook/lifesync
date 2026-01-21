import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { period } = await req.json(); // 'week' or 'month'
    const days = period === 'month' ? 30 : 7;

    // Get recent journal entries
    const entries = await base44.entities.JournalEntry.filter(
      { created_by: user.email },
      '-date',
      days
    );

    if (entries.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Not enough journal entries' 
      }, { status: 400 });
    }

    // Calculate mood stats
    const moods = entries.filter(e => e.mood).map(e => e.mood);
    const avgMood = moods.length > 0 
      ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
      : 3;

    // Extract all tags/themes
    const allTags = entries.flatMap(e => e.tags || []);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topThemes = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // Prepare content for analysis
    const recentContent = entries
      .slice(0, 10)
      .map(e => e.content.substring(0, 200))
      .join('\n---\n');

    const prompt = `Generate a comprehensive ${period}ly mood and wellbeing report based on these journal entries.

Average Mood: ${avgMood}/5
Total Entries: ${entries.length}
Top Themes: ${topThemes.join(', ')}

Recent Journal Excerpts:
${recentContent}

Provide:
- overall_mood_trend: "improving", "stable", or "declining"
- mood_description: 2-3 sentences describing emotional patterns
- positive_highlights: Array of 2-3 positive patterns or wins
- areas_of_concern: Array of 1-2 recurring challenges (if any)
- recommendations: Array of 3-4 actionable suggestions for improvement
- gratitude_moments: Number estimate of gratitude expressions found (0-10)
- energy_level: Assessed energy level "low", "moderate", or "high"`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          overall_mood_trend: { type: "string" },
          mood_description: { type: "string" },
          positive_highlights: {
            type: "array",
            items: { type: "string" }
          },
          areas_of_concern: {
            type: "array",
            items: { type: "string" }
          },
          recommendations: {
            type: "array",
            items: { type: "string" }
          },
          gratitude_moments: { type: "number" },
          energy_level: { type: "string" }
        }
      }
    });

    return Response.json({
      success: true,
      period,
      entry_count: entries.length,
      avg_mood: parseFloat(avgMood),
      top_themes: topThemes,
      ...response
    });
  } catch (error) {
    console.error('Error generating mood report:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
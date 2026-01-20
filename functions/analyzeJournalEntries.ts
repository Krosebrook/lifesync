import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { limit = 30 } = await req.json();

    // Fetch recent journal entries
    const entries = await base44.entities.JournalEntry.filter(
      { created_by: user.email },
      '-created_date',
      limit
    );

    if (entries.length === 0) {
      return Response.json({
        success: false,
        error: 'No journal entries found to analyze'
      });
    }

    // Prepare entries for analysis
    const entriesText = entries.map(e => 
      `Date: ${e.date}\nTitle: ${e.title || 'Untitled'}\nContent: ${e.content}\nMood: ${e.mood || 'N/A'}/5`
    ).join('\n\n---\n\n');

    const prompt = `You are analyzing journal entries to provide personal growth insights. Analyze the following ${entries.length} journal entries and provide:

1. **Key Themes**: 3-5 main recurring themes or topics
2. **Sentiment Analysis**: Overall emotional tone and patterns
3. **Recurring Topics**: Specific subjects that appear frequently
4. **Growth Areas**: 3-4 potential areas for personal development based on the content
5. **Positive Patterns**: What's going well or improving
6. **Areas of Concern**: Any persistent challenges or struggles

JOURNAL ENTRIES:
${entriesText}

Provide thoughtful, compassionate insights that help the person understand their patterns and growth opportunities.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          key_themes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                theme: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          sentiment_analysis: {
            type: "object",
            properties: {
              overall_tone: { type: "string" },
              mood_trend: { type: "string" },
              emotional_patterns: { type: "string" }
            }
          },
          recurring_topics: {
            type: "array",
            items: { type: "string" }
          },
          growth_areas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                area: { type: "string" },
                insight: { type: "string" },
                suggestion: { type: "string" }
              }
            }
          },
          positive_patterns: {
            type: "array",
            items: { type: "string" }
          },
          areas_of_concern: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    return Response.json({
      success: true,
      analysis: response,
      entries_analyzed: entries.length,
      date_range: {
        from: entries[entries.length - 1]?.date,
        to: entries[0]?.date
      }
    });

  } catch (error) {
    console.error('Error analyzing journal entries:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});
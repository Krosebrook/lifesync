import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entryId, content } = await req.json();

    if (!content) {
      return Response.json({ error: 'Content required' }, { status: 400 });
    }

    const prompt = `Analyze the sentiment and mood of this journal entry. Provide a mood score (1-5) and identify key emotions.

Journal Entry:
"${content.substring(0, 1000)}"

Provide:
- mood_score: A number from 1 (very negative) to 5 (very positive)
- primary_emotion: Main emotion (e.g., "joy", "anxiety", "contentment", "frustration", "gratitude")
- secondary_emotions: Array of 2-3 other emotions present
- sentiment_summary: One sentence describing the overall emotional tone
- themes: Array of 2-4 key themes or topics mentioned (e.g., "work stress", "family time", "self-reflection")`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          mood_score: { type: "number" },
          primary_emotion: { type: "string" },
          secondary_emotions: {
            type: "array",
            items: { type: "string" }
          },
          sentiment_summary: { type: "string" },
          themes: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    // Update the journal entry with sentiment data if entryId provided
    if (entryId) {
      const entry = await base44.entities.JournalEntry.filter({ id: entryId });
      if (entry.length > 0) {
        await base44.entities.JournalEntry.update(entryId, {
          mood: Math.round(response.mood_score),
          tags: response.themes || []
        });
      }
    }

    return Response.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
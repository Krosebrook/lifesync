import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent journal entries for mood analysis
    const journalEntries = await base44.entities.JournalEntry.filter(
      { created_by: user.email }, 
      '-date', 
      20
    );

    // Fetch habit logs to identify stress patterns
    const habitLogs = await base44.entities.HabitLog.list('-date', 100);
    const habits = await base44.entities.Habit.filter({ created_by: user.email });

    // Fetch recent mindfulness practices
    const recentPractices = await base44.entities.MindfulnessPractice.filter(
      { created_by: user.email },
      '-date',
      10
    );

    // Analyze mood trends
    const recentMoods = journalEntries
      .filter(e => e.mood)
      .slice(0, 10)
      .map(e => e.mood);
    
    const avgMood = recentMoods.length > 0 
      ? (recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length).toFixed(1)
      : 3;

    // Analyze habit completion stress
    const habitPerformance = habits.map(habit => {
      const logs = habitLogs.filter(log => log.habit_id === habit.id);
      const recentLogs = logs.slice(0, 14);
      const completionRate = recentLogs.length > 0 
        ? (recentLogs.filter(log => log.completed).length / recentLogs.length * 100).toFixed(0)
        : 0;
      return { name: habit.name, completionRate: parseInt(completionRate) };
    });

    const strugglingHabits = habitPerformance.filter(h => h.completionRate < 50);
    const stressLevel = strugglingHabits.length > 2 ? 'high' : strugglingHabits.length > 0 ? 'moderate' : 'low';

    // Extract journal themes
    const journalThemes = journalEntries.slice(0, 5)
      .map(e => e.content.substring(0, 100))
      .join(' | ');

    // Recent practice patterns
    const practiceSummary = recentPractices.length > 0
      ? `User has completed ${recentPractices.length} mindfulness sessions recently. Most common: ${
          recentPractices[0]?.type || 'none'
        }`
      : 'No recent mindfulness practice';

    const prompt = `You are a mindfulness and meditation expert helping someone build a consistent practice.

USER WELLBEING ANALYSIS:
- Average mood (last 10 entries): ${avgMood}/5
- Stress level (based on habit struggles): ${stressLevel}
- Struggling habits: ${strugglingHabits.length > 0 ? strugglingHabits.map(h => h.name).join(', ') : 'none'}

RECENT JOURNAL THEMES:
${journalThemes || 'No recent journal entries'}

CURRENT MINDFULNESS PRACTICE:
${practiceSummary}

Based on this analysis, recommend 4-5 mindfulness techniques across these categories:
1. MEDITATION: Guided meditations for specific needs
2. BREATHING: Breathing exercises for stress/energy
3. SOUNDSCAPE: Ambient sounds for focus/relaxation

For each technique, provide:
- type: "meditation", "breathing", or "soundscape"
- name: Clear technique name
- duration: Recommended duration in minutes (5-20)
- description: Brief explanation (1 sentence)
- benefits: Primary benefits (e.g., "Reduces anxiety", "Improves focus")
- when_to_use: Specific situations (e.g., "Morning energy boost", "Before sleep")
- instructions: Step-by-step guide (2-4 steps)
- why_recommended: Personalized explanation based on their mood, stress, and journal themes (2 sentences)

Prioritize techniques that address:
- Their current mood level (${avgMood < 3 ? 'low mood' : avgMood > 4 ? 'maintaining good mood' : 'moderate mood'})
- Their stress level (${stressLevel})
- Patterns in their journal entries`;

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
                duration: { type: "number" },
                description: { type: "string" },
                benefits: { type: "string" },
                when_to_use: { type: "string" },
                instructions: { type: "string" },
                why_recommended: { type: "string" }
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
        stressLevel: stressLevel,
        strugglingHabitsCount: strugglingHabits.length
      }
    });
  } catch (error) {
    console.error('Error generating mindfulness suggestions:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});
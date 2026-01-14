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

    // Map habits to their associated values and goals
    const habitsWithContext = habits.map(habit => {
      const goal = goals.find(g => g.id === habit.goal_id);
      const value = goal ? values.find(v => v.id === goal.value_id) : null;
      const completions = recentLogs.filter(
        log => log.habit_id === habit.id && last7Days.includes(log.date) && log.completed
      ).length;
      return {
        name: habit.name,
        completionRate: Math.round((completions / 7) * 100),
        valueName: value?.name || null,
        goalTitle: goal?.title || null
      };
    });

    // Find struggling habits grouped by value
    const strugglingByValue = {};
    habitsWithContext
      .filter(h => h.completionRate < 50)
      .forEach(habit => {
        const val = habit.valueName || 'General';
        if (!strugglingByValue[val]) strugglingByValue[val] = [];
        strugglingByValue[val].push(habit);
      });

    // Find recently completed goals (within last 14 days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const recentlyCompletedGoals = goals.filter(g => {
      if (g.status !== 'completed') return false;
      const goalDate = new Date(g.updated_date);
      return goalDate >= twoWeeksAgo;
    });

    // Build AI context with deeper value connections
    let contextParts = [
      `Generate 3 personalized journal prompts for a ${entry_type} entry.`,
      '',
      `User's Core Values: ${values.map(v => `${v.name}${v.description ? ` (${v.description})` : ''}`).join(', ')}`
    ];

    // Add active goals with value connections
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      contextParts.push('', 'Active Goals:');
      activeGoals.forEach(g => {
        const value = values.find(v => v.id === g.value_id);
        contextParts.push(`- ${g.title} (${g.progress}% complete)${value ? ` - Connected to ${value.name}` : ''}`);
      });
    }

    // Add struggling habits with value context
    if (Object.keys(strugglingByValue).length > 0) {
      contextParts.push('', 'Areas Needing Attention:');
      for (const [valueName, habits] of Object.entries(strugglingByValue)) {
        const habitNames = habits.map(h => h.name).join(', ');
        contextParts.push(`- ${valueName} value: ${habitNames} (${habits[0].completionRate}% completion this week)`);
      }
    }

    // Add thriving habits for positive reinforcement
    const thrivingHabits = habitsWithContext.filter(h => h.completionRate >= 80);
    if (thrivingHabits.length > 0) {
      contextParts.push('', 'Strengths to Build On:');
      thrivingHabits.slice(0, 3).forEach(h => {
        contextParts.push(`- ${h.name} (${h.completionRate}% completion)${h.valueName ? ` - Supporting ${h.valueName}` : ''}`);
      });
    }

    // Add recently completed goals with celebration
    if (recentlyCompletedGoals.length > 0) {
      contextParts.push('', 'Recent Achievements:');
      recentlyCompletedGoals.forEach(g => {
        const value = values.find(v => v.id === g.value_id);
        contextParts.push(`- Completed: ${g.title}${value ? ` (${value.name} value)` : ''}`);
      });
    }

    // Add recent journal themes
    const recentThemes = recentEntries.slice(0, 3).map(e => e.title || 'general reflection');
    if (recentThemes.length > 0) {
      contextParts.push('', `Recent journal themes: ${recentThemes.join(', ')}`);
    }

    contextParts.push('', 'Create prompts that:');
    contextParts.push('1. Directly reference their specific core values by name');
    contextParts.push('2. If habits are struggling in a value area, ask compassionate questions about overcoming challenges in that value');
    contextParts.push('3. For recently completed goals, celebrate and prompt for new ambitious goals aligned with that value');
    contextParts.push('4. For thriving habits, ask how to expand or deepen that practice');
    contextParts.push(`5. Match the ${entry_type} entry type`);
    contextParts.push('6. Be specific, personal, warm, and actionable');
    contextParts.push('', 'Example formats:');
    contextParts.push('- "Your [Value Name] value is important to you. Given that [Habit] has been challenging this week, what\'s one small step..."');
    contextParts.push('- "You recently completed [Goal]. What new, ambitious goal in [Value] excites you now?"');
    contextParts.push('- "You\'ve been consistent with [Habit]. How could you deepen this practice to further embody [Value]?"');

    const context = contextParts.join('\n');

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
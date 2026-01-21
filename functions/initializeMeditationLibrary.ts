import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const meditationLibrary = [
      {
        name: 'Body Scan Meditation',
        type: 'meditation',
        category: 'body-scan',
        duration: 15,
        description: 'Progressive relaxation through body awareness and gentle scanning',
        instructions: '1. Lie down comfortably on your back\n2. Close your eyes and take 3 deep breaths\n3. Starting at your toes, mentally scan each body part\n4. Notice sensations without judgment\n5. Slowly work your way up to the crown of your head\n6. End with deep gratitude for your body',
        benefits: ['stress-reduction', 'sleep', 'emotional-balance'],
        when_to_use: 'Evening or before bed',
        difficulty: 'beginner'
      },
      {
        name: 'Loving-Kindness Meditation',
        type: 'meditation',
        category: 'loving-kindness',
        duration: 10,
        description: 'Cultivate compassion for yourself and others',
        instructions: '1. Sit comfortably with hand on heart\n2. Silently repeat: "May I be happy, may I be healthy, may I be safe, may I be at ease"\n3. Extend these wishes to a loved one\n4. Then to a neutral person\n5. To someone difficult\n6. Finally to all beings',
        benefits: ['emotional-balance', 'focus', 'anxiety'],
        when_to_use: 'Morning or when feeling disconnected',
        difficulty: 'intermediate'
      },
      {
        name: 'Mindful Breathing',
        type: 'meditation',
        category: 'mindful-breathing',
        duration: 5,
        description: 'Simple breath awareness for quick stress relief',
        instructions: '1. Sit comfortably upright\n2. Let your eyes gently close or soften gaze\n3. Focus on the sensation of natural breathing\n4. Notice cool air entering, warm air leaving\n5. When mind wanders, gently return focus\n6. Practice for entire duration',
        benefits: ['stress-reduction', 'focus', 'clarity'],
        when_to_use: 'Anytime, especially during stress',
        difficulty: 'beginner'
      },
      {
        name: 'Box Breathing',
        type: 'breathing',
        category: 'box-breathing',
        duration: 5,
        description: 'Balanced breathing pattern: inhale 4, hold 4, exhale 4, hold 4',
        instructions: '1. Sit comfortably\n2. Breathe in through nose for count of 4\n3. Hold breath for count of 4\n4. Exhale through mouth for count of 4\n5. Hold empty for count of 4\n6. Repeat 5-10 times',
        benefits: ['stress-reduction', 'focus', 'anxiety'],
        when_to_use: 'Before important meetings or stressful moments',
        difficulty: 'beginner'
      },
      {
        name: '4-7-8 Breathing',
        type: 'breathing',
        category: 'box-breathing',
        duration: 5,
        description: 'Extended exhale breathing for relaxation and sleep preparation',
        instructions: '1. Sit or lie comfortably\n2. Inhale through nose for count of 4\n3. Hold breath for count of 7\n4. Exhale through mouth for count of 8\n5. Pause and repeat\n6. Continue for 4-8 cycles',
        benefits: ['sleep', 'anxiety', 'emotional-balance'],
        when_to_use: 'Before bed or when anxious',
        difficulty: 'beginner'
      },
      {
        name: 'Energizing Breath',
        type: 'breathing',
        category: 'energizing',
        duration: 3,
        description: 'Quick, rhythmic breathing to boost energy and alertness',
        instructions: '1. Sit upright with good posture\n2. Take quick, shallow breaths through nose\n3. Around 3 breaths per second\n4. Maintain rhythmic pace\n5. Continue for 1-2 minutes\n6. Gradually slow down',
        benefits: ['energy', 'focus', 'clarity'],
        when_to_use: 'Morning or midday energy slump',
        difficulty: 'intermediate'
      },
      {
        name: 'Rain Soundscape',
        type: 'soundscape',
        category: 'nature',
        duration: 20,
        description: 'Gentle rainfall for deep relaxation and meditation',
        benefits: ['sleep', 'stress-reduction', 'emotional-balance'],
        when_to_use: 'Sleep or deep focus',
        difficulty: 'beginner'
      },
      {
        name: 'Ocean Waves',
        type: 'soundscape',
        category: 'nature',
        duration: 20,
        description: 'Rhythmic waves for calming and centering',
        benefits: ['anxiety', 'stress-reduction', 'focus'],
        when_to_use: 'Meditation or relaxation',
        difficulty: 'beginner'
      },
      {
        name: 'Forest Ambience',
        type: 'soundscape',
        category: 'nature',
        duration: 30,
        description: 'Birds and nature sounds for clarity and connection',
        benefits: ['focus', 'clarity', 'stress-reduction'],
        when_to_use: 'Work or creative tasks',
        difficulty: 'beginner'
      },
      {
        name: 'Cafe Ambience',
        type: 'soundscape',
        category: 'ambient',
        duration: 25,
        description: 'Cozy coffee shop atmosphere for productivity',
        benefits: ['focus', 'productivity', 'clarity'],
        when_to_use: 'Work or study sessions',
        difficulty: 'beginner'
      }
    ];

    // Check if library already exists
    const existing = await base44.asServiceRole.entities.MeditationLibrary.list();
    
    if (existing.length === 0) {
      // Create all practices at once
      await base44.asServiceRole.entities.MeditationLibrary.bulkCreate(meditationLibrary);
      return Response.json({ success: true, message: 'Meditation library initialized', count: meditationLibrary.length });
    } else {
      return Response.json({ success: true, message: 'Library already exists', count: existing.length });
    }
  } catch (error) {
    console.error('Error initializing library:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
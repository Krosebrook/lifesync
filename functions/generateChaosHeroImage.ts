import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate hero image with specific Chaos Club aesthetic
    const result = await base44.integrations.Core.GenerateImage({
      prompt: `Cinematic editorial photograph, wide format. A person in their early 30s seated by a large industrial window, soft natural daylight streaming in. Subject positioned in the right two-thirds of the frame, gazing contemplatively to the side - not at camera. Left side has intentional negative space for text overlay. Wearing a neutral sweater and jeans, hands resting naturally on their lap. Posture is grounded and present, not performing or posing. Soft directional window light creates subtle shadows and depth. Muted warm color palette - charcoal grays, warm beiges, soft earth tones. Film grain texture throughout. Interior setting: minimal modern architecture, concrete or exposed brick, one simple plant visible. Mood: quiet relief, recognition, honest pause. Photojournalistic documentary style, 35mm film aesthetic, slightly desaturated. Shallow depth of field on subject. No smile, no performance - just an authentic moment of being present. Professional editorial photography. Avoid: stock photo happiness, bright cheerful colors, posed expressions, clinical settings, therapy office, dramatic lighting, center framing.`
    });

    return Response.json({ 
      success: true, 
      imageUrl: result.url,
      message: 'Chaos Club hero image generated'
    });
    
  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});
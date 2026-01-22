import React from 'react';

/**
 * Chaos Club Hero Component
 * 
 * PHOTOGRAPHY BRIEF:
 * - Subject: Person in 30s, off-center composition
 * - Lighting: Soft natural window light, cinematic
 * - Mood: Grounded, present, relief
 * - Pose: Unposed, contemplative, not performing
 * - Space: Negative space left for headline text
 * - Style: Editorial, 35mm film grain, muted tones
 * - Avoid: Stock happiness, clinical settings, forced expressions
 * 
 * Replace placeholder URL with actual hero photography
 */

export default function ChaosHero({ 
  headline = "No masks required. No perfection expected.",
  subtext = "Chaos is normal. Pretending isn't.",
  imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2000&q=85&fit=crop&crop=entropy",
  ctaText,
  onCtaClick
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden grain">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover opacity-90"
          style={{
            filter: 'grayscale(0.15) contrast(1.05)',
            objectPosition: '60% center' // Off-center composition
          }}
        />
        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Film Grain Texture */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content - Left Third */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 md:px-12 w-full">
          <div className="max-w-xl">
            {/* Accent Bar */}
            <div className="w-12 h-1 bg-[#FF6B35] mb-8" />
            
            {/* Headline */}
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]"
              style={{ 
                fontFamily: 'Newsreader, Georgia, serif',
                letterSpacing: '-0.02em'
              }}
            >
              {headline}
            </h1>
            
            {/* Subtext */}
            <p className="text-xl md:text-2xl text-[#E8DCC8] mb-12 leading-relaxed font-light">
              {subtext}
            </p>

            {/* CTA */}
            {ctaText && (
              <button
                onClick={onCtaClick}
                className="px-8 py-4 bg-[#FF6B35] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#E85A2A] transition-colors"
              >
                {ctaText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 md:left-12 text-[#9A9A9A] text-xs uppercase tracking-widest flex items-center gap-3">
        <div className="w-px h-12 bg-[#9A9A9A] opacity-40" />
        <span>Scroll</span>
      </div>
    </div>
  );
}

/**
 * PHOTOGRAPHY SOURCING GUIDE FOR PRODUCTION:
 * 
 * Recommended Sources:
 * - Unsplash.com (Editorial collection, search: "contemplative portrait window")
 * - Pexels.com (Filter: People > Lifestyle > Authentic)
 * - Custom photoshoot with local photographer
 * 
 * Keywords for Image Search:
 * - "window portrait natural light"
 * - "contemplative person interior"
 * - "editorial lifestyle portrait"
 * - "honest moment documentary"
 * - "person by window side lighting"
 * 
 * Technical Specs:
 * - Minimum 2400px width
 * - Aspect ratio: 16:9 or wider
 * - Format: WebP (with JPEG fallback)
 * - Optimize: 85% quality, ~300-400KB file size
 * 
 * Composition Checklist:
 * ✓ Subject in right 2/3 of frame
 * ✓ Clear negative space left side
 * ✓ Soft directional light (not harsh)
 * ✓ Muted color palette
 * ✓ Not looking at camera
 * ✓ Casual, natural posture
 * ✗ Avoid: Center framing, bright colors, posed smiles
 */
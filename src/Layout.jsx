import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, 
  Target, 
  BookOpen, 
  Award, 
  Settings,
  MessageCircle,
  Users
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [isOnboarded, setIsOnboarded] = useState(null);

  const { data: profiles } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => base44.entities.UserProfile.list(),
  });

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setIsOnboarded(profiles[0].onboarding_completed);
    } else if (profiles) {
      setIsOnboarded(false);
    }
  }, [profiles]);

  const navItems = [
    { name: 'Home', icon: Home, page: 'Dashboard' },
    { name: 'Talk', icon: MessageCircle, page: 'Coach' },
    { name: 'Goals', icon: Target, page: 'Goals' },
    { name: 'Patterns', icon: Target, page: 'Habits' },
    { name: 'Practice', icon: BookOpen, page: 'Mindfulness' },
    { name: 'Notes', icon: BookOpen, page: 'Journal' },
    { name: 'Circle', icon: Users, page: 'Accountability' },
    { name: 'You', icon: Award, page: 'Progress' },
    { name: 'Settings', icon: Settings, page: 'Settings' },
  ];

  const hideNav = currentPageName === 'Onboarding' || currentPageName === 'Coach';

  return (
    <div className="min-h-screen bg-[#1A1A1A]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap');
        
        :root {
          --chaos-black: #1A1A1A;
          --chaos-charcoal: #2A2A2A;
          --chaos-slate: #404040;
          --chaos-warm: #E8DCC8;
          --chaos-accent: #FF6B35;
          --chaos-accent-soft: #FFB088;
          --chaos-text: #F5F5F5;
          --chaos-text-dim: #9A9A9A;
          --chaos-border: rgba(255, 255, 255, 0.08);
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        body {
          background: var(--chaos-black);
          color: var(--chaos-text);
        }

        .grain {
          position: relative;
          overflow: hidden;
        }

        .grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .bottom-nav {
          background: rgba(26, 26, 26, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--chaos-border);
        }

        .nav-item {
          transition: all 0.2s ease;
          color: var(--chaos-text-dim);
        }

        .nav-item.active {
          color: var(--chaos-accent);
        }

        .nav-item:hover {
          color: var(--chaos-text);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--chaos-slate);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--chaos-accent);
        }
      `}</style>

      {/* Main Content */}
      <main className={`${hideNav ? '' : 'pb-20 md:pb-0 md:pl-20'}`}>
        <div className={`${hideNav ? '' : 'max-w-[1400px] mx-auto'}`}>
          {isOnboarded === false && currentPageName !== 'Onboarding' ? (
            <div className="min-h-screen flex items-center justify-center p-6 grain">
              <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] rounded-sm p-10 max-w-lg">
                <div className="w-2 h-16 bg-[#FF6B35] mb-6" />
                <h2 className="text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'Newsreader, serif' }}>
                  Welcome to Chaos Club
                </h2>
                <p className="text-[#9A9A9A] mb-8 leading-relaxed">
                  You're not broken. Life's just messy sometimes. Let's figure out what matters to you—no bullshit, no wellness theater.
                </p>
                <Link 
                  to={createPageUrl('Onboarding')}
                  className="inline-flex items-center justify-center w-full py-4 px-6 bg-[#FF6B35] text-white font-medium hover:bg-[#E85A2A] transition-colors"
                >
                  Start here
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Desktop Side Navigation */}
      {!hideNav && (
        <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-[#1A1A1A] flex-col items-center py-8 border-r border-[rgba(255,255,255,0.08)] z-50">
          <div className="w-10 h-10 bg-[#FF6B35] flex items-center justify-center mb-12">
            <div className="w-6 h-6 border-2 border-white" />
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`nav-item w-12 h-12 flex items-center justify-center relative group ${
                  currentPageName === item.page ? 'active' : ''
                }`}
              >
                {currentPageName === item.page && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B35]" />
                )}
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <nav className="md:hidden bottom-nav fixed bottom-0 left-0 right-0 px-2 py-2 z-50">
          <div className="flex justify-around items-center">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`nav-item flex flex-col items-center py-2 px-2 ${
                  currentPageName === item.page ? 'active' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium uppercase tracking-wider">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
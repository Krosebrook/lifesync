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
  Sparkles,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { name: 'Dashboard', icon: Home, page: 'Dashboard' },
    { name: 'Coach', icon: Sparkles, page: 'Coach' },
    { name: 'Goals', icon: Target, page: 'Goals' },
    { name: 'Habits', icon: Target, page: 'Habits' },
    { name: 'Journal', icon: BookOpen, page: 'Journal' },
    { name: 'Friends', icon: Users, page: 'Accountability' },
    { name: 'Progress', icon: Award, page: 'Progress' },
    { name: 'Settings', icon: Settings, page: 'Settings' },
  ];

  const hideNav = currentPageName === 'Onboarding' || currentPageName === 'Coach';

  return (
    <div className="min-h-screen bg-[#0A0E27]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        :root {
          --primary-bg: #0A0E27;
          --card-bg: #1A1F3A;
          --card-bg-alt: #141829;
          --accent: #4DD0E1;
          --accent-dark: #26C6DA;
          --accent-light: rgba(77, 208, 225, 0.1);
          --text-primary: #FFFFFF;
          --text-secondary: #B0B8D4;
          --text-muted: #6B7280;
          --shadow: 0 4px 20px rgba(0,0,0,0.3);
          --radius-card: 16px;
          --radius-button: 12px;
          --radius-input: 8px;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        body {
          background: #0A0E27;
        }

        .bottom-nav {
          background: rgba(26, 31, 58, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 -2px 30px rgba(0,0,0,0.5);
        }

        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #6B7280;
        }

        .nav-item.active {
          color: var(--accent);
        }

        .nav-item:hover {
          color: var(--accent);
        }

        .page-transition {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
      `}</style>

      {/* Main Content */}
      <main className={`page-transition ${hideNav ? '' : 'pb-24 md:pb-8 md:pl-20'}`}>
        <div className={`${hideNav ? '' : 'max-w-[1200px] mx-auto'}`}>
          {isOnboarded === false && currentPageName !== 'Onboarding' ? (
            <div className="min-h-screen flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[22px] p-8 text-center max-w-md shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="w-16 h-16 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-3">Welcome to LifeSync</h2>
                <p className="text-[#666666] mb-6">Let's set up your personal values and goals to get started on your intentional living journey.</p>
                <Link 
                  to={createPageUrl('Onboarding')}
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#1ABC9C] text-white font-medium rounded-[12px] hover:bg-[#16A085] transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Desktop Side Navigation */}
      {!hideNav && (
        <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-[#1A1F3A]/95 backdrop-blur-xl flex-col items-center py-8 shadow-[2px_0_30px_rgba(0,0,0,0.5)] z-50 border-r border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] rounded-[12px] flex items-center justify-center mb-8">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`nav-item w-12 h-12 rounded-[12px] flex items-center justify-center ${
                  currentPageName === item.page 
                    ? 'active bg-[#4DD0E1]/10' 
                    : 'hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <nav className="md:hidden bottom-nav fixed bottom-0 left-0 right-0 px-4 py-2 z-50">
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`nav-item flex flex-col items-center py-2 px-3 rounded-[12px] ${
                  currentPageName === item.page 
                    ? 'active' 
                    : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
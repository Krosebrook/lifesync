import React, { useState } from 'react';
import { Search, Book, Code, Settings, Shield, Activity, Users, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'overview', title: 'Overview', icon: Book },
  { id: 'getting-started', title: 'Getting Started', icon: Activity },
  { id: 'user-guide', title: 'User Guide', icon: Users },
  { id: 'architecture', title: 'Architecture', icon: Code },
  { id: 'api', title: 'API Reference', icon: FileText },
  { id: 'deployment', title: 'Deployment', icon: Settings },
  { id: 'security', title: 'Security', icon: Shield }
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'getting-started':
        return <GettingStartedSection />;
      case 'user-guide':
        return <UserGuideSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'api':
        return <APISection />;
      case 'deployment':
        return <DeploymentSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0E27]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Documentation</h1>
              <p className="text-[#B0B8D4] text-sm">Complete guide to LifeSync</p>
            </div>
            <div className="text-xs text-[#B0B8D4]">v1.0.0</div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B8D4]" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#4DD0E1] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <nav className="sticky top-32 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-[#4DD0E1]/20 text-[#4DD0E1] border border-[#4DD0E1]/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert max-w-none"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Components
function OverviewSection() {
  return (
    <div className="space-y-8 text-white/80">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">LifeSync Platform Documentation</h2>
        <p className="text-lg text-[#B0B8D4]">A cinematic AI-powered personal well-being and productivity platform for intentional living</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">What is LifeSync?</h3>
        <p className="mb-4">
          LifeSync is a comprehensive personal development application that combines goal tracking, habit building, 
          mindfulness practices, journaling, and AI-powered coaching to help users live more intentionally and achieve 
          their personal growth objectives.
        </p>
        <p>
          Built on the Base44 platform, LifeSync provides a seamless experience across web and mobile devices with 
          real-time synchronization, advanced analytics, and community features.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Key Features</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Values-Based Goals', desc: 'Align objectives with personal values' },
            { title: 'Habit Tracking', desc: 'Build consistency with streak tracking' },
            { title: 'AI Coaching', desc: 'Personalized insights and guidance' },
            { title: 'Mindfulness Library', desc: 'Guided meditations and practices' },
            { title: 'Smart Journaling', desc: 'Sentiment analysis and prompts' },
            { title: 'Gamification', desc: 'Points, levels, and achievements' },
            { title: 'Community', desc: 'Accountability partners and challenges' },
            { title: 'Premium Analytics', desc: 'Advanced reporting and trends' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-[#B0B8D4]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Technology Stack</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-white font-semibold">Layer</th>
              <th className="py-3 px-4 text-white font-semibold">Technology</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Frontend</td>
              <td className="py-3 px-4">React 18, Tailwind CSS, Framer Motion</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Backend</td>
              <td className="py-3 px-4">Base44 BaaS, Deno Deploy Functions</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Database</td>
              <td className="py-3 px-4">Base44 Managed Entities</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">AI</td>
              <td className="py-3 px-4">Base44 LLM Integration, AI Agents</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Authentication</td>
              <td className="py-3 px-4">Base44 Auth (Built-in)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Versioning</h3>
        <p className="mb-4">LifeSync follows Semantic Versioning (SemVer):</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong className="text-white">MAJOR</strong>: Breaking changes to API or data models</li>
          <li><strong className="text-white">MINOR</strong>: New features, backwards compatible</li>
          <li><strong className="text-white">PATCH</strong>: Bug fixes and minor improvements</li>
        </ul>
      </div>

      <div className="bg-[#4DD0E1]/10 border border-[#4DD0E1]/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Current Version: 1.0.0</h3>
        <p className="text-sm text-[#B0B8D4]">Released: January 2026</p>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">Getting Started</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Prerequisites</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Requirement</th>
              <th className="text-left py-3 px-4 text-white">Version</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Node.js</td>
              <td className="py-3 px-4 text-[#4DD0E1]">16.x or higher</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">npm/yarn</td>
              <td className="py-3 px-4 text-[#4DD0E1]">Latest stable</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Base44 Account</td>
              <td className="py-3 px-4 text-[#4DD0E1]">Free or Premium</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Installation</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#4DD0E1] mb-2">Step 1: Clone Repository</p>
            <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-green-400">git clone https://github.com/yourusername/lifesync.git
cd lifesync</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#4DD0E1] mb-2">Step 2: Install Dependencies</p>
            <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-green-400">npm install</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#4DD0E1] mb-2">Step 3: Configure Environment</p>
            <p className="text-sm mb-2">Set up your Base44 app credentials in the Base44 dashboard</p>
          </div>

          <div>
            <p className="text-sm text-[#4DD0E1] mb-2">Step 4: Start Development Server</p>
            <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-green-400">npm run dev</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#4DD0E1] mb-2">Step 5: Open Browser</p>
            <p className="text-sm">Navigate to <code className="text-[#4DD0E1]">http://localhost:5173</code></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">First-Run Checklist</h3>
        <div className="space-y-3">
          {[
            'Create Base44 account and project',
            'Configure authentication settings',
            'Initialize badge system (run initializeBadges function)',
            'Populate meditation library (run initializeMeditationLibrary)',
            'Test user registration flow',
            'Complete onboarding as test user',
            'Verify entity data creation',
            'Test AI coaching functionality'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-[#4DD0E1]/20 text-[#4DD0E1] flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-400 font-semibold mb-2">⚠️ Important</p>
        <p className="text-sm">Make sure to run initialization functions before allowing users to access the app.</p>
      </div>
    </div>
  );
}

function UserGuideSection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">User Guide</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Core Features</h3>
        
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">🎯 Goals & Values</h4>
            <p className="mb-4">Align your objectives with personal values for meaningful progress.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Select up to 5 core values during onboarding</li>
              <li>Create SMART goals linked to values</li>
              <li>Track progress with percentage completion</li>
              <li>Get AI-powered goal suggestions</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">📊 Habit Tracking</h4>
            <p className="mb-4">Build consistency with flexible habit management.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Daily habits</strong>: Complete every day</li>
              <li><strong>Weekly habits</strong>: Choose specific days (M/W/F)</li>
              <li><strong>Custom frequency</strong>: X times per week</li>
              <li>Streak tracking with milestone celebrations</li>
              <li>Personal challenges (30-day streaks, etc.)</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">🧘 Mindfulness</h4>
            <p className="mb-4">Access guided practices for mental well-being.</p>
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white">Practice Type</th>
                  <th className="text-left py-2 text-white">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-[#4DD0E1]">Meditations</td>
                  <td className="py-2">Body scan, Loving-kindness, Mindful breathing</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-[#4DD0E1]">Breathing</td>
                  <td className="py-2">Box breathing, 4-7-8, Energizing breath</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-[#4DD0E1]">Soundscapes</td>
                  <td className="py-2">Rain, Ocean, Forest, Cafe ambience</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">📝 Journaling</h4>
            <p className="mb-4">Daily reflection with AI-powered insights.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reflection, gratitude, free write, or weekly review entries</li>
              <li>Mood tracking (1-5 scale) before and after practices</li>
              <li>AI sentiment analysis for emotional patterns</li>
              <li>Weekly mood reports with recommendations</li>
              <li>Smart journal prompts based on history</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">🤖 AI Coach</h4>
            <p className="mb-4">Conversational AI for personalized guidance.</p>
            <div className="bg-black/40 p-4 rounded-lg mt-4">
              <p className="text-sm text-[#4DD0E1] mb-2">Example Interactions:</p>
              <ul className="space-y-2 text-sm">
                <li>→ "How am I doing with my goals?"</li>
                <li>→ "What habit should I focus on next?"</li>
                <li>→ "Help me reflect on this week"</li>
                <li>→ "I'm feeling stuck with my progress"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Gamification System</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Action</th>
              <th className="text-left py-3 px-4 text-white">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Daily login</td>
              <td className="py-3 px-4 text-[#4DD0E1]">5 XP</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Complete habit</td>
              <td className="py-3 px-4 text-[#4DD0E1]">10 XP</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Write journal entry</td>
              <td className="py-3 px-4 text-[#4DD0E1]">15 XP</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Mindfulness practice</td>
              <td className="py-3 px-4 text-[#4DD0E1]">20 XP</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Achieve goal</td>
              <td className="py-3 px-4 text-[#4DD0E1]">50 XP</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4">Streak milestone</td>
              <td className="py-3 px-4 text-[#4DD0E1]">100 XP</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm mt-4 text-[#B0B8D4]">
          Level up formula: 100 × current level points required
        </p>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">Architecture</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">System Overview</h3>
        <div className="bg-black/40 p-6 rounded-xl font-mono text-sm">
          <pre className="text-[#4DD0E1]">{`┌─────────────────────────────────────┐
│        Frontend Layer               │
│  React 18 + Tailwind + Framer      │
└─────────────────────────────────────┘
            │
            │ Base44 SDK
            ▼
┌─────────────────────────────────────┐
│       Base44 Platform Layer         │
│  Auth │ DB │ Functions │ Agents     │
└─────────────────────────────────────┘
            │
            │ API Calls
            ▼
┌─────────────────────────────────────┐
│        External Services            │
│    LLM APIs │ Stripe │ Email        │
└─────────────────────────────────────┘`}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Component Hierarchy</h3>
        <div className="bg-black/40 p-6 rounded-xl font-mono text-sm overflow-x-auto">
          <pre className="text-[#B0B8D4]">{`src/
├── pages/                  # Route components
│   ├── Dashboard.js        # Landing page
│   ├── Goals.js           # Goal management
│   ├── Habits.js          # Habit tracking
│   ├── Mindfulness.js     # Meditation
│   ├── Journal.js         # Journaling
│   ├── Coach.js           # AI chat
│   └── Accountability.js  # Community
│
├── components/
│   ├── shared/            # Reusable UI
│   ├── habits/            # Habit features
│   ├── mindfulness/       # Meditation UI
│   ├── gamification/      # Gaming elements
│   └── premium/           # Premium features
│
├── entities/              # Data schemas
├── functions/             # Backend logic
├── agents/                # AI agents
└── Layout.js              # App wrapper`}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Data Flow</h3>
        <div className="space-y-3">
          {[
            'User Action (click, input)',
            'React Component State Update',
            'Base44 SDK Call',
            'Backend Function (if needed)',
            'Database Entity CRUD',
            'React Query Cache Update',
            'UI Re-render'
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4DD0E1]/20 text-[#4DD0E1] flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 p-3 bg-white/5 rounded-lg">{step}</div>
              {idx < 6 && <ChevronRight className="w-5 h-5 text-[#4DD0E1]" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">State Management</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Type</th>
              <th className="text-left py-3 px-4 text-white">Tool</th>
              <th className="text-left py-3 px-4 text-white">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Server State</td>
              <td className="py-3 px-4">React Query</td>
              <td className="py-3 px-4">API data, caching, mutations</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">UI State</td>
              <td className="py-3 px-4">useState</td>
              <td className="py-3 px-4">Forms, modals, toggles</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Real-time</td>
              <td className="py-3 px-4">Base44 Subscriptions</td>
              <td className="py-3 px-4">Live updates, chat</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Security Architecture</h3>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">Authentication</h4>
            <p className="text-sm">Base44 JWT tokens, automatic session management</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">Authorization</h4>
            <p className="text-sm">Row-level security via created_by field, role-based access</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">Data Isolation</h4>
            <p className="text-sm">Users can only access their own records automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function APISection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">API Reference</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Backend Functions</h3>
        
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">generatePersonalizedCoaching</h4>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">AI</span>
            </div>
            
            <p className="mb-4">Generates personalized coaching insights based on user data.</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#4DD0E1] mb-2">Request:</p>
                <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-green-400">{`await base44.functions.invoke('generatePersonalizedCoaching', {})`}</code>
                </pre>
              </div>
              
              <div>
                <p className="text-sm text-[#4DD0E1] mb-2">Response:</p>
                <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-yellow-400">{`{
  "success": true,
  "coaching": {
    "status_assessment": "string",
    "strengths": ["string"],
    "growth_opportunities": ["string"],
    "action_plan": ["string"],
    "motivation": "string"
  },
  "analytics": { ... }
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">awardPoints</h4>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Gamification</span>
            </div>
            
            <p className="mb-4">Awards points and manages leveling system.</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#4DD0E1] mb-2">Request:</p>
                <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-green-400">{`await base44.functions.invoke('awardPoints', {
  action: 'habit_complete'
})`}</code>
                </pre>
              </div>
              
              <div>
                <p className="text-sm text-[#4DD0E1] mb-2">Actions:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                  <li>daily_login, habit_complete, journal_write</li>
                  <li>mindfulness_complete, goal_achieve, streak_milestone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Entity Operations</h3>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Operation</th>
              <th className="text-left py-3 px-4 text-white">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">List</td>
              <td className="py-3 px-4 font-mono text-xs">base44.entities.Habit.list()</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Filter</td>
              <td className="py-3 px-4 font-mono text-xs">filter({`{is_active: true}`})</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Create</td>
              <td className="py-3 px-4 font-mono text-xs">create({`{name: "Exercise"}`})</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Update</td>
              <td className="py-3 px-4 font-mono text-xs">update(id, data)</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Delete</td>
              <td className="py-3 px-4 font-mono text-xs">delete(id)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Error Handling</h3>
        <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm">
<code className="text-white">{`try {
  const response = await base44.functions.invoke('functionName', params);
  
  if (response.data.success) {
    // Handle success
  } else {
    console.error(response.data.error);
  }
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Show premium upgrade
  }
}`}</code>
        </pre>
      </div>
    </div>
  );
}

function DeploymentSection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">Deployment Guide</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Production Deployment</h3>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">1. Pre-deployment Checklist</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Run all initialization functions</li>
              <li>Test authentication flows</li>
              <li>Verify API endpoints</li>
              <li>Check mobile responsiveness</li>
              <li>Test premium features</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">2. Deploy via Base44</h4>
            <p className="text-sm mb-2">Automatic deployment on git push:</p>
            <pre className="bg-black/60 p-3 rounded-lg text-sm">
<code className="text-green-400">git push origin main</code>
            </pre>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">3. Verify Deployment</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Check Base44 dashboard for build status</li>
              <li>Test production URL</li>
              <li>Monitor error logs</li>
              <li>Verify database migrations</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Environment Configuration</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Variable</th>
              <th className="text-left py-3 px-4 text-white">Purpose</th>
              <th className="text-left py-3 px-4 text-white">Required</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">BASE44_APP_ID</td>
              <td className="py-3 px-4">App identifier</td>
              <td className="py-3 px-4">✅ Auto</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">STRIPE_API_KEY</td>
              <td className="py-3 px-4">Payment processing</td>
              <td className="py-3 px-4">Premium only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Monitoring</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">Metrics</h4>
            <ul className="text-sm space-y-1">
              <li>→ Active users</li>
              <li>→ Function invocations</li>
              <li>→ Error rates</li>
              <li>→ Response times</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">Alerts</h4>
            <ul className="text-sm space-y-1">
              <li>→ Error spikes</li>
              <li>→ Slow queries</li>
              <li>→ Failed deployments</li>
              <li>→ High usage</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Rollback Procedure</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Access Base44 dashboard</li>
          <li>Navigate to Deployments</li>
          <li>Select previous stable version</li>
          <li>Click "Rollback"</li>
          <li>Verify restoration</li>
        </ol>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-8 text-white/80">
      <h2 className="text-3xl font-bold text-white">Security & Compliance</h2>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Authentication Flow</h3>
        <div className="space-y-3">
          {[
            { step: 'User submits credentials', detail: 'Email/password or OAuth' },
            { step: 'Base44 validates', detail: 'Checks against user database' },
            { step: 'JWT token issued', detail: 'Secure token with expiration' },
            { step: 'Token stored', detail: 'Secure client-side storage' },
            { step: 'Requests authenticated', detail: 'Token in Authorization header' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#4DD0E1]/20 text-[#4DD0E1] flex items-center justify-center font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <p className="font-bold text-white">{item.step}</p>
                <p className="text-sm text-[#B0B8D4]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Data Security</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">✅ Best Practices</h4>
            <ul className="text-sm space-y-2">
              <li>→ HTTPS everywhere</li>
              <li>→ JWT token expiration</li>
              <li>→ Row-level security</li>
              <li>→ Input validation</li>
              <li>→ XSS protection</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">🔒 Data Protection</h4>
            <ul className="text-sm space-y-2">
              <li>→ Encrypted at rest</li>
              <li>→ Encrypted in transit</li>
              <li>→ Regular backups</li>
              <li>→ Access logging</li>
              <li>→ GDPR compliant</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">OWASP Top 10 Mitigation</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white">Threat</th>
              <th className="text-left py-3 px-4 text-white">Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Injection</td>
              <td className="py-3 px-4">Parameterized queries, input validation</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">Auth Bypass</td>
              <td className="py-3 px-4">Base44 managed auth, JWT tokens</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">XSS</td>
              <td className="py-3 px-4">React auto-escaping, CSP headers</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-[#4DD0E1]">CSRF</td>
              <td className="py-3 px-4">SameSite cookies, token validation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Secrets Management</h3>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 font-semibold mb-2">⚠️ Important</p>
          <ul className="text-sm space-y-1">
            <li>→ Never commit secrets to git</li>
            <li>→ Use Base44 environment variables</li>
            <li>→ Rotate keys regularly</li>
            <li>→ Limit scope of API keys</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Compliance</h3>
        <p className="mb-4">LifeSync follows data privacy regulations:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong className="text-white">GDPR</strong>: Right to access, delete, and export data</li>
          <li><strong className="text-white">CCPA</strong>: California privacy compliance</li>
          <li><strong className="text-white">Data Retention</strong>: Configurable retention policies</li>
          <li><strong className="text-white">Consent</strong>: Clear user consent for data collection</li>
        </ul>
      </div>
    </div>
  );
}
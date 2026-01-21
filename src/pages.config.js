import Accountability from './pages/Accountability';
import Achievements from './pages/Achievements';
import Coach from './pages/Coach';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import JournalAnalysis from './pages/JournalAnalysis';
import Mindfulness from './pages/Mindfulness';
import Onboarding from './pages/Onboarding';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Gamification from './pages/Gamification';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Accountability": Accountability,
    "Achievements": Achievements,
    "Coach": Coach,
    "Dashboard": Dashboard,
    "Goals": Goals,
    "Habits": Habits,
    "Journal": Journal,
    "JournalAnalysis": JournalAnalysis,
    "Mindfulness": Mindfulness,
    "Onboarding": Onboarding,
    "Progress": Progress,
    "Settings": Settings,
    "Gamification": Gamification,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
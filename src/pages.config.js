import Achievements from './pages/Achievements';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Onboarding from './pages/Onboarding';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import JournalAnalysis from './pages/JournalAnalysis';
import Accountability from './pages/Accountability';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "Dashboard": Dashboard,
    "Goals": Goals,
    "Habits": Habits,
    "Journal": Journal,
    "Onboarding": Onboarding,
    "Progress": Progress,
    "Settings": Settings,
    "JournalAnalysis": JournalAnalysis,
    "Accountability": Accountability,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
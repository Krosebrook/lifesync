import Accountability from './pages/Accountability';
import Achievements from './pages/Achievements';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import JournalAnalysis from './pages/JournalAnalysis';
import Onboarding from './pages/Onboarding';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Coach from './pages/Coach';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Accountability": Accountability,
    "Achievements": Achievements,
    "Dashboard": Dashboard,
    "Goals": Goals,
    "Habits": Habits,
    "Journal": Journal,
    "JournalAnalysis": JournalAnalysis,
    "Onboarding": Onboarding,
    "Progress": Progress,
    "Settings": Settings,
    "Coach": Coach,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
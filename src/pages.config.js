import Accountability from './pages/Accountability';
import Achievements from './pages/Achievements';
import Coach from './pages/Coach';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import JournalAnalysis from './pages/JournalAnalysis';
import Onboarding from './pages/Onboarding';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
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
    "Onboarding": Onboarding,
    "Progress": Progress,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
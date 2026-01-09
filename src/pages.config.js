import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Onboarding from './pages/Onboarding';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Habits": Habits,
    "Journal": Journal,
    "Onboarding": Onboarding,
    "Progress": Progress,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
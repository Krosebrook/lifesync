import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Onboarding": Onboarding,
    "Dashboard": Dashboard,
    "Habits": Habits,
    "Journal": Journal,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
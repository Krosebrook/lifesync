import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Onboarding": Onboarding,
    "Dashboard": Dashboard,
    "Habits": Habits,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};
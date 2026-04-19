import React, { useCallback, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import SuggestPage from './pages/SuggestPage';
import FamilyPage from './pages/FamilyPage';
import HistoryPage from './pages/HistoryPage';
import CalendarPage from './pages/CalendarPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import { getCart } from './api';
import { getCartItemCount } from './utils/cart';

export type Page =
  | 'dashboard'
  | 'shop'
  | 'cart'
  | 'suggest'
  | 'family'
  | 'history'
  | 'calendar'
  | 'meals'
  | 'profile';
export type Screen = 'landing' | 'auth' | 'app';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [page, setPage] = useState<Page>('dashboard');
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('sgc-theme') as 'dark' | 'light') || 'dark',
  );

  /**
   * Reloads the cart badge count shown in the sidebar and shop screen.
   */
  const refreshCartCount = useCallback(async () => {
    try {
      const { data } = await getCart();
      setCartCount(getCartItemCount(data.cart?.items));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sgc-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      refreshCartCount();
    } else {
      setCartCount(0);
    }
  }, [user, refreshCartCount]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: 'var(--t3)',
          fontFamily: 'var(--ff)',
          fontSize: '0.85rem',
        }}
      >
        Loading SmartGroCart...
      </div>
    );
  }

  if (user && screen !== 'app') {
    setScreen('app');
  }

  /**
   * Routes the landing screen buttons into the correct auth mode.
   */
  const goToAuthScreen = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setScreen('auth');
  };

  if (screen === 'landing') {
    return (
      <LandingPage
        onLogin={() => goToAuthScreen('login')}
        onRegister={() => goToAuthScreen('register')}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      />
    );
  }

  if (screen === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onBack={() => setScreen('landing')}
        onSuccess={() => setScreen('app')}
      />
    );
  }

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setPage} />,
    shop: <ShopPage onNavigate={setPage} cartCount={cartCount} onCartChange={refreshCartCount} />,
    cart: <CartPage onCartChange={refreshCartCount} onNavigate={setPage} />,
    suggest: <SuggestPage onCartChange={refreshCartCount} />,
    family: <FamilyPage />,
    history: <HistoryPage />,
    calendar: <CalendarPage />,
    meals: <MealPlannerPage onCartChange={refreshCartCount} />,
    profile: <ProfilePage />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        page={page}
        onNavigate={setPage}
        cartCount={cartCount}
        onLogout={() => setScreen('landing')}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      />
      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'var(--bg)' }}>
        {pages[page]}
      </main>
    </div>
  );
};

/**
 * Wraps the application in the auth provider used across the frontend.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

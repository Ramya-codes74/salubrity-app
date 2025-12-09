import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'myapp_auth_v1'; // change name if needed

const AppContext = createContext();

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // user: either null or { name, role, email, token? }
  const [user, setUser] = useState(null);

  // indicates we've attempted to restore auth from storage
  const [authLoaded, setAuthLoaded] = useState(false);

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // basic validation: must have at least a name or token
        if (parsed && (parsed.name || parsed.token)) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to restore auth from storage', err);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  // login: accept user object and optional { remember } flag
  // store minimal info needed (avoid storing passwords)
  const login = (payload, { remember = true } = {}) => {
    // Example payload: { name, role, email, token }
    setUser(payload);
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Failed to persist auth', err);
      }
    }
    // push to dashboard after login
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to remove auth from storage', err);
    }
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({
    user,
    login,
    logout,
    theme,
    toggleTheme,
    language,
    setLanguage,
    sidebarOpen,
    setSidebarOpen,
    authLoaded, // expose for route guards
  }), [user, theme, language, sidebarOpen, authLoaded]);

  return (
    <AppContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

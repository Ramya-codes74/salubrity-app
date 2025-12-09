import React, { useState } from 'react';
import { Menu, X, Bell, Globe, Moon, Sun, ChevronDown, UserCog } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TopBar = () => {
  const { user, logout, theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {['English', 'Spanish', 'French'].map(lang => (
                  <button key={lang} onClick={() => { setLanguage(lang); setShowLangMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">{lang}</button>
                ))}
              </div>
            )}
          </div>

          {/* <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-400" />}
          </button> */}

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <UserCog className="w-4 h-4" /> My Account
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

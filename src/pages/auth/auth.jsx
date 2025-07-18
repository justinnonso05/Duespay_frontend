import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import LoginForm from './login';
import SignupForm from './signup';
import PasswordReset from './passwordReset';
import { useTheme } from '../../appComponents/ThemeContext';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'reset'
  const { theme, toggleTheme } = useTheme();

  const toggleForm = () => {
    setCurrentView(currentView === 'login' ? 'signup' : 'login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onToggle={toggleForm}
            onForgotPassword={() => setCurrentView('reset')}
          />
        );
      case 'signup':
        return (
          <SignupForm 
            onToggle={toggleForm}
          />
        );
      case 'reset':
        return (
          <PasswordReset 
            onBack={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <LoginForm 
            onToggle={toggleForm}
            onForgotPassword={() => setCurrentView('reset')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      {/* <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white p-2 rounded-full shadow hover:bg-gray-300 dark:hover:bg-slate-700 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button> */}

      {/* Side Image - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-indigo-200 dark:from-purple-600 dark:via-purple-700 dark:to-indigo-800 transition-colors duration-300">
          {/* Topographic pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="topo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M10,2 C15,8 18,12 10,18 C2,12 5,8 10,2 Z"
                  fill="none"
                  strokeWidth="0.5"
                  className="stroke-purple-400/40 dark:stroke-purple-300/20"
                />
                <circle 
                  cx="10" 
                  cy="10" 
                  r="1" 
                  className="fill-purple-400/25 dark:fill-purple-300/15"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" />
          </svg>
          {/* Floating elements for visual interest */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 dark:bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center text-gray-800 dark:text-white space-y-6">
              <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/40 dark:border-white/20 transition-colors duration-300">
                <img
                  src="/Duespay_logo.png"
                  alt="DuesPay Logo"
                  className="h-16 w-16 mx-auto mb-4 rounded-xl bg-transparent object-cover"
                />
                <h1 className="text-3xl font-bold mb-2">DuesPay</h1>
                <p className="text-lg text-gray-700 dark:text-white/80">Streamline your university payment collections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
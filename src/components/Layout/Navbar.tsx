import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sun, Moon, Menu, X, ChevronDown, User, LogOut,
  Map, LayoutDashboard, History, MessageCircle, Settings,
  Shield, Plane
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LANGUAGES } from '../../i18n';
import i18n from '../../i18n';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, theme, toggleTheme, logout, language, setLanguage } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: <Plane size={16} /> },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard size={16} /> },
      { to: '/trips', label: t('nav.trips'), icon: <History size={16} /> },
      { to: '/chat', label: t('nav.chat'), icon: <MessageCircle size={16} /> },
      ...(user?.email?.includes('admin') ? [{ to: '/admin', label: t('nav.admin'), icon: <Shield size={16} /> }] : []),
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-900/95 border-slate-700' 
        : 'bg-white/95 border-gray-200'
    } backdrop-blur-lg border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-500 via-emerald-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-teal-500/40 transition-all">
              <Map size={18} className="text-white" />
            </div>
            <div>
              <span className={`font-bold text-lg font-display gradient-text hidden sm:block`}>
                Smart Travel AI
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} hidden sm:block -mt-1`}>
                Powered by Gemini
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe size={16} />
                <span className="hidden sm:block">{currentLang.flag} {currentLang.nativeName}</span>
                <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                    style={{ maxHeight: '320px', overflowY: 'auto' }}
                  >
                    <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400 bg-slate-900' : 'text-gray-500 bg-gray-50'
                    }`}>
                      🇮🇳 Indian Languages
                    </div>
                    {LANGUAGES.filter(l => ['hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn'].includes(l.code)).map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className="ml-auto text-xs text-gray-400">{lang.name}</span>
                      </button>
                    ))}
                    <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400 bg-slate-900' : 'text-gray-500 bg-gray-50'
                    }`}>
                      🌍 International
                    </div>
                    {LANGUAGES.filter(l => !['hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn'].includes(l.code)).map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span className="ml-auto text-xs text-gray-400">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'text-yellow-400 hover:bg-slate-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl transition-all hover:opacity-80"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className={`hidden sm:block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} ${profileOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`p-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: <User size={15} />, label: t('nav.profile') },
                        { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: t('nav.dashboard') },
                        { to: '/trips', icon: <History size={15} />, label: t('nav.trips') },
                        { to: '/chat', icon: <MessageCircle size={15} />, label: t('nav.chat') },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                            theme === 'dark'
                              ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-teal-500/30"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-indigo-100 text-indigo-700'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-lg border text-sm font-medium text-gray-600">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

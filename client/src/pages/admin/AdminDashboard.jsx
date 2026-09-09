import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, BarChart3, 
  Settings, LogOut, Bell, Menu, X, Globe, Moon, Sun 
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

import AdminOverview from './AdminOverview';
import AdminRequests from './AdminRequests';
import AdminRequestDetail from './AdminRequestDetail';
import AdminClients from './AdminClients';
import AdminStatistics from './AdminStatistics';
import AdminSettings from './AdminSettings';
import AdminNotifications from './AdminNotifications';

import { dashboardService } from '../../services/dashboardService';

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const { t, isRTL, toggleLanguage } = useLanguage();
  const { isLight, toggleTheme } = useTheme();
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await dashboardService.getNotifications();
          setNotifications(res.data || []);
        } catch (error) {
          console.error("Failed to load notifications", error);
        }
      };
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await dashboardService.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setNotificationsOpen(false);
    } catch (error) {
      console.error("Failed to mark notification read", error);
    }
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: t.admin?.nav?.dashboard || 'Dashboard', exact: true },
    { path: '/admin/requests', icon: <FileText size={20} />, label: t.admin?.nav?.requests || 'Requests' },
    { path: '/admin/clients', icon: <Users size={20} />, label: t.admin?.nav?.clients || 'Clients' },
    { path: '/admin/statistics', icon: <BarChart3 size={20} />, label: t.admin?.nav?.statistics || 'Statistics' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: t.admin?.nav?.settings || 'Settings' },
  ];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#040711]"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return null;

  return (
    <div className={`min-h-screen flex ${isLight ? 'bg-slate-50' : 'bg-[#040711]'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-[260px] fixed inset-y-0 z-40 border-r ${
        isRTL ? 'right-0 border-l border-r-0' : 'left-0 border-r'
      } ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0a0f1c] border-slate-800'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-display font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.admin?.title || 'Admin Panel'}
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? (isLight ? 'bg-blue-50 text-blue-600' : 'bg-cyan-900/30 text-cyan-400') 
                    : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800/50')
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50 mt-auto">
          <button
            onClick={() => logout()}
            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'
            }`}
          >
            <LogOut size={20} />
            <span className="font-medium">{t.admin?.nav?.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 w-[260px] z-50 flex flex-col shadow-2xl ${
                isRTL ? 'right-0' : 'left-0'
              } ${isLight ? 'bg-white' : 'bg-[#0a0f1c]'}`}
            >
              <div className="p-6 flex items-center justify-between">
                <h2 className={`text-xl font-display font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t.admin?.title || 'Admin Panel'}
                </h2>
                <button onClick={() => setMobileMenuOpen(false)} className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive 
                          ? (isLight ? 'bg-blue-50 text-blue-600' : 'bg-cyan-900/30 text-cyan-400') 
                          : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800/50')
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800/50 mt-auto">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'
                  }`}
                >
                  <LogOut size={20} />
                  <span className="font-medium">{t.admin?.nav?.logout || 'Logout'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen ${isRTL ? 'md:mr-[260px]' : 'md:ml-[260px]'}`}>
        {/* Topbar */}
        <header className={`h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl border-b ${
          isLight ? 'bg-white/80 border-slate-200' : 'bg-[#040711]/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Menu size={24} />
            </button>
            <h1 className={`text-lg font-display font-semibold hidden sm:block ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {navItems.find(item => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleLanguage} className={`p-2 rounded-lg transition-colors ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Globe size={20} />
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'}`}>
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-lg transition-colors relative ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </button>
              {notificationsOpen && (
                <AdminNotifications 
                  notifications={notifications} 
                  onMarkRead={handleMarkRead} 
                />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<AdminRequestDetail />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

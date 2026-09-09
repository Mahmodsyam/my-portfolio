import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CircleDot, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminNotifications({ notifications = [], onMarkRead }) {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  const handleNotificationClick = (notification) => {
    onMarkRead(notification.id);
    navigate(`/admin/requests/${notification.requestId || notification.id}`);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`absolute top-full mt-2 w-80 rounded-xl border backdrop-blur-xl shadow-2xl overflow-hidden z-50 ${
      isRTL ? 'left-0' : 'right-0'
    } ${
      isLight 
        ? 'bg-white/95 border-slate-200' 
        : 'bg-slate-900/95 border-slate-700/50'
    }`}>
      <div className={`p-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-700/50'}`}>
        <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          {t.admin?.notifications?.title || 'Notifications'}
        </h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className={`p-6 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.admin?.notifications?.empty || 'No new notifications'}
          </div>
        ) : (
          <div className="divide-y divide-slate-700/20">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full text-left p-4 hover:bg-slate-500/5 transition-colors flex gap-3 ${
                  !notif.read ? (isLight ? 'bg-blue-50/50' : 'bg-cyan-900/10') : ''
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="mt-1">
                  <div className={`p-2 rounded-full ${
                    isLight ? 'bg-blue-100 text-blue-600' : 'bg-cyan-900/30 text-cyan-400'
                  }`}>
                    <FileText size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {notif.clientName}
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.admin?.typeLabels?.[notif.projectType] || notif.projectType}
                  </p>
                  <div className={`flex items-center gap-1 mt-2 text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Clock size={12} />
                    <span>{formatTime(notif.createdAt)}</span>
                  </div>
                </div>
                {!notif.read && (
                  <div className="flex items-center justify-center">
                    <CircleDot size={10} className={isLight ? "text-blue-500 fill-blue-500" : "text-cyan-500 fill-cyan-500"} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { dashboardService } from '../../services/dashboardService';
import { requestsService } from '../../services/requestsService';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0, new: 0, reviewing: 0, in_progress: 0, completed: 0, rejected: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, reqsRes] = await Promise.all([
          dashboardService.getStats(),
          requestsService.getAll({ limit: 5 })
        ]);
        setStats(statsRes.data || {});
        setRecentRequests(reqsRes.data?.requests || []);
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { key: 'total', label: t.admin?.stats?.total || 'Total Requests', value: stats.total || 0, icon: <FileText size={24} />, color: isLight ? 'text-slate-600 bg-slate-100' : 'text-slate-300 bg-slate-800' },
    { key: 'new', label: t.admin?.stats?.new || 'New', value: stats.new || 0, icon: <PlusCircle size={24} />, color: isLight ? 'text-cyan-600 bg-cyan-100' : 'text-cyan-400 bg-cyan-900/30' },
    { key: 'reviewing', label: t.admin?.stats?.reviewing || 'Reviewing', value: stats.reviewing || 0, icon: <Clock size={24} />, color: isLight ? 'text-amber-600 bg-amber-100' : 'text-amber-400 bg-amber-900/30' },
    { key: 'in_progress', label: t.admin?.stats?.inProgress || 'In Progress', value: stats.in_progress || 0, icon: <Briefcase size={24} />, color: isLight ? 'text-blue-600 bg-blue-100' : 'text-blue-400 bg-blue-900/30' },
    { key: 'completed', label: t.admin?.stats?.completed || 'Completed', value: stats.completed || 0, icon: <CheckCircle size={24} />, color: isLight ? 'text-green-600 bg-green-100' : 'text-green-400 bg-green-900/30' },
    { key: 'rejected', label: t.admin?.stats?.rejected || 'Rejected', value: stats.rejected || 0, icon: <XCircle size={24} />, color: isLight ? 'text-red-600 bg-red-100' : 'text-red-400 bg-red-900/30' },
  ];

  const statusColors = {
    new: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    reviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    archived: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  };

  const getStatusClass = (status) => {
    const base = statusColors[status] || statusColors.new;
    return isLight ? base.split(' dark:')[0] : base.split(' dark:')[1];
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl ${
              isLight 
                ? 'bg-white/90 border-slate-200 shadow-sm' 
                : 'bg-slate-900/80 border-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </p>
                <div className="mt-1 flex items-baseline">
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                  ) : (
                    <Counter value={stat.value} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
          isLight 
            ? 'bg-white/90 border-slate-200 shadow-sm' 
            : 'bg-slate-900/80 border-slate-700/50'
        }`}
      >
        <div className={`p-6 border-b flex justify-between items-center ${isLight ? 'border-slate-200' : 'border-slate-700/50'}`}>
          <h2 className={`text-lg font-display font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {t.admin?.recentRequests || 'Recent Requests'}
          </h2>
          <button 
            onClick={() => navigate('/admin/requests')}
            className={`text-sm font-medium hover:underline ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}
          >
            {t.admin?.viewAll || 'View All'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-800/50 text-slate-400'}>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.client || 'Client'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.type || 'Type'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.status || 'Status'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.date || 'Date'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="px-6 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    {t.admin?.noRequests || 'No recent requests found'}
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr 
                    key={req.id || req._id} 
                    onClick={() => navigate(`/admin/requests/${req.id || req._id}`)}
                    className={`cursor-pointer transition-colors ${
                      isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/30 text-slate-300'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-mono">{String(req.reference_number || req.referenceNumber || req.id || req._id).slice(-8)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{req.clientName || req.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{t.admin?.typeLabels?.[req.projectType || req.project_type] || req.projectType || req.project_type || 'General'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClass(req.status)}`}>
                        {t.admin?.statusLabels?.[req.status] || req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(req.createdAt || req.created_at || Date.now()).toLocaleDateString(isRTL ? 'ar' : 'en-US')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// Simple animated counter component
function Counter({ value }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span className="text-3xl font-display font-bold text-inherit">{count || value}</span>;
}

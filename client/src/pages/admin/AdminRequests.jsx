import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { requestsService } from '../../services/requestsService';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestsService.getAll(filters);
      setRequests(res.data?.requests || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error("Failed to load requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await requestsService.delete(deleteConfirm);
      setDeleteConfirm(null);
      fetchRequests();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const totalPages = Math.ceil(total / filters.limit) || 1;

  const statusColors = {
    new: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    reviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    archived: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const getBadgeClass = (value, colorsObj) => {
    const base = colorsObj[value] || colorsObj.new || colorsObj.normal;
    return isLight ? base.split(' dark:')[0] : base.split(' dark:')[1];
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 md:p-6 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/80 border-slate-700/50'
      }`}>
        <div className="relative w-full md:w-96">
          <Search size={18} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder={t.admin?.search || 'Search by name, email, ID...'}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={`w-full py-2.5 rounded-xl outline-none transition-all ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } ${
              isLight 
                ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' 
                : 'bg-slate-800/50 border-slate-700/50 focus:border-cyan-500 text-slate-100'
            } border`}
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors md:hidden ${
            isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <Filter size={18} />
          {t.admin?.filters || 'Filters'}
        </button>

        <div className={`w-full md:w-auto flex flex-col md:flex-row gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`py-2.5 px-4 rounded-xl outline-none border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <option value="">{t.admin?.allStatuses || 'All Statuses'}</option>
            {Object.keys(statusColors).map(s => (
              <option key={s} value={s}>{t.admin?.statusLabels?.[s] || s}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className={`py-2.5 px-4 rounded-xl outline-none border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <option value="">{t.admin?.allTypes || 'All Types'}</option>
            <option value="website">Website</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="branding">Branding</option>
          </select>
        </div>
      </div>

      <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
        isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-700/50'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-800/50 text-slate-400'}>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.client || 'Client'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.type || 'Type'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.status || 'Status'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.priority || 'Priority'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">{t.admin?.table?.date || 'Date'}</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">{t.admin?.table?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className={`text-lg ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.admin?.noRequests || 'No requests found'}
                    </p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id || req._id} className={`transition-colors ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/30 text-slate-300'}`}>
                    <td className="px-6 py-4 text-sm font-mono">{String(req.id || req._id).slice(-6)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{req.clientName}</td>
                    <td className="px-6 py-4 text-sm">{t.admin?.typeLabels?.[req.projectType] || req.projectType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getBadgeClass(req.status, statusColors)}`}>
                        {t.admin?.statusLabels?.[req.status] || req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getBadgeClass(req.priority, priorityColors)}`}>
                        {t.admin?.priorityLabels?.[req.priority] || req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/requests/${req.id || req._id}`)}
                        className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-blue-50 text-blue-600' : 'hover:bg-cyan-900/30 text-cyan-400'}`}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(req.id || req._id)}
                        className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/30 text-red-400'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className={`p-4 border-t flex items-center justify-between ${isLight ? 'border-slate-200 bg-white/50' : 'border-slate-700/50 bg-slate-900/50'}`}>
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Page {filters.page} of {totalPages} (Total: {total})
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
              className={`p-2 rounded-lg border ${isLight ? 'border-slate-200 text-slate-600 disabled:text-slate-300' : 'border-slate-700 text-slate-300 disabled:text-slate-600'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => handleFilterChange('page', Math.min(totalPages, filters.page + 1))}
              disabled={filters.page === totalPages || total === 0}
              className={`p-2 rounded-lg border ${isLight ? 'border-slate-200 text-slate-600 disabled:text-slate-300' : 'border-slate-700 text-slate-300 disabled:text-slate-600'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}
            >
              <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Confirm Deletion</h3>
              <p className={`mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Are you sure you want to delete this request? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-xl border ${isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-700 hover:bg-slate-800'} text-slate-500`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

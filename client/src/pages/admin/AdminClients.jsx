import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { dashboardService } from '../../services/dashboardService';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });

  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getClients(filters);
      setClients(res.data?.clients || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error("Failed to load clients", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / filters.limit) || 1;

  return (
    <div className="space-y-6">
      <div className={`p-4 md:p-6 rounded-2xl border backdrop-blur-xl ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/80 border-slate-700/50'
      }`}>
        <div className="relative w-full md:w-96">
          <Search size={18} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search clients..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className={`w-full py-2.5 rounded-xl outline-none transition-all ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } ${
              isLight 
                ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' 
                : 'bg-slate-800/50 border-slate-700/50 focus:border-cyan-500 text-slate-100'
            } border`}
          />
        </div>
      </div>

      <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
        isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-700/50'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-800/50 text-slate-400'}>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Requests</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Last Request</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="4" className="px-6 py-4">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No clients found</td>
                </tr>
              ) : (
                clients.map((client, i) => (
                  <tr 
                    key={i} 
                    onClick={() => navigate(`/admin/requests?search=${client.email}`)}
                    className={`cursor-pointer transition-colors ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/30 text-slate-300'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{client.name}</td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm"><Mail size={14} className={isLight ? 'text-slate-400' : 'text-slate-500'} /> {client.email}</div>
                      {client.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className={isLight ? 'text-slate-400' : 'text-slate-500'} /> {client.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full bg-opacity-20 ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-cyan-900 text-cyan-400'}`}>{client.requestCount}</span></td>
                    <td className="px-6 py-4 text-sm">{client.lastRequestDate ? new Date(client.lastRequestDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className={`p-4 border-t flex items-center justify-between ${isLight ? 'border-slate-200 bg-white/50' : 'border-slate-700/50 bg-slate-900/50'}`}>
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Page {filters.page} of {totalPages} (Total: {total})</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page === 1}
              className={`p-2 rounded-lg border ${isLight ? 'border-slate-200 text-slate-600 disabled:text-slate-300' : 'border-slate-700 text-slate-300 disabled:text-slate-600'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
              disabled={filters.page === totalPages || total === 0}
              className={`p-2 rounded-lg border ${isLight ? 'border-slate-200 text-slate-600 disabled:text-slate-300' : 'border-slate-700 text-slate-300 disabled:text-slate-600'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

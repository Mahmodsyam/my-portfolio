import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { dashboardService } from '../../services/dashboardService';

export default function AdminStatistics() {
  const [data, setData] = useState({
    requestsOverTime: [],
    byType: [],
    byStatus: [],
    byBudget: []
  });
  const [loading, setLoading] = useState(true);

  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await dashboardService.getCharts();
        setData(res.data || { requestsOverTime: [], byType: [], byStatus: [], byBudget: [] });
      } catch (error) {
        console.error("Failed to load charts", error);
        // Fallback mock data
        setData({
          requestsOverTime: [{ name: 'Jan', count: 4 }, { name: 'Feb', count: 7 }, { name: 'Mar', count: 5 }],
          byType: [{ name: 'Website', value: 400 }, { name: 'E-Commerce', value: 300 }],
          byStatus: [{ name: 'New', count: 10 }, { name: 'Completed', count: 20 }],
          byBudget: [{ name: 'Under $100', count: 5 }, { name: '$100-$500', count: 15 }]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, []);

  const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const cardClass = `p-6 rounded-2xl border backdrop-blur-xl ${
    isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-700/50'
  }`;

  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? '#e2e8f0' : '#1e293b';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
        <h3 className={`text-lg font-display font-semibold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Requests Over Time</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <LineChart data={data.requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
        <h3 className={`text-lg font-display font-semibold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Requests by Type</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.byType} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClass}>
        <h3 className={`text-lg font-display font-semibold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Requests by Status</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={data.byStatus} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" stroke={textColor} fontSize={12} />
              <YAxis dataKey="name" type="category" stroke={textColor} fontSize={12} width={80} />
              <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {data.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardClass}>
        <h3 className={`text-lg font-display font-semibold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Requests by Budget Range</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={data.byBudget}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

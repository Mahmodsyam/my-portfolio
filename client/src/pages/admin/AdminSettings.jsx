import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Moon, Sun, Save, Bell, Settings2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const { isLight, toggleTheme } = useTheme();
  const { admin } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert('Settings saved successfully');
  };

  const cardClass = `rounded-2xl border backdrop-blur-xl p-6 ${
    isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-700/50'
  }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
        <h3 className={`text-lg font-display font-semibold mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <User size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
          Admin Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Display Name</label>
            <input 
              type="text" 
              value={admin?.name || 'Administrator'} 
              readOnly
              className={`w-full p-3 rounded-xl border outline-none ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
              } cursor-not-allowed`}
            />
          </div>
          <div>
            <label className={`block text-sm mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Email Address</label>
            <div className="relative">
              <Mail size={18} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                type="email" 
                value={admin?.email || 'admin@example.com'} 
                readOnly
                className={`w-full py-3 rounded-xl border outline-none ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                } cursor-not-allowed`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
          <h3 className={`text-lg font-display font-semibold mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Bell size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
            Notification Settings
          </h3>
          <div>
            <label className={`block text-sm mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Receive new request notifications at</label>
            <input 
              type="email" 
              defaultValue="notifications@example.com"
              className={`w-full max-w-md p-3 rounded-xl border outline-none ${
                isLight ? 'bg-white border-slate-200 text-slate-900 focus:border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-100 focus:border-cyan-500'
              }`}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClass}>
          <h3 className={`text-lg font-display font-semibold mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Settings2 size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
            System Defaults
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Default Request Status</label>
              <select className={`w-full p-3 rounded-xl border outline-none ${
                isLight ? 'bg-white border-slate-200 text-slate-900 focus:border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-100 focus:border-cyan-500'
              }`}>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Max File Size (MB)</label>
              <input 
                type="number" 
                defaultValue="10"
                className={`w-full p-3 rounded-xl border outline-none ${
                  isLight ? 'bg-white border-slate-200 text-slate-900 focus:border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-100 focus:border-cyan-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardClass}>
          <h3 className={`text-lg font-display font-semibold mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Globe size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
            Preferences
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-colors ${
                isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              <Globe size={20} />
              <span className="font-medium">Language: {language === 'ar' ? 'العربية' : 'English'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-colors ${
                isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">Theme: {isLight ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-all hover:scale-105 ${
              isLight ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25' : 'bg-cyan-600 hover:bg-cyan-700 hover:shadow-cyan-500/25'
            }`}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

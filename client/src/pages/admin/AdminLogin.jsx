import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || t.admin?.login?.error || (isRTL ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isLight ? 'bg-slate-50' : 'bg-[#040711]'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border ${
          isLight 
            ? 'bg-white/90 border-slate-200 shadow-xl' 
            : 'bg-slate-900/80 border-slate-700/50 shadow-2xl shadow-cyan-900/20'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isLight ? 'bg-blue-100 text-blue-600' : 'bg-cyan-900/30 text-cyan-400'
          }`}>
            <Lock size={32} />
          </div>
          <h1 className={`text-2xl font-display font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {t.admin?.login?.title || 'Admin Portal'}
          </h1>
          <p className={`mt-2 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.admin?.login?.subtitle || 'Sign in to access the dashboard'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
              isLight ? 'bg-red-50 text-red-600' : 'bg-red-900/30 text-red-400 border border-red-900/50'
            }`}
          >
            <AlertCircle size={18} />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {t.admin?.login?.email || 'Email Address'}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-4' : 'left-4'} ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full py-3 rounded-xl outline-none transition-all ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                } ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900' 
                    : 'bg-slate-800/50 border-slate-700/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500'
                }`}
                placeholder="admin@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {t.admin?.login?.password || 'Password'}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-4' : 'left-4'} ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full py-3 rounded-xl outline-none transition-all ${
                  isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12'
                } ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900' 
                    : 'bg-slate-800/50 border-slate-700/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500'
                }`}
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 flex items-center ${isRTL ? 'left-4' : 'right-4'} ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-display font-bold text-white shadow-lg transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
            } ${
              isLight 
                ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:shadow-blue-500/25' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/25'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t.admin?.login?.loading || 'Signing in...'}
              </span>
            ) : (
              t.admin?.login?.submit || 'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

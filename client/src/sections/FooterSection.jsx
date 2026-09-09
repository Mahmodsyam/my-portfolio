import React from 'react';
import { ArrowUp, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const FooterSection = ({ onHoverSound, onClickSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const f = t.footer || {};

  const scrollToTop = () => {
    onClickSound?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`relative w-full py-12 px-4 sm:px-6 lg:px-12 border-t backdrop-blur-2xl transition-colors duration-300 z-10 ${
        isLight
          ? 'bg-white/90 border-slate-200 text-slate-900'
          : 'bg-slate-950/90 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Academic Info */}
        <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
          <div className="text-xl font-display font-black tracking-wider mb-1 flex items-center gap-2 justify-center md:justify-start">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-sky-500/40 bg-black flex items-center justify-center">
              <img src="/assets/logo.png" alt="MS Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <span>{f.name || 'MAHMOUD SIAM'}</span>
          </div>
          <div className={`text-xs font-sans font-semibold mb-1 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
            {f.title || (isRTL ? 'هندسة وتطوير مواقع وتطبيقات تفاعلية تصنع فارقاً حقيقياً لعلامتك' : 'Transforming Ideas into High-Impact Web Platforms')}
          </div>
          <div className={`text-[11px] font-sans ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {f.standing || (isRTL ? 'مهندس برمجيات متكامل • حلول رقمية وتجارب ويب استثنائية (2021 – 2026)' : 'Full-Stack Software Engineer • Modern Interactive Web Solutions (2021 – 2026)')}
          </div>
        </div>

        {/* Developer Credit & Technology Tag */}
        <div className="text-center space-y-3">
          {/* Prominent Developer Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-sans font-bold shadow-sm ${
              isLight
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{f.developer || (isRTL ? 'مطور الموقع: محمود صيام (mahmod syam)' : 'Website Developer: Mahmoud Siam (mahmod syam)')}</span>
          </div>

          {/* Quick System Links */}
          <div className="flex items-center justify-center gap-4 text-xs font-sans">
            <a
              href="/request-project"
              className={`font-semibold transition hover:underline ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}
            >
              {isRTL ? 'اطلب مشروعًا' : 'Request Project'}
            </a>
            <span className="opacity-30">•</span>
            <a
              href="/track-request"
              className={`font-semibold transition hover:underline ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {isRTL ? 'تتبع الطلب' : 'Track Request'}
            </a>
            <span className="opacity-30">•</span>
            <a
              href="/admin/login"
              className={`font-semibold transition hover:underline ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-500 hover:text-cyan-300'}`}
            >
              {isRTL ? 'لوحة الإدارة' : 'Admin Portal'}
            </a>
          </div>

          <div className="text-xs font-sans opacity-75">
            <div>{f.rights || 'All Rights Reserved © 2026 Mahmoud Siam.'}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{f.designedWith || 'Designed & Developed by Mahmoud Siam | Three.js & React'}</div>
          </div>
        </div>

        {/* Action: Back to Top */}
        <div>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => onHoverSound?.()}
            className={`flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full border text-xs font-sans font-semibold transition shadow-sm active:scale-95 ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
          >
            <span>{f.backToTop || 'Back to Top'}</span>
            <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
};

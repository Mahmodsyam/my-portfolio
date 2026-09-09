import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const Loader3D = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // When loading reaches 100%, automatically transition directly into the website
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 200);

      const finishTimer = setTimeout(() => {
        onLoaded?.();
      }, 650);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [progress, onLoaded]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      } ${
        isLight ? 'bg-[#f8fafc] text-slate-900 font-arabic' : 'bg-[#040711] text-white'
      }`}
    >
      {/* Background Subtle Grid */}
      <div
        className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 ${
          isLight
            ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]'
        }`}
      />

      {/* Center 3D Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        <div className="relative mb-6">
          <div
            className={`w-28 h-28 rounded-3xl border flex items-center justify-center p-3 shadow-2xl ${
              isLight
                ? 'bg-white border-slate-200 shadow-[0_0_50px_rgba(2,132,199,0.2)]'
                : 'bg-black/90 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.35)]'
            }`}
          >
            <img
              src="/assets/logo.png"
              alt="Mahmoud Siam Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className={`absolute -inset-2 rounded-3xl border animate-spin-slow pointer-events-none ${
              isLight ? 'border-sky-500/30' : 'border-cyan-500/30'
            }`}
          />
        </div>

        <h1 className={`text-2xl sm:text-3xl font-display font-black tracking-wider mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {t.hero.name || 'MAHMOUD SIAM'}
        </h1>

        <p className={`text-xs font-mono tracking-widest uppercase mb-8 ${isLight ? 'text-sky-600 font-semibold' : 'text-cyan-400'}`}>
          {t.hero.title || (isRTL ? 'تحويل الأفكار إلى واقع رقمي استثنائي وحلول ويب متكاملة' : 'Full-Stack Web Architect & Interactive Experience Developer')}
        </p>

        {/* Progress Bar */}
        <div
          className={`w-64 sm:w-80 h-2 rounded-full overflow-hidden border mb-4 ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-150 rounded-full ${
              isLight
                ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-[0_0_15px_#0284c7]'
                : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_15px_#38bdf8]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Indicator */}
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span className={`w-2 h-2 rounded-full ${progress < 100 ? 'animate-ping' : ''} ${isLight ? 'bg-sky-600' : 'bg-cyan-400'}`} />
          <span>{t.loader.initializing} {progress}%</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`absolute bottom-6 text-[11px] font-mono tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        {t.hero.badge}
      </div>
    </div>
  );
};

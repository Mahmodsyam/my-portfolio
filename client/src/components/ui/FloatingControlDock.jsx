import React, { useState, useRef, useEffect } from 'react';
import { Globe, Sun, Moon, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const FloatingControlDock = ({ onHoverSound, onClickSound }) => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const d = t.dock || {};

  return (
    <aside
      ref={menuRef}
      aria-label="Floating Controls"
      className={`fixed bottom-4 sm:bottom-6 ${
        isRTL ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
      } z-40 flex items-center gap-2 select-none`}
    >
      {/* Language Popup 3D Glass Menu */}
      {langMenuOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`absolute bottom-16 ${
            isRTL ? 'left-0' : 'right-0'
          } w-52 p-2 rounded-2xl border shadow-2xl backdrop-blur-2xl animate-fadeIn transition-all duration-300 ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.1)]'
              : 'bg-slate-950/95 border-cyan-500/40 text-slate-100 shadow-[0_10px_40px_rgba(6,182,212,0.25)]'
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase opacity-60 border-b border-inherit mb-1">
            {d.selectLanguage || 'Select Language'}
          </div>

          <button
            onClick={() => {
              onClickSound?.();
              setLanguage('en');
              setLangMenuOpen(false);
            }}
            onMouseEnter={() => onHoverSound?.()}
            className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              language === 'en'
                ? isLight
                  ? 'bg-sky-100 text-sky-900 font-bold'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : isLight
                ? 'hover:bg-slate-100 text-slate-700'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span>{d.english || 'English (EN)'}</span>
            </span>
            {language === 'en' && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              onClickSound?.();
              setLanguage('ar');
              setLangMenuOpen(false);
            }}
            onMouseEnter={() => onHoverSound?.()}
            className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              language === 'ar'
                ? isLight
                  ? 'bg-sky-100 text-sky-900 font-bold font-arabic'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 font-arabic'
                : isLight
                ? 'hover:bg-slate-100 text-slate-700 font-arabic'
                : 'hover:bg-slate-900 text-slate-300 font-arabic'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🇵🇸</span>
              <span>{d.arabic || 'العربية (AR)'}</span>
            </span>
            {language === 'ar' && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Floating 3D Control Capsule Dock */}
      <div
        className={`flex items-center gap-2 p-1.5 rounded-full border backdrop-blur-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 ${
          isLight
            ? 'bg-white/90 border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.08)]'
            : 'bg-slate-950/80 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
        }`}
      >
        {/* Dedicated 3D Circular Language Control Button */}
        <button
          onClick={() => {
            onClickSound?.();
            setLangMenuOpen((prev) => !prev);
          }}
          onMouseEnter={() => onHoverSound?.()}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 transform hover:rotate-12 active:scale-95 ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-sky-500 shadow-sm'
              : 'bg-slate-900/90 border-slate-700/80 text-cyan-400 hover:bg-slate-800 hover:border-cyan-400 shadow-md'
          }`}
          title={d.language || 'Language'}
          aria-label={d.language || 'Language'}
        >
          <Globe className="w-4 h-4" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-mono px-1 rounded-full font-bold bg-inherit border text-inherit">
            {language === 'ar' ? 'ع' : 'EN'}
          </span>
        </button>

        {/* Dedicated 3D Circular Theme Control Button */}
        <button
          onClick={() => {
            onClickSound?.();
            toggleTheme();
          }}
          onMouseEnter={() => onHoverSound?.()}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-500 transform hover:scale-110 active:scale-95 ${
            isLight
              ? 'bg-sky-50 border-sky-300 text-sky-600 hover:rotate-45 shadow-[0_0_15px_rgba(2,132,199,0.2)]'
              : 'bg-slate-900/90 border-cyan-500/50 text-cyan-300 hover:-rotate-45 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}
          title={isDark ? (d.lightMode || 'Light Mode') : (d.darkMode || 'Dark Mode')}
          aria-label={d.theme || 'Theme'}
        >
          {isLight ? (
            <Sun className="w-5 h-5 text-sky-600 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-300" />
          )}
        </button>
      </div>
    </aside>
  );
};

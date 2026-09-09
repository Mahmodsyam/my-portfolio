import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const Navigation3D = ({ activeSection = 'hero', onHoverSound, onClickSound }) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { toggleTheme, isLight } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = t.nav || [];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    onClickSound?.();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header Container */}
      <header
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[96vw] transition-all duration-300 ${
          scrolled ? 'scale-95' : 'scale-100'
        }`}
      >
        {/* Desktop Navigation Pill (Hidden on Mobile/Tablet < 768px) */}
        <nav
          className={`hidden md:flex items-center gap-1.5 lg:gap-2 px-3.5 py-2 rounded-full backdrop-blur-2xl border shadow-2xl transition-all duration-300 ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-900 shadow-[0_4px_25px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/75 border-cyan-500/30 text-slate-100 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
          }`}
        >
          {/* Brand Logo MS Image */}
          <a
            href="#hero"
            onClick={(e) => handleScrollTo(e, '#hero')}
            onMouseEnter={() => onHoverSound?.()}
            className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 shadow-lg transition transform hover:scale-110 shrink-0 bg-black"
            title={t.hero.name || "Mahmoud Siam"}
          >
            <img
              src="/assets/logo.png"
              alt="MS Logo"
              className="w-full h-full object-contain p-0.5"
            />
          </a>

          {/* Links Row */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  onMouseEnter={() => onHoverSound?.()}
                  className={`relative px-2.5 lg:px-3 py-1.5 text-xs font-sans font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isLight
                        ? 'text-sky-700 font-bold shadow-sm'
                        : 'text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <span
                      className={`absolute inset-0 rounded-full -z-10 animate-pulse ${
                        isLight
                          ? 'bg-sky-500/15 border border-sky-500/40'
                          : 'bg-cyan-500/20 border border-cyan-400/60'
                      }`}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}

            {/* Request a Project Highlight Button */}
            <a
              href="/request-project"
              onClick={() => onClickSound?.()}
              onMouseEnter={() => onHoverSound?.()}
              className={`ml-1 px-3 py-1.5 text-xs font-display font-bold rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                isLight
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.35)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>{isRTL ? 'اطلب مشروعًا' : 'Request a Project'}</span>
            </a>
          </div>
        </nav>

        {/* Mobile Navigation Header Bar (< 768px) */}
        <div
          className={`md:hidden flex items-center justify-between gap-3 px-4 py-2 rounded-full backdrop-blur-2xl border shadow-2xl transition-all duration-300 min-w-[280px] sm:min-w-[340px] ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
              : 'bg-slate-950/85 border-cyan-500/30 text-slate-100 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
          }`}
        >
          {/* Brand Logo MS Image */}
          <a
            href="#hero"
            onClick={(e) => handleScrollTo(e, '#hero')}
            className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 shadow-md bg-black"
          >
            <img
              src="/assets/logo.png"
              alt="MS Logo"
              className="w-full h-full object-contain p-0.5"
            />
          </a>

          {/* Active Section Label */}
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>
            {navItems.find((i) => i.href.replace('#', '') === activeSection)?.label || (t.hero.name || 'Mahmoud Siam')}
          </span>

          {/* 3D Circular Hamburger Trigger Button */}
          <button
            onClick={() => {
              onClickSound?.();
              setMobileMenuOpen((prev) => !prev);
            }}
            onMouseEnter={() => onHoverSound?.()}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition transform hover:scale-105 active:scale-95 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-900 border-slate-700 text-cyan-400'
            }`}
            aria-label={t.common.menu || 'Toggle Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Full-Screen Holographic 3D Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-between p-6 bg-black/95 backdrop-blur-3xl animate-fadeIn select-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-500/50 bg-black flex items-center justify-center">
                <img src="/assets/logo.png" alt="MS Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="font-display font-bold text-base text-white">
                {t.hero.name || 'Mahmoud Siam'}
              </span>
            </div>

            <button
              onClick={() => {
                onClickSound?.();
                setMobileMenuOpen(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Staggered Navigation Items List */}
          <div className="flex flex-col gap-2 my-auto py-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item, idx) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border text-base font-display font-bold transition-all transform active:scale-95 ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono opacity-50">0{idx + 1}</span>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 opacity-70 transform ${isRTL ? 'rotate-180' : ''}`} />
                </a>
              );
            })}

            {/* Mobile Dedicated Request Portal Links */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/request-project"
                onClick={() => onClickSound?.()}
                className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-display font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95"
              >
                <span>{isRTL ? '✨ اطلب مشروعًا جديدًا' : '✨ Request a New Project'}</span>
                <ArrowRight className={`w-4 h-4 transform ${isRTL ? 'rotate-180' : ''}`} />
              </a>

              <a
                href="/track-request"
                onClick={() => onClickSound?.()}
                className="flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-display font-bold active:scale-95"
              >
                <span>{isRTL ? '🔍 تتبع حالة طلبك' : '🔍 Track Your Request'}</span>
                <ArrowRight className={`w-3.5 h-3.5 transform ${isRTL ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>

          {/* Bottom Quick Controls (Language & Theme Toggles) */}
          <div
            className="pt-4 border-t border-white/10 flex items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Language Switcher */}
            <button
              onClick={() => {
                onClickSound?.();
                toggleLanguage();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white transition active:scale-95"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={() => {
                onClickSound?.();
                toggleTheme();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white transition active:scale-95"
            >
              {isLight ? (
                <>
                  <Sun className="w-4 h-4 text-sky-400" />
                  <span>{t.dock.lightMode}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>{t.dock.darkMode}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { Award, GraduationCap, CheckCircle, Zap, Globe, Code2, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useInView } from '../hooks/useInView';

export const AboutSection = ({ onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const a = t.about || { stats: [] };
  const h = t.hero || {};
  const edu = t.education || {};

  const [headerRef, headerVisible] = useInView();
  const [gridRef, gridVisible] = useInView();

  const statIcons = [Zap, Globe, Code2, Star];

  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Ambient blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className={`absolute top-1/3 ${isRTL ? '-right-60' : '-left-60'} w-[500px] h-[500px] rounded-full blur-3xl opacity-10 ${
            isLight ? 'bg-indigo-400' : 'bg-indigo-700'
          }`}
        />
      </div>

      <div className="max-w-7xl w-full mx-auto z-10">

        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className={`mb-14 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
        >
          <div
            className={`text-xs font-mono font-bold tracking-widest uppercase mb-3 flex items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-2 ${
              isLight ? 'text-sky-700' : 'text-cyan-400'
            } ${headerVisible ? 'animate-slideUp' : 'opacity-0'}`}
          >
            <span
              className={`w-6 h-px ${isLight ? 'bg-sky-400' : 'bg-cyan-500'}`}
            />
            {a.sectionTag || '01 // الهوية والرؤية الهندسية'}
          </div>
          <h2
            className={`text-responsive-h2 font-display font-extrabold mb-3 bg-clip-text text-transparent animate-gradient-text ${
              isLight
                ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900'
                : 'bg-gradient-to-r from-white via-cyan-100 to-sky-400'
            } ${headerVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}
          >
            {a.title || 'حلول برمجية متطورة'}
          </h2>
          <p
            className={`text-sm sm:text-base font-sans font-medium max-w-2xl ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } ${headerVisible ? 'animate-slideUp-d2' : 'opacity-0'}`}
          >
            {a.subtitle || 'هندسة منصات ويب حديثة'}
          </p>
        </div>

        {/* ── Two-Column Layout (Bio Left + 2x2 Stats Right) ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >

          {/* Main bio card — 7 columns */}
          <div
            className={`lg:col-span-7 bento-card rounded-3xl border p-7 sm:p-9 relative overflow-hidden ${
              isLight
                ? 'bg-white/95 border-slate-200/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
                : 'bg-slate-950/80 border-white/[0.07] shadow-[0_8px_40px_rgba(6,182,212,0.08)]'
            } ${gridVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}
            onMouseEnter={() => onHoverSound?.()}
          >
            {/* Gradient corner decoration */}
            <div
              className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${
                isLight ? 'bg-sky-400' : 'bg-cyan-500'
              }`}
            />

            {/* Author header */}
            <div className="flex items-center gap-4 mb-7 relative">
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  isLight
                    ? 'bg-sky-50 border border-sky-200 text-sky-700'
                    : 'bg-cyan-950/80 border border-cyan-500/30 text-cyan-300'
                }`}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {h.name || 'محمود صيام'}
                </h3>
                <p className={`text-xs font-mono font-semibold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                  {h.title || 'Full-Stack Web Architect'}
                </p>
              </div>

              {/* Available indicator */}
              <div className={`ms-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isRTL ? 'متاح' : 'Available'}
              </div>
            </div>

            {/* Bio paragraphs */}
            <div className={`space-y-4 text-sm sm:text-base font-sans leading-relaxed relative ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <p>{a.p1}</p>
              <p>{a.p2}</p>
              <p>{a.p3}</p>
            </div>

            {/* Commitments grid */}
            <div className={`mt-8 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
              {[
                isRTL ? 'معمارية برمجية نظيفة وقابلة للتوسع' : 'Clean & Scalable Architecture',
                isRTL ? 'مخططات قواعد بيانات متينة' : 'Robust Database Schemas',
                isRTL ? 'أداء فائق واستجابة لحظية' : 'Sub-Second Performance',
                isRTL ? 'واجهات 3D وتفاعلية' : 'Pixel-Perfect 3D & 2D UI',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 5 columns with 2x2 Stats Grid + University Badge */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 2x2 Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {(a.stats || []).map((st, idx) => {
                const Icon = statIcons[idx] || Zap;
                const colors = [
                  { bg: isLight ? 'bg-sky-50/90' : 'bg-cyan-950/40', border: isLight ? 'border-sky-200' : 'border-cyan-500/30', accent: isLight ? 'text-sky-600' : 'text-cyan-400' },
                  { bg: isLight ? 'bg-indigo-50/90' : 'bg-indigo-950/40', border: isLight ? 'border-indigo-200' : 'border-indigo-500/30', accent: isLight ? 'text-indigo-600' : 'text-indigo-400' },
                  { bg: isLight ? 'bg-emerald-50/90' : 'bg-emerald-950/40', border: isLight ? 'border-emerald-200' : 'border-emerald-500/30', accent: isLight ? 'text-emerald-600' : 'text-emerald-400' },
                  { bg: isLight ? 'bg-amber-50/90' : 'bg-amber-950/40', border: isLight ? 'border-amber-200' : 'border-amber-500/30', accent: isLight ? 'text-amber-600' : 'text-amber-400' },
                ][idx] || {};
                const delay = ['animate-slideUp-d2', 'animate-slideUp-d3', 'animate-slideUp-d4', 'animate-slideUp-d5'][idx];

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => onHoverSound?.()}
                    className={`bento-card p-5 rounded-3xl border ${colors.bg} ${colors.border} backdrop-blur-xl ${
                      isLight ? 'shadow-sm' : 'shadow-lg'
                    } ${gridVisible ? delay : 'opacity-0'}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colors.accent} ${
                      isLight ? 'bg-white shadow-sm' : 'bg-slate-900/80 border border-white/5'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`text-2xl sm:text-3xl font-display font-black mb-1 ${colors.accent}`}>
                      {st.value}
                    </div>
                    <div className={`text-xs font-bold uppercase font-mono mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      {st.label}
                    </div>
                    <div className={`text-[11px] font-mono leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {st.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* University Citadel Emblem — full width below stats */}
            <div
              className={`bento-card p-5 sm:p-6 rounded-3xl border flex items-center gap-4 ${
                isLight
                  ? 'bg-gradient-to-br from-sky-50 to-indigo-50 border-sky-200 shadow-sm'
                  : 'bg-gradient-to-br from-cyan-950/50 to-indigo-950/50 border-cyan-500/30 shadow-lg'
              } ${gridVisible ? 'animate-slideUp-d6' : 'opacity-0'}`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${isLight ? 'bg-white shadow-sm' : 'bg-slate-900/80 border border-white/5'}`}>
                <Award className={`w-6 h-6 animate-pulse ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
              </div>
              <div>
                <div className={`text-xs font-mono font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                  {edu.standing || (isRTL ? 'مهندس برمجيات متكامل • 2021 – 2026' : 'Full-Stack Engineer • 2021 – 2026')}
                </div>
                <div className={`text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {edu.institution || (isRTL ? 'كلية تكنولوجيا المعلومات' : 'Faculty of Information Technology')}
                  {' • '}
                  {edu.college || (isRTL ? 'هندسة البرمجيات' : 'Software Engineering')}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

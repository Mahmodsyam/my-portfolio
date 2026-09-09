import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const AchievementsSection = ({ onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const ach = t.achievements || { milestones: [] };

  return (
    <section
      id="achievements"
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl w-full mx-auto z-10">
        {/* Section Header */}
        <div className={`mb-16 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <div
            className={`text-xs font-mono font-bold tracking-widest uppercase mb-2 ${
              isLight ? 'text-sky-700' : 'text-cyan-400'
            }`}
          >
            {ach.sectionTag || '06 // THE HEROIC JOURNEY'}
          </div>
          <h2
            className={`text-responsive-h2 font-display font-extrabold mb-3 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {ach.title || 'FROM CHALLENGE TO ACHIEVEMENT'}
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg font-sans font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {ach.subtitle || 'Light Forged Through Perseverance'}
          </p>
        </div>

        {/* Central Luminous Monolith Story Card */}
        <div
          onMouseEnter={() => onHoverSound?.()}
          className={`p-6 sm:p-10 lg:p-14 rounded-3xl border backdrop-blur-2xl shadow-2xl mb-12 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-800 shadow-[0_10px_50px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/85 border-cyan-500/40 text-slate-200 shadow-[0_10px_50px_rgba(6,182,212,0.2)]'
          }`}
        >
          {/* Top Quote */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p
              className={`text-base sm:text-xl font-display font-bold italic leading-relaxed ${
                isLight ? 'text-sky-800' : 'text-cyan-300'
              }`}
            >
              {ach.quote}
            </p>
          </div>

          {/* 3-Act Narrative Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-sm sm:text-base font-sans leading-relaxed">
            <div
              className={`p-5 sm:p-6 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-3 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`}>
                01 // {isRTL ? 'التحدي والصمود' : 'The Adversity'}
              </div>
              <p>{ach.story1}</p>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-3 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
                02 // {isRTL ? 'العزيمة والإصرار' : 'The Discipline'}
              </div>
              <p>{ach.story2}</p>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border ${
                isLight
                  ? 'bg-sky-50/80 border-sky-200 text-slate-900'
                  : 'bg-cyan-950/60 border-cyan-500/40 text-white'
              }`}
            >
              <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-3 ${isLight ? 'text-sky-700' : 'text-cyan-300'}`}>
                03 // {isRTL ? 'التتويج بالتميز' : 'The Triumph'}
              </div>
              <p>{ach.story3}</p>
            </div>
          </div>
        </div>

        {/* 3 Milestones Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ach.milestones?.map((m, idx) => (
            <div
              key={idx}
              onMouseEnter={() => onHoverSound?.()}
              className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 transform hover:scale-105 flex items-start gap-4 ${
                isLight
                  ? 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
                  : 'bg-slate-950/80 border-cyan-500/30 text-slate-200'
              }`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-display font-black text-lg shrink-0 border ${
                isLight
                  ? 'bg-sky-50 border-sky-200 text-sky-700'
                  : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
              }`}>
                {m.phase}
              </div>
              <div>
                <h4 className={`text-base font-bold font-display mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {m.title}
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Calendar, CheckCircle2, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const ExperienceSection = ({ onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const exp = t.experience || { items: [] };

  return (
    <section
      id="experience"
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
            {exp.sectionTag || '04 // CAREER & MILESTONES'}
          </div>
          <h2
            className={`text-responsive-h2 font-display font-extrabold mb-3 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {exp.title || '3D ENGINEERING TIMELINE'}
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg font-sans font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {exp.subtitle || 'Professional Milestones & Recognition'}
          </p>
        </div>

        {/* 3D Timeline Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {exp.items?.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => onHoverSound?.()}
              className={`p-7 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between group ${
                isLight
                  ? 'bg-white/90 border-slate-200 text-slate-900 hover:border-sky-500 shadow-[0_10px_40px_rgba(0,0,0,0.05)]'
                  : 'bg-slate-950/80 border-cyan-500/30 text-slate-100 hover:border-cyan-400 shadow-[0_10px_40px_rgba(6,182,212,0.15)]'
              }`}
            >
              <div>
                {/* Year / Period Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      idx === 0
                        ? isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-800'
                        : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.year}</span>
                  </span>

                  <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.period}
                  </span>
                </div>

                {/* Role Title */}
                <h3
                  className={`text-xl font-display font-bold mb-2 transition ${
                    isLight ? 'group-hover:text-sky-600' : 'group-hover:text-cyan-300'
                  }`}
                >
                  {item.role}
                </h3>

                {/* Organization */}
                <div
                  className={`text-xs font-sans font-semibold mb-4 flex items-center gap-1.5 ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{item.company}</span>
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm font-sans leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {item.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className={`pt-4 border-t space-y-2 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                {item.highlights?.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

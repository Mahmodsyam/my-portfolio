import React from 'react';
import { GraduationCap, Award, BookOpen, UserCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const EducationSection = ({ onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const e = t.education || { highlights: [], capstone: { supervisors: [] } };

  return (
    <section
      id="education"
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
            {e.sectionTag || '05 // ACADEMIC FOUNDATION'}
          </div>
          <h2
            className={`text-responsive-h2 font-display font-extrabold mb-3 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {e.title || 'ACADEMIC CITADEL'}
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg font-sans font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {e.subtitle || (isRTL ? 'بكالوريوس تكنولوجيا المعلومات وهندسة الويب' : 'B.Sc. in Information Technology & Web Engineering')}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Degree Card */}
          <div
            onMouseEnter={() => onHoverSound?.()}
            className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.05)]'
                : 'bg-slate-950/80 border-cyan-500/30 text-slate-200 shadow-[0_10px_40px_rgba(6,182,212,0.15)]'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3.5 rounded-2xl border shrink-0 ${
                    isLight
                      ? 'bg-sky-50 border-sky-200 text-sky-700'
                      : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-display font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {e.institution}
                  </h3>
                  <p className={`text-xs font-sans font-semibold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                    {e.college}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border ${
                isLight ? 'border-sky-300 bg-sky-50 text-sky-700' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
              }`}>
                {e.date}
              </span>
            </div>

            {/* Degree Title */}
            <div className={`text-base sm:text-lg lg:text-xl font-display font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {e.degree} — <span className={isLight ? 'text-sky-700' : 'text-cyan-300'}>{e.major}</span>
            </div>

            {/* Standing Honor Pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-sans font-bold text-xs sm:text-sm mb-6 ${
              isLight ? 'bg-sky-50 border border-sky-200 text-sky-700' : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
            }`}>
              <Sparkles className="w-4 h-4 animate-spin-slow shrink-0" />
              <span>{e.standing}</span>
            </div>

            <p className={`text-sm sm:text-base font-sans leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {e.details}
            </p>

            {/* Academic Highlights */}
            <div className="space-y-2.5">
              {e.highlights?.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capstone Project & Supervisors Card */}
          <div
            onMouseEnter={() => onHoverSound?.()}
            className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl flex flex-col justify-between ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-800'
                : 'bg-slate-950/80 border-cyan-500/30 text-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-sky-600 mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Capstone Engineering Project</span>
              </div>

              <h4 className={`text-lg sm:text-xl font-display font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {e.capstone?.title}
              </h4>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 mb-6">
                ✓ {e.capstone?.status}
              </div>

              <div className={`text-xs font-mono uppercase tracking-wider mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Project Supervisor
              </div>

              <div className="space-y-3">
                {e.capstone?.supervisors?.map((sup, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 ${
                        isLight
                          ? 'bg-sky-100 border-sky-300 text-sky-800'
                          : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {sup.name}
                      </div>
                      <div className={`text-xs font-mono ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                        {sup.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t text-[11px] font-mono ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
              * Blueprints, thesis defense, and project documentation available upon request.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

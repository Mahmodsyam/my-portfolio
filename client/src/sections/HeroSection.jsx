import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowDown, Sparkles, FolderGit2, Mail, ArrowUpRight } from 'lucide-react';
import { Portrait3D } from '../components/3d/Portrait3D';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useInView } from '../hooks/useInView';

export const HeroSection = ({ mouseRef, onHoverSound, onClickSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const h = t.hero || {};
  const [ref, visible] = useInView();

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className={`absolute -top-40 ${isRTL ? '-left-40' : '-right-40'} w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-floatSlow ${
            isLight ? 'bg-sky-400' : 'bg-cyan-500'
          }`}
        />
        <div
          className={`absolute bottom-0 ${isRTL ? '-right-32' : '-left-32'} w-[500px] h-[500px] rounded-full blur-3xl opacity-15 ${
            isLight ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center z-10"
      >
        {/* ── Left column: Text ── */}
        <div
          className={`lg:col-span-7 flex flex-col justify-center text-center ${
            isRTL ? 'lg:text-right' : 'lg:text-left'
          } order-2 lg:order-1`}
        >
          {/* Availability badge */}
          <div
            className={`inline-flex items-center gap-2 mb-5 self-center lg:self-start ${
              visible ? 'animate-slideUp' : 'opacity-0'
            }`}
          >
            <span
              className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 overflow-hidden ${
                isLight
                  ? 'bg-sky-50/90 border-sky-200 text-sky-800'
                  : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
              }`}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 animate-shimmer pointer-events-none" />
              <span
                className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"
              />
              <span className="relative">{h.badge || '⚡ متاح للمشاريع • شريكك التقني'}</span>
            </span>
          </div>

          {/* Main heading */}
          <h1
            className={`text-responsive-h1 font-display font-extrabold mb-3 ${
              visible ? 'animate-slideUp-d1' : 'opacity-0'
            }`}
          >
            <span
              className={`bg-clip-text text-transparent animate-gradient-text ${
                isLight
                  ? 'bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-800'
                  : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'
              }`}
            >
              {h.name || 'MAHMOUD SIAM'}
            </span>
          </h1>

          {/* Role title */}
          <div
            className={`text-base sm:text-lg lg:text-xl font-display font-bold mb-2 ${
              isLight ? 'text-sky-700' : 'text-cyan-400'
            } ${visible ? 'animate-slideUp-d2' : 'opacity-0'}`}
          >
            {h.title || 'تحويل الأفكار إلى واقع رقمي استثنائي'}
          </div>

          {/* Subtitle */}
          <div
            className={`text-xs sm:text-sm md:text-base font-sans font-medium mb-5 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } ${visible ? 'animate-slideUp-d2' : 'opacity-0'}`}
          >
            {h.subtitle || 'Full-Stack Developer • Cloud Systems • 3D Interactive Web'}
          </div>

          {/* Tagline */}
          <p
            className={`text-sm sm:text-base md:text-lg font-sans leading-relaxed max-w-2xl mb-8 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            } ${visible ? 'animate-slideUp-d3' : 'opacity-0'}`}
          >
            {h.tagline}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 justify-center flex-wrap ${
              isRTL ? 'lg:justify-start' : 'lg:justify-start'
            } ${visible ? 'animate-slideUp-d4' : 'opacity-0'}`}
          >
            {/* Primary CTA */}
            <a
              href="/request-project"
              onClick={() => onClickSound?.()}
              onMouseEnter={() => onHoverSound?.()}
              className={`group relative w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-2xl font-display font-extrabold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden ${
                isLight
                  ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white shadow-[0_4px_30px_rgba(2,132,199,0.5)] hover:shadow-[0_6px_40px_rgba(2,132,199,0.7)] hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-[0_4px_30px_rgba(6,182,212,0.6)] hover:shadow-[0_6px_40px_rgba(6,182,212,0.8)] hover:-translate-y-0.5'
              }`}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Sparkles className="w-4 h-4 shrink-0 animate-spin-slow" />
              <span>{isRTL ? 'اطلب مشروعًا' : 'Request a Project'}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Secondary */}
            <a
              href="#projects"
              onClick={() => onClickSound?.()}
              onMouseEnter={() => onHoverSound?.()}
              className={`group w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-2xl font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border hover:-translate-y-0.5 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:text-sky-700 shadow-sm hover:shadow-md'
                  : 'bg-slate-900/70 border-slate-700 text-slate-200 hover:border-cyan-500/60 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4 shrink-0" />
              <span>{h.ctaProjects || 'Explore Projects'}</span>
            </a>

            {/* Tertiary */}
            <a
              href="#contact"
              onClick={() => onClickSound?.()}
              onMouseEnter={() => onHoverSound?.()}
              className={`group w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-2xl font-display font-medium text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border hover:-translate-y-0.5 ${
                isLight
                  ? 'border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700'
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>{h.ctaContact || 'Get in Touch'}</span>
            </a>
          </div>

          {/* Quick stats row */}
          <div
            className={`flex items-center gap-6 mt-10 pt-6 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            } ${visible ? 'animate-slideUp-d5' : 'opacity-0'}`}
          >
            {[
              { value: '+5', label: isRTL ? 'سنوات خبرة' : 'Years Exp.' },
              { value: '+10', label: isRTL ? 'مشروع منجز' : 'Projects' },
              { value: '100%', label: isRTL ? 'التزام بالجودة' : 'Quality' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className={`text-2xl font-display font-black ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}
                >
                  {stat.value}
                </div>
                <div className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: 3D Portrait ── */}
        <div
          className={`lg:col-span-5 flex items-center justify-center relative order-1 lg:order-2 ${
            visible ? 'animate-slideUp-d2' : 'opacity-0'
          }`}
        >
          <div className="relative w-[280px] h-[340px] sm:w-[360px] sm:h-[420px] lg:w-[420px] lg:h-[480px]">
            {/* Glowing aura rings */}
            <div
              className={`absolute inset-4 rounded-3xl blur-2xl opacity-25 animate-pulse ${
                isLight ? 'bg-sky-400' : 'bg-cyan-500'
              }`}
            />
            <div
              className={`absolute inset-8 rounded-3xl blur-xl opacity-20 ${
                isLight ? 'bg-indigo-400' : 'bg-indigo-500'
              }`}
              style={{ animationDelay: '1s' }}
            />

            {/* 3D Canvas */}
            <Canvas
              camera={{ position: [0, 0, 5.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              className="rounded-3xl"
            >
              <ambientLight intensity={isLight ? 1.0 : 0.6} />
              <directionalLight position={[5, 10, 5]} intensity={isLight ? 1.6 : 1.2} />
              <Portrait3D mouseRef={mouseRef} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          {h.scrollDown || 'Scroll'}
        </span>
        {/* Animated scroll pill */}
        <div
          className={`w-5 h-8 rounded-full border-2 flex items-start justify-center p-1 ${
            isLight ? 'border-slate-300' : 'border-slate-700'
          }`}
        >
          <div
            className={`w-1 h-1.5 rounded-full ${
              isLight ? 'bg-sky-500' : 'bg-cyan-400'
            } animate-bounce`}
          />
        </div>
      </div>
    </section>
  );
};

import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { X, ExternalLink, ShieldCheck, Layers, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { ProjectEmblem3D } from '../3d/projects/ProjectEmblems3D';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const ProjectModal3D = ({
  project,
  onClose,
  onHoverSound,
  onClickSound
}) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  // Retrieve localized project data if available
  const localizedProject =
    t.projects?.items?.find((p) => p.id === project.id) || project;
  const m = t.modal || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 border shadow-2xl transition-all duration-300 no-scrollbar ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.15)]'
            : 'bg-slate-950/95 border-cyan-500/40 text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.3)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            onClickSound?.();
            onClose();
          }}
          onMouseEnter={() => onHoverSound?.()}
          className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} z-10 w-10 h-10 flex items-center justify-center rounded-full border transition shadow-sm ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400'
          }`}
          title={m.close || 'Close (Esc)'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Exhibition Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Project Emblem Interactive Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full h-[240px] sm:h-[290px] rounded-2xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-900/70 to-black/90">
              <div className="absolute top-3 left-3 z-10 text-[10px] font-sans uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>ARCHITECTURAL EMBLEM</span>
              </div>

              <Canvas
                camera={{ position: [0, 0, 4.8], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={2.0} />
                <pointLight position={[4, 4, 4]} intensity={5} color={localizedProject.color || '#38bdf8'} />
                <pointLight position={[-4, -4, -4]} intensity={2} color="#ffffff" />
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
                  <ProjectEmblem3D id={localizedProject.id} scale={0.78} hovered={true} color={localizedProject.color} />
                </Float>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
            <span className="text-[11px] font-sans text-slate-500 mt-2">
              {isRTL ? 'اسحب لتدوير المجسم' : 'Drag to rotate emblem'}
            </span>
          </div>

          {/* Header Info */}
          <div className="lg:col-span-7">
            <span
              className="inline-block px-3.5 py-1 text-xs font-sans font-bold tracking-wider rounded-full mb-3 uppercase"
              style={{
                backgroundColor: `${localizedProject.color}15`,
                color: isLight ? '#0369a1' : localizedProject.color,
                border: `1px solid ${localizedProject.color}40`
              }}
            >
              {localizedProject.category}
            </span>

            <h2 className={`text-2xl sm:text-4xl font-display font-extrabold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {localizedProject.title}
            </h2>

            <p className={`text-sm sm:text-base font-sans font-semibold mb-4 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
              {localizedProject.subtitle}
            </p>

            <div className={`p-4 rounded-xl border text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
              {localizedProject.longDescription || localizedProject.description}
            </div>
          </div>
        </div>

        {/* Core Features List */}
        <div className="mb-8">
          <h3 className={`text-xs font-sans uppercase tracking-wider mb-3.5 flex items-center gap-2 font-bold ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>
            <Layers className="w-4 h-4" />
            <span>{m.features || 'Core Engineering Features'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localizedProject.features?.map((feat, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm font-sans ${
                  isLight
                    ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges & Solutions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
            <h4 className="text-xs font-sans uppercase tracking-wider mb-2 font-bold text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{m.challenges || 'Engineering Challenge'}</span>
            </h4>
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {localizedProject.challenges}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
            <h4 className="text-xs font-sans uppercase tracking-wider mb-2 font-bold text-sky-600 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>{m.solutions || 'Architectural Solution'}</span>
            </h4>
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {localizedProject.solutions}
            </p>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mb-8">
          <h3 className={`text-xs font-sans uppercase tracking-wider mb-3 font-bold ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>
            {m.techStack || 'Technology Stack'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {localizedProject.techStack?.map((tech, idx) => (
              <span
                key={idx}
                className={`px-3.5 py-1 rounded-lg border text-xs font-sans font-semibold ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-900 border-slate-700/80 text-slate-200'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className={`pt-5 border-t flex flex-wrap items-center justify-between gap-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {m.role || 'Role'}: <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{localizedProject.role}</span>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            {localizedProject.liveDemo && localizedProject.liveDemo !== '#' && (
              <a
                href={localizedProject.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onClickSound?.()}
                onMouseEnter={() => onHoverSound?.()}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg border ${
                  isLight
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                }`}
              >
                <span>{isRTL ? 'زيارة الموقع مباشرة' : 'Visit Live Site'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href="#contact"
              onClick={() => {
                onClickSound?.();
                onClose();
              }}
              onMouseEnter={() => onHoverSound?.()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg ${
                isLight
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              <span>{m.inquireBtn || 'Inquire About Similar Project'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { X, CheckCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { ServiceObject3D } from '../3d/services/ServiceObjects3D';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const ServiceModal3D = ({
  service,
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

  if (!service) return null;

  const localizedService =
    t.services?.list?.find((s) => s.id === service.id) || service;
  const srv = t.services || {};

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
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Model Stage (Compact Scale) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full h-[240px] sm:h-[290px] rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-b from-slate-900/60 to-black/80">
              <div className="absolute top-3 left-3 z-10 text-[10px] font-sans uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>SERVICE CONCEPT</span>
              </div>

              <Canvas
                camera={{ position: [0, 0, 4.8], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={2.0} />
                <pointLight position={[4, 4, 4]} intensity={5} color={localizedService.color || '#38bdf8'} />
                <pointLight position={[-4, -4, -4]} intensity={2} color="#ffffff" />
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
                  <ServiceObject3D id={localizedService.id} scale={0.78} hovered={true} color={localizedService.color} />
                </Float>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
            <span className="text-[11px] font-sans text-slate-500 mt-2">
              {isRTL ? 'اسحب لتدوير المجسم' : 'Drag to rotate object'}
            </span>
          </div>

          {/* Service Specifications Sheet */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Header Badge & Title */}
              <div className="mb-4">
                <span
                  className="inline-block px-3.5 py-1 text-xs font-sans font-bold tracking-wider rounded-full mb-3 uppercase"
                  style={{
                    backgroundColor: `${localizedService.color}15`,
                    color: isLight ? '#0369a1' : localizedService.color,
                    border: `1px solid ${localizedService.color}40`
                  }}
                >
                  {localizedService.titleEn || localizedService.title}
                </span>

                <h2 className={`text-2xl sm:text-3xl font-display font-extrabold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {localizedService.title}
                </h2>
              </div>

              {/* Long Description */}
              <p className={`text-sm sm:text-base font-sans leading-relaxed mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {localizedService.longDesc || localizedService.desc}
              </p>

              {/* Deliverables List */}
              <div className="mb-6">
                <h4 className={`text-xs font-sans uppercase tracking-wider mb-3 flex items-center gap-2 font-bold ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>
                  <Layers className="w-4 h-4" />
                  <span>{srv.deliverablesTitle || 'Core Deliverables'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {localizedService.deliverables?.map((del, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-sans ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="mb-8">
                <h4 className={`text-xs font-sans uppercase tracking-wider mb-2.5 font-bold ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>
                  {isRTL ? 'التقنيات المستخدمة' : 'Technologies & Frameworks'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {localizedService.techs?.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-0.5 rounded-lg border text-xs font-sans font-semibold ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-800'
                          : 'bg-slate-900 border-slate-700 text-slate-200'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Request Button */}
            <div className={`pt-5 border-t flex items-center justify-between gap-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <a
                href="#contact"
                onClick={() => {
                  onClickSound?.();
                  onClose();
                }}
                onMouseEnter={() => onHoverSound?.()}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg ${
                  isLight
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                }`}
              >
                <span>{srv.requestService || 'Request Service'}</span>
                <ArrowRight className={`w-4 h-4 transform ${isRTL ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

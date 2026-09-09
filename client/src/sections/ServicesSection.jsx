import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Compass
} from 'lucide-react';
import { ServiceObject3D } from '../components/3d/services/ServiceObjects3D';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useInView } from '../hooks/useInView';

// ----------------------------------------------------
// 3D Services Universe Spatial Canvas Scene
// ----------------------------------------------------
const ServicesUniverseScene = ({
  services,
  selectedService,
  onSelectService,
  onHoverSound
}) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {services.map((service, idx) => {
        const total = services.length;
        const angle = (idx / total) * Math.PI * 2;
        const radius = 3.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = ((idx % 2) === 0 ? 0.4 : -0.4);
        const isSelected = selectedService?.id === service.id;

        return (
          <group
            key={service.id}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectService(service);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onSelectService(service);
              onHoverSound?.();
            }}
          >
            <Float
              speed={2 + (idx % 3) * 0.4}
              rotationIntensity={0.2}
              floatIntensity={isSelected ? 0.4 : 0.2}
            >
              <group scale={isSelected ? 0.65 : 0.44}>
                <ServiceObject3D
                  id={service.id}
                  hovered={isSelected}
                  scale={1.0}
                  color={service.color}
                />
              </group>

              {isSelected && (
                <pointLight
                  position={[0, 0, 0.6]}
                  intensity={5}
                  distance={5}
                  color={service.color || '#38bdf8'}
                />
              )}
            </Float>
          </group>
        );
      })}
    </group>
  );
};

// ----------------------------------------------------
// Focused 3D Service Object Stage Preview (Refined Compact Scale)
// ----------------------------------------------------
const FocusedServiceStage = ({ service }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <pointLight position={[4, 4, 4]} intensity={5} color={service?.color || '#38bdf8'} />
      <pointLight position={[-4, -4, -4]} intensity={2.5} color="#ffffff" />
      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <ServiceObject3D id={service?.id} hovered={true} scale={0.78} color={service?.color} />
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.8} />
    </Canvas>
  );
};

// ----------------------------------------------------
// Main Services Section
// ----------------------------------------------------
export const ServicesSection = ({ onHoverSound, onClickSound, onInspectService }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const srv = t.services || { list: [] };
  const serviceList = srv.list || [];
  const [headerRef, headerVisible] = useInView();

  const [activeService, setActiveService] = useState(serviceList[0] || null);
  const currentService = activeService || serviceList[0];
  const currentIndex = serviceList.findIndex((item) => item.id === (currentService?.id || ''));

  const handleNext = () => {
    onHoverSound?.();
    const nextIdx = (currentIndex + 1) % serviceList.length;
    setActiveService(serviceList[nextIdx]);
  };

  const handlePrev = () => {
    onHoverSound?.();
    const prevIdx = (currentIndex - 1 + serviceList.length) % serviceList.length;
    setActiveService(serviceList[prevIdx]);
  };

  return (
    <section
      id="services"
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`mb-10 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-3 flex items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-2 ${isLight ? 'text-sky-700' : 'text-cyan-400'} ${headerVisible ? 'animate-slideUp' : 'opacity-0'}`}>
            <span className={`w-6 h-px ${isLight ? 'bg-sky-400' : 'bg-cyan-500'}`} />
            {srv.sectionTag || '07 // الخدمات الهندسية'}
          </div>

          <h2 className={`text-responsive-h2 font-display font-extrabold mb-2 bg-clip-text text-transparent animate-gradient-text ${isLight ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900' : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'} ${headerVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}>
            {srv.title || (isRTL ? 'الخدمات والحلول الهندسية' : 'ENGINEERING SERVICES')}
          </h2>

          <p className={`text-xs sm:text-sm md:text-base font-sans font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'} ${headerVisible ? 'animate-slideUp-d2' : 'opacity-0'}`}>
            {srv.subtitle || 'High-Impact Digital Solutions Built for Scale'}
          </p>
        </div>

        {/* Services Universe Exhibition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Services Universe Spatial Canvas */}
          <div className="lg:col-span-7 h-[380px] sm:h-[480px] lg:h-[540px] relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-black/80 backdrop-blur-xl shadow-2xl">
            {/* HUD Status Tag */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-sans uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{isRTL ? 'فضاء المفاهيم البرمجية' : 'SERVICE CONCEPTS VIEWPORT'}</span>
              </span>

              <span className="text-[11px] font-sans text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
                {isRTL ? 'انقر على أي مجسم للمعاينة' : 'Click Object to Inspect'}
              </span>
            </div>

            {/* 3D Scene Viewport */}
            <Canvas
              camera={{ position: [0, 1.2, 7.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.6} />
              <directionalLight position={[10, 15, 10]} intensity={2.0} />
              <pointLight position={[-8, -8, -8]} intensity={4} color="#38bdf8" />
              <ServicesUniverseScene
                services={serviceList}
                selectedService={currentService}
                onSelectService={(s) => setActiveService(s)}
                onHoverSound={onHoverSound}
              />
              <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2 + 0.3}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </div>

          {/* Holographic Specification HUD for Selected 3D Service */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            {currentService && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl relative overflow-hidden ${
                  isLight
                    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
                    : 'bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-[0_10px_40px_rgba(6,182,212,0.2)]'
                }`}
              >
                {/* 3D Focus Stage Preview */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/60 shadow-inner shrink-0">
                    <FocusedServiceStage service={currentService} />
                  </div>

                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <span
                      className="inline-block px-3 py-1 text-[11px] font-sans font-bold tracking-wider rounded-full uppercase mb-1"
                      style={{
                        backgroundColor: `${currentService.color}20`,
                        color: isLight ? '#0369a1' : currentService.color,
                        border: `1px solid ${currentService.color}50`
                      }}
                    >
                      {currentService.titleEn || currentService.title}
                    </span>
                    <div className="text-xs font-sans text-slate-400">
                      ENGINEERING SERVICE
                    </div>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                  <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {currentService.title}
                  </span>
                </h3>

                {/* Short Description */}
                <p className={`text-xs sm:text-sm font-sans leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {currentService.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 mb-6">
                  <button
                    onClick={() => {
                      onClickSound?.();
                      onInspectService?.(currentService);
                    }}
                    onMouseEnter={() => onHoverSound?.()}
                    className={`flex-1 min-h-[44px] px-5 py-3 rounded-2xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${
                      isLight
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>{srv.inspectService || (isRTL ? 'معاينة المواصفات' : 'Inspect Specifications')}</span>
                  </button>

                  <a
                    href="/request-project"
                    onClick={() => onClickSound?.()}
                    onMouseEnter={() => onHoverSound?.()}
                    className={`min-h-[44px] px-5 py-3 rounded-2xl font-display font-bold text-xs tracking-wider uppercase border transition flex items-center justify-center gap-1.5 active:scale-95 ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:border-sky-500'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white'
                    }`}
                  >
                    <span>{srv.requestService || (isRTL ? 'طلب الخدمة' : 'Request Service')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transform ${isRTL ? 'rotate-180' : ''}`} />
                  </a>
                </div>

                {/* Touch Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-400">
                    <span className="text-cyan-400 font-bold">{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{serviceList.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Previous Service"
                    >
                      <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Next Service"
                    >
                      <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import {
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FolderGit2,
  Compass
} from 'lucide-react';
import { ProjectEmblem3D } from '../components/3d/projects/ProjectEmblems3D';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useInView } from '../hooks/useInView';

// ----------------------------------------------------
// Exhibition Gallery Spatial Scene
// ----------------------------------------------------
const ProjectsExhibitionScene = ({
  projects,
  selectedProject,
  onSelectProject,
  onHoverSound
}) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  const projectPositions = [
    [-2.2, 0.3, 0],
    [-0.8, -0.25, 1.4],
    [0.8, 0.25, 1.4],
    [2.2, -0.3, 0]
  ];

  return (
    <group ref={groupRef}>
      {projects.map((project, idx) => {
        const pos = projectPositions[idx] || [0, 0, 0];
        const isSelected = selectedProject?.id === project.id;

        return (
          <group
            key={project.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(project);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onSelectProject(project);
              onHoverSound?.();
            }}
          >
            <Float
              speed={2 + (idx % 2) * 0.5}
              rotationIntensity={0.2}
              floatIntensity={isSelected ? 0.4 : 0.2}
            >
              <group scale={isSelected ? 0.65 : 0.44}>
                <ProjectEmblem3D
                  id={project.id}
                  hovered={isSelected}
                  scale={1.0}
                  color={project.color}
                />
              </group>

              {/* Pedestal Light Beam */}
              {isSelected && (
                <pointLight
                  position={[0, -0.8, 0.6]}
                  intensity={5}
                  distance={6}
                  color={project.color || '#38bdf8'}
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
// Focused Project Emblem Stage Preview (Refined Compact Scale)
// ----------------------------------------------------
const FocusedProjectStage = ({ project }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <pointLight position={[4, 4, 4]} intensity={5} color={project?.color || '#38bdf8'} />
      <pointLight position={[-4, -4, -4]} intensity={2.5} color="#ffffff" />
      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <ProjectEmblem3D id={project?.id} hovered={true} scale={0.78} color={project?.color} />
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.8} />
    </Canvas>
  );
};

// ----------------------------------------------------
// Main Projects Section
// ----------------------------------------------------
export const ProjectsSection = ({ onSelectProject, onHoverSound, onClickSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const p = t.projects || { items: [] };
  const projectList = p.items || [];
  const [headerRef, headerVisible] = useInView();

  const [activeProject, setActiveProject] = useState(projectList[0] || null);
  const currentProject = activeProject || projectList[0];
  const currentIndex = projectList.findIndex((item) => item.id === (currentProject?.id || ''));

  const handleNext = () => {
    onHoverSound?.();
    const nextIdx = (currentIndex + 1) % projectList.length;
    setActiveProject(projectList[nextIdx]);
  };

  const handlePrev = () => {
    onHoverSound?.();
    const prevIdx = (currentIndex - 1 + projectList.length) % projectList.length;
    setActiveProject(projectList[prevIdx]);
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`mb-10 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-3 flex items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-2 ${isLight ? 'text-sky-700' : 'text-cyan-400'} ${headerVisible ? 'animate-slideUp' : 'opacity-0'}`}>
            <span className={`w-6 h-px ${isLight ? 'bg-sky-400' : 'bg-cyan-500'}`} />
            {p.sectionTag || '03 // المشاريع المميزة'}
          </div>

          <h2 className={`text-responsive-h2 font-display font-extrabold mb-2 bg-clip-text text-transparent animate-gradient-text ${isLight ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900' : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'} ${headerVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}>
            {p.title || (isRTL ? 'معرض المشاريع' : 'PROJECTS & PLATFORMS')}
          </h2>

          <p className={`text-xs sm:text-sm md:text-base font-sans font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'} ${headerVisible ? 'animate-slideUp-d2' : 'opacity-0'}`}>
            {p.subtitle || 'Architected for Scale, Speed, and High Performance'}
          </p>
        </div>

        {/* Projects Exhibition Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Exhibition Space Canvas */}
          <div className="lg:col-span-7 h-[380px] sm:h-[480px] lg:h-[540px] relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-black/80 backdrop-blur-xl shadow-2xl">
            {/* Exhibition HUD Tag */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-sans uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{isRTL ? 'معرض المنظومات والمشاريع' : 'PROJECTS EXHIBITION'}</span>
              </span>

              <span className="text-[11px] font-sans text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
                {isRTL ? 'انقر على المجسم للتفاصيل' : 'Click Emblem to Inspect'}
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
              <ProjectsExhibitionScene
                projects={projectList}
                selectedProject={currentProject}
                onSelectProject={(proj) => setActiveProject(proj)}
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

          {/* Holographic Specification HUD for Selected Project */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            {currentProject && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl relative overflow-hidden ${
                  isLight
                    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
                    : 'bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-[0_10px_40px_rgba(6,182,212,0.2)]'
                }`}
              >
                {/* Focus Stage Preview */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/60 shadow-inner shrink-0">
                    <FocusedProjectStage project={currentProject} />
                  </div>

                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <span
                      className="inline-block px-3 py-1 text-[11px] font-sans font-bold tracking-wider rounded-full uppercase mb-1"
                      style={{
                        backgroundColor: `${currentProject.color}20`,
                        color: isLight ? '#0369a1' : currentProject.color,
                        border: `1px solid ${currentProject.color}50`
                      }}
                    >
                      {currentProject.category}
                    </span>
                    <div className="text-xs font-sans text-slate-400">
                      PRODUCTION PLATFORM
                    </div>
                  </div>
                </div>

                {/* Project Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-1">
                  <span style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {currentProject.title}
                  </span>
                </h3>

                <p className={`text-xs sm:text-sm font-sans font-semibold mb-3 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                  {currentProject.subtitle}
                </p>

                {/* Short Description */}
                <p className={`text-xs sm:text-sm font-sans leading-relaxed mb-5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {currentProject.description}
                </p>

                {/* Core Features Preview */}
                <div className="space-y-2 mb-6">
                  {currentProject.features?.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {currentProject.techStack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-sans font-medium border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Live Demo & Inspect Architecture */}
                <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
                  {currentProject.liveDemo && currentProject.liveDemo !== '#' && (
                    <a
                      href={currentProject.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onClickSound?.()}
                      onMouseEnter={() => onHoverSound?.()}
                      className={`flex-1 min-h-[46px] px-4 py-3 rounded-2xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 border ${
                        isLight
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                          : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                      }`}
                    >
                      <span>{isRTL ? 'زيارة الموقع الحي' : 'Live Demo'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      onClickSound?.();
                      onSelectProject(currentProject);
                    }}
                    onMouseEnter={() => onHoverSound?.()}
                    className={`flex-1 min-h-[46px] px-4 py-3 rounded-2xl font-display font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${
                      isLight
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>{p.viewDetails || (isRTL ? 'معاينة المعمارية' : 'Inspect Architecture')}</span>
                  </button>
                </div>

                {/* Touch Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-400">
                    <span className="text-cyan-400 font-bold">{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{projectList.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Previous Project"
                    >
                      <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Next Project"
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

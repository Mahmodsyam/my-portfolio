import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
  Layers,
  Terminal,
  Database,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass
} from 'lucide-react';
import { TechLogo3D } from '../components/3d/logos/TechLogos3D';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// ----------------------------------------------------
// 3D Orbit Galaxy Scene Inner Component
// ----------------------------------------------------
const SkillsGalaxyScene = ({
  skills,
  activeSkill,
  onSelectSkill,
  onHoverSound
}) => {
  const galaxyRef = useRef();
  const { isLight } = useTheme();

  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      {/* Central Pulsing Energy Core */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color={isLight ? '#0284c7' : '#38bdf8'}
            emissive={isLight ? '#0369a1' : '#0284c7'}
            emissiveIntensity={isLight ? 2.0 : 3.0}
            wireframe
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={isLight ? 6 : 9} distance={15} color={isLight ? '#0284c7' : '#38bdf8'} />
      </Float>

      {/* Galaxy Orbital Guide Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.01, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.01, 16, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.7, 0.01, 16, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.2} />
      </mesh>

      {/* Orbiting Technology 3D Logos (Compact Scale) */}
      <group ref={galaxyRef}>
        {skills.map((skill, idx) => {
          const total = skills.length;
          const angle = (idx / total) * Math.PI * 2;
          const radius = 2.3 + (idx % 3) * 0.7;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = ((idx % 5) - 2) * 0.45;
          const isSelected = activeSkill?.id === skill.id;

          return (
            <group
              key={skill.id}
              position={[x, y, z]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSkill(skill);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                onSelectSkill(skill);
                onHoverSound?.();
              }}
            >
              <Float speed={2 + (idx % 3) * 0.4} rotationIntensity={0.3} floatIntensity={0.4}>
                <group scale={isSelected ? 0.65 : 0.44}>
                  <TechLogo3D
                    id={skill.id}
                    hovered={isSelected}
                    scale={1.0}
                    color={skill.color}
                  />
                </group>

                {/* Floating Billboard Text Label */}
                <Billboard position={[0, 0.62, 0]}>
                  <Text
                    fontSize={0.16}
                    fontWeight="bold"
                    color={isSelected ? '#ffffff' : skill.color}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                  >
                    {skill.name}
                  </Text>
                </Billboard>

                {/* Ambient Point Light per active node */}
                {isSelected && (
                  <pointLight
                    position={[0, 0, 0.5]}
                    intensity={6}
                    distance={6}
                    color={skill.color || '#38bdf8'}
                  />
                )}
              </Float>
            </group>
          );
        })}
      </group>
    </>
  );
};

// ----------------------------------------------------
// Single Focused 3D Logo Stage (Refined Compact Scale)
// ----------------------------------------------------
const FocusedLogoStage = ({ skill, isHovered = true }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <pointLight position={[4, 4, 4]} intensity={5} color={skill?.color || '#38bdf8'} />
      <pointLight position={[-4, -4, -4]} intensity={2.5} color="#ffffff" />
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.35}>
        <TechLogo3D id={skill?.id} hovered={isHovered} scale={0.78} color={skill?.color} />
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.8} />
    </Canvas>
  );
};

// ----------------------------------------------------
// Main Skills Section
// ----------------------------------------------------
export const SkillsSection = ({ onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const s = t.skills || { list: [], categories: {} };

  const [activeCategory, setActiveCategory] = useState('all');
  const skillList = s.list || [];
  const filteredSkills =
    activeCategory === 'all'
      ? skillList
      : skillList.filter((item) => item.category === activeCategory);

  const [selectedSkill, setSelectedSkill] = useState(skillList[0] || null);

  // Sync selected skill when category changes
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const matches = catId === 'all' ? skillList : skillList.filter((i) => i.category === catId);
    if (matches.length > 0) setSelectedSkill(matches[0]);
  };

  const currentIndex = filteredSkills.findIndex((item) => item.id === (selectedSkill?.id || ''));

  const handleNext = () => {
    onHoverSound?.();
    const nextIdx = (currentIndex + 1) % filteredSkills.length;
    setSelectedSkill(filteredSkills[nextIdx]);
  };

  const handlePrev = () => {
    onHoverSound?.();
    const prevIdx = (currentIndex - 1 + filteredSkills.length) % filteredSkills.length;
    setSelectedSkill(filteredSkills[prevIdx]);
  };

  const categories = [
    { id: 'all', label: s.categories?.all || (isRTL ? 'جميع التقنيات (15)' : 'All Technologies (15)'), icon: Sparkles },
    { id: 'frontend', label: s.categories?.frontend || 'Frontend & 3D', icon: Layers },
    { id: 'backend', label: s.categories?.backend || 'Backend & APIs', icon: Terminal },
    { id: 'database', label: s.categories?.database || 'Databases', icon: Database },
    { id: 'tools', label: s.categories?.tools || 'DevOps & Tools', icon: Wrench }
  ];

  const currentSkill = selectedSkill || filteredSkills[0] || skillList[0];

  return (
    <section
      id="skills"
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto z-10">
        {/* Section Header */}
        <div className={`mb-10 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <div
            className={`text-xs font-mono font-bold tracking-widest uppercase mb-2 flex items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-2 ${
              isLight ? 'text-sky-700' : 'text-cyan-400'
            }`}
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{s.sectionTag || '02 // TECHNOLOGY GALAXY'}</span>
          </div>

          <h2 className="text-responsive-h2 font-display font-extrabold mb-2">
            <span
              className={`bg-clip-text text-transparent ${
                isLight
                  ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900'
                  : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'
              }`}
              style={{
                textShadow: isLight
                  ? '0 10px 30px rgba(2,132,199,0.15)'
                  : '0 0 35px rgba(6,182,212,0.35)'
              }}
            >
              {s.title || (isRTL ? 'مهاراتي التقنية' : 'TECHNICAL SKILLS')}
            </span>
          </h2>

          <p
            className={`text-xs sm:text-sm md:text-base font-sans font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {s.subtitle || 'Interactive Technology Galaxy'}
          </p>
        </div>

        {/* Category Pills Selector */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 justify-start sm:justify-center lg:justify-start">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onHoverSound?.();
                  handleCategoryChange(cat.id);
                }}
                onMouseEnter={() => onHoverSound?.()}
                className={`flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all duration-300 border whitespace-nowrap active:scale-95 ${
                  isActive
                    ? isLight
                      ? 'bg-sky-600 text-white border-sky-600 shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : isLight
                    ? 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Tech Galaxy Exhibition Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Technology Galaxy Canvas */}
          <div className="lg:col-span-7 h-[380px] sm:h-[480px] lg:h-[540px] relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-black/90 backdrop-blur-xl shadow-2xl">
            {/* Holographic Header Tag */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-sans uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{isRTL ? 'فضاء المجرة التفاعلي' : 'TECH GALAXY VIEWPORT'}</span>
              </span>

              <span className="text-[11px] font-sans text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
                {isRTL ? 'حرك الكاميرا للاستكشاف' : 'Orbit to Explore'}
              </span>
            </div>

            {/* Interactive 3D Galaxy Canvas */}
            <Canvas
              camera={{ position: [0, 1.2, 8.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.6} />
              <directionalLight position={[10, 15, 10]} intensity={2.0} />
              <pointLight position={[-10, 10, -10]} intensity={4} color="#38bdf8" />
              <pointLight position={[10, -10, 10]} intensity={4} color="#818cf8" />
              <SkillsGalaxyScene
                skills={filteredSkills}
                activeSkill={currentSkill}
                onSelectSkill={(s) => setSelectedSkill(s)}
                onHoverSound={onHoverSound}
              />
              <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.6}
                maxPolarAngle={Math.PI / 2 + 0.3}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </div>

          {/* Holographic Specification HUD for Selected 3D Technology */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            {currentSkill && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl relative overflow-hidden ${
                  isLight
                    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
                    : 'bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-[0_10px_40px_rgba(6,182,212,0.2)]'
                }`}
              >
                {/* 3D Focus Mini-Stage Preview */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/60 shadow-inner shrink-0">
                    <FocusedLogoStage skill={currentSkill} isHovered={true} />
                  </div>

                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <span
                      className="inline-block px-3 py-1 text-[11px] font-sans font-bold tracking-wider rounded-full uppercase mb-1"
                      style={{
                        backgroundColor: `${currentSkill.color}20`,
                        color: isLight ? '#0369a1' : currentSkill.color,
                        border: `1px solid ${currentSkill.color}50`
                      }}
                    >
                      {currentSkill.tier || (isRTL ? 'مستوى معماري متقدم' : 'Architectural Mastery')}
                    </span>
                    <div className="text-xs font-sans text-slate-400">
                      {currentSkill.category?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Tech Title */}
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                  <span
                    style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                  >
                    {currentSkill.name}
                  </span>
                </h3>

                {/* Short Accurate Description */}
                <p className={`text-xs sm:text-sm font-sans leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {currentSkill.description}
                </p>

                {/* Real-World Projects Where Used */}
                <div className={`p-4 rounded-2xl border mb-6 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'}`}>
                  <div className={`text-[11px] font-sans font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{s.projectsWhereUsed || (isRTL ? 'مشاريع تم استخدام التقنية بها' : 'Deployed in Projects')}</span>
                  </div>
                  <div className={`text-xs font-sans font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {currentSkill.projects || (isRTL ? 'منصة LegendSport • نظام POS • منصة MicroTech' : 'LegendSport • POS System • MicroTech Platform')}
                  </div>
                </div>

                {/* Touch Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-400">
                    <span className="text-cyan-400 font-bold">{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{filteredSkills.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Previous Technology"
                    >
                      <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 text-white flex items-center justify-center hover:border-cyan-400 transition active:scale-95"
                      title="Next Technology"
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

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorldCanvas } from './components/3d/WorldCanvas';
import { Navigation3D } from './components/ui/Navigation3D';
import { FloatingControlDock } from './components/ui/FloatingControlDock';
import { SoundController } from './components/ui/SoundController';
import { ProjectModal3D } from './components/ui/ProjectModal3D';
import { ServiceModal3D } from './components/ui/ServiceModal3D';
import { Loader3D } from './components/ui/Loader3D';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useDeviceTier } from './hooks/useDeviceTier';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// 9 Continuous Semantic Document Sections (Zero Overlap Guaranteed!)
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { ServicesSection } from './sections/ServicesSection';
import { ContactSection } from './sections/ContactSection';
import { FooterSection } from './sections/FooterSection';

// New Pages
import RequestProjectPage from './pages/RequestProjectPage';
import TrackRequestPage from './pages/TrackRequestPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function PortfolioApp() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [inspectedProject, setInspectedProject] = useState(null);
  const [inspectedService, setInspectedService] = useState(null);

  const { isRTL } = useLanguage();
  const { isLight } = useTheme();
  const deviceTier = useDeviceTier();
  const mouseRef = useRef({ x: 0, y: 0 });

  const {
    isEnabled: isAudioEnabled,
    toggleAudio,
    playHover,
    playClick
  } = useAudioEngine();

  // Mouse Movement Parallax Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global Continuous Scroll Tracker for 3D Camera Progression
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Observer to highlight active navigation item
  useEffect(() => {
    const sections = [
      'hero',
      'about',
      'skills',
      'projects',
      'experience',
      'education',
      'achievements',
      'services',
      'contact'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`relative min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${
        isLight
          ? 'bg-[#f8fafc] text-slate-900 theme-light'
          : 'bg-[#040711] text-slate-100 theme-dark'
      }`}
    >
      {/* 3D Loading Gateway */}
      {!isLoaded && (
        <Loader3D
          onLoaded={() => setIsLoaded(true)}
        />
      )}

      {/* 3D Navigation System (Desktop HUD + Mobile Fullscreen 3D Panel) */}
      <Navigation3D
        activeSection={activeSection}
        onHoverSound={playHover}
        onClickSound={playClick}
      />

      {/* Spatial Audio Controller (Top Corner) */}
      <SoundController
        isEnabled={isAudioEnabled}
        onToggle={toggleAudio}
        onHoverSound={playHover}
        onClickSound={playClick}
      />

      {/* Dedicated Floating 3D Control Dock (Bottom Corner: 🌐 Language + 🌙/☀️ Theme) */}
      <FloatingControlDock
        onHoverSound={playHover}
        onClickSound={playClick}
      />

      {/* Master Background 3D World Canvas */}
      <WorldCanvas
        scrollProgress={scrollProgress}
        mouseRef={mouseRef}
        isMobile={deviceTier.isMobile}
        dpr={deviceTier.dpr}
      />

      {/* Semantic Continuous HTML Document Flow (Zero Overlap Guaranteed!) */}
      <main className="relative z-10 flex flex-col w-full">
        <HeroSection
          mouseRef={mouseRef}
          onHoverSound={playHover}
          onClickSound={playClick}
        />

        <AboutSection
          onHoverSound={playHover}
        />

        <SkillsSection
          onHoverSound={playHover}
        />

        <ProjectsSection
          onSelectProject={(proj) => {
            playClick();
            setInspectedProject(proj);
          }}
          onHoverSound={playHover}
          onClickSound={playClick}
        />

        <ExperienceSection
          onHoverSound={playHover}
        />

        <EducationSection
          onHoverSound={playHover}
        />

        <AchievementsSection
          onHoverSound={playHover}
        />

        <ServicesSection
          onHoverSound={playHover}
          onClickSound={playClick}
          onInspectService={(srv) => {
            playClick();
            setInspectedService(srv);
          }}
        />

        <ContactSection
          onHoverSound={playHover}
          onClickSound={playClick}
        />

        <FooterSection
          onHoverSound={playHover}
          onClickSound={playClick}
        />
      </main>

      {/* 3D Project Details Modal Overlay */}
      {inspectedProject && (
        <ProjectModal3D
          project={inspectedProject}
          onClose={() => setInspectedProject(null)}
          onHoverSound={playHover}
          onClickSound={playClick}
        />
      )}

      {/* 3D Service Specifications Modal Overlay */}
      {inspectedService && (
        <ServiceModal3D
          service={inspectedService}
          onClose={() => setInspectedService(null)}
          onHoverSound={playHover}
          onClickSound={playClick}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Main Portfolio - unchanged */}
            <Route path="/" element={<PortfolioApp />} />

            {/* Public: Request a Project */}
            <Route path="/request-project" element={<RequestProjectPage />} />

            {/* Public: Track Request */}
            <Route path="/track-request" element={<TrackRequestPage />} />

            {/* Admin: Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin: Dashboard with nested routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

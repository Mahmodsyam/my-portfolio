import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_CONFIGS = {
  dark: {
    name: 'dark',
    label: 'Dark Theme',
    background: '#040711',
    fogColor: '#040711',
    fogNear: 15,
    fogFar: 140,
    dirLightIntensity: 1.2,
    dirLightColor: '#ffffff',
    ambientIntensity: 0.45,
    ambientColor: '#1e293b',
    pointLight1: '#38bdf8', // Electric Cyan
    pointLight2: '#818cf8', // Indigo
    pointLight3: '#06b6d4', // Teal
    pointLight4: '#3b82f6', // Blue
    particleA: '#38bdf8',
    particleB: '#818cf8',
    particleC: '#06b6d4',
    particleBlending: 2, // AdditiveBlending
    particleColors: ['#38bdf8', '#818cf8', '#06b6d4'],
    cardColor: '#071328',
    cardBorder: '#38bdf8',
    cardOpacity: 0.92,
    cardMetalness: 0.85,
    titleColor: '#ffffff',
    titleGlow: '#38bdf8',
    accent: '#38bdf8',
    hudBg: 'bg-slate-950/80',
    hudBorder: 'border-cyan-500/30',
    hudText: 'text-slate-100'
  },
  light: {
    name: 'light',
    label: 'Light Theme',
    background: '#f8fafc', // Modern Crisp Platinum / Pure Studio White
    fogColor: '#f8fafc',
    fogNear: 15,
    fogFar: 140,
    dirLightIntensity: 2.2,
    dirLightColor: '#ffffff',
    ambientIntensity: 1.1,
    ambientColor: '#e2e8f0',
    pointLight1: '#0284c7', // Sky Blue
    pointLight2: '#4f46e5', // Deep Indigo
    pointLight3: '#0ea5e9', // Cyan
    pointLight4: '#2563eb', // Royal Blue
    particleA: '#0284c7',
    particleB: '#4f46e5',
    particleC: '#0ea5e9',
    particleBlending: 1, // NormalBlending
    particleColors: ['#0284c7', '#4f46e5', '#0ea5e9'],
    cardColor: '#ffffff',
    cardBorder: '#0284c7',
    cardOpacity: 0.95,
    cardMetalness: 0.2,
    titleColor: '#0f172a',
    titleGlow: '#0284c7',
    accent: '#0284c7',
    hudBg: 'bg-white/90',
    hudBorder: 'border-sky-500/30',
    hudText: 'text-slate-900'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('mj_portfolio_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = (th) => {
    if (th !== 'dark' && th !== 'light') return;
    setThemeState(th);
    try {
      localStorage.setItem('mj_portfolio_theme', th);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  const theme3D = THEME_CONFIGS[theme] || THEME_CONFIGS.dark;

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark', 'theme-black', 'theme-beige');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark', 'theme-black', 'theme-beige');
    } else {
      document.documentElement.classList.add('theme-dark', 'theme-black');
      document.documentElement.classList.remove('theme-light', 'theme-beige');
      document.body.classList.add('theme-dark', 'theme-black');
      document.body.classList.remove('theme-light', 'theme-beige');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark,
        isLight,
        isBeige: false,
        theme3D
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

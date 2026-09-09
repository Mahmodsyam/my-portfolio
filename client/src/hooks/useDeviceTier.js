import { useState, useEffect } from 'react';

export const useDeviceTier = () => {
  const [tier, setTier] = useState({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    isLandscape: false,
    dpr: 1.5,
    particleCount: 2500,
    enablePostProcessing: true,
    shadowQuality: 'high',
    reducedMotion: false
  });

  useEffect(() => {
    const checkTier = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = width < 768 || (isTouch && width < 900 && !isLandscape);
      const isTablet = width >= 768 && width < 1024;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Base DPR calculation (cap mobile DPR at 1.5 for performance)
      const rawDpr = window.devicePixelRatio || 1;
      let calculatedDpr = isMobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2.0);

      // Particle count tailored to hardware tier
      const particles = isMobile ? (isLandscape ? 1000 : 800) : isTablet ? 1800 : 3200;

      setTier({
        isMobile,
        isTablet,
        isTouch,
        isLandscape,
        dpr: calculatedDpr,
        particleCount: particles,
        enablePostProcessing: !isMobile && !prefersReducedMotion,
        shadowQuality: isMobile ? 'low' : 'high',
        reducedMotion: prefersReducedMotion
      });
    };

    checkTier();
    window.addEventListener('resize', checkTier, { passive: true });
    window.addEventListener('orientationchange', checkTier, { passive: true });

    return () => {
      window.removeEventListener('resize', checkTier);
      window.removeEventListener('orientationchange', checkTier);
    };
  }, []);

  return tier;
};

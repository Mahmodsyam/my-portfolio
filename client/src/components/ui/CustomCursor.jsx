import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CustomCursor = ({ isTouch = false }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const animFrameRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const { isLight } = useTheme();

  // 1. Detect Desktop environment
  useEffect(() => {
    const checkIsDesktop = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isFine = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(window.innerWidth >= 768 && !isTouch && (!isCoarse || isFine));
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [isTouch]);

  // 2. Smooth Animation Loop using requestAnimationFrame with lerp
  useEffect(() => {
    if (!isDesktop) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      // Linear interpolation for smooth trailing ring
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      // Zero-latency direct transform for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Smooth lag-free transform for ring
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isDesktop]);

  // 3. Mouse Event Listeners & Interactive Element Detection
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      setIsText(Boolean(isInput));

      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(Boolean(isClickable) && !isInput);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
      setIsClicking(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isDesktop, isVisible]);

  if (!isDesktop) return null;

  // Modern subtle styling for Dark & Light modes
  const dotColor = isLight
    ? 'bg-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.7)]'
    : 'bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]';

  const ringBorder = isLight
    ? isHovered
      ? 'border-sky-500/80 bg-sky-500/10 shadow-[0_0_20px_rgba(2,132,199,0.25)]'
      : 'border-sky-600/40 bg-transparent'
    : isHovered
    ? 'border-cyan-400/90 bg-cyan-400/15 shadow-[0_0_25px_rgba(56,189,248,0.4)]'
    : 'border-cyan-400/40 bg-transparent';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Smooth Follower Ring / Magnetic Aura */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border transition-all duration-200 ease-out will-change-transform backdrop-blur-[1px] ${ringBorder} ${
          isText
            ? 'scale-75 opacity-20'
            : isHovered
            ? 'scale-[1.65]'
            : isClicking
            ? 'scale-[0.8] opacity-80'
            : 'scale-100'
        }`}
      />

      {/* Precision Micro-Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full transition-transform duration-150 ease-out will-change-transform ${dotColor} ${
          isText
            ? 'h-4 w-0.5 -mt-2 -ml-[1px] rounded-none'
            : isHovered
            ? 'scale-0'
            : isClicking
            ? 'scale-75'
            : 'scale-100'
        }`}
      />
    </div>
  );
};

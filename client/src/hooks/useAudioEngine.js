import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioEngine = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const ctxRef = useRef(null);
  const ambientOsc1 = useRef(null);
  const ambientOsc2 = useRef(null);
  const ambientGain = useRef(null);

  const initContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctxRef.current = new AudioCtx();
      }
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const toggleAudio = useCallback(() => {
    initContext();
    setIsEnabled((prev) => !prev);
  }, [initContext]);

  // Ambient Space Drone Synthesis
  useEffect(() => {
    if (!isEnabled || !ctxRef.current) {
      if (ambientGain.current) {
        try {
          ambientGain.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5);
        } catch (e) {}
      }
      return;
    }

    try {
      const ctx = ctxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08 * volume, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      ambientGain.current = masterGain;

      // Low frequency drone 1
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      
      // Filter for warm ethereal sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();
      ambientOsc1.current = osc1;

      // Subtle harmonic drone 2
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, ctx.currentTime);
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(330, ctx.currentTime);
      filter2.Q.setValueAtTime(3, ctx.currentTime);

      osc2.connect(filter2);
      filter2.connect(masterGain);
      osc2.start();
      ambientOsc2.current = osc2;
    } catch (e) {
      console.warn('Audio synthesis initialized with fallback');
    }

    return () => {
      try {
        if (ambientOsc1.current) ambientOsc1.current.stop();
        if (ambientOsc2.current) ambientOsc2.current.stop();
      } catch (e) {}
    };
  }, [isEnabled, volume]);

  // UI Hover Tick sound
  const playHover = useCallback(() => {
    if (!isEnabled || !ctxRef.current) return;
    try {
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }, [isEnabled, volume]);

  // UI Click Chime
  const playClick = useCallback(() => {
    if (!isEnabled || !ctxRef.current) return;
    try {
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {}
  }, [isEnabled, volume]);

  // Sector Warp Swoosh
  const playWarp = useCallback(() => {
    if (!isEnabled || !ctxRef.current) return;
    try {
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1 * volume, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } catch (e) {}
  }, [isEnabled, volume]);

  return {
    isEnabled,
    toggleAudio,
    playHover,
    playClick,
    playWarp,
    setVolume
  };
};

import React from 'react';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { Vector2 } from 'three';
import { useTheme } from '../../context/ThemeContext';

export const PostProcessing = ({ enabled = true, isMobile = false }) => {
  const { isLight } = useTheme();
  if (!enabled || isMobile) return null;

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Cinematic Bloom — glowing neon in dark, subtle in light */}
      <Bloom
        intensity={isLight ? 0.5 : 1.1}
        luminanceThreshold={isLight ? 0.72 : 0.22}
        luminanceSmoothing={0.85}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />

      {/* Chromatic Aberration — real lens colour fringe on edges */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(
          isLight ? 0.0004 : 0.0008,
          isLight ? 0.0004 : 0.0008
        )}
        radialModulation={true}
        modulationOffset={0.35}
      />

      {/* Vignette — draw focus toward center */}
      <Vignette
        eskil={false}
        offset={isLight ? 0.1 : 0.18}
        darkness={isLight ? 0.3 : 0.85}
      />
    </EffectComposer>
  );
};

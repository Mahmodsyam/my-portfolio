import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WorldScene } from '../../scenes/WorldScene';
import { useTheme } from '../../context/ThemeContext';

// Keeps fog & clear-color in sync with theme changes
const SceneThemeSync = ({ theme3D }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.setClearColor(theme3D.background, 1);
    if (scene.fog) {
      scene.fog.color.set(theme3D.fogColor);
      // Fog is THREE.Fog (linear) — .near and .far exist
      scene.fog.near = theme3D.fogNear;
      scene.fog.far  = theme3D.fogFar;
    }
  }, [theme3D, gl, scene]);

  return null;
};

export const WorldCanvas = ({
  scrollProgress = 0,
  mouseRef,
  isMobile = false,
  dpr = [1, 2]
}) => {
  const { theme3D } = useTheme();

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 42, near: 0.1, far: 500 }}
        dpr={isMobile ? [1, 1.5] : dpr}
        shadows={!isMobile}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(theme3D.background, 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          // Use linear Fog so SceneThemeSync can update .near / .far
          scene.fog = new THREE.Fog(theme3D.fogColor, theme3D.fogNear, theme3D.fogFar);
        }}
      >
        <SceneThemeSync theme3D={theme3D} />

        <Suspense fallback={null}>
          <WorldScene
            scrollProgress={scrollProgress}
            mouseRef={mouseRef}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

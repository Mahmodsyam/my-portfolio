import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleFieldShader } from '../../shaders/particleShader';
import { useTheme } from '../../context/ThemeContext';

/**
 * Creates geometry attributes for a particle layer.
 * @param {number} count - Number of particles
 * @param {object} opts  - Spread, depth, size range, speed range
 */
function buildParticleGeometry(count, opts = {}) {
  const {
    spreadX  = 80,
    spreadY  = 60,
    depthMin = -450,
    depthMax = 10,
    sizeMin  = 0.2,
    sizeMax  = 1.1,
    speedMin = 0.5,
    speedMax = 1.5,
  } = opts;

  const pos   = new Float32Array(count * 3);
  const scale = new Float32Array(count);
  const rnd   = new Float32Array(count);
  const speed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (Math.random() - 0.5) * spreadX;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    pos[i * 3 + 2] = depthMin + Math.random() * (depthMax - depthMin);

    scale[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
    rnd[i]   = Math.random();
    speed[i] = speedMin + Math.random() * (speedMax - speedMin);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,   3));
  geo.setAttribute('aScale',   new THREE.BufferAttribute(scale, 1));
  geo.setAttribute('aRandom',  new THREE.BufferAttribute(rnd,   1));
  geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speed, 1));
  return geo;
}

// ─── Main cosmic layer (large glowing nebula clouds) ─────────────────────────
const NebulaLayer = ({ count, mouseRef, shaderMaterial }) => {
  const ref = useRef();
  const geo = useMemo(
    () =>
      buildParticleGeometry(count, {
        spreadX: 90, spreadY: 65,
        depthMin: -460, depthMax: 12,
        sizeMin: 0.35, sizeMax: 1.3,
        speedMin: 0.4, speedMax: 1.2,
      }),
    [count]
  );

  useFrame((state) => {
    if (!shaderMaterial) return;
    shaderMaterial.uniforms.uTime.value       = state.clock.getElapsedTime();
    shaderMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    if (mouseRef?.current) {
      shaderMaterial.uniforms.uMouse.value.x = mouseRef.current.x;
      shaderMaterial.uniforms.uMouse.value.y = mouseRef.current.y;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
};

// ─── Distant star layer (tiny, fast-twinkling, high density) ─────────────────
const StarLayer = ({ count, starMaterial }) => {
  const ref = useRef();
  const geo = useMemo(
    () =>
      buildParticleGeometry(count, {
        spreadX: 120, spreadY: 90,
        depthMin: -480, depthMax: -5,
        sizeMin: 0.08, sizeMax: 0.45,
        speedMin: 1.0, speedMax: 2.0,
      }),
    [count]
  );

  useFrame((state) => {
    if (!starMaterial) return;
    starMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points ref={ref} geometry={geo}>
      <primitive object={starMaterial} attach="material" />
    </points>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const ParticleUniverse = ({ count = 3000, mouseRef }) => {
  const { theme3D, isBeige } = useTheme();

  // Primary nebula shader (full colour + mouse repulsion)
  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms:       THREE.UniformsUtils.clone(ParticleFieldShader.uniforms),
      vertexShader:   ParticleFieldShader.vertexShader,
      fragmentShader: ParticleFieldShader.fragmentShader,
      transparent:    true,
      depthWrite:     false,
      blending:       isBeige ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    return mat;
  }, [isBeige]);

  // Minimal star shader — tiny bright dots, no mouse interaction needed
  const starMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uPixelRatio: { value: 1 },
        uSize:       { value: 18.0 },
        uMouse:      { value: new THREE.Vector2(0, 0) },
        uColorA:     { value: new THREE.Color('#e0f2fe') },
        uColorB:     { value: new THREE.Color('#bae6fd') },
        uColorC:     { value: new THREE.Color('#f0fdff') },
        uScrollZ:    { value: 0 },
      },
      vertexShader:   ParticleFieldShader.vertexShader,
      fragmentShader: ParticleFieldShader.fragmentShader,
      transparent:    true,
      depthWrite:     false,
      blending:       isBeige ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    return mat;
  }, [isBeige]);

  // Sync colours whenever theme changes
  useEffect(() => {
    if (shaderMaterial && theme3D?.particleColors) {
      shaderMaterial.uniforms.uColorA.value.set(theme3D.particleColors[0]);
      shaderMaterial.uniforms.uColorB.value.set(theme3D.particleColors[1]);
      shaderMaterial.uniforms.uColorC.value.set(theme3D.particleColors[2]);
      shaderMaterial.blending  = isBeige ? THREE.NormalBlending : THREE.AdditiveBlending;
      shaderMaterial.needsUpdate = true;
    }
    if (starMaterial) {
      starMaterial.blending  = isBeige ? THREE.NormalBlending : THREE.AdditiveBlending;
      starMaterial.needsUpdate = true;
    }
  }, [theme3D, isBeige, shaderMaterial, starMaterial]);

  const nebulaCount = Math.round(count * 0.65);
  const starCount   = Math.round(count * 0.45);

  return (
    <>
      {/* Primary coloured nebula particles */}
      <NebulaLayer
        count={nebulaCount}
        mouseRef={mouseRef}
        shaderMaterial={shaderMaterial}
      />

      {/* Distant white/blue star field */}
      <StarLayer
        count={starCount}
        starMaterial={starMaterial}
      />
    </>
  );
};

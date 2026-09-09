import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleUniverse } from '../components/3d/ParticleUniverse';
import { PostProcessing } from '../components/3d/PostProcessing';
import { useTheme } from '../context/ThemeContext';

// ─── Cinematic Camera Controller ─────────────────────────────────────────────
// Single source of truth for camera. Uses a Catmull-Rom spline driven by
// scrollProgress (0→1), layered with:
//   • Mouse parallax  (smooth lerp, clamped)
//   • Organic breathing sway (sin/cos at low freq)
const CinematicCamera = ({ scrollProgress, mouseRef }) => {
  const posSpline = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0,    0,    12),
          new THREE.Vector3(3.5,  1.5,  4),
          new THREE.Vector3(-3,  -1,   -6),
          new THREE.Vector3(0,    2,   -16),
          new THREE.Vector3(4,   -1,   -26),
          new THREE.Vector3(-4,   1.5, -36),
          new THREE.Vector3(0,   -2,   -46),
          new THREE.Vector3(3,    1,   -56),
          new THREE.Vector3(-3,  -1.5, -66),
          new THREE.Vector3(0,    0,   -76),
        ],
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  const lookSpline = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0,    0,    0),
          new THREE.Vector3(1.5,  0.5, -4),
          new THREE.Vector3(-1.5,-0.5, -12),
          new THREE.Vector3(0,    0.8, -22),
          new THREE.Vector3(2,   -0.5, -32),
          new THREE.Vector3(-2,   0.5, -42),
          new THREE.Vector3(0,   -0.8, -52),
          new THREE.Vector3(1.5,  0.5, -62),
          new THREE.Vector3(-1.5,-0.5, -72),
          new THREE.Vector3(0,    0,   -82),
        ],
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  const camPos    = useRef(new THREE.Vector3(0, 0, 12));
  const camLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos   = useRef(new THREE.Vector3(0, 0, 12));
  const targetLook  = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, _delta) => {
    const t    = THREE.MathUtils.clamp(scrollProgress, 0, 0.999);
    const time = state.clock.getElapsedTime();

    // 1. Base spline position
    posSpline.getPointAt(t,  targetPos.current);
    lookSpline.getPointAt(t, targetLook.current);

    // 2. Organic hand-held breathing sway
    targetPos.current.x += Math.sin(time * 0.31) * 0.12;
    targetPos.current.y += Math.cos(time * 0.23) * 0.08;
    targetPos.current.z += Math.sin(time * 0.17) * 0.06;

    // 3. Mouse parallax (clamped to avoid jitter)
    const mx = THREE.MathUtils.clamp(mouseRef?.current?.x ?? 0, -1, 1);
    const my = THREE.MathUtils.clamp(mouseRef?.current?.y ?? 0, -1, 1);
    targetPos.current.x += mx * 0.65;
    targetPos.current.y += my * 0.4;

    // 4. Smooth lerp — 0.032 = very cinematic
    camPos.current.lerp(targetPos.current,    0.032);
    camLookAt.current.lerp(targetLook.current, 0.025);

    state.camera.position.copy(camPos.current);
    state.camera.lookAt(camLookAt.current);
  });

  return null;
};

// ─── Orbiting Dynamic Lights ──────────────────────────────────────────────────
const OrbitingLights = ({ theme3D, isLight }) => {
  const light1Ref = useRef();
  const light2Ref = useRef();
  const light3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (light1Ref.current) {
      light1Ref.current.position.set(
        Math.sin(t * 0.22) * 14,
        Math.cos(t * 0.18) * 7 + 4,
        Math.cos(t * 0.22) * 8
      );
      light1Ref.current.intensity = (isLight ? 5 : 10) + Math.sin(t * 0.6) * (isLight ? 1.5 : 3);
    }
    if (light2Ref.current) {
      light2Ref.current.position.set(
        Math.cos(t * 0.31) * 10,
        Math.sin(t * 0.31) * 12 - 3,
        Math.sin(t * 0.28) * 10 - 8
      );
      light2Ref.current.intensity = (isLight ? 4 : 8) + Math.cos(t * 0.8) * (isLight ? 1 : 2.5);
    }
    if (light3Ref.current) {
      const s = Math.sin(t * 0.45);
      light3Ref.current.position.set(
        Math.sin(t * 0.45) * 12,
        s * Math.cos(t * 0.45) * 5,
        Math.cos(t * 0.45) * 10 - 14
      );
      light3Ref.current.intensity = (isLight ? 3 : 7) + Math.sin(t * 1.1) * (isLight ? 1 : 2);
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color={theme3D.pointLight1} distance={40} decay={1.8} />
      <pointLight ref={light2Ref} color={theme3D.pointLight2} distance={35} decay={1.8} />
      <pointLight ref={light3Ref} color={theme3D.pointLight3} distance={45} decay={1.6} />
    </>
  );
};

// ─── Floating Geometric Objects ───────────────────────────────────────────────
const GeometricAmbient = ({ theme3D, isLight }) => {
  const groupRef  = useRef();
  const torusRef  = useRef();
  const icoRef    = useRef();
  const octaRef   = useRef();
  // refs on MESH (not material) so .material access works correctly
  const sphereMeshRef = useRef();
  const gridMeshRef   = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current)  groupRef.current.rotation.y = time * 0.04;

    if (torusRef.current) {
      torusRef.current.rotation.z += delta * 0.18;
      torusRef.current.rotation.x  = Math.sin(time * 0.25) * 0.4;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y += delta * 0.28;
      icoRef.current.rotation.z += delta * 0.14;
    }
    if (octaRef.current) {
      octaRef.current.rotation.x += delta * 0.22;
      octaRef.current.rotation.y -= delta * 0.18;
    }

    // Access material through the mesh ref
    if (sphereMeshRef.current?.material) {
      sphereMeshRef.current.material.emissiveIntensity =
        (isLight ? 1.2 : 2.2) + Math.sin(time * 1.4) * (isLight ? 0.5 : 1.0);
    }
    if (gridMeshRef.current?.material) {
      gridMeshRef.current.material.opacity =
        (isLight ? 0.12 : 0.22) + Math.sin(time * 0.5) * 0.05;
    }
  });

  const accent1 = theme3D.pointLight1;
  const accent2 = theme3D.pointLight2;

  return (
    <group ref={groupRef}>

      {/* Large iridescent torus ring */}
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
        <mesh ref={torusRef} position={[-7, 3.5, 2]}>
          <torusGeometry args={[2.8, 0.055, 20, 80]} />
          <meshPhysicalMaterial
            color={accent1}
            emissive={accent1}
            emissiveIntensity={isLight ? 0.9 : 1.8}
            metalness={0.8}
            roughness={0.15}
            iridescence={1.0}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[100, 400]}
            transparent
            opacity={0.75}
          />
        </mesh>
      </Float>

      {/* Wireframe icosahedron — holographic */}
      <Float speed={1.9} rotationIntensity={0.5} floatIntensity={0.65}>
        <mesh ref={icoRef} position={[7.5, -2.5, -5]}>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshPhysicalMaterial
            color={accent2}
            emissive={accent2}
            emissiveIntensity={isLight ? 0.6 : 1.3}
            metalness={0.9}
            roughness={0.05}
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      </Float>

      {/* Glass octahedron — refractive */}
      <Float speed={2.1} rotationIntensity={0.4} floatIntensity={0.45}>
        <mesh ref={octaRef} position={[-8.5, -8, -14]}>
          <octahedronGeometry args={[2.4, 0]} />
          <meshPhysicalMaterial
            color={isLight ? '#e0f2fe' : '#0c2040'}
            metalness={0.15}
            roughness={0.08}
            transmission={0.82}
            ior={1.52}
            thickness={1.5}
            transparent
            opacity={0.88}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>
      </Float>

      {/* Glowing energy sphere — ref on MESH so .material works */}
      <Float speed={1.7} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh ref={sphereMeshRef} position={[6.5, -15, -22]}>
          <sphereGeometry args={[1.7, 48, 48]} />
          <meshStandardMaterial
            color={isLight ? '#f59e0b' : '#fbbf24'}
            emissive={isLight ? '#d97706' : '#f59e0b'}
            emissiveIntensity={isLight ? 1.5 : 2.5}
            roughness={0.25}
            metalness={0.5}
            transparent
            opacity={0.65}
          />
        </mesh>
      </Float>

      {/* Accent torus ring */}
      <Float speed={2.4} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh position={[5, 8, -10]}>
          <torusGeometry args={[1.5, 0.04, 14, 60]} />
          <meshStandardMaterial
            color={theme3D.pointLight3}
            emissive={theme3D.pointLight3}
            emissiveIntensity={isLight ? 1.0 : 2.0}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Holographic contact grid — ref on MESH */}
      <mesh ref={gridMeshRef} position={[0, -24, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50, 36, 36]} />
        <meshStandardMaterial
          color={accent1}
          wireframe
          transparent
          opacity={isLight ? 0.12 : 0.22}
        />
      </mesh>
    </group>
  );
};

// ─── World Scene Root ─────────────────────────────────────────────────────────
export const WorldScene = ({ scrollProgress = 0, mouseRef, isMobile = false }) => {
  const { theme3D, isLight } = useTheme();

  return (
    <>
      {/* ── Cinematic Camera ── */}
      <CinematicCamera scrollProgress={scrollProgress} mouseRef={mouseRef} />

      {/* ── Atmospheric Lighting ── */}
      <ambientLight color={theme3D.ambientColor} intensity={theme3D.ambientIntensity} />

      <directionalLight
        position={[12, 22, 18]}
        intensity={theme3D.dirLightIntensity}
        color={theme3D.dirLightColor}
        castShadow={!isMobile}
      />

      <directionalLight
        position={[-12, -10, -12]}
        intensity={theme3D.dirLightIntensity * 0.35}
        color={theme3D.pointLight2}
      />

      {/* Bounce hemisphere light — warm/cool gradient from ground up */}
      <hemisphereLight
        skyColor={isLight ? '#e0f2fe' : '#0f172a'}
        groundColor={isLight ? '#fbbf24' : '#1e1b4b'}
        intensity={isLight ? 0.6 : 0.4}
      />

      {/* ── Orbiting Dynamic Lights (desktop only) ── */}
      {!isMobile && <OrbitingLights theme3D={theme3D} isLight={isLight} />}

      {/* Static fill lights for mobile */}
      {isMobile && (
        <>
          <pointLight position={[-8, 6, 4]}  intensity={isLight ? 4 : 8}  distance={30} color={theme3D.pointLight1} />
          <pointLight position={[8, -6, -4]} intensity={isLight ? 3 : 6}  distance={25} color={theme3D.pointLight2} />
        </>
      )}

      {/* ── Cosmic Particle Cloud ── */}
      <ParticleUniverse count={isMobile ? 1400 : 4200} mouseRef={mouseRef} />

      {/* ── Geometric Ambient Objects ── */}
      <GeometricAmbient theme3D={theme3D} isLight={isLight} />

      {/* ── Post Processing ── */}
      <PostProcessing enabled={!isMobile} isMobile={isMobile} />
    </>
  );
};

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, RoundedBox } from '@react-three/drei';
import { PortraitDepthShaderMaterial } from '../../shaders/portraitDepthShader';
import { useTheme } from '../../context/ThemeContext';

export const Portrait3D = ({ position = [0, 0, 0], scale = 1, mouseRef }) => {
  const meshRef = useRef();
  const frameRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const [hovered, setHovered] = useState(false);
  const [loadedTexture, setLoadedTexture] = useState(null);
  const { theme3D, isLight } = useTheme();

  // Safe async Texture Loading with fallback
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/mahmoud.png',
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        setLoadedTexture(tex);
      },
      undefined,
      (err) => {
        console.warn('Failed to load /assets/mahmoud.png directly, retrying relative path', err);
        loader.load('assets/mahmoud.png', (tex) => setLoadedTexture(tex));
      }
    );
  }, []);

  // Custom Shader Material instance
  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(PortraitDepthShaderMaterial.uniforms),
      vertexShader: PortraitDepthShaderMaterial.vertexShader,
      fragmentShader: PortraitDepthShaderMaterial.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });
    return mat;
  }, []);

  useEffect(() => {
    if (loadedTexture && shaderMaterial) {
      shaderMaterial.uniforms.uTexture.value = loadedTexture;
      shaderMaterial.needsUpdate = true;
    }
  }, [loadedTexture, shaderMaterial]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    shaderMaterial.uniforms.uTime.value = time;

    // Smooth mouse lerping
    const targetMouseX = mouseRef?.current?.x || 0;
    const targetMouseY = mouseRef?.current?.y || 0;

    shaderMaterial.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uMouse.value.x,
      targetMouseX,
      0.08
    );
    shaderMaterial.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uMouse.value.y,
      targetMouseY,
      0.08
    );

    // Hover state transition
    shaderMaterial.uniforms.uHover.value = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uHover.value,
      hovered ? 1.0 : 0.0,
      0.1
    );

    // 3D Glass Frame Parallax Tilt
    if (frameRef.current) {
      frameRef.current.rotation.y = THREE.MathUtils.lerp(
        frameRef.current.rotation.y,
        targetMouseX * 0.25,
        0.05
      );
      frameRef.current.rotation.x = THREE.MathUtils.lerp(
        frameRef.current.rotation.x,
        -targetMouseY * 0.2,
        0.05
      );
    }

    // Orbiting Cyber Rings
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.3;
      ringRef1.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.25;
      ringRef2.current.rotation.y = Math.cos(time * 0.4) * 0.2;
    }
  });

  const accentColor = isLight ? '#0284c7' : '#38bdf8';
  const secondaryAccent = isLight ? '#4f46e5' : '#818cf8';

  return (
    <group position={position} scale={scale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group
          ref={frameRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Main 3D Depth Plane */}
          <mesh ref={meshRef} position={[0, 0, 0.05]}>
            <planeGeometry args={[4.2, 4.2, 64, 64]} />
            <primitive object={shaderMaterial} attach="material" />
          </mesh>

          {/* Premium Glass Outer Bezel */}
          <RoundedBox
            args={[4.45, 4.45, 0.2]}
            radius={0.12}
            smoothness={4}
            position={[0, 0, -0.02]}
          >
            <meshPhysicalMaterial
              color={isLight ? '#ffffff' : '#0f172a'}
              roughness={0.12}
              metalness={isLight ? 0.1 : 0.8}
              transmission={isLight ? 0.3 : 0.4}
              ior={1.5}
              transparent
              opacity={isLight ? 0.98 : 0.92}
              reflectivity={0.9}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </RoundedBox>

          {/* Glowing Metallic Rim Border */}
          <mesh position={[0, 0, 0.09]}>
            <ringGeometry args={[2.18, 2.22, 64]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={hovered ? (isLight ? 1.5 : 2.5) : (isLight ? 0.8 : 1.2)}
              toneMapped={false}
            />
          </mesh>

          {/* Sci-Fi Corner Brackets */}
          {[
            [-2.15, 2.15, 0.1],
            [2.15, 2.15, 0.1],
            [-2.15, -2.15, 0.1],
            [2.15, -2.15, 0.1]
          ].map((pos, idx) => (
            <group key={idx} position={pos}>
              <mesh>
                <boxGeometry args={[0.35, 0.04, 0.04]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentColor}
                  emissiveIntensity={isLight ? 1.2 : 1.8}
                />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.35, 0.04]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentColor}
                  emissiveIntensity={isLight ? 1.2 : 1.8}
                />
              </mesh>
            </group>
          ))}

          {/* Orbital Holographic Rings */}
          <mesh ref={ringRef1} position={[0, 0, -0.1]}>
            <torusGeometry args={[2.7, 0.015, 16, 64]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={hovered ? (isLight ? 1.4 : 2.2) : (isLight ? 0.6 : 0.9)}
              transparent
              opacity={isLight ? 0.4 : 0.6}
            />
          </mesh>
          <mesh ref={ringRef2} position={[0, 0, -0.15]}>
            <torusGeometry args={[3.1, 0.012, 16, 64]} />
            <meshStandardMaterial
              color={secondaryAccent}
              emissive={secondaryAccent}
              emissiveIntensity={hovered ? (isLight ? 1.2 : 1.8) : (isLight ? 0.5 : 0.7)}
              transparent
              opacity={isLight ? 0.35 : 0.45}
            />
          </mesh>

          {/* Local Volumetric Rim Spotlight */}
          <pointLight
            position={[1.5, 2, 2.5]}
            intensity={hovered ? 8 : 4}
            distance={10}
            color={accentColor}
          />
          <pointLight
            position={[-2, -1.5, 1.5]}
            intensity={hovered ? 5 : 2.5}
            distance={8}
            color={secondaryAccent}
          />
        </group>
      </Float>
    </group>
  );
};

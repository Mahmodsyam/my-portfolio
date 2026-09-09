import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Portrait3D } from './Portrait3D';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorHero = ({ mouseRef, onNavigate }) => {
  const cubeRef = useRef();
  const ringRef = useRef();
  const octaRef = useRef();

  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.4;
      cubeRef.current.rotation.y += delta * 0.5;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y -= delta * 0.3;
      octaRef.current.rotation.z += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Centerpiece Portrait of Mahmoud Jihad */}
      <Portrait3D
        position={[isRTL ? -2.6 : 2.6, 0.2, 0]}
        scale={0.92}
        mouseRef={mouseRef}
      />

      {/* 3D Main Typography */}
      <group position={[isRTL ? 2.8 : -2.8, 0.4, 0]}>
        <Text3DTitle
          text={t.personal.name}
          subtitle={t.personal.role}
          position={[0, 0.6, 0]}
          size={isRTL ? 0.68 : 0.65}
          subtitleSize={isRTL ? 0.2 : 0.22}
          glowColor={theme3D.titleGlow}
          align="center"
          mouseRef={mouseRef}
        />

        {/* Floating 3D Title Pills */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, -0.6, 0.1]}>
            <RoundedBox args={[4.6, 0.58, 0.08]} radius={0.08} smoothness={4}>
              <meshPhysicalMaterial
                color={isBeige ? '#ffffff' : '#0c1322'}
                metalness={isBeige ? 0.3 : 0.7}
                roughness={0.2}
                transmission={isBeige ? 0.2 : 0.3}
                transparent
                opacity={isBeige ? 0.95 : 0.85}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.06]}
              fontSize={isRTL ? 0.15 : 0.16}
              font={fontUrl}
              letterSpacing={isRTL ? 0 : 0.04}
              color={isBeige ? '#b45309' : '#38bdf8'}
              anchorX="center"
              anchorY="middle"
            >
              {isRTL
                ? 'مطور ويب شامل • حلول سحابية • تجارب ثلاثية الأبعاد مبهرة'
                : 'Full-Stack Architect • Cloud Systems • 3D Interactive Web'}
            </Text>
          </group>
        </Float>

        {/* 3D Interactive CTA Buttons */}
        <group position={[0, -1.45, 0.2]}>
          {/* Explore Work 3D Button */}
          <group
            position={[isRTL ? 1.25 : -1.25, 0, 0]}
            onClick={() => onNavigate && onNavigate(3)}
          >
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              <RoundedBox args={[2.3, 0.62, 0.12]} radius={0.1} smoothness={4}>
                <meshStandardMaterial
                  color={isBeige ? '#d97706' : '#0284c7'}
                  emissive={isBeige ? '#b45309' : '#0284c7'}
                  emissiveIntensity={isBeige ? 0.5 : 0.7}
                  metalness={0.8}
                  roughness={0.2}
                />
              </RoundedBox>
              <Text
                position={[0, 0, 0.08]}
                fontSize={isRTL ? 0.15 : 0.16}
                font={fontUrl}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {t.common.exploreWork}
              </Text>
            </Float>
          </group>

          {/* Contact Me 3D Button */}
          <group
            position={[isRTL ? -1.25 : 1.25, 0, 0]}
            onClick={() => onNavigate && onNavigate(9)}
          >
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              <RoundedBox args={[2.3, 0.62, 0.12]} radius={0.1} smoothness={4}>
                <meshPhysicalMaterial
                  color={isBeige ? '#faf8f5' : '#0f172a'}
                  metalness={isBeige ? 0.4 : 0.9}
                  roughness={0.2}
                  transmission={0.4}
                  transparent
                  opacity={0.92}
                />
              </RoundedBox>
              <Text
                position={[0, 0, 0.08]}
                fontSize={isRTL ? 0.15 : 0.16}
                font={fontUrl}
                color={isBeige ? '#78350f' : '#38bdf8'}
                anchorX="center"
                anchorY="middle"
              >
                {t.common.contactStation}
              </Text>
            </Float>
          </group>
        </group>
      </group>

      {/* Floating 3D Geometric Ambient Elements */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={cubeRef} position={[-5.5, 2.5, -2]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color={theme3D.pointLight1}
            wireframe
            emissive={theme3D.pointLight1}
            emissiveIntensity={isBeige ? 0.8 : 1.2}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh ref={octaRef} position={[5.5, -2.2, -1]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={theme3D.pointLight2}
            wireframe
            emissive={theme3D.pointLight2}
            emissiveIntensity={isBeige ? 0.7 : 1.0}
          />
        </mesh>
      </Float>

      {/* Background Holographic Ring */}
      <mesh ref={ringRef} position={[0, 0, -5]}>
        <torusGeometry args={[8, 0.03, 16, 100]} />
        <meshBasicMaterial color={isBeige ? '#d97706' : '#0284c7'} transparent opacity={isBeige ? 0.15 : 0.25} />
      </mesh>
    </group>
  );
};

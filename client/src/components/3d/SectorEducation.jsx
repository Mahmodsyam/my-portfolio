import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorEducation = ({ mouseRef, onHoverSound }) => {
  const capRef = useRef();
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  useFrame((state, delta) => {
    if (capRef.current) {
      capRef.current.rotation.y += delta * 0.5;
    }
  });

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const edu = t.education || {};

  return (
    <group position={[-10, 0, -240]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "الأساس الهندسي والخبرة" : "ENGINEERING CITADEL"}
        subtitle={isRTL ? "هندسة البرمجيات والأنظمة التفاعلية الحديثة" : "SOFTWARE ENGINEERING & MODERN WEB ARCHITECTURE"}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.65 : 0.6}
        subtitleSize={isRTL ? 0.2 : 0.2}
        glowColor="#f59e0b"
        align="center"
        mouseRef={mouseRef}
      />

      {/* 3D Graduation Cap Emblem */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={capRef} position={[0, 2.2, 0]}>
          {/* Mortarboard square */}
          <mesh rotation={[Math.PI / 8, 0, 0]}>
            <boxGeometry args={[1.5, 0.06, 1.5]} />
            <meshStandardMaterial color={isBeige ? '#292524' : '#0f172a'} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Skull cap */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
            <meshStandardMaterial color={isBeige ? '#292524' : '#0f172a'} metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Golden Tassel */}
          <mesh position={[0.7, -0.2, 0.7]}>
            <cylinderGeometry args={[0.02, 0.04, 0.6, 16]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </Float>

      {/* Main Holographic Degree Card */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[isRTL ? 2.4 : -2.2, -0.5, 0]}>
          <RoundedBox args={[4.8, 2.8, 0.15]} radius={0.12} smoothness={4}>
            <meshPhysicalMaterial
              color={isBeige ? '#ffffff' : '#07142a'}
              metalness={isBeige ? 0.3 : 0.85}
              roughness={0.15}
              transmission={isBeige ? 0.25 : 0.4}
              transparent
              opacity={isBeige ? 0.95 : 0.94}
              clearcoat={1}
            />
          </RoundedBox>

          <Text
            position={[isRTL ? 2.1 : -2.1, 0.85, 0.1]}
            fontSize={isRTL ? 0.22 : 0.2}
            font={fontUrl}
            color={isBeige ? '#b45309' : '#38bdf8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {edu.institution}
          </Text>

          <Text
            position={[isRTL ? 2.1 : -2.1, 0.45, 0.1]}
            fontSize={isRTL ? 0.14 : 0.14}
            font={fontUrl}
            color={isBeige ? '#78716c' : '#94a3b8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {edu.college}
          </Text>

          <Text
            position={[isRTL ? 2.1 : -2.1, 0.05, 0.1]}
            fontSize={isRTL ? 0.14 : 0.15}
            font={fontUrl}
            color={isBeige ? '#1c1917' : '#ffffff'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {edu.department}
          </Text>

          <Text
            position={[isRTL ? 2.1 : -2.1, -0.55, 0.1]}
            fontSize={isRTL ? 0.14 : 0.15}
            font={fontUrl}
            color="#f59e0b"
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            ★ {edu.standing}
          </Text>

          {/* Card Border */}
          <lineSegments position={[0, 0, 0.08]}>
            <edgesGeometry args={[new THREE.BoxGeometry(4.8, 2.8, 0.02)]} />
            <lineBasicMaterial color={isBeige ? '#d97706' : '#38bdf8'} transparent opacity={isBeige ? 0.5 : 0.3} />
          </lineSegments>
        </group>
      </Float>

      {/* Floating 1st in Cohort Golden Badge */}
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          position={[isRTL ? -2.5 : 2.5, -0.5, 0.2]}
          onPointerOver={() => onHoverSound?.()}
        >
          <mesh>
            <cylinderGeometry args={[1.3, 1.3, 0.12, 64]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.6}
            />
          </mesh>
          <Text
            position={[0, 0.35, 0.1]}
            fontSize={isRTL ? 0.22 : 0.26}
            font={fontUrl}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {isRTL ? "حلول متكاملة" : "FULL-STACK"}
          </Text>
          <Text
            position={[0, -0.05, 0.1]}
            fontSize={isRTL ? 0.14 : 0.13}
            font={fontUrl}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
          >
            {isRTL ? "عالية الأداء" : "HIGH PERFORMANCE"}
          </Text>
          <Text
            position={[0, -0.38, 0.1]}
            fontSize={isRTL ? 0.12 : 0.11}
            font={fontUrl}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            {isRTL ? "ابتكار وجودة" : "PRO QUALITY"}
          </Text>
        </group>
      </Float>
    </group>
  );
};

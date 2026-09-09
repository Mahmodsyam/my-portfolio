import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorAbout = ({ mouseRef }) => {
  const trophyRef = useRef();
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  useFrame((state, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 0.4;
    }
  });

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;

  return (
    <group position={[8, 0, -40]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "عن المهندس والحلول الرقمية" : "EXPERTISE & VALUE"}
        subtitle={isRTL ? "بناء حلول برمجية مبتكرة ومواقع تفاعلية تنقل أعمالك للمستوى التالي" : "HIGH-CONVERTING WEB PLATFORMS & INTERACTIVE SOLUTIONS"}
        position={[0, 3.2, 0]}
        size={isRTL ? 0.58 : 0.55}
        subtitleSize={isRTL ? 0.18 : 0.18}
        glowColor={theme3D.titleGlow}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Floating 3D Main Bio Card */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <group position={[isRTL ? 2.4 : -2.4, 0.4, 0]}>
          <RoundedBox args={[4.8, 3.3, 0.15]} radius={0.15} smoothness={4}>
            <meshPhysicalMaterial
              color={isBeige ? '#ffffff' : '#0b1329'}
              metalness={isBeige ? 0.3 : 0.8}
              roughness={0.2}
              transmission={isBeige ? 0.25 : 0.4}
              transparent
              opacity={isBeige ? 0.94 : 0.92}
              reflectivity={0.8}
              clearcoat={1}
            />
          </RoundedBox>

          <Text
            position={[isRTL ? 2.0 : -2.0, 1.15, 0.1]}
            fontSize={0.24}
            font={fontUrl}
            letterSpacing={isRTL ? 0 : 0.04}
            color={isBeige ? '#b45309' : '#38bdf8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {t.personal.name}
          </Text>

          <Text
            position={[isRTL ? 2.0 : -2.0, 0.75, 0.1]}
            fontSize={0.14}
            font={fontUrl}
            color={isBeige ? '#78716c' : '#94a3b8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {t.personal.role}
          </Text>

          <Text
            position={[isRTL ? 2.0 : -2.0, -0.15, 0.1]}
            fontSize={isRTL ? 0.125 : 0.13}
            font={fontUrl}
            maxWidth={4.0}
            lineHeight={1.45}
            color={isBeige ? '#292524' : '#e2e8f0'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="top"
            textAlign={isRTL ? 'right' : 'left'}
          >
            {t.personal.bio}
          </Text>

          {/* Border Glow */}
          <lineSegments position={[0, 0, 0.08]}>
            <edgesGeometry args={[new THREE.BoxGeometry(4.8, 3.3, 0.02)]} />
            <lineBasicMaterial color={isBeige ? '#d97706' : '#38bdf8'} transparent opacity={isBeige ? 0.5 : 0.4} />
          </lineSegments>
        </group>
      </Float>

      {/* Floating 3D Achievement Pods */}
      <group position={[isRTL ? -2.8 : 2.8, 0.4, 0]}>
        {t.personal.achievements.map((ach, idx) => (
          <Float
            key={idx}
            speed={2 + idx * 0.3}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <group position={[0, 1.1 - idx * 1.2, idx * 0.3]}>
              <RoundedBox args={[4.4, 0.98, 0.12]} radius={0.1} smoothness={4}>
                <meshPhysicalMaterial
                  color={isBeige ? '#faf8f5' : '#091834'}
                  metalness={isBeige ? 0.3 : 0.75}
                  roughness={0.25}
                  transmission={isBeige ? 0.25 : 0.3}
                  transparent
                  opacity={isBeige ? 0.95 : 0.88}
                />
              </RoundedBox>

              {/* Glowing Medal Tag */}
              <mesh position={[isRTL ? 1.75 : -1.75, 0, 0.08]}>
                <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  emissive="#f59e0b"
                  emissiveIntensity={0.8}
                  metalness={0.9}
                />
              </mesh>

              <Text
                position={[isRTL ? 1.35 : -1.35, 0.18, 0.08]}
                fontSize={isRTL ? 0.16 : 0.18}
                font={fontUrl}
                color={isBeige ? '#1c1917' : '#ffffff'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
              >
                {ach.title}
              </Text>

              <Text
                position={[isRTL ? 1.35 : -1.35, -0.18, 0.08]}
                fontSize={isRTL ? 0.11 : 0.12}
                font={fontUrl}
                maxWidth={2.8}
                color={isBeige ? '#57534e' : '#94a3b8'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {ach.detail}
              </Text>

              {/* Edge glow */}
              <lineSegments position={[0, 0, 0.07]}>
                <edgesGeometry args={[new THREE.BoxGeometry(4.4, 0.98, 0.02)]} />
                <lineBasicMaterial color={idx === 0 ? "#f59e0b" : (isBeige ? '#d97706' : '#38bdf8')} transparent opacity={0.6} />
              </lineSegments>
            </group>
          </Float>
        ))}
      </group>

      {/* 3D Rotating Golden Achievement Star/Emblem */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={trophyRef} position={[0, -2.2, 0.5]}>
          <mesh>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[0.8, 0.02, 16, 32]} />
            <meshStandardMaterial color={isBeige ? '#d97706' : '#38bdf8'} emissive={isBeige ? '#d97706' : '#38bdf8'} emissiveIntensity={0.8} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

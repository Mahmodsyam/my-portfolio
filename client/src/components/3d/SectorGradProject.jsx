import React from 'react';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorGradProject = ({ mouseRef, onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const gradProject = t.education?.graduationProject || { supervisors: [] };

  return (
    <group position={[10, 0, -340]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "المشروع الهندسي الرائد" : "FLAGSHIP CAPSTONE"}
        subtitle={isRTL ? "منظومة ويب متكاملة فائقة السرعة والتفاعل مصممة لأعلى معايير السوق" : "ENTERPRISE-GRADE WEB PLATFORM BUILT FOR SCALE & CONVERSION"}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.62 : 0.52}
        subtitleSize={isRTL ? 0.18 : 0.18}
        glowColor={theme3D.pointLight3}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Main Project Holo-Screen */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
        <group position={[isRTL ? 2.4 : -2.4, 0.2, 0]}>
          <RoundedBox args={[5.0, 3.4, 0.15]} radius={0.12} smoothness={4}>
            <meshPhysicalMaterial
              color={isBeige ? '#ffffff' : '#071328'}
              metalness={isBeige ? 0.3 : 0.85}
              roughness={0.18}
              transmission={isBeige ? 0.25 : 0.4}
              transparent
              opacity={isBeige ? 0.95 : 0.93}
              clearcoat={1}
            />
          </RoundedBox>

          <Text
            position={[isRTL ? 2.2 : -2.2, 1.2, 0.1]}
            fontSize={isRTL ? 0.22 : 0.24}
            font={fontUrl}
            color={isBeige ? '#b45309' : '#38bdf8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {gradProject.title}
          </Text>

          <Text
            position={[isRTL ? 2.2 : -2.2, 0.8, 0.1]}
            fontSize={isRTL ? 0.13 : 0.14}
            font={fontUrl}
            color="#22c55e"
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            ✓ {gradProject.status}
          </Text>

          <Text
            position={[isRTL ? 2.2 : -2.2, 0.3, 0.1]}
            fontSize={isRTL ? 0.125 : 0.13}
            font={fontUrl}
            maxWidth={4.4}
            lineHeight={1.45}
            color={isBeige ? '#292524' : '#cbd5e1'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="top"
            textAlign={isRTL ? 'right' : 'left'}
          >
            {gradProject.description}
          </Text>

          <Text
            position={[isRTL ? 2.2 : -2.2, -1.0, 0.1]}
            fontSize={isRTL ? 0.105 : 0.11}
            font={fontUrl}
            color={isBeige ? '#78716c' : '#94a3b8'}
            anchorX={isRTL ? 'right' : 'left'}
            anchorY="middle"
          >
            {isRTL
              ? "* المخططات المعمارية للبرمجية والعرض التوضيحي متوفران للعرض والمناقشة"
              : "* Complete architectural blueprints and demo ready for presentation"}
          </Text>

          {/* Border */}
          <lineSegments position={[0, 0, 0.08]}>
            <edgesGeometry args={[new THREE.BoxGeometry(5.0, 3.4, 0.02)]} />
            <lineBasicMaterial color={isBeige ? '#d97706' : '#38bdf8'} transparent opacity={isBeige ? 0.5 : 0.3} />
          </lineSegments>
        </group>
      </Float>

      {/* Supervisors 3D Podium Cards */}
      <group position={[isRTL ? -2.8 : 2.8, 0.2, 0]}>
        <Text
          position={[0, 1.4, 0.1]}
          fontSize={isRTL ? 0.19 : 0.18}
          font={fontUrl}
          color={isBeige ? '#78350f' : '#94a3b8'}
          anchorX="center"
          anchorY="middle"
        >
          {isRTL ? "المشرفون الأكاديميون والتقنيون" : "PROJECT SUPERVISORS"}
        </Text>

        {gradProject.supervisors.map((sup, idx) => (
          <Float
            key={idx}
            speed={2 + idx * 0.4}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <group
              position={[0, 0.5 - idx * 1.3, idx * 0.2]}
              onPointerOver={() => onHoverSound?.()}
            >
              <RoundedBox args={[4.4, 1.05, 0.12]} radius={0.1} smoothness={4}>
                <meshPhysicalMaterial
                  color={isBeige ? '#faf8f5' : '#081836'}
                  metalness={isBeige ? 0.3 : 0.8}
                  roughness={0.2}
                  transmission={isBeige ? 0.25 : 0.35}
                  transparent
                  opacity={isBeige ? 0.95 : 0.9}
                  clearcoat={1}
                />
              </RoundedBox>

              <Text
                position={[isRTL ? 1.8 : -1.8, 0.2, 0.08]}
                fontSize={isRTL ? 0.17 : 0.18}
                font={fontUrl}
                color={isBeige ? '#1c1917' : '#ffffff'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
              >
                {sup.name}
              </Text>

              <Text
                position={[isRTL ? 1.8 : -1.8, -0.2, 0.08]}
                fontSize={isRTL ? 0.12 : 0.12}
                font={fontUrl}
                color={isBeige ? '#b45309' : '#06b6d4'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
              >
                {sup.role}
              </Text>

              {/* Edge glow */}
              <lineSegments position={[0, 0, 0.07]}>
                <edgesGeometry args={[new THREE.BoxGeometry(4.4, 1.05, 0.02)]} />
                <lineBasicMaterial color={isBeige ? '#d97706' : '#06b6d4'} transparent opacity={isBeige ? 0.5 : 0.4} />
              </lineSegments>
            </group>
          </Float>
        ))}
      </group>
    </group>
  );
};

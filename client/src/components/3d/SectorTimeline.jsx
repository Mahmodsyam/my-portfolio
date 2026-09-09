import React, { useMemo } from 'react';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorTimeline = ({ mouseRef, onHoverSound }) => {
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  // Generate curved 3D tube geometry for glowing timeline path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -2, 5),
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(2, 1, -5),
      new THREE.Vector3(6, 2, -10)
    ]);
  }, []);

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const timelineList = t.timeline || [];

  return (
    <group position={[10, 0, -190]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "المسيرة والخبرات المهنية" : "3D TIMELINE"}
        subtitle={isRTL ? "محطات التميز الهندسي وتطوير المنظومات" : "ENGINEERING MILESTONES & RECOGNITION"}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.65 : 0.6}
        subtitleSize={isRTL ? 0.2 : 0.2}
        glowColor={theme3D.pointLight2}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Glowing 3D Curvature Ribbon Tube */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.08, 16, false]} />
        <meshStandardMaterial
          color={isBeige ? '#d97706' : '#38bdf8'}
          emissive={isBeige ? '#b45309' : '#818cf8'}
          emissiveIntensity={isBeige ? 1.2 : 2.0}
        />
      </mesh>

      {/* Floating 3D Milestone Pods */}
      {timelineList.map((item, idx) => {
        const xOffset = (idx - 1) * 3.8;
        const yOffset = (1 - idx) * 1.4;
        const zOffset = (1 - idx) * 3.0;

        return (
          <group
            key={idx}
            position={[xOffset, yOffset, zOffset]}
            onPointerOver={() => onHoverSound?.()}
          >
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
              {/* Glass Milestone Card */}
              <RoundedBox args={[3.8, 2.3, 0.12]} radius={0.1} smoothness={4}>
                <meshPhysicalMaterial
                  color={isBeige ? '#ffffff' : '#081026'}
                  metalness={isBeige ? 0.3 : 0.8}
                  roughness={0.2}
                  transmission={isBeige ? 0.25 : 0.35}
                  transparent
                  opacity={isBeige ? 0.95 : 0.92}
                  clearcoat={1}
                />
              </RoundedBox>

              {/* Year / Period Badge */}
              <group position={[isRTL ? 1.2 : -1.2, 0.8, 0.08]}>
                <RoundedBox args={[1.2, 0.32, 0.04]} radius={0.04} smoothness={2}>
                  <meshStandardMaterial
                    color={isBeige ? '#d97706' : '#818cf8'}
                    emissive={isBeige ? '#b45309' : '#818cf8'}
                    emissiveIntensity={isBeige ? 0.5 : 0.8}
                  />
                </RoundedBox>
                <Text
                  position={[0, 0, 0.04]}
                  fontSize={isRTL ? 0.11 : 0.1}
                  font={fontUrl}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {item.year}
                </Text>
              </group>

              {/* Role Title */}
              <Text
                position={[isRTL ? 1.5 : -1.5, 0.35, 0.08]}
                fontSize={isRTL ? 0.15 : 0.17}
                font={fontUrl}
                color={isBeige ? '#1c1917' : '#ffffff'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
              >
                {item.role}
              </Text>

              {/* Organization */}
              <Text
                position={[isRTL ? 1.5 : -1.5, 0.08, 0.08]}
                fontSize={isRTL ? 0.12 : 0.12}
                font={fontUrl}
                color={isBeige ? '#b45309' : '#38bdf8'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="middle"
              >
                {item.company}
              </Text>

              {/* Summary */}
              <Text
                position={[isRTL ? 1.5 : -1.5, -0.2, 0.08]}
                fontSize={isRTL ? 0.105 : 0.11}
                font={fontUrl}
                maxWidth={3.2}
                lineHeight={1.35}
                color={isBeige ? '#57534e' : '#94a3b8'}
                anchorX={isRTL ? 'right' : 'left'}
                anchorY="top"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {item.description}
              </Text>

              {/* Node Light Sphere */}
              <mesh position={[isRTL ? 1.9 : -1.9, 0, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color={isBeige ? '#d97706' : '#38bdf8'}
                  emissive={isBeige ? '#d97706' : '#38bdf8'}
                  emissiveIntensity={isBeige ? 1.8 : 2.5}
                />
              </mesh>
            </Float>
          </group>
        );
      })}
    </group>
  );
};

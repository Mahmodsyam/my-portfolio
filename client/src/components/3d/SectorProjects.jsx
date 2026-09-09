import React, { useState } from 'react';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorProjects = ({ mouseRef, onSelectProject, onHoverSound }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  // 4 Monolith positions arranged symmetrically in a futuristic 3D virtual exhibition hall
  const projectPositions = [
    [-4.5, 0.5, 0],
    [-1.5, 0.5, -3],
    [1.5, 0.5, -3],
    [4.5, 0.5, 0]
  ];

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const projectList = t.projects || [];

  return (
    <group position={[0, 0, -140]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "معرض المشاريع والمنظومات" : "3D PROJECT GALLERY"}
        subtitle={isRTL ? "الأنظمة المؤسسية • المتاجر الإلكترونية • منصات الاتصالات" : "ENTERPRISE SYSTEMS • E-COMMERCE • TELECOM PLATFORMS"}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.65 : 0.6}
        subtitleSize={isRTL ? 0.2 : 0.2}
        glowColor={theme3D.titleGlow}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Floor Grid with Pedestals */}
      <gridHelper
        args={[30, 20, theme3D.gridColor1, theme3D.gridColor2]}
        position={[0, -2.2, 0]}
      />

      {/* 4 3D Project Monolith Displays */}
      {projectList.map((project, idx) => {
        const pos = projectPositions[idx];
        const isHovered = hoveredIndex === idx;

        return (
          <group
            key={project.id}
            position={pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIndex(idx);
              onHoverSound?.();
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredIndex(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject?.(project);
            }}
          >
            <Float
              speed={2}
              rotationIntensity={0.1}
              floatIntensity={isHovered ? 0.4 : 0.2}
            >
              {/* Glass Exhibition Monolith Frame */}
              <RoundedBox
                args={[2.7, 3.7, 0.15]}
                radius={0.12}
                smoothness={4}
                position={[0, isHovered ? 0.3 : 0, 0]}
              >
                <meshPhysicalMaterial
                  color={isBeige ? '#ffffff' : '#071124'}
                  metalness={isBeige ? 0.3 : 0.85}
                  roughness={0.18}
                  transmission={isBeige ? 0.2 : 0.4}
                  transparent
                  opacity={isBeige ? 0.95 : 0.92}
                  reflectivity={0.8}
                  clearcoat={1}
                />
              </RoundedBox>

              {/* Holographic Screen Display Header */}
              <mesh position={[0, isHovered ? 1.4 : 1.1, 0.09]}>
                <planeGeometry args={[2.4, 1.2]} />
                <meshStandardMaterial
                  color={project.color}
                  emissive={project.color}
                  emissiveIntensity={isHovered ? (isBeige ? 0.6 : 0.9) : (isBeige ? 0.2 : 0.3)}
                  roughness={0.3}
                />
              </mesh>

              {/* Project Title */}
              <Text
                position={[0, isHovered ? 1.4 : 1.1, 0.15]}
                fontSize={isRTL ? 0.18 : 0.2}
                font={fontUrl}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.2}
                textAlign="center"
              >
                {project.title}
              </Text>

              {/* Subtitle / Category */}
              <Text
                position={[0, isHovered ? 0.4 : 0.1, 0.1]}
                fontSize={isRTL ? 0.12 : 0.13}
                font={fontUrl}
                color={isBeige ? '#b45309' : project.color}
                anchorX="center"
                anchorY="middle"
                maxWidth={2.3}
                textAlign="center"
              >
                {project.subtitle}
              </Text>

              {/* Description Snippet */}
              <Text
                position={[0, isHovered ? -0.2 : -0.5, 0.1]}
                fontSize={isRTL ? 0.105 : 0.11}
                font={fontUrl}
                maxWidth={2.3}
                lineHeight={1.35}
                color={isBeige ? '#44403c' : '#94a3b8'}
                anchorX="center"
                anchorY="top"
                textAlign="center"
              >
                {project.description}
              </Text>

              {/* Interactive Inspect Button */}
              <group position={[0, isHovered ? -1.25 : -1.45, 0.12]}>
                <RoundedBox args={[2.1, 0.4, 0.06]} radius={0.06} smoothness={2}>
                  <meshStandardMaterial
                    color={isHovered ? project.color : (isBeige ? '#d97706' : '#0f172a')}
                    emissive={project.color}
                    emissiveIntensity={isHovered ? (isBeige ? 0.8 : 1.2) : 0.3}
                  />
                </RoundedBox>
                <Text
                  position={[0, 0, 0.05]}
                  fontSize={isRTL ? 0.12 : 0.12}
                  font={fontUrl}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {t.common.deepInspect}
                </Text>
              </group>

              {/* Pedestal Light Beam */}
              <pointLight
                position={[0, -1.8, 0.5]}
                intensity={isHovered ? 6 : 2}
                distance={5}
                color={project.color}
              />
            </Float>
          </group>
        );
      })}
    </group>
  );
};

import React from 'react';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorGradStory = ({ mouseRef }) => {
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const story = t.education?.story || { narrative: [] };

  return (
    <group position={[0, 0, -290]}>
      {/* Sector Header */}
      <Text3DTitle
        text={story.title}
        subtitle={story.subtitle}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.6 : 0.52}
        subtitleSize={isRTL ? 0.2 : 0.18}
        glowColor={theme3D.titleGlow}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Cinematic Luminous Path Archway */}
      {[-3, -1.5, 0, 1.5, 3].map((zPos, idx) => (
        <mesh key={idx} position={[0, 0.5, zPos]}>
          <torusGeometry args={[3.2, 0.03, 16, 64]} />
          <meshStandardMaterial
            color={idx < 2 ? (isBeige ? '#e7dfd0' : '#1e293b') : idx === 2 ? (isBeige ? '#d97706' : '#38bdf8') : '#f59e0b'}
            emissive={idx < 2 ? (isBeige ? '#d97706' : '#0f172a') : idx === 2 ? (isBeige ? '#b45309' : '#0284c7') : '#d97706'}
            emissiveIntensity={idx * (isBeige ? 0.5 : 0.8) + 0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Central Story Monolith */}
      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
        <group position={[0, 0, 0]}>
          <RoundedBox args={[7.0, 3.8, 0.15]} radius={0.15} smoothness={4}>
            <meshPhysicalMaterial
              color={isBeige ? '#ffffff' : '#050b1a'}
              metalness={isBeige ? 0.3 : 0.9}
              roughness={0.15}
              transmission={isBeige ? 0.25 : 0.35}
              transparent
              opacity={isBeige ? 0.95 : 0.95}
              clearcoat={1}
            />
          </RoundedBox>

          <Text
            position={[0, 1.35, 0.1]}
            fontSize={isRTL ? 0.22 : 0.22}
            font={fontUrl}
            color="#f59e0b"
            anchorX="center"
            anchorY="middle"
          >
            {isRTL ? "نور التميز المصنوع من عمق الصمود" : "LIGHT FORGED THROUGH PERSEVERANCE"}
          </Text>

          <Text
            position={[0, 0.45, 0.1]}
            fontSize={isRTL ? 0.13 : 0.13}
            font={fontUrl}
            maxWidth={6.2}
            lineHeight={1.55}
            color={isBeige ? '#292524' : '#e2e8f0'}
            anchorX="center"
            anchorY="top"
            textAlign="center"
          >
            {story.narrative[0]}
            {"\n\n"}
            {story.narrative[1]}
            {"\n\n"}
            {story.narrative[2]}
          </Text>

          {/* Golden Triumph Border */}
          <lineSegments position={[0, 0, 0.08]}>
            <edgesGeometry args={[new THREE.BoxGeometry(7.0, 3.8, 0.02)]} />
            <lineBasicMaterial color={isBeige ? '#d97706' : '#38bdf8'} transparent opacity={isBeige ? 0.7 : 0.6} />
          </lineSegments>
        </group>
      </Float>

      {/* Radiant Light Shafts */}
      <pointLight position={[0, 3, 2]} intensity={isBeige ? 6 : 8} distance={12} color={theme3D.pointLight1} />
      <pointLight position={[0, -2, -2]} intensity={isBeige ? 4 : 5} distance={10} color="#f59e0b" />
    </group>
  );
};

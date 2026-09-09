import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorSkills = ({ mouseRef, onHoverSound, onClickSound }) => {
  const galaxyRef = useRef();
  const [activeSkill, setActiveSkill] = useState(null);

  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.12;
    }
  });

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const skillsList = t.skills || [];

  return (
    <group position={[-10, 0, -85]}>
      {/* Sector Title */}
      <Text3DTitle
        text={isRTL ? "مجرة المهارات والتقنيات" : "SKILLS GALAXY"}
        subtitle={isRTL ? "مدارات تفاعلية لأحدث التقنيات البرمجية" : "INTERACTIVE 3D TECHNOLOGY ORBITS"}
        position={[0, 4.5, 0]}
        size={isRTL ? 0.65 : 0.6}
        subtitleSize={isRTL ? 0.2 : 0.2}
        glowColor={theme3D.pointLight3}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Central Pulsing Energy Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={isBeige ? '#d97706' : '#38bdf8'}
          emissive={isBeige ? '#b45309' : '#0284c7'}
          emissiveIntensity={isBeige ? 1.8 : 2.5}
          wireframe
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={isBeige ? '#fef3c7' : '#ffffff'} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={isBeige ? 8 : 10} distance={15} color={isBeige ? '#d97706' : '#38bdf8'} />

      {/* Galaxy Node Orbits */}
      <group ref={galaxyRef}>
        {skillsList.map((skill, idx) => {
          const total = skillsList.length;
          const angle = (idx / total) * Math.PI * 2;
          const radius = 3.6 + (idx % 3) * 1.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = ((idx % 5) - 2) * 0.8;
          const isSelected = activeSkill?.id === skill.id;

          return (
            <group
              key={skill.id}
              position={[x, y, z]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setActiveSkill(skill);
                onHoverSound?.();
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setActiveSkill(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickSound?.();
              }}
            >
              {/* 3D Tech Planetary Object */}
              <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
                <mesh scale={isSelected ? 1.4 : 1.0}>
                  <dodecahedronGeometry args={[0.42, 0]} />
                  <meshStandardMaterial
                    color={skill.color}
                    emissive={skill.color}
                    emissiveIntensity={isSelected ? (isBeige ? 1.8 : 2.5) : (isBeige ? 0.6 : 0.8)}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>

                {/* Wireframe Shield */}
                <mesh scale={isSelected ? 1.7 : 1.2}>
                  <icosahedronGeometry args={[0.48, 1]} />
                  <meshStandardMaterial
                    color={skill.color}
                    wireframe
                    transparent
                    opacity={isSelected ? 0.8 : 0.3}
                  />
                </mesh>

                {/* Billboarded Tech Label */}
                <Billboard position={[0, 0.75, 0]}>
                  <Text
                    fontSize={0.22}
                    font={fontUrl}
                    letterSpacing={isRTL ? 0 : 0.02}
                    color={isSelected ? (isBeige ? '#b45309' : '#ffffff') : skill.color}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor={isBeige ? '#ffffff' : '#000000'}
                  >
                    {skill.name}
                  </Text>
                </Billboard>
              </Float>
            </group>
          );
        })}
      </group>

      {/* Selected Skill Holographic Deep Info Overlay */}
      {activeSkill && (
        <Billboard position={[0, -2.8, 2]}>
          <group>
            <RoundedBox args={[5.2, 1.5, 0.1]} radius={0.1} smoothness={4}>
              <meshPhysicalMaterial
                color={isBeige ? '#ffffff' : '#061224'}
                metalness={isBeige ? 0.3 : 0.9}
                roughness={0.15}
                transmission={isBeige ? 0.2 : 0.4}
                transparent
                opacity={isBeige ? 0.96 : 0.95}
              />
            </RoundedBox>

            <Text
              position={[isRTL ? 2.3 : -2.3, 0.4, 0.08]}
              fontSize={isRTL ? 0.2 : 0.22}
              font={fontUrl}
              letterSpacing={isRTL ? 0 : 0.02}
              color={activeSkill.color}
              anchorX={isRTL ? 'right' : 'left'}
              anchorY="middle"
            >
              {activeSkill.name} • {activeSkill.category}
            </Text>

            <Text
              position={[isRTL ? 2.3 : -2.3, -0.15, 0.08]}
              fontSize={isRTL ? 0.125 : 0.13}
              font={fontUrl}
              maxWidth={4.6}
              lineHeight={1.4}
              color={isBeige ? '#292524' : '#cbd5e1'}
              anchorX={isRTL ? 'right' : 'left'}
              anchorY="top"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {activeSkill.description}
            </Text>

            <lineSegments position={[0, 0, 0.06]}>
              <edgesGeometry args={[new THREE.BoxGeometry(5.2, 1.5, 0.02)]} />
              <lineBasicMaterial color={activeSkill.color} />
            </lineSegments>
          </group>
        </Billboard>
      )}
    </group>
  );
};

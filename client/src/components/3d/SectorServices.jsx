import React, { useState } from 'react';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle, CAIRO_FONT_URL } from './Text3DTitle';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorServices = ({ mouseRef, onHoverSound }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  const fontUrl = isRTL ? CAIRO_FONT_URL : undefined;
  const servicesList = t.services || [];

  return (
    <group position={[-10, 0, -390]}>
      {/* Sector Header */}
      <Text3DTitle
        text={isRTL ? "خدمات برمجية تضاعف نجاحك" : "HIGH-IMPACT DIGITAL SERVICES"}
        subtitle={isRTL ? "تصميم وتطوير مواقع وتطبيقات متكاملة تزيد من مبيعاتك وتبرز هويتك الرقمية" : "CONVERTING VISITORS INTO CLIENTS WITH PREMIUM WEB SOLUTIONS"}
        position={[0, 4.5, 0]}
        size={isRTL ? 0.62 : 0.55}
        subtitleSize={isRTL ? 0.18 : 0.18}
        glowColor={theme3D.pointLight2}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Grid of 8 3D Floating Service Crystals */}
      <group position={[0, 0, 0]}>
        {servicesList.map((service, idx) => {
          const row = Math.floor(idx / 4);
          const col = idx % 4;
          const xPos = (col - 1.5) * 3.2;
          const yPos = row === 0 ? 1.2 : -1.4;
          const isHovered = hoveredIdx === idx;

          return (
            <group
              key={service.id}
              position={[xPos, yPos, (idx % 2) * 0.4]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredIdx(idx);
                onHoverSound?.();
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredIdx(null);
              }}
            >
              <Float
                speed={2 + (idx % 3) * 0.5}
                rotationIntensity={0.15}
                floatIntensity={isHovered ? 0.4 : 0.2}
              >
                {/* 3D Glass Service Plate */}
                <RoundedBox
                  args={[2.9, 2.3, 0.12]}
                  radius={0.1}
                  smoothness={4}
                  scale={isHovered ? 1.08 : 1.0}
                >
                  <meshPhysicalMaterial
                    color={isBeige ? '#ffffff' : '#08142c'}
                    metalness={isBeige ? 0.3 : 0.8}
                    roughness={0.2}
                    transmission={isBeige ? 0.25 : 0.35}
                    transparent
                    opacity={isBeige ? 0.95 : 0.92}
                    clearcoat={1}
                  />
                </RoundedBox>

                {/* Glowing Core Crystal */}
                <mesh position={[0, 0.6, 0.08]} scale={isHovered ? 1.3 : 1.0}>
                  <octahedronGeometry args={[0.3, 0]} />
                  <meshStandardMaterial
                    color={service.color}
                    emissive={service.color}
                    emissiveIntensity={isHovered ? (isBeige ? 1.6 : 2.5) : (isBeige ? 0.6 : 0.8)}
                  />
                </mesh>

                {/* Title */}
                <Text
                  position={[0, 0.08, 0.08]}
                  fontSize={isRTL ? 0.15 : 0.16}
                  font={fontUrl}
                  color={isBeige ? '#1c1917' : '#ffffff'}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.6}
                  textAlign="center"
                >
                  {service.title}
                </Text>

                {/* Description */}
                <Text
                  position={[0, -0.36, 0.08]}
                  fontSize={isRTL ? 0.095 : 0.1}
                  font={fontUrl}
                  maxWidth={2.6}
                  lineHeight={1.35}
                  color={isBeige ? '#57534e' : '#94a3b8'}
                  anchorX="center"
                  anchorY="top"
                  textAlign="center"
                >
                  {service.description}
                </Text>

                {/* Border glow */}
                <lineSegments position={[0, 0, 0.07]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(2.9, 2.3, 0.02)]} />
                  <lineBasicMaterial
                    color={service.color}
                    transparent
                    opacity={isHovered ? 0.9 : (isBeige ? 0.5 : 0.3)}
                  />
                </lineSegments>
              </Float>
            </group>
          );
        })}
      </group>
    </group>
  );
};

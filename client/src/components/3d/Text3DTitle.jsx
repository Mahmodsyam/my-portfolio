import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const CAIRO_FONT_URL = 'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvalrnSb4W.woff';

export const Text3DTitle = ({
  text,
  subtitle,
  position = [0, 0, 0],
  size = 0.8,
  subtitleSize = 0.35,
  color,
  glowColor,
  align = 'center',
  mouseRef
}) => {
  const groupRef = useRef();
  const { theme3D, isBeige } = useTheme();
  const { isRTL } = useLanguage();

  const isArabicText = /[\u0600-\u06FF]/.test(text || '');
  const fontUrl = (isArabicText || isRTL) ? CAIRO_FONT_URL : undefined;
  const activeColor = color || (isBeige ? '#1c1917' : '#ffffff');
  const activeGlow = glowColor || (isBeige ? '#d97706' : '#38bdf8');
  const activeSubtitleColor = isBeige ? '#57534e' : '#94a3b8';

  useFrame(() => {
    if (groupRef.current && mouseRef?.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseRef.current.x * 0.08,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseRef.current.y * 0.06,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glow Backplate Text */}
      <Text
        position={[0, 0, -0.04]}
        fontSize={size}
        font={fontUrl}
        letterSpacing={isArabicText ? 0 : 0.06}
        anchorX={align}
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor={activeGlow}
        outlineOpacity={isBeige ? 0.25 : 0.4}
      >
        {text}
        <meshBasicMaterial color={activeGlow} transparent opacity={isBeige ? 0.2 : 0.3} />
      </Text>

      {/* Main Foreground Text */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={size}
        font={fontUrl}
        letterSpacing={isArabicText ? 0 : 0.06}
        anchorX={align}
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial
          color={activeColor}
          metalness={isBeige ? 0.4 : 0.9}
          roughness={0.2}
          emissive={activeGlow}
          emissiveIntensity={isBeige ? 0.15 : 0.25}
        />
      </Text>

      {/* Subtitle if provided */}
      {subtitle && (
        <Text
          position={[0, -size * 0.85, 0.04]}
          fontSize={subtitleSize}
          font={fontUrl}
          letterSpacing={isArabicText ? 0 : 0.04}
          anchorX={align}
          anchorY="middle"
        >
          {subtitle}
          <meshStandardMaterial
            color={activeSubtitleColor}
            metalness={isBeige ? 0.3 : 0.5}
            roughness={0.4}
            emissive={activeGlow}
            emissiveIntensity={0.1}
          />
        </Text>
      )}

      {/* Glowing Underline Accent */}
      <mesh position={[0, -size * 1.25, 0]}>
        <planeGeometry args={[Math.max(2, size * 3.5), 0.025]} />
        <meshBasicMaterial color={activeGlow} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

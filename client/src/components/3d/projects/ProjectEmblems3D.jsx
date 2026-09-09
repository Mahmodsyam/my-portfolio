import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. LegendSport 3D Emblem (Sport Motion Wings + E-Commerce Core)
// ----------------------------------------------------
export const LegendSport3DEmblem = ({ hovered = false, scale = 1, color = "#38bdf8" }) => {
  const groupRef = useRef();
  const ringRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.4 : 0.45);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      ringRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Central Athletic Gem Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Left Wing Aerodynamic Blade */}
      <mesh position={[-0.85, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.9, 0.24, 0.16]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Right Wing Aerodynamic Blade */}
      <mesh position={[0.85, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.9, 0.24, 0.16]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting Commerce Speed Ring */}
      <mesh ref={ringRef} scale={[1.4, 0.45, 1.4]}>
        <torusGeometry args={[1.0, 0.05, 16, 48]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={hovered ? 3.0 : 1.5}
        />
      </mesh>

      {/* Inscribed LS Monogram */}
      <Text
        position={[0, 0, 0.74]}
        fontSize={0.52}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        LS
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 2. Debt Management 3D Emblem (Financial Vault & Ledger Scale)
// ----------------------------------------------------
export const DebtManagement3DEmblem = ({ hovered = false, scale = 1, color = "#10b981" }) => {
  const groupRef = useRef();
  const vaultRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.3 : 0.4);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Heavy Financial Ledger Vault Cube */}
      <RoundedBox ref={vaultRef} args={[1.5, 1.5, 0.5]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color="#062e22"
          emissive={color}
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Vault Door Rotating Wheel Rim */}
      <mesh position={[0, 0, 0.28]}>
        <torusGeometry args={[0.58, 0.07, 16, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={hovered ? 2.5 : 1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Cross Lock Bolts */}
      <mesh position={[0, 0, 0.28]}>
        <boxGeometry args={[1.05, 0.09, 0.04]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.28]}>
        <boxGeometry args={[0.09, 1.05, 0.04]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>

      {/* Inscribed Currency / Ledger Mark */}
      <Text
        position={[0, 0, 0.35]}
        fontSize={0.56}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        $
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 3. POS / Cashier 3D Emblem (Point-of-Sale Scanner & Transaction Register)
// ----------------------------------------------------
export const POSCashier3DEmblem = ({ hovered = false, scale = 1, color = "#f59e0b" }) => {
  const groupRef = useRef();
  const scannerLaser = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.9) * 0.08;
    }
    if (scannerLaser.current) {
      scannerLaser.current.position.y = Math.sin(state.clock.getElapsedTime() * 4) * 0.35;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* POS Terminal Frame */}
      <RoundedBox args={[1.65, 1.45, 0.38]} radius={0.14} smoothness={4}>
        <meshStandardMaterial
          color="#1c1917"
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.7}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Screen Inset */}
      <mesh position={[0, 0.15, 0.21]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshStandardMaterial color="#0c0a09" />
      </mesh>

      {/* Green Scanner Beam Laser */}
      <mesh ref={scannerLaser} position={[0, 0.15, 0.23]}>
        <planeGeometry args={[1.2, 0.04]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Bottom Keypad Area */}
      <mesh position={[0, -0.42, 0.21]}>
        <planeGeometry args={[1.3, 0.28]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      <Text
        position={[0, 0.15, 0.26]}
        fontSize={0.32}
        fontWeight="bold"
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
      >
        POS
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 4. MicroTech / ISP 3D Emblem (Telecom Satellite Tower & Connectivity Globe)
// ----------------------------------------------------
export const MicroTech3DEmblem = ({ hovered = false, scale = 1, color = "#818cf8" }) => {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.3 : 0.45);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.7) * 0.08;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 1.6;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 1.2;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Central Network Globe */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#0b132b"
          emissive={color}
          emissiveIntensity={hovered ? 2.0 : 0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Wireframe Network Grid */}
      <mesh scale={1.03}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>

      {/* Telecom Signal Orbit Wave 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={hovered ? 3.0 : 1.5}
        />
      </mesh>

      {/* Telecom Signal Orbit Wave 2 */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.4, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={hovered ? 2.8 : 1.3}
        />
      </mesh>

      <Text
        position={[0, 0, 0.88]}
        fontSize={0.32}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ISP
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// Master Project Emblem Factory Component
// ----------------------------------------------------
export const ProjectEmblem3D = ({ id, hovered = false, scale = 1, color }) => {
  switch (id) {
    case 'legendsport':
      return <LegendSport3DEmblem hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
    case 'debt-management':
      return <DebtManagement3DEmblem hovered={hovered} scale={scale} color={color || "#10b981"} />;
    case 'pos-cashier':
      return <POSCashier3DEmblem hovered={hovered} scale={scale} color={color || "#f59e0b"} />;
    case 'microtech-isp':
      return <MicroTech3DEmblem hovered={hovered} scale={scale} color={color || "#818cf8"} />;
    default:
      return <LegendSport3DEmblem hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
  }
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. Web Development: 3D Holographic Browser Window
// ----------------------------------------------------
export const WebDev3DObject = ({ hovered = false, scale = 1, color = "#38bdf8" }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.0 : 0.35);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* 3D Browser Main Glass Window Frame */}
      <RoundedBox args={[2.2, 1.6, 0.2]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#0b1e36"
          emissive={color}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Top Header Bar */}
      <mesh position={[0, 0.62, 0.11]}>
        <boxGeometry args={[2.0, 0.18, 0.02]} />
        <meshStandardMaterial color="#0c233c" roughness={0.3} />
      </mesh>

      {/* 3 Window Control Dots */}
      <mesh position={[-0.85, 0.62, 0.13]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.74, 0.62, 0.13]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[-0.63, 0.62, 0.13]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Center 3D Holographic Code Brackets */}
      <Text
        position={[0, -0.05, 0.16]}
        fontSize={0.65}
        fontWeight="bold"
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {"</>"}
      </Text>

      {/* Floating Glass Sub-Pane */}
      <mesh position={[0.45, -0.3, 0.18]}>
        <boxGeometry args={[0.8, 0.4, 0.04]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.8 : 0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// 2. Full-Stack Development: 3D Stacked Architectural Monolith
// ----------------------------------------------------
export const FullStack3DObject = ({ hovered = false, scale = 1, color = "#818cf8" }) => {
  const stackRef = useRef();

  useFrame((state, delta) => {
    if (stackRef.current) {
      stackRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
      stackRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.07;
    }
  });

  return (
    <group ref={stackRef} scale={scale}>
      {/* Top Tier: UI Layer Plate */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.7, 0.18, 1.7]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 2.0 : 1.0}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Middle Tier: API Logic Core */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.38, 1.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.2 : 1.0}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Bottom Tier: Database Storage Foundation */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.3, 32]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={hovered ? 2.0 : 0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Vertical Connecting Data Light Beams */}
      {[
        [-0.6, 0, -0.6],
        [0.6, 0, -0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, 0.6]
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------
// 3. E-Commerce: 3D Glowing Shopping Tote & Transaction Rings
// ----------------------------------------------------
export const ECommerce3DObject = ({ hovered = false, scale = 1, color = "#10b981" }) => {
  const groupRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.2 : 0.38);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.5;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Shopping Tote Body */}
      <RoundedBox args={[1.45, 1.35, 0.75]} radius={0.12} smoothness={4} position={[0, -0.15, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.8 : 0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Bag Handle Loop */}
      <mesh position={[0, 0.64, 0]}>
        <torusGeometry args={[0.4, 0.06, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={hovered ? 2.5 : 1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting Gold Transaction Ring */}
      <mesh ref={ringRef} scale={[1.35, 1.35, 1.35]}>
        <torusGeometry args={[0.92, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={hovered ? 3.0 : 1.5}
        />
      </mesh>

      {/* Front Emissive Text */}
      <Text
        position={[0, -0.15, 0.42]}
        fontSize={0.38}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SHOP
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 4. Database Engineering: 3D Multi-Tier Server Tower
// ----------------------------------------------------
export const Database3DObject = ({ hovered = false, scale = 1, color = "#00758f" }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.3 : 0.4);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.6) * 0.06;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {[-0.6, -0.2, 0.2, 0.6].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.88, 0.88, 0.25, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive={color}
              emissiveIntensity={hovered ? 1.8 : 0.8}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.72, 0.86, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={hovered ? 3.0 : 1.5}
            />
          </mesh>
        </group>
      ))}

      {/* Central Pulsing Data Axis */}
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, 1.85, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// 5. REST APIs: 3D Central Gateway Nexus & Satellite Endpoints
// ----------------------------------------------------
export const RestApi3DObject = ({ hovered = false, scale = 1, color = "#06b6d4" }) => {
  const nexusRef = useRef();
  const satellites = useRef();

  useFrame((state, delta) => {
    if (nexusRef.current) {
      nexusRef.current.rotation.y += delta * (hovered ? 1.4 : 0.5);
    }
    if (satellites.current) {
      satellites.current.rotation.y -= delta * (hovered ? 1.8 : 0.7);
      satellites.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.15;
    }
  });

  return (
    <group scale={scale}>
      {/* Central Gateway Core */}
      <mesh ref={nexusRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Orbiting Satellite Endpoints */}
      <group ref={satellites}>
        {[
          [1.15, 0.35, 0],
          [-1.15, -0.35, 0],
          [0, 1.15, 0.45],
          [0, -1.15, -0.45]
        ].map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={color}
                emissiveIntensity={hovered ? 3.0 : 1.8}
              />
            </mesh>
          </group>
        ))}

        {/* Laser Connecting Lines */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={1.5} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
};

// ----------------------------------------------------
// 6. UI/UX Design: 3D Spatial Canvas & Palette Layers
// ----------------------------------------------------
export const UIUXDesign3DObject = ({ hovered = false, scale = 1, color = "#ec4899" }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main Curved Spatial Viewport Canvas */}
      <RoundedBox args={[2.0, 1.4, 0.15]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Floating Layout Card Layers */}
      <mesh position={[-0.45, 0.2, 0.15]}>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
      </mesh>

      <mesh position={[0.45, 0.3, 0.15]}>
        <boxGeometry args={[0.7, 0.3, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[0.45, -0.15, 0.15]}>
        <boxGeometry args={[0.7, 0.4, 0.06]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.2} />
      </mesh>

      {/* Swatch Cylinders */}
      {[-0.6, -0.25, 0.1, 0.45].map((x, idx) => (
        <mesh key={idx} position={[x, -0.45, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color={['#38bdf8', '#ec4899', '#22c55e', '#f59e0b'][idx]} emissive={['#38bdf8', '#ec4899', '#22c55e', '#f59e0b'][idx]} emissiveIntensity={1.0} />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------
// 7. Interactive 3D & WebGL: Geodesic Refractive Crystal
// ----------------------------------------------------
export const WebGL3DObject = ({ hovered = false, scale = 1, color = "#a855f7" }) => {
  const crystalRef = useRef();
  const wireRef = useRef();

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * (hovered ? 1.5 : 0.5);
      crystalRef.current.rotation.x += delta * (hovered ? 0.8 : 0.25);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * (hovered ? 1.0 : 0.3);
    }
  });

  return (
    <group scale={scale}>
      {/* Refractive Geodesic Icosahedron */}
      <mesh ref={crystalRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Outer Wireframe Cage */}
      <mesh ref={wireRef} scale={1.15}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 3.0 : 1.5}
        />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// 8. POS & Business Systems: 3D POS Terminal & Barcode Scanner
// ----------------------------------------------------
export const POS3DObject = ({ hovered = false, scale = 1, color = "#f59e0b" }) => {
  const groupRef = useRef();
  const laserRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.07;
    }
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 4) * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* POS Terminal Base */}
      <RoundedBox args={[1.5, 0.45, 1.2]} radius={0.1} smoothness={3} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#1e1b4b"
          metalness={0.7}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Angled Touch Register Screen */}
      <group position={[0, 0.1, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <RoundedBox args={[1.6, 1.1, 0.12]} radius={0.1} smoothness={3}>
          <meshStandardMaterial
            color="#08142c"
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.7}
            metalness={0.6}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Screen Display Text */}
        <Text
          position={[0, 0.15, 0.1]}
          fontSize={0.26}
          fontWeight="bold"
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          POS TERMINAL
        </Text>

        {/* Animated Barcode Scanner Laser */}
        <mesh ref={laserRef} position={[0, -0.15, 0.11]}>
          <planeGeometry args={[1.2, 0.04]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
};

// ----------------------------------------------------
// Master Service 3D Object Factory Component
// ----------------------------------------------------
export const ServiceObject3D = ({ id, hovered = false, scale = 1, color }) => {
  switch (id) {
    case 'web-dev':
      return <WebDev3DObject hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
    case 'fullstack':
      return <FullStack3DObject hovered={hovered} scale={scale} color={color || "#818cf8"} />;
    case 'ecommerce':
      return <ECommerce3DObject hovered={hovered} scale={scale} color={color || "#10b981"} />;
    case 'databases':
      return <Database3DObject hovered={hovered} scale={scale} color={color || "#00758f"} />;
    case 'api-systems':
      return <RestApi3DObject hovered={hovered} scale={scale} color={color || "#06b6d4"} />;
    case 'uiux-design':
      return <UIUXDesign3DObject hovered={hovered} scale={scale} color={color || "#ec4899"} />;
    case 'threejs-3d':
      return <WebGL3DObject hovered={hovered} scale={scale} color={color || "#a855f7"} />;
    case 'erp-pos':
      return <POS3DObject hovered={hovered} scale={scale} color={color || "#f59e0b"} />;
    default:
      return <WebDev3DObject hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
  }
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. React 3D Logo (Atomic nucleus + 3 orbital rings)
// ----------------------------------------------------
export const React3DLogo = ({ hovered = false, scale = 1, color = "#61dafb" }) => {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    const speed = hovered ? 2.5 : 1.0;
    if (ring1.current) ring1.current.rotation.z += delta * 1.2 * speed;
    if (ring2.current) ring2.current.rotation.z += delta * 1.0 * speed;
    if (ring3.current) ring3.current.rotation.z += delta * 1.4 * speed;
    if (core.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.15 + 1;
      core.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group scale={scale}>
      {/* Central Nucleus Core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3.5 : 2.2}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Orbit Ring 1 */}
      <group rotation={[0, 0, Math.PI / 6]}>
        <mesh ref={ring1} scale={[1, 0.42, 1]}>
          <torusGeometry args={[0.95, 0.055, 16, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.0 : 1.2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Orbit Ring 2 */}
      <group rotation={[0, 0, -Math.PI / 6]}>
        <mesh ref={ring2} scale={[1, 0.42, 1]}>
          <torusGeometry args={[0.95, 0.055, 16, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.0 : 1.2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Orbit Ring 3 */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={ring3} scale={[1, 0.42, 1]}>
          <torusGeometry args={[0.95, 0.055, 16, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.0 : 1.2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </group>
    </group>
  );
};

// ----------------------------------------------------
// 2. Three.js 3D Logo (Iconic triangular crystalline prism)
// ----------------------------------------------------
export const Threejs3DLogo = ({ hovered = false, scale = 1, color = "#38bdf8" }) => {
  const crystalRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    const speed = hovered ? 2.0 : 0.8;
    if (crystalRef.current) crystalRef.current.rotation.y += delta * 0.8 * speed;
    if (innerRef.current) innerRef.current.rotation.y -= delta * 1.2 * speed;
  });

  return (
    <group scale={scale}>
      {/* Outer Faceted Triangular Crystal */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#0c2340"
          emissive={color}
          emissiveIntensity={hovered ? 1.8 : 1.0}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Wireframe Triangle Edges */}
      <mesh scale={1.03}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          emissive={color}
          emissiveIntensity={hovered ? 3.0 : 1.8}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerRef} scale={0.45}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 4.0 : 2.5}
        />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// 3. JavaScript 3D Logo (Golden beveled block with JS monogram)
// ----------------------------------------------------
export const JavaScript3DLogo = ({ hovered = false, scale = 1, color = "#f7df1e" }) => {
  const blockRef = useRef();

  useFrame((state, delta) => {
    if (blockRef.current) {
      blockRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={blockRef} scale={scale}>
      {/* Golden Beveled Cube Plate */}
      <RoundedBox args={[1.35, 1.35, 0.35]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </RoundedBox>

      {/* 3D JS Monogram in Deep Charcoal */}
      <Text
        position={[0, -0.05, 0.2]}
        fontSize={0.68}
        fontWeight="bold"
        color="#111827"
        anchorX="center"
        anchorY="middle"
      >
        JS
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 4. Node.js 3D Logo (Extruded Hexagonal prism & core)
// ----------------------------------------------------
export const Nodejs3DLogo = ({ hovered = false, scale = 1, color = "#22c55e" }) => {
  const hexRef = useRef();

  useFrame((state, delta) => {
    if (hexRef.current) {
      hexRef.current.rotation.y += delta * (hovered ? 1.4 : 0.5);
    }
  });

  return (
    <group ref={hexRef} scale={scale}>
      {/* Outer Emerald Hexagon Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.38, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.8 : 0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Inner Dark Hexagon Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <cylinderGeometry args={[0.76, 0.76, 0.4, 6]} />
        <meshStandardMaterial
          color="#062814"
          emissive="#062814"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Central 3D Node "N" Symbol */}
      <Text
        position={[0, -0.05, 0.23]}
        fontSize={0.7}
        fontWeight="bold"
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 5. Express.js 3D Logo (Fast-track speed torus and monogram)
// ----------------------------------------------------
export const Express3DLogo = ({ hovered = false, scale = 1, color = "#a855f7" }) => {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.0 : 0.8);
      ringRef.current.rotation.y += delta * (hovered ? 1.0 : 0.3);
    }
  });

  return (
    <group scale={scale}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.9, 0.12, 16, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.2 : 1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      <RoundedBox args={[1.0, 1.0, 0.2]} radius={0.14} smoothness={3}>
        <meshStandardMaterial
          color="#1e1b4b"
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.7}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.13]}
        fontSize={0.46}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ex
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 6. PHP 3D Logo (Rounded Capsule with embossed PHP)
// ----------------------------------------------------
export const PHP3DLogo = ({ hovered = false, scale = 1, color = "#818cf8" }) => {
  const capsuleRef = useRef();

  useFrame((state, delta) => {
    if (capsuleRef.current) {
      capsuleRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={capsuleRef} scale={scale}>
      {/* 3D Oval Capsule Body */}
      <mesh scale={[1.45, 0.9, 0.42]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* PHP 3D Text */}
      <Text
        position={[0, 0, 0.24]}
        fontSize={0.52}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        php
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 7. MySQL 3D Logo (Relational Database Cylinders + Dolphin Pulse)
// ----------------------------------------------------
export const MySQL3DLogo = ({ hovered = false, scale = 1, color = "#00758f" }) => {
  const groupRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.5;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* 3 Tiered Database Cylinders */}
      {[-0.45, 0, 0.45].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.82, 0.82, 0.28, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00758f"
              emissiveIntensity={hovered ? 1.8 : 0.9}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.68, 0.81, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={hovered ? 2.5 : 1.2}
            />
          </mesh>
        </group>
      ))}

      {/* Orbiting Query Ring */}
      <mesh ref={ringRef} scale={[1.25, 1.25, 1.25]}>
        <torusGeometry args={[0.98, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>

      <Text
        position={[0, 0, 0.86]}
        fontSize={0.3}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SQL
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 8. HTML5 3D Logo (Official 3D Extruded Shield & 5)
// ----------------------------------------------------
export const HTML53DLogo = ({ hovered = false, scale = 1, color = "#e34f26" }) => {
  const shieldRef = useRef();

  useFrame((state, delta) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={shieldRef} scale={scale}>
      {/* 3D Shield Base Plate */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.35, 1.05, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Shield Bottom Triangle Wedge */}
      <mesh position={[0, -0.58, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.68, 0.72, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* 3D Embossed "5" */}
      <Text
        position={[0, 0, 0.16]}
        fontSize={0.72}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        5
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 9. CSS3 3D Logo (Official 3D Blue Shield & 3)
// ----------------------------------------------------
export const CSS33DLogo = ({ hovered = false, scale = 1, color = "#1572b6" }) => {
  const shieldRef = useRef();

  useFrame((state, delta) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={shieldRef} scale={scale}>
      {/* 3D Shield Base Plate */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.35, 1.05, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Shield Bottom Triangle Wedge */}
      <mesh position={[0, -0.58, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.68, 0.72, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* 3D Embossed "3" */}
      <Text
        position={[0, 0, 0.16]}
        fontSize={0.72}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        3
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 10. Tailwind CSS 3D Logo (Dual Dynamic Flowing Waves)
// ----------------------------------------------------
export const Tailwind3DLogo = ({ hovered = false, scale = 1, color = "#38bdf8" }) => {
  const waveGroup = useRef();

  useFrame((state, delta) => {
    if (waveGroup.current) {
      waveGroup.current.rotation.y += delta * (hovered ? 1.4 : 0.5);
    }
  });

  return (
    <group ref={waveGroup} scale={scale}>
      {/* Wave 1 */}
      <group position={[-0.25, 0.2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.48, 0.18, 16, 32, Math.PI * 1.2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.2 : 1.2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Wave 2 */}
      <group position={[0.25, -0.2, 0.05]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.48, 0.18, 16, 32, Math.PI * 1.2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.2 : 1.2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

// ----------------------------------------------------
// 11. Git 3D Logo (Branching Rhomboid & Commit Nodes)
// ----------------------------------------------------
export const Git3DLogo = ({ hovered = false, scale = 1, color = "#f05032" }) => {
  const diamondRef = useRef();

  useFrame((state, delta) => {
    if (diamondRef.current) {
      diamondRef.current.rotation.y += delta * (hovered ? 1.3 : 0.4);
    }
  });

  return (
    <group ref={diamondRef} scale={scale}>
      {/* Diamond Cube Frame */}
      <group rotation={[0, 0, Math.PI / 4]}>
        <RoundedBox args={[1.15, 1.15, 0.24]} radius={0.14} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.8 : 0.8}
            metalness={0.6}
            roughness={0.2}
          />
        </RoundedBox>
      </group>

      {/* 3D Branch Line */}
      <mesh position={[-0.1, 0, 0.14]} rotation={[0, 0, Math.PI / 3]}>
        <cylinderGeometry args={[0.045, 0.045, 0.75, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>

      {/* 3D Main Line */}
      <mesh position={[0.1, 0, 0.14]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.045, 0.045, 0.75, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>

      {/* Commit Spheres */}
      {[
        [-0.25, -0.2, 0.16],
        [0.25, 0.2, 0.16],
        [-0.05, 0.15, 0.16]
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={hovered ? 3.0 : 1.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------
// 12. GitHub 3D Logo (Obsidian Medal & Octocat emblem)
// ----------------------------------------------------
export const GitHub3DLogo = ({ hovered = false, scale = 1, color = "#ffffff" }) => {
  const medalRef = useRef();

  useFrame((state, delta) => {
    if (medalRef.current) {
      medalRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={medalRef} scale={scale}>
      {/* Obsidian Dark Chrome Medal */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.24, 48]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 1.0 : 0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing Rim */}
      <mesh position={[0, 0, 0.13]}>
        <ringGeometry args={[0.82, 0.9, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 3.0 : 1.5}
        />
      </mesh>

      {/* GitHub Inscribed Emblem */}
      <Text
        position={[0, -0.05, 0.16]}
        fontSize={0.48}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        GH
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 13. GitLab 3D Logo (Faceted Origami Fox Architecture)
// ----------------------------------------------------
export const GitLab3DLogo = ({ hovered = false, scale = 1, color = "#fc6d26" }) => {
  const foxRef = useRef();

  useFrame((state, delta) => {
    if (foxRef.current) {
      foxRef.current.rotation.y += delta * (hovered ? 1.3 : 0.4);
    }
  });

  return (
    <group ref={foxRef} scale={scale}>
      {/* Center Diamond Face */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.7, 0.7, 0.22]} />
        <meshStandardMaterial
          color="#e24329"
          emissive="#e24329"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Left Ear */}
      <mesh position={[-0.52, 0.38, 0]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.32, 0.75, 3]} />
        <meshStandardMaterial
          color="#fc6d26"
          emissive="#fc6d26"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Right Ear */}
      <mesh position={[0.52, 0.38, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.32, 0.75, 3]} />
        <meshStandardMaterial
          color="#fc6d26"
          emissive="#fc6d26"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Bottom Chin */}
      <mesh position={[0, -0.42, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.48, 0.48, 3]} />
        <meshStandardMaterial
          color="#fca326"
          emissive="#fca326"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// 14. WordPress 3D Logo (Polished Blue Coin with Extruded W)
// ----------------------------------------------------
export const WordPress3DLogo = ({ hovered = false, scale = 1, color = "#21759b" }) => {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
    }
  });

  return (
    <group ref={coinRef} scale={scale}>
      {/* WordPress Coin Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.25, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Border Ring */}
      <mesh position={[0, 0, 0.14]}>
        <ringGeometry args={[0.78, 0.86, 48]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
      </mesh>

      {/* Extruded "W" */}
      <Text
        position={[0, -0.05, 0.16]}
        fontSize={0.65}
        fontWeight="bold"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        W
      </Text>
    </group>
  );
};

// ----------------------------------------------------
// 15. UI / UX Design 3D Logo (Spatial Wireframe & Swatches)
// ----------------------------------------------------
export const UIUX3DLogo = ({ hovered = false, scale = 1, color = "#ec4899" }) => {
  const uiRef = useRef();

  useFrame((state, delta) => {
    if (uiRef.current) {
      uiRef.current.rotation.y += delta * (hovered ? 1.2 : 0.4);
      uiRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
    }
  });

  return (
    <group ref={uiRef} scale={scale}>
      {/* Glass Viewport Slab */}
      <RoundedBox args={[1.45, 1.05, 0.14]} radius={0.1} smoothness={3}>
        <meshStandardMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Floating UI Elements */}
      <mesh position={[-0.38, 0.18, 0.1]}>
        <boxGeometry args={[0.48, 0.48, 0.06]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
      </mesh>

      <mesh position={[0.32, 0.28, 0.1]}>
        <boxGeometry args={[0.58, 0.14, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[0.32, 0.06, 0.1]}>
        <boxGeometry args={[0.58, 0.14, 0.06]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.2} />
      </mesh>

      <mesh position={[0, -0.32, 0.1]}>
        <boxGeometry args={[1.2, 0.18, 0.06]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------
// Master Tech Logo Factory Component
// ----------------------------------------------------
export const TechLogo3D = ({ id, hovered = false, scale = 1, color }) => {
  switch (id) {
    case 'react':
      return <React3DLogo hovered={hovered} scale={scale} color={color || "#61dafb"} />;
    case 'threejs':
      return <Threejs3DLogo hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
    case 'javascript':
    case 'js':
      return <JavaScript3DLogo hovered={hovered} scale={scale} color={color || "#f7df1e"} />;
    case 'nodejs':
      return <Nodejs3DLogo hovered={hovered} scale={scale} color={color || "#22c55e"} />;
    case 'express':
      return <Express3DLogo hovered={hovered} scale={scale} color={color || "#a855f7"} />;
    case 'php':
      return <PHP3DLogo hovered={hovered} scale={scale} color={color || "#818cf8"} />;
    case 'mysql':
      return <MySQL3DLogo hovered={hovered} scale={scale} color={color || "#00758f"} />;
    case 'html5':
      return <HTML53DLogo hovered={hovered} scale={scale} color={color || "#e34f26"} />;
    case 'css3':
      return <CSS33DLogo hovered={hovered} scale={scale} color={color || "#1572b6"} />;
    case 'tailwind':
      return <Tailwind3DLogo hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
    case 'git':
      return <Git3DLogo hovered={hovered} scale={scale} color={color || "#f05032"} />;
    case 'github':
      return <GitHub3DLogo hovered={hovered} scale={scale} color={color || "#ffffff"} />;
    case 'gitlab':
      return <GitLab3DLogo hovered={hovered} scale={scale} color={color || "#fc6d26"} />;
    case 'wordpress':
      return <WordPress3DLogo hovered={hovered} scale={scale} color={color || "#21759b"} />;
    case 'uiux':
      return <UIUX3DLogo hovered={hovered} scale={scale} color={color || "#ec4899"} />;
    default:
      return <React3DLogo hovered={hovered} scale={scale} color={color || "#38bdf8"} />;
  }
};

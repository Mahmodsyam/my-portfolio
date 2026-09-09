import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const SECTORS = [
  { id: 'hero', name: 'Hero', z: 0, pos: [0, 0, 9], lookAt: [0, 0, 0] },
  { id: 'about', name: 'About', z: -40, pos: [8, 1, -32], lookAt: [8, 0, -42] },
  { id: 'skills', name: 'Skills Galaxy', z: -85, pos: [-10, 2, -77], lookAt: [-10, 0, -88] },
  { id: 'projects', name: '3D Gallery', z: -140, pos: [0, 1, -130], lookAt: [0, 0, -145] },
  { id: 'timeline', name: 'Experience', z: -190, pos: [10, 2, -180], lookAt: [10, 0, -193] },
  { id: 'education', name: 'Education', z: -240, pos: [-10, 1.5, -230], lookAt: [-10, 0, -243] },
  { id: 'story', name: 'Journey', z: -290, pos: [0, 2, -280], lookAt: [0, 0, -293] },
  { id: 'grad-project', name: 'Grad Project', z: -340, pos: [10, 1.5, -330], lookAt: [10, 0, -343] },
  { id: 'services', name: 'Services', z: -390, pos: [-10, 2, -380], lookAt: [-10, 0, -393] },
  { id: 'contact', name: 'Contact Station', z: -440, pos: [0, 1.5, -430], lookAt: [0, 0, -443] }
];

export const CameraRig = ({
  scrollProgress = 0,
  activeSectorIndex = 0,
  isWarping = false,
  mouseRef,
  inspectedProject = null
}) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 9));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 9));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Compute camera curve spline across all sectors
  const spline = useRef(
    new THREE.CatmullRomCurve3(
      SECTORS.map((s) => new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2])),
      false,
      'centripetal',
      0.4
    )
  );

  const lookAtSpline = useRef(
    new THREE.CatmullRomCurve3(
      SECTORS.map((s) => new THREE.Vector3(s.lookAt[0], s.lookAt[1], s.lookAt[2])),
      false,
      'centripetal',
      0.4
    )
  );

  useFrame((state, delta) => {
    // If user is deep-inspecting a specific project modal, zoom in closely
    if (inspectedProject) {
      const pz = -140;
      targetPos.current.set(0, 0.5, pz + 4.5);
      targetLookAt.current.set(0, 0, pz);
    } else {
      // Normal spline traversal based on smooth scroll progress
      const clampedProgress = THREE.MathUtils.clamp(scrollProgress, 0, 0.999);
      const pointOnCurve = spline.current.getPointAt(clampedProgress);
      const lookAtPoint = lookAtSpline.current.getPointAt(clampedProgress);

      targetPos.current.copy(pointOnCurve);
      targetLookAt.current.copy(lookAtPoint);

      // Add dynamic mouse parallax
      if (mouseRef?.current) {
        targetPos.current.x += mouseRef.current.x * 0.8;
        targetPos.current.y += mouseRef.current.y * 0.5;
      }
    }

    // Smooth lerping towards target
    const lerpSpeed = isWarping ? 0.08 : 0.05;
    currentPos.current.lerp(targetPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

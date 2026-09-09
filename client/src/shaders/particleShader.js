import * as THREE from 'three';

export const ParticleFieldShader = {
  uniforms: {
    uTime:       { value: 0 },
    uPixelRatio: { value: 1.0 },
    uSize:       { value: 38.0 },
    uMouse:      { value: new THREE.Vector2(0, 0) },
    uColorA:     { value: new THREE.Color('#38bdf8') },
    uColorB:     { value: new THREE.Color('#818cf8') },
    uColorC:     { value: new THREE.Color('#06b6d4') },
    uScrollZ:    { value: 0.0 },
  },

  vertexShader: /* glsl */`
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    uniform vec2  uMouse;
    uniform float uScrollZ;

    // per-particle attributes
    attribute float aScale;
    attribute float aRandom;
    attribute float aSpeed;   // unique drift speed per particle

    varying vec3  vColor;
    varying float vAlpha;
    varying float vRandom;

    // --- uniforms for colour mixing ---
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    // Smooth 3-way gradient instead of hard if-else
    vec3 triColor(float t) {
      // t in [0, 1]  →  A → B → C
      vec3 ab = mix(uColorA, uColorB, smoothstep(0.0, 0.5, t));
      vec3 bc = mix(uColorB, uColorC, smoothstep(0.5, 1.0, t));
      return mix(ab, bc, smoothstep(0.35, 0.65, t));
    }

    void main() {
      vec3 pos = position;

      float speed = aSpeed;          // 0.5 … 1.5

      // Organic fluid drift — each particle has its own rhythm
      pos.x += sin(uTime * 0.35 * speed + pos.z * 0.045 + aRandom * 6.28) * 0.9;
      pos.y += cos(uTime * 0.42 * speed + pos.x * 0.045 + aRandom * 6.28) * 0.9;
      pos.z += sin(uTime * 0.28 * speed + pos.y * 0.04  + aRandom * 3.14) * 0.7;

      // Mouse interactive repulsor (soft bubble)
      vec2 mouseWorld = uMouse * 14.0;
      float mouseDist = length(pos.xy - mouseWorld);
      float repulse = smoothstep(9.0, 0.0, mouseDist);
      pos.xy += normalize(pos.xy - mouseWorld + 0.001) * repulse * 2.4;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation — larger near camera
      float dist = -mvPosition.z;
      gl_PointSize = (uSize * aScale * uPixelRatio) / max(dist, 0.5);

      // Smooth tri-color gradient
      vColor = triColor(aRandom);

      // Twinkle: each particle pulses at its own phase
      float twinkle = 0.65 + 0.35 * sin(uTime * 1.8 * speed + aRandom * 31.41);

      // Soft distance fade (far = transparent)
      float fade = smoothstep(380.0, 8.0, dist);

      vAlpha  = fade * twinkle * 0.88;
      vRandom = aRandom;
    }
  `,

  fragmentShader: /* glsl */`
    varying vec3  vColor;
    varying float vAlpha;
    varying float vRandom;

    void main() {
      // Circular soft sprite
      vec2  center = gl_PointCoord - vec2(0.5);
      float d      = length(center);
      if (d > 0.5) discard;

      // Two-zone glow: bright core + wide soft halo
      float core  = pow(max(0.0, 1.0 - d * 2.6), 2.5);
      float halo  = pow(max(0.0, 1.0 - d * 1.6), 1.2) * 0.35;
      float glow  = core + halo;

      gl_FragColor = vec4(vColor, glow * vAlpha);
    }
  `
};

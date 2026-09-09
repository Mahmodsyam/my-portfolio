import * as THREE from 'three';

export const HolographicMaterialShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#38bdf8') },
    uGlowColor: { value: new THREE.Color('#818cf8') },
    uOpacity: { value: 0.85 },
    uGlitch: { value: 0.0 }
  },

  vertexShader: `
    uniform float uTime;
    uniform float uGlitch;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      vec3 pos = position;
      if (uGlitch > 0.0) {
        float noise = sin(pos.y * 20.0 + uTime * 15.0) * cos(pos.x * 10.0 + uTime * 10.0);
        pos.x += noise * 0.04 * uGlitch;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    uniform float uOpacity;
    uniform float uGlitch;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel Rim Glow
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
      
      // Moving holographic horizontal grid lines
      float lines = sin(vUv.y * 120.0 - uTime * 3.0) * 0.5 + 0.5;
      lines = pow(lines, 4.0);

      // Holographic cyber pattern
      float cyberPattern = step(0.96, fract(vUv.x * 20.0)) + step(0.96, fract(vUv.y * 20.0));
      
      vec3 base = mix(uColor * 0.4, uGlowColor, fresnel);
      base += lines * 0.25 * uColor;
      base += cyberPattern * 0.3 * uGlowColor;

      float alpha = clamp(fresnel * 0.9 + lines * 0.2 + 0.15, 0.0, 1.0) * uOpacity;

      gl_FragColor = vec4(base, alpha);
    }
  `
};

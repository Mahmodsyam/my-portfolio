import * as THREE from 'three';

export const PortraitDepthShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uIntensity: { value: 0.08 },
    uDepthScale: { value: 0.15 },
    uChromaticAberration: { value: 0.006 },
    uRimLightColor: { value: new THREE.Color('#38bdf8') },
    uResolution: { value: new THREE.Vector2(1, 1) }
  },

  vertexShader: `
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uTime;
    uniform float uDepthScale;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate realistic depth curve from center (subject focus)
      vec2 center = uv - vec2(0.5);
      float dist = length(center);
      
      // Foreground subject curve (person centered in the portrait)
      float subjectMask = smoothstep(0.7, 0.15, dist);
      
      // Add subtle dynamic wave breathing effect
      float wave = sin(uv.y * 3.0 + uTime * 1.5) * 0.02 * uHover;
      
      // Mouse interactive tilt displacement
      float mouseDisplacement = (center.x * -uMouse.x + center.y * -uMouse.y) * 0.35;
      
      float displacement = (subjectMask * uDepthScale) + mouseDisplacement + wave;
      vDisplacement = displacement;

      vec3 newPosition = position + normal * displacement;
      
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uChromaticAberration;
    uniform vec3 uRimLightColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    void main() {
      // Perspective parallax offset based on mouse position
      vec2 parallax = uMouse * uIntensity * 0.05;
      vec2 centeredUv = vUv - vec2(0.5);
      
      // Depth-weighted UV coordinates for subtle 2.5D layer separation
      float depthWeight = smoothstep(0.8, 0.2, length(centeredUv)) * 0.8 + 0.2;
      vec2 distortedUv = vUv + parallax * depthWeight;

      // Keep UVs bounded to prevent border stretching
      distortedUv = clamp(distortedUv, vec2(0.001), vec2(0.999));

      // Chromatic aberration on the RGB channels for lens depth
      float ca = uChromaticAberration * (1.0 + uHover * 1.5);
      vec2 rUv = distortedUv + vec2(ca, 0.0);
      vec2 gUv = distortedUv;
      vec2 bUv = distortedUv - vec2(ca, 0.0);

      float r = texture2D(uTexture, clamp(rUv, 0.0, 1.0)).r;
      float g = texture2D(uTexture, clamp(gUv, 0.0, 1.0)).g;
      float b = texture2D(uTexture, clamp(bUv, 0.0, 1.0)).b;
      vec4 texColor = vec4(r, g, b, 1.0);

      // Subtle holographic scanline
      float scanline = sin(vUv.y * 300.0 + uTime * 4.0) * 0.015 * uHover;
      
      // Fresnel rim lighting for holographic glass integration
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Cyber corner vignette
      float cornerVignette = smoothstep(0.75, 0.45, length(centeredUv));
      
      // Final color composite preserving authentic photographic fidelity
      vec3 finalColor = texColor.rgb;
      finalColor += scanline;
      finalColor += uRimLightColor * fresnel * (0.35 + uHover * 0.4);
      
      // Dynamic mouse highlight reflection
      vec2 lightPos = (uMouse + 1.0) * 0.5;
      float highlight = max(0.0, 1.0 - length(vUv - lightPos) * 2.5);
      finalColor += vec3(0.12, 0.22, 0.3) * highlight * (0.4 + uHover * 0.6);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

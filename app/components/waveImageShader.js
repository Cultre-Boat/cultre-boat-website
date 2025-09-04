export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uScrollVelocity;
  varying vec2 vUv;
  void main() {
    float wave = sin(vUv.y * 20.0 + uTime * 2.0) * 0.02 * (1.0 + uScrollVelocity * 5.0);
    vec2 uv = vUv + vec2(wave, 0.0);
    gl_FragColor = texture2D(uTexture, uv);
  }
`;
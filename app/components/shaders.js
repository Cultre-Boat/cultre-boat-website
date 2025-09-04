export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uNoise;
uniform sampler2D uScene; // The scene texture (or screenshot)
uniform float uTime;
uniform float uScrollVelocity;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Sample noise
  vec2 noise = texture2D(uNoise, uv * 2.0 + uTime * 0.1).rg;

  // Create distortion effect based on noise + scroll
  float strength = uScrollVelocity * 0.05;
  uv += (noise - 0.5) * strength;

  // Sample scene texture at distorted coordinates
  vec4 distortedColor = texture2D(uScene, uv);

  gl_FragColor = vec4(distortedColor.rgb, 0.6); // translucent
}

`;

uniform sampler2D u_texture;
uniform sampler2D u_displacement;
uniform float u_scroll;
uniform float u_time;
varying vec2 vUv;

void main() {
  vec2 displacedUv = vUv + (texture2D(u_displacement, vUv).rg - 0.5) * 0.1 * u_scroll;
  vec4 color = texture2D(u_texture, displacedUv);
  gl_FragColor = color;
}

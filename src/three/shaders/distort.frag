uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  float dist = length(vUv - 0.5);
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  float flicker = sin(uTime * 10.0) * 0.05 + 0.95;
  vec3 color = uColor * glow * flicker;
  gl_FragColor = vec4(color, glow * 0.6);
}

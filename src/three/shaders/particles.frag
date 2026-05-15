uniform float uTime;
varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float strength = 1.0 - smoothstep(0.0, 0.5, dist);

  float pulse = sin(uTime * 2.0) * 0.2 + 0.8;

  vec3 color = mix(vec3(0.0, 0.96, 1.0), vec3(1.0), 0.3);
  gl_FragColor = vec4(color, strength * vAlpha * pulse);
}

uniform float uTime;
uniform float uSize;
attribute float aScale;
varying float vAlpha;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.y += sin(uTime * 0.5 + position.x * 0.5) * 0.3;
  modelPosition.x += cos(uTime * 0.3 + position.z * 0.5) * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);

  vAlpha = (position.y + 10.0) / 20.0;
  vAlpha = clamp(vAlpha, 0.0, 1.0);
}

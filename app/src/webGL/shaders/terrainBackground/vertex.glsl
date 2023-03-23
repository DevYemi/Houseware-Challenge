#include ../utils/perlinNoise2D;
#include ../utils/getElevation.glsl;

uniform float uElevation;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xz, uTime, uElevation);

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    // varying
    vElevation = elevation;
    vUv = uv;
}
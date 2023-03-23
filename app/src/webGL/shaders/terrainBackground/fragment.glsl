#include ../utils/hslToRgb.glsl
uniform sampler2D uTexture;

varying float vElevation;
varying vec2 vUv;
uniform float uTime;

vec3 getRainbowColor() {
    float time = mod(uTime, 20000.0) * 0.0003;
    float hue = vElevation * time;
    vec3 hslColor = vec3(hue, 1.0, 0.5);
    vec3 rainbowColor = hslToRgb(hslColor);
    return rainbowColor;
}

void main() {
    vec3 uColor = vec3(1.0, 1.0, 1.0);
    vec3 rainbowColor = getRainbowColor();
    vec4 textureColor = texture(uTexture, vec2(0.0, abs(vElevation * 10.0)));

    vec3 color = mix(uColor, rainbowColor, textureColor.r);

    // float alpha = mod(vElevation * 10.0, 1.0);
    // alpha = step(0.95, alpha);

    gl_FragColor = vec4(color, textureColor.a);
}
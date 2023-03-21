uniform sampler2D uTexture;

varying float vElevation;
varying vec2 vUv;

void main() {
    vec4 textureColor = texture(uTexture, vec2(0.0, abs(vElevation * 10.0)));

    float alpha = mod(vElevation * 10.0, 1.0);
    alpha = step(0.95, alpha);

    gl_FragColor = textureColor;
}
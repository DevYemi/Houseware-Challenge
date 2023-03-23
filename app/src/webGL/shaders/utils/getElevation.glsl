float getElevation(vec2 _position, float uTime, float uElevation) {
    float elevation = 0.0;
    vec2 position = _position;
    position.x += uTime * 0.00009;
    position.y += uTime * 0.00005; 

    // general details
    elevation += cnoise(vec3(position.xy * 0.3, 0.0)) * 0.5;

    // moutain details
    elevation += cnoise(vec3((position.xy + 123.0) * 1.0, 0.0)) * 0.2;

    elevation *= uElevation;
    return elevation;
}
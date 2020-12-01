vec3 palette(float n){
    float x = iTime + n;
    float r = cos(x * 9.);
    float g = sin(x * 7.) + .3;
    float b = sin((1. - x) * 9.);
    return vec3(r, g, b);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 st = fragCoord / iResolution.xy;
    float pct = 0.0;

    vec2 p = 0.1 * vec2(sin(iTime), cos(iTime)) + vec2(0.3);
    vec2 p2 = 1. - p;
    vec2 p3 = 0.5 - vec2(p.y, -p.x);
    pct = distance(st,p) * distance(st,p2) * distance(st,p3) / 0.03;

    vec3 color = palette(pct);

	fragColor = vec4( color, 1.0 );
}


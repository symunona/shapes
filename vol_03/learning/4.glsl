void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 st = fragCoord / iResolution.xy;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    vec2 p = 0.1 * vec2(sin(iGlobalTime), cos(iGlobalTime)) + vec2(0.3);
    vec2 p2 = 1. - p;
    pct = distance(st,p) * distance(st,p2) / 0.2;

    vec3 color = vec3(pct);

	fragColor = vec4( vec3(1) - color, 1.0 );
}
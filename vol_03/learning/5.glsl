// I am trying to make a square.

float pxSquare( out vec4 fragColor, vec2 p, vec2 pos, vec2 size){
    // Assume p is from 0 to 1
    float w = 0.01;
    vec2 newPos = p * 2. - pos;
    float d = length(max(abs(newPos) - size, 0.));
    float c = smoothstep(0.0, w, d) - smoothstep(w , 2.*w, d);
    return c;
}


float frame(out vec4 fragColor, in vec2 fragCoord, vec2 p){
    float w = 0.51;
    float borderAt = 1.;
    return pxSquare(fragColor, p, vec2(0.0), vec2(1.1));
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 p = fragCoord / iResolution.xy;
    p = p * 2. -1.;
    p.x = p.x * iResolution.x / iResolution.y;

    float pct = 0.0;
    vec3 color = vec3(.0);

    float frm = frame(fragColor, fragCoord, p);
    color += vec3(0., frm, 0.);

    float square = pxSquare(fragColor, p,
        vec2(sin(iGlobalTime), cos(iGlobalTime)),
        vec2(0.5 + (sin(iGlobalTime) * .1, 0.1+ (cos(iGlobalTime) * .1)))
        );

    color += vec3(square, 0., 0.);


    // a. The DISTANCE from the pixel to the center
    // vec2 p = 0.1 * vec2(sin(iGlobalTime), cos(iGlobalTime)) + vec2(0.3);
    // vec2 p2 = 1. - p;

    // vec2 square = vec2(0.5 + (sin(iGlobalTime) * .1), 0.5 + (cos(iGlobalTime) * .1));
    // vec2 offset = vec2(0.);
    // float d = sqrt(
    //     pow(
    //         max(abs(p.x) - offset.x - square.x, 0.), 2.
    //     ) +
    //     pow(
    //         max(abs(p.y) - offset.y - square.y, 0.), 2.
    //     )
    // );

    // pxSquare(fragColor, p, vec2(0.0), vec2(1.1), vec3(.1, .3, .1) ));

    // float d = length(max(abs(p) - square, 0.));
    // float e = smoothstep(0.,0.01, d);

	fragColor = vec4( color, 1.0 );
}
// I am trying hard to get a triangle, but it's really not there yet.
// This was almost sikerült.

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 palette(float n){
    // float x = iTime + n;
    float x = n + 3.;
    float r = cos(x * 9.);
    float g = sin(x * 7.) + .3;
    float b = sin((1. - x) * 9.);
    return vec3(r, g, b);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 st = fragCoord / iResolution.xy;
    float pct = 0.0;

    // Move 0 0 to the center of the screen.
    st = st * 2. - 1.;

    st.x = st.x * iResolution.x / iResolution.y;

    float N = 3.;

    float r = 0.5;

    float circle = length(st) - r;

    // Angle where we are on the circle.
    // a is the angle of the point, remapped to 0.0 - 1.0
    float a = atan(st.x, st.y) / TWO_PI;

    // 0 - 1 on one edge
    float b = fract(a * N);

    // ca: central angle is the angle of each segment in the center per two to make it easier.
    float ca = TWO_PI / N;

    float deriveFromTheCircle = (sin(PI / 2. - ca + (b * ca * 2.)) - sin(PI / 2. - ca)) * 1. * circle;

    // It runs from 0 to 1 around the circle.
    float d = circle - deriveFromTheCircle;

    vec3 color = vec3(0., 0.5 - smoothstep(0., 0.01, d) * 0.5, 0.);

    color += vec3(1.) * smoothstep(0.01, 0.0, circle) * smoothstep(0., 0.01, circle);

	fragColor = vec4( color, 1.0 );
}


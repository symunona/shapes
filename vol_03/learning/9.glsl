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

    // It runs from 0 to 1 around the circle.
    float d = circle - (a * 0.5);


    vec3 color = vec3(1.) - vec3(smoothstep(0., 0.01, d));

	fragColor = vec4( color, 1.0 );
}


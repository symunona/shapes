// Dotting

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SQRT3 1.732050808

#define POINTS 3

#iChannel0 "self"

vec2 dispositions[3] = vec2[3](
    vec2(0., 2./SQRT3),
    vec2(-1., -1./SQRT3),
    vec2(1., -1./SQRT3));

vec3 colors[3] = vec3[3](
    vec3(0.,0.,0.),
    vec3(0.,1.,0.),
    vec3(0.,0.,1.)
);


float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(iMouse.xz))) * 12564.14213);
}

float rad = 0.004;
float smo = 0.001;
float rndRad = 0.003;
float xr = 0.2;
float yr = 0.1;
float fade = 0.96;
float speed = 2.6;
float assymetry = 1.;

float thickness = 0.001;


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 stOrig = fragCoord / iResolution.xy;
    float pct = 0.0;

    // Move 0 0 to the center of the screen.
    vec2 st = stOrig * 2. - 1.;

    st.x = st.x * iResolution.x / iResolution.y;

    vec2 point = vec2(( sin(iTime * speed) * xr), (cos(iTime * speed * assymetry) * yr ));
    vec2 formerPointCenter = vec2(( sin((iTime - iTimeDelta - thickness) * speed) * xr), (cos((iTime - iTimeDelta - thickness) * speed * assymetry) * yr ));

    vec4 formerColor = texture(iChannel0, stOrig);

    vec2 actualDispositions[POINTS];
    float distances[POINTS];
    float col[POINTS];
    for (int i = 0; i < POINTS; i++){
        actualDispositions[i] = dispositions[i] * random(point) * rndRad;
        distances[i] = distance(point, st + actualDispositions[i]);
        col[i] = 1. - smoothstep(rad, rad + smo, distances[i] ) + formerColor[i] * fade;
    }

	fragColor = vec4( vec3(col[0], col[1], col[2]), 1.0 );
}

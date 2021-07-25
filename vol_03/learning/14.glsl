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

float rad = 0.09;
float smo = 0.001;
float rndRad = 0.01;
float xr = 0.2;
float yr = 0.1;
float fade = 0.91;
float speed = 10.6;
float assymetry = 1.;

float thickness = 0.06;

float dataPoint = -0.4;
float dataPointSize = .05;

float drawLine(vec2 p1, vec2 p2, vec2 uv, float thickness) {
  float a = abs(distance(p1, uv));
  float b = abs(distance(p2, uv));
  float c = abs(distance(p1, p2));

  if ( a >= c || b >=  c ) return 0.0;

  float p = (a + b + c) * 0.5;

  // median to (p1, p2) vector
  float h = 2. / c * sqrt( p * ( p - a) * ( p - b) * ( p - c));

  return mix(1.0, 0.0, smoothstep(0.5 * thickness, 1.5 * thickness, h));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 stOrig = fragCoord / iResolution.xy;
    float pct = 0.0;

    // Move 0 0 to the center of the screen.
    vec2 st = stOrig * 2. - 1.;

    st.x = st.x * iResolution.x / iResolution.y;

    float aSpeed = speed;// * iMouse.x / iResolution.x;
    float aThickness = thickness * iMouse.y/iResolution.x;

    vec2 point = vec2(( sin(iTime * aSpeed) * xr), (cos(iTime * aSpeed * assymetry) * yr ));
    vec2 formerPointCenter = vec2(( sin((iTime - iTimeDelta - thickness) * speed) * xr), (cos((iTime - iTimeDelta - thickness) * speed * assymetry) * yr ));

    vec4 formerColor = texture(iChannel0, stOrig);

    vec2 actualDispositions[POINTS];
    float distances[POINTS];
    float col[POINTS];
    for (int i = 0; i < POINTS; i++){
        actualDispositions[i] = dispositions[i] * random(point) * rndRad;
        col[i] = drawLine(
            // vec2(0.5, 0.5),
            vec2(formerPointCenter.x, formerPointCenter.y),
            point + actualDispositions[i],
            st,
            aThickness
            )
            + formerColor[i] * fade ;
        // distances[i] = distance(point, st + actualDispositions[i]);
        // col[i] = 1. - smoothstep(rad, rad + smo, distances[i] ) + formerColor[i] * fade;
    }
    // vec2 dispositionR = vec2(0., 0.01) * random(point) * rndRad;
    // vec2 dispositionG= vec2(-0.02, -0.02) * random(point + vec2(0.1)) * rndRad;
    // vec2 dispositionB = vec2(0.02, -0.02) * random(point - vec2(0.1)) * rndRad;
    // float distR = distance(point, st + dispositionR);
    // float distG = distance(point, st + dispositionG);
    // float distB = distance(point, st + dispositionB);

    // float r = (1. - smoothstep(rad, rad + smo, distR )) * .3 + formerColor.r * fade;
    // float g = (1. - smoothstep(rad, rad + smo, distG )) * .3 + formerColor.g * fade;
    // float b = 1. - smoothstep(rad, rad + smo, distB ) + formerColor.b * fade;


	fragColor = vec4( vec3(col[0], col[1], col[2]), 1.0 );
}

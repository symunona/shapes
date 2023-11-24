// Created by genis sole - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.


mat3 CameraRotation( vec2 m )
{
    m.y = -m.y;

    vec2 s = sin(m);
    vec2 c = cos(m);

    // 3d vectpr rotation: https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions
    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, c.y, s.y,
        0.0, -s.y, c.y);

    mat3 rotY = mat3(
        c.x, 0.0, -s.x,
        0.0, 1.0, 0.0,
        s.x, 0.0, c.x);

    return rotY * rotX;
}



#define store(P, V) if (all(equal(ivec2(fragCoord), P))) fragColor = V
#define load(P) texelFetch(iChannel1, ivec2(P), 0)
#define key(K)  step(0.5, texelFetch(iChannel0, ivec2(K, 0), 0).x)

const ivec2 MEMORY_BOUNDARY = ivec2(4, 3);

const ivec2 POSITION = ivec2(1, 0);

const ivec2 VMOUSE = ivec2(1, 1);
const ivec2 PMOUSE = ivec2(2, 1);

const ivec2 TARGET = ivec2(0, 2);

const ivec2 RESOLUTION = ivec2(3, 1);

// Keyboard constants definition
const int KEY_BSP   = 8;
const int KEY_SP    = 32;
const int KEY_LEFT  = 37;
const int KEY_UP    = 38;
const int KEY_RIGHT = 39;
const int KEY_DOWN  = 40;
const int KEY_A     = 65;
const int KEY_B     = 66;
const int KEY_C     = 67;
const int KEY_D     = 68;
const int KEY_E     = 69;
const int KEY_F     = 70;
const int KEY_G     = 71;
const int KEY_H     = 72;
const int KEY_I     = 73;
const int KEY_J     = 74;
const int KEY_K     = 75;
const int KEY_L     = 76;
const int KEY_M     = 77;
const int KEY_N     = 78;
const int KEY_O     = 79;
const int KEY_P     = 80;
const int KEY_Q     = 81;
const int KEY_R     = 82;
const int KEY_S     = 83;
const int KEY_T     = 84;
const int KEY_U     = 85;
const int KEY_V     = 86;
const int KEY_W     = 87;
const int KEY_X     = 88;
const int KEY_Y     = 89;
const int KEY_Z     = 90;
const int KEY_COMMA = 188;
const int KEY_PER   = 190;

#define KEY_BINDINGS(FORWARD, BACKWARD, RIGHT, LEFT) const int KEY_BIND_FORWARD = FORWARD; const int KEY_BIND_BACKWARD = BACKWARD; const int KEY_BIND_RIGHT = RIGHT; const int KEY_BIND_LEFT = LEFT;

#define ARROWS  KEY_BINDINGS(KEY_UP, KEY_DOWN, KEY_RIGHT, KEY_LEFT)
#define WASD  KEY_BINDINGS(KEY_W, KEY_S, KEY_D, KEY_A)
#define ESDF  KEY_BINDINGS(KEY_E, KEY_D, KEY_F, KEY_S)

// Select one of the methods above: ARROWS, WASD or ESDF
#define INPUT_METHOD  WASD
vec2 KeyboardInput() {
    INPUT_METHOD

	vec2 i = vec2(key(KEY_BIND_RIGHT)   - key(KEY_BIND_LEFT),
                  key(KEY_BIND_FORWARD) - key(KEY_BIND_BACKWARD));

    float n = abs(abs(i.x) - abs(i.y));
    return i * (n + (1.0 - n)*inversesqrt(2.0));
}

vec3 CameraDirInput(vec2 vm) {
    vec2 m = vm/iResolution.x;

    return CameraRotation(m) * vec3(KeyboardInput(), 0.0).xzy;
}


void Collision(vec3 prev, inout vec3 p) {
    if (p.y < 1.0) p = vec3(prev.xz, min(1.0, prev.y)).xzy;
}

void mainImage2( out vec4 fragColor, in vec2 fragCoord )
{
    if (any(greaterThan(ivec2(fragCoord), MEMORY_BOUNDARY))) return;

    // Use the other channel for
    fragColor = load(fragCoord);

    vec2 resolution = load(RESOLUTION).xy;
    store(RESOLUTION, vec4(iResolution.xy, 0.0, 0.0));

    if (iTime == 0.0 || iFrame == 0 || any(notEqual(iResolution.xy, resolution))) {
        store(POSITION, vec4(0.0, 2.0, 0.0, 0.0));
        store(TARGET, vec4(0.0, 2.0, 0.0, 0.0));
        store(VMOUSE, vec4(0.0));
        store(PMOUSE, vec4(0.0));

        return;
    }

    vec3 target      = load(TARGET).xyz;
    vec3 position    = load(POSITION).xyz;
    vec2 pm          = load(PMOUSE).xy;
    vec3 vm          = load(VMOUSE).xyz;

    vec3 ptarget = target;
    target += CameraDirInput(vm.xy) * iTimeDelta * 5.0;

    Collision(ptarget, target);

    position += (target - position) * iTimeDelta * 5.0;

    store(TARGET, vec4(target, 0.0));
    store(POSITION, vec4(position, 0.0));

	if (iMouse.z > 0.0) {
    	store(VMOUSE, vec4(pm + (abs(iMouse.zw) - iMouse.xy), 1.0, 0.0));
	}
    else if (vm.z != 0.0) {
    	store(PMOUSE, vec4(vm.xy, 0.0, 0.0));
    }

}



// Created by genis sole - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.

const float PI = 3.141592;

// const ivec2 POSITION = ivec2(1, 0);

// const ivec2 VMOUSE = ivec2(1, 1);


#define load(P) texelFetch(iChannel1, ivec2(P), 0)


vec3 Grid(vec3 ro, vec3 rd) {
	float d = -ro.y/rd.y;

    if (d <= 0.0) return vec3(0.4);

   	vec2 p = (ro.xz + rd.xz*d);

    vec2 e = min(vec2(1.0), fwidth(p));

    vec2 l = smoothstep(vec2(1.0), 1.0 - e, fract(p)) + smoothstep(vec2(0.0), e, fract(p)) - (1.0 - e);

    return mix(vec3(0.4), vec3(0.8) * (l.x + l.y) * 0.5, exp(-d*0.01));
}

void Camera(in vec2 fragCoord, out vec3 ro, out vec3 rd)
{
    ro = load(POSITION).xyz;
    vec2 m = load(VMOUSE).xy/iResolution.x;

    float a = 1.0/max(iResolution.x, iResolution.y);
    rd = normalize(vec3((fragCoord - iResolution.xy*0.5)*a, 0.5));

    rd = CameraRotation(m) * rd;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec3 ro = vec3(0.0);
    vec3 rd = vec3(0.0);

    Camera(fragCoord, ro, rd);
    vec3 color = Grid(ro, rd);

    fragColor = vec4(pow(color, vec3(0.4545)), 1.0);
}
// Created by inigo quilez - iq/2013
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/

// Shows how to use the mouse input (only left button supported):
//
//      mouse.xy  = mouse position during last button down
//  abs(mouse.zw) = mouse position during last button click
// sign(mouze.z)  = button is down
// sign(mouze.w)  = button is clicked



// See also:
//
// Input - Keyboard    : https://www.shadertoy.com/view/lsXGzf
// Input - Microphone  : https://www.shadertoy.com/view/llSGDh
// Input - Mouse       : https://www.shadertoy.com/view/Mss3zH
// Input - Sound       : https://www.shadertoy.com/view/Xds3Rr
// Input - SoundCloud  : https://www.shadertoy.com/view/MsdGzn
// Input - Time        : https://www.shadertoy.com/view/lsXGz8
// Input - TimeDelta   : https://www.shadertoy.com/view/lsKGWV
// Inout - 3D Texture  : https://www.shadertoy.com/view/4llcR4

vec3 RED = vec3(1.0,0.0,0.0);
vec3 GREEN = vec3(0.0,1.0,0.0);
vec3 WHITE = vec3(0.2,0.2,0.2);
vec3 YELLOW = vec3(1.0,1.0,0.0);

float RADIAN = 0.01;

// Determines the sharpness of the edge of the circles.
// smoothtep takes three numbers: from number, to number, and the actual number
// and transforms them either 0 on one side or 1 on the other side:
//      to ↓
//         /‾‾‾‾‾‾‾1
// 0______/
//        ↑from
// smoothstep(from, to, n)

float SMOOTHNESS_OF_CIRCLE = 0.01 + 0.001;


float distanceToSegment( vec2 a, vec2 b, vec2 p )
{
	vec2 pa = p - a, ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = fragCoord / iResolution.x;
    vec2 cen = 0.5*iResolution.xy/iResolution.x;
    vec4 m = iMouse / iResolution.x;

	vec3 col = vec3(0.0);


	if( m.z>0.0 ) // button is down
	{
		float d = distanceToSegment( m.xy, abs(m.zw), p );
        col = mix( col, YELLOW , 1.0-smoothstep(.004,0.008, d) );
	}
	if( m.w>0.0 ) // button click
	{
        col = mix( col, WHITE, 1.0-smoothstep(0.1,0.105, length(p-cen)) );
    }


	col = mix( col, RED, 1.0-smoothstep(RADIAN,SMOOTHNESS_OF_CIRCLE, length(p-    m.xy )) );
    col = mix( col, GREEN, 1.0-smoothstep(RADIAN,SMOOTHNESS_OF_CIRCLE, length(p-abs(m.zw))) );

	fragColor = vec4( col, 1.0 );
}
vec3 invert(in vec3 color){
  return vec3(1) - vec3(color);
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {

  vec2 uv = fragCoord / iResolution.xy;

  float aspect = (iResolution.x / iResolution.y);
  uv.x = aspect * (uv.x);
  vec2 mouseUv = iMouse.xy / iResolution.xy;
  mouseUv.x = aspect * mouseUv.x;

  float x = uv.y;
  float y = pow(uv.x, 5.);
  float d = distance(uv, vec2(0.5)) + .1;
  float w = 0.01;
  float r = (0.05 * sin(iGlobalTime)) + 0.5;

  float p = smoothstep( r,  r + w, d ) * smoothstep( w + r,  r, d );

  // Time varying pixel color
  vec3 col = vec3(1. - (d * 2.));

  col = mix(col, invert(col), p);

  fragColor = vec4( col, 1.0 );
}



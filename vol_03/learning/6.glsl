void mainImage(out vec4 fragColor, in vec2 fragCoord) {

  vec2 uv = fragCoord / iResolution.xy;

  float aspect = (iResolution.x / iResolution.y);
  uv.x = aspect * (uv.x) * 2. -1.;
  vec2 mouseUv = iMouse.xy / iResolution.xy;
  mouseUv.x = aspect * mouseUv.x * 2. -1.;

  float x = uv.y;
  float y = smoothstep(-0.1, .5, uv.x) - smoothstep(0.5, 1.0, uv.x);
  float d = x - y;
  float w = 0.01;

  float p = smoothstep( 0.,  w, d ) * smoothstep( w,  0., d );

  // Time varying pixel color
  vec3 col = vec3(1) * y;

  col += vec3(1.0, 0., 0.) *
    (smoothstep(mouseUv.x, mouseUv.x + 0.01, uv.x)
    - smoothstep(mouseUv.x + 0.01, mouseUv.x + 0.02, uv.x));

  col += vec3(.0, 1., .0) * p;

  float l = length(mouseUv - uv);

  col += vec3(.2) * (1.-l);

  fragColor = vec4( col, 1.0 );
}


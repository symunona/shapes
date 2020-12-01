void mainImage(out vec4 fragColor, in vec2 fragCoord) {

  vec2 uv = fragCoord / iResolution.xy;

  float aspect = (iResolution.x / iResolution.y);
  // uv.x = aspect * (uv.x);
  vec2 mouseUv = iMouse.xy / iResolution.xy;
  mouseUv.x = aspect * mouseUv.x;

  float x = uv.y;
  float y = pow(uv.x, 5.);
  float d = x - y;
  float w = 0.01;

  float p = smoothstep( 0.,  w, d ) * smoothstep( w,  0., d );

  // Time varying pixel color
  vec3 col = vec3(1) * y;

  col += vec3(.0, 1., .0) * p;

  fragColor = vec4( col, 1.0 );
}


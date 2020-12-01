

bool circ(in vec2 cp, in vec2 pos, in float r) { return distance(cp, pos) < r; }

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = fragCoord / iResolution.xy;

  float aspect = (iResolution.x / iResolution.y);

  uv.x = aspect * (uv.x);

  vec2 mouseUv = iMouse.xy / iResolution.xy;

  mouseUv.x = aspect * mouseUv.x;

  // Time varying pixel color
  vec3 col = 0.5 * cos(iTime + uv.xyx + vec3(1, 2, 4));

  float step = 32.;
  float circleStep = 64.;

  // Output to screen
  vec3 pc = vec3(0, round((uv.x - uv.y) * step) / step, 0.);

  float xs = 5., ys = 3.;
  float r = 0.05;

  for( float x = 0.; x < xs; x++ ){
      for( float y = 0.; y < ys; y++){
          vec2 cp = vec2(
            1. / (xs + 1.) * (x + 1.) * (aspect),
            1. / (ys + 1.) * (y + 1.));

          float c = round((uv.y + uv.x) / 2. * circleStep) / circleStep - col[0];
          vec4 inner = vec4(vec3(c), 1.);
          float d = distance(cp, uv);

          float which = smoothstep( r, r - 0.001, d );

          pc = (c * which) + (pc * (1. - which));
      }
  }

  float d = distance(mouseUv, uv);
  float mouseR = .02;
  float m = smoothstep( mouseR, mouseR + 0.1, d );

  fragColor = vec4( mix(pc, vec3(1.,.0, .0), 1.-m), 1.0 );
}


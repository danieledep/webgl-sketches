uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D canvas;
uniform sampler2D chars;
uniform vec4 resolution;
varying vec2 vUv;
//varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {

  vec4 mchammer = texture2D(canvas, vUv);
  gl_FragColor = vec4(1., 0., 0., 1.);
  if (step(vUv.x, 0.5)>0.5) discard;
  gl_FragColor = mchammer;
}

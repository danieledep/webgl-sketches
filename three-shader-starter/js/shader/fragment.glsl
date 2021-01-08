uniform float time;
uniform float progress;
uniform vec4 resolution;
//uniform sampler2D texture1;

varying vec2 vUv;
varying vec4 vPosition;

float PI = 3.141592653589793238;

void main() {

  //vec2 newUv = vUv;

  //gl_FragColor = vec4 ( 1., 0.0, 0.0, 1.);
  gl_FragColor = vec4 (vUv, 0.0, 1.);
  //gl_FragColor = vec4(vScale);
}

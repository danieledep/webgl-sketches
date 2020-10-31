uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D chars;
uniform vec4 resolution;
varying vec2 vUv;
//varying vec3 vPosition;
float PI = 3.141592653589793238;
varying float vScale;

void main() {

  float size = 66.;
  vec2 newUv = vUv;
  newUv.x = vUv.x/size + floor(vScale*size)/size;
  vec4 charsMap = texture2D(chars, newUv);
  gl_FragColor = vec4 (vUv, 0.0, 1.);
  gl_FragColor = charsMap;
  //gl_FragColor = vec4(vScale);
}

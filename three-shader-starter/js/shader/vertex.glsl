uniform float time;
uniform vec2 pixels;
uniform vec2 uvRate1;
//uniform sampler2D texture1;

varying vec2 vUv;
varying vec4 vPosition;

float PI = 3.141592653589793238;

void main() {

  vUv = uv; 
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
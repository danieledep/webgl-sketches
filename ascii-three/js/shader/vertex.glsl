uniform float time;
varying vec2 vUv;
//varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;

attribute float instanceScale;
varying float vScale;

    void main() {
      vUv = uv; 
      vScale = instanceScale;
      gl_Position = projectionMatrix * modelViewMatrix* instanceMatrix*vec4(position, 1.0); 
    }
uniform float playhead;
uniform float level;
uniform float black;
varying vec2 vUv;
float PI = 3.141592653589793238;




void main() {

        float w = 0.4;
        float smoothness = 0.001;

        float border = smoothstep( w, w+smoothness , vUv.x);
        float border1 = smoothstep( w, w+smoothness, vUv.y);
        float border2 = smoothstep( w, w+smoothness, 1. - vUv.y);
        float border3 = smoothstep( w, w+smoothness, 1. - vUv.x);

        border =border*border1*border2*border3;

        if (border == 1.) discard;


        gl_FragColor = vec4( vec3(0.267, 0.97, 0.97), border);

    
}
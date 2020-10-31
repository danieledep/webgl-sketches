// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
import fragment1 from './shader/fragment1.glsl'



const settings = {
  // Make the loop animated
  animate: true,
  fps: 24,
    duration: 15,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: {antialias: true}
  
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(1.5, 2, 2);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  let number = 50;

  let geometry = new THREE.PlaneBufferGeometry(1, 1).rotateX(Math.PI/2);
  
  let material = new THREE.MeshBasicMaterial({wireframe : true});

  let mat = new THREE.ShaderMaterial({

  extensions: {
    derivatives:"#extension GL_OES_standard_derivatives : enable"
  },
  side: THREE.DoubleSide,
  uniforms: {
    time: { type: "f", value: 0},
    level: { type: "f", value: 0 },
    playhead: { type: "f", value: 0 },
    black: { type: "f", value: 0 },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    }
  },
  // wireframe: true,
  transparent: true,
  vertexShader: vertex,
  fragmentShader: fragment
  });

  let matBlack = new THREE.ShaderMaterial({

    extensions: {
      derivatives:"#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0},
      level: { type: "f", value: 0 },
      playhead: { type: "f", value: 0 },
      black: { type: "f", value: 0 },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment1
    });

  let group = new THREE.Group();
  scene.add(group);
  group.position.y = -0.5;

  let mats = []; 

  for (let i = 0; i <= number; i++) {
    
    let level = i/number;

    let m0 = mat.clone();
    let m1 = mat.clone();
    mats.push(m0);
    mats.push(m1)


    m0.uniforms.black.value = 1;
    m1.uniforms.black.value = 0;

    m0.uniforms.level.value = level;
    m1.uniforms.level.value = level;

    let mesh = new THREE.Mesh(geometry, m0);
    let mesh1 = new THREE.Mesh(geometry, m1);
    
    mesh.position.y = level;
    mesh1.position.y = level - 0.005;

    if (i == number) {
      mesh1.position.y = level - 1/number;
    }
    

    group.add(mesh)
    group.add(mesh1)
  }

  let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(6, 6), matBlack).rotateX(Math.PI/2);
  mesh.position.y = 0.4

  group.add(mesh)
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {

      mats.forEach(m => {
        m.uniforms.playhead.value = playhead;

      });

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

import * as THREE from "three"
import chars from '../img/chars.png'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
import vertex1 from './shader/vertex1.glsl'
import fragment1 from './shader/fragment1.glsl'

import {TimelineMax} from 'gsap'
import { Mesh } from "three";
let OrbitControls = require("three-orbit-controls")(THREE);


export default class Sketch {


	constructor (options) {
this.scene = new THREE.Scene();
this.container = options.dom;
this.width= this.container.offsetWidth;
this.height = this.container.offsetHeight;
this.renderer = new THREE.WebGLRenderer();
this.renderer.setPixelRatio(window.devicePixelRatio);
this.renderer.setSize(this.width, this.height);
this.renderer.setClearColor(0xeeeeee, 1);
this.renderer.physicallyCorrectLights = true;
this.renderer.outputEncoding = THREE.sRGBEncoding;

this.container.appendChild(this.renderer.domElement);

/*
this.camera = new THREE.PerspectiveCamera (
	70,
	window.innerWidth / window.innerHeight,
	0.001,
	1000
);
*/

let frustumSize = 1.4;
let aspect = 1;
this.camera = new THREE.OrthographicCamera(frustumSize*aspect/ -2, frustumSize*aspect/2, frustumSize/2, frustumSize/-2, -1000, 1000);
this.camera.position.set(0, 0, 2);
this.controls = new OrbitControls(this.camera, this.renderer.domElement);
this.time = 0;
this.isPlaying = true;

this.gridSize = 1;
this.size = 80;
this.cellSize = this.gridSize / this.size;

this.addObjects();
this.resize();
this.render();
this.setupResize();
this.initVideo();
	}

initVideo () {
	this.video = document.getElementById('video');
	this.canvas = document.createElement('canvas');
	this.canvas1 = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.ctx1 = this.canvas1.getContext('2d');
	this.canvas.width = this.size;
	this.canvas.height = this.size;
	this.canvas1.width = 1024;
	this.canvas1.height = 1024;


	document.body.appendChild(this.canvas);
	document.body.appendChild(this.canvas1);

	this.mc = new THREE.CanvasTexture(this.canvas1);
	this.mat1.uniforms.canvas.value = this.mc;
	this.mc.needsUpdate = true;

	this.video.addEventListener('play', ()=> {
		this.timerCallback();
		}, false);
}

timerCallback() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    setTimeout(()=> {
        this.timerCallback();
      }, 0);
  }

  computeFrame() {

	let scales = new Float32Array(this.size**2);

	this.ctx.drawImage(this.video, 0, 0, this.size, this.size);
	this.ctx1.drawImage(this.video, 0, 0, 1024, 1024);
	let imageData = this.ctx.getImageData(0, 0, this.size, this.size);

	for (let i=0; i<imageData.data.length; i+=4) {
		scales.set([imageData.data[i]/255], i/4)
	}

	
	this.plane.geometry.attributes.instanceScale.array = scales;
	this.plane.geometry.attributes.instanceScale.needsUpdate = true;
	this.mc.needsUpdate = true;
  }

settings() {
	let that = this;
	this.settings = {
		progress: 0,
	};
	this.gui = new dat.GUI ();
	this.gui.add(this.settings, "progress", 0, 1, 0.01);
}

setupResize() {
	window.addEventListener("resize", this.resize.bind(this));
}

resize() {
	this.width = this.container.offsetWidth;
	this.height = this.container.offsetHeight;
	this.renderer.setSize(this.width, this.height);
	this.camera.aspect = this.width / this.height;

	this.camera.updateProjectionMatrix();
}

addObjects() {
	let that = this;
	this.material = new THREE.ShaderMaterial({

		extensions: {
		  derivatives:"#extension GL_OES_standard_derivatives : enable"
		},
		side: THREE.DoubleSide,
		uniforms: {
		  time: { type: "f", value: 0},
		  chars: { type: "t", value: new THREE.TextureLoader().load(chars) },
		  resolution : {type: "v4", value: new THREE.Vector4() },
		  uvRate1: {
			  value: new THREE.Vector2(1, 1)
		  }
		},
		// wireframe: true,
		//transparent: true,
		vertexShader: vertex,
		fragmentShader: fragment
		});

		this.geometry = new THREE.PlaneBufferGeometry(this.cellSize, this.cellSize);
		this.plane = new THREE.InstancedMesh(this.geometry, this.material, this.size**2);

		let dummy = new THREE.Object3D();
		let count = 0;
		let scales = new Float32Array(this.size**2);

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				dummy.position.set(j*this.cellSize-0.5, -i*this.cellSize+0.5);
				dummy.updateMatrix();
				scales.set([Math.random()], count);
				this.plane.setMatrixAt(count++, dummy.matrix);
				
			}
		}

		this.plane.instanceMatrix.needsUpdate = true;
		this.plane.geometry.setAttribute('instanceScale', new THREE.InstancedBufferAttribute(scales, 1));
		this.scene.add(this.plane);

		this.geo1 = new THREE.PlaneBufferGeometry(1, 1);
		this.mat1 = new THREE.ShaderMaterial({

			extensions: {
			  derivatives:"#extension GL_OES_standard_derivatives : enable"
			},
			side: THREE.DoubleSide,
			uniforms: {
			  time: { type: "f", value: 0},
			  canvas: { type: "t", value: null},
			  chars: { type: "t", value: new THREE.TextureLoader().load(chars) },
			  resolution : {type: "v4", value: new THREE.Vector4() },
			  uvRate1: {
				  value: new THREE.Vector2(1, 1)
			  }
			},
			// wireframe: true,
			//transparent: true,
			vertexShader: vertex1,
			fragmentShader: fragment1
			});

	this.mesh1 = new THREE.Mesh(this.geo1, this.mat1);
	this.scene.add(this.mesh1);

}

stop() {
	this.isPlaying = false;
}

play() {
	if (!this.isPlaying) {
		this.renderer();
		this.isPlaying = true;
	}
}

render() {
	if (!this.isPlaying) return;
	this.time += 0.05;
	this.material.uniforms.time.value = this.time;
	requestAnimationFrame(this.render.bind(this));
	this.renderer.render(this.scene, this.camera);
}
}

new Sketch({
	dom: document.getElementById("container")
})


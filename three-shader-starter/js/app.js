import * as THREE from "three";
import {  OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// impoty { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
//import t1 from '../texture.png'
//import * as dat from "dat.gui";

import TimelineMax from "gsap"

export default class Sketch {
	constructor(selector) {

		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xeeeeee, 1);
		this.container = document.getElementById("container");
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.container.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.001,
			1000
		);

		// let frustumSize = 10;
		// let aspect = window.innerWidth / window.innerHeight;
		// this.camera = new THREE.OrthographicCamera(frustumSize*aspect/ -2, frustumSize*aspect/2, frustumSize/2, frustumSize/-2, -1000, 1000);
		
		this.camera.position.set(0, 0 , 2);
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
			
		this.time = 0;
		this.isPlaying = true;
		
		this.setupResize();
		this.addObjects();
		this.resize();
		this.render();
		
		//this.settings();

	}

	settings() {
		let that = this;
		this.settings = {
			time : 0,
		};
		this.gui = new dat.GUI();
		this.gui.add(this.settings, "time", 0, 100, 0.01);
	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this), false);
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

		//let tt1 = new THREE.TextureLoader().load(t1)
		this.material = new THREE.ShaderMaterial({
			extensions: {
			  derivatives:"#extension GL_OES_standard_derivatives : enable"
			},
			side: THREE.DoubleSide,
			uniforms: {
			  time: { type: "f", value: 0},
			  resolution : {type: "v4", value: new THREE.Vector4() },
			  //texture1: { type: "t", value: tt1 },
			  uvRate1: {
				  value: new THREE.Vector2(1, 1)
			  }
			},
			// wireframe: true,
			//transparent: true,
			vertexShader: vertex,
			fragmentShader: fragment
			});
	
			this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 10, 1, 10);
			this.plane = new THREE.Mesh(this.geometry, this.material);
			this.scene.add(this.plane);
	
	}

	stop() {
		this.isPlaying = false;
	}

	play() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.renderer();
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

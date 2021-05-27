import {
    AmbientLight,
    Clock,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from './three.module.js';

import { OrbitControls } from './orbit-controls.js';
import { GLTFLoader } from './gltf-loader.js';

let gltf = 0;
let lastCard = -1;
let card = 0;

document.getElementById('next').onclick = async () => {
    console.log('next');
    card = (card + 1) % 6;
    await updateUv()
};
document.getElementById('prev').onclick = async () => {
    console.log('prev');
    card = card - 1 >= 0 ? card - 1 : 5;
    await updateUv()
};

const updateUv = async () => {
    if(lastCard !== card && gltf) {
        try {
        const uvMap = await new TextureLoader().loadAsync(`${card + 1}-card-uv.png`);
        uvMap.flipY = false;
        gltf.scene.traverse(node => {
            if(node.isMesh) node.material.map = uvMap;
        });
        lastCard = card;
        } catch(e) {
            console.log(e)
        }
    }
}

const creator = new URLSearchParams(window.location.search).get('creator');
const viewer = new URLSearchParams(window.location.search).get('viewer');

console.log('NFT created by', creator);
console.log('NFT viewed by', viewer);

class Sketch {
    constructor() {
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        this.camera = new PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.camera.position.set(0, 0, 9);

        this.scene = new Scene();

        this.canvas = null;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.clock = new Clock();

        this.resize();
    }

    async init() {
        this.addCanvas();
        this.addEvents();
        await this.addElements();
        this.addLights();
        this.render();
    }

    addCanvas() {
        this.canvas = this.renderer.domElement;
        document.body.appendChild(this.canvas);
    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    async addElements() {
        const gltfLoader = new GLTFLoader();
        const url = 'card.gltf';
        gltf = await gltfLoader.loadAsync(url);
        const uvMap = await new TextureLoader().loadAsync(`${card + 1}-card-uv.png`);
        uvMap.flipY = false;
        gltf.scene.traverse(node => {
            if(node.isMesh) node.material.map = uvMap;
        });
        this.scene.add(gltf.scene);
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render() {
        this.controls.update();
        this.scene.children[0].rotation.y = this.clock.getElapsedTime() * 0.35;
        this.renderer.setAnimationLoop(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    addLights() {
        const light = new AmbientLight(0xffffff); // soft white light
        this.scene.add(light);
    }
}

(new Sketch()).init().then();

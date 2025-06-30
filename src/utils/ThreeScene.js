import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';

export function initThreeScene() {
  const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 13;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container3D').appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  scene.add(ambientLight, topLight);

  let bee, mixer;

  const loader = new GLTFLoader();
  loader.load('/demon_bee_full_texture.glb', (gltf) => {
    bee = gltf.scene;
    scene.add(bee);
    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove();
  });

  const animate = () => {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.02);
    renderer.render(scene, camera);
  };
  animate();

  const positions = [
    { id: 'banner', position: { x: 0, y: -1, z: 0 }, rotation: { x: 0, y: 1.5, z: 0 } },
    { id: 'intro', position: { x: 1, y: -1, z: -5 }, rotation: { x: 0.5, y: -0.5, z: 0 } },
    { id: 'description', position: { x: -1, y: -1, z: -5 }, rotation: { x: 0, y: 0.5, z: 0 } },
    {
    id: 'banner',
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 }
  },
  {
    id: 'intro', // 01: Graph Traversals
    position: { x: 1, y: -1, z: -5 },
    rotation: { x: 0.5, y: -0.5, z: 0 }
  },
  {
    id: 'recursion', // 02: Recursion Tree
    position: { x: -1, y: -1, z: -5 },
    rotation: { x: 0, y: 0.5, z: 0 }
  },
  {
    id: 'heap', // 03: Heap Sort
    position: { x: 0.8, y: -1, z: 0 },
    rotation: { x: 0.3, y: -0.5, z: 0 }
  },
  {
    id: 'horspool', // 04: Horspool String Matching
    position: { x: -0.8, y: -1, z: 0 },
    rotation: { x: -0.3, y: 0.5, z: 0 }
  },
  {
    id: 'prim', // 05: Prim’s Algorithm
    position: { x: 0, y: -1, z: -3 },
    rotation: { x: 0.2, y: 0.2, z: 0 }
  },

    { id: 'contact', position: { x: 0.8, y: -1, z: 0 }, rotation: { x: 0.3, y: -0.5, z: 0 } }
  ];

  const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let current;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= window.innerHeight / 3) {
        current = section.id;
      }
    
    
    });

    const active = positions.find(p => p.id === current);
    if (active && bee) {
      gsap.to(bee.position, { ...active.position, duration: 3, ease: "power1.out" });
      gsap.to(bee.rotation, { ...active.rotation, duration: 3, ease: "power1.out" });
    }
  };

  window.addEventListener('scroll', () => {
    if (bee) modelMove();
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

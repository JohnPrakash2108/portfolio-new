import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// Canvas
const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
    console.error('Canvas not found!');
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.001);

// Space background with stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const starVertices = [];
const starSizes = [];

for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
    starSizes.push(Math.random() * 0.3);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Add glowing star trails
const trailGeometry = new THREE.BufferGeometry();
const trailMaterial = new THREE.PointsMaterial({
    color: 0x64ffda,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const trailVertices = [];
for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    trailVertices.push(x, y, z);
}

trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailVertices, 3));
const starTrails = new THREE.Points(trailGeometry, trailMaterial);
scene.add(starTrails);

// Moon
const moonGeometry = new THREE.SphereGeometry(15, 64, 64);
const moonTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/2k_moon.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 0.8,
    metalness: 0.2,
    normalScale: new THREE.Vector2(2, 2)
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(40, 0, -50);
scene.add(moon);

// Moon glow
const moonGlowGeometry = new THREE.SphereGeometry(15.5, 32, 32);
const moonGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x64ffda,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
});
const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
moon.add(moonGlow);

// Computer
const computerGroup = new THREE.Group();

// Monitor
const monitorGeometry = new THREE.BoxGeometry(20, 15, 1);
const monitorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.3
});
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(0, 0, 0);
computerGroup.add(monitor);

// Screen
const screenGeometry = new THREE.PlaneGeometry(19, 14);
const screenMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x64ffda,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
});
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0, 0, 0.51);
computerGroup.add(screen);

// Screen glow
const screenGlowGeometry = new THREE.PlaneGeometry(20, 15);
const screenGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x64ffda,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
});
const screenGlow = new THREE.Mesh(screenGlowGeometry, screenGlowMaterial);
screenGlow.position.set(0, 0, 0.52);
computerGroup.add(screenGlow);

// Stand
const standGeometry = new THREE.BoxGeometry(3, 8, 3);
const stand = new THREE.Mesh(standGeometry, monitorMaterial);
stand.position.set(0, -11.5, 0);
computerGroup.add(stand);

// Base
const baseGeometry = new THREE.BoxGeometry(12, 1, 12);
const base = new THREE.Mesh(baseGeometry, monitorMaterial);
base.position.set(0, -16, 0);
computerGroup.add(base);

// Keyboard
const keyboardGeometry = new THREE.BoxGeometry(16, 0.5, 6);
const keyboard = new THREE.Mesh(keyboardGeometry, monitorMaterial);
keyboard.position.set(0, -16, 8);
computerGroup.add(keyboard);

computerGroup.position.set(-40, 0, -20);
computerGroup.rotation.y = Math.PI / 4;
scene.add(computerGroup);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 100);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom effect
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.0,
    0.5,
    0.8
);
composer.addPass(bloomPass);

// Film grain effect
const filmPass = new FilmPass(
    0.35,   // noise intensity
    0.025,  // scanline intensity
    648,    // scanline count
    false   // grayscale
);
composer.addPass(filmPass);

// RGB shift effect
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms.amount.value = 0.001;
composer.addPass(rgbShiftPass);

// FXAA anti-aliasing
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / (window.innerWidth * renderer.getPixelRatio()), 1 / (window.innerHeight * renderer.getPixelRatio()));
composer.addPass(fxaaPass);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 50;
controls.maxDistance = 200;

// Enhanced lighting system
const lights = new THREE.Group();

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
lights.add(ambientLight);

// Left side lights
const leftPointLight = new THREE.PointLight(0x64ffda, 1.2);
leftPointLight.position.set(-50, 30, -50);
lights.add(leftPointLight);

const leftSpotLight = new THREE.SpotLight(0x64ffda, 0.8);
leftSpotLight.position.set(-40, 40, -40);
leftSpotLight.angle = Math.PI / 6;
leftSpotLight.penumbra = 0.1;
leftSpotLight.decay = 2;
leftSpotLight.distance = 200;
leftSpotLight.target.position.set(-20, 30, -50);
lights.add(leftSpotLight);

// Right side lights
const rightPointLight = new THREE.PointLight(0xff64da, 1.2);
rightPointLight.position.set(50, 30, -50);
lights.add(rightPointLight);

const rightSpotLight = new THREE.SpotLight(0xff64da, 0.8);
rightSpotLight.position.set(40, 40, -40);
rightSpotLight.angle = Math.PI / 6;
rightSpotLight.penumbra = 0.1;
rightSpotLight.decay = 2;
rightSpotLight.distance = 200;
rightSpotLight.target.position.set(20, 30, -50);
lights.add(rightSpotLight);

// Center light for name
const centerLight = new THREE.PointLight(0xffffff, 0.6);
centerLight.position.set(0, 30, -40);
lights.add(centerLight);

scene.add(lights);

// Animation
const clock = new THREE.Clock();
let previousTime = 0;

// Add handwritten text
const fontLoader = new FontLoader();
fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('JPB', {
            font: font,
            size: 20,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 5
        });

        textGeometry.center();

        // Create glowing material for text
        const textMaterial = new THREE.MeshPhongMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.5,
            shininess: 100,
            transparent: true,
            opacity: 0
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 30, -50);
        scene.add(textMesh);

        // Add text glow
        const textGlowGeometry = new TextGeometry('JPB', {
            font: font,
            size: 20.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        });
        textGlowGeometry.center();

        const textGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });

        const textGlow = new THREE.Mesh(textGlowGeometry, textGlowMaterial);
        textGlow.position.copy(textMesh.position);
        textGlow.position.z += 0.1;
        scene.add(textGlow);

        // Store text objects for animation
        window.textObjects = {
            mesh: textMesh,
            glow: textGlow,
            progress: 0
        };
    },
    // Progress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.error('Error loading font:', error);
    }
);

// Add particles
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    color: 0x64ffda,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particleVertices = [];
for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    particleVertices.push(x, y, z);
}

particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Add shooting stars
const shootingStars = [];
for (let i = 0; i < 5; i++) {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const positions = new Float32Array(20 * 3); // 20 points for trail
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const star = new THREE.Points(starGeometry, starMaterial);
    star.visible = false;
    scene.add(star);
    shootingStars.push(star);
}

// Add resume particles
const resumeParticlesGeometry = new THREE.BufferGeometry();
const resumeParticlesMaterial = new THREE.PointsMaterial({
    color: 0x64ffda,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const resumeParticleVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    resumeParticleVertices.push(x, y, z);
}

resumeParticlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(resumeParticleVertices, 3));
const resumeParticles = new THREE.Points(resumeParticlesGeometry, resumeParticlesMaterial);
resumeParticles.position.set(0, 0, -50);
scene.add(resumeParticles);

const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate text writing effect
    if (window.textObjects) {
        window.textObjects.progress = Math.min(1, window.textObjects.progress + 0.005);
        
        // Fade in text
        window.textObjects.mesh.material.opacity = window.textObjects.progress;
        window.textObjects.glow.material.opacity = window.textObjects.progress * 0.2;

        // Add writing animation effect
        const vertices = window.textObjects.mesh.geometry.attributes.position.array;
        const originalVertices = window.textObjects.mesh.geometry.attributes.position.array.slice();
        
        for (let i = 0; i < vertices.length; i += 3) {
            const progress = Math.min(1, window.textObjects.progress * 3 - (i / vertices.length));
            if (progress > 0) {
                vertices[i] = originalVertices[i] * progress;
                vertices[i + 1] = originalVertices[i + 1] * progress;
                vertices[i + 2] = originalVertices[i + 2] * progress;
            }
        }
        window.textObjects.mesh.geometry.attributes.position.needsUpdate = true;

        // Add floating animation
        window.textObjects.mesh.position.y = 30 + Math.sin(elapsedTime * 0.5) * 2;
        window.textObjects.glow.position.y = window.textObjects.mesh.position.y;
    }

    // Enhanced star animations
    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.0001;
    
    // Animate star sizes
    const sizes = stars.geometry.attributes.size.array;
    for (let i = 0; i < sizes.length; i++) {
        sizes[i] = Math.sin(elapsedTime + i) * 0.15 + 0.15;
    }
    stars.geometry.attributes.size.needsUpdate = true;

    // Animate star trails
    starTrails.rotation.y += 0.0002;
    starTrails.rotation.x += 0.0002;
    starTrails.material.opacity = 0.3 + Math.sin(elapsedTime) * 0.2;

    // Animate shooting stars
    shootingStars.forEach((star, index) => {
        if (!star.visible && Math.random() < 0.001) {
            // Start new shooting star
            star.visible = true;
            star.position.set(
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000
            );
            star.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ),
                life: 1.0
            };
        }

        if (star.visible) {
            // Update shooting star position
            star.position.add(star.userData.velocity);
            star.userData.life -= 0.01;

            // Update trail
            const positions = star.geometry.attributes.position.array;
            for (let i = positions.length - 3; i > 0; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }
            positions[0] = star.position.x;
            positions[1] = star.position.y;
            positions[2] = star.position.z;
            star.geometry.attributes.position.needsUpdate = true;

            // Fade out and reset
            if (star.userData.life <= 0) {
                star.visible = false;
            }
        }
    });

    // Enhanced moon rotation and movement
    moon.rotation.y += 0.002;
    moon.rotation.x += 0.001;
    moon.position.y = Math.sin(elapsedTime * 0.2) * 5;
    moon.position.x = Math.cos(elapsedTime * 0.1) * 10;

    // Animate particles
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0005;

    // Enhanced floating animation for computer
    computerGroup.position.y = Math.sin(elapsedTime * 0.001) * 2;
    computerGroup.rotation.z = Math.sin(elapsedTime * 0.0005) * 0.1;

    // Animate screen glow
    screenGlow.material.opacity = 0.2 + Math.sin(elapsedTime * 0.002) * 0.1;

    // Animate lights with reduced intensity variations
    leftPointLight.position.x = -50 + Math.sin(elapsedTime * 0.5) * 10;
    leftPointLight.position.y = 30 + Math.cos(elapsedTime * 0.3) * 5;
    leftPointLight.intensity = 1.2 + Math.sin(elapsedTime * 2) * 0.3;

    rightPointLight.position.x = 50 + Math.sin(elapsedTime * 0.5) * 10;
    rightPointLight.position.y = 30 + Math.cos(elapsedTime * 0.3) * 5;
    rightPointLight.intensity = 1.2 + Math.sin(elapsedTime * 2 + Math.PI) * 0.3;

    leftSpotLight.position.x = -40 + Math.sin(elapsedTime * 0.3) * 5;
    leftSpotLight.position.y = 40 + Math.cos(elapsedTime * 0.2) * 3;
    leftSpotLight.intensity = 0.8 + Math.sin(elapsedTime * 1.5) * 0.2;

    rightSpotLight.position.x = 40 + Math.sin(elapsedTime * 0.3) * 5;
    rightSpotLight.position.y = 40 + Math.cos(elapsedTime * 0.2) * 3;
    rightSpotLight.intensity = 0.8 + Math.sin(elapsedTime * 1.5 + Math.PI) * 0.2;

    centerLight.intensity = 0.6 + Math.sin(elapsedTime) * 0.1;

    // Update post-processing effects
    rgbShiftPass.uniforms.amount.value = Math.sin(elapsedTime * 0.5) * 0.001;
    filmPass.uniforms.grayscale.value = Math.sin(elapsedTime * 0.2) > 0;
    bloomPass.strength = 1.5 + Math.sin(elapsedTime * 0.5) * 0.5;

    // Update controls
    controls.update();

    // Animate resume particles
    const resumeSection = document.querySelector('#resume');
    if (resumeSection) {
        const rect = resumeSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            resumeParticles.visible = true;
            resumeParticles.rotation.y += 0.0005;
            resumeParticles.rotation.x += 0.0005;
            
            // Pulse particles
            const positions = resumeParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + i) * 0.01;
            }
            resumeParticles.geometry.attributes.position.needsUpdate = true;
        } else {
            resumeParticles.visible = false;
        }
    }

    // Render with post-processing
    composer.render();

    // Call animate again on the next frame
    window.requestAnimationFrame(animate);
};

// Handle window resize
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    fxaaPass.uniforms['resolution'].value.set(1 / (window.innerWidth * renderer.getPixelRatio()), 1 / (window.innerHeight * renderer.getPixelRatio()));
});

// Mouse move effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
    
    // Update computer rotation based on mouse position
    computerGroup.rotation.y = Math.PI / 4 + mouseX;
    computerGroup.rotation.x = mouseY * 0.3;

    // Update RGB shift based on mouse position
    rgbShiftPass.uniforms.amount.value = mouseX * 0.002;
});

// Start animation
animate(); 
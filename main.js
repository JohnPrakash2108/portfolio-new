import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('starfield');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create stars
    const createStars = () => {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Position stars in a sphere
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;

            // Random colors
            colors[i3] = Math.random();
            colors[i3 + 1] = Math.random();
            colors[i3 + 2] = Math.random();
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        return new THREE.Points(starGeometry, starMaterial);
    };

    const stars = createStars();
    scene.add(stars);

    // Position camera
    camera.position.z = 1000;

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotate stars
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.0001;

        // Twinkle effect
        const positions = stars.geometry.attributes.position.array;
        const colors = stars.geometry.attributes.color.array;

        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            const twinkle = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
            colors[i3] *= twinkle;
            colors[i3 + 1] *= twinkle;
            colors[i3 + 2] *= twinkle;
        }

        stars.geometry.attributes.color.needsUpdate = true;
        renderer.render(scene, camera);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();
}); 
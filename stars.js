// Import Three.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Wait for the page to load
window.addEventListener('load', () => {
    console.log('Page loaded, initializing Three.js');
    
    // Get the canvas
    const canvas = document.getElementById('starfield');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    console.log('Canvas found:', canvas);

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.05);
    scene.add(ambientLight);

    // Create light beam material
    const beamMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    // Create light beam geometry
    const createBeamGeometry = (width, height) => {
        const geometry = new THREE.PlaneGeometry(width, height);
        return geometry;
    };

    // Add focused spotlights for the name
    const spotLight1 = new THREE.SpotLight(0x64ffda, 5);
    spotLight1.position.set(-15, 15, 20);
    spotLight1.angle = Math.PI / 4;
    spotLight1.penumbra = 0.05;
    spotLight1.decay = 0.5;
    spotLight1.distance = 50;
    spotLight1.target.position.set(0, 0, 0);
    scene.add(spotLight1);
    scene.add(spotLight1.target);

    // Add visible beam for spotlight 1
    const beam1 = new THREE.Mesh(
        createBeamGeometry(20, 50),
        beamMaterial.clone()
    );
    beam1.material.color.set(0x64ffda);
    beam1.position.set(-15, 15, 20);
    beam1.rotation.x = Math.PI / 2;
    scene.add(beam1);

    const spotLight2 = new THREE.SpotLight(0xff64da, 5);
    spotLight2.position.set(15, 15, 20);
    spotLight2.angle = Math.PI / 4;
    spotLight2.penumbra = 0.05;
    spotLight2.decay = 0.5;
    spotLight2.distance = 50;
    spotLight2.target.position.set(0, 0, 0);
    scene.add(spotLight2);
    scene.add(spotLight2.target);

    // Add visible beam for spotlight 2
    const beam2 = new THREE.Mesh(
        createBeamGeometry(20, 50),
        beamMaterial.clone()
    );
    beam2.material.color.set(0xff64da);
    beam2.position.set(15, 15, 20);
    beam2.rotation.x = Math.PI / 2;
    scene.add(beam2);

    // Add a center spotlight
    const centerSpot = new THREE.SpotLight(0xffffff, 4);
    centerSpot.position.set(0, 20, 20);
    centerSpot.angle = Math.PI / 6;
    centerSpot.penumbra = 0.05;
    centerSpot.decay = 0.5;
    centerSpot.distance = 50;
    centerSpot.target.position.set(0, 0, 0);
    scene.add(centerSpot);
    scene.add(centerSpot.target);

    // Add visible beam for center spotlight
    const centerBeam = new THREE.Mesh(
        createBeamGeometry(15, 40),
        beamMaterial.clone()
    );
    centerBeam.material.color.set(0xffffff);
    centerBeam.position.set(0, 20, 20);
    centerBeam.rotation.x = Math.PI / 2;
    scene.add(centerBeam);

    // Add a ground plane to see the light effect
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    scene.add(ground);

    // Create stars with different layers
    const createStarLayer = (count, size, color, spread) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const twinkleSpeeds = new Float32Array(count);
        const twinklePhases = new Float32Array(count);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * spread;
            positions[i3 + 1] = (Math.random() - 0.5) * spread;
            positions[i3 + 2] = (Math.random() - 0.5) * spread;

            // Add slight color variation
            colors[i3] = color.r + (Math.random() - 0.5) * 0.2;
            colors[i3 + 1] = color.g + (Math.random() - 0.5) * 0.2;
            colors[i3 + 2] = color.b + (Math.random() - 0.5) * 0.2;

            // Random twinkle speed and phase for each star
            twinkleSpeeds[i] = 0.5 + Math.random() * 2;
            twinklePhases[i] = Math.random() * Math.PI * 2;

            // Random size for each star
            sizes[i] = size * (0.5 + Math.random() * 0.5);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));
        geometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: size,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            map: createStarTexture()
        });

        return new THREE.Points(geometry, material);
    };

    // Create star texture
    function createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');

        // Create gradient
        const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // Create multiple star layers with more stars
    const starLayers = [
        createStarLayer(5000, 1.0, new THREE.Color(0xffffff), 200), // Background stars
        createStarLayer(3000, 1.5, new THREE.Color(0x64ffda), 150), // Teal stars
        createStarLayer(2000, 2.0, new THREE.Color(0xff64da), 100)   // Pink stars
    ];

    starLayers.forEach(layer => scene.add(layer));

    // Create orbits
    const createOrbits = () => {
        const orbits = new THREE.Group();
        const orbitCount = 5;
        const orbitGeometry = new THREE.RingGeometry(10, 10.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });

        for (let i = 0; i < orbitCount; i++) {
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial.clone());
            orbit.scale.set(1 + i * 0.5, 1 + i * 0.5, 1);
            orbit.rotation.x = Math.PI / 2;
            orbits.add(orbit);
        }

        return orbits;
    };

    const orbits = createOrbits();
    scene.add(orbits);

    // Position camera
    camera.position.z = 30;

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;

        // Rotate orbits
        orbits.rotation.y += 0.0002;
        orbits.rotation.x += 0.0001;

        // Rotate star layers at different speeds
        starLayers.forEach((layer, index) => {
            layer.rotation.y += 0.0002 * (index + 1);
            layer.rotation.x += 0.0001 * (index + 1);
        });

        // Move spotlights and beams
        spotLight1.position.x = -15 + Math.sin(time) * 1;
        spotLight1.position.y = 15 + Math.cos(time) * 1;
        beam1.position.x = spotLight1.position.x;
        beam1.position.y = spotLight1.position.y;

        spotLight2.position.x = 15 + Math.cos(time) * 1;
        spotLight2.position.y = 15 + Math.sin(time) * 1;
        beam2.position.x = spotLight2.position.x;
        beam2.position.y = spotLight2.position.y;

        centerSpot.position.y = 20 + Math.sin(time * 0.5) * 0.5;
        centerBeam.position.y = centerSpot.position.y;

        // Enhanced twinkle effect
        starLayers.forEach(layer => {
            const colors = layer.geometry.attributes.color.array;
            const twinkleSpeeds = layer.geometry.attributes.twinkleSpeed.array;
            const twinklePhases = layer.geometry.attributes.twinklePhase.array;
            const sizes = layer.geometry.attributes.size.array;

            for (let i = 0; i < colors.length; i += 3) {
                const starIndex = i / 3;
                const twinkle = Math.sin(time * twinkleSpeeds[starIndex] + twinklePhases[starIndex]) * 0.5 + 0.5;
                
                // Add some randomness to the twinkle
                const randomFactor = 0.2 + Math.random() * 0.1;
                const finalTwinkle = twinkle * (1 - randomFactor) + randomFactor;

                // Update color
                colors[i] *= finalTwinkle;
                colors[i + 1] *= finalTwinkle;
                colors[i + 2] *= finalTwinkle;

                // Update size for twinkling effect
                sizes[starIndex] = layer.material.size * (0.5 + finalTwinkle * 0.5);
            }
            layer.geometry.attributes.color.needsUpdate = true;
            layer.geometry.attributes.size.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    console.log('Starting animation');
    animate();
}); 
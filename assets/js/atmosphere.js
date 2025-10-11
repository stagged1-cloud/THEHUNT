// Blade Runner Atmospheric Effects - Three.js Particle Rain
// Inspired by https://tympanus.net/Development/ParticleRainEffect/

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

class ParticleRainEffect {
    constructor() {
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '1';
        document.body.insertBefore(this.container, document.body.firstChild);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        this.particles = null;
        this.particleCount = 2000;
        this.time = 0;
        
        this.initParticles();
        this.addLighting();
        this.animate();
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    initParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 20;     // x
            positions[i3 + 1] = (Math.random() - 0.5) * 20; // y
            positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
            
            // Velocity
            velocities[i] = 0.02 + Math.random() * 0.08;
            
            // Color - cyan/white Blade Runner rain
            const colorChoice = Math.random();
            if (colorChoice < 0.5) {
                colors[i3] = 0.0;     // R
                colors[i3 + 1] = 1.0; // G
                colors[i3 + 2] = 1.0; // B (cyan)
            } else {
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 1.0; // G
                colors[i3 + 2] = 1.0; // B (white)
            }
            
            // Size
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom shader material for rain streaks
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float velocity;
                attribute float size;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Create elongated streak effect
                    vec2 uv = gl_PointCoord;
                    float distY = abs(uv.y - 0.5);
                    float alpha = 1.0 - (distY * 2.0);
                    alpha = pow(alpha, 2.0);
                    
                    // Fade at edges
                    float distX = abs(uv.x - 0.5);
                    alpha *= 1.0 - (distX * 2.0);
                    
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            depthWrite: false,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    addLighting() {
        // Ambient glow
        const ambientLight = new THREE.AmbientLight(0x00ffff, 0.2);
        this.scene.add(ambientLight);
        
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x000000, 0.05);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016;
        
        // Update particle positions
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.attributes.velocity.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Move particles down
            positions[i3 + 1] -= velocities[i];
            
            // Slight wind effect
            positions[i3] += Math.sin(this.time + i) * 0.002;
            
            // Reset particles that fall below
            if (positions[i3 + 1] < -10) {
                positions[i3 + 1] = 10;
                positions[i3] = (Math.random() - 0.5) * 20;
                positions[i3 + 2] = (Math.random() - 0.5) * 10;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Subtle rotation for depth
        this.particles.rotation.y = Math.sin(this.time * 0.1) * 0.05;
        
        // Update shader time
        this.particles.material.uniforms.time.value = this.time;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ParticleRainEffect());
} else {
    new ParticleRainEffect();
}

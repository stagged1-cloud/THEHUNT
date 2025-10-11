// Blade Runner Atmospheric Effects - Advanced Canvas Particle Rain
// Inspired by https://tympanus.net/Development/ParticleRainEffect/

class ParticleRainEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.particles = [];
        this.particleCount = 800;
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height - this.height,
                z: Math.random() * 1000,
                length: Math.random() * 60 + 20,
                speed: Math.random() * 8 + 4,
                opacity: Math.random() * 0.6 + 0.3,
                width: Math.random() * 2 + 0.5,
                color: Math.random() < 0.7 ? 'cyan' : 'white',
                windOffset: Math.random() * Math.PI * 2,
                windSpeed: Math.random() * 0.02 + 0.01,
                trail: []
            });
        }
    }
    
    drawParticle(p) {
        // Calculate perspective based on z-depth
        const scale = (1000 - p.z) / 1000;
        const x = p.x + (this.width / 2 - p.x) * (1 - scale);
        const y = p.y + (this.height / 2 - p.y) * (1 - scale);
        const length = p.length * scale;
        const width = p.width * scale;
        
        // Create gradient for rain streak with glow
        const gradient = this.ctx.createLinearGradient(x, y, x - 3 * scale, y + length);
        
        if (p.color === 'cyan') {
            gradient.addColorStop(0, `rgba(0, 255, 255, 0)`);
            gradient.addColorStop(0.1, `rgba(0, 255, 255, ${p.opacity * 0.3})`);
            gradient.addColorStop(0.5, `rgba(100, 255, 255, ${p.opacity})`);
            gradient.addColorStop(0.8, `rgba(0, 200, 255, ${p.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(0, 150, 200, 0)`);
        } else {
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.1, `rgba(255, 255, 255, ${p.opacity * 0.3})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${p.opacity})`);
            gradient.addColorStop(0.8, `rgba(200, 200, 255, ${p.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(150, 150, 200, 0)`);
        }
        
        // Draw glow effect
        this.ctx.shadowBlur = 8 * scale;
        this.ctx.shadowColor = p.color === 'cyan' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)';
        
        // Draw main streak
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - 3 * scale, y + length);
        this.ctx.stroke();
        
        // Draw bright head
        this.ctx.shadowBlur = 15 * scale;
        this.ctx.fillStyle = p.color === 'cyan' ? `rgba(150, 255, 255, ${p.opacity * 0.8})` : `rgba(255, 255, 255, ${p.opacity * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, width * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    update() {
        this.time += 0.016;
        
        this.particles.forEach(p => {
            // Wind effect
            const windX = Math.sin(this.time * p.windSpeed + p.windOffset) * 2;
            
            // Update position with perspective
            const perspectiveSpeed = p.speed * ((1000 - p.z) / 1000);
            p.y += perspectiveSpeed;
            p.x += windX - 1.5; // Slight diagonal
            p.z += 2; // Move toward camera
            
            // Reset particle
            if (p.y > this.height + 100 || p.z > 1000) {
                p.y = -100;
                p.x = Math.random() * this.width;
                p.z = Math.random() * 200;
                p.speed = Math.random() * 8 + 4;
                p.length = Math.random() * 60 + 20;
                p.opacity = Math.random() * 0.6 + 0.3;
            }
        });
    }
    
    drawFog() {
        // Add atmospheric fog layers
        const fogGradient = this.ctx.createRadialGradient(
            this.width / 2, this.height * 0.6, 0,
            this.width / 2, this.height * 0.6, this.width * 0.8
        );
        fogGradient.addColorStop(0, 'rgba(0, 50, 80, 0.02)');
        fogGradient.addColorStop(0.5, 'rgba(0, 80, 120, 0.015)');
        fogGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = fogGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Fade previous frame for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw fog
        this.drawFog();
        
        // Update and draw particles (sort by z-depth for proper layering)
        this.update();
        this.particles
            .sort((a, b) => b.z - a.z)
            .forEach(p => this.drawParticle(p));
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ParticleRainEffect());
} else {
    new ParticleRainEffect();
}

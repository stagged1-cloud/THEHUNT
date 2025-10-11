// Blade Runner Atmospheric Effects - Canvas Particle System
class AtmosphericEffect {
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
        
        this.raindrops = [];
        this.godRays = [];
        this.smokeParticles = [];
        this.time = 0;
        
        this.initRain();
        this.initGodRays();
        this.initSmoke();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Realistic rain system
    initRain() {
        const rainCount = 300;
        for (let i = 0; i < rainCount; i++) {
            this.raindrops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 3 + 5,
                opacity: Math.random() * 0.5 + 0.3,
                width: Math.random() * 1.5 + 0.5
            });
        }
    }
    
    drawRain() {
        this.raindrops.forEach(drop => {
            // Create gradient for motion blur effect
            const gradient = this.ctx.createLinearGradient(
                drop.x, drop.y,
                drop.x, drop.y + drop.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 255, 255, ${drop.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${drop.opacity * 0.5})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = drop.width;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - 2, drop.y + drop.length);
            this.ctx.stroke();
            
            // Update position
            drop.y += drop.speed;
            drop.x -= 0.5;
            
            // Reset if off screen
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    // Volumetric light beams (god rays)
    initGodRays() {
        this.godRays = [
            { x: this.canvas.width * 0.2, angle: -20, opacity: 0.15, color: 'rgba(0, 200, 255, 0.15)' },
            { x: this.canvas.width * 0.7, angle: 15, opacity: 0.12, color: 'rgba(255, 100, 50, 0.12)' },
            { x: this.canvas.width * 0.5, angle: 0, opacity: 0.1, color: 'rgba(0, 255, 200, 0.1)' }
        ];
    }
    
    drawGodRays() {
        this.godRays.forEach(ray => {
            this.ctx.save();
            this.ctx.translate(ray.x, 0);
            this.ctx.rotate(ray.angle * Math.PI / 180);
            
            // Animated opacity pulse
            const pulse = Math.sin(this.time * 0.001) * 0.05;
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, ray.color.replace(/[\d.]+\)/, `${ray.opacity + pulse})`));
            gradient.addColorStop(0.5, ray.color.replace(/[\d.]+\)/, `${(ray.opacity + pulse) * 0.5})`));
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-100, 0, 200, this.canvas.height);
            this.ctx.restore();
        });
    }
    
    // Smoke/fog particles
    initSmoke() {
        for (let i = 0; i < 50; i++) {
            this.smokeParticles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 200,
                radius: Math.random() * 150 + 50,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.1 + 0.05,
                drift: Math.random() * 0.5 - 0.25
            });
        }
    }
    
    drawSmoke() {
        this.smokeParticles.forEach(particle => {
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius
            );
            gradient.addColorStop(0, `rgba(100, 150, 200, ${particle.opacity})`);
            gradient.addColorStop(0.5, `rgba(50, 100, 150, ${particle.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                particle.x - particle.radius,
                particle.y - particle.radius,
                particle.radius * 2,
                particle.radius * 2
            );
            
            // Update position
            particle.y -= particle.speed;
            particle.x += particle.drift;
            
            // Reset if off screen
            if (particle.y < -particle.radius) {
                particle.y = this.canvas.height + particle.radius;
                particle.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    // Draw film grain
    drawFilmGrain() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.02) { // 2% grain density
                const value = Math.random() * 50;
                data[i] = value;     // R
                data[i + 1] = value; // G
                data[i + 2] = value; // B
                data[i + 3] = 30;    // A
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    animate() {
        this.time += 16;
        
        // Clear with slight fade for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw layers
        this.drawGodRays();
        this.drawSmoke();
        this.drawRain();
        
        // Add film grain every few frames
        if (Math.random() < 0.3) {
            this.drawFilmGrain();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AtmosphericEffect());
} else {
    new AtmosphericEffect();
}

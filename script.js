document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Variables
    let particlesArray = [];
    const numberOfParticles = 200;
    let hue = 0;
    
    // Mouse position
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };
    
    // Track mouse position
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${hue}, 100%, 50%)`;
            this.originalX = this.x;
            this.originalY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        
        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        // Update particle position and handle mouse interaction
        update() {
            // Calculate distance between mouse and particle
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // Maximum distance past which the force is zero
            const maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            
            // If force is negative set it to zero
            if (force < 0) force = 0;
            
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Move particles back to original position when out of mouse radius
                if (this.x !== this.originalX) {
                    const dx = this.x - this.originalX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.originalY) {
                    const dy = this.y - this.originalY;
                    this.y -= dy / 20;
                }
            }
            
            // Keep particles in bounds
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }
            
            // Move particles slightly for ambient motion
            this.x += this.speedX / 2;
            this.y += this.speedY / 2;
            
            // Update particle color
            this.color = `hsl(${hue}, 100%, 50%)`;
            
            this.draw();
        }
    }
    
    // Initialize particles
    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw trails effect
        ctx.fillStyle = 'rgba(15, 15, 30, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        // Change color over time
        hue += 0.5;
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}); 

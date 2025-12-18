const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters - Katakana, Latin letters, and numbers
const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
const speeds = [];
const brightness = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
    speeds[i] = Math.random() * 0.5 + 0.5;
    brightness[i] = Math.random();
}

let animationSpeed = 1;
let isInteractive = false;
let colorScheme = 0;
const colors = ['#0f0', '#00ffff', '#ff00ff', '#ffff00', '#ff0000'];
let currentColor = colors[0];

// Mouse interaction
let mouseX = -100;
let mouseY = -100;

canvas.addEventListener('mousemove', (e) => {
    if (isInteractive) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});

// Touch interaction for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isInteractive && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    // Create explosion effect at touch point
    if (e.touches.length > 0) {
        const col = Math.floor(e.touches[0].clientX / fontSize);
        for (let i = Math.max(0, col - 5); i < Math.min(columns, col + 5); i++) {
            drops[i] = 0;
            speeds[i] = Math.random() * 2 + 1;
        }
    }
}, { passive: false });

canvas.addEventListener('click', (e) => {
    // Create explosion effect at click point
    const col = Math.floor(e.clientX / fontSize);
    for (let i = Math.max(0, col - 5); i < Math.min(columns, col + 5); i++) {
        drops[i] = 0;
        speeds[i] = Math.random() * 2 + 1;
    }
});

function draw() {
    // Semi-transparent black for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Calculate brightness based on mouse proximity if interactive
        let alpha = 1;
        if (isInteractive) {
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            alpha = Math.max(0.3, 1 - distance / 200);
        }
        
        // Dynamic brightness effect
        const bright = Math.sin(Date.now() / 1000 + brightness[i] * 10) * 0.3 + 0.7;
        ctx.fillStyle = currentColor + Math.floor(alpha * bright * 255).toString(16).padStart(2, '0');
        
        ctx.font = fontSize + 'px monospace';
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top when it goes off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
            speeds[i] = Math.random() * 0.5 + 0.5;
        }

        drops[i] += speeds[i] * animationSpeed;
    }
}

// Animation loop
setInterval(draw, 33);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Control buttons
document.getElementById('speed-slow').addEventListener('click', function() {
    animationSpeed = 0.5;
    updateActiveButton(this);
});

document.getElementById('speed-medium').addEventListener('click', function() {
    animationSpeed = 1;
    updateActiveButton(this);
});

document.getElementById('speed-fast').addEventListener('click', function() {
    animationSpeed = 2;
    updateActiveButton(this);
});

document.getElementById('toggle-interactive').addEventListener('click', function() {
    isInteractive = !isInteractive;
    this.classList.toggle('active');
    if (!isInteractive) {
        mouseX = -100;
        mouseY = -100;
    }
});

document.getElementById('color-cycle').addEventListener('click', function() {
    colorScheme = (colorScheme + 1) % colors.length;
    currentColor = colors[colorScheme];
});

function updateActiveButton(button) {
    document.querySelectorAll('.button-group:first-of-type button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

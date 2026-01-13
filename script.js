const canvas = document.getElementById("neuro");
const ctx = canvas.getContext("2d");

// On dimensionne le canvas à la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- PARAMÈTRES ---
const particleCount = 60;   // Nombre de points (baisse si ça lag)
const connectionDist = 150; // Distance pour créer une ligne
const speed = 0.5;          // Vitesse de déplacement (plus bas = plus calme)

// Liste des particules
let particles = [];

// Création de la "classe" Particule
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Vitesse aléatoire entre -speed et +speed
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.size = Math.random() * 2; // Taille des points (si visibles)
    }

    update() {
        // Déplacement
        this.x += this.vx;
        this.y += this.vy;

        // Rebondir sur les bords
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        // Si tu veux voir les points, décommente ces lignes :
        // ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // ctx.fill();
    }
}

// Initialisation
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// La boucle d'animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // On efface tout

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Dessiner les lignes entre les particules proches
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDist) {
                // Plus elles sont proches, plus la ligne est visible (opacité)
                const opacity = 1 - (distance / connectionDist);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`; // 0.2 = transparence max
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();


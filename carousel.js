const cards = document.querySelectorAll(".card");

let position = 0;
let velocity = 0;

let lastX = 0;
let lastTime = 0;
let isDragging = false;

/* ---------------------------
   CONFIGURATION (tweak these tka)
----------------------------*/
const radius = 200;
const sensitivity = 0.006;
const inertiaStrength = 1;
const friction = 0.82;
const snapStrength = 0.12;
const snapThreshold = 0.001;

/* ---------------------------
   UPDATE RENDER
----------------------------*/
function updateCarousel() {

    cards.forEach((card, index) => {

        let offset = index - position;

        // infinite wrap
        offset =
            ((offset + cards.length / 2) % cards.length + cards.length)
            % cards.length
            - cards.length / 2;

        const angle = (offset / cards.length) * Math.PI * 2;

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        // hide behind camera
        if (z < -120) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            return;
        }

        card.style.opacity = "1";
        card.style.pointerEvents = "auto";

        // depth scaling (Pokémon-style pop center)
        const depth = (z + radius) / (radius * 2);

        const scale = 0.55 + depth * 0.6;
        // the 0.6 below is the nagle of cards left & right gap , the -180 is the same
        const rotateY = -angle * (-180 / Math.PI) * 0.6;

        card.style.zIndex = Math.round(z);

        card.style.transform = `
            translate(-50%, -50%)
            translate3d(${x}px, 0px, ${z}px)
            rotateY(${rotateY}deg)
            scale(${scale})
        `;

        card.classList.remove("active");
    });

    const activeIndex =
        ((Math.round(position) % cards.length) + cards.length)
        % cards.length;

    cards[activeIndex].classList.add("active");
}

/* ---------------------------
   TOUCH INPUT
----------------------------*/
document.addEventListener("touchstart", (e) => {

    isDragging = true;

    lastX = e.touches[0].clientX;
    lastTime = performance.now();

    velocity = 0;
});

document.addEventListener("touchmove", (e) => {

    if (!isDragging) return;

    const x = e.touches[0].clientX;
    const now = performance.now();

    const dx = x - lastX;
    const dt = now - lastTime;

    if (dt > 0) {
        velocity = dx / dt;
    }

    position -= dx * sensitivity;

    updateCarousel();

    lastX = x;
    lastTime = now;
});

document.addEventListener("touchend", () => {

    isDragging = false;
});

/* ---------------------------
   ANIMATION LOOP (physics)
----------------------------*/
function animate() {

    if (!isDragging) {

        // inertia curve (non-linear feel)
        const inertia = velocity * inertiaStrength;

        position -= inertia;

        // exponential decay (feels like real momentum)
        velocity *= friction;

        // magnetic snap to nearest card
        const target = Math.round(position);
        const diff = target - position;

        position += diff * snapStrength;

        // stop micro jitter
        if (Math.abs(velocity) < snapThreshold && Math.abs(diff) < 0.01) {
            velocity = 0;
            position = target;
        }
    }

    updateCarousel();
    requestAnimationFrame(animate);
}

/* ---------------------------
   CLICK SELECT
----------------------------*/
cards.forEach((card, index) => {

    card.addEventListener("click", () => {

        const activeIndex =
            ((Math.round(position) % cards.length) + cards.length)
            % cards.length;

        if (index === activeIndex) {

            alert("Selected Pack " + (index + 1));

        } else {

            position = index;
            velocity = 0;

            updateCarousel();
        }
    });

});

updateCarousel();
animate();